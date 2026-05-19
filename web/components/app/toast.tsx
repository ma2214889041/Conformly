"use client";

/**
 * Minimal toast system, no context, no library.
 *
 * Usage from any client component:
 *
 *     import { toast } from "@/components/app/toast";
 *     toast({ title: "Report generated", tone: "success" });
 *
 * The ToastProvider must be mounted once at the top of the (app) layout.
 * Toasts auto-dismiss after 3.6 seconds; users can close them earlier.
 */

import { useEffect, useState } from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import clsx from "clsx";

export type ToastTone = "info" | "success" | "warning" | "danger";

type Toast = {
  id: string;
  title: string;
  body?: string;
  tone: ToastTone;
};

declare global {
  // eslint-disable-next-line no-var
  var __conformlyToast__: ((t: Omit<Toast, "id">) => void) | undefined;
}

const DURATION_MS = 3600;

export function toast(args: { title: string; body?: string; tone?: ToastTone }): void {
  if (typeof window === "undefined") return;
  // Fire-and-forget; ignored if no provider mounted yet.
  globalThis.__conformlyToast__?.({
    title: args.title,
    body: args.body,
    tone: args.tone ?? "success",
  });
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    globalThis.__conformlyToast__ = (t) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, ...t }]);
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), DURATION_MS);
    };
    return () => {
      globalThis.__conformlyToast__ = undefined;
    };
  }, []);

  const dismiss = (id: string) =>
    setToasts((prev) => prev.filter((x) => x.id !== id));

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-[min(380px,calc(100vw-2rem))] pointer-events-none">
      {toasts.map((t) => (
        <ToastCard key={t.id} t={t} onClose={() => dismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastCard({ t, onClose }: { t: Toast; onClose: () => void }) {
  const Icon =
    t.tone === "success" ? CheckCircle2 :
    t.tone === "warning" ? TriangleAlert :
    t.tone === "danger"  ? TriangleAlert :
    Info;
  const tint =
    t.tone === "success" ? "text-success" :
    t.tone === "warning" ? "text-warning" :
    t.tone === "danger"  ? "text-danger" :
    "text-accent";
  return (
    <div className="card pointer-events-auto shadow-lg animate-slide-up flex items-start gap-3 p-3.5">
      <Icon className={clsx("h-4 w-4 shrink-0 mt-0.5", tint)} />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-ink-900 leading-snug">{t.title}</p>
        {t.body && <p className="text-[12px] text-ink-600 mt-0.5 leading-snug">{t.body}</p>}
      </div>
      <button onClick={onClose} className="text-ink-400 hover:text-ink-700 shrink-0" aria-label="Dismiss">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
