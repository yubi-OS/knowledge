# 03. Synthetic positive controls: CutPaste and SPADE

**Scope.** Why a detector trained on normal data alone cannot state its own detection power without a synthetic positive control, how CutPaste and SPADE establish that, and how the calibration instrument imports the idea into the wayfinder.

## CutPaste: normal-only training with synthetic anomalies

CutPaste is a 2-stage framework for building anomaly detectors using normal training data only: it first learns self-supervised deep representations, then builds a generative one-class classifier on the learned representations [1][2]. The key move is that the model learns from synthetic anomalies, created by cutting and pasting image patches at varied locations and shapes, so that the detector never needs anomalous samples at all [1][3]. The published framing is defect detection of unknown anomalous patterns without anomalous data, aimed at manufacturing defect detection, medical image analysis, and video surveillance [2][3].

The methodological point the wayfinder ingests is not the image pipeline. It is that the synthetic defect is what lets the paper make a power statement at all: without known-different examples, a normal-only detector has no way to demonstrate that it responds to anything.

## SPADE: pseudo-labeled ensembles under distribution mismatch

SPADE, Semi-supervised Pseudo-labeler Anomaly Detection with Ensembling, is a semi-supervised anomaly detection method that uses an ensemble of one-class classifiers as the pseudo-labelers and supervised classifiers on top, achieving strong results especially on datasets with distribution mismatch between labeled and unlabeled samples [4][5]. Its abstract is explicit that the same-distribution assumption is often violated in applications, and the framework is built to not be limited by it [5][6]. SPADE is the catalog's second anomaly family and the source of the pseudo-label economy constraint in doc 02 [7].

## The wayfinder application: cutpaste-splice on text

The calibration instrument `POST /api/map/control` transplants the CutPaste control idea from image patches to code units in text. Project provenance for this section: the yubi-OS refs corpus document `pfister-keystone-methods-wayfinder-2026-09-17.md` (internal primary source, unweighted).

- The fixed recipe is `cutpaste-splice/1`: a centered host window of round(0.25 times len) code units is replaced by a same-length donor segment, or the whole donor if the donor is shorter. Surrogate pairs are never split. The only knobs are `n_controls` (2 to 12, default 6) and `control_seed` (default 20260917), and both are echoed in the response.
- Recipe keys such as `splice_fraction`, `window`, `hosts` are refused with 422, and instrument keys with 409, so the recipe cannot drift per call.
- Each splice is measured through the real `mapPreviewHandler`, so the control inherits the frozen frame, anchor verification, exact ledger, and no-persist discipline of the ordinary preview path.
- Per control the response carries host, donor, offsets, before and synthetic SHA256, `isolated_delta`, `ledger_actual_delta` (which must agree), `bits_changed`, geodesic and chord displacement, `quantization_silent`, `occupied_sectors_delta`, and `unchanged_anchor_count`.

The analogy is direct: the splice is the synthetic defect, the frozen instrument is the one-class statistic, and the control run states whether the statistic responds to known-different content, which is the same role the synthetic defect plays in CutPaste's evaluation [1][2].

## What a positive control does and does not say

A control states instrument response, not task quality. That boundary is doc 07's subject. In CutPaste terms, the synthetic defect proves the detector's representations separate altered from normal content [1]; it does not prove the detector finds real defects, which requires real labeled anomalies. The wayfinder instrument makes the same separation explicit by carrying `task_verdict:"not-applicable"` on every control response (internal provenance).

## Sources

1. https://ieeexplore.ieee.org/document/9578875 (noul 0.9411)
2. https://arxiv.org/abs/2104.04015 (noul 0.6054)
3. https://arxiv.org/pdf/2104.04015 (noul 0.8233)
4. https://github.com/google-research/spade_anomaly_detection (noul 0.9489)
5. https://research.google/pubs/spade-semi-supervised-anomaly-detection-under-distribution-mismatch/ (noul 0.9056)
6. https://arxiv.org/pdf/2212.00173 (noul 0.8509)
7. https://arxiv.org/abs/2212.00173 (noul 0.6674)
