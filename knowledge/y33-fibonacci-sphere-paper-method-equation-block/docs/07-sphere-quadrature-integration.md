# Quadrature and Integration over S^2 with Fibonacci Nodes

Scope: using the equation block's (theta_i, phi_i) pairs as a quadrature grid for integrals over the sphere, the equal-weight structure, and the competing established schemes the paper should position against.

## Equal-weight quadrature on the sphere

Surface integrals over the unit sphere take the form integral f dS, and with equal node weights the rule reduces to a mean: the approximation is the average of f over the nodes times the surface area. Quadrature notes on the sphere observe that with equal weights the nodes should be uniformly spread over the sphere, with the crucial caveat of defining what uniformly spread means in this context (weight 0.80, https://cbeentjes.github.io/files/Ramblings/QuadratureSphere.pdf). That caveat is the whole subtlety: uniform in the naive angular sense produces the polar clustering the latitude-longitude grid suffers, while the discrepancy literature's integral-approximation definition is the one that matches equal-weight rules (weight 0.86, https://arxiv.org/html/2407.01503v1).

The established formal treatment is quasi-Monte Carlo integration on the sphere using equal-weight quadrature rules where the weights are such that constant functions are integrated exactly, with quadrature points constructed by lifting low-discrepancy nets from the unit square (weight 0.90, https://arxiv.org/abs/1101.5450). The Fibonacci node set is a deterministic low-discrepancy point set on the square-to-sphere pathway, which is precisely the property the source block exploits when it reuses the (theta_i, phi_i) pairs for a spectral loss: the same nodes that embed the curve approximate integrals over S^2.

## Spherical designs as the exactness benchmark

The strictest competitors are spherical t-designs: node sets with equal positive weights for which the average of any polynomial of degree at most t equals the exact integral. A paper on numerical integration over the unit sphere using spherical t-designs studies exactly this equal-weight, polynomial-precision setting across two kinds of designs (weight 0.85, https://arxiv.org/pdf/1611.02785). A reference chapter on numerical integration over the sphere catalogs the rule families with positive weights, including product rules and spherical designs (weight 0.87, https://link.springer.com/rwe/10.1007/978-3-642-01546-5_40).

For the equation block, the relevant positioning is honest: Fibonacci nodes are not t-designs and carry no exactness guarantee for any polynomial degree; their claim is low discrepancy and closed-form generation. If the paper's downstream loss integrates polynomials or low-degree harmonics over S^2, a t-design arm would be a stronger comparator than the lat-long grid, and the ablation suite should note this.

## Product and symmetric grids in practice

The dominant practical alternative is structured quadrature. The Lebedev quadrature grid is constructed to have octahedral rotation and inversion symmetry, with node numbers and locations chosen to integrate spherical harmonics exactly up to a chosen order (weight 0.64, https://en.wikipedia.org/wiki/Lebedev_quadrature). SHTOOLS, the working reference implementation for spherical harmonic transforms, supports regularly sampled geographic grids and grids appropriate for integration by Gauss-Legendre quadrature, with transforms proven fast and accurate to high spherical harmonic degrees (weight 0.90, https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2018GC007529; grid format details at weight 0.61, https://shtools.github.io/SHTOOLS/grid-formats.html). These grids are product rules: a latitude rule combined with an azimuth rule, exact for band-limited functions up to the grid's degree.

The trade the block makes is visible here. Gauss-Legendre and Lebedev grids buy exactness at the cost of structure: fixed node counts, grid-specific weight tables, and implementations to import. Fibonacci nodes buy closed-form generation and a single node set shared between embedding and quadrature, at the cost of exactness guarantees. For the paper's use case, a spectral loss evaluated on the same nodes the embedding lives on, the shared-node property is the decisive one, and it is unique to the Fibonacci choice among the schemes surveyed.

## How to use the nodes in a loss

The source block's application is a spectral loss against a known target, integrating over S^2. With the block's N nodes the practical recipe is:

1. Evaluate the integrand at the N closed-form nodes (theta_i, phi_i), which are already available from the sampling equation with no additional machinery.
2. Average with equal weights 4 pi / N, since the sphere area is 4 pi and the nodes are near-uniform.
3. For band-limited targets, cross-check convergence against an exact product-rule grid from SHTOOLS to quantify the equal-weight rule's error at the working N.

Step 3 is the paper's honest hedge: the Fibonacci equal-weight rule is a low-discrepancy approximation, and its error against an exact rule is measurable, bounded by the discrepancy rates discussed in the companion uniformity doc.

## Constraints inherited by the equation block

1. Equal weights are the only weights this node set supports out of the box; introducing quadrature weights is a different, named scheme.
2. Exactness claims must not be made for Fibonacci nodes; the supported claims are low discrepancy and shared-node convenience.
3. Any loss that depends on exact integration of specific polynomial degrees should either use a t-design or Gauss-Legendre grid or report the measured integration error of the Fibonacci rule at its working N.
