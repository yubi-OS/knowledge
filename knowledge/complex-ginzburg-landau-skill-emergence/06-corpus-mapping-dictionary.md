# 06 - The GL-to-corpus variable dictionary

**Scope:** The GL-to-corpus variable dictionary: the 9-primitive coverage vector as order parameter and corpus size N as an inverse-temperature-like control variable with alpha_eff(N) = a(N - Nc).

Source doc: `refs_corpus/complex-ginzburg-landau-skill-emergence.md` (yubi-OS/yubiOS refs/). Weights in parentheses are jev noul scores from the research DB.

## The dictionary

The source doc's central modeling move is a variable dictionary. Every GL concept gets a corpus analogue:

| GL concept | Corpus analogue | Interpretation |
|---|---|---|
| Order parameter ψ | 9-primitive coverage vector m | State of capability organization |
| |ψ| | Coverage norm | Strength of the emerging skill |
| Phase arg ψ | Relative configuration among primitives | Different realizations with similar coverage |
| α | α_eff(N) = a(N − N_c) | Corpus-size control variable |
| β | Saturation coefficient | Prevents unbounded growth of measured capability |
| Gradient term | Penalty for corpus-stratum variation | Generalization constraint |
| ξ | Transition width in log N | Emergence propagation range |
| λ | Persistence scale | Cross-context generalization |
| κ = λ/ξ | Generalization vs transition width | Localized vs robust emergence |
| Vortex | Zero-coverage row with winding | Persistent capability hole |
| Noise | Sampling, prompt, seed variance | Threshold uncertainty |

(source doc §3.1)

## The order parameter

The yubiOS corpus defines 9 primitives: attestation, trust_chain, least_privilege, declarative_policy, continuous_adaptive, immutability, audit_evidence, cryptographic_identity, segmentation. For each corpus row i, the coverage vector is m_i ∈ {0,1}⁹. The corpus-level order parameter is the mean M = (1/N) Σᵢ mᵢ. The 9-D coverage matrix enters the S² embedding, and after Z-scoring and PCA top-2, PC1+PC2 measures how much variance concentrates in a 2-D subspace (source doc §3.2).

This mirrors a real methodological movement in physics: identifying order parameters, including learned or "quasi" order parameters, from data rather than theory, with ML models trained on microstates classifying phases surprisingly well even from reduced representations (w=0.631, https://arxiv.org/html/2505.06159). Single-atom experiments now measure full order-parameter fluctuation distributions across a continuous transition, showing that statistics beyond the mean carry critical information (w=0.755, https://www.nature.com/articles/s41586-026-10811-1). Machine learning can decode phases of interacting models when combined with finite-size scaling, which is the same operation the corpus framework performs on its coverage matrix (w=0.717, https://link.aps.org/doi/10.1103/49zd-8dgw). The idea of phase transitions arising in learning systems as a function of data or representation has its own literature, treating data scale and representation as control parameters (w=0.724, https://link.springer.com/rwe/10.1007/978-0-387-30164-8_635).

## Corpus size as inverse temperature

The temperature analogy is useful but not exact. Increasing temperature generally increases fluctuations and disorders the phase. Increasing corpus size often decreases estimation noise and increases order. The natural mapping is τ_N ~ 1/N^ρ, or T_eff(N) decreasing as N increases: corpus size acts as an inverse-temperature or annealing coordinate, not a literal temperature (source doc §3.4). Equivalently, N is a quench coordinate: the model moves through a family of effective landscapes as N grows. The critical quantity is the sign of an empirically fitted α_eff(N) = a(N − N_c), not the sign of literal temperature (source doc §3.4).

This direction-of-mapping caution is not pedantry. In the LLM emergence literature, scale (parameters and training data) plays exactly the control-parameter role, with capabilities appearing abruptly once scale thresholds are crossed (w=0.855, https://arxiv.org/html/2503.05788v2). The corpus framework imports the same structure with N as the swept variable. But it inherits the same hazard documented there: whether the abruptness is intrinsic or an artifact of the metric used to detect it is a live question (see doc 08).

## What the dictionary buys, and what it does not

What it buys: a disciplined vocabulary that separates the control variable (N), the order parameter (m), the stiffness-like diagnostic (PC1+PC2), the fluctuations (scoring disagreement, refused rows), the defects (zero-coverage rows), and the transition (the climb). Each is measurable independently (source doc §1).

What it does not buy: literal identification. The 9-primitive coverage vector is vector-valued, not a single complex ψ; the mapping is at the level of mathematical structure, not components (source doc §5, caveat 3). The corpus is 0-dimensional, so fluctuation corrections are large and mean-field exponents are only qualitative guides (source doc §5, caveat 6). And the phase variable arg ψ has no measured corpus analogue yet, which is exactly why the vortex claims in doc 10 remain retired.
