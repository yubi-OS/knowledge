# 01 - Paper structure and the insertion point

## Scope

The paper's hyperspherical-harmonic curve replaces a flat parameter manifold with the Riemann sphere S^2, and the hyperspherical-harmonic section is the natural insertion point for a sampling scheme that avoids pole clustering. This doc grounds both halves of that claim: why S^2 is the manifold, and why spherical harmonics make that section the right host for a sampling-side edit.

## Why the Riemann sphere is the manifold

A parameter manifold is the space the model's free parameters live on. A flat [0,1]^2 domain has no curvature and no distinguished directions; the sphere S^2 is compact, has no boundary, and carries a natural angular coordinate system. In complex analysis the Riemann sphere is the compactification of the complex plane, the sphere at infinity for hyperbolic 3-space, and the carrier of the conformal dynamical systems studied in Harvard's course notes (weight 0.76, https://people.math.harvard.edu/~ctm/papers/home/text/class/notes/rs/course.pdf). Choosing S^2 as a parameter manifold therefore buys compactness and a group of symmetries that a flat square does not have.

The trade-off is angular: every point on S^2 needs a theta and a phi coordinate, and any scheme that walks theta from 0 to pi in uniform steps bunches points near the poles. That is exactly the failure mode the source artifact targets.

## Why the hyperspherical-harmonic section hosts the edit

Spherical harmonics are the standard orthonormal basis of square-integrable functions on S^2 (weight 0.77, https://en.wikipedia.org/wiki/Spherical_harmonics). They play the same role on the sphere that sines and cosines play for periodic signals: low degrees capture smooth global structure, high degrees capture fine angular detail (weight 0.67, https://mtex-toolbox.github.io/SphericalHarmonics.html). MathWorld states the classical form: Y_l^m(theta, phi) are the angular portion of the solution to Laplace's equation in spherical coordinates where azimuthal symmetry is not present (weight 0.54, https://mathworld.wolfram.com/SphericalHarmonic.html). Ohio University's user guide makes the analogy literal: Fourier series on the circle become spherical harmonics on the sphere S^2 in R^3 (weight 0.68, http://www.ohiouniversityfaculty.com/mohlenka/research/uguide.pdf). Penn's lecture notes develop the same basis from the circle upward, Spherical Harmonics on the Circle first, then the sphere (weight 0.69, https://www.cis.upenn.edu/~cis6100/sharmonics.pdf). UCSD geophysics notes call them some of the most ubiquitous functions in geophysics, used in gravity, geomagnetism and seismology (weight 0.60, https://www.igppweb.ucsd.edu/~parker/SIO239/sh.pdf).

The consequence for paper structure is direct. If the paper's curve is built on spherical harmonics over S^2, then every evaluation, visualization, and quadrature of that curve happens at sample points on S^2. A section that already defines the basis is the one section where a reader must know which points the basis was evaluated at. That is why the source artifact places its sampling sentence there rather than in a standalone appendix: the sampling scheme is a property of the diagnostic stack that the section itself defines.

## The artifact's insertion claim

The source artifact (yubi-OS/yubiOS refs/y33-fibonacci-sphere-paper-revised-passage-2026-08-07.md, internal to the yubiOS repo, not dig-weighted) reports that the paper's hyperspherical-harmonic section contains the sentence replacing the flat [0,1]^2 parameter manifold of equation (1) with the Riemann sphere S^2, and specifies that the fix is one sentence plus two equations inserted immediately after it. This placement claim is artifact-internal; it is checkable against the paper .tex at https://raw.githubusercontent.com/yubi-OS/yubiOS/refs/heads/main/papers/learned-latent-curves-2026-08-06.tex, which the artifact lists as the next step. Treat the placement as proposed, not yet verified against the paper text.

## Sources

- https://en.wikipedia.org/wiki/Spherical_harmonics (weight 0.77)
- https://people.math.harvard.edu/~ctm/papers/home/text/class/notes/rs/course.pdf (weight 0.76)
- https://www.cis.upenn.edu/~cis6100/sharmonics.pdf (weight 0.69)
- http://www.ohiouniversityfaculty.com/mohlenka/research/uguide.pdf (weight 0.68)
- https://mtex-toolbox.github.io/SphericalHarmonics.html (weight 0.67)
- https://www.igppweb.ucsd.edu/~parker/SIO239/sh.pdf (weight 0.60)
- https://mathworld.wolfram.com/SphericalHarmonic.html (weight 0.54)
