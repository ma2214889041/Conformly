"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderClosed,
  Microscope,
  FileText,
  ClipboardCheck,
  MessagesSquare,
  BookOpen,
} from "lucide-react";
import clsx from "clsx";

const ITEMS = [
  { href: "/dashboard",      label: "Dashboard",     icon: LayoutDashboard,
    hint: "Today's actions and project health" },
  { href: "/documents",      label: "Documents",     icon: FolderClosed,
    hint: "Design files organized by IVDR Annex II" },
  { href: "/analysis",       label: "Analysis",      icon: Microscope,
    hint: "Design suggestions, GSPR mapping, gaps" },
  { href: "/reports",        label: "Reports",       icon: FileText,
    hint: "Generated regulatory documents" },
  { href: "/nb-simulation",  label: "NB simulation", icon: ClipboardCheck,
    hint: "Predict the Notified Body verdict" },
  { href: "/chat",           label: "Ask Conformly", icon: MessagesSquare,
    hint: "Regulatory questions in plain language" },
  { href: "/knowledge",      label: "Knowledge",     icon: BookOpen,
    hint: "Regulatory library used by the AI" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside
      aria-label="Main navigation"
      className="fixed inset-y-0 left-0 z-30 hidden md:flex w-60 shrink-0 flex-col border-r border-ink-800/70 bg-ink-950/80 backdrop-blur"
    >
      <div className="px-5 py-5 flex items-center gap-2 border-b border-ink-800/70">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent/15 border border-accent/30 text-accent text-sm font-bold">
            C
          </span>
          <span className="font-semibold tracking-tight text-white">Conformly</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {ITEMS.map((it) => {
          const active = pathname.startsWith(it.href);
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              title={it.hint}
              className={clsx(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-accent/10 text-accent border border-accent/30"
                  : "text-ink-300 hover:text-white hover:bg-ink-800/40 border border-transparent",
              )}
            >
              <Icon className={clsx("h-4 w-4 shrink-0", active ? "text-accent" : "text-ink-400 group-hover:text-ink-100")} />
              <span className="truncate">{it.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-ink-800/70 text-[11px] font-mono text-ink-500 leading-relaxed">
        <p className="mb-1 text-ink-300">Sample Handling Module</p>
        <p>Class C IVD · Day 240 / 510</p>
        <p className="mt-2">
          <Link href="/legacy/demo" className="hover:text-ink-200">legacy demo →</Link>
        </p>
      </div>
    </aside>
  );
}
