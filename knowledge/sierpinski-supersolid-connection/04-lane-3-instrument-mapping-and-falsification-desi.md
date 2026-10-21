# 04. Lane 3: Instrument mapping and falsification design

**Scope:** Lane 3: Instrument mapping and falsification design: detailed analysis grounded in yubi-OS/yubiOS refs/sierpinski-supersolid-connection-2026-10-06.md.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/sierpinski-supersolid-connection-2026-10-06.md, no external web dig

## The instrument being mapped

Lane 3 maps edge-standard-v1, the Sierpinski-anchored box-counting instrument at `POST /api/jev/corpus/taste/edge-standard` on the steady-orbit worker, onto supersolid morphology. Its sources were the taste-engine skill contract and two knowledge-corpus docs (`natural-taste-engine/08-edge-standard-and-photo-limits.md` and `01-fractal-dimension-preference-bands.md`). The selftest Sierpinski fixture reads D 1.5926 on a purpose-built window-filling gasket.

## Finding 1: contours, not interiors

The pipeline measures 1-px contours. Inside the pinned 4 to 64 px window there are three regimes:

- **Thin-curve:** box size s smaller than droplet diameter, local D about 1.0.
- **Plateau:** each droplet roughly one box, D contribution toward 0.
- **Saturation:** s at or above droplet spacing, D toward 0.

The naive hazard "D toward 2 inside droplets" is structurally absent. It is reachable only if the threshold grabs texture or components merge, so the source pins a minimum gap of at least 8 px.

## Finding 2: the predicted class-separability negative

With identical droplet size distributions, the source predicted that a periodic triangular lattice and a disorder-shuffled field would be near-degenerate in whole-window D (about 1.0 to 1.3). D would separate the Sierpinski hierarchy from both, but not periodic from disordered. The proposed discriminators for that pair were the slope-break scale s* (sharp at s near spacing for the lattice, smeared over 40 to 100 px for disorder) and the engine's `symmetry_present` feature.

## Finding 3: generator design and the falsification gate

The original Sierpinski generator design: droplet diameters 32, 16, 8 px (3 gasket levels, 39 droplets), a 640 by 640 canvas, ink about 5.8%, with at least 5 of 8 window scales in the self-similar band. The gate: **local two-octave slope over s about 16 to 64 equal to 1.585 plus or minus 0.05, with r-squared at least 0.98**. Whole-window regression was predicted at about 1.45 to 1.60. All bands were labeled analytic estimates until measured.

## Finding 4: real-figure resolution risk

Typical in-situ panels are 240 to 470 px wide, with inter-droplet spacing a of about 40 to 80 px. Box sizes 4 to 6 read JPEG and raster artifacts, and s at or above a enters saturation. Mitigations in order: crop to the crystal; extract native arXiv rasters; upscale at most 2x; keep ink polarity consistent; exclude on `under_inked` or `low_confidence` flags. The 4 to 64 window is never changed (that would be a major version bump). Real-figure claims are restricted to panels with a of at least about 40 px.

## Finding 5: what a supersolid_order axis would need

A psi6 bond-orientational order extractor over traced-component centroids, slope-break s* as a second feature, a clef question carrying both numbers with decimals, 0.45/0.55 hysteresis, and admission only through the rayleigh-pattern multi-class trial recorded in refs/.

## What happened when the design was measured (Addendum 5)

**v1 failed.** The v1 gasket (L=320, 4 vertex depths, size-graded droplets r=20/10/5/3) read whole-window D 0.9478 and local slope 1.1149 over 13 to 64. Advisor review confirmed a design error with the instrument exonerated: graded sizes put each level's contour-to-point transition inside the window (at s = 40/20/10/6), and the hierarchy supplied only about 1.5 octaves.

**Amendments were logged before v2.** The gate window was re-expressed as {13, 20, 29, 43, 64} (2.30 octaves) because "16 to 64" is ill-posed on the pinned scale set, keeping center 1.585 plus or minus 0.05 and r-squared at least 0.98. L-convergence calibration became required. Whole-window D was demoted to diagnostic. A component-count assertion of 366 and a non-empty-mask assertion were added; the latter records a new hazard: a binary render above about 12% ink is silently thresholded to an empty set by the argmin rule.

**v2 passed.** Uniform r=3, 6 depths, 366 droplets. r=2 was rejected empirically because an isolated 4 px disk traces 0 boundary pixels (dropped by MIN_COMPONENT=12), while r=3 traces 16. At L=384 the gate slope was **1.5968** with r-squared 0.999 (PASS). At L=256 it was 1.4858, so the slope drifts with L by 0.111; the render bias was negative at L=256 (minus 0.099) and about zero at L=384 (plus 0.012). The advisor's model predicted plus 0.1 to plus 0.35, wrong in sign, recorded as such.

**The predicted negative did not hold, then was explained.** tri read 1.2636 and shuffle 1.030 to 1.046, a gap of about 0.23. Addendum 7's matched-extent control showed the gap was extent, not order (jitter mean 1.2609, a difference of 0.0027).

**Live-route parity.** All 4 classes matched local results within 4.5e-5.
