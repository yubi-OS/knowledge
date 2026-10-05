# 07. Operationalizing the Fit for Gap-Finding

**Scope:** How the v3 fit is used after training: the scalar knob t, the 3-step projection pipeline for new artifacts, the uncovered-primitive-territory query, and the pairing with content-addressed storage.

## One knob for three jobs

The point of the v3 fit is to give every yubiOS artifact a 1-D primitive-coverage breadth coordinate so that gap detection, onboarding, and ref-search share one scalar knob. The 2-D coordinate (u, v) is a tuple, but a single t is recoverable via the dominant axis or a learned projection ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source, not jev-weighted). This is the use case the ideate-solo one-pager chose: an Artifact-Primitive Coverage Curve.

## The 3-step projection pipeline

For each new artifact ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source):

1. Compute its 10-D primitive coverage vector via keyword matching on the 10 internal-big-picture primitive names.
2. Project onto the saved PC1+PC2 loadings, persisted in session/llc-v3-fit-cache.pkl.
3. Read the curve's 384-D embedding at (u, v).

Step 2 is the standard PCA transform operation: project the new vector onto the retained components from the original fit rather than recomputing PCA on the new point. The scikit-learn PCA reference documents the transform method that implements exactly this (https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html, jev weight 0.956), and community references walk through the same projection arithmetic (https://stats.stackexchange.com/questions/2592/how-to-project-a-new-vector-onto-pca-space, jev weight 0.383, weak backing).

## The gap-finding query

The most useful operational query the flow doc names: what artifacts sit at t near 0.85 with no nearby neighbors. Those coordinates are uncovered primitive territory, the corpus's own blind spots ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source). The general technique of finding sparse regions of an embedding space with nearest-neighbor distance analysis is used elsewhere: recent work detects underspecified requirements by analyzing k-nearest-neighbor structure in embedding spaces (https://arxiv.org/pdf/2603.24248, jev weight 0.403, weak backing), and satellite-embedding tutorials operationalize neighborhood analysis over an embedding collection (https://developers.google.com/earth-engine/tutorials/community/satellite-embedding-03-supervised-classification, jev weight 0.454, weak backing).

## Why the curve is not the retrieval tool

The flow doc is explicit that the curve is a coverage map, not a search index. When the goal is finding similar artifacts by content, the right tools are UMAP, t-SNE, or direct cosine retrieval on the embeddings; the curve preserves order along one axis and nothing more ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source). Tooling documentation for embedding exploration draws the same line between dimensionality-reduction views built for orientation and retrieval indexes built for lookup (https://docs.nomic.ai/atlas/embeddings-and-retrieval/guides/how-to-visualize-embeddings, jev weight 0.665), and workshop material on t-SNE and UMAP covers their use as exploratory maps (https://nbisweden.github.io/workshop-mlbiostatistics/session-DR-labs/docs/tSNE-UMAP.html, jev weight 0.618; https://cttir.github.io/tutorials/tutorials/multivariate/umap-tsne-overview.html, jev weight 0.511).

## Next step: content-addressed storage

The flow doc names the follow-on: the learned-latent-curve skill's pairing with internal-nonlex-tokens, which would store the fit artifacts (fit caches, embeddings, coverage overrides) content-addressed rather than as loose pickle files ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source). The persisted state that would move there: session/llc-v2-fit-cache.pkl, session/llc-v3-fit-cache.pkl, session/llc-v4-fit-cache.pkl, session/llc-v4-embeddings.pkl (211 x 384, all L2 norm 1.0), and session/cache/v2-corpus/manual_coverage_overrides.json.

## Weak-source notes

Off-topic and low-weight dig results in this subtopic back no claim: a Reddit hit (jev weight 0.049), a Wikipedia embedding page (jev weight 0.152), and a blog post on prompt pre-screening (jev weight 0.170).
