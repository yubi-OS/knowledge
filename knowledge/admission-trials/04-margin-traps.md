# 04. Margin traps: what a fixed-margin null can and cannot tell you

Scope: margin traps: fixed-margin nulls preserve row and column totals, so non-exclusion is not confirmation, and margin-matched random matrices can reproduce observed structure.

Program-specific statements derive from the instrument's trial record of 2026-09-19 (yubiOS refs/admission-trials-2026-09-19.md). External claims are cited inline with jev weight; weights below 0.5 are labeled weak backing. Note: the fixed-margin literature dug thin after one redo; the strongest sources carry the claims below and several supporting points are labeled weak.

## What a fixed-margin null preserves

The Fisher-style tradition conditions on the margins: Fisher's exact test considers all possible tables with the same row and column sums as the observed table, and the p-value is determined by which of those tables are more extreme (Wikipedia, Fisher's exact test, weight 0.201, weak backing). The same conditioning appears in modern matrix-permutation tooling: constraints on row sums, column sums, matrix fill, and total sum are part of the permutation design and can be checked with a summary method (vegan permatfull documentation, rdrr.io, weight 0.436, weak backing).

Preserving margins is a virtue, not just a habit. A null that fixes the margins asks a sharper question: given the amount of structure each row and column must contain, is the observed arrangement unusual? The exchangeability literature is the theoretical backbone here: permutation tests rely on the exchangeability of observations under the null, and recent work examines exactly when that assumption holds for tests of multiple coefficients (arXiv 2406.07756, The exchangeability assumption for permutation tests of multiple coefficients, weight 0.917). The same paper details how the computational application of a permutation test requires the analyst to permute either the explanatory or the response variable in a way consistent with the model being tested (arXiv 2406.07756 v1, weight 0.814). A margin-matched null is one concrete way of keeping the resampling consistent with the data-generating structure.

## Trap 1: non-exclusion is not confirmation

The trial framework's verdicts are exclusion-based: a statistic is "not excluded" when its observed value sits where the null also produces values. The trap is reading "not excluded" as "confirmed". The canonical warning is medical: we can never prove the absence of a relation, and when necessary we should seek positive evidence against a link rather than treating a failed detection as proof of no link (BMJ, absence of evidence is not evidence of absence, weight 0.686). Climate-science commentary makes the same point with an added nuance: statistics is most effective with large quantities of data, and absence of evidence claims get weaker as data get thinner (RealClimate, absence and evidence, weight 0.590).

The radius-profile trial makes this trap concrete. On the refs/ and docs/ frames, the I(r) counts were not excluded: the isolate profile of the refs/ point cloud is what a margin-matched random bit matrix also produces. The honest reading is that the profile carries no detectable signal beyond its margins, not that the profile is confirmed as meaningful. The record words this correctly: "not-excluded" is the verdict, and admission merely licenses reporting the counts as instrument readings on that frame.

## Trap 2: a matched null can reproduce the structure you hoped to detect

The tighter the matching, the more the null can look like the data. A margin-matched random bit matrix reproduces the isolate profile on several frames (the record's radius observation). This is not a defect; it is what matching means. But it bounds what the test can ever find: anything implied by the margins alone is invisible to a margin-matched test. When a statistic's observed value falls inside the null's range, the correct conclusion is that the margins explain it, which is a substantive finding about the corpus, not a null result to be averaged away.

## Trap 3: margin choice changes the question

Because fixed margins change what the null distribution contains, choosing margins is choosing the question. The Fisher-margin assumption debate in the contingency-table literature turns on exactly this: if the margin totals are not fixed by the experimental design, there may be information about independence contained in the margins themselves, and conditioning throws that information away (Cross Validated, weight 0.056, weak backing). The trial framework resolves the design question up front by declaring margins preserved and reporting `margins_preserved` in every response, so the question each trial answers is stated by construction rather than chosen post hoc.

## What the trial does instead of averaging

A verdict that depends on which null draws were taken is refused rather than averaged across seeds; that mechanism is doc 05's subject. The margin trap interacts with it: with only 40 null draws (K=40), the tails are coarse, and a statistic near the boundary can flip from excluded to not-excluded under a different seed. The framework's response is to treat reproducibility as an admission criterion, so a marginal, seed-dependent result is reported as refused, not silently averaged into admission.

## Sources

Primary (weight >= 0.5): arXiv 2406.07756 exchangeability for permutation tests (0.917 and 0.814 for the v1), BMJ absence of evidence (0.686), RealClimate absence and evidence (0.590). Weak backing (weight < 0.5): rdrr.io vegan permatfull (0.436), theorempath permutation tests overview (0.391), Wikipedia permutation test (0.255), Wikipedia Fisher's exact test (0.201), Cross Validated margin-assumption threads (0.056 and 0.055).
