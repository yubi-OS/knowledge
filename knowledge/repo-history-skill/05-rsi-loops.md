# Recursive self-improvement loops on an archive

Scope: bounded RSI loops applied to an archive: gap-mapping, hypothesis-driven edits, fresh-context subagents, fixpoint rules, and cycle caps with user override.

## The bounded loop, stated plainly

Recursive self-improvement in current practice is bounded, not open-ended: an agent modifies its own code, prompts, or tools, and each round makes the next round better, but the loop runs under explicit stopping rules. A 2026 survey taxonomy separates bounded self-refinement, which is convergent, evaluable, and an industrial practice, from open-ended recursive self-improvement, which remains bounded by grounding requirements, collapse dynamics, and compute constraints on every measured axis (https://arxiv.org/abs/2607.07663, noul 0.8196). A formal framework paper makes the same distinction at the mechanism level, asking whether RSI claims describe a phenomenon, a mechanism, or a prospect, and arguing that no single framework formally describes the emerging instances (https://arxiv.org/abs/2609.13406, noul 0.8083). A systematic review of autonomous agents finds the same frontier: reasoning, planning, tool use, and self-improvement are advancing without a unified framework across paradigms (https://link.springer.com/content/pdf/10.1007/s10586-026-06537-4.pdf, noul 0.8488).

For an archive, the bounded loop takes 5 steps per cycle:

1. Gap-map. Score the archive on an axis sweep and rank the gaps.
2. Hypothesis. State one falsifiable claim about the top gap: this edit will close it and raise the fit metric.
3. Edit. Make exactly one change.
4. Re-map. Re-score the archive.
5. Fixpoint check. If no new gaps appeared, all old gaps closed, and no new anti-patterns appeared, the loop stops.

## Cycle caps and the override protocol

A 3-cycle default cap is the standard guard against unbounded loops. Caps are defaults, not laws: an operator can override per cycle with an explicit directive, which keeps the loop bounded while admitting longer runs when the metric justifies them. The empirical validation rule that accompanies the cap is quantitative: on each cycle, re-fit the corpus and record the fit metrics before and after, and declare fixpoint only when sparse-cell counts have plateaued and the fixpoint rule passes. A closed-loop metric for the whole skill is then checkable: the loop is working when fit quality improves across cycles (variance explained rises) while the sparse-cell count falls or migrates to lower-frequency cells.

## Why fresh-context evaluation

Self-evaluation by the same context that produced the edit inherits the edit's assumptions. A three-phase iterative refinement architecture where agents critique and improve their own outputs shows the pattern is implementable in-process (https://github.com/hankbesser/recursive-agents, noul 0.2875, weak backing), but the stronger discipline is fresh-context evaluation: run each cycle's re-map in a context that has not seen the edit's rationale. Survey repositories catalog self-improvement loops where the update signal and the evaluation are distinct components (https://github.com/selfimproving-agent/Awesome-Self-Improving-Agents, noul 0.5583), and the broader literature review organizes the space as self-improvement within individual components and co-improvement across components (https://d2i-ai.github.io/awesome-recursive-self-improving-agents/, noul 0.1537, weak backing). Practitioner guides converge on the same shape: every real example running today is bounded, with agents rewriting code or optimizing runs under evaluation constraints (https://datasciencedojo.com/blog/recursive-self-improvement-agentic-ai/, noul 0.1041, weak backing).

## Applying the loop to a repo history archive

The archive is both the audit target and the substrate. Concretely:

1. The gap-map runs over the archive's primitive coverage: which reference patterns, state progressions, or evidence fields are structurally missing.
2. The hypothesis names one primitive or one join to fix, for example adding a URL-pattern fallback for tracker references.
3. The edit changes one detector or one join rule.
4. The re-map recomputes coverage on the live repos and re-fits the curve.
5. The fixpoint check compares fit metrics and sparse-cell counts.

The audit trail per cycle records the tuple that makes the loop scientific: cycle number, curve parameters, fit metric before and after, the isolated item index, the geodesic distance before and after, the measured delta, and the applied edit. Without that tuple, a loop is unfalsifiable; with it, every cycle is an experiment with a verdict.

## Anti-patterns

Three failure modes recur in self-improvement systems and are worth naming as design constraints:

1. Metric gaming: editing the corpus to look better on the metric rather than to be better. Guard: hold out a test split and require the holdout metric to move with the training metric.
2. Churn: edits that oscillate without cumulative improvement. Guard: the fixpoint rule, plus a per-cycle delta floor below which the loop stops.
3. Author bias: the editing context judging its own edits. Guard: fresh-context evaluation per cycle (https://arxiv.org/abs/2607.07663, noul 0.8196).

## Design summary

1. Run the 5-step bounded loop with a 3-cycle default cap and an explicit override protocol (https://arxiv.org/abs/2609.13406, noul 0.8083).
2. Record the full per-cycle tuple (parameters, metrics, delta, edit) so every cycle is falsifiable (https://link.springer.com/content/pdf/10.1007/s10586-026-06537-4.pdf, noul 0.8488).
3. Evaluate each cycle in a fresh context (https://github.com/selfimproving-agent/Awesome-Self-Improving-Agents, noul 0.5583).
4. Declare fixpoint on plateaued sparse cells plus the gap-closure rule, never on elapsed cycles alone (https://arxiv.org/abs/2607.07663, noul 0.8196).
