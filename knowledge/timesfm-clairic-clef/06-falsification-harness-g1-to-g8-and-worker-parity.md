# 06: Falsification Harness G1 to G8 and Worker Parity

**Scope:** The 8 pre-registered falsification gates G1..G8 in `tools/timesfm-clairic-clef/timesfm_clairic_clef.py` and bit-exact parity with `jev-cascade-forecast.js` on steady-orbit.

**Ground source:** `yubi-OS/yubiOS refs/timesfm-clairic-clef-2026-10-21.md` (Section 4) and the tool README `tools/timesfm-clairic-clef/README.md` (pre-registered gate table).

**Dig backing:** none. This is an internal-record subtopic with no seed queries in `outline.json` and no `dig_context_06.json`. Every claim below traces to the ground source, the tool README, the selftest output, or the worker module header. No external URL carries a Clef weight in this doc.

## 1. What the harness is

`timesfm_clairic_clef.py --selftest` runs 8 falsification gates in hermetic stdlib Python with zero external dependencies (ground source Section 4; tool README, CLI Usage). Fixtures are generated deterministically under `mulberry32` seed `20261021` and pinned in `fixtures.json` (`--write-fixtures`). The instrument identifies itself as `timesfm-clairic-clef v1.0.0 (scamper-cascade-2p5-to-3p0)`.

"Pre-registered" means each gate's pass condition was written before the run, and a failing gate is reported as a failure, not re-tuned. The predecessor ETS track shows what happens under that rule: its G2 stayed failed through rounds R6 to R9 plus BD1 instead of the window being moved (ground source TL;DR item 2).

## 2. The 8 gates

Conditions are from the tool README. Measured results are from the ground source Section 4 and the selftest output.

| Gate | Pass condition | Measured | Verdict |
|---|---|---|---|
| G1 trend and seasonal recovery | active model `timesfm-2.5-200m`, `mase_25 < 0.65` and `< mase_last` | `0.1332 < 0.4415`, no fallback | PASS |
| G2 conformal band coverage | 100 seeded noisy seasonal series, `n=48`, `h=1`, `[p10, p90]` coverage in `[0.72, 0.94]` | 80/100 (0.80) | PASS |
| G3 determinism | two runs byte-identical (`sort_keys=True`) | 7,215 == 7,215 bytes | PASS |
| G4 insufficient series fail-closed | `n < 16` returns `forecast=None`, `gate_disposition="blocked"` | `n=7`, blocked | PASS |
| G5 quantile monotonicity | 0 crossings `p10 <= p20 <= ... <= p90` | 0 horizon, 0 holdout | PASS |
| G6 automatic 2.5 to 3.0 fallback | covariate-shock series: `mase_25 > 1.0`, `cov_r2 >= 0.20`, then `mase_30 < 0.50` | `1.0827 -> 0.0545`, `cov_r2 = 0.944` | PASS |
| G7 Clairic messy intake and spans | 28 rows extracted, exact span, 99-quantile steps | span `[874, 893]` = `"sermon S5 W8 deploy"`, `slice_match=True`, 3 steps x 99 | PASS |
| G8 Clef fail-closed and outcomes pre-reg | commercial 3.0 fallback forces `needs_approval` over `act`, emits outcomes row | `needs_approval`, reason `timesfm_30_non_commercial_weights`, verdict `pending` | PASS |

Summary from the selftest output: `passing_gates: 8`, `total_gates: 8`, `failing_gates: []`, `unverified_gates: []`.

## 3. What each gate falsifies

- **G1** would fail if the 2.5 kernel could not beat naive persistence on a clean trend-plus-season series, or if it escalated when it should not.
- **G2** would fail if conformal calibration were still shrinking the band (the ETS failure from doc 02) or bloating it. The window is two-sided around the nominal 0.80.
- **G3** would fail on any non-determinism: unsorted keys, unseeded randomness, or float formatting drift.
- **G4** would fail if the cascade produced a forecast from 7 points instead of refusing.
- **G5** would fail on quantile crossing, which would make pinball loss and `PICP_80` meaningless.
- **G6** would fail if the gate in doc 04 did not fire on a designed covariate shock, or if 3.0 did not recover the error budget.
- **G7** would fail if the extracted note's span did not slice back to the exact source string.
- **G8** would fail if a caller-supplied `act` could get past the license boundary, or if no `pending` outcomes record were emitted (doc 05).

## 4. Live verification receipt

The tool directory also holds a live receipt (`live_verification_receipt.json`, verified 2026-10-21T10:02:00Z). In it, Clairic returned HTTP 200 on 2 passes, 2,490 input tokens, 0 output tokens. It extracted 28 values and the note `"sermon S5 W8 deploy"` at span `[874, 893]` (`p_null` about 0.0000447, confidence 0.8021), and produced a 3-day forecast with values `[22.8, 22.4, 22.3]`. The two Clef decisions match the ground source's Section 3.2 (`wait` 0.8551 on 2.5; `review` 0.7545 on 3.0). This ties G7's deterministic span kernel to real Workers AI behavior on the same text.

Compare this with the ground source's Section 1.2 schema probe, where the span was `[373, 392]`. That was a shorter input text, so the offsets differ while the extracted string is the same.

## 5. Worker parity with `jev-cascade-forecast.js`

The steady-orbit worker carries a JavaScript port: `jev-cascade-forecast.js`, whose header reads "JS worker port of `tools/timesfm-clairic-clef/timesfm_clairic_clef.py`", "Pure ES module, zero external dependencies, deterministic under mulberry32(20261021)". It exports the same instrument version string and its own `cascadeSelfTest()` running G1 to G8.

The parity record (the steady-orbit `ENDPOINTS.md` grounding copy) states:

- `POST /api/jev/forecast/:series` and `GET /api/jev/forecast/:series?engine=cascade` run the 3-stage cascade, 8/8 gates G1 to G8 PASS.
- Parity source of record: `tools/timesfm-clairic-clef/timesfm_clairic_clef.py`, **parity max abs delta <= 1.42e-14 on 4 fixtures**, wired into `lean-check.yml` `verify-tools`.
- Deploy etag `356cb5c1c2e3e3f8b308ba6e29ab06bf27fd99fc107cc9d7f60b01d0dfb7e6b7` (67 module parts).

Precision note: the scope line says "bit-exact", but the recorded figure is a max absolute delta of at most 1.42e-14, which is float-epsilon agreement and not literal bit identity. Byte-identical output is claimed only within each runtime (G3). This doc reports the measured number and does not round it up to "bit-exact".

For contrast, the ETS track's parity is recorded as max abs delta = 0 on 4 fixtures, and its default `GET /api/jev/forecast/:series` still reports G2 FAIL. The cascade engine is opt-in through `?engine=cascade`.

## 6. Limits of the harness

- The TimesFM 2.5 and 3.0 paths in the harness are deterministic stdlib kernels that reproduce the routing and calibration contracts. They do not load the 200M or 330M weights. Passing G1 and G6 shows the cascade *logic* is sound on designed fixtures, not that the real models reach those MASE values.
- G2 checks marginal coverage over 100 series. It says nothing about per-series conditional coverage (see doc 02's conformal caveat).
- 4 parity fixtures is a small sample. A wider fixture sweep would strengthen the parity claim.

## Sources Considered

| # | Source | Clef weight | Backing | Used for |
|---|---|---|---|---|
| G | `yubi-OS/yubiOS refs/timesfm-clairic-clef-2026-10-21.md` | n/a (ground source) | Ground | Gate results, ETS history |
| R | `tools/timesfm-clairic-clef/README.md` | n/a (internal record) | Ground | Gate conditions, CLI |
| S | `tools/timesfm-clairic-clef` selftest output | n/a (internal record) | Ground | 8/8 summary, gate details |
| L | `tools/timesfm-clairic-clef/live_verification_receipt.json` | n/a (internal record) | Ground | Live Clairic + Clef receipt |
| W | steady-orbit `jev-cascade-forecast.js` header | n/a (internal record) | Ground | Port identity, seed |
| E | steady-orbit `docs/ENDPOINTS.md` | n/a (internal record) | Ground | Parity delta, routes, etag |
| -- | No external dig (no `dig_context_06.json`) | n/a | n/a | Internal-record subtopic by design |
