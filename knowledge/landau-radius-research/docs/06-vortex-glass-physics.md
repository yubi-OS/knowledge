# What vortex glass actually means

> Scope: the Brito, Aranson and Chate paper behind the corpus's vortex-glass citation, how its glass differs from a superconducting vortex glass, and the exciton transition story, with the discipline of separating apparent freezing from real physics.

## The paper actually cited

The vortex-glass citation in the corpus is Brito, Aranson and Chate, Physical Review Letters 90, 068301 (2003) ([PRL DOI](https://link.aps.org/doi/10.1103/PhysRevLett.90.068301), weight 0.94; [arXiv preprint](https://arxiv.org/abs/cond-mat/0208238), weight 0.86; [archive.org copy](https://archive.org/details/arxiv-cond-mat0208238), weight 0.73). It was submitted in 2002; the research-phase record ([round-three results](https://github.com/yubi-OS/yubiOS/blob/e4be4854764f3217eaab08c01f15e62d5509e3ec/refs/wayfinder-round3-results-2026-09-13.md), program record) notes that a 2026 header in a rendered version of the paper is not its publication date.

The paper studies the normalized complex Ginzburg-Landau equation in two-dimensional oscillatory media:

```
d/dt A = A + (1 + ib) laplacian A - (1 + ic) |A|^2 A
```

Its subject is disordered, multi-spiral solutions at parameter values where the single-spiral solution is fully stable ([PRL abstract](https://link.aps.org/doi/10.1103/PhysRevLett.90.068301), weight 0.94). In the complex Ginzburg-Landau framework these states, previously believed static, actually evolve on ultra-slow timescales ([arXiv abstract](https://arxiv.org/abs/cond-mat/0208238), weight 0.86). Defect-mediated turbulence in this regime occurs in two distinct phases: a vortex liquid with normal diffusion of individual spirals, and a slowly relaxing glass.

## What the record says the paper does and does not claim

Per the research-phase record (program record):

- The paper's "glass" is a slowly rearranging multi-spiral state in deterministic, homogeneous, noiseless oscillatory media. It is distinct from a superconducting vortex glass pinned by quenched disorder.
- The paper reports possible aging-like behavior and leaves precise asymptotic characterization open.
- Its reduced vortex position and phase equations are explicitly non-variational; it supplies no universal decreasing energy for those reduced dynamics.

This last point is what makes the citation useful to the corpus: a system can be glass-like without admitting a Lyapunov function, which guards against the temptation to "prove" freezing from energy descent (compare the GL correction doc).

## The exciton transition story

The linked graphene story traces to Observation of a superfluid-to-insulator transition of bilayer excitons, Nature 650, 86-92 (2026) ([Nature article](https://www.nature.com/articles/s41586-025-09986-w), weight 0.81; [Nature PDF](https://www.nature.com/articles/s41586-025-09986-w.pdf), weight 0.61). The underlying observation is a superfluid-to-insulator transition in a dilute bilayer exciton system, driven by varying exciton density or layer imbalance ([Nature summary](https://www.nature.com/articles/s41586-025-09986-w.pdf), weight 0.61), with transport evidence reported earlier for the layer-imbalanced regime of bilayer magneto-excitons ([arXiv 2306.16995](https://arxiv.org/pdf/2306.16995), weight 0.93). The experiment works with graphene double layers separated by an ultrathin insulating spacer, mapping where the system behaves as a superfluid and where it freezes into a solid-like state ([Purdue news](https://www.physics.purdue.edu/news/2026/purdue-led-team-watches-a-frictionless-quantum-fluid-freeze-into-a-solid-like-state.html), weight 0.29, weakly backed).

The record's caution (program record): the transport evidence motivates a supersolid interpretation, but it does not directly establish simultaneous coherent superflow and density ordering, and it supplies no measured complex order parameter for the corpus's documents.

## The transferable discipline

What carries over to corpus audits is a method, not an analogy (program record):

1. Check apparent freezing across observation scales before naming it.
2. Separate dissipative from reactive dynamics; the two can freeze at different rates or not at all.
3. Do not present adaptive document edits and parameter sweeps as a physical aging experiment. The corpus's map has neither autonomous fluid evolution nor independently measured phase or amplitude, so the physical vocabulary is not earned.
