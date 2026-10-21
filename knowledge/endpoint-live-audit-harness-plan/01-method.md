# 01. Method

**Scope:** Method: detailed analysis grounded in yubi-OS/yubiOS refs/endpoint-live-audit-harness-plan-2026-10-08.md.

> Ground source: yubi-OS/yubiOS refs/endpoint-live-audit-harness-plan-2026-10-08.md. External dig: dig_context_01.json (10 Clef-weighted searXNG results).

## Purpose of the pass

The audit is the first time every documented route was exercised against the deployed worker rather than read from the docs. It is a companion to docs/ENDPOINTS.md and to refs/falsification-harness-coverage-2026-10-06.md (the Tier-2 candidate list). The target was the 53-part bundle on the etag f2313fa6 chain. All method facts below come from `yubi-OS/yubiOS refs/endpoint-live-audit-harness-plan-2026-10-08.md`.

## Inventory

The route inventory was parsed once from ENDPOINTS.md across its capability and inventory tables, giving **123 unique routes**. The raw row count in the doc is higher because some routes appear in both tables and would otherwise be counted twice. The Documented-vs-Code gap table was deliberately not re-tested, since those rows are already tracked in the doc (history item 16).

## The four live passes

All passes ran through the deployed worker using the operator bearer.

| Pass | Coverage |
|---|---|
| 1 | All 25 open GETs (site pages and public API), 9 open POST shape-validation probes, all 6 selftest endpoints run to completion |
| 2 | 26 bearer GETs, plus 401 gates sampled without the bearer |
| 3 | All 55 bearer POSTs shape-validated with empty or invalid bodies (fail-closed check); DELETE, PUT, and PATCH probed on nonexistent ids only; 401 gates on POSTs sampled |
| 4 | Real functional probes with live data |

Pass 4 is where the audit moves from contract checks to behavior. It exercised decide, chat, embed, vector/search, memory/search, repo-items (yubi-OS/yubiOS refs, 294 docs), audit and lens on a tiny 3x12 matrix, scorer/score on a real doc, forecast on a real WAE series, admission, rayleigh, azimuth, and axis-redundancy trials on live map 570, hysteresis on a real baseline, and one self-cancelling task-lifecycle smoke.

## Safety boundary

Destructive surfaces were NOT exercised. No pending approval was touched, no outcome row was written, no lead was sent, no map was deleted, and no automation was run. The mutation verbs were only aimed at nonexistent ids, which tests that the route fails correctly without risking real state.

## Bearer authentication as the gate under test

Every bearer route was checked twice: once with the operator token to confirm function, and once without it to confirm a clean 401. General guidance on bearer tokens describes them as credentials carried in the request header and validated server-side, per [A Practical Guide to Bearer Token Authentication - LiveAPI Blog](https://liveapi.com/blog/bearer-token-authentication/) (clef weight: 0.2666) (weak backing, clef weight < 0.5). A tutorial on testing API authentication covers bearer tokens, API keys, and basic auth with live requests, per [How to Test an API with Bearer Tokens, API Keys, and Basic Auth](https://101techlabs.com/guides/developer-tools/authentication-testing-examples) (clef weight: 0.0945) (weak backing, clef weight < 0.5), and a video walkthrough describes selecting a bearer token in a client tool's auth tab, per [#10 / Bearer Token Authentication in Bruno / REST API... - YouTube](https://www.youtube.com/watch?v=2GeuZb9gpPU) (clef weight: 0.0659) (weak backing, clef weight < 0.5). A vendor page describes exchanging a passkey for a scoped live bearer token, per [Argon2id Authentication & Live Dataset Audit API - quantsultant.dev](https://quantsultant.dev/docs/api/auth) (clef weight: 0.1280) (weak backing, clef weight < 0.5). The REST architectural style itself is summarized in [REST - Wikipedia](https://en.wikipedia.org/wiki/REST) (clef weight: 0.1320) (weak backing, clef weight < 0.5). None of these is authoritative; they are background for the pattern, while the audit's own result (all sampled bearer routes 401 cleanly) is the actual evidence.

## Why the Cloudflare storage substrate matters for method

Several pass-4 probes read from Cloudflare-managed stores: vector/search and embed hit the vector index, and repo-items and memory/search read stored corpora. Cloudflare describes Vectorize as a globally distributed vector database for building AI applications on Workers, per [Overview · Cloudflare Vectorize docs](https://developers.cloudflare.com/vectorize/) (clef weight: 0.4993) (weak backing, clef weight < 0.5). Its retrieval-augmented generation tutorial combines Workers AI, Vectorize, and D1, per [Build a Retrieval Augmented Generation (RAG) AI · Cloudflare Workers AI docs](https://developers.cloudflare.com/workers-ai/guides/tutorials/build-a-retrieval-augmented-generation-ai/) (clef weight: 0.3884) (weak backing, clef weight < 0.5). A third-party engineering post argues for strict separation between structured databases and vector indexes on Workers, per [Architecting Semantic Memory Layers on Cloudflare Workers - Progressive ...](https://blog.progressiverobot.com/the-challenges-of-creating-a-semantic-memory-layer-on-cloudflare-workers-d1-and-vectorize) (clef weight: 0.1748) (weak backing, clef weight < 0.5), and another project describes a memory layer built across Workers, D1, Vectorize, KV, Queues, and R2, per [Building MeridianDB: Solving AI's Memory Crisis... - DEV Community](https://dev.to/araldhafeeri/building-meridiandb-solving-ais-memory-crisis-with-multi-dimensional-rag-26m5) (clef weight: 0.1274) (weak backing, clef weight < 0.5). The Cloudflare home page also came back, per [Cloudflare: Build for the agent era](https://www.cloudflare.com/) (clef weight: 0.0689) (weak backing, clef weight < 0.5), and contributes nothing specific.

The method implication, which the seed query about eventual consistency was probing, is that a functional probe on a managed store proves the read path works at that moment. It does not prove freshness. The audit therefore records functional results as "200 functional (real data)" without claiming read-your-writes guarantees. The related jev-timeseries work had already measured seconds-scale read-your-writes lag on WAE, which is consistent with that caution.

## Classification scheme

Each route got two labels:

1. **Live result**: the observed status and behavior (200 OK, 404 correct, 422 fail-closed, 401 gate, 405 append-only, or a defect).
2. **Harness**: whether a selftest or falsification harness covers the route (Yes, Partial, No).

The second label is what turns a smoke test into an improvement plan: a route can pass live today and still have nothing that would catch a silent regression tomorrow.

## Method strengths and limits

- **Strength**: complete coverage of the documented surface, with an explicit safety boundary.
- **Strength**: every 4xx is classified as correct or defective, not just recorded.
- **Limit**: the task lifecycle was shape-validated on nonexistent ids only in this pass; its full live run relies on prior sessions.
- **Limit**: cron-driven behavior (evolution v2's hourly leg) cannot be observed by on-demand requests, which is exactly where F5 narrowed.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | A Practical Guide to Bearer Token Authentication - LiveAPI Blog | https://liveapi.com/blog/bearer-token-authentication/ | 0.2666 | weak (< 0.5) |
| 2 | Argon2id Authentication & Live Dataset Audit API - quantsultant.dev | https://quantsultant.dev/docs/api/auth | 0.1280 | weak (< 0.5) |
| 3 | How to Test an API with Bearer Tokens, API Keys, and Basic Auth | https://101techlabs.com/guides/developer-tools/authentication-testing-examples | 0.0945 | weak (< 0.5) |
| 4 | REST - Wikipedia | https://en.wikipedia.org/wiki/REST | 0.1320 | weak (< 0.5) |
| 5 | #10 / Bearer Token Authentication in Bruno / REST API... - YouTube | https://www.youtube.com/watch?v=2GeuZb9gpPU | 0.0659 | weak (< 0.5) |
| 6 | Overview · Cloudflare Vectorize docs | https://developers.cloudflare.com/vectorize/ | 0.4993 | weak (< 0.5) |
| 7 | Architecting Semantic Memory Layers on Cloudflare Workers - Progressive ... | https://blog.progressiverobot.com/the-challenges-of-creating-a-semantic-memory-layer-on-cloudflare-workers-d1-and-vectorize | 0.1748 | weak (< 0.5) |
| 8 | Build a Retrieval Augmented Generation (RAG) AI · Cloudflare Workers AI docs | https://developers.cloudflare.com/workers-ai/guides/tutorials/build-a-retrieval-augmented-generation-ai/ | 0.3884 | weak (< 0.5) |
| 9 | Cloudflare: Build for the agent era | https://www.cloudflare.com/ | 0.0689 | weak (< 0.5) |
| 10 | Building MeridianDB: Solving AI's Memory Crisis... - DEV Community | https://dev.to/araldhafeeri/building-meridiandb-solving-ais-memory-crisis-with-multi-dimensional-rag-26m5 | 0.1274 | weak (< 0.5) |
