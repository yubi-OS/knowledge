# 09. Low-power non-detection versus genuine null results

Scope: why the continuous-placement non-exclusions are low-power rather than null results, what makes a null wide, and how the record reports the difference.

## The result under discussion

After atomicity is removed by placing on the continuous PCA scores directly (300 distinct angles of 301), the azimuth trial ran all six harmonics at K = 200 under an independent per-column-shuffle null with two seeds. Every mode came back not-excluded: tails from 0.2040 (m = 3, seed a) to 0.9204 (m = 12, seed b) (source record: azimuth-trial-2026-09-19, section 4). Read as a table, that is no angular structure anywhere.

The record's errata 3 corrects the reading: "The continuous non-exclusions are low-power, not a null result. The raw tails (0.20 to 0.92) are far from any threshold, but the per-column-shuffle null is wide because its refits land on near-degenerate eigenplanes. No angular structure at the identity chart should read: no detectable angular structure against a low-power null" (source record, errata 3; mechanism in doc 08).

## The statistics of failing to reject

The distinction the record draws is standard and important: a non-rejection under a low-power test is not evidence of the null. Failing to reject H0 when the test has little chance of detecting a real effect tells you almost nothing about whether the effect exists. The inferential-mistakes literature treats "failure to reject as acceptance of the null" as one of the most common errors in applied practice ([PMC: Addressing common inferential mistakes when failing to reject the null, w 0.75](https://pmc.ncbi.nlm.nih.gov/articles/PMC11928781/); [F1000Research version, w 0.70](https://f1000research.com/articles/13-1488); [UT Austin: Common Mistakes involving Power, w 0.80](https://web.ma.utexas.edu/users/mks/statmistakes/PowerMistakes.html)). Low power combined with significance produces its own pathology in the other direction: significant results from low-power analyses are more likely to be exaggerated effect estimates, a "comedy of errors" documented in the methods literature ([ScienceDirect: Statistically significant results from low-power analyses, w 0.82](https://www.sciencedirect.com/science/article/pii/S2590113326000088)).

The severity view sharpens this: what a non-significant result tells you depends on the test's power and the analysis's severity, not on the p-value alone ([Error Statistics Philosophy: Power and Severity with nonsignificant results, w 0.71](https://errorstatistics.com/2026/03/14/power-and-severity-with-nonsignificant-results/)). Introductory treatments state the same rule plainly: a non-significant result in an underpowered study is inconclusive, not negative ([OnlineStatBook: Interpreting Non-Significant Results, w 0.65](https://onlinestatbook.com/2/logic_of_hypothesis_testing/nonsignificant.html); [Quantitative Analysis with Small Samples, chapter 16, w 0.52](https://mohammedalisharafuddin.github.io/quantitative-analysis-with-small-samples/chapters/part-d-re)).

## What made this null wide

The record does not stop at "low power"; it diagnoses the mechanism. The per-column-shuffle null is wide because its refits land on near-degenerate eigenplanes: each shuffle draw refits its own continuous placement, and when rel_gap_23 = 0.0042 sits below the shuffle-null median of 0.0631, the draw's angles are measured against an almost arbitrary basis (source record, errata 6; doc 08). Basis arbitrariness inflates the null's spread, which pushes every observed statistic toward the middle of the null and makes exclusion unreachable even if angular structure exists.

That is a different situation from a null that is wide because the data are genuinely noisy. In this case the width has an engineering cause with an engineering fix: the eigengap guard on the chart before any lens is fitted (source record, section 6, item 2). The record is therefore careful to keep the door open: the continuous non-exclusions neither support nor refute the azimuthal channel; they are silent because the instrument was underpowered (source record, sections 4 and 5).

## How the record reports it

Three reporting disciplines are worth lifting from the record:

1. Say what the test can detect. The verdict sentence is "no detectable angular structure against a low-power null," not "no angular structure" (source record, errata 3). The qualifier travels with every downstream citation; the corpus README and sibling docs carry it.
2. Report the raw tails and the null's spread together. The tails (0.20 to 0.92), the null medians per mode, and the diagnosed cause of the null's width all appear (source record, sections 4 and errata 3 and 6). A reader can re-derive the low-power verdict rather than trust a label.
3. Do not average across seeds or thresholds. At K = 200 the all-rows m = 1 tail (0.0100 / 0.0199) straddles any conventional threshold and the record reports it as "a flip to report, not average" (source record, section 3). Borderline instability is information, not noise to be smoothed.

## Contrast with the two strong verdicts

The record's two confident verdicts are, respectively, an exclusion-then-retraction and a chart claim. The m = 1 exclusion was retracted when its cause was found (atomicity), and the retraction is stronger than the original claim because the mechanism is structural (centering kills the first moment) rather than sample-dependent. The chart claim rests on prior positive evidence (the powered-lens result) rather than on a non-rejection. Both strong verdicts avoid leaning on low-power non-detections. The pattern is consistent: in this record, negative-sounding results carry their power qualification everywhere they appear, and no admission decision is ever based on a failure to detect ([PMC: failing to reject the null, w 0.75](https://pmc.ncbi.nlm.nih.gov/articles/PMC11928781/)).

## What remains open

The honest state of the azimuth channel after this record: the identity-chart angular readings are either artifacts (m = 1), non-detections at low power (continuous), or blind by prior measurement (m = 3 at the identity chart); the surviving path is the powered lens under a selection null (docs 05 and 06), with the eigengap guard as precondition (doc 08). The continuous non-exclusions will need to be re-run against a guarded, stable chart before they can count as either positive or negative evidence.
