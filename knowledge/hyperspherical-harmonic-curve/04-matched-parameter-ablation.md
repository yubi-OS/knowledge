# 04 - Matched-Parameter Ablation

Scope: Stage-5 verification as a matched-parameter ablation: the S2/L=3 variant versus flat Fourier k=2 and k=4 surfaces on one holdout split, and why this is the only fitness metric that can return negative.

## The comparison problem

Comparing regression models fairly requires controlling model size. When two models have the same size, raw R2 and adjusted R2 give the same verdict because the parameter penalty is identical for both (https://adsp-stats.github.io/statisticalmodels/modelcomparison.html, weak backing, weight 0.41). Information criteria make the penalty explicit: AIC and BIC compare and select models while penalizing the number of parameters, and cross-validation provides a split-based check on top (https://r-statistics.co/Model-Selection-in-R.html, weight 0.61). For nested models the comparison can be formalized as a likelihood-ratio test statistic, with the nesting defined by holding a subset of the larger model's parameters fixed (https://search.r-project.org/CRAN/refmans/chandwich/html/compare_models.html, weight 0.62).

The matched-parameter ablation is this discipline applied to a basis swap. The yubiOS design record specifies 3 fits on the same holdout split: the S2/L=3 variant, the flat Fourier surface at k=2, and the flat surface at k=4 (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05). The pass condition is deliberately asymmetric: the variant must reach at least the flat k=2 surface's holdout R2 using fewer parameters. Per the design record the parameter counts are 6532 for the variant at S2/L=3 and 31496 for the incumbent at k=4, and the S2/L=3 truncation gives 16 basis functions against 25 for flat k=2 (same record). The claim being tested is therefore not "the variant fits well" but "curvature buys fit quality per parameter."

R2 itself is the proportion of variance in the dependent variable predictable from the independent variables (https://en.wikipedia.org/wiki/Coefficient_of_determination, weak backing, weight 0.13); the design record uses holdout R2 above 0 as the minimum bar, with the matched-parameter comparison as the real test.

## Why this is the only negative-capable metric

The design record's advisor revision 1 replaced an earlier spectral check (epsilon_spec) with a stack of three: a pre-fit basis test (epsilon_basis, doc 01), a spectral-mass gate, and the matched-parameter ablation. The stated reason: epsilon_spec is mathematically vacuous, an identity that holds for any smooth gamma in C2(S^N), so it cannot detect silent degradation (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05). Doc 09 develops the falsifiability literature behind that distinction. The ablation is the one element of the stack whose outcome is not fixed in advance: the variant can lose, and if it loses, the design record requires the SKILL.md body to say curvature is not helping and ship the result as a documented null rather than a working pipeline (same record).

The spectral-mass gate sitting between the pre-fit test and the ablation checks two failure signatures: constant collapse and ringing. The thresholds are spectral mass rho at least 0.10 and high-degree mass at most 0.40; the design record marks them as pre-ship calibration chosen by principle, to be re-set on the first real Stage-5 pass (same record).

## Holdout discipline

One holdout split shared by all 3 fits is what makes the comparison paired rather than across-studies. Sample-size logic for detecting a target increment in R2 between a reduced and extended regression model is a developed tooling area (https://metricgate.com/docs/sample-size-r-squared-difference/, weak backing, weight 0.36), and the design record sidesteps it by fixing one split and treating the comparison as a ship-or-kill gate rather than a significance test (same record). The corpus at design time was 69 items, which bounds how much holdout data exists and why the design avoids burning variance on repeated splits.

## What a negative result means operationally

If flat k=2 beats the variant at equal or fewer parameters, the recorded protocol is: keep the incumbent, publish the negative number in the SKILL.md body, and do not retune the ablation until a different verdict appears. The design record is explicit that this is the variant's whole ship-or-kill verdict and that a negative return ships as a documented null result (same record). This follows the general falsifiability discipline that doc 09 grounds: a test that cannot fail verifies nothing.
