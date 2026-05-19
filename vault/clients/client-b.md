---
client_id: CLIENT-B
codename: "Beijing OncoGene Bio"
country: CN
contact_lang: [en, zh]
ivd_class: D
product_type: "Companion Diagnostic — NGS panel"
indication: "EGFR / KRAS / BRAF mutation detection for lung & colorectal cancer therapy selection"
current_phase: "Phase 0 — Evaluation"
green_lights_passed: []
nb: "TBD (shortlisted: TUV SUD, DEKRA)"
opened: 2026-04-22
last_contact: 2026-05-15
status: active
risk_flags: ["Class D = highest scrutiny", "CDx requires EMA opinion (Article 48(6))", "No prior EU NB engagement"]
---

# Client B — Beijing OncoGene Bio (codename)

> Demo / mock data.

## 1. Company

- HQ: Beijing, Zhongguancun
- Founded: 2014, public since 2023
- Leadership: CEO Dr. Zhang Hua (ex Foundation Medicine, China)
- Existing markets: NMPA Class III (2023), HSA Singapore (2024)
- EU strategy: co-launch with Roche / AstraZeneca's lung-cancer targeted therapies

## 2. Product

| Field | Value |
|-------|-------|
| Trade name | OncoTarget Lung-CRC v3 |
| Intended Purpose | FFPE-tissue detection of EGFR/KRAS/BRAF hotspot mutations to guide EGFR-TKI / KRAS G12C inhibitor selection |
| Platform | Illumina NextSeq 550Dx + proprietary bioinformatics pipeline |
| IVDR classification | **Class D** (Rule 3(g) — companion diagnostic) |
| Software | Yes — bioinformatics pipeline OncoCall v3.1 (ML variant calling) |

## 3. Regulatory route

- **Conformity assessment**: Annex IX (QMS + Tech Doc) + **Article 48(6) EMA scientific opinion** (CDx mandatory)
- **NB**: pending — evaluating TUV SUD vs DEKRA
- **CPS required**: yes (Class D, mandatory)
- **EU Authorised Representative**: not yet appointed

## 4. Current progress

See [[cps-workflow]](../notes/procedures/cps-workflow.md).

- Phase 0 — Evaluation (**current**)
  - Manufacturer kickoff (2026-05-02)
  - Product evaluation in progress
  - Lead site selection not started (candidates: Istituto Europeo di Oncologia Milano, IRCCS Candiolo)
- Phases 1 -> 6 not started

## 5. Risks

| # | Issue | Severity | Mitigation |
|---|-------|----------|------------|
| R1 | Class D review cycle long (EMA + NB), expected EU launch in 30+ months | High | Set expectations with client; prioritise EFS application |
| R2 | CDx requires pharma sponsorship letter; Roche/AZ China subs do not directly sponsor | High | Escalate to client headquarters |
| R3 | ML bioinformatics pipeline lacks IVDR Annex I §16 (software) documentation | High | Recommend outsourced IEC 62304 / 14971 work |
| R4 | Chinese cohort representativeness for European patients | Medium | Plan European multicentre supplementary cohort |

## 6. Recent communications

- 2026-05-15 — Video call with CEO Dr. Zhang: confirmed 30-month timeline acceptable
- 2026-05-02 — Kickoff: product overview, Conformly draft IVDR gap analysis

## 7. Next actions

- [ ] 2026-05-30 — Deliver IVDR gap analysis report
- [ ] 2026-06-10 — NB shortlist meeting (TUV SUD)
- [ ] 2026-06-25 — Pharma partner coordination (Roche EU)
- [ ] 2026-07-15 — Lead site visit (IEO Milano)

## 8. File index

- Raw inputs: `raw/clients/client-b/` (to be uploaded by client)
- Project log: `projects/client-b-cps-2026/`
