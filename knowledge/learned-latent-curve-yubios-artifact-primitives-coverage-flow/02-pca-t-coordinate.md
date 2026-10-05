# 02. Deriving the t Coordinate from PCA

**Scope:** Deriving the 1-D and 2-D t coordinates from PCA of the 9-D coverage matrix, and how explained variance (PC1 versus PC1+PC2) acts as the go/no-go gate for the fit.

## The coordinate is a projection of the coverage matrix

In every yubiOS variant of the learned-latent-curve fit, the scalar or 2-D coordinate t is not read off the raw text. It is the top principal component(s) of the artifact's basis: PC1 of the content embedding in v1, PC1 of the 9-D coverage matrix in v2, and the pair (PC1, PC2) in v3 ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source, not jev-weighted). The Stanford CS229 lecture notes give the standard formulation this relies on: PCA finds the directions of maximal variance and projects data onto them, with the fraction of variance each direction carries exactly the quantity the yubiOS gates read (https://cs229.stanford.edu/notes2021fall/lecture14-pca.pdf, jev weight 0.914).

## Projecting new artifacts

Operationalization requires projecting artifacts the fit never saw. The saved PC1+PC2 loadings persist in the v3 fit cache, and a new artifact's 10-D coverage vector is projected onto those loadings to get its (u, v) coordinate ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source). The mechanics are the standard ones: project the centered new vector onto the retained component directions. Community references describe the same operation (https://stats.stackexchange.com/questions/2592/how-to-project-a-new-vector-onto-pca-space, jev weight 0.383, weak backing), and the scikit-learn PCA reference documents the transform method that implements it (https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html, jev weight 0.956).

## Explained variance as the gate

The learned-latent-curve skill carries a hard heuristic: PC1 explained variance of at least 0.40, or do not fit. The yubiOS corpus tested that heuristic against reality:

- v1 (raw content): PC1 = 0.257, below the gate, and the fit failed with holdout R-squared -0.155.
- v2 (coverage basis): PC1 = 0.243, still below the gate, yet the fit passed its real test with holdout R-squared +0.183.
- v3 (2-D surface): PC1 = 0.2258 on its own, but PC1+PC2 = 0.4036, which crosses the gate when the fit is read as a 2-D structure per the skill's 2-D alternative architecture.
- v4 (MiniLM embeddings): PC1 = 0.0955, PC1+PC2 = 0.1484, both far below the gate, and the fit failed decisively.

([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source)

The pattern the corpus documents is that the 0.40 gate is a heuristic, not ground truth. v2 is the counterexample: a fit with low PC1 that still generalized. v3 shows the gate is better read as "combined explained variance of the coordinates you actually fit." v4 shows the gate catching a genuinely wrong target. How many components to keep is a genuinely contested question in general PCA practice, with thresholds discussed as rules of thumb rather than laws (https://towardsdatascience.com/pca-102-should-you-use-pca-how-many-components-to-use-how-to-interpret-them-3d4b2d1d1d5a, jev weight 0.266, weak backing).

## Weak-source notes

Generic tutorials in this subtopic's dig scored low and back no load-bearing claim: GeeksforGeeks PCA pages (jev weights 0.121 and 0.185), a Porsche club site that matched the PCA acronym (https://www.pca.org/, jev weight 0.176), and a Stack Overflow projection thread (jev weight 0.055). The load-bearing external grounding is the CS229 lecture notes and the scikit-learn reference.
