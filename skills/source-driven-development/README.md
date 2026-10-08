# skills/source-driven-development - Knowledge Corpus

Ground source: [yubi-OS/yubiOS skills/source-driven-development/SKILL.md](https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/source-driven-development/SKILL.md) (15705 B, fetched with User-Agent omni-agent/1.0). Topic: grounding every implementation decision in official documentation - source-cited code free from outdated patterns, correctness-first framework work.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-core-discipline.md](01-core-discipline.md) | The foundational rule: every framework-specific code decision must be backed by official documentation, and why training-data staleness makes verification non-negotiable. |
| 02 | [02-trigger-scope.md](02-trigger-scope.md) | When to use and when not to use source-driven development: the 6 triggers, 3 exclusions, and the version-dependence boundary. |
| 03 | [03-stack-detection.md](03-stack-detection.md) | Step 1 of the process: reading dependency manifests (package.json, composer.json, requirements.txt, go.mod, Cargo.toml, Gemfile) to detect exact versions, and asking the user instead of guessing. |
| 04 | [04-source-hierarchy.md](04-source-hierarchy.md) | Step 2 of the process: the 4-tier source hierarchy (official docs, official blog, standards references, compatibility tables), the never-cite list, and fetch precision. |
| 05 | [05-retrieval-safety.md](05-retrieval-safety.md) | Treating fetched documentation as untrusted data: the prompt-injection threat model (OWASP LLM01), extraction hygiene, and the ignore list. |
| 06 | [06-implement-conflict.md](06-implement-conflict.md) | Step 3 of the process: implementing documented patterns, honoring deprecations, and surfacing docs-versus-codebase conflicts (the React 19 useActionState example). |
| 07 | [07-citation-discipline.md](07-citation-discipline.md) | Step 4 of the process: the citation contract (full URLs, deep-link anchors, quoted passages) and the UNVERIFIED flag. |
| 08 | [08-anti-rationalization.md](08-anti-rationalization.md) | The self-audit layer: the 6-row rationalization table, the 9 red flags, and the 8-item post-implementation verification checklist. |
| 09 | (skipped) | The skill's declared coverage of yubiOS 10-primitive concerns (least privilege, audit-evidence, RSI audit-trail notes). Internal-record subtopic, no dig. |

## Research summary

- Results collected: 107 (top 6 per query after URL dedup; trigger-scope redug with 2 different queries)
- Weight split: 42 high (>= 0.5) / 65 low (< 0.5) of 107 weighted
- Jev requests: 9 (1 outline validation, 8 weighting), usage 11335 input / 2097 output tokens, model typesafe/jev-1.13 via DefAPI direct
- Redos: 1 (trigger-scope dig redone with different queries after attempt 1 kept only 1 authoritative source)
- Skipped docs: 09-yubios-integration (score 0 at outline validation; internal-record subtopic, no dig per skills-variant DELTA 4)

## Per-doc sources

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01-core-discipline | 12 | 3 |
| 02-trigger-scope | 23 | 5 |
| 03-stack-detection | 12 | 7 |
| 04-source-hierarchy | 12 | 6 |
| 05-retrieval-safety | 12 | 9 |
| 06-implement-conflict | 12 | 6 |
| 07-citation-discipline | 12 | 3 |
| 08-anti-rationalization | 12 | 3 |
| 09-yubios-integration | 0 | 0 |

## Research DB

`research-db/` holds the schema-v2 record set: `preflight.json`, `outline.json`, `archive.json` (every collected result with its noul weight and full decision record), `digs/*.json` (per-subtopic dig attempts and redo log), `jev-log.json` (one entry per jev HTTP request), and `db.ts` (TypeScript interfaces for all shapes).

## Verification

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); DefAPI direct weighting active, /api/decide worker relay held as fallback (not needed). Post-push verification: PR files list + Git-blob re-fetch of each research-db JSON, weights non-null.
