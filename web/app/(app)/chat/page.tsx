"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Plus, Sparkles } from "lucide-react";
import clsx from "clsx";
import { CHAT_HISTORY, CHAT_SUGGESTED } from "@/lib/mock-project";
import { Card, CardBody, Citation, PageHeader } from "@/components/app/atoms";

type Msg = {
  from: "ai" | "user";
  text: string;
  cites?: string[];
  confidence?: number;
};

const SEED: Msg[] = [
  {
    from: "ai",
    text:
      "Hi Elena. I'm watching your IVDR project continuously. Ask me anything regulatory — every answer will cite the regulation clause and the document in your vault that supports it.",
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>(SEED);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  function send(t?: string) {
    const text = (t ?? input).trim();
    if (!text) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: "ai",
          text:
            "Based on your dossier (DEV-SPEC-002 and PEP-001) and IVDR Annex VIII Rule 3, your sample-handling module qualifies as **Class C IVD** because it produces information used for the management of life-threatening conditions when integrated with a downstream molecular assay. The class is also consistent with MDCG 2023-1 §4.2.\n\nA Class B determination would only apply if the device's intended purpose excluded life-threatening downstream assays — which is not the case in your current intended-purpose statement.",
          cites: ["IVDR Annex VIII Rule 3", "MDCG 2023-1 §4.2", "DEV-SPEC-002", "PEP-001"],
          confidence: 0.91,
        },
      ]);
    }, 800);
  }

  return (
    <div className="px-8 py-8 max-w-[1600px] mx-auto">
      <PageHeader
        eyebrow="Ask Conformly"
        title="Regulatory chat — every answer cites its source"
        subtitle="A persistent conversation. Ask anything about IVDR, ISO, IEC or CLSI requirements. Conformly cross-references your uploaded documents, then answers in plain language with the regulation clauses and document IDs that support the answer."
      />

      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-15rem)] min-h-[560px]">
        {/* Conversation history (left) */}
        <aside className="col-span-12 md:col-span-3 hidden md:block">
          <Card className="h-full flex flex-col">
            <div className="px-5 pt-5 pb-3 border-b border-ink-200 flex items-center justify-between">
              <p className="text-[11px] tracking-[0.18em] uppercase text-ink-500 font-medium">
                Conversations
              </p>
              <button className="btn-xs btn-secondary">
                <Plus className="h-3 w-3" />
                New
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {CHAT_HISTORY.map((c, i) => (
                <button
                  key={c.id}
                  className={clsx(
                    "w-full text-left rounded-md px-3 py-2 transition-colors",
                    i === 0
                      ? "bg-accent/10 border border-accent/30"
                      : "border border-transparent hover:bg-surface-subtle",
                  )}
                >
                  <p className={clsx("text-[12.5px] leading-tight truncate", i === 0 ? "text-ink-900 font-medium" : "text-ink-700")}>
                    {c.preview}
                  </p>
                  <p className="text-[10px] font-mono text-ink-500 mt-0.5">{c.date}</p>
                </button>
              ))}
            </div>
          </Card>
        </aside>

        {/* Active chat (center) */}
        <main className="col-span-12 md:col-span-9">
          <Card className="h-full flex flex-col">
            <CardBody className="!pb-0 flex-1 overflow-y-auto space-y-5">
              {messages.map((m, i) =>
                m.from === "ai" ? (
                  <AiMessage key={i} m={m} />
                ) : (
                  <UserMessage key={i} m={m} />
                ),
              )}
              <div ref={endRef} />
            </CardBody>

            {/* Composer */}
            <div className="border-t border-ink-200 p-4">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {CHAT_SUGGESTED.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-[12px] text-ink-600 hover:text-ink-900 border border-ink-200 hover:border-ink-300 rounded-full px-3 py-1 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex items-end gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") send(); }}
                  placeholder="Ask anything regulatory…"
                  className="flex-1 h-11 px-4 rounded-md bg-surface-subtle border border-ink-200 text-[14px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-accent focus:bg-white"
                />
                <button
                  onClick={() => send()}
                  className="btn-lg btn-primary"
                  aria-label="Send"
                >
                  <ArrowUp className="h-4 w-4" />
                  Send
                </button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}

function AiMessage({ m }: { m: Msg }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="h-6 w-6 rounded-md bg-sky-50 border border-sky-200 grid place-items-center">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
        </span>
        <span className="text-[11px] tracking-[0.16em] uppercase text-ink-500">Conformly</span>
        {m.confidence && (
          <span className="text-[10px] text-ink-500 font-mono">
            {Math.round(m.confidence * 100)}% confidence
          </span>
        )}
      </div>
      <div className="text-[14px] text-ink-800 leading-relaxed whitespace-pre-line max-w-3xl">
        {renderInline(m.text)}
      </div>
      {m.cites && m.cites.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {m.cites.map((c) => <Citation key={c}>{c}</Citation>)}
        </div>
      )}
    </div>
  );
}

function UserMessage({ m }: { m: Msg }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-lg bg-sky-50 border border-sky-200 px-4 py-2.5 text-[14px] text-ink-900 leading-relaxed">
        {m.text}
      </div>
    </div>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-ink-900">{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}
