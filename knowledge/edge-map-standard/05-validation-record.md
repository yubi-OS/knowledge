# 05. Validation Record

**Scope:** Validation record: detailed analysis grounded in yubi-OS/yubiOS refs/edge-map-standard-2026-10-05.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/edge-map-standard-2026-10-05.md, no external web dig

## Two validations, two different questions

The ground source records two validation passes. They answer different questions and should not be merged.

1. **Trial-2** asks: does standardization move real-photo measurements into a sane, comparable range?
2. **Paintings cross-validation** asks: how does our contour-class D compare to an independent published dataset that used a different measurement regime?

## Trial-2: 18 real photos

- **Input**: 18 real Wikimedia photos across 3 classes.
- **Before** (unstandardized, trial-1): D 1.5 to 1.6.
- **After** (edge-standard-v1, coverage pinned near 6%): D 1.11 to 1.40.
- **In band**: 8 of 18.
- **Saturation**: 2 urban images saturate at threshold 255.

The headline is the range shift, which is the subject of doc 01. The secondary finding is the saturation case. If even t = 255 cannot bring coverage down to the target, the image is too bright or too uniformly inked for the normalization to work. The pipeline records this rather than silently emitting a D: the `under_inked` guard is set in the meta block. Recording the guard on 2 of 18 real photos shows it is not a theoretical edge case.

## Paintings cross-validation: Viengkham and Spehar 2018

- **Input**: 123 paintings from Viengkham and Spehar (2018), each sent through the **live** route (not a local run).
- **Our contour-class D**: span 1.029 to 1.487, mean 1.278.
- **Their reported band means**: 1.154, 1.418, 1.711.
- **Our count in the 1.3 to 1.5 region**: 48 of 123.
- **Our count above 1.5**: 0.

### Reading the comparison

The ground source characterizes our values as "systematically lower and compressed" relative to the published band means, and says this is what the contour-versus-cluster regime difference predicts. The published work measured on a different representation of the image (the doc calls it the cluster regime), while edge-standard-v1 deliberately emits 1-px isolated contours (doc 03). Isolated contours carry less ink and less fill than cluster representations, which pushes box-counting D down and narrows its spread. Zero paintings above 1.5 against a top published band mean of 1.711 is consistent with that compression.

### What could not be tested

The supplementary ordering in the published materials is **not band-ordered**. Without knowing which painting the authors placed in which band, a per-image rank test (does our D order the paintings the same way their D did?) is impossible. The doc records that the authors' data was requested on 2026-10-05.

## Summary table

| Pass | n | Range | Notable |
|---|---|---|---|
| Trial-1 (unstandardized) | 18 | 1.5 to 1.6 | above band, extraction artifact |
| Trial-2 (edge-standard-v1) | 18 | 1.11 to 1.40 | 8/18 in band; 2 under_inked |
| Paintings (live route) | 123 | 1.029 to 1.487, mean 1.278 | 48 in 1.3 to 1.5; 0 above 1.5 |

## What the record supports

- Standardization changes real-photo D by a margin larger than the preference band's width, in the direction of the band.
- The under-inked guard fires on real data and should be honored.
- The live route reproduces a systematic, explainable offset against an external dataset.

## What the record does not support

- It does not show that 8/18 in band is "correct"; the band location on the contour-class scale is still open (doc 06).
- It does not show per-image agreement with the paintings study; that requires the requested data.
- It does not validate the taste axis itself; the instrument doc is explicit that comparability is not admission.

## Practical guidance

When reading an edge-standard-v1 D on a new image:

1. Check `under_inked`; if true, do not read D against the band.
2. Check r2 >= 0.98.
3. Remember the contour-class scale sits lower and tighter than cluster-regime literature values; compare like with like.
