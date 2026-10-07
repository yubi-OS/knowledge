# fedora-bootc-base-images - knowledge corpus

Minted from the ground source `yubi-OS/yubiOS skills/fedora-bootc-base-images/SKILL.md` (fetched 2026-10-06, 11198 bytes). The corpus explicates that skill: working with official Fedora and CentOS Stream bootc base images, image tiers, source repos, digest pinning, bootc-base-imagectl, and upstream tracking.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-source-repositories.md](01-source-repositories.md) | Where the base images are developed (GitLab repos), which branches hold real image definitions, and the published registry references |
| 02 | [02-image-tiers.md](02-image-tiers.md) | The standard / minimal-plus / minimal tier definitions, package sets, inheritance, and official versus dev-testing publication |
| 03 | [03-digest-pinning.md](03-digest-pinning.md) | How yubiOS derives from the Fedora standard image with digest pinning, the FROM line, the LABEL, and skopeo inspect |
| 04 | [04-standard-tier-package-set.md](04-standard-tier-package-set.md) | What the standard tier ships, what to remove (podman), and what yubiOS must add (YubiKey tooling, pam-u2f, cloud agents) |
| 05 | [05-repo-structure.md](05-repo-structure.md) | The Fedora base-images repo file map: Containerfile, Justfile, bootc-base-imagectl, treefiles, .tekton/, renovate.json |
| 06 | [06-local-build-rechunk.md](06-local-build-rechunk.md) | Local builds with just, content-based layer splitting via bootc-base-imagectl rechunk and the --chunkah flag |
| 07 | [07-upstream-tracking-konflux.md](07-upstream-tracking-konflux.md) | What to watch upstream, the clevis-dracut/clevis-pin-tpm2 case study, Renovate bumps, and Konflux CI as the real build pipeline |
| 08 | [08-primitive-coverage.md](08-primitive-coverage.md) | The primitive-coverage and changelog entries the skill itself carries (internal-record subtopic, no dig) |

## Research summary

- Results collected: 96 (deduplicated across 16 searXNG queries, top 6 kept per query per attempt)
- Weight split: 43 results with jev noul weight >= 0.5 (authoritative), 53 below 0.5 (weak, labeled in docs where cited)
- jev requests: 9 (1 score-metric outline validation + 8 noul weighting batches), usage 10335 input / 2067 output tokens
- Decision model: typesafe/jev-1.13 via DefAPI direct (https://api.defapi.org/api/v1/decisions), zero failed requests, no 429s
- Redo counts: 1 (doc 06, attempt 1 query returned dictionary noise; redone with 2 different queries)
- Skipped docs: none. One subtopic dropped at outline validation: centos-stream-structure (t07), score 0.37 (padding, p=0.67); its content is still covered inside docs 01 and 07 where it carries weight.

Grounding discipline: claims from the source doc are attributed as "source doc" (yubi-OS/yubiOS skills/fedora-bootc-base-images/SKILL.md); claims from digs carry their URL and jev weight inline. Weak (< 0.5) sources are labeled as such wherever used. Doc 08 is sourced entirely from the source doc and is marked as an internal-record subtopic with no dig.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide healthy via DefAPI direct (campaign preflight run orchestrator-side, agent-side probe skipped for speed).

## Research DB

Under [research-db/](research-db/): `preflight.json`, `outline.json`, `archive.json` (96 weighted entries), `jev-log.json`, `db.ts` (schema v2 interfaces), and per-doc dig records under `digs/`.
