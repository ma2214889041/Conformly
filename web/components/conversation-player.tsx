"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Download,
  History,
  Loader2,
  Play,
  RadioTower,
  RotateCcw,
  ShieldAlert,
  Trash2,
  User,
  Wrench,
  Zap,
} from "lucide-react";
import clsx from "clsx";
import type { Scenario, TimelineEvent } from "@/lib/demos";
import { streamScenario } from "@/lib/api";

// Per-event delay (ms) for scripted playback.
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

type Mode = "scripted" | "live";

type SavedRun = {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  mode: Mode;
  events: TimelineEvent[];
  startedAt: string;
  durationMs: number;
};

const HISTORY_KEY = "conformly:demo:history:v1";
const HISTORY_MAX = 12;

function loadHistory(): SavedRun[] {
  if (typeof window === "undefined") return [];
  try {
    return (JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]") as SavedRun[]).slice(0, HISTORY_MAX);
  } catch {
    return [];
  }
}

function saveRun(run: SavedRun) {
  if (typeof window === "undefined") return;
  const existing = loadHistory();
  const next = [run, ...existing].slice(0, HISTORY_MAX);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

function clearHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}

// ===========================================================================
// Main
// ===========================================================================

export function ConversationPlayer({
  scenario,
  liveAvailable = false,
}: {
  scenario: Scenario;
  liveAvailable?: boolean;
}) {
  const [mode, setMode] = useState<Mode>("scripted");
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const [liveEvents, setLiveEvents] = useState<TimelineEvent[]>([]);
  const [liveDone, setLiveDone] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [history, setHistory] = useState<SavedRun[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [replayingRun, setReplayingRun] = useState<SavedRun | null>(null);

  const startedAtRef = useRef<number>(0);
  const cancelRef = useRef<(() => void) | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  // Hydrate history once on the client.
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // Auto-scroll.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [step, liveEvents.length, replayingRun?.id]);

  // Elapsed-time ticker.
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed(Date.now() - startedAtRef.current), 100);
    return () => clearInterval(t);
  }, [running]);

  // Drive the scripted timeline.
  useEffect(() => {
    if (mode !== "scripted" || !running || replayingRun) return;
    if (step >= scenario.timeline.length) {
      finalize(scenario.timeline.slice(0, step), "scripted");
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), delayFor(scenario.timeline[step]));
    return () => clearTimeout(t);
  }, [mode, running, step, scenario, replayingRun]);

  // Cancel live stream when scenario / mode changes.
  useEffect(() => {
    return () => { cancelRef.current?.(); cancelRef.current = null; };
  }, [scenario.id, mode]);

  function finalize(events: TimelineEvent[], runMode: Mode) {
    setRunning(false);
    const run: SavedRun = {
      id: `${scenario.id}-${Date.now()}`,
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      mode: runMode,
      events,
      startedAt: new Date(startedAtRef.current).toISOString(),
      durationMs: Date.now() - startedAtRef.current,
    };
    saveRun(run);
    setHistory(loadHistory());
  }

  const start = () => {
    setReplayingRun(null);
    setStep(0);
    setDecision(null);
    setLiveError(null);
    setElapsed(0);
    startedAtRef.current = Date.now();
    if (mode === "live") {
      setLiveEvents([]);
      setLiveDone(false);
      setRunning(true);
      cancelRef.current = streamScenario(
        scenario.id,
        (e) => setLiveEvents((prev) => [...prev, e as TimelineEvent]),
        {
          onDone: () => {
            setLiveDone(true);
            // We grab the current closure's liveEvents via setter trick:
            setLiveEvents((evs) => { finalize(evs, "live"); return evs; });
          },
          onError: () => {
            setLiveError("Live stream lost — falling back to scripted.");
            setRunning(false);
            setMode("scripted");
          },
        },
      );
      return;
    }
    setRunning(true);
  };

  const reset = () => {
    cancelRef.current?.();
    cancelRef.current = null;
    setReplayingRun(null);
    setRunning(false);
    setStep(0);
    setDecision(null);
    setLiveEvents([]);
    setLiveDone(false);
    setLiveError(null);
    setElapsed(0);
  };

  const switchMode = (m: Mode) => {
    if (m === mode) return;
    reset();
    setMode(m);
  };

  const replay = (run: SavedRun) => {
    reset();
    setReplayingRun(run);
    setHistoryOpen(false);
  };

  // Choose which events to render right now
  const events =
    replayingRun ? replayingRun.events
    : mode === "live" ? liveEvents
    : scenario.timeline.slice(0, step);

  const done =
    replayingRun ? true
    : mode === "live" ? liveDone
    : step >= scenario.timeline.length && !running;

  // Counter for the live "tools called" badge in the header
  const toolsCalledCount = events.filter((e) => e.kind === "tool_result").length;

  return (
    <div className="card overflow-hidden">
      {/* Top bar -------------------------------------------------------- */}
      <div className="border-b border-ink-800/60 px-5 py-4 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-semibold text-ink-50 truncate">{scenario.title}</h3>
            <p className="text-sm text-ink-400 truncate">{scenario.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Mode toggle */}
            <div role="tablist" className="inline-flex rounded-lg border border-ink-700/80 p-0.5 bg-ink-900/70">
              <ModeButton
                active={mode === "scripted"}
                onClick={() => switchMode("scripted")}
                label="Scripted"
                hint="Pre-recorded JSON · no backend"
                icon={<Zap className="h-3.5 w-3.5" />}
              />
              <ModeButton
                active={mode === "live"}
                onClick={() => switchMode("live")}
                disabled={!liveAvailable}
                label="Live"
                hint={liveAvailable ? "Hits the FastAPI sidecar" : "API not reachable"}
                icon={<RadioTower className="h-3.5 w-3.5" />}
              />
            </div>

            {/* Run / Replay button */}
            {!running && events.length === 0 ? (
              <button onClick={start} className="btn-primary">
                <Play className="h-4 w-4" />
                {mode === "live" ? "Run live" : "Play"}
              </button>
            ) : (
              <button onClick={reset} className="btn-secondary">
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            )}

            {/* History toggle */}
            <button
              onClick={() => setHistoryOpen((o) => !o)}
              className={clsx(
                "btn-ghost relative",
                history.length > 0 && "text-ink-100",
              )}
              title="Saved runs"
            >
              <History className="h-4 w-4" />
              {history.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 text-[10px] font-mono rounded-full bg-accent text-ink-950 flex items-center justify-center">
                  {history.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Live stats strip */}
        {(running || done || replayingRun) && (
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-ink-400">
            <span className="badge-slate">
              <Clock className="h-3 w-3" />
              {formatElapsed(replayingRun ? replayingRun.durationMs : elapsed)}
            </span>
            <span className="badge-slate">
              {toolsCalledCount} tool call{toolsCalledCount === 1 ? "" : "s"}
            </span>
            <span className={clsx(
              "badge-slate",
              replayingRun && "border-cyan-400/30 text-cyan-300 bg-cyan-400/10"
            )}>
              {replayingRun ? "replay" : (mode === "live" ? "live" : "scripted")}
            </span>
            {done && (
              <span className="badge-emerald">
                <CheckCircle2 className="h-3 w-3" />
                completed
              </span>
            )}
            {running && (
              <span className="badge-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft" />
                running
              </span>
            )}
          </div>
        )}
      </div>

      {liveError && (
        <div className="px-6 py-2 text-xs text-amber-300 bg-amber-400/10 border-b border-amber-400/30">
          {liveError}
        </div>
      )}

      {/* History drawer ------------------------------------------------- */}
      {historyOpen && (
        <HistoryDrawer
          history={history}
          onReplay={replay}
          onClear={() => { clearHistory(); setHistory([]); }}
          onClose={() => setHistoryOpen(false)}
        />
      )}

      {/* Conversation log ---------------------------------------------- */}
      <div className="bg-gradient-to-b from-ink-950/40 to-ink-950/80 p-5 sm:p-6 min-h-[440px] max-h-[680px] overflow-y-auto">
        {events.length === 0 ? (
          <EmptyState onStart={start} duration={scenario.duration} mode={mode} />
        ) : (
          <ol className="relative space-y-5 ml-3 border-l border-ink-800/70 pl-6">
            {events.map((ev, i) => (
              <li key={i} className="relative timeline-dot">
                <EventBlock
                  ev={ev}
                  decision={decision}
                  onDecide={ev.kind === "hitl" ? setDecision : undefined}
                  index={i + 1}
                  total={events.length}
                />
              </li>
            ))}
          </ol>
        )}

        {running && !replayingRun && <Typing />}
        {done && (
          <DoneFooter
            onReplay={start}
            onCopy={() => navigator.clipboard?.writeText(JSON.stringify(events, null, 2))}
          />
        )}

        <div ref={endRef} />
      </div>
    </div>
  );
}

// ===========================================================================
// History drawer
// ===========================================================================

function HistoryDrawer({
  history, onReplay, onClear, onClose,
}: {
  history: SavedRun[];
  onReplay: (r: SavedRun) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  return (
    <div className="px-5 py-4 border-b border-ink-800/60 bg-ink-900/70">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-ink-400">
          Saved runs · {history.length}
        </h4>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={onClear}
              className="text-[11px] font-mono text-rose-300 hover:text-rose-200 inline-flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" />
              clear all
            </button>
          )}
          <button onClick={onClose} className="text-[11px] font-mono text-ink-400 hover:text-ink-200">
            close
          </button>
        </div>
      </div>
      {history.length === 0 ? (
        <p className="text-sm text-ink-500 italic">
          Run a scenario and it'll be saved here. We keep the last {HISTORY_MAX} so you can compare scripted vs live, or replay a specific result.
        </p>
      ) : (
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {history.map((r) => (
            <li key={r.id}>
              <button
                onClick={() => onReplay(r)}
                className="w-full flex items-center justify-between gap-3 text-left rounded-md px-3 py-2 hover:bg-ink-800/60 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink-100 truncate">{r.scenarioTitle}</p>
                  <p className="text-[11px] font-mono text-ink-500">
                    {new Date(r.startedAt).toLocaleString()} · {formatElapsed(r.durationMs)} · {r.events.length} events
                  </p>
                </div>
                <span className={clsx(
                  "badge-slate text-[10px] shrink-0",
                  r.mode === "live" && "border-cyan-400/30 text-cyan-300 bg-cyan-400/10",
                  r.mode === "scripted" && "border-amber-400/30 text-amber-300 bg-amber-400/10",
                )}>
                  {r.mode}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ===========================================================================
// Event blocks
// ===========================================================================

function EventBlock({
  ev, decision, onDecide, index, total,
}: {
  ev: TimelineEvent;
  decision: "approve" | "reject" | null;
  onDecide?: (d: "approve" | "reject") => void;
  index: number;
  total: number;
}) {
  switch (ev.kind) {
    case "user":      return <UserMessage text={ev.text} />;
    case "thought":   return <Thought text={ev.text} />;
    case "tool_call": return <ToolCall tool={ev.tool} args={ev.args} index={index} total={total} />;
    case "tool_result": return <ToolResult tool={ev.tool} data={ev.data} durationMs={ev.durationMs} />;
    case "assistant": return <AssistantMessage text={ev.text} />;
    case "hitl":      return <HitlPrompt prompt={ev.prompt} decision={decision} onDecide={onDecide} />;
  }
}

function UserMessage({ text }: { text: string }) {
  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-ink-700">
          <User className="h-3 w-3 text-ink-200" />
        </span>
        <span className="text-[11px] font-mono uppercase tracking-wider text-ink-500">you</span>
      </div>
      <div className="rounded-xl border border-ink-700/40 bg-ink-900/60 px-4 py-3 max-w-prose">
        <p className="text-ink-100 leading-relaxed whitespace-pre-line">{text}</p>
      </div>
    </div>
  );
}

function Thought({ text }: { text: string }) {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[11px] font-mono uppercase tracking-wider text-ink-500">internal</span>
      </div>
      <p className="text-[13px] text-ink-400 italic leading-relaxed max-w-prose">{text}</p>
    </div>
  );
}

function ToolCall({
  tool, args, index, total,
}: {
  tool: string;
  args: Record<string, unknown>;
  index: number;
  total: number;
}) {
  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-accent/20 border border-accent/30">
          <Wrench className="h-3 w-3 text-accent" />
        </span>
        <span className="text-[11px] font-mono uppercase tracking-wider text-accent">tool_call</span>
        <span className="text-[10px] font-mono text-ink-500">step {index}/{total}</span>
      </div>
      <div className="rounded-xl border border-accent/20 bg-accent/[0.03] px-4 py-3">
        <p className="font-mono text-[13px] text-ink-100">{tool}(</p>
        <div className="font-mono text-[12px] text-ink-300 pl-4 space-y-0.5">
          {Object.entries(args).map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <span className="text-ink-500 shrink-0">{k}:</span>
              <span className="text-cyan-300 break-all">{JSON.stringify(v)}</span>
            </div>
          ))}
        </div>
        <p className="font-mono text-[13px] text-ink-100">)</p>
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
  const d = data as any;
  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-emerald-400/15 border border-emerald-400/30">
          <CheckCircle2 className="h-3 w-3 text-emerald-300" />
        </span>
        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300">
          result
        </span>
        {typeof durationMs === "number" && (
          <span className="text-[10px] font-mono text-ink-500">{durationMs.toLocaleString()} ms</span>
        )}
        <code className="text-[10px] font-mono text-ink-500 ml-auto">{tool}</code>
      </div>

      <ResultPreview tool={tool} data={d} />

      <button
        onClick={() => setOpen((o) => !o)}
        className="mt-2 text-[11px] font-mono text-ink-400 hover:text-ink-200 inline-flex items-center gap-1"
      >
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {open ? "hide raw JSON" : "raw JSON"}
      </button>
      {open && (
        <pre className="code-block mt-2 text-[11px] max-h-80 overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

function ResultPreview({ tool, data }: { tool: string; data: any }) {
  if (tool === "conformly_parse_nb_letter") return <NbLetterCard data={data} />;
  if (tool === "conformly_gspr_gap_analyzer") return <GsprReportCard data={data} />;
  if (tool === "conformly_list_clients") return <ListClientsCard data={data} />;
  if (tool === "conformly_get_client_status") return <ClientStatusCard data={data} />;
  if (tool === "conformly_search_regulation") return <RegulationListCard data={data} />;
  return (
    <pre className="code-block text-[11px] max-h-60 overflow-auto">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

function AssistantMessage({ text }: { text: string }) {
  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 border border-accent/30">
          <Bot className="h-3 w-3 text-accent" />
        </span>
        <span className="text-[11px] font-mono uppercase tracking-wider text-accent">conformly</span>
      </div>
      <div className="rounded-xl border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent px-4 py-3 max-w-prose">
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
    <div className="animate-slide-up">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-amber-400/15 border border-amber-400/30">
          <ShieldAlert className="h-3 w-3 text-amber-300" />
        </span>
        <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300">human approval needed</span>
      </div>
      <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-4">
        <p className="text-ink-100 mb-3">{prompt}</p>
        {decision === null ? (
          <div className="flex flex-wrap gap-2 items-center">
            <button onClick={() => onDecide?.("approve")} className="btn-primary">
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </button>
            <button onClick={() => onDecide?.("reject")} className="btn-secondary">
              Reject
            </button>
            <p className="text-[11px] text-ink-500 font-mono ml-auto">
              (in production this is a Slack button)
            </p>
          </div>
        ) : decision === "approve" ? (
          <p className="text-emerald-300 text-sm flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Approved · agent would now send the draft response
          </p>
        ) : (
          <p className="text-rose-300 text-sm">Rejected · draft stays in the vault for revision.</p>
        )}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div className="ml-3 mt-5 inline-flex items-center gap-2 text-xs font-mono text-ink-500 px-3 py-1.5 rounded-full bg-ink-900/50 border border-ink-800">
      <Loader2 className="h-3 w-3 animate-spin" />
      thinking…
    </div>
  );
}

function EmptyState({
  onStart, duration, mode,
}: {
  onStart: () => void;
  duration: string;
  mode: Mode;
}) {
  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-accent/10 border border-accent/30 mb-4">
        <Play className="h-5 w-5 text-accent ml-0.5" />
      </div>
      <p className="text-ink-200 mb-1">Ready when you are.</p>
      <p className="text-sm text-ink-500 mb-6">
        {mode === "live"
          ? "We'll hit the actual FastAPI sidecar — every JSON payload is real."
          : `Pre-recorded · ~${duration}. Identical JSON to the live tools.`}
      </p>
      <button onClick={onStart} className="btn-primary text-base px-6 py-3">
        <Play className="h-4 w-4" />
        Start scenario
      </button>
    </div>
  );
}

function DoneFooter({
  onReplay, onCopy,
}: {
  onReplay: () => void;
  onCopy: () => void;
}) {
  return (
    <div className="mt-8 pt-5 border-t border-ink-800/40 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
      <span className="text-ink-500">end of scenario · saved to your history</span>
      <div className="flex items-center gap-2">
        <button onClick={onCopy} className="btn-ghost text-xs">
          <Copy className="h-3 w-3" />
          copy transcript
        </button>
        <button onClick={onReplay} className="btn-ghost text-xs">
          <RotateCcw className="h-3 w-3" />
          run again
        </button>
      </div>
    </div>
  );
}

function ModeButton({
  active, onClick, label, hint, icon, disabled,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  hint: string;
  icon: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={hint}
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all",
        active ? "bg-accent text-ink-950 shadow shadow-accent/30" : "text-ink-300 hover:text-ink-50",
        disabled && "opacity-40 cursor-not-allowed hover:text-ink-300",
      )}
      role="tab"
      aria-selected={active}
    >
      {icon}
      {label}
    </button>
  );
}

// ===========================================================================
// Per-tool result preview cards
// ===========================================================================

function NbLetterCard({ data }: { data: any }) {
  return (
    <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.03] p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge-cyan">{data.nb_name}</span>
        <span className="badge-slate">{data.nb_number}</span>
        <span className="badge-slate font-mono text-[10px]">{data.letter_reference}</span>
        {data.clock_stopped && <span className="badge-amber">⏸ clock stopped</span>}
        {data.response_deadline && (
          <span className="badge-rose">deadline {data.response_deadline}</span>
        )}
      </div>
      <p className="text-[13px] text-ink-300">
        Device <span className="text-ink-100">{data.device_ref}</span> ·
        client <span className="text-ink-100">{data.client_ref}</span>
      </p>
      <div className="grid grid-cols-4 gap-1.5">
        <Chip label="Critical" n={data.counts.Critical} tone="rose" />
        <Chip label="Major" n={data.counts.Major} tone="amber" />
        <Chip label="Minor" n={data.counts.Minor} tone="cyan" />
        <Chip label="Obs" n={data.counts.Observation} tone="slate" />
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
  const total = data.summary?.total ?? 0;
  const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0);
  return (
    <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.03] p-4 space-y-4">
      <p className="text-ink-100 leading-relaxed">
        <span className="text-ink-500 font-mono text-xs mr-2">headline:</span>
        {data.headline}
      </p>

      {/* Stacked progress bar of statuses */}
      <div>
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-ink-500 mb-1">
          <span>coverage</span>
          <span>{total} clauses</span>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden bg-ink-800">
          <div className="bg-emerald-400/70" style={{ width: `${pct(data.summary?.addressed ?? 0)}%` }} />
          <div className="bg-amber-400/70"   style={{ width: `${pct(data.summary?.partial ?? 0)}%` }} />
          <div className="bg-rose-400/70"    style={{ width: `${pct(data.summary?.open ?? 0)}%` }} />
          <div className="bg-ink-600"        style={{ width: `${pct(data.summary?.n_a ?? 0)}%` }} />
        </div>
        <div className="mt-1.5 grid grid-cols-4 gap-1 text-[10px] font-mono">
          <Chip label="addressed" n={data.summary?.addressed ?? 0} tone="emerald" />
          <Chip label="partial"   n={data.summary?.partial ?? 0}   tone="amber" />
          <Chip label="open"      n={data.summary?.open ?? 0}      tone="rose" />
          <Chip label="n/a"       n={data.summary?.n_a ?? 0}       tone="slate" />
        </div>
      </div>

      <div className="space-y-1.5">
        {(data.items || []).map((it: any) => (
          <details key={it.clause_id} className="border-l-2 border-ink-700 pl-3 group">
            <summary className="cursor-pointer flex flex-wrap items-center gap-2 text-[13px] hover:text-ink-50">
              <span className="font-mono text-ink-400">{it.clause_id}</span>
              <span className="text-ink-100">{it.clause_title}</span>
              <span className={clsx(
                "text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ml-auto",
                it.status === "addressed" && "bg-emerald-400/20 text-emerald-300",
                it.status === "partial"   && "bg-amber-400/20 text-amber-300",
                it.status === "open"      && "bg-rose-400/20 text-rose-300",
                it.status === "n/a"       && "bg-ink-700 text-ink-300",
              )}>
                {it.status}
              </span>
              {it.priority === "high" && (
                <span className="badge-rose !text-[10px]">priority high</span>
              )}
            </summary>
            <div className="mt-2 space-y-1 text-[12px] pb-2">
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
        <div className="text-[12px] text-ink-300 pt-2 border-t border-ink-800/60">
          <span className="text-ink-500 font-mono mr-1">top risks:</span>
          {data.top_risks.map((id: string) => (
            <span key={id} className="font-mono text-rose-300 mr-2">{id}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function ListClientsCard({ data }: { data: any[] }) {
  return (
    <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.03] p-3 overflow-x-auto">
      <table className="w-full text-[12.5px]">
        <thead className="text-[10px] font-mono uppercase tracking-wider text-ink-500">
          <tr>
            <th className="text-left py-2 pr-3">Client</th>
            <th className="text-left py-2 pr-3">Class</th>
            <th className="text-left py-2 pr-3">Phase</th>
            <th className="text-left py-2 pr-3">Risk</th>
            <th className="text-left py-2">Next due</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.client_id} className="border-t border-ink-800/40 hover:bg-ink-800/30">
              <td className="py-1.5 pr-3">
                <span className="font-mono text-ink-400 mr-1">{row.client_id}</span>
                <span className="text-ink-200">{row.codename}</span>
              </td>
              <td className="py-1.5 pr-3 font-mono">{row.ivdr_class}</td>
              <td className="py-1.5 pr-3 text-ink-300">{row.current_phase}</td>
              <td className="py-1.5 pr-3">
                <span className={clsx(
                  "badge !text-[10px]",
                  row.risk_level === "high" && "border-rose-400/40 text-rose-300 bg-rose-400/10",
                  row.risk_level === "medium" && "border-amber-400/40 text-amber-300 bg-amber-400/10",
                  row.risk_level === "low" && "border-emerald-400/40 text-emerald-300 bg-emerald-400/10",
                )}>
                  {row.risk_level}
                </span>
              </td>
              <td className="py-1.5 font-mono text-ink-200">{row.next_action_due ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ClientStatusCard({ data }: { data: any }) {
  return (
    <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.03] p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-ink-400">{data.client_id}</span>
        <span className="text-ink-50">{data.codename}</span>
        <span className="badge-slate">Class {data.ivdr_class}</span>
        {data.risk_level === "high" && <span className="badge-rose">risk high</span>}
        {data.risk_level === "medium" && <span className="badge-amber">risk medium</span>}
      </div>
      <p className="text-[13px] text-ink-300">
        <span className="text-ink-500 font-mono mr-2">phase:</span>{data.current_phase} ·
        <span className="text-ink-500 font-mono mx-2">day:</span>{data.day_in_journey}
      </p>
      {data.next_action && (
        <div className="rounded-lg bg-ink-900/40 border border-ink-700 px-3 py-2 text-[12.5px]">
          <p className="text-[10px] uppercase tracking-wider text-ink-500 font-mono">next action</p>
          <p className="text-ink-100">
            {data.next_action.due && <span className="text-accent font-mono mr-1.5">{data.next_action.due}</span>}
            {data.next_action.text}
          </p>
        </div>
      )}
    </div>
  );
}

function RegulationListCard({ data }: { data: any[] }) {
  return (
    <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.03] p-3 space-y-1.5">
      {(data || []).map((e: any) => (
        <div key={e.path} className="flex items-center gap-2 text-[12.5px]">
          <span className={clsx(
            "text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded",
            e.doc_type === "regulation" && "bg-cyan-400/15 text-cyan-300",
            e.doc_type === "guidance" && "bg-amber-400/15 text-amber-300",
            e.doc_type === "standard" && "bg-emerald-400/15 text-emerald-300",
            e.doc_type === "qa_note" && "bg-ink-700 text-ink-300",
          )}>
            {e.doc_type}
          </span>
          <span className="font-mono text-ink-400 shrink-0">{e.doc_id}</span>
          <span className="text-ink-200 truncate">{e.title}</span>
          <span className="font-mono text-ink-500 ml-auto shrink-0 text-[10px]">
            {e.format === "pdf" ? `${Math.round((e.size_bytes ?? 0) / 1024)} KB` : `${e.size_chars ?? 0} ch`}
          </span>
        </div>
      ))}
    </div>
  );
}

// ===========================================================================
// Small atoms / helpers
// ===========================================================================

function Chip({ label, n, tone }: {
  label: string;
  n: number;
  tone: "rose" | "amber" | "cyan" | "slate" | "emerald";
}) {
  return (
    <div className={clsx(
      "px-2 py-1 rounded text-center text-[11px] font-mono",
      tone === "rose"    && "bg-rose-400/10 text-rose-300",
      tone === "amber"   && "bg-amber-400/10 text-amber-300",
      tone === "cyan"    && "bg-cyan-400/10 text-cyan-300",
      tone === "emerald" && "bg-emerald-400/10 text-emerald-300",
      tone === "slate"   && "bg-ink-800/60 text-ink-300",
    )}>
      <span>{label}</span>
      <span className="ml-1 font-semibold">{n}</span>
    </div>
  );
}

function formatElapsed(ms: number): string {
  const s = ms / 1000;
  if (s < 1) return `${ms} ms`;
  if (s < 60) return `${s.toFixed(1)} s`;
  return `${Math.floor(s / 60)}m ${(s % 60).toFixed(0)}s`;
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-ink-50">{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}
