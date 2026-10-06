# 06 Scorer architecture and the taste axis dictionary

Scope: the deterministic scorer architecture in two layers, the 9-axis taste dictionary v1, how measured numbers ride inside typed decision instructions, and the measurement methods (box counting, skeletonization, compression statistics) behind the axes.

## Two layers: deterministic extraction, then typed classification

The architecture is the proven scorer-v2 pattern retargeted from document-structure axes to nature-law axes (project record, source doc 2026-10-05). Layer 1 computes numeric features per axis in the worker module, or accepts caller-supplied measurements, exactly as the existing scorer accepts evidence counts (project record). Layer 2 makes one batched typed-decision call: each axis becomes one noul question, and the instruction carries the measured number and the named band, for example "edge fractal dimension measured 1.35; is this within the perceptually preferred band 1.3 to 1.5?" (project record). Classification applies hysteresis thresholds: p >= 0.55 turns the axis on, p <= 0.45 turns it off, and the middle band returns an ambiguous row, so no axis verdict ever flips on jitter (project record).

The key property is evidence-first: measured numbers, not prose descriptions, enter the classifier. The clef decision model is calibration-trained (Brier loss) and consumes typed questions with structured probability answers (project record; live verification of the noul relay shape recorded in the source doc, 2026-10-05). The batched shape also bounds cost: one call per artifact regardless of axis count, approximately $0.0002 per score (project record).

## The measurement toolbox

The flagship axis, fractal_band, uses box counting on an edge map. Box counting records, for each box size, whether the box contains any pixels of the target class, and the box counting dimension follows from the scaling of occupied box count with box size (https://en.wikipedia.org/wiki/Box_counting, weight 0.84). The method is standard enough to have accuracy-focused literature: an improved box-counting method for image fractal dimension estimation addresses estimation accuracy of the approach as one of the frequently used techniques for FD estimation (https://www.sciencedirect.com/science/article/pii/S0031320309000843, weight 0.94), and a probabilistic box-counting variant extends the toolbox to texture descriptors (https://arxiv.org/abs/1205.2821, weight 0.69).

One pipeline warning is externally corroborated even at weak weight: a radiographic-images study reports that fractal dimensions can significantly vary based on chosen box size parameters (https://www.academia.edu/49511461/The_box_counting_method_for_evaluate_the_fractal_Di_mension_in_radiographic_images, weight 0.46, weak backing). This is exactly the pipeline-dependence failure the engine hit on real photos (doc 08), and the response (pin the box-counting window, standardize ink coverage) is the project's edge-standard-v1 pipeline.

The branch_exponent axis skeletonizes the image, builds the bifurcation graph, and fits gamma in r0^gamma = sum(r_i^gamma) (project record). The complexity_economy axis computes LZ/gzip compression of the downsampled artifact at 2 or more scales as a structure-function proxy (project record).

## The 9-axis dictionary v1

The project record's dictionary, each entry as deterministic extractor followed by typed question (project record, source doc 2026-10-05):

1. fractal_band: box-counting D of the edge map, scored against the 1.3 to 1.5 peak, with a flag that exact fractals trend monotonic and are treated separately (doc 01).
2. branch_exponent: skeletonize, bifurcation graph, fit gamma; plausible band 2 to 3 spanning Murray to da Vinci (doc 02).
3. symmetry_present: mirror-symmetry score via PCA axes plus flip-and-difference (doc 03).
4. symmetry_variation: symmetry with controlled local deviation; the sterile-perfect versus incoherent-random middle-band claim (doc 03).
5. sv_balance: surface-to-volume ratio plausible for the artifact's stated function; Kleiber-adjacent, soft band only (doc 03).
6. complexity_economy: LZ/gzip at 2+ scales, never claimed as effective complexity (doc 05).
7. power_law_like: temporal or spectral exponent in plausible band with goodness-of-fit, temporal artifacts only.
8. scale_coherence: self-similarity across at least 2 orders of magnitude.
9. family: a clef choice question (tree, river network, honeycomb, coral, lattice, random) for grounding, not scoring.

The project's calibration sweeps confirmed the numeric-band axes behave as calibrated band classifiers: with stated thresholds embedded in the instruction, measured responses show sharp steps at the stated boundaries (symmetry_present stepped from 0.009 at 0.55 to 0.975 at 0.60; complexity_economy stepped from 0.012 at 0.45 to 0.980 at 0.50) (project record, source doc addendum, 2026-10-05). The uncalibrated part is the semantic grounding of the bands themselves, not the classifier's response.

## Structured-output and calibration grounding

Two external anchors support the classifier layer's design choices. A general calibration scheme for output entities of interest in neural-network structured prediction models addresses exactly the problem of calibrating structured, multi-part outputs rather than single labels (https://aclanthology.org/2020.acl-main.188/, weight 0.83; related finding that neural models show high calibration errors on NLP tasks at https://pmc.ncbi.nlm.nih.gov/articles/PMC7890517/, weight 0.61). A comprehensive review of classifier probability calibration metrics organizes the metric landscape for models with discrete output sets (https://arxiv.org/pdf/2504.18278, weight 0.74). And structured JSON outputs from language models are established enough to have evaluation frameworks of their own (https://arxiv.org/html/2408.11061v1, weight 0.82), which is the contract the engine relies on: typed questions in, probabilities out, no free text.

## Optional dual channel

The decision model is multimodal, so the image itself can ride in state as an independent grading lane alongside the deterministic-features path (project record). Disagreement between the two channels is itself the uncertainty signal: when the measured features say on-band but the direct image read says off, the ambiguous row is the honest output, and k-pass ensembling plus the verification loop (doc 07) resolves it.
