---
doc_id: kb-tnb-22
title: "Team-NB Position Paper PP-22 — Software documentation expectations"
issuer: "Team-NB (European IVD Notified Bodies)"
type: position-paper
language: EN
status: harmonised
last_updated: 2025-01-15
---

Minimum software documentation expected by IVDR Notified Bodies

For Class A software (no possible injury):
  - Safety classification rationale (justifying Class A)
  - Software requirements specification
  - Release notes for each version placed on market

For Class B software (non-serious injury possible) — additional:
  - Software architecture description with hazard linkage
  - Software development plan
  - Verification & validation summary
  - SOUP analysis (commercial OS, libraries, frameworks)
  - Configuration management procedure
  - Problem resolution procedure

For Class C software (death or serious injury possible) — additional:
  - Detailed software design (modules, interfaces, data structures)
  - Unit-level verification evidence
  - Integration test reports
  - System test reports
  - Software hazard traceability matrix — 100 % coverage required

Cybersecurity expectations (added 2024)
  - Threat modelling per MDCG 2019-16 Rev. 1
  - Vulnerability disclosure policy
  - Security update procedure with documented patch SLAs
  - Post-market cybersecurity surveillance integrated with the PMS plan

Notified Bodies will not accept "see source code" as a substitute for any
of the above design documentation.
