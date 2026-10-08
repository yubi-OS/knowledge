# 05 - Sparse-Cell Detection and the Granularity Rule

**Scope.** Stage 2: the equal-area partition of S^2, the cKDTree nearest-neighbor scan at chordal radius about 0.095 that turns isolated items into the cycle's priority queue, and the granularity rule that keeps the fit well-posed down to N=20.

Grounding spine: the source doc, `yubi-OS/yubiOS skills/repo-history-skill/SKILL.md` (source doc).

## The equal-area partition

Stage 2 partitions S^2 into equal-area cells per the upstream hyperspherical-harmonic-curve Stage-2 contract, using 5,000 equal-area points (source doc, Architectural Choices). Equal-area subdivision of the sphere is an established problem family with several independent constructions: the recursive zonal equal-area partitioning toolbox defines regions by intervals with equal area (https://eqsp.sourceforge.net/, weight 0.45, weak); a peer-reviewed construction partitions S^2 into equal-area, small-diameter regions and uses that to derive bounds (https://www.sciencedirect.com/science/article/pii/S0898122114000133, weight 0.73); a method for subdividing a spherical surface into equal-area and near-equal-latitudinal cells exists on arXiv (https://arxiv.org/pdf/1612.03467, weight 0.71); and a survey-style publication compares equal-area and equilateral spherical polygon subdivisions (https://www.researchgate.net/publication/360184282_Dividing_a_sphere_into_equal-area_andor_equilateral_spherical_polygons, weight 0.52). Two adjacent results round out the family: the 600-cell's highly uniform point distribution on S^3 (https://en.wikipedia.org/wiki/600-cell, weight 0.62) and the least-perimeter partition of the sphere into 4 equal areas (https://ui.adsabs.harvard.edu/abs/arXiv:0903.4097, weight 0.64). The specific cell count and partition scheme in the skill are corpus-level choices, not derived from any single one of these sources.

## The isolated-item scan

The detector is cKDTree with chordal radius r about 0.095: an item is isolated when its nearest neighbor is farther than r (source doc). SciPy's cKDTree is "a kd-tree for quick nearest-neighbor lookup" (https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.cKDTree.html, weight 0.91), and its query method returns the k nearest neighbors with a p-norm distance parameter, which covers chordal (Euclidean) distance on the lifted coordinates (https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.cKDTree.query.html, weight 0.92). SciPy itself is the established scientific Python library wrapping optimized low-level implementations (https://scipy.org/, weight 0.87). Third-party tutorials of the same API are weak backing (https://pythonguides.com/python-scipy-kdtree/, weight 0.18, weak; https://www.tutorialspoint.com/scipy/scipy_spatial.htm, weight 0.22, weak), and a Stack Overflow thread on zero-distance self-matches in neighbor queries is a practical footnote, not evidence (https://stackoverflow.com/questions/36798782/how-to-query-the-nearest-neighbors-including-the-ones-at-distance-zero-with-scip, weight 0.13, weak).

Chordal distance on the unit sphere is bounded by 2.0 at the antipodes, which is why the red-flag rule reads a norm violation as a lift bug: "chordal distance is bounded by 2.0; > 1.0 means re-derive the lift" refers to the norm being off 1.0 (source doc).

## The priority queue

The sparse-cell list is the cycle's priority queue (source doc). Stage 3 dispatches each sparse-cell item through the single-action-curve-rsi atom, which selects the missing primitive whose flip reduces geodesic distance to the ideal pole the most (argmin of d_post over candidates). The ideal pole is the (1,1,...,1) vector in {0,1}^9 lifted the same way: perfectly joined, fully evidenced, fully temporal-anchored items (source doc).

## The granularity rule

The fit is only well-posed above a corpus-size floor, and the source doc encodes the decision table (source doc):

| Corpus size | Granularity | Stage-1 fit quality |
|---|---|---|
| N < 20 | Decompose each item by state-progression snapshot | PCA degenerates; use the NSS 12-axis sweep instead |
| 20 <= N < 30 | One item per row, no decomposition | Moebius identity init; freeze |
| N >= 30 | One item per row | Moebius refine per cycle; re-fit cadence at 25% corpus growth or more |

The rationale for the N=20 gate is that the 2-D PCA top-2 needs at least 2 distinct points to span the plane; below that the curve fit degenerates (source doc, Stage 1). The decomposition rule for small repos multiplies items by state-progression snapshots (a PR's open to merged to closed sequence becomes 3 items) to reach the gate honestly.

## Measured sparse-cell counts

Across the source doc's cycles the sparse-cell count tracked corpus structure: 0 of 34 at cycle 1 (well-connected), 3 of 248 at cycle 2, 16 of 279 at cycle 3 (the issues sub-corpus added structurally-unique items), and the cycle-3 record lists the largest Mode D deltas from those 16 cells, topping out at Issue #70 with +1.0841 and Linear OMN-101 with +1.0704, both flipping has_pr_ref (source doc). A sparse-cell count above 50% of the corpus is a red flag meaning the primitive basis is wrong (source doc).
