# Capability Map Domains

Scope: the 13 capability domains that cover the worker, the auth model across the surface, and how the dagged routes were placed.

Source of record: yubi-OS/yubiOS docs/ENDPOINTS.md (source doc, weight 0.62). All claims below are from that document unless a dig source is named.

## The 13 domains

Thirteen capability domains cover the worker (source doc, weight 0.62):

1. Jev Orchestrator (gated task engine) - the jev v2 orchestration core: ingest, understand/decide, deterministic fail-closed gate, execute, verify, six terminal states.
2. Automations (versioned stage pipelines + cron) - versioned automation defs in D1 with tool, llm, builtin, guard and propose_actions stages.
3. Evolution (hourly cycle + directives) - the self-improvement loop: sweeps, directives, cycles, atoms, candles, memory recall.
4. Corpus Math (jev-corpus) - the corpus-audit math engine, parity-tested against the Python sources of record.
5. Taste Engine (taste-v1) - deterministic extraction plus one batched clef call over 8 nature-law axes, with edge-standard-v1.
6. Visco Instruments (rate-dependent round gates) - persistence, hysteresis, prony, mobility, snapback, policy-log over the corpus and outcomes history.
7. Wayfinder Point-Map (frozen-frame geometric instrument) - the pointmap/0.2 frame with its diagnostic family and /map/ UI.
8. Ingestion & Embeddings (full-content chunked/v1) - repo-items, chunked/v1 embedding, vector search.
9. Outcome Ledger (append-only pre-registration) - predicted-versus-realized rows with supersedes corrections.
10. Repo Assessment (FIT legacy) - assess, fits, narrate.
11. Public Relays (media, contact, chat, decide) - CORS-open relay endpoints for the website and agent clients.
12. SEO Dig Proxy (searxng) - one GET endpoint forwarding to the n8n searxng-proxy webhook.
13. Platform Surface & Ops Console - health, AGENT.md, llms.txt, /jev console, site routes, scheduled entrypoint.

## Dagger placement

Endpoints marked with a dagger were added during reconciliation from Lane A routes Lane C did not assign; after the 2026-10-05 resolution refresh every one of them is documented in AGENT.md as well (source doc, weight 0.62). The placed dagged routes were: POST /api/jev/approvals/:id/guide (Jev Orchestrator), POST /api/site-assistant and POST /api/brain/preview (Public Relays), GET|DELETE /api/fits/:id (Repo Assessment), DELETE /api/outcomes/* (Outcome Ledger), and 17 site routes plus asset passes (Platform Surface & Ops Console).

## The auth model

Auth is taken from Lane A and updated by the R2 code patches where DELETE auth changed (source doc, weight 0.62). Three tiers:

- Bearer (JEV_API_KEY) on every /api/jev route except the two health endpoints (/api/jev/health, /api/jev/corpus/health) and the reply webhook POST /api/jev/webhooks/reply (source doc, weight 0.62).
- Operator bearer auth on the two destructive DELETE handlers: DELETE /api/maps/:id and DELETE /api/fits/:id. The R2 patch added requireOperatorAuth: 503 when the JEV_API_KEY binding is missing, 401 on a missing or wrong token (source doc, weight 0.62).
- None on everything else: map routes, ingestion, outcomes, FIT legacy, public relays, the searxng proxy, and the platform surface. Public relays are unauthenticated apart from rate limits (source doc, weight 0.62).

## Module parts and bindings per domain

Each domain section in the source doc lists its module parts and bindings. The 7 module parts that hold route dispatch are: index.js (45 routes, legacy API module), solar-rbs-entry.mjs (16 routes, site adapter), routes-jev.js (22 routes), routes-automations.js (7 routes), jev-evolution.js (6 routes), jev-evolution2-routes.js (5 routes), and jev-corpus-routes.js (20 routes) (source doc, weight 0.62). Bindings across the surface include DB (D1), SITE (KV), AI (Workers AI), VEC and EVEC (Vectorize), WEBSITE_RATE_LIMIT (ratelimit), and the secrets JEV_API_KEY, DEFAPI_API_KEY, ELEVENLABS_API_KEY, RESEND_API_KEY, GITHUB_API_KEY, NORTHFLANK_API_KEY, GOOGLE_PLACES_API_KEY and DAYTONA_API_KEY (source doc, weight 0.62).

## Composition

The doc records composition edges per domain (source doc, weight 0.62): the orchestrator gate consumes automations propose_actions and evolution directives; corpus placements calls the worker's own /api/map; ingestion supplies the vectors every map run embeds; visco reads the outcome ledger; the ops console is the human surface for tasks and approvals; the scheduled handler dispatches automations and the evolution cycle by cron expression. The full 16-edge cross-domain flow table lives in the source doc and in doc 10 of this corpus.
