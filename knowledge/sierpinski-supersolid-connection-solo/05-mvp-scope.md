# 05. MVP Scope

**Scope:** MVP Scope: detailed analysis grounded in yubi-OS/yubiOS refs/sierpinski-supersolid-connection-solo-2026-10-06.md.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/sierpinski-supersolid-connection-solo-2026-10-06.md, no external web dig

## The MVP in three deliverables

The source defines the MVP as 3 numbered items.

### Deliverable 1: synthetic falsification corpus

- **3 morphology generators**: triangular lattice, Sierpinski-gasket droplet hierarchy, shuffled droplets.
- **N seeds each**, run through edge-standard.
- **Publish expected-D bands.**
- **Gate**: the instrument separates the classes, with the Sierpinski generator hitting the theoretical band.

This deliverable establishes, under full control, what D reads for each morphology. Its pass condition is two-part: separation and a known-answer hit. A corpus that separates classes but reads the gasket at, say, 1.3 fails, because the calibration anchor is wrong.

### Deliverable 2: public-imagery pass

- **10 to 20 published supersolid paper figures**, phase-labeled by the papers themselves.
- Run through the same pipeline.
- Report **D distributions per class**, with honest regime notes.

The source flags one note in particular: "contour-class D vs cluster-class D applies here too." The pipeline measures traced contours, and how a figure's droplets trace (as outlines or as filled clusters) changes what D means.

### Deliverable 3: the record

- A **refs/ doc** with pre-registered expectations.
- **Per-image run ids**: edge-standard run rows are already the audit trail.
- An **admission recommendation** for a `supersolid_order` axis, **only if** the rayleigh-pattern trial supports it.

## What the MVP excludes by construction

The MVP touches no pinned parameter, writes no theory, requests no private data, and flips no taste axis. Those are the four Not Doing items, and they keep the MVP to measurement plus record.

## Pass and fail outcomes

The source treats both outcomes as deliverables:

- **D separates classes.** edge-standard becomes a cheap preprocessing order parameter for modulated-matter imagery, and the visco-combination follow-on activates.
- **D does not separate classes.** An instrument-negative enters the fractalrabbit ledger, and the instrument's cross-source comparability claim gets its first adversarial test outside aesthetics.

## Sizing

The source's numbers are deliberately small: 3 generators, N seeds, 10 to 20 figures. The scope class is medium. The MVP is designed to be "testable this week on public data with zero new theory."

## How the MVP actually played out

The companion record (yubi-OS/yubiOS refs/sierpinski-supersolid-connection-2026-10-06.md) shows how each deliverable fared.

**Deliverable 1** ran through two design iterations. v1 failed the gasket gate (local slope 1.1149) because of a generator design error, confirmed by advisor review with the instrument exonerated. Amendments were logged before v2, including a gate window re-expressed as {13, 20, 29, 43, 64} and an L-convergence requirement. v2 (uniform r=3, 6 depths, 366 droplets) passed at L=384 with slope 1.5968 and r-squared 0.999. Live-route parity matched within 4.5e-5.

**Deliverable 2** was smaller than planned. The Trypogeorgos data was 1D, so the 2D pass used 8 Norcia Fig. 2b panels. D climbed from about 0.98 to 1.06 (linear chain) to about 1.16 to 1.37 (2D zig-zag), with no panel near the Sierpinski band.

**Deliverable 3** produced the refs/ record with addenda and run ids. The admission recommendation came out negative: after the matched-extent control, the `supersolid_order` axis was REFUTED as designed, because D reads hierarchy and fill but not order at matched extent.

## Lesson for MVP design

The three-deliverable structure worked as intended: the synthetic corpus caught a confound (extent) that the real-data trend alone would have hidden, and the record carried the negative.
