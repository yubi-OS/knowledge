# 03 - Curve-Guided RSI Pipeline

Scope: the incumbent curve-guided-rsi pipeline being extended: 9-D binary primitive coverage of a skill corpus, the Stage-1 flat Fourier curve fit on [0,1]^2, and the full 5-stage audit loop the sphere variant swaps into.

## The loop being extended

The variant is not a standalone system: it is a Stage-1 replacement inside curve-guided-rsi, a bounded recursive self-improvement loop that audits a corpus of agent skills. The general shape it follows is documented in the RSI literature: systems that repeatedly convert partially verified outputs into better-targeted problems (https://arxiv.org/html/2607.21461, weight 0.70), training-free multi-agent frameworks that coordinate curriculum, actor, and verifier agents and check what they learn against actual execution (https://github.com/AetherLabsAI/RSIAgent, weak backing, weight 0.09), and skill-level meta-loops that coordinate specialized auditors to detect issues and generate improvement proposals (https://eliteai.tools/agent-skills/recursive-improvement, weak backing, weight 0.22). The yubiOS version is narrower and more mechanical than any of these: its improvement target is the corpus of SKILL.md files, and each cycle must produce a measured, falsifiable change or be reverted (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05).

Recursion itself is the plain computational substrate: a recursive step is a set of rules that reduces all successive cases toward a base case (https://en.wikipedia.org/wiki/Recursion, weak backing, weight 0.16). The bounded loop discipline exists precisely because unbounded self-improvement loops have no base case; the fixpoint rule (no new gaps, old gaps closed, no new anti-patterns) is the yubiOS answer to that (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05).

## What the curve fit fits

The corpus representation is 9-D binary primitive coverage: every item in the corpus is a 9-dimensional vector of 0/1 flags recording which structural primitives it covers. The curve fit is a regression of fit quality over that space. The incumbent model is a separable Fourier surface on the flat domain [0,1]^2, built from products sin(2 pi f_m u) cos(2 pi g_n v); this is polynomial-regression-shaped fitting, where a fixed family of basis functions is combined linearly and the fit quality is judged on held-out data (https://en.wikipedia.org/wiki/Polynomial_regression, weight 0.57). The standard diagnostic loop applies: fit a higher-order model, then explore whether a lower-order model is adequate by looking at the residuals (https://online.stat.psu.edu/stat462/node/158/, weight 0.77). Polynomial regression is also recognized as a generalization framework for comparing models of relationships on a common surface, which is the same move the variant makes when it swaps the basis family under a fixed evaluation protocol (https://tarheels.live/jeffreyedwardswebsite/wp-content/uploads/sites/5503/2024/03/Edwards2007.pdf, weight 0.54).

The variant keeps the regression protocol and changes the domain: instead of a flat [0,1]^2 parameter chart it puts each corpus item at a point x on S2 and fits with spherical harmonics. Nonlinear-regression framing makes the distinction precise: the model is a nonlinear combination of parameters only if the reparameterization is learned; with the Moebius map fixed to identity the fit stays linear in the harmonic coefficients (https://handwiki.org/wiki/Nonlinear_regression, weak backing, weight 0.07).

## The 5-stage structure and what the swap touches

Per the design record, the pipeline has 5 stages: Stage 1 fits the curve; Stage 2 detects sparse cells; Stage 3 prioritizes gaps; Stage 4 edits the corpus; Stage 5 verifies with a holdout evaluation. The sphere variant changes exactly two things (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05):

1. Stage 1: the Fourier surface on [0,1]^2 is replaced by the hyperspherical harmonic basis plus the Moebius reparameterization (docs 01 and 02).
2. Stage 2: the uniform 21x21 flat grid with radius 0.05 is replaced by an equal-area partition of S2 with 441 cells and chordal radius about 0.095 (doc 05).

Stages 3 through 5 are reused unchanged. The audit-trail primary key changes from the (u, v) pair to the domain coordinate x on S2, because recovering (u, v) from principal components of the coverage matrix would introduce a second, sign-ambiguous coordinate system and destroy the geometry the variant exists for (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05).

## What is deliberately not reused

The design record rejects two temptations. First, a (gamma, d-gamma, nabla-squared gamma) triple extension of the fit: the "3-D differential" reading of the original problem is honored as S2 embedded in R3 plus Moebius covariance, not as a 3-jet; gamma is a 0-form and never a form (same record). Second, blending the runner-up interpretations into one variant: that would inflate one skill into two and is deferred to separate family members. The incumbent's own artifact count at the time of design was 69 skills with 147 total artifacts, and the variant reuses the existing coverage matrix Z rather than reclassifying anything (same record).
