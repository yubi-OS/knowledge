# Alignment Metrics: Jaccard Overlap as the RSI-Cycle Tracking Signal

**Scope:** Quantifying cross-corpus alignment over RSI cycles: the Jaccard overlap metric, its 0.074 baseline, and the 0.20 growth target as the tracking signal.

## The metric

The differential's cross-corpus alignment is tracked with the Jaccard index: the size of the intersection divided by the size of the union of two sets [weight 0.23, weak backing, https://en.wikipedia.org/wiki/Jaccard_index]. In the differential's context the sets are the primitive-coverage profiles of the skill corpus and the self-doc corpus, so the index answers: of all the structural primitive combinations either corpus touches, what fraction do both touch?

The baseline value is 0.074 [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`]. That is close to the zero-anchor reading at r = 0.05: the corpora barely overlap structurally, which is exactly why the land-grab use case has so much raw material to work on.

## Why Jaccard and not something else

The Jaccard index has properties that fit this tracking job:

- It is defined purely by set sizes, so it is reproducible from the fit outputs without extra modeling.
- It is sensitive to the intersection: documenting a skill with a SELF-CHANGELOG entry that genuinely shares coverage adds to the intersection and shrinks the union only slightly, moving the index up.
- It saturates at 1.0 only when the corpora cover identical structural territory, which is a natural endpoint for alignment.

Practitioners note its complement, the Jaccard distance, measures dissimilarity and is simply 1 minus the index [weight 0.28, weak backing, https://www.statisticshowto.com/jaccard-index/]. Python implementations are a few lines on top of built-in set intersection and union operations [weight 0.53, https://www.geeksforgeeks.org/python/jaccard-similarity/].

The Jaccard index is not the only candidate. The overlap coefficient divides the intersection by the smaller set's size instead of the union, and NVIDIA's graph-analytics team discusses when each is the better similarity signal [weight 0.67, https://developer.nvidia.com/blog/similarity-in-graphs-jaccard-versus-the-overlap-coefficient/]. The overlap coefficient would reward documentation that adds coverage inside a narrow band already touched by the self-doc corpus, while Jaccard rewards genuinely new shared territory. The land-grab goal is the latter: create structural overlap where none exists. The Sorensen-Dice coefficient, another set-similarity statistic from ecology, weights the intersection double and is a common alternative [weight 0.10, weak backing, https://handwiki.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient].

## The growth target

The source doc's testable bet: Jaccard grows to at least 0.20 in one RSI cycle, from the 0.074 baseline [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, key assumptions]. That is close to a tripling of shared coverage. Read together with the 30 percent gap-list shrinkage bet, the two targets are two views of the same mechanism: entries that close skill-only cells add shared coverage (raising Jaccard) and remove isolated cells (shrinking the gap list). If one moves and the other does not, the mechanism is partially working and the entries need review.

## Tracking discipline across cycles

Corpus-similarity measurement has a known pitfall: a similarity measure needs a threshold and a stable definition to support accuracy claims over time [weight 0.77, https://www.sciencedirect.com/science/article/pii/S0024384122001413]. For the differential this means three disciplines:

- Keep the basis and radius fixed across cycles so the index measures corpus change, not instrument change.
- Record the index alongside the cell counts at every re-fit, so the series is reconstructable.
- Treat a Jaccard jump with no gap-list change as suspicious (inflation without structural closure, likely from broad wording rather than real coverage overlap).

Correlation-style alignment measures are evaluated in adjacent domains for exactly this property: how well a similarity score tracks the phenomenon it claims to measure, compared against established distance metrics [weight 0.60, https://onlinelibrary.wiley.com/doi/10.1002/cav.2157].

## Where the metric sits in the verification chain

The verification checklist in doc 06 makes Jaccard growth a named gate, equal in rank to the cell-count gate. That is deliberate: cell counts measure the gap list (the actionable artifact), Jaccard measures the underlying alignment (the phenomenon). A use case that moved the artifact without moving the phenomenon would be gaming its own scoreboard. Keeping both gates means the MVP must produce documentation that structurally overlaps skill coverage, not just entries that happen to reduce a count [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`].

## Reading a post-cycle series

After each RSI cycle, the expected healthy pattern is: skill-only count down, joint-anchor count up from 0, Jaccard up from 0.074. If Jaccard rises while anchors stay 0, the overlap is happening at a granularity the strict radius cannot see, which is a signal to examine the basis rather than to relax the threshold prematurely [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, open questions].
