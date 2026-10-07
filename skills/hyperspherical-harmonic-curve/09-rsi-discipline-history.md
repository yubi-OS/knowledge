# 09 RSI discipline and cycle history

Scope: the bounded recursive-self-improvement discipline the skill's changelog encodes: one hypothesis per cycle, single intent, the fixpoint rule, the 3-cycle cap and its user override, backfilled results, process deviations, and the cycles 1 to 5 plus 8 and 9 history as the worked example.

Internal-record subtopic, no dig. This doc is grounded in the source doc only (yubi-OS/yubiOS skills/hyperspherical-harmonic-curve/SKILL.md); the changelog and lifecycle text are the source of record and no external search applies to them.

## The loop shape

Every cycle in the changelog carries the same anatomy: a hypothesis stating one intended change, a single intent naming the one thing the cycle must accomplish, an edit field describing what actually changed, and a result field recording what was measured. Cycle 1's hypothesis names the full v1 design and its 10 advisor-mandated revisions; cycle 2's hypothesis is a single section replacement gated on the ablation passing; cycle 3's is closing exactly three open issues (source doc, changelog). The discipline is that intent width is bounded: a cycle that tries to do everything cannot report a crisp result.

## The fixpoint rule

Cycle 2 and cycle 3 both evaluate three conditions before declaring a verdict: (1) no new substantive gaps opened, (2) old gaps closed, (3) no new anti-patterns introduced by the edit itself (source doc, cycle 2 and cycle 3). A cycle can fail one condition and still continue: cycle 2's condition (1) FAILED because the ablation surfaced three new open issues, so the verdict was continue. Cycle 3 passed all three and declared FIXPOINT REACHED.

## The cap and the override

The default cap is 3 cycles. Cycle 3 declared itself the final allowed cycle under the cap, with an explicit override hook: the user may approve further iterations (source doc, cycle 3). Cycle 4 exercised that override to close the 5 carryover gaps from cycle 3, and cycle 5 closed the last carryover, so the loop terminated at v5 with all carryover gaps fully closed (source doc, cycles 4 and 5). The override is scoped, not open-ended: each override cycle still carries one hypothesis and one intent.

## Backfilling and honest accounting

Cycle 1's result field was backfilled during cycle 2 per RSI Step-8 audit-trail discipline (source doc, cycle 1), rather than silently rewritten. The changelog also records process deviations instead of hiding them: cycle 2 skipped the standard negative-skill-space re-map in favor of direct measurement, and the entry argues why, that the NSS sweep had already run before cycle 1 and the ablation was its empirical counterpart (source doc, cycle 2, PROCESS DEVIATION paragraph). Cycle 3 found that a suspected model bug was actually a test bug, the epsilon_basis test comparing the wrong matrices, and recorded the correction with the measured before and after numbers, 0.92 down to 0.0163 (source doc, cycle 3).

## Carryover gaps, not silent drops

Cycle 3 listed 5 carryover gaps from the cycle-1 NSS sweep as Noted but deferred, explicitly outside that cycle's single intent (source doc, cycle 3). Cycle 4 closed 4 of the 5 and partially closed the fifth (prior-art depth-fetch: 1 of 2 hits verified, the OpenReview API blocked at 403). Cycle 5 closed the remainder via the user-pasted PDF. Nothing was marked closed without evidence, and the one blocked verification was recorded as blocked, not assumed fine.

## The audit-only tail and the re-fit triggers

After the loop terminated, cycles 8 and 9 ran as audit-only entries: cycle 8 added the continuous/adaptive primitive keywords as the top-priority MOVABLE missing item, and cycle 9 recorded the corpus enrichment 70 to 73 skills via PR #179 closing 17 residual cells, with the Phase H multi-seed fit holding K_kept = 2, below the 25 percent re-fit trigger (source doc, cycles 8 and 9). The changelog also fixes the standing re-open conditions for the whole skill: user-approved further iterations, corpus growth of at least 25 percent triggering a re-fit, or a prior-art hit covering the variant's composition (source doc, cycle 5). Between those conditions, the fixpoint stands and no cycle runs.

## Coverage-section hygiene

The coverage sections carry their own maintenance record: on 2026-09-17 the trust chain, least-privilege, and declarative-policy template paragraphs were removed as unsupported for this skill, while the audit/evidence rollup contribution was kept (source doc, coverage sections). The changelog's cycle 8 entry shows the same hygiene in the other direction: a missing primitive keyword is added only when it is genuinely part of the skill's target list, here continuous, adaptive, ongoing, dynamic, real-time, monitoring, feedback (source doc, cycle 8).
