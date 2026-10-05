# 01 BGE base embeddings: the 768-dimensional cloud under the map

Scope: The BAAI bge-base-en-v1.5 embedding model: 768-dimensional BERT-based sentence embeddings, the v1.5 similarity-distribution fix, and benchmark standing.

## What the model is

The embedding cloud in a point-map placement run is produced by a sentence embedding model, and on this corpus that model is BAAI bge-base-en-v1.5. The BGE (BAAI General Embedding) v1 and v1.5 families are series of encoder-only models built on BERT (https://bge-model.com/bge/bge_v1_v1.5.html, weight 0.79). The bge-base-en-v1.5 variant uses BERT-base as its base model, with 12 encoder layers and a hidden dimension of 768, and BGE and BGE-v1.5 models of the same size share structures (https://bge-model.com/tutorial/1_Embedding/1.2.3.html, weight 0.56). A third-party summary describes the BGE base models as encoder-only transformers that convert text into fixed-length dense vector representations optimized for semantic retrieval (https://deepwiki.com/FlagOpen/FlagEmbedding/2.1-bge-base-models, weight 0.14; weak backing, treat as orientation only).

So a cloud of N texts becomes an N by 768 matrix of dense floats. That is the shape every later pipeline stage has to budget for.

## Why v1.5 exists

The v1.5 release note on the model card states the intent plainly: release the bge-*-v1.5 embedding models to alleviate the issue of the similarity distribution, and enhance retrieval ability without instruction (https://huggingface.co/BAAI/bge-base-en-v1.5, weight 0.87). The same changelog line appears in the FlagEmbedding repository (https://github.com/FlagOpen/FlagEmbedding, weight 0.86) and on the PyPI package page for FlagEmbedding (https://pypi.org/project/FlagEmbedding/, weight 0.88). The older bge-base-en card recommends switching to bge-base-en-v1.5, which has a more reasonable similarity distribution and the same method of usage (https://huggingface.co/BAAI/bge-base-en, weight 0.73).

Two practical consequences follow for a placement pipeline. First, v1.5 changes the geometry of the similarity distribution relative to v1, so clouds embedded with different BGE generations are not directly comparable. Second, v1.5 is meant to work without retrieval instructions, which simplifies embedding a static corpus of files.

## Benchmark standing

The bge-base-en-v1.5 card reports that the BGE family was the first embedding model supporting all three retrieval methods, achieving new SOTA on multi-lingual (MIRACL) and cross-lingual (MKQA) benchmarks (https://huggingface.co/BAAI/bge-base-en-v1.5, weight 0.93). The BGE v1 and v1.5 series achieved the best performance among models of the same size at the time of release, and the first group of BGE models was released in Aug 2023, with the large variants ranking first on their benchmark at that time (https://bge-model.com/bge/bge_v1_v1.5.html, weight 0.79).

## Tooling around the model

The FlagEmbedding repository ships the training and evaluation code: on 09/07/2023 the fine-tune code was updated to add a script for mining hard negatives and to support adding instruction during fine-tuning (https://github.com/FlagOpen/FlagEmbedding, weight 0.86). The same update is recorded on PyPI (https://pypi.org/project/FlagEmbedding/, weight 0.88). The card also records a 1/9/2024 release of Activation-Beacon, described as an effective, efficient, compatible, and low-cost addition (https://huggingface.co/BAAI/bge-base-en-v1.5, weight 0.93).

## What this means for a placement cloud

For a point-map pipeline the relevant facts are dimensional and structural: the output is a fixed-length dense vector per text, 768 components for the base model, produced by a 12-layer BERT encoder (https://bge-model.com/tutorial/1_Embedding/1.2.3.html, weight 0.56). An N by 768 float matrix is large enough to stress constrained runtimes, which is why later docs cover PCA projection and edge resource limits. The model itself imposes no labels: embeddings of unlabeled texts can be carried through the pipeline with labels attached only as identity keys, since the geometry, not any classifier, is what downstream placement consumes.

## Sources considered

| source | url | weight |
|---|---|---|
| BAAI/bge-base-en-v1.5 model card | https://huggingface.co/BAAI/bge-base-en-v1.5 | 0.87, 0.93 |
| BAAI/bge-base-en model card | https://huggingface.co/BAAI/bge-base-en | 0.93, 0.73 |
| FlagEmbedding GitHub | https://github.com/FlagOpen/FlagEmbedding | 0.86 |
| FlagEmbedding PyPI | https://pypi.org/project/FlagEmbedding/ | 0.88, 0.88 |
| BGE documentation, model walkthrough | https://bge-model.com/tutorial/1_Embedding/1.2.3.html | 0.56, 0.89 |
| BGE documentation, v1 and v1.5 | https://bge-model.com/bge/bge_v1_v1.5.html | 0.79 |
| DeepWiki BGE base models | https://deepwiki.com/FlagOpen/FlagEmbedding/2.1-bge-base-models | 0.14 (weak) |
| Model Database listing | https://modeldatabase.com/BAAI/bge-base-en-v1.5.html | 0.08 (weak) |
| SourceForge download page | https://sourceforge.net/projects/bge-base-en-v1-5/ | 0.05 (weak) |
