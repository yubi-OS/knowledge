# Harmonic Radial Modulation of the Embedding

Scope: the third equation, x_i = (1 + alpha Re{Y_3^3}(theta_i, phi_i)) u_i, the single tunable scalar alpha, and the precedent for using spherical harmonics as radial shape modulations.

## The modulation equation

The final equation of the block scales each unit-sphere point by (1 + alpha Re{Y_3^3}): the radius stays close to 1 while a harmonic ripple of amplitude alpha is laid over the sphere. Because Re{Y_3^3} = K sin^3(theta) cos(3 phi), the radial profile is 1 + alpha K sin^3(theta) cos(3 phi): zero displacement at the poles, maximal displacement in the equatorial band, and 3-fold rotational symmetry in azimuth. Plotting the resulting x_i sequence in 3-D shows directly how the latent curve interacts with the harmonic, since the curve now lives on a perturbed S^2 whose radial profile is the harmonic itself.

The single new parameter is alpha. For alpha = 0 the embedding reduces to the standard unit-sphere projection x_i = u_i, the no-modulation baseline. For small alpha the curve stays on S^2 to within O(alpha) radially; for large alpha the embedding becomes a Y_3^3-shaped perturbation of the sphere. The ablation knob is one line of configuration, which keeps the method aligned with matched-parameter comparisons against the flat [0,1]^2 baseline.

## Precedent: harmonics as radial shape functions

The pattern of using spherical harmonics as radial modulations of a sphere is well established in the applied literature, and the dig surfaced three primary-grade examples.

Morphological decomposition with spheroidal harmonics notes that the value of the radial coordinate is invariant to the basis functions for surface shape morphology, with the spheroidal framework reducing to the traditional spherical polar coordinates as the eccentricity parameter goes to zero (weight 0.70, https://www.sciencedirect.com/science/article/pii/S0950061824041096). This is the same division of labor the block uses: angles carry the position on the sphere, harmonics carry the shape.

Surface reconstruction studies reconstruct particle shapes with spherical harmonics in both spherical and Cartesian coordinate systems and mesh the reconstructed surface for downstream finite-discrete-element simulation (weight 0.69, https://www.sciencedirect.com/science/article/pii/S1674775521001402). The reconstruction recipe, radius as a harmonic expansion over direction, is precisely the block's radial profile read in reverse.

Deformation analysis expands the shape of a deformed bead into spherical harmonics, with coefficients deduced from the boundary conditions of the problem (weight 0.73, https://pmc.ncbi.nlm.nih.gov/articles/PMC10938078/). The block is the same mathematics with the coefficients reduced to a single amplitude alpha times one fixed harmonic.

A tutorial on higher-order gravitational models frames the general principle: real celestial bodies deviate significantly from spherical, and the deviations are captured by harmonic expansions of the potential (weight 0.57, https://arxiv.org/html/2601.17628v1). The block borrows the direction of the idea, harmonics as structured departures from a sphere, but applies it to an embedding geometry rather than a potential field.

## Coordinate conventions the equation must pin

The modulation is written in spherical coordinates, so the convention matters. The standard spherical coordinate system uses radial distance r, polar angle, and azimuthal angle, with the caveat that the meanings of theta and phi are swapped in some communities compared to the physics convention (weight 0.82, https://en.wikipedia.org/wiki/Spherical_coordinate_system). The block follows the physics reading, theta as polar angle and phi as azimuth, consistently with the sampling equation and the Y_3^3 closed form. The paper should state this once, since the Wikipedia source itself documents that the swap is common enough to cause real confusion.

## Why one harmonic and one scalar

Three reasons the block reduces the modulation to alpha times Re{Y_3^3}:

1. Parameter economy. One scalar keeps the ablation suite matched-parameter by construction; adding harmonic coefficients would multiply the knobs.
2. Symmetry as a feature. cos(3 phi) gives the embedding an exact 3-fold rotational symmetry for free. If the downstream loss or visualization has matching structure, this is a free prior; if not, it is a constraint the fitter must learn around, and alpha = 0 turns it off entirely.
3. Verifiability. With a single fixed harmonic, the embedding's radial profile is a closed-form expression a reader can plot or check numerically in one line, which supports the block's goal of being a drop-in methods artifact.

## Constraints inherited by the equation block

1. The ripple is radial only. The modulation never moves points tangentially; u_i direction is untouched, so the scheme composes with any angular sampling without re-deriving it.
2. alpha scales a normalized harmonic, so its natural scale is set by K = sqrt(245/(64 pi)); a paper changing the normalization convention changes the effective ripple magnitude and must say so.
3. The alpha = 0 limit must reproduce the plain projection exactly, both in code and in the ablation tables; any extra side effect of the modulation path at alpha = 0 is a bug.
