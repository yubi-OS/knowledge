# 02. Falsification record

**Scope:** Falsification record: detailed analysis grounded in yubi-OS/yubiOS refs/jev-timeseries-2026-10-08.md.

> Ground source: yubi-OS/yubiOS refs/jev-timeseries-2026-10-08.md. External dig: dig_context_02.json (10 Clef-weighted searXNG results).

## Pre-registration discipline

The forecaster's acceptance gates were written down BEFORE any measurement, in PREREGISTRATION.md plus 7 pre-run amendments. There were zero post-run amendments. That ordering is what gives the one failing gate its meaning: the threshold could not have been fitted to the result. All facts in this section come from `yubi-OS/yubiOS refs/jev-timeseries-2026-10-08.md` unless a dig source is cited.

## The six gates

| Gate | What it tests | Result |
|---|---|---|
| G1 | Trend recovery | PASS, delta -0.105% |
| G2 | Prediction-band coverage | FAIL, 84/100 vs pre-registered [88, 98]% |
| G3 | Determinism | PASS, byte-identical |
| G4 | Insufficient-series handling | PASS |
| G5 | JS/Python parity | PASS, delta = 0 |
| G6 | Flat-series sanity | PASS, max deviation 0 |

## Why a damped trend

The model is Holt's linear method with a damping parameter phi, pinned at 0.98. The textbook treatment in Forecasting: Principles and Practice, section 7.2 Trend methods, covers Holt's linear trend and its damped variant, per [7.2 Trend methods / Forecasting: Principles and Practice (2nd ed) - OTexts](https://otexts.com/fpp2/holt.html) (clef weight: 0.8657). A Berkeley lecture compares simple exponential smoothing, Holt's linear trend, and the damped trend at 10-steps-ahead on the same data, per [PDF Lecture 7: Exponential Smoothing With Trend and Seasonality](https://www.stat.berkeley.edu/~ryantibs/timeseries-f23/lectures/ets.pdf) (clef weight: 0.8465), which illustrates why the damped form is the conservative choice for open-ended orchestration series. The modelling basis for damping traces to Gardner and McKenzie's series of papers (1985, 1988, 1989) developing damped versions of the Holt-Winters methods, per [PDF Damped trend exponential smoothing: A modelling viewpoint](https://www.bauer.uh.edu/gardner/docs/pdf/Damped-trend-Modelling.pdf) (clef weight: 0.8366). Two tutorial pages restate the intuition that undamped Holt forecasts never level off while phi makes them settle toward a finite ceiling, per [Exponential Smoothing ETS Lesson 2: Holt's linear trend and the damped ...](https://r-statistics.co/Holt-Linear-Trend-and-Damped-Trend.html) (clef weight: 0.3221) (weak backing, clef weight < 0.5) and [Holt's Method in R: Forecast Trend Without Seasonality](https://r-statistics.co/Holts-Method-in-R.html) (clef weight: 0.1489) (weak backing, clef weight < 0.5). They are teaching material, not authority.

With phi fixed, the grid searches only alpha and beta over 0.05 to 0.95 against a holdout of the last 20% of the series. Fixing phi and the holdout fraction in advance removes two degrees of freedom that could otherwise be tuned after seeing results.

## The G2 failure, explained

The band is `1.96 * residual_sd * sqrt(i)`. If residuals were well estimated and roughly Gaussian, about 95% of held-out points would fall inside, which is why the pre-registered window was [88, 98]%. Observed coverage was 84 of 100.

The source names the mechanism: on short, noisy series, the grid-selected `residual_sd` shrinks. Choosing alpha and beta to minimize error on the same data that produces the residuals biases the residual spread downward. The measured mean ratio of selected to nominal residual_sd was 0.877. A counterfactual using the nominal sd gives 92% coverage, inside the window. So the shape of the band is not the problem; the plug-in spread estimate is.

The external literature on small-sample coverage points the same way, though only with weak backing. One preprint proposes a Small Sample Beta Correction as a distribution-free, drop-in way for practitioners to obtain the coverage they actually intend, per [Probabilistic Conformal Coverage Guarantees in Small-Data Settings](https://arxiv.org/pdf/2509.15349) (clef weight: 0.2136) (weak backing, clef weight < 0.5). An ICML 2026 poster notes that conformal prediction gives finite-sample guarantees but its efficiency depends on calibration-set size, per [ICML Poster RSA-CP: Efficient Conformal Prediction in Small-Sample ...](https://icml.cc/virtual/2026/poster/66307) (clef weight: 0.4095) (weak backing, clef weight < 0.5). A textbook chapter describes reserving calibration data and using an empirical nonconformity quantile, per [Prediction intervals and distribution-free coverage](https://ai-engineer.org/advanced_book/chapter-14-prediction-intervals-and-distribution-free-coverage.html) (clef weight: 0.2671) (weak backing, clef weight < 0.5). An encyclopedia entry on finite-population sampling was returned but is only tangential, per [Sampling from finite populations](https://encyclopediaofmath.org/wiki/Sampling_from_finite_populations) (clef weight: 0.2490) (weak backing, clef weight < 0.5). One result, a football predictions site, is off-topic noise, per [Football Predictions for Today / Forebet](https://www.forebet.com/en/football-tips-and-predictions-for-today) (clef weight: 0.0421) (weak backing, clef weight < 0.5).

None of these sources were used to change v1. They support the recorded v2 direction: estimate `residual_sd` on training data only, keeping it separate from the selection step.

## What the team did with the failure

The gate was NOT moved. v1 ships with the under-coverage disclosed:

- The console card carries the honesty flag alongside `low_r2`.
- The selftest reports `ok: false` for G2 rather than hiding it, even while the route as a whole returns 200.
- The v2 fix, train-only residual_sd, is recorded as a future major version bump, since it changes the band every consumer sees.

## Why this record matters

A forecast band that claims 95% and delivers 84% would silently overstate confidence for every downstream decision that reads it, including the Phase 4 forecast-gated cron budget. Pre-registration made the miss visible; refusing to move the gate kept it visible; the counterfactual (92%) located the fix precisely.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Exponential Smoothing ETS Lesson 2: Holt's linear trend and the damped ... | https://r-statistics.co/Holt-Linear-Trend-and-Damped-Trend.html | 0.3221 | weak (< 0.5) |
| 2 | 7.2 Trend methods / Forecasting: Principles and Practice (2nd ed) - OTexts | https://otexts.com/fpp2/holt.html | 0.8657 | authoritative (>= 0.5) |
| 3 | PDF Lecture 7: Exponential Smoothing With Trend and Seasonality | https://www.stat.berkeley.edu/~ryantibs/timeseries-f23/lectures/ets.pdf | 0.8465 | authoritative (>= 0.5) |
| 4 | Holt's Method in R: Forecast Trend Without Seasonality | https://r-statistics.co/Holts-Method-in-R.html | 0.1489 | weak (< 0.5) |
| 5 | PDF Damped trend exponential smoothing: A modelling viewpoint | https://www.bauer.uh.edu/gardner/docs/pdf/Damped-trend-Modelling.pdf | 0.8366 | authoritative (>= 0.5) |
| 6 | Probabilistic Conformal Coverage Guarantees in Small-Data Settings | https://arxiv.org/pdf/2509.15349 | 0.2136 | weak (< 0.5) |
| 7 | ICML Poster RSA-CP: Efficient Conformal Prediction in Small-Sample ... | https://icml.cc/virtual/2026/poster/66307 | 0.4095 | weak (< 0.5) |
| 8 | Football Predictions for Today / Forebet | https://www.forebet.com/en/football-tips-and-predictions-for-today | 0.0421 | weak (< 0.5) |
| 9 | Sampling from finite populations | https://encyclopediaofmath.org/wiki/Sampling_from_finite_populations | 0.2490 | weak (< 0.5) |
| 10 | Prediction intervals and distribution-free coverage | https://ai-engineer.org/advanced_book/chapter-14-prediction-intervals-and-distribution-free-coverage.html | 0.2671 | weak (< 0.5) |
