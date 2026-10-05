# claims-boundaries

Knowledge corpus: what a product's campaign surfaces may say versus what its threat model actually bounds, and how to keep public claims inside the verified envelope. Minted 2026-10-05 from yubi-OS/yubiOS refs/claims-boundaries-2026-09-18.md.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-claims-bounding-rule.md](01-claims-bounding-rule.md) | The core discipline: a product may publicly claim only what its threat model can bound and its architecture can evidence, nothing stronger. |
| 02 | [02-overclaiming-language.md](02-overclaiming-language.md) | Absolute and inflated security language (unhackable, secure by default, impenetrable) and why it collapses under scrutiny. |
| 03 | [03-regulatory-substantiation.md](03-regulatory-substantiation.md) | Regulator and standards guidance on substantiating security claims: FTC enforcement, NIST and EU expectations. |
| 04 | [04-threat-model-as-contract.md](04-threat-model-as-contract.md) | Threat models as the bounding document: scope, assumptions, out-of-scope exclusions, and the assurance-case claim-to-evidence map. |
| 05 | [05-evidence-envelope.md](05-evidence-envelope.md) | The verified envelope: architecture docs, certification schemes and attestations that bound what a public claim can say. |
| 06 | [06-status-labels.md](06-status-labels.md) | Maturity and status labeling: technical preview versus production support language in READMEs and SECURITY.md. |
| 07 | [07-oss-campaign-messaging.md](07-oss-campaign-messaging.md) | How open-source security projects phrase campaign surfaces: taglines, launch pages, README claims. |
| 08 | [08-claim-audit-checklist.md](08-claim-audit-checklist.md) | Operationalizing the boundary: a pre-publication claim review process mapping each marketing claim to a bounded control or evidence artifact. |

## Research summary

- Results collected: 96 (all weighted, none null)
- Weight split: 41 at or above 0.5 (primary backing) / 55 below 0.5 (weak, labeled in text)
- Jev requests: 25 (1 preflight probe, 1 outline validation over 8 questions, 20 result-weighting batches of 5, 3 redo batches), usage 18488 input / 0 output tokens
- Digs: 16 initial queries (2 per doc), 6 results kept each; doc 08's first dig was too thin (1 source at weight >= 0.5) and was redone once with 2 different queries per the REDO RULE; the superseded 12 results are excluded from the archive
- Skipped docs: none; all 8 authored
- Gaps: the doc 07 and doc 08 source sets lean on weakly weighted sources for their contrast cases and workflow templates; those claims are labeled weak in text

Preflight 2026-10-05: searXNG 57 results healthy; /api/decide (clef) 200

## Provenance

Source doc: yubi-OS/yubiOS refs/claims-boundaries-2026-09-18.md (the one-page rule that docs/PR.md's campaign story may claim exactly what docs/THREAT_MODEL.md can bound and docs/ARCHITECTURE.md can point at). Every factual claim in the docs carries its source URL and the jev weight that backed it; weights below 0.5 are labeled weak backing in text.
