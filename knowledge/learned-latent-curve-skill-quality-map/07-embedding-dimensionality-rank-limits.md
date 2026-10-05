# 07 - Embedding dimensionality and rank limits when lifting to 384-D

Scope: the arithmetic constraints that govern a 60-D-to-384-D lift of SVD targets on a 62-item corpus, and how whitening and normalization interact with them.

## The rank ceiling

The application's target matrices are built as: SVD to rank 60, then a seeded orthonormal projection (QR of a random 384 x 60 matrix) mapping the 60-D basis into 384 dimensions, then L2 normalization. The output occupies 384 coordinates but carries at most 60 effective dimensions, because a linear map cannot increase rank. With N = 62 items, the document-by-embedding matrix has algebraic rank at most 61 regardless of D; the effective rank, a real-valued measure of effective dimensionality computed from the singular value spectrum, is the honest measure of how much information the embedding carries [0.725, strong] [0.880, strong]. Singular values are the standard instrument for determining effective rank, including detecting rank deficiency that rounding error hides [0.831, strong], and precision effects on small singular values matter when the matrix is near-rank-deficient [0.835, strong].

The anti-pattern is therefore concrete: claiming 384-D embeddings from linear maps of N items is false whenever N - 1 < 384, which at N = 62 means the true representational ceiling is 61. The D = 384 target exists to interface with downstream consumers expecting that width, not to add information.

## Random projections preserve what exists

The QR lift is a random orthonormal projection, the same family the Johnson-Lindenstrauss lemma covers: points in high-dimensional space can be embedded in lower dimension with controlled distortion of pairwise distances [0.793, strong] [0.670, strong] [0.201, weak]. Here the direction of application is reversed, expanding a 60-D basis to 384 coordinates, but the guarantee has the same shape: an orthonormal projection is an isometry on the subspace it acts on, so pairwise cosines among the 60-D vectors are preserved exactly up to the subsequent L2 normalization. Nothing is lost and nothing is invented by the lift.

This is why the sense check can be run on the final 384-D targets with confidence: if cosine structure is absent after the lift, it was already absent before it.

## Whitening and normalization

Attempt 1 whitened the 60-D SVD space before the lift. Whitening equalizes variance across directions, which is defensible for downstream classifiers but interacts badly with L2 normalization on near-rank-deficient data: directions with tiny singular values get amplified to unit scale, injecting variance where there was none. The failed pipeline's near-orthogonal pairwise cosines (docker-build-push-action to docker-bake-action approximately 0) are consistent with that interaction dominating the real signal.

Attempt 2 dropped whitening in favor of sqrt(S_r) singular-value weighting (the ppmi-lite trick), which down-weights weak directions proportionally instead of amplifying them, and applied L2 normalization only at the document level, after averaging word vectors.

## Practical bounds for small corpora

For a corpus of N documents: keep the SVD truncation rank r comfortably below N - 1; prefer sqrt-singular-value weighting to whitening; treat the width D of the final embedding as an interface constant, not a capacity claim; and verify effective rank from the singular spectrum if the width claim matters downstream [0.072, weak]. The Johnson-Lindenstrauss distortion bounds matter when compressing, not when expanding; expansion via orthonormal projection is lossless [0.142, weak].
