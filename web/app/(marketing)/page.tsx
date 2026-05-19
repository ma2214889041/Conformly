import Link from "next/link";
import {
  Activity,
  AlertOctagon,
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  Clock,
  Cpu,
  FileText,
  FolderGit2,
  GitBranch,
  Layers,
  Microscope,
  Quote,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  Workflow,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div>
      {/* ================================================================ */}
      {/* HERO                                                              */}
      {/* ================================================================ */}
      <section className="hero-glow">
        <div className="container-narrow pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 mb-6 badge-sky">
            <Sparkles className="h-3 w-3" />
            <span>Design-to-Certificate AI · Gemini 3 Pro · Built at Milan AI Week</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-ink-900 leading-[1.05] font-display">
            Make IVDR
            <span className="block bg-gradient-to-r from-accent to-accent-deep bg-clip-text text-transparent">
              visible from Day&nbsp;1.
            </span>
          </h1>
          <p className="mt-6 text-lg text-ink-600 max-w-2xl mx-auto leading-relaxed">
            Conformly is an autonomous AI co-pilot for medical-device engineers entering the
            EU under IVDR. Upload your design and it continuously analyses every file against
            IVDR, ISO 13485, ISO 14971, IEC 62366, IEC 62304 and CLSI EP — flagging gaps,
            drafting reports, and predicting your Notified Body verdict <em className="not-italic text-ink-900 font-medium">before</em> you ever submit.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/dashboard" className="btn-lg btn-primary shadow-lg shadow-accent/20">
              Open the product
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how-it-works" className="btn-lg btn-secondary">
              How it works
            </a>
          </div>

          <p className="mt-8 text-xs font-mono text-ink-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft mr-1.5 align-middle" />
            running live · Gemini 3 Pro responding in ~10&nbsp;s · 90 unit tests · €15/mo Vultr
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/* THE PROBLEM                                                       */}
      {/* ================================================================ */}
      <section className="border-t border-ink-200">
        <div className="container-narrow py-20">
          <header className="mb-10">
            <p className="eyebrow mb-3">the bottleneck</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-900 font-display">
              Teams don't fail IVDR because the regulation is impossible.
              <br />
              <span className="text-accent">They fail because they design without ever seeing it.</span>
            </h2>
            <p className="mt-4 text-ink-600 max-w-2xl leading-relaxed">
              IVDR is an enormous body of work — 2,500+ pages spread across the regulation, MDCG
              guidance, ISO standards, IEC standards, CLSI EP series and Team-NB position papers.
              Most engineering teams encounter it only at the end, when redesign costs are at
              their highest. By then, every gap is expensive.
            </p>
          </header>

          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Fact n="2,500+"    label="pages of regulatory text" icon={<FileText className="h-4 w-4" />} />
            <Fact n="22"        label="GSPR clauses every IVD must satisfy" icon={<ShieldCheck className="h-4 w-4" />} />
            <Fact n="380"       label="GSPR sub-requirements scored continuously" icon={<Activity className="h-4 w-4" />} />
            <Fact n="510 d"     label="typical Class C journey, signature to certificate" icon={<Clock className="h-4 w-4" />} />
            <Fact n="€350-800k" label="consulting fees per Class C submission today" icon={<TrendingDown className="h-4 w-4" />} />
            <Fact n="3-5×"      label="cost of fixing a non-compliance after design freeze" icon={<AlertOctagon className="h-4 w-4" />} />
          </ul>
        </div>
      </section>

      {/* ================================================================ */}
      {/* WHAT YOU GET — features                                           */}
      {/* ================================================================ */}
      <section className="border-t border-ink-200 bg-white">
        <div className="container-narrow py-20">
          <header className="mb-10">
            <p className="eyebrow mb-3">what you get</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-900 font-display">
              Seven workspaces. One continuous compliance system.
            </h2>
            <p className="mt-3 text-ink-600 max-w-2xl">
              You open the product, and Conformly is already watching. Drop in your design
              files; it reads them against every applicable regulation in seconds and updates
              every workspace in lockstep.
            </p>
          </header>

          <div className="grid sm:grid-cols-2 gap-3">
            <Feature
              icon={<Workflow className="h-4 w-4" />}
              title="Dashboard"
              hint="Today's actions, scored by severity, with a citation on every claim."
              body="The agent surfaces what to handle today — gaps, software classification questions, missing biocompatibility evidence — each with the regulation clause it cites and the documents affected."
            />
            <Feature
              icon={<FolderGit2 className="h-4 w-4" />}
              title="Documents"
              hint="Drop in any design file. The agent reads it in seconds."
              body="Folders match IVDR Annex II structure. Every upload is analysed, version-tracked through git, and mapped to the regulation clauses it touches."
            />
            <Feature
              icon={<Microscope className="h-4 w-4" />}
              title="Analysis"
              hint="Continuous GSPR mapping + design suggestions + risk file"
              body="Tab through design suggestions, the 380-row GSPR compliance map, prioritised evidence gaps, and the ISO 14971 hazard table — every entry tied to its source regulation and the document that grounds it."
              wide
            />
            <Feature
              icon={<FileText className="h-4 w-4" />}
              title="Reports"
              hint="Technical File, Performance Evaluation Report, SSP, CAPA…"
              body="Each report generates from the same auditable evidence chain. Every paragraph carries citations back to the regulation clause and the source document."
            />
            <Feature
              icon={<ShieldCheck className="h-4 w-4" />}
              title="Notified Body Simulator"
              hint="Predict the deficiency letter before you submit"
              body="The most innovative workspace. Conformly reads your full submission as a Notified Body would, returns a simulated deficiency letter with severities and clause references, and tracks score improvement over time."
            />
            <Feature
              icon={<Bot className="h-4 w-4" />}
              title="Ask Conformly"
              hint="Regulatory chat — every answer cites its source"
              body="A persistent conversational interface for any regulatory question. Every reply lists the regulations and the user documents that support it, with a confidence indicator."
            />
            <Feature
              icon={<Layers className="h-4 w-4" />}
              title="Knowledge"
              hint="Transparency over the AI's source material"
              body="See exactly what regulations, standards, and Team-NB position papers the AI reads. Every document carries a 'used in X analyses' counter so traceability is bidirectional."
              wide
            />
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* INNOVATION POINTS                                                 */}
      {/* ================================================================ */}
      <section className="border-t border-ink-200">
        <div className="container-narrow py-20">
          <header className="mb-10">
            <p className="eyebrow mb-3">what's new</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-900 font-display">
              Five ideas that don't exist anywhere else.
            </h2>
          </header>

          <div className="grid md:grid-cols-3 gap-5">
            <Innovation
              n="01"
              icon={<Brain className="h-5 w-5" />}
              title="Continuous, not gate-based"
              body="Conventional eQMS tools generate evidence at certification gates — after design choices are locked. Conformly runs continuously. Every commit to a design file triggers a fresh regulation mapping, so non-compliance is caught while it's cheap to fix."
            />
            <Innovation
              n="02"
              icon={<GitBranch className="h-5 w-5" />}
              title="Multi-version file control"
              body="Every document, every report, every analysis lives in a git-versioned markdown vault. You can roll back to any past state of your technical file — and the agent re-analyses against that historical state on demand. Reproducible audits are a one-click commit checkout."
            />
            <Innovation
              n="03"
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Pre-submission NB simulator"
              body="A Gemini-3-powered review that reads your dossier the way a Notified Body would and predicts the deficiency letter — by clause, by severity, with the affected documents named. Run it before submission, fix the predicted findings, ship a passing dossier."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-5">
            <Innovation
              n="04"
              icon={<Cpu className="h-5 w-5" />}
              title="Long-context replaces RAG"
              body="The entire regulatory corpus we care about — IVDR text + curated GSPR checklist + your client's whole dossier — fits in Gemini 3 Pro's 2-million-token window. No vector database, no embeddings, no infrastructure to drift out of sync with the source markdown."
            />
            <Innovation
              n="05"
              icon={<Quote className="h-5 w-5" />}
              title="Cite-or-refuse"
              body="Every AI claim — every gap, every suggestion, every report paragraph — carries a citation. Click any sentence and see exactly which regulation clause and which source document support it. If the source is silent, the agent says so rather than invent."
            />
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* AUTONOMOUS AGENTS                                                 */}
      {/* ================================================================ */}
      <section className="border-t border-ink-200 bg-white">
        <div className="container-narrow py-20">
          <header className="mb-10">
            <p className="eyebrow mb-3">how the agents work</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-900 font-display">
              Five specialised tools. One always-on regulatory mind.
            </h2>
            <p className="mt-3 text-ink-600 max-w-2xl">
              Conformly is built on the open-source{" "}
              <a href="https://github.com/NousResearch/hermes-agent" target="_blank" rel="noreferrer" className="text-accent hover:text-accent-deep underline-offset-2 hover:underline">
                NousResearch Hermes Agent
              </a>{" "}
              runtime. The agent decides — turn by turn — which of its five purpose-built tools to
              call, then composes the results into a single answer with every claim cited.
            </p>
          </header>

          <div className="grid sm:grid-cols-2 gap-3">
            <Tool name="parse_nb_letter"     backed="Gemini 3 Pro · ~10 s" what="Ingests a Notified Body deficiency letter (English, German, Italian) and returns structured findings with IVDR clause, severity, evidence required, and draft response skeleton." />
            <Tool name="gspr_gap_analyzer"   backed="Gemini 3 Pro · ~14 s" what="Reads the curated GSPR checklist plus the full client dossier in one prompt and scores every clause: addressed / partial / open / n-a, with quoted evidence and a recommended action per gap." />
            <Tool name="search_regulation"   backed="direct file read · <1 s" what="Returns the regulation catalogue with metadata so the calling LLM can decide which 1–3 files are worth pulling into context. Long-context retrieval, no embeddings." />
            <Tool name="get_client_status"   backed="direct file read · <1 s" what="Parses the project markdown into a typed status object: phase, GREEN LIGHTs passed, open risks with severity, soonest deadline, communication log." />
            <Tool name="list_clients"        backed="direct file read · <1 s" what="Portfolio overview — every project on one screen, sortable by risk, phase, day-in-journey, or next-due. Filterable by IVDR class." wide />
          </div>

          <div className="mt-10 card p-6 overflow-x-auto">
            <pre className="font-mono text-[12px] text-ink-700 leading-relaxed">
{`  ┌────────────────────────────────────────────────────────────────────┐
  │   user / engineer                                                  │
  │       │                                                            │
  │       ▼                                                            │
  │   ┌───────────────┐   tool_call   ┌──────────────────────────────┐ │
  │   │ Hermes Agent  │ ────────────▶ │  Conformly tools (5)         │ │
  │   │ + Gemini 3 Pro│ ◀──── JSON ── │  • parse_nb_letter        ⚡ │ │
  │   │ + Gemini 3    │               │  • gspr_gap_analyzer      ⚡ │ │
  │   │   Flash       │               │  • search_regulation         │ │
  │   └────────┬──────┘               │  • get_client_status         │ │
  │            │                      │  • list_clients              │ │
  │            │                      └──────────────┬───────────────┘ │
  │            │                                     │                 │
  │            │                                     ▼                 │
  │            │                      ┌──────────────────────────────┐ │
  │            └─────────HTTP────────▶│   vault/  (markdown, git)    │ │
  │                                   │   clients/, projects/,       │ │
  │                                   │   raw/regulations/,          │ │
  │                                   │   notes/    ← every commit   │ │
  │                                   │              is auditable    │ │
  │                                   └──────────────────────────────┘ │
  │                                                                    │
  │                  ⚡ = LLM-backed       audit log at ~/.conformly/  │
  └────────────────────────────────────────────────────────────────────┘`}
            </pre>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* TECHNICAL ARCHITECTURE                                            */}
      {/* ================================================================ */}
      <section id="how-it-works" className="border-t border-ink-200">
        <div className="container-narrow py-20">
          <header className="mb-10">
            <p className="eyebrow mb-3">under the hood</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-900 font-display">
              Plain markdown. Long-context LLM. Git for memory.
            </h2>
            <p className="mt-3 text-ink-600 max-w-2xl">
              The whole stack is built to be auditable. No proprietary data store, no
              vector index that can desynchronise. Every byte of regulatory truth lives
              as a markdown file that an auditor can read with their own eyes.
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            <ArchStep n="01" title="Markdown vault" body="Clients, projects, regulations, NB letters — all markdown with YAML frontmatter. Git-versioned, diff-able, ISO 13485 friendly." />
            <ArchStep n="02" title="Hermes Agent" body="Open-source agent runtime from Nous Research. Provides model routing, tool dispatch, HITL approval plumbing, and the gateway to Telegram/Slack." />
            <ArchStep n="03" title="Gemini 3 Pro + Flash" body="Pro handles deep reasoning (gap analysis, NB letter parse). Flash handles fast triage. Switching providers is one config line." />
            <ArchStep n="04" title="One Vultr VPS" body="FastAPI on :8080, Next.js on :3000, nginx terminating Let's Encrypt TLS. €15/month, deployed in one shell script." />
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-ink-200 rounded-lg overflow-hidden border border-ink-200">
            <Stat n="5"    label="Python tools, fully tested" />
            <Stat n="90"   label="unit tests · 0.34 s green" />
            <Stat n="7"    label="product workspaces" />
            <Stat n="€15"  label="monthly run cost" />
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FINAL CTA                                                         */}
      {/* ================================================================ */}
      <section className="container-narrow py-20">
        <div className="card p-10 text-center">
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink-900 font-display">
            See Conformly think.
          </h3>
          <p className="mt-3 text-ink-600 max-w-xl mx-auto">
            Open the product. Drop in a document. Watch the dashboard update, run a Notified
            Body simulation, ask any regulatory question — every answer cites its source.
          </p>
          <Link href="/dashboard" className="btn-lg btn-primary mt-8">
            Open the product
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

// ===========================================================================
// Atoms (local to this file)
// ===========================================================================

function Fact({ n, label, icon }: { n: string; label: string; icon: React.ReactNode }) {
  return (
    <li className="card card-hover p-5 flex items-center gap-4">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 border border-rose-200 text-rose-700 shrink-0">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-semibold text-ink-900 font-display">{n}</p>
        <p className="text-[13px] text-ink-600 leading-snug">{label}</p>
      </div>
    </li>
  );
}

function Feature({
  icon, title, hint, body, wide,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
  body: string;
  wide?: boolean;
}) {
  return (
    <article className={`card card-hover p-6 ${wide ? "sm:col-span-2" : ""}`}>
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 border border-sky-200 text-accent shrink-0">
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-ink-900">{title}</h3>
          <p className="mt-0.5 text-[12px] text-accent">{hint}</p>
          <p className="mt-2 text-[13.5px] text-ink-600 leading-relaxed">{body}</p>
        </div>
      </div>
    </article>
  );
}

function Innovation({ n, icon, title, body }: { n: string; icon: React.ReactNode; title: string; body: string }) {
  return (
    <article className="card p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 border border-sky-200 text-accent">{icon}</span>
        <span className="text-2xl font-mono text-ink-300 font-display">{n}</span>
      </div>
      <h3 className="font-semibold text-ink-900 text-[15px]">{title}</h3>
      <p className="mt-2 text-[13px] text-ink-600 leading-relaxed">{body}</p>
    </article>
  );
}

function Tool({ name, backed, what, wide }: { name: string; backed: string; what: string; wide?: boolean }) {
  return (
    <div className={`card card-hover p-5 ${wide ? "sm:col-span-2" : ""}`}>
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <code className="font-mono text-[14px] text-ink-900">{name}()</code>
        <span className="text-[11px] font-mono text-accent">{backed}</span>
      </div>
      <p className="text-[13px] text-ink-600 leading-relaxed">{what}</p>
    </div>
  );
}

function ArchStep({ n, title, body }: { n: string; title: string; body: string }) {
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

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="bg-white p-5">
      <p className="text-2xl font-semibold text-ink-900 font-display">{n}</p>
      <p className="text-[12px] text-ink-600 mt-1 leading-snug">{label}</p>
    </div>
  );
}
