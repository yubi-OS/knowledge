# 07 - Renders

**Scope:** the render output directories the regime produces and the consumer each one serves, as the source doc's Renders table records them.

This is an internal-record subtopic: directory names and consumers come from the source doc (yubi-OS/yubiOS playbooks/rsi-regime.md) and are repo-local artifacts. No web dig applies. The one externally grounded convention in this table is the projection used for the per-dim graphs, noted below.

## The table

| Directory or file | Consumer (source doc) |
|---|---|
| papers/data/curve-map-output/ | 9-D + 7-D curve maps, produced by the original fit-full-curve-map.py and its cycle-3-refs siblings |
| papers/data/nd-viewer-output/ | 14-D NSS + size bucket + t/residual viewer for refs |
| papers/data/curve-map-output-384d/ | 384-D TF-IDF curve map, legacy, kept for backwards compatibility |
| papers/data/curve-map-output-multi-corpus/ | Per-corpus curve maps: docs, refs, skills, plus cycle-3-refs |
| papers/data/drift-output/ | Cross-corpus drift detector: Mobius warps anchored on self, plus the cycle-3 to cycle-4 intra-corpus warp, plus the aligned-points and aligned-curves PNGs |
| papers/data/series/<dim>-D/<dim>-D/graphs/fit.png | Per-dim Mollweide/Aitoff curve + scatter, with the top-5 highest-residual items annotated |
| papers/data/drift-output/aligned-curves-from-series-keystone.png | The 5-dim keystone diagram: primitive guide per dim, gate status, top-3 samples |
| papers/data/drift-output/aligned-curves-from-series.png | The 5-dim S2 overlay plot |

## How the renders map to the regime's math

The render tree mirrors the pipeline stages in 03-loop-mechanics.md. Curve maps render the fitted gamma(t) against the projected items, so curve-map-output* is the visual of steps 1 to 4 for each basis dim. The nd-viewer-output is the only render that exposes the raw 14-D NSS axis space (12 NSS axes plus size bucket plus t/residual), which is the gap-map's native space before any sphere projection. The drift-output directory is the only one that renders comparisons rather than single fits: Mobius warps anchored on self align corpora against each other, and the cycle-3 to cycle-4 intra-corpus warp measures within-corpus drift across cycles. The keystone and overlay PNGs are the library-level summaries of 06-time-series-library.md: the keystone diagram annotates gate status per dim, so a reader can see the 24-D fail and the two 1.0000 boundary passes without opening INDEX.json.

## Projection convention

The per-dim fit.png files use Mollweide/Aitoff projections (source doc). Both are equal-area (Mollweide) or near-conformal elliptical (Aitoff-derived Hammer-Aitoff) map projections of the sphere onto an ellipse, a standard cartography choice for visualizing whole-sphere data. The render projection is a presentation choice and is independent of the stereographic lift the math uses (05-math-conventions.md); do not read distances off a fit.png.
