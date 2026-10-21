# 01. Problem Framing and System One Taxonomy

**Scope:** Problem statement and dual-process System One (Clairic extract, Clef decide) vs System Two (LLM) vs Patched TSFM (TimesFM 2.5/3.0) division of labor.

**Ground source:** `yubi-OS/yubiOS refs/timesfm-clairic-clef-solo-2026-10-21.md` (ideate-solo run dated 2026-10-21, scope class: systemic, 6 variations generated, finalist V6).

**Outline score:** 1.6959 (clef `score`, P(load-bearing) = 0.7937, confidence 0.477).

## 1. The problem statement

The ground source frames the work as a single "How might we" question: how to combine Google Research's TimesFM (Apache-2.0 TimesFM 2.5 as the primary numerical forecaster, escalating to TimesFM 3.0 only when 2.5 fails pre-registered rolling-origin gates) with Cloudflare's System One models (Clairic for messy-document extraction and short-horizon density estimation, Clef for bounded decision scoring) inside the `yubi-OS/yubiOS` and `/jev/` fail-closed orchestration architecture (source: `yubi-OS/yubiOS refs/timesfm-clairic-clef-solo-2026-10-21.md`).

Three constraints are baked into the framing before any variation is generated:

1. **License boundary.** TimesFM 2.5 is the default because it is Apache-2.0; 3.0 is an escalation, not a peer.
2. **Pre-registration.** Escalation happens only on gates declared in advance, never on ad hoc judgment.
3. **Fail-closed orchestration.** Whatever the models say, the `/jev/` architecture decides whether anything executes.

## 2. The three model classes

The cascade is a division of labor across three classes of model. Each one is assigned the input/output contract "where its architecture is strongest," separated by deterministic gates (ground source, Recommended Direction).

### 2.1 System One extraction: Clairic

Cloudflare's launch post states that, until Clairic, every System One model was a decision model ("Jev and Clef take an input state and a list of questions and give probabilities"), and that Clairic "is the first model in a new class: System One extraction models" (https://blog.cloudflare.com/clairic-extraction-model/, clef weight: 0.9143). The Cloudflare changelog entry describes Clairic as a preview that "extracts, computes, estimates, and forecasts values from your input, and returns typed answers with confidence scores in a single pass" (https://developers.cloudflare.com/changelog/post/2026-10-19-clairic-workers-ai/, clef weight: 0.7401).

In the cascade, Stage 1 uses `@cf/cloudflare/clairic` to ingest messy operational logs, CSV exports, and deploy notes in one prefill-only pass (under 450 ms, zero output token fees, per the ground source). It extracts character-offset grounded anomaly notes (`span: [start, end]`, `p_null`), chronological series values, and historical/future covariates, and emits a short-horizon `[p10, median, p90]` density forecast with 99 percentiles `p1..p99` per step.

Secondary coverage frames Clairic as "the second System One model class after decision models such as TypeSafe's Jev and Cloudflare's own Clef" that "returns values" rather than picking among listed options (https://cellcog.ai/blog/cloudflare-clairic-extraction-model/, clef weight: 0.4881, weak backing, clef weight < 0.5). A trade-press report claims a 69% run-time cut for a claims pipeline (https://www.marktechpost.com/2026/10/20/cloudflare-releases-clairic-a-system-one-extraction-model-on-workers-ai/, clef weight: 0.1420, weak backing, clef weight < 0.5); that number is not used anywhere in the cascade design. A community post attributes the "System One" name to Kahneman's fast/slow distinction (https://dev.to/techpulse01239/cloudflare-launches-clairic-a-fast-system-one-extraction-model-for-typed-values-54an, clef weight: 0.0806, weak backing, clef weight < 0.5).

### 2.2 System One decision: Clef

Clef is the decision half of System One: it takes a state plus typed questions and returns probabilities (per the Cloudflare Clairic post above, clef weight: 0.9143). In the cascade, Stage 3 feeds Clef the winning forecast's median, `[p10, p90]` widths, rolling-origin MASE, `PICP_80`, fallback reasons, and Clairic's anomaly note, and asks 3 typed questions: `action_choice` (`act | wait | review | fallback_ets`), `band_calibrated` (noul), and `operational_risk` (score 0..3). Doc 03 covers Clef's scoring role inside the ideation run itself.

### 2.3 Patched TSFM: TimesFM 2.5 and 3.0

The numerical core is a patched time-series foundation model. The original TimesFM paper describes "a time-series foundation model for forecasting whose out-of-the-box zero-shot performance on a variety of public datasets comes close to the accuracy of state-of-the-art supervised forecasting models" (https://arxiv.org/abs/2310.10688, clef weight: 0.2529, weak backing, clef weight < 0.5), "based on pretraining a patched-decoder style attention model" (https://research.google/pubs/a-decoder-only-foundation-model-for-time-series-forecasting/, clef weight: 0.1550, weak backing, clef weight < 0.5). The same paper appears in PMLR v235 (https://proceedings.mlr.press/v235/das24c.html, clef weight: 0.4018, weak backing, clef weight < 0.5) and as an arXiv PDF (https://arxiv.org/pdf/2310.10688v1, clef weight: 0.3362, weak backing, clef weight < 0.5). Google's blog positions a forecasting foundation model as giving "decent out-of-the-box forecasts on unseen time-series data with no additional training" (https://research.google/blog/a-decoder-only-foundation-model-for-time-series-forecasting/, clef weight: 0.3217, weak backing, clef weight < 0.5).

Weighting caveat: Clef scored all 5 TimesFM-paper results below 0.5 for this subtopic's question. The question asked about the System One division of labor, so the paper is primary for TimesFM itself but only partially on-topic here. All version-specific TimesFM 2.5 and 3.0 details below come from the ground source, not from the dig:

| Property | TimesFM 2.5 (primary) | TimesFM 3.0 (fallback) |
|---|---|---|
| Parameters | 200M | 330M |
| License | Apache-2.0 | `timesfm-non-commercial-license-v1.0` weights |
| Context / patching | 16k context, 32-step input patch | single-pass non-autoregressive contiguous patch masking |
| Distribution / structure | 30M quantile head `p10..p90`, `fix_quantile_crossing=True`, split-conformal calibration | alternating 2D temporal+variate attention, lookahead covariate tokens |

### 2.4 System Two: general LLMs (excluded)

General autoregressive LLM string forecasting (LLMTime) is explicitly excluded. The ground source cites `arXiv:2310.07820` and `ACL 2025 short.71`, a Clef noul of 0.0217 for LLMTime as a System One source, and latency of 5 to 30 s across Monte Carlo rollouts. Doc 06 records this as a non-goal.

## 3. Why this taxonomy matters

The taxonomy is what makes the cascade gateable. Each stage has a typed output (spans and densities; quantile forecasts plus metrics; probabilities over typed questions), so each boundary can carry a deterministic, pre-registered check. Per `AGENT.md` and `ENDPOINTS.md` as quoted in the ground source, "probabilities advise and never authorize": the deterministic gate, not Clef, owns execution.

## Sources Considered

| # | URL | Clef weight | Backing |
|---|---|---|---|
| 1 | https://blog.cloudflare.com/clairic-extraction-model/ | 0.9143 | authoritative |
| 2 | https://developers.cloudflare.com/changelog/post/2026-10-19-clairic-workers-ai/ | 0.7401 | authoritative |
| 3 | https://www.marktechpost.com/2026/10/20/cloudflare-releases-clairic-a-system-one-extraction-model-on-workers-ai/ | 0.1420 | weak backing, clef weight < 0.5 |
| 4 | https://cellcog.ai/blog/cloudflare-clairic-extraction-model/ | 0.4881 | weak backing, clef weight < 0.5 |
| 5 | https://dev.to/techpulse01239/cloudflare-launches-clairic-a-fast-system-one-extraction-model-for-typed-values-54an | 0.0806 | weak backing, clef weight < 0.5 |
| 6 | https://arxiv.org/abs/2310.10688 | 0.2529 | weak backing, clef weight < 0.5 |
| 7 | https://research.google/blog/a-decoder-only-foundation-model-for-time-series-forecasting/ | 0.3217 | weak backing, clef weight < 0.5 |
| 8 | https://proceedings.mlr.press/v235/das24c.html | 0.4018 | weak backing, clef weight < 0.5 |
| 9 | https://arxiv.org/pdf/2310.10688v1 | 0.3362 | weak backing, clef weight < 0.5 |
| 10 | https://research.google/pubs/a-decoder-only-foundation-model-for-time-series-forecasting/ | 0.1550 | weak backing, clef weight < 0.5 |

Dig queries: `Cloudflare System One Clef Clairic prefill`, `decoder-only foundation model time-series forecasting Das`. 10 results: 2 high (>= 0.5), 8 low (< 0.5).
