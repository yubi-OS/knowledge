# knowledge/timesfm-tsfm-landscape

jev-weighted knowledge corpus minted 2026-10-08 on the topic "TimesFM and the time-series foundation-model landscape, plus the storage layer". It grounds the planned `jev-timeseries` skill (SPEC-TIMESERIES-2026-10-08): a WAE-backed trajectory tier on the steady-orbit worker with a deterministic ETS forecaster and an offline TimesFM 2.5 path.

## Docs

| # | Doc | One-line scope |
|---|---|---|
| 01 | [01-timesfm-lineage.md](01-timesfm-lineage.md) | TimesFM v1 (2023, ICML 2024) through 2.0, 2.5 and 3.0: checkpoints, parameter counts, context lengths, pretraining data, and the license boundary at 3.0. |
| 02 | [02-patched-decoder-architecture.md](02-patched-decoder-architecture.md) | The patched-decoder architecture: input/output patching, patch lengths, autoregressive decoding, positional embeddings, and what changes across versions. |
| 03 | [03-tsfm-landscape-comparison.md](03-tsfm-landscape-comparison.md) | TimesFM vs Chronos, Moirai 2.0, Lag-Llama and TTM: tokenization vs patching, sizes, probabilistic outputs, and where each sits on GIFT-Eval. |
| 04 | [04-quantile-heads-and-probabilistic-forecasting.md](04-quantile-heads-and-probabilistic-forecasting.md) | Quantile heads and probabilistic forecasting in TSFMs: TimesFM 2.5 continuous quantile head, Chronos probabilistic framing, Lag-Llama per-timestep distributions, quantile crossing. |
| 05 | [05-gift-eval-benchmark-protocol.md](05-gift-eval-benchmark-protocol.md) | The GIFT-Eval benchmark protocol: 23 datasets, 7 domains, metrics (CRPS, MASE, MSE), model types, leakage tracking, submission mechanics. |
| 06 | [06-workers-analytics-engine-time-series-storage.md](06-workers-analytics-engine-time-series-storage.md) | Cloudflare Workers Analytics Engine as the storage tier: writeDataPoint schema (blobs/doubles/index), dataset binding, sampling, SQL API, and 3-month retention. |
| 07 | [07-jev-integration-design.md](07-jev-integration-design.md) | How the pieces compose for jev-timeseries: deterministic ETS in the worker, offline TimesFM 2.5 via a box-side bridge, WAE as trajectory tier, D1 as append-only system of record. |

## Research summary

- 7 docs, all authored; 0 skipped.
- 14 attempt-1 dig queries + 14 attempt-2 redo queries via the searXNG proxy; 168 collected results, all carrying a jev quality weight (65 at weight >= 0.5). Attempt-1 dig results failed weighting (all weights < 0.5), so every doc's dig was redone with different queries per the mint REDO rule; attempt-2 results carry the citations.
- Outline validated with the jev score metric before digging: scores 1.52 to 1.93 on a 0-2 scale (padding / marginal / load-bearing), no docs dropped.
- Full audit trail in [research-db/](research-db/): preflight.json, outline.json, archive.json (168 weighted entries), digs/*.json per doc, jev-log.json (every jev HTTP request with task_id, model, usage), db.ts (typed schema v2).

## Known gaps and corrections (recorded honestly)

- TTM (Tiny Time Mixers) was named in the corpus request but no weighted source in this run covers it; it is recorded as a gap in doc 03, not described from memory.
- The arXiv identifier 2411.04095 circulated in the corpus request does NOT resolve to a TimesFM 2.0 paper; it resolves to a solar-physics paper. TimesFM 2.0 is grounded in the Hugging Face model card and the GitHub repo instead.
- The Lag-Llama output distribution family (for example Student-t) is not quoted in this run's weighted sources; doc 04 asserts only its probabilistic per-timestep design.
- The full enumeration of GIFT-Eval's 11 metric columns is not present in the fetched README text; doc 05 grounds CRPS/MASE ranking and the MSE[...] column format it can verify.
- All weighted-batch jev requests went to api.defapi.org (typesafe/jev-1.13) because steady-orbit /api/decide returned HTTP 502 on every multi-question batch during the weighting window (single-question probes returned 200). Recorded per-request in research-db/jev-log.json; nothing shipped unweighted.

## Conventions

- Every factual claim carries its source URL and the jev weight that backed it; "direct fetch" marks a primary source read outside the dig archive (the corpus request's named ground sources).
- Weight >= 0.5 counts as authoritative backing; below that, the claim is labeled weakly backed or dropped.
- Updates to this corpus go through the refs-refresh-sweep flow, never silent rewrites.
