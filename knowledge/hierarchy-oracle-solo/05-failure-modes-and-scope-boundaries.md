# 05. Failure Modes and Scope Boundaries

**Scope:** Documented failure modes, negative results, and explicit non-claims. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/hierarchy-oracle-solo-2026-10-06.md, no external web dig

## Scope of this doc

The meta scope for this subtopic is "documented failure modes, negative results, and explicit non-claims". The solo log does not have a section with that title. This doc collects every failure mode, negative result, and non-claim the solo log actually records, and marks clearly where the source is silent.

## Failure modes the record documents

### F1: averaging away log-periodic structure

Recorded in the finalist stress-test. A global counting-exponent fit over a pinned window averages away the Fukushima-Shima log-periodic modulation.

- **Mitigation recorded**: wiggle as a pre-registered secondary gate (presence only) plus storage of the full series in the run row.
- **Residual risk**: two structures with equal exponents and different modulation patterns that both show "presence" would still not be distinguished by the gate alone. The stored series is what preserves the ability to tell them apart later.

### F2: low-confidence fits

Recorded in the employment record. The tri fixture read D 1.2849 at r2 0.969, below the 0.98 gate. The `low_confidence` gate **correctly excluded** it.

- This is a failure mode of fitting (some shapes do not produce clean power laws on the pinned lattice), and the record shows the guard handling it.

### F3: symmetry-calibration hazard

Recorded as one of the 3 evolution records (sweep `es_5b05b9549851c3c4`). The companion one-pager gives the mechanism: `mirrorSymmetryScore` is pixel-exact, and centering a render on (256, 256) instead of the 255.5 mirror axis collapses symmetry reads from 1.0 to about 0.31.

- **Consequence**: any symmetry-band claim requires centering discipline. Symmetry reads on renders whose centering is unknown are suspect.

## Negative results

### N1: the 6-fold is not hierarchical

The 6-fold ring read D 0.9127 with fractal_band OFF (p 0.0291). The operator's seed asked about diagonal-diffusion efficiency and the 6-fold; the measured answer separates the 6-fold (ordered, spectrally compressible) from the gasket (hierarchical). The one-pager adds that the transport-efficiency reading is refutable because symmetry degeneracies slow mixing.

### N2: the MVP losers

The MVP choice distribution is a set of negative results for the losing options: V3 0.0072, V4 0.0130, V5 0.0031, V2 0.0884, V1 alone 0.2024. In particular, V5 (multimodal intake triage) scored lowest on testability (0.5968) of all variations.

## Explicit non-claims

The solo log makes or implies these non-claims:

1. **Weights are not self-scores.** The log states every weight is a live clef reading.
2. **V3 is not rejected on merit.** The note says "strongest as follow-on actuation, not MVP".
3. **V4 is not the oracle.** The note says "consumer of the oracle, not the oracle".
4. **V5 adds no measurement.** The note says its measurement core is identical to V1/V2.
5. **No untestable bets.** The stress-test asserts the gold corpus is exact math.

## Where the source is silent

The solo log does **not** record:

- a quantified error budget for the counting exponent;
- results of running the spectral instrument (it did not yet exist at ideation time);
- failure modes of graph construction for non-image feature spaces;
- any measurement of the multimodal intake path.

These gaps are stated here so that downstream readers do not attribute claims to the solo log that it does not make. The later SPEC and hierarchy-router build record cover some of them (for example, the router record documents that degenerate 8x8 stub images fail clef inference with error 3043).

## Scope boundaries

| In scope for the solo run | Out of scope |
|---|---|
| generating and weighting 6 variations | building any instrument |
| live readings from taste matrix | spectral measurements |
| choosing an MVP | deploying routes |
| logging learnings to evolution | admitting a taste axis |
