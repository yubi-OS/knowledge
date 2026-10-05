# 06 - The Part I gap map: which index, Snell invariance, membership, and powering the lens

**Scope.** The four Part I gaps with their cheapest tests: choosing the refractive index (gap A), the Snell invariant across the basis ladder (gap B), the membership condition for intent space (gap C), and powering the Mobius lens under a null-constrained objective (gap D), plus the caustic and Wasserstein riders (gaps E and F).

## Gap A: which refractive index

The framework offers three candidates for the index that plays n(z) = |phi_theta'(z)|: the square root of the Fisher determinant, the inverse null standard deviation of a statistic, and the conformal factor itself. The Fisher information metric is a Riemannian metric on a smooth statistical manifold, whose points are probability distributions (weight 0.7116, https://en.wikipedia.org/wiki/Fisher_information_metric; the statistical-manifold definition itself is at weight 0.5367, https://en.wikipedia.org/wiki/Statistical_manifold). A handwiki reference covers the Fisher information as the information an observable carries about a parameter (weight 0.2769, weak, https://handwiki.org/wiki/Fisher_information). A dedicated reference site develops the Fisher metric, natural gradient, and dually flat structure of exponential families (weight 0.288, weak, https://theorempath.com/topics/information-geometry). The test is empirical, not philosophical: whichever candidate predicts the measured power surface on the standard-candle grid wins; the data are already in results/signal_recovery.json (source findings doc).

The optics side supplies the design language: gradient-index (GRIN) optics builds lenses whose refractive index varies spatially so the lens focuses light without shaped surfaces (weight 0.1471, weak, https://en.wikipedia.org/wiki/Gradient-index_optics). A 2023 Springer paper proposes a neural-network design method for GRIN optics in a homogeneous medium using an iterative mapping method (weight 0.781, https://link.springer.com/article/10.1007/s10043-023-00803-1), and a materials-science paper achieves 99.4 percent reflectivity at center wavelength with a gradient refractive index design (weight 0.9546, https://www.sciencedirect.com/science/article/pii/S2666950121001073). The framework's lens is a GRIN lens in question space; gap A picks the index profile.

## Gap B: the Snell invariant

Snell's law is the corner condition of the variational problem at an index discontinuity (source findings doc; the variational chain is dig-backed in doc 01). The framework's test: check conservation of n_D sin(theta_D) across the basis ladder, with n_D taken from the per-D nulls. This is pure re-analysis of ladder_VD.json, no new collection required.

## Gap C: membership for intent space

The intent space I must pass the membership condition: define I as the minimal embedding preserving all family verdicts, and define its null as the same embedding trained on curveball draws. The NPE prior art (doc 05) gives the embedding construction; the membership condition is what the lensing-cosmology pipelines omit, and it is the framework's admissibility gate.

## Gap D: powering the lens

The flagship of Part I: optimize phi_theta to concentrate a target family while the null image stays diffuse. The objective must be null-standardized, never raw fit; the anti-caustic constraint is design rank plus condition number, guarding against the degenerate over-focus of doc 03. This is the constructive payoff of the conformal-mapping identity (doc 01).

## Gaps E and F

Gap E classifies the degenerate bases by one-column perturbation, fold versus structural collapse (doc 03). Gap F is the speculative Wasserstein channel: Benamou-Brenier geodesics between corpus and null row-distributions, admitted only behind its own null; doc 10 records how the Schrodinger bridge reading unifies it with diffusion.

## Order of attack (merged with Part II)

1. G1 (closed-form defocus check, doc 08): hours, pure verification.
2. B (Snell invariant on the ladder): re-analysis only.
3. G3 (scale-space sweep, doc 10): first new science, falsifiable prediction.
4. D (power the Mobius lens): flagship of Part I.
5. G4 (Langevin-compass continuum check, doc 10): extends a green selftest.
6. A, C, G2 (theory choices plus admissibility nulls).
7. G5, E, G6, F (generative model, caustic classification, bridge unification).

## Sources considered

| result | weight | used |
|---|---|---|
| Gradient refractive index design (ScienceDirect) | 0.9546 | yes |
| Fisher information metric Wikipedia | 0.7116 | yes |
| GRIN design via neural network (Springer) | 0.781 | yes |
| Statistical manifold Wikipedia | 0.5367 | yes |
| GRIN optics Wikipedia | 0.1471 | weak, cited as definition |
| theorempath information geometry | 0.288 | weak, cited as context |
| handwiki Fisher information | 0.2769 | weak, cited as definition |
| mylife.com (off topic) | 0.0287 | no |
| fishersci.com (off topic) | 0.0313 | no |
| astronuclphysics.info (off topic) | 0.1922 | no |
| Partition function Wikipedia | 0.3612 | weak, no |
