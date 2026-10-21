# 05-4-harness-results-t5-one-frozen-run

**Scope.** 4. Harness results (T5, one frozen run): detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-integration-2026-10-16.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/arr-premap-integration-2026-10-16.md, no external web dig

## One frozen run

The ground source reports exactly one frozen harness run. The command, run once from `worker-candidates/premap/`, was:

`node harness_premap.mjs ./premap.js --lens <staged jev-lens-math.js> --spectral <staged jev-spectral-math.js> --arrangement ../arrangement/arrangement.js --out results/premap-results-2026-10-16.json`

The output file records `plan_frozen: true`. The renderer is the shared renderDisksFloat through the candidate arrangement module. Trials: 80 in total, split into gasket 45, tri negatives 5, uniform negatives 15, and depth-6 fill 15. Error rows: 0. Template counts 42, 123, 366 and tri 19 pass.

## Gates

| Gate | Rule | Result | Count |
|---|---|---|---|
| P1 identification | gasket level equals depth, at least 43 of 45 | PASS | 45 / 45 |
| P1n negatives | level null on 20 of 20 | PASS | 20 / 20 |
| P2 holes (bookkeeping) | predicted holes equal absent template sites, 45 of 45 | PASS | 45 / 45 |
| P3 fill sign | sign_agree true on at least 14 of 15 | PASS | 15 / 15 |
| P3 control | control_agree, reported not gated | reported | 0 / 15 |
| P4 (informational) | depth 4 and 5 not_available, depth 6 measured | matches expected | 15 / 15 / 15 |

P1n covers 20 negatives: the 5 tri negatives plus the 15 uniform negatives. P1's threshold of 43 of 45 corresponds to the 95 percent target set in the ideate-solo record (0.95 x 45 = 42.75, rounded up). P3's threshold of 14 of 15 is about 93 percent, above the 90 percent floor named there.

Observed minimum counts of observed points: gasket 17, tri 8, uniform 42, fill 146.

## Reading the verdicts honestly

The record does not let a clean scoreboard overstate what was learned.

- **P3 is a reproduction check.** Filling the holes restores the full template, so D_filled equals the template D (1.5589370) in all 15 trials. P3 therefore largely repeats P2. The control fill moves D the other way (control_sign -1 in all 15), which shows the template fill is not just any extra points. control_agree 0 of 15 is reported and not gated.
- **P2 is bookkeeping, not a finding.** At the identity frame, predicted holes are by construction the absent template sites.
- **No gate was retuned. No trial was dropped.**

The only gate that tests something non-trivial at the identity frame is P1 together with P1n: identifying the right depth from random partial subsets, and returning null on tri and uniform negatives.

## P4 and the r-squared gate

P4 confirms the predictedBand policy: at L=384 only depth 6 produces a measured D band, and depths 4 and 5 report not_available. This matches the feasibility numbers carried from the ideate-solo record (depth 4 r-squared 0.9794, depth 5 0.9638, depth 6 0.9964 against the 0.98 gate).

## Smoke runs are not the frozen run

`premap-integration.test.mjs` runs `runHarness` on a 3-trial gasket subset and a 1-trial fill subset, both with `plan_frozen: false`. Those runs wrote no results file and their output was not used. They check only that the real module runs through the harness without an error row. Separating smoke runs from the frozen run keeps the frozen result single-shot.

## Amendment log (PREREG section 8)

- **Amendment 1, logged before the harness run.** identifyLevel returns null with reason `too_few_observed` below MIN_OBSERVED = 6, the depth-2 template size. Reason: containment has no size floor, so one observed point on a depth-1 site identified level 1 (B1 open issue 1). The floor changes no frozen trial, checked by arithmetic in `premap-amendment1.test.mjs`.
- **Correction to the feasibility addendum.** Section 10 said no frozen trial falls below 17 points. True for gasket trials; tri negatives keep 8 points (round(0.4 x 19) = round(7.6) = 8). The floor of 6 is below both.
- **Section 6.12** (tri "40 percent" reading, keep 8 of 19): confirmed, no change.
- **Non-amendment integration edits** (no frozen value changed): holes.reason follows the identification reason; the harness uses the shared renderer; the route accepts null-level holes.

## Why the amendment is legitimate

A pre-registration amendment is only clean if it is logged before the measurement and provably changes no frozen trial. Amendment 1 meets both: it was logged before the run, and since the smallest frozen observed count is 8 (tri) and the floor is 6, no trial crosses it. The guard fixes a real failure mode (one point identifying level 1) without touching the result.

## What the run does not claim

Identity frame only. No claim about real arrangements. Registration remains the first open gate, so P1's 45 of 45 says the containment logic works on exact template subsets, not that it would work on displaced real droplets.
