# 04. Finalist Stress-Testing and Untestable Bets

**Scope:** Adversarial stress-test of finalists V6, V5, and V4: conformal window breakdown under abrupt regime shifts, non-commercial 3.0 weight governance, and wire-schema drift.

**Ground source:** `yubi-OS/yubiOS refs/timesfm-clairic-clef-solo-2026-10-21.md`, sections "Stress-Test of Top 3 Finalists (V6, V5, V4)", "Recommended Direction", and "Open Questions".

**Dig status:** Internal-record subtopic grounded in yubi-OS/yubiOS refs/timesfm-clairic-clef-solo-2026-10-21.md, no external web dig. No outside source was consulted; every claim below restates the internal record.

**Outline score:** 1.8305 (clef `score`, P(load-bearing) = 0.8717, confidence 0.6537).

## 1. Why stress-test after scoring

Scoring (doc 03) ranks variations by how good they look. Stress-testing asks what breaks them. The ideate-solo record applies 3 probes to each of the top 3 finalists (V6, V5, V4): the strongest critique, the second-order effects, and the un-testable bet (the assumption that cannot be falsified before shipping). The 2 losing finalists were not discarded; their critiques were folded into V6.

## 2. V6: Unified SCAMPER Cascade Tool (winner)

### 2.1 Strongest critique: the selftest is not the real model

In hermetic `--selftest` mode, the tool runs deterministic reference kernels for Clairic, TimesFM 2.5/3.0, and Clef instead of loading the 200M/330M PyTorch weights inside GitHub Actions `ubuntu-latest`. A passing selftest therefore proves the protocol contract and the gate logic, not the accuracy of the real models.

### 2.2 Second-order effect: the separation is the feature

The record argues this critique is also the design's main strength. Separating the protocol contract plus conformal fallback gate (stdlib Python, fast CI) from heavy weight execution (`live_clairic_answers`, `live_clef_response`, or a box-side PyTorch runner) lets `lean-check.yml` verify all 8 falsification gates in under 0.5 s, while the live pipeline calls Cloudflare Workers AI and local or cloud TimesFM unchanged.

The practical reading: CI guards the contract, live validation (doc 05, A1 and A4) guards the wire. Neither alone is sufficient.

### 2.3 Un-testable bet: conformal windows under structural breaks

The bet: split-conformal calibration on a trailing rolling window (n_cal between 4 and 16) remains calibrated under sudden structural breaks, before the TimesFM 3.0 covariate fallback triggers.

Why it cannot be tested up front: split-conformal coverage guarantees assume exchangeability between calibration residuals and future residuals. An abrupt regime shift violates that by construction, and a 4-to-16 point window has little room to absorb it. No pre-shipping fixture can enumerate every real break.

**Mitigations recorded in the ground source:**

1. **Gate 2C** (`cov_r2 >= 0.20`): if covariates explain at least 20% of residual variance, the pipeline escalates to TimesFM 3.0's lookahead covariate path rather than trusting the 2.5 conformal band.
2. **Clef `review` escalation on anomaly notes**: when Clairic's extracted anomaly note signals a break, Clef's `action_choice` can route to `review` instead of `act`. A4 (doc 05) shows Clef doing exactly this on the covariate-shock path (`review`, p = 0.7545, risk 1.4968).
3. **Deterministic gate**: `n < 16` blocks outright, and uncalibrated intervals force `needs_approval`.

These reduce exposure; they do not eliminate the bet. The residual risk is a break that is neither covariate-explained nor flagged by Clairic.

## 3. V5: Pure Offline CLI Only

**Strongest critique: wire-schema drift.** Without live `@cf/cloudflare/clairic` and `/api/decide` integration, the tool could drift from Cloudflare's actual Workers AI response schema. A selftest that only exercises reference kernels would keep passing while production payloads changed shape underneath it.

**Resolution:** folded into V6, which accepts both offline JSON payloads and live Clairic and Clef responses through `--run`. A1 in doc 05 is the live schema check that closes this gap for the 2026-10-21 snapshot (HTTP 200, model ID `6b0b79c1-25e6-4498-bb62-5161df39f0ef`).

**Residual risk:** schema drift is a recurring risk, not a one-time one. A single live receipt validates one date. The record does not specify a re-validation cadence.

## 4. V4: Architecture Spec Only

**Strongest critique: no falsification harness.** A spec without an executable `--selftest` leaves the `Falsification Harness` column in `ENDPOINTS.md` at `No`. In a fail-closed architecture, an unfalsifiable component cannot earn trust.

**Resolution:** folded into V6, which ships the G1..G8 harness (doc 06).

## 5. Governance risk: non-commercial TimesFM 3.0 weights

The stress-test sections do not list licensing as a critique of V6, but the Recommended Direction and Open Questions make it the most consequential operational risk. TimesFM 3.0 downloadable weights carry `timesfm-non-commercial-license-v1.0`. The deterministic gate therefore forces `needs_approval` whenever commercial execution would hit a 3.0 fallback, with reason `timesfm_30_non_commercial_weights`.

This is unresolved. Open Question 1 asks whether `/jev/` should route commercial 3.0 calls to BigQuery ML `AI.FORECAST` via a scoped service account, or keep holding them in `needs_approval` for operator review. The current default is the conservative one.

## 6. Summary of risks

| Risk | Finalist exposed | Mitigation | Status |
|---|---|---|---|
| Selftest uses reference kernels, not weights | V6 | Contract/weights split; live checks A1, A4 | Accepted by design |
| Conformal miscalibration under abrupt breaks | V6 | Gate 2C, Clef `review`, `n < 16` block | Un-testable bet, partially mitigated |
| Wire-schema drift | V5 (and V6 over time) | Live `--run` path; A1 receipt | Closed for 2026-10-21; no re-check cadence |
| No falsification harness | V4 | G1..G8 `--selftest` in V6 | Closed |
| Non-commercial 3.0 weights | V6 (any 3.0 fallback) | `needs_approval` default | Open Question 1 |

## Sources

Internal-record subtopic grounded in yubi-OS/yubiOS refs/timesfm-clairic-clef-solo-2026-10-21.md, no external web dig.

| Source | Sections used |
|---|---|
| `yubi-OS/yubiOS refs/timesfm-clairic-clef-solo-2026-10-21.md` | Stress-Test of Top 3 Finalists; Recommended Direction (Stage 3 gate); Key Assumptions A1, A4; Open Questions 1 |
