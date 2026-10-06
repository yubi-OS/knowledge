# 02 Branch exponent: Murray law, da Vinci, and the alpha band

Scope: branch radius scaling as an aesthetic axis, the alpha radius-exponent parameter that links da Vinci's tree rule to Murray's law, the PNAS Nexus 2025 finding that pleasing tree depictions cluster in an alpha band, and why alpha predicts aesthetic response better than fractal dimension alone.

## One parameter with two famous names

The radius scaling exponent alpha governs self-similar branching: for a parent branch of radius r0 splitting into children of radii r_i, the relation r0^alpha = sum(r_i^alpha) defines how thickness tapers down the tree. Da Vinci's guidelines for painting trees inspire both landscape painters and tree physiologists, yet his prescriptions depend on exactly this parameter, now formalized as the radius scaling exponent in self-similar branching (https://academic.oup.com/pnasnexus/article/4/2/pgaf003/7996468, weight 0.64 and 0.90). Da Vinci's Rule of trees implies fractal branching with a particular scaling exponent alpha = 2 (https://arxiv.org/abs/2402.13520, weight 0.79). Murray's law, from biophysical fluid dynamics, proposes the cubic exponent alpha = 3 for transport networks, derived from minimizing energy under steady-state Poiseuille flow (https://en.wikipedia.org/wiki/Murray%27s_law, weight 0.10, weak aggregator backing; derivation context confirmed at https://www.jafmonline.net/article_2490_229fee679a89eaca523f6529f3fbe641.pdf, weight 0.88, which states minimum energy is achieved when volumetric flow relates to the third power of radius).

## The aesthetic finding: a band, not a point

The PNAS Nexus 2025 study "Scaling in branch thickness and the fractal aesthetic of trees" extends da Vinci's theory of proportion to measure alpha in works of art, enabling comparison against modern tree physiology and fractal geometry, and explains how alpha determines proportions among branches and visual complexity, which in turn influence the fractal dimension D (https://academic.oup.com/pnasnexus/article/4/2/pgaf003/7996468, weight 0.90; mirrored abstract at https://scixplorer.org/abs/2025PNASN...4F...3G/abstract, weight 0.25, weak). The project record states the empirical core: pleasing tree renderings cluster at alpha approximately 1.5 to 2.8, bracketing the da Vinci value (alpha = 2) below and the Murray value (alpha = 3) above, and that alpha predicts aesthetic response better than fractal dimension alone (project record, source doc 2026-10-05; the published paper's framing at weight 0.90 supports alpha as the determinant of visual complexity). A plausible band of 2 to 3 for the structural claim follows: Murray's transport optimum pushes toward 3, while structural load bearing shifts toward 2 (project record).

## Why alpha beats D alone for branching artifacts

The paper's causal chain is the key design insight: alpha determines branch proportions, which determine visual complexity, which influences D (https://academic.oup.com/pnasnexus/article/4/2/pgaf003/7996468, weight 0.90). D is the downstream summary statistic; alpha is the generative parameter that produced it. Two trees with identical D can differ in branch thickness taper and read differently to a viewer. An engine that measures only D on a branching artifact discards the parameter that the art-historical evidence says actually tracks preference. The engine's branch_exponent axis therefore computes its own feature: skeletonize the image, build the bifurcation graph, fit gamma in r0^gamma = sum(r_i^gamma) (project record).

## Murray's law is not a universal constant

A 2024 systematic review and meta-analysis of Murray's law in mammalian coronary arteries identified an optimal flow-diameter exponent of 2.39, in close agreement with the theoretically derived HK exponent of 7/3, suggesting that may describe coronary morphometric scaling better than Murray's original cubic law (https://journals.physiology.org/doi/full/10.1152/ajpheart.00142.2024, weight 0.87). Independent theoretical work reaches the same conclusion from the other direction: Murray's cubic branching law's universality is an artifact of his cost function's homogeneity, and arterial trees consistently yield alpha approximately 2.7 to 2.9 rather than exactly 3 (https://arxiv.org/pdf/2603.13687v1, weight 0.50, borderline weight). For a taste engine this is the difference between a hard gate and a soft band: the physics itself produces a distribution of exponents across living networks, so the aesthetic axis must score against a plausible band, never a single "correct" value.

## Open replication question

The project record flags one assumption explicitly: the gamma-band aesthetic claim from the PNAS Nexus paper must replicate beyond trees before it becomes an axis gate for other artifact classes (project record, source doc 2026-10-05). One paper, one artifact class, is the same limitation the fractal-band literature carries, and the engine's admission discipline (doc 07) treats single-study bands as provisional by default.

## Data availability

The paper's underlying measurements are published: hand-annotated image files and branch diameter data are available in a Dryad repository (https://datadryad.org/dataset/doi:10.5061/dryad.gb5mkkwxs, weight 0.92), which makes an independent replication of the alpha aesthetic band feasible without re-annotating artworks from scratch.
