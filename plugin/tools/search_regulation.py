"""conformly_search_regulation — regulation catalog for LLM-driven retrieval.

LLM-Wiki design (Karpathy 2026-04): instead of running our own embeddings
or vector search, we expose the regulation library as a structured
catalog. The calling agent reads the catalog, decides which files are
worth reading in full, then uses Hermes' built-in ``read_file`` to pull
them into its own long-context window. The "search" is the agent's job;
our job is the index.

This tool scans:
  - $CONFORMLY_VAULT/raw/regulations/   (raw text + PDFs)
  - $CONFORMLY_VAULT/notes/regulations/ (Conformly-vetted curated notes)

For each markdown file it extracts frontmatter (doc_id, title, type,
status, issuer, ...) so the agent can pick by metadata. For PDFs it
records the path + size so the agent can decide whether to ingest it
directly (Gemini multimodal) or skip.

The optional ``query`` argument is a plain case-insensitive substring
filter on doc_id + title + tags. No fuzzy matching, no embeddings —
the agent does semantic selection downstream.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

from ._shared import (
    audit_log,
    err,
    ok,
    require_vault,
    split_frontmatter,
    vault_path,
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Schema
# ---------------------------------------------------------------------------

SEARCH_REGULATION_SCHEMA: Dict[str, Any] = {
    "name": "conformly_search_regulation",
    "description": (
        "Return a catalog of regulation documents available in the Conformly "
        "Vault (IVDR text, MDCG guidance, ISO/CLSI summaries, curated Q&A "
        "notes). Each entry includes the relative path, doc identifier, "
        "title, document type, size, and tags. "
        "Use this BEFORE answering a regulatory question — the catalog tells "
        "you which files exist and roughly what they cover, so you can then "
        "call read_file on the 1–3 most relevant ones. "
        "This tool does NOT do semantic search itself — it lists candidates. "
        "Semantic interpretation is YOUR job (the long-context LLM)."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": (
                    "Optional case-insensitive substring filter on doc_id, "
                    "title, and tags. Omit to return the full catalog. "
                    "Examples: 'IVDR Annex XIII', 'ISO 13485', 'precision'."
                ),
            },
            "doc_type": {
                "type": "string",
                "enum": ["regulation", "guidance", "standard", "qa_note", "any"],
                "description": (
                    "Filter by document family. 'regulation' = IVDR/MDR text; "
                    "'guidance' = MDCG/IMDRF; 'standard' = ISO/CLSI/IEC summaries; "
                    "'qa_note' = curated Conformly Q&A snippets. Default 'any'."
                ),
                "default": "any",
            },
            "include_pdfs": {
                "type": "boolean",
                "description": (
                    "If true, also list PDF files (path + size only — no "
                    "content extraction). Default true. The caller decides "
                    "whether to ingest a PDF via Gemini multimodal."
                ),
                "default": True,
            },
        },
    },
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
# Metadata extraction
# ---------------------------------------------------------------------------

# Map frontmatter ``type`` values to the doc_type buckets exposed in the schema.
_TYPE_MAP = {
    # User-visible bucket          → frontmatter ``type`` values that fall here
    "regulation": {"regulation", "regulation_text"},
    "guidance":   {"guidance", "regulation_summary"},  # MDCG summaries land here
    "standard":   {"standard", "iso_summary", "clsi_summary"},
    "qa_note":    {"qa_note", "note"},
}

# How to decide doc_type when the frontmatter doesn't say.
# Order matters — first match wins.
_FILENAME_FALLBACK = [
    ("IVDR", "regulation"),
    ("MDR", "regulation"),
    ("MDCG", "guidance"),
    ("IMDRF", "guidance"),
    ("ISO", "standard"),
    ("CLSI", "standard"),
    ("IEC", "standard"),
]


def _classify(fm: Dict[str, Any], path: Path) -> str:
    # Step 1 — explicit, specific frontmatter wins. These types are precise
    # enough to override any filename heuristic.
    declared = (fm.get("type") or "").lower()
    _SPECIFIC = {
        "qa_note": "qa_note",
        "note": "qa_note",
        "iso_summary": "standard",
        "clsi_summary": "standard",
        "iec_summary": "standard",
        "standard": "standard",
        "regulation_text": "regulation",
        "regulation": "regulation",
    }
    if declared in _SPECIFIC:
        return _SPECIFIC[declared]
    # Step 2 — filename prefix. Handles the common case where ISO/CLSI mock
    # files share the generic ``regulation_summary`` frontmatter type.
    stem_upper = path.stem.upper()
    for prefix, bucket in _FILENAME_FALLBACK:
        if stem_upper.startswith(prefix):
            return bucket
    # Step 3 — fall back to the broader frontmatter buckets.
    for bucket, members in _TYPE_MAP.items():
        if declared in members:
            return bucket
    return "regulation"  # safe default


def _extract_md_meta(md_path: Path, source_dir: str) -> Dict[str, Any]:
    """Read a markdown regulation file and project its metadata."""
    try:
        text = md_path.read_text(encoding="utf-8")
    except OSError as e:
        return {"path": str(md_path), "error": f"read failed: {e}"}

    fm, body = split_frontmatter(text)

    # Title preference: explicit frontmatter > full_title > first H1 in body > filename
    title = (
        fm.get("title")
        or fm.get("full_title")
        or _first_h1(body)
        or md_path.stem.replace("_", " ").replace("-", " ")
    )

    return {
        "path": _vault_relative(md_path),
        "absolute_path": str(md_path),
        "format": "markdown",
        "source_dir": source_dir,
        "doc_id": fm.get("doc_id") or md_path.stem,
        "title": title,
        "doc_type": _classify(fm, md_path),
        "issuer": fm.get("issuer"),
        "language": fm.get("language") or "EN",
        "status": fm.get("status"),
        "tags": fm.get("tags", []),
        "size_chars": len(text),
        # First 280 chars of body so the agent can disambiguate without
        # paying a full read_file round-trip if the title is ambiguous.
        "snippet": _snippet(body, 280),
    }


def _extract_pdf_meta(pdf_path: Path, source_dir: str) -> Dict[str, Any]:
    stem = pdf_path.stem
    return {
        "path": _vault_relative(pdf_path),
        "absolute_path": str(pdf_path),
        "format": "pdf",
        "source_dir": source_dir,
        "doc_id": stem,
        "title": stem.replace("-", " ").replace("_", " "),
        "doc_type": _classify({}, pdf_path),
        "size_bytes": pdf_path.stat().st_size,
        "note": "PDF — ingest via Gemini multimodal or skip.",
    }


def _vault_relative(p: Path) -> str:
    try:
        return str(p.relative_to(vault_path()))
    except ValueError:
        return str(p)


def _first_h1(body: str) -> Optional[str]:
    for line in body.splitlines():
        s = line.strip()
        if s.startswith("# ") and not s.startswith("# #"):
            return s.lstrip("# ").strip()
    return None


def _snippet(body: str, n: int) -> str:
    # Drop blank lines, then take the first n characters of the remainder.
    lines = [ln for ln in body.splitlines() if ln.strip()]
    return " ".join(lines)[:n].strip()


# ---------------------------------------------------------------------------
# Filtering
# ---------------------------------------------------------------------------

def _matches_query(entry: Dict[str, Any], q: str) -> bool:
    haystack = " ".join(
        str(entry.get(k, "")) for k in ("doc_id", "title", "issuer")
    ).lower() + " " + " ".join(str(t).lower() for t in entry.get("tags", []))
    return q.lower() in haystack


# ---------------------------------------------------------------------------
# Handler
# ---------------------------------------------------------------------------

# Directories scanned, in declared priority order. The first one whose name
# matches each filename wins (so curated notes shadow raw if they share a stem).
_SCAN_DIRS = [
    ("notes/regulations", "notes"),
    ("raw/regulations", "raw"),
]


def handle_search_regulation(args: Dict[str, Any], **_kw) -> str:
    query = args.get("query")
    if query is not None and not isinstance(query, str):
        return err("query must be a string or omitted")
    query = (query or "").strip()

    doc_type = args.get("doc_type") or "any"
    if doc_type not in {"any", "regulation", "guidance", "standard", "qa_note"}:
        return err(
            f"doc_type must be any/regulation/guidance/standard/qa_note (got {doc_type!r})"
        )

    include_pdfs = args.get("include_pdfs", True)
    if not isinstance(include_pdfs, bool):
        return err("include_pdfs must be a boolean")

    try:
        vault = require_vault()
    except FileNotFoundError as e:
        return err(str(e))

    entries: List[Dict[str, Any]] = []
    seen_stems: set[str] = set()
    errors: List[Dict[str, str]] = []

    for rel_dir, source_label in _SCAN_DIRS:
        d = vault / rel_dir
        if not d.is_dir():
            continue
        for p in sorted(d.iterdir()):
            if p.name.startswith("."):  # skip dotfiles like .gitkeep
                continue
            # Stem-level dedup: a curated note about IVDR-2017-746 shadows the
            # raw IVDR-2017-746.* file (raw is scanned second, so it loses).
            stem = p.stem.lower()
            if stem in seen_stems:
                continue
            if p.suffix.lower() == ".md":
                entry = _extract_md_meta(p, source_label)
            elif p.suffix.lower() == ".pdf":
                if not include_pdfs:
                    continue
                entry = _extract_pdf_meta(p, source_label)
            else:
                continue  # skip unknown formats
            if "error" in entry:
                errors.append({"file": p.name, "error": entry["error"]})
                continue
            seen_stems.add(stem)
            entries.append(entry)

    # Apply filters
    if doc_type != "any":
        entries = [e for e in entries if e.get("doc_type") == doc_type]
    if query:
        entries = [e for e in entries if _matches_query(e, query)]

    # Stable order: regulations first, then guidance, standards, qa_notes;
    # within a bucket, alphabetical by doc_id.
    _BUCKET_ORDER = {"regulation": 0, "guidance": 1, "standard": 2, "qa_note": 3}
    entries.sort(
        key=lambda e: (
            _BUCKET_ORDER.get(e.get("doc_type"), 99),
            (e.get("doc_id") or "").lower(),
        )
    )

    audit_log(
        tool="conformly_search_regulation",
        args={"query": query, "doc_type": doc_type, "include_pdfs": include_pdfs},
        status="ok",
        returned=len(entries),
    )
    return ok(entries, count=len(entries), errors=errors)
