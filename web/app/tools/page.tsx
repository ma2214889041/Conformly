"use client";

import { useEffect, useState } from "react";
import { Loader2, Wrench } from "lucide-react";

type ToolSchema = {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, {
      type: string;
      description?: string;
      enum?: string[];
      default?: unknown;
      items?: unknown;
    }>;
    required?: string[];
  };
};

export default function ToolsPage() {
  const [tools, setTools] = useState<ToolSchema[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tools")
      .then((r) => r.json())
      .then((j) => setTools(j.tools as ToolSchema[]))
      .catch((e) => setErr(e.message));
  }, []);

  return (
    <div className="container-narrow py-12">
      <header className="mb-10">
        <p className="text-accent text-sm font-mono uppercase tracking-wider mb-2">
          live · pulled from the running API
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink-50">
          Tool surface
        </h1>
        <p className="mt-3 text-ink-400 max-w-2xl">
          Every tool the agent can call. Schemas are fetched from{" "}
          <code className="font-mono text-ink-200">/api/tools</code> on the
          FastAPI sidecar — what you see here is exactly what the LLM sees.
        </p>
      </header>

      {err && (
        <div className="card p-4 mb-6 border-rose-400/40">
          <p className="text-rose-300 text-sm">
            Couldn't reach the API: <span className="font-mono">{err}</span>.
            The API may not be running locally — start it with{" "}
            <code className="text-ink-100">make api</code> or check{" "}
            <code className="text-ink-100">api/README.md</code>.
          </p>
        </div>
      )}

      {!tools && !err && (
        <div className="card p-12 text-center">
          <Loader2 className="h-5 w-5 animate-spin text-ink-400 inline" />
          <p className="text-ink-400 mt-3 text-sm">querying /api/tools …</p>
        </div>
      )}

      <div className="space-y-4">
        {tools?.map((t) => <ToolBlock key={t.name} tool={t} />)}
      </div>
    </div>
  );
}

function ToolBlock({ tool }: { tool: ToolSchema }) {
  const props = Object.entries(tool.parameters.properties || {});
  const required = new Set(tool.parameters.required || []);
  return (
    <article className="card p-6">
      <header className="flex items-start gap-3 mb-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 border border-accent/30 text-accent shrink-0">
          <Wrench className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h2 className="font-mono text-ink-50">{tool.name}()</h2>
          <p className="text-sm text-ink-400 mt-1 leading-relaxed">{tool.description}</p>
        </div>
      </header>

      {props.length === 0 ? (
        <p className="text-ink-500 text-sm italic pl-11">no parameters</p>
      ) : (
        <div className="pl-11 space-y-3">
          {props.map(([name, schema]) => (
            <div key={name} className="rounded-lg border border-ink-800/60 bg-ink-950/40 p-3">
              <div className="flex flex-wrap items-baseline gap-2">
                <code className="font-mono text-sm text-ink-100">{name}</code>
                <span className="text-[10px] font-mono uppercase tracking-wider text-ink-500">{schema.type}</span>
                {required.has(name) ? (
                  <span className="badge-rose !text-[10px]">required</span>
                ) : (
                  <span className="badge-slate !text-[10px]">optional</span>
                )}
                {schema.enum && (
                  <span className="text-[11px] text-ink-400 font-mono">
                    one of: {schema.enum.map((v) => JSON.stringify(v)).join(" · ")}
                  </span>
                )}
                {schema.default !== undefined && (
                  <span className="text-[11px] text-ink-400 font-mono">
                    default: {JSON.stringify(schema.default)}
                  </span>
                )}
              </div>
              {schema.description && (
                <p className="text-[13px] text-ink-300 mt-1 leading-relaxed">{schema.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
