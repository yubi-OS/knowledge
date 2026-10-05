# operating-covenant

Knowledge corpus on public-interest operating covenants for open-source projects: what stays public, what the commercial layer may sell, and stewardship rules around telemetry, forks, roadmap, and disclosure. Minted 2026-10-05 from yubi-OS/yubiOS refs/operating-covenant-2026-07-25.md.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-what-stays-public.md](01-what-stays-public.md) | Which artifacts an open-source project commits to keeping public (source, trust chain, threat models, base image, ADRs) and why the list must be explicit. |
| 02 | [02-commercial-boundaries.md](02-commercial-boundaries.md) | What commercial offerings may sell around an open-source OS (services, support, hardware, hosting) and the boundary against selling security or trust itself. |
| 03 | [03-trust-chain-openness.md](03-trust-chain-openness.md) | Why security trust boundaries (secure boot, signing, encryption, reproducible builds) must remain public and inspectable. |
| 04 | [04-telemetry-stewardship.md](04-telemetry-stewardship.md) | Stewardship rules for telemetry: default-off, documented and auditable collection, and the hosted-commercial-data boundary. |
| 05 | [05-fork-rights.md](05-fork-rights.md) | License-guaranteed forking, trademark policy as the real lever, and no disadvantaging of fork users in security fixes. |
| 06 | [06-roadmap-governance.md](06-roadmap-governance.md) | Public ADR-driven architecture decisions; commercial signal as input vs commercial gating of trust-chain work. |
| 07 | [07-security-disclosure.md](07-security-disclosure.md) | Coordinated vulnerability disclosure norms, no customer-only embargo, and published known-gap documents as a second surface. |
| 08 | [08-license-compatibility.md](08-license-compatibility.md) | LGPL-2.1 and copyleft as the baseline guarantee beneath a covenant; no additional restrictions. |
| 09 | [09-precedent-covenants.md](09-precedent-covenants.md) | Real-world precedent commitments (Debian Social Contract, Contributor Covenant, Open Source Pledge) and their design lessons. |
| 10 | [10-business-model-review.md](10-business-model-review.md) | The re-review discipline: checking a concrete commercial offer against covenant commitments when the business model lands. |

## Research summary

- Results collected: 120 (2 searXNG queries per subtopic, top 6 kept per query, 20 queries).
- Weight split: 43 results at weight >= 0.5 (primary/official backing), 77 at weight < 0.5 (weak, labeled as such in the docs).
- Jev requests: 28 logged (1 preflight probe, 1 batch-size sanity check, 1 outline validation over 10 subtopics, 24 result-weighting batches of 5). Usage: 20475 input tokens, 0 output tokens. 2 transient 429s were retried after a 30s sleep per the redo rule.
- Redos (searXNG dig redos): 0. No dig came back thin.
- Skipped docs: none. All 10 subtopics scored >= 1.38 in outline validation (kept).
- Research DB: [research-db/](research-db/) with preflight.json, outline.json, archive.json, digs/, jev-log.json, db.ts.

Preflight 2026-10-05: searXNG 83 results healthy; /api/decide (clef) 200.
