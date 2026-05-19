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

// ---------------------------------------------------------------------------
// Documents (Annex II folder tree)
// ---------------------------------------------------------------------------

export const DOC_FOLDERS: DocFolder[] = [
  { id: "f1", num: "1", name: "Device Description and Specification",         count: 18, required: 22, status: "ok"    },
  { id: "f2", num: "2", name: "Information to be Supplied by the Manufacturer", count: 9,  required: 12, status: "warn"  },
  { id: "f3", num: "3", name: "Design and Manufacturing Information",          count: 31, required: 34, status: "ok"    },
  { id: "f4", num: "4", name: "General Safety and Performance Requirements",   count: 27, required: 48, status: "warn"  },
  { id: "f5", num: "5", name: "Benefit-Risk Analysis and Risk Management",     count: 14, required: 16, status: "ok"    },
  { id: "f6", num: "6", name: "Verification and Validation of the Device",     count: 32, required: 44, status: "warn"  },
  { id: "f7", num: "7", name: "Post-Market Surveillance Plan",                 count: 11, required: 18, status: "alert" },
];

export const DOCUMENTS: Record<string, Document[]> = {
  f1: [
    { id: "d-101", name: "DEV-SPEC-001 Device Description v2.3.pdf",   uploaded: "Apr 02, 2026", status: "analyzed",  score: 94, kind: "pdf" },
    { id: "d-102", name: "DEV-SPEC-002 Intended Purpose Statement.docx", uploaded: "Mar 28, 2026", status: "analyzed",  score: 88, kind: "doc" },
    { id: "d-103", name: "DEV-CAD-014 Sample Chamber Assembly.step",    uploaded: "Mar 21, 2026", status: "analyzed",  score: 76, kind: "cad" },
    { id: "d-104", name: "DEV-BOM-007 Bill of Materials v1.8.xlsx",     uploaded: "Mar 18, 2026", status: "analyzing", score: null, kind: "xlsx" },
    { id: "d-105", name: "DEV-IMG-022 Optical Path Diagram.png",        uploaded: "Mar 10, 2026", status: "analyzed",  score: 90, kind: "img" },
  ],
  f4: [
    { id: "d-401", name: "GSPR-MAP-001 Conformity Matrix v1.4.xlsx",     uploaded: "Apr 14, 2026", status: "analyzed",     score: 71, kind: "xlsx" },
    { id: "d-402", name: "STAB-001 Stability Protocol v2.pdf",            uploaded: "Mar 30, 2026", status: "analyzed",     score: 52, kind: "pdf", flagged: true },
    { id: "d-403", name: "STAB-003 Interim Stability Report (9 mo).pdf", uploaded: "Apr 06, 2026", status: "analyzed",     score: 58, kind: "pdf", flagged: true },
    { id: "d-404", name: "ISO10993-5 Cytotoxicity Test Plan.docx",        uploaded: "Mar 24, 2026", status: "needs-review", score: 41, kind: "doc", flagged: true },
    { id: "d-405", name: "BIO-001 Biological Evaluation Plan v0.6.docx", uploaded: "Mar 02, 2026", status: "analyzed",     score: 68, kind: "doc" },
  ],
  f6: [
    { id: "d-601", name: "PEP-001 Performance Evaluation Plan v0.9.docx", uploaded: "Apr 10, 2026", status: "analyzed", score: 64, kind: "doc" },
    { id: "d-602", name: "VAL-203 Analytical Specificity Report.pdf",      uploaded: "Apr 03, 2026", status: "analyzed", score: 86, kind: "pdf" },
    { id: "d-603", name: "VAL-204 Linearity Study (CLSI EP06).pdf",        uploaded: "Mar 25, 2026", status: "analyzed", score: 92, kind: "pdf" },
    { id: "d-604", name: "VAL-205 Precision Study (CLSI EP05-A3).xlsx",    uploaded: "Mar 12, 2026", status: "analyzed", score: 79, kind: "xlsx" },
    { id: "d-605", name: "SW-DOC-001 Software Architecture v1.4.pdf",      uploaded: "Mar 05, 2026", status: "analyzed", score: 81, kind: "pdf" },
  ],
};

// ---------------------------------------------------------------------------
// Analysis — suggestions / GSPR mapping / gaps / hazards
// ---------------------------------------------------------------------------

export const SUGGESTIONS: Suggestion[] = [
  { id: "s1", severity: "high",   title: "PMMA sample chamber requires ISO 10993 biocompatibility evidence",     reg: "ISO 10993-1 §6 · ISO 10993-5 · ISO 10993-10", action: "Request biocompatibility test report",
    body: "Your sample chamber material (PMMA, MAT-002) is patient-contacting via aerosol path. ISO 10993-1 §6 requires biological evaluation including cytotoxicity (10993-5), sensitization (10993-10), and irritation. Only a test plan is currently uploaded — no test report." },
  { id: "s2", severity: "medium", title: "Software safety classification suggests Class B per IEC 62304",         reg: "IEC 62304 §4.3 · §B.4.2",                     action: "Confirm software safety class",
    body: "Hazard analysis (RA-003) shows injury severity at most 'minor reversible' from any single software failure. This places the device at Class B. Confirm intended use does not introduce serious injury pathways before locking deliverables." },
  { id: "s3", severity: "high",   title: "Stability data does not cover claimed 24-month shelf-life",             reg: "IVDR Annex I §12.1 · CLSI EP25-A",            action: "Add accelerated stability data",
    body: "Real-time stability is documented to 9 months (STAB-003). Accelerated stability is not present. IVDR Annex I §12.1 requires evidence supporting the full claimed shelf-life; partial coverage is consistently cited as a deficiency by NBs." },
  { id: "s4", severity: "medium", title: "Precision study should reference CLSI EP05-A3, not internal SOP",       reg: "CLSI EP05-A3 · IVDR Annex I §9.1(a)",         action: "Update protocol reference",
    body: "PEP-001 §4.3 cites an internal SOP for repeatability and reproducibility. Notified Bodies expect alignment to CLSI EP05-A3 (3×5×5 design over 20 days). Internal SOP appears equivalent but should be cross-referenced." },
  { id: "s5", severity: "low",    title: "Symbols in IFU draft missing ISO 15223-1:2021 cross-reference",         reg: "ISO 15223-1:2021 §5",                         action: "Insert symbols reference table",
    body: "The IFU draft uses six symbols. Their meaning is correct, but the IFU does not include the standard reference table required by ISO 15223-1:2021 §5." },
  { id: "s6", severity: "medium", title: "Risk control verification missing for hazard H-024 (aerosol carry-over)", reg: "ISO 14971 §7.3",                              action: "Create verification protocol",
    body: "Risk file v3.2 introduces hazard H-024. A control measure is defined (closed-loop airflow), but no verification protocol confirms its effectiveness. ISO 14971 §7.3 requires verification of every implemented control." },
];

export const GSPR_CHAPTERS: GsprChapter[] = [
  { id: "ch1", name: "Chapter I — General Requirements", items: [
    { id: "1.1", title: "Achieve performance during normal conditions of use", state: "green",  evidence: 4 },
    { id: "1.2", title: "Reduce risks as far as possible (state of the art)",  state: "green",  evidence: 6 },
    { id: "1.3", title: "Risk management system established and maintained",    state: "green",  evidence: 8 },
    { id: "1.4", title: "Risk control measures verified",                       state: "yellow", evidence: 5 },
    { id: "1.5", title: "Residual risks reduced and disclosed",                 state: "green",  evidence: 3 },
    { id: "1.6", title: "Devices designed for users without specialist knowledge", state: "yellow", evidence: 2 },
  ]},
  { id: "ch2", name: "Chapter II — Design and Manufacturing", items: [
    { id: "8.1",  title: "Analytical performance — accuracy, trueness, precision",     state: "green",  evidence: 7 },
    { id: "8.2",  title: "Analytical sensitivity and specificity",                     state: "green",  evidence: 4 },
    { id: "9.1",  title: "Clinical performance — diagnostic sensitivity/specificity",  state: "yellow", evidence: 2 },
    { id: "10.1", title: "Devices that contain measuring function",                    state: "green",  evidence: 3 },
    { id: "12.1", title: "Performance maintained during claimed lifetime/shelf-life",  state: "red",    evidence: 1 },
    { id: "12.2", title: "Transport and storage conditions specified",                 state: "yellow", evidence: 1 },
  ]},
  { id: "ch3", name: "Chapter III — Information Supplied with the Device", items: [
    { id: "20.1", title: "Label content — identification, intended purpose",  state: "green",  evidence: 2 },
    { id: "20.2", title: "Symbols comply with harmonised standards",          state: "yellow", evidence: 1 },
    { id: "20.4", title: "Instructions for use content and accessibility",    state: "green",  evidence: 3 },
    { id: "20.5", title: "IFU for self-testing/near-patient testing",         state: "red",    evidence: 0 },
  ]},
];

export const GAPS: Gap[] = [
  { id: "g1", category: "critical",  title: "Real-time stability data covering full shelf-life", reason: "IVDR Annex I §12.1 requires evidence supporting the full claimed lifetime. Current data covers only 9 of 24 months.", reg: "IVDR Annex I §12.1", owner: "Stability lab" },
  { id: "g2", category: "critical",  title: "Cytotoxicity test report (ISO 10993-5)",            reason: "Patient-contacting material PMMA requires completed biological evaluation. Test plan exists; report missing.",     reg: "ISO 10993-5",        owner: "Biocompatibility partner" },
  { id: "g3", category: "critical",  title: "IFU for near-patient testing scenarios",             reason: "Annex I §20.5 requires self/near-patient IFU sections. Currently the IFU only addresses professional use.",        reg: "IVDR Annex I §20.5", owner: "Regulatory" },
  { id: "g4", category: "important", title: "Verification protocol for hazard control H-024",     reason: "Closed-loop airflow control measure has no verification record.",                                                     reg: "ISO 14971 §7.3",     owner: "V&V team" },
  { id: "g5", category: "important", title: "Software hazard traceability matrix",                reason: "IEC 62304 §5.7 requires traceability from software requirement to hazard. Current matrix covers 71% of requirements.", reg: "IEC 62304 §5.7",     owner: "Software" },
  { id: "g6", category: "important", title: "Usability validation under simulated use",           reason: "IEC 62366-1 §5.9 — summative evaluation not yet performed.",                                                          reg: "IEC 62366-1 §5.9",   owner: "Human factors" },
  { id: "g7", category: "minor",     title: "ISO 15223-1 symbols reference table in IFU",         reason: "Symbols used are correct, but their reference table is not embedded in the IFU.",                                     reg: "ISO 15223-1:2021 §5",owner: "Technical writer" },
  { id: "g8", category: "minor",     title: "Post-market clinical follow-up plan v0",             reason: "PMCF plan can be drafted in parallel with submission preparation.",                                                    reg: "IVDR Annex XIII Part B", owner: "Regulatory" },
];

export const HAZARDS: Hazard[] = [
  { id: "H-001", category: "Energy",      hazard: "Electrical shock from power supply fault", severity: "Serious",  probability: "Remote",   risk: "Medium", control: "Reinforced insulation; IEC 61010 verified",          residual: "Acceptable" },
  { id: "H-008", category: "Biological",  hazard: "Patient sample cross-contamination",        severity: "Serious",  probability: "Possible", risk: "High",   control: "Single-use cartridges; automated wash cycle",       residual: "Acceptable" },
  { id: "H-012", category: "Information", hazard: "Misinterpretation of qualitative result",   severity: "Serious",  probability: "Possible", risk: "High",   control: "Result interpretation guide in IFU; training video",residual: "Acceptable" },
  { id: "H-019", category: "Software",    hazard: "Calibration drift undetected by software",  severity: "Critical", probability: "Remote",   risk: "Medium", control: "Daily QC routine; automatic flagging",              residual: "Acceptable" },
  { id: "H-024", category: "Chemical",    hazard: "Aerosol carry-over between samples",        severity: "Serious",  probability: "Possible", risk: "High",   control: "Closed-loop airflow",                                residual: "Unverified", flagged: true },
  { id: "H-031", category: "Use-related", hazard: "Operator omits sample volume verification", severity: "Moderate", probability: "Possible", risk: "Medium", control: "Software prompt with confirmation step",            residual: "Acceptable" },
];

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------

export const REPORT_CATALOG: ReportCatalogEntry[] = [
  { id: "r-gspr",  title: "GSPR Checklist",                    annex: "IVDR Annex I",          time: "~6 min",  completeness: 71, last_gen: "Apr 14, 2026" },
  { id: "r-tf",    title: "Technical File",                    annex: "IVDR Annex II + III",   time: "~22 min", completeness: 58, last_gen: "Apr 10, 2026" },
  { id: "r-per",   title: "Performance Evaluation Report",     annex: "IVDR Annex XIII",       time: "~14 min", completeness: 64, last_gen: "Apr 09, 2026" },
  { id: "r-rmf",   title: "Risk Management File",              annex: "ISO 14971",             time: "~10 min", completeness: 88, last_gen: "Apr 12, 2026" },
  { id: "r-pms",   title: "Post-Market Surveillance Plan",     annex: "IVDR Article 79",       time: "~7 min",  completeness: 32, last_gen: null },
  { id: "r-cps",   title: "Clinical Performance Study Report", annex: "IVDR Annex XIII",       time: "~18 min", completeness: 47, last_gen: "Mar 21, 2026" },
  { id: "r-ssp",   title: "Summary of Safety and Performance", annex: "IVDR Article 29",       time: "~9 min",  completeness: 55, last_gen: "Apr 02, 2026" },
  { id: "r-capa",  title: "CAPA Response Draft",               annex: "ISO 13485 §8.5.2",      time: "~5 min",  completeness: 80, last_gen: "Apr 13, 2026" },
];

export const REPORT_LIBRARY: ReportLibEntry[] = [
  { id: "rL-1", name: "GSPR Checklist v1.4",                  type: "GSPR", date: "Apr 14, 2026", version: "v1.4", status: "draft" },
  { id: "rL-2", name: "Risk Management File v2.1",            type: "RMF",  date: "Apr 12, 2026", version: "v2.1", status: "reviewed" },
  { id: "rL-3", name: "Technical File §4 (Performance)",      type: "TF",   date: "Apr 10, 2026", version: "v0.8", status: "draft" },
  { id: "rL-4", name: "Performance Evaluation Report v0.6",   type: "PER",  date: "Apr 09, 2026", version: "v0.6", status: "draft" },
  { id: "rL-5", name: "SSP v0.4",                             type: "SSP",  date: "Apr 02, 2026", version: "v0.4", status: "draft" },
  { id: "rL-6", name: "Risk Management File v2.0",            type: "RMF",  date: "Mar 18, 2026", version: "v2.0", status: "final" },
];

// ---------------------------------------------------------------------------
// NB Simulation
// ---------------------------------------------------------------------------

export const NB_SIM: NbSim = {
  run_date: "Apr 14, 2026 · 09:14 CET",
  score: 58,
  verdict: "Likely to receive deficiencies",
  verdict_detail:
    "Submission contains 3 critical and 5 major findings that would, with high probability, generate a deficiency letter from the Notified Body.",
  confidence: 0.84,
  sources: ["IVDR Annex I", "MDCG 2022-9", "Team-NB Position Paper PP-19", "Historic deficiency patterns from 7 IVDR NBs"],
  findings: [
    { id: "F-001", severity: "critical", reg: "IVDR Annex I §12.1", title: "Stability data does not cover claimed shelf-life",
      desc: "Real-time stability is documented to 9 months against a 24-month claim. No accelerated stability data is provided. Notified Body would request full lifetime evidence before certification.",
      docs: ["STAB-001", "STAB-003"] },
    { id: "F-002", severity: "critical", reg: "ISO 10993-5",         title: "Cytotoxicity test report missing",
      desc: "Patient-contacting material (PMMA, MAT-002) has a biological evaluation plan but no completed test report. Plan alone is insufficient evidence.",
      docs: ["MAT-002", "BIO-001"] },
    { id: "F-003", severity: "critical", reg: "IVDR Annex I §20.5",  title: "IFU does not address near-patient use case",
      desc: "Intended use statement includes near-patient testing in decentralised settings, but IFU is written for professional laboratory use only.",
      docs: ["IFU-001", "DEV-SPEC-002"] },
    { id: "F-004", severity: "major",    reg: "ISO 14971 §7.3",      title: "Risk control verification missing for hazard H-024",
      desc: "Closed-loop airflow control for aerosol carry-over has no verification record. Control measure existence is not equivalent to verification.",
      docs: ["RA-003"] },
    { id: "F-005", severity: "major",    reg: "IEC 62304 §5.7",      title: "Software requirement-to-hazard traceability incomplete",
      desc: "29% of software requirements have no documented link to a hazard. NB will request a complete traceability matrix.",
      docs: ["SW-DOC-001"] },
    { id: "F-006", severity: "major",    reg: "CLSI EP05-A3",        title: "Precision protocol does not cite CLSI EP05-A3",
      desc: "Internal SOP is used. Method appears equivalent, but explicit standard cross-reference is expected.",
      docs: ["PEP-001", "VAL-205"] },
    { id: "F-007", severity: "major",    reg: "IVDR Annex I §9.1",   title: "Diagnostic sensitivity/specificity evidence thin",
      desc: "Single 96-sample study provided; NB will likely request multi-site confirmatory data per MDCG 2022-2.",
      docs: ["PEP-001"] },
    { id: "F-008", severity: "minor",    reg: "ISO 15223-1 §5",      title: "Symbols reference table absent from IFU",
      desc: "Symbols are used correctly but the standard cross-reference table is missing.",
      docs: ["IFU-001"] },
  ],
  history: [
    { run: 1, date: "Jan 18, 2026", score: 31, critical: 6, major: 9, minor: 4 },
    { run: 2, date: "Feb 24, 2026", score: 44, critical: 5, major: 7, minor: 5 },
    { run: 3, date: "Mar 22, 2026", score: 51, critical: 4, major: 6, minor: 4 },
    { run: 4, date: "Apr 14, 2026", score: 58, critical: 3, major: 5, minor: 3 },
  ],
};

// ---------------------------------------------------------------------------
// Chat history
// ---------------------------------------------------------------------------

export type ChatMsg = {
  from: "ai" | "user";
  text: string;
  cites?: string[];
  confidence?: number;
};

export const CHAT_HISTORY = [
  { id: "c1", date: "Today",     preview: "Stability claim and IVDR §12.1" },
  { id: "c2", date: "Today",     preview: "Software classification per IEC 62304" },
  { id: "c3", date: "Yesterday", preview: "Difference between Class B and C IVD" },
  { id: "c4", date: "Yesterday", preview: "What CLSI EP09 actually requires" },
  { id: "c5", date: "Mar 28",    preview: "IFU symbols and ISO 15223-1" },
  { id: "c6", date: "Mar 22",    preview: "Risk management file structure" },
];

export const CHAT_THREADS: Record<string, ChatMsg[]> = {
  c1: [
    {
      from: "user",
      text: "Our IFU claims a 24-month shelf-life but real-time stability data only goes to 9 months. Are we in trouble?",
    },
    {
      from: "ai",
      text:
        "Yes — this is a structural finding under IVDR Annex I §12.1, which requires evidence supporting the full claimed device lifetime. Real-time data alone through 9 months does not satisfy a 24-month claim.\n\nTwo standard remediation paths:\n\n1. **Extend the real-time study** to T+24 months. This is the cleanest evidence but blocks submission until the data is available.\n2. **Add accelerated stability data per CLSI EP25-A §6.2** using an appropriate Arrhenius temperature acceleration factor. Notified Bodies accept this when paired with at least 50% real-time coverage (you currently have ~37%).\n\nGiven the 12-15 month timeline pressure, path (2) is normally the better choice. Conformly has opened **gap g1** with the Stability Lab as the owner.",
      cites: ["IVDR Annex I §12.1", "CLSI EP25-A §6.2", "STAB-003"],
      confidence: 0.94,
    },
  ],
  c2: [
    {
      from: "user",
      text: "Where do we land on IEC 62304 — Class A, B, or C?",
    },
    {
      from: "ai",
      text:
        "Based on the hazard analysis in **RA-003 v3.2** and the software architecture in **SW-DOC-001 v1.4**, the MoleQ-Analytica firmware controlling aliquot volume qualifies as **Class B per IEC 62304 §4.3**.\n\nRationale:\n\n- All hazards traceable to software failure (H-019 calibration drift, H-024 aerosol carry-over control) have a worst-case severity of **Serious** but are bounded by an external risk control (the daily QC routine + closed-loop airflow).\n- There is no plausible software-only failure pathway leading to *Critical* injury (which would force Class C).\n- The software is not a non-medical OS or library that could escape its bounds.\n\nClass B means you do not need detailed software design at unit level, but you DO need:\n\n- A documented SOUP analysis\n- Architectural design with hazard linkage\n- Verification & validation summary\n- Post-market software maintenance plan\n\nThis classification should be locked at the Q2 design review.",
      cites: ["IEC 62304 §4.3", "RA-003 v3.2", "SW-DOC-001 v1.4", "Team-NB PP-22"],
      confidence: 0.89,
    },
  ],
  c3: [
    {
      from: "user",
      text: "Why is our device Class C and not Class B?",
    },
    {
      from: "ai",
      text:
        "Per **IVDR Annex VIII Rule 3** and **MDCG 2023-1 §4.2**, your Sample Handling Module is **Class C** because its intended purpose includes preparing samples for downstream molecular-diagnostic assays that inform management of life-threatening conditions (Influenza A/B, RSV, SARS-CoV-2).\n\nRule 3 covers IVDs whose results are used for:\n\n- detection of transmissible agents (3a)\n- genetic testing (3b)\n- management of life-threatening disease (3c)\n- cancer staging (3d)\n- neonatal screening (3e)\n- companion diagnostics (3g)\n\nClass B would only apply if your intended purpose excluded these life-threatening downstream assays — which it doesn't.\n\nThis classification has cascading consequences:\n\n- Conformity assessment is **Annex IX** (QMS + Technical Documentation review by a Notified Body) — not Annex II self-declaration\n- Clinical Performance Study (Annex XIII Part A) is mandatory\n- Summary of Safety and Performance must be published to EUDAMED\n- Software classification can stay Class B per IEC 62304",
      cites: ["IVDR Annex VIII Rule 3", "MDCG 2023-1 §4.2", "DEV-SPEC-002", "PEP-001"],
      confidence: 0.96,
    },
  ],
  c4: [
    {
      from: "user",
      text: "What does CLSI EP09 actually require for our predicate comparison?",
    },
    {
      from: "ai",
      text:
        "CLSI EP09-A3 specifies the following design for measurement-procedure comparison:\n\n- **Minimum 40 patient samples** spanning your analytical measuring range\n- **Duplicates** on both methods (candidate and comparator), processed within the same day\n- Samples should **not** be biased toward the centre of the range; include relevant pathologies\n- **Avoid pre-selecting** samples for agreement\n\nRequired statistical outputs:\n\n- **Bland-Altman difference plot** with limits of agreement (95% CI)\n- **Deming regression** — slope + intercept + their CIs (errors-in-both-axes)\n- **Passing-Bablok regression** as a non-parametric backup when residuals are non-normal\n\nAcceptance criteria (manufacturer-defined, justified):\n\n- Slope CI should include 1.0\n- Intercept CI should include 0\n- Mean bias within manufacturer-set limits at each medical decision point\n\nFor your project (SHM-7300), VAL-204 covers linearity but I don't see a dedicated method-comparison study against the predicate K2150. This is likely to be flagged in NB review (see predicted finding **F-007**).",
      cites: ["CLSI EP09-A3", "VAL-204", "PEP-001"],
      confidence: 0.92,
    },
  ],
  c5: [
    {
      from: "user",
      text: "Our IFU uses 6 symbols. Anything we need to add for ISO 15223-1?",
    },
    {
      from: "ai",
      text:
        "Yes — **ISO 15223-1:2021 §5** requires that any IFU using symbols include a **reference table** listing each symbol used, its meaning, and the standard reference.\n\nOmitting this table is one of the most common minor deficiencies cited by Notified Bodies during pre-submission review.\n\nFor your 6 symbols (assuming IVD use, temperature limitation, keep dry, use-by date, caution, consult IFU), the required reference table looks like:\n\n| Symbol | Meaning | Standard ref |\n|--------|---------|--------------|\n| ⚕ | In vitro diagnostic medical device | ISO 15223-1 §5.5.1 |\n| 🌡 | Temperature limitation | ISO 15223-1 §5.3.7 |\n| ☂ | Keep dry | ISO 15223-1 §5.3.4 |\n| 📅 | Use by date | ISO 15223-1 §5.1.4 |\n| ⚠ | Caution | ISO 15223-1 §5.4.4 |\n| 📖 | Consult instructions for use | ISO 15223-1 §5.4.3 |\n\nI can draft this as an IFU appendix. Conformly has opened **gap g7** (minor) for this.",
      cites: ["ISO 15223-1:2021 §5", "IFU-001"],
      confidence: 0.95,
    },
  ],
  c6: [
    {
      from: "user",
      text: "How should we structure the Risk Management File for the NB review?",
    },
    {
      from: "ai",
      text:
        "Per **ISO 14971:2019**, your Risk Management File should contain (and your **RA-003 v3.2** already does, mostly):\n\n1. **Risk management plan** (§4) — scope, responsibilities, risk acceptability criteria, verification activities. ✅ present\n\n2. **Risk analysis** (§5)\n   - Intended use & reasonably foreseeable misuse identification\n   - Hazard identification — your hazard register has 6 entries today (H-001, H-008, H-012, H-019, H-024, H-031)\n   - Estimation of risk for each hazardous situation\n\n3. **Risk evaluation** (§6) — decision on whether risk reduction is required for each hazardous situation.\n\n4. **Risk control** (§7)\n   - §7.1 Hierarchy: inherently safe design > protective measures > information for safety\n   - §7.3 **Verification of control measures** — ⚠ H-024 (aerosol carry-over) currently has a defined control but no verification record.\n\n5. **Evaluation of overall residual risk** (§8) — pending H-024 closure.\n\n6. **Risk management review** (§9) — needs to happen before commercial release.\n\n7. **Production and post-production activities** (§10) — collect and review information; update risk file as new hazards emerge.\n\nMain gap: complete the H-024 verification protocol so the §8 evaluation can close.",
      cites: ["ISO 14971:2019 §4-§10", "RA-003 v3.2", "PP-19"],
      confidence: 0.93,
    },
  ],
};

// ---------------------------------------------------------------------------
// Knowledge base
// ---------------------------------------------------------------------------

export const KNOWLEDGE_TREE: KnowledgeNode[] = [
  { id: "kb-ivdr", name: "IVDR (Regulation 2017/746)", count: 12, children: [
    { id: "kb-ivdr-full",    name: "Full regulation text",              used: 142 },
    { id: "kb-ivdr-ax1",     name: "Annex I — GSPR",                    used: 88, selected: true },
    { id: "kb-ivdr-ax2",     name: "Annex II — Technical Documentation",used: 64 },
    { id: "kb-ivdr-ax3",     name: "Annex III — Post-Market Surveillance", used: 19 },
    { id: "kb-ivdr-ax13",    name: "Annex XIII — Performance Evaluation", used: 41 },
    { id: "kb-ivdr-axOther", name: "Annexes IV–XII, XIV–XV",            used: 22 },
  ]},
  { id: "kb-mdcg", name: "MDCG Guidance", count: 18, children: [
    { id: "kb-mdcg-22-2", name: "MDCG 2022-2 — Performance evaluation guidance", used: 31 },
    { id: "kb-mdcg-22-9", name: "MDCG 2022-9 — Summary of Safety and Performance", used: 14 },
    { id: "kb-mdcg-23-1", name: "MDCG 2023-1 — Classification rules",             used: 22 },
    { id: "kb-mdcg-24-2", name: "MDCG 2024-2 — IVD intended purpose",             used: 9  },
  ]},
  { id: "kb-iso", name: "ISO Standards", count: 6, children: [
    { id: "kb-iso-13485", name: "ISO 13485 — QMS",                                used: 38 },
    { id: "kb-iso-14971", name: "ISO 14971 — Risk Management",                    used: 56 },
    { id: "kb-iso-62366", name: "ISO 62366-1 — Usability",                        used: 19 },
    { id: "kb-iso-15223", name: "ISO 15223-1 — Symbols",                          used: 11 },
    { id: "kb-iso-10993", name: "ISO 10993-1/-5/-10 — Biocompatibility",          used: 27 },
  ]},
  { id: "kb-iec", name: "IEC Standards", count: 4, children: [
    { id: "kb-iec-62304", name: "IEC 62304 — Software Lifecycle", used: 33 },
    { id: "kb-iec-61010", name: "IEC 61010 — Electrical Safety",  used: 14 },
    { id: "kb-iec-60601", name: "IEC 60601 — Medical Electrical", used: 6  },
  ]},
  { id: "kb-clsi", name: "CLSI EP Series", count: 7, children: [
    { id: "kb-clsi-ep05", name: "EP05-A3 — Precision",          used: 18 },
    { id: "kb-clsi-ep06", name: "EP06   — Linearity",           used: 12 },
    { id: "kb-clsi-ep09", name: "EP09-A3 — Method Comparison",  used: 9 },
    { id: "kb-clsi-ep17", name: "EP17-A2 — Detection Capability", used: 8 },
    { id: "kb-clsi-ep25", name: "EP25-A  — Stability",          used: 14 },
  ]},
  { id: "kb-tnb", name: "Team-NB Position Papers", count: 9, children: [
    { id: "kb-tnb-19", name: "PP-19 — Common IVDR deficiencies",            used: 21 },
    { id: "kb-tnb-22", name: "PP-22 — Software documentation expectations", used: 11 },
  ]},
  { id: "kb-proc", name: "Conformly internal procedures", count: 3, children: [
    { id: "kb-proc-cps", name: "Clinical Performance Study — 60+ step procedure", used: 47 },
    { id: "kb-proc-nb",  name: "Notified Body audit preparation",                  used: 8  },
    { id: "kb-proc-capa",name: "CAPA response drafting playbook",                  used: 14 },
  ]},
];
