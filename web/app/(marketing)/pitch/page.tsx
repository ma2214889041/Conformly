import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock,
  DollarSign,
  GitBranch,
  Microscope,
  Quote,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  Workflow,
  Zap,
} from "lucide-react";

export default function PitchPage() {
  return (
    <div className="container-narrow py-10 space-y-6">
      <header className="text-center mb-2">
        <p className="eyebrow mb-2">Hackathon pitch · 12-slide deck</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-900 font-display">
          Conformly · Milan AI Week
        </h1>
        <p className="text-ink-600 mt-2">Scroll for the full deck · each card is one slide.</p>
      </header>

      {/* 01 — Hook */}
      <Slide n="01" eyebrow="The hook">
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink-900 font-display leading-[1.1]">
          Medical-device teams don't fail IVDR because the regulation is impossible.
        </h2>
        <p className="mt-6 text-3xl text-accent font-display">
          They fail because they design without ever seeing it.
        </p>
      </Slide>

      {/* 02 — Problem */}
      <Slide n="02" eyebrow="The problem">
        <h3 className="text-2xl font-semibold text-ink-900 font-display">
          IVDR is the most complex MD regulation the EU has ever passed
        </h3>
        <ul className="grid sm:grid-cols-3 gap-3 mt-6">
          <Fact n="2,500+" label="pages of regulation + guidance + standards" />
          <Fact n="22" label="GSPR clauses · 380 sub-requirements" />
          <Fact n="510 d" label="typical Class C journey" />
          <Fact n="€350-800k" label="consulting fees per submission" />
          <Fact n="24" label="EU languages every IFU must support" />
          <Fact n="3-5×" label="cost of fixing a gap after design freeze" />
        </ul>
      </Slide>

      {/* 03 — Today */}
      <Slide n="03" eyebrow="Today" tone="rose">
        <h3 className="text-2xl font-semibold text-ink-900 font-display mb-4">
          Compliance is a wall you hit at the end
        </h3>
        <ul className="space-y-2 text-[15px] text-ink-700">
          <li>· Engineers design without seeing IVDR until certification gate.</li>
          <li>· Notified Body deficiency letter arrives — that's the first feedback signal.</li>
          <li>· Every gap discovered at this stage costs 3-5× to fix.</li>
          <li>· Teams burn 4-6 hours triaging one 4-page NB letter, manually.</li>
        </ul>
      </Slide>

      {/* 04 — Conformly */}
      <Slide n="04" eyebrow="With Conformly" tone="emerald">
        <h3 className="text-2xl font-semibold text-ink-900 font-display mb-4">
          Compliance becomes a continuous design system
        </h3>
        <ul className="space-y-2 text-[15px] text-ink-700">
          <li>· Drop in a design file — Gemini 3 reads it against every relevant regulation.</li>
          <li>· Every clause scored in real time. Every claim traced to its source.</li>
          <li>· Simulated NB review predicts the deficiency letter before submission.</li>
          <li>· Multi-version vault — roll back, re-analyse, audit anything.</li>
        </ul>
      </Slide>

      {/* 05 — What you do */}
      <Slide n="05" eyebrow="What you do here">
        <h3 className="text-2xl font-semibold text-ink-900 font-display mb-6">
          Four verbs. One workspace.
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Verb icon={<Sparkles className="h-5 w-5" />} verb="Upload" body="Any design file. Folders mirror IVDR Annex II. Git-versioned." />
          <Verb icon={<Microscope className="h-5 w-5" />} verb="Analyse" body="Continuous GSPR mapping, design suggestions, evidence gaps." />
          <Verb icon={<Workflow className="h-5 w-5" />} verb="Draft" body="Technical File, PER, RMF, SSP, CAPA. Every paragraph cited." />
          <Verb icon={<ShieldCheck className="h-5 w-5" />} verb="Predict" body="NB deficiency letter, before you submit." />
        </div>
      </Slide>

      {/* 06 — Impact */}
      <Slide n="06" eyebrow="Impact in numbers">
        <h3 className="text-2xl font-semibold text-ink-900 font-display mb-6">
          Half the time. A third less cost. Almost no manual reading.
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <Impact metric="−78%" label="Time" icon={<Clock className="h-5 w-5" />} />
          <Impact metric="−65%" label="Cognitive load" icon={<Brain className="h-5 w-5" />} />
          <Impact metric="−40%" label="Consulting fees" icon={<DollarSign className="h-5 w-5" />} />
        </div>
      </Slide>

      {/* 07 — Architecture */}
      <Slide n="07" eyebrow="How it works">
        <h3 className="text-2xl font-semibold text-ink-900 font-display mb-4">
          Markdown vault. Long-context LLM. Git for memory.
        </h3>
        <pre className="font-mono text-[12px] text-ink-700 leading-relaxed bg-surface-subtle border border-ink-200 rounded-lg p-4 overflow-x-auto">
{`  engineer  →  Hermes Agent  →  5 Python tools  →  vault/  (markdown · git)
                 ⤷ Gemini 3 Pro       parse_nb_letter    clients/
                 ⤷ Gemini 3 Flash     gspr_gap_analyzer  projects/
                                      search_regulation  raw/regulations/
                                      get_client_status  notes/
                                      list_clients
                 ⤷ every change       audit log →
                   commits to git     ~/.conformly/audit.log`}
        </pre>
        <p className="mt-4 text-[14px] text-ink-600">
          No vector database. No embeddings. No infrastructure to drift out of sync.
          The whole regulatory corpus + a client's dossier fits in Gemini 3's
          long-context window in one prompt.
        </p>
      </Slide>

      {/* 08 — Why now */}
      <Slide n="08" eyebrow="Why now">
        <h3 className="text-2xl font-semibold text-ink-900 font-display mb-3">
          Three things changed in 2026 that made Conformly possible
        </h3>
        <ol className="space-y-3 text-[15px] text-ink-700">
          <li><strong className="text-ink-900">1. Long-context.</strong> Gemini 3's 1M-token window replaces every RAG stack that existed before. The whole regulation fits in one prompt.</li>
          <li><strong className="text-ink-900">2. Agent frameworks.</strong> Hermes Agent (open-source) gives us tool dispatch, model routing, HITL gates, multi-platform gateway — out of the box.</li>
          <li><strong className="text-ink-900">3. IVDR deadlines.</strong> Class C / D transition deadlines (2027) mean every IVD on the market today must re-certify. Demand inflection point.</li>
        </ol>
      </Slide>

      {/* 09 — Innovation */}
      <Slide n="09" eyebrow="What's novel">
        <h3 className="text-2xl font-semibold text-ink-900 font-display mb-4">
          Five things you can't get anywhere else
        </h3>
        <ul className="grid sm:grid-cols-2 gap-3 text-[14.5px] text-ink-700">
          <Diff icon={<Workflow className="h-4 w-4" />} title="Continuous, not gate-based" />
          <Diff icon={<GitBranch className="h-4 w-4" />} title="Multi-version file control (git)" />
          <Diff icon={<ShieldCheck className="h-4 w-4" />} title="Pre-submission NB simulator" />
          <Diff icon={<Brain className="h-4 w-4" />} title="Long-context replaces RAG" />
          <Diff icon={<Quote className="h-4 w-4" />} title="Cite-or-refuse on every claim" />
        </ul>
      </Slide>

      {/* 10 — Sponsor tech */}
      <Slide n="10" eyebrow="Built on">
        <h3 className="text-2xl font-semibold text-ink-900 font-display mb-4">
          Every layer is named and swappable
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 text-[13.5px] text-ink-700">
          <div className="card p-3"><strong>Gemini 3 Pro</strong> — deep reasoning, 2M-token context · used in <code>parse_nb_letter</code> + <code>gspr_gap_analyzer</code></div>
          <div className="card p-3"><strong>Gemini 3 Flash</strong> — sub-second triage · used in <code>/api/chat</code> as default model</div>
          <div className="card p-3"><strong>Hermes Agent</strong> — open-source runtime · Nous Research · drives the tool dispatch</div>
          <div className="card p-3"><strong>Vultr Cloud Compute</strong> — €15/month Frankfurt VPS · whole stack runs on one box</div>
          <div className="card p-3"><strong>Featherless</strong> — serverless inference · medical fallback path (no infra)</div>
          <div className="card p-3"><strong>FastAPI + Next.js 14</strong> — one HTTP layer · 5 tools, 7 product pages</div>
        </div>
      </Slide>

      {/* 11 — Roadmap */}
      <Slide n="11" eyebrow="Roadmap">
        <h3 className="text-2xl font-semibold text-ink-900 font-display mb-4">
          From hackathon proof to multi-tenant SaaS
        </h3>
        <div className="space-y-3 text-[14px] text-ink-700">
          <Row k="Hackathon" v="✅ 5 tools · 90 unit tests · live HTTPS · live Gemini integration on 2 pages" />
          <Row k="Q3 2026" v="Dogfood across 20 real engagements at a Bologna CRO. Full multimodal PDF ingestion. Slack/Telegram HITL approvals." />
          <Row k="Q4 2026" v="Open beta. EUDAMED integration. MDCG 2022-9 SSP generator. Real-time NB-portal sync." />
          <Row k="2027" v="Multi-tenant SaaS · MDR (EU 2017/745) extension · UK/MHRA · FDA bridge." />
        </div>
      </Slide>

      {/* 12 — CTA */}
      <Slide n="12" eyebrow="Try it">
        <h3 className="text-3xl font-semibold text-ink-900 font-display mb-6">
          Conformly is live right now.
        </h3>
        <div className="space-y-3 text-[14px] text-ink-700">
          <Row k="Product" v={<Link href="/dashboard" className="text-accent underline">conformly.gopromp.com/dashboard</Link>} />
          <Row k="Real Gemini demo" v={<Link href="/nb-simulation" className="text-accent underline">conformly.gopromp.com/nb-simulation → Run live</Link>} />
          <Row k="Live chat" v={<Link href="/chat" className="text-accent underline">conformly.gopromp.com/chat → Live · Gemini 3</Link>} />
          <Row k="GitHub" v={<a href="https://github.com/ma2214889041/Conformly" className="text-accent underline" target="_blank" rel="noreferrer">github.com/ma2214889041/Conformly</a>} />
        </div>
        <div className="mt-8 text-center">
          <Link href="/dashboard" className="btn-lg btn-primary">
            Open Conformly
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Slide>
    </div>
  );
}

function Slide({
  n, eyebrow, tone, children,
}: {
  n: string;
  eyebrow: string;
  tone?: "rose" | "emerald";
  children: React.ReactNode;
}) {
  return (
    <section className={
      tone === "rose"    ? "card p-10 border-rose-200 bg-rose-50/30" :
      tone === "emerald" ? "card p-10 border-emerald-200 bg-emerald-50/30" :
      "card p-10"
    }>
      <div className="flex items-baseline justify-between mb-6">
        <p className="eyebrow">{eyebrow}</p>
        <span className="text-xl font-mono text-ink-300 font-display">slide {n}</span>
      </div>
      {children}
    </section>
  );
}

function Fact({ n, label }: { n: string; label: string }) {
  return (
    <li className="border border-ink-200 bg-white rounded-md p-3">
      <p className="text-xl font-semibold text-ink-900 font-display">{n}</p>
      <p className="text-[12px] text-ink-600 mt-0.5">{label}</p>
    </li>
  );
}

function Verb({ icon, verb, body }: { icon: React.ReactNode; verb: string; body: string }) {
  return (
    <article className="rounded-md border border-ink-200 bg-white p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-sky-50 border border-sky-200 text-accent">
          {icon}
        </span>
        <strong className="text-ink-900">{verb}</strong>
      </div>
      <p className="text-[13px] text-ink-600">{body}</p>
    </article>
  );
}

function Impact({ metric, label, icon }: { metric: string; label: string; icon: React.ReactNode }) {
  return (
    <article className="card p-5 text-center">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 border border-accent/30 text-accent mx-auto mb-3">
        {icon}
      </span>
      <p className="text-4xl font-semibold bg-gradient-to-r from-accent to-accent-deep bg-clip-text text-transparent font-display">{metric}</p>
      <p className="text-xs font-mono uppercase tracking-wider text-ink-500 mt-1">{label}</p>
    </article>
  );
}

function Diff({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <li className="flex items-center gap-2.5 p-3 rounded-md border border-ink-200 bg-white">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-sky-50 border border-sky-200 text-accent">{icon}</span>
      <span className="text-ink-900 font-medium">{title}</span>
    </li>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2 border-b border-ink-200 last:border-0">
      <span className="sm:w-40 shrink-0 text-[10px] tracking-[0.18em] uppercase text-ink-500 font-medium">{k}</span>
      <span className="text-ink-800 flex-1">{v}</span>
    </div>
  );
}
