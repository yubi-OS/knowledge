# Verify or Revert

Scope: Step 4 verification discipline: re-measuring under baseline conditions, beating run-to-run variance, neutral-is-a-revert, correctness gates, and the performance ledger for reverted attempts.

## Re-measure the way you measured the baseline

The source doc's rule: same command, same conditions, same fixed budget (wall-clock, sample count, or request count). A baseline taken on a cold cache against a result taken on a warm one measures the cache, not your change. This is the mechanical half of Step 4 (VERIFY): a fix is a hypothesis until you re-measure.

## Change one thing at a time

3 optimizations landed together produce 1 number, and you cannot attribute it. If they must ship together, measure each in isolation first (source doc). The red flags list encodes the failure: "several optimizations bundled into one measurement, so no single change can be attributed".

## Beat the noise, not just the mean

Repeat the measurement and compare the delta against run-to-run variance. The source doc's example: a 3% gain inside plus-or-minus 5% variance is not a gain; it is a different sample. The dig record for this subtopic is weak across the board (benchmark-variance explainers at 0.09 to 0.17), so the variance discipline rests on the source doc. The one strong dig here is an AMD ROCm profiling guide that documents the same loop industrialized: every optimization iteration must yield better wall time relative to the last kept configuration or the experiment is reverted, with correctness checked against a reference diff each time (w 0.82, [rocm.blogs.amd.com](https://rocm.blogs.amd.com/software-tools-optimization/profiling-guide/ai-assist-optimization/README.html)). That is the keep-or-revert decision made binary.

## The decision table

| Result vs. baseline | Action |
|---|---|
| Past the threshold, tests green | Keep. Commit with the before/after numbers in the message. |
| Within noise (no measurable change) | Revert. |
| Worse | Revert. |
| Improved, but a test went red | Revert. A regression wearing a win's clothing. |

The source doc is explicit that "neutral" is a revert, not a keep, and explains why teams skip this: the change is already written, throwing it away feels wasteful, so it lands unmeasured, and the codebase accretes complexity that never bought anything. Code you keep, you maintain forever. Make it pay for itself.

## Correctness gates the metric

The suite stays green AND the number moves. An "optimization" that wins by dropping work the product needed (skipping a validation, caching something that must be fresh, removing an await that was load-bearing) is a regression, not a win (source doc). The red flag "a win that required a test to be changed, skipped, or deleted" is the review-time detector for this.

## Log every attempt, including the reverted ones

Reverted work leaves no trace in git history, which is exactly why the same dead idea gets tried again next quarter. The source doc prescribes a short ledger with 4 columns: idea, baseline-to-result numbers, verdict (kept or reverted), and why. Its examples:

| Idea | Baseline -> Result | Verdict | Why |
|---|---|---|---|
| Memoize the row component | INP 240ms -> 235ms | reverted | Inside noise (plus-or-minus 15ms). Rows weren't the bottleneck. |
| Virtualize the list | INP 240ms -> 90ms | kept | Long tasks gone from the trace. |
| Preconnect to the API origin | LCP 2.8s -> 2.8s | reverted | Already same-origin. |

A section in the PR description or a PERF.md in the repo both work. What matters is that the next person (or the next agent) reads it before proposing an experiment, and does not re-run 1 that already failed. The red flag "the same failed optimization attempted more than once because nobody recorded the first attempt" is the failure this prevents. The verification checklist makes the ledger operational: attempts are logged, kept and reverted alike.

## What to remember

1. Re-measure under identical conditions to the baseline, or you measured something else (source doc).
2. One change per measurement; isolate before bundling (source doc).
3. A gain inside run-to-run variance is noise, not a win (source doc; w 0.82 for the binary-loop variant).
4. Neutral and worse both revert; correctness gates the metric (source doc).
5. Keep a performance ledger so dead ideas stay dead (source doc).
