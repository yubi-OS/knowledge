# 04 - The Output: Edited Skill, Changelog Line, Explicit Verdict

Scope: the 3 artifacts every cycle produces, the changelog audit-trail format, and the difference between a fixpoint verdict and a continue verdict.

Ground spine: `yubi-OS/yubiOS skills/recursive-self-improvement/SKILL.md` (source doc).

## The 3 artifacts

A cycle produces exactly 3 outputs (source doc, The Output section):

1. **Edited SKILL.md.** The real change, saved as a real artifact. The Verification checklist requires the final SKILL.md to be saved as a file, not just modified in conversation.
2. **One changelog line** appended to the skill's `## Changelog` section. One line per cycle.
3. **A fixpoint or continue verdict.** Explicit, not implied. A cycle that ends without a stated verdict has not ended.

## The changelog format

Each changelog line carries hypothesis, edit, and result in that order. The source doc gives worked examples:

```markdown
- 2026-07-28 cycle 1: Hypothesis "Description promises `negative-skill-space`
  pairing but body never names it." Edit: added `Interaction with Other
  Skills` section. Result: re-map shows no new substantive gaps; fixpoint
  reached.
```

A continue line names the new gap the edit exposed:

```markdown
- 2026-07-28 cycle 1: Hypothesis "Section X is bloat." Edit: cut section X.
  Result: cut was right, but exposed a missing cross-reference. Continue to
  cycle 2.
```

An escalate line stops the loop and names who decides next: "user flagged during cycle 2 that the skill's position is the real problem. Escalate to user. No cycle 3."

## What a bad changelog line looks like

A changelog that reads like a status report ("updated section X") rather than a hypothesis, edit, result line is listed as a red flag (source doc). So is producing a changelog entry without a hypothesis preceding it. The changelog is the audit trail, not a diary: its purpose is that a later reader can reconstruct why the file changed and whether the claimed gap was actually closed.

## Improvement theater

The source doc names improvement theater as an anti-pattern: producing a changelog entry but not actually closing the gap the entry claims to close. The related failure is cosmetic-only edits marked as "improvements" that do not change scope or behavior. The changelog format is the countermeasure: because each line must state a testable result (gap closed or not, fixpoint reached or not), a hollow cycle cannot be dressed up as a productive one. The skill's own cycle-2 changelog entry is the honest example: the re-map found the declared gap only PARTIALLY CLOSED and 5 new gaps introduced, so the line records failure, not success.

## The verdict vocabulary

3 outcomes exist (source doc, changelog examples):

- **Fixpoint reached.** The fixpoint rule passes: no new substantive gaps (LxS of 6 or more), old Extend gaps closed or reduced, no new anti-patterns. The loop stops with a shippable file.
- **Continue.** The rule fails on at least one condition and another cycle is within the cap. The line names the specific new gap that continues the loop.
- **Escalate.** The cap is spent, or the re-map surfaces a reposition-level problem, or the user overrides. No further cycle without explicit direction.

The escalate path is also the narrow-scope guard: closing a gap the author intentionally left open is an anti-pattern, so before flagging a missing capability the loop reads the target skill's "When NOT to use" or Scope section first.

## Backfilled entries are part of the format

The changelog examples include entries written after the fact when the result was not yet known at write time. The source doc's cycle-3 entry notes it "backfilled the cycle-2 changelog entry with the actual result (was 'pending')". So the audit trail permits a pending line, but leaves it pending at the peril of the next re-map: the fixpoint rule cannot be evaluated against an unevaluated prior cycle.

## Summary

Edit the file, append 1 line, state the verdict. The line is hypothesis, edit, result; the verdict is fixpoint, continue, or escalate; and the trail exists so that improvement theater has nowhere to hide.
