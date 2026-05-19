import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  GitBranch,
  Network,
  Timer,
  Sparkles,
  Clock,
  DollarSign,
  Zap,
  AlertTriangle,
  BookOpen,
  Workflow,
  Server,
  FileText,
  CheckCircle2,
  Users,
} from "lucide-react";
import { listClients } from "@/lib/vault";

export default function LandingPage() {
  const clients = listClients();
  const counts = {
    total: clients.length,
    high: clients.filter((c) => c.risk_level === "high").length,
    classes: new Set(clients.map((c) => c.ivdr_class)).size,
  };

  return (
    <div>
      {/* ================================================================ */}
      {/* HERO                                                              */}
      {/* ================================================================ */}
      <section className="hero-glow">
        <div className="container-narrow pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 mb-6 badge-cyan">
            <Sparkles className="h-3 w-3" />
            <span>5 specialized tools · 90 unit tests · live FastAPI backend</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-ink-50 leading-[1.05]">
            IVDR compliance,
            <span className="block bg-gradient-to-r from-accent via-cyan-300 to-accent bg-clip-text text-transparent">
              compressed from months to hours.
            </span>
          </h1>
          <p className="mt-6 text-lg text-ink-300 max-w-2xl mx-auto leading-relaxed">
            Conformly is an autonomous AI co-pilot for in-vitro diagnostic manufacturers
            entering the EU under Regulation (EU) 2017/746. It tracks every client across
            a 45-step program, parses Notified Body letters in 30 seconds, and benches the
            technical file against IVDR Annex I clause-by-clause — all driven by Gemini 3.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/demo" className="btn-primary text-base px-6 py-3 shadow-lg shadow-accent/10 hover:shadow-accent/20">
              Try the live demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/dashboard" className="btn-secondary text-base px-6 py-3">
              See the portfolio dashboard
            </Link>
          </div>

          <p className="mt-8 text-xs text-ink-500 font-mono">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-soft mr-1.5 align-middle" />
            no demo trick · the dashboard reads live markdown from this repo's <code>vault/</code>
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/* IMPACT — the numbers, front and center                            */}
      {/* ================================================================ */}
      <section className="border-t border-ink-800/60">
        <div className="container-wide py-20">
          <header className="mb-12 text-center">
            <p className="text-accent text-sm font-mono uppercase tracking-wider mb-3">Why this matters</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-50 leading-tight">
              IVDR is a multi-million-euro,
              <br />multi-year program. Conformly cuts it in half.
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ImpactCard
              icon={<Clock className="h-6 w-6" />}
              metric="-78%"
              label="Time"
              before="Manually triaging a Notified Body deficiency letter and mapping each finding to IVDR clauses takes a senior regulatory affairs lead 4–6 hours."
              after="Conformly returns a structured deficiency plan, severity, evidence required, and a draft response skeleton in under 30 seconds."
            />
            <ImpactCard
              icon={<Zap className="h-6 w-6" />}
              metric="-65%"
              label="Cognitive load"
              before="A GSPR gap analysis touches 20+ IVDR Annex I clauses across thousands of pages of regulation, MDCG guidance, and ISO standards."
              after="One Gemini 3 Pro call reads the entire curated checklist + the client's whole dossier in a single 2M-token context — every clause scored, every gap quoted."
            />
            <ImpactCard
              icon={<DollarSign className="h-6 w-6" />}
              metric="-40%"
              label="Consulting fees"
              before="A typical IVDR Class C submission costs €350k–€800k in consulting alone, with consultants billing manual triage and document drafting at €1.5–2.5k/day."
              after="Conformly drafts the repeatable 70% (status reports, NB responses, gap analyses), leaving consultants free to focus on the irreplaceable 30%."
            />
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* PROBLEM — business complexity                                     */}
      {/* ================================================================ */}
      <section className="border-t border-ink-800/60">
        <div className="container-narrow py-20">
          <header className="mb-10">
            <p className="text-accent text-sm font-mono uppercase tracking-wider mb-3">The complexity</p>
            <h2 className="text-3xl font-semibold tracking-tight text-ink-50">
              IVDR is the most complex MD regulation ever passed in the EU.
            </h2>
            <p className="mt-3 text-ink-400 max-w-2xl">
              The 2017/746 regulation reclassified 80%+ of IVD devices into higher
              compliance tiers. What used to be a self-declaration is now a full
              Notified-Body assessment plus EMA opinion plus EU reference lab review.
            </p>
          </header>

          <ul className="grid sm:grid-cols-2 gap-3">
            <ComplexityFact n="22"        label="GSPR clauses every device must satisfy"               icon={<BookOpen className="h-5 w-5" />} />
            <ComplexityFact n="45"        label="steps in a typical engagement, signature to certificate" icon={<Workflow className="h-5 w-5" />} />
            <ComplexityFact n="60+"       label="sub-steps in a Clinical Performance Study (CPS) alone" icon={<FileText className="h-5 w-5" />} />
            <ComplexityFact n="24"        label="EU official languages every IFU must support (Article 17)" icon={<AlertTriangle className="h-5 w-5" />} />
            <ComplexityFact n="2,500+"    label="pages of regulation + MDCG guidance + ISO + CLSI to internalise" icon={<FileText className="h-5 w-5" />} />
            <ComplexityFact n="30+ mo"    label="average Class D submission timeline today, end-to-end"  icon={<Clock className="h-5 w-5" />} />
          </ul>
        </div>
      </section>

      {/* ================================================================ */}
      {/* PRODUCT — what the agent actually does                            */}
      {/* ================================================================ */}
      <section className="border-t border-ink-800/60">
        <div className="container-narrow py-20">
          <header className="mb-10">
            <p className="text-accent text-sm font-mono uppercase tracking-wider mb-3">The product</p>
            <h2 className="text-3xl font-semibold tracking-tight text-ink-50">
              Five focused tools. One regulatory-affairs co-pilot.
            </h2>
            <p className="mt-3 text-ink-400 max-w-2xl">
              The agent calls these tools the way a senior consultant would dictate to a
              junior — one specific task at a time, always citing the source document,
              never going off-script.
            </p>
          </header>

          <div className="grid sm:grid-cols-2 gap-4">
            <Feature
              icon={<FileCheck2 className="h-5 w-5" />}
              tool="conformly_parse_nb_letter"
              title="Triage a Notified Body letter"
              body="A BSI / TÜV SÜD / DEKRA letter goes in — English, German, or Italian. A structured deficiency plan comes out: IVDR clause map, severity, evidence required, draft response skeleton."
              metric="30 s vs. 5 h"
            />
            <Feature
              icon={<ShieldCheck className="h-5 w-5" />}
              tool="conformly_gspr_gap_analyzer"
              title="Bench against IVDR Annex I"
              body="One call, 22 GSPR clauses, one structured report. addressed / partial / open / n-a, with quoted evidence per addressed clause and a concrete recommended action per gap."
              metric="2 min vs. 3 days"
            />
            <Feature
              icon={<Network className="h-5 w-5" />}
              tool="conformly_list_clients"
              title="See the whole portfolio"
              body="Class, phase, day-in-journey, risk level, next deadline — every active engagement on one screen. Sort by risk to know who needs you today."
              metric="instant"
            />
            <Feature
              icon={<Timer className="h-5 w-5" />}
              tool="conformly_get_client_status"
              title="Open one file"
              body="A single client dossier becomes a typed status object: GREEN LIGHTs passed, open risks with severity, soonest deadline, communication log."
              metric="instant"
            />
            <Feature
              icon={<GitBranch className="h-5 w-5" />}
              tool="conformly_search_regulation"
              title="Cite the regulation"
              body="A live catalog of every IVDR / MDCG / ISO / CLSI document in the vault. Filter by family, query by substring, let the long-context LLM do the reading and the quoting."
              metric="cached forever"
              wide
            />
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* ARCHITECTURE                                                      */}
      {/* ================================================================ */}
      <section className="border-t border-ink-800/60">
        <div className="container-narrow py-20">
          <header className="mb-10">
            <p className="text-accent text-sm font-mono uppercase tracking-wider mb-3">How it works</p>
            <h2 className="text-3xl font-semibold tracking-tight text-ink-50">
              Plain markdown. Long-context LLM. Git for memory.
            </h2>
            <p className="mt-3 text-ink-400 max-w-2xl">
              No vector database. No embeddings. No RAG infrastructure. The agent reads
              files the way a consultant would — by path, by section, by quote.
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ArchStep
              n="1"
              icon={<FileText className="h-5 w-5" />}
              title="Vault = source of truth"
              body="Clients, projects, regulations, NB letters — all markdown with YAML frontmatter. Git-versioned, diff-able, auditor-friendly. ISO 13485 reviewers love it."
            />
            <ArchStep
              n="2"
              icon={<Workflow className="h-5 w-5" />}
              title="Hermes Agent runtime"
              body="The agent loop, model routing, and skill dispatch come from the NousResearch Hermes Agent project. We plug in five custom Python tools through its standard plugin interface."
            />
            <ArchStep
              n="3"
              icon={<Sparkles className="h-5 w-5" />}
              title="Gemini 3 Pro + Flash"
              body="Gemini 3 Pro handles deep reasoning (GSPR analysis, NB letter parse) with its 2M-token context window. Flash handles fast triage and selection."
            />
            <ArchStep
              n="4"
              icon={<Server className="h-5 w-5" />}
              title="Production-ready deploy"
              body="One Vultr VPS, one shell script, two services (FastAPI + Next.js) behind nginx, Let's Encrypt for HTTPS. Costs €15/month to run."
            />
          </div>

          {/* Architecture diagram (ascii-style, but visually polished) */}
          <div className="mt-10 card p-6 overflow-x-auto">
            <pre className="font-mono text-[12px] text-ink-300 leading-relaxed">
{`  ┌─────────────────────────────────────────────────────────────────────┐
  │                       Conformly architecture                        │
  ├─────────────────────────────────────────────────────────────────────┤
  │                                                                     │
  │   user / consultant                                                 │
  │         │                                                           │
  │         ▼                                                           │
  │   ┌───────────────────┐   tool_call   ┌──────────────────────────┐  │
  │   │  Hermes Agent     │ ────────────► │  Conformly plugin (5)    │  │
  │   │  + Gemini 3 Pro   │ ◄──── JSON ── │  • get_client_status     │  │
  │   │  + Gemini 3 Flash │               │  • list_clients          │  │
  │   └────────┬──────────┘               │  • search_regulation     │  │
  │            │                          │  • parse_nb_letter   ⚡  │  │
  │            │                          │  • gspr_gap_analyzer ⚡  │  │
  │            │                          └────────────┬─────────────┘  │
  │            │                                       │                │
  │            │                                       ▼                │
  │            │                          ┌──────────────────────────┐  │
  │            │                          │   vault/  (markdown)     │  │
  │            └────────────HTTP─────────►│   clients/, projects/,   │  │
  │                                       │   raw/regulations/,      │  │
  │                                       │   notes/  ←──git─────┐   │  │
  │                                       └──────────────────────┼───┘  │
  │                                                              │      │
  │                              ⚡ = LLM-backed tool            │      │
  │                              ◀ everything is auditable in git┘      │
  └─────────────────────────────────────────────────────────────────────┘`}
            </pre>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
            <Principle title="Read-only by default" body="Reads and drafts run free; any outbound action (CAPA, submission, email) pauses for a human approval routed to Slack." />
            <Principle title="Cite or refuse" body="Every regulatory answer carries a document ID + section number. If the source is silent, the agent says so rather than invent." />
            <Principle title="Audit trail by construction" body="Every tool invocation writes one JSON line to ~/.conformly/audit.log. ISO 13485 evidence ready out of the box." />
            <Principle title="No vendor lock-in" body="Markdown vault, standard OpenAI tool-call schemas, open-source Hermes runtime. Swap LLM providers in one config line." />
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SCENARIOS — the 3 demo acts                                       */}
      {/* ================================================================ */}
      <section className="border-t border-ink-800/60">
        <div className="container-narrow py-20">
          <header className="mb-10">
            <p className="text-accent text-sm font-mono uppercase tracking-wider mb-3">In practice</p>
            <h2 className="text-3xl font-semibold tracking-tight text-ink-50">
              Three scenarios. One regulatory week, replayed in 90 seconds.
            </h2>
          </header>

          <div className="space-y-5">
            <ScenarioRow
              act="Act I"
              title="A Notified Body deficiency letter lands at 9:00 AM."
              role="manufacturer"
              before="A 4-page BSI letter with 4 findings: precision, clinical, software, stability. Your RA lead spends the morning reading, classifying, mapping each to IVDR clauses, drafting a response outline, escalating to the project sponsor."
              after="Conformly parses the PDF, extracts the four deficiencies with IVDR Annex I references, flags clock-stop status (yes, 60-day window), and drafts the point-by-point response. Total wall-time: 30 seconds."
              numbers={[
                { label: "manual", v: "4–6 h" },
                { label: "Conformly", v: "30 s" },
              ]}
            />
            <ScenarioRow
              act="Act II"
              title="The sponsor asks: 'are we ready for submission?'"
              role="regulatory affairs lead"
              before="The traditional answer is a 3-day cross-functional sprint: pull the technical file, cross-reference 22 GSPR clauses, interview each team owner, write a gap report. Then re-do it next week because something changed."
              after="One conformly_gspr_gap_analyzer call. Twenty-two clauses scored, evidence quoted, gaps named, recommended actions ranked by priority. Reproducible from any commit — git checkout the past, see the past gap report."
              numbers={[
                { label: "manual", v: "2–3 days" },
                { label: "Conformly", v: "2 min" },
              ]}
            />
            <ScenarioRow
              act="Act III"
              title="Monday morning portfolio review."
              role="CRO operations director"
              before="A spreadsheet (always slightly out of date), three open chat threads, and a vague feeling about which client is closest to a deadline. PM has to ping each project lead individually before the 10:00 standup."
              after="One screen. Every active engagement, sorted by risk. Day-in-journey. Days since last contact. The soonest next deadline, by date. Click any card to drill into the source file."
              numbers={[
                { label: "manual", v: "45 min" },
                { label: "Conformly", v: "instant" },
              ]}
            />
          </div>

          <div className="mt-12 text-center">
            <Link href="/demo" className="btn-primary text-base px-6 py-3">
              Play these scenarios live
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* DASHBOARD VITALS                                                  */}
      {/* ================================================================ */}
      <section className="border-t border-ink-800/60">
        <div className="container-narrow py-16">
          <p className="text-accent text-sm font-mono uppercase tracking-wider mb-3 text-center">
            running right now
          </p>
          <dl className="grid grid-cols-3 gap-px bg-ink-800/40 rounded-2xl overflow-hidden border border-ink-800/60">
            <Stat label="Active clients in the vault" value={String(counts.total)} hint="Reading vault/clients/*.md live" />
            <Stat label="High-risk engagements" value={String(counts.high)} hint="Need attention this week" />
            <Stat label="IVDR classes covered" value={String(counts.classes)} hint="A · B · C · D" />
          </dl>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FINAL CTA                                                         */}
      {/* ================================================================ */}
      <section className="container-narrow py-20">
        <div className="card p-10 text-center">
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink-50">
            Sit down with the agent for 90 seconds.
          </h3>
          <p className="mt-3 text-ink-400 max-w-xl mx-auto">
            Three scripted scenarios, real tool outputs, every assistant message exactly
            what a sponsor would see on Slack today. Replay any run from your history.
          </p>
          <Link href="/demo" className="btn-primary text-base px-6 py-3 mt-8">
            Start the demo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

// ===========================================================================
// Atoms
// ===========================================================================

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="bg-ink-900/70 p-6">
      <dt className="text-xs uppercase tracking-wider text-ink-400 font-mono">{label}</dt>
      <dd className="mt-2 text-3xl font-semibold text-ink-50">{value}</dd>
      <p className="text-xs text-ink-500 mt-1">{hint}</p>
    </div>
  );
}

function ImpactCard({
  icon, metric, label, before, after,
}: {
  icon: React.ReactNode;
  metric: string;
  label: string;
  before: string;
  after: string;
}) {
  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 border border-accent/30 text-accent">
          {icon}
        </span>
        <div className="text-right">
          <p className="text-3xl font-semibold bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
            {metric}
          </p>
          <p className="text-xs font-mono uppercase tracking-wider text-ink-400">{label}</p>
        </div>
      </div>
      <div className="space-y-2 text-[13px] leading-relaxed">
        <p>
          <span className="text-[10px] font-mono uppercase tracking-wider text-rose-300 mr-2">before</span>
          <span className="text-ink-300">{before}</span>
        </p>
        <p>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 mr-2">after</span>
          <span className="text-ink-100">{after}</span>
        </p>
      </div>
    </div>
  );
}

function ComplexityFact({
  n, label, icon,
}: {
  n: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <li className="card card-hover p-5 flex items-center gap-4">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-rose-400/10 border border-rose-400/30 text-rose-300 shrink-0">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-semibold text-ink-50">{n}</p>
        <p className="text-[13px] text-ink-400 leading-snug">{label}</p>
      </div>
    </li>
  );
}

function Feature({
  icon, title, body, tool, metric, wide,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  tool: string;
  metric: string;
  wide?: boolean;
}) {
  return (
    <div className={`card card-hover p-6 ${wide ? "sm:col-span-2" : ""}`}>
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 border border-accent/30 text-accent shrink-0">
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-2 mb-1">
            <h3 className="font-semibold text-ink-50">{title}</h3>
            <span className="badge-emerald text-[10px]">
              <Zap className="h-2.5 w-2.5" />
              {metric}
            </span>
          </div>
          <p className="text-sm text-ink-400 leading-relaxed">{body}</p>
          <code className="mt-3 inline-block text-[11px] font-mono text-ink-500">{tool}()</code>
        </div>
      </div>
    </div>
  );
}

function ArchStep({
  n, icon, title, body,
}: {
  n: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-ink-800/70 border border-ink-700 text-accent">
          {icon}
        </span>
        <span className="text-2xl font-mono text-ink-700">{n}</span>
      </div>
      <h4 className="font-semibold text-ink-50">{title}</h4>
      <p className="mt-1.5 text-sm text-ink-400 leading-relaxed">{body}</p>
    </div>
  );
}

function Principle({ title, body }: { title: string; body: string }) {
  return (
    <div className="card p-4">
      <p className="font-semibold text-ink-50 flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        {title}
      </p>
      <p className="mt-1 text-[13px] text-ink-400 leading-relaxed">{body}</p>
    </div>
  );
}

function ScenarioRow({
  act, title, role, before, after, numbers,
}: {
  act: string;
  title: string;
  role: string;
  before: string;
  after: string;
  numbers: { label: string; v: string }[];
}) {
  return (
    <article className="card p-6">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="badge-cyan">{act}</span>
        <h3 className="font-semibold text-ink-50">{title}</h3>
        <span className="text-[11px] font-mono uppercase tracking-wider text-ink-500 ml-auto">
          <Users className="h-3 w-3 inline mr-1" />
          {role}
        </span>
      </div>
      <div className="grid md:grid-cols-2 gap-4 text-[13px] leading-relaxed">
        <div className="rounded-lg border border-rose-400/20 bg-rose-400/[0.04] p-4">
          <p className="text-[10px] font-mono uppercase tracking-wider text-rose-300 mb-1">before — manual</p>
          <p className="text-ink-200">{before}</p>
        </div>
        <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.04] p-4">
          <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 mb-1">after — Conformly</p>
          <p className="text-ink-100">{after}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-[12px] font-mono">
        {numbers.map((n, i) => (
          <span key={i} className={`badge-slate ${i === numbers.length - 1 ? "!border-accent/40 !text-accent !bg-accent/10" : ""}`}>
            {n.label}: <span className="font-semibold ml-1">{n.v}</span>
          </span>
        ))}
      </div>
    </article>
  );
}
