# 07 - jev-timeseries integration design

Scope: How the pieces compose for jev-timeseries: deterministic ETS in the worker, offline TimesFM 2.5 via a box-side bridge, WAE as trajectory tier, D1 as append-only system of record.

This doc is a design doc. Its grounding is a working spec (SPEC-TIMESERIES-2026-10-08) plus the weighted sources from docs 01 and 06. Design choices that come from the spec are marked as such; claims about the platforms carry their source weights.

## The composition

The jev orchestrator on the steady-orbit worker keeps D1 as the append-only system of record. The design adds a second storage tier: Workers Analytics Engine (WAE) as the trajectory/telemetry tier, and a forecasting layer that is advisory only. Three layers, one rule: forecasts never gate-authorize (spec, section 7; the noul-style advisory framing follows the jev decision-model conventions).

## Storage mapping onto WAE

The WAE data point schema (doc 06, weight 0.59 for get-started, 0.57 for limits) maps onto the spec's series schema with a dataset binding `TS` pointing at dataset `jev`:

- `index1` = the series name (the sampling key and the SQL filter column).
- `blob1..3` = identifiers and dimensions (task ids, states, tool names).
- `double1` = the primary value, `double2` = the secondary value (0 when absent).

Five series are defined: `task_state`, `task_terminal`, `corpus_run`, `approval`, `evolution_cycle`. Two constraints from doc 06 shape the design directly:

- 250 data points per Worker invocation caps any single request's burst of writes.
- The single index per data point (multiple indexes cause the point to be dropped) is why the series name lives in `index1` rather than in a blob.

Safety rules from the spec: `tsWrite` never throws into the request path (full try/catch; failure logs `ts_write_failed` and moves on), and `writeDataPoint()` is fire-and-forget per the docs (weight 0.59), so telemetry cannot break orchestration. Telemetry must not break orchestration is the invariant; the WAE write API's no-await contract is what makes that cheap to honor.

## Reads: SQL API with a scoped token

Reads go through the WAE SQL API (`POST https://api.cloudflare.com/client/v4/accounts/<account_id>/analytics_engine/sql`, bearer auth, weight 0.59). The design reads a series with a validated, quoted literal:

`SELECT timestamp, double1 FROM jev WHERE index1 = '<series>' ORDER BY timestamp ASC LIMIT 1000`

The series name must match `^[a-z_]+$` before interpolation. The read token is an Account | Account Analytics | Read token (the same permission the docs prescribe, weight 0.59), delivered to the worker as a `secret_text` binding named `AE_SQL_TOKEN` (spec section 5; a Secrets Store write was 401 on the managed connection, so secret_text is the working path). Error handling fails closed with named reasons: `503 MISSING_READ_TOKEN`, `422 BAD_SERIES_NAME`, `502 WAE_SQL_ERROR` carrying the truncated upstream body.

Sampling awareness is mandatory on this read path. Because WAE samples hot indexes (doc 06, weight 0.63), any aggregate read must use the weighted forms: `sum(_sample_interval)` instead of `count()`, and weighted averages/quantiles. The forecast path reads raw per-event rows, so it must at minimum record and expose the `_sample_interval` distribution it saw.

## Forecasting: deterministic ETS in the worker, TimesFM offline

Phase 1 (spec section 3) is a pure deterministic ETS in the worker: damped-trend Holt, no seasonality, grid-searched alpha/beta over {0.05..0.95} with phi fixed at 0.98, fit on the holdout tail (last 20%, min 2 points), deterministic tie-break (lower alpha, then lower beta). Bands are 1.96 x residual_sd x sqrt(i) from holdout residual RMS, with honest quality flags: `insufficient_series` below 8 points (forecast null), `low_r2` when holdout R^2 < 0.5. A falsification harness (trend recovery, band coverage, byte-identical determinism, insufficiency, JS/Python parity at 1e-9, flat-series sanity) gates the implementation before it ships.

Phase 3 is where TimesFM enters, and the license boundary from doc 01 is the deciding fact: TimesFM 2.5 weights are Apache-2.0 (repo README, weight 0.60), while TimesFM 3.0 weights are non-commercial with commercial use routed through Google Cloud services. So the design pins offline inference to TimesFM 2.5 (200M, 16k context, optional 30M continuous quantile head, doc 01/04), executed box-side via the shell bridge, never inside the worker. The bridge returns point and quantile forecasts; the worker treats them exactly like its own ETS output: advisory payloads with named quality fields.

## Why this split

- D1 stays the append-only system of record (spec, source of truth for events and approvals). Nothing in the WAE tier replaces it.
- WAE absorbs high-volume, low-durability trajectory writes where 3-month retention (doc 06, weight 0.57) is acceptable and sampling is a feature, not a defect: the aggregate queries it serves are statistical, and `_sample_interval` makes them correct.
- The worker stays deterministic and cheap; the foundation model stays off the request path (its inference cost and the box-side execution requirement are spec section 7 non-goals: no TimesFM in the worker).
- Every forecast, from either source, is advisory: noul-style probability-adjacent output that a human or the policy gate can consult, but never the thing that authorizes an action.

## Gaps in this doc

- The D1-vs-WAE boundary is a design choice from the spec, not a pattern with a cited external source in this run's archive; the closest weighted grounding is Cloudflare's storage-options guide placing Analytics Engine as the time-series tier (weight 0.63).
- No weighted source in this run covers ETS/Holt formal references; the ETS contract is pre-registered in the spec itself.

## Sources considered

| Source | URL | Type | Weight |
|---|---|---|---|
| WAE get-started | https://developers.cloudflare.com/analytics/analytics-engine/get-started/ | primary (docs) | 0.62 |
| WAE product docs | https://developers.cloudflare.com/analytics/analytics-engine/ | primary (docs) | 0.64 |
| Storage options | https://developers.cloudflare.com/workers/platform/storage-options/ | primary (docs) | 0.63 |
| WAE limits | https://developers.cloudflare.com/analytics/analytics-engine/limits/ | primary (docs) | 0.57 (doc 06) |
| WAE SQL API | https://developers.cloudflare.com/analytics/analytics-engine/sql-api/ | primary (docs) | 0.59 (doc 06) |
| Sampling explainer | https://developers.cloudflare.com/analytics/sampling/ | primary (docs) | 0.63 (doc 06) |
| timesfm README (license boundary) | https://github.com/google-research/timesfm | primary (repo) | 0.60 |
| SPEC-TIMESERIES-2026-10-08 | internal working spec | design input | n/a |
