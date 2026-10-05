# 08. Eigengap stability and near-degenerate refit planes

Scope: what the relative eigengap measures on a PCA placement, the trial's binary-versus-continuous contrast, and why a nearly unstable refit plane forces an eigengap guard before any lens is fitted.

## The diagnostic

A PCA placement is only as trustworthy as the separation between the eigenvalues that define its leading directions. The relative eigengap rel_gap_12 measures the gap between the first and second eigenvalues relative to their scale; rel_gap_23 does the same for the second and third. When a gap collapses, the "plane" chosen by PCA is not well defined: rotations within the near-degenerate eigenspace are almost free, so downstream angular statistics measure an arbitrary basis rather than a stable coordinate system ([Geometry of Motion: Degeneracy and Eigenspaces, w 0.60](https://math.geometryof.org/books/GMM/degeneracy.html)). The stability-validation literature for PCA treats exactly this: a component whose variance is not separated from its neighbors cannot be interpreted reproducibly, and bootstrap or permutation resampling is the standard check ([pca4ds: Validation, stability and significance, w 0.76](https://pca4ds.github.io/validation-stability-and-significance.html); [CRAN MultBiplotR: PCA with bootstrap confidence, w 0.84](https://search.r-project.org/CRAN/refmans/MultBiplotR/html/PCA.Bootstrap.html)).

## The trial's numbers

The azimuth trial's errata 6 gives the eigengap picture by variant (source record: azimuth-trial-2026-09-19, errata 6):

- Binary placement, the one the sectors are read from: rel_gap_12 = 0.0686, sitting at its fixed-margin null median of 0.0692 with a plus-one lower tail of 0.4975. Ordinary, not degenerate. The binary chart is stable enough to read.
- Continuous (z-scored) placement: rel_gap_12 = 0.0205 and rel_gap_23 = 0.0042, below the shuffle-null median of 0.0631 but not below its minimum of 0.0036. The source record's verdict: "The continuous refit plane is itself nearly unstable, not just the rotation within it."

The distinction matters because the record's reignition path 2 proposes the continuous placement as a second coordinate (keeping bits for the ladder, the Hamming metric and the curveball null, adding continuous scores for angle only). The record attaches an explicit guard to that path: "a continuous chart needs an eigengap guard before any lens is fitted to it" (source record, section 6, item 2). A lens fitted to an unstable plane would fit multiplicities and instability at once.

## Why near-degenerate planes poison angular statistics

The trial's own continuous results illustrate the mechanism. The per-column-shuffle null used for the continuous placement is wide because its refits land on near-degenerate eigenplanes (source record, errata 3). Each shuffle draw refits its own PCA (doc 01's refit discipline), and when the refit plane is nearly degenerate the draw's angles depend on an arbitrary rotation inside the eigenspace. The null's spread then reflects basis arbitrariness as much as data variability, which is why the continuous non-exclusions are low-power rather than clean nulls (doc 09).

This is a recognized phenomenon in the PCA stability literature: near-degenerate eigenvalues produce unstable eigenvectors under resampling, and stability assessments exist precisely to detect this before interpretation ([Nature Scientific Reports: Large-sample PCA eigenvectors stabilize, w 0.85](https://www.nature.com/articles/s41598-026-52800-4); [arXiv: Global Convergence of Adaptive Sensing for Principal Eigenvector Estimation, w 0.83](https://arxiv.org/pdf/2505.10882)). Bootstrap-based PCA inference quantifies eigenvector uncertainty and is unreliable exactly when gaps are small ([arXiv: Fast, Exact Bootstrap Principal Component Analysis, w 0.91](https://arxiv.org/pdf/1405.0922v1); [UC Davis: An Exploration of Bootstrap and PCA, w 0.73](https://rtg.ucdavis.edu/sites/g/files/dgvnsk4646/files/media/documents/Chen-PCAAndBootstrap-small.pd); [Princeton lecture: Bootstrap and Permutation Tests, w 0.63](https://pillowlab.princeton.edu/teaching/mathtools16/slides/lec21_Bootstrap.pdf)).

## The null's width is a property of the pipeline

The important inversion in this record: the eigengap analysis reframes the continuous non-exclusions. The raw tails (0.20 to 0.92) sit far from any exclusion threshold, but the record attributes that to the null being wide, not to the corpus being structureless: "No angular structure at the identity chart should read: no detectable angular structure against a low-power null" (source record, errata 3). The width has a diagnosed cause, near-degenerate refit planes, and therefore a diagnosed fix: an eigengap guard on the chart before any lens is fitted (source record, section 6, item 2).

This is different in kind from declaring the eigengap a nuisance. A wide null produced by pipeline instability is a fixable measurement problem; the same wide null produced by genuine data noise would be an unfixable one. The binary placement's clean eigengap (0.0686 at its null median) is what makes the binary results interpretable at all: the chart there is stable, so the false m = 1 positive and its atomicity explanation (doc 03) are trustworthy readings rather than basis artifacts.

## The guard as a precondition

The record's operational conclusion, ordered as a precondition rather than a recommendation: no lens fitting on the continuous placement until the eigengap passes its guard. In practice that means the rel_gap_23 collapse (0.0042 against a null median of 0.0631) must be addressed, whether by regularizing the placement, changing the feature space, or fitting the lens on the binary plane whose gap is ordinary. Anything else would compound a nearly unstable chart with a six-parameter optimization (doc 06), producing a result with two independent artifact sources.

The eigengap guard thus sits at the junction of the record's two surviving concerns: chart choice (doc 05) and null power (doc 09). A chart cannot be a candidate coordinate for the surviving path unless its own eigenspaces are separated enough to mean something.
