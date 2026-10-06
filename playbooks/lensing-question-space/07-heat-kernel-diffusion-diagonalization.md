# 07: The basis diagonalizes diffusion: the heat kernel gift

Scope: source doc finding F9: the spherical-harmonic basis as eigenbasis of the Laplace-Beltrami operator, the closed-form S2 heat kernel, per-mode decay, the diffusion-time estimator, and the null as the t-to-infinity endpoint.

Grounding spine: [source doc](file://yubi-OS/yubiOS playbooks/lensing-question-space.md), 2026-08-13, section F9.

## Eigenfunctions and the kernel

The source doc states that the real spherical harmonics are the eigenfunctions of the Laplace-Beltrami operator, Delta Y_lm = -l(l+1) Y_lm, and gives the S2 heat kernel as K_t(x.y) = sum_l (2l+1)/(4 pi) exp(-l(l+1) t) P_l(x.y) (source doc). The dig backs the two halves: spherical harmonics are the standard special functions on the sphere used to solve PDEs ([en.wikipedia.org/wiki/Spherical_harmonics](https://en.wikipedia.org/wiki/Spherical_harmonics), weight 0.56, weak), and explicit heat-kernel expansions of the Laplace-Beltrami operator on rank-one symmetric spaces including spheres are established results ([link.springer.com 10.1007/s12215-022-00784-1](https://link.springer.com/content/pdf/10.1007/s12215-022-00784-1.pdf), weight 0.84). A heat-equation reference gives the general diffusion frame ([en.wikipedia.org/wiki/Heat_equation](https://en.wikipedia.org/wiki/Heat_equation), weight 0.57, weak).

## Three free consequences

1. Diffusion is diagonal in the Parseval coordinates: under heat flow each per-mode energy decays as E_lm(t) = E_lm(0) exp(-2 l(l+1) t) before renormalization, so diffusing a corpus is a closed-form operation on the already-measured spectrum (source doc).
2. A diffusion-time estimator falls out: fit t-hat from measured per-degree decay of E_l against a reference, one scalar saying how defocused a corpus is, dimension-comparable by construction (source doc, F5 tie-in).
3. The null space is the t-to-infinity endpoint: Brownian motion on a compact manifold converges to the uniform measure, so forward diffusion is exactly the map Q to N0, and the heat flow supplies every intermediate frame between the two endpoints the is-this-x program measured (source doc).

All three consequences are the source doc's own derivations; the dig verifies the enabling mathematics (eigenbasis, kernel) but not the framework-level claims, which are internal-record.

## Weak-backing warning

The Heat (1995 film) hits (IMDb 0.2, Wikipedia 0.64) are name collisions and not sources. The CR-sphere subelliptic kernel paper (0.78) is a different operator and is background only.
