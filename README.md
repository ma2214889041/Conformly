# Conformly

> **IVDR/CRO regulatory co-pilot** for Chinese in-vitro diagnostic manufacturers entering the EU.
>
> Built on top of the **[NousResearch Hermes Agent](https://github.com/NousResearch/hermes-agent)** framework.

---

## What it does

Conformly turns a generic AI assistant into a domain-expert IVDR junior consultant who:

1. **Tracks** every client's position across a 45-step IVDR program with the 60-step CPS clinical-study workflow embedded inside it.
2. **Reads** the live regulation library (IVDR / MDCG / ISO / CLSI) and answers questions with article-level citations.
3. **Parses** incoming Notified Body deficiency letters (BSI, TÜV SÜD, DEKRA — in English, German, or Italian) and produces a structured response plan.
4. **Generates** GSPR gap analyses by comparing a client's technical documentation against IVDR Annex I.
5. **Logs** every action to an auditable JSON-Lines trail so the work survives an ISO 13485 review.

Architecture is the **LLM-Wiki** pattern popularised by Karpathy (April 2026): all knowledge lives as plain markdown inside `vault/`, and a long-context LLM (Gemini 2.5 Pro, 2M window) reads it directly. No vector DB, no embeddings, no RAG infrastructure.

---

## Repo layout

```
conformly/
├── plugin/          # Hermes plugin — Python tools the agent calls
│   ├── plugin.yaml          # manifest
│   ├── __init__.py          # register(ctx) entrypoint
│   ├── tools/               # tool implementations + shared helpers
│   ├── skills/              # markdown SKILL.md procedure files
│   └── tests/               # pytest suite (passes today)
│
├── vault/           # the knowledge base (Karpathy LLM-Wiki style)
│   ├── raw/                 # raw inputs: regulations, NB letters, client docs
│   ├── notes/               # agent-curated structured notes (procedures, regulations)
│   ├── clients/             # one markdown per client, with YAML frontmatter
│   ├── projects/            # per-engagement project logs
│   └── index/               # agent-maintained navigation indexes
│
├── web/             # Next.js front-end — placeholder (built on Day 4)
├── deploy/          # Vultr deployment scripts — placeholder
└── docs/            # design notes
    ├── TOOL_TEMPLATE.md     # canonical pattern for writing new tools
    └── OPEN_QUESTIONS.md    # live punch list of decisions
```

---

## Status (2026-05-19)

| Tool | Status |
|------|--------|
| `conformly_get_client_status(client_id)` | ✅ shipped — 16 unit tests pass |
| `conformly_list_clients()` | ⬜ next |
| `conformly_search_regulation(query)` | ⬜ |
| `conformly_gspr_gap_analyzer(client_id)` | ⬜ (demo hero #2) |
| `conformly_parse_nb_letter(pdf_path)` | ⬜ (demo hero #1) |

Web UI and Vultr deployment land on Day 4 of the hackathon — see `docs/OPEN_QUESTIONS.md`.

---

## Quickstart (local)

Prerequisites: Python 3.11, `uv`, git, ~200 MB free disk.

```bash
# 1. Install Hermes Agent
git clone https://github.com/NousResearch/hermes-agent.git
cd hermes-agent
./setup-hermes.sh                            # builds venv, installs deps, symlinks ~/.local/bin/hermes

# 2. Install Conformly
cd ..
git clone https://github.com/ma2214889041/Conformly.git conformly
ln -s "$(pwd)/conformly/plugin" ~/.hermes/plugins/conformly
echo "export CONFORMLY_VAULT=$(pwd)/conformly/vault" >> ~/.zshrc
source ~/.zshrc

# 3. Enable + verify
hermes plugins enable conformly
hermes plugins list | grep conformly         # → enabled
hermes tools list | grep conformly           # → conformly_get_client_status

# 4. Configure an LLM (we recommend Gemini 2.5 Pro direct for the 2M window)
hermes setup                                  # interactive wizard

# 5. Start chatting
hermes
> what's the status on client A?
```

---

## Demo (8-minute hackathon walkthrough)

| Time | Act | What evaluators see |
|------|-----|---------------------|
| 0:00–1:00 | Problem | Slides only — the IVDR-bottleneck pain |
| 1:30–3:00 | **Act I — NB letter triage** | A BSI deficiency PDF is dropped on the agent. In 30 seconds it returns a structured deficiency list with severity, IVDR references, and a draft response skeleton. CAPA submission step pauses for a HITL approval button pushed to Slack. |
| 3:00–5:30 | **Act II — GSPR gap analysis** | `conformly_gspr_gap_analyzer(CLIENT-A)` walks every clause of IVDR Annex I against the client's tech file. Shows the agent reasoning across thousands of pages of regulation in seconds. |
| 5:30–6:30 | **Act III — 20-client dashboard** | A static Next.js page renders all 20 clients live from `vault/clients/*.md` — phase, day-in-journey, risk level. The "scale this to a whole portfolio" shot. |
| 6:30–8:00 | Business model | Back to slides. |

---

## Design principles

1. **Knowledge lives in markdown, not a database.** Audit-friendly, git-versioned, model-agnostic.
2. **Long context > RAG** at this scale. Total regulation corpus fits in Gemini 2.5 Pro's 2M window.
3. **Tools are typed and tested.** Every tool returns JSON, never raises, and has a pytest suite.
4. **HITL is for outbound actions only.** Reading the vault and drafting responses runs free; sending to a Notified Body always pauses for approval.
5. **The agent is a junior consultant, not a lawyer.** It can read, summarise, draft and triage — it never claims to give legal or medical advice.

---

## Roadmap

- **Hackathon week:** ship 5 tools + Day-4 web UI + Vultr deploy at `conformly.promp.com`.
- **Q3 2026:** internal dogfooding across 20 active IVDR engagements.
- **Q4 2026:** open beta for external CROs and IVD manufacturers.
- **2027:** multi-tenant SaaS.

---

## License

Source code: MIT. Vault content: see individual file headers — most are mock/demo data, real IVDR PDF from EUR-Lex (public domain), ISO/CLSI summaries are paraphrased (originals are copyrighted).

Powered by [Hermes Agent](https://github.com/NousResearch/hermes-agent).
