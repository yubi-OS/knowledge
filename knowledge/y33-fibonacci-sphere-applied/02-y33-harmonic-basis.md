# The Y_3^3 Harmonic Basis

Scope: the Y_3^3 spherical harmonic itself, its closed real form Re{Y_3^3} = K sin^3 theta cos(3 phi), the Condon-Shortley normalization, the 3-fold azimuthal symmetry, and why the applied machinery treats it as an angular probe rather than a radial factor.

## What Y_3^3 is

The spherical harmonics Y_l^m(theta, phi) are the angular portion of the solution to Laplace's equation in spherical coordinates; MathWorld's entry notes that care is required with conventions, taking theta as the polar (colatitudinal) coordinate and phi as the azimuthal one (https://mathworld.wolfram.com/SphericalHarmonic.html, weight 0.74). Spherical harmonics form an orthogonal system and are the standard basis for expanding general functions on the sphere (https://en.wikipedia.org/wiki/Spherical_harmonics, weight 0.84 from the doc 03 dig; the doc 02 dig returned the same URL at weight 0.15, a reminder that batch weighting is context-sensitive).

Y_3^3 is the member with degree l = 3 and order m = 3. Its complex form is proportional to sin^3 theta times e^(i 3 phi). Taking the real part gives Re{Y_3^3}(theta, phi) = K sin^3 theta cos(3 phi) with the Condon-Shortley normalization constant K = sqrt(245/(64 pi)). This closed real form is exactly what the applied equation block writes inline (internal ref: refs/y33-fibonacci-sphere-paper-method-equation-block-2026-08-07.md). The physics reference material grounds the ingredients: LibreTexts covers the properties and functional forms of spherical harmonics, including their role as simultaneous eigenstates of the angular momentum operators (https://phys.libretexts.org/Bookshelves/Quantum_Mechanics/Introductory_Quantum_Mechanics_(Fitzpatrick), weight 0.86), and the UCSC lecture notes state that spherical harmonics are linearly independent and complete (https://scipp-legacy.pbsci.ucsc.edu/~haber/ph116C/SphericalHarmonics_12.pdf, weight 0.72).

## The Condon-Shortley phase and normalization

The phase factor (-1)^m that appears in some definitions is the Condon-Shortley phase; MathWorld notes it compensates for its absence in some associated Legendre polynomial definitions (https://mathworld.wolfram.com/Condon-ShortleyPhase.html, weight 0.61). The UCSC notes add that the phase factor was introduced originally by Condon and Shortley, is convenient in quantum mechanics, and that the normalization is chosen so the harmonics are normalized to one (https://scipp-legacy.pbsci.ucsc.edu/~haber/ph116C/SphericalHarmonics_12.pdf, weight 0.72). The applied equation block pins K = sqrt(245/(64 pi)) as the standard constant and marks it as the single substitution point if a downstream document uses a different convention (internal ref: refs/y33-fibonacci-sphere-paper-method-equation-block-2026-08-07.md).

## The 3-fold azimuthal structure

Because the phi dependence is cos(3 phi), the real form repeats every 2 pi / 3: the embedding is invariant under a 120 degree rotation in azimuth. This is the 3-fold rotational symmetry the applied synthesis leans on; the revised passage's operational rule names Y_3^3 the angular probe for exactly this reason (internal ref: refs/y33-fibonacci-sphere-applied-2026-08-07.md). The rotation-group view backs the framing: the deeper structure of spherical harmonics comes from the rotation group, with the addition theorem following from their transformation properties under rotations (https://scipp-legacy.pbsci.ucsc.edu/~haber/ph116C/SphericalHarmonics_12.pdf, weight 0.64, from the doc 04 dig).

The separation of roles matters operationally: sampling (which nodes) and probing (what is evaluated at each node) are different primitives sitting at different levels of the diagnostic stack. The revised passage's quick tip states it directly: use Fibonacci points for sampling, use Y_3^3 for the angular probe (internal ref: refs/y33-fibonacci-sphere-paper-revised-passage-2026-08-07.md).

## Angular probe, not radial variation

The revised passage exists because the original paper text left the angular-versus-radial role of Y_3^3 implicit. The explicit identity Y_3^3(theta, phi) proportional to sin^3 theta e^(i 3 phi) names the angular contribution: sin^3 theta is the polar envelope, e^(i 3 phi) is the azimuthal carrier (internal refs: refs/y33-fibonacci-sphere-applied-2026-08-07.md and refs/y33-fibonacci-sphere-paper-revised-passage-2026-08-07.md). The polar envelope has consequences downstream: sin^3 theta vanishes at the poles and peaks near the equator, which is exactly what the 384-D variant testing in doc 06 turns on.

## Swap discipline

The equation-block constraints forbid silently substituting another Y_l^m: the sin^3 theta and cos(3 phi) factorization is Y_3^3-specific, so any other (l, m) requires re-deriving the closed real part (internal ref: refs/y33-fibonacci-sphere-paper-method-equation-block-2026-08-07.md).

## Sources considered

| source | weight |
|---|---|
| https://phys.libretexts.org/Bookshelves/Quantum_Mechanics/Introductory_Quantum_Mechanics_(Fitzpatrick) | 0.86 |
| https://mathworld.wolfram.com/SphericalHarmonic.html | 0.74 |
| https://scipp-legacy.pbsci.ucsc.edu/~haber/ph116C/SphericalHarmonics_12.pdf | 0.72 |
| https://mathworld.wolfram.com/Condon-ShortleyPhase.html | 0.61 |
| https://en.wikipedia.org/wiki/Spherical_harmonics | 0.15 (weak in this dig; 0.84 in doc 03 dig) |
| https://physics.stackexchange.com/questions/301688/why-do-we-need-the-condon-shortley-phase-in-spherical-harmonics | 0.28 (weak, not cited) |
| https://georgeweigt.github.io/examples/spherical-harmonics.pdf | 0.27 (weak, not cited) |
| https://citizendium.org/wiki/Spherical_harmonics | 0.07 (weak, not cited) |
