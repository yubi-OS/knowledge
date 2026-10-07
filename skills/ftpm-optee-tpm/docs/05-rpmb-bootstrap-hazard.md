# 05 - The RPMB bootstrap hazard

Scope: why the fTPM's persistent NV storage in RPMB collides with Early TA initialization timing, the panic mode, and the two mitigations. This is the single biggest integration risk in the whole skill.

## The three-way dependency

The fTPM needs persistent NV storage (seeds, monotonic counters, NV indices) in RPMB (source doc, section "The bootstrap hazard"). Replay Protected Memory Block is an eMMC storage area that can only be read and written via successfully authenticated commands, providing replay-protected storage (https://en.wikipedia.org/wiki/Replay_Protected_Memory_Block, jev weight 0.12, weak backing). In OP-TEE's normal architecture, RPMB access from a TA is routed through an RPC to tee-supplicant, the user-space helper in the normal world (https://deepwiki.com/OP-TEE/optee_client/2.2.2-rpmb-storage, jev weight 0.22, weak backing).

But the source doc deliberately deployed the fTPM as an Early TA (doc 04), and an Early TA initializes before tee-supplicant is running (source doc, section "The bootstrap hazard"). The three dependencies collide: the TA is alive before the rootfs, the RPMB path needs the supplicant, and the supplicant lives on the rootfs.

## The failure mode

An early NV write with no supplicant panics (source doc, section "The bootstrap hazard", citing OP-TEE issue #5766). The dig found the primary issue report: it describes exactly the configuration in play, where the fTPM TA is an early TA so it does not need to be loaded from the root filesystem, OP-TEE is configured to use RPMB only, and tee-supplicant is not yet up (https://github.com/OP-TEE/optee_os/issues/5766, jev weight 0.75, authoritative backing). The timing means an early NV write, with no supplicant, crashes.

A second community report shows the same class of failure from the normal-world side: the TPM driver attempts to establish a session with the fTPM early TA during boot before tee-supplicant is loaded, and a panic occurs (https://github.com/OP-TEE/optee_os/issues/7339, jev weight 0.35, weak backing). Both reports triangulate the same lesson: every path into RPMB, whether from the secure world or through a normal-world driver session, is hostage to the supplicant's start time.

## The two mitigations

The source doc gives two mitigations, usable together (source doc, section "The bootstrap hazard"):

1. Run tee-supplicant from the initramfs so it is up before Linux needs the TPM, and defer the fTPM's first persistent write until then. The initramfs is the earliest userspace that exists, so this moves the supplicant's start earlier than any consumer of /dev/tpm0.
2. Use an early in-OP-TEE RPMB path (platform-dependent) so the secure world can reach eMMC without the normal-world supplicant. This removes the RPC hop entirely, at the cost of per-platform integration work.

The dig found a dated correction worth noting: Linaro has enabled OP-TEE RPMB access directly from the Linux kernel, removing tee-supplicant from the RPMB path in that flow (https://www.linaro.org/blog/linaro-enables-op-tee-rpmb-access-directly-from-the-linux-kernel/, jev weight 0.28, weak backing). Where available, that approach is a third mitigation the source doc does not mention; it postdates the source doc's framing and does not replace the Early TA constraint, but it changes which component carries the RPMB dependency.

## Why this is the biggest integration risk

The source doc says so directly: this is the single biggest integration risk, and it must be proven on emulation (QEMU virt) in Phase F0 before touching real hardware (source doc, section "The bootstrap hazard"). The reasoning is that the failure is silent until it is catastrophic: the system boots, the fTPM answers commands, and only the first persistent write to NV storage panics the secure world. A board that passes every static check can still fail at first NV write.

The NVIDIA BlueField troubleshooting guide reinforces the dependency structure from the production side: fTPM is a TA which requires the OP-TEE transport, the entities are entirely dependent on one another, and if fTPM is not working the typical reason is that OP-TEE is malfunctioning (https://networking-docs.nvidia.com/bfswtroubleshooting/op-tee-ftpm, jev weight 0.54, authoritative backing; https://docs.nvidia.com/networking/display/bfswtroubleshooting/OP-TEE/op-tee-ftpm.pdf, jev weight 0.55, authoritative backing).

## Debug sequence

Order the debugging around the dependency chain:

1. Confirm the TA loads and opens a session early (this validates the Early TA embedding of doc 04).
2. Confirm tee-supplicant start time in the boot log relative to the first fTPM NV operation.
3. If the panic reproduces, apply mitigation 1 (initramfs supplicant) first because it is configuration, not platform code.
4. Only then consider mitigation 2 (early in-OP-TEE RPMB path), which is platform-dependent integration work.

Every external claim above carries its weight: the primary panic report at 0.75 and the NVIDIA dependency notes at 0.54 and 0.55 are authoritative backing; the RPMB mechanics (0.12), supplicant RPC description (0.22), normal-world session timing (0.35), and Linaro kernel-RPMB drift note (0.28) are weak backing.
