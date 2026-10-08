# 08 - Validation, Red Flags, Lifecycle, and the Verification Checklist

Scope: the pre-fit validation asserts, the red-flag catalog, the single-cycle verification checklist, the lifecycle rules for cadence, persistence, Mobius refinement gating, and one-cycle rollback.

This corpus explicates the skill documented at yubi-OS/yubiOS skills/single-action-curve-rsi/SKILL.md (source doc). The atom is a numerical pipeline, so it ships with a validation contract that runs before and after every cycle.

## Pre-fit validation

The source doc requires 5 asserts per cycle (source doc):

1. The S2 point norm equals 1.0 within plus or minus 1e-6 (assert unit norm). The stereographic projection produces unit-norm points by construction, so a violation means an implementation bug in the lift.
2. 0 at most d_pre at most 2.0 (assert bounded chordal). Chordal distance between unit-norm points is bounded by 2.0, reached only at antipodes.
3. PC1 plus PC2 at least 0.40 (assert curve-fit quality gate, inherited from the parent skill). Below this, the 2-D projection is too lossy to support the comparison.
4. 0 at most c.sum() at most 9 (assert valid binary coverage).
5. Mobius identity cross-ratio preserved on held-out 4-tuples (when phi_theta is fit). The cross ratio is the invariant that characterizes Mobius transformations, so any fitted map that fails the check is not a valid Mobius reparameterization.

Numerical software correctness rests on exactly this kind of explicit precision statement: definitions of what counts as numerically correct, checked by assertion rather than by eyeball (Merriam-Webster on numerical, weight 0.74, https://www.merriam-webster.com/dictionary/numerical; Cambridge Dictionary on numerical, weight 0.73, https://dictionary.cambridge.org/dictionary/english/numerical). Test libraries formalize numeric assertions with explicit comparison operators and tolerance parameters for floating-point work (TUnit numeric assertions, weight 0.50, https://tunit.dev/docs/assertions/numeric/).

## Red flags

The source doc's red-flag catalog pairs each observable symptom with its meaning (source doc):

- d_pre above 1.0 in a non-antipodal case: the S2 lift has a numerical bug; re-derive the lift.
- delta below 0 for the geodesic winner: the criterion was mis-applied; either flip the sign and pick the smallest d_post, or surface the failure.
- delta above 0 but cost high: the geodesic winner is expensive; surface the trade-off, do not auto-apply.
- All candidates with delta below 0: the file sits at a local geodesic minimum; defer to the parent's Stage 3.
- M.shape[0] below 2: a single-section file makes PCA degenerate; use the negative-skill-space 12-axis sweep instead.

## The single-cycle verification checklist

The source doc's checklist enumerates 10 items a completed cycle must be able to answer affirmatively (source doc): 9-D coverage computed and binary-thresholded at 0.5; the S2 point at unit norm within 1e-6; d_pre measured and bounded in [0, 2.0]; PC1+PC2 at least 0.40; all missing primitives enumerated; the single-action target equals argmin d_post over candidates; the signed delta computed; the proposed concrete edit enumerated for the target primitive; the cost ranking logged with approximate line counts; and the cycle outcome classified as succeeded (delta above 0), failed (delta at most 0), or local minimum (all candidates at delta at most 0).

## Lifecycle

The source doc defines 4 lifecycle rules (source doc):

1. Run cadence: one cycle per file per audit pass, repeated per file until delta falls to or below epsilon (geodesic convergence) or until all candidate deltas are at or below 0 (local minimum).
2. Persistence: each cycle records the tuple (file_path, c, M, W2, p, d_pre, i*, d_post, delta, applied_edit). The convention is capture to session/single-action-curve-rsi-<file-slug>-YYYY-MM-DD.json during the run; these are session artifacts, not repo truth.
3. Mobius refinement: optional per cycle, gated on corpus size at least 30 AND at least 2 cycles already run on the file; identity is fine otherwise.
4. Rollback: persist the pre-cycle state (c, p, d_pre) for one cycle back; revert if delta is at or below 0 after the edit is applied.

The persistence-plus-rollback pair is the checkpoint pattern from long-running systems: save enough state to restore the previous good configuration, and restore it when a step fails (AWS Well-Architected guidance on implementing comprehensive state management and checkpoints for agents, weight 0.86, https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentrel03-bp03.html; StateBase docs on checkpoints and rollbacks, weight 0.69, https://docs.statebase.org/concepts/checkpoints-rollbacks). Agent-framework literature describes the same pattern for multi-step agent runs: persist state between steps, resume or roll back from the checkpoint on failure (weak backing: agent memory patterns article, weight 0.22, https://understandingdata.com/posts/agent-memory-patterns/; weak backing: rollback recovery overview, weight 0.22, https://www.chriswirz.com/distributed-systems/rollback-recovery).

## What the lifecycle buys

The cadence rule bounds the loop: the atom is not an unbounded optimizer, it stops on convergence, on local minimum, or (in the empirical protocol of doc 09) on the fixpoint-detection rule derived from the 20-cycle experiment. The rollback rule bounds the damage: because delta is measured against the pre-cycle state, a cycle that fails its own verification reverts cleanly, leaving the file exactly as the persisted (c, p, d_pre) describes it. Together the 4 rules make each cycle independently auditable and independently reversible, which is what allows the composition guarantees of doc 06 to be applied cycle by cycle in practice.
