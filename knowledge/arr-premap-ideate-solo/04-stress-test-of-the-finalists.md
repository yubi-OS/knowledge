# 04-stress-test-of-the-finalists

**Scope.** Stress test of the finalists: detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-ideate-solo-2026-10-16.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/arr-premap-ideate-solo-2026-10-16.md, no external web dig

## Purpose of the stress test

After scoring, the ground source stress-tests only the two finalists, V2 and V3. Each stress test has the same three parts: the strongest critique, second-order effects, and the untestable bet. The structure forces the author to name what could make the finalist wrong, what else it changes, and which assumption no available experiment can check.

## V2: canonical tie-break first

**Strongest critique.** The exact graph is a different object from the deployed graph. The gasket's true walk dimension is ln5 / ln2 = 2.3219, and the measured value is 2.77, a finite-size value. Pinning one tie-break does not make the finite-size value correct, only reproducible. This is the most important caveat in the record about the walk leg. Reproducibility and correctness are different properties: a canonical Delaunay removes implementation dependence, but the 2.77 versus 2.3219 gap is a property of finite N and the estimator, not of tie-breaking. The arithmetic checks: ln 5 is about 1.6094, ln 2 is about 0.6931, and their ratio is about 2.3219.

**Second-order effects.** Router pair-bands gate on d_w at 2.4, and the gasket sits near 2.77. A 0.02 shift is harmless today, because 2.77 minus 0.02 is still well above 2.4, but the record requires a re-check on any graph change. Every spectral consumer inherits the change. This links the stress test to the switching score of 3: the cost of V2 is not only the version bump but the obligation to re-verify every downstream gate.

**Untestable bet.** That the canonical graph is the one the theory describes for a physical droplet arrangement. It is testable only in the gold family, the synthetic renders where ground truth exists. For real droplets there is no reference graph.

## V3: containment premap

**Strongest critique.** At the identity frame the premap is bookkeeping. Real panels need registration, and containment breaks under any displacement larger than the tolerance. Containment asks whether every observed site coincides with a template site within a tolerance; at the identity frame, where observed sites are exact template sites, success is guaranteed by construction. The record's generation log repeats this as the critique of the winner: containment is brittle under any displacement beyond tolerance, and bookkeeping at the identity frame is not a physical result.

**Second-order effects.** Once a premap exists, its fills could be mistaken for measurements. They must never feed the router as evidence. Fills are predictions, not observations. This becomes a design rule that also blocks V6 and appears again in the "Not doing" list.

**Untestable bet.** That real hierarchical occupancy is gasket-like enough for containment to identify its level. It is not testable without ground truth.

## Comparing the two critiques

| Finalist | What the critique attacks | Severity for MVP | Mitigation in the record |
|---|---|---|---|
| V2 | Correctness of the finite-size d_w | Medium: the MVP only claims reproducibility | A6 tie-break invariance gate; A1 verdicts labelled implementation-dependent until A6 passes |
| V3 | Physical meaning at the identity frame | Low for MVP, high for real data | Scope stated as identity-frame gold only; registration named as the first open gate |

Both finalists survive because each critique attacks a claim the MVP explicitly does not make. V2's MVP claims a reproducible graph, not a correct exponent. V3's MVP claims identity-frame identification on gold data, not a statement about real panels.

## Numbers that carry the stress test

- Theoretical gasket walk dimension: ln5 / ln2 = 2.3219.
- Measured finite-size walk dimension: about 2.77.
- Router pair-band walk gate: d_w at 2.4.
- Tolerable shift today: 0.02 (harmless, but must be re-checked on any graph change).

## Why only two finalists were stress-tested

V1 is the backbone and inherits V2's stress test, since Line A is V1 plus V2. V5 and V7 are deferred to Phase 2 and V6 is blocked, so stress-testing them would evaluate ideas that cannot ship in this build. V4 was dropped at sum 7. The stress test therefore concentrates on the two ideas that will actually be built, which keeps the critique proportional to commitment.

## How the stress test shapes the build

Three concrete requirements in the recommended direction come straight from this section: A6 as a tie-break invariance gate (from V2's critique), the rule that A1 verdicts are implementation-dependent until A6 passes (from V2's critique), and the rule that fills never feed the router (from V3's second-order effects). The registration gate for real panels (from V3's critique) is named as the first open gate and left untested.
