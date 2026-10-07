# 01: RSI discipline and the fixpoint rule

Scope: the learned-latent curve variant runs the same bounded recursive-self-improvement loop as curve-guided-rsi (gap map, hypothesis, edit, re-map, fixpoint), with a soft 3-cycle cap, a user-override protocol, and the Changelog section as the per-cycle audit trail.

## The loop the skill inherits

The source doc (yubi-OS/yubiOS skills/learned-latent-curve/SKILL.md) states the discipline directly: the variant shares the curve-guided-rsi loop of gap-map, then hypothesis, then edit, then re-map, then fixpoint. The difference is the fit underneath the gap map. Where curve-guided-rsi scores corpora against hand-engineered primitive vectors, this variant lets the basis itself be learned from the corpus. The loop discipline is unchanged; only the measurement instrument changes.

The loop is bounded, and the bound is explicit in the source doc: "Cap at 3 cycles by default; user-override protocol raises the cap." A cycle that reaches the fixpoint rule stops the loop. A user directive can raise the cap, and when it does the override is recorded in the Changelog itself (the source doc records a cap override from 3 to 10 cycles in its cycle-1 entry, citing RSI step-7 protocol).

## The fixpoint rule

The fixpoint rule in the source doc has three conjuncts: no new substantive gaps, old gaps closed, and no new anti-patterns. All three must hold for the loop to stop. This is deliberately strict: a cycle that closes one gap while opening two others fails the rule even if the headline gap is gone.

The source doc's own cycle log shows why the third conjunct matters. Cycle 3 closed the Lifecycle gap but surfaced 4 edit-induced gaps (F, G, H, I) for a net L times S delta of +30, the worst cycle in the log. Cycle 4, by contrast, closed 6 of 8 failure-mode sub-gaps for a net delta of -76. Neither outcome would have been visible without the re-map step, which is why the re-map is a separate fresh-context pass rather than self-assessment by the editing agent.

## How the loop handles edit-induced gaps

Every edit is required to argue that it introduces no new gaps. The source doc's cycle entries carry that argument explicitly ("the change does not introduce new gaps because..."). The re-map then tests the argument. Two failure patterns recur in the source doc's own history:

1. The placeholder pattern. Cycle 1 and cycle 2 each wrote a Changelog entry whose Result field said "re-map pending" and left it unfilled, which the re-map flagged as edit-induced gaps A and D. The cycle-2 entry names the pattern itself as a recurring meta-gap and proposes either backfill-on-dispatch or an amendment to RSI step 8 mandating backfill.
2. The overpromise pattern. Cycle 7 promised 4 edits and delivered 3; the re-map flagged the internally inconsistent changelog entry as gap T, and cycle 8 completed the missing edit while documenting the deviation.

## External framing: bounded self-refinement vs open-ended RSI

A 2026 arXiv survey (https://arxiv.org/html/2607.07663, weak backing, jev weight 0.18) draws a taxonomy that separates bounded self-refinement, described as convergent, evaluable, and already industrial practice, from open-ended recursive self-improvement, which remains bounded by grounding requirements, collapse dynamics, and compute constraints. The learned-latent curve variant sits squarely in the bounded half: its improvement target is a documentation corpus with a measured curve fit, its evaluation is a fresh-context re-map, and its stopping condition is the 3-conjunct fixpoint rule rather than an open-ended ambition to self-modify.

A self-improving coding agent paper (https://arxiv.org/html/2504.15228v2, weak backing, jev weight 0.18) makes the adjacent observation that when an agent's own code is the object of optimization, each accepted rewrite becomes the agent that the next round edits. The source doc operationalizes the same feedback structure at documentation scale: the Changelog section the loop writes is the input the next cycle reads.

## Why the audit trail came first

The source doc records that the very first RSI cycle on this skill was spent adding the Changelog section itself, closing the axis-12 (Recursion) gap: without a per-cycle audit trail the recursive-self-improvement loop has nothing to read on the next cycle. The gap map written to produce cycle-1's edit is the cycle-2 gap-map input, which is the recursion the skill depends on.
