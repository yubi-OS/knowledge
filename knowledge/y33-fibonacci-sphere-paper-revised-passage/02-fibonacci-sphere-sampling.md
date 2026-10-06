# 02 - Fibonacci sphere sampling

## Scope

The Fibonacci sphere node scheme used by the revised passage: z_i = 1 - (2i+1)/N, phi_i = 2 pi i / phi_golden, theta_i = arccos(z_i), and why it gives near-uniform coverage of S^2 without pole clustering.

## The scheme

The revised passage samples S^2 at N nodes with three coupled recurrences. The vertical coordinate marches linearly: z_i = 1 - (2i+1)/N puts node i at height i/N of the way down the sphere, offset by half a cell so the first and last nodes sit symmetric about the equator. The azimuth advances by a constant irrational turn: phi_i = 2 pi i / phi_golden where phi_golden = (1+sqrt(5))/2. The polar angle is then the arccosine of the height: theta_i = arccos(z_i). John D. Cook describes this as the Fibonacci lattice, a fast and simple way to distribute points that may be good enough depending on the application, with P = 2N+1 points in his variant of the indexing (weight 0.60, https://www.johndcook.com/blog/2023/08/12/fibonacci-lattice/).

The designcoding writeup describes the Fibonacci sphere as one of the solutions to the equal distribution of points on a sphere, not the best solution to the problem, but regarded as quick and efficient (weight 0.76, https://www.designcoding.net/fibonacci-sphere/). A minimal no-library implementation spreading 1100 points by the golden angle exists as a GitHub demo (weight 0.65, https://github.com/ByteAnimates/fibonacci-sphere), and Burkardt's sphere_fibonacci_grid Python library constructs the same grid for scientific use (weight 0.79, https://people.math.sc.edu/Burkardt/py_src/sphere_fibonacci_grid/sphere_fibonacci_grid.htm).

## Why the golden angle

The azimuthal turn is the load-bearing constant. Wolfram MathWorld defines the Vogel spiral: placing successive points at golden-angle increments with radial distances proportional to the square roots of their indices is a standard mathematical model of phyllotaxis (weight 0.85, https://mathworld.wolfram.com/GoldenAngle.html). MathWorld's Vogel spiral entry pins the customary choice alpha = pi (3 - sqrt(5)), the golden angle, which produces the interlacing spiral patterns used to model sunflower heads (weight 0.73, https://mathworld.wolfram.com/VogelSpiral.html). The golden angle is about 137.5 degrees, the irrational turn that prevents any two consecutive nodes from falling on the same meridian.

The sphere version replaces Vogel's radial spacing with the linear z march and closes the loop with arccos. Adam Baskerville's writeup explains the mechanism: random point placement on a sphere creates voids even with the correct distribution, while a sunflower lattice uses the irrationality of the golden ratio to spread points (weight 0.79, https://adambaskerville.github.io/posts/SphereSampling/). Irrationality matters because a rational turn k/N would retrace a fixed set of meridians and reintroduce clustering; the golden angle's continued-fraction structure is the most irrational turn available.

## Why poles do not cluster

A latitude-longitude grid draws parallels at uniform theta steps. Near the poles, meridians converge, so the number of points per unit area explodes: the poles carry the densest rows of the grid. The Fibonacci scheme does not walk theta uniformly; it walks z uniformly and derives theta by arccos. Uniform spacing in z is uniform spacing in spherical area per row, because the area of a spherical zone between two horizontal cuts is proportional to the difference of their z values. Each row of the Fibonacci lattice therefore holds one node and each node covers roughly equal area, which is the property the revised passage trades on when it calls the result a low-discrepancy diagnostic grid. The arxiv study of Fibonacci versus latitude-longitude lattices shows the two point sets side by side with 1014 and 1001 points respectively, with the latitude-longitude lattice visibly denser at the pole (weight 0.89, https://arxiv.org/pdf/0912.4540).

The revised passage's exact node formulas are the artifact's contribution, verbatim from the conversation recorded in the source doc (yubi-OS/yubiOS refs/y33-fibonacci-sphere-paper-revised-passage-2026-08-07.md, artifact-internal); the general scheme and its coverage properties are independently grounded in the sources above.

## Sources

- https://mathworld.wolfram.com/GoldenAngle.html (weight 0.85)
- https://arxiv.org/pdf/0912.4540 (weight 0.89)
- https://www.designcoding.net/fibonacci-sphere/ (weight 0.76)
- https://mathworld.wolfram.com/VogelSpiral.html (weight 0.73)
- https://people.math.sc.edu/Burkardt/py_src/sphere_fibonacci_grid/sphere_fibonacci_grid.htm (weight 0.79)
- https://adambaskerville.github.io/posts/SphereSampling/ (weight 0.79)
- https://github.com/ByteAnimates/fibonacci-sphere (weight 0.65)
- https://www.johndcook.com/blog/2023/08/12/fibonacci-lattice/ (weight 0.60)
