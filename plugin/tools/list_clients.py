"""conformly_list_clients — portfolio overview for the 20-client dashboard.

Returns one summary row per client file under $CONFORMLY_VAULT/clients/.
Each row is a slim projection of parse_client_dossier() — enough for a
dashboard card or a quick "where is everyone" sweep, without the full
risk and next-actions detail. Use conformly_get_client_status for that.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, Dict, List

from ._shared import audit_log, err, ok, require_vault, vault_path
from .get_client_status import parse_client_dossier

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Schema
# ---------------------------------------------------------------------------

LIST_CLIENTS_SCHEMA: Dict[str, Any] = {
    "name": "conformly_list_clients",
    "description": (
        "Return a one-line summary for every client tracked in the Conformly "
        "Vault. Each row reports client_id, codename, IVDR class, current "
        "CPS phase, Notified Body, day-in-journey, risk level, and the "
        "next-action due date. "
        "Use this for portfolio overviews ('show me all clients', 'who is "
        "in submission phase', 'which clients are high-risk'). "
        "For drilling into ONE client, use conformly_get_client_status."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "status": {
                "type": "string",
                "enum": ["all", "active", "archived"],
                "description": (
                    "Filter by lifecycle status in the client frontmatter. "
                    "'active' (default) keeps only ``status: active`` rows; "
                    "'archived' keeps everything else; 'all' returns every file."
                ),
                "default": "active",
            },
            "sort_by": {
                "type": "string",
                "enum": ["client_id", "day_in_journey", "risk", "phase", "next_due"],
                "description": (
                    "Sort key. 'risk' orders by risk_level (high → none); "
                    "'next_due' orders by next_action.due ascending (earliest first); "
                    "'phase' orders by the textual current_phase. Default 'client_id'."
                ),
                "default": "client_id",
            },
            "ivdr_class": {
                "type": "string",
                "enum": ["A", "B", "C", "D"],
                "description": (
                    "Optional: keep only clients of this IVDR class. Omit for all."
                ),
            },
        },
    },
}


# ---------------------------------------------------------------------------
# Runtime gate (shared with get_client_status; redefined for symmetry)
# ---------------------------------------------------------------------------

def check_conformly_vault() -> bool:
    try:
        return vault_path().exists()
    except Exception:
        return False


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

# Order for the 'risk' sort key — most urgent first.
_RISK_ORDER = {"high": 0, "medium": 1, "low": 2, "none": 3}

# Approximate temporal ordering of CPS phases for the 'phase' sort key.
# Strings that don't match fall to the end (rank = 999).
_PHASE_ORDER = [
    "Phase 0",
    "Phase 1",
    "Phase 2",
    "Phase 2.5",
    "Phase 3",
    "Phase 4",
    "Phase 5",
    "Phase 6",
]


def _summary_from(full: Dict[str, Any]) -> Dict[str, Any]:
    """Project the full dossier dict down to a dashboard-friendly row."""
    nxt = full.get("next_action") or {}
    return {
        "client_id": full.get("client_id"),
        "codename": full.get("codename"),
        "country": full.get("country"),
        "ivdr_class": full.get("ivdr_class"),
        "product_type": full.get("product_type"),
        "nb": full.get("nb"),
        "current_phase": full.get("current_phase"),
        "green_lights_passed": full.get("green_lights_passed", []),
        "day_in_journey": full.get("day_in_journey"),
        "days_since_contact": full.get("days_since_contact"),
        "risk_level": full.get("risk_level"),
        "risk_count": len(full.get("risks", [])),
        "next_action_text": nxt.get("text"),
        "next_action_due": nxt.get("due"),
        "status": full.get("status"),
        "file_path": full.get("file_path"),
    }


def _phase_rank(phase: Any) -> int:
    if not isinstance(phase, str):
        return 999
    for i, prefix in enumerate(_PHASE_ORDER):
        if phase.startswith(prefix):
            return i
    return 999


def _sort_key(sort_by: str):
    if sort_by == "day_in_journey":
        return lambda r: -(r.get("day_in_journey") or 0)  # longest first
    if sort_by == "risk":
        return lambda r: _RISK_ORDER.get(r.get("risk_level"), 99)
    if sort_by == "phase":
        return lambda r: (_phase_rank(r.get("current_phase")), r.get("client_id") or "")
    if sort_by == "next_due":
        # Missing due → push to end. ISO date strings sort naturally.
        return lambda r: (r.get("next_action_due") is None, r.get("next_action_due") or "")
    # Default: alphabetical by client_id
    return lambda r: r.get("client_id") or ""


def _status_match(row_status: Any, wanted: str) -> bool:
    if wanted == "all":
        return True
    rs = (row_status or "").lower()
    if wanted == "active":
        return rs == "active"
    # archived = anything that isn't active
    return rs != "active"


# ---------------------------------------------------------------------------
# Handler
# ---------------------------------------------------------------------------

def handle_list_clients(args: Dict[str, Any], **_kw) -> str:
    status_filter = args.get("status") or "active"
    if status_filter not in {"all", "active", "archived"}:
        return err(f"status must be one of all/active/archived (got {status_filter!r})")

    sort_by = args.get("sort_by") or "client_id"
    if sort_by not in {"client_id", "day_in_journey", "risk", "phase", "next_due"}:
        return err(f"sort_by must be one of client_id/day_in_journey/risk/phase/next_due (got {sort_by!r})")

    class_filter = args.get("ivdr_class")
    if class_filter is not None and class_filter not in {"A", "B", "C", "D"}:
        return err(f"ivdr_class must be A/B/C/D or omitted (got {class_filter!r})")

    try:
        vault = require_vault()
    except FileNotFoundError as e:
        return err(str(e))

    clients_dir = vault / "clients"
    if not clients_dir.is_dir():
        return err(f"vault/clients directory not found at {clients_dir}")

    rows: List[Dict[str, Any]] = []
    errors: List[Dict[str, str]] = []

    for md_path in sorted(clients_dir.glob("*.md")):
        try:
            full = parse_client_dossier(md_path, include_history=False)
        except Exception as e:  # logged once, don't crash the whole list
            logger.warning("skip %s: %s", md_path.name, e)
            errors.append({"file": md_path.name, "error": str(e)})
            continue
        rows.append(_summary_from(full))

    # Apply filters
    rows = [r for r in rows if _status_match(r.get("status"), status_filter)]
    if class_filter:
        rows = [r for r in rows if r.get("ivdr_class") == class_filter]

    rows.sort(key=_sort_key(sort_by))

    audit_log(
        tool="conformly_list_clients",
        args={"status": status_filter, "sort_by": sort_by, "ivdr_class": class_filter},
        status="ok",
        returned=len(rows),
    )
    return ok(rows, count=len(rows), errors=errors)
