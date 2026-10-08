# 03 - Modes and Self-Author Bias: Fresh Context per Cycle

Scope: the 2 modes of the loop (improvement mode and self-mode), why self-mode is structurally prone to author bias, the mandatory fresh-context subagent for every cycle, and the exact status of `doubt-driven-development` as a supplement that never substitutes.

Ground spine: `yubi-OS/yubiOS skills/recursive-self-improvement/SKILL.md` (source doc).

## The 2 modes

Improvement mode (default): the input is a gap map from `negative-skill-space` applied to a different skill, and the loop closes the gaps on that target skill. Cycle 1 is gap-closing; later cycles catch edit-induced gaps. Improvement mode on someone else's skill can run inline, because the author and the reviewer are already different entities.

Self-mode: the input is the skill itself. Cycle 1 applies `negative-skill-space` to the skill; cycle 2 onward closes the gaps the map surfaced. The structural hazard is stated plainly in the source doc: the entity that wrote the skill is the entity reviewing it.

## Why every cycle needs fresh context, not just cycle 1

The source doc makes the subagent mandate precise and mandatory, not optional:

- Use a fresh-context subagent (`context-isolation`) for every cycle in self-mode.
- Cycle 2 or later in main-thread context re-introduces the author bias that cycle 1's subagent mitigated. If cycle 2 or later runs in the main thread, the recursion has lost its integrity.
- If the re-map keeps disagreeing with the author's intuition, that is the signal the author is wrong, not the map.

The skill's own changelog shows the failure mode in production: cycle 4 (2026-07-29) ran its re-map in the main thread because no subagent was provisioned under the user's cap override, and the changelog records this as a documented limitation of self-mode under main-thread execution, recommending a cycle-5 audit by a fresh-context subagent to strengthen the fixpoint verdict.

## The general mechanism: evaluator and author share context, bias follows

The psychology of self-evaluation gives the same picture from the research side. A peer-reviewed paper on measurement bias in self-assessment (https://pmc.ncbi.nlm.nih.gov/articles/PMC9649615/, jev weight 0.63) discusses how self-rated skills raise the question of whether self-regulation skills can be made visible, comparable, and amenable to deliberate action in the way traditional tests make academic knowledge measurable, the framing being that self-measurement carries a measurement bias that outside measurement does not. A pre-registered study on reducing confirmation bias with the consider-the-opposite strategy (https://www.sciencedirect.com/science/article/abs/pii/S0361476X20300096, jev weight 0.45, weak backing) reports that an effective strategy against confirmation bias is deliberately considering the opposite hypothesis, which is functionally what a fresh-context subagent does for an edit hypothesis: it is a second reasoner with no stake in the first pass. Classic work on confirmation bias (https://journals.sagepub.com/doi/10.1080/17470216008416717, jev weight 0.44, weak backing; the Quarterly Journal of Experimental Psychology paper popularized the term) and a review covering self-related judgment (https://journals.sagepub.com/doi/10.1111/1529-1006.01431, jev weight 0.40, weak backing) round out the same literature; none of these sources speaks about agent skills directly, so the skill's mandate is grounded in the source doc, with the literature cited as the general mechanism.

## doubt-driven-development: supplement, never substitute

The source doc spends more words on this boundary than on any other. The rules:

1. Pass each edit hypothesis through `doubt-driven-development` before editing. It is applied per hypothesis, at step 2, not after the edit.
2. It may run after the subagent cycle to refine the hypothesis.
3. It does NOT substitute for fresh-context isolation. "I ran DDD so I do not need a subagent" is a documented anti-pattern.
4. A cycle 2 or later without a subagent is a violation regardless of DDD use.

The history shows why the boundary needed hardening: cycle 2 of the skill's self-mode run used the phrase "weaker substitute" for DDD, and the re-map flagged a substitution wedge at LxS 12, a loophole inviting exactly the DDD-only misreading. Cycle 3 closed it textually at 5 load points (the Self-mode bullet, the Anti-pattern, a new Red Flag, the Verification checklist, and the changelog), which is why the current wording says supplement, never substitute.

## Verification hooks

The Verification checklist makes the mode rules auditable: self-mode must have used a fresh-context subagent for every cycle, DDD must have been applied as a per-hypothesis supplement and never as a substitute, and improvement mode must have targeted a skill the user actually asked to improve, not an unprompted improvement.

## Summary

Improvement mode runs inline because author and reviewer already differ. Self-mode cannot: every cycle gets a fresh-context subagent, hypotheses additionally pass through `doubt-driven-development`, and no amount of per-hypothesis scrutiny stands in for cycle-level isolation.
