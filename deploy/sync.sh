#!/usr/bin/env bash
# Conformly · one-command sync: local → GitHub → Vultr → live.
#
# Usage:
#   deploy/sync.sh "commit message"
#
# What it does (idempotent — safe to run on a clean tree):
#   1. Show what changed locally.
#   2. Commit + push to GitHub.
#   3. SSH into the Vultr box, git pull, rebuild whatever needs rebuilding
#      (web/ npm build if web/ changed; restart services that touch the
#      changed files).
#   4. Smoke-test the production URLs.
#
# Designed so the answer to "is the live site running my latest commit?"
# is always yes after this script returns.
#
# Environment:
#   CONFORMLY_HOST     defaults to root@217.69.14.165
#   CONFORMLY_SSH_KEY  defaults to ~/.ssh/conformly_deploy
#   CONFORMLY_URL      defaults to https://conformly.gopromp.com

set -euo pipefail

HOST="${CONFORMLY_HOST:-root@217.69.14.165}"
KEY="${CONFORMLY_SSH_KEY:-$HOME/.ssh/conformly_deploy}"
URL="${CONFORMLY_URL:-https://conformly.gopromp.com}"
MSG="${1:-chore: sync}"

c() { printf '\033[1;36m%s\033[0m\n' "$*"; }
ok() { printf '\033[1;32m✓\033[0m %s\n' "$*"; }
err() { printf '\033[1;31m✗\033[0m %s\n' "$*" >&2; }

# Always work from the repo root, regardless of where the user called this.
cd "$(dirname "$0")/.."

# ---------------------------------------------------------------------------
# Step 1 — local commit + push
# ---------------------------------------------------------------------------
c "→ git status"
git status --short

if ! git diff --quiet || ! git diff --staged --quiet; then
    c "→ committing local changes"
    git add -A
    git -c user.email=info@conformly.dev -c user.name=Conformly commit -m "$MSG"
fi

# Anything not yet on origin?
if [[ -n "$(git log origin/main..HEAD 2>/dev/null)" ]]; then
    c "→ pushing to GitHub"
    git push origin main
    ok "pushed"
else
    ok "GitHub already up to date"
fi

LOCAL_SHA=$(git rev-parse --short HEAD)

# ---------------------------------------------------------------------------
# Step 2 — figure out what changed since last deploy
# ---------------------------------------------------------------------------
c "→ checking what's on the box"
REMOTE_SHA=$(ssh -i "$KEY" "$HOST" 'sudo -u conformly bash -c "cd /home/conformly/conformly && git rev-parse --short HEAD"')

if [[ "$LOCAL_SHA" == "$REMOTE_SHA" ]]; then
    ok "remote already at $REMOTE_SHA — nothing to deploy"
    exit 0
fi

# What paths changed between remote SHA and local SHA?
CHANGED=$(git diff --name-only "$REMOTE_SHA" "$LOCAL_SHA" 2>/dev/null || echo "")
WEB_CHANGED=0
API_CHANGED=0
PLUGIN_CHANGED=0
VAULT_CHANGED=0
DEPLOY_CHANGED=0
echo "$CHANGED" | grep -q '^web/' && WEB_CHANGED=1 || true
echo "$CHANGED" | grep -q '^api/' && API_CHANGED=1 || true
echo "$CHANGED" | grep -q '^plugin/' && PLUGIN_CHANGED=1 || true
echo "$CHANGED" | grep -q '^vault/' && VAULT_CHANGED=1 || true
echo "$CHANGED" | grep -q '^deploy/' && DEPLOY_CHANGED=1 || true

c "→ diff $REMOTE_SHA..$LOCAL_SHA — paths changed:"
echo "$CHANGED" | sed 's/^/    /'
echo "    web=$WEB_CHANGED api=$API_CHANGED plugin=$PLUGIN_CHANGED vault=$VAULT_CHANGED deploy=$DEPLOY_CHANGED"

# ---------------------------------------------------------------------------
# Step 3 — apply on the box
# ---------------------------------------------------------------------------
ssh -i "$KEY" "$HOST" bash -s <<REMOTE
set -euo pipefail

c() { printf '\033[1;36m%s\033[0m\n' "\$*"; }
ok() { printf '\033[1;32m✓\033[0m %s\n' "\$*"; }

c "→ pulling on the box"
sudo -u conformly bash -c "cd /home/conformly/conformly && git fetch --quiet && git reset --hard origin/main"
ok "now at \$(sudo -u conformly bash -c 'cd /home/conformly/conformly && git rev-parse --short HEAD')"

WEB_CHANGED=$WEB_CHANGED
API_CHANGED=$API_CHANGED
PLUGIN_CHANGED=$PLUGIN_CHANGED
VAULT_CHANGED=$VAULT_CHANGED
DEPLOY_CHANGED=$DEPLOY_CHANGED

if [[ \$WEB_CHANGED -eq 1 ]]; then
    c "→ rebuilding Next.js"
    sudo -u conformly bash -c "cd /home/conformly/conformly/web && npm ci --no-audit --no-fund 2>&1 | tail -3 && npm run build 2>&1 | tail -6"
    systemctl restart conformly-web
    ok "conformly-web restarted"
fi

if [[ \$API_CHANGED -eq 1 || \$PLUGIN_CHANGED -eq 1 ]]; then
    systemctl restart conformly-api
    ok "conformly-api restarted (api=\$API_CHANGED plugin=\$PLUGIN_CHANGED)"
fi

if [[ \$DEPLOY_CHANGED -eq 1 ]]; then
    printf '\033[1;33m⚠\033[0m  deploy/ changed — install.sh / nginx config / systemd units may need manual reapply.\n'
fi

# Vault-only changes need nothing — handlers read files at call time.
if [[ \$VAULT_CHANGED -eq 1 && \$WEB_CHANGED -eq 0 ]]; then
    # …unless Next.js read the vault at build time. The dashboard / client
    # pages are SSG, so they DO bake vault content. Rebuild the web tier.
    c "→ vault changed but web/ didn't — rebuilding web anyway so SSG picks up new data"
    sudo -u conformly bash -c "cd /home/conformly/conformly/web && npm run build 2>&1 | tail -3"
    systemctl restart conformly-web
    ok "conformly-web rebuilt for new vault content"
fi

systemctl is-active conformly-api conformly-web nginx
REMOTE

# ---------------------------------------------------------------------------
# Step 4 — smoke test
# ---------------------------------------------------------------------------
c "→ smoke testing $URL"
HEALTH=$(curl -sf "$URL/api/health" || echo "FAIL")
if [[ "$HEALTH" == "FAIL" ]]; then
    err "API health check failed"
    exit 1
fi
ok "$URL/api/health responding"
echo "    $HEALTH" | python3 -m json.tool 2>/dev/null | head -8

for path in / /dashboard /documents /analysis /reports /nb-simulation /chat /knowledge; do
    line=$(curl -sfI "$URL$path" | head -1 || echo "")
    if [[ "$line" == *"200"* ]]; then
        ok "$path $line"
    else
        err "$path broken: ${line:-(no response)}"
    fi
done

echo
ok "deploy complete · local $LOCAL_SHA = remote $LOCAL_SHA = live"
echo "    $URL"
