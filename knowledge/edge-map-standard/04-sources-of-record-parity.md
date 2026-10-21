# 04. Sources of Record and Parity

**Scope:** Sources of record + parity: detailed analysis grounded in yubi-OS/yubiOS refs/edge-map-standard-2026-10-05.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/edge-map-standard-2026-10-05.md, no external web dig

## Two implementations, one contract

The ground source names two implementations and treats one of them as authoritative.

### Python source of record

- File: `edge_standard.py`.
- Stdlib-only (no third-party dependencies).
- Validated 34/34 checks.
- Canonical instance: `session/taste/build-edge/`.

Being stdlib-only matters for reproducibility: there is no numerical library version that can drift underneath the measurement.

### JS worker port

- Module part `jev-edge-standard.js` on the steady-orbit worker.
- Imports `boxCountingDim` from `jev-taste-math.js`, so the counting step is shared with the taste engine's other D measurements rather than re-implemented.

## The fixture pack

`edge_fixtures.json` holds 4 synthetic raw-gray fixtures, each with expected outputs generated from the Python source:

| Fixture | What it tests |
|---|---|
| `f1_disk` | baseline shape |
| `f2_disk_dim` | the normalization property: the same shape at a different gray level |
| `f3_sierpinski_leaves` | a fractal target, expected D 1.5926 |
| `f4_two_level` | a two-gray-level image |

The `f1_disk` / `f2_disk_dim` pair is the most important test of the threshold step. Because threshold selection targets coverage rather than an absolute gray value, the same shape rendered at different gray levels must produce an **identical traced grid** and an **identical D**. If the pipeline used a fixed threshold, the dimmer disk could fall under it and vanish or shrink.

## Parity results

The ground source reports parity against the live worker:

- threshold: exact;
- coverage: exact;
- traced pixel count: exact;
- grid SHA: exact;
- max |dD|: 4.4e-16.

All 4 fixtures parity-PASS. A max |dD| of 4.4e-16 is at the level of floating-point rounding, which is what one expects when both sides perform the same regression on the same grid. Grid SHA equality is the stronger result: it means the trace, including the canonical Moore start, backtrack, and stop rule, produced byte-identical output across languages.

## The live route

```
POST /api/jev/corpus/taste/edge-standard
{gray_b64, width, height}      (or bitmap passthrough)
```

Response: the standardized bitmap, fractal and symmetry features, and a run row of kind `edge-standard`.

Deploy reference recorded in the ground source: etag `26e837ed`, 43 parts.

The bitmap passthrough lets a caller who already holds a binary map skip extraction and go straight to measurement, while the gray path runs the full six-step contract.

## Why "source of record" is a direction, not a tie

The ground source names the Python file as the source of record and generates fixture expectations from it. Parity is checked by running the JS port against those expectations. The direction matters: when they disagree, the reference is Python. This matches the house rule stated elsewhere in the wave (the spectral SPEC says "on mismatch the JavaScript is wrong until proven otherwise"), and it keeps the measurement anchored to the implementation with no runtime dependencies.

## What parity does and does not prove

Parity proves the worker computes the same thing as the reference on the fixture set. It does not prove the reference is correct about the world; that is the job of the validation record (doc 05). It also covers only the 4 fixtures: f3's expected D of 1.5926 is a regression anchor, not a theoretical value (the doc does not claim it equals ln3/ln2).

## Operational checklist derived from this section

1. Change the contract in `edge_standard.py` first.
2. Regenerate `edge_fixtures.json` from Python.
3. Port to `jev-edge-standard.js`.
4. Deploy and run all 4 fixtures through the live route.
5. Require exact threshold, coverage, traced count, grid SHA, and |dD| at rounding level.
6. If a critical parameter changed, bump the major version.
