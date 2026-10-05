# days-0-30-safe-offer: Early-Stage Go-to-Market for Security Infrastructure

Knowledge corpus minted 2026-10-05 from yubi-OS/yubiOS `refs/days-0-30-safe-offer-2026-07-25.md`. Topic: how to make an early product offer safe to discuss with prospective customers before the product is proven: claim hygiene, risk framing, and qualification for security infrastructure go-to-market.

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | [01-evidence-boundaries.md](01-evidence-boundaries.md) | Defining and maintaining an evidence boundary: what a pre-product security project can claim publicly, with every claim traceable to what is proven today. |
| 02 | [02-technical-preview-framing.md](02-technical-preview-framing.md) | Technical Preview, beta, and early-access labeling: converting a blocker list into explicit entry criteria and go/no-go gates for unproven capability. |
| 03 | [03-problem-interviews.md](03-problem-interviews.md) | Customer discovery problem interviews with technical buyers: capturing recurring objections, buying triggers, and deployment constraints. |
| 04 | [04-customer-qualification.md](04-customer-qualification.md) | Target customer profile and qualification for security infrastructure: who pays and why, buying triggers, deployment constraints, disqualifiers. |
| 05 | [05-risk-framing-collateral.md](05-risk-framing-collateral.md) | Risk framing in early collateral: pilot SOW, data sheet, support boundaries, and ROI baseline worksheets drafted under uncertainty. |
| 06 | [06-legal-tracks-early.md](06-legal-tracks-early.md) | Legal groundwork before the offer: trademark and naming, licensing posture, contributor provenance, entity formation, covenants. |
| 07 | [07-funding-alignment.md](07-funding-alignment.md) | Selective public-security funding: applying for grants only where the project has a scoped, public deliverable. |
| 08 | [08-gtm-sequencing.md](08-gtm-sequencing.md) | Sequencing the go-to-market workstreams: positioning and evidence boundary before pricing, offer finalization, and pilot work. |

## Research summary

- Results collected: 95 (top 6 per query across 16 seed queries, 8 subtopics, deduplicated per doc)
- Weight split: 19 results with weight >= 0.5 (authoritative backing), 76 with weight < 0.5 (weak backing, labeled as such in the docs)
- Jev requests: 20 (1 outline validation with 8 score questions, 19 noul weighting batches of 5), usage 16448 input / 0 output tokens
- Redo counts: 0 (no dig fell below the thin threshold)
- Skipped docs: none
- Weak-backing note: docs 03, 04, 05, and 08 rest predominantly on practitioner sources scoring below 0.5; each doc says so explicitly in its limits section. Docs 02, 06, and 07 carry the strongest primary backing (Microsoft preview terms 0.70 to 0.88, Linux Foundation 0.76, google.github.io 0.69, sbir.gov / seedfund.nsf.gov / grants.gov / NSF PESOSE 0.64 to 0.91).

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

Measured preflight: searXNG probe query returned 183 results; /api/decide probe (noul question) returned 200 with model clef. Full probe records in `research-db/preflight.json`.

## Research DB

All decision provenance is stored under `research-db/`: `preflight.json`, `outline.json`, `archive.json` (one entry per result with full decision record), `digs/<NN>-<slug>.json` (one per subtopic), `jev-log.json` (one entry per /api/decide HTTP request), and `db.ts` (TypeScript interfaces mapping every file to its schema).
