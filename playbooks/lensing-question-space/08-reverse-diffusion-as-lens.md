# 08: Reverse diffusion is the lens run backward

Scope: source doc finding F10: the 2022-2023 Riemannian diffusion literature read through the lensing dictionary, the learned score as refractive-index gradient.

Grounding spine: [source doc](file://yubi-OS/yubiOS playbooks/lensing-question-space.md), 2026-08-13, section F10.

## The three anchors

The source doc cites three works, all verified by the dig:

1. De Bortoli, Mathieu, Hutchinson, Thornton, Teh, Doucet, "Riemannian Score-Based Generative Modelling" (NeurIPS 2022): forward Brownian motion on compact manifolds with the sphere as the worked case, reverse SDE guided by the learned score (source doc). The dig confirms: RSGMs extend score-based generative models to Riemannian manifolds, demonstrated on a variety of compact manifolds ([proceedings.neurips.cc 2022 paper](https://proceedings.neurips.cc/paper_files/paper/2022/hash/105112d52254f86d5854f3da734a52b4-Abstract-Conference.html), weight 0.91; [arxiv.org/abs/2202.02763](https://arxiv.org/abs/2202.02763), weight 0.81).
2. Huang, Aghajohari, Bose, Panangaden, Courville, "Riemannian Diffusion Models" (NeurIPS 2022): Stratonovich SDE formulation with the Riemannian ELBO equal to Riemannian score matching (source doc). The dig found this paper referenced inside the NeurIPS 2023 paper but did not surface an independent high-weight record for it; the description stands on the source doc plus the 2023 paper's citation of it.
3. "Scaling Riemannian Diffusion Models" (NeurIPS 2023): exact heat-kernel computations on symmetric spaces, spheres and tori and Lie groups, with S2 and S^n the easy case (source doc). Verified: the paper motivates exact heat-kernel machinery for manifold diffusion ([arxiv.org/abs/2310.20030](https://arxiv.org/abs/2310.20030), weight 0.7; [proceedings.neurips.cc 2023 pdf](https://proceedings.neurips.cc/paper_files/paper/2023/file/fe1ab2f77a9a0f224839cc9f1034a908-Paper-Conference.pdf), weight 0.84; poster page 0.82).

## The lensing reading

The source doc's translation: the forward process defocuses (corpus to uniform null), the learned score s(x,t) = grad log p_t(x) is the refractive-index gradient, and the reverse SDE is a lens that focuses the uniform measure back into the corpus distribution (source doc). This general (non-conformal) lens then contains phi_theta from F1 as its 6-parameter interpretable subfamily (source doc). The translation itself is the source doc's contribution; the dig verifies the physics and the diffusion papers it joins.
