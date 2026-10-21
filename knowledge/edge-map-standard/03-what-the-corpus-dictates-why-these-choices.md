# 03. What the Corpus Dictates: Why These Choices

**Scope:** What the corpus dictates (why these choices): detailed analysis grounded in yubi-OS/yubiOS refs/edge-map-standard-2026-10-05.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/edge-map-standard-2026-10-05.md, no external web dig

## Purpose of this section

The ground source does not present edge-standard-v1's parameters as arbitrary engineering choices. It ties each choice back to a grounding corpus, `yubi-OS/knowledge/edge-map-standardization/` (draft PR #83, held for review), and names which document in that corpus forces which decision. This doc unpacks those four mappings.

## 1. The output class is 1-px isolated contours (corpus doc 03)

The human-preference band that `fractal_band` compares against was established on **isolated contour statistics**: Hagerhall silhouettes and curated painting stimuli. It was not established on dense texture edge maps. If the pipeline emitted a dense texture map (what a generic edge detector such as ffmpeg `edgedetect` tends to produce on a busy photo), the measured D would describe a different class of object from the one the band was measured on.

So the output class is pinned: 1-px isolated contours. That is why step 4 of the contract traces outer boundaries of 4-connected components rather than keeping every gradient pixel, and why it paints a 1-px boundary rather than a thick stroke.

## 2. Ink density and stroke width are inputs (corpus doc 02)

Corpus doc 02 carries the crossover argument. Box counting responds to how much of the frame is inked and to how thick the strokes are:

- More ink pushes N up at every scale and flattens the slope toward 2.
- Thick strokes make small boxes behave as if they are counting area rather than a curve.

The contract answers with three moves that the ground source lists together: normalize coverage (6% target), pin strokes at 1 px, and keep the smallest box above stroke width. The scale ladder's lower bound of 4 px sits above the 1-px stroke, so the smallest box is never down at the scale where it simply tiles the line.

## 3. Box-counting standards (corpus doc 04)

Corpus doc 04 contributes the box-counting discipline: a pinned scale window, a pinned regression, and a reported r2. In the contract these become:

- scale window [4, 64] with 8 log-spaced points: [4, 6, 9, 13, 20, 29, 43, 64];
- origin-anchored boxes, floor(x/s) and floor(y/s);
- least-squares regression of log N on log(1/s), D = slope;
- r2 gate 0.98 reported alongside D.

A D without an r2 is not a measurement under this standard; a D with r2 below 0.98 is flagged rather than read.

## 4. The IBSI mechanism (corpus doc 06)

Corpus doc 06 brings in the Image Biomarker Standardisation Initiative pattern: a pinned processing chain, fixture images with expected values, and cross-implementation parity. edge-standard-v1 adopts all three:

- **Pinned chain**: the six-step contract, version-bumped on any change to the critical parameters.
- **Fixtures with expected values**: `edge_fixtures.json`, four synthetic raw-gray fixtures whose expected outputs were generated from the Python source.
- **Cross-implementation parity**: the Python source of record versus the JS worker port, compared on threshold, coverage, traced count, grid SHA, and D (detailed in doc 04).

## How the four mappings compose

Read together, the mappings form a single chain of reasoning:

| Corpus source | Constraint | Contract element |
|---|---|---|
| doc 03 | band measured on isolated contours | trace outer boundaries, 1-px output |
| doc 02 | ink and stroke are box-count inputs | TARGET_COVERAGE 0.06, 1-px stroke, min box 4 > stroke |
| doc 04 | pinned window, regression, r2 | ladder [4..64] x 8, LSQ slope, r2 >= 0.98 |
| doc 06 | IBSI chain + fixtures + parity | version rule, edge_fixtures.json, Py/JS parity |

Each row closes one degree of freedom that trial-1 left open.

## The non-tuning rule as a corpus consequence

The ground source states that the threshold targets coverage only and is decided before any D is computed. This is the falsification-safe reading of the corpus: if the threshold were chosen to land D inside the band, then landing in the band would carry no information. Pinning the threshold to an ink fraction keeps the D measurement independent of the hypothesis it will be compared against.

## What this section does not claim

The corpus mappings justify the *shape* of the contract. They do not establish that 6% is the uniquely correct coverage, nor that 12 px is the uniquely correct minimum component size. Those values are pinned so that measurements are comparable; changing them is allowed, but only as a major version that invalidates prior readings.
