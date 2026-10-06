# Latent Projection onto the Sphere

Scope: the projection step of the equation block, z_i = f_theta(t_i) and u_i = z_i / ||z_i||, connecting the paper's learned latent curve to points on S^2.

## The role of the projection in the block

The first equation of the block is the only place learned parameters enter. The model outputs z_i = f_theta(t_i), a vector in R^d at parameter t_i; the normalization u_i = z_i / ||z_i|| maps it radially onto the unit sphere. Everything downstream, the Fibonacci angles and the Y_3^3 modulation, operates on u_i and carries no learned parameters. This division is deliberate: the sampling equation is pure geometry, and the modulation introduces exactly one tunable scalar alpha, so the method's parameter count stays minimal.

The projection is the standard L2 unit-vector normalization: dividing each component by the vector's Euclidean norm projects every vector onto the unit hypersphere so that all vectors have magnitude exactly 1 (weight 0.06, https://inferensys.com/glossary/generative-engine-optimization/vector-space-positioning/embedding-normalization). Weak backing note: this source scores far below 0.5 and is included only as corroboration of the universally standard construction. Practitioner treatments describe the same operation as squashing a vector to lie on a unit sphere while preserving direction (weight 0.21, https://www.linkedin.com/pulse/no-bs-guide-vector-normalization-making-your-vectors-play-gautam-gz1xc; weight 0.27, https://towardsdatascience.com/the-geometry-behind-the-dot-product-unit-vectors-projections-and-intuition/). Both are weakly backed; the operation itself is elementary and needs no citation in the paper beyond a definition.

## Why remove the scaling freedom

Surveys of sphere normalization describe the technique as projecting vectors or functions onto a unit sphere to remove scaling freedom, enforcing invariance and preserving angular geometry, and reformulating optimization as Riemannian or projected gradient descent (weight 0.12, https://www.emergentmind.com/topics/sphere-normalization). Weak backing note: below the 0.5 threshold; the substantive content, that normalization removes scale and leaves direction, is the point the block inherits. In the equation block the benefit is concrete: after normalization every latent sample lives at the same radius, so the subsequent Y_3^3 ripple is a controlled, interpretable perturbation of a well-defined reference surface rather than a modulation of arbitrary magnitudes.

## Connection to the latent-curve and manifold-learning context

The paper's f_theta is a learned mapping from a 1-D parameter to a high-dimensional latent; the block reuses it without modification. The surrounding literature frames such mappings as manifold learning: techniques that embed high-dimensional data into low-dimensional spaces while keeping topological and geometric properties (weight 0.32, https://arxiv.org/html/2505.04412v1; weight 0.20, https://en.wikipedia.org/wiki/Nonlinear_dimensionality_reduction). The scikit-learn manifold-learning documentation, the strongest primary source in this dig, catalogs the standard family (Locally Linear Embedding, Isomap) used for such dimensionality reduction (weight 0.91, https://scikit-learn.org/stable/modules/manifold.html).

The spherical variant of the idea is documented in the representation-learning literature: a spherical autoencoder consists of an encoder that maps images into a spherical latent space and a decoder that maps back, and when trained properly the training images cover the latent sphere with an approximately uniform distribution (weight 0.26, https://arxiv.org/html/2610.02208). Weak backing note: below 0.5. The relevance to the block is structural: projecting latents onto S^2 and then sampling them uniformly is an established pattern, and the block's Fibonacci indexing is the deterministic counterpart of that uniform coverage.

The block's own projection Pi_{S^2}(z) = z / ||z|| is hard-coded to S^2. This is one of the source artifact's explicit constraints: the block must not be applied to non-orientable surfaces or manifolds with non-trivial topology, because the radial projection only makes sense where a unit-sphere target is well-defined.

## What the projection costs

Nothing asymptotically. Normalization is one division per sample; the O(N d) cost of evaluating f_theta at N parameters dominates, and the sampling and modulation steps are O(N) each. The projection preserves the paper's matched-parameter ablation philosophy: alpha = 0 reduces the embedding to u_i itself, the no-modulation baseline, so the projection step is shared across all ablation arms and never confounds a comparison.

## Constraints inherited by the equation block

1. The projection is radial and therefore total: any nonzero z_i maps to S^2. The degenerate case z_i = 0 has no image and must be excluded or handled by the caller.
2. No learned parameters may leak into the sampling or modulation equations; alpha is the only new scalar.
3. The S^2 target is fixed. Non-orientable or topologically non-trivial targets are out of scope for this block.
