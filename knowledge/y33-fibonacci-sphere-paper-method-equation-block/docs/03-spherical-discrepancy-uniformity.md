# Spherical Discrepancy and Uniformity of Fibonacci Point Sets

Scope: what the discrepancy literature actually says about Fibonacci sphere point sets, how uniformity is formalized, and where the source block's O(1/N) uniformity claim sits relative to the published bounds.

## How uniformity is formalized

The dominant formalization in the literature is the spherical cap discrepancy: the supremum, over all spherical caps, of the difference between the fraction of points in the cap and the cap's normalized area. A first definition of uniform distribution of a set of points on the sphere focuses on the approximation of integrals on the sphere: one searches for a distribution of points such that the difference between the numerical integration carried out using those points and the exact integral is small (weight 0.86, https://arxiv.org/html/2407.01503v1; same content, weight 0.86, https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0313863). This integral-approximation view is exactly the property the equation block needs, because its downstream consumers are quadrature grids and spectral losses over S^2.

## What is proven for spherical Fibonacci lattices

The key primary result: a study of the geometric discrepancy of explicit constructions of uniformly distributed points on the two-dimensional unit sphere shows that the spherical cap discrepancy of random point sets, of spherical digital nets, and of spherical Fibonacci lattices converges at a controlled rate (weight 0.91, https://link.springer.com/article/10.1007/s00454-012-9451-3). The same line of work is available as an arXiv preprint (weight 0.81, https://arxiv.org/pdf/1109.3265). These papers establish spherical Fibonacci lattices as a named, analyzed family, not merely a visualization trick.

The precise rate deserves care. A seminar treatment of spherical cap discrepancy records that Fibonacci points F_N satisfy a spherical cap discrepancy of order N^{-1/2} in its summary of known results, alongside random points and Diamond ensembles (weight 0.63, https://vlasiuk.com/PDseminar/pdf/ferizovic.pdf). Weak backing caution: the source block states O(1/N) uniformity; the discrepancy literature's headline bounds for the cap discrepancy of Fibonacci lattices are quoted at order N^{-1/2} in this source. The honest reading for a methods section is that Fibonacci sampling is provably low-discrepancy with published convergence rates, and the paper should cite the specific rate it relies on rather than assert O(1/N) without a reference. This is a flagged discrepancy between the source artifact and the literature, recorded here rather than smoothed over.

Related primary work bounds the cap discrepancy of lattices pushed through the Lambert map to the sphere: for any full rank lattice Lambda and K, the point set Lambda/K intersect (0,1)^2 with N approximately K^2 points has a bounded spherical cap discrepancy under the Lambert map (weight 0.85, https://link.springer.com/article/10.1007/s00454-023-00547-4), with the proof established in the companion arXiv paper showing the bound at most of order N^{-1/2} with an explicitly given leading coefficient (weight 0.87, https://arxiv.org/pdf/2202.13894). These Lambert-map constructions are a different family from the Fibonacci lattice, but they anchor the same framework the Fibonacci results are stated in.

## Why the equidistribution is visible

The empirical side is unambiguous. The Fibonacci versus latitude-longitude comparison shows Fibonacci points much more evenly spaced than the lat-long lattice, which clusters at the poles (weight 0.92, https://arxiv.org/pdf/0912.4540). Practitioner writing on corrected grids makes the same negative point: naive equidistant latitude-longitude grids cluster at the poles, and fixes adjust latitude spacing by spherical cap area or golden-ratio offsets (weight 0.10, https://www.pythontutorials.net/blog/evenly-distributing-n-points-on-a-sphere/). Weak backing note: weight far below 0.5, use only as corroboration.

The mechanism is the golden-angle azimuth combined with uniform spacing in cos(theta): each point sees its neighbors at a roughly equal great-circle distance, so no polar cap is starved and no equatorial band is oversubscribed. This is what makes the (theta_i, phi_i) pairs from the equation block a sensible deterministic surrogate for a uniform measure on S^2.

## Consequences for the equation block

1. The near-uniform coverage claim is backed at the level of named constructions with published discrepancy rates, so the paper can state it with citations rather than heuristics.
2. The exact asymptotic rate should be cited from the primary sources (order N^{-1/2} for cap discrepancy per the seminar summary; the block's O(1/N) claim should either be scoped to a different uniformity functional or softened).
3. Because the point set is deterministic, repeated runs and ablations sample identical (theta_i, phi_i) grids, which keeps the ablation suite comparable across arms.
4. The uniformity is what licenses the block's third role: using the same node set as a quadrature grid, covered in the companion doc on integration over S^2.
