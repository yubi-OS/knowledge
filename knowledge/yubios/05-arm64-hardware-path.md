# ARM64 Hardware Path: RK3588 Boards, Secure-World Firmware, fTPM, and the v1 Evidence Gate

yubiOS declares ARM64 its primary target platform (ADR-023) because the mission is owner-owned trust below the UKI, and x86-64 cannot deliver that without replacing OEM firmware (https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md). The ARM64 hardware path is the track that turns that declaration into evidence: a real board proving owner-burned root of trust, secure-world firmware, RPMB-backed persistence, and a signed UKI boot. Until that proof exists, v1 readiness stays gated on hardware evidence, and every board remains classified Path B for production claims.

## Why ARM64 Path A is the hardware evidence track

ADR-017 (2026-06-24) made yubiOS multi-arch; ADR-023 (2026-07-08) made ARM64 primary, naming RK3588 Path A specifically: "Owner-owned trust below the UKI is the mission. ARM64/RK3588 can plausibly deliver this through owner-provisioned firmware and secure-world work; x86-64 cannot without replacing OEM firmware, which is out of scope" (https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md).

Path A means an owner-owned root of trust enforced before the OS is trusted: owner-provisioned ROTPK hash burned into OTP/eFuse, TF-A Trusted Board Boot rejecting anything that does not chain to it, OP-TEE as BL32, RPMB-backed secure storage, fTPM/TCG2 measurement, U-Boot UEFI Secure Boot, and the same signed yubiOS UKI used on x86-64. Path B is everything short of that: useful build-shape and integration evidence from CI or emulation, but no hardware-backed fuses, RPMB, or owner custody (https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-path-a-b-board-status-2026-07-23.md).

## The board story

ADR-029 (2026-07-16, Accepted) fixed the board names: Radxa ROCK 5B (RK3588) is the primary Path A production-root proof board; ROCKPro64 (RK3399) is the supported secondary for bring-up and regression evidence (https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md). The rationale is concentration: a single primary board keeps ROTPK/fuse, RPMB, OP-TEE, StandaloneMM, fTPM NV, and U-Boot UEFI evidence from spreading across variants before the first proof completes, while RK3399 exercises the older Rockchip secure-world lineage without blocking the RK3588 proof.

The board matrix as of the 2026-07-17 status ref (verified against live BLOCKERS.md on 2026-07-23 and refreshed 2026-09-29 with no material change):

| Board | SoC | Role | Status |
|---|---|---|---|
| Radxa ROCK 5B | RK3588 | Primary Path A board | CI run 29869527608 compiled board components but lacked the required real DDR/TPL input and the combined u-boot-rockchip.bin |
| ROCKPro64 | RK3399 | Supported secondary | Combined Rockchip images produced; physical ROTPK/fuse, RPMB, fTPM NV, recovery, signed-UKI evidence open |
| QEMU ARM64 virt | vexpress-qemu_armv8a | CI firmware baseline | fTPM/StandaloneMM boot assertions pass on both runner architectures; not proof of RPMB-backed hardware behavior |

(https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-rk-board-status-2026-07-17.md)

Both boards stay Path B for production claims until the promotion checklist is recorded in refs/: exact board model and firmware versions, ROTPK/fuse rehearsal on sacrificial hardware with read-back and abort evidence, OP-TEE with RPMB-backed storage, StandaloneMM variable persistence, fTPM NV and TCG2 visibility, U-Boot UEFI Secure Boot with owner keys, the signed yubiOS UKI booting, recovery procedures, and a statement of residual trust assumptions (https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-path-a-b-board-status-2026-07-23.md). Raspberry Pi 5 is a Path B documentation target only, because the Broadcom VideoCore firmware stays in the root chain (ADR-019 amendment, 2026-07-11).

## The firmware stack

ADR-018 (Proposed, post-launch) defines the yubiOS-owned secure-world stack: TF-A as EL3 monitor and Trusted Board Boot chain, OP-TEE as BL32, Microsoft ms-tpm-20-ref as an OP-TEE Trusted Application, U-Boot as BL33. ADR-020 adds that U-Boot provides the UEFI environment and chainloads the same systemd-boot plus UKI artifacts x86-64 uses, with Secure Boot variables stored through EDK2 StandaloneMM running as an OP-TEE module and backed by RPMB on production boards. ADR-021 (Accepted, post-launch) makes U-Boot the sole ARM64 UEFI firmware provider and rejects edk2-rk3588 as a BL33 replacement, because U-Boot integrates with TF-A plus OP-TEE and carries EFI_LOADER, Secure Boot, TCG2 measurement, and board defconfigs (https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md).

The stack is proven in QEMU first. Phase F0 (ADR-018) pins the chain: TF-A with PLAT=qemu ARCH=aarch64 SPD=opteed, OP-TEE OS PLATFORM=vexpress-qemu_armv8a (a retained correction: not vexpress-qemu_virt), the ms-tpm-20-ref fTPM as an Early TA at UUID bc50d971-d4c9-42c4-82cb-343fb7f37896 pinned to ms-tpm-20-ref commit 98b60a44aba79b15fcce1c0d1e46cf5918400f6a, U-Boot in UEFI mode with CONFIG_TPM2_FTPM_TEE=y, CONFIG_MEASURED_BOOT=y, CONFIG_EFI_LOADER=y, and Linux with CONFIG_TEE, CONFIG_OPTEE, CONFIG_TCG_TPM, CONFIG_TCG_FTPM_TEE=m (https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-ftpm-phase-f0-2026-07-23.md).

CI mirrors this. The ci_firmware-rk.yml workflow publishes board-scoped firmware tags (0mniteck/yubios:firmware-rock5b-rk3588 and firmware-rockpro64-rk3399, each with a sha tag) carrying per-board TF-A platform, OP-TEE flavor, and U-Boot defconfig. Run 29869527608 proved QEMU fTPM/StandaloneMM integration on both runner architectures and board-specific compilation, but not hardware: rock5b-rk3588 produced no u-boot-rockchip.bin (diagnostic bundle only), and rockpro64-rk3399 images await on-board evidence (https://github.com/yubi-OS/yubiOS/blob/main/refs/firmware-rk-workflow-2026-07-17.md).

## The fTPM and its two hazards

The fTPM is built as an Early TA so U-Boot and Linux can use TPM services before a root filesystem exists. That creates the identified bootstrap hazard: the first persistent NV write to RPMB can occur before tee-supplicant is available. The documented mitigation is to run tee-supplicant from initramfs or defer persistent writes until it exists (https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-ftpm-phase-f0-2026-07-23.md). RPMB-backed NV is exactly what separates the QEMU proof from the hardware proof: QEMU's volatile NV assumptions must stay visible and must never be treated as hardware evidence (https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-path-a-b-board-status-2026-07-23.md).

The measured-boot PCR convention is fixed in the same doc: PCR 0,1 for system firmware and BL31/BL32/BL33 config; PCR 7 for Secure Boot policy state; PCR 8,9 for kernel, DTB, and initramfs measured by U-Boot; PCR 10 for the IMA runtime log; PCR 16 as the debug/resettable PCR used by the F0 verifier.

The fTPM-versus-YubiKey split is a standing constraint, not a detail: the fTPM is the platform-integrity root for measured boot and attestation; the YubiKey remains the user-identity root and the primary disk-unlock path through FIDO2 hmac-secret and LUKS2 (ADR-003). If the fTPM ever became the sole disk-unlock gate, yubiOS would have recreated the on-device trust anchor it exists to avoid (https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-ftpm-phase-f0-2026-07-23.md).

## ADR-018/019/020 posture

All three carry "Proposed - post-launch (see FUTURE.md)" status in docs/ADR.md. ADR-019 defines the dual provisioning paths: Path A is fuse-enforcing (owner-burned ROTPK hash, full TBB, BL1 rejects unchained images); Path B is measured plus attested (software root via U-Boot FIT verified boot, trust decided after boot by attestation and secret release), with the honest framing that compromised code in Path B may execute long enough to measure itself (https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md). The 2026-09-09 Linear-state refresh records these architecture decisions as unchanged since the 2026-07-30 post-launch deferral (https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-path-a-status-2026-09-09.md).

## DDR/TPL blob constraints and the sacrificial burn

Blocker B-RK3588-TPL is the concrete hardware gate on the ROCK 5B lane: run 29869527608 compiled the RK3588 components but U-Boot requires a real external DDR/TPL blob, so the published bundle is diagnostic packaging, not a flashable image. The resolution path recorded in BLOCKERS.md is: select a legally redistributable source, pin its immutable ref and checksum, fail closed when it is absent, and prove the resulting combined image on sacrificial ROCK 5B hardware (https://github.com/yubi-OS/yubiOS/blob/main/docs/BLOCKERS.md). The Linear items are OMN-56 (select and pin a redistributable RK3588 DDR/TPL source), OMN-57 (fail closed when the expected blob is absent), and OMN-58 (validate the combined ROCK 5B/RockPro64 image on sacrificial hardware) (https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-path-a-status-2026-09-09.md).

B-ARM64-PATHA is the parent blocker: Path A is not production until a real board proves ROTPK/fuse provisioning, OP-TEE, RPMB-backed StandaloneMM variables, fTPM NV, U-Boot UEFI, and signed UKI boot (https://github.com/yubi-OS/yubiOS/blob/main/docs/BLOCKERS.md). The rehearsal items are OMN-45 (rehearse sacrificial ROTPK and fuse provisioning) and OMN-141 (schedule the sacrificial RK3588 burn and name a human owner); OMN-46 captures the OP-TEE/RPMB/fTPM/U-Boot evidence and OMN-47 the signed UKI boot on the target board (https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-path-a-status-2026-09-09.md). No CI runner can do the burn: it needs the physical board in hand (https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-path-a-omn36-lapse-2026-09-13.md).

## v1 readiness is gated on this evidence

OMN-36 ("Prove ARM64 Path A production flow on real hardware") gates the v1 launch claim. It was verified in Backlog with dueDate 2026-09-12 on 2026-09-09, and the due date lapsed with the issue still in Backlog as of the 2026-09-13 refresh, the third consecutive slip of a launch-gating item. The recorded decision owed: either re-date OMN-36 with a committed burn schedule, or formally split the launch gate, keeping v1 on the VM-level evidence chain (OMN-53 lane, FIDO2 hardware leg via Issue #20) and tracking the RK3588 burn as post-launch hardening (https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-path-a-omn36-lapse-2026-09-13.md). Milestone 1 of the four-milestone plan ("ARM64 Path A production proof") stood at 0 percent with no work in flight as of 2026-07-28 (https://github.com/yubi-OS/yubiOS/blob/main/docs/MILESTONE.md).

## Sources considered

- https://github.com/yubi-OS/yubiOS/blob/main/docs/ADR.md (ADR-017, 018, 019, 020, 021, 023, 029)
- https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-rk-board-status-2026-07-17.md
- https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-path-a-b-board-status-2026-07-23.md
- https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-path-a-status-2026-09-09.md
- https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-path-a-omn36-lapse-2026-09-13.md
- https://github.com/yubi-OS/yubiOS/blob/main/refs/firmware-rk-workflow-2026-07-17.md
- https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-ftpm-phase-f0-2026-07-23.md
- https://github.com/yubi-OS/yubiOS/blob/main/refs/frost-panfrost-lockout-2026-07-17.md
- https://github.com/yubi-OS/yubiOS/blob/main/docs/BLOCKERS.md
- https://github.com/yubi-OS/yubiOS/blob/main/docs/MILESTONE.md
- searXNG dig (1 attempted query, "RK3588 U-Boot DDR TPL blob licensing 2026"): 0 results, all engines unresponsive (brave and google cse suspended, duckduckgo timeout); engine-recovered results: none
