---
name: conformly-client-onboarding
description: "Onboard a new IVD-manufacturer client by collecting required intake information, classifying the device under IVDR, and generating a starter client file + project log in the Conformly Vault."
version: 0.1.0
author: Conformly
license: Proprietary
metadata:
  hermes:
    tags: [conformly, onboarding, ivdr, classification]
    vault_required: true
---

# conformly-client-onboarding — Add a new IVD-manufacturer client

Use when the user says:

- "We have a new client, let's set them up."
- "新客户进来了,帮我建档"
- "Onboard <company name>."

## Procedure

### Phase 1 — Intake (ask the user these in order; stop after 2–3 questions per turn)

1. **Company basics**: legal name (global + English), HQ city, founding year, key personnel.
2. **Product**: trade name, intended purpose, sample type, target analyte(s).
3. **Existing markets**: what regulatory clearances already held? (NMPA, FDA, ASEAN, etc.)
4. **EU strategy**: first time in EU? Self-test (Class B+)? Companion diagnostic?
5. **Tech features**: software embedded? AI/ML algorithm? Sample-to-answer or open?
6. **Reference standard**: what method is the new IVD compared against?

### Phase 2 — IVDR Classification (Annex VIII rules)

Apply Rules 1–7 from IVDR Annex VIII. Use this decision aid:

| Question | Yes → | No → |
|----------|-------|------|
| Detects transmissible agents in blood/tissue intended for transfusion/transplant? | Rule 1 → **Class D** | next |
| Detects HIV/HCV/HBV/HTLV in blood donation, or assigns infectious load? | Rule 1 → **Class D** | next |
| Detects transmissible agent with high individual/public-health risk? | Rule 2 → **Class C/D** (depending on disclosability) | next |
| Detects HLA for transplant? Cancer markers? CSF/sterile body fluid? | Rule 3 → **Class C** | next |
| Self-test, except pregnancy/cholesterol? | Rule 4 → **Class C** | next |
| Companion diagnostic? Genetic testing? Disease staging? | Rule 3 → **Class C** | next |
| Reagents / instruments / specimen receptacles? | Rule 5 → **Class A** | next |
| Otherwise | Rule 6 → **Class B** | — |

Record the rule applied AND the rationale.

### Phase 3 — Generate client file

Write to `$CONFORMLY_VAULT/clients/<client-id>.md` using this exact frontmatter schema:

```yaml
---
client_id: <UPPER-KEBAB>
codename: "<Anglicized company name>"
country: <ISO 3166>
contact_lang: [zh, en, ...]
ivd_class: <A|B|C|D>
ivdr_rule_applied: <e.g., "Annex VIII Rule 3(a)">
product_type: "<short>"
indication: "<one line>"
current_phase: "Phase 0 — Evaluation"
green_lights_passed: []
nb: "<TBD or named>"
opened: <YYYY-MM-DD>
last_contact: <YYYY-MM-DD>
status: active
risk_flags: []
---
```

Then populate the 8 standard sections (company / product / regulatory path / current progress / risks / comms / next actions / file index) — copy structure from `clients/client-a.md` as the template.

### Phase 4 — Spin up project log

Create `$CONFORMLY_VAULT/projects/<client-id>-cps-<year>/README.md` with:
- Project kickoff date
- Estimated milestones (Phase 1 → Phase 6) using the CPS workflow as backbone
- Empty `meetings/`, `submissions/`, `monitoring/` subfolders

### Phase 5 — Commit

Run `cd $CONFORMLY_VAULT && git add -A && git commit -m "onboard: <client-id>"`.

## Hard rules

- **Never** commit PII (customer contact emails, phone numbers, patient IDs). Codename only.
- **Always** record the IVDR rule applied + rationale — auditors check this.
- If the user can't answer a Phase-1 question, leave the field as `TBD` in frontmatter rather than guessing.
