"""Conformly HTTP API — thin wrapper over the plugin tools.

A single FastAPI process exposes every Python tool as an endpoint, so the
Next.js front-end can call them directly. The handlers are the *same*
functions Hermes invokes — no duplicated business logic.

Design notes:
  * No DB. No queue. The tools are pure-ish functions; we just unwrap the
    JSON-string return into a real JSON body.
  * LLM-backed tools (parse_nb_letter, gspr_gap_analyzer) reach for
    Hermes' PluginLlm, which in turn uses whatever model the user has
    configured. Locally that's OpenAI Codex; on the VPS it's Gemini once
    GEMINI_API_KEY is set.
  * SSE streaming endpoint serves the front-end's "live agent feed"
    visualisation — emits the same events the tools log internally.

Run:
    cd conformly
    HERMES_HOME=~/.hermes \\
      CONFORMLY_VAULT=$(pwd)/vault \\
      ../hermes-agent/venv/bin/python -m uvicorn api.server:app --port 8080
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import sys
import time
from pathlib import Path
from typing import Any, Dict, Optional

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sse_starlette.sse import EventSourceResponse

logger = logging.getLogger("conformly.api")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

# ---------------------------------------------------------------------------
# Make the plugin importable. We treat <repo>/plugin as a package root so
# `from tools.xxx import ...` resolves the same way as in tests.
# ---------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parent.parent          # …/conformly
PLUGIN_DIR = ROOT / "plugin"

# Path order matters: Hermes-agent ships its own ``tools/`` package
# (terminal_tool, approval, etc.) via an editable install. If our
# plugin/tools/ isn't ahead of it in sys.path, ``from tools.X import …``
# resolves to the Hermes package and our tools become invisible.
# So put plugin/ at the *front* of sys.path and don't add HERMES_DIR at all
# — Hermes' own modules stay reachable via the editable install hook.
sys.path.insert(0, str(PLUGIN_DIR))

from tools.get_client_status import handle_get_client_status  # noqa: E402
from tools.list_clients import handle_list_clients            # noqa: E402
from tools.search_regulation import handle_search_regulation  # noqa: E402
from tools.parse_nb_letter import handle_parse_nb_letter      # noqa: E402
from tools.gspr_gap_analyzer import handle_gspr_gap_analyzer  # noqa: E402


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Conformly API",
    version="0.1.0",
    description=(
        "Direct HTTP access to the Conformly plugin tools. Same handlers, "
        "same JSON shapes, served live."
    ),
)

# CORS — the front-end dev server runs on a different port. Production
# runs same-origin behind nginx so this is just for local hacking.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Tool handler dispatch — central so adding tools is one tuple edit
# ---------------------------------------------------------------------------

_HANDLERS = {
    "get_client_status":  handle_get_client_status,
    "list_clients":       handle_list_clients,
    "search_regulation":  handle_search_regulation,
    "parse_nb_letter":    handle_parse_nb_letter,
    "gspr_gap_analyzer":  handle_gspr_gap_analyzer,
}


def _run_handler(name: str, args: Dict[str, Any]) -> Dict[str, Any]:
    """Invoke a handler and unwrap its JSON-string return into a Python dict."""
    fn = _HANDLERS.get(name)
    if fn is None:
        raise HTTPException(status_code=404, detail=f"unknown tool: {name}")
    raw = fn(args)
    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        # Should never happen — every tool returns valid JSON by contract.
        logger.exception("handler returned non-JSON")
        raise HTTPException(status_code=500, detail=f"handler returned non-JSON: {e}")


# ---------------------------------------------------------------------------
# Health & meta
# ---------------------------------------------------------------------------

@app.get("/api/health")
def health() -> Dict[str, Any]:
    vault = os.environ.get("CONFORMLY_VAULT", str(ROOT / "vault"))
    vault_exists = Path(vault).exists()
    return {
        "ok": True,
        "version": "0.1.0",
        "vault": vault,
        "vault_exists": vault_exists,
        "tools": list(_HANDLERS.keys()),
        "hermes_home": os.environ.get("HERMES_HOME", "(unset)"),
    }


@app.get("/api/tools")
def tools_index() -> Dict[str, Any]:
    """Return the schema of every tool — useful for OpenAPI / dev UIs."""
    from tools.get_client_status import GET_CLIENT_STATUS_SCHEMA
    from tools.list_clients import LIST_CLIENTS_SCHEMA
    from tools.search_regulation import SEARCH_REGULATION_SCHEMA
    from tools.parse_nb_letter import PARSE_NB_LETTER_SCHEMA
    from tools.gspr_gap_analyzer import GSPR_GAP_ANALYZER_SCHEMA

    return {
        "tools": [
            GET_CLIENT_STATUS_SCHEMA,
            LIST_CLIENTS_SCHEMA,
            SEARCH_REGULATION_SCHEMA,
            PARSE_NB_LETTER_SCHEMA,
            GSPR_GAP_ANALYZER_SCHEMA,
        ],
    }


# ---------------------------------------------------------------------------
# Tool endpoints — one per handler
# ---------------------------------------------------------------------------

@app.post("/api/tools/get_client_status")
async def t_get_client_status(payload: Dict[str, Any]) -> Dict[str, Any]:
    return _run_handler("get_client_status", payload)


@app.post("/api/tools/list_clients")
async def t_list_clients(payload: Dict[str, Any]) -> Dict[str, Any]:
    return _run_handler("list_clients", payload)


@app.post("/api/tools/search_regulation")
async def t_search_regulation(payload: Dict[str, Any]) -> Dict[str, Any]:
    return _run_handler("search_regulation", payload)


@app.post("/api/tools/parse_nb_letter")
async def t_parse_nb_letter(payload: Dict[str, Any]) -> Dict[str, Any]:
    # LLM-backed — can be slow. Run in a thread so the event loop stays
    # responsive to /api/health and /api/agent/live during a long call.
    return await asyncio.to_thread(_run_handler, "parse_nb_letter", payload)


@app.post("/api/tools/gspr_gap_analyzer")
async def t_gspr_gap_analyzer(payload: Dict[str, Any]) -> Dict[str, Any]:
    return await asyncio.to_thread(_run_handler, "gspr_gap_analyzer", payload)


# ---------------------------------------------------------------------------
# Streaming "run a tool" endpoint — emits SSE events so the UI can show
# thinking → tool_call → tool_result → assistant in real time
# ---------------------------------------------------------------------------

@app.get("/api/agent/run/{scenario_id}")
async def agent_run(scenario_id: str, request: Request):
    """Stream a multi-step agent turn for a named scenario.

    Drives the same plumbing as the front-end's scripted player, but each
    step is the live tool call. Useful for the "live mode" toggle in /demo.
    """
    if scenario_id not in _LIVE_SCENARIOS:
        raise HTTPException(status_code=404, detail=f"unknown scenario: {scenario_id}")

    plan = _LIVE_SCENARIOS[scenario_id]

    async def event_gen():
        for step in plan:
            if await request.is_disconnected():
                return
            kind = step["kind"]
            if kind in {"user", "thought", "assistant", "hitl"}:
                # Static narration — emit immediately
                yield {"event": "step", "data": json.dumps(step)}
                await asyncio.sleep(step.get("delay", 0.8))
                continue
            if kind == "tool_call":
                t0 = time.monotonic()
                yield {"event": "step", "data": json.dumps(step)}
                tool = step["tool"]
                args = step["args"]
                # Run the real handler in a thread
                try:
                    data = await asyncio.to_thread(_run_handler, tool, args)
                except Exception as e:
                    logger.exception("live tool call failed")
                    yield {
                        "event": "step",
                        "data": json.dumps({
                            "kind": "tool_result",
                            "tool": tool,
                            "data": {"success": False, "error": str(e)},
                            "durationMs": int((time.monotonic() - t0) * 1000),
                        }),
                    }
                    continue
                yield {
                    "event": "step",
                    "data": json.dumps({
                        "kind": "tool_result",
                        "tool": tool,
                        "data": data.get("data") if data.get("success") else data,
                        "durationMs": int((time.monotonic() - t0) * 1000),
                    }),
                }
            else:
                yield {"event": "step", "data": json.dumps(step)}
        yield {"event": "done", "data": "{}"}

    return EventSourceResponse(event_gen())


# Plans the streaming endpoint can run. Each step is either a static
# narration block OR a tool_call that *actually* fires the handler.
_LIVE_SCENARIOS: Dict[str, list[Dict[str, Any]]] = {
    "nb-letter": [
        {
            "kind": "user",
            "text": "Triage the BSI letter for CLIENT-A — raw/nb_letters/2026-04-30-BSI-CLIENT-A.md.",
            "delay": 0.6,
        },
        {
            "kind": "thought",
            "text": "I'll call conformly_parse_nb_letter on the letter file.",
            "delay": 0.6,
        },
        {
            "kind": "tool_call",
            "tool": "parse_nb_letter",
            "args": {
                "letter_path": "raw/nb_letters/2026-04-30-BSI-CLIENT-A.md",
                "client_id": "CLIENT-A",
            },
        },
        {
            "kind": "assistant",
            "text": "Triaged. Review the deficiencies above and approve the draft response below.",
            "delay": 0.6,
        },
        {
            "kind": "hitl",
            "prompt": "Send draft response to BSI Netherlands NB 2797?",
            "decision": "pending",
            "delay": 0,
        },
    ],
    "gspr-gap": [
        {
            "kind": "user",
            "text": "Run a GSPR gap analysis for CLIENT-A focused on software.",
            "delay": 0.6,
        },
        {
            "kind": "thought",
            "text": "Calling conformly_gspr_gap_analyzer with focus on GSPR-9 / -10 / -15.",
            "delay": 0.5,
        },
        {
            "kind": "tool_call",
            "tool": "gspr_gap_analyzer",
            "args": {
                "client_id": "CLIENT-A",
                "focus_clauses": ["GSPR-9", "GSPR-10", "GSPR-15"],
            },
        },
        {
            "kind": "assistant",
            "text": "GSPR analysis complete. Top risks listed above. Want me to draft a remediation plan?",
            "delay": 0.6,
        },
    ],
    "client-status": [
        {
            "kind": "user",
            "text": "Show me the whole portfolio sorted by risk.",
            "delay": 0.4,
        },
        {
            "kind": "tool_call",
            "tool": "list_clients",
            "args": {"status": "active", "sort_by": "risk"},
        },
        {
            "kind": "assistant",
            "text": "Portfolio sorted. Click any client_id above to drill into their file.",
            "delay": 0.5,
        },
    ],
}


# ---------------------------------------------------------------------------
# Convenience: load the BSI letter contents so the front-end can show it
# in a "drop the letter on the agent" affordance.
# ---------------------------------------------------------------------------

@app.get("/api/sample/nb-letter")
def sample_nb_letter() -> Dict[str, Any]:
    path = Path(os.environ.get("CONFORMLY_VAULT", str(ROOT / "vault"))) / "raw" / "nb_letters" / "2026-04-30-BSI-CLIENT-A.md"
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"sample not present at {path}")
    return {
        "path": str(path),
        "content": path.read_text(encoding="utf-8"),
    }


# ---------------------------------------------------------------------------
# Friendly default error shape
# ---------------------------------------------------------------------------

@app.exception_handler(HTTPException)
async def http_exc_handler(_: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": exc.detail},
    )
