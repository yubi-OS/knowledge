# 07 - Ablation and validation plan

## Scope

The empirical gate the revised passage needs: uniform latitude-longitude sampling versus Fibonacci sampling at matched N = 64, measured on reconstruction loss, visualization RMSE, and integration error, with pass, fail, and inconclusive criteria.

## Why the ablation is the load-bearing test

The revised passage's strongest empirical claim is the phrase low-discrepancy diagnostic grid. The artifact's own 9-D coverage analysis flags that no runnable evidence for the claim exists in the file, and its cycle-1 RSI edit proposes the ablation as the highest-impact single addition. Until the ablation runs, the passage is a proposal, not a validated result.

The external literature supplies both the comparison protocol and the expected effect sizes' context. The arxiv Fibonacci-versus-latitude-longitude study is the direct precedent: it runs exactly the two-lattice comparison at matched point counts (1014 and 1001 points) and evaluates them on a concrete metric, point-counting area measurement of spherical regions (weight 0.90, https://arxiv.org/pdf/0912.4540). Its finding that the longitudinal turn between consecutive Fibonacci lattice points is the complement of the golden angle ties the lattice's geometry directly to the golden-angle constant the revised passage uses (weight 0.90). Astropy's documentation gives the structural reason the comparison matters: no grid or lattice of points on the sphere can produce equal spacing between all grid points, so any choice of lattice is a trade-off, and many approximate algorithms exist for generating angular grids with nearly even spacing (weight 0.89, https://docs.astropy.org/en/stable/coordinates/angles.html). An ablation is how a paper states which trade-off it chose and shows the chosen one wins on its own metrics.

## The metrics and criteria

The proposed ablation fixes N = 64 on both sides and measures three things. Reconstruction loss on held-out data: Fibonacci must reduce it by at least 5 percent relative to uniform latitude-longitude. Visualization RMSE: Fibonacci must reduce it by at least 10 percent. Numerical integration of the mean of |sin^3 theta e^{i3 phi}|: Fibonacci must reach error at most 1e-3 with N at most 64, where the uniform grid converges slower. Pass requires all 3 criteria; fail is any metric where Fibonacci is worse by at least 2 percent, which defers the passage patch; inconclusive is metrics within 2 percent, resolved by rerunning at N = 256 with 5 seeds.

The integration-error criterion is the one the QMC literature grounds directly. Caflisch's survey reports Monte Carlo's convergence rate O(N^{-1/2}), independent of dimension but slow, which is the motivation for deterministic low-discrepancy alternatives (weight 0.71, https://math.pku.edu.cn/teachers/litj/notes/numer_anal/MCQMC_Caflisch.pdf). The QMC-designs paper studies optimal-order QMC integration schemes on the sphere and notes that reproducing kernels with simple closed forms are useful for numerical testing of the schemes, with numerical experiments demonstrating the rates (weight 0.80, https://arxiv.org/html/1208.3267v1). A 1e-3 error target at N = 64 is an empirical convergence question, and the sphere-QMC literature is where the expected rates live.

## What the ablation does not yet prove

The proposed runner, a numpy-and-scipy script of roughly 30 lines, is described in the source artifact but has not been run; the table in the artifact's cycle-1 edit carries TBD placeholders. This doc records the plan and its grounding, not results. Any claim that Fibonacci beats uniform sampling on the paper's metrics remains unverified until the runner produces the table.

## Sources

- https://arxiv.org/pdf/0912.4540 (weight 0.90)
- https://docs.astropy.org/en/stable/coordinates/angles.html (weight 0.89)
- https://arxiv.org/html/1208.3267v1 (weight 0.80)
- https://math.pku.edu.cn/teachers/litj/notes/numer_anal/MCQMC_Caflisch.pdf (weight 0.71)
