# 06. MVP Scope and Explicit Non-Goals

**Scope:** MVP scope in `tools/timesfm-clairic-clef/` and explicit Not-Doing boundaries (no unconditional 3.0 ensemble, no LLMTime string rollouts, no gate bypass).

**Ground source:** `yubi-OS/yubiOS refs/timesfm-clairic-clef-solo-2026-10-21.md`, sections "MVP Scope", "Not Doing (and Why)", "Recommended Direction", and "Open Questions".

**Dig status:** Internal-record subtopic grounded in yubi-OS/yubiOS refs/timesfm-clairic-clef-solo-2026-10-21.md, no external web dig. Every claim restates that record.

**Outline score:** 1.5684 (clef `score`, P(load-bearing) = 0.6789, confidence 0.2762; the lowest-scoring kept subtopic, still above the drop line).

## 1. The MVP in one sentence

A self-contained, zero-dependency Python 3 tool at `yubi-OS/yubiOS/tools/timesfm-clairic-clef/` that implements the V6 cascade contract (doc 02), proves it with 8 pre-registered falsification gates, and runs unchanged against either offline fixtures or live Cloudflare endpoints.

## 2. Deliverables

| File | Purpose |
|---|---|
| `timesfm_clairic_clef.py` | The tool. 3 modes: `--selftest`, `--write-fixtures`, `--run`. |
| `fixtures.json` | Deterministic test fixtures pinned under `mulberry32(20261021)`. |
| `qc-log.json` | All searXNG and Clef decision scores from the ideation run, plus the live Workers AI and `/api/decide` verification receipt. |
| `README.md` | The contract and CLI documentation. |

### 2.1 CLI modes

- **`--selftest`**: runs 8 pre-registered falsification gates, `G1..G8`. The record cites `8/8 PASS` and a runtime under 0.5 s, small enough for `lean-check.yml` on every CI run. Gates referenced elsewhere in the record include G2 (interval coverage, 80/100 after the conformal fix, doc 05 A2) and G6 (2.5 -> 3.0 boundary, doc 05 A3); Gate 2C (`cov_r2 >= 0.20`) is cited as a mitigation in doc 04.
- **`--write-fixtures`**: regenerates `fixtures.json` from the pinned seed, so fixtures are reproducible rather than hand-edited.
- **`--run`**: executes the cascade. Accepts both offline JSON payloads and live `@cf/cloudflare/clairic` and `/api/decide` Clef responses, without code changes between the two.

### 2.2 Why zero dependencies

Doc 04 explains the trade: the selftest uses deterministic reference kernels instead of loading 200M/330M PyTorch weights in GitHub Actions. Stdlib-only Python keeps the contract and gate logic verifiable in CI, while heavy weight execution (`live_clairic_answers`, `live_clef_response`, or a box-side PyTorch runner) stays outside the CI path.

## 3. The cascade the MVP implements

For reference (full detail in docs 01 and 05):

1. **Stage 1, Clairic intake:** messy logs/CSV/deploy notes -> grounded anomaly spans, series values, covariates, plus a `p1..p99` short-horizon density.
2. **Stage 2, TimesFM 2.5 primary with pre-registered fallback:** rolling-origin evaluation against 4 baselines (`seasonal_naive`, `ets_damped_holt` from `tools/forecast-standard/forecast_ets.py`, `last_value`, `drift`). Escalate to TimesFM 3.0 if and only if one gate fires: `MASE > 1.0`, `PICP_80 < 0.70`, `R^2_cov >= 0.20`, peer-series `|r| > 0.40`, or horizon `H > 128`.
3. **Stage 3, Clef plus deterministic gate:** Clef scores `action_choice`, `band_calibrated`, `operational_risk`; the gate blocks on `n < 16`, forces `needs_approval` on uncalibrated intervals or commercial 3.0 use, and emits a `/api/jev/map/outcomes` pre-registration (`verdict: "pending"`) before any action.

## 4. Explicit non-goals

The record lists 3 things the MVP deliberately does not do. Each is a decision, not an omission.

### 4.1 Not running TimesFM 3.0 unconditionally

This is V2 from doc 02, rejected at Clef score 0.4433/3.0. Reasons given:

- TimesFM 3.0 is 65% larger (330M vs 200M parameters) and uses heavier 2D variate attention.
- Its downloadable weights carry `timesfm-non-commercial-license-v1.0`.
- TimesFM 2.5 (Apache-2.0) already handles clean univariate series at zero license cost.

Running 3.0 on every call would pay compute and license cost on exactly the series where it adds nothing. A3 (doc 05) shows the gate isolates the regime where 3.0 helps.

### 4.2 Not using autoregressive LLM string forecasting (LLMTime)

The record cites a searXNG plus Clef literature review (`arXiv:2310.07820`, `ACL 2025 short.71`) and a Clef noul of 0.0217 for LLMTime as a System One source. Stated reasons: general LLM token forecasters are brittle to noise, slow (5 to 30 s across Monte Carlo rollouts), and uncalibrated compared with patched TSFMs and System One regression heads. This keeps System Two out of the numerical path entirely (doc 01, section 2.4).

### 4.3 Not letting Clef or Clairic bypass the deterministic gate

Per `AGENT.md`, model probabilities never authorize execution. Every action requires a pre-registered `/api/jev/map/outcomes` row with `verdict: "pending"` and must pass the deterministic gate. This holds even when Clef is confident; A4 (doc 05) shows Clef escalating on its own, but the design does not depend on that.

## 5. What is out of MVP scope but still open

Two open questions are explicitly deferred, not decided:

1. **Commercial 3.0 bridge.** When `commercial_mode=True` triggers a 3.0 fallback in production, should `/jev/` route to BigQuery ML `AI.FORECAST` via a scoped service account, or hold in `needs_approval`? Current default: `needs_approval` with reason `timesfm_30_non_commercial_weights`.
2. **Endpoint wiring.** Should `/api/jev/forecast/:series` add an optional `?engine=cascade` parameter that runs `clairic -> timesfm-2.5/3.0 -> clef` alongside the existing damped-Holt ETS v1 baseline?

Neither is required for the MVP: the tool stands alone in `tools/` and the conservative default covers the license case.

## 6. Scope boundary at a glance

| In scope | Out of scope |
|---|---|
| Stdlib Python tool, 3 CLI modes | Loading TimesFM weights in CI |
| G1..G8 hermetic selftest | Unconditional 3.0 ensemble (V2) |
| Pinned fixtures, QC receipt log | LLMTime string forecasting |
| Live Clairic and Clef via `--run` | Any model-authorized execution |
| `needs_approval` default for commercial 3.0 | BigQuery ML bridge (Open Question 1) |
| Standalone under `tools/` | `?engine=cascade` endpoint wiring (Open Question 2) |

## Sources

Internal-record subtopic grounded in yubi-OS/yubiOS refs/timesfm-clairic-clef-solo-2026-10-21.md, no external web dig.

| Source | Sections used |
|---|---|
| `yubi-OS/yubiOS refs/timesfm-clairic-clef-solo-2026-10-21.md` | MVP Scope; Not Doing (and Why); Recommended Direction; Open Questions; V6 score justification |
