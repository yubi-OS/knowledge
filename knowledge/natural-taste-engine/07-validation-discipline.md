# 07 Validation discipline for an instrument built on LLM decisions

Scope: the noise controls that make a typed-decision engine trustworthy: jitter tests, threshold calibration sweeps, gold-set cross-validation, question-order permutation, k-pass ensembling for the ambiguous band, and outcomes-ledger pre-registration with independent task checks.

## The core hazard: a judge that reads stable but is biased

When a decision model classifies artifacts, two distinct failure classes need different machinery. Systematic bias (the model prefers one answer regardless of content) and input-order bias are documented extensively in the LLM-as-judge literature. A systematic study of position bias in LLM-as-a-judge finds that the tendency to favor solutions based on their position within the prompt compromises reliability across pairwise comparison tasks (https://arxiv.org/html/2406.07791v7, weight 0.87; v1 of the same study frames the same finding at https://arxiv.org/html/2406.07791v1, weight 0.90). Practitioner summaries converge on the same mitigations: swap-based debiasing for pairwise settings, explicit criteria for rubric scoring, and multi-model ensembles for cross-model comparisons (https://engineersofai.com/docs/agentic-ai/agent-evaluation/llm-as-agent-judge, weight 0.55).

The engine's translation of this literature is question-order permutation across passes (project record). Because each axis is scored by its own typed question inside one batched call, order effects are controlled by randomizing question order across repeated passes and requiring the verdict to survive the permutation.

## Jitter tests: stability before meaning

Before any calibration claim, the instrument must be shown to be stable on identical input. The project's jitter test is fixed: same instruction, 20 re-calls, measure the spread of the returned probability (project record, source doc 2026-10-05). The test exists because the first live probe returned a probability of 0.4093 on a Murray-law question, near the decision boundary, so calibration behavior at boundaries had to be measured rather than assumed (project record).

The project's later calibration sweeps resolved this in an unexpected direction: on fixed numeric instructions the single-pass reads were already deterministic, with sharp steps at the stated thresholds (symmetry_present: 0.009 at a stated 0.55 versus 0.975 at 0.60; complexity_economy: 0.012 at 0.45 versus 0.980 at 0.50, with soft wobble only near 0.90 and 1.00) (project record, source doc addendum, 2026-10-05). The 0.45/0.55 hysteresis was confirmed as cheap insurance rather than a necessity. The lesson generalizes: run the jitter test anyway, because the stability of a numeric-band instruction is an empirical property of the instruction, not a property of the model.

## Calibration removes bias; hysteresis removes jitter

The project record's split of responsibilities: hysteresis (p >= 0.55 on, p <= 0.45 off, middle ambiguous) removes jitter; threshold calibration on a gold set using Youden's J removes bias, instead of assuming a 0.5 threshold (project record). The statistics literature backs the second half. The Youden index approach maximizes the empirical Youden index to determine the optimal cutoff point for classification, with consistent estimators for the cutoff under stated regularity conditions (https://onlinelibrary.wiley.com/doi/10.1002/sim.70189, weight 0.69). Newer work extends the same index to prevalence-aware threshold selection, showing a classifier's sensitivity-specificity profile can be strategically leveraged through prevalence-aware threshold selection to manage class imbalance (https://www.frontiersin.org/journals/epidemiology/articles/10.3389/fepid.2026.1839151/full, weight 0.62). A practical walkthrough of threshold selection in imbalanced binary classification is available at weak weight (https://amirhessam88.github.io/finding-thresholds/, weight 0.18, weak backing).

## Gold-set cross-validation: the semantic layer

Calibration sweeps establish the classifier reads its stated thresholds correctly. They cannot establish that the thresholds mean anything. The project record is explicit: what remains uncalibrated is the semantic grounding of the bands themselves, which requires human gold labels (project record, addendum, 2026-10-05). The gold-set discipline for the fractal-band axis is a set of approximately 20 artifacts, half in-band and half out-of-band by construction, proving separation before any admission (project record). The real-photo extension and its limits are doc 08's subject.

The external anchor for gold-set methodology in this space is Human Preference Dataset v2, a large-scale cleanly-annotated dataset of human preferences with annotator rankings per prompt group (https://arxiv.org/html/2306.09341v1, weight 0.83): large-scale human aesthetic annotation is feasible, and existing datasets can serve as gold sources when the question matches (the doc 08 gold-set search applies the same logic to paintings and scenicness datasets).

## Pre-registration and independent verification

Two governance controls close the loop. Every verdict is pre-registered on an outcomes ledger, predicted before realized, so the engine's track record is auditable rather than reconstructed (project record). And an independent task check gates any keep: the taste engine never awards itself a quality score (project record). These mirror the doctrine that produced the scorer the engine is patterned on, and they matter precisely because the classifier layer is opaque: the ledger plus the independent check are the only external evidence that the instrument's verdicts track reality.

## The honest summary

The validation discipline is a stack of cheap, ordered controls: jitter test (is the read stable), calibration sweep (does the read track the stated band), gold set (does the band mean anything humans agree with), question-order permutation and k-pass ensembling for the ambiguous band (do order and framing effects survive), outcomes ledger plus independent task check (does the instrument's track record hold up). Each layer is falsifiable on its own; an axis is admitted only when the layers it needs have all fired. The project's own history shows the discipline working as intended: a pipeline confound blocked real-photo admission until the measurement pipeline was standardized (doc 08), which is the discipline catching a real failure rather than performing one.
