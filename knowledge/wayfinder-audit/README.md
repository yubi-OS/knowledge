# wayfinder-audit: auditing a latent-space corpus wayfinder

A knowledge corpus on auditing the SOS wayfinder v0.2: the engineering defects found and repaired, the corrections applied, the evidence standard for real-edit success, and what remains unproven. Minted 2026-10-05 from the yubi-OS/yubiOS refs audit record (refs_corpus/wayfinder-audit-2026-09-09.md); audit-specific claims trace to that record and to the live endpoints it publishes (https://steady-orbit.systems-a.workers.dev/AGENT.md, https://steady-orbit.systems-a.workers.dev/map/), while general technical claims carry their web source and jev weight inline.

## Docs

| NN | doc | outline score | scope |
|---|---|---|---|
| 01 | 01-frozen-coordinates-baseline.md | 1.623 | How the v0.2 audit freezes fitted coordinates: baseline_id reuses the actual stored frame while frame_id and instrument_id are checked independently of the changed input fingerprint, because seed-only reuse cannot pin a fitted coordinate system. |
| 02 | 02-full-text-ingestion-pipeline.md | 1.074 | Full-text measurement and ingestion hardening: Unicode-safe 400-byte chunks, BGE mean-pooling with byte weighting and L2 normalization, content-keyed SHA256 caching, and a TAR parser that validates checksums, PAX headers, and budgets. |
| 03 | 03-input-change-observability.md | 1.339 | Distinguishing changed input from changed binary geometry: quantization-silent edits, the run 46 to 47 evidence chain, and why a stationary dot cannot prove an edit was ignored. |
| 04 | 04-non-destructive-recommendations.md | 1.026 | Removing destructive recommendations: isolation no longer authorizes deleting a source, outliers are review-only, synthetic ADD uses one row, and candidates stay hypotheses with content inspection and a task check. |
| 05 | 05-semantic-honesty.md | 1.393 | Semantic honesty in interpretation: azimuthal sectors as anonymous numbers, the twelve NSS axes as an unvalidated lens, no PCA angle proving a semantic defect, and pole-shift sign no longer deciding edit quality. |
| 06 | 06-numerical-correctness-core.md | 1.659 | Numerical correctness repairs: covariance-trace normalization in V2, the rank gate as measurement not identity, MH detailed balance separated from stochastic flux, stable stationary normalization, SLERP antipode handling, and identity-failure abort before persistence. |
| 07 | 07-sampler-correctness.md | 1.263 | Sampler correctness: replacing the successful-move stopping rule with a symmetric checkerboard-switch chain with self-loops and attempted-proposal counting, margin preservation, the honest not-full-Curveball statement, and finite mixing still unproved. |
| 08 | 08-api-safety-operator-interface.md | 1.050 | API safety and the operator interface: preflight numeric validation and baseline-conflict checks, 768-D vectors direct, seed 0 preserved, 409 for legacy baselines, bounded bodies, no exposed stacks, and the UI additions for comparison and hypotheses. |
| 09 | 09-spectral-selection-rules-boundaries.md | 1.117 | Raman and infrared boundaries: dipole versus polarizability derivatives, the Placzek depolarization ratio, why the wayfinder cannot claim spectral measurement, and the recorded negative results retained. |
| 10 | 10-evidence-standard-benchmarks.md | 1.867 | The evidence standard: why Addendum 12 rungs are not 10 independent graded trials, separating test passage from predictive usefulness, the EnvHarness discipline, the frozen held-out benchmark design, and the explicit limitation list. |

## Research summary

- Results collected: 120 (searXNG, top 6 per query, 2 queries per doc)
- Weight split: 48 authoritative (weight >= 0.5) / 72 weak (weight < 0.5) of 120
- Jev requests: 26 (1 probe, 1 outline validation, 24 weighting batches)
- Jev usage: 20811 input tokens / 0 output tokens
- Redo counts: 0 digs redone (all 20 queries returned results on first attempt)
- Skipped docs: none (all 10 subtopics scored load-bearing or marginal and all dug strong)

Weight >= 0.5 is treated as authoritative backing; weight < 0.5 is labeled weak in the doc text. Claims unique to the audit are attributed to the project audit record rather than presented as web-verifiable.

## Preflight

Preflight 2026-10-05: searXNG 67 results healthy; /api/decide (clef) 200.

## Research db

- research-db/preflight.json: probe record for searXNG and /api/decide
- research-db/outline.json: 10 subtopics, seed queries, and the score validation answers
- research-db/archive.json: all 120 collected results with weights and full decision records
- research-db/digs/<NN>-<slug>.json: per-doc dig records (queries, raw counts, kept results, outcome)
- research-db/jev-log.json: one entry per jev HTTP request with usage tokens
- research-db/db.ts: TypeScript interfaces matching every shape above
