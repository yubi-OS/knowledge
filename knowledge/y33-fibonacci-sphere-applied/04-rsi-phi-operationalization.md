# Operationalization as rsi-phi-skill

Scope: how the applied y33 math became a runnable loop in rsi-phi-skill: the paper-to-skill mapping, the i = t Fibonacci parameterization, the 384-lobe default, and the dual-ordering testing constraint.

## The mapping from paper to skill

The new skill skills/rsi-phi-skill/SKILL.md is the runnable loop that uses the y33 basis, and the applied refs doc records the mapping explicitly (internal ref: refs/y33-fibonacci-sphere-applied-2026-08-07.md):

| Paper element | Skill element |
|---|---|
| Y_3^3 = K sin^3 theta cos(3 phi) | Native basis, 3-fold azimuthal lobe |
| Fibonacci z_i, phi_i, theta_i | i = t parameterization (the Fibonacci index IS the parameter) |
| 384 lobes, m = 3..384 step 3 | Default lobe count in rsi-phi-skill |
| (l=128, m=256) + (l=256, m=128) testing | Constraint 5: both orderings must be tested per cycle |
| Equation block + revised passage | SKILL.md sections "The math" and "Constraints" |

The load-bearing detail is the i = t parameterization: the Fibonacci index does double duty as the latent parameter, which is what makes the paper's mapping a one-line substitution rather than a resampling layer (internal ref: refs/y33-fibonacci-sphere-paper-method-equation-block-2026-08-07.md). In the skill this becomes "Fibonacci index IS the parameter", eliminating any separate sampling bookkeeping.

## Why spherical harmonics as a corpus basis is a sound bet

The general literature supports the choice of a harmonic basis for structured data. Spherical harmonics provide a smooth, orthogonal, symmetry-adapted basis for expanding functions on a sphere and are used routinely in computer graphics, signal processing, geology, and quantum chemistry; they have more recently become a key component of rotationally equivariant models in geometric deep learning (https://arxiv.org/pdf/2302.08381v1, weight 0.70). On the systems side, data defined on spherical manifolds is increasingly processed with spherical harmonic transforms at high degrees, with efficient gradient computation required for machine learning and differentiable programming tasks (https://www.sciencedirect.com/science/article/pii/S0021999124003589, weight 0.87). That is the operating regime rsi-phi-skill lives in: a 384-lobe basis evaluated per cycle.

The azimuthal-role grounding is standard: MathWorld treats the spherical harmonics as the angular portion of the Laplace-equation solution and stresses convention care around theta and phi (https://mathworld.wolfram.com/SphericalHarmonic.html, weight 0.73), and the transformation properties of the harmonics under rotations, from which the addition theorem follows, are the formal backbone of the 3-fold lobe structure (https://scipp-legacy.pbsci.ucsc.edu/~haber/ph116C/SphericalHarmonics_12.pdf, weight 0.64).

## The dual-ordering constraint

The applied doc records that the paper tests both (l=128, m=256) and (l=256, m=128), and the skill carries this as Constraint 5: both orderings must be tested per cycle (internal ref: refs/y33-fibonacci-sphere-applied-2026-08-07.md). The operational reason lives in the variant testing of doc 06: the same lobe count behaves very differently depending on how the polar exponent is assigned, so a single-ordering test can certify a basis that fails under the other ordering. This is the same convention-care warning the reference literature repeats for spherical harmonics generally (https://mathworld.wolfram.com/SphericalHarmonic.html, weight 0.73).

## Entry point discipline

The applied doc names rsi-phi-skill the operational entry point for RSI loop users: dispatched per cycle, it uses the same conventions as the paper (internal ref: refs/y33-fibonacci-sphere-applied-2026-08-07.md). The practical consequence is convention lock-in: the golden-ratio indexing, the Condon-Shortley normalization constant, and the (l=384, m=3) variant are shared constants across paper and skill, so a divergence in one would silently desynchronize the other.

## Sources considered

| source | weight |
|---|---|
| https://www.sciencedirect.com/science/article/pii/S0021999124003589 | 0.87 |
| https://mathworld.wolfram.com/SphericalHarmonic.html | 0.73 |
| https://arxiv.org/pdf/2302.08381v1 | 0.70 |
| https://scipp-legacy.pbsci.ucsc.edu/~haber/ph116C/SphericalHarmonics_12.pdf | 0.64 |
| https://en.wikipedia.org/wiki/Spherical_harmonics | 0.40 (weak in this dig) |
| https://www.basketball-reference.com/playoffs/2007-nba-finals-cavaliers-vs-spurs.html | 0.77 (off-topic weighting artifact; not cited) |
| https://pubmed.ncbi.nlm.nih.gov/31365921 | 0.39 (off-topic, not cited) |
| https://vinequai.com/sphericalharmonics | 0.39 (weak, not cited) |
| https://towardsdatascience.com/differentiable-and-accelerated-spherical-harmonic-transforms-c269393d | 0.10 (weak, not cited) |
| https://www.emergentmind.com/topics/continuous-neural-representation-with-spherical-harmonics | 0.39 (weak, not cited) |
| https://arxiv.org/html/2609.39737v1 | 0.38 (weak, not cited) |
| https://www.merriam-webster.com/dictionary/spherical | 0.15 (off-topic, not cited) |
