"""conformly_gspr_gap_analyzer — score a client against IVDR Annex I GSPR.

This is the deepest tool in the v0 suite. From the LLM's perspective it's
ONE tool call; under the hood it:

  1. Loads the client dossier (clients/<id>.md) via parse_client_dossier.
  2. Loads the GSPR checklist (notes/regulations/gspr-checklist.md).
  3. Optionally reads any client-specific tech-file fragments under
     clients/<id>/tech_files/*.md and includes them in the prompt.
  4. Builds a single LLM prompt with the GSPR clauses + the client's
     evidence, asks for a structured gap analysis, and post-processes.
  5. Returns a JSON gap report the dashboard can render.

The LLM call goes through Hermes' PluginLlm so the user's active provider
is used. Gemini 2.5 Pro is the recommended provider (long context = it
can hold the entire GSPR checklist + the whole client dossier + tech file
in one shot without RAG).
"""

from __future__ import annotations

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional

from ._shared import audit_log, err, ok, require_vault, vault_path
from .get_client_status import parse_client_dossier

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Schema (LLM tool-call signature)
# ---------------------------------------------------------------------------

GSPR_GAP_ANALYZER_SCHEMA: Dict[str, Any] = {
    "name": "conformly_gspr_gap_analyzer",
    "description": (
        "Compare a client's technical evidence against the IVDR Annex I "
        "General Safety and Performance Requirements (GSPR) checklist and "
        "return a structured gap report: which clauses are addressed, "
        "which are partial, which are open, and the recommended next "
        "action for each gap. "
        "This is the single-call deep analysis behind the demo's 'GSPR "
        "depth' moment. The tool reads the client dossier and any tech-"
        "file fragments under clients/<id>/tech_files/, plus the curated "
        "GSPR checklist at notes/regulations/gspr-checklist.md."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "client_id": {
                "type": "string",
                "description": (
                    "Client identifier matching clients/<client_id>.md "
                    "(case-insensitive)."
                ),
            },
            "focus_clauses": {
                "type": "array",
                "items": {"type": "string"},
                "description": (
                    "Optional list of GSPR clause IDs to focus on, e.g., "
                    "['GSPR-9', 'GSPR-10', 'GSPR-15']. Omit to evaluate "
                    "every clause in the checklist."
                ),
            },
        },
        "required": ["client_id"],
    },
}


# ---------------------------------------------------------------------------
# Output JSON schema (what we ask the LLM to return)
# ---------------------------------------------------------------------------

GSPR_GAP_OUTPUT_SCHEMA: Dict[str, Any] = {
    "type": "object",
    "properties": {
        "items": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "clause_id": {
                        "type": "string",
                        "description": "GSPR identifier (e.g., 'GSPR-9').",
                    },
                    "clause_title": {
                        "type": "string",
                        "description": "Short clause title (e.g., 'Analytical performance').",
                    },
                    "status": {
                        "type": "string",
                        "enum": ["addressed", "partial", "open", "n/a"],
                    },
                    "evidence": {
                        "type": "string",
                        "description": (
                            "Specific evidence found in the client dossier or tech file "
                            "supporting an addressed/partial status. Empty when open or n/a."
                        ),
                    },
                    "gap": {
                        "type": "string",
                        "description": (
                            "What's missing for the clause to move to 'addressed'. "
                            "Empty when status is 'addressed' or 'n/a'."
                        ),
                    },
                    "recommended_action": {
                        "type": "string",
                        "description": (
                            "Concrete next step the project manager should take. "
                            "Reference the documents to be produced (e.g., 'Run a "
                            "CLSI EP05-A3 precision study'). Empty when no action needed."
                        ),
                    },
                    "priority": {
                        "type": "string",
                        "enum": ["high", "medium", "low"],
                        "description": "Operational priority for closing the gap.",
                    },
                },
                "required": ["clause_id", "status"],
            },
        },
        "headline": {
            "type": "string",
            "description": "One-sentence executive summary of the overall posture.",
        },
        "top_risks": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Top 3–5 clause_ids that are blocking or high-risk.",
        },
    },
    "required": ["items"],
}


# ---------------------------------------------------------------------------
# Runtime gate
# ---------------------------------------------------------------------------

def check_conformly_vault() -> bool:
    try:
        return vault_path().exists()
    except Exception:
        return False


# ---------------------------------------------------------------------------
# LLM facade (DI hook for tests)
# ---------------------------------------------------------------------------

GspGapLlmCaller = Callable[[Dict[str, Any], str, Optional[List[str]]], Dict[str, Any]]


def _real_llm_caller(
    client_data: Dict[str, Any],
    gspr_text: str,
    focus_clauses: Optional[List[str]],
) -> Dict[str, Any]:
    """Default LLM-backed gap analysis via Hermes PluginLlm."""
    from agent.plugin_llm import PluginLlm

    llm = PluginLlm(plugin_id="conformly")

    focus_note = (
        f"\nThe project manager has asked you to focus on these clauses: "
        f"{', '.join(focus_clauses)}. Score the others as 'n/a'."
        if focus_clauses else ""
    )

    instructions = (
        "You are a senior regulatory-affairs reviewer assessing a Chinese IVD "
        "manufacturer's technical evidence against the EU IVDR Annex I General "
        "Safety and Performance Requirements (GSPR).\n\n"
        "You will be given:\n"
        "  (A) the curated GSPR checklist — these are the clauses to evaluate;\n"
        "  (B) the client's dossier (frontmatter + risks + open actions).\n\n"
        "Rules:\n"
        "1. For every GSPR clause in the checklist, return exactly one item in "
        "   the output 'items' array. Do NOT invent clauses that aren't in the "
        "   checklist.\n"
        "2. status='addressed' only when the dossier names concrete evidence "
        "   (a study report, a document, a controlled procedure). Otherwise "
        "   'partial' (some hint but not full evidence) or 'open' (silent).\n"
        "3. status='n/a' is reserved for clauses that genuinely don't apply "
        "   to the device class or design (e.g., GSPR-11 self-test for a lab-"
        "   only assay).\n"
        "4. Quote the evidence verbatim where possible (≤30 words per quote).\n"
        "5. For open / partial items, the recommended_action must reference a "
        "   specific deliverable or standard (e.g., 'CLSI EP05-A3', 'IEC 62304 "
        "   software DHF').\n"
        "6. priority=high for blockers in the current CPS phase; medium for "
        "   downstream prerequisites; low for cosmetic / late-stage gaps.\n"
        "7. headline: one sentence, plain language. top_risks: list 3–5 "
        "   clause_ids worth raising at the next sponsor meeting.\n"
        "8. Output ONLY JSON conforming to the supplied schema." + focus_note
    )

    user_msg = (
        "=== (A) GSPR CHECKLIST ===\n"
        f"{gspr_text}\n\n"
        "=== (B) CLIENT DOSSIER (selected fields) ===\n"
        f"{json.dumps(client_data, ensure_ascii=False, indent=2, default=str)}"
    )

    result = llm.complete_structured(
        instructions=instructions,
        input=[{"type": "text", "text": user_msg}],
        json_schema=GSPR_GAP_OUTPUT_SCHEMA,
        schema_name="ConformlyGsprGap",
        purpose="conformly.gspr_gap_analyzer",
        temperature=0.0,
        max_tokens=8000,
        timeout=180.0,
    )

    parsed = getattr(result, "parsed", None)
    if parsed is None:
        text = getattr(result, "text", "") or ""
        try:
            parsed = json.loads(text)
        except json.JSONDecodeError as e:
            raise RuntimeError(f"LLM returned non-JSON: {e}; text={text[:300]!r}")
    if not isinstance(parsed, dict):
        raise RuntimeError(f"LLM returned non-object: {type(parsed).__name__}")
    return parsed


# Tests monkeypatch this symbol.
_llm_caller: GspGapLlmCaller = _real_llm_caller


# ---------------------------------------------------------------------------
# Vault data assembly
# ---------------------------------------------------------------------------

_GSPR_CHECKLIST_RELPATH = "notes/regulations/gspr-checklist.md"


def _load_gspr_text(vault: Path) -> str:
    p = vault / _GSPR_CHECKLIST_RELPATH
    if not p.exists():
        raise FileNotFoundError(
            f"GSPR checklist missing at {p}. Conformly ships one at "
            "vault/notes/regulations/gspr-checklist.md."
        )
    return p.read_text(encoding="utf-8")


def _resolve_client_md(vault: Path, client_id: str) -> Path | None:
    clients_dir = vault / "clients"
    if not clients_dir.is_dir():
        return None
    exact = clients_dir / f"{client_id.lower()}.md"
    if exact.exists():
        return exact
    for p in clients_dir.glob("*.md"):
        if p.stem.lower() == client_id.lower():
            return p
    return None


def _load_tech_fragments(vault: Path, client_id: str) -> List[Dict[str, str]]:
    """Optional supplemental tech-file fragments under clients/<id>/tech_files/."""
    tech_dir = vault / "clients" / client_id.lower() / "tech_files"
    if not tech_dir.is_dir():
        return []
    frags: List[Dict[str, str]] = []
    for p in sorted(tech_dir.glob("*.md")):
        try:
            frags.append({"path": str(p.relative_to(vault)), "content": p.read_text(encoding="utf-8")})
        except OSError as e:
            logger.warning("skip tech fragment %s: %s", p, e)
    return frags


# ---------------------------------------------------------------------------
# Post-processing
# ---------------------------------------------------------------------------

_VALID_STATUSES = {"addressed", "partial", "open", "n/a"}
_VALID_PRIORITIES = {"high", "medium", "low"}


def _normalise(parsed: Dict[str, Any]) -> Dict[str, Any]:
    items_raw = parsed.get("items") or []
    if not isinstance(items_raw, list):
        items_raw = []
    items: List[Dict[str, Any]] = []
    for d in items_raw:
        if not isinstance(d, dict):
            continue
        status = str(d.get("status") or "").strip().lower()
        if status not in _VALID_STATUSES:
            status = "open"
        priority = str(d.get("priority") or "").strip().lower()
        if priority not in _VALID_PRIORITIES:
            priority = "medium"
        items.append(
            {
                "clause_id": str(d.get("clause_id") or ""),
                "clause_title": str(d.get("clause_title") or ""),
                "status": status,
                "evidence": str(d.get("evidence") or ""),
                "gap": str(d.get("gap") or ""),
                "recommended_action": str(d.get("recommended_action") or ""),
                "priority": priority,
            }
        )

    summary = {"addressed": 0, "partial": 0, "open": 0, "n_a": 0, "total": 0}
    for it in items:
        key = it["status"].replace("/", "_")  # "n/a" → "n_a"
        summary[key] = summary.get(key, 0) + 1
        summary["total"] += 1

    return {
        "items": items,
        "summary": summary,
        "headline": str(parsed.get("headline") or ""),
        "top_risks": [str(x) for x in (parsed.get("top_risks") or []) if x],
    }


# ---------------------------------------------------------------------------
# Handler
# ---------------------------------------------------------------------------

def handle_gspr_gap_analyzer(args: Dict[str, Any], **_kw) -> str:
    raw_id = args.get("client_id")
    if not isinstance(raw_id, str) or not raw_id.strip():
        return err("client_id is required")
    client_id = raw_id.strip()

    focus_raw = args.get("focus_clauses")
    if focus_raw is not None:
        if not isinstance(focus_raw, list) or not all(isinstance(x, str) for x in focus_raw):
            return err("focus_clauses must be an array of strings if provided")
        focus_clauses: Optional[List[str]] = [c.strip() for c in focus_raw if c.strip()]
    else:
        focus_clauses = None

    try:
        vault = require_vault()
    except FileNotFoundError as e:
        return err(str(e))

    client_md = _resolve_client_md(vault, client_id)
    if client_md is None:
        candidates = sorted(p.stem for p in (vault / "clients").glob("*.md")) \
            if (vault / "clients").is_dir() else []
        return err(f"no client file matching {client_id!r}", candidates=candidates)

    try:
        client_data = parse_client_dossier(client_md, include_history=False)
    except Exception as e:
        logger.exception("client parse failed")
        return err(f"failed to parse client dossier: {e}", path=str(client_md))

    try:
        gspr_text = _load_gspr_text(vault)
    except FileNotFoundError as e:
        return err(str(e))

    tech_frags = _load_tech_fragments(vault, client_data.get("client_id") or client_id)
    if tech_frags:
        client_data = {**client_data, "tech_fragments": tech_frags}

    try:
        parsed = _llm_caller(client_data, gspr_text, focus_clauses)
    except Exception as e:
        logger.exception("LLM gap analysis failed")
        audit_log(
            tool="conformly_gspr_gap_analyzer",
            args={"client_id": client_id, "focus_clauses": focus_clauses},
            status="llm_error",
            error=str(e),
        )
        return err(f"LLM gap analysis failed: {e}")

    report = _normalise(parsed)
    report.update(
        {
            "client_id": client_data.get("client_id") or client_id,
            "ivdr_class": client_data.get("ivdr_class"),
            "current_phase": client_data.get("current_phase"),
            "analysed_at": datetime.utcnow().isoformat(timespec="seconds") + "Z",
            "source_client_file": str(client_md),
            "tech_fragments_count": len(tech_frags),
            "focus_clauses": focus_clauses or [],
        }
    )

    audit_log(
        tool="conformly_gspr_gap_analyzer",
        args={"client_id": client_id, "focus_clauses": focus_clauses},
        status="ok",
        items=report["summary"]["total"],
        open=report["summary"]["open"],
    )
    return ok(report)
