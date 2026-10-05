# 07 - SLERP is the geodesic interpolant the framework already implies

**Scope.** Shoemake's slerp as the constant-speed geodesic interpolant on the sphere, the three discrete slerps already inside the is-this-x framework, and the concentration-of-measure argument for why geodesic interpolation beats linear in high dimension.

## The interpolant

Spherical linear interpolation, coined slerp by Shoemake in 1985 (section 3.3), describes interpolation along a great arc so that spherical distance from the starting point varies uniformly with the parameter (weight 0.7197, https://splines.readthedocs.io/en/latest/rotation/slerp.html). A Linkoping paper on incremental spherical linear interpolation cites Shoemake 1985 directly and extends the two-point construction to smooth interpolation over vectors and intensities (weight 0.8484, https://ep.liu.se/ecp/013/004/ecp01304.pdf). The formula, in the source doc's notation, is slerp(p, q; t) = [sin((1 - t)Omega) p + sin(t Omega) q] / sin Omega with cos Omega = p dot q; it is the constant-speed geodesic on S^n. In practice the operation is standard enough that Qt's quaternion animation type ships it as the default, with normalized linear interpolation as the faster but less accurate alternative (weight 0.7444, https://doc.qt.io/qt-6/qml-qt3d-core-quaternionanimation.html). The Wikipedia entry covers the same construction with the uniform-arc-length property (weight 0.3853, weak, https://en.wikipedia.org/wiki/Spherical_linear_interpolation).

## Why geodesic, not linear: the White 2016 argument

White's "Sampling Generative Networks" (arXiv:1609.04468) introduces techniques for sampling and visualizing latent spaces of generative models, and its central result is exactly the interpolation choice: replacing linear interpolation with spherical linear interpolation prevents diverging from a model's prior distribution and produces sharper samples (weight 0.8064, https://arxiv.org/abs/1609.04468; PDF at weight 0.598, https://arxiv.org/pdf/1609.04468; OpenReview discussion at weight 0.5377, https://openreview.net/forum?id=SypU81Ole). The mechanism behind the result: Gaussian latents concentrate on a shell, so the straight line between two latent points cuts through low-density territory while the geodesic stays on the shell. A follow-up paper formalizes the same hazard for Gaussian latents and proposes combination-of-Gaussians (COG) as an alternative linear scheme that respects the prior's assumptions (weight 0.8382, https://arxiv.org/html/2408.08558v4). A survey essay on generative modelling in latent space covers interpolation schemes in the same context (weight 0.3613, weak, https://sander.ai/2025/04/15/latents.html). The framework's reading goes one step further: concentration of measure makes every high-dimensional latent space effectively a hypersphere, so the spherical construction generalizes beyond the 2-sphere the visual intuition suggests.

## The three discrete slerps already in the framework

The source findings doc identifies three objects in the is-this-x papers that are secretly discrete slerps:

1. The atom's flip sequence: a geodesic walk toward the ideal pole, one quantum at a time.
2. The fold ladder: constant-ratio steps along a 1-parameter family, which is slerp sampled at a geometric grid of t.
3. The drift-alignment of curves across corpora (learned-latent-curves section E.4): re-parameterizing curves so they align is a spherical repositioning.

The continuous upgrade replaces the k-quantized ladder with slerp(p_file, p*; t), a continuous bloom parameter t in [0, 1]: the corpus file's point and the ideal pole's point connected by the constant-speed geodesic, sampled anywhere.

## What it buys

The SLERP fold (source doc, part of what diffusion buys the map, doc 10): replace the amplitude ladder s = 0.25 to 2 with geodesic rungs slerp(p0, p*; t_k) on a constant-ratio grid. The fold-slope statistic and the empirical null-ladder quantile carry over unchanged, but the rungs are intrinsic to the sphere with no log-odds units, so the fold becomes basis-independent and composes with the achromatic coordinates of doc 04.

## Sources considered

| result | weight | used |
|---|---|---|
| Incremental SLERP (Linkoping ECP) | 0.8484 | yes |
| COG linear combinations of Gaussian latents | 0.8382 | yes |
| Sampling Generative Networks (arXiv abs) | 0.8064 | yes |
| Qt QuaternionAnimation | 0.7444 | yes |
| splines.readthedocs slerp | 0.7197 | yes |
| Sampling Generative Networks PDF | 0.598 | yes |
| OpenReview Sampling Generative Networks | 0.5377 | yes |
| Spherical linear interpolation Wikipedia | 0.3853 | weak, cited as definition |
| Dieleman latent-space essay | 0.3613 | weak, cited as context |
| Slerp (redirect) Wikipedia | 0.1804 | weak, no |
| myabandonware (off topic) | 0.2061 | no |
| Merriam-Webster latent | 0.4742 | no |
