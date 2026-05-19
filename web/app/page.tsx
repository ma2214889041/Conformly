import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  GitBranch,
  Network,
  Timer,
  Sparkles,
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
      {/* ----------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ----------------------------------------------------------------- */}
      <section className="hero-glow">
        <div className="container-narrow pt-20 pb-20 text-center">
          <div className="inline-flex items-center gap-2 mb-6 badge-cyan">
            <Sparkles className="h-3 w-3" />
            <span>Built on Hermes Agent · 90 unit tests · LLM-Wiki architecture</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-ink-50 leading-[1.05]">
            The IVDR submission package
            <span className="block bg-gradient-to-r from-accent via-cyan-300 to-accent bg-clip-text text-transparent">
              your team never has time to finish.
            </span>
          </h1>
          <p className="mt-6 text-lg text-ink-300 max-w-2xl mx-auto leading-relaxed">
            Conformly is an AI co-pilot for in-vitro diagnostic manufacturers entering the EU.
            It tracks every client across a 45-step program, dissects Notified Body letters
            in seconds, and benches the technical file against IVDR Annex I one clause at a time.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/demo" className="btn-primary text-base px-6 py-3 shadow-lg shadow-accent/10 hover:shadow-accent/20">
              Try the live demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/dashboard" className="btn-secondary text-base px-6 py-3">
              See the 20-client dashboard
            </Link>
          </div>

          <p className="mt-8 text-xs text-ink-500 font-mono">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-soft mr-1.5 align-middle" />
            no demo trick: the dashboard reads live markdown from this repo's <code>vault/</code>
          </p>

          {/* Vital signs */}
          <dl className="mt-16 grid grid-cols-3 gap-px bg-ink-800/40 rounded-2xl overflow-hidden border border-ink-800/60">
            <Stat label="Active clients" value={String(counts.total)} hint="In the vault today" />
            <Stat label="High-risk files" value={String(counts.high)} hint="Need attention this week" />
            <Stat label="IVDR classes covered" value={String(counts.classes)} hint="A · B · C · D" />
          </dl>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* What it does                                                      */}
      {/* ----------------------------------------------------------------- */}
      <section id="features" className="container-narrow py-20 border-t border-ink-800/60">
        <header className="mb-12">
          <p className="text-accent text-sm font-mono uppercase tracking-wider mb-3">What it does</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-50 leading-tight">
            Five tools. One agent. Zero RAG infrastructure.
          </h2>
          <p className="mt-3 text-ink-400 max-w-2xl">
            Knowledge lives as plain markdown inside <code className="text-ink-200 font-mono text-sm">vault/</code>.
            A long-context LLM (Gemini 2.5 Pro, 2M&nbsp;tokens) reads it directly. No vector
            database, no embeddings — every retrieval is auditable as a file read.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-4">
          <Feature
            icon={<FileCheck2 className="h-5 w-5" />}
            tool="conformly_parse_nb_letter"
            title="Triage a Notified Body letter"
            body="A BSI / TÜV / DEKRA letter goes in. A structured deficiency plan comes out — IVDR clause map, severity, evidence required, draft response skeleton. Multi-language."
          />
          <Feature
            icon={<ShieldCheck className="h-5 w-5" />}
            tool="conformly_gspr_gap_analyzer"
            title="Bench against IVDR Annex I"
            body="One call, twenty GSPR clauses, one structured report. addressed / partial / open / n-a, with a recommended action per gap and a top-3 risk list."
          />
          <Feature
            icon={<Network className="h-5 w-5" />}
            tool="conformly_list_clients"
            title="See the whole portfolio"
            body="Class, phase, day-in-journey, risk level, next deadline — every active engagement on one screen. Sort by risk to know who needs you today."
          />
          <Feature
            icon={<Timer className="h-5 w-5" />}
            tool="conformly_get_client_status"
            title="Open one file"
            body="A single client dossier becomes a typed status object: GREEN LIGHTs passed, open risks with severity, soonest deadline, communication log."
          />
          <Feature
            icon={<GitBranch className="h-5 w-5" />}
            tool="conformly_search_regulation"
            title="Cite the regulation"
            body="A catalog of IVDR, MDCG, ISO and CLSI docs in the vault. Filter by family, query by substring, then let the agent's long context do the reading."
            wide
          />
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Architecture rail                                                 */}
      {/* ----------------------------------------------------------------- */}
      <section className="border-t border-ink-800/60">
        <div className="container-narrow py-20">
          <p className="text-accent text-sm font-mono uppercase tracking-wider mb-3">Architecture</p>
          <h2 className="text-3xl font-semibold tracking-tight text-ink-50">
            Plain markdown. One LLM. Git for memory.
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <ArchCard
              step="01"
              title="Vault is the source of truth"
              body="Clients, projects, regulations, NB letters — all markdown with YAML frontmatter. Auditable, diff-able, git-versioned. ISO 13485 reviewers love it."
            />
            <ArchCard
              step="02"
              title="Agent reads what it needs"
              body="No embeddings. No vector DB. The agent calls firsteck-style tools that return JSON catalogs and slim summaries; it pulls full files into its long context only when the question demands it."
            />
            <ArchCard
              step="03"
              title="Humans approve outbound"
              body="Reads and drafts run free. Anything that leaves your network — a CAPA response, a sponsor update, a submission packet — pauses for an HITL approval pushed to Slack."
            />
          </div>

          <div className="mt-12 card p-6">
            <pre className="code-block !p-0 !bg-transparent !border-0 text-[12px]">
{`conformly/
├── plugin/                ← 5 Python tools, 90 unit tests
├── vault/                  ← knowledge base in markdown
│   ├── raw/regulations/    IVDR PDF + MDCG + ISO summaries
│   ├── notes/              GSPR checklist, procedures, curated Q&A
│   ├── clients/            one file per engagement, with frontmatter
│   └── projects/           per-engagement work logs
├── web/                    ← this site (Next.js 14 · Tailwind)
└── deploy/                 ← one-shot Vultr installer`}
            </pre>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* CTA                                                               */}
      {/* ----------------------------------------------------------------- */}
      <section className="container-narrow py-20">
        <div className="card p-10 text-center">
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink-50">
            Sit down with the agent for 90 seconds.
          </h3>
          <p className="mt-3 text-ink-400 max-w-xl mx-auto">
            Three scripted scenarios, real tool outputs, every assistant message exactly
            what a sponsor would see on Slack today.
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

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="bg-ink-900/70 p-6">
      <dt className="text-xs uppercase tracking-wider text-ink-400 font-mono">{label}</dt>
      <dd className="mt-2 text-3xl font-semibold text-ink-50">{value}</dd>
      <p className="text-xs text-ink-500 mt-1">{hint}</p>
    </div>
  );
}

function Feature({
  icon, title, body, tool, wide,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  tool: string;
  wide?: boolean;
}) {
  return (
    <div className={`card card-hover p-6 ${wide ? "sm:col-span-2" : ""}`}>
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 border border-accent/30 text-accent">
          {icon}
        </span>
        <div className="flex-1">
          <h3 className="font-semibold text-ink-50">{title}</h3>
          <p className="mt-1 text-sm text-ink-400 leading-relaxed">{body}</p>
          <code className="mt-3 inline-block text-[11px] font-mono text-ink-500">
            {tool}()
          </code>
        </div>
      </div>
    </div>
  );
}

function ArchCard({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <div className="card p-6">
      <span className="text-xs font-mono text-accent">{step}</span>
      <h4 className="mt-1 font-semibold text-ink-50">{title}</h4>
      <p className="mt-2 text-sm text-ink-400 leading-relaxed">{body}</p>
    </div>
  );
}
