# 02. Grounding: What the Three Research Lanes Found

**Scope:** Grounding (what the lanes found): detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-oracle-2026-10-06.md.

Ground source: `yubi-OS/yubiOS refs/hierarchy-oracle-2026-10-06.md`. Dig context: `dig_context_02.json` (10 clef-weighted searXNG results).

## Five findings

The one-pager's grounding section lists five numbered findings from the three lanes. Each is reproduced and explained here, with external context where the dig supplied it.

## 1. The exact bridge is the Einstein relation

d_s = 2*d_f/d_w. The doc states that our D **is** d_f for gasket shapes (1.585 measured versus ln3/ln2). The Sierpinski gasket carries exact closed forms for all three exponents:

| Exponent | Closed form | Value |
|---|---|---|
| d_f | ln3/ln2 | about 1.585 |
| d_w | ln5/ln2 | about 2.322 |
| d_s | 2*ln3/ln5 | about 1.365 |

Fukushima-Shima solved the gasket Laplacian exactly, with a log-periodically modulated spectrum. Random walks on fractals are anomalous (<r^2> proportional to tau^(2/d_w)); periodic structures diffuse normally. The doc frames this as 40-year-old physics (Alexander-Orbach 1982, Rammal-Toulouse 1983) that was never packaged as a reusable measurement instrument over arbitrary 1D signals.

## 2. The 6-fold answer is measured

From the live taste matrix: the 6-fold Y3^3 ring reads `fractal_band` OFF (p 0.029, D 0.913), `symmetry_present` ON (1.0), `symmetry_variation` OFF. That places it in an ordered-smooth class, distinct from the gasket, which reads `fractal_band` ON (p 0.925).

The doc resolves the diagonal-diffusion question structurally: 6-fold symmetry **is** "diagonal-in-irreps" (hexagonal Laplacian eigenvalue multiplicities divisible by 6, spectrally compressible), but the transport-efficiency reading is refutable, because symmetry degeneracies slow mixing. Summary line: the 6-fold is spectrally compressible; the gasket is hierarchically ordered; the instrument separates them by measured D.

## 3. The powered lens has rigorous grounding

A lens **is** a fractional Fourier transform (Ozaktas-Mendlovic 1993): quadratic phase plus rescaling, a one-parameter diffeomorphism family where order 0 is the identity and order 1 is the Fourier transform. Adaptive optics is the canonical measure-then-correct loop, with known failure modes: unmeasured modes, non-common-path error, and servo lag. The lanes found no prior art for a self-correcting fractal-dimension instrument.

## 4. Calibration finding, probed locally

`mirrorSymmetryScore` is pixel-exact. Centering a gasket or ring render on integer (256, 256) instead of the true mirror axis at 255.5 collapses symmetry reads from 1.0 to about 0.31 on r = 3 contour renders. The doc's conclusion: centering discipline is load-bearing for any symmetry-band claim. This is a half-pixel error producing a 69% drop in a score, which is why it is recorded as a calibration hazard rather than a curiosity.

## 5. Real experiments that measured spectral hierarchy

The doc names two experimental literatures:

- **Silica aerogels**: fracton density of states measured by inelastic neutron scattering, d_s about 1.8, described as sample-sensitive.
- **Fractal drums**: verifying the Weyl-Berry-Lapidus law N(omega) proportional to omega^(D_boundary/2). "Can you hear the fractal dimension of a drum" is real literature.

The dig for this doc lands on the aerogel and fracton literature. A Springer paper reports the density of vibrational states in a fractal silica aerogel of Hausdorff dimension D about 2.4, measured by spin-echo neutron spectroscopy, with a smooth phonon-fracton crossover: [Measurement of the phonon-fracton crossover in the density of states of ...](https://link.springer.com/article/10.1007/BF01387817) (clef weight: 0.3681) (weak backing, clef weight < 0.5). The HAL copy of the original "fractons" paper calculates the density of states on a fractal using scaling properties of both volume and connectivity: [Density of states on fractals: `` fractons ''](https://hal.science/jpa-00232103/document) (clef weight: 0.2818) (weak backing, clef weight < 0.5), with a ResearchGate copy at [(PDF) Density of states on fractals:«fractons» - ResearchGate](https://www.researchgate.net/publication/43965082_Density_of_states_on_fractalsfractons) (clef weight: 0.1413) (weak backing, clef weight < 0.5). A ScienceDirect paper used Raman scattering on a silica aerogel to study the acoustic density of states in that disordered system: [Investigation of fraction density of states in an aerogel by Raman ...](https://www.sciencedirect.com/science/article/pii/0038109888900543) (clef weight: 0.0898) (weak backing, clef weight < 0.5). All four carry weak weights, so they confirm that the experimental literature exists, while the specific d_s about 1.8 figure rests on the ground source.

## Graph construction context

Building the instrument on arbitrary feature spaces requires turning point sets into graphs. The dig surfaced Delaunay triangulation material, which is one standard way to do that: the Wikipedia article on Delaunay triangulation as the dual of the Voronoi diagram [Delaunay triangulation - Wikipedia](https://en.wikipedia.org/wiki/Delaunay_triangulation) (clef weight: 0.3670) (weak backing, clef weight < 0.5), MIT lecture notes on Delaunay triangulations [PDF Delaunay Triangulations](https://people.csail.mit.edu/indyk//6.838/handouts/lec9.pdf) (clef weight: 0.3579) (weak backing, clef weight < 0.5), a LEDA manual describing POINT_SET as a planar embedded graph representing the Delaunay triangulation [Point Sets and Delaunay Triangulations ( POINT_SET )](https://graphics.stanford.edu/courses/cs368-00-spring/TA/manuals/LEDA/POINT_SET.html) (clef weight: 0.2648) (weak backing, clef weight < 0.5), a visual explainer [Visualizing Delaunay Triangulation](https://ianthehenry.com/posts/delaunay/) (clef weight: 0.1013) (weak backing, clef weight < 0.5), and an arXiv paper on universal point sets for planar graphs [(2609.10916) Almost Linear Universal Point Sets for Planar Graphs](http://arxiv.org/abs/2609.10916) (clef weight: 0.2184) (weak backing, clef weight < 0.5). The ground source does **not** choose Delaunay; its MVP builds 8-connected ink graphs from masks (doc 04). These results are listed as context for future non-image feature spaces only.

## Off-topic result

A cinema listing [AMC Theatres](https://www.amctheatres.com/movie-theatres/seattle-tacoma/amc-pacific-place-11) (clef weight: 0.0305) (weak backing, clef weight < 0.5) backed nothing.

## What the grounding settles

- The bridge identity exists and the gold family satisfies it exactly.
- The 6-fold question has a measured answer: compressible, not hierarchical.
- The lens has math behind it but no prior art as a self-correcting D instrument.
- Symmetry reads need half-pixel centering discipline.
- Spectral hierarchy has been measured in physical systems.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Investigation of fraction density of states in an aerogel by Raman ... | https://www.sciencedirect.com/science/article/pii/0038109888900543 | 0.0898 | weak backing, clef weight < 0.5 |
| 2 | (PDF) Density of states on fractals:«fractons» - ResearchGate | https://www.researchgate.net/publication/43965082_Density_of_states_on_fractalsfractons | 0.1413 | weak backing, clef weight < 0.5 |
| 3 | Measurement of the phonon-fracton crossover in the density of states of ... | https://link.springer.com/article/10.1007/BF01387817 | 0.3681 | weak backing, clef weight < 0.5 |
| 4 | Density of states on fractals: `` fractons '' | https://hal.science/jpa-00232103/document | 0.2818 | weak backing, clef weight < 0.5 |
| 5 | AMC Theatres | https://www.amctheatres.com/movie-theatres/seattle-tacoma/amc-pacific-place-11 | 0.0305 | weak backing, clef weight < 0.5 |
| 6 | Delaunay triangulation - Wikipedia | https://en.wikipedia.org/wiki/Delaunay_triangulation | 0.3670 | weak backing, clef weight < 0.5 |
| 7 | Visualizing Delaunay Triangulation | https://ianthehenry.com/posts/delaunay/ | 0.1013 | weak backing, clef weight < 0.5 |
| 8 | Point Sets and Delaunay Triangulations ( POINT_SET ) | https://graphics.stanford.edu/courses/cs368-00-spring/TA/manuals/LEDA/POINT_SET.html | 0.2648 | weak backing, clef weight < 0.5 |
| 9 | PDF Delaunay Triangulations | https://people.csail.mit.edu/indyk//6.838/handouts/lec9.pdf | 0.3579 | weak backing, clef weight < 0.5 |
| 10 | [2609.10916] Almost Linear Universal Point Sets for Planar Graphs | http://arxiv.org/abs/2609.10916 | 0.2184 | weak backing, clef weight < 0.5 |
