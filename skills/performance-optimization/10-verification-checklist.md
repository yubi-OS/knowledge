# Verification Checklist and Rationalizations

Scope: Internal-record subtopic: the source skill's verification checklist, common rationalizations table, and red flags, grounded only in the source SKILL.md.

Internal-record subtopic, no dig. Every claim below is grounded in `yubi-OS/yubiOS skills/performance-optimization/SKILL.md` (the source doc).

## The verification checklist

The source doc ends with a 13-item checklist to run after any performance-related change:

- Before and after measurements exist (specific numbers).
- The result was re-measured the same way as the baseline (same command, same conditions).
- The improvement exceeds run-to-run variance, not just the mean.
- Changes that did not beat the baseline were reverted, not kept as neutral.
- Attempts are logged, kept and reverted alike, so a dead idea is not re-run.
- The specific bottleneck is identified and addressed.
- Core Web Vitals are within "Good" thresholds.
- Bundle size has not increased significantly.
- No N+1 queries in new data fetching code.
- Any new index is justified by a query plan before and after, and its write cost was considered.
- Any new cache states what it keys on and how it goes stale.
- The measured user-facing metric has a synthetic budget or field monitor that can detect regression.
- Existing tests still pass (optimization did not break behavior).

Each item maps to a corpus doc: measurement discipline (doc 01), thresholds (doc 02), variance and the ledger (doc 08), anti-patterns (docs 05, 06, 07), and guards (doc 09).

## Common rationalizations

The source doc's rationalizations table pairs each excuse with its reality:

| Rationalization | Reality |
|---|---|
| "We'll optimize later" | Performance debt compounds. Fix obvious anti-patterns now, defer micro-optimizations. |
| "It's fast on my machine" | Your machine is not the user's. Profile on representative hardware and networks. |
| "This optimization is obvious" | If you did not measure, you do not know. Profile first. |
| "Users won't notice 100ms" | Research shows 100ms delays impact conversion rates. Users notice more than you think. |
| "The framework handles performance" | Frameworks prevent some issues but cannot fix N+1 queries or oversized bundles. |
| "The query is slow, add an index" | Read the plan first. The index may already exist and be unusable, and every index taxes writes forever. |
| "Just cache it" | Caching an already-cheap call buys nothing and adds a staleness bug. Cache what is expensive AND re-read far more than written. |
| "Raise the pool size, we're running out of connections" | A pool bigger than the database can serve moves the queue somewhere less visible. Find what holds connections. |
| "It didn't help much, but it doesn't hurt" | Neutral changes are a revert. You pay maintenance on them forever and got nothing back. |
| "We already wrote it, may as well keep it" | Sunk cost. The measurement does not care how long the change took to write. |
| "The improvement is obvious, no need to re-measure" | Then re-measuring is cheap and proves it. Unmeasured wins are how neutral complexity lands. |

## Red flags

The source doc lists 15 review-time red flags:

- Optimization without profiling data to justify it.
- N+1 query patterns in data fetching.
- An index added without a query plan before and after to justify it.
- A cache key that omits an input the response depends on (tenant, locale, viewer).
- A cache with no stated staleness window and no invalidation strategy.
- Connection pool size raised in response to exhaustion, without finding what holds connections.
- List endpoints without pagination.
- Images without dimensions, lazy loading, or responsive sizes.
- Bundle size growing without review.
- No performance monitoring in production.
- React.memo and useMemo everywhere (overusing is as bad as underusing).
- Optimizations kept without a re-measurement that justifies them.
- Several optimizations bundled into one measurement, so no single change can be attributed.
- A "win" that required a test to be changed, skipped, or deleted.
- The same failed optimization attempted more than once because nobody recorded the first attempt.

## In-repo touchpoints

The source doc names its own structure: Overview, When to Use, Core Web Vitals Targets, and The Optimization Workflow are the sections it owns, and it points at `references/performance-checklist.md` in the same skill for detailed checklists, optimization commands, and anti-pattern reference. The corpus expands that reference layer; this doc is the index back into it.

## What to remember

1. The 13-item checklist is the post-change gate for any performance work (source doc).
2. Rationalizations are pre-committed failure modes: each has a mechanical counter in the workflow (source doc).
3. The 15 red flags are review-time detectors, usable in PR review without any tooling (source doc).
4. When in doubt, the source doc's own checklist and this corpus's per-topic docs cover the same ground in the same order (source doc).
