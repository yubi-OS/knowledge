# 07: The ARM64 strategic stance

Scope: why ARM64 is the primary platform (the owner-controllable trust chain below the UKI) and what the source doc says about x86-64 support.

## What the source doc claims

The source doc (yubi-OS/yubiOS docs/MISSION.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/MISSION.md) states the strategic stance: "ARM64 is the primary platform because it is where yubiOS can realistically own the trust chain below the UKI: owner-provisioned board root, TF-A, OP-TEE, fTPM, U-Boot UEFI, systemd-boot, signed UKI, and verified /usr" (source doc). x86-64 remains supported, "but its lower firmware layers remain OEM-controlled" (source doc).

The claim is platform-structural, not preference: on ARM64 the whole chain from the board's root key upward can be owner-provisioned, which is what lets every layer be verified rather than trusted (source doc).

## The chain, grounded in the dig set

The dig set documents the open-source firmware stack the source doc names. All weights are weak (< 0.5).

- Trusted Firmware-A (TF-A) is documented as a reference implementation of secure-world software for Armv7-A and Armv8-A, including a Secure Monitor executing at EL3 (https://tf-a.docs.trustedfirmware.org/, weight 0.17, weak; project page https://www.trustedfirmware.org/projects/tf-a/, weight 0.25, weak; source mirror https://github.com/ARM-software/arm-trusted-firmware, weight 0.23, weak).
- OP-TEE's secure-boot documentation describes TF-A integration and recommends using TF-A's BL2 as the secure boot stage (https://optee.readthedocs.io/en/latest/architecture/secure_boot.html, weight 0.32, weak).
- A vendor boot-chain walkthrough (Texas Instruments AM64X) shows the real-world staging the source doc describes: an R5 SPL loads a second-stage FIT image containing TF-A, OP-TEE, and A53 SPL (https://software-dl.ti.com/processor-sdk-linux/esd/AM64X/latest/exports/docs/linux/Foundational_Components_Secure_Boot.html, weight 0.18, weak), evidence that TF-A plus OP-TEE chained boot is shipping practice on ARM64 boards, not a diagram.
- A bootloader introduction covers the U-Boot boot chain on ARM and ARM64 (https://labcsmart.com/introduction-to-bootloaders-from-power-on-to-linux-on-arm-and-arm64/, weight 0.08, weak), the U-Boot UEFI stage in the source doc's chain.
- One collected result was off-topic (https://meanovia.com/tf-meaning-in-text/, weight 0.03) and one, GrapheneOS's features page (https://grapheneos.org/features, weight 0.09), documents a phone-oriented verified-boot posture that is adjacent but not cited substantively here.

The fTPM and board-root stages are carried by the source doc and by related yubiOS skills; this dig did not return fTPM-specific sources, which is recorded as a gap (see README).

## Why "realistically own" is doing the work

The source doc's word choice matters: the question is not whether x86-64 can boot securely, but who controls the layers below the UKI there. On typical x86-64 machines the OEM controls the lower firmware layers (source doc), so the owner-provisioned root the mission requires (doc 05) cannot be established below the UKI. ARM64 boards, by contrast, ship with flashable, documented firmware stages: the TI example above shows each stage (SPL, TF-A, OP-TEE) being loaded and configured explicitly (weight 0.18, weak).

This stance is also what makes the success criteria testable. The source doc's "What Success Looks Like" requires that "ARM64 Path A hardware can prove the owner-controlled secure-world chain on real boards, not just in diagrams" (source doc), and separately requires that x86-64 "remains useful and supported without pretending it delivers the same owner-owned hardware root" (source doc). The dig evidence on real board boot chains (weak but concrete) is the kind of demonstration the first criterion points at.

## Corollary for the mission statement

The platform stance closes the loop with the AI-resilience definition: a poisoned contribution "never had the authority to matter" only if no OEM-controlled stage sits between the owner's keys and the boot path (source doc). That is why platform choice is a mission-level decision in this doc and not a porting detail (source doc).

## Sources note

Results kept for this subtopic: 8, of 8 weighted. Primary-backing count (weight >= 0.5): 0; the strongest results are the OP-TEE secure-boot documentation at weight 0.32, the TrustedFirmware-A project page at weight 0.25, and the ARM-software TF-A mirror at weight 0.23. Two of eight results were off-topic or only adjacent and are archived without citation. The chain stages themselves (owner-provisioned board root, fTPM, systemd-boot, signed UKI) are carried by the source doc; the dig grounded the TF-A, OP-TEE, and U-Boot stages and one real-vendor boot-flow example. fTPM-specific sourcing is recorded as a gap in the README.
