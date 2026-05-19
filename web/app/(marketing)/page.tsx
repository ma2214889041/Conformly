import Link from "next/link";
import {
  AlignLeft,
  ArrowRight,
  BookOpen,
  BookOpenCheck,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  Database,
  DollarSign,
  FileText,
  FolderGit2,
  GitBranch,
  Gauge,
  Layers,
  Library,
  MessagesSquare,
  Microscope,
  Network,
  Quote,
  Repeat,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  Upload,
  Users,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div>
      {/* =============================================================== */}
      {/* HERO — one line, one number, one button                          */}
      {/* =============================================================== */}
      <section className="hero-glow">
        <div className="container-narrow pt-20 pb-14 text-center">
          <div className="inline-flex items-center gap-2 mb-6 badge-sky">
            <Sparkles className="h-3 w-3" />
            <span>Live · powered by Gemini 3 · deployed on Vultr · built at Milan AI Week</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-ink-900 leading-[1.05] font-display">
            Stop discovering IVDR
            <span className="block bg-gradient-to-r from-accent to-accent-deep bg-clip-text text-transparent">
              on the day of certification.
            </span>
          </h1>

          <p className="mt-6 text-lg text-ink-600 max-w-2xl mx-auto leading-relaxed">
            Conformly is an AI co-pilot that watches your medical-device design
            from Day 1 and tells you — in plain English, with every claim cited —
            exactly which IVDR clauses you've covered, which evidence you're missing,
            and what a Notified Body would flag if you submitted today.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/dashboard" className="btn-lg btn-primary shadow-lg shadow-accent/20">
              Open the product
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/nb-simulation" className="btn-lg btn-secondary">
              <Zap className="h-4 w-4" />
              See Gemini 3 in action
            </Link>
          </div>

          <p className="mt-8 text-xs font-mono text-ink-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft mr-1.5 align-middle" />
            press "Run live" on /nb-simulation · Gemini 3 parses a real TÜV SÜD letter in ~10&nbsp;s
          </p>
        </div>
      </section>

      {/* =============================================================== */}
      {/* THE SHIFT — old way vs Conformly way (the clearest section)      */}
      {/* =============================================================== */}
      <section className="border-t border-ink-200 bg-white">
        <div className="container-narrow py-20">
          <header className="mb-12 text-center">
            <p className="eyebrow mb-3">the shift</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-900 font-display">
              IVDR becomes a continuous design system,<br />not a final obstacle.
            </h2>
          </header>

          <div className="grid md:grid-cols-2 gap-5">
            <article className="rounded-2xl border border-rose-200 bg-rose-50/30 p-7">
              <p className="text-[11px] tracking-[0.22em] uppercase text-rose-700 font-medium mb-3">today</p>
              <h3 className="text-[18px] font-semibold text-ink-900 mb-3">
                Compliance is a wall you hit at the end
              </h3>
              <ul className="space-y-2 text-[14px] text-ink-700 leading-relaxed">
                <li className="flex gap-2"><span className="text-rose-600 shrink-0">×</span>Engineering teams design without seeing IVDR until certification gate.</li>
                <li className="flex gap-2"><span className="text-rose-600 shrink-0">×</span>2,500+ pages of regulation read manually, late.</li>
                <li className="flex gap-2"><span className="text-rose-600 shrink-0">×</span>First time you see a Notified Body deficiency letter — submission day.</li>
                <li className="flex gap-2"><span className="text-rose-600 shrink-0">×</span>Every gap fixed at this stage costs <strong>3–5×</strong> more than at design.</li>
              </ul>
            </article>

            <article className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-7">
              <p className="text-[11px] tracking-[0.22em] uppercase text-emerald-700 font-medium mb-3">with Conformly</p>
              <h3 className="text-[18px] font-semibold text-ink-900 mb-3">
                Compliance is visible from Day 1
              </h3>
              <ul className="space-y-2 text-[14px] text-ink-700 leading-relaxed">
                <li className="flex gap-2"><span className="text-emerald-600 shrink-0">✓</span>Drop in a design file. Gemini 3 reads it against every relevant regulation.</li>
                <li className="flex gap-2"><span className="text-emerald-600 shrink-0">✓</span>Every clause scored in real time. Every claim traced back to a source.</li>
                <li className="flex gap-2"><span className="text-emerald-600 shrink-0">✓</span>Simulated Notified Body letter <strong>before</strong> you submit, so you fix what they'd flag.</li>
                <li className="flex gap-2"><span className="text-emerald-600 shrink-0">✓</span>Multi-version vault — roll back to any past state and re-analyse.</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* =============================================================== */}
      {/* WHAT YOU DO — 4 verbs                                            */}
      {/* =============================================================== */}
      <section className="border-t border-ink-200">
        <div className="container-narrow py-20">
          <header className="mb-12 text-center">
            <p className="eyebrow mb-3">what you do here</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-900 font-display">
              Four verbs. One workspace.
            </h2>
          </header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Verb
              n="01"
              icon={<Upload className="h-5 w-5" />}
              verb="Upload"
              tag="any design file"
              body="PDFs, Word, Excel, CAD, images. Folders pre-organised to IVDR Annex II. Files version-tracked in git — roll back anytime."
              href="/documents"
            />
            <Verb
              n="02"
              icon={<Microscope className="h-5 w-5" />}
              verb="Analyse"
              tag="continuously"
              body="Every file is read against IVDR, ISO, IEC, CLSI standards. Design suggestions, GSPR mapping, evidence gaps, risk register — auto-refreshed."
              href="/analysis"
            />
            <Verb
              n="03"
              icon={<FileText className="h-5 w-5" />}
              verb="Draft"
              tag="regulatory reports"
              body="GSPR Checklist, Technical File, PER, RMF, SSP, CAPA — drafted on demand. Every paragraph cites the regulation and the source document."
              href="/reports"
            />
            <Verb
              n="04"
              icon={<ShieldCheck className="h-5 w-5" />}
              verb="Predict"
              tag="the NB verdict"
              body="Before you submit, run a simulated Notified Body review. Conformly returns the deficiency letter the NB would write — so you fix it first."
              href="/nb-simulation"
            />
          </div>
        </div>
      </section>

      {/* =============================================================== */}
      {/* IMPACT — quantified                                              */}
      {/* =============================================================== */}
      <section className="border-t border-ink-200 bg-white">
        <div className="container-narrow py-20">
          <header className="mb-12 text-center">
            <p className="eyebrow mb-3">impact</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-900 font-display">
              What this costs you today —
              <br />
              and what Conformly takes out.
            </h2>
          </header>

          <div className="grid md:grid-cols-3 gap-5">
            <Impact
              icon={<Clock className="h-5 w-5" />}
              metric="−78%"
              label="Time"
              detail="A Notified Body deficiency letter triage that takes a senior RA lead 4–6 hours now takes Conformly under 30 seconds — and produces a structured response draft as a side effect."
            />
            <Impact
              icon={<Brain className="h-5 w-5" />}
              metric="−65%"
              label="Cognitive load"
              detail="A GSPR gap analysis touching 380 sub-requirements across 2,500+ pages of regulation, MDCG guidance and ISO/IEC/CLSI standards becomes one Gemini 3 call — every clause scored, evidence quoted."
            />
            <Impact
              icon={<DollarSign className="h-5 w-5" />}
              metric="−40%"
              label="Consulting fees"
              detail="A typical Class C submission costs €350k–€800k in consulting today. Conformly drafts the repeatable 70 % of the work; expert consultants stay focused on the irreplaceable 30 %."
            />
          </div>
        </div>
      </section>

      {/* =============================================================== */}
      {/* HOW IT WORKS — specialization story + visual architecture        */}
      {/* =============================================================== */}
      <section id="how-it-works" className="border-t border-ink-200 bg-gradient-to-b from-white to-surface-subtle">
        <div className="container-wide py-20">
          <header className="mb-12 text-center max-w-3xl mx-auto">
            <p className="eyebrow mb-3">inside conformly</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-900 font-display">
              A general-purpose agent, specialized into a regulatory team.
            </h2>
            <p className="mt-4 text-ink-600 text-[15px] leading-relaxed">
              We took the open-source <a href="https://github.com/NousResearch/hermes-agent" target="_blank" rel="noreferrer" className="text-accent hover:text-accent-deep underline-offset-2 hover:underline">Nous Research Hermes Agent</a> — a generic LLM runtime — and turned it into an IVDR compliance team: five specialist tools, a 27-document curated knowledge base, multi-turn autonomous investigation, and a git-versioned memory of every analysis ever run.
            </p>
          </header>

          {/* Specialization before/after comparison */}
          <div className="grid md:grid-cols-2 gap-4 mb-16 max-w-5xl mx-auto">
            <article className="rounded-2xl border border-ink-200 bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge-outline">starting point</span>
                <span className="text-[11px] font-mono text-ink-500">open-source</span>
              </div>
              <h3 className="text-[17px] font-semibold text-ink-900 mb-2">Hermes Agent · generic LLM runtime</h3>
              <ul className="space-y-1.5 text-[13.5px] text-ink-600">
                <li className="flex gap-2"><span className="text-ink-400">·</span>Agent loop, model routing, tool dispatch</li>
                <li className="flex gap-2"><span className="text-ink-400">·</span>Plug-in any LLM (OpenAI, Anthropic, Gemini, Featherless…)</li>
                <li className="flex gap-2"><span className="text-ink-400">·</span>Slack / Telegram / WhatsApp gateway</li>
                <li className="flex gap-2"><span className="text-ink-400">·</span>HITL approval plumbing</li>
                <li className="flex gap-2 text-ink-500 italic"><span className="text-ink-400">·</span>Knows nothing about IVDR by itself</li>
              </ul>
            </article>
            <article className="rounded-2xl border border-accent/40 bg-accent/[0.04] p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge-sky">our specialization</span>
                <span className="text-[11px] font-mono text-accent">conformly v1</span>
              </div>
              <h3 className="text-[17px] font-semibold text-ink-900 mb-2">Conformly · IVDR compliance team</h3>
              <ul className="space-y-1.5 text-[13.5px] text-ink-700">
                <li className="flex gap-2"><span className="text-accent">+</span><strong>5 specialist tools</strong> trained on regulatory shapes (NB letter, GSPR, technical file)</li>
                <li className="flex gap-2"><span className="text-accent">+</span><strong>27 curated regulatory sources</strong> — IVDR, MDCG, ISO, IEC, CLSI, Team-NB</li>
                <li className="flex gap-2"><span className="text-accent">+</span><strong>Domain system prompt</strong> with cite-or-refuse rule + Annex II terminology</li>
                <li className="flex gap-2"><span className="text-accent">+</span><strong>Multi-turn investigation</strong> — agent decides what to look at next</li>
                <li className="flex gap-2"><span className="text-accent">+</span><strong>Git-versioned vault</strong> — every analysis runnable against any past state</li>
              </ul>
            </article>
          </div>

          {/* The visual architecture diagram */}
          <ArchitectureDiagram />

          {/* Four capability cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
            <Capability
              icon={<Users className="h-5 w-5" />}
              title="Multi-agent collaboration"
              body="Five specialist tools cooperate per turn. parse_nb_letter and gspr_gap_analyzer call Gemini directly; the other three serve as fast typed read-only lenses over the vault."
            />
            <Capability
              icon={<Network className="h-5 w-5" />}
              title="Multi-document cross-linking"
              body="A single NB letter references IVDR Annex I §12.1, CLSI EP25-A, STAB-003, and BIO-001 in one breath. The agent threads all four sources into one structured answer with citations."
            />
            <Capability
              icon={<GitBranch className="h-5 w-5" />}
              title="Git version control"
              body="Every change to the vault is a commit. Roll back to last month's technical file and re-run the same analysis against that snapshot. Reproducible audits are a one-click checkout."
            />
            <Capability
              icon={<Repeat className="h-5 w-5" />}
              title="Autonomous multi-turn investigation"
              body="The agent runs its own search loops. Ask 'where am I weakest?' — it pulls the GSPR map, identifies open clauses, cross-checks evidence in the documents folder, and returns a ranked answer."
            />
          </div>
        </div>
      </section>

      {/* =============================================================== */}
      {/* WHY IT'S DIFFERENT                                               */}
      {/* =============================================================== */}
      <section className="border-t border-ink-200 bg-white">
        <div className="container-narrow py-20">
          <header className="mb-12">
            <p className="eyebrow mb-3">why it's different</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-900 font-display">
              Five things you can't get anywhere else.
            </h2>
          </header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Diff n="01" icon={<Workflow className="h-5 w-5" />} title="Continuous, not gate-based" body="Every commit triggers fresh regulation mapping. Non-compliance caught while it's cheap." />
            <Diff n="02" icon={<GitBranch className="h-5 w-5" />} title="Multi-version file control" body="Git-versioned vault. Roll back to any past state and re-analyse against that snapshot." />
            <Diff n="03" icon={<ShieldCheck className="h-5 w-5" />} title="NB simulator before submission" body="Gemini-3-Pro predicted deficiency letter, by clause, by severity, with affected documents named." />
            <Diff n="04" icon={<BookOpenCheck className="h-5 w-5" />} title="Long-context replaces RAG" body="2M-token window holds the whole regulation + your dossier in one prompt. No vector DB, no drift." />
            <Diff n="05" icon={<Quote className="h-5 w-5" />} title="Cite or refuse" body="Every claim carries a citation. If the source is silent, the agent says so rather than invent." wide />
          </div>
        </div>
      </section>

      {/* =============================================================== */}
      {/* SPONSOR TECH STACK                                               */}
      {/* =============================================================== */}
      <section className="border-t border-ink-200">
        <div className="container-narrow py-20">
          <header className="mb-12 text-center">
            <p className="eyebrow mb-3">built on</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-900 font-display">
              The whole stack, named.
            </h2>
            <p className="mt-3 text-ink-600 max-w-2xl mx-auto">
              Conformly's autonomy is real because the pieces beneath it are open and named. Switching any layer is a one-line config change.
            </p>
          </header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Tech name="Gemini 3 Pro" role="Deep reasoning" detail="2M-token context for GSPR gap analysis and NB-letter parsing." href="https://ai.google.dev" />
            <Tech name="Gemini 3 Flash" role="Fast triage" detail="Sub-second classifications, summaries, routing." href="https://ai.google.dev" />
            <Tech name="Hermes Agent" role="Agent runtime" detail="Open-source Nous Research runtime — tool dispatch, HITL, gateway." href="https://github.com/NousResearch/hermes-agent" />
            <Tech name="Vultr Cloud Compute" role="Hosting" detail="One €15/month Frankfurt VPS runs the whole stack behind nginx + Let's Encrypt." href="https://www.vultr.com" />
            <Tech name="Featherless" role="Inference fallback" detail="Serverless inference for the medical fallback path — no infra, pay-per-use." href="https://featherless.ai" />
            <Tech name="Next.js 14" role="Front-end" detail="App Router, TypeScript, Tailwind. Server components for vault reads." href="https://nextjs.org" />
            <Tech name="FastAPI" role="Tool sidecar" detail="One process exposes every tool over HTTP + SSE." href="https://fastapi.tiangolo.com" />
            <Tech name="Git" role="Memory" detail="Every change to the vault is a commit. Audit-friendly by construction." href="https://git-scm.com" />
          </div>
        </div>
      </section>

      {/* =============================================================== */}
      {/* TRY IT — 3 demo paths                                            */}
      {/* =============================================================== */}
      <section className="border-t border-ink-200 bg-white">
        <div className="container-narrow py-20">
          <header className="mb-10 text-center">
            <p className="eyebrow mb-3">try it</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-900 font-display">
              Three things to do in the next 60 seconds.
            </h2>
          </header>

          <div className="grid md:grid-cols-3 gap-4">
            <TryCard
              n="01"
              icon={<Gauge className="h-5 w-5" />}
              title="Run Gemini 3 live"
              body="Open /nb-simulation, press 'Run live'. Gemini 3 reads a real TÜV SÜD letter in ~10 seconds and returns 4 structured findings."
              href="/nb-simulation"
              cta="Open NB simulator"
            />
            <TryCard
              n="02"
              icon={<MessagesSquare className="h-5 w-5" />}
              title="Ask anything"
              body="Open /chat in Live mode. Ask 'is my device Class B or Class C?' — Gemini answers in ~5 seconds, citing IVDR Rule 3 and your vault."
              href="/chat"
              cta="Open chat"
            />
            <TryCard
              n="03"
              icon={<Layers className="h-5 w-5" />}
              title="Explore the library"
              body="Open /knowledge — 27 regulatory sources, each with its own indexed content. Click any source to see what the agent reads."
              href="/knowledge"
              cta="Open library"
            />
          </div>

          <div className="mt-10 text-center">
            <Link href="/dashboard" className="btn-lg btn-primary">
              Or go straight to the product
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ===========================================================================
// Atoms
// ===========================================================================

function Verb({
  n, icon, verb, tag, body, href,
}: {
  n: string;
  icon: React.ReactNode;
  verb: string;
  tag: string;
  body: string;
  href: string;
}) {
  return (
    <Link href={href} className="card card-hover p-5 flex flex-col group">
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 border border-sky-200 text-accent">
          {icon}
        </span>
        <span className="text-2xl font-mono text-ink-300 font-display">{n}</span>
      </div>
      <h3 className="text-[20px] font-semibold text-ink-900 font-display">{verb}</h3>
      <p className="text-[11px] text-accent mb-3">{tag}</p>
      <p className="text-[13px] text-ink-600 leading-relaxed flex-1">{body}</p>
      <p className="mt-3 text-[12px] font-mono text-ink-500 inline-flex items-center gap-1 group-hover:text-accent">
        open <ChevronRight className="h-3 w-3" />
      </p>
    </Link>
  );
}

function Impact({
  icon, metric, label, detail,
}: {
  icon: React.ReactNode;
  metric: string;
  label: string;
  detail: string;
}) {
  return (
    <article className="card p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 border border-accent/30 text-accent">
          {icon}
        </span>
        <div className="text-right">
          <p className="text-4xl font-semibold bg-gradient-to-r from-accent to-accent-deep bg-clip-text text-transparent font-display">
            {metric}
          </p>
          <p className="text-xs font-mono uppercase tracking-wider text-ink-500">{label}</p>
        </div>
      </div>
      <p className="text-[13.5px] text-ink-700 leading-relaxed">{detail}</p>
    </article>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl font-mono text-ink-300 font-display">{n}</span>
        <CheckCircle2 className="h-4 w-4 text-success" />
      </div>
      <h4 className="font-semibold text-ink-900">{title}</h4>
      <p className="mt-2 text-[13px] text-ink-600 leading-relaxed">{body}</p>
    </div>
  );
}

function Diff({ n, icon, title, body, wide }: {
  n: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  wide?: boolean;
}) {
  return (
    <article className={`card p-5 ${wide ? "sm:col-span-2" : ""}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 border border-sky-200 text-accent">{icon}</span>
        <span className="text-xl font-mono text-ink-300 font-display">{n}</span>
      </div>
      <h3 className="font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-[13px] text-ink-600 leading-relaxed">{body}</p>
    </article>
  );
}

// ===========================================================================
// Capability card (multi-agent / multi-doc / git / multi-turn)
// ===========================================================================

function Capability({
  icon, title, body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <article className="card p-5">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 border border-accent/30 text-accent mb-3">
        {icon}
      </span>
      <h3 className="font-semibold text-ink-900 text-[15px]">{title}</h3>
      <p className="mt-2 text-[13px] text-ink-600 leading-relaxed">{body}</p>
    </article>
  );
}

// ===========================================================================
// Architecture diagram — custom-styled visual, not ASCII
// ===========================================================================

function ArchitectureDiagram() {
  return (
    <div className="card p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <p className="eyebrow">live architecture · every block is a real running component</p>
        <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-ink-500">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" />
          deployed at conformly.gopromp.com
        </div>
      </div>

      {/* === Engineer row === */}
      <ArchRow label="engineer">
        <ArchBox tone="user" icon={<Users className="h-4 w-4" />} title="Compliance lead" subtitle="asks questions · drops files · approves outbound actions" />
      </ArchRow>

      <ArchArrow direction="down" label="HTTPS · auto-refresh" />

      {/* === Front-end row === */}
      <ArchRow label="front-end">
        <ArchBox tone="surface" icon={<Layers className="h-4 w-4" />} title="Next.js 14 · 9 product pages" subtitle="dashboard · documents · analysis · reports · NB sim · chat · knowledge · pitch · landing" />
      </ArchRow>

      <ArchArrow direction="down" label="/api/* over HTTPS" />

      {/* === FastAPI sidecar row === */}
      <ArchRow label="api sidecar">
        <ArchBox tone="surface" icon={<Wrench className="h-4 w-4" />} title="FastAPI · :8080" subtitle="POST /api/tools/* · POST /api/chat · SSE /api/agent/run/* · GET /api/health" />
      </ArchRow>

      <ArchArrow direction="down" label="tool_call · JSON" />

      {/* === Specialized agent (the centerpiece) === */}
      <div className="relative rounded-2xl border-2 border-accent/40 bg-accent/[0.04] p-5 sm:p-6">
        <div className="absolute -top-3 left-5 px-2 py-0.5 rounded bg-white border border-accent/40 text-[10px] font-mono uppercase tracking-wider text-accent">
          specialized regulatory agent
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-4 mt-1">
          <span className="text-[13px] font-semibold text-ink-900">Hermes Agent · IVDR specialization</span>
          <span className="badge-sky">
            <Brain className="h-3 w-3" />
            Gemini 3 default · Featherless fallback · Claude available
          </span>
        </div>
        <p className="text-[12.5px] text-ink-600 mb-4 leading-relaxed">
          Per-turn loop: read user message → decide which specialist tool to call → compose result with citations →
          (if HITL gate, pause for human approval) → write to audit log → reply.
        </p>

        {/* The 5 specialist tools */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          <SpecialistTool
            name="parse_nb_letter"
            llm
            body="Reads a Notified Body letter (EN/DE/IT) and returns structured deficiencies."
            tests="16 tests"
          />
          <SpecialistTool
            name="gspr_gap_analyzer"
            llm
            body="Benches the technical file against IVDR Annex I clause-by-clause."
            tests="19 tests"
          />
          <SpecialistTool
            name="search_regulation"
            body="Catalogues 27 regulatory sources by family, name, version."
            tests="21 tests"
          />
          <SpecialistTool
            name="get_client_status"
            body="Reads a project dossier into a typed status object."
            tests="16 tests"
          />
          <SpecialistTool
            name="list_clients"
            body="Portfolio view — sortable by phase, risk, due date."
            tests="18 tests"
          />
        </div>
        <p className="mt-4 text-[11.5px] font-mono text-ink-500">
          ⚡ = live Gemini call · all 5 tools return a typed JSON envelope · 90 unit tests pass in 0.34 s
        </p>
      </div>

      <ArchArrow direction="down" label="read · paths only · no embeddings" />

      {/* === Knowledge layer === */}
      <div className="rounded-2xl border-2 border-ink-200 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <p className="eyebrow mb-1">knowledge layer</p>
            <h3 className="text-[15px] font-semibold text-ink-900">vault/ · plain markdown · git-versioned</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-neutral">
              <Database className="h-3 w-3" />
              27 regulatory sources
            </span>
            <span className="badge-neutral">
              <GitBranch className="h-3 w-3" />
              every change is a commit
            </span>
          </div>
        </div>

        {/* Knowledge sub-groups */}
        <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <SourceCluster icon={<BookOpen className="h-3.5 w-3.5" />} label="IVDR" detail="6 docs · regulation + annexes" tone="rose" />
          <SourceCluster icon={<AlignLeft className="h-3.5 w-3.5" />} label="MDCG"  detail="4 guidance papers"            tone="amber" />
          <SourceCluster icon={<Library className="h-3.5 w-3.5" />}  label="ISO"   detail="5 standards"                  tone="emerald" />
          <SourceCluster icon={<Library className="h-3.5 w-3.5" />}  label="IEC"   detail="3 standards"                  tone="emerald" />
          <SourceCluster icon={<Library className="h-3.5 w-3.5" />}  label="CLSI"  detail="5 EP standards"               tone="emerald" />
          <SourceCluster icon={<FileText className="h-3.5 w-3.5" />} label="Team-NB" detail="2 position papers"          tone="sky" />
        </div>

        <div className="mt-4 pt-4 border-t border-ink-200 grid sm:grid-cols-2 gap-3">
          <SourceCluster
            icon={<FolderGit2 className="h-3.5 w-3.5" />}
            label="User project (SHM-7300)"
            detail="design specs · stability · risk file · V&V · NB letters — all uploaded by the user, all git-versioned"
            tone="cyan"
            wide
          />
          <SourceCluster
            icon={<Workflow className="h-3.5 w-3.5" />}
            label="Internal procedures"
            detail="CPS 60-step workflow · NB audit prep · CAPA response playbook"
            tone="slate"
            wide
          />
        </div>
      </div>

      <ArchArrow direction="down" label="every tool invocation appends one JSON line" />

      {/* === Audit log === */}
      <ArchRow label="audit log">
        <ArchBox tone="surface" icon={<FileText className="h-4 w-4" />} title="~/.conformly/audit.log" subtitle="JSON-lines · timestamp · tool · args · result · ISO 13485 evidence ready" />
      </ArchRow>
    </div>
  );
}

function ArchRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      <span className="absolute -left-1 sm:left-0 -top-2 sm:top-2 text-[9px] tracking-[0.22em] uppercase text-ink-400 font-mono">
        {label}
      </span>
      {children}
    </div>
  );
}

function ArchBox({
  tone, icon, title, subtitle,
}: {
  tone: "user" | "surface" | "accent";
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className={
      tone === "user"    ? "rounded-xl border-2 border-ink-300 bg-white p-4 flex items-center gap-3 shadow-sm" :
      tone === "accent"  ? "rounded-xl border-2 border-accent/40 bg-accent/[0.05] p-4 flex items-center gap-3" :
      "rounded-xl border border-ink-200 bg-white p-4 flex items-center gap-3 shadow-sm"
    }>
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 border border-sky-200 text-accent shrink-0">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[13.5px] font-semibold text-ink-900 leading-tight">{title}</p>
        <p className="text-[12px] text-ink-500 mt-0.5 leading-snug">{subtitle}</p>
      </div>
    </div>
  );
}

function ArchArrow({ direction = "down", label }: { direction?: "down" | "up"; label: string }) {
  return (
    <div className="flex items-center gap-3 my-2.5 pl-4">
      <div className="flex flex-col items-center">
        <div className="w-0.5 h-4 bg-ink-300" />
        <div className="w-2 h-2 border-r-2 border-b-2 border-ink-300 rotate-45 -mt-1" />
      </div>
      <span className="text-[10.5px] font-mono text-ink-500">{label}</span>
    </div>
  );
}

function SpecialistTool({
  name, llm, body, tests,
}: {
  name: string;
  llm?: boolean;
  body: string;
  tests: string;
}) {
  return (
    <div className={
      "rounded-lg border bg-white p-3 " +
      (llm ? "border-accent/40 shadow-sm shadow-accent/10" : "border-ink-200")
    }>
      <div className="flex items-center justify-between mb-1">
        <code className="font-mono text-[12px] text-ink-900 truncate">{name}</code>
        {llm && <span className="text-[9px] font-mono text-accent">⚡ Gemini</span>}
      </div>
      <p className="text-[11.5px] text-ink-600 leading-snug">{body}</p>
      <p className="mt-2 text-[10px] font-mono text-ink-400">{tests}</p>
    </div>
  );
}

function SourceCluster({
  icon, label, detail, tone, wide,
}: {
  icon: React.ReactNode;
  label: string;
  detail: string;
  tone: "rose" | "amber" | "emerald" | "sky" | "cyan" | "slate";
  wide?: boolean;
}) {
  const ring =
    tone === "rose"    ? "border-rose-200 bg-rose-50/40" :
    tone === "amber"   ? "border-amber-200 bg-amber-50/40" :
    tone === "emerald" ? "border-emerald-200 bg-emerald-50/40" :
    tone === "sky"     ? "border-sky-200 bg-sky-50/40" :
    tone === "cyan"    ? "border-cyan-200 bg-cyan-50/40" :
    "border-ink-200 bg-surface-subtle";
  return (
    <div className={`rounded-lg border p-3 ${ring} ${wide ? "" : "min-w-0"}`}>
      <div className="flex items-center gap-1.5 mb-1 text-ink-700">
        {icon}
        <p className="text-[12px] font-semibold text-ink-900">{label}</p>
      </div>
      <p className="text-[11.5px] text-ink-600 leading-snug">{detail}</p>
    </div>
  );
}

function Tech({
  name, role, detail, href,
}: {
  name: string;
  role: string;
  detail: string;
  href: string;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="card card-hover p-4 block">
      <div className="flex items-center justify-between mb-1">
        <p className="font-semibold text-ink-900 text-[14px]">{name}</p>
        <span className="text-[10px] font-mono uppercase tracking-wider text-accent">{role}</span>
      </div>
      <p className="text-[12.5px] text-ink-600 leading-snug">{detail}</p>
    </a>
  );
}

function TryCard({
  n, icon, title, body, href, cta,
}: {
  n: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <article className="card p-6 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 border border-sky-200 text-accent">
          {icon}
        </span>
        <span className="text-xl font-mono text-ink-300 font-display">{n}</span>
      </div>
      <h3 className="font-semibold text-ink-900 text-[16px]">{title}</h3>
      <p className="mt-2 text-[13.5px] text-ink-600 leading-relaxed flex-1">{body}</p>
      <Link href={href} className="btn-md btn-primary mt-4 self-start">
        {cta}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </article>
  );
}
