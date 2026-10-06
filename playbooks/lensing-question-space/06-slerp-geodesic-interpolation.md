# 06: SLERP, the geodesic interpolant

Scope: source doc finding F8: SLERP as the constant-speed geodesic the framework already implies, the three discrete slerps in the papers, and the continuous bloom parameter.

Grounding spine: [source doc](file://yubi-OS/yubiOS playbooks/lensing-question-space.md), 2026-08-13, section F8.

## The interpolant

The source doc quotes Shoemake's slerp: slerp(p, q; t) = [sin((1-t)Omega) p + sin(t Omega) q] / sin Omega with cos Omega = p dot q, the constant-speed geodesic on S^n (source doc). The dig confirms both the definition (interpolation between two points on a sphere such that spherical distance varies uniformly with the interpolant, [en.wikipedia.org/wiki/Spherical_linear_interpolation](https://en.wikipedia.org/wiki/Spherical_linear_interpolation), weight 0.64, weak) and the origin (Shoemake's quaternion-curve animation paper, [dl.acm.org/doi/10.1145/325334.325242](https://dl.acm.org/doi/10.1145/325334.325242), weight 0.72).

## Three hidden slerps

The source doc identifies three objects in the papers as secretly discrete slerps (source doc): the atom's flip sequence (a geodesic walk toward the ideal pole, one quantum at a time), the fold ladder (constant-ratio steps along a 1-parameter family), and the drift-alignment of curves across corpora (learned-latent-curves section E.4). The continuous upgrade replaces the k-quantized ladder with slerp(p_file, p*; t), a bloom parameter t in [0,1] (source doc). These identifications are internal to the source doc and its source works; the dig neither confirms nor contradicts them.

## Why geodesic, not linear

The source doc's precedent is White 2016, "Sampling Generative Networks": Gaussian latents concentrate on the shell of radius sqrt(n), so linear interpolation leaves the data manifold while spherical interpolation stays on it; concentration of measure makes every high-dimensional latent space effectively a hypersphere (source doc). The dig verifies the paper's abstract claim directly: replacing linear interpolation with spherical linear interpolation prevents diverging from a model's prior distribution ([arxiv.org/abs/1609.04468](https://arxiv.org/abs/1609.04468), weight 0.79; the PDF version, [arxiv.org/pdf/1609.04468v2](https://arxiv.org/pdf/1609.04468v2), weight 0.75).

## Weak-backing note

The "White" and "White Screen" hits (0.5, 0.06) are name collisions and irrelevant. An incremental slerp paper scored 0.44 and is background only.
