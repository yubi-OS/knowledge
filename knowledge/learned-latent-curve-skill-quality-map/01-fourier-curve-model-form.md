# 01 - The Fourier curve model form: learned frequencies, per-dim coefficients, closed-form ridge

Scope: the exact model being fit when a skill corpus is mapped onto a learned latent curve, the shared-frequency parameterization, and the two-stage closed-form-then-refine optimization.

## The model

A learned latent curve embeds N items as points on a curve gamma(t) that traverses a D-dimensional embedding space, parameterized by a single scalar t in [0, 1]. In the yubios learned-latent-curve formulation each output dimension j gets its own trigonometric expansion:

z_j(t) = a_j0 + sum_m (a_{j,m} sin(2 pi f_m t) + b_{j,m} cos(2 pi f_m t))

with k shared learned frequencies f_1..f_k used by every output dimension. The total parameter count is k + D(1 + 2k): k frequencies, and for each of D dimensions one bias plus 2k Fourier coefficients. At D = 384 and k = 4 this is 3460 parameters; at k = 12 it grows to 9612.

The design contrasts with fixed-frequency sinusoidal constructions such as transformer positional encoding, where frequencies follow a fixed geometric progression across dimensions and nothing is learned [0.602, weak]. The Fourier feature mapping of Tancik et al. passes inputs through sin/cos transformations so MLPs can learn high-frequency functions in low-dimensional domains, but there the frequencies are hyperparameters of the input mapping, not parameters fit to data [0.966, strong] [0.795, strong]. The learned-latent-curve model instead treats frequencies as trainable scalars shared across output dimensions, so the curve's shape adapts to the corpus while staying linear in the output coefficients.

Recent work on learnable frequency projections for Fourier feature embeddings confirms the motivation: making frequency parameters adaptive improves embedding accuracy on high-frequency targets [0.122, weak].

## Optimization: closed-form ridge, then Adam on frequencies

Because the model is linear in the coefficients a and b once the frequencies f are fixed, fitting decomposes. At fixed frequencies the coefficients solve a closed-form ridge regression on a dense grid of t values, with a loss that combines reconstruction MSE, a frequency-magnitude prior that keeps frequencies from collapsing or exploding, and a curvature smoothness term. With the coefficients solved, a short Adam refinement moves only the k frequencies; C (the coefficient matrix) is held fixed during that step and re-solved afterward.

This matters for correctness diagnostics: "frequencies barely moved" during refinement can reflect the optimizer design (C held fixed) rather than uninformative data. Full alternating optimization (refine f, re-solve C, repeat) is the recommended fix.

## Parameter-count regime

The parameter budget is the binding constraint on tiny corpora. With N = 62 skills and D = 384, the target matrix has 62 x 384 = 23628 degrees of freedom. At K = 4 the curve uses 3460 parameters (0.15 of that budget); at K = 12 it uses 9612 (0.41). In the application sweep, lower K won: K = 4 generalized to holdout (R2 = +0.144) while K = 12 overfit (R2 = -0.050). The classic regression hazard applies: as the number of fitted parameters approaches the number of observations, the fit passes through nearly every training point and holdout performance collapses [0.800, strong] [0.699, strong].

The linear-in-coefficients structure is what makes this safe to attempt on a small corpus at all: only k nonlinear parameters need gradient refinement, and the rest of the fit is an exact regularized solve.
