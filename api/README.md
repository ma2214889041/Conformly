# Conformly · API

A thin FastAPI sidecar that exposes the five Conformly plugin tools as HTTP endpoints. Used by the Next.js front-end's "Live" demo mode.

## Endpoints

| Method | Path | Body | What |
|--------|------|------|------|
| `GET`  | `/api/health` | – | Liveness + which vault we're reading |
| `GET`  | `/api/tools`  | – | Schema of every tool (OpenAI tool-call format) |
| `POST` | `/api/tools/get_client_status` | `{client_id: string, include_risk_history?: boolean}` | – |
| `POST` | `/api/tools/list_clients` | `{status?, sort_by?, ivdr_class?}` | – |
| `POST` | `/api/tools/search_regulation` | `{query?, doc_type?, include_pdfs?}` | – |
| `POST` | `/api/tools/parse_nb_letter` | `{letter_path?, letter_text?, client_id?}` | LLM-backed |
| `POST` | `/api/tools/gspr_gap_analyzer` | `{client_id, focus_clauses?}` | LLM-backed |
| `GET`  | `/api/agent/run/{scenario_id}` | – | Server-sent events streaming a multi-step turn (`nb-letter` · `gspr-gap` · `client-status`) |
| `GET`  | `/api/sample/nb-letter` | – | Returns the bundled BSI letter so the UI can show "drop letter on agent" |

Every response uses the canonical `{"success": bool, "data"|"error": ...}` shape that the Python tools already produce — no second translation layer.

## Running locally

```bash
cd conformly
HERMES_HOME=~/.hermes \
CONFORMLY_VAULT=$(pwd)/vault \
../hermes-agent/venv/bin/python -m uvicorn api.server:app --port 8080 --reload
```

Then hit:

```bash
curl localhost:8080/api/health | jq
curl -X POST localhost:8080/api/tools/list_clients -d '{"sort_by":"risk"}' -H 'content-type: application/json' | jq
curl -X POST localhost:8080/api/tools/get_client_status -d '{"client_id":"CLIENT-A"}' -H 'content-type: application/json' | jq
```

## Streaming a live turn

```bash
curl -N localhost:8080/api/agent/run/client-status
```

You'll get an SSE stream of `step` events. The front-end's `/demo` page consumes the same stream when the "Live" toggle is enabled.

## Auth + LLM

- The non-LLM tools (3 of 5) work with **no configuration**.
- The LLM-backed tools (`parse_nb_letter`, `gspr_gap_analyzer`) use Hermes' `PluginLlm`, which reads `~/.hermes/auth.json`. Whatever model Hermes is configured to use is what the API will call.

To switch to Gemini 2.5 Pro for 2M-token long-context behaviour:

```bash
hermes model           # pick gemini-2.5-pro
# or set GEMINI_API_KEY in ~/.hermes/.env, then `hermes model` again
```

## Production (Vultr)

`deploy/install.sh` wires the API as a `conformly-api.service` systemd unit on port 8080, behind nginx which proxies `/api/*` → `127.0.0.1:8080`. The Next.js front-end and the API live on the same box, same origin — no CORS headache.
