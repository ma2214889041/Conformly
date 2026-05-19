---
name: conformly-regulation-lookup
description: "Answer IVDR / MDCG / ISO / CLSI regulatory questions by retrieving from the Conformly Vault's regulation library. Cites the source document and section number; refuses to fabricate when sources are silent."
version: 0.1.0
author: Conformly
license: Proprietary
metadata:
  hermes:
    tags: [conformly, ivdr, mdcg, iso, regulation, rag]
    vault_required: true
---

# conformly-regulation-lookup — Regulation Q&A with citations

Use this skill when the user asks substantive regulatory questions, e.g.:

- "Class C IVD 提交 NB 前需要哪些临床证据?"
- "What does MDCG 2022-2 say about analytical performance?"
- "IVDR Annex XIII 对 CPS Report 有什么要求?"
- "ISO 13485 §7.3 设计开发输出要包括什么?"

## Procedure

1. **Triage the question**
   Classify into ONE of:
   - `IVDR` (the regulation itself, 2017/746)
   - `MDCG` (Medical Device Coordination Group guidance)
   - `ISO` (13485, 14971, 15189, 17511, etc.)
   - `CLSI` (EP05, EP06, EP09, EP17, EP21, etc.)
   - `general` (no clear category — ask user)

2. **Locate sources**
   - Primary: `$CONFORMLY_VAULT/raw/regulations/` (PDF + markdown summaries)
   - Curated notes: `$CONFORMLY_VAULT/notes/regulations/<topic>.md` (if exists, prefer these — they're already Conformly-vetted)
   - For PDFs (e.g. `IVDR-2017-746.pdf`): use the `read_pdf` or `pdf_text` tool. If unavailable, tell the user PDF parsing is needed and suggest they run a pdf-to-text extraction first.

3. **Retrieve & synthesize**
   - Quote at most 2 short passages (≤80 words each) per source.
   - **Always** include: document ID, article/annex/section, page number if known.
   - If the question requires combining IVDR + MDCG + ISO, structure the answer in three sections.

4. **Answer template:**

   ```
   ## <Question restated>

   **Short answer (1–2 sentences):**
   <plain-language summary>

   **Sources:**
   1. **IVDR Article 56(3)** — "<quote>"
      Source: raw/regulations/IVDR-2017-746.pdf, p.XX
   2. **MDCG 2022-2 §4.3** — "<quote>"
      Source: raw/regulations/MDCG-2022-2_Performance-Evaluation.md
   3. **ISO 13485:2016 §7.3.3** — <paraphrase, since ISO is copyrighted>

   **Practical implication for the client:**
   <2–3 bullet points; if a specific client is in context, tie back to their file>

   **What this skill cannot tell you:**
   <honest gap: e.g., "MDCG 2022-2 doesn't address single-use IFU labelling — see MDCG 2020-4 instead">
   ```

## Hard rules

- **Never** quote ISO / CLSI verbatim — they're copyrighted. Paraphrase only.
- **Never** invent a section number. If unsure, say "exact section not located in vault; recommend checking the official text".
- **Never** give legal advice. Always end the response with: "This is informational only; final compliance position must be confirmed with your QA/RA lead and the Notified Body."
- If the vault returns no hits, say so explicitly. Do not hallucinate.

## Vault expansion hook

When you successfully answer a question, suggest to the user:
> "Want me to save this Q&A as a curated note in `notes/regulations/`? That way next time the answer is cached."

If the user agrees, write to `$CONFORMLY_VAULT/notes/regulations/<slug>.md` with frontmatter `{type: qa_note, question: ..., last_verified: <date>, sources: [...]}`.
