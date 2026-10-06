# 05 - Sampling and probe are different primitives

## Scope

The operational rule of the revised passage: Fibonacci points serve sampling, Y_3^3 serves the angular probe. They are different primitives sitting at different levels of the diagnostic stack, and they complement rather than duplicate each other.

## The rule

The artifact's quick tip states it in one line: use Fibonacci points for sampling; use Y_3^3 for the angular probe. Conflating the two is the failure mode this rule prevents. The Fibonacci lattice is a choice of node set: where on S^2 do we evaluate. The spherical harmonic is a choice of test function: what pattern do we measure at those nodes. A sampling scheme carries no information about 3-fold structure; a harmonic carries no information about coverage. Swapping one for the other is a category error, and the revised passage keeps them in separate sentences for exactly that reason.

## Grounding: why the division of labor is standard

The quadrature literature makes the same split. Beentjes' notes on sphere quadrature open by observing that approximately calculating integrals over spherical surfaces can be done by simple extensions of one-dimensional quadrature rules, but that this does not exploit the sphere's symmetry, motivating node sets and weights designed for the sphere itself (weight 0.71, https://cbeentjes.github.io/files/Ramblings/QuadratureSphere.pdf). The GEM journal paper on local numerical integration on the sphere describes applications in geomathematics and biomedical modeling that require analysis of an unknown target function from large data, modeled as data on the sphere, and develops the quadrature formulas that pair with such data (weight 0.91, https://link.springer.com/article/10.1007/s13137-014-0065-1). In both cases the two decisions, where to sample and what to integrate or probe, are made independently and then composed.

The harmonics side has its own support. Mohlenkamp's fast transform paper states that spherical harmonics arise on the sphere S^2 the same way that the exponential functions e^{ik theta} arise on the circle (weight 0.78, http://www.ohiouniversityfaculty.com/mohlenka/research/MOHLEN1999P.pdf): they are the analysis basis, not the sampling lattice. TensorFlow Graphics exposes evaluate_spherical_harmonics as a separate operation from its point-sampling machinery, evaluating a point sample of a spherical harmonic basis function (weight 0.69, https://www.tensorflow.org/graphics/api_docs/python/tfg/math/spherical_harmonics/evaluate_), an API-level confirmation that evaluating the basis at sample points is its own primitive. An arxiv framework for spherical harmonics and point configurations on the sphere constructs harmonics as superpositions of Gaussian beams whose poles form well-separated point sets, again treating the point configuration and the harmonic content as two coupled but distinct design choices (weight 0.86, https://arxiv.org/html/2209.03403v2). Probabilistic-numerics research on quadrature treats the sampling problem and the kernel or test-function model as separate objects with separate hyperparameters (weight 0.76, https://www.probabilistic-numerics.org/research/quadrature/).

## Composition in the revised passage

In the passage, the two primitives compose in one evaluation: node i has coordinates (theta_i, phi_i) from the Fibonacci recurrence, and the probe reads Y_3^3(theta_i, phi_i) there. The artifact frames this as the two sitting at different levels of the diagnostic stack. The evidence above supports the framing: the lattice literature (arxiv 0912.4540, Baskerville, Cook) owns the where, the harmonic literature (DLMF, Mohlenkamp, the basis-function APIs) owns the what, and neither derives the other.

## Sources

- https://link.springer.com/article/10.1007/s13137-014-0065-1 (weight 0.91)
- https://arxiv.org/html/2209.03403v2 (weight 0.86)
- http://www.ohiouniversityfaculty.com/mohlenka/research/MOHLEN1999P.pdf (weight 0.78)
- https://www.probabilistic-numerics.org/research/quadrature/ (weight 0.76)
- https://cbeentjes.github.io/files/Ramblings/QuadratureSphere.pdf (weight 0.71)
- https://www.tensorflow.org/graphics/api_docs/python/tfg/math/spherical_harmonics/evaluate_ (weight 0.69)
