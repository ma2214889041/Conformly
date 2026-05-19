---
doc_id: DEV-SPEC-001
title: "Device Description and Intended Purpose"
version: "2.3"
status: released
owner: "Engineering"
uploaded: 2026-04-02
ivdr_annex: "II §1"
---

# Device Description — Sample Handling Module (SHM-7300)

## 1. Intended Purpose

The Sample Handling Module SHM-7300 is an automated sample preparation and
aliquoting subsystem intended for use in central clinical laboratories. It
performs the following functions on patient samples (nasopharyngeal swabs,
plasma, serum, EDTA whole blood):

- Barcode-controlled sample identification
- Lysis buffer dispensing (50–500 µL adjustable)
- Aliquoting into the downstream molecular-diagnostic assay carrier
- On-board QC and operator confirmation

The device is **not** intended for self-test or near-patient testing.

## 2. Classification

Per IVDR Rule 3(b) Annex VIII, the device is classified **Class C** when paired
with downstream assays whose results inform management of life-threatening
conditions (e.g. SARS-CoV-2, Influenza A/B). Final classification is locked
on the basis of the integrated system intended purpose (see PEP-001 §1).

## 3. Materials

| Component | Material | Patient contact |
|-----------|----------|-----------------|
| Sample chamber | PMMA, medical grade | indirect (aerosol path) |
| Aliquot tip | Polypropylene, USP Class VI | direct |
| Reagent reservoir | HDPE | none |
| Internal tubing | PTFE | none |

## 4. Software

The device runs embedded firmware **MoleQ-Analytica v2.3** for pipetting
control, barcode reading, and result interpretation. Software safety
classification is provisionally **Class B per IEC 62304** based on the
hazard analysis in RA-003; final classification awaits sign-off after the
Q2-2026 design review.

## 5. Performance specification (summary)

| Parameter | Target | Tested |
|-----------|--------|--------|
| Aliquot volume accuracy (CV) | ≤ 2 % | 1.4 % (CLSI EP05-A3, VAL-205) |
| Cross-contamination rate | < 1 × 10⁻⁴ | 8 × 10⁻⁵ (VAL-208) |
| Time-to-result (per sample) | ≤ 90 s | 78 s mean (VAL-209) |
| Real-time stability (claimed) | 24 months | **9 months — gap** (STAB-003) |

## 6. Open issues

- §5 stability claim does **not** yet have evidence to 24 months — see
  evidence-gap g1.
- §4 software classification not yet locked — see suggestion s2.

---

*This document is the source of truth for the device intended purpose. Any
analysis Conformly produces that references intended purpose must cite this
file.*
