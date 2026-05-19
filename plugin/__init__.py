"""Conformly plugin entrypoint.

Registers the conformly-* tools with Hermes. The plugin stays passive — no
hooks, no background workers — so it can be dropped into any Hermes install
without side-effects until the LLM actually invokes one of our tools.

Hermes loads this file under the synthetic module name
``hermes_plugins.conformly`` (see hermes_cli/plugins.py:_load_path_module),
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
    check_conformly_vault,
    handle_get_client_status,
)
from .tools.list_clients import (
    LIST_CLIENTS_SCHEMA,
    handle_list_clients,
)
from .tools.search_regulation import (
    SEARCH_REGULATION_SCHEMA,
    handle_search_regulation,
)


# (name, schema, handler, emoji) — extend as more tools come online.
_TOOLS = (
    ("conformly_get_client_status", GET_CLIENT_STATUS_SCHEMA, handle_get_client_status, "📋"),
    ("conformly_list_clients",      LIST_CLIENTS_SCHEMA,      handle_list_clients,      "👥"),
    ("conformly_search_regulation", SEARCH_REGULATION_SCHEMA, handle_search_regulation, "📚"),
)


def register(ctx) -> None:
    """Called once by Hermes when the conformly plugin is enabled."""
    for name, schema, handler, emoji in _TOOLS:
        ctx.register_tool(
            name=name,
            toolset="conformly",
            schema=schema,
            handler=handler,
            check_fn=check_conformly_vault,
            emoji=emoji,
            description=schema["description"][:200],
        )
    logger.info(
        "Conformly plugin registered %d tool(s); vault=%s",
        len(_TOOLS), vault_path(),
    )
