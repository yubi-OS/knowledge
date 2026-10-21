# 02. Verification (live, after the 25 second stale window)

**Scope:** Verification (live, after the 25 second stale window): detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-adoption-2026-10-16.md.

> Ground source: yubi-OS/yubiOS refs/arr-premap-adoption-2026-10-16.md. External dig: dig_context_02.json (10 Clef-weighted searXNG results).

## Why a stale window

Verification waited 25 seconds after the deploy before probing. Reading immediately risks hitting a cached prior version and recording old behavior as new. All verification facts below come from `yubi-OS/yubiOS refs/arr-premap-adoption-2026-10-16.md`.

## Health and selftests

| Check | Result |
|---|---|
| /api/jev/health | ok, policy_version 23, not paused |
| /api/jev/corpus/spectral/selftest | 9 of 9 pass |
| /api/jev/route/selftest | ok |

The spectral selftest follows the same exact graph and 4 dp coordinates as `walkPoints`, so its pass is a check on the new graph rather than on a stale fixture.

## The gasket walk

On the 366 gasket centres in points mode:

- d_w moved from **2.765024** to **2.897099**.
- n_edges moved from **1031** to **1039**.
- The post-deploy value matches the canonical value from lane A2.

The edge count is the structural evidence. 1039 matches the Euler count for this point set and contains every forced edge, per the feasibility record. The 8 added edges are forced edges the old graph missed.

## Why more edges changes d_w

d_w is a walk exponent: it measures how mean squared displacement of random walks on the graph scales with time. Adding edges changes which moves are available, so it changes the walk statistics. The seed query probed degree distribution and random walks on planar graphs, and the weak-backing results frame the setting. A thesis on planar maps, random walks, and circle packing connects circle packing theory with probability on planar graphs, per [Planar Maps, Random Walks and Circle Packing - arXiv.org](https://arxiv.org/pdf/1812.11224v2) (clef weight: 0.2086) (weak backing, clef weight < 0.5). A journal article studies the degree distribution of random planar graphs, per [Degree distribution in random planar graphs - ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0097316511000781) (clef weight: 0.1201) (weak backing, clef weight < 0.5), with the preprint describing a random planar graph drawn uniformly from all planar graphs on n vertices, per [PDF Degree distribution in random planar graphs](https://www.dmg.tuwien.ac.at/drmota/DegreeDist.pdf) (clef weight: 0.1120) (weak backing, clef weight < 0.5). A Delaunay graph of a fixed point set is not a uniformly random planar graph, so these results are context, not a model of this case. A display-hardware vendor page is off-topic, per [Home / Planar](https://www.planar.com/) (clef weight: 0.0440) (weak backing, clef weight < 0.5).

## Oracle centroid d_w on the five gold renders

Each post-deploy value matched the local prediction to six decimals. D is unchanged on all five.

| Artifact | D | d_w before | d_w after | Traced droplets |
|---|---|---|---|---|
| shuffle-s42 | 1.035474 | 4.175736 | 3.481099 | 19 |
| pumpkin_field | 1.038390 | 7.770301 | 6.584950 | 6 |
| pumpkin_ring | 0.977190 | 4.505589 | 4.843677 | 6 |
| gasket-v2-L384 | 1.558937 | 2.255452 | 2.043963 | 366 |
| tri | 1.263595 | 2.958820 | 2.881828 | 19 |

**Reading the table.** D is a box-counting quantity on the pixel mask and involves no triangulation, so it must not move; it did not. d_w moves in both directions: down on four artifacts, up on pumpkin_ring. The low-droplet artifacts (6 traced droplets) show the largest absolute shifts, which is expected when a graph has few vertices and each edge is a large share of the structure.

**Prediction before measurement.** Every live value matched the local prediction to six decimals. This is the strongest form of deploy verification available: the change was computed offline, written down, and then observed on the live worker.

## Wall time

Three calls of the 366-point walk on the live worker took **1.03 s, 1.04 s, and 0.65 s**. This is wall time. Workerd CPU time is not exposed, and the worker has no custom limits (settings `limits: null`). The source is careful not to report these as CPU numbers.

## Floating-point robustness as the root cause

The robustness literature explains why the old graph drifted and the new one does not, though every dig source scored as weak backing. Wikipedia's entry on robust geometric computation defines nonrobustness as branching decisions based on approximate numerical tests, per [Robust geometric computation - Wikipedia](https://en.wikipedia.org/wiki/Robust_geometric_computation) (clef weight: 0.0944) (weak backing, clef weight < 0.5). Shewchuk's robust-predicate work is listed on his CMU page, per [Fast Robust Predicates for Computational Geometry](https://www.cs.cmu.edu/~quake/robust.html) (clef weight: 0.1977) (weak backing, clef weight < 0.5), and described in the conference paper, per [PDF Robust Adaptive Floating-Point Geometric Predicates](https://people.eecs.berkeley.edu/~jrs/papers/robust-predicates.pdf) (clef weight: 0.1674) (weak backing, clef weight < 0.5), and the longer article, per [Adaptive Precision Floating-Point Arithmetic and Fast Robust ...](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf) (clef weight: 0.1663) (weak backing, clef weight < 0.5). The Rust georust/robust crate cites both Shewchuk papers (Discrete and Computational Geometry 18(3), 1997; and the 1996 symposium paper), per [GitHub - georust/robust: Robust predicates for computational geometry](https://github.com/georust/robust) (clef weight: 0.2214) (weak backing, clef weight < 0.5). A general list of numerical analysis topics also came back, per [List of numerical analysis topics](https://handwiki.org/wiki/List_of_numerical_analysis_topics) (clef weight: 0.0469) (weak backing, clef weight < 0.5).

The adopted part sidesteps floating-point branching entirely: 4 dp rounding plus exact integer predicates, with Simulation of Simplicity for exact ties.

## Verification summary

| Property | Evidence |
|---|---|
| Worker healthy, policy unchanged | health ok, policy_version 23 |
| New graph complete | 1039 edges, matches lane A2 |
| Selftests on new graph | spectral 9/9, route ok |
| Consumer shifts predicted | 5/5 gold renders match to 6 decimals |
| D invariant | Unchanged on all 5 |
| Performance | 0.65 to 1.04 s wall, no custom limits |

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Planar Maps, Random Walks and Circle Packing - arXiv.org | https://arxiv.org/pdf/1812.11224v2 | 0.2086 | weak (< 0.5) |
| 2 | Degree distribution in random planar graphs - ScienceDirect | https://www.sciencedirect.com/science/article/pii/S0097316511000781 | 0.1201 | weak (< 0.5) |
| 3 | PDF Degree distribution in random planar graphs | https://www.dmg.tuwien.ac.at/drmota/DegreeDist.pdf | 0.1120 | weak (< 0.5) |
| 4 | List of numerical analysis topics | https://handwiki.org/wiki/List_of_numerical_analysis_topics | 0.0469 | weak (< 0.5) |
| 5 | Home / Planar | https://www.planar.com/ | 0.0440 | weak (< 0.5) |
| 6 | GitHub - georust/robust: Robust predicates for computational geometry | https://github.com/georust/robust | 0.2214 | weak (< 0.5) |
| 7 | Fast Robust Predicates for Computational Geometry | https://www.cs.cmu.edu/~quake/robust.html | 0.1977 | weak (< 0.5) |
| 8 | Adaptive Precision Floating-Point Arithmetic and Fast Robust ... | https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf | 0.1663 | weak (< 0.5) |
| 9 | Robust geometric computation - Wikipedia | https://en.wikipedia.org/wiki/Robust_geometric_computation | 0.0944 | weak (< 0.5) |
| 10 | PDF Robust Adaptive Floating-Point Geometric Predicates | https://people.eecs.berkeley.edu/~jrs/papers/robust-predicates.pdf | 0.1674 | weak (< 0.5) |
