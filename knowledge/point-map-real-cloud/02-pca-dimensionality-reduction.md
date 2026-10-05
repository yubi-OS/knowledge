# 02 PCA dimensionality reduction before placement

Scope: PCA projection of high-dimensional embeddings to a few dozen components: variance capture, centering, and geometry preservation.

## Why project at all

A cloud of N texts embedded at 768 dimensions is an N by 768 float matrix. Downstream stages that compare, hash, or randomize over that matrix multiply its cost, so the standard first move is linear dimensionality reduction. The goal of dimensionality reduction is to find a lower-dimensional representation of the data that preserves its essential characteristics, and in PCA specifically the goal is to keep much of the same variation intact (https://web.stanford.edu/class/datasci112/lectures/pca.pdf, weight 0.88). The CS229 course notes frame the same decision: dimensionality reduction matters because it decides why and when you compress before further analysis (https://cs229.stanford.edu/notes2021fall/lecture14-pca.pdf, weight 0.92).

## What PCA computes

The scikit-learn reference defines PCA as linear dimensionality reduction using Singular Value Decomposition of the data to project it to a lower dimensional space (https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html, weight 0.90). Two mechanical details matter for reproducing a projection across runtimes. First, the input data is centered but not scaled for each feature before applying the SVD (https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html, weight 0.90). Second, the components are ordered by variance captured, so a projection that keeps only the top k components is deterministic in which subspace it keeps, given the same input and the same sign convention.

The Stanford STATS 202 notes add the historical and practical framing: PCA was invented by Karl Pearson in 1901 and developed by Harold Hotelling in 1933, and it provides a way to visualize high-dimensional data by summarizing it in fewer dimensions (https://web.stanford.edu/class/stats202//notes/Unsupervised/PCA.html, weight 0.85).

## What is preserved and what is not

PCA maximizes variance and assumes linearity; alternatives such as MDS are more flexible because they directly use distances, which is useful for uncovering hidden structures or clusters in complex datasets (https://www.geeksforgeeks.org/data-science/dimensionality-reduction-techniques/, weight 0.62). The pca4ds text lists the uses of PCA as description, exploration, visualization, pre-modeling, dimension reduction, and data compression (https://pca4ds.github.io/projections-of-variables.html, weight 0.64). One caveat worth carrying: after the transform, the new variables cannot be interpreted the same way the originals were (https://en.wikipedia.org/wiki/Principal_component_analysis, weight 0.18; weak backing, treat as a caution only).

For a placement pipeline the practical contract is: project to d dimensions with a fixed sign convention, then run every binarization and null-model stage in the d-dimensional space. A projection that keeps the top 24 of 768 components preserves exactly the top-24 subspace, and any downstream rule that only reads coordinates inside a smaller top-k subspace of that projection sees the same geometry it would have seen at full dimension. That is the argument that lets a 301 by 768 problem shrink to a 301 by 24 problem without changing what the placement rules can see.

## Off-the-shelf implementations

Python tooling for the transform is standard: scikit-learn exposes PCA directly with an SVD-based implementation and documented centering behavior (https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html, weight 0.90). Walkthroughs of applying PCA in Python for dimensionality reduction exist at introductory level (https://www.geeksforgeeks.org/machine-learning/reduce-data-dimensionality-using-pca-python/, weight 0.22; weak backing) and a dedicated visualization guide covers PCA scatter matrices for high-dimensional data (https://plotly.com/python/pca-visualization/, weight 0.48; weak backing, just under the 0.5 bar).

## Placement-specific reading

The pipeline-relevant summary: PCA is the cheapest lossy step that buys a fixed compute budget. It is deterministic given the same input, it is centered-not-scaled by default, and its top-k subspace is exactly what downstream binarization rules read. The cost is interpretability of individual components and whatever variance falls outside the kept subspace, which is why a run should record the share of variance the kept components capture.

## Sources considered

| source | url | weight |
|---|---|---|
| scikit-learn PCA reference | https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html | 0.90, 0.90 |
| Stanford CS229 PCA lecture notes | https://cs229.stanford.edu/notes2021fall/lecture14-pca.pdf | 0.92 |
| Stanford DataSci112 PCA lecture | https://web.stanford.edu/class/datasci112/lectures/pca.pdf | 0.88 |
| Stanford STATS 202 PCA notes | https://web.stanford.edu/class/stats202//notes/Unsupervised/PCA.html | 0.85 |
| pca4ds projections of variables | https://pca4ds.github.io/projections-of-variables.html | 0.64 |
| GeeksforGeeks dimensionality reduction techniques | https://www.geeksforgeeks.org/data-science/dimensionality-reduction-techniques/ | 0.62 |
| Plotly PCA visualization | https://plotly.com/python/pca-visualization/ | 0.48 (weak) |
| Wikipedia principal component analysis | https://en.wikipedia.org/wiki/Principal_component_analysis | 0.18 (weak) |
| GeeksforGeeks PCA in Python | https://www.geeksforgeeks.org/machine-learning/reduce-data-dimensionality-using-pca-python/ | 0.22 (weak) |
| GeeksforGeeks PCA overview | https://www.geeksforgeeks.org/data-analysis/principal-component-analysis-pca/ | 0.28 (weak) |
| HandWiki Word2vec | https://handwiki.org/wiki/Word2vec | 0.08 (weak) |
| Porsche Club of America (off-topic hit) | https://www.pca.org/ | 0.24 (weak, off-topic) |
