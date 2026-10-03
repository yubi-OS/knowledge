# envharness-acceptance-mechanics

**Minted 2026-10-02** from the viscoelastic data-layout research request. Purpose: the harness half of the program — what envharness's inner workings actually are (source-verified), why their acceptance statistics need matched nulls, how harness loops go Goodhart, and what a decision engine should consume from harness data over time.

Companions: `knowledge/linear-viscoelasticity/00-ideate-and-missing-links.md` (instrument-side analysis, PR #6) and `knowledge/snapback-continuation-methods/` (PR #7).

## Docs

| doc | scope |
|---|---|
| 01-envharness-architecture.md | The real google-research/envharness architecture: wrapper algebra, three overridable hooks, Setup replay, mutation loop, budget policies, objectives (source-verified at fab7d57441) |
| 02-acceptance-statistics-matched-nulls.md | Why raw window means are weak acceptance statistics; the matched-null critique; the null-standardized acceptance upgrade path |
| 03-reward-hacking-goodhart-loops.md | Reward hacking and Goodhart effects in harness mutation loops (Garrabrant taxonomy: regressional/extremal/causal/adversarial), specification gaming, mitigations |
| 04-evaluation-time-dependence-windows.md | Trailing windows, drift typologies, EWMA/CUSUM as memory-bearing alternatives, recovery when load stops |
| 05-decision-engine-mechanics-from-harness-data.md | Harness traces as binary incidence matrices; three-tier separation (contracts provable, statistics null-replaceable, execution empirical) feeding a gated decision engine |

## Research summary

Doc 01 was source-verified against the live repo at commit fab7d57441 (the audit-window HEAD; no upstream drift since; the lane even pulled the full source tree into its session workspace and read 11 files). Doc 03 corrected the taxonomy per the primary source (arXiv 1803.04585). Docs 02 and 05 note honestly that harness-specific null literature is thin; their load-bearing claims rest on the yubi-OS program's own 2026-09-01 source audit. All dig results carry jev-1.13 weights.

## Research DB

- `preflight.json` (shared, 2026-10-02), `digs/01.json` .. `digs/05.json`, `archive.json`, `db.ts`, `qc-log.json`
