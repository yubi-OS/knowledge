# docker-metadata-action knowledge corpus

Ground source: yubi-OS/yubiOS `skills/docker-metadata-action/SKILL.md` (fetched 2026-10-06, 8887 bytes). This corpus explicates that skill: generating OCI-compliant Docker image tags and labels automatically from Git metadata (branch, tag, SHA, PR) in GitHub Actions with docker/metadata-action, and the tag-generation discipline the skill teaches. The SKILL.md remains the primary source of record; every doc below cites it for its grounding spine, plus searXNG-digged external sources with jev weights for the mechanisms the skill references.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-purpose-and-scope.md](docs/01-purpose-and-scope.md) | What the action is for, the boundary of its job, and when to reach for it |
| 02 | [02-action-reference-inputs.md](docs/02-action-reference-inputs.md) | The action reference block: images, tags, and the id: meta requirement |
| 03 | [03-tag-types.md](docs/03-tag-types.md) | The tag types reference table and the trigger-to-output mapping |
| 04 | [04-outputs-and-build-push.md](docs/04-outputs-and-build-push.md) | The five outputs and the build-push-action wiring |
| 05 | [05-oci-labels.md](docs/05-oci-labels.md) | Auto-generated OCI labels and the explicit label set, grounded in the OCI annotations spec |
| 06 | [06-yubios-supply-chain-pattern.md](docs/06-yubios-supply-chain-pattern.md) | The yubiOS pattern: sha format=long digest pinning and the containers.bootc=1 label |
| 07 | [07-bake-integration.md](docs/07-bake-integration.md) | The bake-file output and docker/bake-action integration for multi-target builds |
| 08 | [08-primitive-alignment.md](docs/08-primitive-alignment.md) | Primitive coverage notes (internal record, no dig) |
| 09 | [09-lifecycle-examples-guidelines.md](docs/09-lifecycle-examples-guidelines.md) | Changelog, audit trail, examples, and guidelines (internal record, no dig) |

## Research summary

- Results collected: 14 searXNG queries (2 per web-shaped subtopic, 7 subtopics), 84 top-6 results kept at query level, 58 unique results after per-subtopic URL dedupe, all 58 weighted (37 high at 0.5 or above, 21 low below 0.5). Off-topic noise (visa-portal "OCI" collisions, commercial shipping-container vendors, GeeksforGeeks and Docker product pages) was weighted low and carries no claims in any doc.
- jev: 6 requests total (1 outline score validation, 5 noul weighting batches of 10 to 12 questions) via DefAPI direct (https://api.defapi.org/api/v1/decisions), typesafe/jev-1.13. Usage: 8544 input / 1261 output tokens. Zero 429s, zero retries.
- Redos: 0 (no dig needed a re-run; no jev request failed).
- Skipped docs: none. 9 of 9 outlined subtopics authored. Subtopics 08 and 09 are internal-record subtopics with no dig by design (their grounding is the source doc itself).
- Outline validation kept all 9 subtopics; no score-0 drops. Subtopics 06 to 09 scored marginal (0.44 to 0.85) but were kept because each maps to a named section of the ground source SKILL.md, which dictates the outline.
- Version drift recorded: the source doc pins docker/metadata-action@v5; the upstream README's current examples run on v6 (dig dated 2026-10-06, https://github.com/docker/metadata-action, jev 0.94). Recorded as dated corrections in docs 01, 02, and 09, not as contradictions.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide (DefAPI direct, typesafe/jev-1.13) 200.

## Research database

Under `research-db/`: `preflight.json`, `outline.json`, `archive.json` (58 weighted entries with full decision records), `digs/` (9 per-subtopic records including the 2 internal-record notes), `jev-log.json` (6 request entries), and `db.ts` (TypeScript interfaces for every shape above).
