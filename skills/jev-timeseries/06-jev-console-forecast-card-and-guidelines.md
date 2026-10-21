# 06: /jev/ Console Forecast Card and Operating Guidelines

**Scope.** The /jev/ Corpus tab Forecast card (class prefix `jevfc-`, engine selector `cascade` vs `ets`, Live Clairic checkbox, stat tiles) and the 4 operational guidelines of the jev-timeseries layer.

**Ground source:** `yubi-OS/yubiOS skills/jev-timeseries/SKILL.md` (sections "Console", "Examples", "Guidelines", and "Forecast v4").

> Internal-record subtopic grounded in yubi-OS/yubiOS skills/jev-timeseries/SKILL.md, no external web dig.

## 1. Where the card lives

- **Page:** the /jev/ ops console on the steady-orbit worker, **Corpus** tab.
- **Storage:** the console HTML is served from KV key `jev-index.html`, not bundled in the worker script. A card change is a KV write, not a code deploy (the `steady-orbit-deploy` skill covers the KV update path).
- **Neighbors:** it is a sibling of the spectral card on the same tab.
- **CSS namespace:** every class uses the `jevfc-` prefix, so card styles cannot collide with the spectral card or other tabs.

## 2. Controls

| control | effect on the request |
|---|---|
| Series selector | sets `:series` in `/api/jev/forecast/:series` |
| Engine selector | `cascade` (3-stage Clairic + TimesFM 2.5 -> 3.0 + Clef, doc 04) or `ets` (damped-trend Holt v2, doc 03) |
| Live Clairic checkbox | appends `&live_clairic=1` (cascade mode) |
| Horizon input | sets `?h=` |

Adding a series to the WAE schema (doc 01) is not complete until its name is added to the series selector; the ground source "Examples" lists that step explicitly.

## 3. Stat tiles

**Always shown (4):**

1. n points
2. last value
3. forecast ± band
4. source (`wae` for GET reads)

**Cascade mode only:**

5. active model (TimesFM 2.5 or the 3.0 fallback)
6. MASE / PICP_80 (mean absolute scaled error; prediction interval coverage probability at 80%)
7. Clef choice (Stage 3 bounded decision)
8. gate disposition (Stage 3 deterministic fail-closed gate)
9. outcomes pre-reg (the `/api/jev/map/outcomes` record, `verdict: "pending"`)

Count note: the outline scope for this doc says 8 stat tiles. The ground source lists 4 base tiles plus 5 cascade items; whether MASE and PICP_80 share one tile, or another pair merges, is not stated, so this doc lists the items as recorded rather than forcing a count.

**Quality chips** render only when set: `insufficient_series` (n < 8) and `low_r2` (holdout R² < 0.5) appear as chips when `quality.flags` contains them, and nothing renders when they are absent. A clean card is not a claim of calibration; see section 5.

**Raw JSON** is collapsed by default for audit.

## 4. Auth

The card authenticates with `sessionStorage` key `jev_key`, the same pattern as the taste card. The operator pastes the bearer once per browser session; it is never stored in KV or the HTML, and it is dropped when the tab session ends. Every forecast and timeseries route is bearer-gated (doc 02), so the card is useless without it, which is the intended failure mode.

## 5. What the card must not say

From the Forecast v4 rules (2026-10-11):

- Do **not** describe the forecast as calibrated in the console, a report, or a demo. `quality.calibrated` stays `false` until a pre-registered gate passes on the live series, and nobody sets it by hand.
- ETS bands are known to undercover (G2: 84/100 vs pre-registered [88, 98]%). The `forecast ± band` tile is an advisory range, not a 95% interval.
- v4 is pre-registered and not wired; the card shows the v2 band.

## 6. The 4 operating guidelines

**G-1. D1 is the system of record; WAE is the disposable trajectory tier.** 3-month retention, sampling on high-volume indexes (not expected at jev volume). Never read WAE to answer an orchestration question D1 can answer.

**G-2. Forecasts advise, never authorize.** A forecast that feeds a gate decision must first record a `{predicted, realized}` pair into the outcomes ledger. The cascade does the predicted half automatically (`verdict: "pending"`); the ETS path does not, so ETS output cannot feed a gate at all without an explicit ledger write.

**G-3. Any gate change is a pre-registered amendment, never a post-hoc loosening.** This is the falsification-corpus discipline. The G2 band-coverage gate stays at [88, 98]% while it fails; the fix is a new pre-registered version, not a wider window.

**G-4. Stay in scope.** Every use stays inside the skill's frontmatter description (forecasting a jev series, adding a series write site, debugging the WAE SQL read path, calibrating the forecaster); anything beyond it belongs to a different skill.

## 7. Operator workflow

1. Open /jev/, Corpus tab; paste the operator key when prompted.
2. Pick a series; confirm `n points` >= 8 (otherwise expect the `insufficient_series` chip and a null forecast).
3. Start with `ets` for a deterministic baseline; switch to `cascade` for covariate-aware intervals and a Clef decision.
4. Read chips first, tiles second, raw JSON for audit.
5. If a forecast is going to inform any gate, confirm the outcomes pre-registration tile shows a pending record before acting.
6. For column or schema doubts, run `GET /api/jev/timeseries/selftest` and read `wae_schema_probe`; expect top-level `ok:false` from G2 and NEG_G2 by design.
