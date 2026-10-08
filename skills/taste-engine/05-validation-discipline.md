# 05 - Validation discipline

## Scope

This doc covers the four validation steps the source doc requires before trusting any axis: the jitter test, the calibration sweep, gold-set cross-validation, and the admission protocol. Grounding spine: the source doc (yubi-OS/yubiOS skills/taste-engine/SKILL.md).

## Step 1: the jitter test

The jitter test re-calls the same instruction N times and measures the spread of the answers. The measured record: sd = 0.0000 across 24 clef re-calls, because clef is deterministic on fixed numeric instructions (source doc). The interpretation is stated as a conditional: if jitter appears, hysteresis becomes load-bearing; if not, it is cheap insurance (source doc). The current status is the second branch. The jitter test matters because a stochastic judge would produce verdict distributions that straddle the 0.45/0.55 band, and the hysteresis design would then be doing real work instead of guarding against a hypothetical.

The general framing comes from classifier calibration research: a well-calibrated classifier correctly quantifies its own uncertainty, and calibration assessment is an established evaluation discipline (source: https://link.springer.com/article/10.1007/s10994-023-06336-7, jev weight 0.77). Re-running the same input and checking the spread is the simplest calibration probe available to an instrument with no labeled ground truth.

## Step 2: the calibration sweep

The sweep takes one axis's numeric feature, runs it across its full range in 21 points, one clef call per point, and checks the response curve against the stated semantics (source doc). The measured results recorded in the source doc: symmetry_present steps sharply at exactly 0.6; symmetry_variation honors the full 0.3-0.95 window and rejects sterile-perfect 1.0; complexity_economy steps at exactly 0.5. The conclusion: the opinion-shaped axes behave like calibrated numeric-band classifiers (source doc).

This is the test that turns "the model says it cares about symmetry between 0.3 and 0.95" into a measured fact. A sweep where the step edge lands somewhere other than the stated threshold would mean the question template and the semantics disagree, and the axis would be judged against the measured curve, not the intended one. The 21-point grid is dense enough to locate a step edge to within about 5 percent of the range.

## Step 3: gold-set cross-validation

The gold set is a published human-rated set run through the pipeline and compared against the published values. The record: Viengkham and Spehar 2018's 123 paintings. Our contour-class D came out 1.029 to 1.487 against their band means of 1.154, 1.418, and 1.711, systematically compressed, as the contour-versus-cluster regime difference predicts (source doc).

The primary source is available: Viengkham and Spehar, "Preference for Fractal-Scaling Properties Across Synthetic Noise Images and Artworks", Frontiers in Psychology 2018 (source: https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2018.01439/full, jev weight 0.73). The study predicts that, on average, most individuals prefer synthetic fractal images and paintings with fractal dimensions in the intermediate range (same source). The cross-validation uses their published D values as ground truth for the instrument's D estimation, not their preference data as a verdict source. The observed compression is a regime difference: edge-standard-v1 measures contour-class D (traced 1-px contours), while the published values are cluster-regime band means. The honest reporting rule is built into the example: compare your D distribution against the published band means and report the regime differences honestly (source doc, example 3). An instrument that silently claimed agreement with a differently-defined measurement would be worse than one that documents its compression.

The compressed range still validates something real: the ordering and rough magnitude of D match the published bands, and the systematic offset is explained by a stated mechanism rather than an unexplained error.

## Step 4: the admission protocol

`admitted` stays false until a multi-class trial with human preference data evidences it, and the decision is recorded in refs/ (source doc). The rayleigh pattern is the governing form: per-frame criteria, never a flipped flag (source doc). This means admission is not a boolean in a config that someone flips when the numbers look good; it is a dated, written decision with its trial evidence behind it, recorded where the project records decisions.

The source doc adds the specific trap: the band location must be TESTED on our scale, not assumed, and contour-class peaks may sit below 1.3 (source doc). In other words, even after cross-validation confirms the instrument measures D competently, the question "at what D does this axis's preference band peak" is an empirical question on our measurement scale, not a number imported from another instrument's scale. The admission protocol is what prevents a calibration fact from being mistaken for a preference fact.

## How the four steps interlock

The order is not arbitrary. Jitter first establishes that repeated calls are reproducible at all. Calibration second establishes that the response curve matches the stated semantics, so the numbers mean what the question says they mean. Cross-validation third establishes that the extracted features agree with an external, published measurement standard. Admission last is the gate that converts all of that into trust for a specific axis, with the evidence recorded. An axis that skips a step is not forbidden from returning verdicts, but it is forbidden from being called admitted, and the corpus-scoring caller decides what to do with unadmitted axes. The four steps together are the operational meaning of the doctrine in doc 01: evidence first, verdicts computed, trust earned in writing.
