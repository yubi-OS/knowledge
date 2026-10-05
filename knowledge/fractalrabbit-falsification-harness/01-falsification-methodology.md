# 01 - Falsification methodology for curve-fitting pipelines

Scope: what falsification testing means for a statistical or curve-fitting pipeline, and how planted anomalies in controlled synthetic corpora turn "does it work?" into a testable pass/fail question.

## The falsification stance

A pipeline that only ever reports its own success on friendly data cannot distinguish working code from wishful code. The falsification stance inverts the question: instead of asking whether a pipeline finds structure, you ask whether it fails in a controlled environment where the ground truth is known by construction. A recent falsification audit for financial machine learning formalizes this: it tests complete predictive workflows against synthetic reference classes, including zero-predictability environments, so that any workflow generating statistically significant evidence on a null is exposed as flawed [1] (weak backing, weight 0.37).

The general idea of validation is older and simpler: the determination of the degree to which something measures up to its claim [2] (weight 0.85). What falsification adds is adversarial design: the test is built so that a broken method produces a visible, quantified failure rather than a plausible-looking number.

## Planted anomalies as the core instrument

The workhorse of falsification testing is the planted anomaly: you generate a corpus where you control everything, then insert items whose properties you know exactly, and measure whether the detector recovers them. MathWorks documents this pattern for industrial predictive maintenance: simulation can provide anomaly signatures that historical data lacks, at the cost of having to develop and trust the simulation model itself [3] (weight 0.62). The tradeoff is explicit: synthetic generators buy ground truth with modeling assumptions.

The same pattern appears in evaluation harnesses across domains. A contamination-detection benchmark injects 450 known contaminants of three types (typographical corruption, semantic reversal, absurd out-of-context insertion) into a corpus of academic papers, then measures detection behavior; notably, its authors report that detection collapses with batch size and that the collapse presents as confident output rather than surfaced failure [4] (weight 0.72). A synthetic redaction benchmark plants fabricated PII at recorded positions and scores recall, precision, and boundary accuracy per entity type [5] (weight 0.77). Even small research demos follow the recipe: seeded synthetic event data with rare planted anomalies, engineered features, then scoring [6] (weak backing, weight 0.27).

Three properties make a planted-anomaly test falsifying rather than decorative:

1. The planted items are rare by construction. They combine feature values that the natural generator produces rarely or never, so recovery is not trivially explained by density.
2. The gate is numeric and fixed before the run. A recovery-rate threshold or a violation count is committed in advance, so a mediocre result cannot be reinterpreted as success after the fact.
3. The corpus is stochastic, not fixed. Repeating the test across generator seeds measures the detector, not one lucky dataset.

## From single tests to a test suite

A single pass/fail gate is rarely enough for a pipeline with multiple stages, because each stage can fail independently. The natural decomposition mirrors the pipeline: one test per stage, each with its own gate. For a curve-fitting audit pipeline this yields the pattern used in the falsification harness this corpus documents: a fit-quality gate (does the dimensionality reduction capture enough variance?), a recovery gate (do planted anomalies land where the detector says they should?), and an invariant gate (does the selection operator obey its mathematical guarantee on every item?).

Statistical tools for detecting data fabrication have been reviewed systematically, with an explicit assessment of strengths and limitations of each tool [7] (weight 0.84). That review culture is the right template: a falsification harness should report not just pass/fail but the distribution of behavior, because a tool that passes 4 times out of 10 is a different artifact from one that passes 10 out of 10.

## What a harness cannot test

Falsification against a synthetic generator is bounded by the generator's fidelity. If the synthetic corpus is structurally easier than the real one (more low-rank, less heavy-tailed, cleaner clusters), a passing harness overstates real-world reliability. This gap is the subject of a later doc in this corpus; the discipline here is to state it in advance: the harness validates the pipeline's internal logic on a controlled distribution, and the transfer of that validation to real corpora is a separate, empirical question.

Sequential falsification frameworks such as POPPER's iterative test-design-evaluate loop extend the same stance to ongoing validation rather than one-shot testing [8] (weak backing, weight 0.30). For a pipeline under active development, the harness should be cheap enough to rerun on every change, which is one reason the documented harness runs in pure Python with no binary dependencies.

## Sources

[1] https://arxiv.org/pdf/2604.15531 (weight 0.37, weak)
[2] https://www.merriam-webster.com/dictionary/validation (weight 0.85)
[3] https://www.mathworks.com/help/predmaint/inject-synthetic-anomalies.html (weight 0.62)
[4] https://arxiv.org/pdf/2609.09696v1 (weight 0.72)
[5] https://github.com/nvisycom/synthetic (weight 0.77)
[6] https://github.com/ktwu01/fraud-anomaly-detection (weight 0.27, weak)
[7] https://journals.sagepub.com/doi/pdf/10.1177/09593543241311861 (weight 0.84)
[8] https://deepwiki.com/snap-stanford/POPPER/2.1-sequential-falsification-test (weight 0.30, weak)
