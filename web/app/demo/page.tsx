"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import clsx from "clsx";
import { SCENARIOS } from "@/lib/demos";
import { ConversationPlayer } from "@/components/conversation-player";

export default function DemoPage() {
  const [activeId, setActiveId] = useState<string>(SCENARIOS[0].id);
  const scenario = SCENARIOS.find((s) => s.id === activeId)!;

  return (
    <div className="container-wide pt-10 pb-24">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-wider text-accent">
          <Sparkles className="h-3 w-3" />
          interactive · responses pre-recorded from the live tools
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-50">
          Sit down with the agent.
        </h1>
        <p className="mt-3 text-ink-400 max-w-3xl">
          Pick a scenario, press Play, and watch the conversation unfold the way it
          would on Slack today — tool calls visible, real JSON payloads, human-in-the-loop
          approvals where they matter. Every scenario is a faithful capture of what the
          Python tools return; the agent's reasoning text is the LLM's own.
        </p>
      </header>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar — scenario picker */}
        <aside className="space-y-3">
          {SCENARIOS.map((s) => {
            const active = s.id === activeId;
            return (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={clsx(
                  "w-full text-left card card-hover p-4 transition-all group",
                  active && "!border-accent/60 !bg-accent/5"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className={clsx(
                    "text-xs font-mono uppercase tracking-wider",
                    active ? "text-accent" : "text-ink-500"
                  )}>
                    {s.duration}
                  </p>
                  <ChevronRight className={clsx(
                    "h-4 w-4 transition-transform",
                    active ? "text-accent" : "text-ink-600 group-hover:text-ink-400"
                  )} />
                </div>
                <h3 className="font-semibold mt-1 text-ink-50">{s.title}</h3>
                <p className="mt-1 text-sm text-ink-400 leading-snug">{s.hook}</p>
              </button>
            );
          })}

          <Link href="/dashboard" className="block card card-hover p-4">
            <p className="text-xs font-mono uppercase tracking-wider text-ink-500">
              prefer the dashboard?
            </p>
            <h3 className="font-semibold mt-1 text-ink-50">Open the 20-client view</h3>
            <p className="mt-1 text-sm text-ink-400 leading-snug">
              Same data, no script — just the portfolio.
            </p>
          </Link>
        </aside>

        {/* Main — conversation player */}
        <div>
          <ConversationPlayer scenario={scenario} />

          <p className="mt-4 text-xs font-mono text-ink-500">
            All payloads in this demo are the literal JSON returned by the production tools
            — see <code className="text-ink-300">plugin/tests/</code> for the same shapes
            under coverage.
          </p>
        </div>
      </div>
    </div>
  );
}
