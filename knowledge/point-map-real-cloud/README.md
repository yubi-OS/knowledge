# point-map-real-cloud

A knowledge corpus on running a point-map placement pipeline on a real embedding cloud: binarization rules for latent coordinates (median versus zero threshold), identity-keyed placement over real 768-dimensional embeddings, null-model significance testing, and the deployment of the method as a Worker module. Minted 2026-10-05 from yubi-OS/yubiOS refs/point-map-real-cloud-2026-09-06.md.

## Documents

| NN | file | scope |
|---|---|---|
| 01 | 01-bge-base-embeddings.md | The BAAI bge-base-en-v1.5 embedding model: 768-dimensional BERT-based sentence embeddings, the v1.5 similarity-distribution fix, and benchmark standing. |
| 02 | 02-pca-dimensionality-reduction.md | PCA projection of high-dimensional embeddings to a few dozen components: variance capture, centering, and geometry preservation. |
| 03 | 03-binarization-rules-median-zero.md | Binarizing latent coordinates for placement: thresholding at the coordinate median versus at zero, and published variants of each rule. |
| 04 | 04-curveball-null-model.md | The curveball algorithm and fixed-marginal null models for binary co-occurrence matrices, and z-score significance testing. |
| 05 | 05-workers-compute-limits.md | Cloudflare Workers resource budgets: CPU time, the 128 MB memory limit, and what the 1102 resource-limit error means for numeric workloads. |
| 06 | 06-cross-runtime-determinism.md | Getting identical numeric results across JavaScript runtimes: IEEE 754 determinism, seeded PRNGs, and reproducible hashing. |
| 07 | 07-worker-map-endpoint-deployment.md | Shipping a computation module as a Worker API endpoint: fetch handlers, routing, and serving numeric JSON results. |
| 08 | 08-edge-budget-large-matrices.md | Running large matrix workloads at the edge versus client-side: payload size limits and when to shift work off the server. |

## Research summary

- Results collected: 96 (16 searXNG queries, 2 per subtopic, top 6 kept per query).
- Weight split: 56 results at weight >= 0.5 (authoritative backing), 40 results below 0.5 (weak backing; cited only where labeled weak in the docs).
- Jev requests: 25 total HTTP requests to /api/decide (1 preflight probe, 1 outline validation, 20 weighting batches, 3 failed attempts retried per the redo rule). Usage: 16,178 input tokens, 0 output tokens.
- Redos: 0 dig redos; 3 jev HTTP retries (429 on weighting batches, resolved by sleep and resend).
- Skipped docs: none. All 8 subtopics authored.
- Gaps: none.

Every result collected is recorded in research-db/archive.json with its query, snippet, jev weight, and the full decision record. Every factual claim in the docs carries its source URL and the weight that backed it; claims below 0.5 are labeled as weakly backed in the text.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
