"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, FileText, Library, Search } from "lucide-react";
import clsx from "clsx";
import { KNOWLEDGE_TREE, type KnowledgeNode } from "@/lib/mock-project";
import { KNOWLEDGE_DOCS, type KnowledgeDoc } from "@/lib/knowledge-content";
import {
  Badge, Button, Card, CardBody, CardHeader, CardTitle,
  PageHeader, SectionLabel,
} from "@/components/app/atoms";
import { toast } from "@/components/app/toast";

export default function KnowledgePage() {
  const [open, setOpen] = useState<Record<string, boolean>>({ "kb-ivdr": true });
  const [selected, setSelected] = useState<string>("kb-ivdr-ax1");
  const [query, setQuery] = useState("");

  function toggle(id: string) {
    setOpen((o) => ({ ...o, [id]: !o[id] }));
  }

  const filteredTree = useMemo(() => {
    if (!query.trim()) return KNOWLEDGE_TREE;
    const needle = query.trim().toLowerCase();
    return KNOWLEDGE_TREE
      .map((branch) => {
        if (!branch.children) {
          return branch.name.toLowerCase().includes(needle) ? branch : null;
        }
        const branchMatches = branch.name.toLowerCase().includes(needle);
        const matchingChildren = branch.children.filter((c) =>
          c.name.toLowerCase().includes(needle),
        );
        if (branchMatches || matchingChildren.length > 0) {
          return { ...branch, children: branchMatches ? branch.children : matchingChildren };
        }
        return null;
      })
      .filter((b): b is KnowledgeNode => b !== null);
  }, [query]);

  const selectedNode = findNode(KNOWLEDGE_TREE, selected);
  const doc = KNOWLEDGE_DOCS[selected];

  return (
    <div className="px-8 py-8 max-w-[1600px] mx-auto">
      <PageHeader
        eyebrow="Knowledge"
        title="Regulatory library used by the AI"
        subtitle="Transparency: see exactly what regulatory content Conformly has access to and how often each source has been used. Click any document to view its content — every leaf is distinct, indexed at section level, and citation-linked."
      />

      <div className="grid grid-cols-12 gap-4">
        {/* Tree (left) */}
        <aside className="col-span-12 md:col-span-4 lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sources</CardTitle>
                <Badge tone="outline">
                  {Object.keys(KNOWLEDGE_DOCS).length} docs
                </Badge>
              </div>
            </CardHeader>
            <CardBody>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search…"
                  className="w-full h-9 pl-9 pr-3 rounded-md bg-surface-subtle border border-ink-200 text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-accent focus:bg-white"
                />
              </div>
              {filteredTree.length === 0 ? (
                <p className="text-[12px] text-ink-500 text-center py-4">No matching sources.</p>
              ) : (
                <ul className="space-y-0.5">
                  {filteredTree.map((node) => (
                    <TreeBranch
                      key={node.id}
                      node={node}
                      open={!!open[node.id] || !!query}
                      onToggle={() => toggle(node.id)}
                      selected={selected}
                      onSelect={setSelected}
                    />
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </aside>

        {/* Document detail (right) */}
        <section className="col-span-12 md:col-span-8 lg:col-span-9">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] tracking-[0.22em] uppercase text-ink-500 mb-1">
                    {doc?.issuer ?? "Source document"}
                  </p>
                  <CardTitle>
                    {doc?.title ?? selectedNode?.name ?? "Select a document"}
                  </CardTitle>
                </div>
                {doc && (
                  <div className="flex items-center gap-2 shrink-0">
                    <DocTypeBadge type={doc.doc_type} />
                    <Badge tone="sky">used {selectedNode?.used ?? doc.citations_from}×</Badge>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardBody>
              {doc ? <DocBody doc={doc} /> : <NoSelection />}
            </CardBody>
          </Card>
        </section>
      </div>
    </div>
  );
}

// ===========================================================================
// Tree branch
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
  if (node.children && node.children.length > 0) {
    return (
      <li>
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-ink-700 hover:bg-surface-subtle"
        >
          {open ? <ChevronDown className="h-3.5 w-3.5 text-ink-400" /> : <ChevronRight className="h-3.5 w-3.5 text-ink-400" />}
          <Library className="h-3.5 w-3.5 text-ink-400 shrink-0" />
          <span className="flex-1 text-left font-medium truncate">{node.name}</span>
          <span className="text-[10px] font-mono text-ink-500">{node.children.length}</span>
        </button>
        {open && (
          <ul className="pl-6 space-y-0.5">
            {node.children.map((c) => (
              <TreeLeaf key={c.id} node={c} selected={selected === c.id} onSelect={onSelect} />
            ))}
          </ul>
        )}
      </li>
    );
  }
  return <TreeLeaf node={node} selected={selected === node.id} onSelect={onSelect} />;
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
          selected
            ? "bg-accent/10 border border-accent/30 text-ink-900"
            : "text-ink-700 hover:bg-surface-subtle border border-transparent",
        )}
      >
        <FileText className="h-3 w-3 text-ink-400 shrink-0" />
        <span className="flex-1 text-left truncate">{node.name}</span>
        {node.used != null && <span className="text-[10px] font-mono text-ink-500">{node.used}×</span>}
      </button>
    </li>
  );
}

// ===========================================================================
// Document body
// ===========================================================================

function DocBody({ doc }: { doc: KnowledgeDoc }) {
  return (
    <div className="space-y-5">
      {/* Metadata strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-ink-200 rounded-lg overflow-hidden border border-ink-200">
        <MetaCell label="Language" value={doc.language} />
        <MetaCell label="Status" value={doc.status} />
        <MetaCell label="Last updated" value={doc.last_updated} mono />
        <MetaCell label="Citations from" value={String(doc.citations_from) + "×"} mono accent />
      </div>

      {/* Body */}
      <SectionLabel>Excerpt · indexed at section level</SectionLabel>
      <article className="rounded-md border border-ink-200 bg-surface-subtle p-5 text-[13px] leading-relaxed text-ink-700 font-mono whitespace-pre-line max-h-[640px] overflow-y-auto">
        {doc.body}
      </article>

      <div className="grid sm:grid-cols-3 gap-3">
        <div className="card p-4">
          <p className="text-[10px] tracking-[0.18em] uppercase text-ink-500 mb-1">Indexed sections</p>
          <p className="text-2xl font-semibold text-ink-900 font-display">{doc.indexed_sections}</p>
        </div>
        <div className="card p-4">
          <p className="text-[10px] tracking-[0.18em] uppercase text-ink-500 mb-1">Citations from this doc</p>
          <p className="text-2xl font-semibold text-ink-900 font-display">{doc.citations_from}</p>
        </div>
        <div className="card p-4">
          <p className="text-[10px] tracking-[0.18em] uppercase text-ink-500 mb-1">Document type</p>
          <p className="text-[16px] font-medium text-ink-900 mt-1.5 capitalize">{doc.doc_type.replace("-", " ")}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            toast({
              title: `${doc.citations_from} analyses cite this document`,
              body: "Opens the citation index in /analysis.",
              tone: "info",
            })
          }
        >
          View analyses that cite this
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            toast({
              title: "Annotation mode",
              body: "Highlight any passage to add a note.",
              tone: "info",
            })
          }
        >
          Annotate
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            toast({
              title: "Opening raw markdown",
              body: `vault/raw/regulations/${doc.title.split(" ")[0]}.md`,
              tone: "info",
            })
          }
        >
          Open raw markdown
        </Button>
      </div>
    </div>
  );
}

function MetaCell({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: boolean }) {
  return (
    <div className="bg-white p-4">
      <p className="text-[10px] tracking-[0.18em] uppercase text-ink-500 mb-1">{label}</p>
      <p className={clsx(
        "text-[13.5px] leading-snug",
        mono && "font-mono",
        accent ? "text-accent font-semibold" : "text-ink-900",
      )}>
        {value}
      </p>
    </div>
  );
}

function DocTypeBadge({ type }: { type: KnowledgeDoc["doc_type"] }) {
  const map = {
    regulation:     { tone: "red" as const,    label: "Regulation" },
    guidance:       { tone: "amber" as const,  label: "Guidance" },
    standard:       { tone: "green" as const,  label: "Standard" },
    "position-paper": { tone: "sky" as const,  label: "Position paper" },
    procedure:      { tone: "neutral" as const, label: "Procedure" },
  };
  const m = map[type];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

function NoSelection() {
  return (
    <p className="text-ink-500 text-[13px] text-center py-12">
      Pick a regulation from the left to view its content.
    </p>
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
