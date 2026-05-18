"""Firsteck plugin entrypoint.

Registers Firsteck Vault location and exposes skills via Hermes' standard
skill-discovery path. The plugin deliberately stays passive — no hooks, no
background workers — so it can be dropped into any Hermes install without
side-effects until the user invokes a /firsteck-* skill.

Vault resolution order:
  1. $FIRSTECK_VAULT env var
  2. ~/firsteck-vault (default)
  3. <plugin_dir>/../firsteck-vault (dev fallback)
"""

from __future__ import annotations

import logging
import os
from pathlib import Path

logger = logging.getLogger(__name__)

PLUGIN_DIR = Path(__file__).resolve().parent


def resolve_vault_path() -> Path:
    env = os.environ.get("FIRSTECK_VAULT")
    if env:
        return Path(env).expanduser()
    default = Path.home() / "firsteck-vault"
    if default.exists():
        return default
    dev_fallback = PLUGIN_DIR.parent / "firsteck-vault"
    return dev_fallback


VAULT_PATH = resolve_vault_path()

logger.info("Firsteck plugin loaded. Vault: %s (exists=%s)", VAULT_PATH, VAULT_PATH.exists())
