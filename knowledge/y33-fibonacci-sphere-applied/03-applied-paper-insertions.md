# Applied Paper Insertions

Scope: the two insertions applied to learned-latent-curves-2026-08-06.tex (the Fibonacci sampling scheme and the explicit Y_3^3 identity), where they sit, and how the equation-block and revised-passage companion artifacts divide the work.

## What changed in the paper

Two insertions went into the hyperspherical-harmonic Methods section of papers/learned-latent-curves-2026-08-06.tex, both placed right after the Riemann-sphere sentence (internal ref: refs/y33-fibonacci-sphere-applied-2026-08-07.md):

1. Insertion 1, the Fibonacci sampling scheme: a sentence plus a display equation defining z_i = 1 - (2i+1)/N, phi_i = 2 pi i / varphi with varphi = (1+sqrt(5))/2, and theta_i = arccos(z_i), followed by the per-node evaluation of Y_3^3(theta_i, phi_i). The passage closes by calling the result a low-discrepancy diagnostic grid for angular structure, visualization, and numerical quadrature on S2.
2. Insertion 2, the Y_3^3 evaluation identity: the form sin^3 theta times e^(i 3 phi) is made explicit so the 3-fold azimuthal role of Y_3^3 is unambiguous. This replaces the implicit angular-versus-radial role in the original text.

Both insertions are recorded verbatim in the applied refs doc and its two companion artifacts (internal refs: refs/y33-fibonacci-sphere-paper-method-equation-block-2026-08-07.md and refs/y33-fibonacci-sphere-paper-revised-passage-2026-08-07.md).

## The two companion artifacts

The equation block is the methods-math artifact: a 3-equation implicit form (latent projection, Fibonacci sampling, modulated embedding) plus a 4-equation explicit-real form that expands Re{Y_3^3} inline for readers who want to verify the (l=3, m=3) trig factorization by inspection (internal ref: refs/y33-fibonacci-sphere-paper-method-equation-block-2026-08-07.md). The revised passage is the prose-level artifact: a table of original text, fix, and rationale, plus the drop-in TeX paragraph (internal ref: refs/y33-fibonacci-sphere-paper-revised-passage-2026-08-07.md). The two share the same Fibonacci indexing and the same Y_3^3 form but answer different questions, and a synchronization table in the equation block pins row-by-row correspondence: same node indexing (i from 0), same golden ratio constant, per-node evaluation present in both. A change to any constant, node scheme, or normalization in one must be mirrored in the other before either is lifted into the paper (internal ref: refs/y33-fibonacci-sphere-paper-method-equation-block-2026-08-07.md).

## Why a sampling sentence at all

The insertion exists because a reader cannot reproduce the diagnostic grid from the paper without the sampling scheme being explicit; the rationale recorded in the revised passage is that the nodes z_i, phi_i, theta_i and the per-node evaluation must be stated, not inferred from context (internal ref: refs/y33-fibonacci-sphere-paper-revised-passage-2026-08-07.md). The claim that the result is a usable diagnostic and quadrature grid is grounded outside the project: Leopardi's analysis of point-counting area measurement on the sphere treats Fibonacci and latitude-longitude lattices as competing grids and finds Fibonacci the better point-counting lattice (https://arxiv.org/pdf/0912.4540, weight 0.93), and its reference list includes quadrature work on Fibonacci grids such as NCEP Office Note 448 (https://www.researchgate.net/publication/45891871_Measurement_of_Areas_on_a_Sphere_Using_Fibonacci_and_Latitude_Longitude_Lattices, weight 0.73). The Fibonacci lattice is described generally as an elegant method for distributing points on a unit square, disk, or sphere (https://observablehq.com/@meetamit/fibonacci-lattices, weight 0.79).

## Why the explicit identity at all

The identity insertion makes the angular probe unambiguous. Visual verification of such angular structure is a solved workflow elsewhere: the GFZ ICGEM service provides an interactive spherical-harmonics visualizer where the indices l and m can be selected directly and animated, with m looping over 0..l for fixed l (https://icgem.gfz.de/vis3d/tutorial, weight 0.72). Rendering the real forms of the spherical harmonics is likewise standard practice (https://scipython.com/blog/visualizing-the-real-forms-of-the-spherical-harmonics/, weight 0.48, weak backing, labeled). Laplace's spherical harmonics, the family Y_3^3 belongs to, form an orthogonal system basic to expanding general functions on the sphere (https://en.wikipedia.org/wiki/Spherical_harmonics, weight 0.84).

## What the insertions do not change

The revised passage records that the edit introduces no new notation, no new figures, and no breaking changes to the paper's existing Moebius reparameterization: the Fibonacci sphere is a sampling-side choice while Moebius is the parameterization-side choice, and they compose cleanly (internal ref: refs/y33-fibonacci-sphere-paper-revised-passage-2026-08-07.md).

## Sources considered

| source | weight |
|---|---|
| https://arxiv.org/pdf/0912.4540 | 0.93 |
| https://en.wikipedia.org/wiki/Spherical_harmonics | 0.84 |
| https://observablehq.com/@meetamit/fibonacci-lattices | 0.79 |
| https://www.researchgate.net/publication/45891871_Measurement_of_Areas_on_a_Sphere_Using_Fibonacci_and_Latitude_Longitude_Lattices | 0.73 |
| https://icgem.gfz.de/vis3d/tutorial | 0.72 |
| https://www.designcoding.net/fibonacci-sphere/ | 0.55 (weak relevance, not cited) |
| https://scipython.com/blog/visualizing-the-real-forms-of-the-spherical-harmonics/ | 0.48 (weak) |
| https://stackoverflow.com/questions/9600801/evenly-distributing-n-points-on-a-sphere | 0.08 (weak, not cited) |
| https://openprocessing.org/@jbum/41142 | 0.12 (weak, not cited) |
| https://irhum.github.io/blog/spherical-harmonics/index.html | 0.40 (weak, not cited) |
| https://elysiatools.com/en/visualizations/spherical-harmonics-explorer | 0.27 (weak, not cited) |
| https://sangillee.com/2024-12-22-spherical-harmonics-visualizer/ | 0.57 (not cited; tangential) |
