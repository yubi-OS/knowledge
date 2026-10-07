# 08 Skill Composition and Constraints

Grounding spine: yubi-OS/yubiOS `skills/ideate-solo/SKILL.md` (source doc).

## Scope

How ideate-solo composes with the other ideation skills (interview-me, prior-art-search, idea-kill, idea-refine, spec-driven-development), and the four loading constraints that bound it: solo only, read-only, bounded, stop at one-pager.

## The composition graph

Per the source doc:

- **interview-me** is upstream. Run it first if the intent is unclear; solo ideation on unclear intent is wasted effort.
- **prior-art-search** runs upstream or parallel. Before solo ideation it gives the agent concrete prior art to inform variation generation; after, it gives the finalist an honest check.
- **idea-kill** is downstream. After the one-pager, idea-kill verifies whether the winner deserves to ship. The source doc's framing: the solo one-pager is a hypothesis; idea-kill is the verdict.
- **idea-refine** is the alternative, not a dependency. Dialogue-based and higher quality when a human is available; ideate-solo is the fallback when one is not.
- **spec-driven-development** is downstream. After the one-pager, SDD writes the spec.

The composition is a directed pipeline with a deliberate seam in the middle: ideate-solo owns diverge-rank-converge and ends at a document. Every external verification or formalization job belongs to a different skill. This matches the boundary discipline recommended for agent skill systems: skills need boundaries, not just better instructions, because chained skills with unclear ownership create failure and even security surfaces (Alchemic Technology on "Chaining Skills to Hijack LLM Agents", https://alchemictechnology.com/blog/posts/agent-skill-chain-boundaries.html, jev weight 0.23, weak backing). Frameworks for composing multiple specialized skills into multi-step workflows likewise emphasize per-step input/output validation and data mapping between steps (agent-skill-composer, https://github.com/Retsumdk/agent-skill-composer, weight 0.22, weak backing). Ideate-solo's clean artifact handoff (one-pager in, spec out) is that per-step contract.

## The four loading constraints

1. **Solo only.** Never spawn a subagent for ideation. A subagent adds a blind-spot layer without a human to anchor it: two agents sharing the same blind spots, less visibility than one agent whose reasoning a human could audit.
2. **Read-only.** The skill produces documents, not external side effects. No tool calls that write to external systems.
3. **Bounded.** Generate 5 to 8 variations (or scale per scope class), one pass, no recursion beyond the stress-test step.
4. **Stop at one-pager.** The skill does not validate the idea (idea-kill's job) or research prior art (prior-art-search's job, unless run explicitly upstream). It produces the one-pager and hands off.

## Why the constraints matter for composition

Each constraint protects a seam in the graph:

- Solo-only keeps the ideation context small enough for a single human review (the generation log) to cover it. Subagent fan-out would multiply the generation log beyond what the log can audit.
- Read-only keeps the skill safe to run unattended in scheduled jobs and CI, which are its primary trigger contexts (01-philosophy-and-when-to-use.md). An autonomous loop that mutates external systems during "ideation" would violate the expectation of every downstream human reviewer.
- Bounded guarantees the run terminates: one generation pass, one scoring pass, one stress-test pass, one artifact.
- Stop-at-one-pager makes the output position unambiguous for the downstream skills: they receive a hypothesis document, never a validated plan, which is why idea-kill exists as the verdict step.

## The handoff contract in practice

The downstream skills consume specific fields of the one-pager: spec-driven-development takes the Recommended Direction and MVP Scope as spec inputs; idea-kill takes the Key Assumptions and the stress-test critique as the case to argue; prior-art-search takes the Problem Statement as its query seed. The generation log is consumed by humans auditing the run. MVP scoping guidance supports this minimal-handoff shape: plan the MVP around one customer task with a scope checklist and learning plan, rather than a full product plan (NextUnicorn, https://articles.nextunicorn.fund/minimum-viable-product-guide/, weight 0.16, weak backing), and avoid the two classic scope failures: building too much (a "minimum" product with twelve features) or shipping something so rough it teaches nothing (UXAgencies, https://www.uxagencies.com/resources/mvp-design-guide, weight 0.17, weak backing).

## Related reading

- 01-philosophy-and-when-to-use.md: when the fallback path is chosen.
- 05-stress-test-and-convergence.md: the idea-kill handoff trigger.
- 06-one-pager-output.md: the artifact that crosses every seam.
