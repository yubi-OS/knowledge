# 09: The compass as zero-temperature Langevin, and what diffusion buys

Scope: source doc findings F11 and F12: the compass atom as the T-to-0 limit of sphere Langevin with von Mises-Fisher stationary families, and the four purchases of the diffusion machinery.

Grounding spine: [source doc](file://yubi-OS/yubiOS playbooks/lensing-question-space.md), 2026-08-13, sections F11 and F12.

## F11: Langevin on the sphere

The source doc writes the Riemannian Langevin SDE dX = -grad_g Phi(X) dt + sqrt(2T) dB on S2 with stationary density proportional to exp(-Phi(x)/T), and claims (source doc):

1. The compass's pi_T(k) proportional to C(9,k) exp(-Phi(k)/T) is the k-shell marginal of the sphere Langevin with an exchangeable potential.
2. T to 0 recovers greedy geodesic descent, matching the paper's T-to-0 verification.
3. One Euler-Maruyama step on the sphere is slerp toward the pole plus tangential noise: slerp is the deterministic half of the diffusion step, which is the precise sense in which interpolation on the hypersphere creates diffusion.
4. The natural stationary families are von Mises-Fisher, proportional to exp(kappa mu.x): the sphere's Gaussians, with kappa the concentration knob, kappa about 1/T. The two-population mixture family M4 becomes a 2-component vMF mixture on S2.

The dig backs the machinery: Langevin dynamics is the standard stochastic model of the form the source doc uses ([en.wikipedia.org/wiki/Langevin_dynamics](https://en.wikipedia.org/wiki/Langevin_dynamics), weight 0.51, weak), and a 2026 paper proves strong convergence of the geometric Euler-Maruyama scheme on Riemannian manifolds, the exact discretization family claimed in point 3 ([arxiv.org/abs/2603.03626](https://arxiv.org/abs/2603.03626), weight 0.57). Points 1, 2 and 4 are internal identifications with the is-this-x paper's own verification record and stand on the source doc.

## F12: the four purchases

1. Scale-space channel: diffuse corpus and matched null with the same t; a signal is diffusion-stable at scale t if its null-standardized z survives. Features that die at small t are texture, features that survive are structure, with the over-dispersion caveat inherited: empirical null quantiles only (source doc).
2. Standard-candle generator v2: train an RSGM on the Fibonacci-lattice corpus points; reverse trajectories synthesize corpora between the null and the data; reference families become checkpoints along diffusion time (source doc).
3. The SLERP fold: replace the amplitude ladder s = 0.25 to 2 with geodesic rungs slerp(p0, p*; t_k) on a constant-ratio grid; same fold-slope statistic, same empirical null-ladder quantile, but the rungs are intrinsic to the sphere and compose with F5's achromatic coordinates (source doc).
4. Unification with transport, closing Part I gap F: the Schrodinger bridge between null and corpus measures interpolates between entropic diffusion (T above 0) and Benamou-Brenier optimal transport (T to 0), with T as the knob the compass already swept; T_x = 0.0411 was measured on the k-marginal, the sphere version has its own crossover to find (source doc).

The dig backs purchase 4's anchor literature: the Schrodinger bridge problem as entropic optimal transport with neural solvers for generative modelling ([arxiv.org/abs/2306.10161](https://arxiv.org/abs/2306.10161), weight 0.62), stability of entropic OT ([sciencedirect.com S0022123622002427](https://www.sciencedirect.com/science/article/pii/S0022123622002427), weight 0.84), and accessible derivations of the EOT objective ([simoncoste.gitlab.io transport chapter](https://simoncoste.gitlab.io/transport/chapters/schrodinger/), weight 0.58, weak; [hal.science hal-04673273v2](https://hal.science/hal-04673273v2), weight 0.64).

## Weak-backing warning

The Erwin Schrodinger biography hit (0.64) is a name collision, not a source. The Tesla-charging and Reddit hits are noise, recorded in the archive only.
