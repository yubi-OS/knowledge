# 05 Testing thermorheological simplicity

Scope: testing thermorheological simplicity on the worker gate: one shift factor per version must superpose ALL curves; if a version bump reshapes a curve, the analog restricts to rate-only changes.

## What "simple" means as a testable claim

Thermorheological simplicity is not a property you assume and move on; it is a claim that can fail. For thermorheologically complex bodies, the shift factor a_T is a function not only of temperature T but also of the deformation time t, and published treatments give a procedure for determining the shift function a_T(T, t) rather than a single a_T(T) (weight 0.93, https://link.springer.com/article/10.1007/BF00860810). A general treatment of time-temperature superposition in thermorheologically complex materials develops models from which, for a two-phase material, the amount of shift can be calculated for individual points on a response curve (weight 0.93, https://onlinelibrary.wiley.com/doi/abs/10.1002/polc.5070350106).

The testable version for the gate is direct: compute a shift factor per policy version for each response curve. If one shift factor per version superposes all four curves simultaneously, the worker is simple and policy version is functioning as a temperature. If the four curves require different shift factors for the same version, or if a curve changes shape rather than shifting, the version is acting on the material, not just the clock.

## The known failure case

The corpus already has one candidate simplicity failure: the v4 to v5 validator addition reshaping resend.send outcomes. A validator changes what outcomes exist and how they are classified, which is a reshaping, not a rate change. The physics literature has a precise warning shape for this. Apparent superposition can arise for the wrong reason: in one documented rheology example, data appears to superpose after an apparent temperature reduction, but the true position of the dominating viscous component is exposed only by separating the recoverable compliance from the viscous part, showing the apparent collapse was driven by the dominating viscous component rather than by genuine simple behavior (weight 0.76, https://bpb-us-e1.wpmucdn.com/sites.mit.edu/dist/7/1484/files/2020/04/Time_temp_superposition_COVIDreading-group_Owens.pdf).

The lesson transferred: a superposition that "works" for the latency curve alone is not evidence of simplicity. The test must require joint superposition of all curves, and the verdict can legitimately be partial.

## What a failure verdict buys

A failed simplicity test is not a dead end; it restricts the analogy's scope. If version v5 fails the joint-superposition test while v1 through v4 pass, the honest conclusion is that the WLF analog holds for rate-only policy changes and breaks for structural ones. That restriction is itself a usable result: it predicts which future policy changes can be forecast by shift-factor extrapolation (allowed-method tuning, threshold changes) and which require fresh data collection (new terminal states, new validators, changed fail-closed semantics).

## Detecting reshaping statistically

The operational detection problem, once curves exist per version, is distribution change detection between windows. Published methods detect distribution shift online via recency prediction, weighting recent observations to detect that the current distribution has departed from the reference (weak backing, weight 0.48, https://arxiv.org/pdf/2211.09916). Related tooling performs hypothesis testing to detect a discrepancy between feature-wise conditional distributions of training and query data and localizes the shift to specific features (weak backing, weight 0.20, https://github.com/inouye-lab/feature-shift). These are weak-backed pointers, not the method of record; the study's own method of record is the joint-superposition fit from the measurement doc, with these detectors as candidate complements once per-version windows accumulate.

## The verdict procedure

1. Fit a_T(v) per curve, per version, against the v_ref curves (weight 0.93, https://link.springer.com/article/10.1007/BF00860810).
2. If the per-curve shift factors agree within noise for a version, that version is simple (weight 0.93, https://onlinelibrary.wiley.com/doi/abs/10.1002/polc.5070350106).
3. If they disagree, or a curve's shape parameter changes, mark the version as a simplicity break and restrict the analogy to the curves that still superpose (weight 0.76, https://bpb-us-e1.wpmucdn.com/sites.mit.edu/dist/7/1484/files/2020/04/Time_temp_superposition_COVIDreading-group_Owens.pdf).
4. Never claim simplicity from a single curve (weight 0.76, same source).
