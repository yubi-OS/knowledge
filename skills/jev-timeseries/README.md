# skills/jev-timeseries: Knowledge Corpus

**Topic:** yubiOS jev-timeseries Skill: Workers Analytics Engine Trajectory Tier, Damped-Trend Holt ETS, and 3-Stage TimesFM+Clairic+Clef Cascade

**Ground source:** `yubi-OS/yubiOS skills/jev-timeseries/SKILL.md`

This corpus documents the time-series layer of the steady-orbit worker: WAE as the disposable trajectory tier beside D1, the bearer-gated timeseries and forecast routes, the pre-registered damped-trend Holt forecaster and its honestly failing G2 gate, the 3-stage Clairic + TimesFM + Clef cascade, the 2026-10-08 deploy lessons, and the /jev/ console Forecast card. Forecasts in this layer are advisory, never gate-authorizing.

## Documents

| NN | doc | scope | outline score |
|---|---|---|---|
| 01 | [01-wae-trajectory-tier-and-series-schema.md](01-wae-trajectory-tier-and-series-schema.md) | WAE dataset `jev` schema (`index1`, `blob1..3`, `double1..2`), fire-and-forget `tsWrite`, D1 vs WAE separation | 1.8713 |
| 02 | [02-bearer-gated-timeseries-and-forecast-routes.md](02-bearer-gated-timeseries-and-forecast-routes.md) | Route contracts for `/api/jev/timeseries/selftest`, `/series`, and GET/POST `/api/jev/forecast/:series` (internal record) | 1.5462 |
| 03 | [03-ets-forecaster-contract-and-honest-g2-failure.md](03-ets-forecaster-contract-and-honest-g2-failure.md) | Damped-trend Holt ETS (19x19 grid, phi 0.98), G1..G6 gates, why G2/NEG_G2 ship failing with `quality.calibrated=false` | 1.9440 |
| 04 | [04-hybrid-cascade-engine-clairic-timesfm-clef.md](04-hybrid-cascade-engine-clairic-timesfm-clef.md) | Cascade engine: Clairic intake, TimesFM 2.5 -> 3.0 conformal fallback, Clef decision + outcomes pre-registration (internal record) | 1.8480 |
| 05 | [05-wae-sql-and-worker-deploy-lessons.md](05-wae-sql-and-worker-deploy-lessons.md) | 5 deploy lessons: `secret_text` string shape, `timestamp` in SELECT for ORDER BY, curl `-F` framing, WAE lag, `X-Sauna-Connection-Id: none` | 1.2738 |
| 06 | [06-jev-console-forecast-card-and-guidelines.md](06-jev-console-forecast-card-and-guidelines.md) | /jev/ Corpus tab Forecast card (`jevfc-*`, engine selector, Live Clairic, stat tiles) and the 4 operating guidelines (internal record) | 0.9279 |

Outline validation: clef `score` metric, criteria lowest-first (`padding: drop` / `marginal: keep only if the dig comes back strong` / `load-bearing: core subtopic`). Dropped: none. Kept: 01..06. Doc 06 (score 0.9279) and doc 05 (score 1.2738) sit closest to the marginal band; 05 was kept on a dig with 4 of 10 results at weight >= 0.5, and 06 is an internal-record doc grounded directly in the SKILL.md.

Docs 02, 04, and 06 are internal-record subtopics grounded in `yubi-OS/yubiOS skills/jev-timeseries/SKILL.md`, no external web dig. Docs 01, 03, and 05 cite Clef-weighted searXNG dig results with inline weights and a Sources Considered table.

## Research summary

| metric | value |
|---|---|
| results collected | 30 |
| high weight (>= 0.5) | 13 |
| low weight (< 0.5) | 17 |
| jev requests | 7 |
| redos | 0 |
| skips | 0 |

Per-doc high-weight split: 01: 6/10, 03: 3/10, 05: 4/10.

**Preflight:** Preflight 2026-10-21: searXNG 59 results healthy; /api/decide (clef) 200

## Gaps recorded

- Doc 01: the outline scope names an isolate-local `tsWriteStats()` counter; the ground source does not document it, so no contract is stated.
- Doc 02: the outline scope names a `/api/jev/timeseries/export` route; the ground source does not document it, so no contract is stated.
- Doc 04: `commercial_mode` semantics, conformal calibration slice size, and rolling-origin cut count are not recorded in the ground source.
- Doc 06: the outline says 8 stat tiles; the ground source lists 4 base tiles plus 5 cascade-mode items without stating how they group.

## Research DB

`research-db/` holds `preflight.json`, `outline.json`, `archive.json`, `digs/`, `jev-log.json`, and `db.ts`.
