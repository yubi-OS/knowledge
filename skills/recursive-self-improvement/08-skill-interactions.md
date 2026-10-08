# 08 - Interaction With Other Skills and the Composition Rule

Scope: the skill's declared position in the yubiOS skill graph: 1 upstream pair, 4 orthogonal collaborators, 2 downstream polish stages, 2 downstream curve consumers, and the Composition Rule that stacks atomic actions into corpus-wide monotone improvement.

Ground spine: `yubi-OS/yubiOS skills/recursive-self-improvement/SKILL.md` (source doc). This is an internal-record subtopic: the edges are declared in the source doc itself, so no searXNG dig was run and all weights here are the source doc's own authority.

## Upstream

- **`negative-skill-space`** supplies the gap map, the loop's primary input. The source doc calls the 2 skills a pair: NSS finds the gaps, this skill closes them.

## Orthogonal

- **`doubt-driven-development`**: applied to each edit hypothesis before the edit, at step 2. A hypothesis that survives DDD is much more likely to be the right edit. Status nuance from the Modes section: DDD is a per-hypothesis supplement and never a substitute for the fresh-context subagent (see 03-modes-self-bias).
- **`human-for-feasibility`**: if the loop produces hypotheses the user has not approved, run it first. Don't loop on hypotheses the user would reject. This is the guideline the source doc states first.
- **`context-isolation`**: supplies the fresh-context subagent for the self-mode gap-map step and, after the cycle-2 wedge closure, for every self-mode cycle.
- **`using-agent-skills`**: receives reposition referrals. When the gap map says the skill's place in the workflow is wrong, the loop marks it for review here and stops editing the body.
- **`token-efficiency`**: always-on. The loop is slow; don't re-read SKILL.md end-to-end after every edit when a targeted hashline-anchored edit suffices.

## Downstream (polish)

- **`code-review-and-quality`**: after the fixpoint, run a normal review on the final SKILL.md for style, clarity, and anti-patterns. The recursive loop's job is gap closure, not style.
- **`code-simplification`**: the downstream alternative when the fixpoint produces prose bloat. The polish cycle is separate from the correctness cycle, and the skill's own anti-pattern list bans doing polish inside an RSI cycle.

## Downstream (curve consumers)

- **`curve-guided-rsi`**: the corpus that curve-guided-rsi audits is closed under this skill's edit protocol. The stochastic extensions (co-travel clustering, retro-preferential trajectory) are the stochastic substitutes for the parent's deterministic sparse-cell detector and traversal order.
- **`single-action-curve-rsi`**: the atomic edit per cycle is one single-action-curve-rsi action per corpus item. Its Composition Rule (Lemma 1 plus Theorem 1) guarantees non-negative delta per atomic action, so cumulative corpus delta is monotone non-decreasing (Corollary 1).

## The Composition Rule reference

The source doc devotes a section to how the bounded loop behaves under composition:

1. The bounded RSI loop is the per-cycle mechanism driving both curve-guided-rsi's Stage 4 and single-action-curve-rsi's single-action cycle.
2. Under the Composition Rule, every cycle's edit is 1 atomic action; the only-positive-delta invariant propagates linearly across the corpus.
3. The fixpoint rule (3 cycles, no-new-substantive-gaps, no-new-anti-patterns) applies per atomic action; multi-file composition stacks the fixpoint checks, but each check is on a single file.
4. The stochastic extensions compose by randomizing only the prioritization signal and the traversal order. The atomic action itself stays deterministic (curve-fit, primitive-flip, argmin delta, verify-delta-at-least-0), and the per-action delta of at least 0 invariant is preserved because the constraint set remains a subset of all missing primitives.

## Boundary skills (what this skill is NOT)

The description frontmatter and the anti-pattern list agree on the boundaries:

- **Skill addition** is a different workflow: start with `idea-refine`, then `spec-driven-development`. Recursive self-improvement edits an existing skill.
- **Prose polish** belongs to `code-simplification`, never to an RSI cycle.
- **Style review** belongs to `code-review-and-quality`, after the fixpoint.

## Summary

One upstream (NSS), 5 orthogonal collaborators with precisely bounded roles, 2 downstream polish stages, 2 downstream curve consumers, and a Composition Rule that keeps per-action guarantees monotone under corpus-scale stacking. Every edge either feeds the loop, polishes its output, or consumes its closed corpus.
