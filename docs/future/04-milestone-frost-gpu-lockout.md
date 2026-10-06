# 04. Milestone Frost: Firmware-Assisted GPU Resource Lockout

Scope: Milestone Frost researches a Panfrost-centered path to observe, limit, quarantine, or reset GPU resource abuse on RK3399/RK3588, with U-Boot deliberately excluded from the runtime policy role.

## The design stance

The goal statement is explicit about what Frost is not: the lockout path must work "without treating U-Boot as a runtime policy engine" (source doc, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md). U-Boot's role is confined to early setup: reserved memory, device-tree nodes, control mailbox metadata, and handoff to Linux plus secure monitor firmware (source doc). Runtime accounting and policy live in Linux DRM/Panfrost and cgroup v2, and hard cutoffs live below the kernel.

## The research shape

Six directions are recorded (source doc):

- Treat Linux DRM/Panfrost and cgroup v2 as the accounting and policy layer. Prefer the emerging DRM device-memory cgroup path when available; otherwise prototype minimal cgroup-aware Panfrost BO accounting (source doc).
- Hook BO allocation, PRIME import, BO destruction, and an optional submit guard rather than relying on userspace ioctl policy alone (source doc).
- Confine U-Boot to early setup: reserved memory, device-tree nodes, control mailbox metadata, handoff (source doc).
- Define a secure monitor or firmware interface, such as SMC or a shared mailbox, for hard actions: context quarantine, IOMMU revocation, GPU reset, or power gating (source doc).
- Stage enforcement from observe, warn, and deny-allocation modes to cgroup/context quarantine, then full GPU reset or power-cycle only for repeated or unsafe violations (source doc).
- Separate device-memory limits from GPU time scheduling so the milestone stays clear about what Frost protects and what remains future scheduler work (source doc).

## What the dig adds

The kernel-side references anchor the accounting layer. The DRM GPU documentation index (weight 0.83, https://docs.kernel.org/gpu/index.html), DRM internals (weight 0.77, https://www.kernel.org/doc/html/latest/gpu/drm-internals.html), and the DRM memory-management documentation that defines buffer objects and PRIME cross-device sharing (weight 0.84, https://docs.kernel.org/gpu/drm-mm.html) are the canonical sources for the BO lifecycle hook points the doc names. The Mesa Panfrost driver documentation is the user-facing contract for the same driver (weight 0.84, https://docs.mesa3d.org/drivers/panfrost.html), and a Rockchip kernel tree carrying `drivers/gpu/drm/panfrost/panfrost_drv.c` is the concrete patch-point file the evidence requirement asks for (weight 0.54, https://github.com/armbian/linux-rockchip/blob/rk-6.1-rkr7.2/drivers/gpu/drm/panfrost/panfrost_drv.c).

On the cgroup side, the emerging DRM device-memory cgroup path the doc prefers is reported by Phoronix as "Device Memory DMEM cgroup support ready for Linux 6.14" (weight 0.29, https://www.phoronix.com/news/DMEM-cgroup-vRAM-Control). That is weak backing (news coverage, not a primary source), but the headline claim it carries matches the doc's "emerging DRM device-memory cgroup path" language and the doc's framing that the path must be preferred "when available" (source doc). A community Panfrost integration repository for Rockchip is weak (weight 0.31, https://github.com/jacobchencc/panfrost).

## Evidence needed before promotion

Five artifacts are required (source doc):

- A source-backed map of current Panfrost/Rockchip kernel patch points for probe/init, BO create/free, PRIME import, and submit guarding.
- An RK3399/RK3588 proof showing whether lockout can target an offending cgroup/context or must fall back to safe full-GPU reset behavior.
- A device-tree, reserved-memory, and control-mailbox sketch with recovery and failure behavior.
- Tests for false positives, graphics stack recovery, telemetry, logs, and owner notification.
- ADR coverage of the trust boundary between Linux policy, the OP-TEE/TF-A hard cutoff, and user recovery.

The second bullet is the real research question: whether the hardware permits fine-grained quarantine at all, or whether the only safe hard action is a full reset. The staged-enforcement design (observe, warn, deny, quarantine, reset) is built so that the system can ship its early modes before that question is answered.

## Relationship to the trust-boundary work

Frost governs how much GPU a workload may consume. A separate, landed piece of work governs what kind of GPU access a default image exposes at all; that work is covered in doc 05 of this corpus and is explicitly scoped as the attack-surface precondition for any lockout policy (source doc).

## Sources for this doc

Ground spine: yubi-OS/yubiOS `docs/FUTURE.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md), fetched 2026-10-06. Dig results weighted by jev noul as cited inline; 12 results kept, 5 with weight 0.5 or higher.
