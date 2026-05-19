#!/usr/bin/env bash
#
# Conformly one-shot provisioner for a fresh Ubuntu 24.04 Vultr instance.
#
# Usage (on your laptop):
#   ssh root@<vps-ip> 'bash -s' < deploy/install.sh
#
# What it does:
#   1. Hardens the box (UFW, unattended-upgrades, no root SSH password)
#   2. Installs system deps: git, python3.11, uv, node 20, nginx, certbot
#   3. Creates a `conformly` system user and clones the repo
#   4. Installs Hermes Agent + symlinks the Conformly plugin
#   5. Builds the Next.js front-end (if present) and writes systemd units
#   6. Configures nginx + Let's Encrypt for $DOMAIN
#   7. Starts and enables hermes-gateway + conformly-web
#
# Env vars expected (set them BEFORE you pipe this script):
#   DOMAIN=conformly.promp.com
#   ACME_EMAIL=info@firsteckbio.com
#   GEMINI_API_KEY=...           (optional — can be set later)
#   TELEGRAM_BOT_TOKEN=...       (optional — set later via hermes gateway setup)
#
# Idempotent: re-runs are safe. Will not overwrite ~/.hermes/config.yaml
# once written, and skips package installs that are already satisfied.

set -euo pipefail

# ---------------------------------------------------------------------------
# 0. Required inputs
# ---------------------------------------------------------------------------
: "${DOMAIN:?DOMAIN env var required (e.g. conformly.promp.com)}"
: "${ACME_EMAIL:?ACME_EMAIL env var required for LetsEncrypt registration}"
GEMINI_API_KEY="${GEMINI_API_KEY:-}"

REPO_URL="https://github.com/ma2214889041/Conformly.git"
APP_USER="conformly"
APP_HOME="/home/${APP_USER}"
APP_DIR="${APP_HOME}/conformly"
HERMES_DIR="${APP_HOME}/hermes-agent"

log() { printf "\033[1;36m→\033[0m %s\n" "$*"; }
ok()  { printf "\033[1;32m✓\033[0m %s\n" "$*"; }
warn(){ printf "\033[1;33m⚠\033[0m %s\n" "$*"; }

# ---------------------------------------------------------------------------
# 1. Base packages + firewall
# ---------------------------------------------------------------------------
log "Updating apt index"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
# Ubuntu 24.04 ships python3.12 by default; setup-hermes.sh uses `uv` which
# fetches its own Python 3.11 toolchain into ./venv, so we only need a base
# python3 for build scripts + the right headers for any C-extension wheels.
apt-get install -y -qq \
    git curl ca-certificates ufw \
    python3 python3-venv python3-dev \
    build-essential pkg-config libssl-dev \
    nginx certbot python3-certbot-nginx \
    unattended-upgrades \
    ripgrep ffmpeg

# Node 20 LTS from NodeSource
if ! command -v node >/dev/null 2>&1 || ! node --version | grep -q '^v20'; then
    log "Installing Node 20 LTS"
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y -qq nodejs
fi

# uv for Hermes' venv
if ! command -v uv >/dev/null 2>&1; then
    log "Installing uv"
    curl -fsSL https://astral.sh/uv/install.sh | sh
    cp ~/.local/bin/uv /usr/local/bin/uv
fi

# ---------------------------------------------------------------------------
# 2. Firewall — SSH + HTTP + HTTPS only
# ---------------------------------------------------------------------------
log "Configuring UFW"
ufw --force reset >/dev/null
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'ssh'
ufw allow 80/tcp comment 'http'
ufw allow 443/tcp comment 'https'
ufw --force enable

# Unattended security upgrades
log "Enabling unattended security upgrades"
dpkg-reconfigure -fnoninteractive unattended-upgrades

# ---------------------------------------------------------------------------
# 3. App user + repo
# ---------------------------------------------------------------------------
if ! id -u "$APP_USER" >/dev/null 2>&1; then
    log "Creating $APP_USER user"
    useradd -m -s /bin/bash "$APP_USER"
fi

if [[ ! -d "$APP_DIR" ]]; then
    log "Cloning Conformly"
    sudo -u "$APP_USER" git clone --depth 50 "$REPO_URL" "$APP_DIR"
else
    log "Pulling latest Conformly"
    sudo -u "$APP_USER" git -C "$APP_DIR" pull --ff-only
fi

if [[ ! -d "$HERMES_DIR" ]]; then
    log "Cloning Hermes Agent"
    sudo -u "$APP_USER" git clone --depth 50 https://github.com/NousResearch/hermes-agent.git "$HERMES_DIR"
fi

# ---------------------------------------------------------------------------
# 4. Hermes setup
# ---------------------------------------------------------------------------
log "Running Hermes setup as $APP_USER (non-interactive)"
sudo -u "$APP_USER" -H bash <<EOF
set -euo pipefail
cd "$HERMES_DIR"
# setup-hermes.sh is interactive — feed it 'no' twice (ripgrep prompt + wizard)
printf 'n\nn\n' | bash ./setup-hermes.sh
mkdir -p "\$HOME/.hermes/plugins" "\$HOME/.hermes/skills"
ln -sfn "$APP_DIR/plugin" "\$HOME/.hermes/plugins/conformly"
for s in conformly-cps-status conformly-regulation-lookup conformly-client-onboarding conformly-nb-letter-triage; do
    ln -sfn "$APP_DIR/plugin/skills/\$s" "\$HOME/.hermes/skills/\$s"
done
EOF

# ---------------------------------------------------------------------------
# 5. Environment file (read by both services)
# ---------------------------------------------------------------------------
ENV_FILE="${APP_HOME}/.hermes/.env"
if [[ ! -f "$ENV_FILE" ]]; then
    log "Writing $ENV_FILE"
    sudo -u "$APP_USER" -H mkdir -p "${APP_HOME}/.hermes"
    sudo -u "$APP_USER" -H bash -c "cat > '$ENV_FILE' <<EOF
CONFORMLY_VAULT=${APP_DIR}/vault
GEMINI_API_KEY=${GEMINI_API_KEY}
EOF"
    chmod 600 "$ENV_FILE"
else
    log "Preserving existing $ENV_FILE — edit it manually if needed"
fi

# Enable the plugin (idempotent — no-op if already enabled)
sudo -u "$APP_USER" -H bash -c \
    "set +e; CONFORMLY_VAULT=${APP_DIR}/vault ${HERMES_DIR}/venv/bin/hermes plugins enable conformly >/dev/null 2>&1 || true"

# ---------------------------------------------------------------------------
# 6. Next.js front-end build (skipped if web/ is empty)
# ---------------------------------------------------------------------------
WEB_DIR="${APP_DIR}/web"
WEB_HAS_APP=0
if [[ -f "${WEB_DIR}/package.json" ]]; then
    WEB_HAS_APP=1
    log "Building Next.js front-end"
    sudo -u "$APP_USER" -H bash <<EOF
set -euo pipefail
cd "$WEB_DIR"
npm ci --no-audit --no-fund
npm run build
EOF
else
    warn "No web/package.json found — skipping Next.js build (will install nginx-only)"
fi

# ---------------------------------------------------------------------------
# 7. systemd units
# ---------------------------------------------------------------------------
log "Writing systemd unit hermes-gateway.service"
cat > /etc/systemd/system/hermes-gateway.service <<EOF
[Unit]
Description=Conformly — Hermes Agent gateway (Telegram / Slack)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=${APP_USER}
WorkingDirectory=${HERMES_DIR}
EnvironmentFile=-${ENV_FILE}
Environment="HERMES_HOME=${APP_HOME}/.hermes"
Environment="CONFORMLY_VAULT=${APP_DIR}/vault"
ExecStart=${HERMES_DIR}/venv/bin/hermes gateway start
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

# Sandboxing
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=read-only
ReadWritePaths=${APP_HOME}/.hermes ${APP_HOME}/.conformly ${APP_DIR}/vault
PrivateTmp=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true

[Install]
WantedBy=multi-user.target
EOF

log "Writing systemd unit conformly-api.service"
cat > /etc/systemd/system/conformly-api.service <<EOF
[Unit]
Description=Conformly — FastAPI sidecar (tool endpoints + SSE)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=${APP_USER}
WorkingDirectory=${APP_DIR}
EnvironmentFile=-${ENV_FILE}
Environment="HERMES_HOME=${APP_HOME}/.hermes"
Environment="CONFORMLY_VAULT=${APP_DIR}/vault"
Environment="PYTHONPATH=${APP_DIR}/plugin"
ExecStart=${HERMES_DIR}/venv/bin/python -m uvicorn api.server:app --host 127.0.0.1 --port 8080 --workers 2
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=read-only
ReadWritePaths=${APP_HOME}/.hermes ${APP_HOME}/.conformly ${APP_DIR}/vault
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF

if [[ $WEB_HAS_APP -eq 1 ]]; then
    log "Writing systemd unit conformly-web.service"
    cat > /etc/systemd/system/conformly-web.service <<EOF
[Unit]
Description=Conformly — Next.js front-end
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=${APP_USER}
WorkingDirectory=${WEB_DIR}
EnvironmentFile=-${ENV_FILE}
Environment="NODE_ENV=production"
Environment="PORT=3000"
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10

NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=read-only
ReadWritePaths=${WEB_DIR}/.next
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF
fi

systemctl daemon-reload

# ---------------------------------------------------------------------------
# 8. nginx vhost
# ---------------------------------------------------------------------------
log "Writing nginx vhost for $DOMAIN"
cat > /etc/nginx/sites-available/conformly <<EOF
# HTTP → HTTPS redirect (certbot will swap this in after issuing the cert).
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    # Allow Let's Encrypt HTTP-01 challenge before HTTPS exists.
    location /.well-known/acme-challenge/ { root /var/www/html; }

    location / { return 301 https://\$host\$request_uri; }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN};

    # Placeholders — replaced by certbot --nginx
    ssl_certificate /etc/ssl/certs/ssl-cert-snakeoil.pem;
    ssl_certificate_key /etc/ssl/private/ssl-cert-snakeoil.key;

    # Security headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # SSE for the live agent feed — long-lived, no buffering.
    # MUST come before the generic /api/ block (more specific match wins).
    location ~ ^/api/agent/run/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Connection '';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 24h;
    }

    # FastAPI sidecar — all /api/* (except the SSE route above).
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 300;
    }

    # Reverse proxy → Next.js (catches everything else, including SPA routes).
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 90;
    }
}
EOF
ln -sfn /etc/nginx/sites-available/conformly /etc/nginx/sites-enabled/conformly
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx

# ---------------------------------------------------------------------------
# 9. Let's Encrypt
# ---------------------------------------------------------------------------
if [[ ! -d /etc/letsencrypt/live/$DOMAIN ]]; then
    log "Requesting Let's Encrypt cert for $DOMAIN"
    certbot --nginx --non-interactive --agree-tos \
        --email "$ACME_EMAIL" \
        --domains "$DOMAIN" \
        --redirect || warn "certbot failed — DNS may not yet point at this VPS. Re-run after pointing $DOMAIN at $(hostname -I | awk '{print $1}')"
else
    log "TLS cert for $DOMAIN already present"
fi

# ---------------------------------------------------------------------------
# 10. Start services
# ---------------------------------------------------------------------------
log "Enabling + starting systemd services"
systemctl enable --now conformly-api.service
# Hermes gateway is only useful once the user has configured Telegram/Slack
# and a model — leave it enabled but only start when ready.
systemctl enable hermes-gateway.service
if [[ $WEB_HAS_APP -eq 1 ]]; then
    systemctl enable --now conformly-web.service
fi

# Give the API a beat to come up before probing
sleep 2
if curl -sf http://127.0.0.1:8080/api/health >/dev/null; then
    ok "conformly-api responding on :8080"
else
    warn "conformly-api not responding — check 'journalctl -u conformly-api'"
fi

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
echo
ok "Conformly is installed on $(hostname -I | awk '{print $1}')"
echo
echo "Next steps:"
echo "  1. Point ${DOMAIN} at this VPS's public IP (A record)."
echo "  2. SSH back in and configure the agent's LLM:"
echo "       sudo -u ${APP_USER} -H ${HERMES_DIR}/venv/bin/hermes model"
echo "  3. Configure Telegram / Slack gateway:"
echo "       sudo -u ${APP_USER} -H ${HERMES_DIR}/venv/bin/hermes gateway setup"
echo "  4. Watch logs:"
echo "       journalctl -fu hermes-gateway"
[[ $WEB_HAS_APP -eq 1 ]] && echo "       journalctl -fu conformly-web"
echo "  5. Visit: https://${DOMAIN}"
