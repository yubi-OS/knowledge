# 02: The learned latent basis

Scope: the variant replaces hand-engineered binary primitive vectors with latents learned from the corpus, read out through PCA variance shares (PC1+PC2) and holdout R2, with per-item fit coordinates.

## What changed from hand-engineered primitives

The source doc's frontmatter states the core idea: the variant "replaces hand-engineered primitives with learned latents in the curve fit." In the curve-guided-rsi family, each corpus item is mapped to a point via its coverage of a primitive basis; the variant's change is that the basis is no longer fixed by hand. The latents come out of a decomposition of the corpus itself, which means the axes the audit measures are derived from what the corpus actually contains instead of from a predefined taxonomy.

## The fit-health readouts the source doc reports

The source doc records concrete fit numbers for this skill on the cycle-5 69-skill corpus (63 existing skills plus 6 from deep research: yubikey-operations, dm-verity-and-integrity, nspawn-containers, sigstore-rekor-v2, composefs-kernel-floors, audit-evidence-packaging):

- Fit coordinate for learned-latent-curve: (u=0.803, v=0.096).
- PC1+PC2 = 0.4615.
- Holdout R2 = +0.2244.

These are the two readouts the variant uses to judge a fit: how much variance the top components carry (PC1+PC2) and how well the fitted curve predicts held-out items (holdout R2). The positive but modest holdout R2 of 0.2244 on a 69-item corpus is exactly the small-sample regime the variant operates in.

## What PCA variance shares mean

The scikit-learn documentation defines the attribute behind the PC1+PC2 number: explained_variance_ratio_ is the "percentage of variance explained by each of the selected components," and when all components are stored the ratios sum to 1.0 (https://scikit-learn.org/1.0/modules/generated/sklearn.decomposition.PCA.html, authoritative backing, jev weight 0.77; https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html, authoritative backing, jev weight 0.71). PCA itself is linear dimensionality reduction via SVD of the centered data (https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html, jev weight 0.71). So PC1+PC2 = 0.4615 in the source doc means the top 2 learned latents carry 46.15 percent of the corpus variance; the remaining 53.85 percent sits in the tail components.

A weak-backed teaching source frames the general selection question: the explained variance ratio "indicates the portion of the variance that lies along each principal component," and choosing how many components to keep is the classic PCA decision (https://www.baeldung.com/cs/pca, weak backing, jev weight 0.21).

## Holdout R2 and the overfitting hazard

Nature Methods' points-to-signals column on model selection is the strongest dig backing for the holdout side: it explicitly frames the goal as choosing a model while avoiding under- and overfitting, and warns that overfitting produces misleading R-squared values (https://www.nature.com/articles/nmeth.3968, authoritative backing, jev weight 0.52). University lecture notes make the same point operationally: fit on a training split, measure on data the fit never saw (https://harvard-iacs.github.io/2021-CS109A/lectures/lecture05/, weak backing, jev weight 0.42; https://pages.stat.wisc.edu/~kdlevin/teaching/Fall2022/STAT340/lecs/L12_CV.html, weak backing, jev weight 0.30).

This is why the variant reports holdout R2 rather than in-sample R2. A curve fit on 69 items with a flexible basis can always drive in-sample error to 0; the holdout number is the only honest read of whether the learned latents generalize. The drift machinery in doc 03 and the pre-fit checks in doc 05 exist to keep that number meaningful across re-fits.

## Fit coordinates per item

Each corpus item gets a fit coordinate, the source doc reporting (u=0.803, v=0.096) for this skill. The coordinate is the item's position on the learned latent surface, and downstream consumers (the S2 lift pipeline described in doc 07) treat it as the item's address. The coordinate inherits the t-pipeline lifecycle requirements described in doc 03: persist the scaler, the PCA loadings, the rank map, and the canonical sign vector, or the coordinates are not reproducible after a re-fit.
