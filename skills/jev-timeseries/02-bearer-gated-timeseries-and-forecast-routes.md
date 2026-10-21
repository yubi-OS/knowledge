# 02: Bearer-Gated Timeseries and Forecast Routes

**Scope.** Route contracts for `GET /api/jev/timeseries/selftest`, `GET /api/jev/timeseries/series`, `GET /api/jev/forecast/:series`, and `POST /api/jev/forecast/:series` on the steady-orbit worker (`https://steady-orbit.systems-a.workers.dev`).

**Ground source:** `yubi-OS/yubiOS skills/jev-timeseries/SKILL.md` (section "Routes (all bearer-gated via the operator key)").

> Internal-record subtopic grounded in yubi-OS/yubiOS skills/jev-timeseries/SKILL.md, no external web dig.

## 1. Auth model

Every route in this layer is bearer-gated by the **operator key**. There is no public read path. Two practical consequences:

- Callers from a Sauna session pass the `Steady Orbit jev operator` connection so the proxy injects the bearer.
- To test a **no-auth** path (expecting 401), the request must carry `X-Sauna-Connection-Id: none`. Passing the operator connection injects the bearer on every fetch and contaminates the 401 check (deploy lesson 5, doc 05).

## 2. `GET /api/jev/timeseries/selftest`

Runs four probe groups in one call:

| probe | what it checks |
|---|---|
| math gates G1..G6 | ETS falsification gates (doc 03) |
| `cascade_selftest` | 8 pre-registered cascade gates G1..G8, all PASS |
| WAE write/read-back | writes a datapoint and tries to read it back |
| schema probe | `meta.columns` and `has_timestamp` from a live `SELECT *` |

**Honest top-level failure.** The route returns top-level `ok:false` while the pre-registered ETS v2 gates G2 and NEG_G2 fail; `cascade_selftest.ok` is `true` in the same response. Per the ground source this is by design: `ok:false` is **not** a deploy failure, and the gates are never changed to make it pass.

**Read-back lag.** WAE SQL reads lag writes by a few seconds, so the probe reports `wae_read_back ok=true` with an honest "0 rows read back; propagation lag" note rather than failing.

**Schema arbiter.** `wae_schema_probe` is the empirical answer to any column-name question; the live `SELECT *` column list beats any doc.

## 3. `GET /api/jev/timeseries/series`

The inventory route. It runs exactly:

```sql
SELECT index1 AS series, COUNT() AS n, MIN(timestamp), MAX(timestamp)
FROM jev GROUP BY index1
```

It returns one row per series name present in the dataset (`task_state`, `task_terminal`, `corpus_run`, `approval` today; see doc 01). Use it before forecasting to confirm `n` is large enough: fewer than 8 points produces `insufficient_series` and a null forecast.

## 4. `GET /api/jev/forecast/:series?h=5`

**Pipeline.** SQL read of the last 1000 points for the series, then either:

- `etsForecast` (default engine, damped-trend Holt, doc 03), or
- `runCascadePipeline` when `&engine=cascade` is passed, with optional `&live_clairic=1` (doc 04).

**Default response shape:**

```json
{
  "series": "task_terminal",
  "n": 0,
  "history_last30": [],
  "forecast": [],
  "band": [],
  "quality": {
    "insufficient_series": false,
    "low_r2": false,
    "holdout_sse": 0,
    "holdout_r2": 0,
    "residual_sd": 0,
    "alpha": 0,
    "beta": 0,
    "flags": []
  },
  "source": "wae"
}
```

(Field names from the ground source; values shown are placeholders, not measured output.)

**Fail-closed errors:**

| status | code | trigger |
|---|---|---|
| 503 | `MISSING_READ_TOKEN` | `AE_SQL_TOKEN` binding absent or empty |
| 422 | `BAD_SERIES_NAME` | `:series` does not match `^[a-z_]+$` |
| 502 | `WAE_SQL_ERROR` | upstream SQL API error; body truncated |

Validating `:series` against `^[a-z_]+$` before it reaches SQL is the injection guard: the name is interpolated into a `WHERE index1 = ...` read, so anything outside lowercase letters and underscores is rejected at the edge.

**Reading the result.** The ground source "Examples" rule: inspect `quality.flags` before trusting `forecast[]`. `insufficient_series` means n < 8; `low_r2` means holdout R² < 0.5.

## 5. `POST /api/jev/forecast/:series`

The 3-stage SCAMPER cascade entry point (implementation `jev-cascade-forecast.js`; Python source of record `tools/timesfm-clairic-clef/timesfm_clairic_clef.py`; parity max |delta| <= 1.42e-14 on 4 fixtures).

**Request body** (all fields optional):

| field | role |
|---|---|
| `values` | numeric history; WAE is read when omitted |
| `state_text` | free text for Stage 1 extraction; WAE is read when omitted along with `values` |
| `past_covariates`, `future_covariates` | covariates for Stage 2 |
| `peer_series` | peer variates for coupling tests |
| `horizon`, `season_len` | forecast length and seasonal period |
| `action_threshold` | Stage 3 decision threshold |
| `commercial_mode` | licensing mode flag |
| `live_clairic`, `live_clef` | call live models instead of deterministic paths |

Stage detail lives in doc 04. The route ends by pre-registering the outcome at `/api/jev/map/outcomes` with `verdict: "pending"`, which is what keeps the cascade advisory rather than gate-authorizing.

## 6. Route selection cheat sheet

| need | call |
|---|---|
| is the layer healthy? | `GET /selftest` (expect `ok:false` honestly, check `cascade_selftest.ok`) |
| what series exist, how many points? | `GET /series` |
| quick deterministic forecast | `GET /forecast/<series>?h=5` |
| cascade forecast over WAE | `GET /forecast/<series>?h=5&engine=cascade` |
| cascade over supplied data or covariates | `POST /forecast/<series>` |

## 7. Gap noted

The outline scope for this doc lists a `/api/jev/timeseries/export` route. The ground source as read documents only `selftest`, `series`, and the two `forecast` routes; `/export` has no recorded contract there, so this doc does not specify one.
