# INTEGRATION: arrangement-response-v1 (Line A) and premap-v1 (Line B)

Knowledge corpus `arr-premap-integration`, minted in wave 22 of the `refs/` mint (Lane 5).

**Ground source:** `yubi-OS/yubiOS refs/arr-premap-integration-2026-10-16.md`

This corpus explicates the 2026-10-16 integration record written by the advisor (integration lane) for the two session-only build lines: arrangement-response-v1 (Line A) and premap-v1 (Line B). The record consolidates three private raster copies into one shared module, verifies raster parity between Python and JS on 7 sets, documents a Delaunay defect in the deployed `bowyerWatsonDelaunay` (8 forced edges missed on the clean 366-droplet gasket), reports one frozen premap harness run (P1 45/45, P1n 20/20, P2 45/45, P3 15/15), and lists seven open decisions for Jenny. Verdicts: Line A GO for the D leg, pixel arm, raster and route, HOLD for the walk leg; Line B PASS for the identity-frame gold MVP. Nothing was deployed; the build was offline (Node 24.20.0, Python 3.14.7).

## Documents

| NN | File | Scope | Clef outline score |
|---|---|---|---|
| 01 | `01-0-what-is-where.md` | 0. What is where (dig-backed) | 1.3771 |
| 02 | `02-1-verdict-per-line-against-the-spec-success-crit.md` | 1. Verdict per line against the SPEC success criteria (SPEC section 7) (dig-backed) | 1.7453 |
| 03 | `03-2-shared-helper-consolidation-t2.md` | 2. Shared helper consolidation (T2) (internal record) | 1.3628 |
| 04 | `04-3-walk-leg-and-the-delaunay-defect-t6-t7-t8-t9.md` | 3. Walk leg and the Delaunay defect (T6, T7, T8, T9) (internal record) | 1.4864 |
| 05 | `05-4-harness-results-t5-one-frozen-run.md` | 4. Harness results (T5, one frozen run) (internal record) | 1.0812 |
| 06 | `06-5-premap-route-and-selftest-wiring-t4.md` | 5. Premap route and selftest wiring (T4) (internal record) | 1.3883 |

Outline scores come from `research-db/outline.json` (`validation.answers.t01..t06.score`), a clef `score` decision over three lowest-first levels (padding, marginal, load-bearing). No subtopic was dropped.

## Research summary

- Results collected: **20** (2 searXNG queries for doc 01, 2 for doc 02, 10 kept per doc)
- Clef quality weights: **1 high (>= 0.5)**, **19 low (< 0.5)**
- jev requests: **5**
- Redos: **0**
- Skips: **0**
- Docs 03 to 06 are internal-record subtopics: they explicate the ground source directly and carry no external web dig.
- Every dig citation in docs 01 and 02 carries its exact clef weight; any source under 0.5 is labelled weak backing. Load-bearing technical claims rest on the ground source, not on the dig.

## Conventions

- Docs are numbered in outline order (`01` to `06`); filenames match `meta.json` subtopic slugs exactly.
- Docs 01 and 02 end with a `## Sources Considered` table listing all 10 dig results and their clef weights.
- House style: no em dashes, numbers as digits, headings for wayfinding.

## Preflight

Preflight 2026-10-21: searXNG 59 results healthy; /api/decide (clef) 200
