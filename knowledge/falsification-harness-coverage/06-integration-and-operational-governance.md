# 06. Integration and operational governance

**Scope:** Integration with yubiOS and Steady Orbit /jev/ endpoints, policy versioning, and audit trail. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/falsification-harness-coverage-2026-10-06.md, no external web dig

## Where this record sits

The ground source is a companion to the Harness column of `docs/ENDPOINTS.md` (refresh 2026-10-06). ENDPOINTS.md is the per-endpoint inventory; this record explains the column's values and prescribes how to change them. The endpoint surface is the steady-orbit Cloudflare worker, scoped to the 51-part bundle, with the etag chain running through the corrected-hierarchy round. Any change to an endpoint's harness status should update both documents together.

## Integration points with the Steady Orbit /jev/ surface

The harness designs plug into existing worker routes rather than introducing new infrastructure:

- **Selftest routes.** `GET /spectral/selftest` and `GET /lens/selftest` are where Tier 1 anchors run today. The visco record recommends wiring the 843-case snapback corpus plus hysteresis gates H0 and H1 into `/api/jev/corpus/selftest` the same way, turning one-off round evidence into committed regression anchors.
- **Corpus routes.** `/api/jev/corpus/audit`, `/scorer/score`, `/visco/*`, `/taste/*`, and `/classify` are the Tier 2 targets. Each harness exercises the live route, not a local reimplementation, which is what makes live-route parity meaningful.
- **Routing and decision routes.** `POST /api/jev/route` (band selection plus gate outcome) and `POST /api/decide` (the clef decision model) are governed surfaces: their outputs drive dispatch, approval, and blocking decisions, so their harnesses double as governance controls.
- **Map routes.** `/api/map/control` and the matched-null routes are already the falsification layer for the wayfinder; the planted-placement corpus extends that layer to the statistical question the Lean bounds leave open.

## Sources of record and parity

Every harness names a source of record that the worker port must match:

| Instrument | Source of record named in the source |
|---|---|
| Audit level floor | `papers/data/lean/verify_claims.py` CLAIM_8, the +15.6 dBc floor |
| Scorer | `session/r15/scorer_v2.py` (byte-exact parity) |
| Visco math | `jev-visco-math.js` fixture anchors; `knowledge/linear-viscoelasticity/` |
| Edge standard | `knowledge/edge-map-standardization/` |
| Map placement | `WayfinderBounds.lean` (integer layer) |
| Classify | `tools/tautology-discerner` held-out and negative-control selftests |

Parity runs answer "does the port match the reference"; the gold corpus answers "is the reference measuring what it claims". Governance requires both.

## Policy versioning

The decide battery (Tier 2 item 12) is the clearest governance hook. Decision-model changes are already logged: `policy_version` changes land in `jev_policy_changelog`. The source proposes running a fixed battery after every model or threshold change and feeding the results into the WLF policy-shift study. That converts each policy version bump into a measured before and after: agreement above a floor and calibration error within a band. The motivating numbers are recorded in the source: the clef migration moved 21.6% of raw probabilities, and the 0.55 threshold came from a 50-doc sample.

## Audit trail requirements

The operating procedure in the source doubles as an audit-trail specification. Each harness build leaves:

1. **A pre-registration record** dated before any measurement, with pinned parameters, predicted bands, and gate definitions.
2. **An amendments log** where every change is dated, justified a priori, and made before the first clean run.
3. **A gold corpus** with seeds and expected values pinned, so a reviewer can regenerate it.
4. **An anchors record** in machine-readable form (the `anchors.json` pattern from the spectral, lens, and edge standards).
5. **Parity evidence** showing the live route and the source of record agree.
6. **A results record** per gate, failing loud.

The companion visco round followed this shape exactly (`preregistration.md`, `amendments.md`, `probes.json`, corpus and results JSONs) and explicitly did not push anything to a repo, leaving the record for orchestrator review. That separation, where lanes produce evidence and the orchestrator lands it, is part of the governance model.

## Change management for the coverage map

- **Promotion.** An endpoint moves from Tier 2 to Tier 1 only when all six harness components exist and its gates pass. Partial harnesses stay Tier 2 with a note.
- **Re-classification.** A Tier 3 route that grows a measurement re-enters Tier 2 with its own design; a Tier 2 route whose measurement is removed drops to Tier 3.
- **Bundle drift.** When the worker bundle advances past 51 parts, new parts must be classified before the Harness column is considered current.
- **Provisional verdicts.** Per the refs3 lesson, any negative verdict issued by an endpoint without a harness is provisional and should be re-run once the harness lands.
