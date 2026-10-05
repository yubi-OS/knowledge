# edge-map-standardization

Corpus minted 2026-10-05 (knowledge-corpus-mint, clef-weighted). Topic: **standardized edge-map pipelines for image-derived fractal-dimension measurement** — the grounding corpus for the steady-orbit taste engine's `fractal_band` admission work after the 2026-10-05 real-photo trial found measured D to be edge-pipeline-dependent.

## Docs

| # | doc | scope |
|---|---|---|
| 01 | [01-edge-detection-operators.md](01-edge-detection-operators.md) | Deterministic edge/contour operators (Sobel, Canny, Marr-Hildreth), their parameter surfaces, and what each does to measured structure |
| 02 | [02-edge-density-and-box-counting.md](02-edge-density-and-box-counting.md) | How edge-map ink density and stroke width bias box-counting D estimates, with the crossover mechanism |
| 03 | [03-contour-statistics-vs-texture-edges.md](03-contour-statistics-vs-texture-edges.md) | Isolated contour statistics (the empirical-aesthetics stimuli tradition) vs dense photo texture edge maps — why the same photo measures two different D values |
| 04 | [04-box-counting-estimation-standards.md](04-box-counting-estimation-standards.md) | Box-counting standards: scale windows, regression practice, grid placement, resolution floors, documented variance |
| 05 | [05-image-normalization-for-measurement.md](05-image-normalization-for-measurement.md) | Deterministic pre-processing for measurement: resize policy, grayscale formula, normalization, binarization |
| 06 | [06-ibsi-image-biomarker-standardization.md](06-ibsi-image-biomarker-standardization.md) | IBSI as the reference model: pinned chains, digital phantoms, cross-implementation parity — the mechanism to borrow |
| 07 | [07-real-photo-aesthetic-measurement.md](07-real-photo-aesthetic-measurement.md) | What stimulus pipelines the fractal-preference studies actually used, and what transfers from synthetic to real images |

## Research summary

- The preference-relevant D (Spehar/Hagerhall band 1.3-1.5) was established on **isolated contours and curated stimuli**, not dense photo edge maps. A dense edge map of a full photograph is a different measured set and yields systematically different (higher) D.
- Box-counting estimates are conditional on the edge-extraction stage; comparability is won or lost at extraction, not counting. Ink density and stroke width are inputs to the estimate.
- Standardization mechanism (IBSI pattern): pin the full preprocessing chain, ship fixture images with expected values, require cross-implementation parity.

## Research DB

`research-db/` carries the typed provenance: preflight, outline (with the full clef score validation), archive.json (138 results, every one clef-weighted, 30 strong >= 0.5), per-doc digs with redo logs, jev-log (every decide request + usage), and db.ts interfaces.
