# 04 - Edge-standard-v1, the standardized edge-map pipeline

## Scope

This doc covers the adjacent pipeline that makes image-derived fractal-dimension measurements comparable across sources: the ink-normalization threshold, connected components, Moore outer-boundary tracing, the pinned box-counting window, the version-bump discipline, and the fixture property that pins it all. Grounding spine: the source doc (yubi-OS/yubiOS skills/taste-engine/SKILL.md); the dug sources cover the named algorithms.

## The route

POST /api/jev/corpus/taste/edge-standard takes `{gray_b64, width, height}` (raw 8-bit gray, row-major) or `{bitmap_b64, width, height}` passthrough. It returns `{pipeline: "edge-standard-v1", meta: {chosen_threshold, achieved_coverage, n_components_traced, traced_pixels, w, h, under_inked}, features: {fractal_band: {D, r2}, symmetry_present: {score, axis}}, grid_b64, run_id}`, and writes a run row of kind `edge-standard` (source doc). The meta block is the honesty block: it reports the threshold that was chosen, the coverage that was achieved, how many components were traced, and whether the image was under-inked. A D value from this route is only comparable across sources if the meta block shows the standardization actually happened.

## Stage 1: ink-normalization threshold

Raw gray in, then a single threshold chosen by the argmin rule: pick the threshold t that minimizes |coverage - 0.06|, with ties broken toward the smaller t (source doc). The target is 0.06, about 6 percent ink coverage. The critical design property, stated in the source doc and repeated in its falsification findings: the threshold targets coverage only, and is decided BEFORE any D is computed. Never tune toward a D outcome (source doc). If the threshold were chosen to make D land in a preferred band, the pipeline would stop being a measurement and become a filter. The normalization property is fixture-pinned: the same shape at different gray levels must produce an identical traced grid and an identical D (source doc, edge_fixtures.json).

One failure mode is called out as a rule: binary renders above roughly 12 percent ink are silently thresholded to an EMPTY set by the argmin rule, so every run must assert a non-empty mask (source doc, falsification rule 1). The `under_inked` flag in the response meta is the route-side expression of this; guideline 6 says under-inked images get flagged and are excluded from band reads (source doc).

## Stage 2: components and Moore outer-boundary tracing

After thresholding, the pipeline finds 4-connected components, then traces each component's outer boundary with Moore tracing in the canonical backtrack-relative form, producing 1-px contours; components under 12 pixels are dropped (source doc, MIN_COMPONENT = 12).

The Moore neighborhood is the 8 surrounding cells of a pixel, and it is the classical basis for contour-finding algorithms (source: https://en.wikipedia.org/wiki/Moore_neighborhood, jev weight 0.70). Moore-Neighbor Tracing navigates the Moore neighborhood of a designated boundary pixel in a predetermined direction, typically clockwise, to delineate boundaries in digital images (source: https://en.wikipedia.org/wiki/Boundary_tracing, jev weight 0.54). The "backtrack-relative" qualifier in the source doc pins the exact variant: the search order around each pixel is defined relative to the direction you came from, which makes the traced contour deterministic and rotationally canonical rather than implementation-defined. The 12-px minimum drops specks that would contribute noise contours and inflate D without representing structure.

## Stage 3: pinned box-counting window

The traced contours then go through box counting with a pinned window: scales from 4 to 64, 8 scales, log N versus log(1/s) regression, plus an r2 gate (source doc). Box counting estimates fractal dimension by overlaying boxes of decreasing size and counting how many boxes contain part of the set; the recorded information per box is whether it contained any pixels of the pattern (source: https://en.wikipedia.org/wiki/Box_counting, jev weight 0.62). The fractal dimension quantifies complexity, and box-counting analysis is an established method for estimating it (source: https://www.sciencedirect.com/science/article/pii/S2590123020300128, jev weight 0.66). The regression form matters: D is the negative slope of log N against log(1/s), and the r2 of that regression is the fit-quality gate that feeds the low_confidence mechanism in doc 02. The window lattice is pinned at [4, 6, 9, 13, 20, 29, 43, 64] (source doc, falsification rule 2), and gate windows must be checked against that lattice before running: the pre-registered "16-64" window was ill-posed on the lattice (no two-octave span) and had to be amended to {13, 20, 29, 43, 64} before v2, with a-priori justification, logged, and never moved post-hoc (source doc). Differential box-counting variants exist for grayscale texture work (source: https://www.sciencedirect.com/science/article/pii/S096007791930219X, jev weight 0.75), but edge-standard-v1 traces explicit 1-px contours first and box-counts the traced set, which is what makes its D values regime-comparable.

## Version-bump discipline

Any change to TARGET_COVERAGE (0.06), MIN_COMPONENT (12), or the scale window is a major version bump (source doc). Prior measurements keep their version stamp (guideline 8, source doc). This is what "comparable across sources" means operationally: two D values are comparable only when both carry the same pipeline version, because a different coverage target or scale window changes the meaning of D itself.

## Preparing an image

The source doc gives the ffmpeg recipe: scale to 512 by 512 with force_original_aspect_ratio=decrease, pad to square with black, convert to gray, emit one frame as rawvideo pix_fmt gray, base64 the raw bytes, and POST /taste/edge-standard with gray_b64, width 512, height 512. The result is a D measured at the pinned roughly 6 percent ink coverage, comparable across sources (source doc, example 2). For the broader context of where these D values are used, including the gold-set cross-validation and the falsification corpus, see docs 05 and 06.
