# 07 - N=2 Default and the N=3 Gates

Scope: choosing the manifold dimension: N=2 default versus N=3 gated by corpus size >= 90 items and PC3 >= 0.08, basis-function counts (16 vs 30 at L=3), and degrees-of-freedom floors in regression.

## What the dimension controls

The variant fits on S^N. N=2 is the Riemann sphere, the case where the Moebius reparameterization of doc 02 exists at all. N=3 adds a dimension of parameter manifold, more expressive basis functions, and no learned reparameterization. The choice is gated, not free: the yubiOS design record defaults to N=2 with L=3 and permits N=3 only when two conditions hold, corpus size at least 90 items and PC3 at least 0.08 (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05).

## Basis-function counts and the degrees-of-freedom floor

Spherical harmonics are functions on the sphere indexed by degree and order, and a collection of them forms a basis able to represent and reconstruct any function on the surface of the unit sphere (https://docs.dipy.org/stable/theory/sh_basis.html, weight 0.93). Per degree l on S2 there are 2l+1 orders; summing l=0 through L=3 gives 1+3+5+7 = 16 basis functions, and at S3/L=3 the count rises to 30. Both counts come from the design record's arithmetic; the per-degree structure is the standard one in the reference tables of orthonormalized spherical harmonics with the Condon-Shortley phase (https://en.wikipedia.org/wiki/Table_of_spherical_harmonics, weak backing, weight 0.22). Generative constructions of the harmonics and associated Legendre functions by degree and order are documented in the classical literature (https://dl.acm.org/doi/10.1137/0505075, weight 0.90).

The design record sets the regression floor as n_basis <= N_items / 3 (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05). The rationale is degrees of freedom: fitting 30 basis functions against fewer than 90 items leaves too few observations per parameter for a holdout evaluation to mean anything. The corpus at design time had 69 items, which passes the 16-basis S2/L=3 floor (16 <= 23) and fails the 30-basis S3/L=3 floor (30 > 23). Model-fit diagnostics follow the same logic as polynomial regression: fit the higher-order model, then check whether the simpler one is adequate (https://online.stat.psu.edu/stat462/node/158/, weight 0.77).

## The PC3 gate

The second N=3 condition is a variance condition on the corpus embedding. Principal component analysis reduces data to components ordered by explained variance, and scikit-learn exposes the fraction each component carries through its explained_variance_ratio_ attribute (https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html, weight 0.91). A scree plot displays the variance explained by each component so the cutoff dimension can be chosen against the downstream task rather than by a fixed rule (https://www.pythonpool.com/scree-plot-python/, weak backing, weight 0.11; tutorial treatment at https://statisticsglobe.com/scree-plot-pca, weak backing, weight 0.17).

The yubiOS design record requires PC3 >= 0.08 for N=3 use: a third parameter coordinate is only worth its degrees of freedom if it carries at least that share of the coverage matrix's variance. On the corpus at design time, PC1 plus PC2 summed to 0.4615, and the record expects PC3 to fall below the gate, making N=2 the principled default rather than a compromise (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05). PCA itself is the standard linear dimensionality reduction by singular value decomposition, with components ordered by preserved variance (https://en.wikipedia.org/wiki/Principal_component_analysis, weak backing, weight 0.19).

## Why gate instead of generalize

A third dimension costs in three places at once: more basis functions against a fixed item count (the DoF floor), a coordinate whose variance may be near-noise (the PC3 gate), and the loss of the Moebius mechanism, since PSL(2,C) does not act on S3 (doc 02). The design record's position is that N=3 should be earned by data, not assumed; when the corpus grows past 90 items and PC3 rises above 0.08, the N=3 fit uses the Laplace-Beltrami spectrum alone (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05). Until then, the S2 default keeps every verification metric in the stack interpretable on the same manifold.
