# Recording rejected models and alternatives with rationale

Scope: how to write down the models, options, and paths that were considered and rejected, with the reasons, so that a register distinguishes rejected-as-primary-path from never-viable and future readers do not relitigate or silently re-adopt a rejected model.

## Rejected alternatives are first-class record content

The arc42 documentation quality guidance is direct: when documenting architecture decisions, you should include rejected alternatives together with the reasons why these were rejected (https://docs.arc42.org/tips/9-6/, jev weight 0.87). This is not an optional nicety. A decision record that lists only the chosen option hides the option space that was actually evaluated, which makes the decision impossible to re-derive: the reader cannot tell whether the choice was obvious or contested, or which constraints eliminated the alternatives.

Template support follows the same logic. The ArchMan ADR template lists Alternatives Considered (rejected options with reasons) as a standing section alongside context, decision, and consequences (https://archman.dev/docs/documentation-and-modeling/architecture-decision-records-adr/template-and-rationale, jev weight 0.56). Microsoft’s ADR guidance similarly requires problem statement with context, options considered, and decision outcome as separate content (https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record, jev weight 0.94).

## Naming serious alternatives prevents rework

A practitioner source argues that you do not need a long debate record, but naming serious alternatives stops people from assuming they were never considered (https://tryomie.com/library/capture-decision-rationale-not-just-result, jev weight 0.21, weak backing). The same source frames the rationale as the tradeoff: name the constraint, value, risk, or evidence that made the choice reasonable, which is the part future readers need most. This maps directly onto the rejected-models table pattern used in decision registers, where each rejected row carries the rejection reason, not just the name of the rejected model.

A guide aimed at new engineers makes the failure mode concrete: architecture decision records fail when they document consensus instead of reasoning, and the fix is to structure records with concrete context, rejected alternatives, and revisit conditions so the next engineer can understand not just what was decided but why (https://doc.holiday/blog/writing-architecture-decision-records-new-engineers, jev weight 0.55).

## Rejected versus non-selected: research on what gets lost

Empirical work on decision preservation finds that the rejection reasons are systematically the first thing to disappear. A 2026 MDPI paper on BIM-enabled architectural projects reports that information systems preserve accepted decisions far more reliably than the rejected and non-selected alternatives that shaped them: drawings, models, specifications, and common data environments record what a project became, while the reasons that eliminated competing alternatives are lost (https://www.mdpi.com/2075-5309/16/12/2332, jev weight 0.84). Although the setting is construction rather than software, the finding generalizes: records naturally accrete around outcomes, and rejection rationale needs a deliberate artifact of its own to survive.

## Rejected as primary path versus never viable

Registers that distinguish rejected-as-primary-path from never-viable carry more information per row. The distinction encodes a claim about the future: something rejected as the primary path may become viable again under different constraints, while something rejected as fundamentally conflicting with a governing document will stay rejected as long as that document stands. This is why rejection reasons in well-built registers cite the governing constraint (a covenant section, a policy, a mission statement) rather than a momentary preference: the reason is anchored to something checkable. Microsoft’s guidance supports recording the important tradeoffs made with a decision and the confidence level, which serves the same anchoring purpose (https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record, jev weight 0.94).

Product-level decision records generalize the pattern beyond architecture: a Product Decision Record explains why an option was rejected, what risks were considered, and which future changes would require a new decision (https://www.glukhov.org/app-architecture/documentation/decision-records-ai-driven-development/, jev weight 0.39, weak backing). The last field, which future changes reopen the decision, is the bridge between the rejected row and the deferral machinery covered elsewhere in this corpus.

## Tooling note

A template repository aimed at AI-assisted development lists Decision (stated plainly), Alternatives Considered (each option with honest trade-off analysis, including why rejected options were rejected), Rationale (why the chosen option won), and Consequences as its fields (https://github.com/diabolikss-debug/architecture-decision-recorder, jev weight 0.42, weak backing). The consistent pattern across sources is that alternatives and their rejection reasons are a named, non-optional field.
