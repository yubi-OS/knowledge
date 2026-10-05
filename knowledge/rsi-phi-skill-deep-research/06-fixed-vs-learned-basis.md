# 06 - Fixed versus learned bases: where the native Y_3^3 probe sits in the RSI family

Scope: the fixed-basis versus learned-basis tension in curve fitting, the learned-latent branch of the yubiOS RSI family, and why rsi-phi-skill still ships a fixed analytic probe.

## The learned-basis literature

The strongest counter-position to a fixed basis is recent and explicit: "Don't Fix the Basis, Learn It: Spectral Representation with Adaptive..." shifts the source of expressivity from learned spectral coefficients to the representation itself; rather than just operating in a fixed global basis, the model also learns a spatially adaptive basis [1], weight 0.8744. A CVPR 2026 paper pushes the same idea: the spectral basis is optimized by learning a set of inhibition functions, yielding the first unsupervised spectral basis learning method for robust non-rigid 3D shape matching, jointly optimizing coefficients and basis [2], weight 0.7538, with the arXiv version at weight 0.4649 (weak backing) [3].

Against that backdrop, rsi-phi-skill's choice looks conservative by design: it ships a fixed analytic probe, the native Y_3^3 with its 384-lobe azimuthal ladder, and learns nothing during the fit. The recorded rationale is determinism and auditability: a fixed basis makes the per-cycle re-map a pure function of the corpus, so two runs on identical corpora produce identical curves and every delta is attributable to the edit, not to basis drift [4], weight 0.4717 (weak backing).

## The family's own learned branch

The yubiOS RSI family already contains the learned-basis answer, so the fixed-versus-learned split is a live design axis inside the family rather than a settled question. The learned-latent-curve skill replaces hand-engineered primitives with learned latents in the curve fit, keeping the same bounded RSI discipline (gap-map, hypothesis, edit, re-map, fixpoint) but letting the basis itself be learned from the corpus [5], weight 0.1290 (weak backing). The single-action-curve-rsi skill sits at the other granularity extreme: one corpus item maps to one point on S^2 via 9-D binary primitive coverage, PCA top-2, and stereographic lift, with a single edit per cycle [6], weight 0.1047 (weak backing), described in the yubi-OS/yubiOS SKILL.md as the smallest unit of the curve-guided-rsi and hyperspherical-harmonic-curve family [7], weight 0.3345 (weak backing).

The curve-guided-rsi skill defines the loop skeleton all three share: gap-mapping via negative-skill-space, one hypothesis per cycle, a fixpoint rule (no new gaps, old gaps closed, no new anti-patterns), a 3-cycle default cap, and fresh-context subagents per cycle to avoid author bias [8], weight 0.1290 (weak backing).

## The decision the skill actually took

rsi-phi-skill's 2026-08-07 design run did test a learned-free alternative against the fixed probe: the three 384-D variants in doc 05 are all fixed analytic bases with different polar degrees, and the winner was the most polarized fixed basis (sin^384, PC1 + PC2 = 1.0000) [4], weight 0.4717 (weak backing). The learned-basis option was not in that comparison; the family reserves it for learned-latent-curve, which is the right tool when the corpus has no known analytic structure. For Fibonacci-sphere corpora the azimuthal structure is known in closed form (m = 3k ladder on Y_3^3), so fixing the basis costs little and buys determinism.

This is a provenance claim worth stating plainly: the fixed-probe choice is recorded in the skill's own SKILL.md and source doc, and the dig found no independent source advocating fixed analytic probes for corpus audit specifically. The learned-basis literature above (weights 0.8744 and 0.7538) is the honest counterweight: if the corpus structure were unknown, the family's own precedent says learn the basis instead [1], [2].

## What the dig did not find

No source in the dig addresses fixed-versus-learned bases for corpus-audit curves specifically; the learned-basis results are from 3D shape matching and operator learning. Readers should treat the skill's fixed-probe choice as a domain-specific engineering decision justified by determinism and closed-form azimuthal structure, not as a conclusion the broader literature endorses in general.

## Sources

1. Don't Fix the Basis, Learn It: Spectral Representation with Adaptive..., arXiv. https://arxiv.org/pdf/2605.10451 (weight 0.8744)
2. From Feature Learning to Spectral Basis Learning, CVPR 2026 poster. https://cvpr.thecvf.com/virtual/2026/poster/36790 (weight 0.7538)
3. Same paper, arXiv abstract. https://arxiv.org/abs/2603.23383 (weight 0.4649, weak)
4. rsi-phi-skill SKILL.md, yubi-OS/yubiOS. https://github.com/yubi-OS/yubiOS/blob/main/skills/rsi-phi-skill/SKILL.md (weight 0.4717, weak)
5. learned-latent-curve skill listing, SkillsMP. https://skillsmp.com/creators/yubi-os/yubios/skills-learned-latent-curve (weight 0.1290, weak)
6. single-action-curve-rsi skill listing, SkillsMP. https://skillsmp.com/creators/yubi-os/yubios/skills-single-action-curve-rsi (weight 0.1047, weak)
7. single-action-curve-rsi SKILL.md, yubi-OS/yubiOS. https://github.com/yubi-OS/yubiOS/blob/main/skills/single-action-curve-rsi/SKILL.md (weight 0.3345, weak)
8. curve-guided-rsi skill listing, SkillsMP. https://skillsmp.com/creators/yubi-os/yubios/skills-curve-guided-rsi (weight 0.1290, weak)
