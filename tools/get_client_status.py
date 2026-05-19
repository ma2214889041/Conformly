"""firsteck_get_client_status — IVDR status for a single client.

Reads $FIRSTECK_VAULT/clients/<client_id>.md, parses the YAML frontmatter
plus a small set of canonical body sections (risks, next actions), and
returns a structured dict the LLM can quote or further reason over.

This tool is read-only — no audit-log gate, no HITL.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, Dict, List

from ._shared import (
    audit_log,
    days_between,
    err,
    extract_sections,
    find_section,
    ok,
    parse_checkboxes,
    parse_md_table,
    require_vault,
    split_frontmatter,
    vault_path,
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Schema — what the LLM sees
# ---------------------------------------------------------------------------

GET_CLIENT_STATUS_SCHEMA: Dict[str, Any] = {
    "name": "firsteck_get_client_status",
    "description": (
        "Return the current IVDR submission status for a single Firsteck "
        "client. Reads the markdown dossier at "
        "$FIRSTECK_VAULT/clients/<client_id>.md, parses its YAML frontmatter "
        "and section headers, and returns a structured dict with the IVDR "
        "class, current CPS phase, Notified Body, days since project opened, "
        "open risks, and the immediate next deliverables. "
        "Use this when the user asks 'where is client X', 'what's blocking "
        "X', or wants the next action for one specific client. "
        "Do NOT use it for cross-client overviews — use firsteck_list_clients."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "client_id": {
                "type": "string",
                "description": (
                    "Client identifier matching the filename "
                    "$FIRSTECK_VAULT/clients/<client_id>.md (e.g. "
                    "'CLIENT-A' or 'client-a'). Case-insensitive."
                ),
            },
            "include_risk_history": {
                "type": "boolean",
                "description": (
                    "If true, include rows marked as resolved in the risk "
                    "table (mitigation column starts with [resolved]). "
                    "Default false."
                ),
                "default": False,
            },
        },
        "required": ["client_id"],
    },
}


# ---------------------------------------------------------------------------
# Runtime gate
# ---------------------------------------------------------------------------

def check_firsteck_vault() -> bool:
    """Hermes calls this every ~30s to decide whether to expose the tool.

    Keep it cheap and silent. Returning False filters the tool out of that
    turn's schema; returning True (or raising — caught upstream) keeps it.
    """
    try:
        return vault_path().exists()
    except Exception:
        return False


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

_RISK_HISTORY_PREFIX = "[resolved]"


def _resolve_client_file(vault: Path, client_id: str) -> Path | None:
    """Resolve a client identifier to its markdown file.

    Tries exact lowercase match first, then a case-insensitive scan so the
    LLM can pass either ``CLIENT-A`` or ``client-a``.
    """
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


def _filter_risks(rows: List[Dict[str, str]], include_history: bool) -> List[Dict[str, str]]:
    """Drop resolved rows unless caller asked for history."""
    if include_history:
        return rows
    out = []
    for r in rows:
        mitigation = (
            r.get("当前应对")
            or r.get("Mitigation")
            or r.get("当前应对 / Mitigation")
            or ""
        ).strip().lower()
        if mitigation.startswith(_RISK_HISTORY_PREFIX):
            continue
        out.append(r)
    return out


def _derive_risk_level(risk_rows: List[Dict[str, str]]) -> str:
    """Roll the risk table up to a single label.

    Looks at the severity column (Chinese 严重度 or English Severity). Any
    high/major row → 'high'. Any medium → 'medium'. Otherwise 'low' (or
    'none' when the table is empty).
    """
    if not risk_rows:
        return "none"
    severities = []
    for r in risk_rows:
        sev = (
            r.get("严重度")
            or r.get("Severity")
            or r.get("严重度 / Severity")
            or ""
        ).strip().lower()
        severities.append(sev)
    if any(s in {"高", "high", "major", "critical"} for s in severities):
        return "high"
    if any(s in {"中", "medium", "moderate"} for s in severities):
        return "medium"
    return "low"


def _next_action(actions: List[Dict[str, Any]]) -> Dict[str, Any] | None:
    """Pick the soonest-due open action, falling back to first open."""
    open_actions = [a for a in actions if not a["done"]]
    if not open_actions:
        return None
    with_due = [a for a in open_actions if a["due"]]
    if with_due:
        return min(with_due, key=lambda a: a["due"])
    return open_actions[0]


# ---------------------------------------------------------------------------
# Handler
# ---------------------------------------------------------------------------

def handle_get_client_status(args: Dict[str, Any], **_kw) -> str:
    """Read a client dossier and return its structured status.

    Contract:
      * Returns a JSON string. Never raises.
      * Read-only: no vault writes, no HITL prompt.
      * Idempotent.
    """
    raw_id = args.get("client_id")
    if not isinstance(raw_id, str) or not raw_id.strip():
        return err("client_id is required")
    client_id = raw_id.strip()
    include_history = bool(args.get("include_risk_history", False))

    try:
        vault = require_vault()
    except FileNotFoundError as e:
        return err(str(e))

    md_path = _resolve_client_file(vault, client_id)
    if md_path is None:
        candidates = sorted(
            p.stem for p in (vault / "clients").glob("*.md")
        ) if (vault / "clients").is_dir() else []
        return err(
            f"no client file matching {client_id!r}",
            candidates=candidates,
        )

    try:
        text = md_path.read_text(encoding="utf-8")
        fm, body = split_frontmatter(text)
    except OSError as e:
        logger.exception("read failed: %s", md_path)
        return err(f"failed to read client file: {e}", path=str(md_path))
    except Exception as e:
        logger.exception("frontmatter parse failed: %s", md_path)
        return err(f"failed to parse frontmatter: {e}", path=str(md_path))

    sections = extract_sections(body)

    # Risks — section title is in Chinese in the existing dossiers; also
    # accept English/Italian variants so future files don't need a code change.
    risks_md = find_section(sections, "已识别风险", "Risks", "Rischi")
    risks_table = parse_md_table(risks_md)
    risks = _filter_risks(risks_table, include_history)

    # Next actions — same multi-language tolerance.
    actions_md = find_section(sections, "下一步动作", "Next actions", "Next Actions", "Prossime azioni")
    next_actions = parse_checkboxes(actions_md)
    next_action = _next_action(next_actions)

    data: Dict[str, Any] = {
        # Identity
        "client_id": fm.get("client_id") or md_path.stem.upper(),
        "codename": fm.get("codename"),
        "country": fm.get("country"),
        "contact_lang": fm.get("contact_lang", []),
        "file_path": str(md_path),
        # Regulatory state
        "ivdr_class": fm.get("ivd_class"),
        "product_type": fm.get("product_type"),
        "indication": fm.get("indication"),
        "nb": fm.get("nb"),
        "current_phase": fm.get("current_phase"),
        "green_lights_passed": fm.get("green_lights_passed", []),
        # Timeline
        "opened": fm.get("opened"),
        "last_contact": fm.get("last_contact"),
        "day_in_journey": days_between(fm.get("opened")),
        "days_since_contact": days_between(fm.get("last_contact")),
        # Risk
        "risk_flags": fm.get("risk_flags", []),
        "risks": risks,
        "risk_level": _derive_risk_level(risks),
        # Forward-looking
        "next_actions": next_actions,
        "next_action": next_action,
        # Lifecycle
        "status": fm.get("status"),
    }

    audit_log(
        tool="firsteck_get_client_status",
        args={"client_id": client_id, "include_risk_history": include_history},
        status="ok",
        path=str(md_path),
    )
    return ok(data)
