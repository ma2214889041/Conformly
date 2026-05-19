---
name: conformly-cps-status
description: "Report a client's Clinical Performance Study (CPS) status against the 6-phase / 60+ step workflow. Tells the user where the client currently is, which GREEN LIGHT gates are passed, what blockers exist, and the immediate next deliverables."
version: 0.1.0
author: Conformly
license: Proprietary
metadata:
  hermes:
    tags: [conformly, cps, ivdr, client-status]
    vault_required: true
---

# conformly-cps-status — Client CPS Progress Report

Use this skill whenever the user asks about a specific client's progress, e.g.:

- "客户 MoleQ 到哪一步了?"
- "Where is Client A in the CPS workflow?"
- "What's blocking the submission for client X?"
- "下一步要交什么文件给 BSI?"

## Procedure

1. **Resolve client file**
   Read `$CONFORMLY_VAULT/clients/<client-id>.md`.
   The frontmatter contains: `current_phase`, `green_lights_passed`, `risk_flags`, `nb`, `ivd_class`.
   If the file doesn't exist, list `$CONFORMLY_VAULT/clients/*.md` and ask the user which one they mean.

2. **Cross-reference the workflow**
   Read `$CONFORMLY_VAULT/notes/procedures/cps-workflow.md`.
   Match `current_phase` to the Phase section to enumerate remaining sub-steps and the next GREEN LIGHT gate.

3. **Compose the report — use exactly this structure:**

   ```
   ## <Client codename> — CPS Status (<today's date>)

   **Current phase:** <phase name> (e.g., Phase 3 — SUBMISSION)
   **Class:** <A/B/C/D>  | **NB:** <notified body>
   **Last contact:** <date from frontmatter>

   ### ✅ Completed
   - <bullet list of completed phases / green lights>

   ### 🟡 In progress
   - <current sub-steps, with status markers from the client file>

   ### ⬜ Next milestones (next 30 days)
   - <pull from "下一步动作" section of the client file>

   ### ⚠️ Open risks
   - <risk table from client file, ordered by severity>

   ### 📎 Required deliverables to pass next GREEN LIGHT
   - <enumerate from cps-workflow.md for the current phase's gate>
   ```

4. **Language**: respond in the user's language (Chinese / English / Italian). The vault content is mixed (IT for Asana steps, EN for headers, ZH for risk notes) — translate inline if the user is asking in a different language.

5. **Do NOT invent dates or progress**. If the client file is silent on a step, mark it as ⬜ Unknown and recommend a question to ask the client.

## Output rules

- Keep the report under 400 words unless the user asks for more detail.
- End with **one** suggested follow-up question (e.g., "Want me to draft the MinSal submission cover letter?").
- If you spot a risk that's been open >30 days, surface it in **bold** at the top of the response.
