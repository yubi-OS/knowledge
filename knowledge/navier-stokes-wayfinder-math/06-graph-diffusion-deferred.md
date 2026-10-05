# Equation E: optional graph diffusion and why it stays deferred

Scope: the symmetric graph-diffusion extension with its energy identity and explicit-Euler stability bounds, and the standing reason it is deferred rather than shipped.

## The construction

A legitimate optional extension of the wayfinding graph is symmetric diffusion. With symmetric weight matrix `W`, degree matrix `D`, and graph Laplacian `L = D - W`, define the field dynamics `du/dt = -nu L u`. The energy identity is then:

`d/dt (1/2 ||u||_2^2) = -nu u^T L u = -(nu/2) sum_ij w_ij (u_i - u_j)^2 <= 0`

The last inequality needs two structural facts: `W` must be symmetric with nonnegative weights, and `L` must be symmetric positive semidefinite. Under those conditions constant fields are fixed and total mass is conserved. This is the standard diffusion-on-a-graph picture: the Laplacian generates a smoothing semigroup that dissipates the Dirichlet energy by penalizing differences across edges (Laplace operator, https://en.wikipedia.org/wiki/Laplace_operator, weight 0.83; graph Laplacian lecture notes, https://ian-tan.github.io/Graph_Laplacian.pdf, weight 0.61; diffusion on a graph course notes, https://www.math.fsu.edu/~bertram/lectures/Diffusion.pdf, weight 0.66). Recent numerical work designs diffusion schemes specifically so this energy dissipation is preserved under discretization (https://oadoi.org/10.1016/j.camwa.2023.12.006, weight 0.91).

## Discrete-time stability

For explicit Euler stepping with step size `h`, two sufficient bounds hold:

1. Maximum principle: `h nu max_i sum_j w_ij <= 1`.
2. Energy nonincrease: `h nu lambda_max(L) <= 2`.

The eigenvalue bound is the standard explicit-Euler stability condition for a linear system with known spectral radius (numerical stability notes, https://faculty.washington.edu/finlayso/ebook/pde/general/stability.htm, weight 0.57; finite-difference stiffness and stability teaching material, https://uclnatsci.github.io/2022/NSCI0011/fdiff/ivp/stability.html, weak, weight 0.36; explicit Euler stability analysis, https://www.researchgate.net/publication/229784173_The_Stability_of_Explicit_Euler_Time-Integration, weak, weight 0.27).

One warning transfers straight from the continuous statement: merely showing that the old maximum decreases does not rule out an overshoot below the old minimum. The maximum principle bound above is what closes that hole, which is why both bounds are stated rather than one.

## Why it is deferred

Diffusion requires an explicitly defined field `u` and a reason to smooth it. Neither exists yet in the edit pipeline. The current spherical harmonic heat summaries already supply part of this territory. A new smoothed-density ranking would need its own matched-null admission test and a held-out benefit test before replacing anything. It remains deferred (internal research record).

The parts of the fluid analogy that do not carry are explicit: velocity, pressure, incompressibility, vortex stretching, and singularity dynamics have no defined role in the present edit pipeline. This mirrors the general adoption gate from the external-claim verification: formal similarity of an equation is not a reason to ship a mechanism whose quantities do not exist in the target system.

## Sources considered

| source | weight |
|---|---|
| https://oadoi.org/10.1016/j.camwa.2023.12.006 | 0.91 |
| https://en.wikipedia.org/wiki/Laplace_operator | 0.83 |
| https://www.merriam-webster.com/dictionary/explicit | 0.77 (weak relevance, off-topic) |
| http://www.scholarpedia.org/article/Yarkovsky_and_YORP_effects | 0.73 (weak relevance, off-topic) |
| https://www.math.fsu.edu/~bertram/lectures/Diffusion.pdf | 0.66 |
| https://ian-tan.github.io/Graph_Laplacian.pdf | 0.61 |
| https://faculty.washington.edu/finlayso/ebook/pde/general/stability.htm | 0.57 |
| https://uclnatsci.github.io/2022/NSCI0011/fdiff/ivp/stability.html | 0.36 (weak) |
| https://declanoller.github.io/laplacian_basics_and_diffusion | 0.16 (weak) |
| https://www.researchgate.net/publication/229784173_The_Stability_of_Explicit_Euler_Time-Integration | 0.27 (weak) |
| https://www.bohrium.com/en/sciencepedia/feynman/computational_physics_undergraduate | 0.07 (weak) |
| https://www.desmos.com/calculator | 0.04 (weak, off-topic) |
