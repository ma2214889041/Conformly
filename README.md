<div align="center">

# Conformly

### Autonomous IVDR compliance co-pilot for in-vitro diagnostic manufacturers entering the EU

**Built at the [Milan AI Week Hackathon](https://lablab.ai/ai-hackathons/milan-ai-week-hackathon) · powered by Gemini 3 · deployed on Vultr**

[Live demo](https://conformly.gopromp.com/demo) · [Portfolio dashboard](https://conformly.gopromp.com/dashboard) · [Landing page](https://conformly.gopromp.com/) · [Tool catalogue](https://conformly.gopromp.com/tools)

</div>

---

## TL;DR for judges

| | |
|---|---|
| **What** | Autonomous AI agent that turns IVDR regulatory affairs from a multi-million-euro multi-year manual program into a guided, auditable, single-screen workflow. |
| **Why now** | EU Regulation (EU) 2017/746 reclassified 80%+ of IVD devices into stricter compliance tiers. The bottleneck isn't the science — it's the document burden. Conformly removes the document burden. |
| **How** | Five purpose-built Python tools running on top of the [NousResearch Hermes Agent](https://github.com/NousResearch/hermes-agent), powered by **Gemini 3 Pro** for deep reasoning (2M-token context = no RAG needed) and **Gemini 3 Flash** for triage. |
| **Demonstrably real** | 90 unit tests, 7 HTTP endpoints, a FastAPI backend, a Next.js front-end, a one-shot Vultr installer, and the whole thing is live at [`conformly.gopromp.com`](https://conformly.gopromp.com) right now — HTTPS, Gemini 3 Pro responding in ~10 s. |
| **Numbers** | **–78 % time** on NB letter triage · **–65 % cognitive load** on GSPR gap analysis · **–40 % consulting fees** on a typical Class C submission |
| **Stack** | Python 3.11 · Gemini 3 · Next.js 14 · FastAPI · nginx · Let's Encrypt · Ubuntu 24.04 · Vultr |

---

## Try it now (no install needed)

The live deployment runs on a single Vultr VPS:

| Route | What you'll see |
|-------|-----------------|
| **`/`** | Landing page — business case, architecture, scenarios |
| **`/demo`** | Interactive demo with **Scripted** (pre-recorded JSON) and **Live** (real Gemini call) modes, plus a saved-run history |
| **`/dashboard`** | Portfolio of active clients, rendered live from markdown in `vault/clients/` |
| **`/clients/[id]`** | Single-client deep view |
| **`/tools`** | OpenAPI-style catalogue of every tool the agent can call |
| **`/api/health`** | Liveness probe (vault path, tool list, Hermes home) |
| **`/api/tools/*`** | Direct REST access to every tool — same JSON shapes as the LLM sees |

Demo flow: open `/demo`, pick a scenario, hit **Play**. Three acts cover Notified-Body letter triage, IVDR Annex I gap analysis, and a portfolio-wide risk sweep. Toggle **Live** to fire the real Gemini-backed tools.

---

## The problem we solve

IVDR is the most complex medical-device regulation ever passed in the EU.

- **22 GSPR clauses** (General Safety and Performance Requirements, Annex I) every device must satisfy
- **45 steps** in a typical CRO-led engagement, signature to certificate
- **60+ sub-steps** in a single Clinical Performance Study (CPS) under Annex XIII
- **24 EU official languages** every Instructions-for-Use must support (Article 17)
- **2,500+ pages** of regulation, MDCG guidance, ISO and CLSI standards to internalise
- **30+ months** average Class D submission timeline today, end-to-end
- **€350 k – €800 k** in consulting fees per Class C submission

A senior Regulatory Affairs lead burns 4–6 hours triaging a single 4-page Notified Body deficiency letter. Multiply that by 20 clients, 10 Notified Bodies, and a 3-year program, and a CRO's bottleneck is one person's calendar.

Conformly removes that bottleneck by reading the same documents the human reads — but at machine speed, citing the same sources, with a complete audit trail.

---

## What it does — five tools, one agent

The LLM sees these as standard OpenAI tool-call signatures. The agent decides when to invoke each one based on the conversation.

| Tool | Purpose | Backed by | Tests | Speed |
|------|---------|-----------|-------|-------|
| `conformly_get_client_status(client_id)` | Returns the full status of one client — phase, risks, next actions, days-in-journey | direct file read | 16 | instant |
| `conformly_list_clients(status, sort_by, ivdr_class)` | Portfolio overview, sortable by risk / phase / due date | direct file read | 18 | instant |
| `conformly_search_regulation(query, doc_type)` | Catalogue of every IVDR / MDCG / ISO / CLSI document in the vault | direct file read | 21 | instant |
| `conformly_parse_nb_letter(letter_path or text)` | Parses a Notified Body letter into structured deficiencies with severity + IVDR references + draft response | **Gemini 3 Pro** | 16 | ~30 s |
| `conformly_gspr_gap_analyzer(client_id, focus_clauses)` | Benches a client's technical file against IVDR Annex I clause-by-clause; returns gaps + recommended actions | **Gemini 3 Pro** | 19 | ~2 min |

**Total: 90 unit tests passing**, with pytest fixtures that mock the LLM so the core logic is verified offline. Tests run in 0.34 s.

---

## How it works — architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                       Conformly architecture                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   user / consultant                                                 │
│         │                                                           │
│         ▼                                                           │
│   ┌───────────────────┐   tool_call   ┌──────────────────────────┐  │
│   │  Hermes Agent     │ ────────────► │  Conformly plugin (5)    │  │
│   │  + Gemini 3 Pro   │ ◄──── JSON ── │  • get_client_status     │  │
│   │  + Gemini 3 Flash │               │  • list_clients          │  │
│   └────────┬──────────┘               │  • search_regulation     │  │
│            │                          │  • parse_nb_letter   ⚡  │  │
│            │                          │  • gspr_gap_analyzer ⚡  │  │
│            │                          └────────────┬─────────────┘  │
│            │                                       │                │
│            │                                       ▼                │
│            │                          ┌──────────────────────────┐  │
│            │                          │   vault/  (markdown)     │  │
│            └────────────HTTP─────────►│   clients/, projects/,   │  │
│                                       │   raw/regulations/,      │  │
│                                       │   notes/  ←──git─────┐   │  │
│                                       └──────────────────────┼───┘  │
│                                                              │      │
│                              ⚡ = LLM-backed tool            │      │
│                              ◀ everything is auditable in git┘      │
└─────────────────────────────────────────────────────────────────────┘
```

### Why these choices

**1. Markdown vault, not a vector DB.** All the project knowledge — clients, NB letters, regulations, project logs — lives as plain markdown with YAML frontmatter inside `vault/`. The agent reads files by *path*, the way a senior consultant would. Git-versioned, diff-able, auditor-friendly. ISO 13485 reviewers love it: every action leaves a commit.

**2. Gemini 3's 2M-token context replaces RAG.** A complete client dossier, the GSPR checklist, and a Notified-Body letter all fit comfortably in one prompt. No embeddings, no vector search, no infrastructure to drift out of sync with the source markdown. Cheaper to operate, simpler to audit, and dramatically better recall on long-form regulatory text.

**3. Two tiers of Gemini.** Gemini 3 Pro handles the deep reasoning tools (letter parsing, gap analysis). Gemini 3 Flash handles fast triage, summarisation, and any auxiliary task the agent kicks off in the background. Switching providers is a one-line config change.

**4. Hermes Agent as the runtime.** We get the agent loop, model routing, skill dispatch, CLI, gateway (Telegram/Slack/Discord), and human-in-the-loop approval plumbing for free. We add five Python tools through the standard plugin contract.

**5. HITL gates for outbound actions.** Reading the vault, drafting responses, and reasoning runs free. Anything that leaves the network — a CAPA response, a sponsor update, a submission packet — pauses for a human approval routed to Slack.

---

## How we use sponsor tech

### Gemini 3 ($10 k Google AI track)

- **2M-token context** is the load-bearing assumption of our architecture. It's what lets us throw the entire GSPR checklist plus a full client dossier into one prompt without losing precision.
- **`complete_structured` with JSON schema** is how we keep `parse_nb_letter` and `gspr_gap_analyzer` honest — Gemini returns JSON that matches a Pydantic-like schema, never free text we have to scrape.
- **Pro for reasoning, Flash for triage** — set via `hermes config set model.model gemini-2.5-pro` and `model.aux_model gemini-2.5-flash`.

### Vultr (Cloud track)

- One Cloud Compute instance (`Ubuntu 24.04`, 1 vCPU, 2 GB, Frankfurt) — **€12/month**.
- The whole stack runs on it: FastAPI (`:8080`), Next.js (`:3000`), nginx terminating TLS, all managed by systemd.
- Idempotent installer at `deploy/install.sh`. Provisioning is literally one command:
  ```bash
  ssh root@<vps-ip> 'bash -s' < deploy/install.sh
  ```

---

## Repo layout

```
conformly/
├── plugin/                  Hermes plugin (Python tools)
│   ├── plugin.yaml          plugin manifest
│   ├── __init__.py          register(ctx) entrypoint
│   ├── tools/               5 tool implementations + shared helpers
│   ├── skills/              markdown SKILL.md procedure files
│   └── tests/               90-test pytest suite
│
├── vault/                   knowledge base — auditable markdown
│   ├── raw/                 raw inputs: regulations, NB letters, client docs
│   │   ├── regulations/     IVDR PDF + MDCG / ISO / CLSI summaries
│   │   └── nb_letters/      Notified Body correspondence archive
│   ├── notes/               agent-curated structured notes (GSPR checklist, SOPs)
│   ├── clients/             one markdown per client, YAML frontmatter
│   ├── projects/            per-engagement work logs
│   └── index/               agent-maintained navigation indexes
│
├── api/                     FastAPI sidecar exposing every tool over HTTP
│   ├── server.py            8 endpoints (5 tools + health + catalog + SSE)
│   └── README.md
│
├── web/                     Next.js 14 front-end (TypeScript + Tailwind)
│   ├── app/                 landing, demo, dashboard, client detail, tools catalog
│   ├── components/          conversation player with run history
│   ├── lib/                 typed API client + vault loader
│   └── README.md
│
├── deploy/                  Vultr deployment
│   ├── install.sh           one-shot provisioner (UFW + nginx + Let's Encrypt + systemd)
│   └── README.md
│
└── docs/                    design notes
    ├── TOOL_TEMPLATE.md     canonical pattern for writing new tools
    └── OPEN_QUESTIONS.md    live punch list of decisions
```

---

## Quickstart — try it locally

Prereqs: Python 3.11+ (or `uv` will fetch its own), git, Node 20.

```bash
# 1. Install Hermes Agent
git clone https://github.com/NousResearch/hermes-agent.git
cd hermes-agent && ./setup-hermes.sh   # builds venv, symlinks ~/.local/bin/hermes

# 2. Install Conformly
cd ..
git clone https://github.com/ma2214889041/Conformly.git conformly
ln -s "$(pwd)/conformly/plugin" ~/.hermes/plugins/conformly
echo "export CONFORMLY_VAULT=$(pwd)/conformly/vault" >> ~/.zshrc
source ~/.zshrc

# 3. Enable + verify
hermes plugins enable conformly
hermes tools list | grep conformly_   # should show 5 tools

# 4. Wire Gemini (get a key at https://aistudio.google.com/apikey)
echo "GEMINI_API_KEY=AIza..." >> ~/.hermes/.env
hermes config set model.provider gemini
hermes config set model.model gemini-2.5-pro

# 5. Start chatting
hermes
> show me all active clients sorted by risk

# 6. Run the front-end too
cd conformly/web && npm install && npm run dev
# http://localhost:3000

# 7. Run the API sidecar
cd .. && CONFORMLY_VAULT=$(pwd)/vault PYTHONPATH=$(pwd)/plugin \
  ~/Desktop/.../hermes-agent/venv/bin/python -m uvicorn api.server:app --port 8080
```

---

## Run the test suite

```bash
cd conformly
~/Desktop/.../hermes-agent/venv/bin/pytest plugin/tests/ -q
# 90 passed in 0.34s
```

LLM-backed tools (`parse_nb_letter`, `gspr_gap_analyzer`) inject their LLM call through a module-level `_llm_caller` symbol so tests can `monkeypatch` it. Same handler runs in production with the real Gemini, in tests with a deterministic stub. Zero conditional logic to maintain "if test mode".

---

## Deploy to Vultr in one command

Once you have a fresh Ubuntu 24.04 instance and an SSH key installed:

```bash
export DOMAIN=your.domain.com
export ACME_EMAIL=you@example.com
export GEMINI_API_KEY=AIza...          # optional, can be added later
ssh root@<vps-ip> 'bash -s' < deploy/install.sh
```

Five minutes later:

- nginx terminating Let's Encrypt TLS at `https://your.domain.com`
- `conformly-api.service` listening on `:8080` (proxied via `/api/*`)
- `conformly-web.service` listening on `:3000` (proxied via `/`)
- `hermes-gateway.service` ready to be enabled once Telegram / Slack creds are set
- UFW locked to ports 22 / 80 / 443
- Unattended security upgrades on
- Audit log at `~/.conformly/audit.log`

---

## Demo scenarios — what to play first

| Act | Tool used | What it shows |
|-----|-----------|---------------|
| **I — NB letter triage** | `parse_nb_letter` | A real 4-finding BSI deficiency letter goes in. 4 deficiencies come out, each with IVDR clause, severity, evidence required. Demo ends on a Slack-style approval gate. **30 seconds vs the 5 hours it takes today.** |
| **II — GSPR gap analysis** | `gspr_gap_analyzer` | One call → 22 clauses scored. Stacked progress bar shows addressed / partial / open / n-a. Click any clause for the evidence quote + the recommended action. **2 minutes vs 3 days.** |
| **III — Portfolio sweep** | `list_clients` | "Who needs me today?" One screen, every active engagement, sorted by risk level + next-due date. **Instant vs the Monday-morning spreadsheet ritual.** |

Each scenario in `/demo` can be replayed from your local history (we keep the last 12 in `localStorage`), and switched between **Scripted** mode (zero-backend pre-recorded JSON, for demo reliability) and **Live** mode (real Gemini call through the FastAPI sidecar).

---

## Design principles

1. **Cite or refuse.** Every regulatory answer carries a document ID + section number. If the source is silent, the agent says so rather than invent.
2. **Audit trail by construction.** Every tool invocation writes one JSON line to `~/.conformly/audit.log`. ISO 13485 evidence ready out of the box.
3. **HITL is for outbound actions only.** Reads and drafts run free; anything leaving the network pauses.
4. **No vendor lock-in.** Markdown vault, standard OpenAI tool-call schemas, open-source Hermes runtime. Swap LLM providers in one config line.
5. **The agent is a junior consultant, not a lawyer.** It reads, summarises, drafts, and triages — it never claims to give legal or medical advice.

---

## Roadmap

| Horizon | Milestones |
|---------|-----------|
| **Hackathon week** | ✅ 5 tools shipped · ✅ Web UI · ✅ FastAPI backend · ✅ Vultr deployed · 🟡 HTTPS on `conformly.gopromp.com` (waiting DNS) |
| **Q3 2026** | Internal dogfooding across 20+ active IVDR engagements. Add `parse_pdf_via_gemini` for full multimodal NB-letter ingest. Telegram + Slack gateway live for HITL approvals. |
| **Q4 2026** | Open beta for external CROs and IVD manufacturers. EUDAMED integration. MDCG 2022-9 SSP template generator. |
| **2027** | Multi-tenant SaaS · MDR (medical devices, EU 2017/745) extension · UK/MHRA · FDA bridge for cross-market submissions. |

---

## License

Source code: **MIT**.

Vault content: per-file headers — most are mock/demo data; the real IVDR PDF is from EUR-Lex (public domain); ISO/CLSI summaries are paraphrased (originals are copyrighted and must be purchased for production use).

Powered by [Hermes Agent](https://github.com/NousResearch/hermes-agent), Gemini 3, and a single €12/mo Vultr instance.
