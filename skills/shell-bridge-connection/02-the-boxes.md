# 02 - The boxes: ubuntu and rock1

Scope: the two tailnet hosts the shell bridges front, their hardware, their roles, and their recorded state as of 2026-09-24. Internal-record subtopic, no dig: everything here comes from the source doc.

## Quick comparison

| | ubuntu | rock1 |
|---|---|---|
| Hostname | `ubuntu.tail3a04f5.ts.net` | `rock1.tail3a04f5.ts.net` |
| Connection id | `conn_ai5iXWquRX0s` | `conn_W36n4EetFoNp` |
| Hardware | bare-metal Snapdragon X Elite (X1E80100) laptop, 62 GB RAM | original SBC |
| OS | Ubuntu 26.04.1 | (not recorded in the source doc) |
| Primary role | PRIMARY yubi-OS self-hosted ARM64 Actions runner; KVM/libvirt and imaging station | UART and audio work |
| Actions runner | agentId 22 (migrated from rock1, marker `.runner_migrated` dated 2026-09-20) | agentId 23 "rock1", live again after restoration |
| Bridge verified | 2026-09-24 | 2026-09-24 evening (echo ping + full state probe) |

All rows from the source doc (yubi-OS/yubiOS skills/shell-bridge-connection/SKILL.md).

## ubuntu: the primary ARM64 runner

ubuntu's load-bearing role is PRIMARY yubi-OS self-hosted ARM64 Actions runner. The migration from rock1 completed with a `.runner_migrated` marker dated 2026-09-20 and runner agentId 22 (source doc). It doubles as a KVM/libvirt and imaging station (source doc), so it is the box for virtualization, disk imaging, and the heaviest CI capacity on the tailnet. The hardware is real, not virtualized: a bare-metal Snapdragon X Elite (X1E80100) laptop with 62 GB of RAM running Ubuntu 26.04.1 (source doc).

Two filesystem facts matter when driving it over the bridge:

- The bridge runs as root, so `~` resolves to `/root` (source doc).
- The rollout files live in `/home/ubuntu`, NOT in root's home (source doc). A script that assumes `~` points at the rollout directory silently operates on the wrong tree.

The bridge on ubuntu was verified working on 2026-09-24 (source doc).

## rock1: the original SBC

rock1 is the original single-board computer in the fleet, home of the UART and audio work (source doc). The ascii-uart-animator and play-audio-on-rock1 skills both target this box through the same bridge.

After a 401 outage it was RESTORED on 2026-09-24 evening; the verified round trip covered an echo ping plus a full state probe (source doc). The root cause was a zombie process holding the old token in memory, recorded in SAUNA_TOOLS as the "rock1 bridge 401 saga" and covered operationally in doc 04.

One status note that outlived the outage: the yubi-OS Actions runner is live on rock1 again, registered as agentId 23 "rock1", alongside ubuntu's agentId 22 (source doc). Two runners now share the CI load; do not assume "the runner" is a single host, and do not assume the 2026-09-20 migration is the final word.

## Reading order when picking a box

- Heavy ARM64 CI, KVM, imaging: ubuntu first.
- UART, audio, serial-adjacent work: rock1.
- Both accept the identical /run contract (doc 01), so switching boxes is a hostname and connection-id swap, not a protocol change.

## Dating discipline

Every status claim above is dated. The bridge verification dates (2026-09-24), the migration marker (2026-09-20), and the runner agentIds are point-in-time facts from the source doc. Before a high-stakes run, re-verify rather than trusting this snapshot: a ping (doc 07) costs one second and beats a stale assumption. The source doc also carries a structural warning that applies to any snapshot: uptime is not tailnet age (doc 07), so "this box is new" and "this box was recently flashed" are different claims that need different evidence.
