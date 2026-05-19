"use client";

import { useState } from "react";
import {
  ArrowRight, CheckCircle2, FileText, Folder, Loader2, Plus, ShieldAlert, Upload,
} from "lucide-react";
import clsx from "clsx";
import { DOC_FOLDERS, DOCUMENTS, type DocFolder, type Document } from "@/lib/mock-project";
import {
  Badge, Button, Card, CardBody, CardHeader, CardTitle, Citation,
  PageHeader, ProgressBar,
} from "@/components/app/atoms";

export default function DocumentsPage() {
  const [folderId, setFolderId] = useState<string>(DOC_FOLDERS[3].id);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const folder = DOC_FOLDERS.find((f) => f.id === folderId)!;
  const docs = DOCUMENTS[folderId] || [];
  const doc = selectedDoc ? docs.find((d) => d.id === selectedDoc) : null;

  return (
    <div className="px-8 py-8 max-w-[1600px] mx-auto">
      <PageHeader
        eyebrow="Documents"
        title="Document workspace"
        subtitle="Upload, organise and view every design file. Folders mirror IVDR Annex II. Every upload is read by the AI in seconds and mapped to the regulation clauses it touches."
        right={
          <>
            <Button variant="secondary" size="md"><Upload className="h-3.5 w-3.5" />Drag & drop</Button>
            <Button variant="primary"   size="md"><Plus className="h-3.5 w-3.5"   />Upload document</Button>
          </>
        }
      />

      <div className="grid grid-cols-12 gap-4">
        <aside className="col-span-12 md:col-span-3">
          <Card>
            <CardHeader><CardTitle>IVDR Annex II</CardTitle></CardHeader>
            <CardBody>
              <ul className="space-y-1">
                {DOC_FOLDERS.map((f) => (
                  <FolderRow key={f.id} f={f} active={f.id === folderId} onClick={() => { setFolderId(f.id); setSelectedDoc(null); }} />
                ))}
              </ul>
            </CardBody>
          </Card>
        </aside>

        <section className={clsx("col-span-12", doc ? "md:col-span-5" : "md:col-span-9")}>
          <Card>
            <CardHeader>
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.22em] uppercase text-ink-500 mb-0.5">
                    Folder {folder.num}
                  </p>
                  <CardTitle>{folder.name}</CardTitle>
                </div>
                <span className="text-[11px] font-mono text-ink-500">
                  {folder.count} / {folder.required} documents
                </span>
              </div>
            </CardHeader>
            <CardBody>
              <DragZone />
              <ul className="space-y-2 mt-4">
                {docs.length === 0 ? (
                  <EmptyFolder />
                ) : (
                  docs.map((d) => (
                    <DocRow key={d.id} d={d} active={d.id === selectedDoc} onClick={() => setSelectedDoc(d.id === selectedDoc ? null : d.id)} />
                  ))
                )}
              </ul>
            </CardBody>
          </Card>
        </section>

        {doc && (
          <aside className="col-span-12 md:col-span-4">
            <DocPreview d={doc} />
          </aside>
        )}
      </div>
    </div>
  );
}

function FolderRow({ f, active, onClick }: { f: DocFolder; active: boolean; onClick: () => void }) {
  const tone =
    f.status === "alert" ? "text-danger" :
    f.status === "warn"  ? "text-warning" :
    "text-success";
  return (
    <li>
      <button
        onClick={onClick}
        className={clsx(
          "w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-colors",
          active ? "bg-accent/10 border border-accent/30" : "border border-transparent hover:bg-surface-subtle",
        )}
      >
        <Folder className={clsx("h-3.5 w-3.5 shrink-0", active ? "text-accent" : "text-ink-400")} />
        <span className={clsx("text-[12px] font-mono w-5 shrink-0", active ? "text-accent" : "text-ink-500")}>
          {f.num}
        </span>
        <span className={clsx("text-[13px] leading-tight flex-1 min-w-0 truncate", active ? "text-ink-900" : "text-ink-700")}>
          {f.name}
        </span>
        <span className={clsx("text-[10px] font-mono shrink-0", tone)}>{f.count}/{f.required}</span>
      </button>
    </li>
  );
}

function DocRow({ d, active, onClick }: { d: Document; active: boolean; onClick: () => void }) {
  return (
    <li>
      <button
        onClick={onClick}
        className={clsx(
          "w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors border",
          active ? "border-accent/30 bg-accent/[0.04]" : "border-ink-200 bg-white hover:bg-surface-subtle",
        )}
      >
        <KindIcon kind={d.kind} flagged={d.flagged} />
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] text-ink-900 leading-tight truncate">{d.name}</p>
          <p className="text-[11px] text-ink-500 font-mono mt-0.5">uploaded {d.uploaded}</p>
        </div>
        <DocStatus d={d} />
      </button>
    </li>
  );
}

function KindIcon({ kind, flagged }: { kind: Document["kind"]; flagged?: boolean }) {
  const ext = kind.toUpperCase();
  return (
    <span className={clsx(
      "shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-md border text-[9px] font-mono font-semibold tracking-wider",
      flagged ? "border-warning/40 bg-warning-soft text-warning" : "border-ink-200 bg-surface-subtle text-ink-600",
    )}>
      {ext}
    </span>
  );
}

function DocStatus({ d }: { d: Document }) {
  if (d.status === "analyzing") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-ink-500 font-mono">
        <Loader2 className="h-3 w-3 animate-spin" />Reading…
      </span>
    );
  }
  if (d.status === "needs-review") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-warning font-mono">
        <ShieldAlert className="h-3 w-3" />Needs review
      </span>
    );
  }
  if (d.score != null) {
    const tone = d.score >= 80 ? "text-success" : d.score >= 60 ? "text-accent" : "text-warning";
    return (
      <div className="text-right shrink-0">
        <p className={clsx("text-[12.5px] font-mono font-semibold", tone)}>{d.score}</p>
        <p className="text-[9px] tracking-[0.16em] uppercase text-ink-500">score</p>
      </div>
    );
  }
  return null;
}

function DragZone() {
  return (
    <div className="rounded-lg border border-dashed border-ink-300 bg-surface-subtle/60 p-5 text-center">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white border border-ink-200 text-accent mb-2">
        <Upload className="h-4 w-4" />
      </span>
      <p className="text-[13px] text-ink-900 font-medium">
        Drop design files here or click to browse
      </p>
      <p className="text-[12px] text-ink-500 mt-0.5">
        PDF, DOCX, XLSX, STEP/IGES (CAD), PNG, JPG · max 200 MB per file
      </p>
    </div>
  );
}

function EmptyFolder() {
  return (
    <div className="text-center py-12 text-[13px] text-ink-500">
      This folder is empty. Drop the first design file above and Conformly will read it in seconds.
    </div>
  );
}

function DocPreview({ d }: { d: Document }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Document preview</CardTitle>
          <Badge tone="outline">{d.kind.toUpperCase()}</Badge>
        </div>
      </CardHeader>
      <CardBody>
        <p className="text-[13.5px] text-ink-900 font-medium leading-snug mb-1">{d.name}</p>
        <p className="text-[11px] text-ink-500 font-mono mb-4">uploaded {d.uploaded}</p>

        <div className="rounded-md border border-ink-200 bg-surface-subtle h-32 grid place-items-center mb-4">
          <div className="text-center">
            <FileText className="h-6 w-6 text-ink-400 mx-auto" />
            <p className="text-[11px] text-ink-500 font-mono mt-2">
              {d.status === "analyzing" ? "Rendering preview…" : "Preview rendered server-side"}
            </p>
          </div>
        </div>

        {d.score != null && (
          <>
            <div className="flex items-center justify-between text-[12px] text-ink-700 mb-1">
              <span>Compliance score</span>
              <span className="font-mono font-semibold text-ink-900">{d.score}/100</span>
            </div>
            <ProgressBar value={d.score} color={d.score >= 80 ? "green" : d.score >= 60 ? "sky" : "amber"} />
          </>
        )}

        <div className="mt-5 pt-5 border-t border-ink-200 space-y-4">
          <Section title="Regulations touched">
            <div className="flex flex-wrap gap-1.5">
              <Citation>IVDR Annex I §12.1</Citation>
              <Citation>ISO 14971 §7.3</Citation>
              <Citation>CLSI EP25-A</Citation>
            </div>
          </Section>

          <Section title="Evidence provided">
            <ul className="space-y-1.5 text-[13px]">
              <Li icon={<CheckCircle2 className="h-3.5 w-3.5 text-success" />}>
                Real-time stability data through 9 months at 25 °C and 5 °C.
              </Li>
              <Li icon={<CheckCircle2 className="h-3.5 w-3.5 text-success" />}>
                Three replicate lots tested per ICH Q1A(R2).
              </Li>
            </ul>
          </Section>

          {d.flagged && (
            <Section title="Issues found">
              <ul className="space-y-1.5 text-[13px]">
                <Li icon={<ShieldAlert className="h-3.5 w-3.5 text-warning" />}>
                  Document does not cover the full claimed shelf-life (24 months). Either extend the study or add accelerated data per CLSI EP25-A.
                </Li>
              </ul>
            </Section>
          )}

          <Button variant="primary" size="sm" className="w-full">
            Open in editor
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.22em] uppercase text-ink-500 font-medium mb-2">{title}</p>
      {children}
    </div>
  );
}

function Li({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span className="text-ink-700 leading-snug">{children}</span>
    </li>
  );
}
