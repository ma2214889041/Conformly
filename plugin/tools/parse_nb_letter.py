"""conformly_parse_nb_letter — turn a Notified Body letter into a structured plan.

Takes the path to a letter file (markdown or PDF) and uses the host LLM
to extract:
  - identifying metadata (NB, reference, date, deadline, clock-stop status)
  - a list of deficiencies, each with severity, regulatory reference,
    and the evidence the NB is asking for

The LLM call goes through Hermes' :class:`agent.plugin_llm.PluginLlm` so
the user's active provider/model is used transparently. Gemini 2.5 Pro
is the recommended provider because it can ingest PDFs natively; with
the current Codex auth, supply the letter as markdown / text instead.

This tool is **read-only** — no vault writes, no HITL. The follow-on
"draft response" tool is where HITL kicks in.
"""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional

from ._shared import audit_log, err, ok, require_vault, vault_path

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Schema (LLM tool-call signature)
# ---------------------------------------------------------------------------

PARSE_NB_LETTER_SCHEMA: Dict[str, Any] = {
    "name": "conformly_parse_nb_letter",
    "description": (
        "Parse a Notified Body (BSI, TÜV SÜD, DEKRA, etc.) letter and "
        "return a structured deficiency plan: NB metadata, clock-stop "
        "status, response deadline, and a list of deficiencies each with "
        "severity, regulatory reference, and the evidence required. "
        "Use this immediately after a new NB letter lands in "
        "$CONFORMLY_VAULT/raw/nb_letters/. "
        "Provide either letter_path (a file under the vault — md or txt) "
        "OR letter_text (raw text pasted by the user). Exactly one is required."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "letter_path": {
                "type": "string",
                "description": (
                    "Path to the letter file. Relative paths resolve under "
                    "$CONFORMLY_VAULT; absolute paths are used as-is. "
                    "Supported formats: .md and .txt today. PDF support "
                    "requires a Gemini provider (logs an error otherwise)."
                ),
            },
            "letter_text": {
                "type": "string",
                "description": (
                    "Raw letter text. Use this when the letter was pasted "
                    "into chat rather than saved to the vault."
                ),
            },
            "client_id": {
                "type": "string",
                "description": (
                    "Optional client_id this letter belongs to. Used for "
                    "audit-log correlation only; the parser does NOT update "
                    "the client dossier (that's a separate write tool)."
                ),
            },
        },
    },
}


# ---------------------------------------------------------------------------
# Output JSON schema (what we ask the LLM to return)
# ---------------------------------------------------------------------------

# Kept inside the module so the LLM caller stays self-contained and tests
# can introspect the contract without importing private names.
NB_LETTER_OUTPUT_SCHEMA: Dict[str, Any] = {
    "type": "object",
    "properties": {
        "nb_name": {
            "type": "string",
            "description": "Full Notified Body name (e.g., 'BSI Netherlands').",
        },
        "nb_number": {
            "type": "string",
            "description": "Notified Body number, e.g., 'NB 2797'.",
        },
        "letter_reference": {
            "type": "string",
            "description": "Letter reference / project ID.",
        },
        "date_issued": {
            "type": "string",
            "description": "ISO date the letter was issued (YYYY-MM-DD).",
        },
        "letter_type": {
            "type": "string",
            "enum": ["deficiency", "approval", "suspension", "clarification", "other"],
        },
        "clock_stopped": {
            "type": "boolean",
            "description": "True if the letter states the conformity assessment clock has been stopped.",
        },
        "response_deadline": {
            "type": "string",
            "description": "ISO date by which the manufacturer must respond, or empty if not stated.",
        },
        "client_ref": {
            "type": "string",
            "description": "Client / manufacturer name as referenced in the letter.",
        },
        "device_ref": {
            "type": "string",
            "description": "Device / product referenced in the letter.",
        },
        "deficiencies": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "string",
                        "description": "Deficiency identifier as cited in the letter (e.g., 'D1', 'Finding 3').",
                    },
                    "section_cited": {
                        "type": "string",
                        "description": "Section of the technical file or protocol cited.",
                    },
                    "regulatory_reference": {
                        "type": "string",
                        "description": "IVDR / ISO / IEC reference (e.g., 'IVDR Annex I §9.1(a); CLSI EP05-A3').",
                    },
                    "issue": {
                        "type": "string",
                        "description": "One-sentence statement of the deficiency.",
                    },
                    "severity": {
                        "type": "string",
                        "enum": ["Critical", "Major", "Minor", "Observation"],
                    },
                    "evidence_required": {
                        "type": "string",
                        "description": "What the NB is asking the manufacturer to produce.",
                    },
                },
                "required": ["id", "issue", "severity"],
            },
        },
    },
    "required": ["nb_name", "date_issued", "deficiencies"],
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
# LLM facade — module-level so tests can monkeypatch it cleanly
# ---------------------------------------------------------------------------

# Signature: (letter_text, source_hint, pdf_bytes=None) -> dict.
# Returning the parsed JSON conforming to NB_LETTER_OUTPUT_SCHEMA.
LlmCaller = Callable[..., Dict[str, Any]]


def _real_llm_caller(
    letter_text: str,
    source_hint: str,
    pdf_bytes: Optional[bytes] = None,
) -> Dict[str, Any]:
    """Default implementation backed by Hermes' PluginLlm.

    When ``pdf_bytes`` is provided, the letter is sent as a multimodal
    PDF attachment to Gemini in addition to the system prompt — exercising
    Gemini's native PDF understanding (no text-extraction step in between).
    Otherwise the call is text-only.
    """
    from agent.plugin_llm import PluginLlm  # lazy: avoids importing host

    llm = PluginLlm(plugin_id="conformly")

    instructions = (
        "You are a regulatory affairs analyst at a CRO. The user will paste "
        "a Notified Body letter (BSI, TÜV SÜD, DEKRA, or similar) addressed "
        "to an IVD manufacturer. Extract a structured deficiency plan that "
        "a project manager can act on.\n\n"
        "Rules:\n"
        "1. Be faithful to the letter — never invent deficiencies, severities, "
        "   or regulatory references that aren't stated.\n"
        "2. If the letter explicitly says the clock is stopped, set "
        "   clock_stopped=true. If it's silent, set false.\n"
        "3. Severity follows the NB's own language if stated; otherwise apply "
        "   the IMDRF GHTF/SG3/N18 criteria conservatively.\n"
        "4. For each deficiency, capture the regulatory_reference verbatim from "
        "   the letter if cited (e.g., 'IVDR Annex I §9.1(a)').\n"
        "5. Dates must be ISO YYYY-MM-DD. Leave fields blank ('') when the "
        "   letter doesn't supply them — do NOT guess.\n"
        "6. Output ONLY JSON conforming to the supplied schema. No prose."
    )
    user_msg = (
        f"Source: {source_hint}\n\n"
        f"--- BEGIN LETTER ---\n{letter_text}\n--- END LETTER ---"
    )

    # Multimodal path — when we have PDF bytes, attach them as an image-typed
    # block. PluginLlm accepts an "image" entry with raw data + mime_type;
    # Gemini handles application/pdf natively.
    input_blocks: list[Dict[str, Any]] = [{"type": "text", "text": user_msg}]
    if pdf_bytes is not None:
        input_blocks.append({
            "type": "image",
            "data": pdf_bytes,
            "mime_type": "application/pdf",
            "file_name": "nb-letter.pdf",
        })

    result = llm.complete_structured(
        instructions=instructions,
        input=input_blocks,
        json_schema=NB_LETTER_OUTPUT_SCHEMA,
        schema_name="ConformlyNBLetter",
        purpose="conformly.parse_nb_letter",
        temperature=0.0,
        max_tokens=4000,
        timeout=120.0,
    )

    # PluginLlm returns a structured result with .parsed (dict) when a
    # json_schema is supplied; fall back to JSON-decoding .text.
    parsed = getattr(result, "parsed", None)
    if parsed is None:
        text = getattr(result, "text", "") or ""
        try:
            parsed = json.loads(text)
        except json.JSONDecodeError as e:
            raise RuntimeError(f"LLM returned non-JSON response: {e}; text={text[:200]!r}")
    if not isinstance(parsed, dict):
        raise RuntimeError(f"LLM returned non-object response: {type(parsed).__name__}")
    return parsed


# Public hook for tests. Default: the real caller above.
_llm_caller: LlmCaller = _real_llm_caller


# ---------------------------------------------------------------------------
# File ingestion
# ---------------------------------------------------------------------------

_SUPPORTED_TEXT_EXTS = {".md", ".txt", ".markdown"}
_PDF_EXTS = {".pdf"}


def _resolve_letter_path(raw: str) -> Path:
    p = Path(raw).expanduser()
    if p.is_absolute():
        return p
    # Relative paths resolve under the vault root.
    return (vault_path() / raw).resolve()


def _load_letter_payload(path: Path) -> tuple[str, Optional[bytes]]:
    """Load a letter file. Returns (text, pdf_bytes_or_none).

    - For .md / .txt / .markdown: returns the text content, no PDF bytes.
    - For .pdf: returns a short text placeholder plus the raw bytes; the
      LLM caller attaches the bytes as a multimodal block so Gemini can
      read the PDF natively.
    """
    ext = path.suffix.lower()
    if ext in _SUPPORTED_TEXT_EXTS:
        return path.read_text(encoding="utf-8"), None
    if ext in _PDF_EXTS:
        try:
            data = path.read_bytes()
        except OSError as e:
            raise RuntimeError(f"failed to read PDF: {e}")
        if len(data) > 20 * 1024 * 1024:
            raise RuntimeError(f"PDF is {len(data) // (1024 * 1024)} MB — limit 20 MB")
        placeholder = (
            f"(PDF letter attached as multimodal input: {path.name}, "
            f"{len(data)} bytes. Read the attached document directly.)"
        )
        return placeholder, data
    raise RuntimeError(f"unsupported letter format: {ext!r}")


# ---------------------------------------------------------------------------
# Post-processing on the parsed LLM output
# ---------------------------------------------------------------------------

def _normalise(parsed: Dict[str, Any]) -> Dict[str, Any]:
    """Apply light validation + sensible defaults so the dashboard never crashes
    on missing keys. Doesn't second-guess the LLM's content — only shape."""
    parsed.setdefault("nb_name", "")
    parsed.setdefault("nb_number", "")
    parsed.setdefault("letter_reference", "")
    parsed.setdefault("date_issued", "")
    parsed.setdefault("letter_type", "deficiency")
    parsed.setdefault("clock_stopped", False)
    parsed.setdefault("response_deadline", "")
    parsed.setdefault("client_ref", "")
    parsed.setdefault("device_ref", "")
    raw_defs = parsed.get("deficiencies") or []
    if not isinstance(raw_defs, list):
        raw_defs = []
    cleaned: List[Dict[str, Any]] = []
    for i, d in enumerate(raw_defs, 1):
        if not isinstance(d, dict):
            continue
        cleaned.append(
            {
                "id": str(d.get("id") or f"D{i}"),
                "section_cited": str(d.get("section_cited") or ""),
                "regulatory_reference": str(d.get("regulatory_reference") or ""),
                "issue": str(d.get("issue") or ""),
                "severity": _normalise_severity(d.get("severity")),
                "evidence_required": str(d.get("evidence_required") or ""),
            }
        )
    parsed["deficiencies"] = cleaned
    parsed["counts"] = _summarise_counts(cleaned)
    return parsed


def _normalise_severity(s: Any) -> str:
    sl = str(s or "").strip().lower()
    mapping = {
        "critical": "Critical",
        "major": "Major",
        "minor": "Minor",
        "observation": "Observation",
        "obs": "Observation",
        "nc": "Major",
    }
    return mapping.get(sl, "Major")


def _summarise_counts(deficiencies: List[Dict[str, Any]]) -> Dict[str, int]:
    counts = {"Critical": 0, "Major": 0, "Minor": 0, "Observation": 0, "total": 0}
    for d in deficiencies:
        counts[d["severity"]] = counts.get(d["severity"], 0) + 1
        counts["total"] += 1
    return counts


# ---------------------------------------------------------------------------
# Handler
# ---------------------------------------------------------------------------

def handle_parse_nb_letter(args: Dict[str, Any], **_kw) -> str:
    letter_path = args.get("letter_path")
    letter_text = args.get("letter_text")
    client_id: Optional[str] = args.get("client_id")

    # Exactly one of the inputs is required.
    if bool(letter_path) == bool(letter_text):
        return err("provide exactly one of letter_path or letter_text")

    try:
        vault = require_vault()  # noqa: F841 — called for the side-effect of validating
    except FileNotFoundError as e:
        return err(str(e))

    pdf_bytes: Optional[bytes] = None
    if letter_path:
        if not isinstance(letter_path, str):
            return err("letter_path must be a string")
        path = _resolve_letter_path(letter_path)
        if not path.exists():
            return err(f"letter file not found: {path}", path=str(path))
        try:
            text, pdf_bytes = _load_letter_payload(path)
        except RuntimeError as e:
            return err(str(e), path=str(path))
        source_hint = str(path)
    else:
        if not isinstance(letter_text, str) or not letter_text.strip():
            return err("letter_text must be a non-empty string")
        text = letter_text
        source_hint = "inline text"
        path = None

    try:
        # Pass pdf_bytes only when present, so old (text, source_hint) mocks
        # in tests still match without an arity bump.
        if pdf_bytes is not None:
            parsed = _llm_caller(text, source_hint, pdf_bytes)
        else:
            parsed = _llm_caller(text, source_hint)
    except Exception as e:
        logger.exception("LLM extraction failed")
        audit_log(
            tool="conformly_parse_nb_letter",
            args={"letter_path": letter_path, "client_id": client_id},
            status="llm_error",
            error=str(e),
        )
        return err(f"LLM extraction failed: {e}")

    data = _normalise(parsed)
    if path is not None:
        data["source_path"] = str(path)
    if client_id:
        data["client_id"] = client_id

    audit_log(
        tool="conformly_parse_nb_letter",
        args={"letter_path": letter_path, "client_id": client_id, "has_text": bool(letter_text)},
        status="ok",
        deficiencies=data["counts"]["total"],
        clock_stopped=data["clock_stopped"],
    )
    return ok(data)
