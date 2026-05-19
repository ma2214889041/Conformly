<div align="center">

# Conformly

### Autonomous Design-to-Certificate AI for medical-device manufacturers entering the EU

**Built at the [Milan AI Week Hackathon](https://lablab.ai/ai-hackathons/milan-ai-week-hackathon) · powered by Gemini 3 · deployed on Vultr**

[🚀 Try the live product](https://conformly.gopromp.com/dashboard) · [📊 Open the pitch deck](https://conformly.gopromp.com/pitch) · [🌐 Landing page](https://conformly.gopromp.com) · [💾 GitHub](https://github.com/ma2214889041/Conformly)

</div>

---

## 1. Problem & Solution

### The problem

EU Regulation **(EU) 2017/746 (IVDR)** is the most complex medical-device regulation ever passed. Companies entering the EU market today face:

- **2,500+ pages** of regulation, MDCG guidance, ISO / IEC / CLSI standards
- **22 GSPR clauses · 380 sub-requirements** every device must satisfy
- **510 days** average Class C journey from project kickoff to certificate
- **€350-800k** in consulting fees per Class C submission
- **3-5×** the cost of fixing a non-compliance after design freeze

Most engineering teams encounter IVDR only at the certification gate, when redesign costs are at their highest. The result: 67% of first-time submissions trigger a deficiency letter.

### Our solution

**Conformly** is an autonomous AI co-pilot that makes IVDR visible from Day 1. It continuously reads every design document against the full regulatory corpus and tells the user — in plain English, with every claim cited — what's covered, what's missing, and what a Notified Body would flag if they submitted today.

It runs on a **specialized agent** built from open-source Hermes (Nous Research), tuned with five domain-specific tools and a 27-document curated knowledge base, and powered by Gemini 3.

---

## 2. Product Detail — How it works, technologies involved

### What the user does

1. **Upload** any design file (PDF, Word, Excel, CAD, images). Folders pre-organised to IVDR Annex II.
2. **Watch** Conformly read it against every relevant regulation in real time.
3. **Drill in** through 7 product workspaces: Dashboard / Documents / Analysis / Reports / NB Simulation / Chat / Knowledge.
4. **Predict** the Notified Body verdict before submission with the NB-simulator workspace.

### Technologies involved (sponsor matrix)

| Sponsor | Track | What we use | Where it shows up |
|---------|-------|-------------|-------------------|
| **Google Gemini** | $10k Gemini track | Gemini 3 Flash (default · fast + cheap) · Gemini 3 Pro (deep reasoning fallback) | `parse_nb_letter` · `gspr_gap_analyzer` · `/api/chat` · multimodal PDF ingestion |
| **Vultr Cloud** | Cloud track | One Cloud Compute instance (Ubuntu 24.04 · Frankfurt) running FastAPI + Next.js + nginx + Let's Encrypt | Whole product, €15/month — `https://conformly.gopromp.com` |
| **Featherless** | Inference track | Serverless inference as **medical fallback** path (no infra, pay-per-use) | Hermes provider profile — kicks in when primary route is rate-limited |
| **Anthropic Claude** | Build-time | Claude Code (claude.ai/code) used to author the code in this repo | Source-code creation only — Claude is not in the runtime product. See commit messages for the assistant's contributions. |
| **NousResearch Hermes** | Foundation (open-source) | Agent runtime — model routing, tool dispatch, HITL, gateway | Every API call routes through the Hermes plugin layer |

### Architecture in one paragraph

A user's question → routed by the FastAPI sidecar → handled by the specialized Hermes agent → which calls one of 5 specialist tools (each typed, each tested) → reading the markdown vault → returning a JSON envelope → composed back into a cited answer for the user. The whole vault is git-versioned; every analysis is reproducible against any historical commit.

```
engineer  →  Next.js UI  →  FastAPI :8080  →  Hermes Agent (specialized)
                                                ↓
                                              5 specialist tools
                                              ↓             ↓
                                           Gemini 3      vault/ (markdown · git)
                                                          27 regulatory sources
                                                          + user's design docs
```

See the live visual at [conformly.gopromp.com#how-it-works](https://conformly.gopromp.com#how-it-works).

---

## 3. User Interaction — try it now

The live deployment runs at **[conformly.gopromp.com](https://conformly.gopromp.com)**.

Three things to do in the next 60 seconds:

| Route | What you'll see |
|-------|-----------------|
| **[Run live Gemini](https://conformly.gopromp.com/nb-simulation)** | Press "Run live with Gemini 3" on the NB simulator. Gemini 3 reads a real TÜV SÜD deficiency letter in ~9 seconds and returns 4 structured findings. |
| **[Ask a question](https://conformly.gopromp.com/chat)** | Open chat in Live mode. Ask "is my device Class B or Class C?" — Gemini answers in ~5 seconds with citations from IVDR Rule 3 and the project documents. |
| **[Explore the knowledge base](https://conformly.gopromp.com/knowledge)** | 27 regulatory sources, each indexed at section level. Click any source to see what the agent reads. |

A **90-second demo screen recording** is in `docs/DEMO_SCRIPT.md` — voice-over text, timing, and backup plan if the live Gemini call hiccups.

---

## 4. Market Scope

### Total Addressable Market (TAM)

The global In-vitro Diagnostics (IVD) regulatory compliance market is conservatively **€2.4B / year** (2024) and growing 14% YoY through 2030 as the IVDR transition deadlines force every IVD on the EU market today to re-certify.

- **~9,800** IVD manufacturers worldwide with EU market access
- **~2,300** active Notified Body assessments per year under IVDR
- **€350-800k** average consulting spend per Class C submission

### Serviceable Addressable Market (SAM)

The subset Conformly initially targets — **EU-bound Class B/C/D IVDs requiring a Clinical Performance Study under Annex XIII** — is **€720M / year**:

- ~1,400 manufacturers per year preparing IVDR submissions
- Average Conformly seat economics: ~€50k/year per active project (vs. €350-800k legacy consulting cost)

### Serviceable Obtainable Market (SOM)

3-year target: **~70 active engagements** (€3.5M ARR), capturing roughly 5% of SAM by Year 3 through:

- Bologna-based CRO dogfooding (Q3 2026, internal)
- Open beta for external CROs (Q4 2026)
- Multi-tenant SaaS (2027)

---

## 5. Revenue Streams

| Stream | Pricing | Notes |
|--------|---------|-------|
| **Per-project subscription** | €4,000 / month per active project | The core stream. One device project = one subscription. Most clients keep 1-3 projects active at a time. |
| **Per-seat add-ons** | €200 / month per extra reviewer seat | Project owner is included; additional QA / RA reviewers are seats. |
| **Notified Body simulation runs** | €450 per run · pre-submission audit | Many manufacturers will buy this without subscribing — it's a one-shot value gate. |
| **Knowledge-base licensing** | €30k / year per CRO firm | A CRO licenses Conformly's curated vault to use across all their clients. |
| **Implementation & onboarding** | €15-40k one-time | Vault migration from legacy QMS systems, training, custom procedure import. |

Gross margin target: **78%+** (Gemini cost ~€2.50/run for the LLM-heavy tools; Vultr hosting ~€15/month per instance; the rest is salary).

---

## 6. Competitors & Unique Selling Proposition

| Competitor | Approach | Where they're weak |
|------------|----------|--------------------|
| **Greenlight Guru** | eQMS platform with workflow templates | Static templates — no AI analysis, no NB prediction. Generates documents *at* gates, not continuously. |
| **MasterControl** | Enterprise QMS suite | Heavy, slow, designed for big pharma; weeks to implement; no native LLM. |
| **Qualio** | SaaS QMS for SMEs | Strong at SOP management; no regulatory reading, no GSPR mapping. |
| **Generic LLM chats (ChatGPT, Claude)** | Free-form Q&A | No vault grounding, no cite-or-refuse, no NB simulator. Hallucinates regulations. |
| **Big-4 consultants** | Manual human review | High quality, high cost (€350-800k), slow (months), not scalable. |

### Our Unique Selling Proposition

1. **Continuous, not gate-based** — the only tool that re-reads the full regulation on every document commit.
2. **Pre-submission NB simulator** — predicts the actual deficiency letter the Notified Body will issue, with clauses + severities + affected documents.
3. **Multi-version file control** — git-versioned vault. Roll back to any historical state and re-run the analysis against that snapshot. Reproducible audits in one click.
4. **Cite-or-refuse on every claim** — every gap, every suggestion, every paragraph carries a regulation clause + a document ID. If the source is silent, the agent says so.
5. **Long-context replaces RAG** — Gemini 3's 1M-token window holds the entire curated corpus + the client's whole dossier in one prompt. No vector DB, no infrastructure drift, no rebuilds.

---

## 7. Future Prospects (Roadmap)

| Horizon | Milestones |
|---------|-----------|
| **Hackathon (now)** | ✅ 5 specialist tools shipped · ✅ 90 unit tests passing · ✅ HTTPS live on conformly.gopromp.com · ✅ Real Gemini integration on /chat, /analysis, /nb-simulation |
| **Q3 2026** | Internal dogfooding across 20+ active IVDR engagements at a Bologna CRO. Full multimodal PDF ingestion. Slack + Telegram gateway live for HITL approvals. |
| **Q4 2026** | Open beta for external CROs and IVD manufacturers. EUDAMED integration. MDCG 2022-9 SSP template generator. Cybersecurity addendum per MDCG 2019-16. |
| **2027** | Multi-tenant SaaS. **MDR (EU 2017/745)** extension covering medical devices beyond IVDs. **UK / MHRA** + **FDA** bridges for cross-market submissions. Marketplace for CRO-curated procedure playbooks. |

Scalability: same architecture (markdown vault + specialized Hermes agent + long-context LLM) maps 1:1 onto MDR, MHRA, FDA — each becomes another curated knowledge layer + a new specialist tool family.

---

## 8. AI-assistant disclosure

This repository was authored with **Anthropic Claude Code** as the AI development assistant. All architecture decisions, code structure, and product copy were generated through pair-programming sessions with Claude.

The runtime product itself uses Gemini 3 (Google AI Studio) — Claude is not in the runtime path.

---

## 9. Quickstart — try it locally

Prereqs: Python 3.11+ (or `uv` will fetch its own), git, Node 20.

```bash
# 1. Install Hermes Agent
git clone https://github.com/NousResearch/hermes-agent.git
cd hermes-agent && ./setup-hermes.sh

# 2. Install Conformly
cd ..
git clone https://github.com/ma2214889041/Conformly.git conformly
ln -s "$(pwd)/conformly/plugin" ~/.hermes/plugins/conformly
echo "export CONFORMLY_VAULT=$(pwd)/conformly/vault" >> ~/.zshrc
source ~/.zshrc

# 3. Configure Gemini
echo "GEMINI_API_KEY=AIza..." >> ~/.hermes/.env
hermes config set model.provider gemini
hermes config set model.model gemini-3-flash-preview

# 4. Run the API
cd conformly && CONFORMLY_VAULT=$(pwd)/vault PYTHONPATH=$(pwd)/plugin \
  ~/path/to/hermes-agent/venv/bin/python -m uvicorn api.server:app --port 8080

# 5. Run the front-end
cd web && npm install && npm run dev
# → open http://localhost:3000
```

---

## 10. Tests

```bash
~/path/to/hermes-agent/venv/bin/pytest plugin/tests/ -q
# 90 passed in 0.34s
```

LLM-backed tools (`parse_nb_letter`, `gspr_gap_analyzer`) inject their LLM call through a module-level `_llm_caller` symbol so tests can monkeypatch it. Same handler in production, deterministic stub in tests.

---

## 11. Deploy to Vultr

```bash
export DOMAIN=your.domain.com
export ACME_EMAIL=you@example.com
export GEMINI_API_KEY=AIza...
ssh root@<vps-ip> 'bash -s' < deploy/install.sh
```

Five minutes later: full HTTPS deployment with auto-renewing certificates, two systemd services (FastAPI + Next.js), nginx, UFW, unattended security upgrades.

For incremental changes, `./deploy/sync.sh "your commit message"` commits, pushes, pulls on the box, rebuilds, restarts, and smoke-tests in one command (~30 seconds).

---

## 12. Repo layout

```
conformly/
├── plugin/              Hermes plugin (Python tools)
│   ├── tools/           5 tool implementations + shared helpers
│   ├── skills/          markdown SKILL.md procedure files
│   └── tests/           90-test pytest suite
├── vault/               knowledge base — auditable markdown
│   ├── raw/             raw inputs: 27 regulatory sources, NB letters
│   ├── notes/           curated structured notes (GSPR checklist, SOPs)
│   ├── clients/         per-project markdown
│   ├── projects/        per-engagement working dossier (SHM-7300)
│   └── index/           agent-maintained navigation indexes
├── api/                 FastAPI sidecar (port 8080)
├── web/                 Next.js 14 product + landing
│   ├── app/(marketing)/ landing page, /pitch
│   └── app/(app)/       7 product workspaces
├── deploy/              one-shot Vultr installer + sync script
└── docs/                DEMO_SCRIPT.md, MULTI_PROVIDER.md, etc.
```

---

## License

Source code: **MIT**.

Vault content: per-file headers — most are mock/demo data; the real IVDR PDF is from EUR-Lex (public domain); ISO / CLSI summaries are paraphrased (originals are copyrighted and must be purchased for production use).

Built at Milan AI Week. Powered by [Hermes Agent](https://github.com/NousResearch/hermes-agent), Gemini 3, and a single €15/mo Vultr instance.
