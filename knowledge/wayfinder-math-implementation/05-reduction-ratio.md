# 05 Reduction ratio

Scope: the reduction ratio diagnostic, its eligibility rule of strictly negative predicted delta only, and why it stays geometric bookkeeping rather than calibrated confidence.

## The diagnostic

Observed to predicted reduction is exposed only for a strictly negative predicted isolation delta. Positive and zero predictions are ineligible (source doc: direct runtime additions section, primary project artifact). When a candidate edit is predicted to reduce isolation, the ratio compares what actually happened to what the geometric model predicted. When the prediction is not negative, the instrument refuses to compute a ratio at all rather than dividing by a non-negative or meaningless denominator.

## The trust region precedent

The quantity has a well studied ancestor. In trust region optimization, given a step the ratio of actual reduction to predicted reduction decides whether the model is trusted in the region around the current point: the numerator is the actual reduction and the denominator is the predicted reduction (source: https://num-opt-notes.readthedocs.io/en/latest/chapter-4.html, jev weight 0.54). Trust region methods use this ratio to accept or reject steps and to resize the region in which the model is believed (source: https://en.wikipedia.org/wiki/Trust_region, jev weight 0.84; see also https://optimization.cbe.cornell.edu/index.php?title=Trust-region_methods, jev weight 0.80).

The wayfinder usage borrows the bookkeeping shape, not the algorithm. There is no region being resized and no optimizer converging. What is borrowed is the discipline of comparing a model's predicted effect against the observed effect on the exact quantity the model claims to move, isolation in this case.

## Why eligibility is restricted

The restriction to strictly negative predictions is doing quiet but important work. A ratio against a zero prediction is undefined. A ratio against a positive prediction inverts the meaning: a large observed reduction against a predicted increase would produce a negative ratio, which is numerically fine but rhetorically dangerous, because a reader could mistake any nonzero ratio for a validation of the model. By exposing the ratio only where the model predicted improvement, the diagnostic keeps a single consistent interpretation: how much of the predicted reduction materialized.

## Bookkeeping, not confidence

The source material is explicit: it is geometric model bookkeeping, never calibrated confidence or task quality (source doc: direct runtime additions section, primary project artifact). The distinction is a standard one in prediction practice. Discrimination and calibration are different properties of a prediction system, and a model can discriminate without being calibrated; assessment frameworks treat them as separate axes that must each be measured on their own terms (source: https://jamanetwork.com/journals/jama/fullarticle/2656816, jev weight 0.93; see also https://pmc.ncbi.nlm.nih.gov/articles/PMC3575184/, jev weight 0.83).

A reduction ratio measured on past edits is at best evidence of internal consistency of the geometric model. It is not a probability that the next edit is good, and it is not a task quality score. Conflating the two is precisely the relabeling hazard that the evidence boundary in document 08 polices.

## The 4/10 fact

The historical data behind the diagnostic is modest and honestly reported. Ten exact historical ledger replays exist, and the historical sign agreement between prediction and outcome is 4 out of 10, not relabeled as 10 out of 10 prediction (source doc: evidence boundary section, primary project artifact). Three of the zero outcomes were unchanged CHANGE points and three were ADDs that joined already-connected neighbours (source doc: evidence boundary section, primary project artifact).

A 4/10 agreement would be easy to present misleadingly. The instrument's choice is to keep the ratio eligible, keep it labeled as bookkeeping, and let the 4/10 number stand as the honest statement of how often the geometric prediction matched the sign of the observed change. Any future claim of predictive value must be earned by a prospective benchmark, which the integration explicitly does not claim here: no new prospective edit benchmark is counted (source doc: evidence boundary section, primary project artifact).

## What this doc does not claim

No evidence in the source material shows the reduction ratio predicting edit quality. The diagnostic answers "did the geometric model's predicted reduction materialize on this transition", and it is entitled to answer exactly that and nothing more. Readers who want a decision about whether an edit is good must look elsewhere: the independent task-check boundary, preserved throughout the candidate preview flow, is the designated place for that judgment.
