# docs/future: the yubiOS future-work ledger corpus

Knowledge corpus explicating yubi-OS/yubiOS `docs/FUTURE.md` (ground source, fetched 2026-10-06): what future directions are recorded, their preconditions, and how the ledger structures long-horizon planning. The doc's own sections dictate the outline.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-near-term-planning-cycle.md](./01-near-term-planning-cycle.md) | The Near-Term Planning Cycle: dated evidence refreshes and the SPEC/ADR/BLOCKERS hand-off. |
| 02 | [02-milestone-f-arm64-root-of-trust.md](./02-milestone-f-arm64-root-of-trust.md) | Milestone F: proving the production Path A owner-owned root of trust on ROCK 5B / RK3588 and RK3399. |
| 03 | [03-milestone-sectime-secure-world-time.md](./03-milestone-sectime-secure-world-time.md) | Milestone SecTime: auditing the secure-world time path (CFG_SECURE_TIME_SOURCE_CNTPCT) before time claims back policy. |
| 04 | [04-milestone-frost-gpu-lockout.md](./04-milestone-frost-gpu-lockout.md) | Milestone Frost: Panfrost-centered GPU resource lockout with U-Boot excluded from runtime policy. |
| 05 | [05-vgpu-vfio-user-trust-boundary.md](./05-vgpu-vfio-user-trust-boundary.md) | The landed vGPU / vfio-user trust boundary (ADR-031): virtio-gpu default, passthrough opt-in and gated, GPU-independent trust chain. |
| 06 | [06-milestone-ci-test-lanes.md](./06-milestone-ci-test-lanes.md) | Milestone CI: keeping test lanes honest (ARM64 KVM, CTAP2 requirements, zstd zboot pin, PQ TLS, multi-arch publication). |
| 07 | [07-milestone-docs-snapshot-drift.md](./07-milestone-docs-snapshot-drift.md) | Milestone Docs: preventing snapshot drift (dated refs notes, PINNED.md digest discipline, directive distinction, citation hierarchy). |
| 08 | [08-milestone-net-openwrt-deception.md](./08-milestone-net-openwrt-deception.md) | Milestone Net: an OpenWrt WireGuard deception LAN with decoy SSH endpoints, tarpits, and owner notification. |
| 09 | [09-post-launch-hardware-and-deferred.md](./09-post-launch-hardware-and-deferred.md) | Post-launch hardware work table and deferred ideas (systemd-sysinstall, LUO/KHO, FIDO2-wrapped Secure Boot keys, ORAS artifacts). |
| 10 | [10-exit-criteria-promotion.md](./10-exit-criteria-promotion.md) | Exit criteria: the six conditions for promoting an item out of FUTURE.md into ADR.md, SPEC.md, or implementation. |

## Research summary

- Results collected: 72 (6 per query, 2 queries per web-shaped subtopic; 4 internal-record subtopics skipped searXNG by design)
- Weight split: 30 high (>= 0.5) / 42 low (< 0.5) of 72
- jev requests: 7 (8915 input / 1690 output tokens) via https://api.defapi.org/api/v1/decisions (clef typesafe/jev-1.13); worker relay fallback unused
- Redo counts: 0
- Skipped docs: none (10 authored; subtopics 01, 06, 07, 10 are internal-record and cite the source doc only)

Preflight 2026-10-06: campaign preflight run orchestrator-side (searXNG healthy, decide healthy); agent-side probe skipped for speed per brief.
