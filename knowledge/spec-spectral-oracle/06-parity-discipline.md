# 06. Parity Discipline and Test Requirements

**Scope:** Parity discipline: detailed analysis grounded in yubi-OS/yubiOS refs/SPEC-spectral-oracle-2026-10-06.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/SPEC-spectral-oracle-2026-10-06.md, no external web dig

## The house rule

The SPEC ends its parity section with one sentence that settles every dispute in advance: **on mismatch the JavaScript is wrong until proven otherwise.** Python is the source of record; JS is a port.

## Structural constraints on the JS port

- `jev-spectral-math.js` imports nothing worker-specific.
- It is pure functions.
- Fixtures are shared with Python as JSON.

Keeping the math module free of worker imports means it can be run under Node in a parity suite without a worker runtime, and that bindings, auth, or storage code cannot leak into a measurement.

## Mode-specific parity bars

### Walk mode: byte-identical walks

- Identical PRNG (mulberry32) and identical walker seeds (sha-derived) in both languages.
- Result: byte-identical step sequences.
- Parity check: the same d_w to 1e-9.

Byte-identical walks is a strong requirement. Random-walk estimators are noisy; two correct implementations with different RNG streams would legitimately disagree in the third or fourth decimal. By forcing identical streams, the SPEC turns a statistical comparison into an exact one, and any residual difference above 1e-9 must be an implementation difference (integer overflow behavior, rounding, neighbor ordering).

### Series mode: exact counting tables

- Parity check: exact match on the counting table to 1e-12.

Series mode has no randomness, so the bar is tighter. The counting table (ranks versus values inside the [N/8, N/2] window) must agree essentially to the last bit before the regression even runs.

## Comparison with edge-standard-v1 parity

| Instrument | Exactness bar |
|---|---|
| edge-standard-v1 | threshold, coverage, traced count, grid sha exact; max dD 4.4e-16 |
| spectral walk | d_w to 1e-9, identical step sequences |
| spectral series | counting table to 1e-12 |

The family resemblance is deliberate. The SPEC's Python file "mirrors edge_standard.py" as a house rule, and the parity approach follows suit.

## Test requirements

The SPEC lists three tiers:

1. **Python selftest, at least 20 checks**: the gold table (8 rows, doc 04), the permutation null, determinism (same input, same output), and empty-input failures (the instrument must fail loudly on empty masks or series rather than return a number).
2. **Node parity suite** over the fixture pack.
3. **Live-route verification after deploy**, with two recorded lessons: stale deploys take about 20 seconds to clear, and selftest passing does not mean routes work.

## Why each tier exists

| Tier | Catches |
|---|---|
| Python selftest | wrong math against theory |
| Node parity | port drift from the reference |
| Live route | deploy, routing, auth, persistence failures |

None substitutes for another. A port can match a wrong reference perfectly; a correct reference can be deployed behind a broken route.

## Determinism as a parity precondition

Determinism is listed among selftest checks because parity is meaningless without it. If Python itself returned different d_w on repeated calls, a JS mismatch could not be attributed. Sha-derived seeds make determinism automatic: the input fixes the seed, the seed fixes the walks, the walks fix the exponents.

## Workflow derived from this section

1. Change Python first; run the 20+ check selftest.
2. Regenerate shared JSON fixtures from Python.
3. Port to JS; run the Node parity suite at 1e-9 (walk) and 1e-12 (series).
4. If parity fails, fix the JS.
5. Deploy; wait out the stale window; hit all four routes; confirm selftest returns 200.
