# 02 - The null is the vacuum, the residual is the deflection

**Scope.** Curveball null standardization read as measuring lensing deflection against the unlensed background; the random-matrix theory behind the null "medium" and the statistical equivalence principle that survives standardization.

## The lensing reading

In gravitational lensing, the observable is the difference between the lensed image position and the unlensed background position: the deflection is defined relative to a background you must model first. A gravitational lensing lecture from the University of Maryland states that lensing is the deflection of light by gravitational fields and that its usefulness comes precisely from this relative measurement (weight 0.7733, https://pages.astro.umd.edu/~mcmiller/teaching/astr422/lecture13.pdf). A Rutgers lecture on lensing physics develops the magnification and image-position formalism against the unlensed flux (weight 0.5581, https://www.physics.rutgers.edu/~ajbaker/ph343/Phys343_41408.pdf). At survey scale, a CMB polarisation analysis reconstructs the gravitational lensing deflection power spectrum by comparing observed fields against the unlensed expectation (weight 0.7092, https://arxiv.org/abs/1911.10980v2). The weak-lensing regime makes the relativity explicit: most lines of sight are so weakly lensed that the deflection is impossible to detect in a single background source, so the signal is a statistical residual (weight 0.1037, weak, https://en.wikipedia.org/wiki/Weak_gravitational_lensing).

The framework mapping: the curveball null ensemble is the unlensed background, and the null-standardized residual is the deflection. The source findings doc records Delta V2 = +0.0144 at z = +12.3 as a measured deflection angle for the yubiOS corpus against its matched null. This mapping is the framework's own reading; the dig anchors establish that the background-subtraction pattern is exactly how the lensing literature computes.

## The null medium has an analytic spectrum

The Marchenko-Pastur law describes the asymptotic behavior of singular values of large rectangular random matrices (weight 0.1287, weak, https://en.wikipedia.org/wiki/Marchenko%E2%80%93Pastur_distribution). Lecture notes from the University of Chicago state and prove the theorem: for a p x n random matrix with iid entries of mean 0 and variance 1, the eigenvalue distribution converges to the Marchenko-Pastur bulk (weight 0.5128, http://galton.uchicago.edu/~lalley/Courses/383/Wigner.pdf; a companion set of notes covers the orthogonal-invariance that underlies the proof, weight 0.4644, weak, http://statistics.uchicago.edu/~lalley/Courses/386/Wigner.pdf). A quant-finance library reference restates the bulk bound for a correlation matrix with aspect ratio Q = N/M (weight 0.1937, weak, https://risk-ai-research.github.io/diffract/reference/metrics/rmt.html).

The source findings doc attributes the sharper result to Lyu and Mukherjee (arXiv:2407.14942): fixed-margin random matrices converge to a tilted-iid ensemble with a variance profile, Marchenko-Pastur at constant margins. That gives the curveball "medium" an analytic spectrum rather than an empirical one. The dig did not surface the Lyu-Mukherjee paper itself, so this attribution rests on the source doc; the MP baseline it refines is dig-backed above. The framework's 98%-marginal result is that medium, and Delta V2 = +0.0144 is the deflection angle measured through it.

## Standardization as an equivalence principle

The framework's strongest claim: standardization is a statistical equivalence principle. Locally, coordinates always exist in which the medium is flat; what survives the change of coordinates is the curvature, carried by Delta V2z, the directional Hodge statements, and the Parseval shares measured against the null. This is the same structure as the local-flatness argument in the lensing formalism (weight 0.1458, weak, https://en.wikipedia.org/wiki/Gravitational_lensing_formalism). Cramer-type large deviation theory supplies the exponential tightness intuition used when arguing that a null-standardized z cannot be beaten by a better exponent (weight 0.2732, weak, https://www.formalstatistics.com/topics/large-deviations).

## Design consequence

Nothing in this doc licenses treating the null as cosmetic. The null is the metric background: a coordinate that cannot demonstrate a non-degenerate null is measuring nothing (the honesty constraint carried in doc 08 and doc 10). The weakest link in the anchor chain is the Lyu-Mukherjee citation, flagged above; the cheapest repair is a direct read of arXiv:2407.14942 in a later round.

## Sources considered

| result | weight | used |
|---|---|---|
| UMD gravitational lensing lecture | 0.7733 | yes |
| CMB deflection power spectrum (arXiv 1911.10980) | 0.7092 | yes |
| Rutgers lensing physics lecture | 0.5581 | yes |
| UChicago Wigner/MP theorem notes | 0.5128 | yes |
| UChicago bulk spectrum notes | 0.4644 | weak, context |
| Marchenko-Pastur Wikipedia | 0.1287 | weak, cited as definition |
| Weak gravitational lensing Wikipedia | 0.1037 | weak, cited as regime context |
| Gravitational lensing formalism Wikipedia | 0.1458 | weak, cited as context |
| rmt library reference | 0.1937 | weak, no |
| Large deviations reference | 0.2732 | weak, cited as context |
| Hockey statistics site (off topic) | 0.5506 | no |
