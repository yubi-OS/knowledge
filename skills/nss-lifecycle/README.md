# nss-lifecycle knowledge corpus

Knowledge corpus minted from the ground source `yubi-OS/yubiOS skills/nss-lifecycle/SKILL.md` (38,324 bytes). The corpus explicates the NSS Lifecycle axis: how files evolve, including versioning (SemVer 2.0.0), changelogs (Keep a Changelog 1.1.0), deprecation state (RFC 8594 Sunset / RFC 9745 Deprecation), migration guides, feature-flag lifecycle, SBOM versioned evidence (2026 CISA minimum elements), ADR-driven decisions, and the negative states (removed, archived, cancelled, unknown).

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-state-machine.md](01-state-machine.md) | The eight-stage lifecycle state machine, transition obligations, stage semantics, alignment with Kubernetes, Google, and Square policies |
| 02 | [02-semver-versioning.md](02-semver-versioning.md) | SemVer 2.0.0 as the compatibility rule rather than the lifecycle model, version coordinates, why a version cannot carry obligations |
| 03 | [03-changelog-conventional-commits.md](03-changelog-conventional-commits.md) | Keep a Changelog 1.1.0 categories and entry quality, Conventional Commits 1.0.0 mapping, Release Drafter automation |
| 04 | [04-http-deprecation-headers.md](04-http-deprecation-headers.md) | RFC 9745 Deprecation versus RFC 8594 Sunset, the deprecation link relation, ordering rule, notice periods as policy |
| 05 | [05-migration-guides.md](05-migration-guides.md) | Migration-guide composition: replacement, codemod, upgrade-helper, manual steps, validation |
| 06 | [06-feature-flag-lifecycle.md](06-feature-flag-lifecycle.md) | Per-flag lifecycle records, LaunchDarkly statuses, OpenFeature provider-event observability |
| 07 | [07-sbom-evidence-lifecycle.md](07-sbom-evidence-lifecycle.md) | SBOMs as versioned evidence per the 2026 CISA minimum elements, per-release fields, retention and supersession |
| 08 | [08-adr-and-yubios-patterns.md](08-adr-and-yubios-patterns.md) | ADR-driven decisions (Nygard format, immutability, supersedes) plus the yubiOS per-file-type Lifecycle patterns and verification checklist |

## Research summary

- Results collected: 120 (96 from 16 first-attempt queries, 24 from 4 redo queries)
- Weight split: 39 at weight >= 0.5 (authoritative), 81 below 0.5 (used as weak or contextual backing only)
- Docs kept / skipped: 8 / 0
- Jev requests: 11 (1 outline score request, 10 noul weighting requests in batches of up to 13), usage 15,844 input / 2,306 output tokens
- Redos: 2 (03 changelog-conventional-commits, 08 adr-and-yubios-patterns; both re-dug with different queries after thin first attempts)
- Skipped docs and why: none
- Weighting endpoint: DefAPI direct (https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13); the steady-orbit /api/decide relay was not needed
- Preflight 2026-10-06: searXNG healthy (campaign preflight, orchestrator); DefAPI jev-1.13 200 (agent-side probe skipped for speed per the skills-variant brief)

## research-db

`research-db/` holds the schema-v2 record: `preflight.json`, `outline.json`, `archive.json` (120 entries, all weighted, none null), `digs/<NN>-<slug>.json` (8 records), `jev-log.json` (11 requests), and `db.ts` (interface map).
