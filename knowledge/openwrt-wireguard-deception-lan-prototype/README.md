# a WireGuard-based SSH deception LAN prototype on OpenWrt (design plan only)

Knowledge corpus minted from yubi-OS/yubiOS refs/openwrt-wireguard-deception-lan-prototype-2026-07-25.md (design plan only, no live network).

## Docs

| NN | doc | scope |
|----|-----|-------|
| 01 | 01-wireguard-deception-segmentation.md | Designing a WireGuard-zone-segmented deception LAN on OpenWrt: zone topology, addressing, and confining decoys inside the mesh only |
| 02 | 02-endlessh-tarpit-backend.md | endlessh as the SSH tarpit backend: how it lures attackers, what it is not enough for, and why it fits OpenWrt |
| 03 | 03-multihost-decoy-topology.md | Multi-host decoy topology across a WireGuard mesh: a consistent coordinated decoy surface so a probe against one host does not reveal the real host by omission |
| 04 | 04-decoy-pool-planning.md | Mesh-wide decoy pool address planning: allocating decoy addresses from a shared plan rather than per-router pools to avoid structural tells |
| 05 | 05-coordination-without-controller.md | Coordinating decoy configuration across hosts without a central controller: a static owner-authored planning worksheet instead of a runtime sync protocol |
| 06 | 06-attack-surface-defaults.md | Network defaults that keep the deception LAN attack surface minimal: WireGuard-zone-only listening, no WAN bind, no redirect of the real SSH endpoint, owner break-glass path |
| 07 | 07-evidence-run-plan.md | The evidence-run plan for the prototype: per-host router config, firewall view, scan behavior, packet capture, service logs, plus a cross-host comparison step |
| 08 | 08-notification-aggregation.md | Aggregating probe notifications across decoy hosts at the owner's existing notification point without adding new cross-host attack surface |
| 09 | 09-failure-recovery-gates.md | Failure and recovery design plus promotion gates: respawn caps, fail to no-decoy-service behavior, and the evidence checklist needed before leaving design stage |

## Research summary

- Results collected: 99 (searXNG, top 6 per query, 2 queries per subtopic)
- Weight split: high (>= 0.5) 99 / low (< 0.5) 0
- Jev requests: 22 (usage 17910 input / 0 output tokens)
- Redo counts: 0
- Skipped docs: none

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## Notes

- All 9 subtopics passed outline validation with score > 1.4 (none dropped).
- Every factual claim in the docs carries its source URL and jev weight. Off-topic dig hits are present in the archive but were not cited.
- The source doc is a prototype design plan; no live network, VM, or router build is described or claimed anywhere in this corpus.
