# 06 One-Pager Output

Grounding spine: yubi-OS/yubiOS `skills/ideate-solo/SKILL.md` (source doc).

## Scope

The one-pager output format: problem statement, recommended direction, assumptions to validate, MVP scope, not-doing, open questions, and generation log, saved to `docs/ideas/[idea-name]-solo-YYYY-MM-DD.md`.

## The template

Per the source doc, the output is a markdown one-pager with this exact shape:

```markdown
# [Idea Name] [SOLO]

Date: YYYY-MM-DD
Source: ideate-solo (no dialogue)
Scope class: systemic | medium | atomic
Variations generated: N
Finalist: [name]

## Problem Statement
[One sentence — How Might We]

## Recommended Direction
[The chosen variation and why — 2-3 paragraphs max]

## Key Assumptions to Validate
- [ ] [Assumption 1 — how to test it]

## MVP Scope
[Minimum version that tests the core assumption]

## Not Doing (and Why)
- [Thing 1] — [reason]

## Open Questions
- [Question that needs answering before building]

## Generation log (for review)
- Variations generated: [list with lens + score]
- Dropped below threshold: [list with reason]
- Finalists: [top 2-3]
- Stress-test critique: [strongest critique of winner]
```

Optional: prefix the title with `[SOLO]` for grep-ability. The file goes to `docs/ideas/[idea-name]-solo-YYYY-MM-DD.md` so solo-produced ideas are visually distinct from dialogue-produced ones.

## Problem statement: the How-Might-We form

The Problem Statement field is a one-sentence How Might We. The HMW model acts as a north star for the design thinking process, transforming challenges into opportunities by framing problems in an open, possibility-oriented way (The Idea Guy, https://theideaguy.us/design-thinking-problem-statements/, jev weight 0.16, weak backing). A good problem statement has identifiable components and can be scored for quality; guides enumerate the components a design thinking problem statement must contain and offer a scoring test for drafts (Humane Design Thinking, https://humanedesignthinking.com/how-to-write-a-problem-statement-for-a-design-thinking-project/, weight 0.22, weak backing). This is why the pipeline gate in step 1 (02-process-pipeline.md) reuses the same sentence: the gate output is the artifact's first field.

## Assumptions, MVP scope, and not-doing

The "Key Assumptions to Validate" section requires each assumption to carry its own test method, and the "MVP Scope" section must state the minimum version that tests the core assumption. MVP scoping templates converge on the same elements: one core journey, the riskiest assumption, success metrics, and a small release surface (Nextolive, https://nextolive.com/free-tools/mvp-requirements-template/, weight 0.14, weak backing; The Ordinary Company, https://theordinarycompany.io/blog/mvp-scope-template/, weight 0.21, weak backing; Capiller, https://capiller.com/blog/minimum-viable-product-template, weight 0.19, weak backing). Miro's MVP template frames the same contract as "scope your MVP, validate assumptions, and ship the smallest version that delivers value" (Miro, https://miro.com/templates/minimum-viable-product/, weight 0.15, weak backing).

The "Not Doing (and Why)" section is the anti-scope statement. It exists because a one-pager without explicit exclusions drifts into a feature list; each excluded item carries its reason inline.

## The generation log: auditability without a human

The generation log is the section that distinguishes solo ideation from dialogue ideation in the artifact itself. It records: every variation with its lens and score, every variation dropped below threshold with the reason, the top 2 to 3 finalists, and the strongest critique of the winner. The source doc's red-flags list calls the log "how the user audits solo ideation": because no human was present during generation, the log is the only trace of what the agent considered and rejected. A one-pager produced without the generation log is listed as a red flag.

## Markers of solo provenance

Two deliberate provenance markers per the source doc: the `-solo` suffix in the filename, and the `Source: ideate-solo (no dialogue)` metadata line (plus the optional `[SOLO]` title prefix). A one-pager that looks identical to idea-refine's output is a red flag; the markers exist so downstream readers know the ideation was unanchored by dialogue and should be weighted accordingly.

## Related reading

- 02-process-pipeline.md: the pipeline that fills the template.
- 05-stress-test-and-convergence.md: the fields sourced from the stress-test.
- 07-anti-patterns-and-red-flags.md: the red flags tied to this artifact.
