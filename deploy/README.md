# Conformly — Vultr deployment

Single-VPS deployment of Conformly: Hermes Agent gateway + Next.js front-end + nginx + Let's Encrypt, all on one box.

---

## 0. What you need before you start

- A Vultr account
- The domain you want to use (e.g. `conformly.promp.com`) on a registrar where you can edit DNS
- Your laptop's SSH public key (we use key-only auth)
- *(optional, can be added later)* Gemini API key, Telegram bot token

---

## 1. Provision the VPS

In Vultr **Quick Deploy → Compute → Instances**:

| Setting | Choose |
|---------|--------|
| Plan | Cloud Compute (Regular) or High Frequency |
| Region | **Frankfurt** or **Amsterdam** (lowest EU latency) |
| OS | **Ubuntu 24.04 LTS x64** |
| Size | **$12/mo** — 1 vCPU / 2 GB RAM / 55 GB SSD (enough for demo) |
| Auto Backups | Enable (+$2.40/mo) |
| IPv6 | Enable |
| SSH Keys | Add your laptop's public key |
| Firewall Group | Create a new one allowing 22 / 80 / 443 only |
| Hostname | `conformly-prod-01` |

Click **Deploy**. Wait ~60 s until status = Running. Note the public IP.

---

## 2. Point your domain at the VPS

In your DNS provider, add:

```
A  conformly  <vps-public-ip>   TTL 300
```

(Replace `conformly` with the subdomain you want — e.g. `conformly` for `conformly.promp.com`, or `@` for the apex.)

Wait until `dig +short conformly.promp.com` returns the VPS IP. Usually 1–5 minutes.

---

## 3. One-shot install

From your laptop:

```bash
export DOMAIN=conformly.promp.com
export ACME_EMAIL=you@example.com
export GEMINI_API_KEY=AIza...            # optional, can add later
ssh root@<vps-ip> 'bash -s' < deploy/install.sh
```

The script (~5 minutes):

1. Updates the system, installs Python 3.11, Node 20, nginx, certbot, uv, ripgrep, ffmpeg
2. Sets up UFW (ports 22 / 80 / 443) + unattended security upgrades
3. Creates a `conformly` system user
4. Clones this repo + the Hermes Agent repo
5. Runs `setup-hermes.sh` non-interactively (skips ripgrep + wizard prompts)
6. Symlinks the Conformly plugin and skills into `~/.hermes/plugins/` and `~/.hermes/skills/`
7. Writes `~/.hermes/.env` with `CONFORMLY_VAULT` + `GEMINI_API_KEY`
8. Builds the Next.js front-end **if** `web/package.json` exists (skipped otherwise — comes online Day 4)
9. Writes two systemd units:
   - `hermes-gateway.service` — the 24/7 Telegram / Slack bot
   - `conformly-web.service` — the Next.js front-end (only if web/ has an app)
10. Configures nginx to reverse-proxy `https://$DOMAIN` → `127.0.0.1:3000`
11. Requests a Let's Encrypt cert via certbot
12. Enables + starts both services

When it finishes you'll see the next-step list with the VPS IP.

---

## 4. Finish setup (interactive, only on first install)

```bash
ssh root@<vps-ip>

# 4a. Pick the LLM provider/model
sudo -u conformly -H /home/conformly/hermes-agent/venv/bin/hermes model

# 4b. Wire Telegram / Slack
sudo -u conformly -H /home/conformly/hermes-agent/venv/bin/hermes gateway setup

# 4c. Restart the gateway so it picks up the new config
systemctl restart hermes-gateway
```

---

## 5. Day-to-day operations

| Need to… | Run |
|----------|-----|
| Pull latest code + restart | `cd /home/conformly/conformly && sudo -u conformly git pull && systemctl restart hermes-gateway conformly-web` |
| Watch agent logs | `journalctl -fu hermes-gateway` |
| Watch web logs | `journalctl -fu conformly-web` |
| Read audit trail | `sudo -u conformly tail -f /home/conformly/.conformly/audit.log` |
| Renew TLS cert (auto) | certbot installs its own timer — `systemctl list-timers \| grep certbot` to verify |
| Backup vault | already part of the repo; `git push` from the VPS to a private remote, or rely on Vultr's auto-backup |

---

## 6. Cost

- Instance: **$12/mo** ($14.40 with backups)
- Bandwidth: 2 TB/mo included (we'll use << 1 GB)
- LLM: pay-per-call to Gemini / OpenAI (NOT through Vultr)
- Domain: separate (~$10/yr at most registrars)

**~$15/mo total** for the box; LLM cost depends on demo traffic.

---

## 7. Hardening (post-demo)

- Disable root SSH (`PermitRootLogin no` in `/etc/ssh/sshd_config`)
- Install `fail2ban`
- Move audit.log + vault writes to a Block Storage volume so the instance is replaceable
- Add a second VPS as a Hermes worker behind a Load Balancer if traffic justifies it
- Switch Hermes Gateway to multi-platform (Slack approval channel is the demo-killer feature)

These are NOT required for hackathon demo. The single-VPS setup above is the right shape until you have real production traffic.

---

## 8. Troubleshooting

**`certbot` failed during install.** Your DNS hasn't propagated yet. Re-run only the cert step:
```bash
certbot --nginx -d conformly.promp.com --email you@example.com --agree-tos --redirect
```

**`hermes-gateway` keeps restarting.** Most likely missing LLM config or missing Telegram token. Inspect:
```bash
journalctl -u hermes-gateway --since "5 min ago"
```

**Plugin not loading.** Check the symlink:
```bash
sudo -u conformly ls -la /home/conformly/.hermes/plugins/conformly
sudo -u conformly /home/conformly/hermes-agent/venv/bin/hermes plugins list | grep conformly
```

**Out of memory during Next.js build.** The 1 GB plan can be tight for `npm run build`. Either:
- Upgrade to 2 GB plan (recompile only)
- Or `pre-build locally` and `scp` the `.next/` dir to the VPS
