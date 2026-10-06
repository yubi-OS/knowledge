# When to use, when not to, and the floor-only fallback

Scope: the trigger and boundary conditions from the source doc's When to Use section, plus the Loading Constraints rule for non-interactive contexts. This is an internal-record subtopic, no dig: the content is the source doc's own trigger taxonomy and is cited to it throughout.

## Apply the skill when

The source doc lists six triggers (source doc):

1. Starting a project or a significant feature and no quality bar is written down.
2. The user asks to set up constraints, add quality gates, define our standards, or stop the agent shipping junk.
3. An agent is producing volume nobody is reading line by line.
4. CI has checks but nobody can say which ones block a merge and which ones are decoration.
5. Coverage, performance, or accessibility numbers get argued about per-PR instead of decided once.
6. You are about to run an autonomous loop, and the only thing standing between it and main is a test suite the agent also wrote.

Trigger 4 is the diagnostic signature: the presence of checks is not the presence of a bar. The skill's claim is that a bar exists only where someone can name, per dimension, the number and the command that enforces it.

## Do not use when

Four exclusions (source doc):

- The project already has a `CONSTRAINTS.md` and the user is not changing it. Read it and follow it instead; re-running the interview over an existing contract is the wrong move.
- One-off scripts, spikes, throwaway prototypes.
- The user wants a code review right now, which is `code-review-and-quality`, or a CI pipeline built, which is `ci-cd-and-automation`.
- Pre-product-market-fit code with a 2-week expected lifetime. The source doc adds a nuance: for such code the floor (below) is still worth it, the rest is not.

The boundary is about the artifact, not the activity: other skills review code or build pipelines; this skill decides what those reviews and pipelines enforce. Its See Also section wires exactly those handoffs (source doc).

## Non-interactive contexts

The Loading Constraints section is a hard rule: the interview needs a live user, so do not run it in non-interactive contexts such as CI or autonomous runs. If constraints are missing and you are in one of those, apply the floor, note that you did, and flag the rest for a human (source doc). The floor is the five mechanical prohibitions listed in the `CONSTRAINTS.md` template: no new suppression comments, no unimplemented stubs, no skipped or deleted tests without a reason in the commit message, no secrets in source, and no weakening of the file itself to make a change pass (source doc, detailed in 04).

The same live-user requirement reappears in the Guidelines section, which repeats the rule verbatim as Guideline 1 (source doc). The design intent: an interview with no user produces invented numbers, and invented numbers get ignored (source doc, Step 2 Q3 reasoning).
## Why the exclusions matter

Each exclusion encodes a failure mode the interview would otherwise create. Re-interviewing over an existing `CONSTRAINTS.md` risks a second, competing source of truth for the bar; the source doc's script-mapping rule (the file is canonical, wrappers mirror it) extends to humans too (source doc). Prototypes and spikes are excluded because the ratchet's cost is only repaid by code that lives; the source doc still carves out the floor for short-lived code, which is the cheapest possible bar: 5 pattern classes checked by a diff-only guard with no installs (source doc). The pre-product-market-fit carve-out is a proportionality rule, not a license: the floor stays, the numbered dimensions wait.

The CI-checks trigger (trigger 4) deserves emphasis because it is the most common pre-existing condition. A pipeline can be full of decoration: linters nobody reads the output of, coverage reports with no threshold attached, security scanners that produce tickets nobody closes. The interview question that exposes this is not do you have checks but which check blocks a merge and on what number, which is why Step 4's checked-by column requires a command per row (source doc, see 04).

Trigger 6 is the sharpest version of the problem: an autonomous loop unattended. If the only thing standing between the loop and main is a suite the agent also wrote, the circularity argument of the diff-watch doc applies in its purest form, which is why the source doc pairs this trigger with the guard mechanism rather than with more tests (source doc, see 07).

## The floor as the always-on baseline

Because the floor needs no installs and no interview, it is what the skill installs in non-interactive contexts (source doc) and also what a first run can start with, day 1, before any tool lands (source doc, escalation section). The two uses are the same 5 prohibitions: suppression comments, unimplemented stubs, skipped or deleted tests without a stated reason, secrets in source, and weakening the file itself. In an interactive session the interview then adds numbered dimensions on top; in CI the floor is simply all there is, and the flag-for-a-human note in the Loading Constraints section is the recorded handoff (source doc).
