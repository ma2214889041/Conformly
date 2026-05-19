---
doc_id: GSPR-Checklist
type: qa_note
issuer: Conformly (curated)
source: "IVDR (EU) 2017/746 Annex I (General Safety and Performance Requirements)"
status: curated
language: EN
last_verified: 2026-05-19
tags: [gspr, annex-i, checklist, mandatory]
---

# IVDR Annex I — GSPR Checklist (curated)

Curated summary of the General Safety and Performance Requirements. Each
clause below is what manufacturers MUST demonstrate in their technical
documentation. Used by `conformly_gspr_gap_analyzer` to score a client's
file against the regulation. Numbering follows IVDR Annex I.

For the authoritative wording, refer to `raw/regulations/IVDR-2017-746.pdf`.

---

## Chapter I — General requirements

### GSPR-1 — Safe and effective use
The device must achieve its intended purpose under normal conditions of use, without compromising the clinical condition or safety of patients, users, and others. Risks must be acceptable when weighed against the benefit.

### GSPR-2 — Risk management lifecycle
A documented, iterative risk-management process compliant with ISO 14971:2019 — applied across design, manufacture, and post-market lifecycle.

### GSPR-3 — Risk-reduction priority
Risks must be eliminated or reduced as far as possible (inherently safe design), then protected against, then disclosed via information for safety.

### GSPR-4 — Performance characteristics
Devices must achieve the performance claimed by the manufacturer, supported by scientific validity, analytical performance, and clinical performance.

### GSPR-5 — Lifetime
Performance must be maintained throughout the device's stated lifetime under intended-use conditions.

### GSPR-6 — Transport and storage
Performance and characteristics must not be adversely affected by transport and storage within manufacturer-specified limits.

### GSPR-7 — Benefit-risk
All known and foreseeable risks must be minimised and must remain acceptable in light of the benefits.

---

## Chapter II — Performance, design, and manufacture

### GSPR-8 — Chemical / physical / biological properties
Choice of materials, biocompatibility, microbial / particulate contamination control, sterility for sterile devices.

### GSPR-9 — Analytical performance
Demonstrate analytical sensitivity, analytical specificity, accuracy (trueness + precision), linearity, range, LoD, LoQ, interfering substances, cross-reactivity — per CLSI EP05/06/07/09/17 or equivalent.

### GSPR-10 — Clinical performance
Demonstrate clinical sensitivity & specificity, PPV / NPV, expected values, robustness across the intended patient population. Typically requires a Clinical Performance Study (CPS) per Annex XIII.

### GSPR-11 — Self-test / near-patient testing
Devices intended for lay users or POC settings require usability validation (IEC 62366-1) and human-factors evidence.

### GSPR-12 — Calibration and traceability
Calibrators and controls traceable to higher-order reference materials and methods where available (ISO 17511).

### GSPR-13 — Sample handling
Specify sample type, collection, transport, and stability conditions. Pre-analytical performance documented.

### GSPR-14 — Protection against radiation, electrical, mechanical, thermal hazards
Where applicable (e.g., instrumentation).

### GSPR-15 — Software lifecycle
Compliance with IEC 62304 — safety classification (A/B/C), SOUP analysis, verification & validation, post-market software maintenance.

### GSPR-16 — Active devices
Energy supply, alarms, fault-tolerance, redundancy where the device's failure would impact safety.

### GSPR-17 — Combination devices
Devices using substances, including medicinal products, must demonstrate the appropriate regulatory pathway.

---

## Chapter III — Information supplied with the device

### GSPR-18 — Label
Must include: device name, manufacturer, UDI-DI, batch / serial number, sterility status, "for in vitro diagnostic use", "for self-testing" / "for near-patient testing" where applicable.

### GSPR-19 — Instructions for use (IFU)
Must include: intended purpose, target population, contraindications, warnings, performance characteristics, sample handling, interpretation guidance — and **must be supplied in the official EU language(s) of every Member State where the device is placed on the market** (Article 17).

### GSPR-20 — Summary of safety and performance (SSP)
Class C and Class D devices must publish an SSP via EUDAMED (template: MDCG 2022-9).

---

## Conformity-assessment touchpoints

| Class | Conformity route | NB involvement |
|-------|-----------------|----------------|
| A     | Annex II (manufacturer's declaration) | No |
| A (sterile) | Annex IX (NB for sterility aspects only) | Limited |
| B     | Annex IX (QMS) + Annex II (Tech Doc declaration) | NB on QMS only |
| C     | Annex IX (QMS + Tech Doc) | Full NB assessment |
| D     | Annex IX (QMS + Tech Doc) + Article 48(6) EMA opinion + EU reference lab | Full + EMA + EURL |

---

*Curated by Conformly. Last verified 2026-05-19. This is a working aid, not legal advice — defer to the verbatim regulation text and your Notified Body.*
