# 03 - PCA explained variance as a pre-fit quality gate

Scope: using the top-2 principal component explained variance ratio as a numeric gate that decides whether a corpus has enough low-rank structure for curve fitting at all.

## What the gate measures

Principal component analysis transforms a dataset into components ordered by the variance each captures; it is the standard technique for reducing dimensionality while preserving as much information as possible [1] (weight 0.74). The explained variance ratio of a component is its share of total variance. A pre-fit gate built on the sum of the top two ratios asks a single question: do 2 dimensions suffice to represent the corpus's geometry? If not, projecting the corpus onto the curve pipeline's 2-D manifold discards most of the signal, and every downstream measurement on that manifold is untrustworthy.

The convention of selecting components up to a cumulative explained variance threshold is widespread; common cutoffs in practitioner literature are 0.95 or 0.99 of cumulative variance [2] (weak backing, weight 0.15), with the same threshold convention described in tutorial material on explained variance [3] (weak backing, weight 0.04). The falsification harness's gate is stricter in structure: it does not ask how many components are needed, it asks whether exactly 2 components clear a floor (0.40 combined), because the pipeline's geometry requires exactly 2.

## Why a low-rank basis matters for audit pipelines

A corpus whose items are described by 9 binary features can still be effectively low-dimensional if the features co-occur in correlated patterns. When they do, PCA concentrates the variance into a few components and the corpus projects cleanly onto a 2-D sphere; when they do not, the projection scrambles distances and sparse-cell grids on the projected plane measure projection artifacts rather than corpus structure.

This concern is recognized in the dimensionality-reduction evaluation literature. A survey of quality measurements for dimensionality reduction notes that projecting high-dimensional data into a low-dimensional space, often 2-D for scatter-plot visualization, requires explicit quality assessment of how much of the original structure survives [4] (weight 0.89). Work on visualization-focused reduction likewise observes that a quantitative measure of the low-dimensional output's similarity to its high-dimensional input is infrequently mentioned, even though reduction for visualization is treated as exploratory [5] (weight 0.69). Explained variance is one such quantitative measure, and gating on it before use is the cheapest possible quality check.

## Gate placement in the pipeline

The gate belongs before any curve fitting or cell-grid computation, for two reasons. First, it is cheap: PCA on a small coverage matrix is trivially fast, so the check adds no meaningful cost. Second, its failure mode is total: if PC1+PC2 is low, no downstream number is interpretable, so continuing wastes compute and produces confident-looking nonsense. This mirrors the general finding that dimensionality reduction improves model performance and interpretability only when the reduced representation retains the important structure [6] (weight 0.60).

Variance-ratio-based selection of the number of dimensions is a standard technique in applied settings; a ScienceDirect topic overview describes selecting the optimal number of PCA dimensions from the explained variance shown in a scree plot [7] (weak backing, weight 0.36). The harness's gate inverts that selection problem: the dimension count is fixed by the pipeline design, and the gate checks whether that fixed count is defensible.

## Observed behavior on the synthetic corpus

On the harness's synthetic stochastic corpora, the gate is met robustly: across 10 generator seeds, PC1+PC2 ranged from 0.6291 to 0.7982, all comfortably above the 0.40 floor (source document: falsification harness results, 2026-08-06). This tells us the synthetic generator produces correlated feature patterns, which is expected because the underlying three-tier mobility model generates recurrent, clustered behavior rather than uniform noise. The robustness of the gate across seeds is itself informative: T1 passing 10 of 10 means the corpus generator, not the seed, determines fit quality.

The remaining caution is transfer: a real corpus with a different feature basis might sit below the gate. The gate is doing its job precisely when it refuses such corpora.

## Sources

[1] https://en.wikipedia.org/wiki/Principal_component_analysis (weight 0.74)
[2] https://www.py4u.org/blog/python-scikit-learn-pca-explained-variance-ratio-cutoff/ (weight 0.15, weak)
[3] https://fastercapital.com/content/Explained-Variance--Explained-Variance--Measuring-PCA-s-Effectiveness.html (weight 0.04, weak)
[4] https://www.mdpi.com/2504-4990/5/3/56 (weight 0.89)
[5] https://arxiv.org/pdf/1907.01974 (weight 0.69)
[6] https://www.geeksforgeeks.org/data-science/dimensionality-reduction-techniques/ (weight 0.60)
[7] https://www.sciencedirect.com/topics/computer-science/variance-ratio (weight 0.36, weak)
