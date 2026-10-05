# 02 - Moebius Reparameterization

Scope: the learned Moebius reparameterization phi_theta in PSL(2,C) on the Riemann sphere: 6 real parameters, identity initialization, cross-ratio preservation as the falsifiable invariant, and why it carries the mechanism-layer novelty claim versus plain OLS harmonic regression.

## What a Moebius transformation is

Every Moebius transformation can be constructed geometrically: inverse stereographic projection from the complex plane to the sphere, a rigid motion of the sphere, and stereographic projection back (https://jaikrishnanj.github.io/MA5360/files/mobius.pdf, weight 0.53). The group of these transformations is PSL(2,C), acting on the extended complex plane, which is the Riemann sphere. A formal treatment of extended complex numbers, Moebius transformations, and the cross ratio confirms that lines in the plane correspond to circles on the Riemann sphere through the point at infinity, and that this circle-line geometry is preserved by Moebius transformations (https://arxiv.org/html/2606.20358v3, weight 0.51).

## The 6 real parameters

A Moebius transformation is z -> (az+b)/(cz+d) with complex a, b, c, d and nonzero determinant; scaling all four coefficients by the same factor leaves the map unchanged, so the family has 6 real degrees of freedom (https://en.wikipedia.org/wiki/M%C3%B6bius_transformation, weight 0.61, from the cross-ratio query entry). Six is small enough to fit and large enough to rotate, dilate, and translate the domain coordinate before it reaches the harmonic basis. The yubiOS design record initializes phi_theta at the identity and learns the 6 parameters during the Stage-1 fit (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05).

## Cross-ratio preservation as the falsifiable invariant

Cross-ratios are invariant under Moebius transformations: if a Moebius transformation maps four distinct points, the cross-ratio of their images equals the original (https://en.wikipedia.org/wiki/M%C3%B6bius_transformation, weight 0.61). The classical statement is that the cross-ratio of four points is an invariant under Moebius transformations, with collinearity and concyclicity recognizable from it (https://faculty.etsu.edu/gardnerr/Geometry/notes-Pedoe/Pedoe-53.pdf, weight 0.73). Projective-geometry texts build on exactly this invariance of the cross ratio under linear fractional transformations (http://delta.cs.cinvestav.mx/~mcintosh/comun/summer99/mcintosh/node3.html, weak backing, weight 0.45).

This is what makes the reparameterization testable rather than decorative. The design record asserts cross-ratio preservation at identity initialization on 100 random 4-tuples, and after fitting asserts preservation within 1e-4 on held-out 4-tuples, plus a degenerate-collapse detector of |c| < 100 (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05). If a fitted phi_theta violates cross-ratio preservation, it has drifted outside PSL(2,C) and the fit is invalid regardless of residual quality. The invariant converts an implementation bug into a loud failure.

## Why this earns the mechanism claim

Without the reparameterization, fitting spherical harmonics to data by least squares is ordinary OLS regression on a fixed basis, which the design record judges obvious at the mechanism layer; the learned Moebius map in front of the basis is the part a person of ordinary skill in the art would not arrive at mechanically (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05). The supporting fact is structural: Moebius transformations preserve exactly the circle-line geometry of the sphere, so a learned map from this family can reorient the corpus embedding on the sphere without distorting the geometry the basis assumes (https://arxiv.org/html/2606.20358v3, weight 0.51).

Two scope facts bound the claim. First, PSL(2,C) acts on S2, not on S3, so the Moebius reparameterization is structurally an S2-only mechanism; N=3 fits use the Laplace-Beltrami spectrum alone with no learned reparameterization (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05). Second, the chordal metric induced on the Riemann sphere by stereographic projection is the natural distance for the related Stage-2 partition work (https://www.researchgate.net/publication/343147548_Extended_Complex_Plane_and_Riemann_Sphere, weak backing, weight 0.33), which doc 05 develops.

## Fit hygiene

The degenerate-collapse detector matters because a Moebius map with a near-zero c coefficient pushes the pole into the data domain and lets the fit chase residuals with a degenerate map. The |c| < 100 bound is a calibration threshold chosen by principle in the design record, to be tightened or loosened on the first real fit (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05).
