# 07 - Caustics and Catastrophe Theory: Classifying the Exact 1.0000 Degeneracies

**Scope.** The geometric identity for Prop. 2's red-flag rows: caustics as degenerate ray maps, their fold and cusp classification from catastrophe theory, and the optimal-transport singularities that are their measure-theoretic cousins.

## Caustics: where the ray map degenerates

A caustic is the envelope of rays where the ray map folds: intensity diverges, and the image no longer carries information about the source. Reference treatments document the caustic's definition and its role as the locus where imaging fails [https://en.wikipedia.org/wiki/Caustic_(optics), jev weight 0.88]. Catastrophe optics (Berry) supplies the classification: caustic morphologies are the canonical forms of Thom-Arnold catastrophe theory, with the fold and the cusp as the first two elementary catastrophes, and each morphology predicts a characteristic diffraction pattern [https://arxiv.org/pdf/2404.11153v1, jev weight 0.75; https://michaelberryphysics.wordpress.com/wp-content/uploads/2022/02/berry089-1.pdf, jev weight 0.64]. An experimental-mathematics treatment of charged-particle optics demonstrates the morphology classification in a controllable setting [https://arxiv.org/pdf/2509.09551, jev weight 0.79].

## The corpus reading of the 14 exact 1.0000 rows

The source brainstorm's proposal: the paper's rank-2 degeneracies (2-D PCA, the l=384/m=3 variant, all 14 rows at exactly 1.0000, including pure noise) are caustics in the optics sense, namely over-focusing that destroys data content. The mapping is structural:

- In optics, at a caustic the map from source to image degenerates: multiple source points collapse to one image point, so the image carries no information about the source [https://en.wikipedia.org/wiki/Caustic_(optics), jev weight 0.88].
- In the corpus, at V2 = 1.0000 the feature map collapses: rank 2, everything on one great circle, so the coordinate carries no discriminating information. The red-flag rule ("exact 1.0000 implies report rank and condition number") is the caustic detector [source document, Section 3].

## The fold-versus-structural test (Gap E)

The testable version: perturb each degenerate basis by one column and measure whether V2 leaves 1.0000 continuously or discontinuously. Catastrophe-theoretic normal forms predict which: a fold caustic is stable under small perturbation in the sense that the caustic persists (it moves, it does not vanish), while a structural rank collapse should vanish or change discontinuously under perturbation. The morphological vocabulary (fold, cusp, higher catastrophes) comes from the catastrophe-optics literature above [https://arxiv.org/pdf/2404.11153v1, jev weight 0.75], and the corpus experiment is proposed but not yet run in the source document [source document, Gap E].

## The optimal-transport cousin

The measure-theoretic analog: singularities of optimal transport maps. The Singularity Set of Optimal Transportation Maps documents where the Brenier map (the OT analog of a lensing map) loses regularity [https://link.springer.com/content/pdf/10.1007/978-3-030-76798-3_4.pdf?pdf=inline+link, jev weight 0.87; https://link.springer.com/article/10.1134/S0965542522080097, jev weight 0.38, weak backing for the paywalled abstract mirror]. Brenier's theorem itself (the existence and uniqueness of the gradient map for the quadratic cost) is the foundational result these singularities live on [https://en.wikipedia.org/wiki/Brenier%27s_theorem, jev weight 0.81]. The brainstorm's Gap F relies on this: transport-map singularities are the transport analog of caustics, but no general theorem says data exhibits optical caustics, which is why Gap F enters only behind its own null.

## Honesty constraint

Caustic language is banned from results until each degenerate basis clears its own non-degenerate null, per the source document's Section 5 discipline. The classification program (Gap E) must run before "fold" versus "structural collapse" labels are applied to any of the 14 rows.
