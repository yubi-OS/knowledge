# 03 - Loop mechanics

**Scope:** the 5 steps the source doc prescribes for one RSI cycle, and the external math mechanisms each step relies on.

## The 5 steps

The source doc (yubi-OS/yubiOS playbooks/rsi-regime.md) numbers the cycle:

1. **Gap-map** via negative-skill-space on the target corpus (source doc). The 12-axis sweep produces the coverage vectors and the gap list the rest of the cycle reasons about.
2. **Hypothesis proposal.** A parallel-deep-research subagent is dispatched with the gap-map and the Fibonacci-sphere parameter t = i/N. It proposes ONE single-action edit per cycle: the lobe whose flip reduces the geodesic distance to the ideal pole the most (source doc).
3. **Edit.** The human-approved hypothesis is applied to the SKILL.md or any corpus item (source doc). The approval step is not decoration; hard rule 6 and the audit-trail warning in the source doc make unauthorized substitution void the trail.
4. **Re-map.** Recompute the corpus's coverage vectors under the current basis, project to S2 via PCA top-2 plus stereographic lift, fit gamma(t) on the real SH basis (L=3, 16 functions), and compute per-item chordal residuals (source doc).
5. **Fixpoint rule.** Terminate the loop if no new gaps opened AND the cycle's edited primitive closed a prior gap AND no new anti-patterns appeared. Otherwise cycle+1, capped at 3 cycles in default mode (source doc).

## The projection mechanism (step 4)

Step 4's projection chain is standard differential geometry. Stereographic projection is the perspective projection of a sphere through one pole onto a plane, and it is the standard way to move between the sphere and a flat coordinate representation (https://en.wikipedia.org/wiki/Stereographic_projection, weight 0.68). The source doc specifies lifting from the south pole, which fixes which of the two poles is the projection center and therefore which point maps to infinity in the plane. The Riemann sphere exists precisely as the complex plane completed by stereographic projection (https://en.wikipedia.org/wiki/Riemann_sphere, weight 0.65). Applied work uses the same device to represent 3-D point clouds in 2-D: a 2024 Springer paper maps 3-D objects onto the unit sphere and then into the plane via stereographic projection (https://link.springer.com/article/10.1007/s00530-024-01347-3, weight 0.62), and a 2024 arXiv paper uses stereograms for design on the sphere (https://arxiv.org/html/2401.05931v1, weak backing, weight 0.49).

## The fitting mechanism (step 4)

The gamma(t) fit is a spherical-harmonic expansion. Spherical harmonics form a basis for functions on the sphere and are the standard expansion family for it (https://en.wikipedia.org/wiki/Spherical_harmonics, weight 0.63). Fitting SH coefficients to scattered samples is a constrained least-squares problem in the graphics literature, where noise-resistant SH fitting is an established topic (https://ttwong12.github.io/papers/shfit/shfit.pdf, weak backing, weight 0.51). The regime freezes the concrete recipe: explicit Legendre plus cos/sin split at L=3, giving 16 real basis functions, and a closed-form ridge solution (see 05-math-conventions.md).

## The termination logic (step 5)

The fixpoint rule is a conjunction of 3 conditions. Note what it does not say: it does not terminate when residuals are small, and it does not terminate when the curve gate passes. It terminates only when the gap ledger is stable (no new gaps, one prior gap closed, no new anti-patterns). This is what makes the loop bounded in the sense the 2026 RSI taxonomy literature means by bounded self-refinement, an evaluable loop with a defined stop state (https://arxiv.org/abs/2607.07663v1, weak backing, weight 0.39).
