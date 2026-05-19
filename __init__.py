"""Firsteck plugin entrypoint.

Registers the firsteck-* tools with Hermes. The plugin stays passive — no
hooks, no background workers — so it can be dropped into any Hermes install
without side-effects until the LLM actually invokes one of our tools.

Hermes loads this file under the synthetic module name
``hermes_plugins.firsteck`` (see hermes_cli/plugins.py:_load_path_module),
with ``submodule_search_locations`` pointing at this directory. That means
**relative imports work** for our ``tools/`` subpackage — see the
``from .tools.get_client_status import ...`` lines below.

Vault path resolution lives in ``tools/_shared.py``.
"""

from __future__ import annotations

import logging
from pathlib import Path

logger = logging.getLogger(__name__)

PLUGIN_DIR = Path(__file__).resolve().parent

from .tools._shared import vault_path  # re-exported for convenience
from .tools.get_client_status import (
    GET_CLIENT_STATUS_SCHEMA,
    check_firsteck_vault,
    handle_get_client_status,
)


# (name, schema, handler, emoji) — extend as more tools come online.
_TOOLS = (
    ("firsteck_get_client_status", GET_CLIENT_STATUS_SCHEMA, handle_get_client_status, "📋"),
)


def register(ctx) -> None:
    """Called once by Hermes when the firsteck plugin is enabled."""
    for name, schema, handler, emoji in _TOOLS:
        ctx.register_tool(
            name=name,
            toolset="firsteck",
            schema=schema,
            handler=handler,
            check_fn=check_firsteck_vault,
            emoji=emoji,
            description=schema["description"][:200],
        )
    logger.info(
        "Firsteck plugin registered %d tool(s); vault=%s",
        len(_TOOLS), vault_path(),
    )
