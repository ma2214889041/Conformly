"""Tests for conformly_get_client_status.

Run with: pytest conformly/tests -q
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

# Import the tool module directly by adding the plugin root to sys.path.
# We can't use the Hermes-loader path (hermes_plugins.conformly) outside the
# CLI, and the plugin directory uses a dash which isn't a valid module name —
# so treat the plugin dir as a package root and import its `tools` subpackage.
_PLUGIN_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_PLUGIN_ROOT))

from tools.get_client_status import (  # noqa: E402
    GET_CLIENT_STATUS_SCHEMA,
    check_conformly_vault,
    handle_get_client_status,
)


CLIENT_A_FIXTURE = """\
---
client_id: CLIENT-A
codename: "Test Co."
country: CN
contact_lang: [zh, en]
ivd_class: C
product_type: "Molecular IVD"
indication: "Respiratory panel"
current_phase: "Phase 3 — SUBMISSION"
green_lights_passed: []
nb: "BSI Netherlands (NB 2797)"
opened: 2025-11-04
last_contact: 2026-05-12
status: active
risk_flags: ["clock-stop possible"]
---

# Client A

## 1. Company

Some prose.

## 5. 已识别风险

| # | 风险 | 严重度 | 当前应对 |
|---|------|--------|---------|
| R1 | RSV sample size | 高 | adding sites |
| R2 | Software docs | 中 | client team to deliver |
| R3 | Legacy claim | 低 | [resolved] superseded by v2 IFU |

## 7. 下一步动作

- [ ] 2026-05-28 — Follow up CE Parere Unico
- [ ] 2026-06-15 — Software documentation deadline
- [x] 2026-04-30 — Receive BSI deficiency letter
- [ ] No-date task
"""


@pytest.fixture
def vault(tmp_path, monkeypatch):
    """Build a minimal vault layout backed by the fixture above."""
    v = tmp_path / "vault"
    (v / "clients").mkdir(parents=True)
    (v / "clients" / "client-a.md").write_text(CLIENT_A_FIXTURE, encoding="utf-8")
    monkeypatch.setenv("CONFORMLY_VAULT", str(v))
    return v


# ---------------------------------------------------------------------------
# Happy path
# ---------------------------------------------------------------------------

def test_returns_ok(vault):
    res = json.loads(handle_get_client_status({"client_id": "CLIENT-A"}))
    assert res["success"] is True
    d = res["data"]
    assert d["client_id"] == "CLIENT-A"
    assert d["ivdr_class"] == "C"
    assert d["nb"] == "BSI Netherlands (NB 2797)"
    assert d["current_phase"] == "Phase 3 — SUBMISSION"
    assert d["codename"] == "Test Co."


def test_case_insensitive_lookup(vault):
    res = json.loads(handle_get_client_status({"client_id": "client-a"}))
    assert res["success"] is True
    assert res["data"]["client_id"] == "CLIENT-A"


def test_day_in_journey_is_int(vault):
    res = json.loads(handle_get_client_status({"client_id": "CLIENT-A"}))
    d = res["data"]
    # opened 2025-11-04 — should be a positive integer for any test date after.
    assert isinstance(d["day_in_journey"], int)
    assert d["day_in_journey"] > 0
    assert isinstance(d["days_since_contact"], int)
    assert d["days_since_contact"] >= 0


# ---------------------------------------------------------------------------
# Risk parsing
# ---------------------------------------------------------------------------

def test_risks_default_drops_resolved(vault):
    res = json.loads(handle_get_client_status({"client_id": "CLIENT-A"}))
    risks = res["data"]["risks"]
    assert len(risks) == 2
    risk_ids = [r["#"] for r in risks]
    assert risk_ids == ["R1", "R2"]
    assert res["data"]["risk_level"] == "high"  # R1 severity 高


def test_risks_include_history(vault):
    res = json.loads(
        handle_get_client_status(
            {"client_id": "CLIENT-A", "include_risk_history": True}
        )
    )
    assert len(res["data"]["risks"]) == 3


def test_risk_level_none_when_no_risks(vault, tmp_path):
    (vault / "clients" / "client-quiet.md").write_text(
        "---\nclient_id: CLIENT-QUIET\nivd_class: A\n"
        "current_phase: Phase 0\nopened: 2026-01-01\n---\n"
        "# Empty\n",
        encoding="utf-8",
    )
    res = json.loads(handle_get_client_status({"client_id": "CLIENT-QUIET"}))
    assert res["data"]["risks"] == []
    assert res["data"]["risk_level"] == "none"


# ---------------------------------------------------------------------------
# Next actions
# ---------------------------------------------------------------------------

def test_next_actions_parsed(vault):
    res = json.loads(handle_get_client_status({"client_id": "CLIENT-A"}))
    actions = res["data"]["next_actions"]
    # 3 open + 1 done = 4 total
    assert len(actions) == 4
    assert sum(1 for a in actions if a["done"]) == 1


def test_next_action_is_soonest_open(vault):
    res = json.loads(handle_get_client_status({"client_id": "CLIENT-A"}))
    nxt = res["data"]["next_action"]
    assert nxt is not None
    assert nxt["due"] == "2026-05-28"
    assert "CE Parere Unico" in nxt["text"]
    assert nxt["done"] is False


# ---------------------------------------------------------------------------
# Error paths
# ---------------------------------------------------------------------------

def test_missing_client_id(vault):
    res = json.loads(handle_get_client_status({}))
    assert res["success"] is False
    assert "required" in res["error"].lower()


def test_empty_client_id(vault):
    res = json.loads(handle_get_client_status({"client_id": "   "}))
    assert res["success"] is False
    assert "required" in res["error"].lower()


def test_unknown_client_returns_candidates(vault):
    res = json.loads(handle_get_client_status({"client_id": "BOGUS"}))
    assert res["success"] is False
    assert "client-a" in res["candidates"]


def test_no_vault(tmp_path, monkeypatch):
    monkeypatch.setenv("CONFORMLY_VAULT", str(tmp_path / "missing"))
    res = json.loads(handle_get_client_status({"client_id": "CLIENT-A"}))
    assert res["success"] is False
    assert "CONFORMLY_VAULT" in res["error"]


def test_handler_never_raises_on_bad_input(vault):
    # Garbage shapes should still produce a JSON error, not an exception.
    for bad in [
        {"client_id": None},
        {"client_id": 42},
        {"client_id": ""},
        {},
    ]:
        out = handle_get_client_status(bad)
        # Must be valid JSON…
        parsed = json.loads(out)
        # …and report failure.
        assert parsed["success"] is False


# ---------------------------------------------------------------------------
# Runtime gate
# ---------------------------------------------------------------------------

def test_check_fn_true_when_vault_exists(vault):
    assert check_conformly_vault() is True


def test_check_fn_false_when_missing(tmp_path, monkeypatch):
    monkeypatch.setenv("CONFORMLY_VAULT", str(tmp_path / "does-not-exist"))
    assert check_conformly_vault() is False


# ---------------------------------------------------------------------------
# Schema sanity
# ---------------------------------------------------------------------------

def test_schema_shape():
    s = GET_CLIENT_STATUS_SCHEMA
    assert s["name"] == "conformly_get_client_status"
    assert "description" in s and len(s["description"]) > 80
    assert s["parameters"]["required"] == ["client_id"]
    assert "client_id" in s["parameters"]["properties"]
