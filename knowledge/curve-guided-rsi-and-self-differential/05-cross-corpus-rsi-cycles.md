# 05. Cross-corpus RSI cycles on the differential baseline

Scope: what an RSI cycle run on the differential would do, the three prioritization lanes it reads from the differential, and the baseline-preservation rules that keep the comparison honest.

## What the differential baseline enables

Recursive self-improvement (RSI) in this project is a bounded, gap-driven loop: detect gaps, edit the corpus to close one, re-detect, stop at fixpoint. The parent skill (`curve-guided-rsi`) applies this to the yubiOS skill corpus; the offshoot (`curve-guided-rsi-self`) applies it to the self-doc corpus. Both loops are blind to each other's corpora. The differential baseline changes that: it places all 208 items in one plane, so a single RSI cycle can reason about both corpora at once ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

The 2026-08-04 run deliberately did not apply RSI. Stage 4 records the cycle as staged and deferred to user approval, per the project rule that RSI edits produce PRs for review. The run's job was to establish the baseline numbers every later cycle will be measured against: sparse cells 6/77 (parent), 7/131 (offshoot), 0/208 (differential), Jaccard 0.0741, 6 jointly-occupied cells ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

## The three prioritization lanes

A differential RSI cycle reads its work list from the differential's own geometry, in three lanes ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary):

1. Anchor lane: the 6 jointly-occupied cells. Improve the alignment between the yubiOS skill and the self-doc item that share primitive coverage. These are the cheapest moves because both items already sit in the same neighborhood.
2. Self-doc-into-yubiOS lane: the 25 yubiOS-only cells. Extend self-doc coverage by spawning sibling self-doc items that share a skill's (u,v). This closes the case where a skill's coverage pattern has no audit-trail reflection.
3. yubiOS-into-self-doc lane: the 50 self-doc-only cells. Extend yubiOS coverage by spawning sibling skills that share a self-doc item's (u,v). This closes the mirror case where an audit-trail discipline has no skill enforcing it.

Because the differential's sparse-cell count is 0, the lanes come from occupancy asymmetry rather than isolation. A cell jointly occupied is an alignment target; a one-sided cell is an expansion target; the union plane itself is the scorecard.

## Baseline preservation rules

The source doc's anti-pattern list sets two constraints specific to differential RSI ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary):

1. Differential RSI must not modify the per-corpus Stage 1 fits. If applying RSI to the union basis re-fits or perturbs the parent or offshoot curves, the differential drifts and the cross-corpus comparison loses meaning. The three (u,v) planes are separate artifacts; an RSI cycle edits corpora and records new coordinates, it does not rewrite the recorded baselines.
2. Per-corpus sparse-cell detection must still run separately. The union's 0 sparse cells is the baseline, not the gap list. A cycle that only reads the union plane cannot tell which corpus contributes a change.

The general RSI anti-patterns are inherited: no whole-corpus dispatch (defeats prioritization), no RSI without a gap-map first (produces blind edits), no re-fitting the curve mid-run (invalidates the sparse-cell snapshot) ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).

## External grounding for the loop shape

The bounded feedback loop with explicit stop conditions matches the general pattern in Self-Refine, the reference implementation of iterative refinement with self-feedback: generate, self-assess against criteria, edit, repeat until a stop condition, with the key property that each iteration is grounded in a concrete evaluation rather than an open-ended goal [w=0.93, https://arxiv.org/abs/2303.17651]. The Define-Measure-Analyze-Improve-Control cycle formalizes the same shape for process work: baseline first, then measured improvement against that baseline, with a control phase guarding against regression [w=0.69, https://asq.org/quality-resources/dmaic]. The control phase is exactly what the differential baseline provides for cross-corpus edits. Weak backing (glossary-grade, weight 0.38): baseline documentation is described as the fixed reference against which later changes are compared, which is the framing but not a technical source [w=0.38, https://www.docsie.io/blog/glossary/baseline-documentation/, weak].

## What a completed cycle would report

Per the project's closed-loop metric discipline, a differential RSI cycle should report the same deltas the baseline recorded: per-plane sparse-cell counts before and after, jointly-occupied cell count before and after, and Jaccard before and after. The 2026-08-04 baseline already wrote its "no RSI yet" deltas (parent 6 to 6, offshoot 7 to 7, differential 0). The first cycle's value is only legible against those recorded zeros ([source doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/curve-guided-rsi-and-self-differential-2026-08-04.md), primary).
