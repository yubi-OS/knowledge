# Knowledge corpus: endpoint-live-audit-harness-plan

**Corpus title:** Live endpoint audit and falsification-harness improvement plan (2026-10-08)

**Ground-source path:** `yubi-OS/yubiOS refs/endpoint-live-audit-harness-plan-2026-10-08.md`

## Overview

This corpus documents the first full live test of every documented route on the steady-orbit worker (53-part bundle, etag f2313fa6 chain), as recorded in `yubi-OS/yubiOS refs/endpoint-live-audit-harness-plan-2026-10-08.md`. The audit parsed 123 unique routes from docs/ENDPOINTS.md, ran 4 live passes through the operator bearer without touching any destructive surface, classified harness coverage across 127 rows (15 Yes, 19 Partial, 93 No, 2 non-classified), logged 8 findings (F1 to F8), ranked 10 load-bearing sections that lack a selftest or falsification harness, and produced a P0 to P3 improvement plan. Note on external grounding: both digs came back with every result below the 0.5 authority line (0 high, 20 low), so every external citation in docs 01 and 02 is labeled weak backing and the load-bearing claims rest on the ground-source doc.

## Documents

| NN | File | Scope (one line) | Clef outline score |
|---|---|---|---|
| 01 | [01-method.md](01-method.md) | Method: detailed analysis grounded in yubi-OS/yubiOS refs/endpoint-live-audit-harness-plan-2026-10-08.md. | 1.7481 |
| 02 | [02-results-by-section.md](02-results-by-section.md) | Results by section: detailed analysis grounded in yubi-OS/yubiOS refs/endpoint-live-audit-harness-plan-2026-10-08.md. | 1.4135 |
| 03 | [03-live-findings.md](03-live-findings.md) | Live findings: detailed analysis grounded in yubi-OS/yubiOS refs/endpoint-live-audit-harness-plan-2026-10-08.md. Internal-record subtopic, no dig. | 1.6869 |
| 04 | [04-load-bearing-sections-without-a-selftest-or-fals.md](04-load-bearing-sections-without-a-selftest-or-fals.md) | Load-bearing sections without a selftest or falsification harness: detailed analysis grounded in yubi-OS/yubiOS refs/endpoint-live-audit-harness-plan-2026-10-08.md. Internal-record subtopic, no dig. | 1.8612 |
| 05 | [05-improvement-plan.md](05-improvement-plan.md) | Improvement plan: detailed analysis grounded in yubi-OS/yubiOS refs/endpoint-live-audit-harness-plan-2026-10-08.md. Internal-record subtopic, no dig. | 1.8807 |
| 06 | [06-what-passed-clean.md](06-what-passed-clean.md) | What passed clean: detailed analysis grounded in yubi-OS/yubiOS refs/endpoint-live-audit-harness-plan-2026-10-08.md. Internal-record subtopic, no dig. | 0.8477 |

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

Minted in the 22-corpus refs/ wave (Lane 4). Branch `mint/endpoint-live-audit-harness-plan-2026-10-21`, target prefix `knowledge/endpoint-live-audit-harness-plan`. Every factual claim traces to the ground-source doc or to a weighted dig result listed in the doc's Sources Considered table.
