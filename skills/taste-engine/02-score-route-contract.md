# 02 - The POST /taste/score route contract

## Scope

This doc covers the main scoring route: its request shapes, the image path versus the features path, the verdict rules, the r2 low_confidence gate, the family choice axis, and the order_seed position-bias control. The contract statements come from the source doc (yubi-OS/yubiOS skills/taste-engine/SKILL.md); the surrounding research explains the mechanisms it references.

## Request shapes

POST /api/jev/corpus/taste/score takes exactly one of `image` ({width, height, bitmap_b64}) or `features` ({axis: {..numbers}}); sending neither or both is a 422. Unknown axis names are also 422. The optional fields are `axes` (a subset of axis names to score), `hysteresis` ({low, high, pre_row}), and `order_seed` (a number). On the image path, the extractor computes fractal_band {D, r2} over the box-counting window 4..64, plus symmetry_present and scale_coherence, and stamps every value `source: "extractor"`. On the features path, the caller supplies the numbers and they are stamped `source: "caller"` (source doc). That stamp matters for audit: a verdict on caller-supplied features is only as good as the caller's measurement, and the response says so.

## Response shape

The response is `{axes: [{axis, feature, source, p, verdict, choice?, probabilities?, confidence?, low_confidence?}], probs, rows, order_used, hysteresis_applied, consumed, run_id, scorer_version: "taste-v1"}` (source doc). Every axis row carries its own probability and verdict; `order_used` echoes the permuted question order so a pass can be reproduced; `run_id` links the call to its audit row (doc 03's sibling concern; run rows land in `jev_corpus_runs` per guideline 4, source doc).

## Verdict rules and the low_confidence gate

Verdicts are computed, not generated. Without hysteresis: `on` at p >= 0.55, `off` at p <= 0.45, else `ambiguous`. With hysteresis: flip only at the edges, else carry `pre_row[axis]` and mark the verdict `carried` (source doc). Separately, if extraction produced an r2 below 0.98 for an axis, that axis is marked `low_confidence` and is EXCLUDED from the clef call entirely: it gets no verdict from that pass (source doc, guideline 2). This is a gate on the quality of the measured feature, applied before the decision model runs. The r2 gate fired at half resolution on real data exactly as designed during the falsification-corpus real-data pass (source doc, doc 06).

The threshold design echoes published practice on binary decision thresholds: thresholds encode a chosen balance of misclassification costs and should be reviewed when the operating context changes (source: https://onlinelibrary.wiley.com/doi/full/10.1002/joom.70040, jev weight 0.55). The taste engine fixes its thresholds in the contract rather than leaving them to the caller, which keeps verdicts comparable across callers; the hysteresis parameter is the sanctioned way to carry prior state.

## The family choice axis

`family` is the one choice axis in the dictionary. It requires `features.family_description`, a string, in the request. It returns `p: null`, verdict `no_answer`, plus the echoed `choice`, per-option `probabilities`, and `confidence` from clef (source doc). Structurally, family is not an on/off axis: it is a classification over options, so it has no 0.55 threshold to cross and says `no_answer` for the probability field while still returning the option distribution. The clef contract behind it is the `choice` question type with a `criteria` object mapping option to description; the deploy lesson in doc 07 records what happens if you send a `choices` array instead (clef 5012, source doc).

## order_seed and position bias

`order_seed` permutes the order of the questions in the batched clef call deterministically. The purpose is position-bias control across passes: by scoring the same artifact under different question orders, a caller can check whether verdicts depend on where a question sits in the batch (source doc). The research backing for this control is direct: position bias is a documented failure mode where reversing the input order yields different output rankings for the same items (source: https://arxiv.org/html/2508.02020, jev weight 0.56), multi-model studies characterize positional bias as a real influence on LLM outputs (source: https://aclanthology.org/2025.findings-emnlp.1124/, jev weight 0.72), and mitigation work specifically addresses judging and recommendation contexts (source: https://arxiv.org/abs/2406.02536v1, jev weight 0.70). The taste engine's answer is not to eliminate the bias but to expose it: `order_used` in the response plus the seed makes every order an experimental variable the caller controls and the log records.

## Worked example from the source doc

POST /taste/score `{features: {fractal_band: {D: 1.41, r2: 0.999}, symmetry_present: {score: 0.9}, branch_exponent: {gamma: 2.5}}, order_seed: 7}` returns per-axis verdicts with probabilities. On the live route, D 1.41 came back `on` and D 1.18 came back `off` (source doc, validated on the live route). That pair brackets the working band: the fractal_band axis distinguishes 1.41 from 1.18 with high-confidence r2 values in both cases.
