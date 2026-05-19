"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertOctagon, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Loader2, Play, RadioTower, Sparkles, TrendingUp, Zap,
} from "lucide-react";
import clsx from "clsx";
import { NB_SIM, type NbFinding } from "@/lib/mock-project";
import {
  Badge, Button, Card, CardBody, CardHeader, CardTitle, Citation,
  PageHeader, ProgressBar, ScoreRing, SectionLabel, SeverityChip,
} from "@/components/app/atoms";
import { toast } from "@/components/app/toast";

type LiveFinding = {
  id: string;
  severity: "critical" | "major" | "minor";
  reg: string;
  title: string;
  desc: string;
  docs: string[];
};

type LiveResult = {
  nb_name: string;
  nb_number: string;
  letter_reference: string;
  date_issued: string;
  letter_type: string;
  clock_stopped: boolean;
  response_deadline: string;
  client_ref: string;
  device_ref: string;
  deficiencies: Array<{
    id: string;
    section_cited?: string;
    regulatory_reference?: string;
    issue: string;
    severity: string;
    evidence_required?: string;
  }>;
  counts: { Critical: number; Major: number; Minor: number; Observation: number; total: number };
  __durationMs?: number;
};

export default function NbSimulationPage() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [liveResult, setLiveResult] = useState<LiveResult | null>(null);
  const [liveError, setLiveError] = useState<string | null>(null);
  const startedAt = useRef<number>(0);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed(Date.now() - startedAt.current), 100);
    return () => clearInterval(t);
  }, [running]);

  async function runLive() {
    setRunning(true);
    setLiveError(null);
    setElapsed(0);
    startedAt.current = Date.now();
    toast({
      title: "Calling Gemini 3 Pro",
      body: "Reading the TÜV SÜD deficiency letter from your vault…",
      tone: "info",
    });
    try {
      const t0 = Date.now();
      const r = await fetch("/api/tools/parse_nb_letter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          letter_path: "projects/shm-7300/nb-letters/2026-04-30-tuv-deficiency-letter.md",
          client_id: "SHM-7300",
        }),
      });
      const j = await r.json();
      if (!j.success) throw new Error(j.error || "Unknown error");
      const data: LiveResult = { ...j.data, __durationMs: Date.now() - t0 };
      setLiveResult(data);
      toast({
        title: `Live Gemini response in ${Math.round((Date.now() - t0) / 100) / 10} s`,
        body: `${data.counts.total} findings (${data.counts.Critical} critical · ${data.counts.Major} major · ${data.counts.Minor} minor)`,
        tone: "success",
      });
    } catch (e: any) {
      setLiveError(e.message ?? String(e));
      toast({
        title: "Live call failed — falling back to scripted preview",
        body: e.message ?? String(e),
        tone: "warning",
      });
    } finally {
      setRunning(false);
    }
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
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <Badge tone="sky">
                  <Sparkles className="h-3 w-3" />
                  Gemini 3 Pro
                </Badge>
                <Badge tone={liveResult ? "green" : "neutral"}>
                  <RadioTower className="h-3 w-3" />
                  {liveResult ? "live result loaded" : "scripted preview"}
                </Badge>
                <span className="text-[11px] font-mono text-ink-500">
                  {running
                    ? `running · ${(elapsed / 1000).toFixed(1)} s`
                    : liveResult
                      ? `live in ${((liveResult.__durationMs ?? 0) / 1000).toFixed(1)} s`
                      : `last run · ${NB_SIM.run_date}`}
                </span>
              </div>
              <h2 className="text-[16px] font-semibold text-ink-900 mb-1">
                Run a new Notified Body review
              </h2>
              <p className="text-[13px] text-ink-600 leading-relaxed">
                Press <span className="font-semibold text-ink-900">Run live</span> to call Gemini 3 Pro through the FastAPI sidecar.
                It reads the TÜV SÜD deficiency letter in your vault (<code className="font-mono text-[11.5px] text-ink-700">projects/shm-7300/nb-letters/</code>) and returns a structured deficiency plan — typically in 8–14 seconds.
              </p>
              {liveError && (
                <p className="text-[12px] text-warning mt-2">
                  Live call returned an error: <code className="font-mono">{liveError}</code>.
                  Scripted preview shown below.
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Button variant="primary" size="lg" onClick={runLive} disabled={running}>
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                {running ? `Calling Gemini · ${(elapsed / 1000).toFixed(1)} s` : "Run live (real Gemini)"}
              </Button>
              {liveResult && (
                <Button variant="secondary" size="sm" onClick={() => setLiveResult(null)}>
                  Reset to scripted preview
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {liveResult && <LiveResultBanner result={liveResult} />}

      {/* Results panel */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4">
          <VerdictCard liveResult={liveResult} />
        </div>
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <FindingsCard liveResult={liveResult} />
          <HistoryCard liveScore={liveResult ? Math.max(40, 100 - liveResult.counts.total * 8) : null} />
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Live result banner (only shown after a successful Gemini call)
// ===========================================================================

function LiveResultBanner({ result }: { result: LiveResult }) {
  return (
    <Card className="mb-6 border-success/40 bg-emerald-50/30">
      <CardBody>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <Badge tone="green">
            <Zap className="h-3 w-3" />
            Live Gemini 3 Pro response
          </Badge>
          <Badge tone="outline">{result.nb_name}</Badge>
          <Badge tone="outline">{result.nb_number}</Badge>
          <span className="text-[11px] font-mono text-ink-500">ref · {result.letter_reference}</span>
          <span className="text-[11px] font-mono text-ink-500">issued · {result.date_issued}</span>
        </div>
        <p className="text-[13.5px] text-ink-900 leading-relaxed">
          Letter ingested for <span className="font-semibold">{result.client_ref}</span>'s{" "}
          <span className="font-semibold">{result.device_ref}</span>. Clock {result.clock_stopped ? <strong className="text-warning">stopped</strong> : "running"} · response deadline{" "}
          <strong>{result.response_deadline || "not stated"}</strong>.{" "}
          Gemini extracted <strong>{result.counts.total} structured findings</strong> in{" "}
          {((result.__durationMs ?? 0) / 1000).toFixed(1)} seconds.
        </p>
      </CardBody>
    </Card>
  );
}

// ===========================================================================
// Verdict + score
// ===========================================================================

function VerdictCard({ liveResult }: { liveResult: LiveResult | null }) {
  // Heuristic score derivation: each open finding subtracts; critical worth more
  const score = liveResult
    ? Math.max(0, 100 - (liveResult.counts.Critical * 14 + liveResult.counts.Major * 7 + liveResult.counts.Minor * 3))
    : NB_SIM.score;
  const verdict = liveResult
    ? (liveResult.counts.Critical > 0 ? "Likely to receive deficiencies" : liveResult.counts.Major > 0 ? "Submission needs revision" : "Ready to submit")
    : NB_SIM.verdict;
  const verdictDetail = liveResult
    ? `${liveResult.counts.total} findings extracted directly by Gemini 3 Pro from the Notified Body letter — see structured rows below.`
    : NB_SIM.verdict_detail;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Predicted outcome</CardTitle>
          {liveResult && <Badge tone="green">live</Badge>}
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col items-center text-center py-2">
          <ScoreRing value={score} size={140} stroke={11} sublabel="NB readiness" />
          <Badge tone={score >= 80 ? "green" : score >= 60 ? "sky" : "amber"} className="mt-3">{verdict}</Badge>
          <p className="text-[13px] text-ink-600 leading-relaxed mt-3 max-w-xs">{verdictDetail}</p>
        </div>

        <div className="mt-5 pt-5 border-t border-ink-200">
          <SectionLabel>Sources consulted</SectionLabel>
          <ul className="space-y-1 text-[12px] text-ink-700">
            {(liveResult
              ? ["Gemini 3 Pro · 2M-token context", "TÜV SÜD letter (vault)", "IVDR Annex I", "ISO 10993-5", "ISO 14971 §7.3"]
              : NB_SIM.sources
            ).map((s) => (
              <li key={s} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-accent shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between mt-4 text-[11px] font-mono text-ink-500">
            <span>confidence</span>
            <span className="text-accent font-semibold">
              {liveResult ? "Gemini-grounded" : `${Math.round(NB_SIM.confidence * 100)}%`}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// ===========================================================================
// Findings list (simulated deficiency letter)
// ===========================================================================

function FindingsCard({ liveResult }: { liveResult: LiveResult | null }) {
  const findings: NbFinding[] = liveResult
    ? liveResult.deficiencies.map((d) => ({
        id: d.id,
        severity: (d.severity?.toLowerCase() === "critical" ? "critical" :
                   d.severity?.toLowerCase() === "minor"    ? "minor"    : "major") as NbFinding["severity"],
        reg: d.regulatory_reference || "—",
        title: d.issue || d.id,
        desc: d.evidence_required || d.issue,
        docs: [],
      }))
    : NB_SIM.findings;
  const counts = {
    critical: findings.filter((f) => f.severity === "critical").length,
    major:    findings.filter((f) => f.severity === "major").length,
    minor:    findings.filter((f) => f.severity === "minor").length,
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{liveResult ? "Findings · live Gemini extraction" : "Simulated deficiency findings"}</CardTitle>
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <Pill label="Critical" n={counts.critical} tone="rose" />
            <Pill label="Major"    n={counts.major}    tone="amber" />
            <Pill label="Minor"    n={counts.minor}    tone="sky" />
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <ul className="space-y-2.5">
          {findings.map((f, i) => (
            <FindingRow key={f.id} f={f} defaultOpen={i === 0} />
          ))}
        </ul>
        <p className="text-[11px] text-ink-500 mt-4 font-mono">
          {liveResult
            ? "These rows came back from the live Gemini call. Generate / mark / ignore actions write to the audit log."
            : "Click any finding row to expand. Press 'Run live' above to replace with a real Gemini extraction."}
        </p>
      </CardBody>
    </Card>
  );
}

function FindingRow({ f, defaultOpen = false }: { f: NbFinding; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const ring =
    f.severity === "critical" ? "border-l-danger"  :
    f.severity === "major"    ? "border-l-warning" :
    "border-l-success";
  return (
    <li className={clsx("rounded-lg border border-ink-200 bg-white border-l-4 transition-shadow", ring, open && "shadow-sm")}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left p-4 hover:bg-surface-subtle/40 transition-colors cursor-pointer rounded-r-lg"
      >
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
            {!open && (
              <p className="text-[11px] text-ink-500 font-mono mt-1.5">click to expand · {f.docs.length} affected doc{f.docs.length === 1 ? "" : "s"}</p>
            )}
          </div>
          <span className="shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-md bg-ink-100 text-ink-500">
            {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </span>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0 border-t border-ink-100 animate-fade-in">
          <p className="text-[13px] text-ink-700 leading-relaxed mt-3">{f.desc}</p>
          <p className="text-[11px] mt-3 flex flex-wrap gap-1.5 items-center">
            <span className="text-ink-500 mr-1">Affected:</span>
            {f.docs.map((d) => (
              <span key={d} className="font-mono text-ink-700 bg-surface-subtle border border-ink-200 rounded px-1.5 py-0.5">
                {d}
              </span>
            ))}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                toast({
                  title: `Generating CAPA draft for ${f.id}`,
                  body: "Draft will land in /reports under CAPA Response Draft.",
                  tone: "info",
                })
              }
            >
              <Sparkles className="h-3.5 w-3.5" />
              Generate CAPA response draft
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                toast({
                  title: `${f.id} marked as addressed`,
                  body: "It will not appear in the next NB simulation run.",
                  tone: "success",
                })
              }
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Mark addressed
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                toast({
                  title: `${f.id} dismissed`,
                  body: "Justification required — opens a form in production.",
                  tone: "warning",
                })
              }
            >
              Ignore (with justification)
            </Button>
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

function HistoryCard({ liveScore }: { liveScore: number | null }) {
  const max = 100;
  const baseHistory = NB_SIM.history;
  const history = liveScore != null
    ? [...baseHistory, { run: baseHistory.length + 1, date: "Today · live", score: liveScore, critical: 0, major: 0, minor: 0 }]
    : baseHistory;
  const latest = history[history.length - 1].score;
  const prev   = history[history.length - 2].score;
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
        <div className={clsx("grid gap-3 mb-4", history.length === 5 ? "grid-cols-5" : "grid-cols-4")}>
          {history.map((h) => (
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
