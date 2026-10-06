# evolution-v2-capability-map

Knowledge corpus minted 2026-10-05 from yubi-OS/yubiOS refs/evolution-v2-capability-map-2026-10-01.md.

Topic: the evolution v2 capability map, what the jev decision model's full surface adds over evolution v1, paper-derived loop primitives (null-standardized claims, standard candles, exclusion-only verdicts), and the reassessed worker module map.

## Docs

- docs/01-jev-decision-surface.md - What the jev-1.13 decision model's full typed surface (noul, score 0-9, choice, confidence routing, session grouping, consumed cost tracking) adds over evolution v1's implicit prose-only use.
- docs/02-atom-invariants.md - Paper-derived gating invariants for a self-improvement loop: single-action atom with d_pre/d_post/delta and a stay option, delta >= 0 as bug alarm, cumulative monotonicity vs per-cycle increments, and the identity/measurement boundary that keeps machine-checkable identities out of the human gate.
- docs/03-fit-quality-gate.md - The PC1+PC2 >= 0.40 concentration gate: any principal-component fit used for scoring must clear the explained-variance floor or it is not used, plus the atomicity diagnostic that checks the measurement basis carries information before derived scores are trusted.
- docs/04-null-standardized-verdicts.md - Null-standardized improvement claims: no effect reported raw, z against a matched null (label-permutation / null-delivery ensembles), and exclusion-only verdicts (excluded / not-excluded / not-tested) emitted at |z| > 3 instead of narratives.
- docs/05-standard-candle-calibration.md - Round-trip validation and the standard candle: periodically planting a known-outcome directive the loop must detect, measuring detection power, catching approve-nothing and approve-everything loops, plus selection-null discipline when the loop tunes its own thresholds.
- docs/06-dbc-scale-and-dynamics.md - Reporting and audit instruments: the dBc level scale (20 log10 of delta over null sigma) for cross-cycle comparability, the anti-caustic guard on exact 1.0000 passes, fixpoint termination when peak delta falls below epsilon, and the dynamics audit over the append-only event log (f_back, absorbing states, flip rate).
- docs/07-sparse-cells-and-point-map.md - The corpus audit lens: per-artifact coverage vectors placed on a sphere, sparse cells driving the next proposals (llc App B), and point-map memory-layer discipline: frozen frames, identity keys, rule_hash, changed-vs-silent names, named-neighbour ledger, matched-null placement.
- docs/08-worker-module-map.md - The reassessed evolution v2 module map (A trigger + machine-cycle, B atom ledger + calibration, C memory + recall, D execution + notify, E preflight + verify, F jev quality assessment), the Cloudflare surface it maps onto (Cron restore, Queues, Vectorize, D1, R2 and DO non-goals), and the lane plan.

## Research summary

- Results collected: 92
- Weight split: 40 at weight >= 0.5 (authoritative backing), 52 at weight < 0.5 (weak backing, labeled as such in the docs)
- Jev requests: 21 (usage 16837 input / 0 output tokens), via clef on /api/decide
- Dig redos: 0 (all 16 queries returned usable results on attempt 1)
- Decide retries: 1 batch hit HTTP 429 and succeeded on the retry per the redo protocol; no results shipped unweighted
- Skipped docs: none

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## Per-doc sources

| doc | results kept | primary (>= 0.5) | low (< 0.5) |
|---|---|---|---|
| 01-jev-decision-surface | 12 | 4 | 8 |
| 02-atom-invariants | 12 | 6 | 6 |
| 03-fit-quality-gate | 10 | 3 | 7 |
| 04-null-standardized-verdicts | 11 | 6 | 5 |
| 05-standard-candle-calibration | 12 | 4 | 8 |
| 06-dbc-scale-and-dynamics | 12 | 6 | 6 |
| 07-sparse-cells-and-point-map | 12 | 3 | 9 |
| 08-worker-module-map | 11 | 8 | 3 |
