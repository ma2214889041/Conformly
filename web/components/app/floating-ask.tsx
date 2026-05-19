"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Sparkles, X } from "lucide-react";
import clsx from "clsx";
import { CHAT_SUGGESTED } from "@/lib/mock-project";
import { Citation } from "./atoms";

type Msg = {
  from: "ai" | "user";
  text: string;
  cites?: { label: string }[];
  confidence?: number;
};

const SEED: Msg[] = [
  {
    from: "ai",
    text:
      "Hi Elena. I'm watching your IVDR project continuously. Ask me anything — I'll always cite the regulation and your own documents.",
  },
];

export function FloatingAsk() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(SEED);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open]);

  // ESC closes the panel
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function send(text?: string) {
    const t = (text ?? input).trim();
    if (!t) return;
    setMessages((m) => [...m, { from: "user", text: t }]);
    setInput("");
    // Realistic stub reply — the production /chat page will call Hermes.
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: "ai",
          text:
            "Based on your uploaded documents and IVDR Annex I §12.1, your stability evidence currently covers 9 of 24 claimed months. Notified Bodies expect either real-time data covering the full lifetime or, where impractical, a justified accelerated stability study (CLSI EP25-A). I recommend opening a gap entry for the missing 15 months.",
          cites: [
            { label: "IVDR Annex I §12.1" },
            { label: "CLSI EP25-A" },
            { label: "STAB-003" },
          ],
          confidence: 0.92,
        },
      ]);
    }, 700);
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          "fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 h-12 pl-3.5 pr-5 rounded-full",
          "bg-accent text-white shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:bg-accent-deep transition-all",
        )}
        aria-expanded={open}
      >
        <span className="h-7 w-7 rounded-full bg-white/20 grid place-items-center">
          {open ? <X className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
        </span>
        <span className="text-[13px] font-medium tracking-tight">
          {open ? "Close" : "Ask Conformly"}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Ask Conformly"
          className="fixed bottom-24 right-6 z-40 w-[440px] max-w-[calc(100vw-3rem)] max-h-[640px] h-[640px] rounded-xl border border-ink-200 bg-white shadow-2xl flex flex-col"
        >
          <div className="h-14 px-4 flex items-center gap-3 border-b border-ink-200">
            <div className="h-8 w-8 rounded-md bg-sky-50 border border-sky-200 grid place-items-center">
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            <div className="flex-1 leading-tight">
              <div className="text-[13px] text-ink-900 font-medium">Ask Conformly</div>
              <div className="text-[11px] text-ink-500">Always cites regulations and your documents</div>
            </div>
            <button onClick={() => setOpen(false)} className="h-8 w-8 grid place-items-center rounded-md hover:bg-ink-100 text-ink-500">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((m, i) =>
              m.from === "ai" ? (
                <div key={i} className="text-[13px]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="h-5 w-5 rounded bg-sky-50 border border-sky-200 grid place-items-center">
                      <Sparkles className="h-3 w-3 text-accent" />
                    </div>
                    <span className="text-[11px] tracking-[0.16em] uppercase text-ink-500">
                      Conformly
                    </span>
                    {m.confidence && (
                      <span className="text-[10px] text-ink-500 font-mono">
                        {Math.round(m.confidence * 100)}% confidence
                      </span>
                    )}
                  </div>
                  <div className="text-ink-800 leading-relaxed">{m.text}</div>
                  {m.cites && m.cites.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.cites.map((c, k) => <Citation key={k}>{c.label}</Citation>)}
                    </div>
                  )}
                </div>
              ) : (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] text-[13px] text-ink-900 bg-sky-50 border border-sky-200 rounded-lg px-3.5 py-2.5 leading-relaxed">
                    {m.text}
                  </div>
                </div>
              ),
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-ink-200 p-3">
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {CHAT_SUGGESTED.slice(0, 3).map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-[11px] text-ink-600 hover:text-ink-900 border border-ink-200 hover:border-ink-300 rounded-full px-2.5 py-1 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
                placeholder="Ask anything regulatory…"
                className="flex-1 h-10 px-3 rounded-md bg-surface-subtle border border-ink-200 text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-accent focus:bg-white"
              />
              <button
                onClick={() => send()}
                className="btn-md btn-primary"
                aria-label="Send"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
