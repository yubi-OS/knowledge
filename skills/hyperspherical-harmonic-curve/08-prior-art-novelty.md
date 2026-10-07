# 08 Prior art and the novelty verdict

Scope: the prior-art record the skill built across cycles 4 and 5: the two depth-verified papers, what each does and does not cover, and the resulting composition-level novelty verdict.

## The two hits, and how each was verified

The source doc (yubi-OS/yubiOS skills/hyperspherical-harmonic-curve/SKILL.md) verified prior art in two rounds after the initial search surfaced two hits that could not be closed from abstracts alone (source doc, cycle 3 carryover gap #4).

Hit 1, closed in cycle 4 via webfetch: arXiv 2601.20528, Spectral Bayesian Regression on the Sphere, Durastanti 2026. The dig for this corpus independently retrieved the paper and confirms the abstract's scope: a fully intrinsic Bayesian framework for nonparametric regression on the unit sphere, built on isotropic Gaussian field priors and the harmonic structure induced by the Laplace-Beltrami operator (weakly backed: https://arxiv.org/abs/2601.20528, jev weight 0.47; https://arxiv.org/abs/2601.20528v1, jev weight 0.45). The source doc's conclusion after the depth-fetch: Fourier-on-S2 is known, but only as Bayesian regression with a statistical-theory focus, with no corpus audit, no learned Moebius, and no sparse-cell detection, so the application layer is not covered (source doc, cycle 4).

Hit 2, blocked then closed: OpenReview g6UqpVislvH. Cycle 4's API attempt failed with 403 ChallengeRequiredError, an honest gap documented at the time, leaving mechanism-layer novelty BORDERLINE on that one unverified hit (source doc, cycle 4). Cycle 5 closed it without the API: the user supplied the paper PDF, text was extracted with pdftotext (1127 lines), and 11 novelty-relevant patterns were grepped with 0 matches across all patterns (source doc, cycle 5). The paper is Generalized Fourier Features for Coordinate-Based Learning of Functions on Manifolds, under review at ICLR 2022, anonymous authors. Its scope is positional encoding for NeRF, panorama, and SO(3) probability distribution learning using spherical harmonics plus SO(2)/SO(3) rotation shifts (source doc, cycle 5).

## What the neighborhood actually looks like

The dig corroborates the neighborhood from the outside. Fourier feature networks map input coordinates into a higher-dimensional feature space so networks can learn high-frequency functions in low-dimensional domains, published as a NeurIPS 2020 spotlight (weakly backed: https://bmild.github.io/fourfeat/, jev weight 0.35). That is the coordinate-encoding line the ICLR 2022 paper extends. The same paper's abstract also appears verbatim in public dataset mirrors, with no mention of corpus audit or Moebius reparameterization (weakly backed: https://huggingface.co/datasets/yuntian-deng/_abc/viewer/default/train?p=85, jev weight 0.07).

The decisive distinction the source doc draws is group-theoretic: the prior art uses SO(2)/SO(3) group actions, rotations of the sphere, while this variant learns a Moebius element of PSL(2,C), a projective reparameterization of the domain that no rotation group provides (source doc, cycle 5). Spherical harmonics themselves are common ground; the novelty lives in the composition: learned PSL(2,C) reparameterization plus corpus-audit application plus sparse-cell measurement.

## The verdict and its exact wording

The mechanism-layer novelty verdict was upgraded from BORDERLINE on one unverified hit to CONFIRMED at composition level once both hits were depth-verified with 0 novelty-keyword matches (source doc, cycle 5). The wording is precise: composition level means the combination is new, not that any single ingredient is. An orthonormal spherical-harmonic basis is standard (see doc 01); stereographic projection and cross-ratio invariance are classical (see doc 02). What no verified prior work composes is those pieces with a corpus-audit pipeline and a learned projective domain warp.

## The standing trigger

The changelog leaves one live condition: the novelty hold is open only while no prior-art hit covers the variant's composition (source doc, cycle 5 note). If a future paper combines corpus audit with PSL(2,C) reparameterization, the verdict must be re-opened and re-run through the same depth-fetch discipline, including the honest recording of any source that cannot be fetched at API level.
