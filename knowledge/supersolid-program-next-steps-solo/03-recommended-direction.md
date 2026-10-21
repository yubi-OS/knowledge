# 03. Recommended Direction

**Scope:** Recommended Direction: detailed analysis grounded in yubi-OS/yubiOS refs/supersolid-program-next-steps-solo-2026-10-06.md.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/supersolid-program-next-steps-solo-2026-10-06.md, no external web dig

## The recommendation

The source recommends a **document-and-harden rollout**: three lanes plus an advisor, following "the established taste-engine rollout shape." The next measurement, the v3 matched-extent shuffle control, happens in a separate turn afterward.

## Lane A: a new skill, `falsification-corpus`

The validated methodology, distilled into an ordered procedure:

1. **Pre-registration.**
2. **Generator design**, covering scale-band pinning, ink-coverage arithmetic, and MIN_COMPONENT boundary checks.
3. **Gate design**, with the explicit instruction to check that the gate is well-posed ON THE PINNED SCALE SET before running.
4. **Advisor review gate** before build.
5. **L-convergence calibration** before gate evaluation.
6. **Live-route parity.**
7. **Real-data pass protocol.**

The skill also carries anti-patterns learned in the run:

- **Size-grading droplets.** The v1 gasket graded droplet radii by depth, which put each level's contour-to-point transition inside the measurement window and caused the v1 gate failure.
- **Silent empty masks.** A binary render above about 12% ink was silently thresholded to an empty set by the argmin rule.
- **Post-hoc gate movement.**
- **Predicting the sign of render bias without measuring it.** The advisor's model predicted positive bias; measurement showed negative bias at L=256 and roughly zero at L=384.

## Lane B: a repo harness at `tools/edge-standard/falsification/`

- The **v2 generators**, cleaned, with a `--selftest` CLI that asserts the measured anchors: gasket L=384 gate slope **1.5968**, tri **1.2636**, and the component-count assertions.
- The **amendments log**.
- The **results JSON**.
- **Wiring into lean-check verify-tools**, so the corpus is CI-guarded like `edge_standard.py`.

## Lane C: a taste-engine SKILL.md amendment

Fold in the falsification-corpus lessons and the real-data findings. The source lists six:

1. **The empty-mask threshold hazard.**
2. **Gate windows must be checked against the pinned scale lattice.**
3. **Render bias is r/L-dependent** and must be calibrated by convergence, not modeled.
4. **The matched-extent confound.**
5. **The Norcia transition trend.**
6. **The Trypogeorgos 1D-only structural finding.**

## The advisor

The source names "three lanes + advisor" as the shape. The advisor's role in the program, visible in the methodology's step 4, is a review gate before build.

## Then: the v3 control

After the docs land, the next build turn runs the v3 matched-extent shuffle control, which the source calls "the gate before any 'D reads order' claim."

## Why this direction wins

The generation log scores 6 variations on P, S, D, T:

| Variation | Lens | Total | Note |
|---|---|---|---|
| Document-and-harden rollout | Simplification | 17 | session-only artifacts are data-loss debt; no switching cost |
| v3 matched-extent control now | Inversion | 15 | strong but leaves artifacts at risk one more session |
| Knowledge-corpus mint | Combination | 12 | duplicates the refs doc; premature |
| Do nothing, measure next session | none | 12 | fails the external-copies rule; rejected |
| Paper draft | Constraint removal | 11 | blocked on v3 and prior-art differentiation |
| supersolid_order axis build | Audience shift | 11 | gated on a discriminating measurement |

The winner scores 4/5/3/5. Its switching cost is zero because the repo already has the pattern.

## Stress-test

- **Un-testable bet.** None: every lane ends in a verifiable artifact (selftest green, skill pushed byte-verified, CI run green).
- **Strongest critique.** Three lanes of docs for one day's work is heavy. The counter: the taste-engine rollout set the precedent, and the artifacts ARE the program's audit trail.

## Open questions resolved in the source

- **Own skill or a section of taste-engine?** Own skill, because the methodology generalizes to ANY pinned-scale instrument, not just taste.
- **Does the Norcia trend survive the matched-extent control?** Open at the time of writing, recorded as the top next measurement.
