"""Tests for conformly_parse_nb_letter.

The LLM call is mocked at module scope via monkeypatching the
``_llm_caller`` symbol — no live network calls in tests.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

_PLUGIN_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_PLUGIN_ROOT))

import tools.parse_nb_letter as P  # noqa: E402
from tools.parse_nb_letter import (  # noqa: E402
    NB_LETTER_OUTPUT_SCHEMA,
    PARSE_NB_LETTER_SCHEMA,
    handle_parse_nb_letter,
)


# ---------------------------------------------------------------------------
# Mock LLM payloads
# ---------------------------------------------------------------------------

MOCK_BSI_RESPONSE = {
    "nb_name": "BSI Group The Netherlands B.V.",
    "nb_number": "NB 2797",
    "letter_reference": "NB2797-IVDR-2026-1184",
    "date_issued": "2026-04-30",
    "letter_type": "deficiency",
    "clock_stopped": True,
    "response_deadline": "2026-06-29",
    "client_ref": "Shenzhen MoleQ Diagnostics",
    "device_ref": "MoleQ Respi-4 Panel",
    "deficiencies": [
        {
            "id": "D1",
            "section_cited": "TF §4.2.3",
            "regulatory_reference": "IVDR Annex I §9.1(a); CLSI EP05-A3",
            "issue": "Precision study under-powered (5-day design vs. 20).",
            "severity": "Major",
            "evidence_required": "Repeat the precision evaluation or justify the deviation.",
        },
        {
            "id": "D2",
            "section_cited": "CPS Protocol v1.4 §6.2",
            "regulatory_reference": "IVDR Annex XIII Part A §1.2.3",
            "issue": "RSV clinical performance sample size n=42 with wide CI.",
            "severity": "Major",
            "evidence_required": "Increase RSV positives to ≥80 or revise the claim.",
        },
        {
            "id": "D4",
            "section_cited": "Technical File §4.5",
            "regulatory_reference": "IVDR Annex I §9.4",
            "issue": "In-use stability supported only by accelerated studies.",
            "severity": "Minor",
            "evidence_required": "Real-time stability at 18–25°C, or amend the IFU claim.",
        },
    ],
}


@pytest.fixture
def vault(tmp_path, monkeypatch):
    v = tmp_path / "vault"
    (v / "raw" / "nb_letters").mkdir(parents=True)
    (v / "raw" / "nb_letters" / "2026-04-30-BSI-CLIENT-A.md").write_text(
        "Mock letter body — content irrelevant to tests since the LLM is mocked.",
        encoding="utf-8",
    )
    (v / "raw" / "nb_letters" / "letter.pdf").write_bytes(b"%PDF-1.4 fake\n")
    (v / "raw" / "nb_letters" / "letter.docx").write_bytes(b"fake docx")
    monkeypatch.setenv("CONFORMLY_VAULT", str(v))
    return v


@pytest.fixture
def mock_llm(monkeypatch):
    """Replace the module-level LLM caller. Returns the call-recording list.

    The handler mutates the parsed dict in place (adds source_path /
    client_id / counts), so we hand it a fresh deep copy each call —
    otherwise leakage between tests would tank assertions.
    """
    import copy
    calls = []

    def fake_caller(text, source_hint):
        calls.append({"text_len": len(text), "source_hint": source_hint})
        return copy.deepcopy(MOCK_BSI_RESPONSE)

    monkeypatch.setattr(P, "_llm_caller", fake_caller)
    return calls


# ---------------------------------------------------------------------------
# Happy path — file input
# ---------------------------------------------------------------------------

def test_parse_from_vault_file(vault, mock_llm):
    res = json.loads(
        handle_parse_nb_letter({
            "letter_path": "raw/nb_letters/2026-04-30-BSI-CLIENT-A.md",
            "client_id": "CLIENT-A",
        })
    )
    assert res["success"] is True
    d = res["data"]
    assert d["nb_name"].startswith("BSI")
    assert d["clock_stopped"] is True
    assert d["client_id"] == "CLIENT-A"  # carried through from args
    assert d["source_path"].endswith(".md")
    # 3 deficiencies in the mock
    assert d["counts"]["total"] == 3
    assert d["counts"]["Major"] == 2
    assert d["counts"]["Minor"] == 1


def test_call_received_text(vault, mock_llm):
    handle_parse_nb_letter({"letter_path": "raw/nb_letters/2026-04-30-BSI-CLIENT-A.md"})
    assert len(mock_llm) == 1
    assert mock_llm[0]["text_len"] > 0
    assert mock_llm[0]["source_hint"].endswith(".md")


# ---------------------------------------------------------------------------
# Happy path — inline text input
# ---------------------------------------------------------------------------

def test_parse_from_inline_text(vault, mock_llm):
    res = json.loads(
        handle_parse_nb_letter({"letter_text": "Pasted letter content here..."})
    )
    assert res["success"] is True
    assert "source_path" not in res["data"]  # only set when a path was given
    assert mock_llm[0]["source_hint"] == "inline text"


# ---------------------------------------------------------------------------
# Counts + severity normalisation
# ---------------------------------------------------------------------------

def test_severity_aliases_normalised(vault, monkeypatch):
    weird = dict(MOCK_BSI_RESPONSE)
    weird["deficiencies"] = [
        {"id": "X1", "issue": "a", "severity": "NC"},
        {"id": "X2", "issue": "b", "severity": "obs"},
        {"id": "X3", "issue": "c", "severity": "MAJOR"},
        {"id": "X4", "issue": "d", "severity": ""},  # default → Major
    ]
    monkeypatch.setattr(P, "_llm_caller", lambda t, s: weird)
    res = json.loads(handle_parse_nb_letter({"letter_text": "x"}))
    sevs = [d["severity"] for d in res["data"]["deficiencies"]]
    assert sevs == ["Major", "Observation", "Major", "Major"]


def test_missing_id_gets_default(vault, monkeypatch):
    payload = dict(MOCK_BSI_RESPONSE)
    payload["deficiencies"] = [
        {"issue": "no id given", "severity": "Major"},
        {"issue": "still no id", "severity": "Minor"},
    ]
    monkeypatch.setattr(P, "_llm_caller", lambda t, s: payload)
    res = json.loads(handle_parse_nb_letter({"letter_text": "x"}))
    ids = [d["id"] for d in res["data"]["deficiencies"]]
    assert ids == ["D1", "D2"]


def test_counts_zero_when_no_deficiencies(vault, monkeypatch):
    payload = dict(MOCK_BSI_RESPONSE)
    payload["deficiencies"] = []
    monkeypatch.setattr(P, "_llm_caller", lambda t, s: payload)
    res = json.loads(handle_parse_nb_letter({"letter_text": "x"}))
    assert res["data"]["counts"] == {
        "Critical": 0, "Major": 0, "Minor": 0, "Observation": 0, "total": 0,
    }


# ---------------------------------------------------------------------------
# Error paths
# ---------------------------------------------------------------------------

def test_requires_exactly_one_input(vault, mock_llm):
    # neither
    assert json.loads(handle_parse_nb_letter({}))["success"] is False
    # both
    assert json.loads(handle_parse_nb_letter({"letter_path": "x", "letter_text": "y"}))["success"] is False
    # none called the LLM
    assert mock_llm == []


def test_missing_file(vault, mock_llm):
    res = json.loads(handle_parse_nb_letter({"letter_path": "raw/nb_letters/missing.md"}))
    assert res["success"] is False
    assert "not found" in res["error"]


def test_pdf_rejected_with_clear_message(vault, mock_llm):
    res = json.loads(handle_parse_nb_letter({"letter_path": "raw/nb_letters/letter.pdf"}))
    assert res["success"] is False
    assert "PDF" in res["error"]
    assert "Gemini" in res["error"]


def test_unsupported_format(vault, mock_llm):
    res = json.loads(handle_parse_nb_letter({"letter_path": "raw/nb_letters/letter.docx"}))
    assert res["success"] is False
    assert "unsupported" in res["error"]


def test_empty_text(vault, mock_llm):
    res = json.loads(handle_parse_nb_letter({"letter_text": "   "}))
    assert res["success"] is False


def test_path_must_be_string(vault, mock_llm):
    res = json.loads(handle_parse_nb_letter({"letter_path": 42}))
    assert res["success"] is False


def test_llm_failure_returns_error(vault, monkeypatch):
    def boom(text, source_hint):
        raise RuntimeError("provider exploded")
    monkeypatch.setattr(P, "_llm_caller", boom)
    res = json.loads(handle_parse_nb_letter({"letter_text": "letter body"}))
    assert res["success"] is False
    assert "LLM" in res["error"]


def test_no_vault(tmp_path, monkeypatch):
    monkeypatch.setenv("CONFORMLY_VAULT", str(tmp_path / "missing"))
    res = json.loads(handle_parse_nb_letter({"letter_text": "x"}))
    assert res["success"] is False


# ---------------------------------------------------------------------------
# Schema sanity
# ---------------------------------------------------------------------------

def test_schema_shape():
    s = PARSE_NB_LETTER_SCHEMA
    assert s["name"] == "conformly_parse_nb_letter"
    assert len(s["description"]) > 80
    # Either-or is enforced in handler logic, not schema; required[] empty.
    assert s["parameters"].get("required", []) == []


def test_output_schema_required_keys():
    assert "nb_name" in NB_LETTER_OUTPUT_SCHEMA["required"]
    assert "deficiencies" in NB_LETTER_OUTPUT_SCHEMA["required"]
