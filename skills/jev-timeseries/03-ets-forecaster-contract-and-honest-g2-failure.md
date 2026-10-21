# 03: ETS Forecaster Contract and the Honest G2 Failure

**Scope.** `jev-forecast-math.js` damped-trend Holt ETS (19x19 alpha/beta grid, phi 0.98), the G1..G6 falsification gates, and why G2 and NEG_G2 ship failing honestly with `quality.calibrated = false`.

**Ground source:** `yubi-OS/yubiOS skills/jev-timeseries/SKILL.md` (sections "Forecaster contract", "Falsification gates (live-verified 2026-10-08)", and "Forecast v4"). External method claims are backed by the Clef-weighted searXNG dig in `dig_context_03.json`; each citation carries its clef weight inline.

## 1. Method: damped-trend Holt, no seasonality

The ground source pins the v1 model as **damped-trend Holt with NO seasonality**, because jev series are irregular event counts (task transitions, approvals, corpus runs) with no stable season.

Holt's method extends simple exponential smoothing with a trend term. Without it, simple smoothing "carries a level forward and nothing else, so once the last real number arrives, the forecast just repeats it"; Holt's linear trend method, "first described by Charles Holt in 1957, fixes exactly this" (https://r-statistics.co/Holt-Linear-Trend-and-Damped-Trend.html (weak backing, clef weight < 0.5) (clef weight: 0.4073)).

The damped variant sits inside the standard ETS family. The Berkeley lecture notes define ETS models as "a class that includes everything we've seen thus far: simple exponential smoothing, Holt's linear trend method, Holt-Winters method with additive or multiplicative seasonality, and all of their damped trend versions" (https://www.stat.berkeley.edu/~ryantibs/timeseries-f23/lectures/ets.pdf (clef weight: 0.7284)). The jev choice is the additive-trend, damped, no-season member of that family. The canonical textbook treatment of trend methods, including the damped form, is FPP2 chapter 7.2 (https://otexts.com/fpp2/holt.html (clef weight: 0.5823)).

Why damped with phi 0.98: an undamped linear trend extrapolates forever, which is the wrong prior for bursty event counts. Phi slightly below 1 lets the trend flatten over the horizon while barely affecting short horizons.

## 2. The pre-registered contract

All parameters are fixed in advance (ground source):

| parameter | value |
|---|---|
| alpha grid | 0.05 to 0.95, step 0.05 (19 values) |
| beta grid | 0.05 to 0.95, step 0.05 (19 values) |
| grid size | 19 x 19 = 361 fits |
| phi | 0.98, fixed |
| holdout | last 20% of points, minimum 2 |
| selection | lowest holdout SSE |
| tie-break | alpha outer, beta inner, ascending; a later cell wins only on strictly lower SSE |
| band | 1.96 x residual_sd x sqrt(i) for horizon step i |
| `insufficient_series` | n < 8, forecast returned as null |
| `low_r2` | holdout R² < 0.5 |

Exports: `etsFit`, `etsForecast`, `etsSelfTest`. The Python source of record is `yubi-OS/yubiOS` `tools/forecast-standard/forecast_ets.py`, with parity max |delta| = 0 on 4 fixtures.

The deterministic tie-break matters: grid search over 361 cells can produce equal SSE on flat or tiny series, and without a fixed order two runtimes could pick different (alpha, beta) pairs. Strictly-lower-SSE ascending order is what makes G3 (determinism) and G5 (parity) passable.

## 3. Falsification gates (live-verified 2026-10-08)

| gate | name | result |
|---|---|---|
| G1 | trend recovery | PASS |
| G2 | band coverage | **FAIL: 84/100 vs pre-registered [88, 98]%** |
| G3 | determinism | PASS |
| G4 | insufficient-series handling | PASS |
| G5 | Python/JS parity | PASS offline; in-worker reports `pass: null` honestly |
| G6 | flat-series sanity | PASS |

As of 2026-10-11 the live selftest still returns `ok: false` on G2 and NEG_G2.

## 4. Why G2 fails

The ground source diagnosis: **grid-selected residual_sd shrinks on short noisy series** (mean ratio 0.877). The grid picks the (alpha, beta) pair that best fits the holdout, and the residual spread measured from that chosen fit understates true out-of-sample error. A 1.96-sigma band built from an understated sigma covers about 84% instead of the nominal 95%.

This is a recognized general problem. Practitioners "often resort to forward cross-validation (FCV) for obtaining point estimates" of prediction error, while "providing statistically meaningful uncertainty intervals for prediction errors remains relatively under-explored" (https://arxiv.org/pdf/2309.07435v1 (clef weight: 0.5028)). Conformal methods are one response: recent work notes that existing time-series conformal methods "improve local calibration by reusing recent, weighted, or localized residuals" (https://arxiv.org/pdf/2608.10553 (weak backing, clef weight < 0.5) (clef weight: 0.2685)). The jev cascade (doc 04) takes that route with split-conformal calibration in Stage 2; the ETS path does not.

## 5. Why ship it failing

The rule from the ground source: **never retune the gate to pass.** v1 ships flagged as band-undercover. The 2 candidate v2 fixes named are:

1. compute residual_sd on the training fit only, or
2. apply a pre-registered inflation factor.

Either is a future **major** version bump, recorded as a pre-registered amendment (Guideline 3, falsification-corpus skill), never a post-hoc loosening of [88, 98]%.

## 6. Forecast v4 status (2026-10-11)

- v4 is pre-registered and **not wired** into any route. The live route and selftest keep the v2 band.
- `quality.calibrated` stays `false` until a pre-registered gate passes on the live series. Never set it by hand.
- `ok: false` from the selftest is not a deploy failure.
- The v4 harness and results are not in the 2026-10-11 source record (`tools/steady-orbit-worker/2026-10-11/`). Do not describe the forecast as calibrated in a console, report, or demo.
- Wiring v4 is a deploy decision made **after** the gate result is recorded.

## 7. Operator reading rule

Before using `forecast[]`, check `quality.flags`. Treat `band[]` as roughly an 84% interval, not 95%, until G2 passes.

## Sources Considered

| # | URL | clef weight | backing | used |
|---|---|---|---|---|
| 1 | https://otexts.com/fpp2/holt.html | 0.5823 | authoritative | yes (s1) |
| 2 | https://r-statistics.co/Holt-Linear-Trend-and-Damped-Trend.html | 0.4073 | weak backing, clef weight < 0.5 | yes, labeled (s1) |
| 3 | https://www.stat.berkeley.edu/~ryantibs/timeseries-f23/lectures/ets.pdf | 0.7284 | authoritative | yes (s1) |
| 4 | https://r-statistics.co/Holts-Method-in-R.html | 0.1067 | weak backing, clef weight < 0.5 | no |
| 5 | https://rule34.xxx/ | 0.0271 | weak backing, clef weight < 0.5 | no (off-topic) |
| 6 | https://www.sciencedirect.com/science/article/pii/S0096300319301663 | 0.3788 | weak backing, clef weight < 0.5 | no |
| 7 | https://arxiv.org/pdf/2309.07435v1 | 0.5028 | authoritative | yes (s4) |
| 8 | https://arxiv.org/pdf/2608.10553 | 0.2685 | weak backing, clef weight < 0.5 | yes, labeled (s4) |
| 9 | https://arxiv.org/abs/2007.00363v1 | 0.1250 | weak backing, clef weight < 0.5 | no |
| 10 | https://www.forebet.com/en/football-tips-and-predictions-for-today | 0.0232 | weak backing, clef weight < 0.5 | no (off-topic) |

3 of 10 results at weight >= 0.5.
