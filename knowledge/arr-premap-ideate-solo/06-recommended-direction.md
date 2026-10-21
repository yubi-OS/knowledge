# 06-recommended-direction

**Scope.** Recommended direction: detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-ideate-solo-2026-10-16.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/arr-premap-ideate-solo-2026-10-16.md, no external web dig

## Recommended direction

The ground source recommends building two lines in parallel, both session-only.

**Line A (arrangement-response-v1).** Port the three-arm experiment (clean, pixel warp, arrangement warp) to a route. Report D and d_w per arm and gate them with the pre-registered A1 to A5. Add A6, a tie-break invariance gate, and build a canonical exact-predicate Delaunay as a session-only candidate, with a Python twin. A1 verdicts are reported as implementation-dependent until A6 passes.

**Line B (premap-v1).** Given observed sites in the canvas frame, identify the shallowest gasket template that contains all of them, predict the hole sites, and report a D band only where the template passes its own r-squared gate (depth 6 at L=384). Gate it on a frozen gold holdout with negatives.

## Key assumptions to validate (six, each with a test)

| # | Assumption | Test named in the record |
|---|---|---|
| 1 | The implementation difference in d_w is caused only by degenerate Delaunay tie-breaks | An exact-predicate Delaunay gives identical edge sets in JS and Python on the clean set, all five arm sets, and 20 random sets |
| 2 | Under a canonical graph, the arrangement response on the walk leg is at most 0.05 for affine arms | A1 under the canonical graph, Python and JS agreeing to 1e-9 |
| 3 | Containment identifies the gasket level from random 20 to 60 percent subsets | 45 gold trials, gate P1 at 95 percent or better, tri and random negatives at 100 percent null |
| 4 | Only depth 6 gives a valid D reference at L=384 (r-squared at or above 0.98) | The predictedBand policy |
| 5 | Template fills reproduce the template D sign on depth 6 | Gate P3 at 90 percent or better, with the random-fill control reported |
| 6 | Real panels need registration before any premap claim | Not tested in this build; named as the first open gate |

Assumption 4 is the only one with numbers already measured in the feasibility check: depth 4 gives r-squared 0.9794, depth 5 gives 0.9638, depth 6 gives 0.9964. Against the 0.98 gate, only depth 6 passes. Depth 4 misses by 0.0006, depth 5 by 0.0162. This is why Line B's predicted band is restricted to depth 6 at the pinned canvas L=384.

Gate P1 at 95 percent over 45 trials means at least 43 correct identifications (0.95 times 45 is 42.75, rounded up). Gate P3 at 90 percent applies to the depth-6 fill trials.

## MVP scope

- Line A: arrangement-response-v1 module and route (JS, deps-injected), gates A1 to A5, plus A6 marked not-measured in the worker. A canonical exact-predicate Delaunay candidate with a Python twin, and a pre-registration written before its run. Session-only.
- Line B: premap-v1 module and route, a selftest, and a gold holdout harness with a frozen pre-registration and negatives. Session-only.

## Not doing, and why

1. Any deploy, KV write, D1 write, or policy change. Jenny holds the deploy.
2. Replacing the deployed walk graph. That is a major version bump and needs her decision.
3. Registration for real panels (V4, V7). Research pass 2 says it is open, and it is Phase 2.
4. Routing fills through the gate (V6). Blocked by the hold and by the design rule that fills are predictions, not evidence.
5. Retuning L, the D window, the 0.98 gate, or the 0.05 band after seeing any output.

Item 5 is the pre-registration discipline in one line: every threshold (canvas L=384, the D window, the r-squared gate of 0.98, the walk band of 0.05) is frozen before measurement.

## Open questions for Jenny

- Adopt the canonical Delaunay as spectral-standard-v2 (re-anchoring everything), or keep the deployed graph and record its implementation sensitivity as a finding?
- Is a larger canvas template (L above 384) worth a major bump to get a valid D reference at depths 3 to 5? The current pinned L gives no valid reference there.
- Does the arrangement response become the error budget for Phase 2 premap bands (V5)?

## How the direction maps to gates

| Line | Gate family | Frozen parameters |
|---|---|---|
| A | A1 to A5 (pre-registered), A6 (tie-break invariance) | Walk band 0.05; JS to Python agreement 1e-9 |
| B | P1 (identification), negatives at 100 percent null, P3 (fill sign) | 45 gold trials; P1 at least 95 percent; P3 at least 90 percent; depth 6 at L=384; r-squared at least 0.98 |

## What came next

The integration record of the same date (arr-premap-integration) later tested this direction: Line B passed its identity-frame gold MVP, and Line A's walk leg went on HOLD after the canonical graph showed that the deployed Delaunay misses forced edges. That outcome validates the record's caution that A1 verdicts are implementation-dependent until A6 passes.
