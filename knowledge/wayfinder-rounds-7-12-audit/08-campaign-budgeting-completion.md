# Campaign budgeting and completion

**Scope:** Budgeting improvement campaigns by failing items rather than fixed cycle counts, and handling budget shortfalls with post-round fixups that stay visible instead of being folded into round records.

## The round 12 shortfall

Round 12 ran a fixed budget of 100 cycles against the 112-file skills corpus format sweep and stopped at 96 of 112 files compliant. The remaining 16 files were finished as post-round fixups on the same PR, per the rounds 7 to 12 audit (wayfinder-rounds-7-12-audit-2026-09-18).

The audit draws the structural lesson: budget rounds by failing files, not by a fixed cycle count, when the check is corpus-wide. The reasoning is mechanical. A corpus-wide check defines a finite, countable set of failing items. A cycle budget does not map to that set: if each cycle repairs one file, a 100-cycle budget covers 100 files, and a corpus of 112 needs 12 cycles more. If some cycles repair nothing (a declined rung, a re-check), the gap grows. Budgeting by failing files ties the budget to the actual termination condition: done means 0 failing, whatever the cycle count.

## Keeping fixups visible

The 16 post-round fixups landed on the same PR as the round record. That choice preserved visibility: the shortfall and its completion are both on the record, in one diff a reviewer can read. The alternative, opening a quiet follow-up PR, would have left the round record claiming 96 of 112 with no visible completion.

The discipline here mirrors how burn-down tracking treats scope: a burn-down chart shows remaining work against the plan so shortfalls are visible while there is still time to react, rather than discovered at the deadline (weight 0.93, https://www.atlassian.com/agile/tutorials/burndown-charts). Round 12's post-round fixups are the retrospective equivalent: the gap was recorded in the round record, then closed on the same PR where the record lives.

## The flaky-fixture analogy

The same budgeting problem appears in test-suite maintenance. Guidance on fixing flaky tests treats a flaky suite as a counted backlog: root-cause the failures, fix them in priority order, and measure progress by the count of remaining flaky tests, not by time spent (weight 0.66, weak-to-moderate backing, https://app.thetestingacademy.com/blog/how-to-fix-flaky-tests). The structural point transfers: when the work has a natural countable unit (failing files, flaky tests, non-compliant docs), budget in those units, because time-based budgets terminate on the clock instead of on completion.

## Round 12 hygiene under the same lens

Two round 12 hygiene items connect to budgeting directly:

1. A temp file inside the corpus directory tripped the kebab-case check, costing cycle effort on a non-corpus problem. Scratch hygiene is a budget line: every cycle spent on a self-inflicted failure is a cycle not spent on failing files.
2. The results ledger left the corpus on a skills-only re-sync and crashed a batch. A crashed batch is an uncounted cost in a cycle budget but a visible one in a failing-files budget, because the failing count simply does not move.

## What to keep doing

1. Define done as a count reaching zero (0 failing files, 0 non-compliant docs), and budget in those units (rounds 7 to 12 audit).
2. If a round ends short of done, keep the completion on the same PR as the round record so the shortfall and its closure are visible together.
3. Record the shortfall in the round record itself; do not let post-round fixups silently become part of the round's claimed result.
4. Charge self-inflicted costs (scratch files, crashed batches) against the round explicitly, so hygiene problems show up in the budget instead of hiding inside it.

## Source quality notes

Two results scored at or above 0.5 (the Atlassian burndown tutorial at 0.93 and the flaky-test guide at 0.66); the burndown claim is authoritative backing and the flaky-test claim is labeled as weaker. Twenty-two results scored below 0.5 (aggregator posts on technical-debt prioritization and flaky-test tooling) and were not used to back any claim.
