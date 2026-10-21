# 02. The Pipeline Contract: edge-standard-v1, Pinned

**Scope:** The pipeline contract (edge-standard-v1, pinned): detailed analysis grounded in yubi-OS/yubiOS refs/edge-map-standard-2026-10-05.md.

Ground source: `yubi-OS/yubiOS refs/edge-map-standard-2026-10-05.md`. Dig context: `dig_context_02.json` (10 clef-weighted searXNG results).

## Input boundary

edge-standard-v1 accepts raw 8-bit grayscale bytes (W x H), row-major. Decoding and rescaling are explicitly upstream, done with `ffmpeg -f rawvideo -pix_fmt gray`. Keeping decode out of the contract means the pinned chain starts from bytes, which is what makes fixture-based parity possible (doc 04).

## The six pinned steps

1. **Downsample** (only if a dimension exceeds 512): box-average to fit within 512 keeping aspect; output dims = floor(w*scale) x floor(h*scale).
2. **Threshold selection (ink normalization)**: sweep t over 0..255; coverage(t) = fraction of pixels with gray >= t; pick the t minimizing |coverage - 0.06|. `TARGET_COVERAGE` = 6%. Ties go to the smaller t. The step emits `chosen_threshold` and `achieved_coverage`.
3. **Ink mask**: gray >= threshold.
4. **Contour trace**: 4-connected component labeling in row-major scan order; per component, Moore outer-boundary tracing; paint 1-px boundary pixels; drop components with fewer than 12 traced pixels (`MIN_COMPONENT`).
5. **Emit**: a 0/1 grid plus meta `{pipeline: "edge-standard-v1", chosen_threshold, achieved_coverage, n_components_traced, traced_pixels, w, h, under_inked}`.
6. **Measure** (same module): `boxCountingDim(grid, 4, 64, 8)`.

## Moore tracing, pinned to one canonical variant

Moore-neighbor tracing is a standard algorithm, but it has variants, and variants produce different boundaries. The ImageProcessingPlace tutorial walks the Moore-Neighbor algorithm over the 8-neighbor (Moore) neighborhood, starting from a boundary pixel found by scanning and walking the neighbors around it: [Contour Tracing - ImageProcessingPlace](https://imageprocessingplace.com/downloads_V3/root_downloads/tutorials/contour_tracing_Abeer_George_Ghuneim/moore.html) (clef weight: 0.1498) (weak backing, clef weight < 0.5). A ResearchGate implementation note describes Moore tracing as a way to obtain an ordered outline of a blob or contour: [(PDF) Moore Neighbor Tracing - ResearchGate](https://www.researchgate.net/publication/357542742_Moore_Neighbor_Tracing) (clef weight: 0.0631) (weak backing, clef weight < 0.5). The Wikipedia Moore-neighborhood article covers the neighborhood the algorithm walks: [Moore neighborhood - Wikipedia](https://en.wikipedia.org/wiki/Moore_neighborhood) (clef weight: 0.0769) (weak backing, clef weight < 0.5).

The ground source removes the ambiguity by pinning a single canonical, backtrack-relative form:

- start = the component's first ink pixel in row-major order;
- initial backtrack = WEST;
- scan clockwise starting after the backtrack;
- stop on state recurrence, or at a hard cap of 4*w*h steps.

The stop rule matters. A naive "stop when you return to the start pixel" criterion can terminate early on thin features; stopping on recurrence of the full tracer state is the robust form, and the 4*w*h cap guarantees termination on pathological input.

## The measurement step

`boxCountingDim(grid, 4, 64, 8)` uses an 8-point scale ladder [4, 6, 9, 13, 20, 29, 43, 64], produced by log-spacing between 4 and 64, then rounding, deduplicating, and clamping. Boxes are anchored at the origin with indices floor(x/s), floor(y/s). D is the slope of a least-squares regression of log N against log(1/s), and the fit must clear an r2 gate of 0.98.

The smallest box is 4 px, above the 1-px stroke width the trace paints, which keeps the counter out of the regime where every box simply covers stroke pixels (doc 03 explains the crossover argument).

## Version boundaries

The doc states a hard rule: any change to `TARGET_COVERAGE`, `MIN_COMPONENT`, or the scale window is a **major version bump**, because it invalidates every prior measurement. A second rule protects the threshold step from becoming a tuning knob: the threshold targets **coverage only**, decided before any D is computed. Parameters are never tuned toward a D outcome.

## The standardization model it borrows

The contract mirrors how the Image Biomarker Standardisation Initiative approaches reproducible image features. The IBSI site describes phased work culminating in validation of benchmarked processes on multi-modality data: [IBSI – Image Biomarker Standardisation Initiative](https://theibsi.github.io/) (clef weight: 0.1603) (weak backing, clef weight < 0.5). Its documentation page lists the reference manuals that pin each processing step: [Documentation - IBSI - Image Biomarker Standardisation Initiative](https://theibsi.github.io/documentation/) (clef weight: 0.1011) (weak backing, clef weight < 0.5). The ReadTheDocs reference describes IBSI as an independent international collaboration working on standardized image biomarker extraction: [The image biomarker standardisation initiative: IBSI 0.0.1dev ...](https://ibsi.readthedocs.io/en/latest/) (clef weight: 0.0832) (weak backing, clef weight < 0.5). The project's GitHub org hosts the shared materials: [Image Biomarker Standardisation Initiative · GitHub](https://github.com/theibsi) (clef weight: 0.1481) (weak backing, clef weight < 0.5). All four IBSI results carry weak weights, so they support the analogy, not any number in the contract. The analogy itself is drawn by the ground source (doc 03 and doc 04).

## Off-topic results in this dig

Three results did not bear on the contract and back nothing here: a surname disambiguation page [Moore - Wikipedia](https://en.m.wikipedia.org/wiki/Moore) (clef weight: 0.0242) (weak backing, clef weight < 0.5), a general GIS article [Geographic information system](https://handwiki.org/wiki/Geographic_information_system) (clef weight: 0.1132) (weak backing, clef weight < 0.5), and the Bing Images landing page [Bing Images](https://www.bing.com/images/) (clef weight: 0.0162) (weak backing, clef weight < 0.5).

## Takeaway

Every degree of freedom the trial-1 pipeline left open is closed here: decode is upstream, resolution is capped at 512, ink is normalized to 6% coverage, strokes are 1 px, tracing is one canonical Moore variant, tiny components are dropped at 12 px, and the counter runs on a fixed 8-point ladder with an r2 gate. The meta block carries every chosen value, so each measurement is self-describing.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Contour Tracing - ImageProcessingPlace | https://imageprocessingplace.com/downloads_V3/root_downloads/tutorials/contour_tracing_Abeer_George_Ghuneim/moore.html | 0.1498 | weak backing, clef weight < 0.5 |
| 2 | (PDF) Moore Neighbor Tracing - ResearchGate | https://www.researchgate.net/publication/357542742_Moore_Neighbor_Tracing | 0.0631 | weak backing, clef weight < 0.5 |
| 3 | Moore neighborhood - Wikipedia | https://en.wikipedia.org/wiki/Moore_neighborhood | 0.0769 | weak backing, clef weight < 0.5 |
| 4 | Moore - Wikipedia | https://en.m.wikipedia.org/wiki/Moore | 0.0242 | weak backing, clef weight < 0.5 |
| 5 | Geographic information system | https://handwiki.org/wiki/Geographic_information_system | 0.1132 | weak backing, clef weight < 0.5 |
| 6 | IBSI – Image Biomarker Standardisation Initiative | https://theibsi.github.io/ | 0.1603 | weak backing, clef weight < 0.5 |
| 7 | Documentation - IBSI - Image Biomarker Standardisation Initiative | https://theibsi.github.io/documentation/ | 0.1011 | weak backing, clef weight < 0.5 |
| 8 | The image biomarker standardisation initiative: IBSI 0.0.1dev ... | https://ibsi.readthedocs.io/en/latest/ | 0.0832 | weak backing, clef weight < 0.5 |
| 9 | Image Biomarker Standardisation Initiative · GitHub | https://github.com/theibsi | 0.1481 | weak backing, clef weight < 0.5 |
| 10 | Bing Images | https://www.bing.com/images/ | 0.0162 | weak backing, clef weight < 0.5 |
