"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, HelpCircle, Search, X } from "lucide-react";
import { PROJECT, RECENT_ACTIVITY } from "@/lib/mock-project";
import { Badge } from "./atoms";

export function Topbar({ pageTitle }: { pageTitle: string }) {
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);

  // ⌘K / Ctrl+K — focus the search box
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-ink-200 flex items-center gap-4 px-7">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-[11px] tracking-[0.22em] uppercase text-ink-400 font-medium">
          {pageTitle}
        </span>
        <span className="text-ink-300">/</span>
        <span className="text-[13px] text-ink-900 font-medium truncate">{PROJECT.name}</span>
        <Badge tone="sky" className="ml-1">
          {PROJECT.classification}
        </Badge>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-400" />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents, reports, regulations…"
            className="w-full h-9 pl-9 pr-12 rounded-md bg-surface-subtle border border-ink-200 text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-accent focus:bg-white"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-ink-400 border border-ink-200 rounded px-1.5 py-0.5">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5">
        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative h-9 w-9 grid place-items-center rounded-md hover:bg-ink-100 text-ink-600"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-[360px] rounded-lg border border-ink-200 bg-white shadow-xl">
              <div className="px-4 py-3 border-b border-ink-200 flex items-center justify-between">
                <span className="text-[12px] tracking-[0.18em] uppercase text-ink-500 font-medium">
                  Notifications
                </span>
                <button onClick={() => setNotifOpen(false)} className="text-ink-400 hover:text-ink-900">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {RECENT_ACTIVITY.slice(0, 5).map((e) => (
                  <div key={e.id} className="px-4 py-3 border-b border-ink-100 hover:bg-surface-subtle">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge-outline">{e.tag}</span>
                      <span className="text-[10px] text-ink-400 font-mono">{e.at}</span>
                    </div>
                    <div className="text-[12px] text-ink-700 leading-snug">{e.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="w-px h-6 bg-ink-200 mx-1" />
        <button className="h-9 w-9 grid place-items-center rounded-md hover:bg-ink-100 text-ink-600" aria-label="Help">
          <HelpCircle className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
