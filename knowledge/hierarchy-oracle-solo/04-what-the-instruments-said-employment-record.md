# 04. What the Instruments Said: The Employment Record

**Scope:** What the instruments said (employment record): detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-oracle-solo-2026-10-06.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/hierarchy-oracle-solo-2026-10-06.md, no external web dig

## What "employment record" means

The solo log closes with a section titled "What the instruments said (employment record)". It lists every live instrument the run actually called, with identifiers, so the ideation is traceable to concrete runs rather than to narrative. Four instruments were employed.

## 1. /api/decide (clef)

- **16 questions in one batched request.**
- These produced all the weights in the generation log (doc 02): 6 variations x 2 questions (advance, testable) = 12, plus 3 lane verdicts (noul) = 15, plus 1 MVP choice question = 16.

Batching all 16 into one request matters for consistency: every judgment was made in the same call, under the same policy (v6), with the same model state, so the scores are directly comparable.

## 2. Taste engine (live /taste/matrix)

Three fixtures were measured live:

| Fixture | D | r2 | fractal_band | symmetry_present | symmetry_variation | Run id |
|---|---|---|---|---|---|---|
| tri | 1.2849 | 0.969 | excluded (low_confidence) | ON | OFF | cr_c004215fd6a18141 |
| gasket | 1.4975 | (not stated) | ON (p 0.9246) | ON | OFF | cr_7c29fd78bd53aece |
| 6-fold ring | 0.9127 | (not stated) | OFF (p 0.0291) | ON | OFF | cr_2c76d0c9f1613f0d |

The log's ordering of run ids follows the listing order (tri, gasket, 6-fold ring); the source lists the three ids together after the readings, so the per-row mapping above follows that order.

### What these readings show

- **tri**: r2 0.969 is below the 0.98 gate, so the `low_confidence` gate **correctly excluded** it from a fractal_band verdict. This is the gate working as designed, not a failure.
- **gasket**: D 1.4975, fractal_band ON at p 0.9246. Hierarchical.
- **6-fold ring**: D 0.9127, fractal_band OFF at p 0.0291. Ordered but not hierarchical.
- All three read symmetry_present ON and symmetry_variation OFF, so symmetry alone does not separate them; D does.

The companion one-pager states the same separation: the 6-fold is spectrally compressible, the gasket is hierarchically ordered, and the instrument separates them by measured D.

## 3. Point-map

- **Map id 570**, d = 9, seed 20260906.
- Contents: all 6 variants plus 4 exemplars.

The point-map places the variations in a shared 9-dimensional space alongside reference exemplars, giving a geometric record of how the ideas relate.

## 4. Evolution

- **Sweep** `es_5b05b9549851c3c4` (fire 610061).
- **3 records**:
  1. the MVP learning (V1_plus_V6);
  2. the symmetry-calibration hazard;
  3. the 6-fold measured verdict.

The symmetry-calibration hazard is the half-pixel centering finding recorded in the one-pager: centering a render on integer (256, 256) instead of the mirror axis at 255.5 collapses symmetry reads from 1.0 to about 0.31. Logging it as an evolution record makes it durable across sessions.

## Why the record matters

| Claim in the solo log | Backed by |
|---|---|
| variation weights, MVP choice | /api/decide batched request (16 q) |
| gasket hierarchical, 6-fold not | taste matrix runs (3 ids) |
| variations relate in feature space | point-map 570 |
| learnings persisted | evolution sweep es_5b05b9549851c3c4 |

Without this section, the generation log would be a table of numbers with no provenance. With it, each number can be traced to a stored run.

## A note on internal consistency

The taste-matrix gasket D (1.4975) differs from the gold gasket fixtures in the hierarchy-router calibration (1.5589 and 1.5967 at L384 and L256). These are different renders at different sizes, and the solo log's gasket reading came from the taste matrix fixture set. The difference is not a contradiction, but it is a reminder that "the gasket" in these records is always a specific render with a specific D.
