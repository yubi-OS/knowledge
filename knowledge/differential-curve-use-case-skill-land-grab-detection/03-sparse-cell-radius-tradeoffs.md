# Sparse-Cell Radius Tradeoffs: Why r = 0.05 and What Relaxing It Costs

**Scope:** Sparse-cell detection thresholds: the r=0.05 precision choice, zero jointly-occupied cells, and the r relaxation tradeoff between anchors and precision.

## The threshold is a precision dial

The differential curve counts cell occupancy at a chosen radius. At r = 0.05, two items fall in the same cell only when their (u, v) coordinates are extremely close, so any claimed overlap between the skill corpus and the self-doc corpus is a high-precision claim. The yubiOS baseline deliberately kept r = 0.05 to match the parent fit's threshold, which produced 25 skill-only cells, 50 selfdoc-only cells, and 0 jointly-occupied cells [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, open questions section].

The threshold-recall tradeoff is the classic precision-recall dial: precision and recall pull against each other, and a decision threshold controls the balance, with the domain deciding where to set it [weight 0.25, weak backing, https://zencalculators.com/guides/precision_recall_tradeoff_threshold_and_pr_curve_explained]. scikit-learn's precision-recall documentation formalizes the same point: the curve shows the tradeoff between precision and recall across thresholds [weight 0.95, https://scikit-learn.org/stable/auto_examples/model_selection/plot_precision_recall.html].

## What relaxing r buys and costs

The source doc names the tradeoff explicitly: "If we relax r (e.g., r=0.10), we get more anchors but lose precision" [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`].

Doubling the radius roughly quadruples the area of each cell in the 2-D plane, so more item pairs fall within tolerance. The anchors gained are weaker claims: two items in the same r = 0.10 cell may share only loose structural similarity, so a joint anchor there means less than one at r = 0.05. The skill-only and selfdoc-only lists shrink too, but partly by absorbing items into anchored regions that may not genuinely align.

The MVP kept the strict threshold for a concrete reason: the land-grab use case needs a small, actionable, high-precision gap list. A long list of weak anchors does not drive dispatch decisions well. This mirrors threshold tuning in applied detection work, where the operating point is chosen by what the downstream consumer needs rather than by maximizing a single metric [weight 0.22, weak backing, https://spotintelligence.com/2024/09/11/precision-and-recall].

## Zero anchors as a measurement, not a failure

Reading 0 jointly-occupied cells as "the corpora never align" would be wrong. It reads as: at the granularity where the corpora are comparable, no structural primitive combination is currently covered by both a skill and a self-doc item. The Jaccard overlap of 0.074 between the corpora's coverage sets independently corroborates low alignment [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`].

Grid-resolution sensitivity is a known property of occupancy-style analysis. In kernel density estimation, sensitivity analyses show that grid settings materially change suppression of stochastic errors, and that resolution choices must be justified per application [weight 0.81, https://www.sciencedirect.com/science/article/pii/S1738573325004486]. Kernel smoothing converts point data into continuous surfaces whose readings depend on the bandwidth chosen [weight 0.60, https://www.spatialanalysisonline.com/HTML/density__kernels_and_occupancy.htm]. The differential's radius plays exactly the bandwidth role: it defines the scale at which "the same place" is meaningful.

## Decision rule adopted by the MVP

The MVP's rule, per the source doc: keep r = 0.05, accept the 0-anchor reading, and treat anchor discovery as a post-improvement phenomenon. As self-archaeology dispatches close skill-only cells with new SELF-CHANGELOG entries, those entries should create the first real anchors at the strict radius, which is a stronger verification than relaxing the threshold to manufacture anchors now [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`].

## Practical guidance for re-fits

When the differential is re-fit after an RSI cycle, the radius should stay fixed across fits. Changing r between baseline and re-fit would confound the shrinkage measurement: a smaller gap list could come from gentler detection rather than real documentation work. Fixed-threshold re-fitting keeps the >= 30 percent gap-list shrinkage target (doc 06) interpretable as a real change in corpus alignment rather than a change in measurement instrument [source: yubi-OS/yubiOS refs, `differential-curve-use-case-skill-land-grab-detection-2026-08-04.md`, verification checklist].
