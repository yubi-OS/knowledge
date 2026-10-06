# Corpus, Taste and Visco Endpoints

Scope: the corpus audit, lens, atom, classify and placements routes, the taste score/matrix/edge-standard instrument, and the visco persistence, hysteresis, prony, mobility, snapback and policy-log measurement gates.

Source of record: yubi-OS/yubiOS docs/ENDPOINTS.md (source doc, weight 0.62). All claims below are from that document unless a dig source is named.

## Corpus Math (20 routes in jev-corpus-routes.js)

GET /api/jev/corpus/health reports which math, atom and lens modules are wired; no auth (source doc, weight 0.62). The 10 capability-map routes for Corpus Math and their contracts:

- POST /api/jev/corpus/audit - the V2, z, verdict, dBc, shares, E_l audit. Idempotent per input sha256: a repeat returns the same run_id with cached:true. Decision-B multipass mode runs passes as a matrix of 2..8 through the same computeAudit path, with inter_pass_offset_dbc as the measurement band (source doc, weight 0.62).
- POST /api/jev/corpus/lens - lens candidates: K reals plus K paired controls in guided-curve-ideate format.
- POST /api/jev/corpus/atom - the RSI-descent atom plan, DRY-RUN only, with the Delta >= 0 invariant asserted. Execution is a gated directive, never inline.
- POST /api/jev/corpus/classify - tautology discerner, parity-tested against tools/tautology-discerner.
- POST /api/jev/corpus/placements - audits a matrix then POSTs its vectors to the worker's own /api/map (a self-call); map rejections relay back as MAP_FAILED.
- GET /api/jev/corpus/runs - the last 50 corpus run rows.
- GET /api/jev/corpus/selftest - all module selftests (math, atom, lens + scorer-v2 extraction) with fixture parity against the Python sources.
- POST /api/jev/corpus/scorer/score - structured-evidence scorer v2.1: deterministic per-axis extraction plus ONE batched jev-1.13 request, hysteresis flips at p >= 0.55 / p <= 0.45, about $0.0002 per call (source doc, weight 0.62).
- POST /api/jev/corpus/scorer/matrix - paced batch scoring of 1..20 docs, default 4.5s spacing between docs.

Core invariants (source doc, weight 0.62): the math is a port, never a re-derivation - fixture parity against the Python sources decides, and on mismatch the JavaScript is wrong until proven otherwise. Every jev_corpus_runs row carries policy_version, where NULL means the pre-stamp era and is never backfilled. Audit and lens results are data, never authorization: only directives through the gate act. Nulls default 100 with cap 1000.

## Taste Engine

4 routes under /api/jev/corpus/taste/ (source doc, weight 0.62): POST /score (deterministic extraction - box-counting fractal dimension D, mirror symmetry, scale coherence - plus ONE batched clef call over 8 nature-law axes, 0.45/0.55 hysteresis, order_seed as a position-bias control), POST /matrix (paced batch scoring of 1..20 items, one run row of kind taste-matrix), GET /selftest (taste-math selftest plus 6-fixture parity against the Python extractor source of record), and POST /edge-standard (edge-standard-v1: gray_b64 in, ink-normalized 1px contour bitmap plus features - fractal D band, mirror symmetry - out).

Invariants (source doc, weight 0.62): the instrument never awards itself a quality score - admitted:false stays until a human-rated real-photo gold set exists; every clef instruction carries a measured number; caller-supplied measurements are stamped source: caller; fixture parity for edge-standard reached max dD 4.4e-16 across 4 fixtures; calibration sweeps are exact (symmetry 0.6 step, 0.3-0.95 variation window, complexity 0.5 step) and sterile-perfect is rejected. Module parts: jev-taste.js, jev-taste-math.js, jev-edge-standard.js, fixtures__taste-fixtures.mjs.

## Visco Instruments

6 routes under /api/jev/corpus/visco/ (source doc, weight 0.62):

- POST /persistence - persistence of bit flips under independent re-grading; audits base and loaded internally through the same computeAudit path.
- GET /hysteresis - closes supersedes chains in the outcomes ledger: the prediction-versus-realized dissipation rollup.
- GET /prony - Prony relaxation fit (tau grid + NNLS) over the corpus-runs history, with t_basis created_at.
- GET /mobility - mines accumulated lens runs into the cell-mobility series, the frozen-baseline recheck input.
- POST /snapback - the mechanized stop verdict for a round's cumulative (predicted, realized) series; the verdict becomes the gate_input halt_round or continue.
- GET /policy-log - the wipe-proof policy changelog, appended on every promote-flow version bump.

Invariants (source doc, weight 0.62): snapback and hysteresis return verdicts only and never execute an action themselves; an empty ledger returns no_data and fewer than 5 points returns 422 INSUFFICIENT_SERIES; deterministic scoring collapses R (text-revert recovery) to 1 so it stays unmeasured; the Prony policy_version filter excludes NULL-era rows.

## External mechanism grounding

Two external mechanisms the endpoints lean on have independent documentation. Prony-series fitting as tau-grid plus non-negative least squares is a documented viscoelastic standard method: the pyvisco library implements exactly a prony fit with a tau grid (https://pyvisco.readthedocs.io/en/latest/_autosummary/pyvisco.prony.html, weight 0.59), and the peer-reviewed discrete-time optimal Prony method exists as the scholarly anchor (https://link.springer.com/article/10.1007/s11043-018-9394-z, weight 0.02, weak). Lean 4 and its mathlib are the formal-verification substrate of the audit theorems: the mathlib4 repository is the Lean 4 math library the verification chain compiles against (https://github.com/leanprover-community/mathlib4, weight 0.14, weak). Both corroborate mechanism classes only; every route contract above is from the source doc.
