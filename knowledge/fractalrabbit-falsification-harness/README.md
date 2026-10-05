# fractalrabbit-falsification-harness

A knowledge corpus on falsification testing for corpus-audit curve fitting: how to test whether a curve-rsi method detects real structure or hallucinates it, using controlled synthetic generators derived from the fractalrabbit stochastic mobility model.

Minted from yubi-OS/yubiOS refs/ source document `fractalrabbit-falsification-harness-2026-08-06.md` on 2026-10-05.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-falsification-methodology.md](01-falsification-methodology.md) | Falsification testing methodology: null corpora, planted anomalies, controlled synthetic generators, pass/fail gates |
| 02 | [02-fractalrabbit-darling-model.md](02-fractalrabbit-darling-model.md) | Darling (2018) three-tier stochastic mobility simulator and the NSA fractalrabbit project (AGP, RP, SRP) |
| 03 | [03-pca-explained-variance-gates.md](03-pca-explained-variance-gates.md) | PCA top-2 explained variance as a pre-fit quality gate for curve fitting |
| 04 | [04-sparse-cell-anomaly-detection.md](04-sparse-cell-anomaly-detection.md) | Sparse-cell grid detection, planted anomaly recovery rates, false negatives on stochastic corpora |
| 05 | [05-multi-seed-variance.md](05-multi-seed-variance.md) | Multi-seed sweeps, estimator instability, and why single-seed results mislead |
| 06 | [06-simulator-fidelity-tradeoffs.md](06-simulator-fidelity-tradeoffs.md) | Re-implementing published simulators: fidelity versus programmatic access |
| 07 | [07-primitive-feature-bases.md](07-primitive-feature-bases.md) | Mapping corpus items to binary primitive vectors grounded in generative tiers |
| 08 | [08-lemma-invariants-geodesic.md](08-lemma-invariants-geodesic.md) | Invariant-based validation of selection operators: geodesic minimization and the never-negative delta |
| 09 | [09-synthetic-to-real-transfer.md](09-synthetic-to-real-transfer.md) | Transferring validation results from synthetic generators to real corpora |

## Research summary

- Results collected: 108 (searXNG, top 6 per query, 18 queries across 9 subtopics)
- Weight split (jev noul, clef): 53 results at weight >= 0.5 (primary/official), 55 results below 0.5 (weak backing, labeled as such in the docs)
- Jev requests: 23 (1 outline score validation + 22 noul weighting batches), usage 18785 input / 0 output tokens
- Redos: 0 (every subtopic's initial dig kept 12 results, above the thin-dig threshold)
- Skipped docs: none; all 9 outline subtopics validated as keepable (no score-0 verdicts) and all digs came back strong enough to author honestly

## Preflight

2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## Structure

- `NN-<slug>.md`: the 9 authored docs
- `research-db/`: preflight record, validated outline, result archive with jev decisions, per-subtopic dig records, jev request log, and TypeScript interfaces
