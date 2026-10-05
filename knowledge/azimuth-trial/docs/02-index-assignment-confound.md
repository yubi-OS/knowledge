# 02. Index-assigned versus data-derived azimuth

Scope: the two different azimuth constructions that get conflated, the Fibonacci golden-angle index map, and why an ordering-permutation result on one construction says nothing about the other.

## Construction A: azimuth assigned from the index

In the spherical-harmonic corpus papers the corpus sits on a Fibonacci lattice: point i has azimuth phi_i = 2 * pi * i / phi_g, where i is the PC1 rank of the document and phi_g is the golden ratio conjugate. This is the standard golden-angle spiral used to distribute points evenly on a sphere, where each point's azimuth is a deterministic function of its index ([Gonzalez, "Measurement of Areas on a Sphere Using Fibonacci and Latitude-Longitude Lattices", Springer, w 0.89](https://link.springer.com/article/10.1007/s11004-009-9257-x); [John D. Cook, "Simple way to distribute points on a sphere", w 0.68](https://www.johndcook.com/blog/2023/08/12/fibonacci-lattice/)). The lattice construction assigns the azimuth directly from the sequence position; nothing about the data value at that position enters the angle.

That is why the papers' Remark 1 reads as it does: power at cos(3 phi) is a property of the index map until an ordering-permutation null says otherwise (source record: azimuth-trial-2026-09-19, section 0). If the angle is a function of the rank, then shuffling the ranks is the correct null: it asks whether the observed harmonic power is anything more than what the spiral itself would put there. The 500-shuffle null in the papers found m = 3 shares below their nulls, and the three-fold narrative was buried on that basis (source record, section 0).

## Construction B: azimuth derived from the data

The point map's azimuth is a different object. The sector index is atan2(y, x) evaluated on the two placement-PCA scores, lift(proj(z(bits))), so the angle is computed from the data itself. There is no index, no rank, and no spiral in it (source record, section 0). It is a data-derived 2-D coordinate.

These two constructions share only the word azimuth. A result that transfers to one need not transfer to the other. The papers' ordering-permutation result constrains Construction A, the index-assigned azimuth. It says nothing about Construction B, the data-derived azimuth. The prompt-geometry analysis that called the azimuthal channel dead conflated the two: it took the papers' burial of the three-fold narrative (an index-map result) as a verdict on the point map's data-derived azimuth (source record, section 0).

## Why the distinction changes the null

The correct null for a data-derived angle is not a permutation of ranks. It is a matched null on the data-generating process: null bit matrices refit through their own placement PCA, fixed-margin (checkerboard-switch) nulls that preserve margins, or per-column shuffles for continuous scores (source record, sections 1 and 4). The angle statistic is then compared against draws that went through the same pipeline.

The trial tested the data-derived azimuth against exactly such matched nulls and found: an apparent m = 1 exclusion that later turned out to be an atomicity artifact (docs 03), no detectable angular structure once atomicity is removed (doc 09), and the identity chart's blindness to the m = 3 structure (doc 05). None of those verdicts came from an ordering-permutation argument.

## The permutation framing in general

Circular permutations, the combinatorial object where rotations of a sequence are identified with each other, are the natural model for why index-assigned angles have a degenerate null: rotating the index assignment leaves the multiset of positions unchanged in the circular case ([MathWorld: Circular Permutation, w 0.79](https://mathworld.wolfram.com/CircularPermutation.html); [LibreTexts: Circular Permutations and Permutations with Similar Elements, w 0.83](https://math.libretexts.org/Bookshelves/Applied_Mathematics/Applied_Finite_Mathematics_(Sekhon_and_B))). When the statistic is rotation-invariant anyway (doc 01), the index permutation question reduces to whether the index map itself injects structure.

The general permutation-test machinery is the same idea in hypothesis-testing form: compare the observed statistic to its distribution under shuffles of the data labels ([Wikipedia: Permutation test, w 0.10, weak](https://en.wikipedia.org/wiki/Permutation_test)). The weak weighting here is a reminder to reach for primary treatments of permutation inference, but the principle is standard.

## The transfer rule

The lesson is a membership test, not a tuning detail. Before importing a negative verdict about a coordinate from one corpus-analysis setting into another, check that the coordinate is the same object in both. Index-assigned azimuth and data-derived azimuth are not the same object, and the trial's entire reason to exist is that the data-derived azimuth had never been tested against a matched null (source record, section 0). It was untested, not dead.
