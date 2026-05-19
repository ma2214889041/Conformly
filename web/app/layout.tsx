import type { Metadata } from "next";
import Link from "next/link";
import { ApiStatusPill } from "@/components/api-status-pill";
import "./globals.css";

export const metadata: Metadata = {
  title: "Conformly — IVDR compliance co-pilot",
  description:
    "An AI co-pilot for in-vitro diagnostic manufacturers entering the EU under IVDR. Tracks 20+ clients across a 45-step program, parses Notified Body letters in seconds, and benches GSPR gaps against IVDR Annex I.",
  metadataBase: new URL("https://conformly.promp.com"),
  openGraph: {
    title: "Conformly — IVDR compliance co-pilot",
    description:
      "Autonomous IVDR co-pilot powered by Gemini 3. Five tools, 90 unit tests, deployed on a single Vultr VPS.",
    url: "https://conformly.promp.com",
    siteName: "Conformly",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-40 backdrop-blur bg-ink-950/70 border-b border-ink-800/60">
          <nav className="container-wide flex items-center justify-between py-3.5">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent/15 border border-accent/30 text-accent text-sm font-bold">
                C
              </span>
              <span className="font-semibold tracking-tight text-ink-50">Conformly</span>
              <span className="hidden sm:inline text-xs text-ink-400 ml-2 font-mono">
                IVDR co-pilot
              </span>
              <span className="hidden md:inline ml-3"><ApiStatusPill /></span>
            </Link>
            <div className="flex items-center gap-1 text-sm">
              <Link href="/demo" className="btn-ghost">Demo</Link>
              <Link href="/dashboard" className="btn-ghost">Dashboard</Link>
              <Link href="/tools" className="btn-ghost">Tools</Link>
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

        <main>{children}</main>

        <footer className="border-t border-ink-800/60 mt-24">
          <div className="container-wide py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-400">
            <p>
              Built on{" "}
              <a
                href="https://github.com/NousResearch/hermes-agent"
                target="_blank"
                rel="noreferrer"
                className="text-ink-200 hover:text-accent"
              >
                Hermes Agent
              </a>
              . Knowledge base in plain markdown. 90 unit tests. One Vultr box.
            </p>
            <p className="font-mono text-xs">© 2026 Conformly</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
