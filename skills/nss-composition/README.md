# nss-composition knowledge corpus

Explication corpus for the yubiOS skill `skills/nss-composition` (the ninth NSS axis: how a file composes with others). Ground source: yubi-OS/yubiOS skills/nss-composition/SKILL.md (41985 B, fetched 2026-10-07). The corpus explicates and deepens the skill; the skill remains the primary source of record.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-axis-scope-and-use.md](01-axis-scope-and-use.md) | What the Composition axis scores, its 4 reader questions, when to use and when not. |
| 02 | [02-coverage-rubric.md](02-coverage-rubric.md) | The 0 to 5 coverage levels and the 0 to 20 label conversion. |
| 03 | [03-scoring-dimensions.md](03-scoring-dimensions.md) | The 10 scoring dimensions and the coupling and instability metrics behind dimension 8. |
| 04 | [04-edge-type-distinctions.md](04-edge-type-distinctions.md) | Static import vs runtime call vs configuration-discovered edges; the 9 distinctions; Kythe evidence. |
| 05 | [05-lens-format-patches.md](05-lens-format-patches.md) | The cycle-16 lens schema, invariants, verdict semantics, and degenerate red flags. |
| 06 | [06-file-type-templates.md](06-file-type-templates.md) | The 9 file-type composition templates and the systemd and GitHub Actions mechanisms they encode. |
| 07 | [07-architecture-standards.md](07-architecture-standards.md) | Parnas and SEI, arc42, C4, and multi-graph decomposition. |
| 08 | [08-composition-tooling-principles.md](08-composition-tooling-principles.md) | dependency-cruiser executable rules and the REP/CCP/CRP/ADP/SDP/SAP package principles. |
| 09 | [09-measurement-framework.md](09-measurement-framework.md) | The 7 evidence layers, the indicator list, and signals-not-thresholds. |
| 10 | [10-skill-composition-relationships.md](10-skill-composition-relationships.md) | The skill's own composition table, self-containment, and verification. |

## Research summary

- Results collected: 108 (72 first pass, 24 redo pass 1, 12 redo pass 2).
- Weight split: 13 at weight >= 0.5 (authoritative backing), 95 below 0.5 (weak backing, labeled as such in the docs), 0 unweighted.
- Authoring discipline: every factual claim carries its source URL and jev weight; claims below 0.5 are explicitly labeled weak; claims with no source were deleted, not softened. Internal-record subtopics (01, 02, 05, 10) cite the source doc and ran no dig.
- jev requests: 10 (1 outline validation with the score metric, 9 noul weighting batches of 10 to 12 via DefAPI direct). Usage: 21256 input / 2242 output tokens.
- Redos: 3 (subtopic 06 once after weak first-pass backing; subtopic 09 twice after weak backing on both first passes). Every redo used different queries and is logged in research-db/digs/.
- Skipped docs: none. All 10 outline subtopics validated load-bearing or marginal-with-strong-dig and were authored.

## Research DB

Under `research-db/`: `preflight.json`, `outline.json`, `archive.json` (108 entries, all weighted), one `digs/<NN>-<slug>.json` per subtopic, `jev-log.json` (one entry per jev HTTP request with usage), and `db.ts` (TypeScript interfaces for every shape). Per-result decision usage tokens are null by design because weighting ran in 10 to 12 question batches; the batch-level usage for each request is recorded in `jev-log.json`.

## Sources note

Weighting was performed with DefAPI direct (POST https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13); the noul answer shape is {type: noul, noul: probability} and weight = answer.noul. Digs ran through the searXNG endpoint in endpoint/qs form. No primary-source fallback was used: thin digs were redone with different queries, and every kept result carries its measured weight.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); DefAPI decide endpoint campaign-verified (orchestrator). Agent-side probes skipped per the skills-variant speed optimizations.
