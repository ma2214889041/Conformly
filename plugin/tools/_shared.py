"""Shared helpers for all conformly tools.

Kept intentionally small. Anything that grows beyond ~200 lines belongs
in its own module.
"""

from __future__ import annotations

import json
import logging
import os
import re
from datetime import datetime, date
from pathlib import Path
from typing import Any, Dict, List, Tuple

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Vault path resolution
# ---------------------------------------------------------------------------

def vault_path() -> Path:
    """Resolve the Conformly Vault root.

    Order: $CONFORMLY_VAULT > ~/conformly/vault > <plugin>/../conformly/vault.
    Does NOT verify existence — callers use require_vault() for that.
    """
    env = os.environ.get("CONFORMLY_VAULT")
    if env:
        return Path(env).expanduser().resolve()
    default = Path.home() / "conformly/vault"
    if default.exists():
        return default
    # dev fallback: sibling directory next to the plugin source
    return (Path(__file__).resolve().parent.parent.parent / "conformly/vault").resolve()


def require_vault() -> Path:
    p = vault_path()
    if not p.exists():
        raise FileNotFoundError(
            f"CONFORMLY_VAULT not found at {p}. "
            "Set the CONFORMLY_VAULT env var or create the directory."
        )
    return p


# ---------------------------------------------------------------------------
# JSON response builders — every handler returns one of these
# ---------------------------------------------------------------------------

def ok(data: Any, **extra) -> str:
    return json.dumps(
        {"success": True, "data": data, **extra},
        ensure_ascii=False,
        default=_json_default,
    )


def err(msg: str, **extra) -> str:
    logger.warning("conformly tool error: %s", msg)
    return json.dumps(
        {"success": False, "error": msg, **extra},
        ensure_ascii=False,
        default=_json_default,
    )


def _json_default(o: Any) -> Any:
    """Make date/datetime/Path JSON-serialisable without extra dependencies."""
    if isinstance(o, (date, datetime)):
        return o.isoformat()
    if isinstance(o, Path):
        return str(o)
    raise TypeError(f"Object of type {type(o).__name__} is not JSON serializable")


# ---------------------------------------------------------------------------
# Audit log — single source of truth for every tool invocation
# ---------------------------------------------------------------------------

_AUDIT_LOG = Path.home() / ".conformly" / "audit.log"


def audit_log(tool: str, args: Dict[str, Any], status: str, **extra) -> None:
    """Append a one-line audit record. NEVER raises."""
    try:
        _AUDIT_LOG.parent.mkdir(parents=True, exist_ok=True)
        rec = {
            "ts": datetime.utcnow().isoformat(timespec="seconds") + "Z",
            "tool": tool,
            "args": args,
            "status": status,
            **extra,
        }
        with _AUDIT_LOG.open("a", encoding="utf-8") as f:
            f.write(json.dumps(rec, ensure_ascii=False, default=_json_default) + "\n")
    except Exception as e:  # pragma: no cover — audit log must not crash tools
        logger.debug("audit_log write failed: %s", e)


# ---------------------------------------------------------------------------
# Markdown / YAML frontmatter parsing
# ---------------------------------------------------------------------------

_FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n?(.*)$", re.DOTALL)


def split_frontmatter(text: str) -> Tuple[Dict[str, Any], str]:
    """Return (frontmatter_dict, body_str). Empty dict if no frontmatter."""
    m = _FRONTMATTER_RE.match(text)
    if not m:
        return {}, text
    import yaml  # PyYAML — already a Hermes dependency
    fm = yaml.safe_load(m.group(1)) or {}
    if not isinstance(fm, dict):
        fm = {}
    return fm, m.group(2)


# ---------------------------------------------------------------------------
# Markdown body section extraction
# ---------------------------------------------------------------------------

_H2_RE = re.compile(r"^##\s+(.+?)\s*$", re.MULTILINE)


def extract_sections(body: str) -> Dict[str, str]:
    """Slice a markdown body into ``{section_title: section_body}``.

    Splits on ``## `` headings. Title is the raw heading text (stripped of
    leading numbering like ``1. `` so callers can match on the human label).
    Section body excludes the heading line itself and any leading blank lines.
    """
    matches = list(_H2_RE.finditer(body))
    sections: Dict[str, str] = {}
    for i, m in enumerate(matches):
        raw_title = m.group(1).strip()
        # Strip leading numbering like "1. " / "1.B) " / "4.D) "
        title = re.sub(r"^\d+(?:\.\d+)?(?:\.[A-Z])?\)?\s+", "", raw_title)
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(body)
        sections[title] = body[start:end].strip("\n")
    return sections


def find_section(sections: Dict[str, str], *needles: str) -> str:
    """Return the first section whose title contains any of *needles* (case-insensitive)."""
    for needle in needles:
        n = needle.lower()
        for title, body in sections.items():
            if n in title.lower():
                return body
    return ""


# ---------------------------------------------------------------------------
# Markdown table parsing
# ---------------------------------------------------------------------------

def parse_md_table(md: str) -> List[Dict[str, str]]:
    """Parse a GitHub-flavored markdown table into a list of row dicts.

    Returns ``[]`` if no table is found. Tolerates leading/trailing pipes,
    skips the header-separator row (``|---|---|``).
    """
    lines = [ln.strip() for ln in md.splitlines() if ln.strip().startswith("|")]
    if len(lines) < 2:
        return []
    headers = [c.strip() for c in lines[0].strip("|").split("|")]
    rows: List[Dict[str, str]] = []
    for ln in lines[2:]:  # skip header + separator
        cells = [c.strip() for c in ln.strip("|").split("|")]
        if len(cells) != len(headers):
            continue
        rows.append(dict(zip(headers, cells)))
    return rows


# ---------------------------------------------------------------------------
# Checkbox parsing for "next actions" sections
# ---------------------------------------------------------------------------

_CHECKBOX_RE = re.compile(r"^\s*-\s*\[(?P<mark>[ xX])\]\s*(?P<text>.+?)\s*$", re.MULTILINE)
_DATE_PREFIX_RE = re.compile(r"^(?P<date>\d{4}-\d{2}-\d{2})\s*[—\-:]\s*(?P<rest>.+)$")


def parse_checkboxes(md: str) -> List[Dict[str, Any]]:
    """Parse GitHub-style task list items.

    Each item ``- [ ] 2026-05-28 — Follow up CE Parere Unico`` becomes
    ``{done: False, due: "2026-05-28", text: "Follow up CE Parere Unico"}``.
    Missing date is acceptable: ``due`` becomes ``None``.
    """
    out: List[Dict[str, Any]] = []
    for m in _CHECKBOX_RE.finditer(md):
        done = m.group("mark").lower() == "x"
        text = m.group("text").strip()
        due = None
        dm = _DATE_PREFIX_RE.match(text)
        if dm:
            due = dm.group("date")
            text = dm.group("rest").strip()
        out.append({"done": done, "due": due, "text": text})
    return out


# ---------------------------------------------------------------------------
# Date arithmetic
# ---------------------------------------------------------------------------

def days_between(start: Any, end: Any = None) -> int | None:
    """Return calendar-day delta or None if either side can't be parsed.

    Accepts ``date`` / ``datetime`` / ISO string (``YYYY-MM-DD``).
    """
    s = _to_date(start)
    e = _to_date(end) if end is not None else date.today()
    if s is None or e is None:
        return None
    return (e - s).days


def _to_date(v: Any) -> date | None:
    if v is None:
        return None
    if isinstance(v, datetime):
        return v.date()
    if isinstance(v, date):
        return v
    if isinstance(v, str):
        try:
            return datetime.strptime(v.strip(), "%Y-%m-%d").date()
        except ValueError:
            return None
    return None
