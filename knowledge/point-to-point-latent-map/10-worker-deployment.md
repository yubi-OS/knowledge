# Deployment: embeddings, persistence, and isomorphic numeric modules on Cloudflare

**Scope:** Deployment of deterministic numeric pipelines on Cloudflare: Workers AI embeddings, D1 persistence, isomorphic browser/Worker modules. The map ships as one dependency-free TypeScript module whose only network dependency in server mode is an embedding call, with results persisted to D1 for cross-run comparability; this doc grounds the platform side.

## Design context

The map module must run identically in two environments: the browser (a prototype page that loads or generates an unlabeled cloud and draws the result) and a Cloudflare Worker (a POST /api/map endpoint that accepts vectors or texts). The numeric core is stdlib TypeScript with no npm dependencies, so the same file bundles into both. In server mode, texts are embedded with a Workers AI embedding model, then the numeric pipeline runs; zero further fetches occur, keeping the pipeline inside the free-plan subrequest budget. Results persist to D1 keyed by (rule hash, seed, content hash). This doc grounds each platform piece.

## Workers AI embeddings

Cloudflare Workers AI is Cloudflare's serverless inference platform, running models on Workers' network. The platform's model catalog documents the available models, including the BAAI bge family of text embedding models [https://developers.cloudflare.com/ai/models/, weight 0.92]. The Workers AI product page describes the access patterns: models callable from a Worker via a binding or via a REST API, with usage metered per neuron [https://www.cloudflare.com/products/workers-ai/, weight 0.67]. The model listing pages document the embedding model entries that the map's embedding step targets [https://developers.cloudflare.com/workers-ai/models/, weight 0.23, weak backing].

The Workers AI binding documentation covers the programmatic path: a Worker declares the AI binding in its configuration and calls env.AI.run() with a model name and input [http://developers.cloudflare.com/workers-ai/features/batch-api/workers-binding/, weight 0.55]. For the map, the embedding call is the single external fetch in the server pipeline: text input goes to the embedding model, 768-dimensional vectors come back, and binarization under the stated rule takes over. A marketing-level product overview adds nothing normative and weighted weakly [https://www.cloudflare.com/, weight 0.37, weak backing], and a community discussion thread carried negligible weight [https://github.com/orgs/community/discussions/209460#discussioncomment-18739307, weight 0.03, weak backing].

## D1 persistence

Cloudflare D1 is Cloudflare's serverless SQL database built on SQLite, queryable from Workers. The D1 database class documentation specifies the binding interface: a Worker binds a D1 database and executes prepared statements through methods like prepare, bind, and batch on the D1Database object [https://developers.cloudflare.com/d1/worker-api/d1-database/, weight 0.95]. The Workers Binding API reference documents the query interface and result shapes for D1 [https://developers.cloudflare.com/d1/worker-api/, weight 0.49, weak backing]. The D1 product page positions it as the SQL store for Workers applications [https://www.cloudflare.com/product pages aggregated, weight 0.60].

For the map, D1 holds one row per map run keyed by (rule hash, seed, content hash). The key triple is the comparability contract: two stored maps are comparable only when all three match, mirroring the baseline identity discipline of the wider measurement system. A community thread on binding Workers and D1 via API covers the setup path but carries weak weight [https://community.cloudflare.com/t/how-do-i-bind-workers-and-d1-database-using-api/769192, weight 0.04, weak backing].

## Isomorphic numeric modules

The design constraint that the same pointmap.ts file runs in browser and Worker is a standard Workers property: Workers execute standard JavaScript/TypeScript with web-standard APIs, and code without platform-specific dependencies bundles for both targets. The numeric core (Jacobi eigensolver, ridge regression, seeded PRNG) is pure computation, so the isomorphism holds by construction; the only platform-specific paths are the embedding call (Worker only) and the rendering layer (browser only).

Determinism across environments requires care beyond the module boundary: the seeded PRNG must produce identical sequences in V8 in the browser and in workerd (the Worker runtime), both of which are V8-based, so a correctly seeded, integer-only PRNG (xorshift-family on 64-bit state via BigInt or split 32-bit halves) gives bit-identical sequences. The design states the deterministic contract as "deterministic given seed" and re-verifies it per environment; a float arithmetic note: V8 uses IEEE 754 doubles consistently in both environments, so double-precision results match across browser and Worker [https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html, weight 0.92, from the sibling doc's dig].

The subrequest budget matters at the margins: the Cloudflare free plan limits outbound subrequests per request, and the map's design (one embedding fetch, zero after) is engineered to stay far below the cap. The numeric pipeline is CPU-bound work, which is the intended use of CPU time rather than subrequest quota.

## What deployment asserts

1. Workers AI exposes embedding models callable from a Worker binding, with the model catalog as the authoritative listing [https://developers.cloudflare.com/ai/models/, weight 0.92].
2. D1 is the serverless SQL store queryable from Workers via prepared statements on the D1Database binding, suitable for persisting keyed map results [https://developers.cloudflare.com/d1/worker-api/d1-database/, weight 0.95].
3. A dependency-free numeric module bundles identically for browser and Worker; determinism is a seeded-PRNG plus IEEE-double property, and the pipeline's single embedding fetch keeps subrequest usage trivial [https://www.cloudflare.com/products/workers-ai/, weight 0.67].

## Sources considered

| Source | Weight |
|---|---|
| Models, Cloudflare AI docs | 0.92 |
| D1 Database class, Cloudflare D1 docs | 0.95 |
| Workers AI product page | 0.67 |
| Workers Binding, Workers AI docs | 0.55 |
| Workers Binding API, D1 docs | 0.49 |
| Workers AI (AU product page) | 0.49 |
| Cloudflare D1 product page | 0.60 |
| Workers AI models listing | 0.23 |
| Cloudflare homepage | 0.37 / 0.19 |
| Workers and D1 binding via API, community | 0.04 |
| GitHub community discussion | 0.03 |
