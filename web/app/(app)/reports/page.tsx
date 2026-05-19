"use client";

import { useState } from "react";
import { ArrowRight, Clock, Download, FileText, RefreshCcw, Sparkles } from "lucide-react";
import clsx from "clsx";
import { REPORT_CATALOG, REPORT_LIBRARY } from "@/lib/mock-project";
import {
  Badge, Button, Card, CardBody, CardHeader, CardTitle,
  PageHeader, ProgressBar,
} from "@/components/app/atoms";

export default function ReportsPage() {
  return (
    <div className="px-8 py-8 max-w-[1600px] mx-auto">
      <PageHeader
        eyebrow="Reports"
        title="Generated regulatory reports"
        subtitle="Conformly drafts every report a Notified Body expects to see. Each paragraph carries citations back to the regulation clause and the source document it's grounded in — open any report to see the citation trail."
      />

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Generate a report</CardTitle>
            <Badge tone="sky">
              <Sparkles className="h-3 w-3" />
              Gemini 3 Pro · citations on every paragraph
            </Badge>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {REPORT_CATALOG.map((r) => (
              <article key={r.id} className="rounded-lg border border-ink-200 bg-white p-4 hover:border-accent/40 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-sky-50 border border-sky-200 text-accent">
                    <FileText className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] font-mono text-ink-500">{r.time}</span>
                </div>
                <h3 className="font-semibold text-ink-900 text-[14px] leading-snug">{r.title}</h3>
                <p className="text-[11px] text-ink-500 font-mono mt-0.5">{r.annex}</p>

                <div className="mt-3">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-[10px] tracking-[0.18em] uppercase text-ink-500">Coverage</span>
                    <span className="text-[12px] font-mono text-ink-900 font-semibold">{r.completeness}%</span>
                  </div>
                  <ProgressBar
                    value={r.completeness}
                    color={r.completeness >= 80 ? "green" : r.completeness >= 60 ? "sky" : "amber"}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-ink-500">
                    {r.last_gen ? `last ${r.last_gen}` : "never generated"}
                  </span>
                  <Button variant="primary" size="xs">
                    <Sparkles className="h-3 w-3" />
                    {r.last_gen ? "Regenerate" : "Generate"}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Generated reports library</CardTitle>
            <span className="text-[11px] font-mono text-ink-500">{REPORT_LIBRARY.length} reports</span>
          </div>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-[13px]">
              <thead className="text-[10px] tracking-[0.18em] uppercase text-ink-500 border-b border-ink-200">
                <tr>
                  <Th>Report</Th>
                  <Th>Type</Th>
                  <Th>Version</Th>
                  <Th>Generated</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {REPORT_LIBRARY.map((r) => (
                  <tr key={r.id} className="border-b border-ink-100 hover:bg-surface-subtle">
                    <Td className="text-ink-900">{r.name}</Td>
                    <Td><Badge tone="outline">{r.type}</Badge></Td>
                    <Td className="font-mono text-ink-700">{r.version}</Td>
                    <Td className="font-mono text-ink-500">{r.date}</Td>
                    <Td>
                      <span className={clsx(
                        "inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-medium",
                        r.status === "draft"    && "text-ink-500",
                        r.status === "reviewed" && "text-accent",
                        r.status === "final"    && "text-success",
                      )}>
                        <span className={clsx(
                          "h-1.5 w-1.5 rounded-full",
                          r.status === "draft"    && "bg-ink-400",
                          r.status === "reviewed" && "bg-accent",
                          r.status === "final"    && "bg-success",
                        )} />
                        {r.status}
                      </span>
                    </Td>
                    <Td className="text-right">
                      <div className="inline-flex gap-1">
                        <Button variant="ghost" size="xs">
                          <FileText className="h-3 w-3" />
                          View
                        </Button>
                        <Button variant="ghost" size="xs">
                          <Download className="h-3 w-3" />
                          PDF
                        </Button>
                        <Button variant="ghost" size="xs">
                          <RefreshCcw className="h-3 w-3" />
                          Regenerate
                        </Button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={clsx("text-left py-2 px-3 font-medium", className)}>{children}</th>;
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={clsx("py-3 px-3 align-middle text-ink-700", className)}>{children}</td>;
}

