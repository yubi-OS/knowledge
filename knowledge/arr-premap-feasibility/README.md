# Knowledge corpus: arr-premap-feasibility

**Corpus title:** Feasibility check: arrangement response and hierarchy premap (2026-10-16)

**Ground-source path:** `yubi-OS/yubiOS refs/arr-premap-feasibility-2026-10-16.md`

## Overview

This corpus documents the read-only feasibility check recorded in `yubi-OS/yubiOS refs/arr-premap-feasibility-2026-10-16.md` for two candidate lines on the steady-orbit worker: Line A, arrangement-response-v1 (does the box-counting dimension D and the walk exponent d_w respond to affine and optical warps of a droplet arrangement?), and Line B, premap-v1 (identify gasket hierarchy depth from a partial point set). No deploy, KV, or D1 writes were made. The check reproduced the Python source of record, ran the deployed JS unchanged over the pinned matrix, found the D leg implementation-invariant but the walk leg dependent on Delaunay tie-breaking, found the JS renderer throws on fractional centres, and established that only gasket depth 6 yields a valid D reference. The addendum found the deployed Delaunay graph was missing forced edges, which led to the separate adoption record. Both external digs returned only weak-backing results (0 high, 20 low), so every external citation is labeled weak and load-bearing claims rest on the ground-source doc.

## Documents

| NN | File | Scope (one line) | Clef outline score |
|---|---|---|---|
| 01 | [01-0-verdict.md](01-0-verdict.md) | 0. Verdict: detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-feasibility-2026-10-16.md. | 1.8065 |
| 02 | [02-1-what-the-live-surface-offers-read-only.md](02-1-what-the-live-surface-offers-read-only.md) | 1. What the live surface offers (read only): detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-feasibility-2026-10-16.md. | 1.4912 |
| 03 | [03-2-source-of-record-reproduction-python-sandbox.md](03-2-source-of-record-reproduction-python-sandbox.md) | 2. Source-of-record reproduction (Python, sandbox): detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-feasibility-2026-10-16.md. Internal-record subtopic, no dig. | 1.4955 |
| 04 | [04-3-js-port-against-the-source-of-record-node-24-s.md](04-3-js-port-against-the-source-of-record-node-24-s.md) | 3. JS port against the source of record (Node 24, sandbox): detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-feasibility-2026-10-16.md. Internal-record subtopic, no dig. | 1.6361 |
| 05 | [05-4-the-js-renderer-cannot-draw-warped-centers.md](05-4-the-js-renderer-cannot-draw-warped-centers.md) | 4. The JS renderer cannot draw warped centers: detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-feasibility-2026-10-16.md. Internal-record subtopic, no dig. | 1.6469 |
| 06 | [06-5-gasket-depth-ladder-premap-feasibility.md](06-5-gasket-depth-ladder-premap-feasibility.md) | 5. Gasket depth ladder (premap feasibility): detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-feasibility-2026-10-16.md. Internal-record subtopic, no dig. | 1.6548 |

Docs 01 and 02 carry an external searXNG dig (10 Clef-weighted results each, cited inline with their weights). Docs 03 through 06 are internal-record subtopics grounded only in the ground-source doc, with no external web dig.

## Research summary

- 20 results collected (2 digs x 10 results, docs 01 and 02).
- Source-quality weights (clef noul): high >= 0.5: 0; low < 0.5: 20.
- 5 jev requests (5 recorded in meta stats).
- 0 redos.
- 0 skips.
- Weighting rule: a cited source with clef weight >= 0.5 counts as authoritative backing; any source below 0.5 is labeled weak backing at the point of citation.

## Preflight

Preflight 2026-10-21: searXNG 59 results healthy; /api/decide (clef) 200

## Provenance

Minted in the 22-corpus refs/ wave (Lane 4). Branch `mint/arr-premap-feasibility-2026-10-21`, target prefix `knowledge/arr-premap-feasibility`. Every factual claim traces to the ground-source doc or to a weighted dig result listed in the doc's Sources Considered table.
