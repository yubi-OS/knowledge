# 10 - Sphere Langevin, von Mises-Fisher families, scale space, and the bridge

**Scope.** The compass atom as the zero-temperature limit of sphere Langevin dynamics, von Mises-Fisher stationary families as the sphere's Gaussians, the scale-space z(t) channel, and the Schrodinger bridge unification of diffusion with transport.

## The compass atom as a Langevin limit

Riemannian Langevin dynamics on a manifold is an SDE of the form dX = -grad_g Phi(X) dt + sqrt(2T) dB, with stationary density proportional to exp(-Phi(x)/T). A 2026 arXiv paper proves strong convergence of order 1/2 for the geometric Euler-Maruyama scheme for such SDEs, motivated by diffusion models defined on intrinsic data manifolds (weight 0.6137, https://arxiv.org/abs/2603.03626; the PDF scores 0.2758, weak, https://arxiv.org/pdf/2603.03626, and an ADS mirror 0.4511, weak, https://ui.adsabs.harvard.edu/abs/2026arXiv260303626Z/abstract). General Langevin dynamics is the classical modeling approach of adding fluctuation and dissipation forces to molecular dynamics (weight 0.1125, weak, https://en.wikipedia.org/wiki/Langevin_dynamics).

The framework reading (source doc): the curve-compass atom over the 10-state k-shell is the zero-temperature discretization of this dynamics. The compass stationary law pi_T(k) proportional to C(9,k) exp(-Phi(k)/T) is the k-shell marginal of the sphere Langevin under an exchangeable potential; T to 0 recovers greedy geodesic descent, which is the atom, matching the paper's T to 0 verification. One Euler-Maruyama step on the sphere is literally slerp toward the pole plus tangential noise: the deterministic half of the diffusion step is the geodesic interpolant of doc 07. That is the precise sense in which interpolation on the hypersphere creates diffusion.

## Von Mises-Fisher: the sphere's Gaussians

The von Mises-Fisher distribution is the directional-statistics distribution on the sphere, the analogue of the Gaussian for unit vectors (weight 0.5881, https://en.wikipedia.org/wiki/Von_Mises%E2%80%93Fisher_distribution). Its concentration parameter controls how tightly the density concentrates around the mean direction (weight 0.5057, https://en.wikipedia.org/wiki/Concentration_parameter). The estimation literature is mature: a systematic simulation benchmark covers estimating the concentration parameter of the von Mises distribution (weight 0.8111, https://arxiv.org/abs/2111.09660), and a Springer paper gives robust estimation of location and concentration for the von Mises-Fisher family via a reparametrisation expressing both parameters as one vector (weight 0.9215, https://link.springer.com/article/10.1007/s00362-014-0648-9; ResearchGate mirror weight 0.6596, https://www.researchgate.net/publication/356375729). The Fisher distribution extends to the rotation group SO(3) with the same structure (weight 0.6461, https://ui.adsabs.harvard.edu/abs/arXiv:1110.0721).

The framework mapping: the vMF density is proportional to exp(kappa mu dot x), so kappa, the concentration, plays the role of inverse temperature, kappa approximately 1/T. The two-population mixture family M4 of the is-this-x work becomes a 2-component vMF mixture on S2, which gives yubiOS's nearest family a generative spherical form rather than only a descriptive one. Gap G4 (source doc): run the S2 Langevin with Phi equal to chordal distance to the pole at the compass's T grid; verify the k-shell marginal reproduces pi_T(k) and locate the sphere-native crossover, extending the compass's 8/8 selftest to the continuum.

## The scale-space channel

Diffuse the corpus and its matched null with the same t; a signal is diffusion-stable at scale t if its null-standardized z survives. This is Gaussian scale-space theory (vision) transplanted to the question space, giving every coordinate a persistence profile z(t) instead of a single number: features that die at small t are texture, features that survive are structure (source doc). The analogy discipline carries over: each z(t) inherits the same over-dispersion caveat, so use empirical null quantiles, never Gaussian tails. Gap G3 (source doc): z(t) profiles for Delta V2z and E(3,3) on yubiOS and GWTC at 5 to 10 log-spaced t, with the pre-registerable prediction that the m=3 starvation effect (below-null shares) should invert or die at moderate t, since diffusion scrambles the PC1-ordering mechanism that causes it.

## The bridge: diffusion and transport as one family

The source doc closes Part I gap F with the Schrodinger bridge: the bridge between the null measure and the corpus measure interpolates between entropic diffusion (T greater than 0) and Benamou-Brenier optimal transport (T to 0). Diffusion and the Wasserstein channel are one family with T as the knob, the same T the compass already swept: T_x = 0.0411 was measured on the k-marginal, and the sphere version has its own crossover to find. The dig did not surface the Schrodinger bridge literature directly, so this unification is recorded as a source-doc attribution pending a dedicated dig.

Honesty constraints (source doc, carried verbatim): no coordinate enters the map without a demonstrated non-degenerate null, t-hat included; empirical null quantiles for anything built from over-dispersed z; the words diffusion, lens, and focus stay provisional until the corresponding construction passes the membership condition; T is a knob of designed dynamics, not an observable of the corpus, and the same applies to diffusion time t.

## Sources considered

| result | weight | used |
|---|---|---|
| Robust vMF estimation (Springer) | 0.9215 | yes |
| vMF concentration estimation benchmark (arXiv 2111.09660) | 0.8111 | yes |
| Riemannian Langevin geometric EM (arXiv abs 2603.03626) | 0.6137 | yes |
| Fisher distribution on the rotation group (ADS) | 0.6461 | yes |
| ResearchGate vMF estimation mirror | 0.6596 | yes (mirror) |
| von Mises-Fisher Wikipedia | 0.5881 | yes (definition) |
| Concentration parameter Wikipedia | 0.5057 | yes (definition) |
| Riemannian Langevin ADS mirror | 0.4511 | weak, mirror |
| Altered Carbon Wikipedia (off topic) | 0.6977 | no |
| Riemannian Langevin PDF | 0.2758 | weak, mirror |
| arcxiv mirror (typo domain) | 0.1962 | no |
| Langevin dynamics Wikipedia | 0.1125 | weak, cited as context |
