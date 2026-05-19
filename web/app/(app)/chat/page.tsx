"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2, Plus, RadioTower, Sparkles, Zap } from "lucide-react";
import clsx from "clsx";
import { CHAT_HISTORY, CHAT_SUGGESTED, CHAT_THREADS, type ChatMsg } from "@/lib/mock-project";
import { Badge, Card, CardBody, Citation, PageHeader } from "@/components/app/atoms";
import { toast } from "@/components/app/toast";

const NEW_THREAD_SEED: ChatMsg[] = [
  {
    from: "ai",
    text:
      "Hi Elena. I'm watching your IVDR project continuously. Ask me anything regulatory — every answer will cite the regulation clause and the document in your vault that supports it.",
  },
];

export default function ChatPage() {
  const [threadId, setThreadId] = useState<string>(CHAT_HISTORY[0].id);
  const [drafts, setDrafts] = useState<Record<string, ChatMsg[]>>({});
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [liveMode, setLiveMode] = useState(true);
  const endRef = useRef<HTMLDivElement | null>(null);

  const baseMessages = CHAT_THREADS[threadId] ?? NEW_THREAD_SEED;
  const liveExtras = drafts[threadId] ?? [];
  const messages = [...baseMessages, ...liveExtras];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, threadId, sending]);

  async function send(text?: string) {
    const t = (text ?? input).trim();
    if (!t || sending) return;
    setDrafts((d) => ({ ...d, [threadId]: [...(d[threadId] ?? []), { from: "user", text: t }] }));
    setInput("");
    setSending(true);

    if (!liveMode) {
      // Scripted reply (offline mode)
      setTimeout(() => {
        setDrafts((d) => ({
          ...d,
          [threadId]: [
            ...(d[threadId] ?? []),
            {
              from: "ai",
              text:
                "I've pulled the relevant evidence from your vault and cross-checked it against the regulation. The most relevant clause to your question is below — I've cited both the regulatory source and the document in your project that supports it.",
              cites: ["IVDR Annex I §1", "IVDR Annex VIII Rule 3", "DEV-SPEC-001"],
              confidence: 0.87,
            },
          ],
        }));
        setSending(false);
      }, 700);
      return;
    }

    try {
      // Live Gemini call via /api/chat
      const history = [...baseMessages, ...liveExtras].map((m) => ({
        role: m.from === "ai" ? "assistant" : "user",
        content: m.text,
      }));
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: t, history }),
      });
      const j = await r.json();
      if (!j.success) throw new Error(j.error || "Unknown error");
      setDrafts((d) => ({
        ...d,
        [threadId]: [
          ...(d[threadId] ?? []),
          {
            from: "ai",
            text: j.data.text,
            cites: j.data.cites,
            confidence: j.data.confidence,
          },
        ],
      }));
      toast({
        title: `Reply from ${j.data.model || "Gemini 3 Pro"}`,
        body: `${j.data.duration_ms} ms · ${j.data.cites?.length ?? 0} citations`,
        tone: "success",
      });
    } catch (e: any) {
      toast({
        title: "Live chat failed — falling back to scripted reply",
        body: e?.message ?? String(e),
        tone: "warning",
      });
      setDrafts((d) => ({
        ...d,
        [threadId]: [
          ...(d[threadId] ?? []),
          {
            from: "ai",
            text:
              "I couldn't reach the live Gemini endpoint just now. Showing a scripted reference reply instead. Your previous answer is still in this thread's history.",
            cites: ["IVDR Annex I"],
            confidence: 0.5,
          },
        ],
      }));
    } finally {
      setSending(false);
    }
  }

  function newThread() {
    toast({ title: "New conversation started", tone: "success" });
    // We don't persist new threads in mock mode — point at the first thread
    // and clear local drafts so the seed message renders cleanly.
    setThreadId("c1");
    setDrafts({});
  }

  return (
    <div className="px-8 py-8 max-w-[1600px] mx-auto">
      <PageHeader
        eyebrow="Ask Conformly"
        title="Regulatory chat — every answer cites its source"
        subtitle="A persistent conversation. Ask anything about IVDR, ISO, IEC or CLSI requirements. Conformly cross-references your uploaded documents, then answers in plain language with the regulation clauses and document IDs that support the answer."
        right={
          <button
            onClick={() => {
              setLiveMode((m) => !m);
              toast({
                title: liveMode ? "Switched to scripted replies" : "Switched to live Gemini replies",
                body: liveMode ? "Faster but stub responses." : "Real Gemini 3 Pro · ~8-14 s per turn.",
                tone: "info",
              });
            }}
            className={clsx(
              "inline-flex items-center gap-2 px-3 h-9 rounded-md text-[13px] font-medium transition-colors border",
              liveMode
                ? "bg-success/10 text-success border-success/30"
                : "bg-ink-100 text-ink-700 border-ink-200",
            )}
          >
            {liveMode ? <Zap className="h-3.5 w-3.5" /> : <RadioTower className="h-3.5 w-3.5" />}
            {liveMode ? "Live · Gemini 3 Pro" : "Scripted mode"}
          </button>
        }
      />

      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-15rem)] min-h-[560px]">
        {/* Conversation history (left) */}
        <aside className="col-span-12 md:col-span-3 hidden md:block">
          <Card className="h-full flex flex-col">
            <div className="px-5 pt-5 pb-3 border-b border-ink-200 flex items-center justify-between">
              <p className="text-[11px] tracking-[0.18em] uppercase text-ink-500 font-medium">
                Conversations
              </p>
              <button onClick={newThread} className="btn-xs btn-secondary">
                <Plus className="h-3 w-3" />
                New
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {CHAT_HISTORY.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setThreadId(c.id)}
                  className={clsx(
                    "w-full text-left rounded-md px-3 py-2 transition-colors cursor-pointer",
                    c.id === threadId
                      ? "bg-accent/10 border border-accent/30"
                      : "border border-transparent hover:bg-surface-subtle",
                  )}
                >
                  <p
                    className={clsx(
                      "text-[12.5px] leading-tight truncate",
                      c.id === threadId ? "text-ink-900 font-medium" : "text-ink-700",
                    )}
                  >
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
              {sending && (
                <div className="inline-flex items-center gap-2 text-[12px] font-mono text-ink-500 pl-1">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Conformly is thinking…
                </div>
              )}
              <div ref={endRef} />
            </CardBody>

            <div className="border-t border-ink-200 p-4">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {CHAT_SUGGESTED.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-[12px] text-ink-600 hover:text-ink-900 border border-ink-200 hover:border-ink-300 rounded-full px-3 py-1 transition-colors cursor-pointer"
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
                <button onClick={() => send()} className="btn-lg btn-primary" aria-label="Send">
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

function AiMessage({ m }: { m: ChatMsg }) {
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

function UserMessage({ m }: { m: ChatMsg }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-lg bg-sky-50 border border-sky-200 px-4 py-2.5 text-[14px] text-ink-900 leading-relaxed">
        {m.text}
      </div>
    </div>
  );
}

function renderInline(text: string) {
  // Support **bold** plus pipe-tables (re-rendered as preformatted)
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let buffer: string[] = [];
  let inTable = false;
  let tableLines: string[] = [];

  function flushBuffer(key: string) {
    if (!buffer.length) return;
    const para = buffer.join("\n");
    blocks.push(
      <p key={key} className="whitespace-pre-line">
        {renderBold(para)}
      </p>,
    );
    buffer = [];
  }
  function flushTable(key: string) {
    if (!tableLines.length) return;
    blocks.push(
      <pre key={key} className="font-mono text-[12px] bg-ink-50 border border-ink-200 rounded p-3 overflow-x-auto whitespace-pre">
        {tableLines.join("\n")}
      </pre>,
    );
    tableLines = [];
  }

  lines.forEach((line, i) => {
    if (line.trim().startsWith("|")) {
      if (!inTable) {
        flushBuffer(`p${i}`);
        inTable = true;
      }
      tableLines.push(line);
    } else {
      if (inTable) {
        flushTable(`t${i}`);
        inTable = false;
      }
      buffer.push(line);
    }
  });
  flushBuffer("p-end");
  flushTable("t-end");
  return <div className="space-y-2">{blocks}</div>;
}

function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-ink-900">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}
