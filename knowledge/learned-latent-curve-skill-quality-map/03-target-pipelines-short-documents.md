# 03 - Target pipelines for short-document corpora: TF-IDF noise versus co-occurrence SVD structure

Scope: how to build the 384-D vectors a curve is fit against when the corpus has tens to low hundreds of documents, using the failed and successful pipelines from the 62-skill application as the worked example.

## The failed pipeline: TF-IDF + truncated SVD + QR lift

Attempt 1 built targets from word TF-IDF (vocabulary 4377, min_df 2) stacked with a length-4-or-more word block, L2-normalized, truncated to SVD rank 60 with whitening, then lifted to 384 dimensions with a seeded orthonormal QR projection of a random 384 x 60 matrix.

Truncated SVD on TF-IDF matrices is the textbook latent-semantic-analysis construction and is exactly what scikit-learn documents it for [0.957, strong]. TF-IDF remains a defensible keyword-level representation, with well-understood formula, variants, and similarity behavior [0.757, strong], and TF-IDF + SVD compression into topic-like dimensions is a recognized retrieval-engineering baseline [0.606, strong].

The failure was not in the ingredients. It was in the composition on a tiny corpus: after L2 normalization and the SVD-then-QR lift, pairwise cosines between obviously related skills collapsed toward zero. docker-build-push-action and docker-bake-action measured approximately 0 cosine; so did arm-trusted-firmware-optee and ftpm-optee-tpm, two documents about the same OP-TEE stack. The targets were noise, and a curve fit against noise reproduces noise: holdout R2 was -0.139 with holdout cosine -0.093.

## The passed pipeline: co-occurrence SVD word embeddings

Attempt 2 replaced the document-level TF-IDF stack with word embeddings from a window-5 word co-occurrence matrix (vocabulary 1686 after a document-frequency filter of df in [5, 0.85 N], float32 to control memory), weighted 1/distance and symmetrized, then SVD rank 60 with singular vectors weighted by sqrt(S_r) (the ppmi-lite trick). Each document's embedding is the L2-normalized mean of its words' SVD vectors, lifted to 384-D with the same seeded QR projection.

Building word vectors from a word-word co-occurrence matrix and running SVD is the classic count-based construction [0.790, strong] [0.704, strong] [0.636, strong], and normalized co-occurrence-plus-SVD embeddings are an established tool [0.615, strong].

The sense check told the opposite story this time. On the same 62 items: docker-build-push-action to docker-bake-action cosine +0.971, arm-trusted-firmware-optee to ftpm-optee-tpm +0.929, context-isolation to context-engineering +0.854, while github-actions to linkedin-browser-outreach sat at +0.437. Real semantic structure survived into the targets, and the same 1-D curve that failed on TF-IDF targets reached holdout R2 = +0.144 and cosine +0.817.

## The diagnostic that separates the two

A 4-line pairwise-cosine sense check on obviously similar and obviously distant document pairs is the cheapest reliable test of whether a target pipeline is usable. Do it before any curve fitting. If near-neighbor pairs are near-orthogonal, no downstream model will rescue the run; rebuild the target layer.

## Small-corpus caution

With N = 62 documents, a 60-rank SVD basis is already close to the rank ceiling of N - 1 = 61. The co-occurrence construction helps because word co-occurrence statistics (a 1686-word vocabulary with window aggregation) provide more statistical structure to factorize than 62 document vectors do. The lesson for the 50 to 200 document regime: factorize at the word co-occurrence level, aggregate to documents, and verify with the cosine sense check.
