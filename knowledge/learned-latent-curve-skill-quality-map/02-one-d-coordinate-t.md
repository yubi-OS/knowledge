# 02 - Deriving the 1-D coordinate t: from PCA top-1 to a learned projection head

Scope: how every skill in a corpus gets the single scalar that positions it on the latent curve, and why that derivation has its own failure mode.

## The pipeline

The curve parameter t in [0, 1] is not arbitrary. The application pipeline for 62 skills is:

1. PCA on the 31-column quality-feature matrix, take the top-1 component score per skill.
2. Rank-uniformize the scores so the 62 values spread evenly across [0, 1] (a quantile transform: each value becomes its sorted position, which makes the transform immune to outlier magnitude by construction [0.367, weak]).
3. Angular scaling, mapping the uniform coordinate onto the curve's domain.
4. A learned projection head mapping the scalar into the model, with a collapse guard that detects when all items are being projected to nearly the same t.

The alternative tested was min-max scaling of the same PCA top-1 scores. Both t sources were swept and the better one chosen by holdout MSE; t_pca (min-max) won with holdout R2 = +0.144 at K = 4 versus +0.120 for t_rank.

## Why PCA top-1

PCA produces the linear orthogonal transformation whose first coordinate captures the greatest variance in the data [0.765, strong] [0.901, strong]. Using the first principal component of a quality-feature matrix as the corpus ordering means t tracks the dominant axis of measured quality variation, which is the quantity the downstream quality assessment cares about.

Quantile-based rank uniformization is the standard way to force a coordinate to be uniformly distributed; scikit-learn's quantile_transform maps features to a uniform or normal distribution using quantile information [0.454, weak] [0.613, strong].

## The collapse guard and the sweep discipline

A learned projection head on a 1-D input can silently degenerate: if the head's weights shrink, every item maps to nearly the same t and the curve degenerates to a point. The collapse guard is a verification item, not a nicety.

The pipeline lesson generalizes: never trust a single t-derivation choice. Both rank-uniformized and min-max t were carried through the full K sweep, and the choice between them was made on holdout data, not on aesthetics. In the run the difference was material (R2 +0.144 versus +0.120 at K = 4) and it flipped no conclusions, but a different corpus could.

## What t is not

The t coordinate is an ordering over quality features, not a semantic position. The semantic content lives in the 384-D target vectors the curve is fit against; the LOO experiment (predicting a skill's 384-D embedding from its t alone) reached mean cosine +0.730, which bounds how much semantic structure the quality ordering carries. One outlier skill had cosine -0.243: its embedding is not predictable from its quality-feature t, an expected residual on a corpus of 62.
