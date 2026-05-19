import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import clsx from "clsx";
import { listClientIds, loadClient, type ClientSummary } from "@/lib/vault";

export function generateStaticParams() {
  return listClientIds().map((id) => ({ id }));
}

export default function ClientPage({ params }: { params: { id: string } }) {
  const c = loadClient(params.id);
  if (!c) notFound();

  return (
    <div className="container-wide py-10">
      <Link href="/dashboard" className="text-sm text-ink-400 hover:text-ink-100 inline-flex items-center gap-1 mb-6">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to portfolio
      </Link>

      <header className="mb-8">
        <p className="font-mono text-xs text-ink-500">{c.client_id}</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-50 mt-1">
          {c.codename ?? c.client_id}
        </h1>
        <p className="mt-2 text-ink-400">
          {c.product_type ?? "—"}
          {c.indication ? <span> · {c.indication}</span> : null}
        </p>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink-800/40 rounded-2xl overflow-hidden border border-ink-800/60 mb-10">
        <Tile label="IVDR class" value={c.ivdr_class ?? "—"} />
        <Tile label="Current phase" value={c.current_phase ?? "—"} />
        <Tile label="Notified Body" value={c.nb ?? "—"} />
        <Tile
          label="Day in journey"
          value={c.day_in_journey != null ? `${c.day_in_journey} d` : "—"}
          sub={c.days_since_contact != null ? `last contact ${c.days_since_contact} d ago` : ""}
        />
      </section>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Left column — risks, next actions */}
        <div className="space-y-6">
          <Panel title="Open risks" empty="No risks recorded.">
            {c.risks.length > 0 && (
              <ul className="space-y-3">
                {c.risks.map((r) => (
                  <li key={r.id + r.issue} className="border-l-2 border-ink-700 pl-3">
                    <p>
                      <span className="font-mono text-ink-400 mr-2">{r.id}</span>
                      <SeverityBadge sev={r.severity} />
                      <span className="ml-2 text-ink-100">{r.issue}</span>
                    </p>
                    {r.mitigation && (
                      <p className="text-[12.5px] text-ink-400 mt-1">
                        <span className="text-ink-500 font-mono mr-1">action:</span>
                        {r.mitigation}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Next actions" empty="Nothing queued.">
            {c.next_actions.length > 0 && (
              <ul className="space-y-2">
                {c.next_actions.map((a, i) => (
                  <li key={i} className="flex items-baseline gap-3">
                    <input
                      type="checkbox"
                      checked={a.done}
                      readOnly
                      className="mt-1 h-3.5 w-3.5 rounded border-ink-600 bg-ink-900 accent-accent"
                    />
                    <div>
                      {a.due && <span className="font-mono text-xs text-accent mr-2">{a.due}</span>}
                      <span className={a.done ? "text-ink-500 line-through" : "text-ink-100"}>
                        {a.text}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Vault source" empty="No body content.">
            <p className="text-[13px] text-ink-400 mb-2 font-mono">{c.file_path}</p>
            <details className="text-[13px]">
              <summary className="cursor-pointer text-ink-300 hover:text-ink-100">
                show the raw markdown
              </summary>
              <pre className="code-block mt-3 max-h-96 overflow-auto">{c.body}</pre>
            </details>
          </Panel>
        </div>

        {/* Right column — meta */}
        <aside className="space-y-4">
          <Panel title="Engagement">
            <Field label="Status" value={c.status ?? "—"} />
            <Field label="Country" value={c.country ?? "—"} />
            <Field label="Languages" value={c.risk_flags && c.risk_flags.length ? c.risk_flags.join(", ") : "—"} hidden />
            <Field label="Opened" value={c.opened ?? "—"} />
            <Field label="Last contact" value={c.last_contact ?? "—"} />
          </Panel>

          <Panel title="GREEN LIGHTs">
            {c.green_lights_passed.length === 0 ? (
              <p className="text-ink-400 text-sm">None passed yet.</p>
            ) : (
              <ul className="space-y-1.5 text-sm text-ink-100">
                {c.green_lights_passed.map((g) => (
                  <li key={g} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    {g}
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <a
            href="/demo"
            className="card card-hover p-4 flex items-center justify-between text-sm text-ink-200 hover:text-ink-50"
          >
            <span>Run a GSPR analysis on this file</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </aside>
      </div>
    </div>
  );
}

function Tile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-ink-900/70 p-5">
      <p className="text-xs uppercase tracking-wider text-ink-400 font-mono">{label}</p>
      <p className="mt-1 text-xl font-semibold text-ink-50">{value}</p>
      {sub && <p className="text-[11px] text-ink-500 mt-0.5">{sub}</p>}
    </div>
  );
}

function Panel({
  title, children, empty,
}: {
  title: string;
  children?: React.ReactNode;
  empty?: string;
}) {
  return (
    <section className="card p-5">
      <h2 className="text-xs font-mono uppercase tracking-wider text-ink-400 mb-3">{title}</h2>
      {children ?? <p className="text-ink-500 text-sm italic">{empty ?? "—"}</p>}
    </section>
  );
}

function Field({ label, value, hidden }: { label: string; value: string; hidden?: boolean }) {
  if (hidden) return null;
  return (
    <div className="flex justify-between gap-3 text-sm py-1 border-b border-ink-800/40 last:border-0">
      <span className="text-ink-500">{label}</span>
      <span className="text-ink-100 text-right">{value}</span>
    </div>
  );
}

function SeverityBadge({ sev }: { sev: string }) {
  const s = sev.toLowerCase();
  const tone =
    s === "高" || s === "high" || s === "major" || s === "critical"
      ? "bg-rose-400/15 text-rose-300"
      : s === "中" || s === "medium" || s === "moderate"
        ? "bg-amber-400/15 text-amber-300"
        : "bg-emerald-400/15 text-emerald-300";
  return (
    <span className={clsx("text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded", tone)}>
      {sev}
    </span>
  );
}
