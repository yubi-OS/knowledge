# Y_3^3 Closed Form and Normalization

Scope: the degree 3, order 3 spherical harmonic in its complex and real forms, the Condon-Shortley normalization constant K = sqrt(245/(64 pi)), and the closed-form factorization Re{Y_3^3} = K sin^3(theta) cos(3 phi) used by the equation block.

## The harmonic Y_3^3 and its closed form

Spherical harmonics Y_l^m(theta, phi) are the angular portion of the solution to Laplace's equation in spherical coordinates where azimuthal symmetry is not present (weight 0.68, https://mathworld.wolfram.com/SphericalHarmonic.html). MathWorld also warns that care must be taken in identifying the notational convention being used, since theta and phi are sometimes swapped between physics and mathematics usage (weight 0.68, same URL). This matters directly for the equation block: the sampling equations there use the physics convention, theta as polar angle and phi as azimuth, and the SHTOOLS reference documentation follows the same reading where the harmonic is a function of the polar and azimuthal angles (weight 0.79, https://shtools.github.io/SHTOOLS/pyspharm_lm.html).

The specific member Y_3^3 has degree l = 3 and order m = 3. Reference tables list the explicit spherical harmonics up to degree 6 in terms of the angular coordinates theta and phi, as well as in terms of the directional cosines x, y, z (weight 0.37, https://www.quanty.org/physics_chemistry/orbitals/y). The m = l member of any degree has the simplest azimuthal structure: its complex form is proportional to sin^l(theta) e^{i l phi}. For l = m = 3 this gives Y_3^3(theta, phi) = K sin^3(theta) e^{i 3 phi}, which is the form the source equation block adopts. This factorization is also visible in the standard orthonormalized tables that employ the Condon-Shortley phase up to each degree (weight 0.26, https://en.wikipedia.org/wiki/Table_of_spherical_harmonics). Weak backing note: the two table sources above carry jev weights below 0.5, so the l = m proportionality should be re-checked against a primary reference such as the NIST DLMF before being lifted verbatim into the paper.

Taking the real part replaces the complex exponential with its cosine: Re{Y_3^3}(theta, phi) = K sin^3(theta) cos(3 phi). This is the real form the equation block modulates the embedding with. Real-valued equivalents of the complex harmonics are a standard alternative convention; the spharpy documentation defines the real basis as the real valued equivalent of the complex valued spherical harmonics, corresponding to the N3D normalization with the Condon-Shortley phase term excluded (weight 0.55, https://spharpy.readthedocs.io/en/latest/theory/spherical_harmonic_definition.html). That exclusion is exactly the kind of convention fork the source block flags as a substitution point.

## The normalization constant

The source block fixes K = sqrt(245/(64 pi)) = sqrt(35 * 7 / (64 pi)) under the Condon-Shortley convention. The constant is the orthonormalization factor obtained by integrating the squared modulus of the harmonic over the unit sphere; one worked derivation obtains the normalization constant of the spherical harmonics by integrating the product of two associated Legendre functions (weight 0.40, http://physicspages.com/pdf/Quantum%20mechanics/Spherical%20harmonics%20-%20normalization.pdf). Weak backing note: this derivation page scores below 0.5, so treat it as pedagogical support, not primary authority.

The Condon-Shortley phase is the factor of (-1)^m that occurs in some definitions of the spherical harmonics to compensate for the lack of inclusion of this factor in the definition of the associated Legendre polynomials (weight 0.40, https://mathworld.wolfram.com/Condon-ShortleyPhase.html). SHTOOLS makes the convention an explicit parameter: its spharm_lm function appends the Condon-Shortley phase of (-1)^m when a flag is set to -1 (weight 0.79, https://shtools.github.io/SHTOOLS/pyspharm_lm.html). A quantum chemistry manual likewise notes that a Condon-Shortley phase can be added to the real spherical harmonics based on the developers' choice (weight 0.48, https://fhi-aims.org/uploads/manual/A10/index.html). The practical lesson for the equation block is that K is convention-bound: if the consuming paper defines its harmonics without the phase, the sign and normalization must be re-derived rather than silently inherited.

## Geometric reading of the factors

Because the harmonics are functions on the unit sphere, lecture treatments visualize them as contour balls with contours of constant squared modulus of the real part (weight 0.70, https://bingweb.binghamton.edu/~suzuki/QuantumMechanicsII/4-9_Spherical_harmonics.pdf). For Y_3^3 the two factors separate cleanly:

1. sin^3(theta) vanishes at the poles and peaks near the equator, so the radial modulation is zero at the poles and maximal in the equatorial band.
2. cos(3 phi) folds 3-fold rotational symmetry into the embedding: it repeats every 2 pi / 3 in azimuth.

The eigenfunction framing is standard: the harmonics' role as simultaneous eigenstates of the angular momentum operators L^2 and L_z is the textbook route to their functional forms (weight 0.58, https://phys.libretexts.org/Bookshelves/Quantum_Mechanics/Introductory_Quantum_Mechanics_(Fitzpatrick)/07%3A_Orbital_Angular_Momentum/7.06%3A_Spherical_Harmonics).

## Constraints inherited by the equation block

1. The sin^3(theta) cos(3 phi) factorization is specific to l = m = 3. Swapping in another Y_l^m requires re-deriving its closed-form real part; the factorization does not transfer.
2. K is fixed by the Condon-Shortley convention. Dropping the phase or choosing a different normalization changes K and is a visible, named substitution, not a silent one.
3. The real form Re{Y_3^3} equals the complex form times a phase convention choice; both encode the same angular structure, so either may back the paper's equations as long as the convention is stated once.
