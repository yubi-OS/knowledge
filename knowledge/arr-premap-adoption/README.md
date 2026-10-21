# Knowledge corpus: arr-premap-adoption

**Corpus title:** Adoption record: exact-predicate Delaunay for the steady-orbit walk graph (2026-10-16)

**Ground-source path:** `yubi-OS/yubiOS refs/arr-premap-adoption-2026-10-16.md`

## Overview

This corpus documents the 2026-10-16 adoption of an exact-predicate Delaunay triangulation (exact integer predicates, Simulation of Simplicity tie-break, 4 dp rounding) as the canonical graph behind every walk-leg consumer on the steady-orbit worker, as recorded in `yubi-OS/yubiOS refs/arr-premap-adoption-2026-10-16.md`. Jenny's decision was to adopt, deploy, and merge PR #319 first (squash db404b6e). The deploy (etag eb486246..., 61 modules) replaced the Bowyer-Watson body, regenerated the c2 spectral fixtures, verified live after the 25 second stale window (9/9 spectral selftest, gasket walk d_w 2.765024 to 2.897099, edges 1031 to 1039), shifted oracle d_w on five gold renders with D unchanged, re-routed the gasket through hierarchy-image, and left 6 open items. Both external digs returned only weak-backing results (0 high, 20 low), so every external citation is labeled weak and the load-bearing claims rest on the ground-source doc.

## Documents

| NN | File | Scope (one line) | Clef outline score |
|---|---|---|---|
| 01 | [01-what-shipped.md](01-what-shipped.md) | What shipped: detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-adoption-2026-10-16.md. | 1.6703 |
| 02 | [02-verification-live-after-the-25-second-stale-wind.md](02-verification-live-after-the-25-second-stale-wind.md) | Verification (live, after the 25 second stale window): detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-adoption-2026-10-16.md. | 1.5381 |
| 03 | [03-what-changed-for-consumers.md](03-what-changed-for-consumers.md) | What changed for consumers: detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-adoption-2026-10-16.md. Internal-record subtopic, no dig. | 1.6348 |
| 04 | [04-open-items-not-done-in-this-deploy.md](04-open-items-not-done-in-this-deploy.md) | Open items (not done in this deploy): detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-adoption-2026-10-16.md. Internal-record subtopic, no dig. | 0.9574 |
| 05 | [05-provenance.md](05-provenance.md) | Provenance: detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-adoption-2026-10-16.md. Internal-record subtopic, no dig. | 0.8604 |
| 06 | [06-integration-and-operational-governance.md](06-integration-and-operational-governance.md) | Integration with yubiOS and Steady Orbit /jev/ endpoints, policy versioning, and audit trail. Internal-record subtopic, no dig. | 1.7404 |

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

Minted in the 22-corpus refs/ wave (Lane 4). Branch `mint/arr-premap-adoption-2026-10-21`, target prefix `knowledge/arr-premap-adoption`. Every factual claim traces to the ground-source doc or to a weighted dig result listed in the doc's Sources Considered table.
