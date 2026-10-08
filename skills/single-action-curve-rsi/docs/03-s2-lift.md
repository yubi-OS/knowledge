# 03 - The S2 Lift: PCA Top-2, Stereographic Projection, Mobius Reparameterization

Scope: the compressed Stage-1 lift that maps a single file's section coverage matrix to one unit-norm point on the 2-sphere: centering, SVD, weighted projection, optional Mobius refinement, and stereographic projection from the south pole.

This corpus explicates the skill documented at yubi-OS/yubiOS skills/single-action-curve-rsi/SKILL.md (source doc). For a single file with N at least 2 sections, the lift proceeds in 6 steps (source doc):

1. Compute the 9-D coverage per section.
2. Aggregate to file level via weighted sum (section byte length, normalized).
3. Build the per-section coverage matrix M in {0,1}^(N x 9), center it by subtracting the column means, and run SVD to get the top-2 right singular vectors W2 in R^(9x2).
4. Project each section to coordinates (u,v) = M @ W2; the file-level point is the weighted sum of the section coordinates.
5. Optionally apply the Mobius reparameterization phi_theta in PSL(2,C), initialized at identity for the first cycle. Refinement via L-BFGS-B with a cross-ratio preservation check is optional but is what earns the mechanism claim.
6. Apply the stereographic projection from the south pole: the plane coordinates (u,v) map to a point (X,Y,Z) on S2.

The lift guarantees the output point has unit norm, verified numerically with tolerance 1e-6 (source doc).

## PCA on the section matrix

PCA finds the orthogonal directions of maximum variance in a dataset by eigendecomposition of the covariance matrix, equivalently SVD of the centered data matrix (Principal component analysis, weight 0.63, https://en.wikipedia.org/wiki/Principal_component_analysis). Taking the top 2 right singular vectors projects the 9-D coverage rows into a plane while preserving as much of the between-section variation as the 2 dimensions allow. For binary indicator data, iterated SVD is the standard numerical approach and converges to the correct leading subspace (Columbia CSDA paper on PCA of binary data by iterated SVD, weight 0.55, https://sites.stat.columbia.edu/gelman/stuff_for_blog/csda.pdf).

The source doc sets a pre-fit quality gate: PC1 plus PC2 must be at least 0.40 of the explained variance (source doc). If 2 components explain less than 0.40 of the variance, the 2-D projection is considered too lossy to support a geodesic comparison and the cycle is not fit.

## Stereographic projection

Stereographic projection maps a sphere minus one point to a plane; defined from the south pole, every plane coordinate corresponds to exactly one point on the sphere except the projection pole itself (Stereographic projection, weight 0.69, https://en.wikipedia.org/wiki/Stereographic_projection). It is a conformal map: it preserves angles, though not areas or distances (MathWorld on stereographic projection, weight 0.75, https://mathworld.wolfram.com/StereographicProjection.html). Educational treatments derive the coordinate formulas directly from similar triangles: a plane point (u,v) maps to (X,Y,Z) with X = 2u/(1+u^2+v^2), Y = 2v/(1+u^2+v^2), Z = (u^2+v^2-1)/(u^2+v^2+1) for unit sphere projection from the south pole (Cornell MATH 2220 notes, weight 0.67, https://pi.math.cornell.edu/~boyang/2220%20s2017/math2220_notes/notes_sec_2.1.pdf; background on projection geometry, weight 0.56, https://kartoweb.itc.nl/geometrics/Map%20projections/body.htm).

The conformality property matters for the atom: local angular relationships between section points survive the lift, so the plane geometry computed by PCA is not scrambled by the sphere mapping.

## Mobius reparameterization

A Mobius transformation is a fractional linear map of the extended complex plane, the form (az+b)/(cz+d) with ad-bc nonzero; these transformations form the group PSL(2,C) and map the Riemann sphere to itself (Mobius transformation, weight 0.68, https://en.wikipedia.org/wiki/M%C3%B6bius_transformation). Their defining invariant is the cross ratio: for 4 distinct points, the cross ratio is preserved exactly by every Mobius transformation, which is the property the skill's refinement check exploits (weak backing: arXiv formalization of extended complex numbers, Mobius transformations and cross ratios, weight 0.36, https://arxiv.org/html/2606.20358v3).

The source doc initializes phi_theta at identity for the first cycle on a new file and treats L-BFGS-B refinement with a cross-ratio preservation check on held-out 4-tuples as optional per cycle. Two constraints govern it: refinement is gated on corpus size at least 30 and at least 2 cycles already run on the file, and running more than 1 cycle on identity Mobius without refinement is an anti-pattern because unrefined cycles accumulate drift (source doc).

## The numerical contract

Three numerical facts anchor the pipeline. First, the output point must satisfy the unit-norm assertion within 1e-6; the stereographic formulas above produce points on the unit sphere by construction, so a violation signals an implementation bug. Second, chordal distance between two unit-norm points is bounded by 2.0, attained only at antipodes; a measured distance above 1.0 in a non-antipodal case is a red flag for the lift (source doc). Third, the PC1+PC2 gate at 0.40 is asserted per cycle, inherited from the parent skill's curve-fit quality gate (source doc).
