# 05: Corpus Instruments and the 3-Stage Forecast Cascade

**Scope:** corpus audit gating (`level_dbc = 20*log10(|z|)`, `nulls >= 400`), scorer hysteresis, the taste/edge/spectral/lens/visco instruments, and the 3-stage Clairic + TimesFM 2.5 -> 3.0 + Clef forecast cascade.

**Ground source:** `yubi-OS/yubiOS playbooks/steady-orbit-api.md` (2026-10-21, deploy etag `356cb5c1c2e3e3f8b308ba6e29ab06bf27fd99fc107cc9d7f60b01d0dfb7e6b7`).

> Internal-record subtopic grounded in yubi-OS/yubiOS playbooks/steady-orbit-api.md, no external web dig.

## 1. Corpus RSI gating

Decision 7 sets the gate for corpus recursive-self-improvement rounds:

- **Metric:** `level_dbc = 20*log10(|z|)`, a decibel transform of the null-standardized `z` score.
- **Null budget:** `nulls >= 400`. Fewer nulls means the `z` estimate is too noisy to gate on.
- **Scorer hysteresis:** `{low: 0.45, high: 0.55, pre_row}`. A row must cross 0.55 to flip up and fall below 0.45 to flip down; between the two, it keeps its `pre_row` verdict. This stops a score jittering around 0.5 from flipping the verdict every round.
- **Pre-registration:** the gate inputs are written to `/api/jev/map/outcomes` before measurement (doc 04).

The corpus routes live under `/api/jev/corpus/*` and are covered by `GET /api/jev/corpus/selftest` in the live suite (doc 06).

## 2. Instruments and their sources of record

The worker ships 4 path-qualified fixture modules (doc 01): `fixtures/corpus-math-fixtures.mjs`, `fixtures/taste-fixtures.mjs`, `fixtures/spectral-fixtures.mjs`, `fixtures/lens-fixtures.mjs`. The ground source lists the Python sources of record the worker ports are held to:

| Instrument | Source of record |
|---|---|
| Forecast cascade | `tools/timesfm-clairic-clef/timesfm_clairic_clef.py` |
| ETS forecast | `tools/forecast-standard/forecast_ets.py` |
| Visco | `tools/visco-instruments/verify_visco.py` |
| Edge | `tools/edge-standard/edge_standard.py` |
| Spectral | `tools/spectral-standard/spectral_standard.py` |
| Lens | `tools/lens-standard/lens_standard.py` |

Related skills named by the ground source: `skills/taste-engine/SKILL.md`, `skills/falsification-corpus/SKILL.md`, `skills/jev-corpus/SKILL.md`. The ground source does not enumerate per-instrument formulas, so this doc does not either.

## 3. Two forecast engines on one route

Decision 8 distinguishes 2 engines behind `/api/jev/forecast/:series`:

| Call | Engine | Module | Calibration |
|---|---|---|---|
| `GET /api/jev/forecast/:series?h=N` | damped-trend Holt ETS v2 | `jev-forecast-math.js` | `quality.calibrated: false`; gates `G2` and `NEG_G2` fail honestly |
| `GET ...?engine=cascade` or `POST /api/jev/forecast/:series` | 3-stage SCAMPER cascade | `jev-cascade-forecast.js` | split-conformal (Stage 2) |

The plain ETS path is kept, and it reports its own lack of calibration rather than hiding it. Anything that needs calibrated intervals uses the cascade.

## 4. The 3 stages

**Stage 1, intake:** `@cf/cloudflare/clairic` reads the raw series (messy operational data) and normalizes it. On the 2026-10-21 run, `POST /api/jev/forecast/messy_ops` returned `live_clairic=true` -> `live_workers_ai`, `MASE 0.1971`.

**Stage 2, forecast:** TimesFM 2.5 (Apache-2.0) with split-conformal calibration. A **pre-registered rolling-origin fallback gate** promotes to TimesFM 3.0 when covariate or variate coupling is detected, or when MASE fails. On the 2026-10-21 run, `POST /api/jev/forecast/covariate_shock` triggered the automatic 2.5 -> 3.0 fallback, moving `MASE 1.4224 -> 0.0945`, and came back `needs_approval` on `timesfm_30_non_commercial_weights`. That approval requirement is a licensing control: the 3.0 weights are flagged non-commercial, so using them routes through the approval system (doc 04) rather than happening silently.

**Stage 3, decision:** `@cf/cloudflare/clef` makes a bounded decision, then a **deterministic fail-closed gate** disposes, then the outcome is pre-registered. On `GET /api/jev/forecast/task_state?h=5&engine=cascade` the response was `200`, model `timesfm-2.5-200m`, `clef` choice `wait` at `p=0.7677`, verdict `allowed`.

Consistent with Decision 5: the `p=0.7677` is advice; `allowed` came from the gate.

## 5. Parity and falsification evidence

- **Port parity:** `jev-cascade-forecast.js` vs `tools/timesfm-clairic-clef/timesfm_clairic_clef.py`, max `|delta| <= 1.42e-14`.
- **Live selftest:** `cascade_selftest` 8/8 PASS via `GET /api/jev/timeseries/selftest`.
- **Pre-registered gates:** `G1..G8`, all PASS in the Python source of record shipped in PR [#328](https://github.com/yubi-OS/yubiOS/pull/328) (merged at `eb743c07f5e1b49f9fb36b827449604e0a0de9f5`), alongside `fixtures.json`, `qc-log.json`, `README.md`, and `refs/timesfm-clairic-clef{-solo,}-2026-10-21.md`.
- **CI:** `lean-check.yml` run [39585507995](https://github.com/yubi-OS/yubiOS/actions/runs/39585507995) at `4815c3ae6a7131ff4b77ed31fc96bb9ea6843347`: `check`, `verify-measurements`, `verify-tools` all success, including step 27 `timesfm-clairic-clef cascade selftest (8 pre-registered gates G1..G8)`.

## 6. Time-series substrate

Series come from the Analytics Engine binding `TS` (dataset `jev`), read through WAE SQL with `AE_SQL_TOKEN` (a `secret_text` string, doc 02). The ground source's WAE pitfall applies to every forecast read: `ORDER BY timestamp` requires `timestamp` in the `SELECT` list, else `422 unable to find type of column`. Related skill: `skills/jev-timeseries/SKILL.md`.

## 7. Operating rules

- Need calibrated intervals: use `?engine=cascade` or `POST`; never quote ETS v2 intervals as calibrated.
- Treat `needs_approval` on `timesfm_30_non_commercial_weights` as a real gate, not an error.
- Gate on `level_dbc` only with `nulls >= 400`.
- Any change to the cascade port re-runs parity against the Python source of record and `cascade_selftest` before deploy.
