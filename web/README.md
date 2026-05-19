# Conformly · Web

Next.js 14 (App Router · TypeScript · Tailwind) front-end for Conformly.

## Pages

| Route | What it does |
|-------|--------------|
| `/` | Landing page — value proposition, architecture rail, CTA into the demo |
| `/demo` | Interactive scenario player — 3 scripted but realistic agent conversations with pre-recorded tool outputs |
| `/dashboard` | Portfolio view — every client in `vault/clients/*.md` rendered as a card, sorted by risk |
| `/clients/[id]` | Single-client deep view — risks, next actions, vault source |

## Running locally

```bash
cd web
npm install
npm run dev
# open http://localhost:3000
```

The dashboard and client pages read `../vault/clients/*.md` at build time
via [`lib/vault.ts`](./lib/vault.ts). Override the location with
`CONFORMLY_VAULT=/abs/path/to/vault npm run dev` if your layout differs.

## Production build

```bash
npm run build
npm start             # serves on :3000 — proxy via nginx in deploy/install.sh
```

## Demo scenarios

Scenarios live in [`lib/demos.ts`](./lib/demos.ts). Each is a timeline of
events the player renders one at a time:

- `user` / `assistant` chat bubbles
- `thought` (faded, agent's internal monologue)
- `tool_call` + `tool_result` blocks — the JSON payloads are **the literal
  shape the production Python tools return**, so the demo stays faithful
  to what `pytest` covers
- `hitl` blocks — Slack-style approval gates

Press Play, watch the conversation unfold, click Approve on the HITL gate.
Replays from scratch any time.

## Why pre-recorded?

The landing page is publicly accessible and the demo would otherwise be
- a live LLM endpoint we'd have to authenticate
- a private API key that could leak
- a stage-failure risk if the LLM provider hiccups during a hackathon demo

Pre-recording the timeline keeps the demo reliable, free, and safe to
share. The same JSON shapes flow through the production agent — just
deferred.

## Stack

- **Next.js 14** App Router
- **TypeScript** strict
- **Tailwind CSS** with a small custom palette in `tailwind.config.ts`
- **lucide-react** icons
- **gray-matter** for YAML frontmatter

No Redux, no Material UI, no Sass — all kept out by design.
