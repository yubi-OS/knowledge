# 03: TimesFM 3.0 Multivariate and Covariate Architecture

**Scope:** TimesFM 3.0 (330M, non-autoregressive contiguous patch masking, alternating 2D temporal+variate attention, lookahead covariates, non-commercial weight boundary).

**Ground source:** `yubi-OS/yubiOS refs/timesfm-clairic-clef-2026-10-21.md` (TL;DR item 1, Section 2.1, Section 3.1 item 3).

**Primary dig backing:** the Google Research launch post https://research.google/blog/timesfm-3-a-zero-shot-foundation-model-for-multivariate-forecasting/ (clef weight: 0.9749 on the multivariate query, 0.9689 on the covariates query) and the upstream repo https://github.com/google-research/timesfm/ (clef weight: 0.9224).

## 1. What TimesFM 3.0 is

Google Research introduces TimesFM-3 as "a state-of-the-art time series foundation model that enables highly accurate multivariate time series forecasting in a single forward pass" (https://research.google/blog/timesfm-3-a-zero-shot-foundation-model-for-multivariate-forecasting/, clef weight: 0.9749). The same post states that "TimesFM-3 has 330 million parameters and is pre-trained on a real-world and synthetic time-series corpus comprising more than 1 trillion time points" (same URL, clef weight: 0.9689).

The upstream repo summarizes the release: "TimesFM 3.0 introduces native multivariate time-series forecasting, flexible covariate support (both past-only and past-and-future covariates), superior zero-shot generalist capabilities" (https://github.com/google-research/timesfm/, clef weight: 0.9224; non-trailing-slash variant https://github.com/google-research/timesfm, clef weight: 0.5964).

## 2. The three capabilities that 2.5 lacks

The independent TSFM.ai write-up lays out the lineage: the original model "established large-scale zero-shot univariate forecasting; TimesFM 2.5 stretched context and improved efficiency; TimesFM 3 makes multiple targets, covariates" native (https://tsfm.ai/blog/timesfm-3-multivariate-zero-shot-forecasting, clef weight: 0.7628). MarkTechPost adds that "Three input types work zero-shot, with no task-specific fine-tuning: Multiple targets forecast jointly, with point and quantile outputs for each" (https://www.marktechpost.com/2026/08/31/google-ai-releases-timesfm-3-a-330m-parameter-zero-shot-foundation-model-for-multivariate-time-series-forecasting/, clef weight: 0.3124, weak backing, clef weight < 0.5).

Mapped onto the cascade's fallback triggers (doc 04):

| 3.0 capability | 2.5 gap it closes | Fallback gate |
|---|---|---|
| Native multivariate targets via alternating 2D (temporal + variate) attention | Univariate only | 2C peer-series residual `abs(r) > 0.40` |
| Past-only and past-and-future covariate tokens | External linear `XReg` only | 2C covariate residual `R2_cov >= 0.20` |
| Single-pass non-autoregressive decoding | Autoregressive 128-step patches | 2D horizon `H > 128` |

## 3. Attention and decoding mechanics

Per the ground source's Section 2.1 table, 3.0 uses a 15,360-step context with a 32-step input patch arranged as a **2D token grid** (time by variate). It alternates temporal and variate attention blocks. A secondary guide describes this as "alternating attention (causal temporal + full" variate attention), together with a "lookahead strategy" for future covariates (https://cldnavi.com/en/blog/timesfm-3-guide-2026/, clef weight: 0.3012, weak backing, clef weight < 0.5). The causal-temporal / full-variate split is plausible but only weakly backed here. Treat it as unverified until it is confirmed against the paper.

Horizon decoding is single-pass and non-autoregressive via **Contiguous Patch Masking** (the ground source cites `arXiv:2505.23719`). Because 3.0 does not feed its own outputs back in, it avoids the variance compounding that 2.5 shows past `H > 128`.

The probabilistic output is 9 native ordered deciles (`p10..p90`), so 3.0 output plugs into the same pinball-loss and `PICP_80` scoring as 2.5 without any adapter.

## 4. Resource cost

From the ground source: 330M parameters, about 1.3 GB FP16, against about 400 MB for 2.5. The ground source calls 3.0 "65% heavier" by parameter count. That is one reason 3.0 runs only on a gate trigger and never unconditionally.

## 5. Non-commercial weight boundary

The repo states that "TimesFM 3.0 pretrained weights are distributed under the separate" non-commercial license, while the source code stays Apache-2.0 (https://github.com/google-research/timesfm/, clef weight: 0.8909, from the doc 02 dig). The ground source adds that commercial use goes through BigQuery ML.

In the cascade, every 3.0 forecast carries the stamp `timesfm-non-commercial-license-v1.0 (cloud-commercial-only)` (internal README, Stage 2). Under `commercial_mode=True`, Stage 3 forces `gate_disposition: "needs_approval"` with `gate_reasons: ["timesfm_30_non_commercial_weights"]`, even when a caller overrides Clef to `"act"` (ground source Section 3.1 item 3; harness gate G8, doc 06).

## 6. Measured result in the harness

Gate G6 (ground source Section 4): a covariate-shock series fails 2.5 with `mase_25 = 1.0827` and `cov_r2 = 0.944`, which triggers automatic escalation to `timesfm-3.0-330m` and brings error down to `mase_30 = 0.0545`. The live end-to-end check in the ground source's Section 3.2 shows the same path: 2.5 fails, 3.0 runs, and Clef returns `review` (0.7545) with `band_calibrated` 0.9714, recorded as "Escalated (`timesfm-3.0`)".

Note on scope: the harness's 3.0 path is a deterministic stdlib kernel that reproduces the *routing contract* (covariate XReg, variate coupling, single-pass horizon). It does not load the 330M weights. G6 shows that the fallback fires and the error budget recovers on a designed series. It is not a benchmark of the real model.

## 7. Noise in the dig

Two results were mirrors or off-topic and are not cited: an unofficial repo fork (https://github.com/AI-App/Google-Research.TimeSFM, clef weight: 0.0412, weak backing, clef weight < 0.5) plus two unrelated pages (weights 0.0186 and 0.0166).

## Sources Considered

| # | URL | Clef weight | Backing | Used for |
|---|---|---|---|---|
| G | `yubi-OS/yubiOS refs/timesfm-clairic-clef-2026-10-21.md` | n/a (ground source) | Ground | Context, patching, CPM, license gating, G6 |
| 1 | https://research.google/blog/timesfm-3-a-zero-shot-foundation-model-for-multivariate-forecasting/ | 0.9749 / 0.9689 | Authoritative | Definition, 330M, 1T points |
| 2 | https://github.com/google-research/timesfm/ | 0.9224 | Authoritative | Multivariate + covariate support |
| 3 | https://tsfm.ai/blog/timesfm-3-multivariate-zero-shot-forecasting | 0.7628 | Authoritative | Lineage 1.0 to 2.5 to 3 |
| 4 | https://github.com/google-research/timesfm | 0.5964 | Authoritative | Repo variant |
| 5 | https://www.marktechpost.com/2026/08/31/google-ai-releases-timesfm-3-a-330m-parameter-zero-shot-foundation-model-for-multivariate-time-series-forecasting/ | 0.3124 | Weak backing, clef weight < 0.5 | Three input types |
| 6 | https://cldnavi.com/en/blog/timesfm-3-guide-2026/ | 0.3012 | Weak backing, clef weight < 0.5 | Alternating attention detail |
| 7 | https://github.com/AI-App/Google-Research.TimeSFM | 0.0412 | Weak backing, clef weight < 0.5 | Mirror, not cited |
| 8 | https://my.mail.ru/mail/o.pst.03/ | 0.0186 | Weak backing, clef weight < 0.5 | Off-topic, not cited |
| 9 | https://www.google.com/ | 0.0166 | Weak backing, clef weight < 0.5 | Off-topic, not cited |
