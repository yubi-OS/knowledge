# 04 Two-Stage Dispatch

Scope: Stage 3 of the pipeline, the two-stage dispatch in which an upstream gap-proposer (negative-skill-space or self-archaeology) proposes, the single-action atom disposes, and the only-positive-delta invariant is preserved end to end.

## The two stages

Stage 3 runs once per gap candidate, of which the top 10 per corpus per run survive Stage 2 (source doc: yubi-OS/yubiOS skills/curve-guided-rsi-self/SKILL.md). It splits into two stages with a strict division of labor (source doc):

1. Stage 3a, upstream gap-proposer. The candidate is mapped through either the negative-skill-space 12-axis sweep or the self-archaeology 12-axis sweep. Both extend rather than close gaps; their qualitative Extend-verdict gap list becomes the constraint set.
2. Stage 3b, atom disposes. The atom from the single-action-curve-rsi skill takes the target file and the gap candidates and selects one atomic action, then verifies the per-file delta d_i is at least 0, which always passes by Lemma 1.

The atom is the only executor in this dispatch chain. Its geodesic-only selection criterion, argmin of d_post over the gap-constrained candidate set, preserves the only-positive-delta invariant per Lemma 1 and Theorem 1 of the Composition Rule. If neither NSS nor self-archaeology is run, the atom falls back to its full candidate set of all missing primitives (source doc).

The geodesic criterion borrows from the geometric sense of a geodesic: the locally length-minimizing route between two points on a curved surface (weak backing, jev weight 0.09: https://mathworld.wolfram.com/Geodesic.html; weak backing, jev weight 0.07: https://en.wikipedia.org/wiki/Geodesic). On the S2 manifold of the single-action family, choosing the move that lands nearest the ideal pole is the analog of picking the shortest path.

## Which upstream proposer to use

Two options exist, and the source doc is explicit about the choice (source doc):

- negative-skill-space, the parent's default. It performs a generic 12-axis sweep; the constraint set is qualitative gaps with an Extend verdict. It suits generic gap-mapping.
- self-archaeology, this offshoot's preferred upstream for memory-file and agent-being corpora. It is the same 12-axis sweep retargeted at SELF.md, SELF-CHANGELOG.md, and memory-file content. Its advantage is structural: its Extend-verdict gap can be mapped to a has_X primitive, meaning the gap is closeable by a single primitive-flip, exactly the action vocabulary the atom executes.

Either way, the Extend verdict from the upstream is the constraint set the atom selects from; the proposer proposes, the atom disposes (source doc).

## Focused dispatch

Dispatch is focused, not whole-corpus. The upstream subagent receives only the gap candidate's content: its row or entry text, its primitive coverage vector, its t coordinate, and its breadth. It does not receive the full self-doc corpus (source doc). This is what makes the curve the prioritization lens, and the atom then executes the chosen gap with a measurable delta. The focused-reads discipline is an application of the token-efficiency skill (read only what the decision needs) combined with the context-isolation skill (fresh-context subagents per row or entry, so no context pollution crosses gaps) (source doc).

## The invariant and the Stage 5 metric

The invariant preserved is that every Stage 3 dispatch produces a per-file delta of at least 0 by Lemma 1, because the constraint set is a subset of all missing primitives. Cumulative corpus delta is monotone non-decreasing by Corollary 1 (source doc). The atom-bound design also changes what Stage 5 measures: the closed-loop metric (sparse_cell_count_post below sparse_cell_count_pre) is derived from the sum of per-file atom deltas, not from sparse-cell counts recorded before and after the self-archaeology dispatch alone (source doc).

Two consequences follow (source doc). First, RSI edits that bypass the atom lose the only-positive-delta guarantee, so bypassing the atom is a real correctness hazard, not a style preference. Second, the whole-self output requirement of SELF.md Bias #11 is preserved as a structural corrective for same-cadence drift: the atom sits before the whole-self output is required, so executing an atomic edit never substitutes for the register-shift reflection the cycle must also produce.
