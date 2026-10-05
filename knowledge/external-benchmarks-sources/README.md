# External benchmarks and comparison sources for security/OS products

A knowledge corpus on how to select, cite, and bound claims against third-party benchmarks and market data. Minted 2026-10-05 from yubi-OS/yubiOS refs/external-benchmarks-sources-2026-07-25.md.

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | source-taxonomy | Classifying third-party sources (primary/official, commercial market-research, aggregator, noise) and what each class can support |
| 02 | breach-cost-benchmarks | IBM Cost of a Data Breach as directional cost-of-status-quo evidence, 2025 vs 2026 editions, customer-specific boundary |
| 03 | market-sizing-variance | Commercial market-research estimates for the FIDO2 hardware key market and why vendor variance forces ranges |
| 04 | vendor-pricing-benchmarks | Live vendor retail pricing (YubiKey 5 Series) as the strongest hardware-cost benchmark class |
| 05 | regulatory-guidance-sources | NIST SP 800-63B, CISA, and OMB M-22-09 guidance as citation sources and their certification boundary |
| 06 | claim-boundaries | Use-for and do-not-use-for boundaries on every benchmark; qualification language as enforcement |
| 07 | refresh-cadence | Per-source refresh clocks (annual reports, live prices, standards revisions) and staleness flags |
| 08 | number-reconciliation | Reconciling conflicting figures across documents without silently overwriting or inventing |
| 09 | citation-lists | The reusable benchmark table and dependency map as the terminal artifact |

## Research summary

- Results collected: 108 (2 queries per subtopic, top 6 per query kept)
- Weight split: 39 results at weight >= 0.5 (authoritative backing), 69 at weight < 0.5 (weak backing, labeled in text)
- Jev requests: 24 total (1 outline score batch of 9, 1 noul probe, 22 weighting batches of 5 results each)
- Jev usage: 24,707 input tokens, 7,876 output tokens
- Redos: 0 dig redos; 5 decide 429 retries within 3-attempt policy (all succeeded)
- Skipped docs: none; all 9 subtopics scored load-bearing or marginal-with-strong-dig and were authored

## Per-doc sources

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01-source-taxonomy | 12 | 3 |
| 02-breach-cost-benchmarks | 12 | 5 |
| 03-market-sizing-variance | 12 | 4 |
| 04-vendor-pricing-benchmarks | 12 | 6 |
| 05-regulatory-guidance-sources | 12 | 8 |
| 06-claim-boundaries | 12 | 6 |
| 07-refresh-cadence | 12 | 2 |
| 08-number-reconciliation | 12 | 4 |
| 09-citation-lists | 12 | 1 |

## Preflight

2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## Method notes

- Outline decomposed into 9 subtopics by the domain's own joints (source classes, benchmark types, citation lifecycle stages).
- Every result weighted with the noul metric on /api/decide (clef model); every authored claim carries its source URL and weight, with weights below 0.5 labeled as weak backing in text.
- No dig redos were needed; all subtopic digs returned 42 or more raw results per query.
