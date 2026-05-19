/**
 * Hand-curated demo scenarios. Each scenario is a sequence of timeline
 * events the conversation player renders one after another. Every payload
 * is the literal JSON shape the Python tools return — so the demo is
 * faithful to production, just frozen in time.
 *
 * Why pre-baked instead of live? Three reasons:
 *   1. Zero backend → demo cannot fail on stage.
 *   2. Zero LLM cost when the landing page is hit by curious visitors.
 *   3. Hides the user's GEMINI_API_KEY from public traffic.
 */

export type TimelineEvent =
  | { kind: "user"; text: string }
  | { kind: "thought"; text: string }
  | { kind: "tool_call"; tool: string; args: Record<string, unknown> }
  | { kind: "tool_result"; tool: string; data: unknown; durationMs?: number }
  | { kind: "assistant"; text: string }
  | { kind: "hitl"; prompt: string; decision: "approve" | "reject" | "pending" };

export type Scenario = {
  id: string;
  title: string;
  hook: string;       // one-sentence opener shown on the picker card
  duration: string;   // "~30s" etc
  description: string;
  timeline: TimelineEvent[];
};

export const SCENARIOS: Scenario[] = [
  {
    id: "nb-letter",
    title: "Act I — Parse a Notified Body letter",
    hook: "A BSI deficiency letter lands. The agent dissects it in 30 seconds.",
    duration: "~30 s",
    description:
      "Watch Conformly read a 4-page BSI deficiency letter, identify the clock-stop, extract every deficiency, map each to an IVDR clause, and pause for a human approval before drafting the response.",
    timeline: [
      {
        kind: "user",
        text:
          "Hi Conformly — we just got a BSI letter for CLIENT-A. It's in raw/nb_letters/2026-04-30-BSI-CLIENT-A.md. Please triage and tell me what to do.",
      },
      {
        kind: "thought",
        text:
          "User wants a triage of the BSI letter for CLIENT-A. I'll call conformly_parse_nb_letter on the file path.",
      },
      {
        kind: "tool_call",
        tool: "conformly_parse_nb_letter",
        args: {
          letter_path: "raw/nb_letters/2026-04-30-BSI-CLIENT-A.md",
          client_id: "CLIENT-A",
        },
      },
      {
        kind: "tool_result",
        tool: "conformly_parse_nb_letter",
        durationMs: 8200,
        data: {
          nb_name: "BSI Group The Netherlands B.V.",
          nb_number: "NB 2797",
          letter_reference: "NB2797-IVDR-2026-1184",
          date_issued: "2026-04-30",
          letter_type: "deficiency",
          clock_stopped: true,
          response_deadline: "2026-06-29",
          client_ref: "Shenzhen MoleQ Diagnostics",
          device_ref: "MoleQ Respi-4 Panel (UDI-DI 0481234567890)",
          deficiencies: [
            {
              id: "D1",
              section_cited: "TF §4.2.3",
              regulatory_reference: "IVDR Annex I §9.1(a); CLSI EP05-A3",
              issue:
                "Precision study used a truncated 5-day design instead of the harmonised 20×2×2.",
              severity: "Major",
              evidence_required:
                "Repeat the precision evaluation per CLSI EP05-A3, or provide a scientifically justified rationale referenced to the intended use.",
            },
            {
              id: "D2",
              section_cited: "CPS Protocol v1.4 §6.2",
              regulatory_reference: "IVDR Annex XIII Part A §1.2.3",
              issue:
                "Clinical RSV evidence n=42, lower 95% CI bound below the claimed ≥90% sensitivity.",
              severity: "Major",
              evidence_required:
                "Increase RSV positives to ≥80 (e.g., via Bologna + Padova satellite sites) OR revise the labelled sensitivity claim.",
            },
            {
              id: "D3",
              section_cited: "Technical File §7 (Software lifecycle)",
              regulatory_reference: "IEC 62304:2006/AMD 1:2015; IVDR Annex I §16",
              issue:
                "No IEC 62304 software lifecycle documentation for the MoleQ-Analytica v2.3 algorithm; safety class not declared.",
              severity: "Major",
              evidence_required:
                "Complete software design history file: safety classification rationale, SOUP analysis, V&V summary, post-market software maintenance plan.",
            },
            {
              id: "D4",
              section_cited: "Technical File §4.5; IFU §11",
              regulatory_reference: "IVDR Annex I §9.4",
              issue:
                "In-use stability supported only by accelerated 37°C data; no real-time data at 18–25°C.",
              severity: "Minor",
              evidence_required:
                "Real-time stability at intended-use storage conditions, OR amend the IFU claim.",
            },
          ],
          counts: { Critical: 0, Major: 3, Minor: 1, Observation: 0, total: 4 },
          source_path:
            "/conformly/vault/raw/nb_letters/2026-04-30-BSI-CLIENT-A.md",
          client_id: "CLIENT-A",
        },
      },
      {
        kind: "assistant",
        text:
          "Triaged. **4 findings, clock stopped, 60-day window (deadline 2026-06-29).** Three majors (precision design, RSV sample size, software documentation) and one minor (stability). The software gap is the deepest — IEC 62304 docs don't exist yet, so this is new work, not a justification exercise.\n\nI've drafted a point-by-point response skeleton and queued it for your approval before anything is sent to BSI.",
      },
      {
        kind: "hitl",
        prompt:
          "Send draft response to BSI Netherlands NB 2797 (4 findings)?",
        decision: "pending",
      },
    ],
  },

  {
    id: "gspr-gap",
    title: "Act II — GSPR gap analysis (IVDR Annex I)",
    hook: "One call. Annex I clause-by-clause. Long-context reasoning, no RAG.",
    duration: "~25 s",
    description:
      "Conformly reads the full curated GSPR checklist (20 clauses) plus the client dossier in one Gemini 2.5 Pro call. No vector DB, no embeddings — pure long-context long-context LLM design.",
    timeline: [
      {
        kind: "user",
        text:
          "Run a GSPR gap analysis for CLIENT-A. Focus on the software clauses — we need to know what's actually missing.",
      },
      {
        kind: "thought",
        text:
          "User wants Annex I gap analysis with a focus on software (GSPR-15 area). Calling conformly_gspr_gap_analyzer.",
      },
      {
        kind: "tool_call",
        tool: "conformly_gspr_gap_analyzer",
        args: {
          client_id: "CLIENT-A",
          focus_clauses: ["GSPR-9", "GSPR-10", "GSPR-15"],
        },
      },
      {
        kind: "tool_result",
        tool: "conformly_gspr_gap_analyzer",
        durationMs: 14500,
        data: {
          client_id: "CLIENT-A",
          ivdr_class: "C",
          current_phase: "Phase 3 — SUBMISSION",
          headline:
            "Class C respiratory PCR with a clean QMS posture but two structural performance gaps that the NB has already flagged in writing.",
          top_risks: ["GSPR-15", "GSPR-9", "GSPR-10"],
          summary: { addressed: 12, partial: 3, open: 4, n_a: 1, total: 20 },
          items: [
            {
              clause_id: "GSPR-1",
              clause_title: "Safe and effective use",
              status: "addressed",
              evidence:
                "Intended purpose well-defined; central lab + mid-size hospital; trained user only.",
              gap: "",
              recommended_action: "",
              priority: "low",
            },
            {
              clause_id: "GSPR-9",
              clause_title: "Analytical performance",
              status: "partial",
              evidence:
                "Precision, LoD, specificity, cross-reactivity all reported in TF §4.2.",
              gap:
                "Precision design is CLSI EP05-A3 non-conformant (5-day vs. 20-day). NB has cited this as Major (D1).",
              recommended_action:
                "Re-run precision per CLSI EP05-A3 20×2×2 OR submit a justified deviation referencing intended use.",
              priority: "high",
            },
            {
              clause_id: "GSPR-10",
              clause_title: "Clinical performance",
              status: "partial",
              evidence:
                "Active CPS at San Raffaele with 4 analytes; Flu A/B + SARS-CoV-2 meet pre-specified targets.",
              gap:
                "RSV positives n=42; 95% CI lower bound below ≥90% claim. Two satellite sites (Bologna + Padova) approved but not yet enrolled.",
              recommended_action:
                "Activate Bologna + Padova within 6 weeks; enrol ≥38 additional RSV positives.",
              priority: "high",
            },
            {
              clause_id: "GSPR-15",
              clause_title: "Software lifecycle",
              status: "open",
              evidence: "",
              gap:
                "No IEC 62304 documentation submitted. Safety classification not declared. SOUP inventory absent. NB Major (D3).",
              recommended_action:
                "Build software DHF: classify (Class B baseline likely), SOUP audit, V&V summary, PMS plan. Deadline 2026-06-15.",
              priority: "high",
            },
            {
              clause_id: "GSPR-11",
              clause_title: "Self-test / near-patient testing",
              status: "n/a",
              evidence: "",
              gap: "",
              recommended_action: "",
              priority: "low",
            },
            {
              clause_id: "GSPR-18",
              clause_title: "Label",
              status: "addressed",
              evidence: "UDI-DI assigned; batch + expiry encoded; CE-IVDR mark draft.",
              gap: "",
              recommended_action: "",
              priority: "low",
            },
            {
              clause_id: "GSPR-19",
              clause_title: "IFU language coverage",
              status: "partial",
              evidence:
                "IFU drafted in EN. Italian translation in review for the lead site.",
              gap:
                "Article 17 requires every official EU language of every Member State of placement. Phased rollout strategy proposed but not agreed with Obelis (EU AR).",
              recommended_action:
                "Confirm initial-launch country list with Obelis; commission translations for the agreed subset.",
              priority: "medium",
            },
            {
              clause_id: "GSPR-20",
              clause_title: "Summary of safety and performance (SSP)",
              status: "open",
              evidence: "",
              gap:
                "SSP draft pending; MDCG 2022-9 template not yet populated.",
              recommended_action:
                "Draft SSP after RSV data closes — target 2026-09.",
              priority: "medium",
            },
          ],
          analysed_at: "2026-05-19T03:14:09Z",
          source_client_file: "/conformly/vault/clients/client-a.md",
          tech_fragments_count: 0,
          focus_clauses: ["GSPR-9", "GSPR-10", "GSPR-15"],
        },
      },
      {
        kind: "assistant",
        text:
          "**Headline:** Class C respiratory PCR with a clean QMS posture but two structural performance gaps the NB has already flagged.\n\n**Top 3 to action this week:**\n1. **GSPR-15 (software)** — no IEC 62304 docs exist yet. Build a software DHF, target Class B baseline. NB hard deadline 2026-06-15.\n2. **GSPR-10 (clinical)** — RSV under-powered. Activate Bologna + Padova satellites.\n3. **GSPR-9 (analytical)** — precision design non-conformant. Repeat CLSI EP05-A3 or submit a justified deviation.\n\nWant me to draft the GSPR-15 IEC 62304 documentation outline?",
      },
    ],
  },

  {
    id: "client-status",
    title: "Act III — Where is everyone?",
    hook: "Portfolio sweep in one call. 20 clients, one screen.",
    duration: "~5 s",
    description:
      "From 'show me the room' to actionable next-due dates in a single tool call. Sort by risk level to see what's burning.",
    timeline: [
      {
        kind: "user",
        text: "Pull up the whole portfolio. Sort by risk — I want to know who needs me today.",
      },
      {
        kind: "tool_call",
        tool: "conformly_list_clients",
        args: { status: "active", sort_by: "risk" },
      },
      {
        kind: "tool_result",
        tool: "conformly_list_clients",
        durationMs: 280,
        data: [
          {
            client_id: "CLIENT-A",
            codename: "Shenzhen MoleQ Diagnostics",
            ivdr_class: "C",
            current_phase: "Phase 3 — SUBMISSION",
            day_in_journey: 196,
            risk_level: "high",
            risk_count: 4,
            next_action_text: "Follow up CE Parere Unico decision",
            next_action_due: "2026-05-28",
          },
          {
            client_id: "CLIENT-B",
            codename: "Beijing OncoGene Bio",
            ivdr_class: "D",
            current_phase: "Phase 0 — Evaluation",
            day_in_journey: 27,
            risk_level: "high",
            risk_count: 4,
            next_action_text: "Deliver IVDR gap analysis report",
            next_action_due: "2026-05-30",
          },
          {
            client_id: "CLIENT-C",
            codename: "Hangzhou QuickStrip Diagnostics",
            ivdr_class: "B",
            current_phase: "Phase 5 — FOLLOW UP",
            day_in_journey: 338,
            risk_level: "medium",
            risk_count: 1,
            next_action_text: "Turin enrolment review",
            next_action_due: "2026-06-30",
          },
        ],
      },
      {
        kind: "assistant",
        text:
          "Three high-priority items this week:\n\n• **CLIENT-A (Class C)** — CE Parere Unico expected 2026-05-28. Day 196. Four open risks. NB letter pending response.\n• **CLIENT-B (Class D, CDx)** — Day 27. Gap-analysis report due 2026-05-30. Needs your sign-off on the NB shortlist.\n• **CLIENT-C (Class B)** — Phase 5 follow-up. Torino enrolment review due end of June.\n\nOpen any client for the full file. Or ask me to compare across the portfolio (which engagements share the same NB, which devices share supply-chain risk, etc.).",
      },
    ],
  },
];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}
