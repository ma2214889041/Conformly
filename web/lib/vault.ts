/**
 * Build-time loader for the Conformly Vault.
 *
 * Mirrors the Python plugin's parse_client_dossier() — only the subset of
 * fields the dashboard needs is projected. We deliberately keep this as
 * one file so Server Components can `import { ... } from "@/lib/vault"`
 * with no per-page wiring.
 *
 * Resolution: $CONFORMLY_VAULT > ../vault (when running from web/).
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ClientSummary = {
  client_id: string;
  codename: string | null;
  country: string | null;
  ivdr_class: string | null;
  product_type: string | null;
  indication: string | null;
  nb: string | null;
  current_phase: string | null;
  green_lights_passed: string[];
  opened: string | null;
  last_contact: string | null;
  day_in_journey: number | null;
  days_since_contact: number | null;
  risk_flags: string[];
  risks: { id: string; issue: string; severity: string; mitigation: string }[];
  risk_level: "high" | "medium" | "low" | "none";
  next_actions: { done: boolean; due: string | null; text: string }[];
  next_action: { done: boolean; due: string | null; text: string } | null;
  status: string | null;
  file_path: string;
  /** Raw body — server-only; pages can render selected sections from it. */
  body: string;
};

export function vaultRoot(): string {
  const env = process.env.CONFORMLY_VAULT;
  if (env) return path.resolve(env);
  // Default: monorepo sibling of web/
  return path.resolve(process.cwd(), "..", "vault");
}

export function clientsDir(): string {
  return path.join(vaultRoot(), "clients");
}

/** List filenames (no .md extension) — useful for generateStaticParams. */
export function listClientIds(): string[] {
  const dir = clientsDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function loadClient(slug: string): ClientSummary | null {
  const file = path.join(clientsDir(), `${slug.toLowerCase()}.md`);
  if (!fs.existsSync(file)) return null;
  const text = fs.readFileSync(file, "utf-8");
  const parsed = matter(text);
  const fm = parsed.data as Record<string, unknown>;

  const risks = parseRiskTable(parsed.content);
  const next_actions = parseChecklist(parsed.content);
  const next_action = pickNextAction(next_actions);

  return {
    client_id: (fm.client_id as string) ?? slug.toUpperCase(),
    codename: (fm.codename as string) ?? null,
    country: (fm.country as string) ?? null,
    ivdr_class: (fm.ivd_class as string) ?? null,
    product_type: (fm.product_type as string) ?? null,
    indication: (fm.indication as string) ?? null,
    nb: (fm.nb as string) ?? null,
    current_phase: (fm.current_phase as string) ?? null,
    green_lights_passed: arr(fm.green_lights_passed),
    opened: dateString(fm.opened),
    last_contact: dateString(fm.last_contact),
    day_in_journey: daysBetween(fm.opened),
    days_since_contact: daysBetween(fm.last_contact),
    risk_flags: arr(fm.risk_flags),
    risks,
    risk_level: deriveRiskLevel(risks),
    next_actions,
    next_action,
    status: (fm.status as string) ?? null,
    file_path: file,
    body: parsed.content,
  };
}

export function listClients(): ClientSummary[] {
  return listClientIds()
    .map(loadClient)
    .filter((c): c is ClientSummary => c !== null)
    .sort((a, b) => (a.client_id ?? "").localeCompare(b.client_id ?? ""));
}

// ----------------------------------------------------------------------------
// Helpers — small enough to keep inline, big enough to want tests if this grows
// ----------------------------------------------------------------------------

function arr(v: unknown): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v.map(String) : [String(v)];
}

function dateString(v: unknown): string | null {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  const s = String(v).trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : s.slice(0, 10);
}

function daysBetween(v: unknown): number | null {
  const s = dateString(v);
  if (!s) return null;
  const then = new Date(s + "T00:00:00Z");
  const now = new Date();
  return Math.floor((+now - +then) / 86_400_000);
}

function parseRiskTable(body: string) {
  // Find a markdown table under a heading containing "已识别风险" / "Risks" / "Rischi"
  const m = body.match(/##[^\n]*(?:已识别风险|Risks|Rischi)[\s\S]*?(\n\|[\s\S]*?)(?=\n##|\n*$)/);
  if (!m) return [];
  const lines = m[1].split("\n").filter((l) => l.trim().startsWith("|"));
  if (lines.length < 2) return [];
  const headers = lines[0].slice(1, -1).split("|").map((h) => h.trim());
  return lines
    .slice(2)
    .map((row) => {
      const cells = row.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h] = cells[i] ?? ""; });
      const sev = obj["严重度"] ?? obj["Severity"] ?? "";
      const mit = obj["当前应对"] ?? obj["Mitigation"] ?? "";
      // Filter resolved rows (mitigation starts with "[resolved]") to match the Python tool.
      if (mit.toLowerCase().startsWith("[resolved]")) return null;
      return {
        id: obj["#"] ?? obj["ID"] ?? "",
        issue: obj["风险"] ?? obj["Issue"] ?? "",
        severity: sev,
        mitigation: mit,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);
}

function parseChecklist(body: string) {
  const m = body.match(/##[^\n]*(?:下一步动作|Next actions|Prossime azioni)[\s\S]*?\n([\s\S]*?)(?=\n##|\n*$)/);
  if (!m) return [];
  return [...m[1].matchAll(/^\s*-\s*\[(?<mark>[ xX])\]\s*(?<text>.+?)\s*$/gm)].map((mm) => {
    const text = (mm.groups!.text || "").trim();
    const dateMatch = text.match(/^(\d{4}-\d{2}-\d{2})\s*[—\-:]\s*(.+)$/);
    return {
      done: mm.groups!.mark.toLowerCase() === "x",
      due: dateMatch ? dateMatch[1] : null,
      text: dateMatch ? dateMatch[2] : text,
    };
  });
}

function pickNextAction(actions: ReturnType<typeof parseChecklist>) {
  const open = actions.filter((a) => !a.done);
  if (open.length === 0) return null;
  const withDue = open.filter((a) => a.due);
  if (withDue.length) {
    return withDue.sort((a, b) => (a.due! < b.due! ? -1 : 1))[0];
  }
  return open[0];
}

function deriveRiskLevel(risks: ReturnType<typeof parseRiskTable>): ClientSummary["risk_level"] {
  if (risks.length === 0) return "none";
  const sevs = risks.map((r) => r.severity.toLowerCase());
  if (sevs.some((s) => s === "高" || s === "high" || s === "major" || s === "critical")) return "high";
  if (sevs.some((s) => s === "中" || s === "medium" || s === "moderate")) return "medium";
  return "low";
}
