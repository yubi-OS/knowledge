# 01 - Instrument design and doctrine

## Scope

This doc covers what the taste engine is at the design level: the evidence-first architecture of deterministic extraction plus one batched decision-model call, the 0.45/0.55 hysteresis verdicts, the doctrine that the instrument never awards itself a quality score, and the default-admission stance of every axis. The grounding spine is the source doc, yubi-OS/yubiOS skills/taste-engine/SKILL.md.

## The instrument in one paragraph

The taste engine (deployed 2026-10-05 as taste-v1 on the steady-orbit worker) is built as three stages. Stage 1 is deterministic feature extraction per axis: for the image path, the extractor computes fractal_band as a box-counting D plus an r2 fit quality, symmetry_present, and scale_coherence, and stamps each value with `source: "extractor"`. Stage 2 is ONE batched clef call: every noul question in that call carries a MEASURED number, so the decision model never classifies free prose (source doc). Stage 3 is the verdict layer: probabilities from clef are turned into on/off/ambiguous verdicts with a double threshold, on at p >= 0.55, off at p <= 0.45, and anything between is ambiguous (source doc). The response is a vector: per-axis verdicts, probabilities, measured features, and a run_id. It is never a composite number.

The evidence-first stance is deliberate. The SKILL.md names the corpus scorer v2.2 as the same instrument family and states the shared lesson plainly: evidence-first beats free prose (source doc). Research on LLM-as-judge systems reaches the same conclusion from the outside: judges are used to provide refined evaluation beyond traditional metrics, and their reliability depends on how the judgment task is grounded (source: https://arxiv.org/html/2412.05579v2, jev weight 0.70). Microsoft's guidance on LLM judges makes the same point operationally: scoring thresholds should be aligned with reviewed outcomes and bias introduced by the judge should be removed rather than averaged away (source: https://microsoft.github.io/mcscatblog/assets/posts/better-llm-scoring/20260626_LLM1-5Scoring_WhitePaper.pdf, jev weight 0.58). The taste engine implements both ideas structurally: the measured number goes inside the question, and the verdict rule is fixed arithmetic, not model opinion.

## Why one batched call

The design sends all axis questions in one clef call rather than one call per axis. The benefit is latency and cost: the decision model sees the full axis set in a single request, and the response maps each question back to its axis. The 21-point calibration sweeps discussed in doc 05 are the counter-example that proves the shape: those sweeps deliberately make one clef call per point because they are measuring the response curve itself. In normal scoring, batching is the norm. Determinism makes this safe: measured jitter across 24 identical re-calls was sd 0.0000, because clef is deterministic on fixed numeric instructions (source doc). A non-deterministic judge would make a single batched call a sampling event; a deterministic one makes it a measurement.

## The hysteresis verdict layer

Without hysteresis the verdict rule is: on at p >= 0.55, off at p <= 0.45, ambiguous in between. With hysteresis supplied (`hysteresis: {low, high, pre_row}`), the rule changes: the verdict flips only at the edges, and between them it carries the previous row's verdict, marked `carried`. This is a double-threshold design. The general pattern is known in decision-theory work on binary classification: threshold setting is a reviewable decision about the balance of misclassification costs, not a fixed constant (source: https://onlinelibrary.wiley.com/doi/full/10.1002/joom.70040, jev weight 0.55). The taste engine treats 0.45/0.55 as such a reviewed decision: the gap between the two thresholds is a band where the honest answer is "ambiguous" or "unchanged", not a forced coin flip. If jitter ever appears, hysteresis becomes load-bearing; since measured jitter was zero, it is currently cheap insurance (source doc).

## Doctrine: no composite beauty number

The instrument never awards itself a quality score. It returns a vector plus probabilities plus measured features, and the composite beauty number does not exist and must not be invented (source doc, guidelines 7). This is a hard boundary against the most common failure of taste-metric projects: collapsing multi-dimensional evidence into one scalar and then optimizing toward it. The vector is the product.

There is a second, quieter doctrine: every axis starts `admitted: false`. Admission is a refs-recorded decision made after trials on more than one artifact class, following the rayleigh pattern of per-frame criteria rather than a flipped flag (source doc). An axis is not considered "working" when it returns plausible numbers; it is admitted when a documented trial says so. This separates measurement (the route returns a verdict) from trust (the axis is admitted), and doc 05 describes the validation steps that fill the gap between them.

## Relationship to the grounding corpus

The conceptual doc is `refs/natural-taste-engine-2026-10-05.md` on yubi-OS/yubiOS, with 4 addenda as of the source doc's writing, and the grounding corpus for the measurement half is `yubi-OS/knowledge/edge-map-standardization/` (source doc). This knowledge corpus, `skills/taste-engine/`, explicates the SKILL.md itself; the source doc remains the primary source of record for every contract in docs 02 through 08.
