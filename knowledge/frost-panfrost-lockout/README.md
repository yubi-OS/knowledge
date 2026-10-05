# frost-panfrost-lockout

A knowledge corpus on the staged design for Panfrost/RK GPU lockout: what current Linux, Panfrost and cgroup controls can deliver today, what needs a kernel prototype, and what must stay hardware-gated on Rockchip boards.

Minted 2026-10-05 from yubi-OS/yubiOS refs/frost-panfrost-lockout-2026-07-17.md.

## Documents

1. [01-panfrost-driver-surface.md](01-panfrost-driver-surface.md) - Panfrost driver architecture and per-DRM-file state as the patch surface for policy work.
2. [02-submit-path-gating.md](02-submit-path-gating.md) - panfrost_ioctl_submit as the policy choke point and the Stage 2 cgroup/context-aware submit gate design.
3. [03-cgroup-device-access.md](03-cgroup-device-access.md) - Stage 0: denying render-node opens with BPF_PROG_TYPE_CGROUP_DEVICE and its open-fd limits.
4. [04-device-memory-cgroup.md](04-device-memory-cgroup.md) - the cgroup v2 dmem controller and why Panfrost dmem accounting is prototype work, not a dependency.
5. [05-userspace-observability.md](05-userspace-observability.md) - Stage 1: fdinfo attribution of GPU load and userspace isolation of the offending process group.
6. [06-rockchip-recovery-model.md](06-rockchip-recovery-model.md) - Stage 3: hardware-gated recovery options on RK3399/RK3588 and what must be proven on board.
7. [07-secure-world-cutoff.md](07-secure-world-cutoff.md) - the TF-A/OP-TEE firmware-assisted cutoff: SMC handoff, quarantine command, RPMB/fTPM persisted state.
8. [08-lockout-test-plan.md](08-lockout-test-plan.md) - the Frost test plan and the ADR trust boundary between Linux policy and secure-world enforcement.

## Research summary

- Results collected and weighted: 89 (16 queries across 2 dig passes, top results kept per query, deduplicated across subtopics).
- Weight split: 56 results at weight >= 0.5 (primary or official sources), 33 results below 0.5 (weak backing, labeled as such in the docs where cited).
- Jev requests: 20 total (1 preflight probe, 1 outline validation with 8 score questions, 18 weighting batches of 5 noul questions). Usage: 15835 input tokens, 0 output tokens.
- Redo counts: 0 (no dig was thin enough to require a redo; both dig passes were merged).
- Skipped docs: none. All 8 outline subtopics validated as load-bearing (scores 0.83 to 1.76 on the 0-2 score metric) and were authored.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
