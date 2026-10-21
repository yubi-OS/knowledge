# 05. Validated Assumptions A1 to A4

**Scope:** Empirical validation of assumptions A1 (Clairic live schema & spans), A2 (conformal G2 80/100 fix), A3 (2.5->3.0 MASE 1.0827->0.0545), and A4 (Clef risk separation).

**Ground source:** `yubi-OS/yubiOS refs/timesfm-clairic-clef-solo-2026-10-21.md`, section "Key Assumptions to Validate".

**Dig status:** Internal-record subtopic grounded in yubi-OS/yubiOS refs/timesfm-clairic-clef-solo-2026-10-21.md, no external web dig. All numbers below are quoted from that record; none were re-measured for this doc.

**Outline score:** 1.7685 (clef `score`, P(load-bearing) = 0.8329, confidence 0.5626).

## 1. Why these 4 assumptions

The V6 cascade (doc 02) stands on 4 load-bearing assumptions, one per seam in the design:

| ID | Seam | Question it answers |
|---|---|---|
| A1 | Stage 1 wire contract | Does Clairic actually return what Stage 1 expects? |
| A2 | Stage 2 interval calibration | Do the 2.5 quantile bands hit their nominal coverage? |
| A3 | Stage 2 escalation boundary | Is there a measurable regime where 3.0 beats 2.5? |
| A4 | Stage 3 decision separation | Does Clef treat the primary and fallback paths differently? |

All 4 are marked `[x]` (validated) in the ground source. 2 were validated live against Cloudflare endpoints (A1, A4) and 2 inside the hermetic `--selftest` (A2, A3). That split matters: live checks validate the real models on one date, selftest checks validate the contract and gate logic against reference kernels (see doc 04, section 2.1).

## 2. A1: Clairic live schema and span fidelity

**Claim:** `@cf/cloudflare/clairic` is live on Workers AI and returns character-offset `span`, `p_null`, `list` series extractions, and 99-percentile `forecast` steps in a single call.

**Evidence (live, 2026-10-21):**

- HTTP 200 from Workers AI.
- Model ID `6b0b79c1-25e6-4498-bb62-5161df39f0ef`.
- Extracted 28 of 28 series values.
- Returned an anomaly note with a span.
- Returned a 3-day forecast.

**What it proves:** the Stage 1 wire schema exists in the shape the tool consumes, which closes V5's wire-schema-drift critique for this snapshot (doc 04, section 3).

**What it does not prove:** span accuracy beyond this one payload, or schema stability over time. Clairic is a preview model per Cloudflare's own changelog (see doc 01), so re-validation is warranted on any model-ID change.

## 3. A2: Conformal calibration fixes the ETS G2 shrinkage trap

**Background:** Pure damped-Holt ETS in `tools/forecast-standard/` failed Gate G2 with 84/100 coverage against a required band of 88 to 98%. Root cause in the record: grid-selected parameters shrank the holdout `residual_sd`, producing intervals that were too narrow.

**Claim:** split-conformal calibration over rolling-origin non-conformity scores restores finite-sample 80% interval coverage.

**Evidence (`--selftest`):** 80/100 coverage across 100 seeded series in Gate G2.

**Reading the number:** 80/100 is the target for an 80% interval (`PICP_80`), so the fix lands on nominal coverage. Note that the earlier ETS gate used an 88 to 98% band, so the 2 numbers are against different nominal levels; the record presents the conformal result as restoring nominal 80% coverage, not as passing the ETS band.

**Residual risk:** the un-testable bet in doc 04 (conformal windows under abrupt breaks) is the limit of this validation. 100 seeded series do not cover arbitrary real regime shifts.

## 4. A3: The 2.5 -> 3.0 fallback boundary is mechanically separable

**Claim:** univariate TimesFM 2.5 degrades when exogenous covariate shocks or cross-series couplings drive the series, while TimesFM 3.0's lookahead covariate projection does not.

**Evidence (`--selftest`, Gate G6):**

| Metric | Value |
|---|---|
| `mase_25` (TimesFM 2.5 holdout MASE) | 1.0827 |
| `cov_r2` (covariate share of residual variance) | 0.944 |
| `mase_30` (TimesFM 3.0 holdout MASE) | 0.0545 |

**Reading the numbers:** `mase_25 = 1.0827` exceeds the `MASE > 1.0` escalation gate (worse than the naive baseline), and `cov_r2 = 0.944` far exceeds the `R^2_cov >= 0.20` gate. Both triggers fire, and 3.0 cuts holdout MASE by roughly 20x. The boundary is "mechanically separable" in the sense that the pre-registered gates fire on exactly the fixture where 3.0 is better.

**Caveat:** this runs on deterministic reference kernels in the selftest, not on real TimesFM weights. It validates that the gate logic routes correctly, not the real-world size of the 3.0 advantage.

## 5. A4: Live Clef decision scoring separates primary vs fallback risk

**Claim:** on the live `/api/decide` endpoint, Clef scores the clean 2.5 path and the 3.0 covariate-shock path differently, escalating the fallback.

**Evidence (live, 2026-10-21):**

| Path | `action_choice` | p | `band_calibrated` | `operational_risk` |
|---|---|---|---|---|
| Clean TimesFM 2.5 | `wait` | 0.8551 | 0.9288 | 0.7041 |
| TimesFM 3.0 covariate-shock fallback | `review` | 0.7545 | 0.9714 | 1.4968 |

**Reading the numbers:** risk roughly doubles (0.7041 to 1.4968 on the 0..3 scale) and the action escalates from `wait` to `review`, even though Clef rates the fallback band as slightly better calibrated (0.9714 vs 0.9288). That is the desired behavior: calibration is not the same as safety, and a covariate shock warrants human review regardless.

**Governance note:** per `AGENT.md`, these probabilities advise and never authorize. Even a confident `act` would still pass through the deterministic gate and require a pre-registered `/api/jev/map/outcomes` row with `verdict: "pending"`.

## 6. Summary

| ID | Mode | Key number | Status |
|---|---|---|---|
| A1 | live | 28/28 values, HTTP 200 | validated 2026-10-21 |
| A2 | selftest | 80/100 coverage (G2) | validated |
| A3 | selftest | MASE 1.0827 -> 0.0545 (G6) | validated |
| A4 | live | risk 0.7041 -> 1.4968, `wait` -> `review` | validated 2026-10-21 |

## Sources

Internal-record subtopic grounded in yubi-OS/yubiOS refs/timesfm-clairic-clef-solo-2026-10-21.md, no external web dig.

| Source | Sections used |
|---|---|
| `yubi-OS/yubiOS refs/timesfm-clairic-clef-solo-2026-10-21.md` | Key Assumptions to Validate (A1 to A4); Recommended Direction (gate thresholds); Not Doing (gate bypass) |
