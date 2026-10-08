# 04 - The Ideal Pole and the Geodesic Gap

Scope: the ideal pole as perfect coverage lifted through the same pipeline, chordal versus great-circle distance, the Frechet-mean alternative for multi-file corpora, and why all-ones is the principled default for a single file.

This corpus explicates the skill documented at yubi-OS/yubiOS skills/single-action-curve-rsi/SKILL.md (source doc). The atom needs a fixed reference point to measure against. The source doc defines the default pole as perfect coverage, the all-ones vector (1,1,...,1) in {0,1}^9, lifted through the same PCA, stereographic, and Mobius pipeline as the file's own point. The chordal distance from the file's point p to the ideal point p* is the geodesic gap (source doc).

## Why the pole goes through the same lift

The pole is not compared to the file in the raw 9-D space. Both the file's point and the ideal pole are pushed through the identical pipeline (same coverage matrix treatment, same PCA basis, same Mobius map, same stereographic projection), so the distance is measured between two points in the same coordinate system. Measuring geodesic distance on the file's raw 9-D vector is listed as an anti-pattern in the source doc: that is Euclidean distance, not geodesic, and it bypasses the lift entirely (source doc).

The pole must also be a separate point from the file's own point. Setting the ideal pole equal to the file's own S2 point trivializes the delta to 0 and makes every cycle vacuous; the source doc lists this as an anti-pattern (source doc).

## Chordal versus great-circle distance

Two distance measures exist on the unit sphere. The great-circle distance is the arc length of the shortest path along the sphere surface, computed from the central angle between the two points (Great-circle distance, weight 0.66, https://en.wikipedia.org/wiki/Great-circle_distance). The chordal distance is the straight-line 3-D distance through the interior of the sphere, equal to 2 times the sine of half the central angle.

The source doc chooses chordal distance as the default for the single-file atom because it is simpler and monotone relative to the central angle; great-circle becomes the principled default when the number of items reaches roughly 30 (source doc). For small item counts the choice between chordal and great-circle changes the ordering of candidate deltas only in edge cases because both are monotone functions of the central angle on [0, pi]. On covariance estimation over spheres, chordal (embedding) and intrinsic (geodesic) estimators differ measurably, which is the statistical background for choosing the simpler proxy at small scale (Cornell paper on isotropic covariance functions on spheres, weight 0.64, https://guinness.cals.cornell.edu/papers/spheres_withsupplement.pdf).

The bounded range matters for validation: chordal distance between two unit-norm points is bounded by 2.0, attained only at antipodes. A measured d_pre above 1.0 in a non-antipodal case is a red flag meaning the S2 lift has a numerical bug and must be re-derived (source doc).

## The Frechet-mean alternative

For multi-file experiments, the source doc allows replacing the all-ones pole with the corpus Frechet mean, the geodesic centroid of all item points, but calls the all-ones pole the principled default for the single-file atom (source doc). The Frechet mean generalizes the arithmetic mean to curved spaces: it is the point that minimizes the sum of squared distances to the sample points (Fréchet manifold background, weak backing, weight 0.48, https://en.wikipedia.org/wiki/Fr%C3%A9chet_manifold). Computing it requires an iterative minimization on the manifold, and differentiating through the mean is itself a nontrivial numerical problem with dedicated machinery (Differentiating through the Frechet Mean, weight 0.71, https://arxiv.org/pdf/2003.00335). A lecture treatment derives the gradient descent scheme for the Riemannian center of mass, the standard algorithm for computing a Frechet mean on a sphere (weak backing: Manifold Statistics Frechet Mean lecture notes, weight 0.32, https://tomfletcher.github.io/GeometryOfData/lectures/FrechetMean.pdf).

Why the single-file atom keeps all-ones anyway: with one file there is no corpus to centroid over, so a Frechet mean has no data to average. The all-ones pole is also corpus-independent, which makes deltas comparable across files and cycles without re-anchoring the reference point every time the corpus changes (source doc).

## The gap as the audit currency

The geodesic gap d = chordal(p, p*) is the number every other quantity in the atom derives from. d_pre is the gap before the cycle's edit, d_post the gap after simulating (or applying) the edit, and delta = d_pre - d_post is the cycle's measured improvement. A cycle succeeds only if delta is greater than 0; the source doc's 20-cycle experiment recorded 0 negative deltas, with 2 cycles at exactly 0 marking local-minimum files (source doc). The gap therefore behaves as a convergent quantity: the empirical trajectory in doc 09 shows the mean delta shrinking as files approach their coverage fixpoints.
