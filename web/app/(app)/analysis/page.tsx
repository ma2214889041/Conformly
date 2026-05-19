"use client";

import { useEffect, useRef, useState } from "react";
import { AlertOctagon, ArrowRight, Loader2, RefreshCcw, Sparkles, TriangleAlert, Zap } from "lucide-react";
import clsx from "clsx";
import {
  GAPS, GSPR_CHAPTERS, HAZARDS, SUGGESTIONS,
  type Gap, type GsprChapter, type Hazard, type Suggestion,
} from "@/lib/mock-project";
import {
  Badge, Button, Card, CardBody, CardHeader, CardTitle, Citation,
  PageHeader, SectionLabel, SeverityChip,
} from "@/components/app/atoms";
import { toast } from "@/components/app/toast";

type TabId = "suggestions" | "mapping" | "gaps" | "risk";

const TABS: { id: TabId; label: string; description: string }[] = [
  { id: "suggestions", label: "Design suggestions", description: "Continuous AI feedback on design choices that affect compliance." },
  { id: "mapping",     label: "Compliance mapping", description: "Every GSPR clause from IVDR Annex I scored against your evidence." },
  { id: "gaps",        label: "Evidence gaps",      description: "Prioritised list of missing documents and missing data." },
  { id: "risk",        label: "Risk analysis",      description: "ISO 14971 hazard table, control verification, residual-risk evaluation." },
];

export default function AnalysisPage() {
  const [tab, setTab] = useState<TabId>("suggestions");

  return (
    <div className="px-8 py-8 max-w-[1600px] mx-auto">
      <PageHeader
        eyebrow="Analysis"
        title="Regulatory analysis"
        subtitle="Continuous design feedback, GSPR mapping, evidence gaps and the ISO 14971 risk picture — every entry cites its source regulation and the document that grounds it."
      />

      <div className="card p-1 mb-4 inline-flex flex-wrap gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={clsx(
              "px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-colors",
              t.id === tab
                ? "bg-accent text-white"
                : "text-ink-600 hover:text-ink-900 hover:bg-ink-100",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-[13px] text-ink-500 mb-6 max-w-3xl">
        {TABS.find((t) => t.id === tab)?.description}
      </p>

      {tab === "suggestions" && <SuggestionsTab />}
      {tab === "mapping"     && <MappingTab />}
      {tab === "gaps"        && <GapsTab />}
      {tab === "risk"        && <RiskTab />}
    </div>
  );
}

// ===========================================================================
// Tab 1 — Design suggestions
// ===========================================================================

type LiveItem = {
  clause_id: string;
  clause_title?: string;
  status: "addressed" | "partial" | "open" | "n/a";
  evidence?: string;
  gap?: string;
  recommended_action?: string;
  priority?: "high" | "medium" | "low";
};

type LiveGspr = {
  client_id: string;
  ivdr_class?: string;
  current_phase?: string;
  headline?: string;
  top_risks?: string[];
  summary?: { addressed: number; partial: number; open: number; n_a: number; total: number };
  items?: LiveItem[];
  __durationMs?: number;
};

function SuggestionsTab() {
  const [running, setRunning] = useState(false);
  const [live, setLive] = useState<LiveGspr | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef(0);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed(Date.now() - startedAt.current), 100);
    return () => clearInterval(t);
  }, [running]);

  async function runLive() {
    setRunning(true);
    setElapsed(0);
    startedAt.current = Date.now();
    toast({
      title: "Calling Gemini 3 Pro",
      body: "Benching the GSPR checklist against the SHM-7300 dossier…",
      tone: "info",
    });
    try {
      const t0 = Date.now();
      const r = await fetch("/api/tools/gspr_gap_analyzer", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ client_id: "CLIENT-A" }),
      });
      const j = await r.json();
      if (!j.success) throw new Error(j.error || "Unknown error");
      setLive({ ...j.data, __durationMs: Date.now() - t0 });
      toast({
        title: `GSPR analysis in ${((Date.now() - t0) / 1000).toFixed(1)} s`,
        body: `${j.data.summary?.total ?? 0} clauses · ${j.data.summary?.open ?? 0} open`,
        tone: "success",
      });
    } catch (e: any) {
      toast({ title: "Live call failed", body: e?.message ?? String(e), tone: "warning" });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-accent/30 bg-accent/[0.03]">
        <CardBody>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <Badge tone="sky">
                  <Sparkles className="h-3 w-3" />
                  Gemini 3 Pro
                </Badge>
                <Badge tone={live ? "green" : "neutral"}>
                  <Zap className="h-3 w-3" />
                  {live ? `live · ${live.summary?.total ?? 0} clauses scored` : "scripted preview"}
                </Badge>
                <span className="text-[11px] font-mono text-ink-500">
                  {running ? `running · ${(elapsed / 1000).toFixed(1)} s`
                    : live ? `${((live.__durationMs ?? 0) / 1000).toFixed(1)} s`
                    : "refreshed 11 min ago"}
                </span>
              </div>
              <p className="text-[13px] text-ink-600 leading-relaxed">
                Press <strong>Run live GSPR analysis</strong> to call Gemini 3 Pro through the FastAPI sidecar. It reads the full GSPR checklist and the project dossier in one prompt, scores every clause, and returns a typed gap report — typically in 12-16 seconds.
              </p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Button variant="primary" size="lg" onClick={runLive} disabled={running}>
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                {running ? `Calling Gemini · ${(elapsed / 1000).toFixed(1)} s` : "Run live GSPR analysis"}
              </Button>
              {live && (
                <Button variant="secondary" size="sm" onClick={() => setLive(null)}>
                  <RefreshCcw className="h-3.5 w-3.5" />
                  Reset to scripted suggestions
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {live ? <LiveGsprReport live={live} /> : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{SUGGESTIONS.length} suggestions · refreshed 11 min ago</CardTitle>
              <Badge tone="sky">
                <Sparkles className="h-3 w-3" />
                Cached
              </Badge>
            </div>
          </CardHeader>
          <CardBody>
            <ul className="space-y-3">
              {SUGGESTIONS.map((s) => <SuggestionRow key={s.id} s={s} />)}
            </ul>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

function LiveGsprReport({ live }: { live: LiveGspr }) {
  const total = live.summary?.total ?? 0;
  const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0);
  return (
    <Card className="border-success/40 bg-emerald-50/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Live Gemini gap analysis · {live.client_id}</CardTitle>
            {live.headline && (
              <p className="text-[13.5px] text-ink-900 mt-2">{live.headline}</p>
            )}
          </div>
          <Badge tone="green">{((live.__durationMs ?? 0) / 1000).toFixed(1)} s</Badge>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex h-2 rounded-full overflow-hidden bg-ink-200 mb-2">
          <div className="bg-success" style={{ width: `${pct(live.summary?.addressed ?? 0)}%` }} />
          <div className="bg-warning" style={{ width: `${pct(live.summary?.partial ?? 0)}%` }} />
          <div className="bg-danger"  style={{ width: `${pct(live.summary?.open ?? 0)}%` }} />
          <div className="bg-ink-400" style={{ width: `${pct(live.summary?.n_a ?? 0)}%` }} />
        </div>
        <div className="grid grid-cols-4 gap-2 mb-5 text-[11px] font-mono">
          <Chip label="addressed" n={live.summary?.addressed ?? 0} tone="green" />
          <Chip label="partial"   n={live.summary?.partial ?? 0}   tone="amber" />
          <Chip label="open"      n={live.summary?.open ?? 0}      tone="rose" />
          <Chip label="n/a"       n={live.summary?.n_a ?? 0}       tone="slate" />
        </div>

        <ul className="space-y-2">
          {(live.items ?? []).map((it) => (
            <li key={it.clause_id} className="rounded-lg border border-ink-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <code className="font-mono text-[12px] text-ink-500">{it.clause_id}</code>
                <span className="text-[13.5px] text-ink-900 font-medium">{it.clause_title ?? it.clause_id}</span>
                <span className={clsx(
                  "text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ml-auto",
                  it.status === "addressed" && "bg-emerald-50 text-emerald-700",
                  it.status === "partial"   && "bg-amber-50 text-amber-700",
                  it.status === "open"      && "bg-rose-50 text-rose-700",
                  it.status === "n/a"       && "bg-ink-100 text-ink-500",
                )}>
                  {it.status}
                </span>
                {it.priority === "high" && <Badge tone="red">priority high</Badge>}
              </div>
              {it.evidence && <p className="text-[12.5px] text-ink-700"><span className="text-success font-mono mr-1.5">evidence:</span>{it.evidence}</p>}
              {it.gap && <p className="text-[12.5px] text-ink-700 mt-1"><span className="text-danger font-mono mr-1.5">gap:</span>{it.gap}</p>}
              {it.recommended_action && <p className="text-[12.5px] text-ink-700 mt-1"><span className="text-accent font-mono mr-1.5">next:</span>{it.recommended_action}</p>}
            </li>
          ))}
        </ul>

        {live.top_risks && live.top_risks.length > 0 && (
          <p className="text-[12px] text-ink-500 mt-4">
            <span className="text-ink-700 font-mono mr-2">top risks:</span>
            {live.top_risks.map((r) => <span key={r} className="font-mono text-danger mr-2">{r}</span>)}
          </p>
        )}
      </CardBody>
    </Card>
  );
}

function Chip({ label, n, tone }: { label: string; n: number; tone: "green" | "amber" | "rose" | "slate" }) {
  return (
    <div className={clsx(
      "px-2 py-1 rounded text-center",
      tone === "green" && "bg-emerald-50 text-emerald-700",
      tone === "amber" && "bg-amber-50 text-amber-700",
      tone === "rose"  && "bg-rose-50 text-rose-700",
      tone === "slate" && "bg-ink-100 text-ink-500",
    )}>
      <span>{label}</span>
      <span className="ml-1 font-semibold">{n}</span>
    </div>
  );
}

function SuggestionRow({ s }: { s: Suggestion }) {
  const ring =
    s.severity === "high"   ? "border-l-danger"  :
    s.severity === "medium" ? "border-l-warning" :
    "border-l-success";
  return (
    <li className={clsx("rounded-lg border border-ink-200 bg-white border-l-4 p-4", ring)}>
      <div className="flex items-start gap-3">
        <span className={clsx(
          "h-8 w-8 shrink-0 rounded-md grid place-items-center bg-surface-subtle border border-ink-200",
          s.severity === "high"   && "text-danger",
          s.severity === "medium" && "text-warning",
          s.severity === "low"    && "text-success",
        )}>
          <Sparkles className="h-4 w-4" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <SeverityChip kind={s.severity} />
            <Citation>{s.reg}</Citation>
          </div>
          <p className="text-[14px] text-ink-900 font-medium leading-snug mb-1">{s.title}</p>
          <p className="text-[13px] text-ink-600 leading-relaxed mb-3">{s.body}</p>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                toast({
                  title: s.action,
                  body: `Task assigned for ${s.title.slice(0, 80)}…`,
                  tone: "success",
                })
              }
            >
              <ArrowRight className="h-3.5 w-3.5" />
              {s.action}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                toast({
                  title: "Opening source documents",
                  body: "Linked files: see /documents → folder 4 GSPR.",
                  tone: "info",
                })
              }
            >
              View source documents
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}

// ===========================================================================
// Tab 2 — Compliance mapping
// ===========================================================================

function MappingTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardBody>
          <SectionLabel right={
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <Legend dot="bg-success" label="addressed" />
              <Legend dot="bg-warning" label="partial" />
              <Legend dot="bg-danger"  label="open" />
            </div>
          }>
            IVDR Annex I — General Safety and Performance Requirements
          </SectionLabel>
          <p className="text-[13px] text-ink-500 max-w-2xl">
            Every clause scored against the evidence currently in your vault. Click a clause to
            see the original regulation text, the MDCG guidance interpretation, and the
            documents backing the score.
          </p>
        </CardBody>
      </Card>

      {GSPR_CHAPTERS.map((ch) => <GsprChapterCard key={ch.id} ch={ch} />)}
    </div>
  );
}

function GsprChapterCard({ ch }: { ch: GsprChapter }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{ch.name}</CardTitle>
      </CardHeader>
      <CardBody>
        <ul className="space-y-1.5">
          {ch.items.map((it) => (
            <li
              key={it.id}
              className="grid grid-cols-[60px_1fr_auto_auto] items-center gap-3 px-3 py-2 rounded-md hover:bg-surface-subtle border border-transparent hover:border-ink-200 cursor-pointer"
            >
              <code className="font-mono text-[12px] text-ink-500">{it.id}</code>
              <span className="text-[13px] text-ink-900">{it.title}</span>
              <span className="text-[11px] font-mono text-ink-500">
                {it.evidence} doc{it.evidence === 1 ? "" : "s"}
              </span>
              <StateDot state={it.state} />
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}

function StateDot({ state }: { state: "green" | "yellow" | "red" }) {
  const map = {
    green:  { bg: "bg-success", text: "text-success", label: "addressed" },
    yellow: { bg: "bg-warning", text: "text-warning", label: "partial"   },
    red:    { bg: "bg-danger",  text: "text-danger",  label: "open"      },
  }[state];
  return (
    <span className={clsx(
      "flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider",
      map.text,
    )}>
      <span className={clsx("h-1.5 w-1.5 rounded-full", map.bg)} />
      {map.label}
    </span>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-ink-500">
      <span className={clsx("h-1.5 w-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}

// ===========================================================================
// Tab 3 — Evidence gaps
// ===========================================================================

function GapsTab() {
  const groups = {
    critical:  GAPS.filter((g) => g.category === "critical"),
    important: GAPS.filter((g) => g.category === "important"),
    minor:     GAPS.filter((g) => g.category === "minor"),
  };
  return (
    <div className="space-y-4">
      <GapsGroup
        title="Critical — will block certification"
        gaps={groups.critical}
        toneClass="border-l-danger"
      />
      <GapsGroup
        title="Important — will trigger a deficiency letter"
        gaps={groups.important}
        toneClass="border-l-warning"
      />
      <GapsGroup
        title="Minor — recommended"
        gaps={groups.minor}
        toneClass="border-l-success"
      />
    </div>
  );
}

function GapsGroup({
  title, gaps, toneClass,
}: {
  title: string;
  gaps: Gap[];
  toneClass: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <span className="text-[11px] font-mono text-ink-500">{gaps.length}</span>
        </div>
      </CardHeader>
      <CardBody>
        <ul className="space-y-2.5">
          {gaps.map((g) => (
            <li key={g.id} className={clsx("rounded-lg border border-ink-200 bg-white border-l-4 p-4", toneClass)}>
              <div className="flex items-start gap-3">
                <span className="h-8 w-8 shrink-0 rounded-md grid place-items-center bg-surface-subtle border border-ink-200 text-ink-700">
                  <AlertOctagon className="h-4 w-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <SeverityChip kind={g.category} />
                    <Citation>{g.reg}</Citation>
                    <span className="text-[11px] text-ink-500 font-mono">owner · {g.owner}</span>
                  </div>
                  <p className="text-[14px] text-ink-900 font-medium leading-snug mb-1">{g.title}</p>
                  <p className="text-[13px] text-ink-600 leading-relaxed mb-3">{g.reason}</p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        toast({
                          title: `Request sent to ${g.owner}`,
                          body: g.title,
                          tone: "success",
                        })
                      }
                    >
                      Request from team
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        toast({
                          title: "Marked not applicable",
                          body: "Justification will be required in production.",
                          tone: "warning",
                        })
                      }
                    >
                      Mark not applicable
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}

// ===========================================================================
// Tab 4 — Risk analysis
// ===========================================================================

function RiskTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Hazard register · ISO 14971 §5</CardTitle>
          <Badge tone="sky">{HAZARDS.length} hazards · 1 unverified</Badge>
        </div>
      </CardHeader>
      <CardBody>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-[12.5px]">
            <thead className="text-[10px] tracking-[0.18em] uppercase text-ink-500 border-b border-ink-200">
              <tr>
                <Th>ID</Th>
                <Th>Category</Th>
                <Th>Hazard</Th>
                <Th>Severity</Th>
                <Th>Probability</Th>
                <Th>Risk</Th>
                <Th>Control measure</Th>
                <Th>Residual</Th>
              </tr>
            </thead>
            <tbody>
              {HAZARDS.map((h) => <HazardRow key={h.id} h={h} />)}
            </tbody>
          </table>
        </div>
        <p className="text-[12px] text-ink-500 mt-4 font-mono">
          Hazards flagged with ⚠ have a control measure but no verification record — Conformly cannot mark them acceptable until ISO 14971 §7.3 evidence is provided.
        </p>
      </CardBody>
    </Card>
  );
}

function HazardRow({ h }: { h: Hazard }) {
  return (
    <tr className="border-b border-ink-100 hover:bg-surface-subtle">
      <Td><code className="font-mono text-ink-500">{h.id}</code></Td>
      <Td>{h.category}</Td>
      <Td className="text-ink-900">{h.hazard}</Td>
      <Td>{h.severity}</Td>
      <Td>{h.probability}</Td>
      <Td>
        <span className={clsx(
          "inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-medium",
          h.risk === "High"   && "text-danger",
          h.risk === "Medium" && "text-warning",
          h.risk === "Low"    && "text-success",
        )}>
          <span className={clsx(
            "h-1.5 w-1.5 rounded-full",
            h.risk === "High"   && "bg-danger",
            h.risk === "Medium" && "bg-warning",
            h.risk === "Low"    && "bg-success",
          )} />
          {h.risk}
        </span>
      </Td>
      <Td className="text-ink-700">{h.control}</Td>
      <Td>
        <span className="inline-flex items-center gap-1">
          {h.flagged && <TriangleAlert className="h-3 w-3 text-warning" />}
          <span className={clsx(
            "font-medium",
            h.residual === "Acceptable"   && "text-success",
            h.residual === "Unverified"   && "text-warning",
            h.residual === "Unacceptable" && "text-danger",
          )}>
            {h.residual}
          </span>
        </span>
      </Td>
    </tr>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left py-2 px-3 font-medium">{children}</th>;
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={clsx("py-2 px-3 align-top text-ink-700", className)}>{children}</td>;
}
