# 05 - Math conventions

**Scope:** the mathematical conventions the source doc freezes across the whole regime, with the external literature each convention rests on.

The source doc (yubi-OS/yubiOS playbooks/rsi-regime.md) lists 9 frozen conventions. Each is quoted here with its grounding.

## Projection and parameterization

- **PCA top-2, then stereographic lift from the south pole to S2** (source doc). Principal component analysis gives the 2 leading directions of the coverage matrix; the stereographic lift places the 2-D coordinates on the sphere. Stereographic projection is the standard perspective map of a sphere through a pole onto a plane (https://en.wikipedia.org/wiki/Stereographic_projection, weight 0.68), and the Riemann sphere is its canonical completion (https://en.wikipedia.org/wiki/Riemann_sphere, weight 0.65). The south-pole choice fixes the projection center; the opposite choice would mirror the sphere.
- **The 1-D coordinate t comes from PC1** of the centered coverage matrix, min-max scaled to [0,1] (source doc). This is the regime's scalar summary of where an item sits, and hard rule 4 (i = t) ties it to the Fibonacci index.

## The basis

- **Real spherical-harmonic basis via explicit Legendre plus cos/sin split, L=3 giving 16 functions** (source doc). The real SH construction separates each complex harmonic into a cosine part and a sine part, doubling m degrees and dropping the m=0 duplicate; at l=3 the total is 1+3+5+9 = 16 real functions. Spherical harmonics are the standard basis for functions on the sphere (https://en.wikipedia.org/wiki/Spherical_harmonics, weight 0.63).
- **Condon-Shortley normalization, K = sqrt(245/(64pi)) for Y_3^3, phase not dropped** (source doc). The Condon-Shortley phase is the factor (-1)^m that some definitions of the spherical harmonics include to compensate for the phase convention of the associated Legendre functions (https://mathworld.wolfram.com/Condon-ShortleyPhase.html, weight 0.66). The Wikipedia treatment notes normalization choices are independent of where the Condon-Shortley phase is placed, which is why the regime has to freeze both the K constant and the phase explicitly (https://en.wikipedia.org/wiki/Spherical_harmonics, weight 0.65).

## The fit

- **Identity-init Mobius reparameterization: a=d=1, b=c=0, 6 real degrees of freedom, FROZEN, no L-BFGS-B refinement** (source doc). The Mobius group on the Riemann sphere acts by conformal maps; the identity initialization means the first fit is the un-warped sphere. The freeze is deliberate: the regime measures where items sit, not a best-fit warping of the parameterization.
- **Closed-form ridge: C* = (Phi^T Phi + lambda I)^-1 Phi^T Z with lambda = 1e-3** (source doc). This is the textbook ridge closed form: Cornell's CS4780 lecture notes state the ridge objective has closed-form solution w = (X X^T + lambda I)^-1 X y^T (https://www.cs.cornell.edu/courses/cs4780/2018fa/lectures/lecturenote08.html, weight 0.78), and the standard reference describes ridge regression as least squares with an L2 penalty added to control coefficient growth (https://en.wikipedia.org/wiki/Ridge_regression, weight 0.58). A Stack Exchange derivation shows the same normal-equation form (https://stats.stackexchange.com/questions/69205/how-to-derive-the-ridge-regression-solution, weak backing, weight 0.16).
- **Chordal S2 distance for residuals** (source doc). Chordal distance is straight-line distance through the sphere between two surface points, which is what "per-item chordal residual" means in step 4 of the loop.
- **Degree weights frozen, not learnable** (source doc). Paired with the Mobius freeze, this removes every learnable degree of freedom from the measurement instrument except the coverage vectors themselves.
- **Fit gate: PC1+PC2 >= 0.40** (source doc). The two leading principal components must jointly explain at least 40% of variance before a curve fit is trusted for that cycle.

## Why frozen

The source doc freezes 5 of the 9 items (Mobius init, degree weights, lambda, the K constant, the gate) that a naive implementation would tune per corpus. The playbook's position is that the regime is a measurement instrument: a tuned-per-cycle instrument cannot produce comparable cycle-to-cycle numbers, so the fixpoint rule in 03-loop-mechanics.md would be measuring the tuner, not the corpus.
