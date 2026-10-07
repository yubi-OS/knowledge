# 05 Sparse-cell detection

Scope: the Stage-2 sparse-cell measurement: equal-area S2 partition, the cKDTree isolated-cell detector with chordal radius approx 0.095, and the measured counts that anchor the Stage-2 contract.

## What the gate measures

The source doc (yubi-OS/yubiOS skills/hyperspherical-harmonic-curve/SKILL.md) left Stage-2 integration unverified through cycle 2, with sparse-cell counts listed among the PENDING FIT items (source doc, cycle 2). Cycle 3 closed it by implementing a sparse-cell detector on an equal-area S2 sampling, using cKDTree with chordal radius r = 0.095, and counting isolated cells (source doc, cycle 3). The measured outcome: 26 isolated cells for the sphere fit versus 31 and 37 for the flat baseline at the two phases, so the sphere representation leaves fewer regions of the corpus map unpopulated (source doc, cycle 3).

The quantity matters because a corpus map with isolated cells means real files sit far from every other file in the learned geometry. Sparse regions are where per-file deltas become unstable: with no neighbors, the local geometry that the curve fit reads out per-file deltas from is unsupported. Fewer isolated cells is therefore a structural argument for the sphere representation, independent of the R2 ablation in doc 03.

## Equal-area partition of the sphere

Stage 2 partitions the sphere into equal-area cells so that per-cell statistics are comparable regardless of where they sit. The standard tool for this is HEALPix, which hierarchically tessellates the sphere into curvilinear quadrilaterals of equal area (weakly backed: https://healpix.sourceforge.io/, jev weight 0.47). HEALPix is a hierarchical equal-area pixelization scheme ensuring unbiased spatial analysis, with ring and nested indexing schemes (weakly backed: https://www.emergentmind.com/topics/healpix-grid, jev weight 0.32). The property the skill needs is the equal-area one: on a lat-long grid, cells near the poles shrink drastically in area and would overweight polar regions in any per-cell count; equal-area tessellation removes that bias.

## The detector: KDTree over chordal distance

The detector builds a KDTree over the sampled points and flags cells whose nearest neighbor lies beyond the chordal radius r = 0.095. A KD-tree is a space-partitioning data structure for organizing points in a k-dimensional space that supports fast nearest-neighbor searches (weakly backed: https://pointclouds.org/documentation/group__kdtree.html, jev weight 0.08); scikit-learn's KDTree exposes generalized N-point neighbor queries over array inputs (weakly backed: https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KDTree.html, jev weight 0.11) and sits in the uniform nearest-neighbors interface alongside BallTree and brute force (weakly backed: https://scikit-learn.org/stable/modules/neighbors.html, jev weight 0.12).

The chordal choice is deliberate: for points embedded in R3 on the unit sphere, Euclidean (chord) distance between the 3-D coordinates is monotone in great-circle distance for the relevant range, so a plain KDTree in R3 works without a custom spherical metric. The radius 0.095 is a calibrated constant, part of the threshold set cycle 4 declared empirically validated at v2 (source doc, cycle 4).

## What Stage 2 feeds

The Stage-2 contract connects this measurement to the rest of the pipeline: the partition defines the cells, the detector counts isolated ones, and the counts become a reported statistic of the fit alongside the spectral gates of doc 04. Cycle 2's open issue (c) named exactly this: sparse-cell counts unmeasured, Stage 2 integration unverified (source doc, cycle 2). Cycle 3 turned the issue into two measured numbers, 26 against 31/37, and the fixpoint review treated the measurement, not a threshold pass, as the closing condition (source doc, cycle 3). The lesson encoded: for a Stage-2 integration claim, the closing evidence is the measurement existing and being recorded, and the sphere-versus-flat comparison gives the number its meaning.
