# 08 - Companion method equation block

## Scope

The companion artifact to the revised passage: a standalone 3-equation LaTeX methods-section snippet defining z_i, phi_i, theta_i, and the Y_3^3 evaluation, and how the two artifacts divide labor without duplicating each other.

## The division of labor

The Y_3^3 plus Fibonacci work exists in two artifacts, and the source doc is explicit that they are complementary, not duplicates. The revised passage is the prose-level patch: a table, a drop-in LaTeX block, and rationale per row, meant to land inside the hyperspherical-harmonic section right after the Riemann-sphere sentence. The method equation block is the methods-section citation: the same three node formulas and the Y_3^3 evaluation as a standalone equation chain, for readers who want the mathematics without the surrounding prose. The artifact's own guidance is that when the paper's authors apply the patch they can use both: the equation block goes into the methods section, the revised passage goes into the hyperspherical-harmonic prose.

This mirrors standard paper structure, where a methods section carries the mathematical definitions and a results or model section carries the prose that uses them. The two artifacts pin the same formulas so the two locations cannot drift apart.

## The mathematical content the block pins

The block's content is the Fibonacci node scheme plus the harmonic identity, and both halves have canonical references that a methods section should cite. NIST's DLMF section 14.30 is the reference definition for spherical harmonics, covering the tesseral, sectorial, and zonal families and the conventions Y_{l,m} obey (weight 0.93, https://dlmf.nist.gov/14.30). The DLMF front page is the Digital Library of Mathematical Functions itself, the citable home for the l = 3, m = 3 member (weight 0.93, https://dlmf.nist.gov/). For the node formulas, Burkardt's SPHERE_FIBONACCI_GRID is a Python library that constructs a grid of points using the Fibonacci spiral over the surface of a sphere in 3D (weight 0.79, https://people.math.sc.edu/Burkardt/py_src/sphere_fibonacci_grid/sphere_fibonacci_grid.htm). The FSU mirror documents the same library alongside companion codes in the same family: sphere_integrals returns exact monomial integrals over the unit sphere surface, and sphere_llq_grid computes latitude-longitude quadrature grids, which is precisely the uniform-grid comparator the ablation plan needs (weight 0.79, https://people.sc.fsu.edu/~jburkardt/py_src/sphere_fibonacci_grid/sphere_fibonacci_grid.htm). A methods section that cites the equation block can therefore point at runnable reference implementations for both the Fibonacci nodes and the lat-long baseline.

## Cross-linking requirement

The artifact's recommended next steps include cross-linking the two Y_3^3 artifacts, y33-fibonacci-sphere-paper-method-equation-block and y33-fibonacci-sphere-paper-revised-passage, via the yubiOS refs/ index so readers find both. The failure mode the cross-link prevents is partial adoption: an author applies the equation block but not the prose patch, or the reverse, and the paper ends up with the sampling scheme defined in one place and never justified in the other. The two artifacts' slugs are the stable handles for that link; this corpus carries the revised-passage side, and the method-equation-block side lives as its own refs/ file in the yubiOS repo.

## Sources

- https://dlmf.nist.gov/14.30 (weight 0.93)
- https://dlmf.nist.gov/ (weight 0.93)
- https://people.math.sc.edu/Burkardt/py_src/sphere_fibonacci_grid/sphere_fibonacci_grid.htm (weight 0.79)
- https://people.sc.fsu.edu/~jburkardt/py_src/sphere_fibonacci_grid/sphere_fibonacci_grid.htm (weight 0.79)
