# Firsteck Hermes Plugin

A Hermes Agent plugin that turns the agent into a medical-compliance co-pilot for Chinese IVD manufacturers entering the EU under IVDR (Regulation 2017/746).

## What's inside

```
firsteck-plugin/
├── plugin.yaml                # Hermes plugin manifest
├── __init__.py                # Vault path resolution
└── skills/
    ├── firsteck-cps-status/         # "Where is client X in CPS?"
    ├── firsteck-regulation-lookup/  # IVDR/MDCG/ISO/CLSI Q&A with citations
    ├── firsteck-client-onboarding/  # New client intake + IVDR classification
    └── firsteck-nb-letter-triage/   # NB deficiency letter triage + response draft
```

## Installation (after Hermes is installed)

```bash
# 1. Symlink this plugin into Hermes user-plugin dir
mkdir -p ~/.hermes/plugins
ln -s "$(pwd)/firsteck-plugin" ~/.hermes/plugins/firsteck

# 2. Point the plugin at the vault
export FIRSTECK_VAULT="$(pwd)/firsteck-vault"
echo 'export FIRSTECK_VAULT="'$(pwd)'/firsteck-vault"' >> ~/.zshrc

# 3. Verify
hermes doctor
hermes /firsteck-cps-status
```

## Vault contract

The plugin reads (and selectively writes to) `$FIRSTECK_VAULT/`:

| Path | Read | Write | Owner |
|------|------|-------|-------|
| `raw/regulations/` | ✅ | ❌ | Human |
| `raw/nb_letters/` | ✅ | ✅ (archive only) | Plugin + Human |
| `raw/clients/` | ✅ | ❌ | Human |
| `notes/regulations/` | ✅ | ✅ (curated Q&A) | Plugin |
| `notes/procedures/` | ✅ | ❌ | Human (canonical SOPs) |
| `clients/*.md` | ✅ | ✅ (frontmatter + sections) | Plugin + Human |
| `projects/<id>/` | ✅ | ✅ | Plugin + Human |
| `index/` | ✅ | ✅ | Plugin only |

## Design principles

1. **No autonomous outbound**. The plugin never auto-emails NBs, clients, or authorities. Drafts only.
2. **Cite or refuse**. Regulation answers must include source + section, or admit the gap.
3. **Codenames in vault**. Real PII stays in `raw/clients/` (gitignored if needed) — `clients/<id>.md` uses codenames.
4. **IVDR rule traceability**. Every classification records the Annex VIII rule applied.
5. **Audit-friendly**. All changes go through git; commit messages prefixed with skill name.

## Status

🚧 v0.1.0 — hackathon demo. Skills are spec'd in `SKILL.md` files but rely on Hermes' generic tools (read_file, write_file, terminal) to execute. No custom Python tools yet.
