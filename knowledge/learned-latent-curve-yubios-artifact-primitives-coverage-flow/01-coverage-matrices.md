# 01. Building the 9-D Primitive Coverage Matrix

**Scope:** Building the 9-D binary primitive coverage matrix that became the basis for the learned-latent-curve t coordinate: the 10 internal-big-picture primitives, keyword dictionaries per artifact, dropping the collapsed self-describing column, and the binary versus graded variants.

## The 10 primitives

The primitive vocabulary comes from the internal-big-picture skill, which models yubiOS across 10 primitives: attestation, trust chain, least privilege, declarative policy, continuous and adaptive monitoring, immutability, audit and evidence, cryptographic identity, segmentation, and self-describing. Every artifact in the corpus (skills, refs docs, workflows, ADRs) is scored against these 10 primitives ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source, not jev-weighted).

## From primitives to a binary matrix

The v2 fit built a coverage matrix C in {0,1}^{213 x 10}: one row per artifact, one column per primitive. Each column is backed by a keyword dictionary built by parsing the 10 primitive names, so an artifact covers a primitive if its text matches the dictionary. The matrix is the input to everything downstream: the t coordinate, the lift to 384-D, and the fit itself ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source).

The decisive preprocessing step was dropping the self-describing column. It covered 94% of the corpus, so it carried almost no variance and collapsed the spread PCA needs. With it removed the matrix is 9-D, and that 9-D binary basis is what v2 and v3 fit against ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source).

## Why binary features suit PCA here

PCA on binary indicator data is a known technique with known behavior. A pedagogical treatment of PCA applied to a binary table shows that binary rows project into the same low-dimensional space and that variance concentrates in a handful of components when columns are highly correlated (https://pca4ds.github.io/analysis-of-a-binary-table.html, jev weight 0.718). Research on dimensionality reduction for binary data through PCA-style projections likewise treats a binary matrix as a legitimate PCA target and derives how much variance its leading components retain (https://www.sciencedirect.com/science/article/pii/S0047259X20302499, jev weight 0.950). The broader robust PCA literature starts from the same premise: an observed matrix has a low-rank structure worth extracting (https://arxiv.org/abs/0912.3599, jev weight 0.774).

The scikit-learn PCA documentation defines the explained_variance_ratio_ attribute that the yubiOS gates read when deciding how many components to keep (https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html, jev weight 0.956).

## Binary versus graded variants

The v2 fit tried 3 t-pipeline variants: A (binary coverage, self-describing dropped), B and C (graded counts, self-describing dropped). Variants A and C produced the best holdout metrics, but only A passed the holdout gate without overfitting. B and C "passed" the PC1 heuristic and then catastrophically overfit with holdout R-squared of -2.4 ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source). The lesson recorded in the corpus: binarize the coverage, drop the saturated column, and validate on holdout rather than on the explained-variance heuristic alone.

## Weak-source notes

Two results in this subtopic's dig scored below the 0.5 authority threshold and are labeled weak backing: a generic GeeksforGeeks PCA overview (https://www.geeksforgeeks.org/data-analysis/principal-component-analysis-pca.html, jev weight 0.198) and a Stack Overflow Q&A on explained variance (https://stackoverflow.com/questions/57293716/sklearn-pca-explained-variance-and-explained-variance-ratio, jev weight 0.075). No load-bearing claim in this doc relies on them. One search hit was entirely off-topic (a cigar retailer, jev weight 0.356) and is recorded in the archive only as evidence the query drifted.
