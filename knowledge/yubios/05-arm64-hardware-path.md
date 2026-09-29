# ARM64 Hardware Path: RK3588 Boards, Secure-World Firmware, fTPM, and the OMN-36 Gate

yubiOS declares ARM64 its primary target platform because the mission is owner-owned trust below the UKI, and x86-64 cannot deliver that without replacing OEM firmware. This doc covers the ARM64 hardware path that turns that declaration into evidence: the RK3588 board story (ROCK 5B primary, ROCKPro64 secondary), the yubiOS-owned secure-world firmware stack (TF-A, OP-TEE, U-Boot), the ms-tpm-20-ref fTPM as an OP-TEE Trusted Application, the Path A vs Path B classification that keeps production language off unproven hardware, the DDR/TPL blob constraint that makes the ROCK 5B CI bundle diagnostic rather than flashable, and the OMN-36 launch gate that v1 readiness hinges on.

## Why ARM64 and why Path A

ADR-017 (2026-06-24) made yubiOS multi-arch; ADR-023 (2026-07-08, Accepted) made ARM64 primary, naming RK3588 Path A specifically: "Owner-owned trust below the UKI is the mission. ARM64/RK3588 can plausibly deliver this through owner-provisioned firmware and secure-world work; x86-64 cannot without replacing OEM firmware, which is out of scope" (https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md).

ADR-019 (Proposed, post-launch) defines the two provisioning paths. Path A is fuse-enforcing: owner-burned ROTPK hash in OTP/eFuse, full TF-A Trusted Board Boot, BL1 rejects any image that does not chain to it. Path B is measured plus attested: software root via U-Boot FIT verified boot, measured boot into the fTPM, trust decided after boot by attestation and secret release. ADR-019's honest framing is that Path B records what ran and can withhold secrets when measurements are wrong, but compromised code may execute long enough to measure itself (https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md).

The RK3588 hardware actually supports Path A's premise: the BootROM verifies the public RSA key in the firmware image against a hash stored in OTP eFuses, and that behavior is hard-coded and cannot be changed (https://pengutronix.de/en/blog/2026-06-19-rk3588-secure-boot.html, verified directly; dig weight 0.03 in the mint's own dig was rejected, the same source was weighted 0.85 in the repo's 2026-09-29 refresh of the board status doc). Community tooling for enabling RK3588 secure boot exists but with little public documentation (https://github.com/DualTachyon/rk3588-secure-boot, jev 0.63).

## The board story

ADR-029 (2026-07-16, Accepted) fixed the board names: Radxa ROCK 5B (RK3588) is the primary Path A production-root proof board, ROCKPro64 (RK3399) is the supported secondary for bring-up and regression evidence. The rationale is concentration: one primary board keeps ROTPK/fuse, RPMB, OP-TEE, StandaloneMM, fTPM NV, and U-Boot UEFI evidence from spreading across variants before the first proof completes, while RK3399 exercises the older Rockchip secure-world lineage without blocking the RK3588 proof (https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md).

The board matrix, verified against live BLOCKERS.md on 2026-07-23 and refreshed 2026-09-29 with no material change (https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-rk-board-status-2026-07-17.md, https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-path-a-b-board-status-2026-07-23.md):

| Board | SoC | Role | Status |
|---|---|---|---|
| Radxa ROCK 5B | RK3588 | Primary Path A board | Run 29869527608 compiled board components but lacked the real DDR/TPL input and combined u-boot-rockchip.bin |
| ROCKPro64 | RK3399 | Supported secondary | Combined Rockchip images produced; physical ROTPK/fuse, RPMB, fTPM NV, recovery, signed-UKI evidence open |
| QEMU ARM64 virt | vexpress-qemu_armv8a | CI firmware baseline | fTPM/StandaloneMM boot assertions pass on both runner architectures; not proof of RPMB-backed hardware behavior |

Raspberry Pi 5 is a Path B documentation target only, because the Broadcom VideoCore firmware stays in the root chain (ADR-019 amendment 2026-07-11, https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md).

## The firmware stack

ADR-018 (Proposed, post-launch) defines the yubiOS-owned secure-world stack: TF-A as EL3 monitor and Trusted Board Boot chain, OP-TEE as BL32, the Microsoft ms-tpm-20-ref fTPM as an OP-TEE Trusted Application, U-Boot as BL33. ADR-020 adds that U-Boot provides the UEFI environment and chainloads the same systemd-boot plus UKI artifacts x86-64 uses, with Secure Boot variables stored through EDK2 StandaloneMM running as an OP-TEE module backed by RPMB on production boards. ADR-021 (Accepted, post-launch) makes U-Boot the sole ARM64 UEFI firmware provider and rejects edk2-rk3588 as a BL33 replacement, because U-Boot integrates with TF-A plus OP-TEE and carries EFI_LOADER, Secure Boot, TCG2 measurement, and board defconfigs (https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md).

The stack is proven in QEMU first (Phase F0, per ADR-018). The pins: TF-A with PLAT=qemu ARCH=aarch64 SPD=opteed; OP-TEE OS PLATFORM=vexpress-qemu_armv8a (a retained correction: not vexpress-qemu_virt, though the QEMU machine is still virt); ms-tpm-20-ref as an Early TA at UUID bc50d971-d4c9-42c4-82cb-343fb7f37896 pinned to commit 98b60a44aba79b15fcce1c0d1e46cf5918400f6a; U-Boot in UEFI mode with CONFIG_TPM2_FTPM_TEE=y, CONFIG_MEASURED_BOOT=y, CONFIG_EFI_LOADER=y; Linux with CONFIG_TEE, CONFIG_OPTEE, CONFIG_TCG_TPM, CONFIG_TCG_FTPM_TEE=m (https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-ftpm-phase-f0-2026-07-23.md). The pin matches upstream guidance: the OP-TEE fTPM integration instructs building against exactly commit 98b60a44aba79b15fcce1c0d1e46cf5918400f6a of ms-tpm-20-ref (https://github.com/OP-TEE/optee_ftpm, verified directly; dig weight 0.31).

CI mirrors the stack. The ci_firmware-rk.yml workflow publishes board-scoped firmware tags under 0mniteck/yubios (firmware-rock5b-rk3588, firmware-rockpro64-rk3399, firmware-qemu-arm64, each with a sha variant) carrying per-board TF-A platform, OP-TEE flavor, and U-Boot defconfig. Run 29869527608 proved QEMU fTPM/StandaloneM integration on both runner architectures and board-specific compilation, but no physical hardware proof was recorded (https://github.com/yubi-OS/yubiOS/blob/main/refs/firmware-rk-workflow-2026-07-17.md).

## The fTPM and its hazards

The fTPM is built as an Early TA so U-Boot and Linux can use TPM services before a root filesystem exists. That creates the documented bootstrap hazard: the first persistent NV write to RPMB can occur before tee-supplicant is available. The mitigation is to run tee-supplicant from initramfs or defer persistent writes until it exists (https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-ftpm-phase-f0-2026-07-23.md). This is not hypothetical: third-party root-cause analysis documents that the fTPM is userspace/RPMB-gated on other platforms, a known OP-TEE limitation reportedly fixed in Linux 6.12 (version-sensitive, https://github.com/10GiC10V38/jetson-ima-attestation, jev 0.78).

The measured-boot PCR convention is fixed in the same doc: PCR 0,1 for system firmware and BL31/BL32/BL33 config; PCR 7 for Secure Boot policy state; PCR 8,9 for kernel, DTB, and initramfs measured by U-Boot; PCR 10 for the IMA runtime log; PCR 16 as the debug/resettable PCR used by the F0 verifier. Upstream, the fTPM TA supports measured boot by reading a TCG EFI Protocol event log during TA initialization, requiring the PTA_SYSTEM_GET_TPM_EVENT_LOG system call (https://github.com/OP-TEE/optee_ftpm, verified directly).

The fTPM-versus-YubiKey split is a standing constraint: the fTPM is the platform-integrity root for measured boot and attestation; the YubiKey remains the user-identity root and primary disk-unlock path through FIDO2 hmac-secret and LUKS2. If the fTPM became the sole disk-unlock gate, yubiOS would recreate the on-device trust anchor it exists to avoid (https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-ftpm-phase-f0-2026-07-23.md).

## Path A vs Path B classification

Path A means owner-owned root of trust enforced before the OS is trusted: owner-provisioned ROTPK, TF-A Trusted Board Boot, OP-TEE, RPMB-backed secure storage, fTPM/TCG2 measurement, U-Boot UEFI Secure Boot, and the same signed yubiOS UKI used on x86-64. Path B means useful development, measurement, or attestation evidence without a fully owner-enforced boot-time rejection path. No board may use production language until fuse/provisioning state, debug lockdown, RPMB behavior, Secure Boot variables, recovery behavior, and UKI boot evidence are recorded in refs/. The promotion checklist names nine required evidence items, including read-back evidence and abort/recovery behavior for the fuse rehearsal (https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-path-a-b-board-status-2026-07-23.md). Until then, ROCK 5B and ROCKPro64 stay Path B for production claims (https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-rk-board-status-2026-07-17.md).

## The DDR/TPL blob constraint (B-RK3588-TPL)

Blocker B-RK3588-TPL is the concrete hardware gate on the ROCK 5B lane: run 29869527608 compiled the RK3588 components but U-Boot requires a real external DDR/TPL blob, so the published bundle lacked u-boot-rockchip.bin and its green publish job is diagnostic packaging, not a flashable image. The recorded resolution path: select a legally redistributable source, pin its immutable ref and checksum, fail closed when it is absent, and prove the resulting combined image on sacrificial ROCK 5B hardware (https://github.com/yubi-OS/yubiOS/blob/main/docs/BLOCKERS.md). Third-party pre-built signed U-Boot bundles for mainline Rockchip boards still consume the rkbin DDR/TPL blob, so they do not resolve the licensed-blob dependency (recorded in the repo's 2026-09-29 refresh at jev noul 0.38; excluded from this doc's dig as a 0.25 result, aggregator-grade).

## The v1 launch gate (OMN-36)

OMN-36 ("Prove ARM64 Path A production flow on real hardware") gates the v1 launch claim, which is defined as "v1 readiness gated on ARM64 Path A hardware evidence". The 2026-09-09 Linear-state refresh found the item in Backlog with dueDate 2026-09-12 and no human owner; the 2026-09-13 refresh confirmed the due date lapsed with the issue still in Backlog, the third consecutive slip of a launch-gating item (June 4 launch target deferred, OMN-141 sacrificial burn still unscheduled). No CI runner can do the burn; it needs the physical board in hand. The recorded decision owed: either re-date OMN-36 with a committed burn schedule, or formally split the launch gate, keeping v1 on the VM-level evidence chain (OMN-53 lane green, FIDO2 hardware leg passed via Issue #20) and tracking the RK3588 burn as post-launch hardening (https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-path-a-status-2026-09-09.md, https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-path-a-omn36-lapse-2026-09-13.md). The children: OMN-45 (sacrificial ROTPK/fuse rehearsal), OMN-46 (OP-TEE/RPMB/fTPM/U-Boot evidence on hardware), OMN-47 (signed UKI boot on target board), OMN-56/57/58 (DDR/TPL source selection, fail-closed, combined-image validation), OMN-141 (schedule the burn and name a human owner). Milestone 1 stood at 0 percent with no work in flight as of 2026-07-28 (https://github.com/yubi-OS/yubiOS/blob/main/docs/MILESTONE.md).

## Sources considered

Used:
- https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md (ADR-017, 018, 019, 020, 021, 023, 029)
- https://github.com/yubi-OS/yubiOS/blob/main/docs/BLOCKERS.md (B-ARM64-PATHA, B-RK3588-TPL)
- https://github.com/yubi-OS/yubiOS/blob/main/docs/MILESTONE.md (Milestone 1, OMN-36 ownership)
- https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-rk-board-status-2026-07-17.md
- https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-path-a-b-board-status-2026-07-23.md
- https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-path-a-status-2026-09-09.md
- https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-path-a-omn36-lapse-2026-09-13.md
- https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-ftpm-phase-f0-2026-07-23.md
- https://github.com/yubi-OS/yubiOS/blob/main/refs/firmware-rk-workflow-2026-07-17.md
- https://pengutronix.de/en/blog/2026-06-19-rk3588-secure-boot.html (verified directly; dig weight 0.03 rejected, corroborated at 0.85 in repo refresh)
- https://github.com/OP-TEE/optee_ftpm (verified directly; dig weight 0.31)
- https://github.com/DualTachyon/rk3588-secure-boot (jev 0.63)
- https://github.com/10GiC10V38/jetson-ima-attestation (jev 0.78; version-sensitive Linux 6.12 claim flagged)

Rejected:
- https://deepwiki.com/OP-TEE/optee_ftpm/8.1-event-logging-and-measured-boot (aggregator)
- https://deepwiki.com/rockchip-linux/rkbin/8.3-secure-boot-configuration (aggregator)
- https://cfp.embedded-recipes.org/er2026/talk/ULWYUJ/ (conference listing)
- https://www.youtube.com/watch?v=PSEJD4Bfnyw (video, not fetched)
- https://github.com/microsoft/MSRSec/blob/master/TAs/optee_ta/fTPM/README.md (low weight 0.15)
- https://forums.developer.nvidia.com/t/measured-boot-implementation-with-op-tee-and-tf-a-on-jetson-orin-nano/327780 (forum, low weight)
- https://skillsmp.com/creators/yubi-os/yubios/skills-ftpm-optee-tpm (mirror of internal skill)
- https://github.com/schneid-l/u-boot-rockchip (third-party, aggregator-grade at 0.25)
