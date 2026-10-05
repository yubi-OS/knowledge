# 04. Curve-fit quality gates: explained variance, holdout R-squared, and small-corpus failure modes

Scope: the two gates every curve fit must pass, why negative R-squared is expected on tiny corpora, and the degenerate-fit case.

## The two gates

Every fit in the differential pipeline, per corpus and for the union, is held to two thresholds:

1. PC1+PC2 explained variance of at least 0.40: the two learned dimensions must capture at least 40 percent of the basis variance, or the 2-D surface is not a faithful summary of the corpus.
2. Holdout R-squared greater than 0: a held-out subset must be predicted better than the mean, or the fit does not generalize.

These are documented in the pipeline's Stage 1 and Stage 5 verification checklists ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

The three fits in the 2026-08-04 run:

| Run | Corpus | N | PC1+PC2 | Holdout R-squared | Verdict |
|---|---|---|---|---|---|
| Parent | 77 yubiOS skills | 77 | 0.4885 | +0.4239 | both gates pass |
| Offshoot combined | 131 self-doc items | 131 | 0.6134 | +0.5946 | both gates pass |
| Differential | union basis, both sets | 208 | 0.6770 | +0.7013 | both gates pass, highest of the three |

The differential's 0.6770 explained variance is the headline structural result: 67.7 percent of union-basis variance captured by 2 dimensions validates that one 2-D surface can represent the combined corpus ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

## What the variance ratio measures

Principal component analysis reports explained variance per component as the fraction of total variance that each principal axis carries; the sum of the first components' ratios is the standard measure of how much of the data a reduced dimensionality represents, and scikit-learn's PCA exposes exactly this through its explained variance attributes [w=0.92, https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html]. A binary coverage matrix compresses well when items share coverage patterns; a corpus of unrelated items would need many components and fail the 0.40 gate.

## Negative R-squared on small corpora

Six of the ten per-file self-doc fits have negative holdout R-squared (as low as -3.59 for the company file, N=8). The source doc states this is expected, not a bug: fits with too few items to generalize produce negative R-squared, which is why the combined fit (N=131) is the load-bearing metric for the offshoot ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

External confirmation exists but arrives from forum-grade sources, and is labeled weak accordingly. The canonical explanation of negative R-squared on held-out data is that the model predicts worse than a horizontal mean line, which happens with small test sets and high-variance fits [w=0.08, https://stats.stackexchange.com/questions/183265/what-does-negative-r-squared-mean, weak]. Cross-validation returning negative R-squared for small folds is a documented, repeated phenomenon [w=0.08, https://stats.stackexchange.com/questions/12900/when-is-r-squared-negative, weak]. The yubiOS discipline converts this into a rule: report per-file metrics, but never gate on them when N is under 20; gate on the combined fit.

## The degenerate fit

The user_profile file (N=13) reports PC1+PC2 of 1.0000 and R-squared of 1.0 with only 1 kept column. That is not excellence, it is degeneracy: with one binary column surviving the near-constant drop, the "curve" has no structure to learn and the metrics are vacuous. The source doc flags it as a known limitation inherited from the offshoot's red-flag list, "per-corpus metrics diverge wildly" ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

The general lesson: a perfect score on a nearly-degenerate basis is a red flag, not a green one. Gates must be read together with the kept-column count and N. A fit that passes both gates while only 1 of its basis columns survived should be reported as degenerate, and its (u,v) coordinates treated as unreliable for sparse-cell or overlap reasoning.

## Gate discipline in the pipeline

The Stage 5 verification checklist requires each gate be evaluated and recorded per plane, the N of 20 minimum for each corpus, and the delta of sparse-cell counts documented even when no RSI has been applied yet (parent 6 to 6, offshoot 7 to 7, differential 0 at baseline). Recording the no-change deltas is what makes the baseline a closed-loop metric: a later cycle can be measured against it ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).
