# 05 - The PCA gate and the three 384-D variants: why the native basis failed and polar sharpening fixed it

Scope: the pass/fail gate semantics, the measured failure of the native sin^3 theta basis at 384 dimensions, and the polar-degree sharpening that recovered 2-D structure.

## The gate

The RSI family measures corpus structure with a simple statistic: fit the corpus curve on the parameter manifold, then ask how much variance the first 2 principal components capture (PC1 + PC2). A value of 1.0000 means the corpus curve lies in a plane and the 2-D fit is faithful; a value near 0 means the signal is smeared across dimensions the 2-D fit cannot see.

PCA is a linear dimensionality reduction technique that transforms correlated features into a smaller set of orthogonal components capturing maximum variance [1], weight 0.6860. The explained-variance concept, the share of total information captured by each principal component, is the quantity the gate thresholds on [2], weight 0.1271 (weak backing), [3], weight 0.1611 (weak backing).

## The three 384-D variants

Per the skill's own constraints, both (l = 128, m = 256) and (l = 256, m = 128) orderings must be tested each cycle. The 2026-08-07 run tested 3 variants on a 4-corpus sample of n = 2,610 items [4], weight 0.4717 (weak backing; the test record lives in the skill's source doc and SKILL.md):

| Variant | Basis | PC1+PC2 |
|---|---|---:|
| Native | sin^3 theta * cos(m phi), m = 3..384 step 3, 384 lobes on Y_3^3 | 0.0156 |
| Variant 1 | (l = 128, m = 3..384, sin^128 polar) | 0.6667 |
| Variant 2 | (l = 384, m = 3, sin^384 polar) | 1.0000 |

Variant 2 was chosen and the gate passed at 1.0000 [4].

## Why the native basis failed

The recorded interpretation: high-dimensional Fibonacci sampling spreads the signal across 384 orthogonal axes when the polar factor is only sin^3 theta [4], weight 0.4717 (weak backing). Mechanically, the native basis vector for item i is the 384-D vector whose components are sin^3 theta_i * cos(m phi_i) for m = 3, 6, ..., 384. With the polar factor barely varying (sin^3 theta is smooth and near-flat over most of the sphere), the azimuthal frequencies dominate, and 384 nearly orthogonal azimuthal probes leave almost no variance in the top 2 principal components: PC1 + PC2 = 0.0156.

The mathematics behind the azimuthal ladder is standard: spherical harmonics provide an orthonormal basis for scalar functions on the 2-sphere [5], weight 0.6872, and form the irreducible representations of SO(3) [6], weight 0.5638. The spherical basis construction expresses vectors and tensors through polar and azimuthal angles [7], weight 0.7354, and MathWorld documents the harmonic family with its notational cautions [8], weight 0.8685. A University of Virginia lecture walks the move from azimuthal symmetry to harmonics depending on both theta and phi, which is exactly the regime the 384-D probe lives in [9], weight 0.7279.

## Why polar sharpening works

Raising the polar degree to sin^128 theta or sin^384 theta concentrates the basis energy near the poles and away from the equator, which sharpens the azimuthal contrast: items at different azimuths now separate cleanly, and the corpus curve collapses onto a 2-D structure the PCA gate can see. Variant 1 (sin^128 polar) recovers 0.6667; Variant 2 (sin^384 polar at m = 3) recovers the full 1.0000 [4], weight 0.4717 (weak backing).

The interpretation is supported, though not independently derived, by the general literature: the arXiv treatment of spherical harmonics in cylindrical-type coordinates notes the orthonormal-basis role and the coordinate-dependence of the angular factorization [5]. No source in the dig derives the specific polar-sharpening result; it is an empirical finding of the 2026-08-07 run and is recorded here with its provenance rather than dressed up as established theory.

## The 5-dim time-series library state

The same gate run placed the 384-D basis in the context of the family's dimension ladder. The recorded state on 2026-08-07: 7-D at 1.0000 (passing at the boundary), 9-D at 0.4565, 16-D at 0.4627, 24-D at 0.2993 (failing), and 384-D at 1.0000 (passing) [4], weight 0.4717 (weak backing). The keystone diagram at papers/data/drift-output/aligned-curves-from-series-keystone.png shows all 5 dims with their primitive guides and gate status [4].

The 24-D failing while 384-D passes is the counterintuitive result worth flagging: gate health is not monotonic in dimension. A mid-sized basis can smear the signal in a way that a sharply polarized high-degree basis does not.

## Sources

1. Principal component analysis, Wikipedia. https://en.wikipedia.org/wiki/Principal_component_analysis (weight 0.6860)
2. Reduce data dimensionality using PCA, GeeksforGeeks. https://www.geeksforgeeks.org/machine-learning/reduce-data-dimentionality-using-pca-python/ (weight 0.1271, weak)
3. PCA explained step-by-step, Built In. https://builtin.com/data-science/step-step-explanation-principal-component-analysis (weight 0.1611, weak)
4. rsi-phi-skill SKILL.md, yubi-OS/yubiOS. https://github.com/yubi-OS/yubiOS/blob/main/skills/rsi-phi-skill/SKILL.md (weight 0.4717, weak)
5. Spherical harmonics in alternate coordinates, arXiv:2010.09433. https://arxiv.org/pdf/2010.09433 (weight 0.6872)
6. Spherical harmonics, Wikipedia. https://en.wikipedia.org/wiki/Spherical_harmonics (weight 0.5638)
7. Spherical basis, Wikipedia. https://en.wikipedia.org/wiki/Spherical_basis (weight 0.7354)
8. Spherical Harmonic, Wolfram MathWorld. https://mathworld.wolfram.com/SphericalHarmonic.html (weight 0.8685)
9. Spherical Harmonics lecture, University of Virginia. https://galileoandeinstein.phys.virginia.edu/Elec_Mag/2022_Lectures/EM_18_Spherical_Harmonics.html (weight 0.7279)
