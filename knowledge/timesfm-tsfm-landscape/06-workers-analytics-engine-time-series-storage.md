# 06 - Workers Analytics Engine as time-series storage

Scope: Cloudflare Workers Analytics Engine as the storage tier: writeDataPoint schema (blobs/doubles/index), dataset binding, sampling, SQL API, and 3-month retention.

## What it is

Workers Analytics Engine (WAE) is Cloudflare's time-series and metrics store: "unlimited-cardinality analytics at scale, via a built-in API to write data points from Workers, and a SQL API to query that data" (product docs: https://developers.cloudflare.com/analytics/analytics-engine/, weight 0.64). Cloudflare's own storage-selection guide categorizes it as the time-series and metrics database in the Workers data lineup (https://developers.cloudflare.com/workers/platform/storage-options/, weight 0.63). The launch blog positions it as analytics at minimal or no cost with unbounded cardinality (https://blog.cloudflare.com/workers-analytics-engine/, weight 0.59).

## The data point schema

A data point is a structured event with three parts (get-started: https://developers.cloudflare.com/analytics/analytics-engine/get-started/, weight 0.59):

- blobs (strings): the dimensions used for grouping and filtering, sometimes called labels in other metrics systems.
- doubles (numbers): the numeric values recorded in the data point.
- indexes (strings): the sampling key.

Operational constraints on `writeDataPoint()` (same source plus the limits page, weight 0.57):

- Values are ordered arrays: fields must be provided in a consistent order.
- The indexes field accepts an array, but currently only a single index may be provided; providing multiple indexes means the data point is NOT recorded.
- Up to 20 blobs, 20 doubles, and 1 index per call.
- Total blob size must not exceed 16 KB per individual data point (this applies per data point even when batching with `writeDataPoints()`).
- Each index must not exceed 96 bytes.
- Maximum 250 data points per Worker invocation (per client HTTP request).
- You do not need to await `writeDataPoint()`; it returns immediately and the runtime writes in the background. This fire-and-forget behavior is what lets a telemetry write sit inside a request path without latency cost.

Binding. A dataset is declared in the Wrangler configuration under `analytics_engine_datasets` with a binding name and dataset name; datasets are created automatically the first time you write to them after defining the binding (get-started, weight 0.59). A dataset is like a table in SQL: rows and columns should have consistent meaning.

## Sampling (the part that changes how you query)

WAE uses weighted adaptive sampling, sampling on write (when data points are written too quickly into one index) and again on read (when a query is too complex) (https://developers.cloudflare.com/analytics/analytics-engine/sampling/, weight 0.35 in archive; the general Cloudflare sampling explainer at https://developers.cloudflare.com/analytics/sampling/ carries weight 0.63).

Key mechanics:

- Sampling is keyed on the index, so only indexes receiving large numbers of events get sampled. The index choice is therefore a design decision: make it the key whose per-key accuracy you need preserved.
- Equitable sampling equalizes the number of stored events per unique index value: uncommon index values may keep every data point, while hot indexes get sampled.
- Every event records `_sample_interval`, the inverse of the sample rate (a 1% sample rate yields `_sample_interval` = 100). It represents how many unsampled data points a stored row stands for.
- The interval can vary per row, so simply multiplying results by a constant is NOT sufficient. Weighted aggregates are required (SQL API page, weight 0.59):

| Use case | Unsampled | Sampled |
|---|---|---|
| Count events | count() | sum(_sample_interval) |
| Sum a quantity | sum(bytes) | sum(bytes * _sample_interval) |
| Average | avg(bytes) | sum(bytes * _sample_interval) / sum(_sample_interval) |
| Quantile | quantile(0.50)(bytes) | quantileExactWeighted(0.50)(bytes, _sample_interval) |

## SQL API

The SQL API is an HTTP API at `https://api.cloudflare.com/client/v4/accounts/<account_id>/analytics_engine/sql`, authenticated with a bearer token; the dashboard path to mint one is Create Custom Token with the permission Account | Account Analytics | Read (https://developers.cloudflare.com/analytics/analytics-engine/sql-api/, weight 0.59). The query text goes in the POST body, with a FORMAT option controlling the response shape; `SHOW TABLES` confirms which datasets exist.

A table is created automatically per dataset once events are written. Columns (same source):

| Column | Type | Meaning |
|---|---|---|
| dataset | string | dataset name on every row |
| timestamp | DateTime | when the event was logged by the worker |
| _sample_interval | integer | sampling weight for this row |
| index1 | string | the index value; the sampling key |
| blob1 ... blob20 | string | blob values |
| double1 ... double20 | double | double values |

Note the distinction the docs draw: this endpoint and its dialect are separate from the account-wide Analytics SQL API, where WAE data is reached via `events.analyticsEngine.<DATASET_NAME>` with non-identifier dataset names double-quoted.

## Retention

"Data written to Workers Analytics Engine is stored for three months" (limits page: https://developers.cloudflare.com/analytics/analytics-engine/limits/, weight 0.57). Cloudflare's instrumentation blog describes how they run their own systems on WAE with Adaptive Bit Rate sampling to keep queries fast on large data (https://blog.cloudflare.com/using-analytics-engine-to-improve-analytics-engine/, weight 0.63).

## Sources considered

| Source | URL | Type | Weight |
|---|---|---|---|
| WAE product docs | https://developers.cloudflare.com/analytics/analytics-engine/ | primary (docs) | 0.64 |
| Storage options guide | https://developers.cloudflare.com/workers/platform/storage-options/ | primary (docs) | 0.63 |
| Get started | https://developers.cloudflare.com/analytics/analytics-engine/get-started/ | primary (docs) | 0.59 |
| SQL API | https://developers.cloudflare.com/analytics/analytics-engine/sql-api/ | primary (docs) | 0.59 |
| Limits | https://developers.cloudflare.com/analytics/analytics-engine/limits/ | primary (docs) | 0.57 |
| Sampling explainer | https://developers.cloudflare.com/analytics/sampling/ | primary (docs) | 0.63 |
| Cloudflare instrumentation blog | https://blog.cloudflare.com/using-analytics-engine-to-improve-analytics-engine/ | primary (blog) | 0.63 |
| Launch blog | https://blog.cloudflare.com/workers-analytics-engine/ | primary (blog) | 0.59 |
| WAE sampling page | https://developers.cloudflare.com/analytics/analytics-engine/sampling/ | primary (docs) | 0.35 |
| Write example | https://developers.cloudflare.com/workers/examples/analytics-engine/ | primary (docs) | 0.55 |
| Community thread | https://community.cloudflare.com/t/analytics-engine-sampling-and-some-more/49820 | forum | 0.34 |
