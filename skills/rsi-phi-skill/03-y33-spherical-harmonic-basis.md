# 03 The native Y_3^3 basis

Scope: the real spherical harmonic Y_3^3 as the per-item basis function: closed form, normalization constant, 3-fold azimuthal probe, and the convention hazards around Condon-Shortley.

## The closed form

The source doc (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/rsi-phi-skill/SKILL.md) defines the native basis as:

Re{Y_3^3(theta, phi)} = K sin^3 theta cos(3 phi), with K = sqrt(245/(64 pi)).

It names this the Condon-Shortley normalization and calls the dlmf.nist.gov convention the standard reference (source doc). Three properties matter (source doc):

1. The sin^3 theta factor vanishes at the poles and peaks near the equator, so the probe is equatorial-weighted.
2. The cos(3 phi) factor folds a 3-fold azimuthal structure into the embedding: the probe detects 3-lobed phase patterns around the equator.
3. The factorization sin^3 theta cos(3 phi) is (l=3, m=3)-specific. Constraint 3 forbids swapping Y_3^3 for another Y_l^m without re-deriving the closed-form real part (source doc).

## The convention landscape (external evidence)

Spherical harmonics Y_l^m are the angular portion of the solution to Laplace's equation in spherical coordinates where azimuthal symmetry is absent (https://mathworld.wolfram.com/SphericalHarmonic.html, high, w=0.53). The Condon-Shortley phase is the factor (-1)^m that some definitions include and others leave out (https://mathworld.wolfram.com/Condon-ShortleyPhase.html, weak, w=0.31).

The two most-used libraries disagree by default, which is exactly the hazard the source doc's constraint 2 guards against:

- SciPy's sph_harm includes the Condon-Shortley phase because it is part of the underlying associated Legendre function lpmv (https://docs.scipy.org/doc/scipy-1.2.1/reference/generated/scipy.special.sph_harm.html, high, w=0.64).
- pyshtools (SHTOOLS) uses by default 4-pi-normalized real spherical harmonics that exclude the Condon-Shortley phase factor, with Schmidt semi-normalized and orthonormalized variants available (https://shtools.github.io/SHTOOLS/real-spherical-harmonics.html, high, w=0.55).

Wikipedia's table of spherical harmonics lists orthonormalized harmonics that employ the Condon-Shortley phase up to degree l (https://en.wikipedia.org/wiki/Table_of_spherical_harmonics, weak, w=0.41), and its main spherical-harmonics article notes they are basis functions for irreducible representations of SO(3) (https://en.wikipedia.org/wiki/Spherical_harmonics, weak, w=0.28 to 0.41 across queries).

Drift note (dated 2026-10-08, dig-based): the source doc pins K = sqrt(245/(64 pi)) under the Condon-Shortley convention and cites dlmf.nist.gov as the standard. The dig confirms the convention split is real and live in tooling (SciPy includes the phase, SHTOOLS excludes it by default). Implementers who port the basis into a library must check which side of the split the library sits on before trusting a numeric comparison.

## Role in the pipeline

In the per-cycle re-map, the coverage vectors are projected to S2 via PCA top-2 then stereographic lift, and the latent curve gamma(t) is fit on the real SH basis with L=3 (16 functions) and closed-form ridge lambda = 1e-3 (source doc). The native Y_3^3 is the seed of that basis: the default per-item basis vector extends it by enumerating higher azimuthal orders while keeping the sin^3 theta polar factor (source doc, see doc 04).

The source doc's own changelog records why the basis section exists: cycle 1 of its self-mode run hypothesized that the native (l=3, m=3) basis under-fills the 384-D embedding because the loop only sees phase coherence in 3 lobes, not 384, and the fix was to add the per-item basis vector section with the (l, m) lobe enumeration (source doc).

## What the dig did not find

No dig result independently restates the K = sqrt(245/(64 pi)) constant for Y_3^3. The constant is therefore carried as a source-doc claim only. That is acceptable under the corpus rules (the source doc is the primary source of record), but any reader verifying the number should go to the DLMF spherical-harmonics chapter named by the source doc rather than to a secondary web page.
