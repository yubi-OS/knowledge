# Documenting Decisions, Not Just Code

Scope: the core thesis of the documentation-and-adrs skill, the six trigger conditions for writing documentation, the anti-triggers, and why the audience includes agents as well as engineers.

## The thesis

The skill's opening claim (source doc, yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md, "Overview") is: document decisions, not just code. The most valuable documentation captures the *why*: the context, constraints, and trade-offs that led to a decision. Code shows *what* was built; documentation explains *why it was built this way* and *what alternatives were considered*. Per the source doc, this context is essential for two audiences: future humans and future agents working in the codebase.

This framing matters because the *what* is recoverable from the repository. The *why* is not. A reader can diff the code to learn what changed; no command recovers the alternatives that were rejected or the constraint that forced the choice. The Microsoft Azure Well-Architected guidance on maintaining an architecture decision record (https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record, weight 0.77) frames ADRs as records of the significant architectural choices and their rationale, which matches the source doc's position. The ADR community hub (https://adr.github.io/, weight 0.63) and the canonical architecture-decision-record repository (https://github.com/architecture-decision-record/architecture-decision-record, weight 0.70) describe ADRs as short text files capturing one decision, its context, and its consequences.

## Trigger conditions

Per the source doc ("When to Use"), the skill fires on 6 conditions:

1. Making a significant architectural decision.
2. Choosing between competing approaches.
3. Adding or changing a public API.
4. Shipping a feature that changes user-facing behavior.
5. Onboarding new team members (or agents) to the project.
6. When you find yourself explaining the same thing repeatedly.

Condition 6 is the economic signal: repeated explanation is documentation debt made visible. A weak-backed secondary source (https://aicodingguild.com/blog/architecture-decision-records-document-why-not-what, weight 0.24) argues the same point from the AI-agent angle: undocumented architecture decisions get re-litigated by every new contributor and every coding agent that touches the code. That source is below the 0.5 authority threshold, so treat it as corroboration of the source doc rather than independent evidence.

The sixth trigger also connects to onboarding. The source doc explicitly names onboarding of team members *or agents* as a trigger, which is unusual among traditional documentation guides and reflects yubiOS's agent-heavy workflow. A weak-backed practitioner piece (https://optimizedbyotto.com/post/write-high-quality-design-documents/, weight 0.10) makes the adjacent argument that writing design documents is how you design; treat that as weak backing only.

## Anti-triggers

The source doc is equally explicit about when NOT to document:

- Don't document obvious code.
- Don't add comments that restate what the code already says.
- Don't write docs for throwaway prototypes.

The anti-triggers exist to keep the discipline credible. If every line gets a comment, the load-bearing comments drown. A weak-backed Stack Exchange thread on commenting-out code (https://softwareengineering.stackexchange.com/questions/377186/why-is-it-wrong-to-comment-out-code-and-then-commit-it, weight 0.11) makes the mirrored point that noise documentation gets ignored, so the valuable signal loses its audience.

## Consequences of skipping the doc

The source doc's "Common Rationalizations" table (expanded in doc 09) attacks the standard excuses: "the code is self-documenting" fails because code shows what, not why; "nobody reads docs" fails because agents do, future engineers do, and your 3-months-later self does. The strongest line in the table is the ADR economics claim: a 10-minute ADR prevents a 2-hour debate about the same decision 6 months later (source doc).

A weak-backed LinkedIn piece (https://www.linkedin.com/pulse/architecture-decisions-reason-isnt-documented-jrpsc, weight 0.11) argues that if the reason isn't documented, the decision doesn't exist for future readers. Below the authority threshold; cite it only as a practitioner echo.

## How this corpus uses the thesis

Docs 02 and 03 cover the ADR machinery (when to write, the template, the lifecycle). Docs 04 through 07 cover the four documentation surfaces the skill names: inline comments, API documentation, README, changelog. Doc 08 covers the agent-facing documentation surface. Doc 09 records the rationalizations and red flags, and doc 10 records the skill's declared position in the yubiOS primitive-coverage model.
