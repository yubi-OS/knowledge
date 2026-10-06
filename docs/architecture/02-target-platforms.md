# 02. Target platforms: three stances, one trust question

Scope: the three platform tiers yubiOS supports, what each can honestly claim, and why the split exists.

Grounding spine: source doc `yubi-OS/yubiOS docs/ARCHITECTURE.md`.

## The platform table

The source doc defines three platform stances (source doc):

| Platform | Priority | Trust-chain stance | Current use |
|---|---|---|---|
| ARM64 RK3588 Path A | Primary | Owner-burned ROTPK, TF-A Trusted Board Boot, OP-TEE, fTPM, U-Boot UEFI, signed UKI | Flagship target and post-launch hardware bring-up |
| ARM64 Path B boards | Primary development | FIT verification plus measured and attested boot where fuses are unavailable or unsafe | CI and board bring-up rehearsal |
| x86-64 | Secondary, supported | Owner-enrolled UEFI Secure Boot above OEM firmware; optional TPM or fTPM for measurement only | VM CI, developer installs, compatibility |

The single axis behind the table is ownership of the platform root. Path A boards let the owner burn a root-of-trust public key hash into on-chip OTP or eFuse storage, which anchors the whole firmware chain in material the owner controls. Path B boards do not, so they fall back to verifying and measuring boot artifacts and deferring the trust decision to after boot. x86-64 never offers fuse ownership, so the owner enrolls keys into UEFI Secure Boot databases above OEM firmware instead.

## Path A: owner-burned root on RK3588

The RK3588 is the flagship Path A target alongside the RK3399 (RockPro64) and Ampere boards listed in the source doc (source doc). Rockchip's own Secure Boot Application Note describes the mechanism: a secure boot feature verifies firmware validity to prevent invalid firmware upgrades and booting of untrusted images (http://resource.milesight-iot.com/files/Rockchip-Secure-Boot-Application-Note-V1.9.pdf, jev weight 0.43, weak backing). The same material is mirrored in Rockchip's open documentation under the rk-open-docs repository (https://github.com/mfkiwl/rk-open-docs/blob/master/NVM/Rockchip_Developer_Guide_Secure_Boot_Application_Note_EN.md, jev weight 0.23, weak backing). Rockchip is the SoC vendor behind the RK3588 (https://www.rock-chips.com/a/en/, jev weight 0.44, weak backing).

Third-party work confirms the feature exists but is thinly documented publicly. The rk3588-secure-boot project states that the RK3588 family can enable Secure Boot so only approved bootloaders run, while noting there is very little public information on how to do so and that the author reverse engineered parts (https://github.com/DualTachyon/rk3588-secure-boot, jev weight 0.15, weak backing). A hardware walkthrough of the RK3588 boot process describes the sequence as boot ROM first stage, then secondary program loader, then tertiary loader, matching the shape the source doc assumes (https://soliddowant.github.io/2024/01/23/rk3588-cluster-4, jev weight 0.12, weak backing).

This weak external backing is exactly why the source doc gates Path A claims on real-board evidence: the Open Edges section states ARM64 Path A still needs real-board fuse and RPMB validation before being claimed as a production hardware route (source doc).

## Path B: measure and attest instead of enforce

When fuses are unavailable or unsafe to burn, Path B uses U-Boot FIT verified boot with the key held in a control device tree, measures artifacts into fTPM PCRs, and decides trust after boot (source doc). The source doc names RPi 5 as a Path B target where VideoCore closes the owner root of trust, and dev boards and early bring-up generally (source doc). The practical difference: Path A rejects bad code before it ever runs; Path B lets everything boot but records enough measurements that a remote verifier or local policy can refuse to release secrets afterward.

## x86-64: supported, not flagship

On x86-64 the owner enrolls UEFI Secure Boot keys above OEM firmware, uses TPM or fTPM for measurement only, and follows the same immutable, FIDO2-gated runtime model as ARM64 (source doc). Red Hat's long-running documentation describes UEFI Secure Boot as the mechanism by which a system ensures the kernel and bootloader binaries are signed by a trusted authority (https://access.redhat.com/articles/1180943, jev weight 0.47, weak backing). Key management in this world follows the PK, KEK, db structure of UEFI; Microsoft's OEM-oriented guidance covers creating and managing those keys in a manufacturing environment (https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/windows-secure-boot-key-creation-and-management-guidance, jev weight 0.43, weak backing). The x86 platform family itself is defined at the instruction-set level rather than by any specific firmware vendor (https://en.wikipedia.org/wiki/X86, jev weight 0.28, weak backing).

## Why the tiers matter for review and CI

The source doc's status line says ARM64 is primary and x86-64 secondary and supported (source doc). Read with the platform table, the operational rule that falls out is: claims about boot security strength must name their tier. A statement that "yubiOS boots only signed code" is a Path A claim. On Path B it is "yubiOS measures everything and gates secrets on the measurement." On x86-64 it is "yubiOS enforces signed UKIs at the UEFI layer, above firmware the owner does not control." CI triage should use the same vocabulary: the QEMU firmware lane is a wiring oracle, the ROCK 5B lane is blocked on a DDR/TPL input, and the ROCKPro64 lane has build shape but no physical proof (source doc).
