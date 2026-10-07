# nspawn-containers knowledge corpus

Minted from the yubiOS ground source `yubi-OS/yubiOS skills/nspawn-containers/SKILL.md` (fetched 2026-10-06, 13725 B). Topic: systemd-nspawn for yubiOS, hermetic container dev/test/build environments rooted at signed mkosi images, RootImage=/RootMStack=, user namespaces, network modes, portable-service substitute.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-isolation-ladder.md](01-isolation-ladder.md) | The yubiOS decision tree across nspawn, bcvk/QEMU, sysext, portable services, podman, and the shared-kernel boundary |
| 02 | [02-when-to-use.md](02-when-to-use.md) | The concrete use cases and the 4 explicit do-not-use boundaries |
| 03 | [03-invocation-anatomy.md](03-invocation-anatomy.md) | Flags of the canonical invocation, man-page grounding, machinectl image handling |
| 04 | [04-boot-in-container.md](04-boot-in-container.md) | --boot, PID 1 systemd, the 4-step test-in-image convention |
| 05 | [05-network-modes.md](05-network-modes.md) | The 4 network namespace modes and the zones-to-ZTMM microsegmentation mapping |
| 06 | [06-portable-services.md](06-portable-services.md) | portablectl attach mechanics and the 3 production use cases |
| 07 | [07-anti-patterns.md](07-anti-patterns.md) | The 6 anti-patterns, sorted into 3 isolation-boundary classes |
| 08 | [08-integration-surface.md](08-integration-surface.md) | Composition with mkosi-image-builder, bcvk-virtualization, bootc-images, systemd-hardening, ADR-031 |

## Research summary

- Results collected: 84 (top 6 per query across 14 searXNG queries, deduped per subtopic)
- Weight split: 23 high (noul >= 0.5) / 61 low (< 0.5), all 84 weighted, none null
- Jev requests: 7 (1 outline score validation, 6 noul weighting batches of 14); usage 10459 input / 1828 output tokens; endpoint https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13
- Redos: 0 (all 14 dig queries succeeded on attempt 1; no weighting request failed)
- Docs kept/skipped: 8 / 0 (all 8 outline subtopics scored >= 1, none dropped)
- Subtopic 08 is an internal-record subtopic (composition among yubiOS repo artifacts): no dig run, claims cite the source doc per the skills-variant speed rule
- Gaps: network-mode flag corroboration (doc 05) is thin, weights 0.10 to 0.54; the source doc carries the load-bearing claims there

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide (clef) 200, run via DefAPI direct.

## Research DB

`research-db/` follows schema v2: `preflight.json`, `outline.json`, `archive.json` (array of 84 weighted results), `digs/NN-slug.json` x 8, `jev-log.json`, `db.ts`.
