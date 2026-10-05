# jev-corpus-unit-round

The unit-round operating procedure for corpus RSI chains: pin the corpus, re-check the frozen baseline, take one atomic change through a full runflow with gates, and land a round record. Minted from yubi-OS/yubiOS refs/ (source doc: session/refs-mint/refs_corpus/jev-corpus-unit-round-2026-10-03.md).

## Docs

- `01-unit-protocol.md` — Why a unit round commits exactly one change through the whole runflow: cycle count 1, one honest measurement per round.
- `02-frozen-baseline.md` — Pinning the corpus and re-deriving the frozen baseline at every unit interval, no carryover, instruments carry cross-unit comparison.
- `03-gate-statistic.md` — The gate-statistic correction: level_dbc = 20*log10(|z|) UP as the gate; the audit dbc field as an L2 share-spectrum distance retired from gating.
- `04-preregistration-outcomes.md` — Sign gate and outcomes pre-registration; the outcomes supersedes contract and realized-row-before-remap ordering.
- `05-hysteresis-scorer.md` — Free-prose scorer variance 6-8x the true effect; structured-evidence scorer v2/v2.1; hysteresis eliminating threshold jitter on re-scores.
- `06-harness-contracts.md` — Endpoint quick-reference, preview single-change, placements 404 workaround, stale-deploy and KV propagation lags, nulls >= 400.
- `07-taskcheck-keep-gate.md` — taskcheck_refs.sh C1-C7 as the keep gate: geometry proposes, the check disposes; C7 charter enforcement; the add-check subset.
- `08-lens-instrument.md` — The lens as instrument not generator: real-vs-control deflection as detectability filter, cell-mobility series, rungs as candidate source.
- `09-round-record.md` — steps.log repro entries, the record doc on the draft PR, GraphQL ready-for-review then squash merge, and the three worked unit types.

## Research summary

- Results collected: 108 (18 searXNG queries, 2 per subtopic, top 6 per query kept)
- Weight split: 42 results at weight >= 0.5 (primary/authoritative), 66 at weight < 0.5 (weak backing, labeled as such in the docs)
- Jev requests: 23 (1 outline validation with 9 score questions, 22 noul weighting batches of 5, 1 preflight probe), usage 18418 input / 0 output tokens
- Redo counts: 0 (no dig redos, no weighting retries)
- Skipped docs: none; all 9 subtopics scored load-bearing (1.72 to 1.89) and were authored

Preflight 2026-10-05: searXNG healthy (108 results across 18 queries); /api/decide (clef) 200
