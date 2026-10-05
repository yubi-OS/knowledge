# 07 - Primitive feature bases for corpus mapping

Scope: how corpus items are mapped to binary feature or primitive vectors, how a basis can be grounded in a generative model's tiers, and what makes a basis replaceable.

## Binary feature vectors as a representation layer

Representing items as binary feature vectors is one of the most common pattern representations, with similarity and distance measures operating directly on the vector space [1] (weak backing, weight 0.34). Corpus-linguistics teaching material describes the same layer for documents: define features, define cell values (including positive/negative binary encodings), and build a document-feature matrix for downstream analysis [2] (weak backing, weight 0.29). The representation is deliberately lossy: each item collapses to a yes/no pattern over chosen properties, which is exactly what makes the vector cheap to compute, easy to audit, and suitable for distance geometry.

The harness this corpus documents maps every synthetic observation to a 9-dimensional binary vector. Each dimension (primitive) is grounded in a specific tier of the three-tier mobility generator: reporting-burst membership (Sporadic Reporting Process), first-visit versus recurrent-visit flags (Retro-preferential Process), proximity to the fractal boundary (Agoraphobic Point Process), inter-event gap statistics, spatial-jump magnitude, and trajectory-phase position. The grounding is the important design move: every bit is traceable to a mechanism in the generator, so a planted combination of bits corresponds to a semantically meaningful (and genuinely rare) kind of observation, not an arbitrary bit pattern.

## What makes a basis good

1. Grounded: each bit derives from a known generative mechanism, so rarity claims are explainable rather than empirical accidents.
2. Opaque to the consumer: the downstream pipeline treats the vector as an opaque array, so swapping bases does not ripple through the pipeline.
3. Discriminating: the bits must co-occur in patterns, not independently and uniformly; a basis of independent coin flips has no low-rank structure and no sparse cells worth detecting.
4. Comparable across corpora: when the goal is comparing a synthetic corpus against a real one, deriving both bases from the same vocabulary makes the comparison apples-to-apples. The source document's open question, whether the 9-D synthetic basis should instead be derived from the real corpus's 10-primitive basis, is exactly this concern.

## Embedding and representation lessons from adjacent fields

Representation learning offers cautions that transfer to hand-built bases. Binary embedding methods for code report cases where an approach yields both high precision and high mean squared error, meaning it assigns high similarity to both similar and dissimilar items; the proposed remedy is attention-based cross-architecture embeddings [3] (weight 0.79). The transferable lesson: a representation can look excellent on one metric while failing on another, so a basis should be validated against the specific geometry the pipeline relies on (in the harness's case, PCA rank structure and projected distances), not against generic similarity scores.

Automated modeling work shows the complementary direction: generative AI models are being integrated into model-based systems engineering to generate simulation code, enhancing the efficiency of producing complex product models [4] (weight 0.88), and reviews of generative AI in process systems engineering describe how large models can enhance solution methodologies across the modeling pipeline [5] (weight 0.79). A generator that also emits its own feature basis risks self-consistency without external validity; a hand-grounded basis, each bit tied to a named mechanism, is easier to audit.

Structural feature-engineering research for generative engineering tasks [6] (weak backing, weight 0.45) and knowledge-grounded planning frameworks [7] (weight 0.70) further illustrate the pattern of structured, knowledge-tied feature layers sitting between raw data and downstream models.

## Replaceability as a design property

Because the curve-fit pipeline consumes the 9-D vectors opaquely, the documented harness treats the basis as a one-line swap. That is the property that makes the harness reusable: the same three falsification tests apply unchanged to a different basis, including one derived from a real corpus's primitives. The falsification questions are about the pipeline, and the basis is an experimental variable.

## Sources

[1] http://www.iiisci.org/Journal/SCI/Abstract.asp?id=GS315JG (weight 0.34, weak)
[2] https://alvinntnu.github.io/NTNU_ENC2036_LECTURES/vector-space-representation.html (weight 0.29, weak)
[3] https://www.sciencedirect.com/science/article/pii/S2590005625001183 (weight 0.79)
[4] https://www.sciencedirect.com/science/article/pii/S1569190X25001716 (weight 0.88)
[5] https://arxiv.org/pdf/2402.10977 (weight 0.79)
[6] https://arxiv.org/abs/2603.29979 (weight 0.45, weak)
[7] https://www.sciencedirect.com/science/article/pii/S027861252600186X (weight 0.70)
