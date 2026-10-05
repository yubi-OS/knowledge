# 03 - The Matched Null as Vacuum: Marchenko-Pastur and Fixed-Margin Ensembles

**Scope.** The spectral anchor for the null: Marchenko-Pastur as the flat vacuum of the corpus medium, and Lyu-Mukherjee's fixed-margin ensembles as the analytic description of the curveball ensemble's spectrum.

## Marchenko-Pastur as the flat vacuum

The Marchenko-Pastur (1967) law describes the limiting eigenvalue distribution of large sample covariance matrices: for an N-by-d matrix of iid entries (with d/N held at a fixed aspect ratio), the empirical spectral measure converges to the MP density [http://galton.uchicago.edu/~lalley/Courses/383/Wigner.pdf, jev weight 0.85]. Modern tooling exposes the law directly for experimentation [https://scikit-rmt.readthedocs.io/en/stable/auto_tutorial/plot_1_spectral_laws.html, jev weight 0.80]. In the brainstorm's reading, MP is the vacuum: the ensemble with no structure at all, against which any corpus deviation is a deflection.

The source paper already performs the vacuum calibration: MP theory lands on the destroyed-dependence nulls at 0.2414 versus measured 0.2397 and 0.2398. That agreement is the numerical statement that the curveball ensemble behaves like the iid vacuum at the level the statistic sees [source document, Section 1, anchored on https://en.wikipedia.org/wiki/Marchenko%E2%80%93Pastur_distribution, jev weight 0.18, weak backing for the definition only].

## Fixed margins: the analytic spectrum of the corpus medium

Lyu and Mukherjee, "Large random matrices with given margins" (arXiv:2407.14942), prove the result the brainstorm needs: random matrices with fixed empirical marginals (columns standardized to fixed distributions) converge to a tilted iid ensemble with a variance profile, and as the margins approach constants the ensemble recovers MP [https://arxiv.org/html/2407.14942v2, jev weight 0.93; https://arxiv.org/abs/2407.14942, jev weight 0.83; https://arxiv.org/abs/2407.14942v1, jev weight 0.84].

This has a direct reading in the corpus language: standardization (the paper's Eq. 13/43, z-scores per family) fixes the marginals. The 98 percent finding (98 percent of V2 variance is marginal-fixed) then says the curveball ensemble is essentially the fixed-margin medium, whose spectrum Lyu-Mukherjee supply analytically. The residual 0.0144 in V2z is what is left after the vacuum is subtracted: the deflection angle.

- The fixed-margin theorem makes the null computable rather than merely simulated [https://arxiv.org/html/2407.14942v2, jev weight 0.93].
- The constant-margin limit recovering MP is exactly the passage from the standardized corpus null to the pure-noise null [https://arxiv.org/abs/2407.14942, jev weight 0.83].
- A secondary indexing record for the same paper exists [https://www.semanticscholar.org/paper/Large-random-matrices-with-given-margins-Lyu-Mukherjee/407c9b195716527e1, jev weight 0.25, weak backing: metadata only].

## What survives standardization is curvature

The GR analogy the brainstorm draws is structural: in lensing, deflection is only defined relative to the unlensed background. In the corpus, standardization is the coordinate change (local null z-scores) in which the medium looks flat at every point. Quantities that vanish under this change (raw V2 level) are coordinate effects; quantities that survive (Delta V2z, the Hodge directional statements, Parseval-share deviations from the null) are curvature in the differential-geometric sense. The dig corpus supports the standardization mechanism through the fixed-margin equivalence theorem above [https://arxiv.org/html/2407.14942v2, jev weight 0.93]; the GR/lensing parallel is drawn in the source document and is an analogy, not a theorem.

## Honesty constraint

The "medium" language is admitted into the map only where the spectrum is computed from the actual null ensemble. MP agreement at two null draws (0.2397, 0.2398 against theory 0.2414) is a calibration check, not a proof that every null statistic is MP-distributed. New statistics built on Delta V2z must use the empirical null quantile, per the z over-dispersion finding (sd 1.320 at s=0) carried in the source document [source document, Section 5].
