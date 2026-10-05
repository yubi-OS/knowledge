# 04. The v3 2-D Learned Surface: the Headline Pass

**Scope:** The v3 fit: 3 changes over v2, a separable Fourier surface with k=2 per axis, the closed-form ridge fit, the honest gradient-refinement finding, and the headline holdout metrics that made v3 the consolidated version.

## Three changes from v2

v3 made exactly 3 changes ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source, not jev-weighted):

1. Filter .gitkeep placeholders. 2 of the 213 artifacts were zero-coverage git keep files, not real artifacts. N went from 213 to 211.
2. Hand-classify 14 borderline artifacts that the keyword heuristic under-counted, with per-override rationale saved to session/cache/v2-corpus/manual_coverage_overrides.json.
3. Replace the 1-D coordinate with a 2-D surface: (u, v) = (PC1, PC2) of the 9-D coverage, fitted with a separable Fourier basis k_u = k_v = 2, per the learned-latent-curve skill's 2-D alternative architecture.

## Why a separable 2-D basis

A separable basis approximates a function of 2 variables as sums of products of 1-D basis functions, which turns the fit into linear least squares in the coefficients. Course material on 2-D Fourier transforms develops exactly this separable structure (https://sigproc.mit.edu/_static/spring25/lectures/2D_Fourier_Transforms_1-handout.pdf, jev weight 0.835), and lecture notes from Oxford (https://www.robots.ox.ac.uk/~az/lectures/ia/lect2.pdf, jev weight 0.486, weak backing) and Toronto (https://www.cs.toronto.edu/~jepson/csc320/notes/linearFilters2.pdf, jev weight 0.375, weak backing) cover the same transform algebra. The least-squares function approximation framework that the coefficient solve is an instance of is standard (https://math.libretexts.org/Bookshelves/Differential_Equations/Introduction_to_Partial_Differential_Equations, jev weight 0.479, weak backing).

## The closed-form ridge and the honest gradient finding

The fit is a closed-form ridge regression at log-spaced initial frequencies, not a gradient-trained fit. Over 500 epochs of gradient refinement, the frequencies moved by at most 0.001; the R-squared improvement from 0.4164 to 0.4655 came from the coefficient matrix polish, not from frequency learning. The flow doc records this explicitly against the skill's "fixed-basis fit sold as learned" anti-pattern ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source). This is the fit's most transferable lesson: if your optimizer barely moves the basis parameters, say so, and credit the closed-form solve.

## Headline metrics

The v3 numbers ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source):

- PC1 = 0.2258 alone (still a NO-GO on the 1-D reading of the 0.40 heuristic)
- PC1 + PC2 = 0.4036, crossing the gate as a 2-D structure
- Parameter count 3,465 against N x D = 81,024 target scalars, a ratio of 0.043
- 2-D design matrix condition number 8.11, which is excellent
- Train R-squared 0.4403
- Holdout R-squared +0.4655, the first across v1 through v4 to clear the > 0 gate strongly
- Mean holdout cosine 0.858, range 0.65 to 0.98

The condition number matters because a well-conditioned design matrix is what makes the ridge solve numerically trustworthy. Course material on multicollinearity ties the condition number of the design matrix directly to the stability of least squares estimates (https://www.sjsu.edu/faculty/guangliang.chen/Math261a/Ch9slides-multicollinearity.pdf, jev weight 0.780); a practitioner blog makes the same point more loosely (https://metricgate.com/blogs/multicollinearity-condition-number/, jev weight 0.369, weak backing). A condition number of 8.11 means the 3,465-parameter solve is nowhere near the ill-conditioned regime.

## Why v3 is the version the corpus keeps

v3 combines the cleaned corpus (doc 06), the low-rank target (doc 01), and the 2-D gate reading (doc 02). Its holdout result of +0.4655 is the strongest generalization evidence in the whole iteration chain, and the consolidated flow doc superseding v1 through v3 takes v3 as its headline (doc 08).
