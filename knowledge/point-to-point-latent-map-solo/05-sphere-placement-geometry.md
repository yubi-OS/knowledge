# 05 Sphere placement geometry: S2 stereographic versus continuous slerp versus Hamming-native

Scope: placement geometry choices compared: S2 stereographic lift with spherical harmonics, continuous slerp on the unit sphere with vMF concentration, and Hamming-native Krawtchouk shells.

## The three geometry candidates

The source record considered 3 placement geometries across its variations: V4 places binarized points on the 2-sphere via a PCA2-to-stereographic lift with a spherical-harmonics ridge fit at degree at most 3; V6 skips binarization and unit-normalizes rows onto S^(D-1), with slerp edges and von Mises-Fisher concentration; V7 drops the sphere entirely and lives on the Hamming cube's shells with the Krawtchouk spectrum (internal record). The choice is not aesthetic; each geometry determines which theorems survive as certificates.

## S2 with spherical harmonics

Spherical harmonics form an orthonormal basis: any function on the sphere can be uniquely decomposed into a weighted sum of basis functions (https://sangillee.com/2024-12-22-spherical-harmonics-visualizer/, weight 0.67). This is the property the program leans on: fitting a ridge model in the SH basis diagonalizes diffusion on the sphere, so the defocus operator is closed-form on the spectrum (internal record; the basis claim is the sourced part). Interactive visualizers exist for exactly this basis, which is what makes a browser rendering of SH coefficients on S2 a low-risk display layer (https://elysiatools.com/en/visualizations/spherical-harmonics-explorer, weight 0.38, weakly backed). The reference definition of the basis is standard (https://en.wikipedia.org/wiki/Spherical_harmonics, weight 0.36, weakly backed in this dig). A recent machine-learning treatment of the Nirenberg problem works directly with real spherical harmonics and learning-rate/batch structure over them, showing the basis is practically learnable end to end (https://arxiv.org/html/2602.12368v1, weight 0.49, weakly backed). A topic page frames spherical harmonic embedding as representation with completeness and rotational symmetry (https://www.emergentmind.com/topics/spherical-harmonic-embedding, weight 0.18, weakly backed).

The stereographic lift itself is the record's own composition: PCA to 2 dimensions, then stereographic projection onto the sphere. Its justification in the record is practical: the existing sos-agent pipeline already computes PCA2, the lift, and the SH ridge fit, so the deployable reuses measured machinery rather than inventing new (internal record).

## Continuous slerp on the unit sphere

Slerp, coined by Shoemake, describes interpolation along the great arc between points on a sphere (https://splines.readthedocs.io/en/latest/rotation/slerp.html, weight 0.75). The canonical reference implementation is in SciPy, whose geometric_slerp is the maintained, documented function for interpolating between unit vectors (https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.geometric_slerp.html, weight 0.93). The encyclopedic definition matches: slerp interpolates between two points on a sphere so that the path is the great-circle arc (https://en.wikipedia.org/wiki/Spherical_linear_interpolation, weight 0.44, weakly backed). A topic treatment defines slerp as geodesic interpolation between unit vectors preserving constant norm (https://www.emergentmind.com/topics/spherical-linear-interpolation-slerp-f7ac7a09-63b0-4852-9b36-9a6c584555fa, weight 0.53).

V6's added ingredient is concentration: the von Mises-Fisher distribution induces a natural noise process on the sphere and admits a closed-form conditional score, which is the property a diffusion-style forward map would exploit (https://arxiv.org/pdf/2605.05629, weight 0.37, weakly backed). The record's verdict on V6 is deferral to v2 behind its own admission null: no fixed-margin fibre exists for continuous rows, so the only certifiable statement is delta nonnegativity on geodesic distance, a weaker medium (internal record).

## Hamming-native: the Krawtchouk alternative

V7 inverts the geometry question: instead of lifting binary rows onto a sphere, stay in the Hamming cube H(d,2) and use its shells, whose spectrum is the Krawtchouk polynomial family; the record cites the Lean file's heat exponent result as the theorem this geometry keeps (internal record). The trade is display: Hamming shells are honest to the certificates but need their own rendering vocabulary, which is why V7 scored lower on the painkiller axis than the S2 option (internal record).

## Decision logic

The record's decision logic reduces to a single question: which geometry lets the most Lean theorems remain runtime-checkable? Binary state plus S2 placement keeps the fixed-margin fibre (binarization), the curveball null (fibre-preserving trades), the heat exponents (via the SH spectrum), and the identity layer (separate from all geometry). Continuous slerp keeps only delta nonnegativity. Hamming-native keeps the binary theorems but complicates the product surface. V4 wins by certificate count, with V6 and V7 retained as the recorded alternatives with explicit re-entry conditions (internal record).
