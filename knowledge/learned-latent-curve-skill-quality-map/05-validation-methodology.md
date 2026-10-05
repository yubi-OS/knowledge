# 05 - Validation methodology for a curve fit on a tiny corpus

Scope: the holdout design, the K sweep, the parameter-count-overfitting regime, and leave-one-out, as applied to a 62-item corpus.

## The holdout split

With 62 skills, a fixed 8-item holdout (about 13 percent) is the primary gate. Three numbers are reported per configuration: holdout MSE, holdout R2, and holdout cosine. Holdout R2 at or below zero is the single red flag that most reliably catches a failed configuration: in the first attempt it fired across every K, correctly signaling that the whole fit was worthless before any per-item inspection.

## The K sweep and the overfitting regime

The sweep runs K in {4, 6, 8, 12} crossed with the two t sources. The result table for the good targets:

| t source | K | params | holdout R2 | holdout cos |
|---|---|---|---|---|
| t_rank | 4 | 3460 | +0.120 | +0.812 |
| t_rank | 6 | 4998 | -0.054 | +0.770 |
| t_rank | 8 | 6536 | -0.073 | +0.770 |
| t_pca | 4 | 3460 | +0.144 | +0.817 |
| t_pca | 6 | 4998 | +0.113 | +0.810 |
| t_pca | 8 | 6536 | +0.072 | +0.800 |

Lower K wins because the parameter count climbs toward the data budget as K grows. At D = 384 and N = 62, the target matrix carries 23628 values; K = 4 uses 3460 parameters, K = 12 uses 9612. This is the textbook overfitting regime: with p regression variables approaching the number of observations, the fit passes through nearly every training point while generalizing no better than chance [0.800, strong]. Small-sample high-dimensional settings amplify this into overconfidence about a model that will not reproduce on fresh data [0.900, strong]. Practical guidance on detecting overfit models says to distrust in-sample statistics and require held-out performance [0.699, strong].

Note the asymmetry across t sources: on t_rank, K = 6 already flips negative, while t_pca stays positive through K = 8. The t derivation and the frequency count interact; sweep both.

## Leave-one-out

The K sweep selects a configuration; leave-one-out characterizes it. Each of the 62 skills is held out in turn, the curve is refit on 61, and the held-out skill's 384-D embedding is predicted from its t alone. Results: mean cosine +0.730, standard deviation 0.235, minimum -0.243, maximum +0.963.

LOOCV is the evaluation method of choice on small datasets, where one observation is the test set and the rest form the training set [0.319, weak], and it is a standard tool when data is too limited for a stable fixed split [0.189, weak]. It is computationally heavy for large data, which is irrelevant at N = 62 [0.863, strong].

The LOO distribution, not just its mean, is the diagnostic: a single outlier at -0.24 cosine is expected on a corpus of 62 and says that one skill's embedding is not predictable from its quality-feature ordering, not that the fit failed. A bimodal or broadly negative distribution would say the latter.

## What validation cannot fix

No validation scheme rescues bad targets. The first attempt's sweep also looked plausible internally (training MSE decreasing in K) while every holdout number was negative. The gate order matters: cosine sense check on targets first (doc 03), then sweep, then LOO.
