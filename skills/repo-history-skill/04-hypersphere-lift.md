# 04 - The Hyper-Sphere Lift: PCA, Stereographic Projection, Moebius

**Scope.** Stage 1 of the pipeline: how a 9-bit coverage vector per item becomes a point on the 2-sphere, via PCA to 2 dimensions, stereographic projection from the south pole, and Moebius reparameterization with identity init.

Grounding spine: the source doc, `yubi-OS/yubiOS skills/repo-history-skill/SKILL.md` (source doc).

## The lift, step by step

The source doc specifies Stage 1 as a fixed sequence (source doc):

1. Compute 9-D binary coverage c in {0,1}^9 per item from the detection patterns.
2. Aggregate to file level by weighted sum with weight = item byte length, normalized; threshold at 0.5 to get binary.
3. Build the per-section coverage matrix M in {0,1}^(N x 9) (sections are sub-corpora for a mixed fit, time-windows for a single-corpus fit).
4. Center by subtracting the mean, run SVD, take the top-2 right singular vectors W2 in R^(9 x 2).
5. Project per item to (u,v) = M @ W2; aggregate per file as the weighted sum of item coordinates.
6. Apply Moebius reparameterization phi_theta in PSL(2,C), identity init for cycle 1; refine via L-BFGS-B with a cross-ratio preservation check on 100 held-out 4-tuples per cycle when N_items >= 30.
7. Apply stereographic projection from the south pole: (u,v) maps to (X,Y,Z) on S^2. Assert the norm is 1.0 within 1e-6.

## Stereographic projection

Stereographic projection maps a sphere to a plane by projecting from a pole; the Wikipedia article describes the projection from the north pole onto a plane and notes it is the unique projection that maps all circles to circles (https://en.wikipedia.org/wiki/Stereographic_projection, weight 0.56). MathWorld gives the classical construction and formulas (https://mathworld.wolfram.com/StereographicProjection.html, weight 0.77). The projection is conformal: it preserves angles between arcs (https://math.libretexts.org/Bookshelves/Geometry/Euclidean_Plane_and_its_Relatives_(Petrunin)/16%3A_Spherical_geometry/16.04%3A_Section_4-, weight 0.67). The inverse map from plane to sphere is standard (https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Introduction_to_Groups_and_Geometries_(Lyons)/01:_Preliminaries/1.03:_Stereographic_projection, weight 0.70). A hobbyist page covering the same construction is weak backing (http://xahlee.info/complex/1/sphere_proj.html, weight 0.34, weak).

Two properties the skill relies on follow from the math above: the projection is a bijection between the sphere minus the projection pole and the plane, so every distinct (u,v) lands on a distinct sphere point, and the south-pole choice is a convention that keeps the degenerate point (the pole itself) away from the data's origin. The unit-norm assert at 1.0 plus or minus 1e-6 is the numerical guard for this step (source doc).

## Moebius reparameterization

A Moebius transformation is a rational map of the complex plane of the form (az+b)/(cz+d), and the family preserves the cross ratio (https://en.wikipedia.org/wiki/M%C3%B6bius_transformation, weight 0.62). A recent formalization paper states the same invariance: "They also preserve the cross ratio, a fundamental invariant in projective geometry and complex analysis" (https://arxiv.org/html/2606.20358v3, weight 0.43, weak). A secondary mirror of the same mathematics is weak backing (https://handwiki.org/wiki/M%C3%B6bius_transformation, weight 0.27, weak). Two product pages that merely share the name Moebius are off-topic and are not evidence (https://platform.mobius.cloud/login/login.do, weight 0.42, weak; https://www.digitaled.com/mobius/, weight 0.37, weak).

The skill's use of the family is as a reparameterization of the (u,v) plane before lifting, with identity init so cycle 1 is a no-op. The refine path (L-BFGS-B, cross-ratio check on 100 held-out 4-tuples) is gated at N_items >= 30 (source doc).

## The measured collapse

The empirical record is the most useful part of this doc. Cycle 2 attempted L-BFGS-B refinement under an unconstrained centroid loss; the refinement collapsed to the centroid (train loss 0) and the cross-ratio gate failed with max error 14.5, so per the red-flag rule phi_theta was frozen at identity (source doc). Cycle 3 replaced the centroid loss with a spread-preserving loss (mean_d minus 0.4, squared); the refinement still collapsed, cross-ratio error 17.3, and phi_theta remains frozen (source doc). The carryover hypothesis is a regularized loss that penalizes cross-ratio deviation directly (source doc, cycle 3 carryover).

The practical rule for future runs: identity-init is the default, refinement is gated, and a failed cross-ratio gate means freeze, not retry-until-green. The red-flag rule "Moebius refinement train R^2 <= 0 means freeze phi_theta = id and skip future refinements" is the operative instruction (source doc).
