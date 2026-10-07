# 01 Basis on the sphere

Scope: the hyperspherical-harmonic basis on S2 (default) and gated S^N as the representation that replaces curve-guided-rsi's flat 2-D Fourier surface, and the basis-library contract that pins it.

## The swap the skill makes

The source doc (yubi-OS/yubiOS skills/hyperspherical-harmonic-curve/SKILL.md, cycle 1) defines the variant as a Stage-1 swap: curve-guided-rsi represents a corpus as a flat 2-D Fourier surface over PC1+PC2 on the unit square [0,1]^2; this variant replaces that surface with a hyperspherical-harmonic basis on S2 by default, with S^N available but gated, and adds a learned Moebius reparameterization of the domain. The frontmatter description states the pitch directly: sphere geometry instead of flat 2-D Fourier, fewer parameters, and a measured delta at both phases of the fitness test (source doc, frontmatter). N=2 was made the default by advisor revision 3 (source doc, cycle 1).

## Why spherical harmonics fit this role

Spherical harmonics are a complete set of orthogonal functions on the sphere surface, so functions defined on the sphere can be written as a sum of them (weakly backed: https://en.wikipedia.org/wiki/Spherical_harmonics, jev weight 0.45). They are also the standard smooth, orthogonal, symmetry-adapted basis for expanding functions on a sphere, used routinely in computer graphics and signal processing (weakly backed: https://arxiv.org/pdf/2302.08381v1, jev weight 0.47). The real form matters for implementation: real spherical harmonics are described as the most adequate basis functions where symmetry is important because they map directly onto irreducible representations (source: https://docs.abinit.org/theory/spherical_harmonics/, jev weight 0.56). Tutorial-level sources describe the same object: Y_lm are the eigenfunctions of the angular operators on the unit sphere, normalized so the integral of one times the conjugate of another is the Kronecker delta (weakly backed: https://giophysics.com/university-physics/topics/spherical-harmonics-angular-basis/, jev weight 0.17).

For the corpus-audit use case this gives three properties the flat Fourier surface does not: a bounded domain with no artificial edges (the unit square has corners and edges the corpus points cluster against), a natural notion of area for the Stage-2 partition, and a spectral decomposition by degree that the verification gates can measure directly.

## The basis-library contract

The source doc pins the basis implementation with a unit test. Cycle 1 shipped the basis as library-pinned with an epsilon_basis unit test (source doc, cycle 1, advisor revision 8 froze degree weights as non-learnable). The first implementation used scipy's sph_harm_y, which carried a sign-convention bug; cycle 3 replaced it with an explicit construction using Legendre functions plus cos(m phi) and sin(m phi) factors (source doc, cycle 3). The epsilon_basis test itself was found buggy in the same cycle: it compared the Gram matrix G to the identity instead of comparing G scaled by 1/(4 pi) to the identity, so a correct orthonormal basis failed the test with max deviation 0.92; after the correction the max deviation is 0.0163 on 32768 Monte Carlo samples (source doc, cycle 3). The lesson the skill encodes: when a basis unit test fails, check the test's normalization convention before rewriting the basis.

## Degree structure as a measurable

Because the basis decomposes by degree l, the fitted coefficient tensor has a degree spectrum the skill turns into two gates: the spectral-mass gate requires rho >= 0.10, measured at 0.9774 and 0.9830 on the two phases, and the high-degree mass gate requires <= 0.40, measured at 0.2059 and 0.1782 (source doc, cycle 3). The physics convention behind such a spectrum is the angular power spectrum, which quantifies how much correlation power sits at each angular scale l (weakly backed: https://wwwmpa.mpa-garching.mpg.de/~komatsu/presentation/imprs2020-4.pdf, jev weight 0.46). High-degree mass is the sphere analogue of high-frequency energy in a flat Fourier expansion: too much of it means the fit is chasing noise in individual file placements rather than corpus-level structure.

## What stays flat

The swap is Stage-1 only. The upstream pipeline that produces the points on the sphere, the Stage-2 equal-area partition, and the Stage-3 atom dispatches are unchanged; doc 06 covers that pipeline and doc 05 covers the partition.
