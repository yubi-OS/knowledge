# Stated-rule binarization of continuous vectors

**Scope:** Binarizing continuous vectors under a stated rule: median splits, quantile thresholds, sign rules, and why the rule must be pinned for comparability. The map's default rule R0 takes the top-d principal directions of the centered cloud and thresholds each coordinate at its per-column median; this doc grounds the statistics of that move.

## Design context

The map accepts continuous input (embeddings, PCA scores, raw feature rows) and must turn it into an N-by-d binary matrix before placement and null sampling can run. The compass constraint under study states that continuous data must be binarized under a stated rule, and the rule object itself is hashed into the artifact so two maps are comparable only under the same rule. This doc reviews what the statistics literature says about median splits and about PCA dimensionality reduction, the two operations R0 chains.

## Median splits: what the literature warns about

The median split dichotomizes a continuous variable at its middle value. The classic warning is that it throws away information. A researcher-oriented guide to regression, discretization, and median splits analyzes the costs: dichotomizing a continuous predictor reduces explained variance and statistical power relative to keeping the variable continuous [https://www.sciencedirect.com/science/article/pii/S1057740815000406, weight 0.82]. A best-practices paper on median splits and artificial categorization reaches the same conclusion and recommends avoiding artificial categorization of continuous variables in most analysis contexts [https://journals.sagepub.com/doi/pdf/10.5127/jep.008310, weight 0.88].

A statistics teaching page from the University of Texas makes the operational point constructively: dividing a continuous variable into categories is sometimes necessary for a design, but the cut point must be chosen and stated before analysis, not tuned afterward [https://web.ma.utexas.edu/users/mks/statmistakes/dividingcontinuousintocategories.html, weight 0.52]. That is precisely the role of R0 in the map: the rule (d, axes, medians) is fixed, hashed, and reported before any placement or null sampling runs, so no analysis decision can silently re-tune the cut points.

The critique cuts both ways for the map. R0 does not use the binarized data to estimate a continuous effect; it uses the binary matrix as a combinatorial state space whose fibre has known structure. The median split's defect (information loss for effect estimation) is not the failure mode that matters here. The defect that does matter is margin determinism: per-column medians fix every column sum at ceil(N/2), which changes the null fibre the map samples. Two different binarization rules therefore define two different null spaces, and this is why the rule hash, not just the seed, is part of map identity.

## Variants: quantile and sign rules

A per-column quantile rule at q other than 0.5 trades column margin for asymmetry control: at q = 0.75, three quarters of the rows carry the 1 bit on that column. The median-split literature covers arbitrary cut points as "discretization into categories" and shows the same power loss, monotone in how coarse the split is [https://www.sciencedirect.com/science/article/pii/S1057740815000406, weight 0.82]. A sign rule (bit = sign of the coordinate) is the natural choice for embeddings whose coordinates are already centered at zero, and it avoids the median re-estimation that makes the rule hash unstable across corpus edits; the published median-split literature does not evaluate sign rules directly, so the choice between median and sign rules is an open design question in the map spec, to be settled by comparing null behavior on a fixed corpus.

## PCA: the axis choice

R0's axes are the top-d principal directions of the centered cloud. PCA finds orthogonal directions that successively maximize variance of the projection, and the standard derivation via the covariance matrix eigendecomposition is given in Stanford's CS229 lecture notes on PCA [https://cs229.stanford.edu/notes2021fall/lecture14-pca.pdf, weight 0.93]. A peer-reviewed review of dimensionality reduction via PCA describes the same construction and its use to project high-dimensional data onto a small number of components [https://www.sciencedirect.com/science/article/pii/S1877050919321507, weight 0.92].

Two properties matter for the map. First, PCA axes are data-dependent: they re-derive whenever the corpus changes, so the binarization rule's hash changes with them. Second, PCA is unsupervised and order-preserving in variance: the first component carries the largest variance, and truncating at d components discards the residual subspace. A Berkeley statistics research overview positions PCA as the default high-dimensional data analysis tool for exactly this projection role [https://statistics.berkeley.edu/research/high-dimensional-data-analysis, weight 0.68]. A practical Python implementation guide walks the fit-transform-truncate sequence the map's implementation mirrors [https://www.geeksforgeeks.org/machine-learning/reduce-data-dimentionality-using-pca-python/, weight 0.77].

## What binarization must state

Three requirements survive:

1. The cut rule must be stated and fixed before measurement; post-hoc cut selection is the documented failure mode of median splits [https://web.ma.utexas.edu/users/mks/statmistakes/dividingcontinuousintocategories.html, weight 0.52].
2. Dichotomization costs information and power for effect estimation, so the binarized matrix should be treated as a state space for combinatorial measurement, not as a lossy summary of the data [https://journals.sagepub.com/doi/pdf/10.5127/jep.008310, weight 0.88].
3. PCA axes are data-dependent and must be recorded with the rule, since they determine both the bits and the later placement step [https://cs229.stanford.edu/notes2021fall/lecture14-pca.pdf, weight 0.93].

## Sources considered

| Source | Weight |
|---|---|
| Best practices for median splits (Sage) | 0.88 |
| Regression, discretization, and median splits (ScienceDirect) | 0.82 |
| CS229 PCA lecture notes, Stanford | 0.93 |
| Data dimensional reduction and PCA, Procedia Computer Science | 0.92 |
| Reduce data dimensionality using PCA, GeeksforGeeks | 0.77 |
| High dimensional data analysis, UC Berkeley Statistics | 0.68 |
| Dividing a continuous variable into categories, UT Austin | 0.52 |
| The trouble with median splits, The Analysis Factor | 0.45 |
| A researcher's guide (alternate mirror), Wiley | 0.42 |
| Dimensionality reduction techniques, GeeksforGeeks | 0.08 |
| Median, Wikipedia | 0.14 |
| Principal component analysis, Wikipedia | 0.10 |
