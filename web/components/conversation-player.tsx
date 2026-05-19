"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Play,
  RotateCcw,
  ShieldAlert,
  User,
  Wrench,
} from "lucide-react";
import clsx from "clsx";
import type { Scenario, TimelineEvent } from "@/lib/demos";

// Per-event delay (ms). Tweaked so a viewer never feels stuck but also
// notices each beat — the tool_result tile lingers longest because that's
// the dramatic moment.
function delayFor(ev: TimelineEvent): number {
  switch (ev.kind) {
    case "user":        return 900;
    case "thought":     return 1200;
    case "tool_call":   return 900;
    case "tool_result": return Math.min(2200, Math.max(900, (ev.durationMs ?? 1500) / 4));
    case "assistant":   return 1800;
    case "hitl":        return 1400;
  }
}

export function ConversationPlayer({ scenario }: { scenario: Scenario }) {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll the conversation log when new events appear.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [step]);

  // Drive the timeline.
  useEffect(() => {
    if (!running) return;
    if (step >= scenario.timeline.length) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), delayFor(scenario.timeline[step]));
    return () => clearTimeout(t);
  }, [running, step, scenario]);

  const start = () => {
    setStep(0);
    setDecision(null);
    setRunning(true);
  };

  const reset = () => {
    setRunning(false);
    setStep(0);
    setDecision(null);
  };

  const events = scenario.timeline.slice(0, step);
  const done = step >= scenario.timeline.length && !running;

  return (
    <div className="card overflow-hidden">
      {/* Top bar — title + controls ----------------------------------- */}
      <div className="flex items-center justify-between gap-4 border-b border-ink-800/60 px-6 py-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-ink-50 truncate">{scenario.title}</h3>
          <p className="text-sm text-ink-400 truncate">{scenario.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {step === 0 && !running ? (
            <button onClick={start} className="btn-primary">
              <Play className="h-4 w-4" />
              Play scenario
            </button>
          ) : (
            <button onClick={reset} className="btn-secondary">
              <RotateCcw className="h-4 w-4" />
              Replay
            </button>
          )}
        </div>
      </div>

      {/* Conversation log --------------------------------------------- */}
      <div className="bg-ink-950/40 p-6 space-y-4 min-h-[420px] max-h-[640px] overflow-y-auto">
        {events.length === 0 ? (
          <EmptyState onStart={start} duration={scenario.duration} />
        ) : (
          events.map((ev, i) => (
            <EventBlock
              key={i}
              ev={ev}
              decision={decision}
              onDecide={ev.kind === "hitl" ? setDecision : undefined}
            />
          ))
        )}

        {running && step < scenario.timeline.length && <Typing />}
        {done && <DoneFooter />}

        <div ref={endRef} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Event blocks
// ---------------------------------------------------------------------------

function EventBlock({
  ev, decision, onDecide,
}: {
  ev: TimelineEvent;
  decision: "approve" | "reject" | null;
  onDecide?: (d: "approve" | "reject") => void;
}) {
  switch (ev.kind) {
    case "user":      return <UserMessage text={ev.text} />;
    case "thought":   return <Thought text={ev.text} />;
    case "tool_call": return <ToolCall tool={ev.tool} args={ev.args} />;
    case "tool_result": return <ToolResult tool={ev.tool} data={ev.data} durationMs={ev.durationMs} />;
    case "assistant": return <AssistantMessage text={ev.text} />;
    case "hitl":      return <HitlPrompt prompt={ev.prompt} decision={decision} onDecide={onDecide} />;
  }
}

function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="shrink-0 mt-1 h-7 w-7 rounded-full bg-ink-700 flex items-center justify-center">
        <User className="h-3.5 w-3.5 text-ink-200" />
      </div>
      <div className="flex-1 max-w-prose">
        <p className="text-xs text-ink-500 mb-1 font-mono">you</p>
        <p className="text-ink-100 leading-relaxed whitespace-pre-line">{text}</p>
      </div>
    </div>
  );
}

function Thought({ text }: { text: string }) {
  return (
    <div className="flex gap-3 animate-fade-in pl-10">
      <p className="text-xs text-ink-500 italic leading-relaxed">
        <span className="text-ink-400 mr-1">›</span>
        {text}
      </p>
    </div>
  );
}

function ToolCall({ tool, args }: { tool: string; args: Record<string, unknown> }) {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="shrink-0 mt-1 h-7 w-7 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
        <Wrench className="h-3.5 w-3.5 text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-accent font-mono mb-1">tool_call</p>
        <div className="card !rounded-lg !border-ink-700/40 p-3">
          <p className="font-mono text-sm text-ink-100">{tool}(</p>
          <pre className="font-mono text-[11.5px] text-ink-300 pl-4 overflow-x-auto">
            {Object.entries(args).map(([k, v], i, a) => (
              <span key={k}>
                <span className="text-ink-500">{k}</span>=
                <span className="text-cyan-300">{JSON.stringify(v)}</span>
                {i < a.length - 1 ? "," : ""}
                {"\n"}
              </span>
            ))}
          </pre>
          <p className="font-mono text-sm text-ink-100">)</p>
        </div>
      </div>
    </div>
  );
}

function ToolResult({
  tool, data, durationMs,
}: {
  tool: string;
  data: unknown;
  durationMs?: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex gap-3 animate-slide-up">
      <div className="shrink-0 mt-1 h-7 w-7 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-xs text-emerald-300 font-mono">tool_result</p>
          {durationMs && (
            <span className="text-[10px] font-mono text-ink-500">{durationMs}ms</span>
          )}
          <code className="text-xs text-ink-500 font-mono">{tool}</code>
        </div>
        <ResultPreview tool={tool} data={data} />
        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-2 text-[11px] font-mono text-ink-400 hover:text-ink-200 inline-flex items-center gap-1"
        >
          {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {open ? "hide raw JSON" : "show raw JSON"}
        </button>
        {open && (
          <pre className="code-block mt-2 text-[11px] max-h-72 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

function ResultPreview({ tool, data }: { tool: string; data: unknown }) {
  // Per-tool pretty previews. The demo payloads are typed as `unknown`
  // (the timeline accepts any tool output shape), but each card knows
  // exactly what it's rendering for its tool. We cast to `any` at the
  // boundary so the inner cards can stay readable.
  const d = data as any;
  if (tool === "conformly_parse_nb_letter") return <NbLetterCard data={d} />;
  if (tool === "conformly_gspr_gap_analyzer") return <GsprReportCard data={d} />;
  if (tool === "conformly_list_clients") return <ListClientsCard data={d} />;
  return (
    <pre className="code-block text-[11px] max-h-60 overflow-auto">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

function AssistantMessage({ text }: { text: string }) {
  return (
    <div className="flex gap-3 animate-slide-up">
      <div className="shrink-0 mt-1 h-7 w-7 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
        <Bot className="h-3.5 w-3.5 text-accent" />
      </div>
      <div className="flex-1 max-w-prose">
        <p className="text-xs text-accent font-mono mb-1">conformly</p>
        <p className="text-ink-100 leading-relaxed whitespace-pre-line">{renderInline(text)}</p>
      </div>
    </div>
  );
}

function HitlPrompt({
  prompt, decision, onDecide,
}: {
  prompt: string;
  decision: "approve" | "reject" | null;
  onDecide?: (d: "approve" | "reject") => void;
}) {
  return (
    <div className="flex gap-3 animate-slide-up">
      <div className="shrink-0 mt-1 h-7 w-7 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
        <ShieldAlert className="h-3.5 w-3.5 text-amber-300" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-amber-300 font-mono mb-1">human-in-the-loop · pending approval</p>
        <div className="card !border-amber-400/30 p-4">
          <p className="text-ink-100 mb-3">{prompt}</p>
          {decision === null ? (
            <div className="flex flex-wrap gap-2">
              <button onClick={() => onDecide?.("approve")} className="btn-primary">
                <CheckCircle2 className="h-4 w-4" />
                Approve
              </button>
              <button onClick={() => onDecide?.("reject")} className="btn-secondary">
                Reject
              </button>
              <p className="text-[11px] text-ink-500 self-center ml-2 font-mono">
                (in production this is a Slack button)
              </p>
            </div>
          ) : decision === "approve" ? (
            <p className="text-emerald-300 text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Approved · agent would now send the draft response to BSI
            </p>
          ) : (
            <p className="text-rose-300 text-sm">Rejected · the draft stays in the vault for revision.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex items-center gap-2 text-xs font-mono text-ink-500 pl-10">
      <Loader2 className="h-3 w-3 animate-spin" />
      reasoning…
    </div>
  );
}

function EmptyState({ onStart, duration }: { onStart: () => void; duration: string }) {
  return (
    <div className="text-center py-16">
      <p className="text-ink-400 mb-1 text-sm font-mono">scenario ready</p>
      <p className="text-ink-300 mb-6">Press Play to step through the agent's turn.</p>
      <button onClick={onStart} className="btn-primary">
        <Play className="h-4 w-4" />
        Play · {duration}
      </button>
    </div>
  );
}

function DoneFooter() {
  return (
    <div className="text-center text-xs font-mono text-ink-500 pt-6 border-t border-ink-800/40">
      end of scenario · replay to step through again
    </div>
  );
}

// ---------------------------------------------------------------------------
// Result-preview cards (per-tool pretty views)
// ---------------------------------------------------------------------------

function NbLetterCard({ data }: { data: any }) {
  return (
    <div className="card !rounded-lg !border-emerald-400/20 p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge-cyan">{data.nb_name}</span>
        <span className="badge-slate">{data.nb_number}</span>
        <span className="badge-slate font-mono">{data.letter_reference}</span>
        {data.clock_stopped && <span className="badge-amber">⏸ clock stopped</span>}
        {data.response_deadline && (
          <span className="badge-rose">deadline {data.response_deadline}</span>
        )}
      </div>
      <p className="text-[13px] text-ink-300">
        Device: <span className="text-ink-100">{data.device_ref}</span> · Client:{" "}
        <span className="text-ink-100">{data.client_ref}</span>
      </p>
      <div className="grid grid-cols-4 gap-1 text-[11px] font-mono">
        <SeverityChip label="Critical" n={data.counts.Critical} tone="rose" />
        <SeverityChip label="Major" n={data.counts.Major} tone="amber" />
        <SeverityChip label="Minor" n={data.counts.Minor} tone="cyan" />
        <SeverityChip label="Obs" n={data.counts.Observation} tone="slate" />
      </div>
      <ol className="space-y-2 text-[13px]">
        {data.deficiencies.map((d: any) => (
          <li key={d.id} className="border-l-2 border-ink-700 pl-3">
            <p className="text-ink-100">
              <span className="font-mono text-ink-400 mr-2">{d.id}</span>
              <span className={clsx(
                "text-[10px] font-mono uppercase tracking-wider mr-2 px-1.5 py-0.5 rounded",
                d.severity === "Critical" && "bg-rose-400/20 text-rose-300",
                d.severity === "Major" && "bg-amber-400/20 text-amber-300",
                d.severity === "Minor" && "bg-cyan-400/20 text-cyan-300",
                d.severity === "Observation" && "bg-ink-700 text-ink-300",
              )}>
                {d.severity}
              </span>
              {d.issue}
            </p>
            <p className="mt-1 text-[12px] text-ink-400">
              <span className="text-ink-500 font-mono mr-1">ref:</span>
              {d.regulatory_reference}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function GsprReportCard({ data }: { data: any }) {
  return (
    <div className="card !rounded-lg !border-emerald-400/20 p-4 space-y-4">
      <p className="text-ink-100 leading-relaxed">
        <span className="text-ink-500 font-mono text-xs mr-2">headline:</span>
        {data.headline}
      </p>
      <div className="grid grid-cols-4 gap-1 text-[11px] font-mono">
        <SeverityChip label="addressed" n={data.summary.addressed} tone="emerald" />
        <SeverityChip label="partial" n={data.summary.partial} tone="amber" />
        <SeverityChip label="open" n={data.summary.open} tone="rose" />
        <SeverityChip label="n/a" n={data.summary.n_a} tone="slate" />
      </div>
      <div className="space-y-2">
        {data.items.map((it: any) => (
          <details key={it.clause_id} className="border-l-2 border-ink-700 pl-3 group">
            <summary className="cursor-pointer flex flex-wrap items-center gap-2 text-[13px]">
              <span className="font-mono text-ink-400">{it.clause_id}</span>
              <span className="text-ink-100">{it.clause_title}</span>
              <span className={clsx(
                "text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ml-auto",
                it.status === "addressed" && "bg-emerald-400/20 text-emerald-300",
                it.status === "partial" && "bg-amber-400/20 text-amber-300",
                it.status === "open" && "bg-rose-400/20 text-rose-300",
                it.status === "n/a" && "bg-ink-700 text-ink-300",
              )}>
                {it.status}
              </span>
              {it.priority === "high" && (
                <span className="badge-rose !text-[10px]">priority high</span>
              )}
            </summary>
            <div className="mt-2 space-y-1 text-[12px]">
              {it.evidence && <p><span className="text-emerald-400 font-mono mr-1">evidence:</span> {it.evidence}</p>}
              {it.gap && <p><span className="text-rose-400 font-mono mr-1">gap:</span> {it.gap}</p>}
              {it.recommended_action && (
                <p><span className="text-accent font-mono mr-1">next:</span> {it.recommended_action}</p>
              )}
            </div>
          </details>
        ))}
      </div>
      {data.top_risks?.length > 0 && (
        <p className="text-[12px] text-ink-400">
          <span className="text-ink-500 font-mono mr-1">top risks:</span>
          {data.top_risks.join(", ")}
        </p>
      )}
    </div>
  );
}

function ListClientsCard({ data }: { data: any[] }) {
  return (
    <div className="card !rounded-lg !border-emerald-400/20 p-3">
      <table className="w-full text-[12.5px]">
        <thead className="text-[10px] font-mono uppercase tracking-wider text-ink-500">
          <tr>
            <th className="text-left py-1 pr-2">Client</th>
            <th className="text-left py-1 pr-2">Class</th>
            <th className="text-left py-1 pr-2">Phase</th>
            <th className="text-left py-1 pr-2">Risk</th>
            <th className="text-left py-1">Next due</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.client_id} className="border-t border-ink-800/40">
              <td className="py-1.5 pr-2">
                <span className="font-mono text-ink-400 mr-1">{row.client_id}</span>
                <span className="text-ink-200">{row.codename}</span>
              </td>
              <td className="py-1.5 pr-2 font-mono">{row.ivdr_class}</td>
              <td className="py-1.5 pr-2 text-ink-300">{row.current_phase}</td>
              <td className="py-1.5 pr-2">
                <span className={clsx(
                  "badge !text-[10px]",
                  row.risk_level === "high" && "border-rose-400/40 text-rose-300 bg-rose-400/10",
                  row.risk_level === "medium" && "border-amber-400/40 text-amber-300 bg-amber-400/10",
                  row.risk_level === "low" && "border-emerald-400/40 text-emerald-300 bg-emerald-400/10",
                )}>
                  {row.risk_level}
                </span>
              </td>
              <td className="py-1.5 font-mono text-ink-200">{row.next_action_due}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SeverityChip({ label, n, tone }: { label: string; n: number; tone: "rose" | "amber" | "cyan" | "slate" | "emerald" }) {
  return (
    <div className={clsx(
      "px-2 py-1 rounded text-center",
      tone === "rose" && "bg-rose-400/10 text-rose-300",
      tone === "amber" && "bg-amber-400/10 text-amber-300",
      tone === "cyan" && "bg-cyan-400/10 text-cyan-300",
      tone === "emerald" && "bg-emerald-400/10 text-emerald-300",
      tone === "slate" && "bg-ink-800 text-ink-300",
    )}>
      <span>{label}</span>
      <span className="ml-1 font-semibold">{n}</span>
    </div>
  );
}

// Lightweight markdown bold renderer for assistant messages.
// We deliberately don't pull in a markdown library — the only inline
// markup we use today is **bold**.
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-ink-50">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}
