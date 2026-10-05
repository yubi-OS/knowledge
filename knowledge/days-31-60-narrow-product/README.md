# days-31-60-narrow-product: proving a narrow product in days 31 to 60

Knowledge corpus minted from yubi-OS/yubiOS refs/days-31-60-narrow-product-2026-07-25.md (OMN-66). Topic: proving a narrow product in days 31 to 60 of an early stage GTM plan, covering narrowing the offer, finding the first users, and evidence gates for a minimum viable product.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-pilot-platform-narrowing.md | Narrowing the offer to the x86_64 VM validated lane over ARM64 hardware; picking the narrowest defensible platform slice. |
| 02 | 02-blocker-triage-reclassification.md | Retiring, reclassifying, or explicitly deferring blockers; pilot-blocking vs release-blocking vs out of scope. |
| 04 | 04-physical-hardware-evidence.md | Designing a reproducible, falsifiable physical hardware demonstration with explicit evidence and limits. |
| 05 | 05-evidence-gates-exit-criteria.md | Evidence gates for an MVP: checkable exit criteria, go/no-go gates, kill criteria. |
| 06 | 06-design-partner-recruitment.md | Finding first users: design partner definition, target profile, sourcing, and the run-on-real-infrastructure bar. |
| 07 | 07-pricing-the-pilot.md | Pricing the pilot instead of defaulting to unpaid custom engineering; priced SOW before recruitment. |
| 08 | 08-operational-readiness.md | Vulnerability triage, release severity, escalation, backup and restore cadence, incident communications. |

## Research summary

- Results collected: 96 (searXNG, 2 queries per subtopic, top 6 per query kept)
- Weight split: 25 results at weight >= 0.5 (authoritative backing), 70 at weight < 0.5 (weak backing, labeled as such in the docs)
- Jev requests: 21 (1 outline score validation with 8 questions, 19 noul weighting batches of 5, 1 preflight probe); usage 13687 input / 0 output tokens recorded, 0 request(s) with usage not returned
- Redo counts: 1 (doc 05 evidence gates; first pass returned mostly weak or off topic results, redone with different queries)
- Skipped docs: none. One outline subtopic dropped at validation: 03 fido2-vm-coverage (score 0.80, below the marginal floor of 1.0).

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.

## Research DB

Under research-db/: preflight.json, outline.json, archive.json (one entry per collected result with its noul decision record), digs/ (per-doc dig records with redo log), jev-log.json (one entry per /api/decide request with usage), db.ts (TypeScript interfaces for every shape above).
