# 03 Matched-parameter ablation and fitness deltas

Scope: the ablation against curve-guided-rsi's flat 2-D Fourier fit at both fitness-test phases, the measured deltas and R2 values behind the headline claim, and the ship-or-null fallback when the ablation fails.

## Why an ablation, and why matched parameters

The source doc (yubi-OS/yubiOS skills/hyperspherical-harmonic-curve/SKILL.md) replaced the originally planned epsilon_spec comparison with a matched-parameter ablation (source doc, cycle 1, advisor revision 1). An ablation study in machine learning removes a component of a system to determine that component's contribution to the overall result (weakly backed: https://en.wikipedia.org/wiki/Ablation_(artificial_intelligence), jev weight 0.06). The gold standard framing is proving that each constituent part of a complex model contributes something to performance (weakly backed: https://ml.recipes/notebooks/6-ablation-study.html, jev weight 0.07). Matching the parameter count matters because without it the comparison confounds representation quality with model size: a bigger basis can win for reasons that have nothing to do with sphere geometry.

The fit quality metric is R2, the coefficient of determination, the standard statistical measure of how well regression predictions match the data (weakly backed: https://en.wikipedia.org/wiki/Coefficient_of_determination, jev weight 0.20); it sits inside the goodness-of-fit family of regression-validation measures (weakly backed: https://en.wikipedia.org/wiki/Goodness_of_fit, jev weight 0.20). Negative R2 means the fit is worse than predicting the mean, which is what the flat baseline produces on both phases below.

## Phase 1 and Phase 2 numbers

Phase 1 is the 49-skill corpus, Phase 2 the 70-skill corpus (source doc, cycle 3). At v1 (cycle 2) the matched-parameter ablation produced: Phase 1, hyperspherical +0.6183 R2 versus flat k=2 at -0.3588 R2, ablation delta +0.9771; Phase 2, hyperspherical +0.2219 R2 versus flat k=2 at -1.1202 R2, ablation delta +1.3421 (source doc, cycle 2). This validated the headline claim, sphere wins at fewer parameters, at both phases.

At v2 (cycle 3) the numbers tightened but held: ablation delta +0.7373 on Phase 1 and +0.5197 on Phase 2, sphere still winning at fewer parameters (source doc, cycle 3). The direction of the drift matters: the v1 deltas were measured before the basis bug and Moebius refinement fixes, so the v2 numbers are the ones to quote and they remain decisively positive.

## What the deltas do and do not prove

The source doc is explicit that the delta proves the representation choice, with limits: cycle 2 recorded three open issues afterward (the epsilon_basis test failure, the unexercised Moebius refinement, and unmeasured sparse-cell counts), showing the ablation validates the headline claim but not every subsystem (source doc, cycle 2). The delta also does not establish the mechanism; that is the Moebius refinement's job, closed in cycle 3 (source doc, cycle 3).

## The fallback path when the ablation fails

Cycle 4 added an explicit 3-case fallback decision rule keyed on the ablation delta (source doc, cycle 4): delta < -0.05 means the sphere representation is actively worse, ship nothing and keep the flat baseline; |delta| <= 0.05 is the null band, no measurable advantage, do not claim one; delta > 0.05 is the ship case. This makes the ablation a decision instrument rather than a milestone: every future re-fit (see doc 07) re-runs it and lands in one of the three named cases with a pre-committed action.

## Reading the deltas honestly

Two caveats the source doc itself carries. First, the corpus sizes are small (49 and 70 items), so the R2 values on Phase 2 are modest in absolute terms (+0.2219 at v1); the claim is comparative, not that the sphere fit is a great regressor in isolation (source doc, cycle 2). Second, the delta was measured against one specific flat baseline, PC1+PC2 on [0,1]^2 with a k=2 Fourier expansion; it does not rank the sphere against every conceivable alternative representation (source doc, frontmatter and cycle 1).
