# 04 - Sparse-cell detection and planted anomaly recovery

Scope: grid-based sparse-cell detectors, the recovery-rate metric for planted anomalies, and why detectors that work on dense corpora can false-negative on stochastic ones.

## The detector under test

The sparse-cell detector divides a projected 2-D plane into a grid and flags cells containing at most a threshold number of items; in the documented harness the grid is 0.05 by 0.05 and the threshold is cell size of 1. Rare items, if they are genuinely unlike the corpus bulk, should land in cells by themselves. The detector is therefore a density-based outlier screen: items in sparse regions of the projected space are candidates for attention.

Density-based outlier screening is a standard family. The scikit-learn documentation treats novelty and outlier detection as a core capability and demonstrates evaluation of outlier detection estimators, including LocalOutlierFactor and IsolationForest, with ROC curves [1] (weight 0.77). The evaluation discipline is the same as the harness's: score the detector against known ground truth, not against its own confidence.

## The recovery-rate metric

Recovery rate is the fraction of planted items the detector flags. Planted-item evaluation is used across applied domains because it produces a single interpretable number with a known denominator. A synthetic-corpus benchmark for redaction accuracy generates fabricated PII planted at recorded positions, then scores recall, precision, and boundary accuracy per entity type [2] (weight 0.77). In anomaly-detection reviews for critical infrastructure, the balance between high recall rates and acceptable precision is the central design tension for detection systems [3] (weight 0.75), and the same tradeoff governs sparse-cell thresholds: a finer grid or smaller cell-size cutoff flags more cells, raising both recovery and false positives.

Streaming settings sharpen the problem. A sparse active online learning framework for streaming anomaly detection targets exactly the regime where the detector must decide quickly on sparsely labeled data [4] (weight 0.66). The harness's offline setting is more forgiving, but the recovery metric is identical.

## Why recovery is unstable on stochastic corpora

The harness's central finding is that recovery on a stochastic corpus is not a stable property: mean recovery of 55 percent across 10 seeds, only 40 percent of seeds clearing an 80 percent gate, median 70 percent, and a lower tail reaching 0 percent (source document: falsification harness results, 2026-08-06). The mechanism is geometric. The natural corpus clusters; whether a planted rare item lands in a sparse cell depends on whether the natural clusters happen to absorb it on that seed. A detector whose sensitivity depends on where natural clusters fall is measuring the seed as much as the method.

This failure mode is not unique to grid detectors. The planted-contamination literature reports that LLM auditor detection degrades with batch size while the model's confidence stays high [5] (weight 0.72); the detector's apparent competence diverges from its actual recall as the evaluation conditions change. Contamination-evaluation pipelines that inject hundreds of contaminants of multiple types exist precisely because single-condition evaluation hides this variability [6] (weak backing, weight 0.34).

## Design lessons

1. Report the distribution, not the best seed. A 1-seed evaluation that happened to hit the top of the recovery distribution (the harness's seed 42 at 80 percent) reads as validation; the 10-seed sweep reads as falsification.
2. Calibrate the gate against a baseline. The source document's open question, whether the gate should be 80 percent absolute or "significantly above chance," is the right one. A chance-baseline recovery can be estimated by planting random items and measuring how often natural clustering alone flags them.
3. Grid parameters are not neutral. The 0.05 cell size was inherited as a default; sensitivity analysis over cell sizes (0.01, 0.10) is the documented next step.
4. Planted-item extremeness matters. The harness's planted combinations were deliberately very rare; recovery might differ for items closer to the natural corpus's support, which changes what the test measures.

## Sources

[1] https://scikit-learn.org/stable/modules/outlier_detection.html (weight 0.77)
[2] https://github.com/nvisycom/synthetic (weight 0.77)
[3] https://www.mdpi.com/1424-8220/25/13/4208 (weight 0.75)
[4] https://www.ijcai.org/proceedings/2025/0305.pdf (weight 0.66)
[5] https://arxiv.org/pdf/2609.09696v1 (weight 0.72)
[6] https://github.com/karanparekh14/llm-contamination-detection-eval (weight 0.34, weak)
