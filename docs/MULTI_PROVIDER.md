# Multi-provider configuration

Conformly is built so the LLM provider is a one-line config swap — we use
Gemini 3 by default but the same code path works with any provider Hermes
Agent supports. This doc explains how to wire **Featherless** and
**Anthropic** as alternative providers (sponsor track requirement).

## Default — Gemini 3 (direct Google AI Studio)

```bash
# Add the API key to the Hermes env file
echo "GEMINI_API_KEY=AIza..." >> ~/.hermes/.env
chmod 600 ~/.hermes/.env

# Point Hermes at Gemini
hermes config set model.provider gemini
hermes config set model.model     gemini-2.5-pro
hermes config set model.aux_model gemini-2.5-flash

# Restart the API sidecar
sudo systemctl restart conformly-api
```

This is the route we use in production today. Visit
`https://conformly.gopromp.com/api/health` → field `tools` lists the 5
tools, and any LLM-backed call (parse_nb_letter, gspr_gap_analyzer,
/api/chat) routes through Gemini.

## Fallback — Featherless

Featherless is serverless inference; no infrastructure to manage. Useful
as a medical fallback path when the primary route is rate-limited.

```bash
# Set the Featherless key
echo "FEATHERLESS_API_KEY=fl_..." >> ~/.hermes/.env

# Configure the Hermes provider chain — Gemini primary, Featherless fallback
hermes fallback add featherless meta-llama/Meta-Llama-3.1-70B-Instruct

# Verify
hermes fallback list
```

Hermes routes every LLM call through `model.provider`; if that errors
(rate limit / outage), it tries the fallback chain in order. Conformly
tools don't need code changes — Hermes handles the retry transparently.

## Optional — Anthropic Claude

Useful for evaluators on the Anthropic track and for tasks where you
want a second opinion alongside Gemini.

```bash
echo "ANTHROPIC_API_KEY=sk-ant-..." >> ~/.hermes/.env

# Either swap the default or add as a per-tool override:
hermes config set model.provider anthropic
hermes config set model.model     claude-sonnet-4-7
```

For a per-tool override (e.g. use Claude only for CAPA-letter generation
while keeping Gemini for everything else), edit
`~/.hermes/config.yaml`:

```yaml
plugins:
  entries:
    conformly:
      llm:
        allow_provider_override: true
        allow_model_override: true
        allowed_providers: [gemini, anthropic, featherless]
```

Then in the tool code, pass `provider="anthropic"` to the PluginLlm call.

## Verification

After any provider change:

```bash
# 1. API health still 200
curl -s https://conformly.gopromp.com/api/health | jq

# 2. Single live call
curl -s -X POST https://conformly.gopromp.com/api/chat \
    -H 'content-type: application/json' \
    -d '{"message":"Is my device Class B or Class C?","history":[]}' | jq '.data.model, .data.duration_ms'
```

The `data.model` field reports the actual model that answered — useful
to confirm the fallback fired or the override took effect.
