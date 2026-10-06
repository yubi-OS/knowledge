# Ingestion, Outcomes and FIT Endpoints

Scope: the ingestion endpoints (repo-items, chunked/v1 embed with its content-hash cache, vector search), the append-only outcomes pre-registration ledger, and the legacy FIT assessment surface.

Source of record: yubi-OS/yubiOS docs/ENDPOINTS.md (source doc, weight 0.62). All claims below are from that document unless a dig source is named.

## Ingestion & Embeddings (full-content chunked/v1)

3 endpoints, all unauthenticated (source doc, weight 0.62):

- POST /api/repo-items - fetches sorted full-text repo items from the GitHub tree, with resolved_ref and truncation flags. Truncated repo files must be resolved before mapping: prefer a 40-char commit SHA, because branch names are mutable (source doc, weight 0.62).
- POST /api/embed - chunked/v1 full-content ingestion: the bge-base-en-v1.5 embedding model, explicit mean pooling, chunks of at most 400 bytes of UTF-8, a byte-length-weighted mean across chunks, and L2 normalization, with a SHA256 content-hash embedding cache (source doc, weight 0.62). The model is Cloudflare Workers AI bge-base-en-v1.5 from BAAI (https://developers.cloudflare.com/workers-ai/models/bge-base-en-v1.5/, weight 0.82), part of the Workers AI model catalog (https://developers.cloudflare.com/workers-ai/models/, weight 0.74). The upstream model card describes it as a text-embedding model optimized for retrieval (https://huggingface.co/BAAI/bge-base-en-v1.5, weight 0.23, weak).
- POST /api/vector/search - cosine search over the stored Vectorize index (source doc, weight 0.62).

Invariants (source doc, weight 0.62): every input byte is submitted, including content after character 2000, and chunk coverage is disclosed; the cache key includes complete content, model, dimension, pooling, chunk size and aggregation version, and no raw document text lives in the cache; uncached work is bounded separately at 1000 docs and 12000 chunks per request with a 413 plus counts and a warm-then-retry protocol; Vectorize metadata holds bounded text snippets only; rectangular, finite vectors of dimension 2..768 are required and empty, oversized or misaligned inputs fail explicitly. Coverage is input coverage, not a claim about preserved meaning (source doc, weight 0.62).

## Outcome Ledger (append-only pre-registration)

The typed, append-only home for every predicted-versus-realized comparison the wayfinder ever reported in prose (source doc, weight 0.62). Endpoints, all unauthenticated:

- GET|POST /api/outcomes - append a prediction (201 on POST) or read ledger rows with a contingency of COUNTS, never a rate. Query variants filter by baseline_id and frame_id.
- DELETE /api/outcomes/* (and PUT, PATCH) - an explicit 405 guard route; the outcomes ledger is append-only.

A row separates the prediction (frozen before the check) from the decision outcome, the independent verifier's verdict: pending, kept, reverted, declined, abstained, neutral. Corrections are new rows with supersedes - both stay visible (source doc, weight 0.62).

Invariants (source doc, weight 0.62): no PUT, PATCH or DELETE (405); a correction is a new supersedes row. The fields score, quality, success_rate, rate, confidence and z are rejected as inputs - no rates, percentages or z are ever computed. verifier names the independent checker and 'geometry' is refused for any non-pending verdict. observed_source is server:explainTransition or caller, never mixed in one row. A row arriving with a prediction AND a non-pending verdict is stored with preregistered:false. A sign-exact geometric prediction is an instrumentation outcome; a kept verdict does not imply the geometry predicted it. With after_id the server recomputes observed_delta via PM.explainTransition on the frozen frame, and a frame conflict is a 409.

Append-only ledger design is an established pattern with primary documentation outside this repo (SQL Server ledger tables, https://learn.microsoft.com/en-us/sql/relational-databases/security/ledger/ledger-tables, weight 0.10, weak; event-sourcing append-log architecture, https://github.com/kb4ai/event-sourcing-append-log-immutable-architecture-pub-kb, weight 0.10, weak). These are design context only; the route contracts above come from the source doc.

## Repo Assessment (FIT legacy)

The original Steady Orbit business API, kept as a separate legacy surface and deliberately unchanged by the v0.2 map release; llms.txt fallback documents it (source doc, weight 0.62):

- POST /api/assess - fetches and assesses a GitHub repository into a FIT.json report: fetch corpus, derive or refine the latent basis (AI-assisted, or reuse a baseline_id basis), runFit, store, compare to the population.
- GET /api/fits - list the stored assessment population. GET /api/fits/:id - one stored FIT with full fit_json and population comparison.
- DELETE /api/fits/:id - delete a stored FIT row; operator bearer auth required (R2 patch): 503 when the JEV_API_KEY binding is missing, 401 on a missing or wrong token.
- POST /api/narrate - produce a plain-text FIT narrative using Workers AI streaming, persisted to fits.narrative.

Module parts: index.js (assess/fits/narrate routes, refineBasis) for FIT; index.js (outcomes routes plus the 405 guard on PUT/PATCH/DELETE) for the ledger; index.js (embeddings, repo fetch, vector search, chunked/v1 cache) for ingestion. Bindings: DB for the ledger; DB, AI, GITHUB_API_KEY for FIT; DB, AI, VEC, GITHUB_API_KEY for ingestion (source doc, weight 0.62).

## Composition

Ingestion composes with the Wayfinder Point-Map (it supplies the vectors every map, preview, control and consistency run embeds), Corpus Math (scorer and matrix inputs are ingested documents), and Evolution (memory recall uses its own EVEC index with the same Workers AI embed model). The ledger composes with the map family and with Visco Instruments (hysteresis closes supersedes chains; snapback reads the ledger series). FIT composes with ingestion (repo fetching shares the GitHub path) and historically was the first consumer of /api/map (source doc, weight 0.62).
