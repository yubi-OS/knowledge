# 05 - Single-Action Selection: Argmin Over Simulated Flips

Scope: how the atom picks the one primitive to flip: simulate every missing primitive, recompute the S2 point with the same Mobius map, take the argmin of d_post, and handle the negative-delta and local-minimum cases honestly.

This corpus explicates the skill documented at yubi-OS/yubiOS skills/single-action-curve-rsi/SKILL.md (source doc). Selection is the core of the atom: it converts a coverage vector with missing primitives into exactly one concrete edit.

## The selection procedure

For each missing primitive i, every j where c_j = 0, the source doc specifies 5 steps (source doc):

1. Force primitive i to 1 in every section of the file.
2. Recompute the per-section matrix M' and re-derive the PCA basis W2'.
3. Recompute the file's S2 point p' using the same Mobius reparameterization phi_theta.
4. Recompute the ideal pole p'*, lifted the same way.
5. Compute d_post = chordal(p', p'*).

The single action is argmin over candidates of d_post, equivalently argmax of delta = d_pre - d_post. This is a greedy selection: evaluate each candidate's immediate payoff and take the best one, without lookahead (Greedy algorithm, weight 0.54, https://en.wikipedia.org/wiki/Greedy_algorithm). Greedy choice proofs in algorithm courses proceed exactly this way: fix the locally best move, then prove the remainder is unchanged (Stanford CS161 lecture notes on greedy algorithms, weight 0.84, https://stanford-cs161.github.io/winter2021/assets/files/lecture14-notes.pdf; UMD CMSC 451 lecture on greedy scheduling, weight 0.79, https://www.cs.umd.edu/class/spring2025/cmsc451-0101/Lects/lect05-greedy-sched.pdf). The atom's Lemma 1 is the same shape: the argmin over a candidate set where every candidate applies one flip is provably non-regressing (doc 06).

## Cost is orthogonal

The source doc's central design decision is the geodesic-only criterion: the atom picks the largest delta, not the smallest edit cost. The 9th of its architectural choices states this explicitly, and the first experiment demonstrated the divergence: the geodesic winner (has_test, delta +0.086242, cost medium at roughly 20 lines) and the cheapest edit (has_purpose, 5 lines, delta -0.065767) were different primitives, and the atom rejected the cheap one because flipping it moved the file's S2 point away from the ideal pole (source doc).

The experiment validated that the skill exists to surface this divergence honestly: cost and impact are different axes, and an atom that picked by cost would silently regress (source doc). When the geodesic winner is expensive, the red-flag protocol says to surface the trade-off rather than auto-apply (source doc).

## Negative delta and local minima

The source doc is explicit that the geodesic-only criterion can pick a primitive whose flip increases d_post, giving delta below 0. This happens when flipping a low-cost primitive shifts the PCA basis enough to displace the file's point further from the pole (source doc). The principled response: if delta is below 0 for all candidates, the file is at a local geodesic minimum; defer to Stage 3 of the parent (full corpus sweep) or accept the gap, and the cycle is recorded as failed (source doc).

Hill climbing, the classic local-search analogue, has the same failure shape: a greedy stepwise optimizer gets trapped at a local optimum where no single move improves the objective (weak backing: Knowledge Gate on hill climbing and traps, weight 0.18, https://www.knowledgegate.ai/blog/local-search-fundamentals-explained; weak backing: Emergent Mind on the hill-climbing method, weight 0.14, https://www.emergentmind.com/topics/hill-climbing-method). The atom's response is structurally different from simulated annealing or restarts: it escalates scope, from the single-file atom to the parent's multi-file Stage 3, rather than randomizing within the same scope.

Empirically the local-minimum case is real but rare in the recorded runs: 2 of 12 files in the first sweep returned delta exactly 0 (C7 and C12 in the experiment log), and the count rose to 4 of 20 files (50%) at fixpoint (source doc). A delta of exactly 0 means no candidate flip changes the geodesic distance; the atom correctly returns 0 rather than a negative value (source doc).

## Why the same Mobius map matters

Step 3's requirement to reuse phi_theta is not incidental. The Mobius reparameterization defines the coordinate system on the sphere; recomputing the pole or the candidate points under a freshly re-fit Mobius would compare distances measured in different coordinate systems. Identity-init Mobius is fine for the first cycle, but running more than 1 cycle on identity without refinement accumulates drift (source doc), which is why the lifecycle gates refinement on corpus size at least 30 and at least 2 prior cycles on the file (doc 08).

## What the selection outputs

Per the source doc's verification checklist, a completed selection run must produce: the enumerated set of missing primitives, the single-action target as argmin d_post over candidates, the signed delta, the proposed concrete edit for the target primitive, and a cost ranking (low / medium / high with approximate line counts) logged alongside (source doc). The cost ranking is retained even though the criterion ignores it, precisely so the divergence between cost and impact stays visible in the record.
