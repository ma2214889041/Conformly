"use client";

import { useEffect, useState } from "react";
import { getHealth, type HealthResponse } from "@/lib/api";
import { Activity, AlertCircle } from "lucide-react";

/**
 * Tiny live indicator in the top bar.
 *   green   → API up + vault visible
 *   amber   → API up but no vault (misconfiguration on the host)
 *   red     → API not responding (probably mock-only mode)
 */
export function ApiStatusPill() {
  const [health, setHealth] = useState<HealthResponse | null | "loading">("loading");

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      const h = await getHealth();
      if (!cancelled) setHealth(h);
    };
    tick();
    const t = setInterval(tick, 10_000);
    return () => { cancelled = true; clearInterval(t); };
  }, []);

  if (health === "loading") {
    return <Dot tone="slate" label="checking…" />;
  }
  if (health === null) {
    return <Dot tone="rose" label="API offline" icon={<AlertCircle className="h-3 w-3" />} />;
  }
  if (!health.vault_exists) {
    return <Dot tone="amber" label="vault missing" icon={<AlertCircle className="h-3 w-3" />} />;
  }
  return <Dot tone="emerald" label={`live · ${health.tools.length} tools`} icon={<Activity className="h-3 w-3" />} />;
}

function Dot({
  tone, label, icon,
}: {
  tone: "emerald" | "amber" | "rose" | "slate";
  label: string;
  icon?: React.ReactNode;
}) {
  const colour = {
    emerald: "border-emerald-400/40 text-emerald-300 bg-emerald-400/10",
    amber:   "border-amber-400/40 text-amber-300 bg-amber-400/10",
    rose:    "border-rose-400/40 text-rose-300 bg-rose-400/10",
    slate:   "border-ink-700 text-ink-400 bg-ink-800/50",
  }[tone];
  return (
    <span className={`badge ${colour} text-[10px] font-mono`}>
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          tone === "emerald" ? "bg-emerald-400 animate-pulse-soft" :
          tone === "amber" ? "bg-amber-400" :
          tone === "rose" ? "bg-rose-400" : "bg-ink-500"
        }`}
      />
      {icon}
      {label}
    </span>
  );
}
