---
doc_id: PEP-001
title: "Performance Evaluation Plan"
version: "0.9"
status: draft
owner: "Performance lab"
uploaded: 2026-04-10
ivdr_annex: "XIII Part A"
---

# Performance Evaluation Plan — SHM-7300 (v0.9)

## 1. Scope

Plan for demonstrating analytical and clinical performance of the SHM-7300
sample-handling module per IVDR Annex XIII Part A and the relevant CLSI EP
series.

## 2. Studies

| ID | Study | Standard | Status |
|----|-------|----------|--------|
| VAL-203 | Analytical specificity / interferences | CLSI EP07 + internal SOP | ✅ complete (Apr 03) |
| VAL-204 | Linearity / quantitative aliquot accuracy | CLSI EP06 | ✅ complete (Mar 25) |
| VAL-205 | Precision (repeatability + reproducibility) | **Internal SOP** ⚠ | ✅ complete but standard ref weak (Mar 12) |
| VAL-208 | Cross-contamination | Internal SOP | ✅ complete |
| VAL-209 | Time-to-result | Internal SOP | ✅ complete |
| VAL-210 | Clinical sensitivity / specificity | MDCG 2022-2 §3 | 🟡 96 of 200 samples enrolled |
| VAL-211 | Method comparison (vs predicate K2150) | CLSI EP09-A3 | 🟢 protocol drafted, study not started |

## 3. Open methodological gap

Section 4.3 of this plan currently references **internal SOP SOP-LAB-019** for
the precision study. Notified Bodies expect explicit alignment to **CLSI
EP05-A3** (3 levels × 5 days × 5 replicates, total 75 measurements per level).

Investigation showed our internal protocol is mathematically equivalent (same
design depth, same statistical extraction). Recommend updating §4.3 to cite
CLSI EP05-A3 directly and adding an appendix mapping internal SOP terminology
to the standard's terminology. **Owner: M. Chen · target 2026-05-30.**

## 4. Clinical performance

Single-site enrolment at Hôpital Européen (Paris) is at 96/200 samples. MDCG
2022-2 §3 indicates that clinical performance evidence for Class C IVD should
include at least one confirmatory site. The plan currently does not commit
to multi-site enrolment — this will be flagged in NB review (predicted
finding F-007).

---

*Reviewed by: M. Chen · 2026-04-10. Pending RA approval before V&V freeze.*
