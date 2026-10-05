# 03 Binarization rules: median threshold versus zero threshold

Scope: Binarizing latent coordinates for placement: thresholding at the coordinate median versus at zero, and published variants of each rule.

## Why binarize

A point-map placement pipeline turns each projected embedding into a binary signature, because placement, shelling, and null-model machinery operate on 0/1 attributes rather than continuous coordinates. Thresholding is a common method for converting continuous embeddings into binary representations, where a per-dimension cutoff decides which coordinates count as present (https://arxiv.org/abs/2507.17025, weight 0.84). The two natural cutoffs are zero and a per-dimension statistic such as the median, and the choice between them changes the resulting binary matrix, the class counts, and every statistic computed downstream.

## The zero threshold rule (sign rule)

Thresholding at zero is the sign rule: a coordinate becomes 1 if it is positive and 0 otherwise. The scikit-learn Binarizer defines the default behavior exactly: binarize data by threshold, values greater than the threshold map to 1 and values less than or equal to the threshold map to 0, with the default threshold 0.0 (https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.Binarizer.html, weight 0.82). The functional form binarize(X, threshold=0.0) applies the same boolean thresholding element-wise (https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.binarize.html, weight 0.81).

In binary neural network research the sign function is the standard such rule, and its known weakness is exactly relevant here: common binary activations such as the sign function abruptly binarize values with a single threshold, which is harsh on coordinates near the cutoff (https://arxiv.org/html/2405.02220v2, weight 0.82; same result reported in the IEEE version, https://ieeexplore.ieee.org/document/10693367, weight 0.92). The SiMaN line of work was motivated by the same issue and provides an analytical solution that encodes high-magnitude weights into +1 and 0 otherwise without using the sign function, evaluated on CIFAR-10 and ImageNet (https://ieeexplore.ieee.org/abstract/document/9913704, weight 0.87).

## The median threshold rule

Thresholding at the per-dimension median is the other natural rule, and it guarantees a balanced signature: for each coordinate, half the items are above the cutoff and half below, regardless of where the cloud sits relative to zero. An open-source research example implements exactly this pair of rules side by side: a binarize_embeddings function taking a method parameter, where method median computes thresholds as np.median(Z, axis=0) and method sign uses zero thresholds, binarizing with Z > thresholds (https://github.com/HySonLab/Q-BIOLAT/blob/main/examples/project_binarize_embeddings.py, weight 0.24; weak backing, cited as an existence proof of the two-rule design rather than as authority).

The median rule is what keeps a placement honest when the projected cloud is off-center. PCA output is centered by construction at the cloud mean, but the per-coordinate median can still sit away from zero when a dominant component is one-signed. A zero rule then produces systematically lopsided signatures, while a median rule produces balanced ones by design. This is the structural reason a pipeline may report both rules and their rule_hash values side by side rather than committing to one.

## Operational consequences

The rule choice is visible in every downstream number. Class counts on a cloud change between rules because the binary matrix changes; null distributions change with them. Published retrieval practice operationalizes binarization as a pipeline step: Vespa documents defining a new binarized embedding as an addition to the original field, deploying and re-indexing the data to populate it, and creating new ranking profiles over the binarized embeddings (https://docs.vespa.ai/en/rag/binarizing-vectors.html, weight 0.72). The lesson generalizes: binarization is a versioned, deployed artifact, not an inline detail, so the rule and its parameters must be pinned and hashed when results are compared across runs.

## What a run should record

For each rule: the threshold definition (zero versus per-dimension median), a hash of the rule definition, the resulting class count over N items, and the null-model statistics computed from the resulting binary matrix. Comparing rules is then a matter of comparing two admissible placements on the same cloud, not re-running the embedding or projection stages.

## Sources considered

| source | url | weight |
|---|---|---|
| arXiv 2507.17025 abstract | https://arxiv.org/abs/2507.17025 | 0.84 |
| arXiv 2507.17025 PDF | https://arxiv.org/pdf/2507.17025 | 0.76 |
| scikit-learn Binarizer | https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.Binarizer.html | 0.82 |
| scikit-learn binarize function | https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.binarize.html | 0.81 |
| Vespa binarizing vectors | https://docs.vespa.ai/en/rag/binarizing-vectors.html | 0.72 |
| Designed dithering sign activation (arXiv) | https://arxiv.org/html/2405.02220v2 | 0.82 |
| Designed dithering sign activation (IEEE) | https://ieeexplore.ieee.org/document/10693367 | 0.92 |
| SiMaN sign-to-magnitude binarization (IEEE) | https://ieeexplore.ieee.org/abstract/document/9913704 | 0.87 |
| SiMaN PDF | https://arxiv.org/pdf/2102.07981v1 | 0.91 |
| Q-BIOLAT binarize example | https://github.com/HySonLab/Q-BIOLAT/blob/main/examples/project_binarize_embeddings.py | 0.24 (weak) |
| SiMaN on ResearchGate | https://www.researchgate.net/publication/349363389_SiMaN_Sign-to-Magnitude_Network_Binarization | 0.16 (weak) |
| Merriam-Webster sign (off-topic hit) | https://www.merriam-webster.com/dictionary/sign | 0.90 (weak, off-topic dictionary hit) |
