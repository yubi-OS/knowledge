# 02 - The Edit Taxonomy: Close, Fix Drift, Sharpen, Reposition

Scope: the 4 edit types the loop may apply per cycle, the single-intent rule that forbids mixing them, and how each type maps to the failure it repairs.

Ground spine: `yubi-OS/yubiOS skills/recursive-self-improvement/SKILL.md` (source doc).

## The 4 types

The source doc's Edit Taxonomy table defines exactly 4 categories:

| Edit type | When it applies | Example from the source doc |
|---|---|---|
| **Close a gap** | A real gap (likelihood x severity of 6 or more) needs extending | Add a missing `## Verification` checklist; add an anti-pattern the gap map flagged |
| **Fix drift** | Description promises X, body delivers Y, or vice versa | Tighten the description to drop phrases the body does not deliver; align the body to a description that was right |
| **Sharpen** | The skill works but has bloat | Cut a section that duplicates the philosophy; merge 2 anti-patterns that say the same thing |
| **Reposition** | The skill's place in the workflow is wrong | Mark it for `using-agent-skills` review and stop editing the body |

The taxonomy is exhaustive by design: every legitimate cycle edit is exactly 1 of these. The source doc's changelog demonstrates the discipline on its own file: cycle 2 (2026-07-28) was a single-intent "close a gap" edit (bias mitigation enforced at 4 points), cycle 3 was a single-intent loophole closure, and cycle 4 (2026-07-29) was a single-intent "fix drift" edit aligning body, description, and metadata on the cap-override protocol.

## The single-intent rule

A cycle that mixes close + sharpen + reposition is a red flag: the loop is being driven by vibes, not a hypothesis. If the skill needs all 3, that is 3 cycles, not 1. This is the taxonomy's real payload. Without it, one big edit can close a gap, introduce drift, and cut a section at once, and the re-map can no longer attribute a new gap to its cause. One intent per cycle keeps the re-map diagnostic.

The cost is honest and accepted: the source doc's cycle-3 changelog notes that cycle-1 gaps 2 through 8 stayed unchanged "by design (single-intent protocol closes one gap per cycle)". The loop trades breadth per cycle for attributability across cycles.

## Why drift is its own category, not a cleanup

The source doc is explicit that description drift is a real gap, not cosmetics: the trigger match silently degrades, and downstream skills do not fire when they should. The general documentation-drift literature describes the same mechanism outside skills. A guide at https://datadef.io/guides/en/documentation-drift (jev weight 0.22, weak backing) defines documentation drift as the growing gap between what documentation says and what the system does, accumulating one unrecorded change at a time, with a drifted page looking identical to a current one; that invisibility is exactly why the skill makes drift a first-class edit type instead of a byproduct of other edits. Two other drift writeups, https://pushpen.dev/blog/documentation-drift (jev weight 0.20, weak backing) and https://www.mintlify.com/library/how-to-stop-documentation-drift (jev weight 0.19, weak backing), treat drift as an operational maintenance problem rather than a per-edit discipline; the skill's contribution is to give drift its own cycle type with its own hypothesis.

## Sharpen is subtraction, reposition is a stop

Sharpen edits only remove: duplicated sections, redundant examples, merged anti-patterns. If a sharpen cycle produces new claims, it has become a close-a-gap edit and must be reclassified. Reposition edits do not touch the body at all: when the gap map says the skill sits in the wrong place in the workflow, the correct output is a referral to `using-agent-skills` and a stop. This keeps reposition from becoming a license to rewrite.

## Relation to refactoring taxonomies

The taxonomy parallels the code-refactoring tradition: refactoring is restructuring existing code without changing its external behavior, intended to improve design, structure, or implementation (https://en.wikipedia.org/wiki/Code_refactoring, jev weight 0.44, weak backing for this corpus's framing). Empirical work on refactoring practice finds developers perform refactorings with motivations beyond what commit messages describe (https://smilevo.github.io/self-affirmed-refactoring/Preprint/ESWA20_preprint.pdf, jev weight 0.41, weak backing), which is the same attribution problem the single-intent rule solves for skills: if the motive is not declared before the edit, the result cannot be audited against it. The skill's taxonomy is not derived from any of these sources; the sources are cited as the surrounding discipline that classifies intentional changes by type.

## Summary

4 types, 1 per cycle. Close extends, fix-drift realigns promise and delivery, sharpen subtracts, reposition refers and stops. The single-intent rule is what makes the re-map able to say which edit caused which gap, and the changelog line for each cycle must name its type.
