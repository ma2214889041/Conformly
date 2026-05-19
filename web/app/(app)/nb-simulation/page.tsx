"use client";

import { useState } from "react";
import {
  AlertOctagon, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Loader2, Play, Sparkles, TrendingUp,
} from "lucide-react";
import clsx from "clsx";
import { NB_SIM, type NbFinding } from "@/lib/mock-project";
import {
  Badge, Button, Card, CardBody, CardHeader, CardTitle, Citation,
  PageHeader, ProgressBar, ScoreRing, SectionLabel, SeverityChip,
} from "@/components/app/atoms";

export default function NbSimulationPage() {
  const [running, setRunning] = useState(false);

  function runSim() {
    setRunning(true);
    setTimeout(() => setRunning(false), 2200);
  }

  return (
    <div className="px-8 py-8 max-w-[1600px] mx-auto">
      <PageHeader
        eyebrow="Notified Body simulator"
        title="Predict the deficiency letter before you submit"
        subtitle="Conformly reads the full submission as a Notified Body would. It returns a simulated deficiency letter — by clause, by severity, with the affected documents named — and tracks score improvement across runs. Backed by Gemini 3 Pro's 2M-token context, trained on patterns from seven IVDR Notified Bodies."
      />

      {/* Run simulation banner */}
      <Card className="mb-6 border-accent/30 bg-accent/[0.03]">
        <CardBody>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-1.5">
                <Badge tone="sky">
                  <Sparkles className="h-3 w-3" />
                  Gemini 3 Pro
                </Badge>
                <span className="text-[11px] font-mono text-ink-500">last run · {NB_SIM.run_date}</span>
              </div>
              <h2 className="text-[16px] font-semibold text-ink-900 mb-1">Run a new Notified Body review</h2>
              <p className="text-[13px] text-ink-600 leading-relaxed">
                Conformly will review every document currently in your vault as a Notified Body
                auditor would, score the submission readiness, and produce a structured
                deficiency letter you can act on.
              </p>
            </div>
            <Button variant="primary" size="lg" onClick={runSim} disabled={running}>
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {running ? "Reviewing…" : "Run NB review simulation"}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Results panel */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4">
          <VerdictCard />
        </div>
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <FindingsCard />
          <HistoryCard />
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Verdict + score
// ===========================================================================

function VerdictCard() {
  return (
    <Card>
      <CardHeader><CardTitle>Predicted outcome</CardTitle></CardHeader>
      <CardBody>
        <div className="flex flex-col items-center text-center py-2">
          <ScoreRing value={NB_SIM.score} size={140} stroke={11} sublabel="NB readiness" />
          <Badge tone="amber" className="mt-3">{NB_SIM.verdict}</Badge>
          <p className="text-[13px] text-ink-600 leading-relaxed mt-3 max-w-xs">
            {NB_SIM.verdict_detail}
          </p>
        </div>

        <div className="mt-5 pt-5 border-t border-ink-200">
          <SectionLabel>Sources consulted</SectionLabel>
          <ul className="space-y-1 text-[12px] text-ink-700">
            {NB_SIM.sources.map((s) => (
              <li key={s} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-accent shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between mt-4 text-[11px] font-mono text-ink-500">
            <span>confidence</span>
            <span className="text-accent font-semibold">{Math.round(NB_SIM.confidence * 100)}%</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// ===========================================================================
// Findings list (simulated deficiency letter)
// ===========================================================================

function FindingsCard() {
  const counts = {
    critical: NB_SIM.findings.filter((f) => f.severity === "critical").length,
    major:    NB_SIM.findings.filter((f) => f.severity === "major").length,
    minor:    NB_SIM.findings.filter((f) => f.severity === "minor").length,
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Simulated deficiency findings</CardTitle>
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <Pill label="Critical" n={counts.critical} tone="rose" />
            <Pill label="Major"    n={counts.major}    tone="amber" />
            <Pill label="Minor"    n={counts.minor}    tone="sky" />
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <ul className="space-y-2.5">
          {NB_SIM.findings.map((f) => <FindingRow key={f.id} f={f} />)}
        </ul>
      </CardBody>
    </Card>
  );
}

function FindingRow({ f }: { f: NbFinding }) {
  const [open, setOpen] = useState(false);
  const ring =
    f.severity === "critical" ? "border-l-danger"  :
    f.severity === "major"    ? "border-l-warning" :
    "border-l-success";
  return (
    <li className={clsx("rounded-lg border border-ink-200 bg-white border-l-4", ring)}>
      <button onClick={() => setOpen((o) => !o)} className="w-full text-left p-4">
        <div className="flex items-start gap-3">
          <span className="h-7 w-7 shrink-0 rounded-md grid place-items-center bg-surface-subtle border border-ink-200 text-ink-700">
            <AlertOctagon className="h-3.5 w-3.5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <code className="text-[11px] font-mono text-ink-500">{f.id}</code>
              <SeverityChip kind={f.severity} />
              <Citation>{f.reg}</Citation>
            </div>
            <p className="text-[14px] text-ink-900 font-medium leading-snug">{f.title}</p>
          </div>
          {open ? <ChevronUp className="h-4 w-4 text-ink-400" /> : <ChevronDown className="h-4 w-4 text-ink-400" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0 border-t border-ink-100">
          <p className="text-[13px] text-ink-700 leading-relaxed mt-3">{f.desc}</p>
          <p className="text-[11px] mt-3 flex flex-wrap gap-1.5 items-center">
            <span className="text-ink-500 mr-1">Affected:</span>
            {f.docs.map((d) => (
              <span key={d} className="font-mono text-ink-700 bg-surface-subtle border border-ink-200 rounded px-1.5 py-0.5">{d}</span>
            ))}
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Button variant="primary" size="sm">
              <Sparkles className="h-3.5 w-3.5" />
              Generate CAPA response draft
            </Button>
            <Button variant="secondary" size="sm">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Mark addressed
            </Button>
            <Button variant="ghost" size="sm">Ignore (with justification)</Button>
          </div>
        </div>
      )}
    </li>
  );
}

function Pill({ label, n, tone }: { label: string; n: number; tone: "rose" | "amber" | "sky" }) {
  return (
    <span className={clsx(
      "px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider",
      tone === "rose"  && "bg-rose-50 text-rose-700 border border-rose-200",
      tone === "amber" && "bg-amber-50 text-amber-700 border border-amber-200",
      tone === "sky"   && "bg-sky-50 text-sky-700 border border-sky-200",
    )}>
      {label} {n}
    </span>
  );
}

// ===========================================================================
// History chart
// ===========================================================================

function HistoryCard() {
  const max = 100;
  const latest = NB_SIM.history[NB_SIM.history.length - 1].score;
  const prev   = NB_SIM.history[NB_SIM.history.length - 2].score;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Score improvement over time</CardTitle>
          <Badge tone="green">
            <TrendingUp className="h-3 w-3" />
            +{latest - prev} since last run
          </Badge>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {NB_SIM.history.map((h) => (
            <div key={h.run} className="text-center">
              <p className="text-[10px] tracking-[0.18em] uppercase text-ink-500 mb-1">
                Run {h.run}
              </p>
              <div className="h-32 flex items-end justify-center mb-2">
                <div
                  className="w-full max-w-[64px] rounded-t-md bg-gradient-to-t from-accent to-accent-soft"
                  style={{ height: `${(h.score / max) * 100}%` }}
                />
              </div>
              <p className="text-[18px] font-semibold text-ink-900 font-display">{h.score}</p>
              <p className="text-[10px] font-mono text-ink-500 mt-0.5">{h.date}</p>
              <p className="text-[10px] font-mono text-ink-500 mt-2">
                <span className="text-danger">{h.critical}c</span>
                {" "}·{" "}
                <span className="text-warning">{h.major}m</span>
                {" "}·{" "}
                <span className="text-success">{h.minor}n</span>
              </p>
            </div>
          ))}
        </div>
        <p className="text-[12px] text-ink-500">
          Each run is captured in the audit log with the same JSON shape the live tools return.
          Re-running after fixing a finding produces a higher score and fewer predicted deficiencies — that's how you prove submission readiness internally before going to the Notified Body.
        </p>
      </CardBody>
    </Card>
  );
}
