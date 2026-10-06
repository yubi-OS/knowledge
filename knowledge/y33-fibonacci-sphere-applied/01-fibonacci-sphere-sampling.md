# Fibonacci Sphere Sampling

Scope: the Fibonacci sphere sampling scheme on S2, the exact node indexing used by the applied y33 machinery, why it avoids polar clustering, and where its low-discrepancy reputation comes from.

## The scheme as applied

For N points indexed by i = 0, 1, ..., N-1, the applied y33 machinery samples S2 with:

- z_i = 1 - (2i+1)/N (uniform spacing in cos theta)
- phi_i = 2 pi i / varphi, where varphi = (1+sqrt(5))/2 is the golden ratio
- theta_i = arccos(z_i)

This is the indexing written into the paper's Methods insertions and carried through the applied synthesis (source: yubi-OS/yubiOS refs/y33-fibonacci-sphere-applied-2026-08-07.md, internal ref). The same z_i and phi_i formulas appear verbatim in both companion artifacts, the method equation block and the revised passage, which the applied doc explicitly keeps synchronized (internal ref: refs/y33-fibonacci-sphere-paper-method-equation-block-2026-08-07.md).

## Why it avoids polar clustering

A latitude-longitude grid spaces rings uniformly in theta, so ring circumference shrinks toward the poles and points crowd there. The Fibonacci scheme spaces points uniformly in z = cos theta instead, and steps the azimuth by the golden angle, so each point sees its neighbors at a roughly equal great-circle distance. Implementations describe it as "a spiral walk of the spherical surface in angular increments equal to the golden angle" (https://chiellini.github.io/2020/10/06/fibonacci_spiral_sphere/, weight 0.77). The RadiCal method note derives the sphere from a Fibonacci lattice on the unit square, following Marques et al. 2013 (https://radi-cal.org/method/a-fibonacci-hemisphere/, weight 0.58).

The practical payoff is measured, not just aesthetic: Leopardi's paper on measuring areas of spherical regions by point counting analyzes the numerical errors of the technique for Fibonacci versus latitude-longitude lattices and finds the Fibonacci lattice the better point-counting lattice (https://arxiv.org/pdf/0912.4540, weight 0.84; mirror listing https://www.researchgate.net/publication/45891871_Measurement_of_Areas_on_a_Sphere_Using_Fibonacci_and_Latitude_Longitude_Lattices, weight 0.73). That is exactly the regime the y33 machinery cares about: the nodes are used as a diagnostic grid, and grid bias becomes measurement bias.

## Provenance and standing of the scheme

The scheme the y33 refs docs cite is the canonical Saff and Kuijlaars construction from "Distributing many points on a sphere" (Mathematical Intelligencer 19(1), 5-11). The paper's own framing is that uniform point distribution on the sphere "has not only inspired mathematical researchers, it has attracted the attention of biologists, chemists, and physicists working in such fields as viral morphology, crystallography, molecular structure, and electrostatics" (author copy: http://www.math.vanderbilt.edu/saffeb/texts/161.pdf, weight 0.81; journal page: https://link.springer.com/article/10.1007/BF03024331, weight 0.95).

The broader literature treats near-uniform sphere point sets as a mature subfield: Hardin and Sloane's survey of spherical designs and minimal energy point configurations opens by alluding to that same Saff-Kuijlaars paper and discusses how to construct point sets on the sphere in generality (https://arxiv.org/pdf/1407.8282, weight 0.90; related survey of spherical designs and minimal energy configurations: https://www.sciencedirect.com/science/article/pii/S0885064X15000205, weight 0.92). The Fibonacci indexing is one cheap, closed-form member of that family.

Practitioner sentiment backs the speed claim, weakly: the Stack Overflow answer on evenly distributing n points on a sphere calls the Fibonacci sphere algorithm fast and says its results "at a glance will easily fool the human eye" (https://stackoverflow.com/questions/9600801/evenly-distributing-n-points-on-a-sphere, weight 0.49, weak backing, labeled as such). A general-audience walkthrough makes the same elegance point (https://observablehq.com/@meetamit/fibonacci-lattices, weight 0.79, from the doc 03 dig).

## The dual role of the index

The operational detail that makes this scheme load-bearing for the applied synthesis is that i does double duty: it is both the Fibonacci point index and the latent parameter, t = i/N. Because phi_i = 2 pi i / varphi and z_i = 1 - (2i+1)/N are closed-form functions of i, the mapping i -> (theta_i, phi_i) costs O(1) per point, with no lookup table and no rejection sampling (internal ref: refs/y33-fibonacci-sphere-paper-method-equation-block-2026-08-07.md). That is what turns the paper's c(t) -> S2 -> modulated x_i pipeline into a one-line substitution instead of a resampling layer.

## Constraints worth restating

The equation-block ref pins the conventions: the golden ratio varphi = (1+sqrt(5))/2 must not be silently swapped for pi (the Vogel variant) or for varphi*pi (the Saff-Kuijlaars variant), and the latitude-longitude grid is not a drop-in replacement for Fibonacci sampling in this block; the ablation that compares them is precisely because they are not equivalent at the math level (internal ref: refs/y33-fibonacci-sphere-paper-method-equation-block-2026-08-07.md).

## Sources considered

| source | weight |
|---|---|
| https://link.springer.com/article/10.1007/BF03024331 | 0.95 |
| https://www.sciencedirect.com/science/article/pii/S0885064X15000205 | 0.92 |
| https://arxiv.org/pdf/1407.8282 | 0.90 |
| https://arxiv.org/pdf/0912.4540 | 0.84 |
| http://www.math.vanderbilt.edu/saffeb/texts/161.pdf | 0.81 |
| https://chiellini.github.io/2020/10/06/fibonacci_spiral_sphere/ | 0.77 |
| https://observablehq.com/@meetamit/fibonacci-lattices | 0.79 |
| https://radi-cal.org/method/a-fibonacci-hemisphere/ | 0.58 |
| https://stackoverflow.com/questions/9600801/evenly-distributing-n-points-on-a-sphere | 0.49 (weak) |
| https://www.designcoding.net/fibonacci-sphere/ | 0.27 (weak, not cited) |
| https://openprocessing.org/@jbum/41142 | 0.11 (weak, not cited) |
