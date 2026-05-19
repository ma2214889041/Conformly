"use client";

import { useState } from "react";
import { AlertOctagon, ArrowRight, Sparkles, TriangleAlert } from "lucide-react";
import clsx from "clsx";
import {
  GAPS, GSPR_CHAPTERS, HAZARDS, SUGGESTIONS,
  type Gap, type GsprChapter, type Hazard, type Suggestion,
} from "@/lib/mock-project";
import {
  Badge, Button, Card, CardBody, CardHeader, CardTitle, Citation,
  PageHeader, SectionLabel, SeverityChip,
} from "@/components/app/atoms";

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

function SuggestionsTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{SUGGESTIONS.length} suggestions · refreshed 11 min ago</CardTitle>
          <Badge tone="sky">
            <Sparkles className="h-3 w-3" />
            Gemini 3 Pro
          </Badge>
        </div>
      </CardHeader>
      <CardBody>
        <ul className="space-y-3">
          {SUGGESTIONS.map((s) => <SuggestionRow key={s.id} s={s} />)}
        </ul>
      </CardBody>
    </Card>
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
            <Button variant="primary" size="sm">
              <ArrowRight className="h-3.5 w-3.5" />
              {s.action}
            </Button>
            <Button variant="secondary" size="sm">View source documents</Button>
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
                    <Button variant="primary" size="sm">Request from team</Button>
                    <Button variant="secondary" size="sm">Mark not applicable</Button>
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
