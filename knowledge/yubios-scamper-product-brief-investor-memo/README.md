# yubios-scamper-product-brief-investor-memo

Knowledge corpus minted from yubi-OS/yubiOS refs/yubios-scamper-product-brief-investor-memo-2026-08-07.md. Topic: SCAMPER ideation, product briefs, and investor memos for infrastructure products: restrained sizing discipline, artifact structure, and keeping speculation clearly labeled.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [scamper-ideation-method.md](01-scamper-ideation-method.md) | SCAMPER as a structured ideation lens: origin (Eberle), the 7 levers, and how each lever maps onto governance-first OS design decisions. |
| 02 | [product-concept-brief-structure.md](02-product-concept-brief-structure.md) | How a product concept brief is structured: concept, problem, target users, value proposition, principles, features, differentiator, metrics, risks, MVP. |
| 03 | [one-page-investor-brief.md](03-one-page-investor-brief.md) | The 1-page investor brief: what to compress, which sections survive compression, and the discipline of one risk and one ask. |
| 04 | [investor-memo-restrained-sizing.md](04-investor-memo-restrained-sizing.md) | Restrained market sizing in investor memos: TAM proxies vs bottom-up sizing, SAM/SOM discipline, and why early numbers should be small. |
| 05 | [speculation-labeling-provenance.md](05-speculation-labeling-provenance.md) | Keeping speculation clearly labeled: provenance capture for LLM-generated artifacts, verbatim preservation, and the non-canonical-artifact pattern. |
| 06 | [benchmark-reanchoring-discipline.md](06-benchmark-reanchoring-discipline.md) | Re-anchoring paraphrased market numbers to named analyst reports (Gartner, IDC, Frost) with retrieval dates before any external use. |
| 07 | [mvp-scoping-and-prototype-testing.md](07-mvp-scoping-and-prototype-testing.md) | Scoping the MVP from ideation output and testing it fast: 24-hour prototypes, small-N user tests, and what question each test must answer. |
| 08 | [ideation-to-backlog-continuity.md](08-ideation-to-backlog-continuity.md) | Turning ideation artifacts into durable backlog items: filing tickets, linking to existing implementation skills, and preventing thread-only ideas from evaporating. |
| 09 | [governance-first-positioning.md](09-governance-first-positioning.md) | Positioning governance and accountability as a product feature rather than a backend security concern: framing, differentiators, and buyer language. |

## Research summary

- Results collected: 108 (searXNG, 2 queries per subtopic, top 6 per query kept)
- Weight split: 16 authoritative (weight >= 0.5) / 92 weak (weight < 0.5) of 108
- jev requests: 24 via /api/decide (clef), usage 18731 input / 0 output tokens (1 outline validation request of 9 score questions, 22 weighting requests of 5 noul questions each, 1 preflight probe question)
- Redos: 0 dig redos (every subtopic dig came back on-topic and deep enough to author honestly)
- Skipped docs: none

Preflight 2026-10-05: searXNG 33 results healthy; /api/decide (clef) 200.

Per-doc source table:

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01-scamper-ideation-method | 12 | 0 |
| 02-product-concept-brief-structure | 12 | 2 |
| 03-one-page-investor-brief | 12 | 0 |
| 04-investor-memo-restrained-sizing | 12 | 0 |
| 05-speculation-labeling-provenance | 12 | 3 |
| 06-benchmark-reanchoring-discipline | 12 | 7 |
| 07-mvp-scoping-and-prototype-testing | 12 | 1 |
| 08-ideation-to-backlog-continuity | 12 | 1 |
| 09-governance-first-positioning | 12 | 2 |

## Notes

- The source doc is an external LLM ideation artifact (Duck.ai thread, 2026-08-07), explicitly non-canonical for yubiOS positioning. This corpus decomposes the craft discipline the artifact demonstrates (structured ideation, artifact compression chain, restrained sizing, provenance labeling, re-anchoring) into standalone knowledge docs.
- All market figures quoted in doc 06 carry their source URL and jev weight in text; conflicting same-vendor figures (Gartner $244.2B vs $295B for 2026, different report vintages) are presented as the finding that motivates re-anchoring with retrieval dates, not resolved.
- research-db/ holds the full decision record: outline.json (score validation), archive.json (every result with its noul weight and raw decision object), digs/ (per-subtopic dig records), jev-log.json (one entry per HTTP request), preflight.json, and db.ts (typed shapes).
