# 01: WAE Trajectory Tier and Series Schema

**Scope.** Workers Analytics Engine dataset `jev` schema (`index1`, `blob1..3`, `double1..2`), fire-and-forget `tsWrite`, and the D1 vs WAE separation.

**Ground source:** `yubi-OS/yubiOS skills/jev-timeseries/SKILL.md` (sections "Series schema (WAE dataset `jev`)" and "Guidelines"). External claims below are backed by the Clef-weighted searXNG dig in `dig_context_01.json`; each citation carries its clef weight inline.

## 1. Two tiers, two jobs

The ground source states the split directly: Workers Analytics Engine (WAE) is the **trajectory tier** and D1 "stays the append-only system of record". Guideline 1 repeats it in operational terms: D1 is the system of record; WAE is "the disposable trajectory tier (3-month retention, sampling on high-volume indexes, not expected at jev volume)".

The consequence for anyone extending the layer:

- Orchestration truth (task state, approvals, corpus runs) is written to D1 first. WAE receives a copy shaped for time-series reads.
- Losing WAE data degrades forecasts and the `/series` inventory; it never loses an orchestration fact.
- Forecasts read from WAE are therefore advisory. A forecast that feeds a gate decision must first record a `{predicted, realized}` pair into the outcomes ledger (Guideline 2).

Cloudflare describes WAE as a product that "provides unlimited-cardinality analytics at scale, via a built-in API to write data points from Workers, and a SQL API to query that data" (https://developers.cloudflare.com/analytics/analytics-engine/ (clef weight: 0.5976); the same page surfaced under the schema query at (clef weight: 0.8093)). That two-sided shape (write from the runtime, read via SQL over HTTP) is exactly what the jev layer uses.

## 2. The write path: `writeDataPoint()`

Once a binding is declared, "you get a new environment variable in the Workers runtime that represents your Analytics Engine. This variable has a method, writeDataPoint ()" (https://blog.cloudflare.com/workers-analytics-engine/ (clef weight: 0.5476)).

Two properties of that API shape the jev schema:

1. **Ordered arrays.** "Currently, the writeDataPoint() API accepts ordered arrays of values. This means that you must provide fields in a consistent order" (https://developers.cloudflare.com/analytics/analytics-engine/get-started/ (clef weight: 0.6597)). Position, not name, is the contract. In jev, `blob1` is always the primary id, `blob2` and `blob3` are dimensions, `double1` is the primary value.
2. **Automatic timestamp.** The same get-started page (surfaced again in the 05 dig) notes that every event written from the runtime is automatically populated with a timestamp field, which is why the jev schema carries no explicit time column.

In the ground source, `writeDataPoint()` is described as fire-and-forget, and the jev wrapper `tsWrite(env, series, {blobs, doubles})` "swallows every error (`console.warn("ts_write_failed", ...)`)". The design rule: telemetry must never break orchestration.

## 3. The `jev` dataset schema

One datapoint per event. `index1` carries the series name, so one dataset holds every series and `GROUP BY index1` produces the inventory.

| series | blob1 | blob2 | blob3 | double1 | write site |
|---|---|---|---|---|---|
| `task_state` | task_id | from_state | to_state | 1 | wrapped `deps.transit` (jev-main `buildDeps`) |
| `task_terminal` | task_id | tool | terminal_state | 1 (cost_usd when present) | same wrapper, terminal states only |
| `corpus_run` | run_id | kind | policy_version | `level_dbc ?? dbc ?? 0` | inside `recordRun` (jev-corpus-routes) |
| `approval` | approval_id | task_id | created/approved/rejected | 1 | `createApproval` + approve/reject legs (jev-review) |

`double2` is reserved as the secondary value; the ground source table does not assign it for any of the 4 current series.

The table name in WAE SQL "is the name you specified as `dataset` when configuring the workers binding" (https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/statements/index.md (clef weight: 0.8067)), so the binding's `dataset: "jev"` is what makes `FROM jev` resolve.

A community schema template follows the same convention (blobs as dimensions, `double2: count (always 1)`, `index1` as the high-cardinality key) (https://github.com/caezium/skills/blob/main/cloudflare/references/analytics-engine/patterns.md (weak backing, clef weight < 0.5) (clef weight: 0.3248)). It is consistent with the jev layout but carries no authority here.

## 4. Choosing `index1`

The jev schema puts the **series name** in `index1`, not a per-entity id. Two reasons:

- Sampling is keyed on the index. The SQL API page (cited from the 05 dig) states that sampling "is based on the index of your dataset so that only indexes that receive large numbers of events will be sampled". With 4 low-volume series names, jev volume is not expected to trigger sampling (ground source Guideline 1).
- The inventory route depends on it: `SELECT index1 AS series, COUNT() AS n, MIN(timestamp), MAX(timestamp) FROM jev GROUP BY index1`.

## 5. The read side

"The Workers Analytics Engine SQL API is an HTTP API that allows executing SQL queries against your Workers Analytics Engine datasets", hosted at `https://api.cloudflare.com/client/v4/accounts/<account>/analytics_engine/sql`, with a dialect separate from the Analytics GraphQL layer (https://developers.cloudflare.com/analytics/analytics-engine/sql-api/ (clef weight: 0.6815)). The jev worker calls it with `AE_SQL_TOKEN`; column and ordering pitfalls are covered in doc 05.

## 6. Adding a series write site (procedure)

From the ground source "Examples":

1. Import `tsWrite` in the owning module.
2. Call it **after** the D1 write, using the schema table shape.
3. Add the series name to the console selector and to the SKILL.md table.
4. Never block the request path on the write.

Series names must match `^[a-z_]+$` or the forecast route returns `422 BAD_SERIES_NAME` (doc 02).

## 7. Gap noted

The outline scope for this doc names an isolate-local `tsWriteStats()` counter. The ground source as read does not document `tsWriteStats()`, so this doc does not specify its contract. Treat it as unspecified until the SKILL.md records it.

## Sources Considered

| # | URL | clef weight | backing | used |
|---|---|---|---|---|
| 1 | https://developers.cloudflare.com/analytics/analytics-engine/sql-api/ | 0.6815 | authoritative | yes (s5) |
| 2 | https://blog.cloudflare.com/workers-analytics-engine/ | 0.5476 | authoritative | yes (s2) |
| 3 | https://developers.cloudflare.com/analytics/analytics-engine/get-started/ | 0.6597 | authoritative | yes (s2) |
| 4 | https://developers.cloudflare.com/analytics/analytics-engine/ | 0.5976 | authoritative | yes (s1) |
| 5 | https://metricswave.com/blog/analytics-for-cloudflare-workers | 0.0633 | weak backing, clef weight < 0.5 | no (aggregator) |
| 6 | https://developers.cloudflare.com/analytics/analytics-engine/ (schema query) | 0.8093 | authoritative | yes (s1) |
| 7 | https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/statements/index.md | 0.8067 | authoritative | yes (s3) |
| 8 | https://www.cloudflare.com/ | 0.0339 | weak backing, clef weight < 0.5 | no (marketing) |
| 9 | https://github.com/caezium/skills/blob/main/cloudflare/references/analytics-engine/patterns.md | 0.3248 | weak backing, clef weight < 0.5 | yes, labeled (s3) |
| 10 | https://blog.cloudflare.com/yandex-outage | 0.0421 | weak backing, clef weight < 0.5 | no (off-topic) |

6 of 10 results at weight >= 0.5.
