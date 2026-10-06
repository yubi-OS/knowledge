# 03. The fit-quality gate: PC1+PC2 concentration and the atomicity diagnostic

Scope: The PC1+PC2 >= 0.40 concentration gate: any principal-component fit used for scoring must clear the explained-variance floor or it is not used, plus the cheap atomicity diagnostic that checks the measurement basis carries information before derived scores are trusted.

## What PCA provides

Principal component analysis is a technique for analyzing datasets with many dimensions per observation, increasing interpretability while preserving as much variance as possible (source: https://en.wikipedia.org/wiki/Principal_component_analysis, jev weight 0.81). The components are orthogonal, and the first ones capture the maximum variance in the data (source: https://builtin.com/data-science/step-step-explanation-principal-component-analysis, jev weight 0.30, weak). Stanford's STATS 202 notes formalize the derivation as an optimization problem: the first principal component is the direction of maximal variance, and the second is orthogonal to it (source: https://web.stanford.edu/class/stats202//notes/Unsupervised/PCA.html, jev weight 0.80).

The fit-quality currency is explained variance. It defines the amount of information captured by the retained principal components (source: https://www.geeksforgeeks.org/machine-learning/reduce-data-dimentionality-using-pca-python/, jev weight 0.67), computed from eigenvectors and eigenvalues of the covariance matrix (source: https://www.geeksforgeeks.org/data-analysis/principal-component-analysis-pca/, jev weight 0.28, weak).

## Conventional thresholds, and why the gate is different

Standard practice selects components by a cumulative explained-variance target, often a threshold like 95 percent (source: https://fastercapital.com/content/Explained-Variance--Explained-Variance--Measuring-PCA-s-Effectiveness.html, jev weight 0.04, weak) or, in the scikit-learn idiom, choosing the smallest k so that 99 percent of variance is retained (source: https://stackoverflow.com/questions/32857029/python-scikit-learn-pca-explained-variance-ratio-cutoff, jev weight 0.06, weak). Those sources are weakly weighted, but the practice they describe is textbook.

The loop's gate inverts the direction of the rule. PC1+PC2 >= 0.40 is a floor, not a target: if the top 2 components of a fit concentrate less than 40 percent of the variance, the fit is not used for scoring at all. The distinction matters. A cumulative target asks how many components to keep. A floor asks whether the fit deserves to exist as a scoring instrument. A flat, unstructured basis (components each carrying roughly equal variance) produces a fit that looks like a curve fit but measures nothing in particular; the floor rejects it before it can generate scores.

## The atomicity diagnostic

Before trusting any derived score, the map requires a cheap check that the measurement basis itself carries information. This is the atomicity diagnostic, and it is deliberately cheaper than the full gate: it runs before derived scores are computed, not after. The analogy in the PCA literature is checking the correlation structure before interpreting components; an algebraic treatment even ties this to the determinant of the correlation matrix, whose maximum value is bounded by the number of dimensions (source: https://towardsdatascience.com/pca-102-should-you-use-pca-how-many-components-to-use-how-to-interpret-them-da0c8e3b11f0/, jev weight 0.19, weak). Factor-analytic practice makes the same move from the other side: reduce data to a smaller set of underlying summary variables only when such structure exists (source: https://en.wikiversity.org/wiki/Exploratory_factor_analysis, jev weight 0.22, weak).

Concretely, in the loop's context: if the 9-D primitive coverage vector for a corpus item is nearly uniform, a PCA over many such vectors will spread variance evenly across components, the PC1+PC2 sum will fall below 0.40, and any "geodesic distance to the ideal pole" derived from that fit is noise. The gate plus the diagnostic catch this at two stages: the diagnostic catches an uninformative basis before scores exist, and the gate catches a weak fit before scores are used.

## Placement in the invariant stack

The gate is an identity-class check, not a judgment call: it is assertable in code (compute the top 2 explained-variance ratios, compare to 0.40) and belongs on the machine-checked side of the identity-measurement boundary from doc 02. What remains a judgment is which corpus artifacts to audit next, and that is driven by the sparse-cell lens in doc 07, which needs a trustworthy fit precisely because sphere placements derived from an untrustworthy fit would misidentify which cells are sparse.
