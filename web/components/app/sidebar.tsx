"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  FileText,
  FolderOpen,
  Gauge,
  LayoutDashboard,
  Library,
  MessageSquare,
  Settings,
} from "lucide-react";
import clsx from "clsx";
import { PROJECT, USER } from "@/lib/mock-project";
import { ProgressBar } from "./atoms";

const NAV = [
  { href: "/dashboard",     label: "Dashboard",     icon: LayoutDashboard },
  { href: "/documents",     label: "Documents",     icon: FolderOpen      },
  { href: "/analysis",      label: "Analysis",      icon: Activity        },
  { href: "/reports",       label: "Reports",       icon: FileText        },
  { href: "/nb-simulation", label: "NB Simulation", icon: Gauge           },
  { href: "/chat",          label: "Chat",          icon: MessageSquare   },
  { href: "/knowledge",     label: "Knowledge",     icon: Library         },
];

export function Sidebar() {
  const pathname = usePathname();
  const dayPct = Math.round((PROJECT.current_day / PROJECT.estimated_days) * 100);
  return (
    <aside
      aria-label="Main navigation"
      className="fixed inset-y-0 left-0 z-30 hidden md:flex w-[252px] shrink-0 flex-col bg-white border-r border-ink-200"
    >
      {/* brand */}
      <div className="h-16 px-5 flex items-center gap-2.5 border-b border-ink-200">
        <div className="h-7 w-7 rounded-md bg-accent grid place-items-center shrink-0">
          <span className="text-white font-bold text-[15px] tracking-tight">C</span>
        </div>
        <div className="leading-tight min-w-0">
          <div className="text-ink-900 font-semibold tracking-tight text-[15px]">Conformly</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-ink-400">Design-to-Certificate</div>
        </div>
      </div>

      {/* nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="text-[10px] uppercase tracking-[0.22em] text-ink-400 px-3 mb-2">Workspace</div>
        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    "group w-full flex items-center gap-3 px-3 h-9 rounded-md text-[13px] font-medium transition-colors relative",
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-ink-600 hover:text-ink-900 hover:bg-ink-50",
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-accent" />
                  )}
                  <Icon
                    className={clsx(
                      "h-4 w-4 shrink-0",
                      active ? "text-accent" : "text-ink-400 group-hover:text-ink-700",
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-7 text-[10px] uppercase tracking-[0.22em] text-ink-400 px-3 mb-2">Project</div>
        <div className="mx-2 rounded-md border border-ink-200 bg-surface-subtle p-3">
          <div className="text-[12px] font-medium text-ink-900 leading-snug">{PROJECT.name}</div>
          <div className="text-[11px] text-ink-500 mt-0.5">{PROJECT.classification}</div>
          <div className="mt-3 flex items-center gap-2">
            <ProgressBar value={PROJECT.current_day} max={PROJECT.estimated_days} color="sky" />
            <span className="text-[10px] font-mono text-ink-500 shrink-0">{dayPct}%</span>
          </div>
          <div className="text-[10px] text-ink-500 mt-2 font-mono">
            Day {PROJECT.current_day} / {PROJECT.estimated_days}
          </div>
        </div>
      </nav>

      {/* user */}
      <div className="border-t border-ink-200 p-3">
        <button className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-ink-50 transition-colors">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-accent-deep grid place-items-center text-white text-[12px] font-semibold shrink-0">
            {USER.initials}
          </div>
          <div className="flex-1 min-w-0 leading-tight text-left">
            <div className="text-[12px] text-ink-900 font-medium truncate">{USER.name}</div>
            <div className="text-[11px] text-ink-500 truncate">{USER.role}</div>
          </div>
          <Settings className="h-3.5 w-3.5 text-ink-400" />
        </button>
      </div>
    </aside>
  );
}
