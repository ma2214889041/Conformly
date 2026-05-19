"""Tests for conformly_gspr_gap_analyzer."""

from __future__ import annotations

import copy
import json
import sys
from pathlib import Path

import pytest

_PLUGIN_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_PLUGIN_ROOT))

import tools.gspr_gap_analyzer as G  # noqa: E402
from tools.gspr_gap_analyzer import (  # noqa: E402
    GSPR_GAP_ANALYZER_SCHEMA,
    GSPR_GAP_OUTPUT_SCHEMA,
    handle_gspr_gap_analyzer,
)


MOCK_GAP_REPORT = {
    "headline": "Class C device with major gaps in software docs and clinical evidence.",
    "top_risks": ["GSPR-9", "GSPR-10", "GSPR-15"],
    "items": [
        {
            "clause_id": "GSPR-1",
            "clause_title": "Safe and effective use",
            "status": "addressed",
            "evidence": "Intended purpose well-defined; lab use only.",
            "gap": "",
            "recommended_action": "",
            "priority": "low",
        },
        {
            "clause_id": "GSPR-9",
            "clause_title": "Analytical performance",
            "status": "partial",
            "evidence": "Precision study run.",
            "gap": "CLSI EP05-A3 requires 20-day design; only 5 days performed.",
            "recommended_action": "Repeat precision per CLSI EP05-A3.",
            "priority": "high",
        },
        {
            "clause_id": "GSPR-15",
            "clause_title": "Software lifecycle",
            "status": "open",
            "evidence": "",
            "gap": "No IEC 62304 documentation provided.",
            "recommended_action": "Produce IEC 62304 software DHF (Class B baseline).",
            "priority": "high",
        },
        {
            "clause_id": "GSPR-11",
            "clause_title": "Self-test / near-patient testing",
            "status": "n/a",
            "evidence": "",
            "gap": "",
            "recommended_action": "",
            "priority": "low",
        },
    ],
}


CLIENT_FIXTURE = """\
---
client_id: CLIENT-T
codename: "Test IVD Co"
ivd_class: C
product_type: "RT-PCR panel"
indication: "Respiratory viruses"
current_phase: "Phase 3 — SUBMISSION"
nb: "BSI NL"
opened: 2025-12-01
last_contact: 2026-05-01
status: active
risk_flags: []
---

# CLIENT-T

## 5. 已识别风险

| # | 风险 | 严重度 | 当前应对 |
|---|------|--------|---------|
| R1 | software docs gap | 高 | TBD |

## 7. 下一步动作

- [ ] 2026-06-01 — submit MinSal docs
"""


GSPR_FIXTURE = """\
---
doc_id: GSPR-Checklist
type: qa_note
---
# GSPR

### GSPR-1 — Safe and effective use
Text.

### GSPR-9 — Analytical performance
Text.

### GSPR-11 — Self-test
Text.

### GSPR-15 — Software lifecycle
Text.
"""


@pytest.fixture
def vault(tmp_path, monkeypatch):
    v = tmp_path / "vault"
    (v / "clients").mkdir(parents=True)
    (v / "notes" / "regulations").mkdir(parents=True)
    (v / "clients" / "client-t.md").write_text(CLIENT_FIXTURE, encoding="utf-8")
    (v / "notes" / "regulations" / "gspr-checklist.md").write_text(GSPR_FIXTURE, encoding="utf-8")
    monkeypatch.setenv("CONFORMLY_VAULT", str(v))
    return v


@pytest.fixture
def mock_llm(monkeypatch):
    calls = []

    def fake(client_data, gspr_text, focus_clauses):
        calls.append(
            {
                "client_id": client_data.get("client_id"),
                "gspr_chars": len(gspr_text),
                "focus_clauses": focus_clauses,
                "has_tech_fragments": "tech_fragments" in client_data,
            }
        )
        return copy.deepcopy(MOCK_GAP_REPORT)

    monkeypatch.setattr(G, "_llm_caller", fake)
    return calls


# ---------------------------------------------------------------------------
# Happy path
# ---------------------------------------------------------------------------

def test_basic_report(vault, mock_llm):
    res = json.loads(handle_gspr_gap_analyzer({"client_id": "CLIENT-T"}))
    assert res["success"] is True
    d = res["data"]
    assert d["client_id"] == "CLIENT-T"
    assert d["ivdr_class"] == "C"
    assert d["current_phase"].startswith("Phase 3")
    assert d["headline"].startswith("Class C")
    assert d["top_risks"] == ["GSPR-9", "GSPR-10", "GSPR-15"]
    assert d["analysed_at"].endswith("Z")
    assert d["focus_clauses"] == []


def test_summary_counts(vault, mock_llm):
    res = json.loads(handle_gspr_gap_analyzer({"client_id": "CLIENT-T"}))
    s = res["data"]["summary"]
    # MOCK_GAP_REPORT: 1 addressed + 1 partial + 1 open + 1 n/a
    assert s == {"addressed": 1, "partial": 1, "open": 1, "n_a": 1, "total": 4}


def test_items_passed_through(vault, mock_llm):
    res = json.loads(handle_gspr_gap_analyzer({"client_id": "CLIENT-T"}))
    items = res["data"]["items"]
    ids = [it["clause_id"] for it in items]
    assert ids == ["GSPR-1", "GSPR-9", "GSPR-15", "GSPR-11"]
    # status normalisation kept lower-case
    assert {it["status"] for it in items} == {"addressed", "partial", "open", "n/a"}


def test_case_insensitive_client_id(vault, mock_llm):
    res = json.loads(handle_gspr_gap_analyzer({"client_id": "client-t"}))
    assert res["success"] is True


# ---------------------------------------------------------------------------
# Focus clauses
# ---------------------------------------------------------------------------

def test_focus_clauses_passed_to_llm(vault, mock_llm):
    handle_gspr_gap_analyzer(
        {"client_id": "CLIENT-T", "focus_clauses": ["GSPR-9", "GSPR-15"]}
    )
    assert mock_llm[0]["focus_clauses"] == ["GSPR-9", "GSPR-15"]


def test_focus_clauses_validation(vault, mock_llm):
    res = json.loads(
        handle_gspr_gap_analyzer({"client_id": "CLIENT-T", "focus_clauses": "not a list"})
    )
    assert res["success"] is False
    assert "focus_clauses" in res["error"]


def test_focus_clauses_must_be_strings(vault, mock_llm):
    res = json.loads(
        handle_gspr_gap_analyzer({"client_id": "CLIENT-T", "focus_clauses": [1, 2, 3]})
    )
    assert res["success"] is False


def test_empty_focus_list_treated_as_no_focus(vault, mock_llm):
    handle_gspr_gap_analyzer({"client_id": "CLIENT-T", "focus_clauses": ["", "  "]})
    assert mock_llm[0]["focus_clauses"] == []


# ---------------------------------------------------------------------------
# Tech fragments
# ---------------------------------------------------------------------------

def test_tech_fragments_picked_up(vault, mock_llm):
    tech_dir = vault / "clients" / "client-t" / "tech_files"
    tech_dir.mkdir(parents=True)
    (tech_dir / "section-4.md").write_text("# Analytical performance excerpt", encoding="utf-8")
    res = json.loads(handle_gspr_gap_analyzer({"client_id": "CLIENT-T"}))
    assert res["data"]["tech_fragments_count"] == 1
    assert mock_llm[0]["has_tech_fragments"] is True


def test_no_tech_fragments_is_ok(vault, mock_llm):
    res = json.loads(handle_gspr_gap_analyzer({"client_id": "CLIENT-T"}))
    assert res["data"]["tech_fragments_count"] == 0
    assert mock_llm[0]["has_tech_fragments"] is False


# ---------------------------------------------------------------------------
# Error paths
# ---------------------------------------------------------------------------

def test_missing_client_id(vault, mock_llm):
    res = json.loads(handle_gspr_gap_analyzer({}))
    assert res["success"] is False
    assert "required" in res["error"]


def test_unknown_client(vault, mock_llm):
    res = json.loads(handle_gspr_gap_analyzer({"client_id": "BOGUS"}))
    assert res["success"] is False
    assert "client-t" in res["candidates"]


def test_missing_gspr_checklist(tmp_path, monkeypatch, mock_llm):
    v = tmp_path / "vault"
    (v / "clients").mkdir(parents=True)
    (v / "clients" / "client-t.md").write_text(CLIENT_FIXTURE, encoding="utf-8")
    monkeypatch.setenv("CONFORMLY_VAULT", str(v))
    res = json.loads(handle_gspr_gap_analyzer({"client_id": "CLIENT-T"}))
    assert res["success"] is False
    assert "GSPR" in res["error"]


def test_no_vault(tmp_path, monkeypatch, mock_llm):
    monkeypatch.setenv("CONFORMLY_VAULT", str(tmp_path / "missing"))
    res = json.loads(handle_gspr_gap_analyzer({"client_id": "X"}))
    assert res["success"] is False


def test_llm_failure_returns_error(vault, monkeypatch):
    def boom(client_data, gspr_text, focus_clauses):
        raise RuntimeError("LLM down")
    monkeypatch.setattr(G, "_llm_caller", boom)
    res = json.loads(handle_gspr_gap_analyzer({"client_id": "CLIENT-T"}))
    assert res["success"] is False
    assert "LLM" in res["error"]


# ---------------------------------------------------------------------------
# Normalisation
# ---------------------------------------------------------------------------

def test_bad_status_normalised_to_open(vault, monkeypatch):
    payload = copy.deepcopy(MOCK_GAP_REPORT)
    payload["items"][0]["status"] = "WHATEVER"
    payload["items"][0]["priority"] = "WHATEVER"
    monkeypatch.setattr(G, "_llm_caller", lambda c, g, f: payload)
    res = json.loads(handle_gspr_gap_analyzer({"client_id": "CLIENT-T"}))
    item = res["data"]["items"][0]
    assert item["status"] == "open"
    assert item["priority"] == "medium"


def test_non_dict_items_skipped(vault, monkeypatch):
    payload = copy.deepcopy(MOCK_GAP_REPORT)
    payload["items"] = [{"clause_id": "GSPR-1", "status": "addressed"}, "garbage", None, 42]
    monkeypatch.setattr(G, "_llm_caller", lambda c, g, f: payload)
    res = json.loads(handle_gspr_gap_analyzer({"client_id": "CLIENT-T"}))
    assert len(res["data"]["items"]) == 1


# ---------------------------------------------------------------------------
# Schema sanity
# ---------------------------------------------------------------------------

def test_schema_shape():
    s = GSPR_GAP_ANALYZER_SCHEMA
    assert s["name"] == "conformly_gspr_gap_analyzer"
    assert "client_id" in s["parameters"]["required"]


def test_output_schema_required():
    assert "items" in GSPR_GAP_OUTPUT_SCHEMA["required"]
