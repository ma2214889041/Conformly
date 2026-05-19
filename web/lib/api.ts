/**
 * Tiny typed client for the Conformly FastAPI sidecar.
 *
 * Endpoints map 1:1 to the Python tools. Same JSON shapes flow through
 * — we just wrap fetch() with reasonable timeouts and error normalisation.
 *
 * All paths are relative (/api/...) so the dev rewrite in next.config.mjs
 * and the production nginx vhost both work without per-environment URLs.
 */

export type ApiOk<T>   = { success: true;  data: T;     count?: number; errors?: unknown[] };
export type ApiErr     = { success: false; error: string;                [k: string]: unknown };
export type ApiResult<T> = ApiOk<T> | ApiErr;

async function post<T>(path: string, body: unknown, timeoutMs = 120_000): Promise<ApiResult<T>> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body ?? {}),
      signal: ctrl.signal,
    });
    if (!r.ok) {
      // Tools that return 500 still emit the canonical {success:false, error}
      // shape via the FastAPI exception handler — try to parse before giving up.
      try {
        return await r.json() as ApiResult<T>;
      } catch {
        return { success: false, error: `${r.status} ${r.statusText}` };
      }
    }
    return await r.json() as ApiResult<T>;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { success: false, error: `network: ${msg}` };
  } finally {
    clearTimeout(timer);
  }
}

async function get<T>(path: string, timeoutMs = 5000): Promise<ApiResult<T>> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(path, { signal: ctrl.signal });
    if (!r.ok) {
      try { return await r.json() as ApiResult<T>; }
      catch { return { success: false, error: `${r.status} ${r.statusText}` }; }
    }
    return await r.json() as ApiResult<T>;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { success: false, error: `network: ${msg}` };
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Health (used by the "Live API" indicator in the header)
// ---------------------------------------------------------------------------

export type HealthResponse = {
  ok: boolean;
  version: string;
  vault: string;
  vault_exists: boolean;
  tools: string[];
  hermes_home: string;
};

export async function getHealth(): Promise<HealthResponse | null> {
  const r = await get<HealthResponse>("/api/health", 1500);
  if (!r) return null;
  // /api/health returns the bare object (no wrapper) — handle both shapes.
  if ((r as any).ok === true) return r as unknown as HealthResponse;
  return null;
}

// ---------------------------------------------------------------------------
// Tool wrappers — typed where it makes the front-end clearer
// ---------------------------------------------------------------------------

export type ListClientsArgs = {
  status?: "all" | "active" | "archived";
  sort_by?: "client_id" | "day_in_journey" | "risk" | "phase" | "next_due";
  ivdr_class?: "A" | "B" | "C" | "D";
};

export type ListClientsRow = {
  client_id: string;
  codename: string;
  country?: string;
  ivdr_class: string;
  product_type?: string;
  nb?: string;
  current_phase: string;
  green_lights_passed: string[];
  day_in_journey: number | null;
  days_since_contact: number | null;
  risk_level: "high" | "medium" | "low" | "none";
  risk_count: number;
  next_action_text?: string | null;
  next_action_due?: string | null;
  status?: string;
};

export const callListClients = (args: ListClientsArgs = {}) =>
  post<ListClientsRow[]>("/api/tools/list_clients", args, 10_000);

export const callGetClientStatus = (client_id: string, include_risk_history = false) =>
  post<Record<string, unknown>>("/api/tools/get_client_status", { client_id, include_risk_history }, 10_000);

export const callSearchRegulation = (query?: string, doc_type?: string) =>
  post<unknown[]>("/api/tools/search_regulation", { query, doc_type }, 10_000);

export const callParseNbLetter = (args: { letter_path?: string; letter_text?: string; client_id?: string }) =>
  post<Record<string, unknown>>("/api/tools/parse_nb_letter", args, 120_000);

export const callGsprGap = (args: { client_id: string; focus_clauses?: string[] }) =>
  post<Record<string, unknown>>("/api/tools/gspr_gap_analyzer", args, 180_000);

// ---------------------------------------------------------------------------
// SSE — live scenario streaming
// ---------------------------------------------------------------------------

export type StreamEvent =
  | { kind: "user"; text: string }
  | { kind: "thought"; text: string }
  | { kind: "tool_call"; tool: string; args: Record<string, unknown> }
  | { kind: "tool_result"; tool: string; data: unknown; durationMs?: number }
  | { kind: "assistant"; text: string }
  | { kind: "hitl"; prompt: string; decision: "pending" | "approve" | "reject" };

/**
 * Subscribe to a live scenario stream. Returns a function that cancels the stream.
 *
 * The server emits `step` events for each timeline item and a `done` event when
 * the scenario completes. Errors come through as either an EventSource `error`
 * (which we surface via onError) or a tool_result with success:false (which
 * the UI renders as a failed step).
 */
export function streamScenario(
  scenarioId: string,
  onStep: (e: StreamEvent) => void,
  opts: { onDone?: () => void; onError?: (e: Event) => void } = {}
): () => void {
  const src = new EventSource(`/api/agent/run/${scenarioId}`);
  src.addEventListener("step", (ev) => {
    try {
      onStep(JSON.parse((ev as MessageEvent).data) as StreamEvent);
    } catch (e) {
      console.error("malformed step event", e);
    }
  });
  src.addEventListener("done", () => { opts.onDone?.(); src.close(); });
  src.onerror = (e) => { opts.onError?.(e); src.close(); };
  return () => src.close();
}
