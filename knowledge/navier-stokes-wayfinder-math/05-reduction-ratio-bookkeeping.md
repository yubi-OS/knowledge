# Equation D: reduction-ratio bookkeeping and its small-sample limits

Scope: the trust-region-style reduction ratio as a bookkeeping diagnostic for predicted isolation reductions, its eligibility rules, and why the recorded ratios measure local model agreement rather than confidence or task quality.

## The ratio

For a strict predicted decrease in the isolation count, record:

`rho = (-Delta I observed) / (-Delta I predicted)`

Predicted reduction must be positive. Zero or positive predicted deltas are not valid descent-ratio trials and must be excluded from the ledger rather than recorded as poor ratios. The form is the standard trust-region acceptance quantity, where the ratio of actual to predicted objective reduction decides whether a step is trusted (trust-region methods, Cornell Computational Optimization, https://optimization.cbe.cornell.edu/index.php?title=Trust-region_methods, weak, weight 0.45; trust region background, https://en.wikipedia.org/wiki/Trust_region, weak, weight 0.32).

## What the recorded ratios are and are not

The eight eligible ratios from the recorded trail are `0.5, 0, 2, 1, 0, 0, 0, 1`. They measure local geometric model agreement between the exact ADD and CHANGE identities and the observed counts. They do not measure calibrated confidence and they do not measure task quality. This is a bookkeeping diagnostic, nothing more (internal research record, wayfinder-loop results at the pinned commit, https://github.com/yubi-OS/yubiOS/blob/67274066531ae5288bfc640a2030e5a20508b57e/refs/wayfinder-loop-results-2026-09-09.md).

## Why per-sector reliability is forbidden

Estimating per-sector reliability from these tiny, selected groups would be selection on the outcome and then inference on the selected subset. The meta-research literature treats cherry-picking, the practice of selecting which results to report, as a core bias mechanism that invalidates downstream summaries even when each individual number is correct (A note on cherry-picking in meta-analyses, https://www.mdpi.com/1099-4300/25/4/691, weight 0.59). The eight ratios above are exactly such a small selected group: they are the trials where a strict predicted decrease existed, and they arrive from an adaptive sequence on one corpus, so they are not independent samples of anything.

## Rules carried forward

1. Record the ratio only when the predicted delta is a strict reduction.
2. Report the ratio alongside the always-zero and no-change baselines, never instead of them.
3. Do not average ratios into a per-sector score, a confidence estimate, or a quality estimate.
4. Any future ratio analysis needs its denominator counts: how many trials were eligible, and how many were excluded for nonpositive predicted deltas.

## Sources considered

| source | weight |
|---|---|
| https://github.com/yubi-OS/yubiOS/blob/67274066531ae5288bfc640a2030e5a20508b57e/refs/wayfinder-loop-results-2026-09-09.md (internal research record) | record |
| https://www.mdpi.com/1099-4300/25/4/691 | 0.59 |
| https://optimization.cbe.cornell.edu/index.php?title=Trust-region_methods | 0.45 (weak) |
| https://en.wikipedia.org/wiki/Trust_region | 0.32 (weak) |
| http://www.nmr-relax.com/api/4.0/minfx.base_classes.Trust_region-class.html | 0.27 (weak) |
| https://www.researchgate.net/publication/370169417_A_Note_on_Cherry-Picking_in_Meta-Analyses | 0.23 (weak) |
| https://www.hogshaven.com/2020/3/3/21159689/statistics-bias-and-the-draft-part-1 | 0.17 (weak) |
| https://scipedia.bohrium.com/en/sciencepedia/feynman/optimization_methods_undergraduate | 0.17 (weak) |
| https://www.bohrium.com/en/sciencepedia/feynman/keyword/predicted_reduction_vs_actual | 0.15 (weak) |
| https://fastercapital.com/content/Selection-Bias--Cherry-Picking-Data | 0.10 (weak) |
| https://fastercapital.com/content/Sample-Selection-Bias--Cherry-Picking-Pitfalls | 0.05 (weak) |
| https://www.merriam-webster.com/dictionary/trust | 0.04 (weak, off-topic) |
| https://auth.withcherry.com/ | 0.04 (weak, off-topic) |
