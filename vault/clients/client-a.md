---
client_id: CLIENT-A
codename: "Shenzhen MoleQ Diagnostics"
country: CN
contact_lang: [en, zh]
ivd_class: C
product_type: "Molecular IVD — Multiplex RT-PCR Kit"
indication: "Respiratory viral panel (Influenza A/B, RSV, SARS-CoV-2)"
current_phase: "Phase 3 — SUBMISSION"
green_lights_passed: []
nb: "BSI Netherlands (NB 2797)"
opened: 2025-11-04
last_contact: 2026-05-12
status: active
risk_flags: ["NB clock-stop possible", "Clinical evidence gap on RSV strain coverage"]
---

# Client A — Shenzhen MoleQ Diagnostics (codename)

> Demo / mock data. Company, product, and dates are fictional.

## 1. Company

- HQ: Shenzhen, Nanshan district
- Founded: 2017
- Leadership: CEO Dr. Liang Wei (ex-BGI), CTO Dr. Sun Min (12 years molecular diagnostics)
- Existing markets: NMPA Class III (2022), Southeast-Asia (5 markets)
- EU strategy: first EU launch with a respiratory multiplex PCR panel

## 2. Product

| Field | Value |
|-------|-------|
| Trade name | MoleQ Respi-4 Panel |
| Intended Purpose | Qualitative nucleic-acid detection of Flu A/B, RSV, SARS-CoV-2 from nasopharyngeal swabs |
| Use setting | Central lab + mid-size hospital |
| IVDR classification | **Class C** (Rule 3(a) — detection of transmissible agents) |
| Reference standard | RT-PCR + sequencing |
| Software | Yes — embedded interpretation algorithm (MoleQ-Analytica v2.3) |

## 3. Regulatory route

- **Conformity assessment**: Annex IX (full QMS + Tech Doc assessment)
- **Notified Body**: BSI Netherlands (NB 2797) — contract signed, submission window 2026 Q3
- **CPS required**: yes (Class C + new analytical claim)
- **EU Authorised Representative**: Obelis (Brussels) — appointed

## 4. Current progress

See [[cps-workflow]](../notes/procedures/cps-workflow.md).

- Phase 0 — Evaluation completed (2025-12)
- Phase 1 — Site selection: lead site Ospedale San Raffaele (Milan)
- Phase 2 — Quotation: contract signed for € 487,000
- Phase 2.5 — Protocol writing v1.4 finalised
- Phase 3 — SUBMISSION (**current**)
  - CE submission 2026-03-18
  - Waiting for Parere Unico (expected 2026-05-28)
  - MinSal application not yet filed
- GREEN LIGHT #1 — Admin & RA (not passed)

## 5. Risks

| # | Issue | Severity | Mitigation |
|---|-------|----------|------------|
| R1 | RSV clinical evidence underpowered (est. n=42, need n>=80) | High | Activate 2 satellite sites (Bologna + Padova) |
| R2 | Software v2.3 missing IEC 62304 documentation | High | Client engineering to deliver by 2026-06-15 |
| R3 | Multilingual IFU coverage incomplete (Article 17) | Medium | Phased rollout agreed with Obelis |
| R4 | BSI auditor capacity tight in 2026 Q3 | Medium | Slot locked for 2026-09 |

## 6. Recent communications

- 2026-05-12 — Call with CTO Sun Min: confirmed RSV satellite-site plan
- 2026-04-30 — BSI email: request for additional Annex II stability data in IFU
- 2026-04-15 — Video call with PI Prof. Rossi (San Raffaele): protocol amendment #1 reviewed

## 7. Next actions

- [ ] 2026-05-28 — Follow up CE Parere Unico decision
- [ ] 2026-06-01 — Start MinSal application package
- [ ] 2026-06-15 — Client software IEC 62304 documentation deadline
- [ ] 2026-06-30 — Confirm feasibility of Bologna + Padova satellite sites

## 8. File index

- Raw inputs: `raw/clients/client-a/` (to be uploaded by client)
- NB letters: `raw/nb_letters/` (2026-04-30 BSI email pending archive)
- Project log: `projects/client-a-cps-2026/`
