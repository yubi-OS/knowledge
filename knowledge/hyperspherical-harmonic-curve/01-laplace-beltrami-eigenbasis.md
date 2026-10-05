# 01 - Laplace-Beltrami Eigenbasis

Scope: the canonical hyperspherical harmonic basis for L2(S^N), eigenfunctions of the Laplace-Beltrami operator with eigenvalues -l(l+N-1), orthonormality, and why a canonical rather than learned basis shrinks parameter count at equal expressive power.

## The operator on the sphere

The spherical Laplacian is the Laplace-Beltrami operator on the (n-1)-sphere equipped with its canonical metric of constant sectional curvature 1, viewed as the unit sphere isometrically embedded in R^n (https://en.wikipedia.org/wiki/Laplace%E2%80%93Beltrami_operator, weight 0.82). This is the differential operator whose spectrum defines the hyperspherical harmonic basis. The Laplace operator in general is the divergence of the gradient of a scalar field, and its form on a curved manifold follows from the metric (https://handwiki.org/wiki/Laplace_operator, weak backing, weight 0.34).

## Spherical harmonics as eigenfunctions

Spherical harmonics, as functions on the sphere, are eigenfunctions of the Laplace-Beltrami operator; the classical set introduced by Pierre-Simon de Laplace in 1782 forms an orthogonal system basic to expanding general functions on the sphere (https://en.wikipedia.org/wiki/Spherical_harmonics, weight 0.52). A derivation-first treatment constructs spherical harmonics as eigenfunctions of the Laplace-Beltrami operator starting from first principles and establishes orthonormality and completeness in L2(S2) (https://simonrs.com/eulercircle/irpw2025/palaash-sphharm-paper.pdf, weight 0.77). On the 2-sphere the eigenvalue attached to degree l is l(l+1); the yubiOS design record generalizes this to S^N with eigenvalues -l(l+N-1), which reduces to l(l+1) at N=2 (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05).

The eigenfunction view is not specific to the sphere: hierarchical function bases defined by Laplace-Beltrami eigenfunctions apply to general objects, and reduce to classical spherical harmonics exactly when the object is a sphere (https://graphics.stanford.edu/courses/cs233-20-spring/ReferencedPapers/understand_geometry_01631196.pdf, weight 0.83). This is why the same machinery ports from S2 to S3 and beyond: the operator, not the coordinate chart, defines the basis.

## The hyperspherical (S^N) case

Hyperspherical harmonics extend the construction to higher-dimensional spheres and carry properties and applications across quantum many-body theory (https://link.springer.com/content/pdf/10.1007/978-94-011-0852-2_6.pdf?pdf=preview, weight 0.90). Numerically, there is a developed method to build an orthonormal basis of properly symmetrized hyperspherical harmonic functions, including refined algorithms for the transformation coefficients between bases built from different coordinate conventions (https://www.sciencedirect.com/science/article/pii/S0010465520300333, weight 0.83). That coefficient machinery matters in practice: a "hyperspherical harmonic" is not one canonical object until a coordinate convention is pinned, and transformation coefficients are how implementations interoperate.

For explicit computational bases beyond the standard constructions, practitioners still ask which orthogonal bases of harmonic polynomials are "nice" to compute with; the question is open-ended enough that MathOverflow discussion treats explicitness as a real cost (https://mathoverflow.net/questions/384337/is-there-a-nice-orthogonal-basis-of-spherical-harmonics, weak backing, weight 0.24).

## Why canonical beats learned for a Stage-1 fit

The yubiOS design record fixes the basis to the Laplace-Beltrami eigenbasis and learns only a reparameterization on top of it (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05). The externally grounded rationale is structural: the eigenbasis is determined by the geometry, so no parameters are spent discovering it, and the spectrum is directly verifiable because the eigenvalues are known in closed form. A learned basis would spend parameters on reproducing functions that are already available analytically, and it would remove the spectral signature (eigenvalues as a fingerprint of the fit) that the design uses as a check.

Parameter counts from the design record make this concrete: 6532 parameters at S2/L=3 with the Moebius reparameterization enabled, against 31496 for the incumbent flat Fourier surface at k=4 (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05). The design record itself cautions that the smaller count is a truncation choice at equal degree, not a dividend paid by curvature (same record).

## Fit-validation surface

The design pins a pre-fit test on the basis implementation itself: epsilon_basis below 1e-3 on a 4096-point Monte Carlo sample on S2, checked before any fit is attempted (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05). The point is that basis-implementation errors (wrong phase convention, wrong argument order) are silent under fitting: the fit will still converge, just onto a rotated or sign-flipped basis. Pre-fit validation is what keeps that failure class out of the pipeline. Doc 06 covers the software-level pitfalls that make this check necessary.
