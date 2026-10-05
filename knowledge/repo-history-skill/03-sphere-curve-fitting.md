# Sphere-geometry curve fitting on event corpora

Scope: fitting curves on a sphere rather than a plane: reducing event items to 2 dimensions with PCA, lifting them onto the 2 sphere with a stereographic projection, reparameterizing with a Mobius transform, and measuring fit quality and sparse cells.

## Why a sphere for corpus geometry

Flat 2-dimensional curve fits treat the plane as the parameter space. A spherical variant instead puts the corpus on the surface of the 2 sphere S2, which removes edge effects, makes distance geodesic, and gives every corpus point equal standing on a compact manifold. The stereographic projection is the standard bridge between plane and sphere: it maps a plane to a sphere bijectively, missing only the projection point itself, and two projections from distinct points cover the whole sphere (https://en.wikipedia.org/wiki/Stereographic_projection, noul 0.8863). Its key property for curve work is conformality: it preserves angles, which is why it is the projection of choice when distortion of shape matters more than distortion of area (https://personal.math.ubc.ca/~cass/courses/m309-01a/text/ch5.pdf, noul 0.8084). Course notes emphasize the same theorem: no mapping from a sphere portion to the plane is distortion free, and stereographic projection is the one that preserves angles rather than areas (https://pi.math.cornell.edu/~boyang/2220%20s2017/math2220_notes/notes_sec_2.1.pdf, noul 0.6806).

## The pipeline, stage by stage

1. Primitive coverage. Each corpus item (a pull request, commit, or tracker item) is scored on a binary primitive basis, giving a vector in {0,1}^9. This is the raw data the curve lives on.
2. PCA to 2 components. Principal component analysis projects high dimensional data onto its directions of maximal variance; the projection of variables view treats the first components as the coordinates in which structure is most visible (https://pca4ds.github.io/projections-of-variables.html, noul 0.6539). Keeping the top 2 components gives every item a point in the plane, with the fraction of variance explained by those 2 components (PC1+PC2) as a first fit metric.
3. Stereographic lift. The planar point is lifted onto S2 by inverse stereographic projection from the south pole, so every item gets a unit vector. The explicit coordinate relations between a sphere point and its equatorial-plane projection are catalogued in reference notes on stereographic coordinates (https://complexmanifold.com/notes/stereographic_coordinates.pdf, noul 0.4306, weak backing).
4. Mobius reparameterization. A learned Mobius transformation in PSL(2,C) reparameterizes the lifted points. Mobius transformations are conformal automorphisms of the sphere, so they reshape the parameterization without tearing it; an identity initialization keeps the first fit honest.
5. Fit and sparse-cell detection. The fitted curve is evaluated by holdout R-squared, and cells of the primitive basis that few or no items cover are flagged as sparse. Sparse cells are the actionable output: each names a kind of structure the corpus lacks.

## Spherical harmonic machinery as the basis

Spherical harmonics are the natural basis for functions on a sphere, and the regression form is an active research area: recent work studies spherical t-designs as optimal designs for spherical harmonic regression in 3 dimensions across a range of criteria (https://link.springer.com/article/10.1007/s00362-024-01630-5, noul 0.8312). On the engineering side, differentiable spherical harmonic transforms and convolutions on the sphere are available as maintained libraries (https://github.com/NVIDIA/torch-harmonics, noul 0.0681, weak backing by the weighting, though the repository is the primary source). Geometric deep learning surveys treat spherical data as a first-class geometry with its own convolution operators (https://towardsdatascience.com/geometric-deep-learning-for-spherical-data-55612742d05f/, noul 0.551), and harmonic analysis on the sphere underlies rotation-equivariant networks computed via generalized FFT (https://hunterheidenreich.com/notes/machine-learning/geometric-deep-learning/spherical-cnns/, noul 0.3907, weak backing). For a corpus audit the takeaway is not to import a neural network: it is that a low-degree harmonic or parametric curve on S2, fit to a handful of learned latents, is a legitimate and well-studied target.

## What the fit reports

A sphere fit on a corpus should report at minimum:

- PC1+PC2 explained variance, the fraction of the 9-D coverage signal the 2-D parameterization retains.
- Holdout R-squared on a test split of items, the curve's predictive honesty.
- Sparse-cell count, the number of primitive-basis cells below a coverage threshold.
- The top-N isolated items, the points farthest from the fitted curve, which are the first candidates for a next edit cycle.

## Why sphere geometry helps the audit loop

On a plane, distance to a trend line mixes direction and magnitude in ways that make isolated points look extreme merely for being far out. On S2, geodesic distance to the ideal pole is bounded and rotationally fair: every corpus item sits at the same radius, so a large geodesic delta is a statement about structure, not about scale. That property is what makes the sphere the right substrate for gap-driven self-improvement: each missing primitive is one geodesic step toward the pole, and the measured delta of an edit is comparable across cycles.

## Design summary

1. Reduce 9-D primitive coverage to 2-D with PCA, reporting PC1+PC2 (https://pca4ds.github.io/projections-of-variables.html, noul 0.6539).
2. Lift planar points to S2 with inverse stereographic projection from the south pole (https://en.wikipedia.org/wiki/Stereographic_projection, noul 0.8863).
3. Reparameterize with an identity-initialized Mobius transform, the conformal automorphism group of the sphere (https://complexmanifold.com/notes/stereographic_coordinates.pdf, noul 0.4306, weak backing).
4. Score fits by holdout R-squared and act on sparse cells (https://link.springer.com/article/10.1007/s00362-024-01630-5, noul 0.8312).
