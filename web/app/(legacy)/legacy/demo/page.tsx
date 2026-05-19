"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Clock, Zap, BadgeCheck } from "lucide-react";
import clsx from "clsx";
import { SCENARIOS } from "@/lib/demos";
import { ConversationPlayer } from "@/components/conversation-player";
import { getHealth } from "@/lib/api";

export default function DemoPage() {
  const [activeId, setActiveId] = useState<string>(SCENARIOS[0].id);
  const [liveAvailable, setLiveAvailable] = useState(false);
  const scenario = SCENARIOS.find((s) => s.id === activeId)!;

  useEffect(() => {
    let cancelled = false;
    getHealth().then((h) => {
      if (!cancelled) setLiveAvailable(Boolean(h?.vault_exists));
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="container-wide pt-10 pb-24">
      {/* ----------------------------------------------------------- */}
      {/* Header                                                       */}
      {/* ----------------------------------------------------------- */}
      <header className="mb-6">
        <div className="inline-flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-wider text-accent">
          <Sparkles className="h-3 w-3" />
          interactive · scripted or live · history saved per browser
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-50">
          Sit down with the agent.
        </h1>
        <p className="mt-2 text-ink-400 max-w-3xl text-[15px] leading-relaxed">
          Three scripted scenarios captured from the live tools. Toggle{" "}
          <span className="text-accent font-medium">Live</span> to fire the real{" "}
          <code className="text-ink-200 font-mono text-[13px]">/api/agent/run/</code> SSE
          stream and watch Gemini 3 Pro answer in real time.
        </p>
      </header>

      {/* ----------------------------------------------------------- */}
      {/* Scenario tabs — horizontal, scroll on overflow              */}
      {/* ----------------------------------------------------------- */}
      <div className="mb-5 -mx-2 px-2 overflow-x-auto">
        <div className="flex gap-3 min-w-max">
          {SCENARIOS.map((s) => {
            const active = s.id === activeId;
            return (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={clsx(
                  "card text-left p-4 min-w-[260px] max-w-[320px] flex-1 transition-all group",
                  active
                    ? "!border-accent/60 !bg-accent/[0.06] shadow-md shadow-accent/10"
                    : "card-hover opacity-80 hover:opacity-100",
                )}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className={clsx(
                      "text-[10px] font-mono uppercase tracking-wider",
                      active ? "text-accent" : "text-ink-500",
                    )}
                  >
                    <Clock className="h-2.5 w-2.5 inline mr-1" />
                    {s.duration}
                  </span>
                  {active && (
                    <span className="badge-cyan text-[10px]">
                      <BadgeCheck className="h-2.5 w-2.5" />
                      selected
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-ink-50 text-[14px] leading-snug">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[13px] text-ink-400 leading-snug">{s.hook}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* Conversation player                                          */}
      {/* ----------------------------------------------------------- */}
      <ConversationPlayer scenario={scenario} liveAvailable={liveAvailable} />

      {/* ----------------------------------------------------------- */}
      {/* Footer hints                                                 */}
      {/* ----------------------------------------------------------- */}
      <div className="mt-6 grid sm:grid-cols-3 gap-3 text-[12.5px]">
        <Hint
          icon={<Zap className="h-4 w-4" />}
          title="Scripted mode"
          body="Pre-recorded JSON — zero backend. Demo cannot fail on stage."
        />
        <Hint
          icon={<Sparkles className="h-4 w-4" />}
          title="Live mode"
          body="Streams real Gemini 3 Pro output over SSE. ~10–14 s per call."
        />
        <Hint
          icon={<Clock className="h-4 w-4" />}
          title="History"
          body="Every run is saved in your browser. Click the clock icon to replay."
        />
      </div>

      <p className="mt-6 text-xs font-mono text-ink-500">
        Same JSON shapes flow through both modes — see{" "}
        <Link href="/tools" className="text-ink-200 hover:text-accent">
          /tools
        </Link>{" "}
        for the live tool catalogue.
      </p>
    </div>
  );
}

function Hint({
  icon, title, body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="card p-3 flex items-start gap-2.5">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-ink-800/70 text-accent shrink-0">
        {icon}
      </span>
      <div>
        <p className="font-semibold text-ink-100">{title}</p>
        <p className="text-ink-400 leading-snug">{body}</p>
      </div>
    </div>
  );
}
