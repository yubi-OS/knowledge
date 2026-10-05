# 09 - Reverse diffusion is the lens run backward: Riemannian diffusion on the sphere

**Scope.** Riemannian score-based generative modelling and Riemannian diffusion models on symmetric spaces, and the lensing reading: forward diffusion defocuses the corpus into the null, the learned score is the refractive-index gradient, and the reverse SDE is the general lens.

## The established machinery (2022 to 2023)

Three NeurIPS papers establish diffusion on manifolds, and all three surfaced at high weight:

- Riemannian Score-Based Generative Modelling (De Bortoli, Mathieu, Hutchinson, Thornton, Teh, Doucet, NeurIPS 2022): many domains have data described by distributions on Riemannian manifolds, and standard SGM techniques are not appropriate; the paper extends score-based generative models to Riemannian manifolds by defining the forward diffusion process intrinsically, with the sphere as the worked compact case (abstract page weight 0.8306, https://proceedings.neurips.cc/paper_files/paper/2022/hash/105112d52254f86d5854f3da734a52b4-Abstract-Conference.html; arXiv abs weight 0.9248, https://arxiv.org/abs/2202.02763; full PDF weight 0.9544, https://proceedings.neurips.cc/paper_files/paper/2022/file/105112d52254f86d5854f3da734a52b4-Paper-Conference.pdf).
- Riemannian Diffusion Models (Huang, Aghajohari, Bose, Panangaden, Courville, NeurIPS 2022): cited within the scaling paper as "the natural generalization of standard Euclidean space score-based diffusion models" to manifolds (weight 0.9726, https://proceedings.neurips.cc/paper_files/paper/2023/file/fe1ab2f77a9a0f224839cc9f1034a908-Paper-Conference.pdf). The Stratonovich SDE formulation and the Riemannian ELBO identity with score matching are recorded in the source doc; the dig confirms the model's standing through the citation chain rather than its own abstract.
- Scaling Riemannian Diffusion Models (NeurIPS 2023): a generalized strategy for numerically computing the heat kernel on Riemannian symmetric spaces in the context of denoising score matching, adapting known heat kernel techniques to spheres, tori, and Lie groups (supplemental PDF weight 0.8718, https://proceedings.neurips.cc/paper_files/paper/2023/file/fe1ab2f77a9a0f224839cc9f1034a908-Supplemental-Conference.pdf; arXiv abs weight 0.8921, https://arxiv.org/abs/2310.20030; main PDF weight 0.9726 above; alternate mirror weight 0.8201, https://papers.nips.cc/paper_files/paper/2023/file/fe1ab2f77a9a0f224839cc9f1034a908-Paper-Conference.pdf; abstract page weight 0.9305, https://papers.nips.cc/paper/2023/hash/fe1ab2f77a9a0f224839cc9f1034a908-Abstract-Conference.html). The motivation is stated bluntly: the additional geometric complexity of manifolds renders the standard machinery difficult, so the exact heat kernel is the unlock. The NeurIPS 2022 awards blog records diffusion-based generative models as that year's recognized frontier (weight 0.7277, https://blog.neurips.cc/2022/11/21/announcing-the-neurIPS-2022-awards/).

For S2 and S^n specifically, the closed-form kernel of doc 08 is already available, so the sphere is the easy case of the 2023 result.

## The lensing dictionary

The source doc reads the machinery through the lens of Part I: the forward process defocuses (corpus to uniform null, matching the t to infinity endpoint of doc 08), the learned score s(x, t) = grad log p_t(x) is the refractive-index gradient, and the reverse SDE is a lens that focuses the uniform measure back into the corpus distribution. This is the general (non-conformal) lens; the Mobius family phi_theta of doc 01 is its 6-parameter interpretable subfamily. The dig anchors establish that the forward-reverse construction is established science on exactly the manifold the framework uses; the lensing vocabulary is the framework's own reading of it.

## Feasibility for the is-this-x corpus

Gap G5 (source doc): N = 2286 points on S2 is tiny by RSGM standards, and the exact S2 heat kernel removes the usual approximation pain (the 2023 result above). The risk is that the corpus is only 176 distinct rows, so the point cloud is heavily atomic; kernel-smoothed targets may be needed first, with vMF bandwidth acting as another diffusion time (source doc). Gap G6: where the learned score focuses mass onto lower-dimensional sets, the reverse flow develops the same rank-collapse signature as the caustics of doc 03; the anti-caustic guard (rank plus condition number) should be monitored along diffusion time, not just at endpoints (source doc).

## Sources considered

| result | weight | used |
|---|---|---|
| Scaling RDM main PDF (proceedings) | 0.9726 | yes |
| Scaling RDM abstract (papers.nips) | 0.9305 | yes |
| RSGM PDF (proceedings) | 0.9544 | yes |
| RSGM arXiv abs | 0.9248 | yes |
| Scaling RDM arXiv abs | 0.8921 | yes |
| Scaling RDM supplemental PDF | 0.8718 | yes |
| Scaling RDM PDF (papers.nips mirror) | 0.8201 | yes |
| RSGM NeurIPS abstract page | 0.8306 | yes |
| NeurIPS 2022 awards blog | 0.7277 | yes (context) |
| SIGE project page (off topic) | 0.5106 | no |
| rule34video (off topic) | 0.0218 | no |
| Stack Overflow SQL (off topic) | 0.0331 | no |
