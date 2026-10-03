# 04. Evaluation Time Dependence and Windows

**Scope:** How time-dependence in evaluation systems works: trailing-window statistics and their lag, drift typologies in monitoring, recovery behavior when load stops (elastic versus plastic drift), and why memory-bearing scores need an explicit relaxation model instead of a raw mean.

---

## 1. Trailing windows: what they smooth and what they lag

A trailing moving average over a window of m samples reports the average of the last m observations, not the state at time t. The statistical consequences are standard:

- **Smoothing.** Noise variance drops by roughly a factor of m (1/m of the per-sample variance, in expectation), which is the reason windows exist in control charts and evaluation dashboards.
- **Lag.** A trailing window of length m delays the estimate by roughly m/2 samples relative to a genuine step change in the underlying quantity. The full window must refresh before the estimate fully reflects the new regime, and the estimate reaches about half of a step change after m/2 samples [1, 2]. A Stack Exchange derivation and an analyst tutorial agree on this lag arithmetic, though both score low on source quality; the lag itself is elementary and verifiable by construction [1, 2].
- **Corruption by nonstationarity.** A window average mixes observations from before and after a regime change, so the reported number can correspond to no actual state the system was ever in.

For evaluation systems this means a pass-rate metric on a 1000-sample trailing window cannot detect a step change in failure rate faster than the window drains, and every "improvement" reading during that drain is contaminated by the old regime. Databricks documents window measures (moving averages, running totals) as first-class metric-view constructs, confirming that windowed aggregation is the default idiom in production evaluation stacks [3].

## 2. Memory-bearing alternatives: EWMA and CUSUM

The statistical process control literature addresses the lag-smoothing tradeoff directly. EWMA control charts weight recent observations exponentially, so the effective memory horizon is set by the smoothing constant instead of a hard window edge; recent work introduces mean-drift EWMA (MD-EWMA) and windowed mean-drift EWMA (WMD-EWMA) charts specifically for monitoring drifts in a process mean [4]. CUSUM accumulates deviations from target and is the standard companion for persistent small shifts. Both are *explicit relaxation models*: each has a stated time constant, so the reader knows how much history the current number represents. A raw trailing mean has an implicit, window-length-determined memory and no way to state it.

## 3. Drift typologies in evaluation

Production monitoring systems use a standard taxonomy, reflected in the IBM watsonx.governance Drift v2 metric set (verified by fetching the documentation directly):

- **Data / feature drift:** change in the input distribution ("measures the change in value distribution for important features") [5].
- **Concept drift:** the relationship between inputs and outcomes changes; P(y|x) shifts. The ML monitoring literature treats concept drift as the central reliability failure of deployed models [6, 7, 8].
- **Output / prediction drift:** change in the distribution of model outputs or confidence ("measures the change in the model confidence distribution") [5].
- **Model quality drift:** measured as the drop between training-time accuracy and estimated runtime accuracy [5].

A 2026 arXiv paper (DriftGuard, verified title and abstract) documents the operational reality: drift causes silent degradation, industry practice is manual monitoring with scheduled retraining every 3 to 6 months, and most academic methods handle detection without diagnosis or remediation [7]. Peer-reviewed work in process monitoring and predictive maintenance frames concept drift detection over continuous data streams as the standing problem [6, 8].

For a scorer or harness, the taxonomy maps cleanly: **data drift** = the workload the harness runs changes; **concept drift** = the relationship between workload and pass/fail changes (the code changed meaning); **scorer drift** = the judge itself changes (prompt, model, thresholds), which production taxonomies often omit because they assume a fixed judge.

## 4. Recovery when the load stops: elastic versus plastic

UNVERIFIED (corpus synthesis, not externally sourced): the viscoelastic analogy of this corpus predicts that a system held under a sustained objective deforms continuously, and that removing the load reveals how much of the deformation was recoverable. An acceptance loop that keeps editing code under a sustained objective behaves like creep: state keeps moving under constant load. When the objective is removed, the recovery fraction is the measurement that matters:

- **Elastic component:** the fraction that returns to baseline. Corresponds to pressure-driven churn (formatting churn, defensive edits made only to appease a persistent score).
- **Plastic component:** the fraction that stays. Corresponds to real improvements the loop made and permanent damage it caused (test deletions, complexity accretion). Both are plastic; the score cannot distinguish them, only a load-off recovery measurement can.

No external source in this dig directly addresses recovery-fraction measurement for automated optimization loops; DriftGuard's framing of remediation and the SPC literature's distinction between assignable-cause shifts (which persist) and special-cause noise (which reverts) are the nearest verified anchors [4, 7].

## 5. Why memory-bearing scores need a relaxation model

A score computed as a raw mean or raw window average answers "how has the system behaved" rather than "what is the system's state." If the evaluation state has memory (a moving scorer, a cache of past verdicts, a baseline that adapts), then the reported number is a function of the entire history, and two systems at identical instantaneous quality can report different numbers. The fix used in SPC is to define the decay law explicitly: EWMA's alpha, CUSUM's drift allowance k, or a stated window length with a stated lag. For harness acceptance, the analogous requirement is to state the relaxation time of every memory-bearing quantity and to measure the recovery fraction after load removal, so that sustained-load movement can be decomposed into elastic and plastic parts.

---

## Sources considered

| # | Source | URL | Type | jev noul | Used |
|---|--------|-----|------|----------|------|
| 1 | Stack Exchange: moving average lag | https://stats.stackexchange.com/questions/499091/what-is-the-lag-associated-with-moving-average-smoothing | Forum (corroboration) | 0.07 | Yes, corroboration only |
| 2 | Moving Averages analyst guide | https://michaelnocito.github.io/analyst-prep-kit/guides/moving-averages/ | Tutorial (corroboration) | 0.08 | Yes, corroboration only |
| 3 | Databricks metric views: window measures | https://docs.databricks.com/aws/en/uc-semantics/metric-views/advanced-techniques | Vendor docs | 0.90 | Yes |
| 4 | Windowed Mean Drift EWMA control chart (Quality and Reliability Engineering) | https://onlinelibrary.wiley.com/doi/10.1002/qre.70167 | Peer-reviewed | 0.93 | Yes, primary for EWMA/drift monitoring |
| 5 | IBM watsonx.governance evaluation metrics (Drift v2) | https://dataplatform.cloud.ibm.com/docs/content/wsj/model/wos-evaluation-metrics.html?context=analytics | Vendor docs | 0.79 | Yes, verified by fetch |
| 6 | Handling concept drift in deep learning applications for process monitoring | https://www.sciencedirect.com/science/article/pii/S2212827123006789 | Peer-reviewed | 0.89 | Yes |
| 7 | DriftGuard: concept drift detection and remediation (arXiv 2601.08928) | https://arxiv.org/html/2601.08928v1 | Preprint | 0.88 | Yes, verified by fetch |
| 8 | ML based concept drift detection for predictive maintenance | https://www.sciencedirect.com/science/article/pii/S0360835219304905 | Peer-reviewed | 0.93 | Yes |
| 9 | GitHub concept-drift-monitoring-system | https://github.com/Nilanjana1508/concept-drift-monitoring-system | Unverified repo | 0.13 | No |
| 10 | Medium: monitoring models in production | https://medium.com/@bhatadithya54764118/day-69-monitoring-models-in-production-concept-drift-and-retraining-70833a35df16 | Blog | 0.05 | No |
| 11 | Merriam-Webster entries (trailing, concept) | https://www.merriam-webster.com/dictionary/trailing | Dictionary | 0.06 | No, irrelevant |

**Method note:** 2 searXNG dig queries (top 6 each), all 12 results weighted in 1 jev /api/decide call (task ta8b8285-1a11-4cfc-98e8-4785f594f5e7, consumed 0.000250656). Sources 5 and 7 verified by direct fetch. Section 4 is marked UNVERIFIED as corpus synthesis.
