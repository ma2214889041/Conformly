---
name: conformly-nb-letter-triage
description: "Parse a Notified Body letter (BSI, TÜV SÜD, DEKRA, etc.) and produce a structured response plan: deficiencies list, severity, clock-stop status, required evidence, and a draft reply skeleton."
version: 0.1.0
author: Conformly
license: Proprietary
metadata:
  hermes:
    tags: [conformly, notified-body, deficiency, ivdr, response]
    vault_required: true
---

# conformly-nb-letter-triage — Process incoming Notified Body correspondence

Use when the user provides (or points to) a letter from a Notified Body, e.g.:

- "BSI 又发了 deficiency 信,看看怎么回"
- "Triage this NB letter: <pasted content or file path>"
- "What's the clock-stop impact of this?"

## Procedure

1. **Ingest**
   - If user pasted text → work directly.
   - If user gave a file path → read `$CONFORMLY_VAULT/raw/nb_letters/<file>` (PDF or text).
   - Save a copy to `$CONFORMLY_VAULT/raw/nb_letters/<date>-<NB>-<client-id>.pdf` if not already there.

2. **Extract these fields** (always populate; mark TBD if absent):

   | Field | Source |
   |-------|--------|
   | NB name + number (e.g., BSI Netherlands NB 2797) | letterhead |
   | Date issued | header |
   | Reference number (Project / TF ID) | subject line |
   | Client / device referenced | subject or §1 |
   | Type | Deficiency / Major NC / Minor NC / Approval / Suspension |
   | Clock-stop status | "the clock has been stopped on…" language |
   | Response deadline | usually 30 / 60 / 90 days from issue date |

3. **Enumerate deficiencies**
   For each finding, produce one row:

   | # | Section cited | IVDR / std reference | Issue (1 sentence) | Severity | Evidence needed |
   |---|----|----|----|----|----|
   | D1 | TF §4.2 Analytical performance | IVDR Annex I §9.1(a); CLSI EP05-A3 | Precision data only n=5 days, requires 20 | **Major** | New precision study or justification why n=5 is acceptable |
   | D2 | … | … | … | … | … |

4. **Map to vault**
   For each deficiency, suggest WHERE the response evidence lives or will live:
   - existing study report? → cite `projects/<id>/submissions/<doc>`
   - missing data? → add to `projects/<id>/gaps.md`
   - regulation interpretation? → invoke `conformly-regulation-lookup`

5. **Update client file**
   Append to `clients/<client-id>.md` § "关键沟通记录":
   ```
   - <date> — <NB> letter ref <ref>: <N> deficiencies, <Major/Minor count>, clock-stopped: <yes/no>
   ```
   And update `risk_flags:` frontmatter if any deficiency raises a previously unflagged risk.

6. **Draft response skeleton** (do NOT auto-send)
   Write to `projects/<client-id>-cps-<year>/submissions/<date>-response-draft.md`:

   ```markdown
   # Response to <NB> Deficiency Letter <ref>

   Dear <NB contact>,

   We acknowledge receipt of your letter dated <date> and the <N> findings listed therein.
   Please find our point-by-point responses below.

   ## D1 — <issue title>
   **NB finding:** <verbatim>
   **Conformly response:** [DRAFT — fill in]
   **Supporting evidence:** [attach: <filename>]

   ## D2 — …
   ```

7. **Output summary to the user**
   - Total findings + severity breakdown
   - Whether clock is stopped
   - Top 3 highest-risk items
   - Suggested response timeline (work backward from deadline, build in 1 week QA buffer)

## Hard rules

- **Never** auto-send to the NB. Always end with: "Draft saved. Review with your RA lead before sending."
- **Never** classify a Major finding as Minor to make the user feel better. Severity follows the NB's own language if stated; otherwise apply IMDRF GHTF/SG3/N18 criteria.
- **Always** record clock-stop status — it determines the regulatory timeline downstream.
- If the letter is in a language you can't reliably parse (e.g. Italian, German), translate to English first, then flag the translation as machine-generated.
