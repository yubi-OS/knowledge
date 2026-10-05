# three-year-revenue-cost-model

Knowledge corpus minted 2026-10-05 from yubi-OS/yubiOS `refs/three-year-revenue-cost-model-2026-07-25.md`. Topic: three-year revenue and cost model frameworks for an early-stage infrastructure venture, the structural skeleton (cost drivers, revenue lines, growth assumptions) built so numbers stay unfilled until evidence exists.

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | assumption-taxonomy | Which assumption categories (pricing, conversion, volume, unit cost, fixed costs, funding) must exist as explicit unfilled inputs before any number is asserted |
| 02 | revenue-line-structure | Revenue(year) as sum over offers of customers_won x price x volume_per_customer; how an offer catalog maps to revenue lines |
| 03 | cost-driver-taxonomy | Variable unit costs per offer versus fixed costs; front-loaded cost treatment |
| 04 | readiness-gated-growth | Revenue availability tied to readiness gates and pilot completion, not calendar quarters; event-triggered costs |
| 05 | sensitivity-structure | Downside/base/upside scenario architecture per driver, before numbers exist |
| 06 | stop-rules-runway | Per-offer kill thresholds, pricing redesign triggers, runway exhaustion as the whole-model stop |
| 07 | unit-economics-open-items | CAC, payback, LTV: open until the first pilot completes, and the minimum data each needs |
| 08 | non-dilutive-funding | Grants (NLnet, Alpha-Omega, GitHub Secure Open Source Fund) as a runway category shaping the funding input |

## Research summary

- Results collected: 156 (96 from the attempt-1 dig across 16 queries, 60 from the attempt-2 redo dig across 10 queries), 6 kept per query.
- Weight split: 24 results at weight >= 0.5 (authoritative), 132 below 0.5 (weak; labeled as such in doc text where cited). Docs 01, 04, 05, 07 lean on weak-backed sources and say so inline; docs 02, 03, 06, 08 are primary-anchored.
- Jev requests: 38 total (2 outline validation score requests including 1 lost-body resend, 21 noul weighting requests for attempt-1 results including 1 retry after HTTP 429, 15 noul weighting requests for redo results including 3 retries after HTTP 429). Usage tokens captured only for the outline validation retry (1370 in / 0 out); the API returns top-level usage but the weighting batch calls did not persist it, so those entries carry null usage rather than estimates (see jev-log.json note).
- Redo counts: 5 docs redug once with different queries (01, 04, 05, 06, 07); 0 redug twice; no dig required a direct primary-source fetch fallback.
- Skipped docs: none. Docs 01, 04, 07 remain thin-backed after redos and are authored honestly with weak-backing labels instead of being skipped or padded.
- Known content gaps: readiness-gate taxonomy rests on one primary source family (Stage-Gate International); unit-economics sources are both below 0.5 weight.

## Outline validation

Score metric via clef on /api/decide, criteria `["padding: drop", "marginal: keep only if the dig comes back strong", "load-bearing: core subtopic"]`. Scores: 01 1.78, 02 1.89, 03 1.93, 04 1.83, 05 1.64, 06 1.55, 07 1.49, 08 1.15. Dropped: none.

## research-db

- preflight.json, outline.json, archive.json (156 weighted entries), jev-log.json, db.ts, digs/01..08 JSON records.

Preflight 2026-10-05: searXNG healthy (26 queries, 156 results, no unresponsive engines); /api/decide (clef) 200.
