import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  FolderUp,
  Microscope,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { PROJECT, overallProgress, relativeTime, type ActionItem, type AgentEvent } from "@/lib/mock-project";

export default function DashboardPage() {
  const p = PROJECT;
  const pct = overallProgress(p);
  const phaseIndex = p.phases.findIndex((ph) => ph.id === p.current_phase_id);
  const currentPhase = p.phases[phaseIndex];

  return (
    <div className="px-6 lg:px-10 py-8 space-y-8">
      {/* =============================================================== */}
      {/* HEADER — project identity + progress                              */}
      {/* =============================================================== */}
      <section>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-accent mb-1">
              your active project
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              {p.name}
            </h1>
            <p className="mt-1 text-ink-300">
              <span className="inline-flex items-center gap-1.5 mr-3">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Class {p.device_class} IVD
              </span>
              <span className="text-ink-400">
                Day {p.day_in_journey} of est. {p.estimated_total_days} ·{" "}
                target {new Date(p.estimated_completion).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-mono uppercase tracking-wider text-ink-500">overall</p>
            <p className="text-3xl font-semibold text-white">{pct}%</p>
            <p className="text-[11px] text-ink-500 font-mono">complete</p>
          </div>
        </div>

        {/* Phase progress strip */}
        <div className="mt-6">
          <div className="flex gap-1 h-2.5 rounded-full overflow-hidden bg-ink-800">
            {p.phases.map((ph, i) => {
              const width = ph.weight * 100;
              const fill = ph.progress * 100;
              return (
                <div
                  key={ph.id}
                  className="relative flex-none h-full"
                  style={{ width: `${width}%` }}
                  title={`${ph.label} — ${Math.round(ph.progress * 100)}%`}
                >
                  <div className="absolute inset-0 bg-ink-700" />
                  <div
                    className={clsx(
                      "absolute inset-y-0 left-0",
                      i < phaseIndex ? "bg-success" :
                      i === phaseIndex ? "bg-accent" :
                      "bg-accent/30",
                    )}
                    style={{ width: `${fill}%` }}
                  />
                </div>
              );
            })}
          </div>
          {/* Phase labels */}
          <ol className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px] font-mono">
            {p.phases.map((ph, i) => (
              <li
                key={ph.id}
                className={clsx(
                  "flex items-center gap-1.5",
                  i === phaseIndex ? "text-accent" :
                  i < phaseIndex ? "text-ink-300" :
                  "text-ink-500",
                )}
              >
                <span
                  className={clsx(
                    "inline-block h-1.5 w-1.5 rounded-full",
                    i === phaseIndex ? "bg-accent" :
                    i < phaseIndex ? "bg-success" :
                    "bg-ink-600",
                  )}
                />
                <span className="truncate">{ph.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* =============================================================== */}
      {/* MAIN GRID — today's actions (left) + health (right)               */}
      {/* =============================================================== */}
      <section className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* ============ today's actions ============ */}
        <div>
          <header className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-mono uppercase tracking-wider text-ink-300">
              Today's actions
            </h2>
            <span className="badge-slate text-[10px]">
              {p.today_actions.length} items
            </span>
          </header>

          <ul className="space-y-2.5">
            {p.today_actions.map((a) => <ActionRow key={a.id} action={a} />)}
          </ul>
        </div>

        {/* ============ project health rail ============ */}
        <aside className="space-y-4">
          <HealthCard
            title="Document readiness"
            value={p.health.document_readiness}
            hint="Required documents present, by IVDR Annex II structure"
          />
          <HealthCard
            title="Evidence completeness"
            value={p.health.evidence_completeness}
            hint="GSPR clauses backed by sufficient evidence"
          />
          <HealthCard
            title="Notified Body readiness"
            value={p.health.nb_readiness_score}
            hint="Predicted likelihood of passing the NB review today"
            highlight
          />

          <div className="card p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-ink-500 mb-2">
              Open findings
            </p>
            <ul className="space-y-1.5 text-[13px]">
              <FindingLine n={p.health.open_findings.critical} tone="critical" label="Critical — will block certification" />
              <FindingLine n={p.health.open_findings.major}    tone="major"    label="Major — likely deficiency" />
              <FindingLine n={p.health.open_findings.minor}    tone="minor"    label="Minor — recommended fix" />
            </ul>
            <Link
              href="/analysis"
              className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:text-accent-soft"
            >
              Open analysis
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <p className="text-[11px] font-mono text-ink-500 px-1">
            last analysis · {relativeTime(p.health.last_analysis_at)}
          </p>
        </aside>
      </section>

      {/* =============================================================== */}
      {/* ACTIVITY FEED — what Conformly did recently                       */}
      {/* =============================================================== */}
      <section>
        <header className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-mono uppercase tracking-wider text-ink-300">
            Recent activity (last 48 h)
          </h2>
          <Link href="/analysis" className="text-[11px] font-mono text-ink-400 hover:text-white">
            full log →
          </Link>
        </header>

        <ol className="card divide-y divide-ink-800/70 overflow-hidden">
          {p.recent_activity.map((e) => (
            <ActivityRow key={e.id} ev={e} />
          ))}
        </ol>
      </section>

      {/* =============================================================== */}
      {/* QUICK ACTIONS                                                     */}
      {/* =============================================================== */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <QuickAction href="/documents" icon={<FolderUp className="h-4 w-4" />}    label="Upload a document"     hint="PDF, Word, Excel, CAD" />
        <QuickAction href="/analysis"  icon={<Microscope className="h-4 w-4" />}  label="See design suggestions" hint="Continuous review" />
        <QuickAction href="/reports"   icon={<FileText className="h-4 w-4" />}    label="Generate a report"      hint="Tech file, PER, SSP…" />
        <QuickAction href="/nb-simulation" icon={<Sparkles className="h-4 w-4" />} label="Simulate NB review"     hint="Predict the verdict" />
      </section>
    </div>
  );
}

// ===========================================================================
// Atoms
// ===========================================================================

function ActionRow({ action }: { action: ActionItem }) {
  const sev = action.severity;
  const icon = sev === "urgent"   ? <AlertOctagon  className="h-4 w-4 text-danger" />
            : sev === "attention" ? <AlertTriangle className="h-4 w-4 text-warning" />
            : <CheckCircle2 className="h-4 w-4 text-success" />;
  const ring = sev === "urgent"   ? "border-danger/30"
             : sev === "attention" ? "border-warning/30"
             : "border-success/30";
  return (
    <li className={clsx("card border-l-4 p-4", ring)}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white">{action.title}</p>
          <p className="mt-1 text-[13px] text-ink-300 leading-relaxed">{action.context}</p>
          <p className="mt-1 text-[11px] font-mono text-ink-500">
            cited: <span className="text-ink-300">{action.regulation}</span>
          </p>
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          <Link href="/analysis" className="btn-ghost text-xs whitespace-nowrap">
            View details
          </Link>
          <Link href="/analysis" className="btn-primary text-xs whitespace-nowrap">
            {action.actionLabel}
          </Link>
        </div>
      </div>
    </li>
  );
}

function HealthCard({
  title, value, hint, highlight,
}: {
  title: string;
  value: number;
  hint: string;
  highlight?: boolean;
}) {
  const tone =
    value >= 80 ? "text-success" :
    value >= 60 ? "text-accent" :
    value >= 40 ? "text-warning" :
    "text-danger";
  return (
    <div className={clsx("card p-4", highlight && "border-accent/30 bg-accent/[0.03]")}>
      <p className="text-[10px] font-mono uppercase tracking-wider text-ink-500">{title}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className={clsx("text-3xl font-semibold", tone)}>{value}</p>
        <span className="text-xs font-mono text-ink-500">/ 100</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-ink-800 overflow-hidden">
        <div
          className={clsx(
            "h-full",
            value >= 80 ? "bg-success" :
            value >= 60 ? "bg-accent" :
            value >= 40 ? "bg-warning" :
            "bg-danger",
          )}
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="mt-2 text-[11.5px] text-ink-400 leading-snug">{hint}</p>
    </div>
  );
}

function FindingLine({
  n, tone, label,
}: {
  n: number;
  tone: "critical" | "major" | "minor";
  label: string;
}) {
  const colour =
    tone === "critical" ? "text-danger" :
    tone === "major" ? "text-warning" :
    "text-ink-200";
  return (
    <li className="flex items-center justify-between gap-2">
      <span className="text-ink-300">{label}</span>
      <span className={clsx("font-mono font-semibold", colour)}>{n}</span>
    </li>
  );
}

function ActivityRow({ ev }: { ev: AgentEvent }) {
  const icon =
    ev.type === "analysis"   ? <Microscope className="h-3.5 w-3.5 text-accent" /> :
    ev.type === "suggestion" ? <Sparkles className="h-3.5 w-3.5 text-accent" /> :
    ev.type === "upload"     ? <FolderUp className="h-3.5 w-3.5 text-ink-300" /> :
    ev.type === "report"     ? <FileText className="h-3.5 w-3.5 text-ink-300" /> :
    <TrendingUp className="h-3.5 w-3.5 text-accent" />;
  return (
    <li className="flex items-start gap-3 p-4">
      <span className="shrink-0 mt-0.5 h-6 w-6 inline-flex items-center justify-center rounded-md bg-ink-800/60 border border-ink-700">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <p className="text-sm font-medium text-white">{ev.title}</p>
          <span className="text-[11px] font-mono text-ink-500">
            <Clock className="h-2.5 w-2.5 inline mr-0.5" />
            {relativeTime(ev.at)}
          </span>
        </div>
        <p className="mt-0.5 text-[13px] text-ink-400 leading-snug">{ev.body}</p>
        {ev.source && (
          <p className="mt-1 text-[11px] font-mono text-ink-500">
            source: <span className="text-ink-300">{ev.source}</span>
          </p>
        )}
      </div>
    </li>
  );
}

function QuickAction({
  href, icon, label, hint,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  hint: string;
}) {
  return (
    <Link href={href} className="card card-hover p-4 flex items-center gap-3 group">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 border border-accent/30 text-accent shrink-0">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white truncate">{label}</p>
        <p className="text-[11.5px] text-ink-400 truncate">{hint}</p>
      </div>
      <ArrowRight className="h-3.5 w-3.5 text-ink-500 group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0" />
    </Link>
  );
}
