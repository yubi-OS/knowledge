# Gap Versus Fit Artifact: Adversarial Validation of Isolated Cells

**Scope:** The fit-artifact hazard: whether isolated cells are real gaps or artifacts of the 19-D union basis, and fresh-context adversarial validation by independent subagents.

## The hazard

A differential fit projects binary coverage vectors through a 19-dimensional union basis into a 2-D plane, then counts cell occupancy. Every projection step is a place where structure can be created or destroyed: two items can land far apart in the plane despite sharing primitives, or close together despite differing ones. So the 25 skill-only cells carry an unresolved question the source doc states plainly: "the skill-only cells are real gaps, not artifacts of the curve fit" is an assumption to validate, and "some of the 25 may be artifacts of the 19-D union basis" is named as an open question [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, key assumptions and open questions].

This is not paranoia about projection. Dimensionality-reduction artifacts are a documented, evaluated phenomenon: 2-D maps built from high-dimensional data "always suffer from artifacts" such as false neighbors and false clusters, and the mapping's promise that insights in 2-D reveal valid information in high dimensions requires explicit evaluation [weight 0.61, https://arxiv.org/pdf/1705.05283; weight 0.73, https://arxiv.org/abs/1705.05283]. Linear methods are prized for their geometric interpretability, but that interpretability does not eliminate projection error [weight 0.29, weak backing, http://arxiv.org/abs/1406.0873].

## The test design

The source doc specifies a direct, behavioral test rather than a statistical one [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, key assumptions]:

- Dispatch 5 fresh-context subagents, each on one skill-only cell, asking: does any self-doc item reference this skill or its capability?
- Dispatch 5 fresh-context subagents, each on one selfdoc-only cell, asking: does any yubiOS skill cover this capability or state?

Two design properties make this a real test:

1. **Fresh context.** The validating agent does not share the authoring agent's context, so it cannot inherit the fit's conclusions. It answers from the corpora themselves.
2. **Directional symmetry.** Both directions get tested with the same design, so a symmetric result strengthens the claim that the buckets are real, while an asymmetric result localizes the artifact.

## Why fresh context matters

Cross-context review formalizes this pattern: a verification method where a model reviews an artifact in a fresh session containing only the artifact and a standardized review prompt [weight 0.66, https://arxiv.org/pdf/2603.12123]. Reported self-review blindness is severe: LLMs are reported to miss a majority of errors when reviewing their own output, which is why isolated review sessions with no shared context are the fix [weight 0.14, weak backing, https://pypi.org/project/ccr-review/]. Research on cross-model review grounds the design in the same principle as human peer review: the verifier's judgment must not be contaminated by the biases that produced the original output [weight 0.47, weak backing, https://arxiv.org/html/2610.01471].

Bias taxonomies for language models distinguish intrinsic and extrinsic sources and note that evaluation methods themselves must be assessed critically [weight 0.55, https://arxiv.org/html/2411.10915v1]. The differential's validation step is exactly such an assessment of its own evaluation instrument.

## Interpreting outcomes

Each subagent answers one question per cell, and the outcomes branch cleanly:

- **No counterpart found:** the cell is a real gap; it stays on the land-grab list.
- **Counterpart found:** the fit missed a genuine overlap. The cell is an artifact of projection or basis choice, and it should be removed from the action list. If this happens repeatedly, the right response is to revisit the basis or radius, not to force documentation anyway.
- **Ambiguous partial reference:** the cell is a partial gap; the entry written should acknowledge the existing self-doc reference rather than claim full silence.

The source doc's MVP accepted only the first interpretation as dispatch-worthy at scale: the top-5 entries were written because they passed the "structurally unique" reading, and the artifact test gates expansion to the remaining 20 cells [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`].

## Cost-benefit of adversarial validation

The validation is cheap relative to what it protects. Five subagent runs per direction cost far less than writing 25 documentation entries for cells that are projection noise. The alternative validations are weaker: statistical resampling of the basis tells you about variance, not about whether a specific claimed gap references real corpus content. Direct lookup by an independent agent answers the operational question ("should I write this entry") with the same evidence a human auditor would use.

## Residual limits

Even fresh-context validation has limits. An agent searching the self-doc corpus can miss an oblique reference (a memory section that covers a skill's capability without naming it), so a "no counterpart" verdict is evidence, not proof. The re-fit after dispatch is the backstop: if a written entry never produces anchoring or migration across cycles, the cell was likely misclassified from the start [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, verification checklist].
