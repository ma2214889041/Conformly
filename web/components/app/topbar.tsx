"use client";

import { useState } from "react";
import { Bell, Search, User } from "lucide-react";
import clsx from "clsx";

export function Topbar({ projectName }: { projectName: string }) {
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-ink-950/80 backdrop-blur border-b border-ink-800/70">
      <div className="flex items-center gap-4 px-6 h-14">
        {/* Project breadcrumb */}
        <div className="hidden sm:flex items-center gap-2 text-sm text-ink-300 min-w-0">
          <span className="text-ink-500">project</span>
          <span className="text-white font-medium truncate">{projectName}</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents, regulations, reports…"
            className="w-full bg-ink-900/70 border border-ink-800 rounded-lg pl-9 pr-3 py-1.5 text-sm placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40"
          />
          <span className="hidden md:inline absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-ink-500 px-1.5 py-0.5 rounded border border-ink-700">
            /
          </span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative h-9 w-9 inline-flex items-center justify-center rounded-lg border border-ink-800 hover:border-ink-700 text-ink-300 hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent ring-2 ring-ink-950 animate-pulse-soft" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-ink-800 bg-ink-900/95 backdrop-blur shadow-xl p-3 text-sm">
              <p className="font-medium text-white">Notifications</p>
              <ul className="mt-2 space-y-2 max-h-80 overflow-y-auto">
                <NotifRow
                  tone="critical"
                  title="Software class not declared"
                  body="MoleQ-Analytica firmware needs IEC 62304 safety class to proceed."
                  at="5 min ago"
                />
                <NotifRow
                  tone="info"
                  title="Risk file v3.2 analysed"
                  body="2 new hazards identified · controls required."
                  at="1 h ago"
                />
                <NotifRow
                  tone="info"
                  title="Performance Evaluation Report v0.4"
                  body="Draft generated · review pending."
                  at="3 h ago"
                />
              </ul>
            </div>
          )}
        </div>

        {/* Profile (placeholder) */}
        <button
          className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-ink-800 border border-ink-700 text-ink-200 hover:text-white"
          aria-label="Account"
        >
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

function NotifRow({
  tone, title, body, at,
}: {
  tone: "critical" | "info";
  title: string;
  body: string;
  at: string;
}) {
  return (
    <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-ink-800/60">
      <span className={clsx(
        "h-2 w-2 mt-1.5 shrink-0 rounded-full",
        tone === "critical" ? "bg-danger" : "bg-accent",
      )} />
      <div className="min-w-0">
        <p className="text-white truncate">{title}</p>
        <p className="text-[12.5px] text-ink-400 leading-snug">{body}</p>
        <p className="mt-0.5 text-[10px] font-mono text-ink-500">{at}</p>
      </div>
    </li>
  );
}
