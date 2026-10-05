# 08 Calibration anchors

Scope: standing calibration anchors: the round 3 prediction-vs-realized dissipation of 102.86 dBc-units over 10 cycles as the hysteresis scale any future WLF comparison must beat before claiming policy-level effects, and the general discipline of predefined effect-size thresholds.

## Why a fixed anchor is required

A shift-factor study on policy versions will produce numbers, and the standing risk is that any nonzero number gets read as a discovery. The corpus's own guard is the calibration anchor: round 3's prediction-vs-realized dissipation, 102.86 dBc-units over 10 cycles, is the scale any future WLF comparison must beat before claiming policy-level effects. Until a candidate policy effect produces a dissipation signal larger than that measured hysteresis floor, the null reading is that the effect is not distinguishable from ordinary model error.

The methodological backing for this discipline is strong. The threshold effect size delimiting significance from lack of significance should be predefined, as part of the methodology, not chosen after seeing the data (weight 0.77, https://pmc.ncbi.nlm.nih.gov/articles/PMC4015863/). It is erroneous to assume an intervention has a real effect simply because a difference is present and statistically significant (weight 0.83, https://www.sciencedirect.com/science/article/pii/S0952818023003173). The 102.86 dBc anchor is the corpus's instantiation of exactly this: a predefined scale fixed before the WLF comparison runs.

## Error budgets make the anchor honest

The anchor is an error budget in the metrological sense. Calibration and validation work treats error budgets, uncertainties, and traceability as the primary artifacts that make a measurement claim checkable (weight 0.78, https://ntrs.nasa.gov/api/citations/20170003205/downloads/20170003205.pdf). Uncertainty budgeting for a real measuring device is built from a set of calibration points, with explicit discussion of the budget's limitations and of extension to non-linear devices (weight 0.60, https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=905548).

Read through that lens, the 102.86 dBc-units figure plays the role of the measured budget for the corpus's prediction machinery: it is what prediction-vs-realized dissipation costs under conditions where no policy-level effect was claimed, so a future WLF comparison must clear it rather than merely clear zero. Calibrated prediction itself is the underlying instrument: calibration aligns a model's predictions with uncertainty so that each prediction is individually reliable (weight 0.71, https://arxiv.org/html/2501.19047v1), and calibrated forecasting work explicitly compares against post-hoc calibration baselines as robustness checks (weight 0.58, https://arxiv.org/pdf/2609.36689).

## Using the anchor in practice

The procedure for any future WLF comparison on policy versions:

1. Compute the candidate statistic (for example, dissipation between shift-factor-predicted and observed response under a new policy version).
2. Compare against the anchor of 102.86 dBc-units over 10 cycles, which is the measured floor from round 3 (predefined per the threshold discipline, weight 0.77, https://pmc.ncbi.nlm.nih.gov/articles/PMC4015863/).
3. Claim a policy-level effect only if the statistic exceeds the anchor by a margin that the error budget supports (weight 0.78, https://ntrs.nasa.gov/api/citations/20170003205/downloads/20170003205.pdf).
4. If the statistic falls below the anchor, report the null: the effect is within the machinery's own dissipation floor (weight 0.83, https://www.sciencedirect.com/science/article/pii/S0952818023003173).

The anchor also disciplines the data-gap era. Because the 2026-10-01 wipe removed policy-change timestamps, any retrospective claim of policy-level effects from the surviving single-window data would have no way to exceed, or even compute against, the anchor honestly. The anchor therefore doubles as a reason the study refuses to claim numbers now: a comparison against a floor requires the data the floor was defined to gate, and that data does not exist yet.
