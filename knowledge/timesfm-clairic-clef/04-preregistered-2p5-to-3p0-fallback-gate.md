# 04: Pre-Registered 2.5 to 3.0 Fallback Gate

**Scope:** Rolling-origin evaluation against seasonal naive and damped-Holt ETS baselines; the 4 Clef-weighted fallback triggers (MASE, PICP_80 coverage, covariate R2, horizon > 128).

**Ground source:** `yubi-OS/yubiOS refs/timesfm-clairic-clef-2026-10-21.md` (Section 2.2, Section 3.2, Section 4).

**Primary dig backing:** Rob J Hyndman on rolling scaled accuracy https://robjhyndman.com/hyndsight/rolling_mase.html (clef weight: 0.8032), the ADAM textbook rolling-origin chapter https://openforecast.org/adam/rollingOrigin.html (clef weight: 0.6638), and the Google Research TimesFM-3 post for benchmark context https://research.google/blog/timesfm-3-a-zero-shot-foundation-model-for-multivariate-forecasting/ (clef weight: 0.5521).

## 1. Why pre-register the gate

Running TimesFM 3.0 on every series would be heavier (330M vs 200M parameters) and would cross the non-commercial weight boundary (doc 03). The cascade runs 2.5 first and escalates only when a fixed rule, written down before any data is seen, says 2.5 failed. Fixing the thresholds in advance stops anyone from tuning them after looking at results to justify a preferred model.

## 2. Rolling-origin evaluation

The ADAM chapter illustrates the idea with a diagram (Svetunkov and Petropoulos, 2018): in-sample cells are followed by holdout cells, and the forecast origin moves forward one step at a time, so each model is scored over many origins instead of a single split (https://openforecast.org/adam/rollingOrigin.html, clef weight: 0.6638).

On the scaling question, Hyndman asks whether, "when we are doing time series cross-validation, and computing forecast accuracy over a series of training/test sets with a rolling origin", it makes sense to compute a different scaling factor per origin (https://robjhyndman.com/hyndsight/rolling_mase.html, clef weight: 0.8032). This affects the cascade directly, because gate 2A compares MASE values and those comparisons are only meaningful if the scaling is consistent across origins and models.

A vendor page describes harnesses that "compute pinball loss across multiple quantiles, MASE, and WMAPE at each forecast horizon" and warns about corrupted baselines (https://inferensys.com/train/deep-learning-for-supply-chain-and-inventory-demand-forecasting/backtesting-frameworks-for-demand-model-evaluation/custom-rolling-origin-backtesting-framework-development-for-probabilistic-demand-models, clef weight: 0.4271, weak backing, clef weight < 0.5). An R course lists rolling-origin cross-validation next to prediction intervals and accuracy measures (https://r-statistics.co/Forecasting-Toolbox-Course.html, clef weight: 0.1798, weak backing, clef weight < 0.5). Both are background only.

## 3. Baselines

Per the ground source, every rolling-origin evaluation scores TimesFM 2.5 against four baselines:

| Baseline | Source |
|---|---|
| `seasonal_naive` | Repeat the value one season back (default season 7) |
| `ets_damped_holt` | `tools/forecast-standard/forecast_ets.py` (the incumbent, doc 02) |
| `last_value` | Naive persistence |
| `drift` | Linear extrapolation from first to last point |

## 4. The four fallback triggers

From the ground source's Section 2.2. The Clef weight on each gate is the ground source's own `noul` score for "is this a primary fallback gate". These weights are separate from the dig weights in this doc.

| Gate | Escalate when | Clef weight (ground source) | Ground-source verdict |
|---|---|---|---|
| 2A Rolling-origin MASE | `MASE_25 > 1.0` or `MASE_25 > 1.05 * min(MASE_baselines)` | 0.8492 | Primary |
| 2B 80% interval coverage | `PICP_80 < 0.70`, or `> 0.95` when `n_holdout >= 20` | 0.9047 | Primary |
| 2C Covariate / variate coupling | `R2_cov >= 0.20` of 2.5 holdout residuals, or peer residual `abs(r) > 0.40` | 0.8886 | Primary |
| 2D Horizon compounding | `H > 128` | 0.6446 | Secondary |

The gates use OR logic: any one trigger escalates.

How to read each gate:

- **2A** uses the textbook MASE threshold of 1.0 (worse than in-sample naive) plus a 5% tolerance against the best baseline. If 2.5 cannot beat a damped-Holt or seasonal-naive forecast, there is no reason to keep it.
- **2B** is two-sided. Undercoverage (< 0.70) means the band is too narrow, which is the ETS failure mode. Overcoverage (> 0.95) means the band is uselessly wide, and is only enforced once there are at least 20 holdout points to estimate it.
- **2C** detects signal that 2.5 cannot see. If known covariates explain 20% or more of 2.5's residual variance, or peer-series residuals correlate above 0.40, the missing information is exactly what 3.0's covariate tokens and variate attention were built to use.
- **2D** is structural. Past 128 steps, 2.5 has to decode autoregressively across output patches. It scored lower (0.6446) because horizon alone does not prove the forecast is wrong.

Pinball-loss budget deviation scored 0.7972 in the ground source and was kept as a **diagnostic metric**, not a trigger.

## 5. Benchmark context (not a gate input)

Google Research reports evaluating TimesFM-3 "on three comprehensive public forecasting benchmarks: Gift-Eval, FEV-Bench, and Time", where it is "the top-ranked model in terms of both point and probabilistic forecasting" (https://research.google/blog/timesfm-3-a-zero-shot-foundation-model-for-multivariate-forecasting/, clef weight: 0.5521). Secondary pages describe GIFT-Eval as "Salesforce's benchmark suite comprising 36 datasets ... (97 total configurations)" (https://zread.ai/google-research/timesfm/17-benchmark-performance-fev-bench-time-gift-eval, clef weight: 0.0958, weak backing, clef weight < 0.5), and list repo runners such as `run_fev_bench.py` and `evaluate_all_gift.py` (https://deepwiki.com/google-research/timesfm/5.1-benchmark-runners-and-results, clef weight: 0.1332, weak backing, clef weight < 0.5). TSFM.ai maintains independent leaderboards (https://tsfm.ai/benchmarks, clef weight: 0.3086, weak backing, clef weight < 0.5).

Public leaderboard rank does **not** feed the gate. The gate looks only at the series in front of it. A model that tops GIFT-Eval can still lose to seasonal naive on one short noisy series, and gate 2A exists to catch exactly that case.

## 6. Measured behavior

Ground source Section 4, gate G6: on the covariate-shock fixture, 2A fired (`mase_25 = 1.083` vs baseline `1.172`, meaning 2.5 failed the absolute `> 1.0` clause) and 2C fired (`cov_r2 = 0.944`, `peer_r = 0.000`). Escalation to `timesfm-3.0-330m` brought MASE to 0.0545. On the clean 28-day log in the live check (Section 3.2), no trigger fired and the active model stayed `timesfm-2.5`.

## Sources Considered

| # | URL | Clef weight | Backing | Used for |
|---|---|---|---|---|
| G | `yubi-OS/yubiOS refs/timesfm-clairic-clef-2026-10-21.md` | n/a (ground source) | Ground | Gate thresholds, gate weights, G6 |
| 1 | https://robjhyndman.com/hyndsight/rolling_mase.html | 0.8032 | Authoritative | Rolling MASE scaling |
| 2 | https://openforecast.org/adam/rollingOrigin.html | 0.6638 | Authoritative | Rolling-origin principle |
| 3 | https://research.google/blog/timesfm-3-a-zero-shot-foundation-model-for-multivariate-forecasting/ | 0.5521 | Authoritative | Benchmark context |
| 4 | https://inferensys.com/train/deep-learning-for-supply-chain-and-inventory-demand-forecasting/backtesting-frameworks-for-demand-model-evaluation/custom-rolling-origin-backtesting-framework-development-for-probabilistic-demand-models | 0.4271 | Weak backing, clef weight < 0.5 | Pinball + MASE harness |
| 5 | https://tsfm.ai/benchmarks | 0.3086 | Weak backing, clef weight < 0.5 | Leaderboards |
| 6 | https://r-statistics.co/Forecasting-Toolbox-Course.html | 0.1798 | Weak backing, clef weight < 0.5 | Background |
| 7 | https://deepwiki.com/google-research/timesfm/5.1-benchmark-runners-and-results | 0.1332 | Weak backing, clef weight < 0.5 | Benchmark runners |
| 8 | https://zread.ai/google-research/timesfm/17-benchmark-performance-fev-bench-time-gift-eval | 0.0958 | Weak backing, clef weight < 0.5 | GIFT-Eval size |
| 9 | https://www.uncommongoods.com/gifts | 0.0289 | Weak backing, clef weight < 0.5 | Off-topic, not cited |
| 10 | https://www.merriam-webster.com/dictionary/rolling | 0.0135 | Weak backing, clef weight < 0.5 | Off-topic, not cited |
