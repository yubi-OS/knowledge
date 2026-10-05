# 03. Atomicity: duplicate patterns manufacturing false angular positives

Scope: how a discrete binary corpus collapses into point masses on the placement plane, why that manufactured an apparent m = 1 exclusion, and what raising the dimension shows about the collision artifact.

## The corpus is a small set of points with heavy multiplicities

The trial's fixture is 301 documents placed as 9-bit patterns (source record: azimuth-trial-2026-09-19, section 3). A 9-bit pattern has 512 possible values, and 301 documents occupy only 167 distinct ones: a 44.5 percent collision rate. Because azimuth is a function of the pattern alone, every duplicate row lands on exactly the same angle. The angular distribution is therefore not a spread of 301 points but a set of heavy point masses with large multiplicities. The source record connects this to the named mechanism from the earlier corpus analysis: "only 176 distinct rows of 512 possible, so the point cloud is a set of heavy point masses" (curved-corpus section 5.3, quoted in source record section 3).

This is a general hazard for binary embeddings in low dimension: the geometry of binary vectors concentrates at small Hamming weights and saturates at high dimension, and distinct documents sharing one pattern behave as one measurement repeated many times ([arXiv: The High-Dimensional Geometry of Binary Neural Networks, w 0.88](https://arxiv.org/pdf/1705.07199.pdf); [Springer: Binary Vectors for Fast Distance and Similarity Estimation, w 0.85](https://link.springer.com/article/10.1007/s10559-017-9914-x)). Hyperdimensional computing literature makes the same point about the collision behavior of binary vectors as a function of dimensionality ([Wikipedia: Hyperdimensional computing, w 0.71](https://en.wikipedia.org/wiki/Hyperdimensional_computing); [arXiv: Understanding Hyperdimensional Computing for Parallel Single-Pass Learning, w 0.83](https://arxiv.org/pdf/2202.04805)).

## The false m = 1 exclusion

At K = 40 with a fixed-margin (checkerboard-switch) null that preserved margins, the m = 1 mode produced the strongest signal in the table: observed Z = 0.711 against a null median of 0.094 and null max of 0.581, with both seeds pinning the tail at the 1/41 resolution floor of 0.0244 (source record, section 2). Read alone, that is an exclusion.

The K = 200 dedup run decomposed it:

| variant | obs Z | null med | null max | tail (a) | tail (b) |
|---|---|---|---|---|---|
| all 301 rows | 0.711 | 0.119 | 0.746 | 0.0100 | 0.0199 |
| deduplicated (167 distinct) | 0.061 | 0.077 | 0.682 | 0.5572 | 0.6219 |

Deduplicated, the observed value falls below the null median. The signal is carried by the duplicate rows (source record, section 3). The source record also flags an important honesty constraint on this comparison: it is size-mismatched. The observed Z was computed on 167 distinct rows while null draws dedup to 212 to 241 rows, with zero draws at 167. The module itself detects this (`size_matched:false`) and refuses to conclude from the table. The right reading of m = 1 is on the structural ground the module states: PCA centering makes the radius-weighted first moment sum(r_j * exp(i phi_j)) identically zero, so unweighted Z_1 measures radius-angle coupling, not angle alone (source record, errata 2).

## Multiplicity as repeated measurement

The statistics literature treats repeated measurements of the same underlying quantity as a distinct inferential problem: they bias circular estimators unless handled explicitly ([IEEE / PMC: Estimation of Circular Statistics in the Presence of Measurement Bias, w 0.86](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10964323/); [IEEE version, w 0.86](https://ieeexplore.ieee.org/document/10335958); [arXiv preprint, w 0.51](https://arxiv.org/html/2209.10468v1)). A corpus with 44.5 percent collision is exactly this situation, with each distinct pattern acting as a measurement repeated k times. Designs that repeat circular measurements are a recognized design pattern with known bias consequences ([ScienceDirect: circular repeated measurement designs, w 0.55](https://www.sciencedirect.com/science/article/pii/S2307410824000622)).

## Atomicity is a dimension artifact, and removing it does not revive the channel

Collision rate falls steeply with dimension (source record, section 4):

| d | distinct of 301 | collision rate |
|---|---|---|
| 9 | 167 | 44.5% |
| 12 | 251 | 16.6% |
| 16 | 289 | 4.0% |
| 20 | 297 | 1.3% |
| 24 | 298 | 1.0% |

The atomicity route out is to keep raising d until collisions vanish, or to skip binarization and place on continuous PCA scores directly, which gives 300 distinct angles of 301 (source record, section 4). But the record's conclusion is important and negative in a specific way: removing atomicity removes the false positive. It does not produce a detectable angular signal. The continuous placement gave non-exclusions across all m with low-power nulls (doc 09). So the causal story is precise: atomicity was real, it manufactured a false m = 1 positive, and killing the artifact did not revive the channel (source record, section 5).

## What stands

Two verdicts survive together. First, any angular statistic on a low-dimensional discrete corpus must be interpreted against its multiplicity structure, and unweighted first-harmonic statistics fail the membership condition structurally because centering forces the radius-weighted first moment to zero (source record, section 3). Second, the artifact's removal is not evidence for the channel; the channel's fate at the identity chart is a separate question, settled by low-power non-detection (docs 05 and 09).
