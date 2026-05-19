"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, Library, Search } from "lucide-react";
import clsx from "clsx";
import { KNOWLEDGE_TREE, type KnowledgeNode } from "@/lib/mock-project";
import {
  Badge, Button, Card, CardBody, CardHeader, CardTitle,
  PageHeader, SectionLabel,
} from "@/components/app/atoms";

export default function KnowledgePage() {
  const [open, setOpen] = useState<Record<string, boolean>>({ "kb-ivdr": true });
  const [selected, setSelected] = useState<string>("kb-ivdr-ax1");

  function toggle(id: string) {
    setOpen((o) => ({ ...o, [id]: !o[id] }));
  }

  const selectedNode = findNode(KNOWLEDGE_TREE, selected);

  return (
    <div className="px-8 py-8 max-w-[1600px] mx-auto">
      <PageHeader
        eyebrow="Knowledge"
        title="Regulatory library used by the AI"
        subtitle="Transparency: see exactly what regulatory content Conformly has access to and how often each source has been used. Click any document to view its content; annotate, highlight, or jump straight to the analyses that cite it."
      />

      <div className="grid grid-cols-12 gap-4">
        {/* ============ Tree (left) ============ */}
        <aside className="col-span-12 md:col-span-4 lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sources</CardTitle>
                <Badge tone="outline">
                  {KNOWLEDGE_TREE.reduce((s, n) => s + (n.count ?? 0), 0)} docs
                </Badge>
              </div>
            </CardHeader>
            <CardBody>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-400" />
                <input
                  placeholder="Search…"
                  className="w-full h-9 pl-9 pr-3 rounded-md bg-surface-subtle border border-ink-200 text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-accent focus:bg-white"
                />
              </div>
              <ul className="space-y-0.5">
                {KNOWLEDGE_TREE.map((node) => (
                  <TreeBranch
                    key={node.id}
                    node={node}
                    open={!!open[node.id]}
                    onToggle={() => toggle(node.id)}
                    selected={selected}
                    onSelect={setSelected}
                  />
                ))}
              </ul>
            </CardBody>
          </Card>
        </aside>

        {/* ============ Document detail (right) ============ */}
        <section className="col-span-12 md:col-span-8 lg:col-span-9">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.22em] uppercase text-ink-500 mb-0.5">
                    Source document
                  </p>
                  <CardTitle>{selectedNode?.name ?? "Select a document"}</CardTitle>
                </div>
                {selectedNode?.used != null && (
                  <Badge tone="sky">used in {selectedNode.used} analyses</Badge>
                )}
              </div>
            </CardHeader>
            <CardBody>
              <SampleContent name={selectedNode?.name} />
            </CardBody>
          </Card>
        </section>
      </div>
    </div>
  );
}

// ===========================================================================
// Tree branch (recursive)
// ===========================================================================

function TreeBranch({
  node, open, onToggle, selected, onSelect,
}: {
  node: KnowledgeNode;
  open: boolean;
  onToggle: () => void;
  selected: string;
  onSelect: (id: string) => void;
}) {
  if (node.children) {
    return (
      <li>
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-ink-700 hover:bg-surface-subtle"
        >
          {open ? <ChevronDown className="h-3.5 w-3.5 text-ink-400" /> : <ChevronRight className="h-3.5 w-3.5 text-ink-400" />}
          <Library className="h-3.5 w-3.5 text-ink-400 shrink-0" />
          <span className="flex-1 text-left font-medium">{node.name}</span>
          <span className="text-[10px] font-mono text-ink-500">{node.count}</span>
        </button>
        {open && node.children && (
          <ul className="pl-6 space-y-0.5">
            {node.children.map((c) => (
              <TreeLeaf key={c.id} node={c} selected={selected === c.id} onSelect={onSelect} />
            ))}
          </ul>
        )}
      </li>
    );
  }
  return (
    <TreeLeaf node={node} selected={selected === node.id} onSelect={onSelect} />
  );
}

function TreeLeaf({
  node, selected, onSelect,
}: {
  node: KnowledgeNode;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <li>
      <button
        onClick={() => onSelect(node.id)}
        className={clsx(
          "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[12.5px]",
          selected ? "bg-accent/10 border border-accent/30 text-ink-900" : "text-ink-700 hover:bg-surface-subtle border border-transparent",
        )}
      >
        <FileText className="h-3 w-3 text-ink-400 shrink-0" />
        <span className="flex-1 text-left">{node.name}</span>
        {node.used != null && <span className="text-[10px] font-mono text-ink-500">{node.used}×</span>}
      </button>
    </li>
  );
}

// ===========================================================================
// Sample document content
// ===========================================================================

function SampleContent({ name }: { name?: string }) {
  if (!name) {
    return <p className="text-ink-500 text-[13px]">Pick a regulation from the left to view its content.</p>;
  }
  return (
    <article className="prose-conformly max-w-none">
      <SectionLabel>Excerpt · live markdown</SectionLabel>
      <div className="rounded-md border border-ink-200 bg-surface-subtle p-5 text-[13px] leading-relaxed text-ink-700 font-mono whitespace-pre-line">
{`# ${name}

## Chapter I — General Requirements

§1.1  Devices shall achieve the performance intended by their manufacturer
       and shall be designed and manufactured in such a way that, during
       normal conditions of use, they are suitable for their intended purpose.

§1.2  The known and foreseeable risks shall be eliminated or reduced as far
       as possible through safe design and manufacture.

§1.3  Manufacturers shall establish, implement, document and maintain a risk
       management system as described in ISO 14971.

…

[ continues — full text available, indexed by Conformly for citation matching ]`}
      </div>

      <div className="mt-5 grid sm:grid-cols-3 gap-3">
        <div className="card p-4">
          <p className="text-[10px] tracking-[0.18em] uppercase text-ink-500 mb-1">Indexed sections</p>
          <p className="text-2xl font-semibold text-ink-900 font-display">126</p>
        </div>
        <div className="card p-4">
          <p className="text-[10px] tracking-[0.18em] uppercase text-ink-500 mb-1">Citations from this doc</p>
          <p className="text-2xl font-semibold text-ink-900 font-display">88</p>
        </div>
        <div className="card p-4">
          <p className="text-[10px] tracking-[0.18em] uppercase text-ink-500 mb-1">Last updated</p>
          <p className="text-[14px] font-mono text-ink-900 mt-1.5">2026-04-22</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <Button variant="primary" size="sm">View analyses that cite this</Button>
        <Button variant="secondary" size="sm">Annotate</Button>
        <Button variant="ghost" size="sm">Open raw markdown</Button>
      </div>
    </article>
  );
}

function findNode(tree: KnowledgeNode[], id: string): KnowledgeNode | null {
  for (const n of tree) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNode(n.children, id);
      if (found) return found;
    }
  }
  return null;
}
