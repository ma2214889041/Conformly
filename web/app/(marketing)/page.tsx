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
        </div>
      </section>

      {/* =============================================================== */}
      {/* WHY IT'S DIFFERENT                                               */}
      {/* =============================================================== */}
      <section id="why" className="border-t border-ink-200 bg-white scroll-mt-24">
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
      {/* MARKET SCOPE                                                     */}
      {/* =============================================================== */}
      <section className="border-t border-ink-200 bg-gradient-to-b from-white to-surface-subtle">
        <div className="container-narrow py-20">
          <header className="mb-12">
            <p className="eyebrow mb-3">market scope</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-900 font-display">
              A €2.4B compliance market — forced to re-buy under IVDR.
            </h2>
            <p className="mt-3 text-ink-600 max-w-2xl">
              The IVDR transition is a once-in-a-generation forced upgrade for every IVD on the EU market. ~9,800 manufacturers must re-certify; ~2,300 active Notified Body assessments per year; €350-800k average legacy consulting spend per Class C device.
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-ink-200 bg-white p-6">
              <p className="eyebrow mb-2">TAM</p>
              <p className="text-3xl font-semibold text-ink-900 font-display">€2.4B<span className="text-base text-ink-500">/yr</span></p>
              <p className="mt-2 text-sm text-ink-600">Global IVD regulatory compliance spend (2024) growing 14% YoY through 2030.</p>
            </div>
            <div className="rounded-2xl border border-ink-200 bg-white p-6">
              <p className="eyebrow mb-2">SAM</p>
              <p className="text-3xl font-semibold text-ink-900 font-display">€720M<span className="text-base text-ink-500">/yr</span></p>
              <p className="mt-2 text-sm text-ink-600">EU-bound Class B/C/D IVDs needing Clinical Performance Studies. ~1,400 submissions/year.</p>
            </div>
            <div className="rounded-2xl border border-ink-200 bg-white p-6">
              <p className="eyebrow mb-2">SOM (Y3)</p>
              <p className="text-3xl font-semibold text-ink-900 font-display">€3.5M<span className="text-base text-ink-500"> ARR</span></p>
              <p className="mt-2 text-sm text-ink-600">~70 active engagements by 2028 via Bologna CRO dogfooding → external beta → multi-tenant SaaS.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================================== */}
      {/* REVENUE STREAMS                                                  */}
      {/* =============================================================== */}
      <section className="border-t border-ink-200 bg-white">
        <div className="container-narrow py-20">
          <header className="mb-12">
            <p className="eyebrow mb-3">revenue streams</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-900 font-display">
              Five ways Conformly makes money.
            </h2>
            <p className="mt-3 text-ink-600 max-w-2xl">
              Target gross margin <strong>78%+</strong>. Gemini run-cost is ~€2.50/tool-call; Vultr hosting €15/month per instance; the rest is salary.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-4">
            <Revenue title="Per-project subscription" price="€4,000 / month" body="One device project = one subscription. Core stream. Most clients run 1-3 projects in parallel." icon={<Workflow className="h-5 w-5" />} />
            <Revenue title="Per-seat add-ons" price="€200 / seat / month" body="Owner included; additional QA / RA reviewers are seats. Drives team expansion." icon={<Users className="h-5 w-5" />} />
            <Revenue title="NB simulation runs" price="€450 / run" body="Pre-submission audit. Many manufacturers buy this without subscribing — one-shot value gate." icon={<Gauge className="h-5 w-5" />} />
            <Revenue title="Knowledge-base licensing" price="€30k / yr / firm" body="CROs license Conformly's curated 27-source vault to use across all their clients." icon={<Library className="h-5 w-5" />} />
            <Revenue title="Implementation & onboarding" price="€15-40k one-time" body="Vault migration from legacy QMS, training, custom procedure import." icon={<Wrench className="h-5 w-5" />} wide />
          </div>
        </div>
      </section>

      {/* =============================================================== */}
      {/* COMPETITORS + USP                                                */}
      {/* =============================================================== */}
      <section className="border-t border-ink-200 bg-gradient-to-b from-white to-surface-subtle">
        <div className="container-narrow py-20">
          <header className="mb-12">
            <p className="eyebrow mb-3">competitors &amp; usp</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-900 font-display">
              Everyone else is a template library or a billable hour.
            </h2>
            <p className="mt-3 text-ink-600 max-w-2xl">
              The QMS incumbents sell document workflows; Big-4 consultants sell hours. Nobody continuously reads the regulation against your design while you're still designing.
            </p>
          </header>

          <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-surface-subtle text-ink-700">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Competitor</th>
                  <th className="text-left px-4 py-3 font-medium">Approach</th>
                  <th className="text-left px-4 py-3 font-medium">Where they're weak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                <tr>
                  <td className="px-4 py-3 font-medium text-ink-900">Greenlight Guru</td>
                  <td className="px-4 py-3 text-ink-700">eQMS with workflow templates</td>
                  <td className="px-4 py-3 text-ink-600">Static templates · no AI analysis · no NB prediction</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-ink-900">MasterControl</td>
                  <td className="px-4 py-3 text-ink-700">Enterprise QMS suite</td>
                  <td className="px-4 py-3 text-ink-600">Heavy · weeks to implement · no native LLM</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-ink-900">Qualio</td>
                  <td className="px-4 py-3 text-ink-700">SaaS QMS for SMEs</td>
                  <td className="px-4 py-3 text-ink-600">SOP management only · no regulatory reading · no GSPR mapping</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-ink-900">ChatGPT / Claude (raw)</td>
                  <td className="px-4 py-3 text-ink-700">Free-form Q&amp;A</td>
                  <td className="px-4 py-3 text-ink-600">No vault grounding · hallucinates clauses · no NB simulator</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-ink-900">Big-4 consultants</td>
                  <td className="px-4 py-3 text-ink-700">Manual human review</td>
                  <td className="px-4 py-3 text-ink-600">€350-800k · slow (months) · not scalable</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-[12.5px] text-ink-600 max-w-2xl">
            Our differentiators are spelled out in <a href="#why" className="text-accent hover:underline">Why it's different</a> above — none of the competitors above do all five.
          </p>
        </div>
      </section>

      {/* =============================================================== */}
      {/* FUTURE PROSPECTS                                                 */}
      {/* =============================================================== */}
      <section className="border-t border-ink-200 bg-white">
        <div className="container-narrow py-20">
          <header className="mb-12">
            <p className="eyebrow mb-3">future prospects</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-900 font-display">
              Same architecture extends to MDR, MHRA, FDA.
            </h2>
            <p className="mt-3 text-ink-600 max-w-2xl">
              Markdown vault + specialized agent + long-context LLM is a pattern, not a one-off. Each new market is another curated knowledge layer + a new tool family.
            </p>
          </header>

          <div className="grid md:grid-cols-4 gap-3">
            <Horizon when="Hackathon" tone="now" items={["5 specialist tools shipped", "90 unit tests passing", "HTTPS live on conformly.gopromp.com", "Real Gemini on /chat, /analysis, /nb-simulation"]} />
            <Horizon when="Q3 2026" tone="next" items={["Internal dogfooding · 20+ engagements", "Full multimodal PDF ingestion", "Slack + Telegram gateway for HITL"]} />
            <Horizon when="Q4 2026" tone="next" items={["Open beta · external CROs", "EUDAMED integration", "MDCG 2022-9 SSP generator", "Cybersecurity per MDCG 2019-16"]} />
            <Horizon when="2027" tone="future" items={["Multi-tenant SaaS", "MDR (2017/745) extension", "UK / MHRA + FDA bridges", "CRO playbook marketplace"]} />
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
// Architecture diagram — custom-styled visual, not ASCII
// ===========================================================================

function ArchitectureDiagram() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header strip */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="eyebrow mb-1">live system architecture</p>
          <p className="text-sm text-ink-600">Every block below is a real running component. Click into the product to see them in action.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/60 px-3 py-1.5 text-[11px] font-mono text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
          conformly.gopromp.com · live
        </div>
      </div>

      {/* ============ STAGE 1 · USER ============ */}
      <ArchStage n="01" label="user" tint="slate">
        <div className="grid sm:grid-cols-[1fr_auto] items-center gap-4">
          <ArchPanel
            tone="slate"
            icon={<Users className="h-5 w-5" />}
            title="Compliance lead"
            tags={["asks questions", "drops design files", "approves outbound actions"]}
          />
          <div className="hidden sm:flex flex-col items-center text-[10px] font-mono text-ink-400 uppercase tracking-wider">
            <span>HTTPS</span>
            <span className="text-ink-300">·</span>
            <span>auto-refresh</span>
          </div>
        </div>
      </ArchStage>

      <FlowConnector />

      {/* ============ STAGE 2 · FRONT-END ============ */}
      <ArchStage n="02" label="front-end" tint="sky">
        <ArchPanel
          tone="sky"
          icon={<Layers className="h-5 w-5" />}
          title="Next.js 14"
          subtitle="9 product pages · App Router · server components"
          chips={["dashboard", "documents", "analysis", "reports", "NB sim", "chat", "knowledge", "pitch", "landing"]}
        />
      </ArchStage>

      <FlowConnector label="/api/* over HTTPS" />

      {/* ============ STAGE 3 · API SIDECAR ============ */}
      <ArchStage n="03" label="api sidecar" tint="sky">
        <ArchPanel
          tone="sky"
          icon={<Wrench className="h-5 w-5" />}
          title="FastAPI · :8080"
          subtitle="one process · five typed endpoints"
          endpoints={[
            { method: "POST", path: "/api/tools/*" },
            { method: "POST", path: "/api/chat" },
            { method: "SSE",  path: "/api/agent/run/*" },
            { method: "GET",  path: "/api/health" },
          ]}
        />
      </ArchStage>

      <FlowConnector label="tool_call · JSON envelope" />

      {/* ============ STAGE 4 · SPECIALIZED AGENT (centerpiece) ============ */}
      <ArchStage n="04" label="specialized agent" tint="accent">
        <div className="relative rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-sky-50/60 to-white p-5 sm:p-7 shadow-sm">
          {/* Title bar */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white shadow-sm">
                  <Brain className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold text-ink-900 font-display">Hermes Agent · IVDR specialization</h3>
              </div>
              <p className="text-[12.5px] text-ink-600 leading-relaxed max-w-xl">
                Per-turn loop: <strong>read</strong> → <strong>decide tool</strong> → <strong>compose with citations</strong> → <em>(optional HITL pause)</em> → <strong>write audit line</strong> → <strong>reply</strong>.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <ModelChip primary>Gemini 3 · default</ModelChip>
              <ModelChip>Featherless · fallback</ModelChip>
              <ModelChip>Claude · available</ModelChip>
            </div>
          </div>

          {/* 5 specialist tools — visually balanced grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            <ToolCard
              name="parse_nb_letter"
              llm
              tests={16}
              body="Reads a Notified Body letter (EN/DE/IT) → structured deficiencies."
            />
            <ToolCard
              name="gspr_gap_analyzer"
              llm
              tests={19}
              body="Benches the technical file against IVDR Annex I clause-by-clause."
            />
            <ToolCard
              name="search_regulation"
              tests={21}
              body="Catalogues 27 regulatory sources by family, name, version."
            />
            <ToolCard
              name="get_client_status"
              tests={16}
              body="Reads a project dossier into a typed status object."
            />
            <ToolCard
              name="list_clients"
              tests={18}
              body="Portfolio view — sortable by phase, risk, due date."
            />
          </div>

          {/* Footer stat strip */}
          <div className="mt-5 pt-4 border-t border-ink-200 grid sm:grid-cols-3 gap-3 text-[11px] font-mono">
            <ArchStat label="LLM-backed tools" value="2 / 5" hint="⚡ = live Gemini call" />
            <ArchStat label="Unit tests" value="90 pass" hint="0.34 s · pytest" />
            <ArchStat label="Return type" value="typed JSON envelope" hint="schema-validated" />
          </div>
        </div>
      </ArchStage>

      <FlowConnector label="read · paths only · no embeddings · no vector DB" />

      {/* ============ STAGE 5 · KNOWLEDGE LAYER ============ */}
      <ArchStage n="05" label="knowledge layer" tint="emerald">
        <div className="rounded-2xl border-2 border-emerald-200/70 bg-gradient-to-br from-emerald-50/40 to-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white">
                <Database className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-ink-900 font-display">vault/ · plain markdown</h3>
                <p className="text-[12px] text-ink-600">git-versioned · every change is a commit · roll back to any state</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CountBadge value="27" label="reg sources" />
              <CountBadge value="∞" label="commits" icon={<GitBranch className="h-3 w-3" />} />
            </div>
          </div>

          {/* Top: 6 regulatory families */}
          <p className="eyebrow mb-2 text-ink-500">regulatory corpus</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-5">
            <KnowledgeChip family="IVDR"    count="6" detail="regulation + annexes"  tone="rose" />
            <KnowledgeChip family="MDCG"    count="4" detail="guidance papers"        tone="amber" />
            <KnowledgeChip family="ISO"     count="5" detail="quality + risk"         tone="emerald" />
            <KnowledgeChip family="IEC"     count="3" detail="software + electrical"  tone="emerald" />
            <KnowledgeChip family="CLSI"    count="5" detail="EP performance"         tone="emerald" />
            <KnowledgeChip family="Team-NB" count="2" detail="position papers"        tone="sky" />
          </div>

          {/* Bottom: client + procedures */}
          <p className="eyebrow mb-2 text-ink-500">project + procedures</p>
          <div className="grid sm:grid-cols-2 gap-2.5">
            <VaultPanel
              icon={<FolderGit2 className="h-4 w-4" />}
              tone="cyan"
              label="User project · SHM-7300"
              detail="design specs · stability · risk file · V&V protocols · NB correspondence"
            />
            <VaultPanel
              icon={<Workflow className="h-4 w-4" />}
              tone="slate"
              label="Internal procedures"
              detail="CPS 60-step workflow · NB audit prep · CAPA response playbook"
            />
          </div>
        </div>
      </ArchStage>

      <FlowConnector label="every tool invocation appends one JSON line" />

      {/* ============ STAGE 6 · AUDIT LOG ============ */}
      <ArchStage n="06" label="audit log" tint="slate">
        <ArchPanel
          tone="slate"
          icon={<FileText className="h-5 w-5" />}
          title="~/.conformly/audit.log"
          subtitle="JSON-lines · timestamp · tool · args · result"
          chips={["ISO 13485 evidence ready", "tamper-evident via git", "exportable for NB audit"]}
        />
      </ArchStage>
    </div>
  );
}

// ===========================================================================
// Architecture sub-components
// ===========================================================================

function ArchStage({
  n, label, tint, children,
}: {
  n: string;
  label: string;
  tint: "slate" | "sky" | "accent" | "emerald";
  children: React.ReactNode;
}) {
  const dot =
    tint === "slate"   ? "bg-ink-400" :
    tint === "sky"     ? "bg-sky-500" :
    tint === "accent"  ? "bg-accent" :
    "bg-emerald-500";
  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${dot} text-white text-[10px] font-mono font-semibold`}>
          {n}
        </span>
        <span className="text-[10px] tracking-[0.22em] uppercase text-ink-500 font-mono">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function FlowConnector({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-3 pl-2.5">
      <svg width="12" height="32" viewBox="0 0 12 32" className="shrink-0">
        <line x1="6" y1="0" x2="6" y2="24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="text-ink-300" />
        <path d="M 2 22 L 6 30 L 10 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink-400" />
      </svg>
      {label && (
        <span className="text-[10.5px] font-mono text-ink-500 bg-surface-subtle border border-ink-200 rounded px-2 py-0.5">
          {label}
        </span>
      )}
    </div>
  );
}

function ArchPanel({
  tone, icon, title, subtitle, tags, chips, endpoints,
}: {
  tone: "slate" | "sky" | "accent";
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  tags?: string[];
  chips?: string[];
  endpoints?: { method: string; path: string }[];
}) {
  const ring =
    tone === "slate" ? "border-ink-200 bg-white" :
    tone === "sky"   ? "border-sky-200/70 bg-gradient-to-br from-sky-50/40 to-white" :
    "border-accent/40 bg-accent/[0.04]";
  const iconBg =
    tone === "slate" ? "bg-ink-100 text-ink-700" :
    tone === "sky"   ? "bg-sky-500 text-white" :
    "bg-accent text-white";
  return (
    <div className={`rounded-2xl border-2 ${ring} p-4 sm:p-5 shadow-sm`}>
      <div className="flex items-start gap-3">
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${iconBg} shrink-0`}>
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-ink-900 font-display leading-tight">{title}</p>
          {subtitle && <p className="text-[12px] text-ink-600 mt-0.5">{subtitle}</p>}
          {tags && (
            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-ink-600">
              {tags.map((t, i) => (
                <li key={i} className="inline-flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-ink-400" />
                  {t}
                </li>
              ))}
            </ul>
          )}
          {chips && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {chips.map((c, i) => (
                <span key={i} className="inline-flex items-center rounded-md border border-ink-200 bg-white px-1.5 py-0.5 text-[10.5px] font-mono text-ink-700">
                  {c}
                </span>
              ))}
            </div>
          )}
          {endpoints && (
            <div className="mt-3 grid sm:grid-cols-2 gap-1.5">
              {endpoints.map((e, i) => (
                <div key={i} className="flex items-center gap-2 rounded border border-ink-200 bg-white px-2 py-1 font-mono text-[11px]">
                  <span className={
                    "inline-block rounded px-1.5 py-0.5 text-[9.5px] font-semibold tracking-wide " +
                    (e.method === "POST" ? "bg-emerald-100 text-emerald-700" :
                     e.method === "GET"  ? "bg-sky-100 text-sky-700" :
                                            "bg-violet-100 text-violet-700")
                  }>
                    {e.method}
                  </span>
                  <code className="text-ink-700">{e.path}</code>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ModelChip({ primary, children }: { primary?: boolean; children: React.ReactNode }) {
  return (
    <span className={
      "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10.5px] font-mono " +
      (primary
        ? "bg-accent text-white border-accent"
        : "bg-white text-ink-600 border-ink-200")
    }>
      <span className={"h-1.5 w-1.5 rounded-full " + (primary ? "bg-white" : "bg-ink-300")} />
      {children}
    </span>
  );
}

function ToolCard({
  name, llm, body, tests,
}: {
  name: string;
  llm?: boolean;
  body: string;
  tests: number;
}) {
  return (
    <div className={
      "relative rounded-xl border bg-white p-3 transition-shadow hover:shadow-md " +
      (llm ? "border-accent/40 ring-1 ring-accent/10" : "border-ink-200")
    }>
      {llm && (
        <span className="absolute -top-2 -right-2 inline-flex items-center gap-0.5 rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-mono text-white shadow-sm">
          <Zap className="h-2.5 w-2.5" />
          live
        </span>
      )}
      <code className="block font-mono text-[11.5px] font-semibold text-ink-900 truncate mb-1.5">
        {name}
      </code>
      <p className="text-[11px] text-ink-600 leading-snug min-h-[44px]">{body}</p>
      <div className="mt-2 pt-2 border-t border-ink-100 flex items-center justify-between text-[10px] font-mono">
        <span className="text-ink-400">{tests} tests</span>
        <span className="text-emerald-600">● pass</span>
      </div>
    </div>
  );
}

function ArchStat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-lg border border-ink-200 bg-white px-3 py-2">
      <p className="text-[9.5px] uppercase tracking-wider text-ink-400">{label}</p>
      <p className="text-[13px] font-semibold text-ink-900">{value}</p>
      <p className="text-[10px] text-ink-500 mt-0.5">{hint}</p>
    </div>
  );
}

function CountBadge({ value, label, icon }: { value: string; label: string; icon?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-emerald-200 px-2.5 py-1 text-[11px] font-mono">
      {icon && <span className="text-emerald-600">{icon}</span>}
      <span className="font-semibold text-ink-900">{value}</span>
      <span className="text-ink-500">{label}</span>
    </span>
  );
}

function KnowledgeChip({
  family, count, detail, tone,
}: {
  family: string;
  count: string;
  detail: string;
  tone: "rose" | "amber" | "emerald" | "sky";
}) {
  const ring =
    tone === "rose"    ? "border-rose-200 bg-white"    :
    tone === "amber"   ? "border-amber-200 bg-white"   :
    tone === "emerald" ? "border-emerald-200 bg-white" :
    "border-sky-200 bg-white";
  const dot =
    tone === "rose"    ? "bg-rose-500"    :
    tone === "amber"   ? "bg-amber-500"   :
    tone === "emerald" ? "bg-emerald-500" :
    "bg-sky-500";
  return (
    <div className={`rounded-lg border ${ring} px-2.5 py-2`}>
      <div className="flex items-center justify-between mb-0.5">
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
          <span className="text-[12px] font-semibold text-ink-900">{family}</span>
        </div>
        <span className="text-[10px] font-mono text-ink-500">{count}</span>
      </div>
      <p className="text-[10.5px] text-ink-600 leading-snug">{detail}</p>
    </div>
  );
}

function VaultPanel({
  icon, label, detail, tone,
}: {
  icon: React.ReactNode;
  label: string;
  detail: string;
  tone: "cyan" | "slate";
}) {
  const ring =
    tone === "cyan" ? "border-cyan-200 bg-cyan-50/40" : "border-ink-200 bg-surface-subtle";
  const iconBg =
    tone === "cyan" ? "bg-cyan-500 text-white" : "bg-ink-200 text-ink-700";
  return (
    <div className={`rounded-xl border ${ring} p-3 flex items-start gap-2.5`}>
      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${iconBg} shrink-0`}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[12.5px] font-semibold text-ink-900">{label}</p>
        <p className="text-[11.5px] text-ink-600 leading-snug mt-0.5">{detail}</p>
      </div>
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

// ===========================================================================
// Revenue card
// ===========================================================================

function Revenue({
  icon, title, price, body, wide,
}: {
  icon: React.ReactNode; title: string; price: string; body: string; wide?: boolean;
}) {
  return (
    <article className={`rounded-2xl border border-ink-200 bg-white p-5 ${wide ? "md:col-span-2" : ""}`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600">{icon}</span>
        <h3 className="font-semibold text-ink-900">{title}</h3>
      </div>
      <p className="text-xl font-semibold text-ink-900 font-display">{price}</p>
      <p className="mt-2 text-[13px] text-ink-600 leading-relaxed">{body}</p>
    </article>
  );
}

// ===========================================================================
// Horizon column for the roadmap
// ===========================================================================

function Horizon({ when, tone, items }: { when: string; tone: "now" | "next" | "future"; items: string[] }) {
  const ring = tone === "now" ? "border-emerald-200 bg-emerald-50/40" : tone === "next" ? "border-sky-200 bg-sky-50/40" : "border-ink-200 bg-surface-subtle";
  const dot = tone === "now" ? "bg-emerald-500" : tone === "next" ? "bg-sky-500" : "bg-ink-400";
  return (
    <article className={`rounded-2xl border ${ring} p-5`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`inline-block h-2 w-2 rounded-full ${dot}`} />
        <h3 className="font-semibold text-ink-900 text-sm font-display">{when}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="text-[12.5px] text-ink-700 leading-relaxed flex gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-ink-400 shrink-0" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
