# covenant-conflict-policy

Knowledge corpus on open-source covenant and conflict policy design: what stays public versus what the commercial layer may sell, stewardship rules for telemetry, forks, roadmap, and disclosure, and how conflicts between commitments get resolved. Minted 2026-10-05 from yubi-OS/yubiOS refs/covenant-conflict-policy-2026-07-25.md.

## Docs

- 01-covenant-scope-public-commercial.md: What open-source covenants define as public vs commercial: the open-core boundary, what the free core guarantees, and what the commercial layer may legitimately sell. (results kept 12, primary 0)
- 02-telemetry-stewardship.md: Stewardship rules for telemetry in open-source products: opt-in vs opt-out defaults, consent, data minimization, and who telemetry data belongs to. (results kept 12, primary 2)
- 03-fork-stewardship.md: Fork and contributor stewardship: licensing choices, trademark policy, CLA vs DCO, and how projects stay fork-friendly without inviting hostile forks. (results kept 12, primary 5)
- 04-roadmap-control.md: Roadmap governance: public roadmaps, ADR-gated trust-chain decisions, RFC processes, and who controls project direction. (results kept 11, primary 1)
- 05-disclosure-policy.md: Coordinated vulnerability disclosure and security fix timelines for open source: embargo norms, why paying customers must not get fixes early. (results kept 12, primary 1)
- 06-conflict-definition.md: What counts as a covenant conflict: concrete tests (does landing this require breaking a specific commitment) and illustrative conflict cases from real projects. (results kept 12, primary 3)
- 07-decision-authority.md: Who decides when commitments collide: maintainer authority models (BDFL, foundation, meritocracy), escalation paths, and honest single-maintainer reality. (results kept 11, primary 3)
- 08-conflict-recording.md: How conflict resolutions get recorded and enforced: ADRs with rationale, blocker logs, transparent decision records, and audit trails contributors can check. (results kept 12, primary 0)
- 09-pricing-reconciliation.md: Reconciling commercial pricing and SKU design with covenant commitments: pricing-model-agnostic conflict checks and running offers through the checklist. (results kept 12, primary 0)
- 10-publication-lifecycle.md: Staging and publishing governance docs: draft status in refs/, promotion to COVENANT.md / GOVERNANCE.md at repo root, review dependencies and human sign-off. (results kept 11, primary 4)

## Research summary

- Results collected: 120 searXNG results across 20 queries (2 per subtopic), top 6 per query kept, 120 entries in archive.json each carrying a jev weight.
- Weight split: high (>= 0.5) 19, low (< 0.5) 101, of 120 weighted results.
- Jev requests: 15 logged (probe, 10-question outline score validation, 13 noul weighting batches), usage 17657 input / 0 output tokens.
- Redo counts: no dig redos; 1 noul batch (results 62-70) retried after 429 rate-limit responses, succeeded on retry with widened pacing; 10 rescored entries carried forward as weight-null with redo_of set.
- Skipped docs: none. All 10 subtopics authored.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.

## Research DB

research-db/ holds the full record: preflight.json, outline.json, archive.json, digs/ per-doc records, jev-log.json, and db.ts (TypeScript interfaces for every shape above).
