# 01. Stereographic projection as a coordinate lift

Scope: stereographic projection and its inverse as a lifting map between the sphere and flat coordinates: conformality, pole handling, and where the lift fails to wrap.

## What the map is

Stereographic projection is a way of picturing the sphere as the plane, and the Wikipedia treatment is explicit that this picturing comes with some inevitable compromises (https://en.wikipedia.org/wiki/Stereographic_projection, weight 0.8711). The same article notes that because the sphere and the plane appear in many areas of mathematics and its applications, the projection appears widely as well (https://en.wikipedia.org/wiki/Stereographic_projection, weight 0.8711).

The modern generalized form starts from a North Pole punctured hypersphere of dimension D greater than 3 and maps it to the D dimensional plane (https://arxiv.org/html/2512.11916v1, weight 0.6295). The puncture is the load bearing detail for benchmarking: the map is defined on the punctured sphere, so one point of the sphere has no flat coordinate at all. Any measurement instrument built on stereographic coordinates inherits that hole.

## Conformality is the selling point

The generalized stereographic projection is conformal: it maps circles on the D sphere to circles and lines on the D plane and preserves angles locally between intersecting curves on the hypersphere (https://arxiv.org/pdf/2512.11916, weight 0.7257). The same source attributes this angle preservation to the geometry of the map (https://arxiv.org/pdf/2512.11916, weight 0.7257). For a benchmarking audience the relevant fact is that conformality is a local guarantee: angles are preserved locally between intersecting curves, which says nothing about whether a global periodic coordinate on the sphere can be represented by one flat chart without distortion accumulating across a wrap.

## Why machine learning uses the inverse lift

The inverse direction, plane to sphere, is a published manifold learning method. A 2021 Applied Intelligence paper proposes transforming data on an unknown manifold to an n sphere by conformal stereographic projection, which preserves the angles and similarities of the data in the original manifold (https://link.springer.com/content/pdf/10.1007/s10489-021-02513-0.pdf, weight 0.6472). The motivation is proximity measurement: using Euclidean norms to measure the proximity of a data set reduces the efficiency of learning methods, and algorithms like Laplacian Eigenmaps or spectral clustering require that the k nearest neighbors of any point match the local neighborhood of the point on the manifold under those Euclidean norms (https://dl.acm.org/doi/10.1007/s10489-021-02513-0, weight 0.8832; same paper at https://link.springer.com/article/10.1007/s10489-021-02513-0, weight 0.8360).

The broader setting is manifold learning, which scikit-learn describes as an attempt to generalize linear frameworks like PCA to be sensitive to non-linear structure in data (https://scikit-learn.org/stable/modules/manifold.html, weight 0.7715). A coordinate lift is one way to give a flat algorithm a curved arena to work in.

## Implications for benchmark design

Three properties of the stereographic lift matter when it is used as a measurement instrument for corpus audits.

1. Conformality is local. The angle preservation guarantee is stated for locally intersecting curves (https://arxiv.org/pdf/2512.11916, weight 0.7257), not for global function fitting, so a conformal lift does not by itself certify that a target function on the sphere is representable in the lifted coordinates.
2. The pole is a real hole. Because the construction runs on the North Pole punctured hypersphere (https://arxiv.org/html/2512.11916v1, weight 0.6295), the lifted coordinate system is undefined at exactly one point. A benchmark that evaluates or fits functions near the pole is testing a coordinate system that does not exist there.
3. The lift is motivated by proximity, not by span. The published ML use case is preserving angles and similarities of the data (https://link.springer.com/content/pdf/10.1007/s10489-021-02513-0.pdf, weight 0.6472) and fixing Euclidean k neighborhood assumptions (https://dl.acm.org/doi/10.1007/s10489-021-02513-0, weight 0.8832). Span completeness of any particular flat basis after lifting is a separate question that the lift itself does not answer.

Weak backing section: the ResearchGate mirror of the Applied Intelligence paper scores low (https://www.researchgate.net/publication/353388595_Applying_inverse_stereographic_projection_to_manifold_learning_and_clustering, weak backing, weight 0.0388) and one search hit was spam (https://onlyfans.com/itisashley, weak backing, weight 0.1002); neither is cited for any factual claim above.
