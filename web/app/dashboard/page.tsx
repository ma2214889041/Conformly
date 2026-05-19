import Link from "next/link";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";
import { listClients, type ClientSummary } from "@/lib/vault";

export default function DashboardPage() {
  const clients = listClients();
  const sorted = [...clients].sort((a, b) => riskRank(a) - riskRank(b));
  const counts = bucketise(clients);

  return (
    <div className="container-wide py-12">
      <header className="mb-8">
        <p className="text-accent text-sm font-mono uppercase tracking-wider mb-2">
          portfolio · all active clients
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-50">
          Where everyone is today.
        </h1>
        <p className="mt-3 text-ink-400 max-w-2xl">
          One card per engagement. Sorted by risk so what's burning surfaces first.
          Click into any card for the full file.
        </p>
      </header>

      {/* Vital signs strip */}
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-ink-800/40 rounded-2xl overflow-hidden border border-ink-800/60 mb-10">
        <Stat label="Total active" value={String(clients.length)} />
        <Stat label="High risk" value={String(counts.high)} tone="rose" />
        <Stat label="Medium risk" value={String(counts.medium)} tone="amber" />
        <Stat label="Low / none" value={String(counts.low + counts.none)} tone="emerald" />
      </dl>

      {sorted.length === 0 ? (
        <EmptyVault />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((c) => <ClientCard key={c.client_id} c={c} />)}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "rose" | "amber" | "emerald" }) {
  return (
    <div className="bg-ink-900/70 p-5">
      <dt className="text-xs uppercase tracking-wider text-ink-400 font-mono">{label}</dt>
      <dd className={clsx(
        "mt-1 text-2xl font-semibold",
        tone === "rose" && "text-rose-300",
        tone === "amber" && "text-amber-300",
        tone === "emerald" && "text-emerald-300",
        !tone && "text-ink-50",
      )}>
        {value}
      </dd>
    </div>
  );
}

function ClientCard({ c }: { c: ClientSummary }) {
  return (
    <Link
      href={`/clients/${c.client_id.toLowerCase()}`}
      className="card card-hover p-5 group flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] text-ink-500">{c.client_id}</p>
          <h3 className="font-semibold text-ink-50 truncate">{c.codename ?? c.client_id}</h3>
        </div>
        <RiskBadge level={c.risk_level} />
      </div>

      <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
        <Metric label="Class" value={c.ivdr_class ?? "–"} />
        <Metric label="Day" value={c.day_in_journey != null ? String(c.day_in_journey) : "–"} />
        <Metric label="Risks" value={String(c.risks.length)} />
      </div>

      <p className="text-sm text-ink-300 truncate">{c.current_phase ?? "—"}</p>

      {c.next_action ? (
        <div className="rounded-lg border border-ink-700/60 bg-ink-950/50 px-3 py-2 text-[12.5px]">
          <p className="text-[10px] uppercase tracking-wider text-ink-500 font-mono mb-0.5">
            next action
          </p>
          <p className="text-ink-100">
            {c.next_action.due && (
              <span className="text-accent font-mono mr-1.5">{c.next_action.due}</span>
            )}
            {c.next_action.text}
          </p>
        </div>
      ) : (
        <p className="text-[12px] text-ink-500 italic">no open actions</p>
      )}

      <div className="mt-auto flex items-center justify-between pt-2 text-[12px] text-ink-400">
        <span>{c.nb ?? "—"}</span>
        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-ink-950/50 border border-ink-800/60 px-2 py-1.5">
      <p className="text-[9px] uppercase tracking-wider text-ink-500">{label}</p>
      <p className="text-ink-100 font-semibold">{value}</p>
    </div>
  );
}

function RiskBadge({ level }: { level: ClientSummary["risk_level"] }) {
  const map = {
    high:   { cls: "badge-rose",    label: "high" },
    medium: { cls: "badge-amber",   label: "medium" },
    low:    { cls: "badge-emerald", label: "low" },
    none:   { cls: "badge-slate",   label: "none" },
  } as const;
  const { cls, label } = map[level];
  return <span className={cls}>{label}</span>;
}

function EmptyVault() {
  return (
    <div className="card p-12 text-center">
      <p className="text-ink-300">
        Vault has no client files yet. Add a markdown file under{" "}
        <code className="font-mono text-ink-100">vault/clients/&lt;id&gt;.md</code> to see it here.
      </p>
    </div>
  );
}

function riskRank(c: ClientSummary): number {
  return { high: 0, medium: 1, low: 2, none: 3 }[c.risk_level];
}

function bucketise(cs: ClientSummary[]) {
  const out = { high: 0, medium: 0, low: 0, none: 0 };
  for (const c of cs) out[c.risk_level]++;
  return out;
}
