# yubios-reproducibility-equivalents

Knowledge corpus minted from yubi-OS/yubiOS `refs/yubios-reproducibility-equivalents-2026-07-30.md`. Topic: reproducibility equivalents research: what techniques from reproducible-builds prior art (like reproducible-mkosi) map onto an OS image project, and which equivalents are worth adopting.

## Docs

| NN | file | scope |
|---|---|---|
| 01 | [01-source-date-epoch.md](01-source-date-epoch.md) | SOURCE_DATE_EPOCH semantics for reproducible OS image builds: the spec, tool support, commit-derived vs fixed-zero epoch values, and enforcement against drift. |
| 02 | [02-toolchain-pinning.md](02-toolchain-pinning.md) | Pinning the build toolchain: Nix flake pins vs fork plus git-SHA pins vs version floors like mkosi MinimumVersion, and how each constrains build inputs. |
| 03 | [03-two-build-verification.md](03-two-build-verification.md) | Two-build reproducibility verification: building twice and diffing across image, installer, and firmware artifacts. |
| 04 | [04-seeds-and-uuids.md](04-seeds-and-uuids.md) | Deterministic seeds and identifiers in image builds: mkosi Seed=, repart seeds, UUID derivation per commit and architecture, and collision avoidance. |
| 05 | [05-build-state-nondeterminism.md](05-build-state-nondeterminism.md) | Build-state nondeterminism: machine-id, random-seed, ldconfig aux-cache, package manager caches, PYTHONHASHSEED, and other mutable build residue. |
| 06 | [06-upstream-fixes-inheritance.md](06-upstream-fixes-inheritance.md) | Inheriting upstream reproducibility fixes through version floors: mkosi PRs 1834, 1837, 1982, 2163, related systemd fixes, and MinimumVersion enforcement. |
| 07 | [07-attestation-opportunity.md](07-attestation-opportunity.md) | Attesting reproducible outputs: cosign attestation, in-toto, SLSA provenance, Rekor transparency for OCI images as the open adoption opportunity. |
| 08 | [08-mirror-independence.md](08-mirror-independence.md) | Fetch independence and package caching or vendoring: mirror state as a reproducibility input, mkosi.cache vendoring, and reproducible-builds.org foundations. |
| 09 | [09-peer-prior-art.md](09-peer-prior-art.md) | Peer projects and prior art: flashbots mkosi-poc, arch-mkosi-boxes, upstream mkosi --reproduce PR 1115, and reproducible-builds.org. |

## Research summary

- Results collected: 108 (top 6 per query after URL dedupe, from 18 searXNG queries across 9 subtopics).
- Weight split: 55 results at weight >= 0.5 (authoritative backing), 53 results below 0.5 (used with weak-backing labels in the docs).
- Jev requests: 24 total (1 preflight probe, 1 outline score validation over 9 questions, 22 noul weighting batches over 108 results). Usage: 18900 input tokens, 0 output tokens.
- Redos: 0 dig redos, 0 decision-model redos (every /api/decide request and every searXNG query succeeded on the first attempt).
- Skipped docs: none. All 9 subtopics scored >= 1.11 on the outline validation (none dropped at score 0), and every dig came back strong enough to author honestly.

yubiOS-internal claims (script names, mechanisms, incident IDs such as run-30197303995) are grounded in the source refs note from yubi-OS/yubiOS and are attributed to it in the docs; web claims carry their source URL and jev weight.

## Preflight

2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

(probe details: searXNG returned 72 results on the probe query with 13 engines unresponsive; /api/decide probe answer 0.0438 on the noul metric.)

## Layout

- `research-db/preflight.json` : endpoint health probes
- `research-db/outline.json` : outline + jev score validation
- `research-db/archive.json` : all 108 collected results with weights and decision records
- `research-db/digs/` : per-subtopic dig provenance (9 files)
- `research-db/jev-log.json` : every /api/decide request with usage
- `research-db/db.ts` : TypeScript interfaces for all shapes above
