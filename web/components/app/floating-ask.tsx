"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, X, ArrowRight } from "lucide-react";
import clsx from "clsx";

/**
 * Floating "Ask Conformly" button — visible on every product page.
 * Opens a compact prompt panel; "Send" navigates to /chat with the
 * draft prefilled in the URL.
 */
export function FloatingAsk() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  // ESC closes the panel
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          "fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full px-4 py-3",
          "bg-accent text-ink-950 font-medium shadow-lg shadow-accent/30 hover:bg-accent-soft transition-all",
        )}
        aria-expanded={open}
        aria-controls="ask-panel"
      >
        {open ? <X className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
        <span className="hidden sm:inline">{open ? "Close" : "Ask Conformly"}</span>
      </button>

      {open && (
        <div
          id="ask-panel"
          role="dialog"
          aria-label="Ask Conformly"
          className="fixed bottom-20 right-5 z-40 w-[min(420px,calc(100vw-2.5rem))] rounded-2xl border border-ink-800 bg-ink-900/95 backdrop-blur shadow-2xl"
        >
          <div className="px-4 py-3 border-b border-ink-800/70 flex items-center justify-between">
            <p className="text-sm font-medium text-white">Ask anything regulatory</p>
            <button onClick={() => setOpen(false)} className="text-ink-500 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
              placeholder="e.g. What evidence do I need for GSPR 9.1?"
              rows={3}
              className="w-full bg-ink-950 border border-ink-800 rounded-lg p-3 text-sm placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 resize-none"
            />
            <div className="flex flex-wrap gap-2">
              {[
                "Is my device Class B or Class C?",
                "Show me my biggest compliance risks",
                "What documents am I missing?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setDraft(q)}
                  className="text-[11px] font-mono text-ink-300 hover:text-white px-2 py-1 rounded border border-ink-800 hover:border-ink-700"
                >
                  {q}
                </button>
              ))}
            </div>
            <Link
              href={draft.trim() ? `/chat?q=${encodeURIComponent(draft)}` : "/chat"}
              className="inline-flex items-center gap-1.5 w-full justify-center bg-accent text-ink-950 font-medium rounded-lg px-4 py-2 text-sm hover:bg-accent-soft"
            >
              Open full chat
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
