# 04: Coordinate robustness for the 1-D coordinate t

Scope: protecting the 1-D coordinate t obtained from upstream PCA against noise, PC1 sign flips, partial ordering, and domain shift, with confidence-weighted regression, canonical sign persistence, and ridge-residual drift detection.

## Why t robustness is the foundation

The source doc's cycle-6 hypothesis states the rationale plainly: "the 1-D coordinate is the foundation; if it's noisy, the curve is too." The Coordinate robustness subsection (added inside the Obtaining the 1-D Coordinate t section) carries 3 numbered entries covering noisy t, PC1 sign flips, and partial ordering with domain-shift detection.

## Noisy t

For noisy t from upstream PCA, the source doc names 2 mitigations: confidence-weighted regression, and a Bayesian alternative. The Bayesian wording was sharpened in cycle 7 (gap Q) to be precise about positivity: the prior is Gaussian on raw_freqs, the unconstrained pre-softplus parameters, and the implied prior on f equals softplus(raw_freqs), which is log-normal. The softplus mapping is what guarantees the fitted frequencies stay positive; putting the Gaussian prior directly on f would contradict that constraint.

## PC1 sign flips

PCA loadings have a sign ambiguity: an eigenvector and its negation both satisfy the eigenproblem, so the sign of each loading is arbitrary. The Wikipedia PCA article treats the first principal component as the direction maximizing variance, a definition that fixes the direction but not its sign (https://en.wikipedia.org/wiki/Principal_component_analysis, weak backing, jev weight 0.44). A MathWorks file exchange entry on sign correction in SVD and PCA describes resolving the ambiguity by deriving the sign from the inner product of the singular vector with the individual data vectors (https://www.mathworks.com/matlabcentral/fileexchange/22118-sign-correction-in-svd-and-pca, weak backing, jev weight 0.22).

The source doc's response is 2 protections: a canonical sign convention, and a sign-invariance check. The canonical sign vector v_canonical is persisted in the t-pipeline versioning list (added in cycle 7, gap P), so a re-fit after pipeline changes cannot silently flip signs and scramble coordinate comparisons across corpus versions. Cycle 8 added v_target, defined inline as the first feature's loading from upstream PCA, fixed at first use and persisted like v_canonical (gap U closure), and the source doc flags the residual confusion risk between the two vectors (gap W).

## Partial ordering and domain shift

When corpus items are only partially ordered, the source doc names 2 mitigations: fill-missing-by-PCA, and pairwise rank loss. The pairwise rank loss was promoted in cycle 7 (gap O) from a buried footnote to the 5th entry in the alternative architectures list, making it discoverable; cycle 8 defined its v_target symbol after the re-map found it referenced but undefined (gap U). The formula uses v_target as the known comparison direction.

Domain shift is detected by ridge residual drift: the source doc's cycle 8 added a ridge-residual-drift bullet to the Lifecycle drift signals, with explicit cross-reference to the Coordinate robustness domain-shift detector, at a threshold of more than 2x the fit-time baseline. The baseline itself had to be persisted (gap U2, closed in cycle 12) or the 2x comparison is not computable after a re-fit.

External drift literature supports the univariate-plus-multivariate split: NannyML's docs describe univariate drift as per-variable comparison of analysis chunks against a reference period, with multivariate detection for drift that only appears in feature combinations (https://nannyml.readthedocs.io/en/stable/how_it_works/multivariate_drift.html, weak backing, jev weight 0.39; https://nannyml.readthedocs.io/en/stable/tutorials/detecting_data_drift/univariate_drift_detection.html, weak backing, jev weight 0.27). The ridge residual is the variant's multivariate analogue: a single scalar that moves when the joint input distribution shifts, even when no single coordinate does.
