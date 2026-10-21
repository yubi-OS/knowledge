# 04: Hybrid Cascade Engine (Clairic, TimesFM, Clef)

**Scope.** `jev-cascade-forecast.js`, reached via `GET /api/jev/forecast/:series?engine=cascade` and `POST /api/jev/forecast/:series`: Stage 1 Clairic intake, Stage 2 TimesFM 2.5 to 3.0 conformal fallback, Stage 3 Clef decision plus outcomes pre-registration.

**Ground source:** `yubi-OS/yubiOS skills/jev-timeseries/SKILL.md` (sections "Routes" and "Console").

> Internal-record subtopic grounded in yubi-OS/yubiOS skills/jev-timeseries/SKILL.md, no external web dig.

## 1. What the cascade is

The ground source calls it a **3-stage SCAMPER cascade**. It is the second forecast engine on the worker, alongside the default damped-trend Holt ETS (doc 03). Where ETS is a single deterministic fit over one numeric series, the cascade combines text extraction, a foundation-model forecast with calibrated intervals, and a bounded decision step.

**Source of record and parity.** The JavaScript module `jev-cascade-forecast.js` mirrors the Python source of record `tools/timesfm-clairic-clef/timesfm_clairic_clef.py`, with parity max |delta| <= 1.42e-14 on 4 fixtures. That tolerance is floating-point noise, not model drift: the two runtimes compute the same numbers.

**Self-test.** `cascade_selftest` inside `GET /api/jev/timeseries/selftest` runs 8 pre-registered gates G1..G8, all PASS, and reports `cascade_selftest.ok: true` even while the top-level `ok` is `false` because of the ETS G2 and NEG_G2 failures.

## 2. Entry points

| entry | input source | notes |
|---|---|---|
| `GET /api/jev/forecast/:series?engine=cascade` | WAE, last 1000 points | add `&live_clairic=1` to call live Clairic |
| `POST /api/jev/forecast/:series` | request body, or WAE when `values` and `state_text` are omitted | full control over covariates and thresholds |

POST body fields: `values`, `state_text`, `past_covariates`, `future_covariates`, `peer_series`, `horizon`, `season_len`, `action_threshold`, `commercial_mode`, `live_clairic`, `live_clef`. All optional.

## 3. Stage 1: Clairic intake

Model: `@cf/cloudflare/clairic`.

Stage 1 does 3 things per the ground source:

1. **Extraction** from `state_text` (or the series context).
2. **Byte-offset spans**: every extracted item points back to an exact byte range in the input, so an extraction can be audited against its source text rather than trusted as a paraphrase.
3. **99-quantile short forecast**: a quantile forecast over a short horizon that seeds the later stages.

`live_clairic` (body) or `&live_clairic=1` (GET) switches from the deterministic path to a live model call. The console exposes this as the "Live Clairic" checkbox (doc 06).

## 4. Stage 2: TimesFM 2.5 primary, TimesFM 3.0 fallback

- **Primary:** TimesFM 2.5 (Apache-2.0).
- **Calibration:** split-conformal. A held-out calibration slice measures actual forecast error and sets interval width from it. This is the direct answer to the ETS problem in doc 03, where the band is built from an in-sample residual_sd that undercovers (84/100 vs [88, 98]%).
- **Fallback gate:** pre-registered, rolling-origin. Stage 2 falls back to TimesFM 3.0 when the 2.5 model loses on any of:
  - MASE (mean absolute scaled error),
  - interval coverage,
  - covariate R² >= 0.20 (covariates explain enough variance that the covariate-capable path should run),
  - variate coupling (peer series move together strongly enough to matter).

Rolling-origin means the comparison re-fits at several cut points through the history rather than trusting a single split. Pre-registration means the thresholds were fixed before seeing which model wins, consistent with Guideline 3 (gate changes are pre-registered amendments, never post-hoc loosening).

The `commercial_mode` flag is carried on the request; the ground source records TimesFM 2.5's Apache-2.0 license but does not spell out what `commercial_mode` changes, so this doc does not specify it.

## 5. Stage 3: Clef decision and outcomes pre-registration

Model: `@cf/cloudflare/clef`.

1. **Bounded decision.** Clef answers a constrained choice over the Stage 2 output (the console shows it as the "Clef choice" tile). `action_threshold` parameterizes the decision boundary.
2. **Deterministic fail-closed gate.** The Clef answer passes through a deterministic gate; when inputs are missing or the decision is out of bounds, the result is closed, not optimistic. The console surfaces this as "gate disposition".
3. **Outcomes pre-registration.** The cascade writes its prediction to `/api/jev/map/outcomes` with `verdict: "pending"`.

Step 3 is what enforces Guideline 2: "Forecasts advise, never authorize. A forecast that feeds a gate decision must first record a {predicted, realized} pair into the outcomes ledger." The pending record is the predicted half; the realized half is filled later, and only a scored pair can justify letting a forecast influence a gate.

`live_clef` switches Stage 3 to a live model call, mirroring `live_clairic` for Stage 1.

## 6. Cascade vs ETS: when to use which

| question | ETS (`engine=ets`, default) | cascade (`engine=cascade`) |
|---|---|---|
| deterministic, zero model calls | yes | only with live flags off |
| uses text context | no | yes (Stage 1) |
| uses covariates or peer series | no | yes (Stage 2) |
| interval calibration | in-sample residual_sd, known undercover | split-conformal |
| emits a decision | no | yes, bounded and fail-closed (Stage 3) |
| writes an outcomes pre-registration | no | yes, `verdict: "pending"` |
| selftest status | G2, NEG_G2 FAIL by design | G1..G8 PASS |

## 7. Console outputs in cascade mode

Beyond the base tiles, the /jev/ Forecast card adds, in cascade mode only: active model, MASE/PICP_80 (prediction interval coverage probability at 80%), Clef choice, gate disposition, and outcomes pre-reg. Doc 06 covers the card.

## 8. Limits of this record

The ground source names the stages, models, gate criteria, and endpoints. It does not record numeric outputs from a live cascade run, the size of the conformal calibration slice, or the rolling-origin cut count, so none are stated here.
