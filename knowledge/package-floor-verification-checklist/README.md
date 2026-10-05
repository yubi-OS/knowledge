# package-floor-verification-checklist

Knowledge corpus minted from yubi-OS/yubiOS `refs/package-floor-verification-checklist-2026-08-04.md`. Topic: package-floor verification for digest-pinned OS builds, the pre- and post-digest-bump verification protocol that preserves kernel and package-version invariants when base image digests rotate.

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | [package-floor-invariants](01-package-floor-invariants.md) | The minimum-version invariant set (kernel, systemd, bootc, mkosi, podman, buildx, SoftHSM, sbsign) a digest-pinned base image must preserve across rotations. |
| 02 | [composefs-kernel-floors](02-composefs-kernel-floors.md) | Kernel floors per composefs mode: data-only OverlayFS 6.5+, verity=require 6.6+, file-backed EROFS 6.12+. |
| 03 | [systemd-feature-floors](03-systemd-feature-floors.md) | systemd feature floors: BLS 246+, DPS and LUKS2 hardware unlock 252+, portable services 254+, sysext/confext 256+. |
| 04 | [bootc-floor-split-kernel-rootfs](04-bootc-floor-split-kernel-rootfs.md) | bootc floors: split-kernel-and-rootfs 1.16.4+, install to-filesystem composefs backend 1.16.3+, target 1.16.6. |
| 05 | [digest-rotation-incident-history](05-digest-rotation-incident-history.md) | The 4 documented fedora-bootc:45 rotations (stream truncation, 2 re-resolutions, the stale 404 pin) as the failure-mode evidence base. |
| 06 | [pre-bump-verification-protocol](06-pre-bump-verification-protocol.md) | The before-bump checklist: fetch candidate digest, pull and rpm-inspect, compare against floors, diff the package set, repin. |
| 07 | [post-bump-ci-cascade](07-post-bump-ci-cascade.md) | The after-bump verification: CI cascade groups, the 5-step verify-package-floor.sh script, and the engineering gates. |
| 08 | [scheduled-drift-detection-gate](08-scheduled-drift-detection-gate.md) | The ci_package-floor.yml gate: daily 06:00 UTC schedule, PR path triggers, and the finding that the gap was scheduling, not tooling. |
| 09 | [digest-pinning-supply-chain](09-digest-pinning-supply-chain.md) | Digest-vs-tag pinning semantics, OCI manifest resolution, skopeo and quay API tooling, and where floors sit in supply-chain verification. |

## Research summary

- Results collected: 108 (2 queries per subtopic, top 6 kept per query after URL dedup within a subtopic).
- Weight split (jev noul, >= 0.5 = authoritative): 57 high / 51 low of 108.
- Jev requests: 29 (1 preflight probe, 1 outline score validation over 9 subtopics, 27 noul weighting requests at 5 results per batch). Usage: 19146 input tokens, 0 output tokens.
- Redos: 0 (no subtopic dig required a redo; all 18 searXNG queries returned 200 with sufficient results).
- Skipped docs: none. All 9 outlined subtopics scored 0.90 or above on the score metric and all 9 were authored.
- Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.

## Outline validation

All 9 subtopics validated in one `/api/decide` score request (clef). Scores: t01 1.86, t02 1.30, t03 1.16, t04 1.46, t05 0.90, t06 1.92, t07 1.76, t08 1.19, t09 1.34. Dropped: none (no score-0 subtopics).

## Layout

- `NN-<slug>.md` - the 9 authored docs.
- `research-db/preflight.json` - service health probes.
- `research-db/outline.json` - topic decomposition and jev score validation record.
- `research-db/archive.json` - all 108 collected results with weights and full decision records.
- `research-db/digs/<NN>-<slug>.json` - per-subtopic dig trace.
- `research-db/jev-log.json` - one entry per jev HTTP request with usage tokens.
- `research-db/db.ts` - TypeScript interfaces for every shape above.
