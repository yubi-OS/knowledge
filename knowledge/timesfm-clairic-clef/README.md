# timesfm-clairic-clef: Hybrid TimesFM (2.5 -> 3.0 Fallback) + Cloudflare Clairic + Clef Forecasting and Decision Cascade

**Ground source:** `yubi-OS/yubiOS refs/timesfm-clairic-clef-2026-10-21.md`

This corpus documents a 3-stage forecasting and decision cascade:

1. **Cloudflare Clairic** extracts typed series, covariates, and grounded spans from messy text.
2. **TimesFM 2.5**, with split-conformal bands, forecasts, and escalates to **TimesFM 3.0** only when a pre-registered rolling-origin gate fires.
3. **Cloudflare Clef** recommends a bounded action to a deterministic fail-closed gate, which pre-registers the outcome before anything acts.

Every claim in the docs carries its source and the Clef weight that backed it. Sources weighted below 0.5 are labeled weak backing.

## Docs

Scores are from the Clef `score` validation in `research-db/outline.json` (0 = padding, 1 = marginal, 2 = load-bearing). All 6 were kept; none were dropped.

| # | Doc | Scope | Outline score |
|---|---|---|---|
| 01 | [01-clairic-system-one-extraction-and-density.md](01-clairic-system-one-extraction-and-density.md) | Clairic single-pass prefill extraction, character-offset spans, `p_null`, 99-quantile short-horizon density forecasting vs LLMTime | 1.8059 |
| 02 | [02-timesfm-2p5-patched-decoder-and-conformal-bands.md](02-timesfm-2p5-patched-decoder-and-conformal-bands.md) | TimesFM 2.5 (200M, Apache-2.0, 16k context, 32-step patch, quantile head) and split-conformal calibration fixing ETS G2 shrinkage | 1.9417 |
| 03 | [03-timesfm-3p0-multivariate-and-covariate-architecture.md](03-timesfm-3p0-multivariate-and-covariate-architecture.md) | TimesFM 3.0 (330M, contiguous patch masking, 2D temporal+variate attention, lookahead covariates, non-commercial weights) | 1.9074 |
| 04 | [04-preregistered-2p5-to-3p0-fallback-gate.md](04-preregistered-2p5-to-3p0-fallback-gate.md) | Rolling-origin evaluation vs seasonal naive and damped-Holt ETS; the 4 Clef-weighted triggers (MASE, PICP_80, covariate R2, H > 128) | 1.9269 |
| 05 | [05-clef-bounded-decision-and-outcomes-ledger.md](05-clef-bounded-decision-and-outcomes-ledger.md) | Clef choice/noul/score routing, the AGENT.md fail-closed invariant, `/api/jev/map/outcomes` pre-registration | 1.9374 |
| 06 | [06-falsification-harness-g1-to-g8-and-worker-parity.md](06-falsification-harness-g1-to-g8-and-worker-parity.md) | The 8 pre-registered gates G1..G8 and parity with `jev-cascade-forecast.js` on steady-orbit (internal-record doc, no external dig) | 1.6526 |

## Research summary

| Metric | Value |
|---|---|
| Results collected | 50 (10 per subtopic for 01 to 05) |
| High weight (`>= 0.5`) | 19 |
| Low weight (`< 0.5`) | 31 |
| jev (`/api/decide`) requests | 11 |
| Redos | 0 |
| Skips | 0 |
| Weighting metric | `noul` via clef (true = primary/official source) |
| Outline metric | `score` via clef, 3 levels lowest-first |

Preflight 2026-10-21: searXNG 59 results healthy; /api/decide (clef) 200

## Gaps and caveats

- Doc 06 has no external dig by design. It is grounded in the ground source, the tool README, the selftest output, the live verification receipt, and the steady-orbit `ENDPOINTS.md` parity record.
- The 2 doc-05 seed queries on forecast-then-optimize / decision-focused learning returned only low-weight results (all `< 0.05`). They are cited as adjacent context only.
- Worker parity is recorded as max abs delta <= 1.42e-14 on 4 fixtures (float-epsilon agreement), not literal bit identity.
- The harness's TimesFM paths are deterministic kernels that reproduce the routing contracts. They are not runs of the 200M / 330M weights.

## Research DB

See `research-db/` for `preflight.json`, `outline.json`, `archive.json` (all 50 weighted results with full decision records), `digs/`, `jev-log.json`, and `db.ts`.
