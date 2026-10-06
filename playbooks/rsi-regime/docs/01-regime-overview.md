# 01 - Regime overview

**Scope:** what the yubiOS RSI regime is: a family of skills, scripts, and render pipelines that audits, gap-maps, and improves any corpus through a bounded recursive loop, with the corpus parameter t on the Riemann sphere S2 rather than a flat [0,1] line.

## The definition

The source doc (yubi-OS/yubiOS playbooks/rsi-regime.md, last updated 2026-08-07) defines the regime as "a family of skills + scripts + render pipelines that lets any corpus (skill files, refs/*.md, git history, Linear issues, etc.) be audited, gap-mapped, and improved through a bounded recursive loop." Two properties distinguish it from a generic self-improvement loop:

1. **It is bounded.** The loop terminates on a fixpoint rule (see 03-loop-mechanics.md) and carries a default cap of 3 cycles (source doc). This is the same shape the 2026 RSI literature calls "bounded self-refinement": an arXiv taxonomy paper published July 8, 2026 separates bounded self-refinement (convergent, evaluable, already industrial practice) from open-ended recursive self-improvement, and the yubiOS regime sits squarely in the bounded half (https://arxiv.org/abs/2607.07663v1, weak backing, weight 0.39).
2. **It is manifold-aware.** The corpus parameter t lives on the Riemann sphere S2, not on a flat [0,1]2 line (source doc). The Riemann sphere is the complex number plane wrapped around a sphere via stereographic projection, and it is a conformal manifold rather than a Riemannian one unless the round metric is supplied (https://en.wikipedia.org/wiki/Riemann_sphere, weight 0.68). A manifold is a space built from coordinate charts, a covering by open sets with homeomorphisms to flat pieces (https://en.wikipedia.org/wiki/Manifold, weight 0.51), so placing corpus items on S2 means the regime's distance and curve machinery must be intrinsic to the sphere, which is exactly why the regime freezes chordal S2 residuals and a spherical-harmonic curve basis (see 05-math-conventions.md).

## Why the sphere matters operationally

Because t = i/N is the Fibonacci index (source doc, hard rule 4), the parameter is azimuthal: item i is a point on the sphere, and "progress" is not a scalar on a line but a position on a curved surface. The regime's per-cycle edit is chosen as the single primitive whose flip reduces the geodesic distance to an ideal pole the most (source doc). Geodesic distance on a curved manifold is the natural generalization of straight-line distance and requires the metric to come from the manifold itself (https://en.wikipedia.org/wiki/Riemannian_manifold, weight 0.67). Contemporary machine-learning work makes the same move for data on curved spaces: a 2026 Springer paper does geometry-aware augmentation on learned spherical latent geometry (https://link.springer.com/article/10.1007/s10115-026-02719-z, weak backing, weight 0.53), and an arXiv paper on score-based Riemannian metrics argues geometry should be captured without explicit parameterization (https://arxiv.org/html/2505.11128v3, weak backing, weight 0.48).

## What the regime operates on

Any corpus that can be enumerated as items with feature coverage: skill files, refs/*.md, git history, Linear issues (source doc). Each item is described by a binary or numeric primitive coverage vector (see 06-time-series-library.md for the 7-D, 9-D, 16-D, 24-D, and 384-D bases used in practice), projected to S2, fitted with a real spherical-harmonic curve, and audited by per-item residual.

## What the regime is not

The source doc explicitly deprecates the flat-line loop for sphere corpora: curve-guided-rsi, the original 79-skill flat-line loop, is "deprecated for sphere corpora; superseded by rsi-phi-skill" (source doc). Independent 2026 analysis reaches a compatible conclusion from the other direction, warning that open-ended RSI without an evaluator-centric, bounded structure loses auditability (https://arxiv.org/abs/2607.07663v1, weak backing, weight 0.39). The regime's answer to that concern is structural: human approval of the hypothesis before edit, a fresh-context subagent per cycle, and a hard fixpoint rule (see 03-loop-mechanics.md).
