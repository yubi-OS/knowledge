# 08 Edge standardization and the honest limits of real-photo admission

Scope: why the first real-photo trial failed, the edge-standard-v1 pipeline that fixed measurement comparability, the trial-2 results, and the remaining admission gate: a human-rated gold set on the engine's own measurement scale.

## Trial 1: the instrument was right and the pipeline was wrong

The first multi-class trial ran 18 real Wikimedia photos (6 tree and branch scenes, 6 coastlines, 6 urban facades) through an ffmpeg edgedetect step into 512-pixel binary edge maps, then through a validated Python extractor and the taste-route classification (project record, source doc 2026-10-05). Measured D ranges: trees 1.411 to 1.618, coast 1.151 to 1.638, urban 1.330 to 1.624, all with regression r-squared at least 0.98. In-band rates were poor: trees 1 of 6 (mean probability 0.19), coast 0 of 6 (mean 0.03), urban 2 of 6 (mean 0.35).

The decisive observation: the classifier was faithful to measured D on every image (D 1.411 read as 0.978 on; D 1.521 read as 0.064 off), exactly matching the calibration sweep curve (project record). The instrument itself was consistent across artifact classes. The failure was upstream of the classifier: dense photo edge maps from that edge-detector pipeline read systematically higher, mostly 1.5 to 1.6, than the Spehar contour-statistic band, which was established on isolated-contour stimuli. Measured D was pipeline-dependent (edge-detector thresholds, texture density, ink coverage of 4,700 to 28,000 pixels against 1,700 to 124,000 in the synthetic corpus). The admission verdict per the project's pattern: fractal_band stays not admitted for real-photo classes until either the edge-map pipeline is standardized or the band is recalibrated on a human-rated real-photo gold set (project record).

The pipeline-dependence problem has external grounding: the box-counting literature itself warns that fractal dimensions vary significantly with chosen box size parameters (https://www.academia.edu/49511461/The_box_counting_method_for_evaluate_the_fractal_Di_mension_in_radiographic_images, weight 0.46, weak backing), and edge-detection technique choice demonstrably changes extracted features, which is why comparative evaluations of edge detectors on fractal images exist as a genre (https://www.researchgate.net/publication/343324331_Performance_Evaluation_of_Edge_Detection_Techniques_for_Fractal_Images, weight 0.39, weak backing; companion PDF at https://ijrat.org/downloads/Vol-8/June-2020/86202003.pdf, weight 0.51). Multifractal feature extraction from images is likewise documented as sensitive to the measure used (https://pmc.ncbi.nlm.nih.gov/articles/PMC9443658/, weight 0.60).

## edge-standard-v1: making measurements commensurable

The fix is a standardization pipeline modeled on the IBSI radiomics pattern (project record, source doc addendum 2, 2026-10-05): raw grayscale in, then an ink-normalization threshold chosen at argmin |coverage - 0.06| with ties resolved to the smaller threshold, then 4-connected components, then Moore outer-boundary tracing producing 1-pixel contours with components under 12 pixels dropped, then a pinned box-counting window of 4 to 64 at 8 scales with a log N versus log(1/s) regression and an r-squared gate. The implementation ships as a Python source of record (stdlib, 34 of 34 checks) with a JavaScript worker port (28 of 28 including 13 parity checks, maximum absolute D difference 4.4e-16), and a fixture pack carrying property tests: two fixtures encode the normalization property (same shape at different gray levels yields an identical traced grid and identical D), a Sierpinski fixture reads D 1.5926, and all 4 fixtures parity-pass against the live worker (project record).

The live route POST /api/jev/corpus/taste/edge-standard accepts grayscale base64 in and returns the standardized bitmap plus fractal and symmetry features, writing a run row of kind edge-standard (project record).

## Trial 2: the offset disappears

Running the same 18 photos through edge-standard-v1 changed the picture (project record, addendum 2):

- trees: D 1.182 to 1.347, mean 1.301, mean probability 0.676, 4 of 6 in-band
- coast: D 1.114 to 1.395, mean 1.260, mean probability 0.344, 2 of 6 in-band
- urban: D 1.150 to 1.393, mean 1.265, mean probability 0.339, 2 of 6 in-band

Trial 1 had D parked at 1.5 to 1.6 with 3 of 18 in-band. The standardized pipeline removed the systematic offset: real-photo D now lands in the Spehar regime, achieved coverage is pinned at 0.048 to 0.063 on 16 of 18 images, and classifier verdicts track D exactly (D of at least about 1.31 reads on), consistent with the calibration sweeps. Two saturation cases (2 urban images hitting threshold 255 with coverage 0.123 and 0.073) fired an under-inked guard and were excluded from band reads (project record).

The pipeline-comparability blocker is therefore resolved: measurements are now comparable across sources at pinned ink coverage, and any artifact re-measures identically under the pinned pipeline (project record).

## The remaining gate: band location on our own scale

The gold-set cross-validation then hit a publishable finding (project record, addendum 4). A published human-rated gold set exists: Viengkham and Spehar 2018, 123 real paintings with 171 human raters, per-image D values published under the authors' own grayscale box-counting pipeline. Running all 123 paintings through edge-standard-v1 (123 of 123 success, all r-squared at least 0.9886, achieved coverage 0.046 to 0.079) produced our measured D distribution of 1.029 to 1.487, mean 1.278, median 1.282, against their published band means of 1.154 (low), 1.418 (intermediate), and 1.711 (high) on their scale.

The honest conclusion: our contour-class pipeline reads the same paintings systematically lower and compressed (our maximum 1.487 against their high-band mean 1.711; 48 of 123 paintings land in the 1.3 to 1.5 region under our pipeline and 0 exceed 1.5). The two pipelines measure different point sets on the same images; both are internally valid, and they are not commensurable in absolute D. The supplementary image ordering is not band-ordered (positional-thirds test flat), and the authors' OSF umbrella does not carry the 2018 ratings in usable form (project record). So the band must be calibrated on the engine's measurement scale, not theirs. Two paths remain: a data request to the authors for the 2018 per-image values, or a small human-rated pilot on our pipeline's D values (project record, with a calibration warning that the contour-class peak may sit below 1.3 on our scale, consistent with reported contour-class peaks of roughly 1.1 to 1.3).

## Free large-scale anchors

Two datasets can anchor a large-N test without collection cost. The Natural Scenes Dataset provides fMRI responses to thousands of color natural scenes from 8 subjects across 30 to 40 scan sessions (https://www.naturalscenesdataset.org/, weight 0.77), usable for neural-response anchoring of scene statistics. ScenicOrNot carries approximately 217,000 landscape photos of Great Britain with human scenicness ratings, each image rated 3 times by different people (https://scenicornot.datasciencelab.co.uk/faq, weight 0.47, weak backing; project repository at https://github.com/thedatascilab/ScenicOrNot, weight 0.22, weak backing). The project record notes a clean large-N fractal-dimension versus scenicness-rating correlation on nature-specific rated images appears to be unclaimed territory (project record).

## Admission status, stated honestly

fractal_band remains not admitted for real-photo classes (project record). The measurement-comparability question is closed; the open question is semantic transfer: whether human preference tracks the engine's measured D, and where the peak sits on the engine's own scale. That is a question no amount of pipeline engineering can answer, and the engine's discipline is to leave the axis unadmitted until the human gold set answers it, rather than ship a band calibrated on someone else's pipeline and hope the scales match.
