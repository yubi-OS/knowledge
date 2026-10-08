# 01 - The Atom Pipeline: One Item, One Point, One Flip, One Delta

Scope: the atom model of single-action curve RSI: one corpus item becomes one point on S2, one missing primitive is one geodesic step, one flip is one cycle, plus the three defining properties and the use/avoid boundaries.

This corpus explicates the skill documented at yubi-OS/yubiOS skills/single-action-curve-rsi/SKILL.md (source doc). The source doc positions the skill as the atom of the RSI family: where curve-guided-rsi fits a curve across many corpus items and hyperspherical-harmonic-curve is the Stage-1 swap with the N-Riemann sphere basis, this skill is the minimum viable RSI cycle on a single corpus item. The compressed slogan is: one corpus item is one point on S2. One missing primitive is one geodesic step. One flip is one RSI cycle (source doc).

## The three properties

The source doc requires any atom run to satisfy 3 properties. First, single-action discipline: only one primitive flips per cycle; multi-flip belongs to the parent's Stage 3, not this skill. Second, measurable geodesic delta: every cycle produces the triple (d_pre, d_post, delta) on S2, where a chordal proxy is acceptable and great-circle distance is the principled default when the corpus is large enough. Third, honest cost ranking: the geodesic-only criterion picks the missing primitive that moves the S2 point closest to the ideal pole, and the skill reports both the geodesic winner and the cheapest edit because the cheapest edit is not always the geodesic winner (source doc).

The single-action discipline mirrors the atomic-commit discipline in software engineering: one logical change per commit keeps cause and effect readable (weak backing: HackerNoon on atomic commits, weight 0.19, https://hackernoon.com/a-deep-dive-into-atomic-commits-the-discipline-that-makes-codebases-trustworthy). The measurable delta requirement is what separates the atom from an unmeasured to-do list; the wider recursive self-improvement literature stresses that bounded, verifiable refinement loops are the tractable form of the problem (weak backing: arXiv survey on recursive self-improvement in AI, weight 0.33, https://arxiv.org/abs/2607.07663). At its mathematical core the atom is ordinary recursion: a function defined in terms of a smaller version of the same problem, with the cycle as one step and the remaining gap as the smaller instance (Recursion, weight 0.66, https://en.wikipedia.org/wiki/Recursion).

## The 5-stage pipeline compressed to one stage

The parent skill's 5-stage pipeline reduces to a single stage for one file (source doc):

1. Stage 1 compressed: derive the 9-D binary primitive coverage vector c in {0,1}^9 for the file, split into sections, run PCA top-2 on the section coverage matrix (2 or more sections required), lift through stereographic projection from the south pole, apply the Mobius reparameterization phi_theta with identity init, and land on one point p on S2.
2. Stage 3 compressed: for each missing primitive i (every j where c_j = 0), simulate the flip c_i from 0 to 1, recompute the point p and the distance d, and pick i* = argmin d over candidates. The single action is primitive i*.
3. Stage 4 (single action): apply exactly one concrete edit corresponding to i*, for example adding a Verification plan section to cover has_test.
4. Stage 5 (single delta): measure (d_pre, d_post, delta) for the cycle. delta greater than 0 means the cycle succeeded and the point moved toward the pole. delta at most 0 means the cycle failed and the case defers to Stage 3 of the parent.

The atom preserves the parent's invariant, sparse cells become missing primitives as the prioritization signal, and discards the multi-file scaffolding of Stages 2 and 3 (source doc).

## When to use

Per the source doc, apply the atom when a single deep-research output file (or any single corpus item) has a measurable structural gap the next edit should target; when the user wants the one thing to fix in a single file rather than the whole gap list; when multi-file corpus fits such as curve-guided-rsi-self or hyperspherical-harmonic-curve would be overkill for a single item; and when the geodesic delta on a single file is the verification metric instead of sparse-cell count on a corpus.

## When not to use

The source doc lists 3 exclusions. If the corpus has 20 or more items at canonical granularity and sparse-cell detection is needed, use curve-guided-rsi-self or curve-guided-rsi instead. If the user wants a multi-action plan across a file, use the parent's Stage 3 sparse-cell dispatch. If the corpus item is too small to derive a 9-D basis, for example a single short Slack message, use the negative-skill-space 12-axis sweep instead. The 20-item threshold matches the boundary the parent skills encode in their decomposition rules (source doc).

The atom-only mode is the fallback when NSS is not run upstream; with NSS upstream, the atom becomes the disposal stage of a two-stage filter, covered in doc 07 of this corpus. The interaction map with the other 6 skills in the family (curve-guided-rsi, hyperspherical-harmonic-curve, curve-guided-rsi-self, negative-skill-space, parallel-deep-research, recursive-self-improvement, context-isolation) is covered in doc 08.
