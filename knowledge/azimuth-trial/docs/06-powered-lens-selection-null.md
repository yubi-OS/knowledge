# 06. Selection nulls and post-selection inference for optimized statistics

Scope: why a fitted lens needs a null that fits lenses too, the guard-rejection evidence from the trial, and the stopping-rule discipline that keeps a six-parameter fit honest.

## The problem a fitted statistic creates

The surviving azimuth path is not a fixed statistic. It is a fitted one: choose the chart phi_theta in PSL(2, C) that maximizes the angular statistic, then report the statistic under the chosen chart (source record: azimuth-trial-2026-09-19, section 6, item 1). A six-real-degree-of-freedom optimization applied to the real data will find structure even in noise, because the optimizer is itself part of the test. The modern name for this problem is post-selection inference: uncertainty assessment must account for the selection step that chose the model or the parameter, or reported significance is inflated ([Annual Reviews: Post-Selection Inference, w 0.86](https://www.annualreviews.org/content/journals/10.1146/annurev-statistics-100421-044639); [Springer reference-work entry: Post-Selection Inference, w 0.86](https://link.springer.com/rwe/10.1007/978-3-662-69359-9_478)).

The trial's answer is the selection null: run the same optimization on each null draw, so that the null distribution also has the optimizer's freedom. The record states this directly: "The null must be a selection null optimizing a lens for each draw" (source record, section 6, item 1). The empirical effect of this discipline is visible in the numbers: under the powered lens the corpus reaches share 0.408 against a collapsed null of 0.0345 +/- 0.0030, but the selection null (optimizing a lens for each draw) has median +5.1 and max +25.5 in delta-J terms, so the headline +126.1 must exceed an optimized null, not a fixed one (source record, section 5).

The general principle, that an optimized statistic compared against a naive null overstates evidence, is the core result of the overfitting literature in this space: post-selection uncertainty assessment exists precisely because naive intervals after selection are wrong ([arXiv: On overfitting and post-selection uncertainty assessment, w 0.85](https://arxiv.org/pdf/1712.02379v1); [HTML version, w 0.75](https://arxiv.org/html/1712.02379v1)).

## The guards the paper found, and why they matter

A lens optimization can fail in characteristic ways, and the source record cites the guards the powered-lens paper found:

1. Convergence onto the anti-caustic boundary. The optimizer drifts toward a degenerate chart; the cited guard hit a condition value of 997.8 against a 10^3 cap, with 155 of 471 fits guard-rejected (source record, section 6, item 1).
2. Monotone-but-fake progress. J(t) perfectly monotone in the fit parameter t while the guard fails at t = 1.05, meaning a smooth-looking improvement curve is not evidence of a valid fit (source record, section 6, item 1).

Both guards exist because a six-parameter chart family has enough freedom to make almost any point cloud look organized under some member of the family. Without boundary and stability guards, the "signal" is the optimizer's preference, not the corpus's.

## The stopping rule

The record's discipline: "The stopping rule is declared before the run" (source record, section 6, item 1). This is not a stylistic preference. The stopping-rule principle in the foundations of statistics holds that the evidential meaning of a sample is not altered by the plan governing when sampling stopped; conversely, an undeclared stopping rule is precisely where peeking and selection effects enter ([Springer: The Stopping Rule Principle and Confirmational Reliability, w 0.89](https://link.springer.com/article/10.1007/s10838-023-09645-6)). In sequential-testing practice, stopping rules must be fixed in advance and peeking at accumulating results inflates error rates; practitioner guides converge on declaring the rule before data collection ([Statohub: Sequential Testing Guide, w 0.22, weak](https://statohub.com/sequential-testing/); [OKPy: Stopping Rules for A/B Tests, w 0.26, weak](https://okpy.net/blog/experiment-peeking-stopping-rules)). The weak-weighted practitioner sources agree with the primary source but should be read as secondary confirmations.

## How this applies to the azimuth channel specifically

The azimuth channel's history makes the selection-null discipline non-optional:

- The false m = 1 positive (doc 03) shows that a naive reading of a statistic on this corpus can be an artifact.
- The identity-chart blindness (doc 05) shows that the chart is itself a degree of freedom. Freeing six more degrees of freedom in the chart multiplies the artifact surface.
- The prior powered-lens result (+126.1 against a selection null with median +5.1, max +25.5) is the only positive azimuthal evidence on record, and it only counts as evidence because the null was optimized the same way the observation was (source record, section 5).

The record's use of the selection null is also what licenses the low-power verdict in doc 09: a null that is wide because it is optimized is honest, and the correct report under a wide null is "no detectable structure," not "no structure."

## Practical checklist, from the record

For any fitted-chart statistic on a corpus:

1. Declare the statistic, the chart family, and the stopping rule before the run (source record, section 6).
2. Fit the chart to every null draw, not just to the real corpus, and use that optimized-null distribution as the reference (source record, section 6, item 1).
3. Guard the fit: condition-number caps against caustic collapse, and monotonicity checks against smooth-but-false progress curves (source record, section 6, item 1).
4. Report the selection null's own spread (median and max) alongside the observed delta, so a reader can see how much of the headline is optimizer freedom (source record, section 5).
5. Never present a fitted-chart result without its selection-null comparison; that comparison is what makes the number an inference rather than a decoration ([Annual Reviews: Post-Selection Inference, w 0.86](https://www.annualreviews.org/content/journals/10.1146/annurev-statistics-100421-044639)).
