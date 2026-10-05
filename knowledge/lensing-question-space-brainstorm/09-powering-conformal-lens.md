# 09 - Powering the Lens: Null-Constrained Optimization of the Mobius Map

**Scope.** The flagship deliverable (Gap D): an actual optimization objective for phi-theta, what the optics design literature says about automated lens design, and the anti-caustic constraint formulation (condition-number and rank guards).

## The objective the corpus needs

Every run so far freezes phi-theta at identity, which per doc 01 is an unpowered lens. Leonhardt's construction says what refinement means: pick a target region on S^2 for a named family and solve for the conformal map that sends that family's arc to the target while the curveball ensemble's image stays diffuse [source document, Gap D; grounded in https://www.science.org/doi/10.1126/science.1126493, jev weight 0.87, the conformal-map-to-index bridge]. The novelty is the loss: maximize null-standardized concentration, not raw fit. Raw-fit optimization would manufacture a caustic (drive V2 toward exactly 1.0000); the null constraint is the anti-caustic guard [source document, Gap D].

The parameter space stays inside PSL(2,C), 6 real parameters, with L-BFGS-B as already specified in the llc paper's Section 3.2 [source document, Section 1]. A PSL(2,C) Mobius map has 6 real degrees of freedom (3 complex parameters modulo normalization), which is the reason a 6-parameter optimizer suffices [background on the Mobius group; https://en.wikipedia.org/wiki/M%C3%B6bius_transformation, jev weight 0.13, weak backing: orientation only].

## What automated lens design teaches

The optics-design literature has converged on the same shape of problem the corpus needs solved:

- Automated design of compound lenses with discrete-continuous optimization solves lens design as a mixed-variable optimization with differentiable imaging losses, demonstrating end-to-end gradient-based lens design at scale [https://arxiv.org/html/2509.23572v1, jev weight 0.86; https://arxiv.org/abs/2509.23572, jev weight 0.86; project page https://dvicini.github.io/automated-compound-lens-design/, jev weight 0.83; https://imaging.cs.cmu.edu/automated_lens_design/, jev weight 0.70]. Its lesson transfers: formulate the design loss differentiably, optimize, and validate against the imaging metric, not against the optimizer's own loss.
- Condition-number control is an established optimization discipline. Minimizing the condition number to construct design points is a studied problem [https://epubs.siam.org/doi/10.1137/110850268, jev weight 0.86], and efficient algorithms exist for condition-number-constrained matrix problems [https://www.sciencedirect.com/science/article/pii/S0024379520303803, jev weight 0.73]. Structured regularization for constrained optimization on the SPD manifold supplies the machinery for keeping a covariance-like object well-conditioned during optimization [https://arxiv.org/pdf/2410.09660, jev weight 0.77].

## The anti-caustic constraint, explicitly

The source document's Prop. 2 red flag (exact 1.0000 implies report rank and condition number) becomes an optimization constraint in Gap D: reject any phi-theta whose design rank drops or whose condition number blows up. Concretely:

1. Design variable: phi-theta in PSL(2,C), reparameterized to 6 unconstrained reals.
2. Objective: null-standardized concentration of the target family's image on S^2, computed against the empirical null quantile (never Gaussian tails, per the z over-dispersion discipline, sd 1.320 at s=0) [source document, Section 5].
3. Constraints: design rank not below 2, condition number within a bounded interval, evaluated at every optimizer step.
4. Guard against the optimizer's own failure mode: a raw-concentration optimum is a caustic; the null-standardized objective plus the condition-number constraint is what distinguishes a lens from a rank collapse.

The condition-number literature above justifies treating the constraint as first-class rather than as a post-hoc check [https://epubs.siam.org/doi/10.1137/110850268, jev weight 0.86].

## Honesty constraint

Gap D is proposed, not run. No dig result evaluates a null-constrained conformal map over a corpus feature space; the transferable evidence is the lens-design optimization literature cited above. The output of a successful Gap D run would be the first corpus artifact that earns the word "focus" in results rather than in a brainstorm.
