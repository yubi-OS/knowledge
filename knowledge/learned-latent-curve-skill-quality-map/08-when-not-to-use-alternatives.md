# 08 - When not to use a 1-D learned curve, and what to use instead

Scope: the explicit do-not-use list from the learned-latent-curve skill, with the alternatives and the conditions under which each wins.

## The do-not-use list

The skill refuses five situations outright:

1. Multi-dimensional data. If PCA on the feature matrix shows substantial variance spread over many components with no usable ordering, a 1-D curve discards too much. Check PCA first.
2. Encoder use cases. The curve is a corpus map for quality assessment and coverage measurement, not a general-purpose text encoder for retrieval.
3. Monotone fits. When the relationship between t and the embedding should be monotone, splines are the right basis; sinusoids oscillate by design.
4. Pairwise-distance preservation. UMAP and t-SNE exist for that, with known trade-offs: t-SNE preserves local structure while sacrificing global distances, cluster sizes, and relative sizes, and its non-convex optimization makes different runs differ [0.155, weak]; UMAP runs roughly 10 to 100 times faster and preserves global structure 2 to 3 times better than default t-SNE by Spearman correlation of pairwise distances [0.523, strong]. Survey treatments place t-SNE and UMAP as local-relationship preservers for visualization, distinct from global methods [0.875, strong].
5. When you only wanted random Fourier features or positional encoding. Those are fixed mappings that enrich inputs for an MLP [0.966, strong] or deterministic positional schemes with fixed geometric frequency progressions [0.602, weak]; a learned-frequency curve fit to targets is a different tool and overkill for that purpose.

## Sentence transformers: the larger-corpus alternative

For N above roughly 500, pretrained sentence-transformer embeddings will beat co-occurrence SVD targets, at the cost of accepting a model download. SentenceTransformers computes embeddings for text, images, audio, or video from state-of-the-art models [0.947, strong], and distillation work like Model2Vec shows how far such models can be compressed once available [0.892, strong]. At N = 62 the co-occurrence SVD route won in the application's own comparison, so the switch is a scale decision, not a quality preference [0.226, weak].

## The 2-D surface question

A 2-D learned surface gamma(t1, t2) remains the right move if the true dimensionality of skill quality is 3 or higher. In the 62-skill run, PC1 + PC2 was 40.3 percent and the 1-D curve on good targets generalized (holdout R2 +0.144, beating the 2-D surface's +0.036 on the same good targets), so intrinsic dimensionality appeared to be at most 2. The follow-up that would confirm it is a learned joint (t1, t2) projection head tested on a larger corpus.

## Decision summary

Use the 1-D learned curve when: the corpus is small (tens to low hundreds), a defensible quality-feature ordering exists, targets pass the cosine sense check, and the goal is a quality-and-coverage map rather than retrieval. Use splines for monotone structure [0.155, weak context], UMAP or t-SNE for visualization with distance caveats [0.875, strong], sentence transformers at scale [0.947, strong], and fixed Fourier features or positional encodings when the mapping need not be learned at all [0.966, strong].
