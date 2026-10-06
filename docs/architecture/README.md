# docs/architecture: the yubiOS system architecture corpus

Explication corpus for [yubi-OS/yubiOS docs/ARCHITECTURE.md](https://github.com/yubi-OS/yubiOS/blob/main/docs/ARCHITECTURE.md): the architecture's layers and components, the trust boundaries, the build and boot paths, and how the recorded design composes. The source doc is the primary source of record; every doc below cites it as its grounding spine and adds jev-weighted dig sources for the external mechanisms the doc names.

## Documents

| NN | File | Scope |
|---|---|---|
| 01 | [01-thesis-identity-root.md](01-thesis-identity-root.md) | The FIDO2-first thesis: YubiKey as human-presence identity root, platform root kept separate |
| 02 | [02-target-platforms.md](02-target-platforms.md) | RK3588 Path A, Path B measured boot, and the x86-64 secondary stance |
| 03 | [03-trust-boundaries.md](03-trust-boundaries.md) | The six trust boundaries and the owner-controlled material at each |
| 04 | [04-boot-flow.md](04-boot-flow.md) | UEFI to systemd-boot to UKI to composefs chain, sealed versus unsealed status |
| 05 | [05-arm64-firmware.md](05-arm64-firmware.md) | TF-A, OP-TEE, fTPM, U-Boot chain and the three workflow firmware variants |
| 06 | [06-build-distribution.md](06-build-distribution.md) | Bootc and mkosi paths, OCI tags, sealed composefs build flow, partition layout, updates |
| 08 | [08-first-boot-extensions.md](08-first-boot-extensions.md) | First-boot services and the four extension models ranked by trust |
| 09 | [09-kernel-rootfs-split.md](09-kernel-rootfs-split.md) | ADR-032 kernel plus rootfs split, Phase 1 and Phase 2 staging |

NN 07 (version requirements) was skipped; see gaps below.

## Research summary

- Results collected: 180 across 9 subtopics (108 from attempt 1, 60 from redo 1, 12 from redo 2).
- Weight split: 11 results at noul >= 0.5 (high), 169 below (low). Low-weight sources are used only with explicit weak-backing labels in the docs.
- Jev requests: 16 (1 outline score validation, 15 noul weighting batches) via DefAPI direct (typesafe/jev-1.13), usage 21981 input tokens / 3439 output tokens.
- Redo counts: subtopics 02, 06, 08, 09 each got 1 redo round after attempt 1 returned no noul >= 0.5 result; subtopic 07 got 2 redo rounds.
- Skipped docs and why: 07-version-requirements was dropped. It scored marginal (0.65) in outline validation, so its dig had to come back strong. Two redo rounds with different queries produced no result with noul >= 0.5, so per the redo rule the doc was skipped rather than shipped with only weak backing. The gap is recorded in digs/07-version-requirements.json.
- Preflight 2026-10-06: campaign preflight run orchestrator-side (searXNG healthy, decide healthy); agent-side probe skipped for speed per the mint brief's speed optimizations.

## Research-db

Under `research-db/`: `preflight.json`, `outline.json`, `archive.json` (all 180 weighted results), `digs/<NN>-<slug>.json` (one per subtopic, including the skipped 07 record), `jev-log.json` (one entry per jev HTTP request), and `db.ts` (the schema interfaces).
