# 02: TimesFM 2.5 Patched Decoder and Conformal Bands

**Scope:** Google Research TimesFM 2.5 (200M, Apache-2.0, 16k context, 32-step input patch, 30M quantile head p10..p90) and split-conformal residual calibration solving ETS G2 shrinkage.

**Ground source:** `yubi-OS/yubiOS refs/timesfm-clairic-clef-2026-10-21.md` (TL;DR item 2, Section 2.1, Section 4).

**Primary dig backing:** the Hugging Face model card https://huggingface.co/google/timesfm-2.5-200m-pytorch (clef weight: 0.9523) and the upstream repo https://github.com/google-research/timesfm/ (clef weight: 0.8909).

## 1. What TimesFM 2.5 is

The model card describes TimesFM as "a pretrained time-series foundation model developed by Google Research for time-series forecasting", and notes that on October 2, 2025 the model structure was changed to fuse QKV matrices (https://huggingface.co/google/timesfm-2.5-200m-pytorch, clef weight: 0.9523; README mirror https://huggingface.co/google/timesfm-2.5-200m-pytorch/blob/main/README.md, clef weight: 0.6648).

A community Core AI conversion describes the architecture as "a decoder-only patched transformer" that takes "any univariate series" (https://huggingface.co/mlboydaisuke/TimesFM-2.5-200M-CoreAI, clef weight: 0.0958, weak backing, clef weight < 0.5). That description agrees with the ground source but is not authoritative on its own. The original decoder-only design is the Das et al. ICML 2024 paper listed in the ground source's references (arXiv:2310.10688).

## 2. License boundary

The upstream repo states: "The TimesFM source code in this repository is licensed under Apache-2.0, and model weights up to version 2.5 remain Apache-2.0. However, TimesFM 3.0 pretrained weights are distributed under the separate" non-commercial license (https://github.com/google-research/timesfm/, clef weight: 0.8909).

This is the main reason 2.5 is the mandatory default in the cascade. It can be self-hosted commercially with no extra approval, while a 3.0 escalation crosses a license boundary that the Stage 3 gate has to handle (doc 05, gate G8 in doc 06).

## 3. Architecture parameters

From the ground source's Section 2.1 comparison table:

| Property | TimesFM 2.5 |
|---|---|
| Parameters | 200M (about 400 MB FP16) |
| Context | 16,384 steps |
| Input patch | 32 steps |
| Output patch | 128 steps |
| Covariates | Univariate only; external linear `XReg` wrapper |
| Horizon decoding | Autoregressive across 128-step output patches |
| Probabilistic head | 30M continuous quantile head, `p10..p90`, `fix_quantile_crossing=True` |

Two consequences matter for the cascade. First, past `H > 128` the model has to feed its own output patches back in, so variance compounds. That is gate 2D in doc 04. Second, covariates enter only through an external linear wrapper, so a series driven by known-future events can beat 2.5 even when its univariate history is clean. That is gate 2C.

## 4. The ETS G2 shrinkage problem

The cascade exists because of a measured failure in the old track. In `tools/forecast-standard/forecast_ets.py`, damped-trend Holt ETS failed Gate G2 with 84/100 hits against a required `[88, 98]%` band. Grid-selected `(alpha, beta)` overfit short noisy series and shrank `residual_sd` (mean ratio 0.877). Calibration rounds R6 to R9 plus BD1 all closed without passing (ground source TL;DR item 2).

The root cause is in-sample residuals. A model that fits the training window too closely reports a residual spread smaller than its true out-of-sample error, so its intervals come out too narrow.

## 5. Split-conformal residual calibration

Conformal prediction is "a distribution-free framework for generating prediction intervals with guaranteed coverage properties", and unlike classical intervals it does not assume normally distributed errors (https://nixtlaverse.nixtla.io/statsforecast/docs/tutorials/conformalprediction.html, clef weight: 0.2451, weak backing, clef weight < 0.5).

The fix in the cascade: calibrate the `[p10, p90]` band on **held-out** rolling-origin residuals instead of in-sample residuals, so the band width reflects out-of-sample error.

There is an important limit to that guarantee: "Conformal coverage is marginal, not conditional: 90% intervals cover 90% of the time on average, not for every series or every horizon step" (https://nixtlaverse.nixtla.io/conformalforecast/index.html, clef weight: 0.2355, weak backing, clef weight < 0.5). Because of this, the cascade tests coverage across 100 seeded series (G2) instead of assuming per-series validity.

Stronger backing for time-series-specific conformal work:

- The `conformalForecast` R package "implements several conformal calibration schemes spanning empirical-quantile, feedback-based, and dependence-aware approaches", with tools for tracking coverage, interval width, and interval scores over time (https://arxiv.org/pdf/2610.21648, clef weight: 0.5109).
- arXiv 2509.02844 frames conformal prediction as "a general and efficient way to provide uncertainty quantification for time series", while noting the limits of current methods (http://arxiv.org/abs/2509.02844v1, clef weight: 0.5789).

Dependence-aware schemes are the relevant family for later work: plain split conformal assumes exchangeability, which autocorrelated series break.

## 6. Measured result

From the ground source's Section 4 selftest:

| Gate | Requirement | Result |
|---|---|---|
| G1 trend and seasonal recovery | `mase_25 < 0.65` and `< mase_last` | `0.1332 < 0.4415`, PASS |
| G2 conformal band coverage | 100 seeded series, `n=48`, `h=1`, coverage in `[0.72, 0.94]` | 80/100 (0.80), PASS |
| G5 quantile monotonicity | 0 crossings `p10 <= ... <= p90` | 0 crossings, PASS |

The G2 band in the cascade (`[0.72, 0.94]`, centred on the nominal 0.80 for an 80% interval) is different from the ETS track's `[88, 98]` band. Read the ETS 84/100 failure and the cascade 80/100 pass against their own pre-registered windows, not against each other.

## 7. Role in the cascade

TimesFM 2.5 (`timesfm_25_forecast`) is the Stage 2 primary forecaster for clean univariate series. It escalates to 3.0 only through the pre-registered gate in doc 04.

## Sources Considered

| # | URL | Clef weight | Backing | Used for |
|---|---|---|---|---|
| G | `yubi-OS/yubiOS refs/timesfm-clairic-clef-2026-10-21.md` | n/a (ground source) | Ground | Parameters, ETS G2 history, selftest |
| 1 | https://huggingface.co/google/timesfm-2.5-200m-pytorch | 0.9523 | Authoritative | Model identity, QKV fusion |
| 2 | https://github.com/google-research/timesfm/ | 0.8909 | Authoritative | Apache-2.0 boundary |
| 3 | https://huggingface.co/google/timesfm-2.5-200m-pytorch/blob/main/README.md | 0.6648 | Authoritative | Model card mirror |
| 4 | http://arxiv.org/abs/2509.02844v1 | 0.5789 | Authoritative | Time-series conformal framing |
| 5 | https://arxiv.org/pdf/2610.21648 | 0.5109 | Authoritative | Conformal calibration schemes |
| 6 | https://nixtlaverse.nixtla.io/statsforecast/docs/tutorials/conformalprediction.html | 0.2451 | Weak backing, clef weight < 0.5 | Conformal definition |
| 7 | https://nixtlaverse.nixtla.io/conformalforecast/index.html | 0.2355 | Weak backing, clef weight < 0.5 | Marginal coverage caveat |
| 8 | https://huggingface.co/mlboydaisuke/TimesFM-2.5-200M-CoreAI | 0.0958 | Weak backing, clef weight < 0.5 | Architecture corroboration |
| 9 | https://www.fnb-online.com/personal/checking-savings/online-mobile-options/online-banking | 0.0277 | Weak backing, clef weight < 0.5 | Off-topic, not cited |
| 10 | https://sketchfab.com/tags/abrams | 0.0138 | Weak backing, clef weight < 0.5 | Off-topic, not cited |
