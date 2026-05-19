/**
 * Mock data for the single-user Design-to-Certificate experience.
 *
 * Mirrors the design's `ConformlyData` shape exactly, transcribed to TypeScript
 * so Server Components can import without runtime hydration.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Severity = "urgent" | "attention" | "routine" | "critical" | "major" | "minor" | "high" | "medium" | "low";
export type GsprState = "green" | "yellow" | "red";

export type Project = {
  name: string;
  classification: string;
  device_code: string;
  manufacturer: string;
  notified_body: string;
  current_day: number;
  estimated_days: number;
  project_start: string;
  target_submission: string;
};

export type Phase = {
  id: number;
  name: string;
  status: "complete" | "active" | "pending";
  pct: number;
};

export type Health = {
  document_readiness: number;
  evidence_completeness: number;
  nb_readiness_score: number;
  last_analysis: string;
  documents_total: number;
  documents_required: number;
  gspr_total: number;
  gspr_covered: number;
};

export type ActionItem = {
  id: string;
  severity: "urgent" | "attention" | "routine";
  title: string;
  context: string;
  regulation: string;
  affected_docs: string[];
};

export type ActivityEvent = {
  id: string;
  at: string;
  text: string;
  tag: string;
};

export type Suggestion = {
  id: string;
  severity: "high" | "medium" | "low";
  title: string;
  body: string;
  reg: string;
  action: string;
};

export type GsprChapter = {
  id: string;
  name: string;
  items: { id: string; title: string; state: GsprState; evidence: number }[];
};

export type Gap = {
  id: string;
  category: "critical" | "important" | "minor";
  title: string;
  reason: string;
  reg: string;
  owner: string;
};

export type Hazard = {
  id: string;
  category: string;
  hazard: string;
  severity: "Critical" | "Serious" | "Moderate" | "Minor";
  probability: "Frequent" | "Probable" | "Possible" | "Remote" | "Improbable";
  risk: "High" | "Medium" | "Low";
  control: string;
  residual: "Acceptable" | "Unverified" | "Unacceptable";
  flagged?: boolean;
};

export type DocFolder = {
  id: string;
  num: string;
  name: string;
  count: number;
  required: number;
  status: "ok" | "warn" | "alert";
};

export type Document = {
  id: string;
  name: string;
  uploaded: string;
  status: "analyzed" | "analyzing" | "needs-review";
  score: number | null;
  kind: "pdf" | "doc" | "xlsx" | "cad" | "img";
  flagged?: boolean;
};

export type ReportCatalogEntry = {
  id: string;
  title: string;
  annex: string;
  time: string;
  completeness: number;
  last_gen: string | null;
};

export type ReportLibEntry = {
  id: string;
  name: string;
  type: string;
  date: string;
  version: string;
  status: "draft" | "reviewed" | "final";
};

export type NbFinding = {
  id: string;
  severity: "critical" | "major" | "minor";
  reg: string;
  title: string;
  desc: string;
  docs: string[];
};

export type NbSim = {
  run_date: string;
  score: number;
  verdict: string;
  verdict_detail: string;
  confidence: number;
  sources: string[];
  findings: NbFinding[];
  history: { run: number; date: string; score: number; critical: number; major: number; minor: number }[];
};

export type KnowledgeNode = {
  id: string;
  name: string;
  count?: number;
  used?: number;
  selected?: boolean;
  children?: KnowledgeNode[];
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export const PROJECT: Project = {
  name: "Sample Handling Module",
  classification: "Class C IVD",
  device_code: "SHM-7300",
  manufacturer: "Acme Diagnostics GmbH",
  notified_body: "TÜV SÜD (NB 0123)",
  current_day: 240,
  estimated_days: 510,
  project_start: "2025-09-22",
  target_submission: "2026-12-15",
};

export const PHASES: Phase[] = [
  { id: 1, name: "Design Input",                 status: "complete", pct: 100 },
  { id: 2, name: "Risk Management",              status: "complete", pct: 100 },
  { id: 3, name: "Verification & Validation",    status: "active",   pct: 68 },
  { id: 4, name: "Performance Evaluation",       status: "active",   pct: 42 },
  { id: 5, name: "Technical Documentation",      status: "pending",  pct: 18 },
  { id: 6, name: "Notified Body Submission",     status: "pending",  pct: 0  },
];

export const HEALTH: Health = {
  document_readiness: 73,
  evidence_completeness: 61,
  nb_readiness_score: 58,
  last_analysis: "11 minutes ago",
  documents_total: 142,
  documents_required: 194,
  gspr_total: 380,
  gspr_covered: 232,
};

export const TODAY_ACTIONS: ActionItem[] = [
  {
    id: "a-1",
    severity: "urgent",
    title: "GSPR 12.1 stability data is incomplete",
    context:
      "Real-time stability is documented to 9 months. IVDR requires evidence covering full claimed shelf-life (24 months).",
    regulation: "IVDR Annex I §12.1",
    affected_docs: ["STAB-001 Stability Protocol v2", "STAB-003 Interim Report"],
  },
  {
    id: "a-2",
    severity: "urgent",
    title: "Biocompatibility evidence missing for sample chamber (PMMA)",
    context:
      "ISO 10993-5 cytotoxicity test report not present in technical file. Material is patient-contacting via aerosol path.",
    regulation: "ISO 10993-1 §6",
    affected_docs: ["MAT-002 Material Specification"],
  },
  {
    id: "a-3",
    severity: "attention",
    title: "Software classification appears to be Class B",
    context:
      "Detected hazard analysis references injury severity 'minor reversible' — confirm intended use before locking IEC 62304 deliverables.",
    regulation: "IEC 62304 §4.3",
    affected_docs: ["SW-DOC-001 Software Architecture"],
  },
  {
    id: "a-4",
    severity: "attention",
    title: "Performance evaluation plan needs CLSI EP05 reference",
    context:
      "Precision study protocol cites internal SOP only. Notified Body expects alignment to CLSI EP05-A3.",
    regulation: "CLSI EP05-A3",
    affected_docs: ["PEP-001 Performance Evaluation Plan"],
  },
  {
    id: "a-5",
    severity: "routine",
    title: "Updated risk file v3.2 successfully mapped",
    context:
      "2 new hazards introduced (thermal cycling drift, aerosol carry-over). Both have linked control measures.",
    regulation: "ISO 14971 §5",
    affected_docs: ["RA-003 Risk Analysis v3.2"],
  },
  {
    id: "a-6",
    severity: "routine",
    title: "IFU draft v0.8 aligns with IEC 62366 usability outputs",
    context:
      "All identified use errors are represented in the warnings section. Ready for human factors validation.",
    regulation: "IEC 62366-1 §5.9",
    affected_docs: ["IFU-001 Instructions for Use"],
  },
];

export const RECENT_ACTIVITY: ActivityEvent[] = [
  { id: "e1", at: "11 min ago",  tag: "Risk Management",     text: "Analyzed updated risk file v3.2 — identified 2 new hazards requiring control measures." },
  { id: "e2", at: "1 hour ago",  tag: "Compliance Mapping",  text: "Cross-mapped 18 verification protocols against IVDR Annex I §8 (Analytical Performance)." },
  { id: "e3", at: "2 hours ago", tag: "Report Drafting",     text: "Drafted Technical File §4.2 — Device Performance Characteristics. 1,840 words. 12 citations." },
  { id: "e4", at: "4 hours ago", tag: "Evidence Gaps",       text: "Flagged 3 gaps in performance evaluation plan against CLSI EP09 commutability requirements." },
  { id: "e5", at: "Yesterday",   tag: "Compliance Mapping",  text: "Completed full GSPR re-scan after design change ECO-118. Coverage increased from 58% to 61%." },
  { id: "e6", at: "Yesterday",   tag: "Notified Body",       text: "Generated CAPA response draft for simulated NB finding F-2025-04 (labeling deficiency)." },
  { id: "e7", at: "Yesterday",   tag: "Knowledge Base",      text: "Indexed 4 new MDCG guidance documents into knowledge base (MDCG 2022-2, 2022-9, 2023-1, 2024-2)." },
  { id: "e8", at: "2 days ago",  tag: "Software",            text: "Re-evaluated software safety classification after architecture revision v1.4 — unchanged at Class B." },
];

export const UPCOMING_MILESTONE = {
  title: "Performance evaluation freeze",
  body: "All performance studies locked for technical file v1.0.",
  date: "Jun 30, 2026",
  days_remaining: 42,
};

export const CHAT_SUGGESTED = [
  "Is my device Class B or Class C?",
  "What evidence do I need for GSPR 9.1?",
  "Show me my biggest compliance risks",
  "What documents am I missing?",
];

// User profile (single user)
export const USER = {
  name: "Elena Marchetti",
  role: "Compliance Lead",
  initials: "EM",
};
