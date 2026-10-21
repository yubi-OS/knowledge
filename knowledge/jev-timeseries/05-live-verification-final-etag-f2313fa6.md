# 05. Live verification on the final etag

**Scope:** Live verification (final etag f2313fa6): detailed analysis grounded in yubi-OS/yubiOS refs/jev-timeseries-2026-10-08.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/jev-timeseries-2026-10-08.md, no external web dig

## What was verified

After the deploy chain settled on etag `f2313fa6`, the build checked every new surface against the live worker. The ground-source doc records five checks. Each is restated below with what it proves and what it does not.

## 1. Selftest: 200, `ok: true`

`GET /api/jev/timeseries/selftest` returned HTTP 200 with `ok: true`. Inside the payload:

- **G1, G3, G4, G6 pass.** Trend recovery, determinism, insufficient-series handling, and flat-series sanity all hold in-worker.
- **G2 is an honest fail.** The band-coverage gate still reports its pre-registered failure (84/100 against [88, 98]%, see doc 02). The selftest surfaces the miss instead of masking it.
- **G5 is `pass: null` in-worker.** G5 is JS/Python parity. The worker cannot run the Python source of record, so it reports null rather than a fabricated pass. Parity was established offline (max |delta| = 0 on 4 fixtures).
- **`wae_write` ok and `wae_read_back` ok.** The selftest wrote a datapoint to the `jev` dataset and read it back, which exercises both the `TS` binding and the `AE_SQL_TOKEN` read path in one call.
- **The schema probe lists `timestamp`.** This is the empirical column name that resolved bug 3 in doc 03.

Reading `ok: true` alongside a failing G2 matters: the route-level flag reports that the instrument is working, while the gate-level flag reports what the instrument found. Note that the falsification record describes the selftest as reporting `ok: false` for the band gate; the two statements are consistent once the route flag and the gate flag are kept separate.

## 2. Series inventory: 200

`GET /api/jev/timeseries/series` returned 200 and listed 12 points on the `selftest_probe` series. This confirms the inventory query works against real stored data and that selftest writes accumulate as a usable series.

## 3. Forecast: 200 with real numbers

`GET /api/jev/forecast/:series` returned 200 with an actual forecast:

| Field | Value |
|---|---|
| n (history points) | 12 |
| Forecast, step 1 | 36.09 |
| Forecast, step 2 | 41.20 |
| Forecast, step 3 | 46.22 |
| Band | plus or minus the 1.96 * residual_sd * sqrt(i) band |
| holdout_r2 | 0.537 |

Interpretation, grounded in the build parameters: n = 12 clears the `insufficient_series` floor of n < 8. The three steps increase by roughly 5.1 and 5.0, a slightly decelerating increment consistent with a damped trend at phi = 0.98. A holdout R2 of 0.537 is a modest fit on a short series; whether `low_r2` fires depends on its threshold, which the source does not state, so this doc does not claim either way. Given the G2 record, the band on this output should be read as likely somewhat narrow.

## 4. No-auth: 401 on all three routes

All three routes returned 401 without a bearer. This is the clean re-run that followed the contaminated first check (doc 03, bug 4), done with `X-Sauna-Connection-Id: none` so the proxy injected no credential. It confirms the bearer gate is real.

## 5. Schedules and 16 bindings intact

The build verified that the worker's cron schedules and all 16 bindings survived the deploy. This check covers state that lives outside the code diff and that a modules upload can clobber if its metadata is rebuilt incorrectly. It also closes the loop on the concurrency reconciliation in doc 04, where an operator push had landed mid-build.

## Coverage of the verification

| Surface | Verified by |
|---|---|
| Math gates | Selftest gate results |
| WAE write path | `wae_write` |
| WAE read path and token | `wae_read_back`, inventory, forecast |
| SQL schema | Schema probe |
| Auth gate | 401 on all three routes |
| Worker configuration | Schedules plus 16 bindings |
| Python parity | Offline only (G5 null in-worker) |

## What remains unverified live

- Write sites under real orchestration traffic (`task_state`, `task_terminal`, `corpus_run`, `approval`) are not individually listed as verified in this record; the verified series is `selftest_probe`.
- Read-your-writes lag of seconds means an immediate forecast after a write may not include that write.
- The console card was KV byte-verified (doc 01) but its rendering is not part of this check list.

## Bottom line

On `f2313fa6`, every new route behaves as designed: it fails closed without auth, reads and writes the real dataset, returns real forecasts, and reports its own known weakness (G2) instead of hiding it.
