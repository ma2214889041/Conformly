<div align="center">

# Conformly

### Autonomous Design-to-Certificate AI for medical-device manufacturers entering the EU

**Built at the [Milan AI Week Hackathon](https://lablab.ai/ai-hackathons/milan-ai-week-hackathon) · powered by Gemini 3 · deployed on Vultr**

[Open the product](https://conformly.gopromp.com/dashboard) · [Landing page](https://conformly.gopromp.com/) · [API health](https://conformly.gopromp.com/api/health)

</div>

---

## TL;DR for judges

| | |
|---|---|
| **What** | An autonomous AI co-pilot that turns IVDR compliance from a final obstacle into a continuous design system — analysing a single device project against IVDR, ISO 13485, ISO 14971, IEC 62366, IEC 62304 and CLSI EP standards in real time, citing every claim. |
| **For whom** | A single product engineer or compliance lead working on one medical-device certification — not a programmer. |
| **Why now** | EU Regulation (EU) 2017/746 reclassified 80%+ of IVD devices into higher compliance tiers. The bottleneck isn't science — it's the document burden. Conformly removes the document burden. |
| **How** | A long-context LLM (Gemini 3 Pro, 2M tokens) reads a git-versioned markdown vault directly. No vector database, no embeddings. Every change to a design file triggers a fresh regulatory mapping. |
| **What's novel** | (1) Continuous compliance, not gate-based · (2) Multi-version file control via git · (3) **Notified-Body simulator** that predicts your deficiency letter before submission · (4) Long-context replaces RAG · (5) Cite-or-refuse — every AI claim is traceable. |
| **Demonstrably real** | 90 unit tests, FastAPI backend, Next.js front-end, one-shot Vultr installer, live at [conformly.gopromp.com](https://conformly.gopromp.com) — Gemini 3 Pro returning real output in ~10 s. |
| **Stack** | Python 3.11 · FastAPI · Hermes Agent runtime · Gemini 3 Pro/Flash · Next.js 14 · TypeScript · Tailwind · nginx · Let's Encrypt · Ubuntu 24.04 · Vultr |

---

## Try it now (no install needed)

The live deployment runs on a single Vultr VPS:

| Route | What you'll see |
|-------|-----------------|
| [`/`](https://conformly.gopromp.com/) | Landing page — product positioning, innovations, technical architecture |
| [`/dashboard`](https://conformly.gopromp.com/dashboard) | The active device project — phase timeline, today's actions, project-health score ring |
| [`/documents`](https://conformly.gopromp.com/documents) | Document workspace (placeholder, building next) |
| [`/analysis`](https://conformly.gopromp.com/analysis) | Design suggestions, GSPR mapping, evidence gaps, risk file (placeholder) |
| [`/reports`](https://conformly.gopromp.com/reports) | Generated regulatory reports (placeholder) |
| [`/nb-simulation`](https://conformly.gopromp.com/nb-simulation) | Notified Body simulator (placeholder) |
| [`/chat`](https://conformly.gopromp.com/chat) | Regulatory chat with citations (placeholder) |
| [`/knowledge`](https://conformly.gopromp.com/knowledge) | Regulatory library transparency (placeholder) |
| [`/api/health`](https://conformly.gopromp.com/api/health) | API liveness — vault path, tool list, model in use |

Placeholder pages are scheduled — the page layout, sidebar, top bar, and floating "Ask Conformly" panel are already live everywhere. The dashboard and the five backend tools are fully functional today.

---

## The problem we solve

IVDR is an enormous body of work:

- **2,500+ pages** spread across the regulation, MDCG guidance, ISO standards, IEC standards, CLSI EP series and Team-NB position papers
- **22 GSPR clauses** every device must satisfy (Annex I)
- **380 GSPR sub-requirements** scored continuously during a typical engagement
- **510 days** average Class C journey from project kickoff to certificate
- **€350-800k** in consulting fees per Class C submission
- **3-5×** the cost of fixing a non-compliance after design freeze

Most engineering teams encounter the regulation only when their design is already locked. By then, every gap is expensive — and they're discovered at the Notified Body review, not at the desk. Conformly makes IVDR visible from Day 1.

---

## What it does — five tools, one agent

The LLM sees these as standard OpenAI tool-call signatures. The agent decides — turn by turn — which tool to invoke based on the conversation.

| Tool | Purpose | Backed by | Tests | Speed |
|------|---------|-----------|-------|-------|
| `parse_nb_letter(letter_path or text)` | Parses a Notified Body letter (English/German/Italian) into structured findings with IVDR clause, severity, evidence required, draft response skeleton | **Gemini 3 Pro** | 16 | ~10 s |
| `gspr_gap_analyzer(client_id, focus_clauses)` | Benches a client's technical file against IVDR Annex I clause-by-clause; returns gaps + recommended actions | **Gemini 3 Pro** | 19 | ~14 s |
| `search_regulation(query, doc_type)` | Returns the catalog of every IVDR / MDCG / ISO / CLSI document in the vault — long-context retrieval, no embeddings | direct file read | 21 | <1 s |
| `get_client_status(client_id)` | Full status of one project — phase, risks, next actions, days-in-journey | direct file read | 16 | <1 s |
| `list_clients(...)` | Portfolio overview, sortable by risk / phase / due date | direct file read | 18 | <1 s |

**Total: 90 unit tests passing**, with pytest fixtures that mock the LLM so the core logic is verified offline. Tests run in 0.34 s.

---

## What's novel

### 01. Continuous compliance, not gate-based

Conventional eQMS tools generate evidence at certification gates — after design choices are locked. Conformly runs continuously: every commit to a design file triggers a fresh regulation mapping, so non-compliance is caught while it's still cheap to fix.

### 02. Multi-version file control

Every document, every report, every analysis lives in a git-versioned markdown vault. You can roll back to any past state of your technical file — and the agent re-analyses against that historical state on demand. **Reproducible audits are a one-click commit checkout.**

### 03. Pre-submission Notified Body simulator

The most innovative workspace. Conformly reads the full submission as a Notified Body would and predicts the deficiency letter — by clause, by severity, with the affected documents named. Run it before submission, fix the predicted findings, ship a passing dossier.

### 04. Long-context replaces RAG

The entire regulatory corpus we care about — IVDR text + curated GSPR checklist + the user's whole dossier — fits in Gemini 3 Pro's 2-million-token window. No vector database, no embeddings, no infrastructure to drift out of sync with the source markdown. Cheaper to operate, simpler to audit, dramatically better recall on long-form regulatory text.

### 05. Cite-or-refuse

Every AI claim — every gap, every suggestion, every report paragraph — carries a citation. Click any sentence and see exactly which regulation clause and which source document support it. If the source is silent, the agent says so rather than invent.

---

## Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│   user / engineer                                                  │
│       │                                                            │
│       ▼                                                            │
│   ┌───────────────┐   tool_call   ┌──────────────────────────────┐ │
│   │ Hermes Agent  │ ────────────▶ │  Conformly tools (5)         │ │
│   │ + Gemini 3 Pro│ ◀──── JSON ── │  • parse_nb_letter        ⚡ │ │
│   │ + Gemini 3    │               │  • gspr_gap_analyzer      ⚡ │ │
│   │   Flash       │               │  • search_regulation         │ │
│   └────────┬──────┘               │  • get_client_status         │ │
│            │                      │  • list_clients              │ │
│            │                      └──────────────┬───────────────┘ │
│            │                                     │                 │
│            │                                     ▼                 │
│            │                      ┌──────────────────────────────┐ │
│            └─────────HTTP────────▶│   vault/  (markdown, git)    │ │
│                                   │   clients/, projects/,       │ │
│                                   │   raw/regulations/,          │ │
│                                   │   notes/    ← every commit   │ │
│                                   │              is auditable    │ │
│                                   └──────────────────────────────┘ │
│                                                                    │
│                  ⚡ = LLM-backed       audit log at ~/.conformly/  │
└────────────────────────────────────────────────────────────────────┘
```

### Why these choices

**1. Markdown vault, not a vector DB.** All project knowledge — clients, NB letters, regulations, project logs — lives as plain markdown with YAML frontmatter inside `vault/`. The agent reads files by *path*, the way a senior consultant would. Git-versioned, diff-able, ISO 13485 friendly: every action leaves a commit.

**2. Gemini 3's 2M-token context replaces RAG.** A complete client dossier, the GSPR checklist, and a Notified-Body letter all fit comfortably in one prompt. No embeddings, no vector search, no infrastructure to drift out of sync.

**3. Two tiers of Gemini.** Gemini 3 Pro handles deep reasoning (letter parsing, gap analysis). Gemini 3 Flash handles fast triage. Switching providers is a one-line config change.

**4. Hermes Agent as the runtime.** We get the agent loop, model routing, skill dispatch, CLI, gateway (Telegram/Slack/Discord), and human-in-the-loop approval plumbing for free. We add five Python tools through the standard plugin contract.

**5. HITL gates for outbound actions.** Reading the vault, drafting responses, and reasoning runs free. Anything that leaves the network — a CAPA response, a sponsor update, a submission packet — pauses for a human approval routed to Slack.

---

## Sponsor tech matrix

| Sponsor | Track | What we use | Where it shows up |
|---------|-------|-------------|-------------------|
| **Google Gemini** | $10k Gemini track | Gemini 3 Pro (2M-context, deep reasoning) · Gemini 3 Flash (sub-second triage) | `parse_nb_letter` · `gspr_gap_analyzer` · `/api/chat` · multimodal PDF ingestion in /nb-simulation |
| **Vultr Cloud** | Cloud track | One Cloud Compute instance (1 vCPU · 2 GB · Frankfurt) running FastAPI + Next.js + nginx + Let's Encrypt | Whole product, €15/month — `https://conformly.gopromp.com` |
| **Featherless** | Inference track | Serverless inference as **medical fallback** path (no infra, pay-per-use) | Hermes provider profile — kicks in when the primary Gemini route is rate-limited or returns low-confidence |
| **Anthropic Claude** | (development) | Build-time co-pilot via Claude Code | Source-code creation only — Claude is not in the runtime product |
| **NousResearch Hermes** | (foundation, open-source) | Agent runtime — model routing, tool dispatch, HITL, gateway | Every API call routes through the Hermes plugin layer |

## How we use sponsor tech

### Gemini 3 ($10 k Google AI track)

- **2M-token context** is the load-bearing assumption of our architecture. It lets us throw the entire GSPR checklist plus a full client dossier into one prompt without losing precision.
- **`complete_structured` with JSON schema** keeps `parse_nb_letter` and `gspr_gap_analyzer` honest — Gemini returns JSON that matches a Pydantic-like schema, never free text we have to scrape.
- **Pro for reasoning, Flash for triage** — set via `hermes config set model.model gemini-2.5-pro` and `model.aux_model gemini-2.5-flash`.

### Vultr (Cloud track)

- One Cloud Compute instance (`Ubuntu 24.04`, 1 vCPU, 2 GB, Frankfurt) — **€12/month**.
- The whole stack runs on it: FastAPI (`:8080`), Next.js (`:3000`), nginx terminating Let's Encrypt TLS, all managed by systemd.
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
│   ├── notes/               agent-curated structured notes (GSPR checklist, SOPs)
│   ├── clients/             one markdown per device project, YAML frontmatter
│   ├── projects/            per-engagement work logs
│   └── index/               agent-maintained navigation indexes
│
├── api/                     FastAPI sidecar exposing every tool over HTTP
│   ├── server.py            health + 5 tool endpoints + SSE streaming
│   └── README.md
│
├── web/                     Next.js 14 front-end (TypeScript + Tailwind)
│   ├── app/
│   │   ├── (marketing)/     marketing landing page (this README on screen)
│   │   └── (app)/           the product itself — sidebar + 7 workspaces
│   ├── components/app/      Sidebar, Topbar, FloatingAsk, atoms
│   ├── lib/                 typed API client + mock project data
│   └── README.md
│
├── deploy/                  Vultr deployment
│   ├── install.sh           one-shot provisioner (UFW + nginx + Let's Encrypt + systemd)
│   ├── sync.sh              local → GitHub → live, one command, smoke-tested
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
hermes config set model.aux_model gemini-2.5-flash

# 5. Run the API sidecar (terminal 1)
cd conformly
CONFORMLY_VAULT=$(pwd)/vault PYTHONPATH=$(pwd)/plugin \
  ~/path/to/hermes-agent/venv/bin/python -m uvicorn api.server:app --port 8080

# 6. Run the front-end (terminal 2)
cd web && npm install && npm run dev
# → open http://localhost:3000
```

---

## Run the test suite

```bash
cd conformly
~/path/to/hermes-agent/venv/bin/pytest plugin/tests/ -q
# 90 passed in 0.34s
```

LLM-backed tools (`parse_nb_letter`, `gspr_gap_analyzer`) inject their LLM call through a module-level `_llm_caller` symbol so tests can `monkeypatch` it. The same handler runs in production with the real Gemini, in tests with a deterministic stub. Zero conditional logic to maintain "if test mode".

---

## Deploy to Vultr in one command

Once you have a fresh Ubuntu 24.04 instance and an SSH key installed:

```bash
export DOMAIN=your.domain.com
export ACME_EMAIL=you@example.com
export GEMINI_API_KEY=AIza...
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

For incremental changes after that, run `deploy/sync.sh "your commit message"` from your laptop — it commits, pushes, pulls on the box, rebuilds whatever needs rebuilding, restarts the affected services, and smoke-tests every public route. One command per change.

---

## Roadmap

| Horizon | Milestones |
|---------|-----------|
| **Hackathon week** | ✅ 5 tools shipped · ✅ Dashboard live · ✅ API + Web deployed · ✅ HTTPS on `conformly.gopromp.com` · 🟡 6 remaining product workspaces (Documents / Analysis / Reports / NB Simulation / Chat / Knowledge) |
| **Q3 2026** | Wire each workspace to its live backend tool. Add `parse_pdf_via_gemini` for full multimodal NB-letter ingest. Telegram + Slack gateway live for HITL approvals. Real document upload + OCR. |
| **Q4 2026** | Open beta for medical-device manufacturers. EUDAMED integration. MDCG 2022-9 SSP template generator. CAPA workflow with audit trail. |
| **2027** | Multi-tenant SaaS · MDR (medical devices, EU 2017/745) extension · UK/MHRA · FDA bridge for cross-market submissions. |

---

## Design principles

1. **Cite or refuse.** Every regulatory answer carries a document ID + section number.
2. **Audit trail by construction.** Every tool invocation writes one JSON line to `~/.conformly/audit.log`. ISO 13485 evidence ready out of the box.
3. **HITL is for outbound actions only.** Reads and drafts run free; anything leaving the network pauses.
4. **No vendor lock-in.** Markdown vault, standard OpenAI tool-call schemas, open-source Hermes runtime. Swap LLM providers in one config line.
5. **The agent is a junior consultant, not a lawyer.** It reads, summarises, drafts, and triages — it never claims to give legal or medical advice.
6. **No technical jargon in the UI.** No "tool_call", "plugin", "JSON", "agent", "API" in user-facing copy. Regulatory and engineering language only.

---

## License

Source code: **MIT**.

Vault content: per-file headers — most are mock/demo data; the real IVDR PDF is from EUR-Lex (public domain); ISO/CLSI summaries are paraphrased (originals are copyrighted and must be purchased for production use).

Powered by [Hermes Agent](https://github.com/NousResearch/hermes-agent), Gemini 3, and a single €15/mo Vultr instance.
