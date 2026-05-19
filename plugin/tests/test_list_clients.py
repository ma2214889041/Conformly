"""Tests for conformly_list_clients."""

from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

_PLUGIN_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_PLUGIN_ROOT))

from tools.list_clients import (  # noqa: E402
    LIST_CLIENTS_SCHEMA,
    handle_list_clients,
)


def _make_client(
    client_id: str,
    *,
    ivd_class: str = "C",
    phase: str = "Phase 3 — SUBMISSION",
    status: str = "active",
    opened: str = "2025-11-04",
    last_contact: str = "2026-05-12",
    risk_sev: str = "高",
    next_due: str = "2026-05-28",
    nb: str = "BSI NL",
) -> str:
    return f"""---
client_id: {client_id}
codename: "Codename {client_id}"
country: CN
ivd_class: {ivd_class}
product_type: "Mock product"
current_phase: "{phase}"
green_lights_passed: []
nb: "{nb}"
opened: {opened}
last_contact: {last_contact}
status: {status}
risk_flags: []
---

# {client_id}

## 5. 已识别风险

| # | 风险 | 严重度 | 当前应对 |
|---|------|--------|---------|
| R1 | sample size | {risk_sev} | TBD |

## 7. 下一步动作

- [ ] {next_due} — Follow up
"""


@pytest.fixture
def vault(tmp_path, monkeypatch):
    v = tmp_path / "vault"
    (v / "clients").mkdir(parents=True)
    (v / "clients" / "client-a.md").write_text(
        _make_client("CLIENT-A", ivd_class="C", phase="Phase 3 — SUBMISSION", risk_sev="高", next_due="2026-05-28", opened="2025-11-04"),
        encoding="utf-8",
    )
    (v / "clients" / "client-b.md").write_text(
        _make_client("CLIENT-B", ivd_class="D", phase="Phase 0 — Evaluation", risk_sev="中", next_due="2026-06-30", opened="2026-04-22"),
        encoding="utf-8",
    )
    (v / "clients" / "client-c.md").write_text(
        _make_client("CLIENT-C", ivd_class="B", phase="Phase 5 — FOLLOW UP", risk_sev="低", next_due="2026-06-01", opened="2025-06-15"),
        encoding="utf-8",
    )
    (v / "clients" / "client-archived.md").write_text(
        _make_client("CLIENT-OLD", ivd_class="C", phase="Phase 6 — CONCLUSION", status="archived", opened="2023-01-01"),
        encoding="utf-8",
    )
    monkeypatch.setenv("CONFORMLY_VAULT", str(v))
    return v


# ---------------------------------------------------------------------------
# Happy path
# ---------------------------------------------------------------------------

def test_returns_active_by_default(vault):
    res = json.loads(handle_list_clients({}))
    assert res["success"] is True
    assert res["count"] == 3
    ids = sorted(r["client_id"] for r in res["data"])
    assert ids == ["CLIENT-A", "CLIENT-B", "CLIENT-C"]


def test_summary_shape(vault):
    res = json.loads(handle_list_clients({}))
    r = res["data"][0]
    # All the dashboard fields must be present
    for key in [
        "client_id", "codename", "country", "ivdr_class", "nb",
        "current_phase", "day_in_journey", "risk_level", "risk_count",
        "next_action_text", "next_action_due", "status",
    ]:
        assert key in r, f"missing key {key}"


def test_status_all_includes_archived(vault):
    res = json.loads(handle_list_clients({"status": "all"}))
    assert res["count"] == 4


def test_status_archived(vault):
    res = json.loads(handle_list_clients({"status": "archived"}))
    assert res["count"] == 1
    assert res["data"][0]["client_id"] == "CLIENT-OLD"


# ---------------------------------------------------------------------------
# Filters
# ---------------------------------------------------------------------------

def test_filter_by_ivdr_class(vault):
    res = json.loads(handle_list_clients({"ivdr_class": "D"}))
    assert res["count"] == 1
    assert res["data"][0]["client_id"] == "CLIENT-B"


def test_filter_by_ivdr_class_no_matches(vault):
    res = json.loads(handle_list_clients({"ivdr_class": "A"}))
    assert res["count"] == 0
    assert res["data"] == []


def test_invalid_ivdr_class(vault):
    res = json.loads(handle_list_clients({"ivdr_class": "E"}))
    assert res["success"] is False
    assert "ivdr_class" in res["error"]


def test_invalid_status(vault):
    res = json.loads(handle_list_clients({"status": "garbage"}))
    assert res["success"] is False
    assert "status" in res["error"]


def test_invalid_sort_by(vault):
    res = json.loads(handle_list_clients({"sort_by": "garbage"}))
    assert res["success"] is False
    assert "sort_by" in res["error"]


# ---------------------------------------------------------------------------
# Sorting
# ---------------------------------------------------------------------------

def test_sort_by_risk(vault):
    res = json.loads(handle_list_clients({"sort_by": "risk"}))
    levels = [r["risk_level"] for r in res["data"]]
    # high (A) → medium (B) → low (C)
    assert levels == ["high", "medium", "low"]


def test_sort_by_day_in_journey(vault):
    res = json.loads(handle_list_clients({"sort_by": "day_in_journey"}))
    days = [r["day_in_journey"] for r in res["data"]]
    # Longest first
    assert days == sorted(days, reverse=True)


def test_sort_by_phase(vault):
    res = json.loads(handle_list_clients({"sort_by": "phase"}))
    # Phase 0 → 3 → 5
    phases = [r["current_phase"] for r in res["data"]]
    assert phases[0].startswith("Phase 0")
    assert phases[-1].startswith("Phase 5")


def test_sort_by_next_due(vault):
    res = json.loads(handle_list_clients({"sort_by": "next_due"}))
    dues = [r["next_action_due"] for r in res["data"]]
    # 2026-05-28 (A) → 2026-06-01 (C) → 2026-06-30 (B)
    assert dues == ["2026-05-28", "2026-06-01", "2026-06-30"]


# ---------------------------------------------------------------------------
# Robustness
# ---------------------------------------------------------------------------

def test_empty_vault(tmp_path, monkeypatch):
    v = tmp_path / "vault"
    (v / "clients").mkdir(parents=True)
    monkeypatch.setenv("CONFORMLY_VAULT", str(v))
    res = json.loads(handle_list_clients({}))
    assert res["success"] is True
    assert res["count"] == 0


def test_missing_clients_dir(tmp_path, monkeypatch):
    v = tmp_path / "vault-no-clients"
    v.mkdir()
    monkeypatch.setenv("CONFORMLY_VAULT", str(v))
    res = json.loads(handle_list_clients({}))
    assert res["success"] is False
    assert "clients" in res["error"]


def test_no_vault(tmp_path, monkeypatch):
    monkeypatch.setenv("CONFORMLY_VAULT", str(tmp_path / "missing"))
    res = json.loads(handle_list_clients({}))
    assert res["success"] is False


def test_bad_client_file_is_skipped_not_raised(vault):
    # Drop in a malformed file alongside the good ones
    (vault / "clients" / "broken.md").write_text(
        "---\n: : : not yaml\n---\nbody",
        encoding="utf-8",
    )
    res = json.loads(handle_list_clients({}))
    # Good rows still come back; broken file appears in errors[]
    assert res["success"] is True
    assert res["count"] == 3  # the broken one is dropped
    assert any(e["file"] == "broken.md" for e in res["errors"])


# ---------------------------------------------------------------------------
# Schema sanity
# ---------------------------------------------------------------------------

def test_schema_shape():
    s = LIST_CLIENTS_SCHEMA
    assert s["name"] == "conformly_list_clients"
    assert "description" in s and len(s["description"]) > 80
    # All params optional — required key should be absent or empty
    required = s["parameters"].get("required", [])
    assert required == []
