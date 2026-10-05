# 04 Null models for binary clouds: curveball and fixed-marginal testing

Scope: The curveball algorithm and fixed-marginal null models for binary co-occurrence matrices, and z-score significance testing.

## The null model setup

Once a cloud of N items has been binarized into attributes, the pipeline needs to know whether an observed statistic is surprising. The classical setting for this question is a binary presence-absence matrix: the entries represent presence (1) or absence (0) of a particular species in a particular site, rows represent species or taxa, and columns represent sites or samples (https://cran.r-project.org/web/packages/SESraster/vignettes/null-models.html, weight 0.81). A point-map cloud maps onto the same shape: rows are items, columns are latent attributes after binarization, and the statistic of interest plays the role of a co-occurrence measure.

A null model randomizes the matrix while holding chosen structure fixed, then compares the observed statistic against the distribution of statistics over the randomized matrices. The comparison is usually a z-score or standardized effect size: test for non-random structure by comparing the observed score against a null distribution and standardizing it (https://tidyecology.com/posts/co-occurrence-null-models/, weight 0.52).

## The curveball algorithm

The curveball algorithm is a fast and unbiased procedure to randomize ecological binary matrices with fixed row and column totals (https://www.nature.com/articles/ncomms5114, weight 0.80). In the fixed-fixed (or quasiswap-style) family, both row and column sums are preserved, so each null draw has exactly the same marginal structure as the observed matrix and differs only in which cells carry the 1s (https://tidyecology.com/posts/co-occurrence-null-models/, weight 0.52). A later survey of sampling methods states that when several algorithms for sampling binary matrices with fixed row and column marginals are compared, curveball is the fastest that has been proposed (https://arxiv.org/html/2112.04017v1, weight 0.81).

The mechanism, as described in secondary literature: the curveball family preserves row and column sums exactly while randomizing entries, operating as a heat-bath variant of switch chains that samples from the space of matrices with fixed marginals (https://www.emergentmind.com/topics/margin-preserving-curveball-null, weight 0.11; weak backing, secondary source). Speed matters because a null distribution needs many draws: a K of 40 to 60 draws per statistic is the kind of budget where an algorithm that is unbiased and fast pays off.

## Statistics tested against the null

The co-occurrence literature supplies the metric vocabulary. The C-score of Stone and Roberts measures the average degree of spatial segregation between species pairs in a presence-absence matrix; for each unique pair of species it is calculated as C_ij = (R_i - S)(R_j - S), where R_i and R_j are the row sums for the two species and S is the number of shared sites in which both are present, and compared against a fixed-fixed null model that preserves both row and column sums (https://rdrr.io/cran/EcoSimR/man/c_score.html, weight 0.83; https://metricgate.com/docs/c-score-co-occurrence-null/, weight 0.25; weak backing for the second link). A placement pipeline replaces the C-score with its own concentration statistic but keeps the same inferential shape: observed value, null mean, null standard deviation, and a z-score of the difference.

Generalizations exist: a categorical curveball randomization (curvecat in the nullcat package) reduces to the original binary curveball algorithm of Strona et al. 2014 when there are only two categories, applied to a 0/1 matrix (https://rdrr.io/cran/nullcat/man/curvecat.html, weight 0.17; weak backing).

## Admissibility and what a z-score does not say

Two practical rules carry over from the ecological usage. First, a null model must be unbiased with respect to the statistic under test, which is the property curveball was validated for (https://www.nature.com/articles/ncomms5114, weight 0.80). Second, a null whose variance collapses to nearly zero makes the z-score meaningless; the null spread has to be wide enough that the comparison measures structure rather than numerical noise. A placement pipeline therefore records the null mean, the null standard deviation, and the z-score together, and treats a degenerate null as grounds to distrust the verdict rather than grounds to celebrate a large z.

The z-score itself is only a standardized distance from the null mean; deciding exclusion or inclusion against a bar is a separate, stated decision rule, and one cloud with one seed is one test, not a general verdict about a binarization rule.

## Sources considered

| source | url | weight |
|---|---|---|
| Nature Communications, curveball algorithm | https://www.nature.com/articles/ncomms5114 | 0.80 |
| arXiv fastball survey | https://arxiv.org/html/2112.04017v1 | 0.81 |
| SESraster null model algorithms vignette | https://cran.r-project.org/web/packages/SESraster/vignettes/null-models.html | 0.81 |
| EcoSimR c_score documentation | https://rdrr.io/cran/EcoSimR/man/c_score.html | 0.83 |
| Tidy Ecology co-occurrence null models | https://tidyecology.com/posts/co-occurrence-null-models/ | 0.52 |
| MetricGate C-score null calculator | https://metricgate.com/docs/c-score-co-occurrence-null/ | 0.25 (weak) |
| Glasgow R code page | https://userweb.eng.gla.ac.uk/umer.ijaz/bioinformatics/ecological.html | 0.34 (weak) |
| nullcat curvecat documentation | https://rdrr.io/cran/nullcat/man/curvecat.html | 0.17 (weak) |
| EmergentMind margin-preserving curveball null | https://www.emergentmind.com/topics/margin-preserving-curveball-null | 0.11 (weak) |
| Engineering.com Curveball game (off-topic hit) | https://www.engineering.com/games/curveball/ | 0.06 (weak, off-topic) |
| Omni Calculator math tools (off-topic hit) | https://www.omnicalculator.com/math | 0.72 (weak, off-topic) |
| HandWiki epidemiology (off-topic hit) | https://handwiki.org/wiki/Social:Epidemiology | 0.09 (weak, off-topic) |
