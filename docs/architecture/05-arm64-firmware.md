# 05. ARM64 secure-world firmware: TF-A, OP-TEE, fTPM, U-Boot

Scope: the ARM64 firmware chain on Path A, the three workflow-built firmware variants, and the evidence boundaries between them.

Grounding spine: source doc `yubi-OS/yubiOS docs/ARCHITECTURE.md`.

## The secure-world chain

The source doc's ARM64 primary path records seven steps (source doc):

1. The boot ROM verifies an owner-burned ROTPK hash when the board supports Path A.
2. TF-A BL1 and BL2 verify BL31, OP-TEE BL32, and U-Boot BL33.
3. OP-TEE hosts StandaloneMM and the fTPM trusted application; RPMB backs secure variables and TPM NV state on production boards.
4. U-Boot provides UEFI services, Secure Boot variable handling, and measured boot into the fTPM.
5. systemd-boot loads the same signed UKI used on x86-64.
6. In the sealed bootc target, the signed UKI binds the composefs digest and the bootc initramfs assembles the verified root.
7. Root, swap, and user homes unlock through YubiKey FIDO2 plus recovery material.

This matches ARM's own Trusted Board Boot design: TBB authenticates all firmware images up to and including the normal-world bootloader by establishing a chain of trust rooted in a ROTPK, and rejects any image that fails verification (https://tf-a.docs.trustedfirmware.org/en/latest/design/trusted-board-boot.html, jev weight 0.71; mirrored in the ARM-software repository at https://github.com/ARM-software/arm-trusted-firmware/blob/master/docs/design/trusted-board-boot.rst, jev weight 0.74). Building that chain produces bl1.bin and fip.bin, with the FIP containing the certificates for the selected chain of trust (https://tf-a.docs.trustedfirmware.org/en/latest/design/trusted-board-boot-build.html, jev weight 0.73; the ARM-software mirror of the same document carries jev weight 0.8 at https://github.com/ARM-software/arm-trusted-firmware/blob/master/docs/design/trusted-board-boot-build.rst). The ARM Platform Security Architecture specification for Trusted Boot and Firmware Update defines the security architecture and technical requirements behind that model (https://developer.arm.com/-/media/Arm%20Developer%20Community/PDF/PSA/DEN0072-PSA_TBFU_1.1-BETA0.pdf, jev weight 0.86).

## The fTPM inside OP-TEE

The fTPM is the ms-tpm-20-ref TPM 2.0 reference implementation running as an OP-TEE Trusted Application (source doc). The OP-TEE integration repository states that the fTPM Trusted Application provides a secure firmware implementation of a TPM using the MS reference implementation, with platform-specific integration code kept in that repository (https://github.com/OP-TEE/optee_ftpm, jev weight 0.27, weak backing). The Microsoft MSRSec repository documents the platform API swap-in: the TPM reference implementation defines a platform API that can be swapped depending on where the TPM code runs, and for fTPM the OP-TEE API is used (https://github.com/microsoft/MSRSec/blob/master/TAs/optee_ta/fTPM/README.md, jev weight 0.32, weak backing). An upstream U-Boot patch series enabling fTPM and RPMB support for K3 platforms describes the same integration steps: generate the fTPM TA binary using ms-tpm-20-ref and optee_ftpm (https://lists.denx.de/pipermail/u-boot/2026-March/612466.html, jev weight 0.49, weak backing).

Alongside fTPM, OP-TEE hosts StandaloneMM, which handles UEFI variable services (PK, KEK, db, dbx) backed by RPMB storage on production boards (source doc).

## The three firmware variants

The ci_firmware-rk.yml workflow builds the same pinned secure-world components for three variants on native amd64 and arm64 runners (source doc). StandaloneMM is built once per runner architecture plus a second clean ARM64 build with deterministic EDK2 stack-cookie inputs; each variant selects its own TF-A platform, OP-TEE flavor, and U-Boot defconfig, and also receives a clean arm64-repro build. A blocking job compares the intended unsigned components and retains board-scoped evidence before QEMU runs. Only the QEMU variant executes the emulated fTPM boot assertions; its randomly generated TF-A certificate envelope is recorded but excluded from equality checks, and compiling or publishing a board bundle is not physical-board proof (source doc).

The evidence table from run 29869527608 (source doc):

| Variant | Principal output | Evidence | Promotion boundary |
|---|---|---|---|
| qemu-arm64 | flash.bin (TF-A PLAT=qemu, OP-TEE vexpress-qemu_armv8a, qemu_arm64_defconfig) | Both runner architectures found the fTPM Early TA, functional TPM, and StandaloneMM SP with no known failure signatures | CI baseline only; volatile emulated storage is not RPMB or owner-owned hardware |
| rock5b-rk3588 | intended u-boot-rockchip.bin | Components compiled, but no real RK3588 DDR/TPL blob was present, so no combined image was produced | Block publication as bootable firmware until a pinned, licensed, checksum-verified DDR/TPL input and real-board evidence exist |
| rockpro64-rk3399 | u-boot-rockchip.bin and SPI image plus idbloader.img and u-boot.itb | Native build artifacts include combined Rockchip U-Boot images plus OP-TEE, StandaloneMM, and fTPM inputs | Needs physical boot, RPMB-backed variable and fTPM NV, ROTPK, recovery, and signed-UKI evidence |

## The QEMU oracle

The QEMU path is the integration oracle for component wiring: it assembles bl1.bin, fip.bin, OP-TEE, StandaloneMM, the fTPM Early TA, and U-Boot into flash.bin, then Stage 3 boots that image and checks the secure- and normal-world logs. Its compatibility tags are firmware-qemu-arm64[-<sha>] plus firmware[-<sha>] (source doc).

## The ROCK 5B blocker

U-Boot's RK3588 configuration requires an external DDR/TPL blob. In the reviewed run that input was absent, so u-boot.bin is diagnostic compile evidence only and the expected combined u-boot-rockchip.bin was not produced. The current OCI bundle must not be described as flash-ready or as a Path A proof (source doc).

## Reading the lanes correctly

The lanes form an evidence ladder: QEMU proves wiring, RK3399 proves build shape, and only physical-board work with ROTPK, RPMB, fTPM NV, and signed-UKI evidence can prove Path A production readiness (source doc). Any claim about "yubiOS firmware" should name which rung it stands on.
