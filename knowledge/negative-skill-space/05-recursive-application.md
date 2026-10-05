# 05 Recursive Application: The Gap Map That Maps Itself

Scope: Applying the gap map to itself: meta-blind spots, recursion depth, bounded loops and stop rules, and the gap map as a new artifact with its own gaps.

## Why recursion is a named axis

Axis 12 of the sweep is the only axis that catches meta-blind spots: failure modes that exist in the mapping process itself rather than in the mapped artifact. A gap map produced without self-scrutiny inherits the mapper's blind spots, and the mapper's blind spots are structurally similar to the author's, since both tend to skip the same kinds of questions. The framework therefore requires one extra step after the 12-axis sweep: run the same sweep on the gap map itself (source doc origin: yubiOS refs/negative-skill-space-2026-07-28.md).

## What the recursive pass found on its own framework

The source doc documents the actual recursive pass on the then-unreleased negative-skill-space skill. Its findings are a worked example of what self-application surfaces:

- **No intentionally-narrow exit.** The framework risked expanding deliberately tight artifacts. Fixed before shipping with an "is this artifact intentionally narrow?" check before mapping.
- **No gap-is-real validation step.** A flagged gap might be a false positive. The fix: require evidence per gap ("for each gap, what evidence supports it?").
- **No priority queue.** Gaps were listed flat; the fix ranks them by return on the effort of closing.
- **Same-blind-spot risk.** Mapper and author share biases; the recommended mitigation is cross-model or external review.
- **No stop signal.** Without a bound, the loop can run forever.
- **The gap map is itself an artifact.** The output must be framed as a new artifact that requires its own map.

The recursion also produced genuine unknowns the framework cannot answer about itself: whether the 12 axes are the right 12, whether some axes collapse into others, and what a 13th or 14th axis would be. Recursion bottoms out somewhere; the framework does not claim to know where (source doc origin).

## The strange-loop background

Self-reference in a system that models itself has been studied most prominently by Douglas Hofstadter. A strange loop is a paradoxical level-crossing feedback loop, a self-referential pattern in which moving up and down descriptive levels eventually loops back to itself; the concept was proposed in "Godel, Escher, Bach" (1979) and elaborated in "I Am a Strange Loop" (2007) (https://en.wikipedia.org/wiki/Strange_loop, weight 0.13, weak backing; https://en.wikipedia.org/wiki/I_am_a_strange_loop, weight 0.73). Hofstadter's central example is a system whose self-model is accurate enough to be part of the system it models. A gap map of a gap map is a small, deliberate instance of the same structure: the second-order map treats the first-order map as an artifact, and the first-order map is about artifacts.

The practical value of the analogy is a warning: strange loops can be paradoxical. A framework that maps its own gaps and then maps the mapping can, in principle, regress forever, generating a new map at every level with no convergence.

## Bounded recursion

The framework's answer to unbounded regression is a bounded loop, borrowed from its own sibling discipline: recursive self-improvement runs in bounded cycles with an explicit fixpoint rule (stop when no new gaps appear, all previously flagged gaps are either closed or consciously accepted, and no new anti-patterns were introduced). This mirrors the AI-safety literature's separation of bounded self-refinement, which is convergent and evaluable, from open-ended recursive self-improvement, which remains bounded by grounding requirements and has no natural stopping point (https://arxiv.org/html/2607.07663v1, weight 0.68). An earlier formal treatment, "Bounded Recursive Self-Improvement" (arXiv 1312.6764), frames the same constraint mathematically: a recursively self-improving system must be bounded to remain predictable and safe (https://arxiv.org/abs/1312.6764, weight 0.71).

Concretely, the bounded negative-skill-space loop is: map the artifact across 12 axes, score and disposition the gaps, map the gap map itself once, fix or accept what that second-order map finds, and stop. The map of the map is the last artifact that must be mapped; a third-order map is explicitly out of bounds in v1 (source doc origin).

## What recursion cannot settle

The source doc's unknown-unknowns list is candid about the limits:

1. **Does mapping close gaps?** Anecdotal only. Naming a gap makes it easier to address; no evidence yet that the gap-map-as-output drives improvement. The recursive application does not validate this either, because the recursion measures coverage, not outcomes.
2. **Does the expansion terminate?** Closing a gap can create new gaps. Whether the process converges to a stable point or improves infinitely is described as the most philosophically loaded unknown.
3. **Are the surfaced unknowns themselves real?** Some claimed unknown-unknowns may be known-unknowns dressed up to seem rigorous. Only external validation, by a different mapper or model, can distinguish them.
4. **Where do accumulated gap maps live?** If gaps are tracked across runs, they need a home: a per-artifact directory, a global registry, or a versioned changelog. The framework does not yet model this (see doc 07).

The synthesis: recursion is mandatory in the method but bounded in the practice. One self-application per map is the rule; more is philosophy, and the framework says so explicitly rather than pretending the regress has a principled bottom.
