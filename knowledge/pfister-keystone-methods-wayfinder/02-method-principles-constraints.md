# 02. Method principles restated as constraints

**Scope.** The 6 cross-cutting lessons read out of the Pfister catalog and restated as hard constraints on the wayfinder instrument, with the literature that supports each lesson.

## The constraints

The ingest produced 6 constraints, recorded in the yubi-OS refs corpus document `pfister-keystone-methods-wayfinder-2026-09-17.md` (project provenance, internal primary source, unweighted). Each is a restatement of a lesson the Pfister method families carry, and each is backed by literature the dig returned.

1. **Encode the structure of the problem rather than adding capacity.** The Temporal Fusion Transformer is the catalog's clearest instance: it is an attention-based architecture designed so that the forecasting structure, multi-horizon dynamics and interpretable variable selection, is in the model rather than bolted on after the fact [1][2]. The wayfinder analogue is that the instrument's frozen frame, bits, and null are the structure, and no new capacity terms are added to them.

2. **Labels are selective; unlabeled data, pseudo-labels, synthetic examples and consistency supply most of the signal.** Pseudo-labeling, assigning model outputs to unlabeled samples and retraining on them, is a mature family in computer vision [3], and survey work organizes the whole design space of pseudo-label methods [4]. FixMatch reaches 94.93 percent on CIFAR-10 with 250 labels by combining consistency regularization with confidence-thresholded pseudo-labels [5]. SPADE goes further and uses an ensemble of one-class classifiers as the pseudo-labelers [6]. The wayfinder analogue: the corpus has no labels, so any added signal must be synthetic or consistency-derived.

3. **Interpretability is a modeling constraint, not a post-hoc add-on.** The Temporal Fusion Transformer builds interpretability into the architecture itself [1], which is the pattern the wayfinder instrument follows by keeping the reading path (frames, bits, sectors) visible and fixed.

4. **Distribution shift must be handled explicitly.** SPADE's motivating observation is that the assumption that labeled and unlabeled data come from the same distribution is often violated in practice, and the method is built to not depend on it [6][7]. The wayfinder analogue is the frozen-frame discipline: any comparison is only valid on the same `frame_id`/`instrument_id`.

5. **A prediction is valuable only through the decision it feeds; evaluate on that decision, prospectively, with uncertainty.** The forecasting practice literature places forecasting at the forefront of decision making and planning, with uncertainty as the central object [8], and energy-management work extends deterministic models with uncertainty binning precisely to support informed decisions [9]. The wayfinder analogue is the outcomes ledger (doc 06), which stores pre-registered predictions and verdicts, not scores.

6. **Normal-only anomaly detection needs a synthetic positive control to state detection power.** CutPaste builds anomaly detectors from normal training data only and learns from synthetic anomalies [10], covered in doc 03. The wayfinder analogue is the calibration instrument (doc 05).

## Why restatement matters

The screen in doc 04 evaluates every proposed transplant against these constraints rather than against novelty. The recorded stress test asks, for each surviving variant, whether it deletes, self-scores, computes a rate or Gaussian tail, reselects a radius or grid, adds a ranking term, or admits a coordinate. Project provenance: the 6-constraint list and the stress-test questions are internal records (unweighted). The literature backing shows each constraint is not idiosyncratic: it is the shared stance of the catalog's method families [1][5][6][8][10].

## Sources

1. https://research.google/pubs/temporal-fusion-transformers-for-interpretable-multi-horizon-time-series-forecasting/ (noul 0.8962)
2. https://arxiv.org/abs/1912.09363 (noul 0.8096)
3. https://arxiv.org/pdf/2408.07221 (noul 0.8880)
4. https://arxiv.org/html/2403.01909v3 (noul 0.8815)
5. https://research.google/pubs/fixmatch-simplifying-semi-supervised-learning-with-consistency-and-confidence/ (noul 0.8378)
6. https://github.com/google-research/spade_anomaly_detection (noul 0.9489)
7. https://arxiv.org/pdf/2212.00173 (noul 0.8509)
8. https://www.sciencedirect.com/science/article/pii/S0169207021001758 (noul 0.9187)
9. https://onlinelibrary.wiley.com/doi/10.1155/er/4460462 (noul 0.5480, weak-adjacent to 0.5 threshold, treated as authoritative backing at 0.5480)
10. https://ieeexplore.ieee.org/document/9578875 (noul 0.9411)
