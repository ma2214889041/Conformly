"""Tests for conformly_search_regulation."""

from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

_PLUGIN_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_PLUGIN_ROOT))

from tools.search_regulation import (  # noqa: E402
    SEARCH_REGULATION_SCHEMA,
    handle_search_regulation,
)


@pytest.fixture
def vault(tmp_path, monkeypatch):
    v = tmp_path / "vault"
    raw = v / "raw" / "regulations"
    notes = v / "notes" / "regulations"
    raw.mkdir(parents=True)
    notes.mkdir(parents=True)

    # raw: real-ish samples
    (raw / "IVDR-2017-746.md").write_text(
        "---\n"
        "doc_id: IVDR 2017/746\n"
        "type: regulation_text\n"
        "issuer: European Parliament\n"
        "language: EN\n"
        "full_title: 'In Vitro Diagnostic Medical Devices Regulation'\n"
        "---\n# IVDR\nText body about Annex XIII performance evaluation.\n",
        encoding="utf-8",
    )
    (raw / "MDCG-2022-2.md").write_text(
        "---\n"
        "doc_id: MDCG 2022-2\n"
        "type: regulation_summary\n"
        "issuer: MDCG\n"
        "full_title: 'Clinical evidence for IVDs'\n"
        "tags: [clinical, performance]\n"
        "---\n# MDCG 2022-2\nGuidance on clinical evidence.\n",
        encoding="utf-8",
    )
    (raw / "ISO-13485-2016_MOCK.md").write_text(
        "---\n"
        "doc_id: ISO 13485:2016\n"
        "type: iso_summary\n"
        "issuer: ISO\n"
        "full_title: 'QMS — Medical devices'\n"
        "---\nMock.\n",
        encoding="utf-8",
    )
    (raw / "CLSI-EP05-A3_MOCK.md").write_text(
        "---\n"
        "doc_id: CLSI EP05-A3\n"
        "type: clsi_summary\n"
        "issuer: CLSI\n"
        "full_title: 'Precision evaluation'\n"
        "tags: [precision, performance]\n"
        "---\nMock precision study.\n",
        encoding="utf-8",
    )
    # fake PDF
    (raw / "IVDR-2017-746.pdf").write_bytes(b"%PDF-1.4 fake pdf for testing\n")

    # curated qa note
    (notes / "ivdr-annex-xiii.md").write_text(
        "---\n"
        "doc_id: ivdr-annex-xiii\n"
        "type: qa_note\n"
        "tags: [annex-xiii, performance]\n"
        "---\n# Annex XIII\nCurated Q&A about CPS requirements.\n",
        encoding="utf-8",
    )
    # dotfile to be skipped
    (notes / ".gitkeep").write_text("", encoding="utf-8")
    # unsupported format
    (raw / "ignored.txt").write_text("nope", encoding="utf-8")

    monkeypatch.setenv("CONFORMLY_VAULT", str(v))
    return v


# ---------------------------------------------------------------------------
# Happy path
# ---------------------------------------------------------------------------

def test_returns_all_by_default(vault):
    res = json.loads(handle_search_regulation({}))
    assert res["success"] is True
    # 4 raw .md + 1 curated note + 1 pdf = 6 (txt + dotfile skipped, no stem dedupe yet)
    ids = [e["doc_id"] for e in res["data"]]
    # The IVDR PDF stem matches the IVDR md → dedup keeps the md
    assert "IVDR 2017/746" in ids
    assert "MDCG 2022-2" in ids
    assert "ISO 13485:2016" in ids
    assert "CLSI EP05-A3" in ids
    assert "ivdr-annex-xiii" in ids


def test_pdf_dedupe_with_md(vault):
    """Curated/raw md should shadow a same-stem PDF."""
    res = json.loads(handle_search_regulation({}))
    paths = [e["path"] for e in res["data"]]
    # The PDF is shadowed by the md sharing its stem
    assert not any(p.endswith("IVDR-2017-746.pdf") for p in paths)
    assert any(p.endswith("IVDR-2017-746.md") for p in paths)


def test_curated_note_shadows_raw(tmp_path, monkeypatch):
    """If notes/ has a file with the same stem as raw/, notes wins."""
    v = tmp_path / "vault"
    raw = v / "raw" / "regulations"
    notes = v / "notes" / "regulations"
    raw.mkdir(parents=True)
    notes.mkdir(parents=True)
    (raw / "MDCG-2022-2.md").write_text(
        "---\ndoc_id: raw-version\ntype: regulation_summary\n---\nraw",
        encoding="utf-8",
    )
    (notes / "MDCG-2022-2.md").write_text(
        "---\ndoc_id: curated-version\ntype: qa_note\n---\ncurated",
        encoding="utf-8",
    )
    monkeypatch.setenv("CONFORMLY_VAULT", str(v))
    res = json.loads(handle_search_regulation({}))
    assert len(res["data"]) == 1
    assert res["data"][0]["doc_id"] == "curated-version"


def test_entry_shape(vault):
    res = json.loads(handle_search_regulation({}))
    e = res["data"][0]
    for key in [
        "path", "absolute_path", "format", "source_dir",
        "doc_id", "title", "doc_type", "size_chars",
    ]:
        assert key in e, f"missing key {key}"


# ---------------------------------------------------------------------------
# doc_type bucketing
# ---------------------------------------------------------------------------

def test_filter_regulation_only(vault):
    res = json.loads(handle_search_regulation({"doc_type": "regulation"}))
    types = {e["doc_type"] for e in res["data"]}
    assert types == {"regulation"}
    assert any(e["doc_id"] == "IVDR 2017/746" for e in res["data"])


def test_filter_guidance_only(vault):
    res = json.loads(handle_search_regulation({"doc_type": "guidance"}))
    types = {e["doc_type"] for e in res["data"]}
    assert types == {"guidance"}
    assert any(e["doc_id"] == "MDCG 2022-2" for e in res["data"])


def test_filter_standard_only(vault):
    res = json.loads(handle_search_regulation({"doc_type": "standard"}))
    ids = {e["doc_id"] for e in res["data"]}
    assert ids == {"ISO 13485:2016", "CLSI EP05-A3"}


def test_filter_qa_note_only(vault):
    res = json.loads(handle_search_regulation({"doc_type": "qa_note"}))
    assert len(res["data"]) == 1
    assert res["data"][0]["doc_id"] == "ivdr-annex-xiii"


# ---------------------------------------------------------------------------
# Query filter
# ---------------------------------------------------------------------------

def test_query_substring_match_doc_id(vault):
    res = json.loads(handle_search_regulation({"query": "ISO"}))
    ids = [e["doc_id"] for e in res["data"]]
    assert ids == ["ISO 13485:2016"]


def test_query_substring_match_title(vault):
    res = json.loads(handle_search_regulation({"query": "precision"}))
    # Both CLSI (title says precision) and the annex xiii note (tag says
    # performance, not precision) — only CLSI should match
    ids = [e["doc_id"] for e in res["data"]]
    assert "CLSI EP05-A3" in ids


def test_query_matches_tag(vault):
    res = json.loads(handle_search_regulation({"query": "annex-xiii"}))
    ids = [e["doc_id"] for e in res["data"]]
    assert ids == ["ivdr-annex-xiii"]


def test_query_case_insensitive(vault):
    a = json.loads(handle_search_regulation({"query": "mdcg"}))
    b = json.loads(handle_search_regulation({"query": "MDCG"}))
    assert a["count"] == b["count"] == 1


def test_query_no_match(vault):
    res = json.loads(handle_search_regulation({"query": "zzznonexistent"}))
    assert res["count"] == 0


# ---------------------------------------------------------------------------
# include_pdfs
# ---------------------------------------------------------------------------

def test_include_pdfs_default(vault):
    """Default include_pdfs=True, but the same-stem md still shadows the pdf."""
    res = json.loads(handle_search_regulation({}))
    formats = {e["format"] for e in res["data"]}
    # No PDF surfaces because of stem-dedupe
    assert "pdf" not in formats


def test_include_pdfs_false_with_unique_pdf(tmp_path, monkeypatch):
    v = tmp_path / "vault"
    raw = v / "raw" / "regulations"
    raw.mkdir(parents=True)
    (raw / "uniquedoc.pdf").write_bytes(b"%PDF-1.4 fake\n")
    monkeypatch.setenv("CONFORMLY_VAULT", str(v))
    with_pdf = json.loads(handle_search_regulation({"include_pdfs": True}))
    no_pdf = json.loads(handle_search_regulation({"include_pdfs": False}))
    assert with_pdf["count"] == 1
    assert no_pdf["count"] == 0


# ---------------------------------------------------------------------------
# Robustness
# ---------------------------------------------------------------------------

def test_invalid_doc_type(vault):
    res = json.loads(handle_search_regulation({"doc_type": "bogus"}))
    assert res["success"] is False
    assert "doc_type" in res["error"]


def test_invalid_include_pdfs(vault):
    res = json.loads(handle_search_regulation({"include_pdfs": "yes"}))
    assert res["success"] is False


def test_invalid_query_type(vault):
    res = json.loads(handle_search_regulation({"query": 42}))
    assert res["success"] is False


def test_no_vault(tmp_path, monkeypatch):
    monkeypatch.setenv("CONFORMLY_VAULT", str(tmp_path / "nope"))
    res = json.loads(handle_search_regulation({}))
    assert res["success"] is False


def test_missing_regulation_dirs(tmp_path, monkeypatch):
    v = tmp_path / "vault-empty"
    v.mkdir()
    monkeypatch.setenv("CONFORMLY_VAULT", str(v))
    res = json.loads(handle_search_regulation({}))
    # No regs dir is fine — just returns empty
    assert res["success"] is True
    assert res["count"] == 0


# ---------------------------------------------------------------------------
# Schema sanity
# ---------------------------------------------------------------------------

def test_schema_shape():
    s = SEARCH_REGULATION_SCHEMA
    assert s["name"] == "conformly_search_regulation"
    assert len(s["description"]) > 100
    # All params optional
    assert s["parameters"].get("required", []) == []
