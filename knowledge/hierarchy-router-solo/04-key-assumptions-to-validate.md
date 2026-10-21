# 04. Key Assumptions to Validate

**Scope:** Key Assumptions to Validate: detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-router-solo-2026-10-06.md.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/hierarchy-router-solo-2026-10-06.md, no external web dig

## Three assumptions, each with a test

The source lists exactly three unchecked assumptions under "Key Assumptions to Validate." Each is written as a checkbox, which in this program means it is a gate the MVP must clear, not a belief.

### Assumption 1: band classification is stable

Stated in full: same artifact, same band, across re-measurement. The source immediately reduces it: because the detector is deterministic, this "reduces to the hysteresis question at band edges."

What that means operationally:

- **Away from edges** stability is automatic. edge-standard-v1 is a pinned pipeline (ink normalization, Moore-traced contours, a fixed box-counting window), so identical input bytes give identical D.
- **At edges** two artifacts that differ only by trivial perturbations could land on opposite sides of a boundary. The jitter test named in the Recommended Direction exists to measure exactly this.
- **The design lever** is hysteresis: a dead band around each edge in which the previous classification is retained or the artifact is flagged rather than routed. The source does not specify the hysteresis width for routing bands; it identifies hysteresis as the question to answer.

The test is cheap: re-measure each gold artifact, perturb it, and confirm the band does not flip except inside a documented edge zone.

### Assumption 2: the bands separate the lanes' intended workloads

This is the substantive one. A band table can be perfectly stable and still useless if the bands do not correspond to different kinds of work. The source requires a calibration sweep on synthetic AND real artifacts BEFORE any live routing.

Why synthetic first: the falsification generators produce artifacts with known structure. Grounding from the detector's claim set tells us what separation to expect: hierarchical structure (the gasket) reads 1.585 to 1.60, and every non-hierarchical morphology measured reads at or below 1.37. That is a gap of more than 0.2 in D, a natural first band boundary.

Why real second: synthetic separation does not prove that real intake artifacts fall into the intended bands. The detector also reads area-filling, so real artifacts of different fill can spread across a band even if their class is the same. A sweep on real artifacts tells you whether the intended workloads cluster.

The important honesty constraint inherited from the claim set: a band labelled "ordered" versus "disordered" at matched extent would be routing on a refuted claim. Any band design must be expressible in terms of hierarchy and fill.

### Assumption 3: routing through the gate adds negligible latency

The source estimates the added cost as "~1 measurement + 1 gate pass, both already sub-second." This assumption matters because the alternative to gating is a direct dispatch, and a slow gate would create pressure to bypass it.

The test: time the full `POST /api/jev/route` loop on the gold corpus and record measurement time and gate time separately in the run rows.

## Why the list is short

Three assumptions is a deliberately small set. The source's stress-test says there is no un-testable bet, because the whole MVP loop is testable end-to-end with synthetic artifacts. The assumptions that remain are the ones that could make the regime useless (no separation), fragile (unstable bands), or bypassed (too slow).

## What is NOT assumed

- That D reads order. The claim set says it does not at matched extent, so no assumption is built on it.
- That bands will need to adapt. The Not Doing list rules out learning or adaptive band adjustment.
- That new models are needed. The lanes are the existing 3-tier Llama runtime and automations.

## Validation order

1. Determinism and jitter on synthetic gold artifacts (assumption 1).
2. 21-point calibration sweep, synthetic then real (assumption 2).
3. Latency on the end-to-end loop (assumption 3).
4. Record all three in refs/ before any live routing.
