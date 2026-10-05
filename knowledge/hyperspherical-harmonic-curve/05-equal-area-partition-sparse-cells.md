# 05 - Equal-Area Partition and Sparse Cells

Scope: Stage-2 sparse-cell detection on S2: equal-area partition into 441 cells, chordal neighbor radius r~0.095, and why reusing the incumbent flat grid r=0.05 would inflate the sparse-cell count and fake a pre/post improvement.

## Equal-area pixelation of the sphere

The reference construction is HEALPix, Hierarchical Equal-Area isoLatitude Pixelisation: a subdivision of the spherical surface in which every pixel at the same refinement level covers exactly the same surface area (https://healpix-geo.readthedocs.io/en/latest/healpix/index.html, weight 0.63). The original paper defines HEALPix as a genuinely curvilinear partition of the sphere into exactly equal-area quadrilaterals of varying shape, with a base resolution of 12 pixels in 3 rings around the poles and equator (https://arxiv.org/pdf/astro-ph/9905275, weight 0.64). The older source page records the same properties: equal area per pixel at a given level, with hierarchical refinement (https://healpix.sourceforge.io/, weak backing, weight 0.50, just under the 0.5 line).

Equal-area partitions of the unit sphere are a studied class in their own right, with asymptotic uniformity conditions on sequences of partitions (https://www.researchgate.net/publication/383427513_The_applicability_of_equal_area_partitions_of_the_unit_sphere, weight 0.55). Tessellation theory supplies the background: a tessellation of the sphere is a division of the metric space into cells, and the geometry of the cells, not the latitude bands, determines what "neighboring cells" means (https://link.springer.com/chapter/10.1007/978-1-4471-0243-4_10, weight 0.90; same text as PDF at https://link.springer.com/content/pdf/10.1007/978-1-4471-0243-4_10.pdf, weight 0.70).

A lightweight alternative is the Fibonacci or sunflower lattice, which places points uniformly on the sphere by walking a golden-angle spiral; the technique is documented as a way to evenly distribute n points on a sphere with equal-area spacing (https://stackoverflow.com/questions/9600801/evenly-distributing-n-points-on-a-sphere, weak backing, weight 0.10).

## The chordal radius

The variant's neighbor radius is chordal: straight-line distance through the embedding space, not geodesic arc length. The chordal metric on the Riemann sphere induced by stereographic projection is an established metric construction (https://www.researchgate.net/publication/343147548_Extended_Complex_Plane_and_Riemann_Sphere, weak backing, weight 0.33), and worked examples of chordal distance on the Riemann sphere appear in standard complex-analysis exercises (https://math.stackexchange.com/questions/1397888/chordal-distance-stereographic-projection, weak backing, weight 0.07). Covering radius, the maximum distance from any point in the space to the nearest cell center, is the standard distortion measure for a covering problem (https://arxiv.org/html/2512.22911, weak backing, weight 0.46).

## The design decision and the 0.05 hazard

The yubiOS design record fixes Stage 2 to an equal-area partition of S2 with 441 cells and a chordal neighbor radius of about 0.095, explicitly rejecting two alternatives (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05):

1. Reusing the incumbent's uniform 21x21 grid with radius 0.05. A uniform chart-grid with equal steps in (u, v) is not uniform on S2: cells near the poles shrink in area, so a fixed 0.05 chordal threshold sweeps in different numbers of neighbors at different latitudes. The record states this would inflate the sparse-cell count and fake a pre/post improvement, a metric artifact rather than a real gap closure.
2. Recovering (u, v) from principal components of the coverage matrix. The sign ambiguity of PCA axes and the arbitrary rotation of the plane would make the audit-trail coordinates unstable across runs.

The correct radius follows from the cell size: 441 equal-area cells on the unit sphere give cell area 4 pi / 441, and the chordal radius is set so each cell's neighbor set is comparable to what the incumbent's 0.05 grid saw, which lands near 0.095 (yubiOS design record, same reference; the numeric derivation is the record's own calibration).

## Portability as an open question

The record flags the comparison risk explicitly: the first Stage-5 verification pass must check whether the variant's sparse_cell_count is comparable to the incumbent's 21x21 grid count. If the two pipelines report wildly different counts on the same corpus, the pre/post delta is not portable between them and a migration protocol is needed before any cross-pipeline claim (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05). That check is the Stage-2 analogue of the Stage-5 matched-parameter ablation in doc 04: both exist to stop a changed geometry from being read as an improvement.
