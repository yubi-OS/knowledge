# 03 - Y_3^3 as the angular probe

## Scope

The Y_3^3 spherical harmonic, the identity Y_3^3 proportional to sin^3 theta e^{i3 phi}, its 3-fold azimuthal structure, and its role as an angular probe rather than a radial variation.

## The identity

For spherical harmonics Y_l^m(theta, phi), the m index controls azimuthal structure through the factor e^{i m phi}, and the theta dependence comes from the associated Legendre function P_l^m. For l = m = 3 the harmonic is sectoral (l = |m|), and the associated Legendre factor P_3^3 is proportional to (1 - cos^2 theta)^{3/2} = sin^3 theta, giving the form the revised passage uses: Y_3^3(theta, phi) proportional to sin^3 theta e^{i3 phi}. NIST's DLMF section 14.30 is the canonical reference for spherical and spheroidal harmonics, defining the tesseral, sectorial, and zonal families (weight 0.96, https://dlmf.nist.gov/14.30). A 2025 arxiv paper formalizes the trichotomy: the spherical harmonics Y_l^m fall into three families, sectoral (l = |m|), tesseral (l > |m| > 0), and zonal (m = 0), which exhibit fundamentally different structure (weight 0.84, https://arxiv.org/pdf/2512.20119). Y_3^3 sits in the sectoral family, the family whose theta factor is a pure power of sin theta.

MathWorld describes the harmonics as the angular portion of the solution to Laplace's equation in spherical coordinates where azimuthal symmetry is not present (weight 0.53, https://mathworld.wolfram.com/SphericalHarmonic.html). The Wikipedia treatment adds that the harmonics form a complete orthogonal set and thus an orthonormal basis, with a table of common low-degree members (weight 0.77, https://en.wikipedia.org/wiki/Spherical_harmonics). Physics LibreTexts covers the properties and functional forms of Y_{l,m}(theta, phi) as simultaneous eigenstates of angular momentum operators (weight 0.77, https://phys.libretexts.org/Bookshelves/Quantum_Mechanics/Introductory_Quantum_Mechanics_(...)).

## What "angular probe" means

The revised passage's rule is that Y_3^3 is an angular probe, not a radial variation. Concretely: the harmonic depends only on the direction (theta, phi) of a point on S^2, not on any radius. The e^{i3 phi} factor means the probe oscillates 3 times per full turn in azimuth; the sin^3 theta factor means it vanishes at both poles and peaks at the equator. A function evaluated with this harmonic is therefore sensitive to 3-fold azimuthal structure and blind to radial structure. If the paper's curve has a genuine 3-fold pattern in azimuth, Y_3^3 evaluated on a well-spread node set will register it; if the pattern is radial, this probe returns nothing, which is the desired specificity.

## Convention caveats worth writing down

Two convention traps are documented and matter for anyone implementing the probe. SciPy's sph_harm_y documentation notes it is common to see the opposite convention, theta as the azimuthal angle and phi as the polar angle, and that SciPy's spherical harmonics include the Condon-Shortley phase (weight 0.81, https://docs.scipy.org/doc/scipy/reference/generated/scipy.special.sph_harm_y.html). The revised passage follows the physics convention theta = polar, phi = azimuthal; a SciPy port must map arguments accordingly and account for the Condon-Shortley phase sign, which flips the overall sign for odd m. None of this changes the probe's magnitude structure, but a sign flip will break any comparison against a hand-rolled e^{i3 phi} implementation.

The artifact's claim that this identity makes the angular-probe role unambiguous is from the source doc (yubi-OS/yubiOS refs/y33-fibonacci-sphere-paper-revised-passage-2026-08-07.md, artifact-internal); the underlying functional form and its families are grounded in DLMF, the sectoral-tesseral-zonal classification paper, and the references above.

## Sources

- https://dlmf.nist.gov/14.30 (weight 0.96)
- https://arxiv.org/pdf/2512.20119 (weight 0.84)
- https://docs.scipy.org/doc/scipy/reference/generated/scipy.special.sph_harm_y.html (weight 0.81)
- https://en.wikipedia.org/wiki/Spherical_harmonics (weight 0.77)
- https://phys.libretexts.org/Bookshelves/Quantum_Mechanics/Introductory_Quantum_Mechanics_(...) (weight 0.77)
- https://mathworld.wolfram.com/SphericalHarmonic.html (weight 0.53)
