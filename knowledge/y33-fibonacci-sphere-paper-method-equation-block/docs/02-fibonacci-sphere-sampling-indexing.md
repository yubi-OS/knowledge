# Fibonacci Sphere Sampling and Indexing

Scope: the canonical Fibonacci sphere indexing z_i = 1 - (2i+1)/N and phi_i = 2 pi i / phi with golden ratio phi = (1+sqrt(5))/2, its Vogel and Saff-Kuijlaars provenance, and why the index i can double as the latent parameter t = i/N.

## The canonical indexing

The equation block's second equation fixes the angle pair (theta_i, phi_i) for each of N points by closed-form expressions. The scheme is the standard Fibonacci lattice: points are placed at latitude arccos(2 i / P) and longitude 2 pi i / phi, where phi is the golden ratio and P the point count (weight 0.85, https://www.johndcook.com/blog/2023/08/12/fibonacci-lattice/). Cook's P = 2N+1 variant with latitude arccos(2i/P) and the source block's z_i = 1 - (2i+1)/N are the same construction written with different index offsets: both space the points uniformly in cos(theta) so that the polar caps receive their fair share of points.

The azimuthal step is the golden angle: phi_i = 2 pi i / phi advances each successive point around the equator by an irrational fraction of a full turn. Because the golden ratio is irrational, no two points ever share the same azimuth; the Observable notebook on Fibonacci lattices notes that while any irrational number produces this non-collision property, the golden ratio is a particularly good choice because it maximizes the minimum nearest-neighbor distance (weight 0.25, https://observablehq.com/@meetamit/fibonacci-lattices). Weak backing note: that source scores below 0.5 and should be treated as supporting, not authoritative.

A practical signal for the same scheme: the widely referenced Stack Overflow answer on evenly distributing points on a sphere recommends the Fibonacci sphere algorithm as fast and visually even (weight 0.45, https://stackoverflow.com/questions/9600801/evenly-distributing-n-points-on-a-sphere). Weak backing note: forum provenance, weight below 0.5.

## Direct comparison against latitude-longitude grids

The strongest primary evidence in the dig comes from the arXiv paper on measuring areas on a sphere using Fibonacci and latitude-longitude lattices. Its figure comparing a 1014-point latitude-longitude lattice against a 1001-point Fibonacci lattice shows the Fibonacci points are much more evenly spaced, especially near the poles where the latitude-longitude grid clusters (weight 0.92, https://arxiv.org/pdf/0912.4540). This is the empirical backing for the source block's claim that Fibonacci sampling avoids polar clustering: the lat-long ring structure keeps the same spacing in latitude but covers decreasing circumference as theta approaches 0, so points pile up near the poles.

The same paper's framing matters for the equation block: because the sampling is a deterministic closed-form point set rather than a random draw, the (theta_i, phi_i) pairs are reusable across runs, which is what makes the one-line substitution into the modulated embedding well-defined.

## Provenance: Vogel and Saff-Kuijlaars

The planar ancestor of the scheme is Vogel's spiral. MathWorld defines the Vogel spiral as a discrete point set in which radii follow Fermat's spiral, and records that the customary choice alpha = pi (3 - sqrt(5)) is the golden angle and produces the interlacing spiral patterns used to model phyllotaxis in sunflower heads (weight 0.86, https://mathworld.wolfram.com/VogelSpiral.html). Note the exact constant: the golden angle is 2 pi / phi^2 = pi (3 - sqrt(5)) radians, which is the azimuthal increment per point; the source block's phi_i = 2 pi i / phi accumulates that same irrational rotation.

The sphere version is the Saff-Kuijlaars / Fibonacci lattice line of work: distributing many points on the sphere with asymptotically optimal spacing, later formalized as spherical Fibonacci lattices in the discrepancy literature (weight 0.91 and 0.81, https://link.springer.com/article/10.1007/s00454-012-9451-3 and https://arxiv.org/pdf/1109.3265). The source block's canonical indexing z_i = 1 - (2i+1)/N with phi_i = 2 pi i / phi is the form used throughout that line.

A survey-style treatment of the Fibonacci lattice emphasizes that the point set is deterministic with maximally uniform coverage and that the 2D cylindrical projection reveals two families of diagonal lines at gradients set by the Fibonacci numbers, exactly as in a sunflower head (weight 0.49, https://adambaskerville.github.io/posts/SphereSampling/). Weak backing note: blog provenance, weight below 0.5.

## Why the index i can do double duty

The source block's key structural trick is that the same integer i plays two roles: the Fibonacci sphere point index and, via t = i/N, the latent curve parameter. Three properties make this sound:

1. phi_i = 2 pi i / phi is a direct function of i, with no lookup table and no rejection sampling, so the mapping i to (theta_i, phi_i) costs O(1) per point.
2. cos(theta_i) = 1 - (2i+1)/N is closed-form, so theta_i is one arccos away.
3. The t = i/N convention the paper already uses survives unchanged; no separate sphere-sampling parameter needs to be introduced.

This is why the mapping from the learned latent curve to the sphere is a one-line substitution rather than an expensive coupling between two systems.

## Constraints inherited by the equation block

1. The golden ratio phi = (1+sqrt(5))/2 is the canonical azimuthal constant. Substituting pi (Vogel's planar variant) or the Saff-Kuijlaars psi = (1+sqrt(5))/2 * pi variant changes the point distribution and must be renamed explicitly, not silently swapped.
2. The indexing starts at i = 0 with N points total; changing the offset convention changes the alignment between t = i/N and the sphere nodes, which the companion prose-revision artifact must mirror.
3. Uniform spacing in cos(theta), not in theta, is the property that buys the pole behavior; converting to a uniform-in-theta scheme would reintroduce the clustering the scheme exists to avoid.
