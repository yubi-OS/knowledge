# 01. What shipped

**Scope:** What shipped: detailed analysis grounded in yubi-OS/yubiOS refs/jev-timeseries-2026-10-08.md.

> Ground source: yubi-OS/yubiOS refs/jev-timeseries-2026-10-08.md. External dig: dig_context_01.json (10 Clef-weighted searXNG results).

## Summary

The 2026-10-08 build added two capabilities to /jev/: a disposable trajectory store for orchestration events, and a forecaster that reads that store and returns a short-horizon prediction with honest quality flags. Everything below is taken from `yubi-OS/yubiOS refs/jev-timeseries-2026-10-08.md` unless a dig source is cited.

## 1. The WAE storage tier

The worker gained a new binding named `TS` of type `analytics_engine`, writing to a dataset called `jev`, plus a `secret_text` binding `AE_SQL_TOKEN` that holds an Account Analytics Read token. Each datapoint uses a fixed layout: `index1` carries the series name, `blob1` to `blob3` carry identifiers, and `double1` to `double2` carry numeric values.

That fixed positional layout follows the platform contract. Cloudflare documents that `writeDataPoint()` accepts ordered arrays of values, so fields must be supplied in a consistent order, per [Get started with Workers Analytics Engine · Cloudflare Analytics...](https://developers.cloudflare.com/analytics/analytics-engine/get-started/) (clef weight: 0.5652). The product overview describes WAE as unlimited-cardinality analytics with a built-in write API from Workers and a SQL API to query the data, per [Workers Analytics Engine (beta) · Cloudflare Analytics docs](https://developers.cloudflare.com/analytics/analytics-engine/) (clef weight: 0.6218). The read path uses the SQL API, an HTTP API hosted under api.cloudflare.com, per [Workers Analytics Engine SQL API · Cloudflare Analytics docs](https://developers.cloudflare.com/analytics/analytics-engine/sql-api/) (clef weight: 0.6437), which is why the build needed a separate read token rather than reusing the write binding. The 2022 launch post describes the binding pattern (declare it in Wrangler, get an environment variable exposing `writeDataPoint()`), per [Introducing Workers Analytics Engine / Cloudflare Blog](https://blog.cloudflare.com/workers-analytics-engine/) (clef weight: 0.4210) (weak backing, clef weight < 0.5). A third-party guide frames WAE as edge event logging without client-side scripts, per [Cloudflare Workers Analytics: Developer Guide / MetricsWave](https://metricswave.com/blog/analytics-for-cloudflare-workers) (clef weight: 0.2015) (weak backing, clef weight < 0.5); it adds no fact the build relies on.

Write sites are deliberately narrow:

- A wrapped `deps.transit` emits the `task_state` and `task_terminal` series.
- `recordRun` emits `corpus_run`.
- Approval create, approve, and reject emit `approval`.

`tsWrite` swallows every error. The design rule is that telemetry never breaks orchestration. D1 remains the append-only system of record; WAE is classified as the disposable trajectory tier with 3-month retention, and the source notes that sampling is irrelevant at jev's volume.

## 2. Forecast routes

Three bearer-gated routes fail closed with named errors:

| Route | Purpose |
|---|---|
| `GET /api/jev/timeseries/selftest` | Math gates, a WAE probe, and a schema probe |
| `GET /api/jev/timeseries/series` | Series inventory |
| `GET /api/jev/forecast/:series?h=N` | SQL read, then ETS forecast with quality flags |

The code lives in two new bundle parts: `jev-timeseries.js` (the 52nd part) and `jev-forecast-math.js` (the 53rd).

## 3. The forecaster

Version 1 is a damped-trend Holt ETS with no seasonality. Its parameter search is pre-registered: alpha and beta each range over 0.05 to 0.95, phi is fixed at 0.98, and the holdout is the last 20% of the series. The prediction band is `1.96 * residual_sd * sqrt(i)` at step i. Two flags guard output quality: `insufficient_series` when n < 8, and `low_r2`. JavaScript and Python agree with max |delta| = 0 on 4 fixtures, and the Python source of record is `tools/forecast-standard/forecast_ets.py`.

## 4. Console card

A Forecast card was added to the /jev/ Corpus tab with the `jevfc-` CSS prefix, built as a sibling of the spectral card, reading the operator key from sessionStorage `jev_key`. The KV write was byte-verified.

## 5. The TSFM landscape corpus

The directive asked to explore Google Research's TimesFM. The build produced yubi-OS/knowledge PR #334 (draft `timesfm-tsfm-landscape`, 7 docs, research-db v2, 168/168 results weighted, $0.004 of jev spend). The primary TimesFM sources in this dig agree with what that corpus recorded: the arXiv paper 2310.10688 describes a decoder-only time-series foundation model with strong zero-shot performance, per [[2310.10688] A decoder-only foundation model for time-series ...](https://arxiv.org/abs/2310.10688) (clef weight: 0.8560); the Google Research blog states it was accepted at ICML 2024 and pre-trained on a large time-series corpus, per [A decoder-only foundation model for time-series forecasting](https://research.google/blog/a-decoder-only-foundation-model-for-time-series-forecasting/) (clef weight: 0.7828); the GitHub repository describes TimesFM as a pretrained forecasting foundation model, per [GitHub - google-research/timesfm: TimesFM (Time Series Foundation Model ...](https://github.com/google-research/timesfm/) (clef weight: 0.8777); and the Hugging Face card for `timesfm-1.0-200m` repeats that description, per [google/timesfm-1.0-200m · Hugging Face](https://huggingface.co/google/timesfm-1.0-200m) (clef weight: 0.5898). A Hacker News thread voices skepticism about whether foundation-model forecasting is a sound task at all, per [TimesFM: Time Series Foundation Model for time-series forecastin…](https://news.ycombinator.com/item?id=40297946) (clef weight: 0.0377) (weak backing, clef weight < 0.5). It is opinion and backs no claim here.

The source records one correction inside that corpus: arXiv:2411.04095 is NOT the TimesFM 2.0 paper. It also records why v1 uses classical ETS rather than TimesFM in-worker: TimesFM 2.5 (Apache 2.0, 200M parameters, 16k context, quantile head) is a Phase 3 item to run offline on the box.

## Reading the result

The build ships a minimal, auditable stack: a write path that cannot hurt orchestration, a read path that fails closed, and a forecaster small enough to port byte-for-byte between Python and JavaScript. The heavier foundation-model option is grounded but deferred.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | A decoder-only foundation model for time-series forecasting | https://research.google/blog/a-decoder-only-foundation-model-for-time-series-forecasting/ | 0.7828 | authoritative (>= 0.5) |
| 2 | GitHub - google-research/timesfm: TimesFM (Time Series Foundation Model ... | https://github.com/google-research/timesfm/ | 0.8777 | authoritative (>= 0.5) |
| 3 | TimesFM: Time Series Foundation Model for time-series forecastin… | https://news.ycombinator.com/item?id=40297946 | 0.0377 | weak (< 0.5) |
| 4 | google/timesfm-1.0-200m · Hugging Face | https://huggingface.co/google/timesfm-1.0-200m | 0.5898 | authoritative (>= 0.5) |
| 5 | [2310.10688] A decoder-only foundation model for time-series ... | https://arxiv.org/abs/2310.10688 | 0.8560 | authoritative (>= 0.5) |
| 6 | Workers Analytics Engine SQL API · Cloudflare Analytics docs | https://developers.cloudflare.com/analytics/analytics-engine/sql-api/ | 0.6437 | authoritative (>= 0.5) |
| 7 | Introducing Workers Analytics Engine / Cloudflare Blog | https://blog.cloudflare.com/workers-analytics-engine/ | 0.4210 | weak (< 0.5) |
| 8 | Get started with Workers Analytics Engine · Cloudflare Analytics... | https://developers.cloudflare.com/analytics/analytics-engine/get-started/ | 0.5652 | authoritative (>= 0.5) |
| 9 | Workers Analytics Engine (beta) · Cloudflare Analytics docs | https://developers.cloudflare.com/analytics/analytics-engine/ | 0.6218 | authoritative (>= 0.5) |
| 10 | Cloudflare Workers Analytics: Developer Guide / MetricsWave | https://metricswave.com/blog/analytics-for-cloudflare-workers | 0.2015 | weak (< 0.5) |
