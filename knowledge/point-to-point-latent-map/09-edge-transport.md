# Slerp and geodesic transport between sphere points

**Scope:** Slerp and geodesic interpolation on the sphere: bridge edges between points, monotone distance along rungs, antipodal handling. The map's bridge edges connect an item to the pole (or item to item) with spherical-linear-interpolation rungs at constant ratio; this doc grounds the interpolation.

## Design context

The map's edge families are discrete (atom edges, compass edges, null trades) and continuous. The continuous family is slerp: between an item's point p and a target q (the all-ones pole for a bloom bridge, or another item for point-to-point transport), rungs are generated at t in [0,1], and the certificate asserts that the geodesic distance to q is monotone non-increasing along the rungs. This doc grounds the slerp formula and its degeneracies.

## The slerp formula

Spherical linear interpolation moves along the great-circle arc between two unit vectors at constant angular speed. The standard form: with cos(Omega) = p dot q, the interpolated point is slerp(p, q; t) = [sin((1-t) Omega) p + sin(t Omega) q] / sin(Omega), for t in [0,1] [https://en.wikipedia.org/wiki/Spherical_linear_interpolation, weights 0.50 and 0.62]. Wikipedia's article attributes the formulation to Shoemake's 1985 quaternion interpolation work and notes the constant-velocity property: the angular speed along the arc is uniform in t, which is what makes equal t steps equal arc-length steps, the "rungs at constant ratio" property the map relies on.

The splines library documentation derives the same formula and gives the geometric picture: the interpolant is a normalized linear combination whose weights are the two sine terms, so at t = 0 it is p, at t = 1 it is q, and between them it stays on the unit sphere [https://splines.readthedocs.io/en/latest/rotation/slerp.html, weights 0.69 and 0.77]. The EuclideanSpace reference implements the quaternion variant and states the same sine weighting [https://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/index.htm, weight 0.82].

## Why rungs are monotone toward the target

The geodesic distance from the interpolant to q is (1-t) Omega: slerp parametrizes the arc so that the remaining angular distance shrinks linearly in t. This follows directly from the formula's structure (the angle between slerp(p,q;t) and q equals (1-t) Omega), which the splines documentation states in its derivation [https://splines.readthedocs.io/en/latest/rotation/slerp.html, weight 0.69]. The map's bridge certificate (distance to q monotone non-increasing along rungs) is therefore a structural property of the interpolation, checked per rung in floating point as a measurement shadow rather than asserted.

For the pole bridge this yields the map's continuous analogue of the atom ladder: each rung moves strictly closer to the all-ones pole, so a bridge walk is a monotone descent in gap, just as an atom path is a monotone non-decreasing accumulation of delta. The two families are the discrete and continuous halves of the same monotonicity discipline.

## Degeneracies: small angle and antipodal

The formula divides by sin(Omega), which degenerates in two regimes. When Omega is near 0 (p and q nearly identical), sin(Omega) is near 0 and the expression needs a numerically stable path; the standard practice is to fall back to normalized linear interpolation for small angles, which the splines documentation discusses [https://splines.readthedocs.io/en/latest/rotation/slerp.html, weight 0.69]. When Omega is pi (p and q antipodal), there is no unique shortest great circle: infinitely many arcs connect the two points, and the formula has a 0/0 singularity. Implementations must choose a convention; interpolation "the long way" versus the short way is a separate choice that reverses the sign of Omega [https://stackoverflow.com/questions/62943083/interpolate-between-two-quaternions-the-long-way, weight 0.29, weak backing].

The map's addendum records its own resolution: antipodal slerp is made deterministic and normalized, meaning the implementation picks a fixed convention (rather than drifting with floating point noise) and re-normalizes the output to the unit sphere. This is an implementation decision, not a published standard, and the published sources support only the statement that the antipodal case requires an explicit convention [https://en.wikipedia.org/wiki/Spherical_linear_interpolation, weight 0.62].

Quaternion slerp inherits the same algebra with the additional double-cover subtlety: q and -q represent the same rotation, and interpolators handle the sign choice explicitly [https://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation, weight 0.54]. A worked quaternion interpolation guide walks the sign handling [https://liorsinai.github.io/mathematics/2021/12/06/quaternion-4-interpolation.html, weight 0.56]. The map works with 3-D unit vectors directly, so the double-cover does not arise, but the underlying trigonometry is shared [https://en.wikipedia.org/wiki/Quaternion, weight 0.52, weak backing]. Two supplementary treatments compare slerp against lerp and nlerp and show where the cheaper alternatives deviate from constant angular speed [https://symonb.github.io/docs/math/rotation%20in%203D/lerp_nlerp_slerp.html, weight 0.54] [https://medium.com/@akp83540/slerp-algorithm-a4ce1bacee4a, weight 0.36, weak backing].

## What the bridge layer asserts

1. Slerp moves at constant angular speed along the unique great-circle arc between non-antipodal unit vectors, with the sine-weighted formula as the standard construction [https://splines.readthedocs.io/en/latest/rotation/slerp.html, weight 0.69].
2. The remaining distance to the target is (1-t) Omega, so rung monotonicity is structural, and the runtime check is a float shadow of it [https://en.wikipedia.org/wiki/Spherical_linear_interpolation, weight 0.62].
3. The antipodal case has no unique arc and requires an explicit, deterministic convention; small-angle cases need a numerically stable fallback [https://splines.readthedocs.io/en/latest/rotation/slerp.html, weight 0.69].

## Sources considered

| Source | Weight |
|---|---|
| Quaternion interpolation (SLERP), EuclideanSpace | 0.82 |
| Slerp, splines documentation | 0.77 (0.69 for first entry) |
| Spherical linear interpolation, Wikipedia | 0.62 (0.50 for first entry) |
| Quaternions part 4, Lior Sinai | 0.56 |
| LERP, NLERP and SLERP, Symon B | 0.54 |
| Quaternion, Wikipedia | 0.52 |
| Quaternions and spatial rotation, Wikipedia | 0.54 |
| SLERP algorithm, Medium | 0.36 |
| Long-way quaternion interpolation, Stack Overflow | 0.29 |
| SLERP, emergentmind | 0.16 |
