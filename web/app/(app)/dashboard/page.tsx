import Link from "next/link";
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  Check,
  CheckCircle2,
  Download,
  Plus,
} from "lucide-react";
import clsx from "clsx";
import {
  PROJECT, PHASES, HEALTH, TODAY_ACTIONS, RECENT_ACTIVITY, UPCOMING_MILESTONE,
} from "@/lib/mock-project";
import {
  Badge, Button, Card, CardBody, CardHeader, CardTitle, Citation,
  PageHeader, ProgressBar, ScoreRing, SectionLabel, SeverityChip,
} from "@/components/app/atoms";

export default function DashboardPage() {
  return (
    <div className="px-8 py-8 max-w-[1600px] mx-auto">
      <PageHeader
        eyebrow="Project overview"
        title={PROJECT.name}
        subtitle={`${PROJECT.classification} · ${PROJECT.manufacturer} · Notified Body: ${PROJECT.notified_body}`}
        right={
          <>
            <Button variant="secondary" size="md">
              <Download className="h-3.5 w-3.5" />
              Export status
            </Button>
            <Button variant="primary" size="md">
              <Plus className="h-3.5 w-3.5" />
              Upload document
            </Button>
          </>
        }
      />

      {/* Day counter + phase timeline */}
      <div className="grid grid-cols-12 gap-4 mb-4">
        <DayCounterCard />
        <div className="col-span-12 lg:col-span-9">
          <PhaseTimeline />
        </div>
      </div>

      {/* Main grid: actions (left, 2/3) + health (right, 1/3) */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <TodaysActionsCard />
          <ActivityFeedCard />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <HealthPanel />
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Sections
// ===========================================================================

function DayCounterCard() {
  return (
    <div className="col-span-12 lg:col-span-3 card p-5">
      <div className="text-[10px] tracking-[0.22em] uppercase text-ink-500 mb-1">Day in journey</div>
      <div className="flex items-baseline gap-2">
        <div className="text-[40px] font-semibold tracking-tight text-ink-900 leading-none font-display">
          {PROJECT.current_day}
        </div>
        <div className="text-[13px] text-ink-500">of estimated {PROJECT.estimated_days}</div>
      </div>
      <div className="mt-3">
        <ProgressBar value={PROJECT.current_day} max={PROJECT.estimated_days} color="sky" />
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-ink-500">
        <span>Started {new Date(PROJECT.project_start).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
        <span>Target {new Date(PROJECT.target_submission).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span>
      </div>
    </div>
  );
}

function PhaseTimeline() {
  return (
    <div className="card p-5 h-full">
      <SectionLabel>Certification journey · 6 phases</SectionLabel>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {PHASES.map((p) => {
          const done = p.status === "complete";
          const active = p.status === "active";
          return (
            <div key={p.id} className="flex flex-col">
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className={clsx(
                    "h-6 w-6 rounded-full grid place-items-center text-[11px] font-mono font-semibold border shrink-0",
                    done   && "bg-accent text-white border-accent",
                    active && "bg-sky-50 text-accent border-accent/40",
                    !done && !active && "bg-surface-subtle text-ink-400 border-ink-200",
                  )}
                >
                  {done ? <Check className="h-3 w-3" /> : p.id}
                </div>
                <div className="h-px flex-1 bg-ink-200" />
              </div>
              <div className={clsx(
                "text-[12px] font-medium leading-tight mb-1",
                done || active ? "text-ink-900" : "text-ink-400",
              )}>
                {p.name}
              </div>
              <ProgressBar value={p.pct} color={done || active ? "sky" : "ink"} />
              <div className="text-[10px] text-ink-500 mt-1.5 font-mono">{p.pct}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TodaysActionsCard() {
  const urgent     = TODAY_ACTIONS.filter((a) => a.severity === "urgent").length;
  const attention  = TODAY_ACTIONS.filter((a) => a.severity === "attention").length;
  const routine    = TODAY_ACTIONS.filter((a) => a.severity === "routine").length;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Today's actions</CardTitle>
            <div className="text-[13px] text-ink-500 mt-1.5">
              {urgent} urgent · {attention} attention · {routine} routine
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="h-8 px-3 rounded-md text-[12px] text-ink-600 hover:text-ink-900 border border-ink-200 hover:border-ink-300">
              All
            </button>
            <button className="h-8 px-3 rounded-md text-[12px] text-danger bg-danger-soft border border-danger/20">
              Urgent
            </button>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-2.5">
          {TODAY_ACTIONS.map((a) => <ActionRow key={a.id} a={a} />)}
        </div>
      </CardBody>
    </Card>
  );
}

function ActionRow({ a }: { a: typeof TODAY_ACTIONS[number] }) {
  const conf = {
    urgent:    { ring: "border-danger/25 bg-rose-50/40",    icon: AlertOctagon,  iconC: "text-danger" },
    attention: { ring: "border-warning/25 bg-amber-50/50",  icon: AlertTriangle, iconC: "text-warning" },
    routine:   { ring: "border-success/20 bg-emerald-50/40",icon: CheckCircle2,  iconC: "text-success" },
  }[a.severity];
  const Icon = conf.icon;
  return (
    <div className={clsx("rounded-lg border p-4 transition-colors hover:bg-surface-subtle", conf.ring)}>
      <div className="flex items-start gap-4">
        <div className={clsx("h-9 w-9 shrink-0 rounded-md grid place-items-center bg-white border border-ink-200", conf.iconC)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5">
            <SeverityChip kind={a.severity} />
            <Citation>{a.regulation}</Citation>
          </div>
          <div className="text-[14px] text-ink-900 font-medium leading-snug mb-1">{a.title}</div>
          <div className="text-[12.5px] text-ink-600 leading-relaxed mb-3">{a.context}</div>
          <div className="text-[11px] mb-3 flex flex-wrap gap-1.5 items-center">
            <span className="text-ink-500 mr-1">Affects:</span>
            {a.affected_docs.map((d) => (
              <span key={d} className="font-mono text-ink-700 bg-ink-50 border border-ink-200 rounded px-1.5 py-0.5">
                {d}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm">
              <ArrowRight className="h-3.5 w-3.5" />
              Take action
            </Button>
            <Button variant="secondary" size="sm">View details</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityFeedCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent activity · last 48 hours</CardTitle>
          <Button variant="ghost" size="xs">
            View all
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <div className="relative pl-6">
          <div className="absolute left-2 top-1 bottom-1 w-px bg-ink-200" />
          {RECENT_ACTIVITY.map((e) => (
            <div key={e.id} className="relative pb-5 last:pb-0">
              <div className="absolute -left-[18px] top-1.5 h-2 w-2 rounded-full bg-accent ring-4 ring-white" />
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-outline">{e.tag}</span>
                <span className="text-[11px] text-ink-500 font-mono">{e.at}</span>
              </div>
              <div className="text-[13px] text-ink-800 leading-relaxed pr-4">{e.text}</div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function HealthPanel() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Project health</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="flex items-center gap-5 mb-5">
            <ScoreRing value={HEALTH.nb_readiness_score} size={110} stroke={9} sublabel="NB readiness" />
            <div className="flex-1 leading-tight">
              <div className="text-[11px] tracking-[0.18em] uppercase text-ink-500 mb-1">Predicted</div>
              <div className="text-[14px] text-ink-900 font-medium leading-snug">
                Likely to receive deficiencies on submission as-is.
              </div>
              <div className="text-[12px] text-ink-500 mt-2">Based on 3 critical and 5 major gaps.</div>
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-ink-200">
            <HealthBar
              label="Document readiness"
              value={HEALTH.document_readiness}
              color="sky"
              hint={`${HEALTH.documents_total} of ${HEALTH.documents_required} required documents`}
            />
            <HealthBar
              label="Evidence completeness"
              value={HEALTH.evidence_completeness}
              color="amber"
              hint={`${HEALTH.gspr_covered} of ${HEALTH.gspr_total} GSPR clauses covered`}
            />
            <div className="flex items-center justify-between pt-3 border-t border-ink-200">
              <div className="text-[11px] text-ink-500 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft" />
                Continuous analysis active
              </div>
              <div className="text-[11px] text-ink-500 font-mono">{HEALTH.last_analysis}</div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Upcoming milestone</CardTitle>
            <CalendarClock className="h-3.5 w-3.5 text-ink-400" />
          </div>
        </CardHeader>
        <CardBody>
          <div className="text-[13px] text-ink-900 font-medium mb-1">{UPCOMING_MILESTONE.title}</div>
          <div className="text-[12px] text-ink-500 mb-3">{UPCOMING_MILESTONE.body}</div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-ink-500">Target</div>
              <div className="text-[14px] font-mono text-ink-900 mt-0.5">{UPCOMING_MILESTONE.date}</div>
            </div>
            <Badge tone="amber">{UPCOMING_MILESTONE.days_remaining} days</Badge>
          </div>
        </CardBody>
      </Card>

      <Link
        href="/nb-simulation"
        className="card card-hover p-4 flex items-center justify-between text-[13px] text-ink-700"
      >
        <span>Run a Notified Body simulation</span>
        <ArrowRight className="h-3.5 w-3.5 text-accent" />
      </Link>
    </div>
  );
}

function HealthBar({
  label, value, color, hint,
}: {
  label: string;
  value: number;
  color: "sky" | "amber" | "green";
  hint: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <div className="text-[12px] text-ink-700">{label}</div>
        <div className="text-[13px] font-mono text-ink-900 font-semibold">{value}%</div>
      </div>
      <ProgressBar value={value} color={color} />
      <div className="text-[11px] text-ink-500 mt-1.5 font-mono">{hint}</div>
    </div>
  );
}
