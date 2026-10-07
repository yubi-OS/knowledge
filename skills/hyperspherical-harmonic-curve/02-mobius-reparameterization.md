# 02 Moebius reparameterization

Scope: the learned Moebius phi_theta in PSL(2,C) applied to the corpus domain, how it is fit (closed-form ridge plus L-BFGS-B refinement), and the cross-ratio preservation check that gates it.

## What the mechanism is

The source doc (yubi-OS/yubiOS skills/hyperspherical-harmonic-curve/SKILL.md) adds a learned Moebius reparameterization phi_theta in PSL(2,C) of the domain on top of the spherical-harmonic basis. This was an advisor-mandated revision in cycle 1: the Moebius map exists specifically to support the mechanism claim, the explanation of why sphere geometry wins at fewer parameters, not just the correlation claim (source doc, cycle 1, advisor revision 1). The transformation is corpus-level: one Moebius transformation applied uniformly to all files in the corpus, not a per-file warp (source doc, Moebius Refinement Strategy section).

Moebius transformations are the projective transformations of the complex projective line; they form the Moebius group, the projective linear group PGL(2,C) (weakly backed: https://en.wikipedia.org/wiki/M%C3%B6bius_transformation, jev weight 0.33). Geometrically, a Moebius transformation can be built by inverse stereographic projection from the plane onto the unit sphere, a rigid motion of that sphere, and a stereographic projection back to the plane (weakly backed: https://en.wikipedia.org/wiki/M%C3%B6bius_transformation, jev weight 0.41). That construction is exactly why the map composes naturally with a corpus whose points already live on S2: it is a change of coordinates on the same sphere, not a deformation of it. Any conformal self-map of the disk is a composition of a Moebius transformation with a rotation (weakly backed: https://mathworld.wolfram.com/MoebiusTransformation.html, jev weight 0.44).

## How it is fit

Cycle 3 implemented the refinement in two steps (source doc, cycle 3). First a closed-form ridge re-solve at each Moebius step, so the linear coefficients are always the exact optimum for the current domain warp. Second an L-BFGS-B refinement of the Moebius parameters themselves, with the ad minus bc equals plus 1 normalization holding the parameters inside PSL(2,C) rather than the full GL(2,C). The measured effect of refinement over the identity map is a train R2 gain of +0.0086, small but positive, confirming the identity start is already close to optimal on this corpus (source doc, cycle 3).

L-BFGS is a quasi-Newton method in the BFGS family that stores a limited-memory approximation of the Hessian instead of the full matrix (weakly backed: https://en.wikipedia.org/wiki/Limited-memory_BFGS, jev weight 0.16). The skill chose it for the same reasons its SciPy documentation lists: bounded constraints and low memory per iteration (weakly backed: https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.fmin_l_bfgs_b.html, jev weight 0.29).

## The gate: cross-ratio preservation

The Moebius map is gated by the cross-ratio invariant. The cross-ratio of four collinear points is preserved by the projective transformations of the projective line (weakly backed: https://en.wikipedia.org/wiki/Cross-ratio, jev weight 0.24); it is the classical double ratio of four points, the quantity every Moebius transformation leaves fixed (weakly backed: https://encyclopediaofmath.org/wiki/Cross_ratio, jev weight 0.45). The skill turns that invariant into a unit test: on 100 held-out 4-tuples, the refined phi_theta must preserve the cross-ratio to within 1e-4. Measured max error is 3.08e-07, passing with three orders of magnitude of margin (source doc, cycle 3).

The invariant is the right gate because it is the one quantity a genuine PSL(2,C) element cannot break. A parameterization that drifted outside the group, for example by letting ad minus bc depart from plus 1, would show up immediately as cross-ratio error. The Rose-Hulman construction paper makes the same connection concrete: every Moebius transformation is stereographic projection onto a sphere, a rigid motion, and projection back (weakly backed: https://scholar.rose-hulman.edu/rhumj/vol13/iss2/8, jev weight 0.27), and none of those steps changes cross-ratios.

## Status of the mechanism claim

The claim the refinement supports is mechanism, not just fit: the sphere wins because a group action on the sphere gives a reparameterization the flat surface cannot express. Cycle 2 left this partially verified because the refinement was unexercised; cycle 3 closed it by actually training phi_theta (source doc, cycle 2 and cycle 3).
