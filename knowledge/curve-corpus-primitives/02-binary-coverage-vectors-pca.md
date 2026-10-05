# Binary coverage vectors and PCA

Scope: representing each file as a binary primitive-coverage vector, reducing the matrix to 2 components with PCA, and why a binary joint pattern beats a simplex mixture for audit.

## From corpus to a 0/1 matrix

After the learned basis is fixed, every file becomes a row: N files by up to 10 primitives, each cell 1 if the file covers that primitive, 0 if it does not. The matrix is binary by construction because the question the audit asks is binary per axis: does this file handle this concern or not. This shape is deliberately not a bag of counts or an embedding; it is a presence-absence table over named axes (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).

Binary presence-absence matrices are a standard input shape in adjacent fields. The SESraster documentation describes null model analysis data as a binary presence-absence matrix where entries represent presence (1) or absence (0) of a species in a site, with rows as taxa and columns as sites (https://cran.r-project.org/web/packages/SESraster/vignettes/null-models.html, jev high 0.5270 and 0.7786). The corpus method swaps species for primitives and sites for files, and inherits the same analytical machinery.

## Why PCA to 2 components

Two principal components give a 2-dimensional plane in which the corpus can be inspected, and the selection rule is the standard one: keeping the first 2 principal components finds the two-dimensional plane through the dataset in which the data are most spread out, which is what exposes cluster structure if it exists (https://en.wikipedia.org/wiki/Principal_component_analysis, jev high 0.9173). The audit needs exactly that: the widest plane, so that distance in the plane is distance in the joint primitive pattern.

Two components is a constrained choice, not a greedy one. The downstream spherical-harmonic fit is calibrated against a flat 2-D Fourier baseline at matched parameter count, which requires both methods to live on the same 2-D input. A 3-component projection would break that comparison (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).

## PCA on binary data: the known caveat

PCA was designed for metrical data, and running it on 0/1 columns is a documented approximation. Practitioner discussions register the concern directly: a Cross Validated answer states that linear PCA can be used for metrical or binary data when treated as dimensionality reduction rather than a latent-variable technique (https://stats.stackexchange.com/questions/159705/would-pca-work-for-boolean-binary-data-types, jev low 0.1197), and a later thread asks the same question for presence-absence ecological data (https://stats.stackexchange.com/questions/623005/can-i-conduct-a-pca-on-binary-presence-absence-data, jev low 0.0743). These are low-weight sources and are cited as evidence that the caveat is known in practice, not as authority.

The principled alternative has a name: logistic PCA, an extension of ordinary PCA to binary data via matrix factorization under a Bernoulli model (https://www.sciencedirect.com/science/article/pii/S0047259X20302499, jev high 0.9481; preprint at https://arxiv.org/abs/1510.06112, jev high 0.6482). The corpus method stays with linear PCA anyway, and the reason is operational: the components must remain simple linear combinations of the 10 named primitives so that each principal axis can be read back into primitive terms. A logistic latent-variable fit optimizes reconstruction but gives up that direct readback, which the audit needs when it must explain why a file sits in a sparse region.

## A worked reference for binary tables

The pca4ds course material analyzes an exclusively binary table where features reflect presence or absence of an attribute in individuals, mapping categorical variables into indicator columns before the analysis (https://pca4ds.github.io/analysis-of-a-binary-table.html, jev high 0.7703). That is the same data shape the corpus method produces, treated as a first-class analysis target rather than a degenerate case.

## Why binary beats mixtures for audit

A topic model assigns each document a point in the simplex: continuous mixtures over topics. A coverage vector assigns each file a corner pattern over named primitives. The audit uses the corner pattern for three reasons:

1. A missing primitive is a statement about the corpus, not a low mixture weight. Sparse regions of the curve then translate into concrete authoring instructions: write the files that would fill this region by covering these primitives.
2. The null model is well defined. Column permutation preserves each column's 0/1 count exactly, so per-primitive frequency is held fixed while co-occurrence is destroyed. On continuous mixtures there is no equally clean permutation null (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).
3. Disagreement is countable. Two runs can be compared concept by concept, which is what the 3-of-10 flip condition requires.

Topic modelling as a description tool is treated properly in the rejected-alternatives doc; the point here is narrower: for the specific job of prescribing what is missing, the binary joint pattern is the representation that supports the verdict.
