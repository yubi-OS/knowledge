# 07 - Verification and the Definition of Done

Scope: verify-don't-assume as the universal rule, and the difference between per-skill verification and the project-wide Definition of Done bar.

## Grounding spine

Source doc: `yubi-OS/yubiOS skills/using-agent-skills/SKILL.md`, behavior 6 of "Core Operating Behaviors" and the "Quick Reference" Verify phase. Partly web-shaped; the dig grounded the external vocabulary around verification.

## The universal rule

Behavior 6 states the rule in 3 sentences: "Every skill includes a verification step. A task is not complete until verification passes. 'Seems right' is never sufficient - there must be evidence (passing tests, build output, runtime data)" (source doc, Core Operating Behaviors, behavior 6). Three properties of the rule:

1. It is universal: every skill carries it, so it applies regardless of routing (doc 01).
2. It is a completion gate: completion is defined by verification passing, not by the work being written.
3. It demands evidence, not impression: the named evidence classes are tests, build output, and runtime data.

Failure mode 10, "skipping verification because 'it looks right'", is the direct violation (source doc, Failure Modes).

## Two verification layers

The source doc distinguishes the per-skill check from the project-wide bar: "Per-skill verification is the local check. The project-wide bar that applies to every change, regardless of which skill is active, is the Definition of Done: tests pass, no regressions, behavior verified at runtime, docs updated. See references/definition-of-done.md. It complements each task's acceptance criteria rather than replacing them" (source doc, behavior 6).

So the stack has 3 layers:

1. Task acceptance criteria: what the specific task promised.
2. Per-skill verification: the local check the active skill's own steps define.
3. Definition of Done: the 4-item bar that every change must clear, no matter which skill ran.

The 4 DoD items, as the source doc lists them: tests pass; no regressions; behavior verified at runtime; docs updated. The doc points at `references/definition-of-done.md` as the file of record for the full bar.

The complement-not-replace clause matters for scope: the DoD does not absorb task-specific acceptance criteria. A task can clear the DoD and still fail its own acceptance criteria, and vice versa is impossible to complete on: the DoD is a floor, not the ceiling.

## The Verify phase in the quick reference

The quick reference assigns 3 skills to Verify (source doc, Quick Reference): test-driven-development ("failing test first, then make it pass"), browser-testing-with-devtools ("Chrome DevTools MCP for runtime verification"), and debugging-and-error-recovery ("reproduce, localize, fix, guard"). The Verify phase is thus both a phase (where tests live) and a cross-cutting obligation (behavior 6), and the table's 3 skills are the concrete instruments the obligation uses: tests as the primary instrument, browser DevTools for UI runtime verification, and the debugging skill for the case where verification fails.

## External vocabulary

The dig grounded the surrounding vocabulary, with weak source weights that are labeled as such. The classic verification-vs-validation distinction, "verification" as building the thing right against requirements and "validation" as building the right thing, is the standard software engineering framing (https://en.wikipedia.org/wiki/Verification_and_validation, jev weight 0.20, weak backing). Under that vocabulary, the source doc's per-skill verification is verification, and its Definition of Done's "behavior verified at runtime" leans toward validation, checking the deployed behavior rather than the artifact. A runtime-verification vendor page defines runtime verification as checking a system's execution against a formal specification during execution (https://runtimeverification.com/, jev weight 0.16, weak backing), which is a stricter instrument than the source doc requires. A Scrum-oriented Definition of Done overview describes the DoD as the quality bar an increment must clear before it can be considered done (https://teachingagile.com/scrum/psm-1/scrum-implementation/definition-of-done, jev weight 0.11, weak backing), and Scrum.org's scrum pages frame the "done increment" similarly (https://www.scrum.org/resources/blog/5-challenges-creating-done-increment, jev weight 0.14, weak backing).

None of these low-weight sources is load-bearing for this doc: the rule, the 3 layers, and the 4 DoD items come entirely from the source doc. They are recorded as collected evidence that the source doc's concepts match the wider engineering vocabulary.

## Why evidence classes are named

The rule names 3 evidence classes (tests, build output, runtime data) rather than a generic "checked". That prevents the most common evasion: restating confidence as evidence. The classes map to the failure the rule counters: "it looks right" is an impression about code; build output is an impression about integration; only runtime data and passing tests are observations about behavior. The source doc's ordering, with "behavior verified at runtime" inside the DoD, makes the strongest class mandatory.

## Relation to the skills chain

In the lifecycle sequence (doc 05), verification appears twice: as a step (test-driven-development at step 10) and as the gate at every step boundary (rule 2: "don't skip verification steps"). The DoD is the terminal gate: the change is done when tests pass, no regressions exist, runtime behavior is verified, and docs are updated. Only after that gate does the Ship phase's skills (git-workflow-and-versioning, ci-cd-and-automation, shipping-and-launch) pick the change up.

## Practical checklist

A completion report is DoD-complete when it can answer all 4 with evidence:

1. Which tests ran and passed? (test output)
2. What was checked for regressions, and how? (test suite, comparison run)
3. What runtime behavior was observed, where? (runtime data, logs, browser DevTools session)
4. Which docs changed, and why? (docs diff)

Any item answered without evidence returns the work to the active skill's verification step rather than to Ship.
