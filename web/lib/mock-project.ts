/**
 * Mock project data for the single-user Design-to-Certificate experience.
 *
 * The product spec assumes ONE active device project — this module is the
 * canonical source of truth for that project across every page. Replace
 * with a real /api/project/[id] fetch once the backend supports per-user
 * project state.
 */

export type Severity = "critical" | "major" | "minor" | "info";

export type CertificationPhase = {
  id: string;
  label: string;
  /** 0..1 — fraction of work expected complete by the end of this phase */
  weight: number;
  /** 0..1 — actual completion */
  progress: number;
};

export type ActionItem = {
  id: string;
  severity: "urgent" | "attention" | "routine";
  title: string;
  context: string;
  regulation: string;
  actionLabel: string;
};

export type AgentEvent = {
  id: string;
  at: string;       // ISO timestamp
  type: "analysis" | "report" | "upload" | "suggestion" | "simulation";
  title: string;
  body: string;
  source?: string;  // file or regulation reference
};

export type ProjectHealth = {
  document_readiness: number;        // 0..100
  evidence_completeness: number;     // 0..100
  nb_readiness_score: number;        // 0..100
  last_analysis_at: string;          // ISO
  open_findings: { critical: number; major: number; minor: number };
};

export type Project = {
  project_id: string;
  name: string;
  device_class: "A" | "B" | "C" | "D";
  intended_purpose: string;
  conformity_route: string;
  notified_body: string;
  opened: string;            // ISO date
  estimated_completion: string;
  day_in_journey: number;
  estimated_total_days: number;
  current_phase_id: string;
  phases: CertificationPhase[];
  health: ProjectHealth;
  today_actions: ActionItem[];
  recent_activity: AgentEvent[];
};


// ---------------------------------------------------------------------------
// THE project — Sample Handling Module, Class C IVD
// ---------------------------------------------------------------------------

export const PROJECT: Project = {
  project_id: "shm-2025",
  name: "Sample Handling Module",
  device_class: "C",
  intended_purpose:
    "Automated sample preparation and aliquoting for downstream molecular diagnostic assays in central clinical laboratories.",
  conformity_route: "IVDR Annex IX (full QMS + Technical Documentation assessment)",
  notified_body: "BSI Group The Netherlands (NB 2797)",
  opened: "2025-09-22",
  estimated_completion: "2027-02-14",
  day_in_journey: 240,
  estimated_total_days: 510,

  current_phase_id: "design_freeze",

  phases: [
    { id: "scoping",          label: "Scoping & classification", weight: 0.08, progress: 1.00 },
    { id: "design_inputs",    label: "Design inputs",            weight: 0.14, progress: 1.00 },
    { id: "design_outputs",   label: "Design outputs",           weight: 0.18, progress: 0.95 },
    { id: "design_freeze",    label: "Design freeze & V&V",      weight: 0.22, progress: 0.55 },
    { id: "performance",      label: "Clinical performance",     weight: 0.18, progress: 0.10 },
    { id: "submission",       label: "Notified Body submission", weight: 0.20, progress: 0.00 },
  ],

  health: {
    document_readiness: 72,
    evidence_completeness: 64,
    nb_readiness_score: 58,
    last_analysis_at: "2026-05-19T05:18:00Z",
    open_findings: { critical: 2, major: 7, minor: 14 },
  },

  today_actions: [
    {
      id: "act-1",
      severity: "urgent",
      title: "GSPR 12.1 stability data is incomplete",
      context:
        "Real-time stability is documented at 25 °C only. Annex I §12.1 requires evidence across the full transport and storage range claimed in the IFU.",
      regulation: "IVDR Annex I §12.1",
      actionLabel: "Open evidence gap",
    },
    {
      id: "act-2",
      severity: "urgent",
      title: "Software classification not declared",
      context:
        "MoleQ-Analytica embedded firmware controls aliquoting volume. IEC 62304 software safety class must be declared before V&V can be evaluated.",
      regulation: "IEC 62304 §4.3; IVDR Annex I §16",
      actionLabel: "Declare class",
    },
    {
      id: "act-3",
      severity: "attention",
      title: "Risk file v3.2 introduces 2 new hazards",
      context:
        "The updated risk analysis introduces sample carryover and aerosol generation as new hazards. Both currently lack control-measure evidence.",
      regulation: "ISO 14971 §7.4",
      actionLabel: "Review controls",
    },
    {
      id: "act-4",
      severity: "attention",
      title: "Usability validation summary missing",
      context:
        "IFU references operator training but no summative usability test report has been uploaded. IEC 62366-1 §5.9 requires summative evaluation for a Class C device.",
      regulation: "IEC 62366-1 §5.9",
      actionLabel: "Upload report",
    },
    {
      id: "act-5",
      severity: "routine",
      title: "Translate IFU into 3 additional EU languages",
      context:
        "Article 17 requires the IFU in each official EU language of every Member State of placement. Current coverage: EN, IT. Pending: DE, FR, ES.",
      regulation: "IVDR Article 17",
      actionLabel: "Plan translations",
    },
  ],

  recent_activity: [
    {
      id: "ev-1",
      at: "2026-05-19T05:18:00Z",
      type: "analysis",
      title: "Risk file v3.2 analysed",
      body: "Identified 2 new hazards (sample carryover, aerosol generation) requiring control measures and verification.",
      source: "/documents/risk-management/risk-file-v3.2.pdf",
    },
    {
      id: "ev-2",
      at: "2026-05-19T03:42:00Z",
      type: "suggestion",
      title: "Sample chamber material requires biocompatibility evidence",
      body: "PMMA chamber is in indirect contact with biological samples. ISO 10993-5 cytotoxicity testing is required.",
      source: "ISO 10993-5",
    },
    {
      id: "ev-3",
      at: "2026-05-18T22:11:00Z",
      type: "upload",
      title: "Mechanical drawings package v2 ingested",
      body: "62 drawings processed and mapped to design output traceability matrix.",
      source: "/documents/design-outputs/mech-pkg-v2.zip",
    },
    {
      id: "ev-4",
      at: "2026-05-18T14:30:00Z",
      type: "report",
      title: "Performance Evaluation Report v0.4 generated",
      body: "Draft includes analytical performance per CLSI EP05-A3 / EP09. Clinical performance section requires CPS data still being collected.",
      source: "Performance Evaluation Report v0.4",
    },
    {
      id: "ev-5",
      at: "2026-05-18T09:05:00Z",
      type: "analysis",
      title: "GSPR mapping refreshed",
      body: "382 GSPR sub-requirements scored across 19 chapters. 23 newly addressed since last refresh; 7 newly flagged as partial.",
      source: "IVDR Annex I",
    },
    {
      id: "ev-6",
      at: "2026-05-17T16:48:00Z",
      type: "simulation",
      title: "Notified Body review simulation completed",
      body: "Predicted outcome: likely to receive deficiencies. 2 critical + 7 major findings identified before submission.",
      source: "NB Simulation #3",
    },
    {
      id: "ev-7",
      at: "2026-05-17T11:12:00Z",
      type: "upload",
      title: "Software architecture document v2.3 ingested",
      body: "Mapped to IVDR §16 software clauses. IEC 62304 safety classification still to be declared by the project owner.",
      source: "/documents/software/architecture-v2.3.docx",
    },
  ],
};


// ---------------------------------------------------------------------------
// Derived helpers
// ---------------------------------------------------------------------------

export function overallProgress(project: Project = PROJECT): number {
  return Math.round(
    project.phases.reduce((sum, p) => sum + p.weight * p.progress, 0) * 100,
  );
}

export function relativeTime(iso: string, now: Date = new Date()): string {
  const ms = +now - +new Date(iso);
  const m = Math.round(ms / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d} d ago`;
  return new Date(iso).toLocaleDateString();
}
