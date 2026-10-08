# 03 - Phase 1: Specify and Surface Assumptions

Scope: starting from a high-level vision, asking clarifying questions until requirements are concrete, and surfacing assumptions before any spec content is written.

## The phase rule

The source doc (yubi-OS/yubiOS skills/spec-driven-development/SKILL.md) starts Phase 1 with a high-level vision and a loop: ask the human clarifying questions until requirements are concrete. To clarify is to make understandable (weight 0.79, https://www.merriam-webster.com/dictionary/clarify); the phase exists to make the requirement understandable before it is frozen into a spec.

## Assumptions come first

Before writing any spec content, the source doc requires listing what you are assuming, in an explicit block addressed to the human, for example: this is a web application rather than native mobile; authentication uses session-based cookies rather than JWT; the database is PostgreSQL based on the existing Prisma schema; the target is modern browsers only. The block ends with a direct challenge: correct me now or I will proceed with these.

The rationale is the strongest sentence in the source doc: do not silently fill in ambiguous requirements, because the spec's entire purpose is to surface misunderstandings before code gets written, and assumptions are the most dangerous form of misunderstanding (source doc). An assumption that is never spoken cannot be corrected; one spoken in a block can be vetoed in seconds.

## The agent-facing analogue

The same discipline appears in agent-prompting documentation: Dreamflow's guide instructs the agent to analyze the request before writing any code and, if there is any ambiguity in scope, behavior, data, or implementation, ask clarifying questions first and not proceed until they are answered (weight 0.42, weak, https://docs.dreamflow.com/prompting-effectively/). The mechanism matches the source doc even though the source is weaker: refusal to proceed past ambiguity is the operational form of surfacing assumptions.

## Weakly-backed context

Project-management practice treats assumptions as a first-class artifact: writing assumptions and constraints into a software requirements specification is a recognized practice (weight 0.21, weak, https://qat.com/writing-assumptions-constraints-srs/), and general project-assumptions guidance exists at aggregator level (weight 0.14, weak, https://www.smartsheet.com/content/project-assumptions). These confirm that the assumption-listing move is standard outside agentic workflows too, but the corpus cites them as weak backing only.

## What Phase 1 produces

Phase 1 produces the spec document itself, covering six core areas and the template fields (doc 04), and it terminates when the human has reviewed and approved the spec. The source doc's verification checklist requires that the human review happened before implementation proceeds, and that success criteria are specific and testable (source doc; doc 05 covers the reframing move).

## Boundary case

The source doc's examples section carries a boundary-case rule: when the request only names a trigger without the artifact it acts on, route to the owning surface instead of improvising (source doc). In Phase 1 terms: an ambiguous request is a trigger for clarifying questions, not a license to guess the artifact.
