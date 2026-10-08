# 01 - The Bounded 5-Step Cycle Protocol

Scope: the recursive-self-improvement loop shape (gap-map, hypothesis, edit, re-map, fixpoint-or-continue), the 3-cycle soft-preference cap, and the user-override protocol that governs when the loop keeps going and when it stops.

Ground spine: `yubi-OS/yubiOS skills/recursive-self-improvement/SKILL.md` (source doc).

## The loop shape

The source doc defines one loop used in both modes (improvement mode and self-mode) with the same 5 steps:

1. **Gap-map.** Apply `negative-skill-space` to the target SKILL.md. The gap map is the primary input to every cycle; in improvement mode cycle 1 closes gaps from a map made earlier, and in self-mode cycle 1 produces the map itself.
2. **Hypothesis.** Write one explicit edit hypothesis before touching anything. "Let me just tidy this up" is named in the source doc as the anti-pattern that produces cosmetic-only edits.
3. **Edit.** Apply exactly one edit, of exactly one edit type (see 02-edit-taxonomy). A cycle that mixes close + sharpen + reposition is called a red flag driven by vibes, not a hypothesis.
4. **Re-map.** Re-run `negative-skill-space` on the edited skill. The source doc is blunt: the fixpoint rule is meaningless without a fresh gap map after each edit.
5. **Fixpoint-or-continue.** Apply the fixpoint rule and either stop or run another cycle.

## The fixpoint rule

The fixpoint rule has 3 conditions (source doc, Verification section):

1. No new substantive gaps were introduced (substantive means likelihood times severity of 6 or more on the gap map).
2. Old Extend gaps were closed or reduced.
3. No new anti-patterns were created.

All 3 must pass to declare a fixpoint. The source doc's own changelog shows the rule working: cycle 2 of its self-mode run failed condition 1 because the edit introduced 5 new substantive gaps (top severity LxS 12), so the loop continued to cycle 3; cycle 3 closed the substitution wedge and passed all 3 conditions, reaching a fixpoint at v3.

## Why the loop must be bounded

The fixpoint-or-continue structure is a fixed-point iteration in the ordinary numerical-analysis sense: repeated application of a map (edit then re-map) until the output stops changing. The fixed-point iteration literature gives the general contract the loop inherits: iteration continues until successive states converge, and stopping criteria, not open-ended repetition, decide when to halt. Wikipedia's fixed-point iteration article (https://en.wikipedia.org/wiki/Fixed-point_iteration, jev weight 0.76) describes convergence-acceleration methods such as Aitken's delta-squared process and Steffensen's method for the numerical case; the skill's analog of a stopping criterion is the fixpoint rule plus the cycle cap. A dampened-iteration paper on approximated fixpoints (https://www.researchgate.net/publication/388067923_Computing_Approximated_Fixpoints_via_Dampened_Mann_Iteration, jev weight 0.52, weak-to-moderate backing for this corpus) makes the same structural point from the numerical side: a stopping criterion is stated up front, and an upper bound on iterations is proven rather than hoped for. Tutorial-grade pages on the same material, such as https://www.numericalti.com/methods/fixed-point (jev weight 0.32, weak backing), cover the contraction-mapping condition but add nothing the skill needs beyond what the 2 higher-weighted sources carry.

## The 3-cycle cap and the override protocol

The source doc bounds the loop at 3 cycles, as a soft-preference default, not a hard limit. The cap exists because each cycle is expensive and because past the third cycle the returns usually come from scope confusion, not gap closure.

The cap-override protocol (source doc, Step 7 and the changelog) has 3 parts:

1. A user directive can override the cap for a session.
2. The override is recorded in the cycle-1 changelog entry of the overridden run.
3. The fixpoint rule remains the stopping signal regardless of the cap; escalation is mandatory at cycle 5 or beyond.

The skill's own history exercises this: cycle 4 (2026-07-29) and cycle 5 (2026-08-06) both ran under explicit user cap overrides, each recorded in the changelog with the directive quoted. Cycle 4 also logged an author-bias caveat: the re-map ran in the main thread because no subagent was provisioned, a documented limitation of self-mode under main-thread execution.

## Escalation, not drift

When the loop keeps failing the fixpoint rule past the cap, the source doc routes to escalation rather than to more cycles. The re-map disagreeing with the author's intuition is named as the signal that the author is wrong, not the map. And a re-map that flags the skill's place in the workflow (rather than its content) escalates to a `using-agent-skills` review and stops body editing entirely; that is the reposition edit type, not a continuation of gap closing.

## Summary

The protocol is small on purpose: 5 steps, 1 edit type per cycle, 3 fixpoint conditions, a 3-cycle soft cap with a recorded override path, and an explicit verdict at the end of every cycle. Everything else in the skill (modes, taxonomy, stochastic extensions) is machinery around this shape.
