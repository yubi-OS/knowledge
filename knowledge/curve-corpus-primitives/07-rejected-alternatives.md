# Rejected alternatives

Scope: the four alternatives to learned-primitive corpus geometry (dense embeddings with UMAP or t-SNE, LDA topic models, fixed hand-written regex bases, and flat 2-D Fourier surfaces), the reason each loses as the audit basis, and what each keeps.

## Dense embeddings plus UMAP or t-SNE

Relation: alternative. Rejected as the audit basis; kept as a future cross-check.

The rejected pipeline is the standard one: embed each document densely, reduce to 2 dimensions with UMAP or t-SNE, inspect the scatter. The tools themselves are well-established: UMAP is a nonlinear dimensionality reduction method well suited to embedding in 2 or 3 dimensions for visualization as a scatter plot, and is used for corpus visualization directly (https://www.scikit-yb.org/en/latest/api/text/umap_vis.html, jev high 0.7852). The rejection is not about whether the maps look plausible; it is about what can be said from them.

The critique is published. A 2026 study of misuse in visual analytics finds that t-SNE and UMAP projections often do not faithfully reflect the original distances between clusters, while practitioners frequently use them to investigate distance-like questions anyway (https://arxiv.org/html/2506.08725v2, jev high 0.8067), and that misuses have passed peer review in major visualization conferences and journals, suggesting reviewers frequently overlook the importance of using dimensionality reduction appropriately (https://arxiv.org/html/2506.08725v3, jev high 0.8302). A comparison article makes the same observation informally: t-SNE tends to show tighter, more compact clusters with clearer separations than UMAP on the same data, so the impression depends on the tool (https://aicompetence.org/comparing-t-sne-and-umap/, jev low 0.3708, cited at low weight).

The corpus-geometry rejection adds the audit-specific reason: the axes of an embedding map are not nameable. A sparse region on a UMAP plot cannot be turned into a coverage pattern a human can author against, because there is no primitive list to point at. The learned basis exists precisely to keep axes nameable, which the embedding path gives up (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md). Prior art for UMAP is McInnes et al. 2018 (source doc).

## LDA topic models

Relation: alternative. Rejected.

Latent Dirichlet allocation assigns each document a distribution over topics, and it is a genuinely strong description tool. The CompareLDA paper frames the value directly: by identifying the topics that essentialize the corpus and discerning which ones predominate in a specific document, a topic model is a crucial tool for sensemaking (https://ojs.aaai.org/index.php/AAAI/article/download/4693/4571, jev high 0.9031). Comparative work continues: a 2026 comparison of bag-of-words and embedding-based topic models evaluates LDA against newer models on document distributions and interpretability, finding no single model dominates (https://link.springer.com/article/10.1007/s11192-026-05745-4, jev high 0.9093). Visualization research explores the impact of LSA and LDA models on document clustering through document-to-exemplar proximities (https://www.sandia.gov/app/uploads/sites/143/2021/10/daniel-dunlavy-2013-CrWiShDaDu13.pdf, jev high 0.6165), and feature-based Bayesian models extend LDA-style thinking to query-focused summarization (https://arxiv.org/abs/1212.2006v2, jev high 0.8172).

The rejection is representational, not empirical: topics are mixtures, so a file's position is a simplex point, not a binary pattern. Two consequences break the audit. First, a sparse region of a simplex map does not translate into "these named primitives are absent", because every document is partly about every topic. Second, the null model becomes awkward: there is no clean permutation that preserves per-topic mixture structure while destroying document-topic association, so the "is the joint pattern real" test loses its sharp form (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md). Prior art: Blei, Ng, Jordan 2003 (source doc).

## Fixed hand-written primitives

Relation: prior art and retained extension. Rejected as the default.

The original basis was 10 hand-written regexes. It is fully nameable, fully deterministic, and cheap, which is why it was the v0. It loses the default slot because it scores the corpus on the auditor's vocabulary rather than the corpus's own: a regex basis written for security vocabulary scores a reinforcement-learning harness on security vocabulary, whether or not security is what the corpus is organized around. It is retained as the house basis for cross-repo comparability when both sides of a comparison are security corpora, where the fixed axes are exactly what makes two repos comparable (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).

## Flat 2-D Fourier surface on PC1 and PC2

Relation: prior art, superseded. 

The v1 basis fit a flat 2-D Fourier surface over the PCA plane directly, skipping the stereographic lift. It was superseded by the sphere basis at matched parameter count, with ablation deltas of +0.98 and +1.34 in the first comparison and +0.74 and +0.52 in a later configuration, all in favour of the sphere. The supersession has an honesty clause: on some corpora the ablation delta is near zero, meaning the sphere is not buying anything there, and the file that reports that honestly is doing its job (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).

## What the rejections have in common

Each alternative loses on a property the audit needs, not on accuracy:

1. Embeddings lose nameability; the axes cannot become authoring instructions.
2. LDA loses the binary joint pattern; mixtures cannot carry a per-primitive absence claim.
3. Fixed regexes lose corpus fidelity; they audit the auditor's vocabulary.
4. Flat Fourier loses compactness; the fitted surface has no closed domain to tile with equal-area cells.

None of this makes the alternatives useless. Embeddings remain the future cross-check for whether the primitive geometry hides structure the dense view would show; topic models remain the description tool when the job is summarizing what a corpus is about. The corpus geometry method occupies the narrower job they leave open: prescribing where a corpus is thin and what pattern would thicken it.
