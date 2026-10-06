# 02. Milestone F: ARM64 Owner-Owned Root Of Trust

Scope: Milestone F is the ledger's flagship bet, proving the production Path A story (owner-owned root of trust, boot-time rejection of unverified artifacts) on real ARM64 hardware: ROCK 5B / RK3588 as primary board, ROCKPro64 / RK3399 as supported secondary.

## The milestone's shape

The goal statement is narrow and testable: "prove the production Path A story on real ARM64 hardware" (source doc, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md). Seven numbered steps define the path from board selection to production language, and each step exists to close a specific evidence gap:

1. Radxa ROCK 5B / RK3588 is selected as primary; ROCKPro64 / RK3399 is supported secondary. The selection is recorded in ADR-029 (source doc).
2. The ROCK 5B DDR/TPL input must be resolved with a licensed, immutable, checksum-verified blob, and a real `u-boot-rockchip.bin` is required before the bundle can be called bootable (source doc). This targets the classic Rockchip weakness: closed-source DRAM init blobs that sit below any verifiable chain.
3. TF-A Trusted Board Boot and ROTPK provisioning are rehearsed on sacrificial hardware before production boards are touched (source doc).
4. OP-TEE, StandaloneMM, RPMB-backed UEFI variables, and the ms-tpm-20-ref fTPM are brought up (source doc).
5. U-Boot UEFI Secure Boot and TCG2 measurement into the fTPM are validated (source doc).
6. The same signed yubiOS UKI used by x86-64 is booted, and `/usr` verification plus FIDO2 unlock are proven (source doc).
7. Exact board provisioning evidence is documented before any production language is used (source doc).

## How the dig sources map onto the steps

TF-A's Trusted Board Boot design documentation describes the certificate-chain mechanism the milestone rehearses: a root of trust public key (ROTPK) anchored in the platform, verified certificates for each boot stage, and the BL2/BL31 chain that makes "trusted board boot" more than a slogan (weight 0.88, https://tf-a.docs.trustedfirmware.org/en/latest/design/trusted-board-boot.html). The upstream design document in the arm-trusted-firmware repository carries the same content in its canonical form (weight 0.77, https://github.com/ARM-software/arm-trusted-firmware/blob/master/docs/design/trusted-board-boot.rst), and the TF-A Rockchip platform port page documents the SoC-specific side of that port (weight 0.82, https://tf-a.docs.trustedfirmware.org/en/latest/plat/rockchip.html). Together they are the reference material for step 3.

Steps 4 and 5 rest on U-Boot's UEFI implementation. The U-Boot project's UEFI documentation covers the UEFI boot path, secure boot, and variable handling that the milestone validates on RK3588 (weight 0.79, https://docs.u-boot-project.org/en/latest/develop/uefi/uefi.html; stable branch copy weight 0.81, https://docs.u-boot-project.org/en/stable/develop/uefi/uefi.html). A real RK3588 U-Boot board port (the Theobroma SOM-RK3588-Q7 Tiger) shows what a production-grade RK3588 U-Boot target looks like in-tree (weight 0.73, https://docs.u-boot-project.org/en/v2026.10/board/theobroma-systems/tiger_rk3588.html). Weaker backing (weight 0.26, https://apalos.github.io/Protected%20UEFI%20variables%20with%20U-Boot.html) discusses protected UEFI variables with U-Boot, adjacent to the milestone's RPMB-backed variable requirement but not an official source; treat it as background only.

The measured-boot chain across TF-A, OP-TEE, U-Boot, and Linux is covered by an independent write-up at weak weight (weight 0.21, https://raymo200915.github.io/2024/12/10/Measured-Boot-and-TPM-Eventlog.html), and a DeepWiki-derived summary of U-Boot EFI secure boot and variables is also weak (weight 0.22, https://deepwiki.com/u-boot/u-boot/8.3-efi-secure-boot-and-variables). A DeepWiki page on Rockchip rkbin secure boot configuration is weak as well (weight 0.31, https://deepwiki.com/rockchip-linux/rkbin/8.3-secure-boot-configuration). These are labeled weak: useful orientation, not citation-grade.

## Path B stays honest

The doc keeps Path B (evidence-and-sealing) useful for measured and attested development and CI, but explicitly requires it to be "described as evidence-and-sealing rather than boot-time rejection" (source doc, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md). That wording is a guardrail against scope creep: Path B may collect the same measurements, but it must not be marketed as enforcing the Path A property it does not have.

## What promotion requires

The last step is the strongest: no production language until exact board provisioning evidence exists (source doc). Combined with the DDR/TPL blob requirements in step 2, the milestone treats the lowest layers of the stack as the ones that decide trustworthiness, and the dig confirms the upstream documentation exists to support each rehearsal step (TF-A TBB at 0.88, Rockchip platform port at 0.82, U-Boot UEFI at 0.79 to 0.81).

## Sources for this doc

Ground spine: yubi-OS/yubiOS `docs/FUTURE.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md), fetched 2026-10-06. Dig results weighted by jev noul as cited inline; 12 results kept, 6 with weight 0.5 or higher.
