# 05. The v4 Negative Finding: Sentence-Transformer Targets Fail

**Scope:** The v4 experiment that replaced the binary-coverage lift with native MiniLM sentence-transformer embeddings, the 4 variants tried, the effective-rank diagnosis of why they failed, and the boundary this draws around the learned-latent-curve method.

## Setup under disk constraints

v4 replaced the coverage lift Z with native 384-D embeddings from sentence-transformers/all-MiniLM-L6-v2. The install was disk-constrained: instead of the roughly 888 MB torch wheel, the fit used ONNX Runtime with the pre-converted quantized ONNX model from Xenova/all-MiniLM-L6-v2 at 22.97 MB, plus a custom WordPiece tokenizer written in pure Python with no tokenizers dependency. All 211 artifacts embedded in 7.2 seconds, about 30 per second on CPU, with every L2 norm exactly 1.0000 ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source, not jev-weighted). The model card documents the model as a 384-dimension sentence embedding model (https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2, jev weight 0.732); a community mirror of the model repo confirms the same shape (https://huggingface.co/LeoChiuu/all-MiniLM-L6-v2, jev weight 0.603).

## The sanity check passed and the fit still failed

The embedding quality was fine. The top-5 most-similar pairs were sequential versions of the same document, for example customer-roi-model-2026-07-25.md against customer-roi-model-2026-07-26.md at cosine 0.887, and the bottom-5 pairs were correctly distant. Good embeddings did not save the fit ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source).

## 4 variants, all worse than v3

| Variant | t source | Z source | k | Holdout R-squared | Mean cos |
|---|---|---|---|---|---|
| v4 | PC1+PC2 of binary coverage | MiniLM | 2 | -0.0047 | 0.540 |
| v4b | PC1+PC2 of MiniLM | MiniLM | 2 | +0.1301 | 0.617 |
| v4c | PC1+PC2 of MiniLM | MiniLM | 4 | +0.1079 | 0.607 |
| v4d | PC1+PC2 of binary coverage | MiniLM | 8 | -0.1069 | 0.496 |

([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source)

## The structural diagnosis: effective rank

The failure is structural, not a tuning problem. PC1 of the MiniLM target explains 9.55% of variance, 4x below the skill's 40% gate; PC1+PC2 reaches only 14.84%. The semantic embedding has an effective rank near 211, meaning each artifact owns its own direction in the 384-D space. The curve's parameter budget, 3,465 to 12,705 parameters, can recover only 0.016 to 0.039 of those intrinsic dimensions. The binary-coverage lift has effective rank near 9, so the same budget recovers essentially all of the structure ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source).

The effective-rank framing is the documented way to reason about how much dimensionality an embedding family actually occupies. Work on measuring intrinsic dimension of token embeddings motivates exactly this measurement (https://arxiv.org/html/2503.02142v1, jev weight 0.439, weak backing), an overview of effective rank as a dimensionality measure gives the concept (https://www.emergentmind.com/topics/effective-rank-erank, jev weight 0.529), and NLP course material on embeddings discusses the geometry these measures describe (https://lena-voita.github.io/nlp_course/word_embeddings.html, jev weight 0.612; https://inria.hal.science/hal-02919006/document, jev weight 0.710, embedding evaluation metrics).

## The boundary the negative result draws

MiniLM is the wrong target for this use case and the right target for others. If the goal is semantic search, meaning find similar yubiOS artifacts by content, then the sentence-transformer embedding is correct and the right tools are UMAP, t-SNE, or direct cosine retrieval, not the curve. The skill's "when NOT to use" line says it directly: when preserving pairwise distances is the goal, use UMAP, t-SNE, or diffusion maps, because a curve preserves order along one axis and nothing more. The v4 experiment empirically validates that heuristic ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source). Tooling docs that contrast these visualization and retrieval approaches support the boundary (https://docs.nomic.ai/atlas/embeddings-and-retrieval/guides/how-to-visualize-embeddings, jev weight 0.665).

## Weak-source notes

Low-weight dig results back no load-bearing claim here: a pricing page (jev weight 0.091), a blog (jev weight 0.124), a personal mirror repo (jev weight 0.308), and two dictionary hits triggered by query tokens (jev weights 0.024 and 0.524; the latter scores above 0.5 but is off-topic and is not cited for any claim).
