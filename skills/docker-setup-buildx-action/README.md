# Knowledge Corpus: skills/docker-setup-buildx-action

Explication corpus for the yubiOS skill `docker-setup-buildx-action` (source of record: yubi-OS/yubiOS `skills/docker-setup-buildx-action/SKILL.md`). The skill covers setting up Docker Buildx (BuildKit) in GitHub Actions for multi-platform builds, cache export/import, and SLSA attestations.

## Corpus docs

- [01-when-to-use-prerequisites.md](./01-when-to-use-prerequisites.md) - When docker/setup-buildx-action is required: before docker/build-push-action when using cache export/import, SLSA provenance/SBOM attestations, multi-platform builds, or custom buildkitd config; and what is possible without it.
- [02-builder-drivers.md](./02-builder-drivers.md) - Buildx driver comparison: docker-container (default; enables cache export, attestations, multi-platform), docker (none of those), kubernetes (all three); why the driver choice gates every downstream feature.
- [03-action-reference-pinning.md](./03-action-reference-pinning.md) - Action reference and version discipline: version: latest pin for reproducibility, pinning action SHA for AGENTS.md-compliant workflows, @v3 acceptable for dev, upgrade cadence between action major versions.
- [04-buildkitd-config-mirrors.md](./04-buildkitd-config-mirrors.md) - Custom buildkitd config via buildkitd-config-inline and buildkitd-config: registry mirrors ([registry."quay.io"] mirrors = [...]), config files, and why mirrors matter in CI.
- [05-cache-export-import.md](./05-cache-export-import.md) - Cache export/import discipline that the docker-container driver unlocks: cache-from/cache-to backends (gha, registry, s3), scope keys, and why the docker driver cannot do it.
- [06-slsa-attestations.md](./06-slsa-attestations.md) - SLSA provenance/SBOM attestations via BuildKit: provenance and sbom attestation modes in build-push-action, the docker-container driver requirement, and how the attestations land in the image index.
- [07-multi-platform-builds.md](./07-multi-platform-builds.md) - Multi-platform builds: pairing setup-qemu-action with setup-buildx-action, the docker-container driver requirement, platform list syntax, and per-platform cache/export behavior.

## Research summary

- Results collected: 84 searXNG results (top 6 per query kept), deduped to 51 unique URLs, all weighted.
- Weight split: 25 results at >= 0.5 (primary/authoritative), 26 below 0.5.
- Jev requests: 8 (5784 input / 1088 output tokens), model typesafe/jev-1.13 via DefAPI direct (https://api.defapi.org/api/v1/decisions); steady-orbit /api/decide kept as fallback, not needed.
- Redos: 0 dig redos. 1 endpoint correction in weighting (first batch hit a mistyped endpoint, retried against /api/v1/decisions successfully; logged in jev-log.json).
- Skipped docs: 3 of 10 outline subtopics dropped by the score metric (see below).
- Outline validation: 10 subtopics scored in 1 request; no score-0 on the first pass except where noted below.

### Dropped subtopics

1. network-host-driver-opts (score 0.23, P(padding) 0.79): dropped by metric. The driver-opts network=host example is still covered inside 02-builder-drivers.md.
2. yubios-placement-primitives (score 0.03, P(padding) 0.98): dropped by metric. The yubiOS placement rule is still covered inside 06-slsa-attestations.md.
3. scope-guidelines-boundary (score 0.62, marginal): internal-record subtopic with no dig to demonstrate dig strength, dropped per the marginal rule. The Guidelines scope rule is quoted inside 04-buildkitd-config-mirrors.md.

## Per-doc primary sources

| doc | words | primary sources (>= 0.5) |
|---|---|---|
| 01-when-to-use-prerequisites | 609 | 7 |
| 02-builder-drivers | 646 | 4 |
| 03-action-reference-pinning | 702 | 2 |
| 04-buildkitd-config-mirrors | 747 | 4 |
| 05-cache-export-import | 675 | 4 |
| 06-slsa-attestations | 605 | 2 |
| 07-multi-platform-builds | 677 | 2 |

## Research-db

- `research-db/preflight.json` - preflight record (campaign preflight run orchestrator-side).
- `research-db/outline.json` - outline + jev score validation.
- `research-db/archive.json` - all 51 weighted results with full decision records.
- `research-db/digs/<NN>-<slug>.json` - per-subtopic dig records.
- `research-db/jev-log.json` - one entry per jev HTTP request.
- `research-db/db.ts` - TypeScript interfaces for all shapes.

## Preflight

2026-10-06: searXNG campaign preflight healthy (orchestrator); DefAPI /api/v1/decisions 200 (agent-side probe skipped for speed per mint brief).
