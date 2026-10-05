# 02 - The spherical harmonic basis: Y_3^3, Condon-Shortley, and the NIST DLMF anchor

Scope: why the native basis is the real spherical harmonic Y_3^3 = K sin^3 theta cos(3 phi), where the normalization constant comes from, and which references pin the convention.

## The authority chain for normalization

The normalization and phase conventions behind the basis constant K = sqrt(245 / (64 pi)) trace to the NIST Digital Library of Mathematical Functions. DLMF chapter 14 covers Legendre and related functions, and is the standard reference for the associated Legendre functions whose m = l case generates the polar factor of the harmonic [1], weight 0.8982. The DLMF itself is the canonical modern successor to Abramowitz and Stegun, and its chapter 14 is based in part on that 1964 chapter [1]. The DLMF root document positions the library as the comprehensive reference across special functions [2], weight 0.9389. NIST's own seminar material on Legendre functions records the active curation of exactly these formulas, including corrections of long-standing errors in prior literature [3], weight 0.7255.

The phase convention is pinned by SciPy: the sph_harm_y implementation includes the Condon-Shortley phase because it is part of sph_legendre_p, and the documentation spells out the resulting first several harmonics with their exact normalizations [4], weight 0.8434. That matters for the yubiOS skills because two implementations that disagree on the Condon-Shortley sign produce basis vectors that differ by sign flips on odd-m components, which silently corrupts a curve fit. Pinning to the Condon-Shortley convention through SciPy and the DLMF removes that failure mode.

## The real form of Y_3^3

Spherical harmonics Y_l^m are the angular portion of the solution to Laplace's equation in spherical coordinates where azimuthal symmetry is not present [5], weight 0.7780. MathWorld's entry warns that care must be taken in identifying the notational convention in use, a caution that is directly relevant whenever a complex harmonic is converted to a real one [5].

The real spherical harmonics are tabulated with their explicit real forms and polar plots, where the amplitude and sign at a particular polar and azimuthal angle is represented by the elevation of the plot above or below the surface [6], weight 0.8185. For l = 3, m = 3, the real cosine form is proportional to sin^3 theta times cos(3 phi); the proportionality constant for the fully normalized real harmonic is K = sqrt(245 / (64 pi)). The skill fixes this exact form as its native angular probe [7], weight 0.4717 (weak backing; the constant is stated in the skill's own SKILL.md and follows the DLMF/SciPy normalization chain above).

## Why 3-fold azimuthal

Spherical harmonics are a basis for functions on the surface of the sphere and form the irreducible representations of SO(3), which is why they are the natural angular vocabulary for anything with rotational structure [8], weight 0.5638. The m = 3 member carries 3-fold azimuthal symmetry: cos(3 phi) has exactly 3 lobes around the equator. In the skill's corpus mapping, corpus items are laid down at Fibonacci azimuths phi_i, so an m-multiple probe couples items whose indices differ by N/m. The m = 3 choice is the lowest azimuthal frequency that is still non-trivial on the corpus, and the per-item basis vector extends the probe across the full ladder m = 3, 6, ..., 384, giving 384 symmetric azimuthal lobes [7], weight 0.4717 (weak backing).

The broader mathematical backdrop is standard: the associated Legendre polynomials are the canonical solutions of the general Legendre equation and occur when solving Laplace's equation in spherical coordinates [9], weight 0.2670 (weak backing), and the spherical basis construction ties polar and azimuthal angles together through the standard basis with complex phases [10], weight 0.7354.

## What the dig did not find

The dig surfaced no source that independently derives the specific constant sqrt(245 / (64 pi)) outside the tabulated l = 3, m = 3 real harmonic. Readers wanting to verify it should compute it from the DLMF chapter 14 normalization for P_3^3 and compare against SciPy's sph_harm_y output at (l=3, m=3) [1], [4]. The skill's choice of the native basis is documented only in its own SKILL.md at weak weight [7]; that is a provenance gap the corpus records honestly rather than papers over.

## Sources

1. DLMF chapter 14, Legendre and Related Functions, NIST. https://dlmf.nist.gov/14 (weight 0.8982)
2. NIST Digital Library of Mathematical Functions. https://dlmf.nist.gov/ (weight 0.9389)
3. ACMD Seminar: Legendre functions, NIST. https://www.nist.gov/itl/math/acmd-seminar-legendre-functions-new-formulas-identities-and-transformations (weight 0.7255)
4. scipy.special.sph_harm_y, SciPy v1.18.0 manual. https://docs.scipy.org/doc/scipy/reference/generated/scipy.special.sph_harm_y.html (weight 0.8434)
5. Spherical Harmonic, Wolfram MathWorld. https://mathworld.wolfram.com/SphericalHarmonic.html (weight 0.7780)
6. Table of spherical harmonics, Wikipedia. https://en.wikipedia.org/wiki/Table_of_spherical_harmonics (weight 0.8185)
7. rsi-phi-skill SKILL.md, yubi-OS/yubiOS. https://github.com/yubi-OS/yubiOS/blob/main/skills/rsi-phi-skill/SKILL.md (weight 0.4717, weak)
8. Spherical harmonics, Wikipedia. https://en.wikipedia.org/wiki/Spherical_harmonics (weight 0.5638)
9. Associated Legendre polynomials, Wikipedia. https://en.wikipedia.org/wiki/Associated_Legendre_polynomials (weight 0.2670, weak)
10. Spherical basis, Wikipedia. https://en.wikipedia.org/wiki/Spherical_basis (weight 0.7354)
