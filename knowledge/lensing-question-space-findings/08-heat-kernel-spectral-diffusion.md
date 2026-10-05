# 08 - The basis diagonalizes diffusion: heat kernel, closed-form defocus, and the null as t to infinity

**Scope.** Real spherical harmonics as Laplace-Beltrami eigenfunctions, the resulting closed-form diffusion of the measured Parseval spectrum, the diffusion-time estimator, and the null space as the t to infinity endpoint of forward diffusion.

## The eigenfunction fact

The spherical harmonics are eigenfunctions of the Laplace-Beltrami operator on the sphere: Delta Y_lm = -l(l+1) Y_lm. A Stanford graphics paper studies exactly this basis: hierarchical function bases defined by the eigenfunctions of the Laplace-Beltrami operator, which on a sphere correspond to the spherical harmonics (weight 0.9017, https://graphics.stanford.edu/courses/cs233-20-spring/ReferencedPapers/understand_geometry_01631196.pdf). A construction paper derives the spherical harmonics from the Laplace-Beltrami operator on S2 from first principles (weight 0.5368, https://www.researchgate.net/publication/397200348_Spherical_Harmonics_as_Eigenfunctions_of_the_Laplace-Beltrami_Operator; an independent version scores 0.453, weak, https://simonrs.com/eulercircle/irpw2025/palaash-sphharm-paper.pdf). The Laplace-Beltrami reference defines the spherical Laplacian as the LB operator on the (n-1)-sphere with its canonical metric (weight 0.7952, https://en.wikipedia.org/wiki/Laplace%E2%80%93Beltrami_operator).

Because the framework already computes its Parseval shares E_lm in this basis, the eigen-relation is free: the heat equation on the sphere is diagonal in the coordinates the framework measures.

## Closed-form diffusion of the spectrum

The heat kernel on the sphere expands over the same eigenfunctions: K_t(x dot y) = sum over l of (2l+1)/(4 pi) exp(-l(l+1) t) P_l(x dot y), with P_l the Legendre polynomials (the Legendre connection is covered in the Arfken-methods notes, weight 0.3042, weak, https://williamsgj.people.charleston.edu/Legendre%20Function.pdf). Modern heat-kernel theory confirms the sphere is the well-understood case: all heat kernel coefficients for Laplacians acting on scalars, vectors, and tensors are known in any dimension on fully symmetric spaces (weight 0.7445, https://arxiv.org/abs/1910.00543), and harder geometries show how unusual the closed form is: the subelliptic heat kernel on the CR sphere requires explicit geometric machinery (weight 0.8268, https://arxiv.org/abs/1112.3084v1), and the quantized-sphere heat kernel needs a dedicated expansion series (weight 0.0865, weak, https://link.springer.com/content/pdf/10.1007/s12215-022-00784-1.pdf).

The consequence the source doc draws, all free because the basis is already in use: under heat flow, each per-mode energy decays deterministically, E_l(t) = E_l(0) exp(-2 l(l+1) t) before renormalization. Diffusing a corpus is a closed-form operation on the already-measured spectrum; no simulation is needed. This is the structural gift of F9 in the source findings doc.

Two derived quantities:

1. The diffusion-time estimator: fit t-hat from the measured per-degree decay of E_l against a reference. One scalar that says how defocused a corpus is, dimension-comparable by construction because it is built on the achromatic shares (doc 04).
2. The null as endpoint: Brownian motion on a compact manifold converges to the uniform measure, so forward diffusion is exactly the map Q to N0 run continuously. The is-this-x program measured the two endpoints; the heat flow supplies every intermediate frame (source doc).

## The verification gaps

Gap G1: apply the exp(-l(l+1) t) decay to the measured Parseval shares of the 2286 x 9 corpus and confirm against explicit Brownian simulation on the Fibonacci lattice. One script; the spectrum shape already exists in results/real-gwtc-results.json (source doc). Gap G2: t-hat needs its own non-degenerate null; compute t-hat on curveball draws, and if the null's t-hat distribution is degenerate the coordinate is inadmissible (source doc; the membership-condition discipline is doc 06 gap C).

## Sources considered

| result | weight | used |
|---|---|---|
| Stanford LB eigenfunctions paper | 0.9017 | yes |
| Heat kernel coefficients on spheres (arXiv 1910.00543) | 0.7445 | yes |
| Laplace-Beltrami operator Wikipedia | 0.7952 | yes |
| Spherical harmonics as LB eigenfunctions (ResearchGate) | 0.5368 | yes |
| Subelliptic heat kernel on the CR sphere | 0.8268 | yes (contrast case) |
| Spherical harmonics exposition (simonrs) | 0.453 | weak, no |
| Legendre polynomials notes (Arfken) | 0.3042 | weak, cited as background |
| Quantized sphere heat kernel (Springer) | 0.0865 | weak, cited as contrast |
| Spherical harmonics Wikipedia | 0.112 | weak, no |
| Heat (1995 film) (off topic) | 0.0254 | no |
