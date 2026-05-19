import Link from "next/link";
import { ApiStatusPill } from "@/components/api-status-pill";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur bg-ink-950/70 border-b border-ink-800/60">
        <nav className="container-wide flex items-center justify-between py-3.5">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent/15 border border-accent/30 text-accent text-sm font-bold">
              C
            </span>
            <span className="font-semibold tracking-tight text-white">Conformly</span>
            <span className="hidden sm:inline text-xs text-ink-400 ml-2 font-mono">
              Design-to-Certificate AI
            </span>
            <span className="hidden md:inline ml-3"><ApiStatusPill /></span>
          </Link>
          <div className="flex items-center gap-1 text-sm">
            <Link href="/dashboard" className="btn-primary">Open product →</Link>
            <a
              href="https://github.com/ma2214889041/Conformly"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              GitHub
            </a>
          </div>
        </nav>
      </header>

      {children}

      <footer className="border-t border-ink-800/60 mt-24">
        <div className="container-wide py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-400">
          <p>
            Powered by Gemini 3 ·{" "}
            <a href="https://github.com/NousResearch/hermes-agent" target="_blank" rel="noreferrer" className="text-ink-200 hover:text-accent">
              Hermes Agent
            </a>{" "}
            · deployed on a single Vultr VPS.
          </p>
          <p className="font-mono text-xs">© 2026 Conformly</p>
        </div>
      </footer>
    </>
  );
}
