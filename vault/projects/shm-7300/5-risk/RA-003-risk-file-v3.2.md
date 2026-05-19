---
doc_id: RA-003
title: "Risk Analysis File"
version: "3.2"
status: released
owner: "Quality"
uploaded: 2026-05-12
ivdr_annex: "II §5"
standard: "ISO 14971:2019"
---

# Risk Analysis — SHM-7300 (v3.2)

## Change history

| Version | Date       | Author    | Summary |
|---------|------------|-----------|---------|
| 3.0     | 2026-02-14 | M. Chen   | Initial release after design freeze |
| 3.1     | 2026-04-02 | M. Chen   | Added H-019 (calibration drift) |
| **3.2** | **2026-05-12** | **M. Chen** | **Added H-024 (aerosol carry-over), H-031 (operator omission)** |

## Hazard register (extract)

The full register lives in the QMS; the table below is the audit excerpt
Conformly reads.

| # | Category | Hazard | Severity | Probability | Risk | Control | Residual |
|---|----------|--------|----------|-------------|------|---------|----------|
| H-001 | Energy | Electrical shock from power supply fault | Serious | Remote | Medium | Reinforced insulation per IEC 61010 | Acceptable |
| H-008 | Biological | Patient sample cross-contamination | Serious | Possible | High | Single-use cartridges; automated wash cycle | Acceptable |
| H-012 | Information | Misinterpretation of qualitative result | Serious | Possible | High | Result interpretation guide in IFU; training video | Acceptable |
| H-019 | Software | Calibration drift undetected by software | Critical | Remote | Medium | Daily QC routine; automatic flagging | Acceptable |
| **H-024** | **Chemical** | **Aerosol carry-over between samples** | **Serious** | **Possible** | **High** | **Closed-loop airflow** | **Unverified** ⚠ |
| H-031 | Use-related | Operator omits sample volume verification | Moderate | Possible | Medium | Software prompt with confirmation step | Acceptable |

## Open items

- **H-024** — Closed-loop airflow control measure is defined, but no
  verification protocol has been executed. Per ISO 14971 §7.3, an unverified
  control cannot be considered effective. Action: open verification protocol
  VP-H024 (owner: V&V team, target 2026-06-30).

- The risk-management report (ISO 14971 §8) is queued for refresh once H-024
  verification closes.

## Software linkage

Each software-implemented control (H-019 daily QC routine, H-024 closed-loop
airflow) carries a hazard identifier in the software requirements (SW-DOC-001
§5.2). Traceability coverage is currently **71 %** — Conformly has flagged
the remaining 29 % under suggestion s5.

---

*Approved: Dr S. Linder (Head of Quality) · 2026-05-12*
