# 01. Verdict

**Scope:** 0. Verdict: detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-feasibility-2026-10-16.md.

> Ground source: yubi-OS/yubiOS refs/arr-premap-feasibility-2026-10-16.md. External dig: dig_context_01.json (10 Clef-weighted searXNG results).

## The verdict table

The feasibility check issues one verdict per line. Everything in this section is from `yubi-OS/yubiOS refs/arr-premap-feasibility-2026-10-16.md` unless a dig source is cited.

| Line | Verdict | Condition or blocker |
|---|---|---|
| A, arrangement-response-v1 | GO for the D leg and the pixel arm. HOLD the walk-leg verdicts. | The walk exponent's arrangement response depends on the Delaunay tie-break implementation. Pin it or report it as implementation-dependent. |
| B, premap-v1 | GO, gold-family MVP only. | D reference only at depth 6. Identity frame only; registration is Phase 2. |

## Line A in one paragraph

Line A asks how two measured quantities respond when a droplet arrangement is warped (astigmatism, trefoil, spherical aberration arms). The first quantity is D, a box-counting dimension of the rendered mask. The second is d_w, the walk exponent from random walks on a Delaunay graph of droplet centres. The verdict splits them: D can ship, the walk leg cannot yet carry pass or fail verdicts.

## Why D can ship: dimension theory

The D leg matched the record to 4 decimals on every arm in the JS port (doc 04). The theoretical backdrop is that box-counting dimension is a bi-Lipschitz invariant. The ground-source research section treats that as established (citing Deng and Ngai, DOI 10.1155/2014/549741). The dig results agree but only with weak backing. A survey of mathematical and real-world fractals states that Hausdorff, box-counting, and Assouad dimensions are bi-Lipschitz invariants, per [(PDF) Morphological Features of Mathematical and Real-World...](https://www.researchgate.net/publication/382591437_Morphological_Features_of_Mathematical_and_Real-World_Fractals_A_Survey) (clef weight: 0.3066) (weak backing, clef weight < 0.5). A 2023 preprint on new Hausdorff-type dimensions studies optimal bounds for bilipschitz-invariant dimensions, per [New Hausdorff type dimensions and optimal bounds for bilipschitz ...](https://arxiv.org/html/2312.06456v1) (clef weight: 0.3841) (weak backing, clef weight < 0.5), with the published version in Nonlinearity, per [New Hausdorff-type dimensions and optimal bounds for bilipschitz ...](https://iopscience.iop.org/article/10.1088/1361-6544/adb678) (clef weight: 0.4903) (weak backing, clef weight < 0.5). A Stack Exchange thread works through a proof that box-counting dimension is invariant under a bi-Lipschitz map, per [real analysis - Bi-Lipschitz invariance of the box-counting dimension.](https://math.stackexchange.com/questions/963853/bi-lipschitz-invariance-of-the-box-counting-dimension) (clef weight: 0.0388) (weak backing, clef weight < 0.5). An unrelated sign-in page also came back, per [Sign in / Microsoft Power BI](https://app.powerbi.com/home) (clef weight: 0.0231) (weak backing, clef weight < 0.5).

The practical caution: invariance means the dimension of the ideal set is unchanged, while a finite-resolution measurement on a rendered raster can still shift. The record shows that it does: astig 0.2 moves D by -0.1097. The research section lists a canonical finite-resolution correction for droplet rasterization as open, not established, and notes 0.03 translation sensitivity consistent with grid-placement effects in origin-anchored box counting.

## Why the walk leg is on HOLD

The walk exponent comes from mean squared displacement scaling. The MSD is the standard measure of the spatial extent of random motion, per [Mean squared displacement - Wikipedia](https://en.wikipedia.org/wiki/Mean_squared_displacement) (clef weight: 0.1835) (weak backing, clef weight < 0.5), and a paper studies MSD of random walks on graphs specifically, per [On the mean square displacement of a random walk on a graph](https://www.sciencedirect.com/science/article/pii/S0195669815001262) (clef weight: 0.4146) (weak backing, clef weight < 0.5). An interactive explainer shows MSD estimated by averaging squared positions across parallel walks, per [Mean-Squared Displacement Scaling in a Random Walk](https://dashcaf.com/learn/ml/mean-squared-displacement-scaling-in-a-random-walk/) (clef weight: 0.2339) (weak backing, clef weight < 0.5), and a Stack Exchange question covers RMS displacement of a 1D walk, per [probability - Root mean squared displacement of 1D random walk w…](https://math.stackexchange.com/q/3597247) (clef weight: 0.0619) (weak backing, clef weight < 0.5). Anisotropy, the property of differing by direction, is defined in [Anisotropy - Wikipedia](https://en.wikipedia.org/wiki/Anisotropy) (clef weight: 0.1017) (weak backing, clef weight < 0.5). Every one of these is weak backing.

The key point for the verdict is that d_w here is measured on a graph, not in continuous space. Change the graph, and the walk changes. The JS port and the Python record produced different Delaunay graphs on the same points (1031 vs 1025 edges), and the walk responses diverged: up to 0.051 difference in arm response, sign flips on two arms, and one arm crossing the 0.05 band in JS but not in Python. The research section notes that whether a recomputed Delaunay graph of an affinely stretched set keeps its walk exponent is model-dependent and not established in general. So the HOLD is not about the physics but about an instrument that does not yet give one answer.

## Line B in one paragraph

Line B identifies which level of a nested gasket hierarchy an observed point set belongs to, and predicts a D band. The gasket depth ladder (doc 06) shows counts follow (3^k+3)/2 and every level nests in the next, so containment is a usable identification rule. But only depth 6 gives a D fit at r2 >= 0.98, and the walk needs about 300 or more points, which only depth 6 has. Hence: gold-family MVP only, D band only at depth 6, and identity frame only, with registration deferred to Phase 2 because containment fails under displacement.

## What the verdict does not decide

The check deploys nothing. It lists decisions for Jenny: adopt a canonical exact-predicate Delaunay (spectral-standard-v2) or record the implementation sensitivity as a finding; build the Line B identity-frame MVP now or wait for registration; and a separate go for any deploy. The addendum later upgraded the walk issue from tie-break sensitivity to a correctness defect (missing forced edges), which the adoption record resolved.

## Verdict as a gate

| Leg | State | Unblocks when |
|---|---|---|
| A, D leg | GO | Already |
| A, pixel arm | GO | Float-safe rasterizer ships (doc 05) |
| A, walk leg | HOLD | Delaunay pinned, anchors re-derived |
| B, depth 6 D band | GO | Already |
| B, depths 1 to 5 | Identification and holes only | Never for D at this L |
| B, registration | Phase 2 | Separate build |

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | New Hausdorff type dimensions and optimal bounds for bilipschitz ... | https://arxiv.org/html/2312.06456v1 | 0.3841 | weak (< 0.5) |
| 2 | real analysis - Bi-Lipschitz invariance of the box-counting dimension. | https://math.stackexchange.com/questions/963853/bi-lipschitz-invariance-of-the-box-counting-dimension | 0.0388 | weak (< 0.5) |
| 3 | New Hausdorff-type dimensions and optimal bounds for bilipschitz ... | https://iopscience.iop.org/article/10.1088/1361-6544/adb678 | 0.4903 | weak (< 0.5) |
| 4 | Sign in / Microsoft Power BI | https://app.powerbi.com/home | 0.0231 | weak (< 0.5) |
| 5 | (PDF) Morphological Features of Mathematical and Real-World... | https://www.researchgate.net/publication/382591437_Morphological_Features_of_Mathematical_and_Real-World_Fractals_A_Survey | 0.3066 | weak (< 0.5) |
| 6 | Mean-Squared Displacement Scaling in a Random Walk | https://dashcaf.com/learn/ml/mean-squared-displacement-scaling-in-a-random-walk/ | 0.2339 | weak (< 0.5) |
| 7 | On the mean square displacement of a random walk on a graph | https://www.sciencedirect.com/science/article/pii/S0195669815001262 | 0.4146 | weak (< 0.5) |
| 8 | Mean squared displacement - Wikipedia | https://en.wikipedia.org/wiki/Mean_squared_displacement | 0.1835 | weak (< 0.5) |
| 9 | probability - Root mean squared displacement of 1D random walk w… | https://math.stackexchange.com/q/3597247 | 0.0619 | weak (< 0.5) |
| 10 | Anisotropy - Wikipedia | https://en.wikipedia.org/wiki/Anisotropy | 0.1017 | weak (< 0.5) |
