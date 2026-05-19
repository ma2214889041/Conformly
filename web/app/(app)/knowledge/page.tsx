import { Construction, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <div className="px-6 lg:px-10 py-16 max-w-3xl">
      <div className="card p-10 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 border border-accent/30 text-accent mb-4">
          <Construction className="h-5 w-5" />
        </span>
        <h1 className="text-2xl font-semibold text-white">Knowledge</h1>
        <p className="mt-2 text-ink-400 max-w-md mx-auto">
          This page is being built next. The dashboard is live now — the rest of
          the product rolls out one page at a time so you can review each before
          the next is touched.
        </p>
        <Link href="/dashboard" className="btn-primary text-sm px-4 py-2 mt-6">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
