# openwrt-deception-proof-plan

Knowledge corpus on deception-based network defense on OpenWrt: turning an SSH tarpit idea into a testable proof plan with package builds, VM and spare-router testbeds, and packet-level evidence requirements. Minted 2026-10-05 from yubi-OS/yubiOS `refs/openwrt-deception-proof-plan-2026-07-17.md`.

## Docs

| NN | File | Scope |
|---|---|---|
| 01 | [01-openwrt-package-structure.md](01-openwrt-package-structure.md) | OpenWrt in-tree/feed package Makefile layout: PKG_* variables, Package sections, conffiles, dependencies, install rules. |
| 02 | [02-procd-init-scripts.md](02-procd-init-scripts.md) | procd service integration: USE_PROCD=1 init scripts, procd_set_param command/respawn, UCI validation, config triggers. |
| 03 | [03-firewall4-nftables.md](03-firewall4-nftables.md) | firewall4 and nftables on OpenWrt 22.03+: preserved UCI syntax, zones, forwarding, generated rules. |
| 04 | [04-endlessh-tarpit.md](04-endlessh-tarpit.md) | Endlessh SSH tarpit: endless-banner behavior, configuration options, resource usage, deployment modes. |
| 05 | [05-decoy-exposure-design.md](05-decoy-exposure-design.md) | Decoy-only exposure: WireGuard zone segregation, no WAN binding, real SSH behind VPN, break-glass path. |
| 06 | [06-testbed-vm-qemu.md](06-testbed-vm-qemu.md) | VM and spare-router testbeds: QEMU x86_64 images, hardware path, snapshot and rollback workflow. |
| 07 | [07-evidence-capture.md](07-evidence-capture.md) | Packet and scan evidence: nmap behavior against decoys, tcpdump on the WireGuard interface, no-WAN proof. |
| 08 | [08-logging-minimization.md](08-logging-minimization.md) | Logging minimization and notifications: minimal metadata fields, exclusion list, retention, notification payloads. |

## Research summary

- Results collected: 87 searXNG results across 16 queries (8 subtopics x 2 seed queries), top 6 per query, deduplicated per subtopic.
- Weight split (noul via clef): 37 results at weight >= 0.5 (authoritative backing), 50 results below 0.5 (weak backing, labeled as such in the docs).
- jev requests: 20 total (1 preflight probe, 1 outline validation with 9 score questions, 18 weighting batches of 5), 14085 input tokens, 0 output tokens reported.
- Redo counts: 0 dig redos, 0 jev request redos (no failed /api/decide or searXNG calls).
- Skipped docs: none. One outline candidate was dropped at validation: subtopic 09 (deception-governance-adr) scored 0.51 with the 0-bucket ("padding: drop") argmax at 0.548, so it was dropped per the score metric; its ADR concerns are partially covered inside docs 05 and 08.
- Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.

## Research DB

Under `research-db/`: `preflight.json` (probe results), `outline.json` (9 subtopics with scopes, seed queries, and the full score validation), `archive.json` (all 87 results with titles, urls, snippets, collection timestamps, and full noul decision records), `digs/` (8 per-doc dig records with queries attempted, kept counts, and redo logs), `jev-log.json` (one entry per jev HTTP request with usage tokens), and `db.ts` (TypeScript interfaces for every shape).
