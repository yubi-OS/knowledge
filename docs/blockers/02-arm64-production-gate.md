# 02 - ARM64 Production Gate (B-ARM64-PATHA)

Scope: why Path A is not production until a real board proves the full secure-boot chain (ROTPK/fuse provisioning, OP-TEE, RPMB-backed StandaloneMM variables, fTPM NV, U-Boot UEFI, signed UKI boot), and what that gate teaches about hardware evidence.

Grounding spine: source doc `yubi-OS/yubiOS docs/BLOCKERS.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/BLOCKERS.md), row B-ARM64-PATHA.

## The blocker as stated

The register states that Path A is not production until a real board proves the whole chain: ROTPK/fuse provisioning, OP-TEE, RPMB-backed StandaloneMM variables, fTPM NV storage, U-Boot UEFI, and signed UKI boot (source doc). Board roles are documented in the refs doc `refs/arm64-rk-board-status-2026-07-17.md` (source doc). The prescribed next step is a documented sacrificial ROCK 5B / RK3588 rehearsal before any production language, then carrying secondary evidence to ROCKPro64 / RK3399 (source doc). The word "sacrificial" is doing real work: the rehearsal board exists to absorb the risk of early boot-chain experiments so production language is never claimed from a desk.

## Why the chain is long

Each link in the chain is a distinct dependency that must be proven on the same real board, because a secure boot chain is only as trustworthy as its weakest unproven link. The external mechanisms behind the links are well documented in their upstream projects:

1. OP-TEE secure boot is built on the authentication framework in Arm Trusted Firmware-A (TF-A) for Armv8-A environments; OP-TEE's own architecture documentation describes verifying OP-TEE through that framework (source: https://optee.readthedocs.io/en/latest/architecture/secure_boot.html, jev weight 0.81).
2. The fTPM Trusted Application runs in the OP-TEE secure world and uses RPMB (Replay Protected Memory Block) as its persistent storage; the upstream integration repo states this directly (source: https://github.com/OP-TEE/optee_ftpm, jev weight 0.5).
3. The Microsoft fTPM reference implementation's OP-TEE TA README documents RPMB-backed non-volatile storage and the OP-TEE flag that clears RPMB on every boot when key derivation functions change during development (source: https://github.com/microsoft/MSRSec/blob/master/TAs/optee_ta/fTPM/README.md, jev weight 0.61).
4. U-Boot support for fTPM through OP-TEE using eMMC RPMB as persistent storage has been upstreamed; the u-boot mailing list patches state that "fTPM support in U-Boot provides the foundation for measured boot and disk encryption use cases" (sources: https://lists.denx.de/pipermail/u-boot/2026-March/612498.html, jev weight 0.56; https://lists.denx.de/pipermail/u-boot/2026-May/618511.html, jev weight 0.54).

The blocker's root-cause class is missing hardware evidence, not missing code: the components exist upstream, but the yubiOS project has not yet watched them run in sequence on a physical board it controls end to end.

## What each link contributes to the gate

- ROTPK/fuse provisioning: the root of trust public key must be programmed into board fuses; without it, nothing downstream can be verified.
- OP-TEE: the secure-world OS that hosts the fTPM TA and StandaloneMM.
- RPMB-backed StandaloneMM variables: secure-world eMMC storage for UEFI variable services.
- fTPM NV: the firmware TPM's persistent state, which the MSRSec README shows is RPMB-backed and sensitive to key-derivation changes (source: https://github.com/microsoft/MSRSec/blob/master/TAs/optee_ta/fTPM/README.md, jev weight 0.61).
- U-Boot UEFI: the non-secure bootloader implementing the UEFI interface the UKI expects.
- Signed UKI boot: the final proof that a signed unified kernel image actually boots through the whole chain.

A UKI is a single UEFI PE executable combining the boot stub, kernel, and initramfs; the ArchWiki definition makes clear it can be booted directly from UEFI firmware or sourced by bootloaders with little or no configuration (source: https://wiki.archlinux.org/title/Unified_kernel_image, jev weight 0.68, collected for the B-BOOTC-SEAL dig and cited here for the UKI mechanism).

## The dependency-management lesson

B-ARM64-PATHA teaches that in a hardware-coupled OS project, a feature is not done when it compiles; it is done when a physical board has proven it. The register encodes this by refusing "production" language until the rehearsal run exists. It also encodes evidence portability: the ROCK 5B rehearsal is primary evidence, and ROCKPro64 / RK3399 receive only secondary evidence carried over from it (source doc). That ordering prevents the project from quietly substituting an easier board for the one that matters. The unblock path is therefore a sequence, not a status: rehearse on the sacrificial board, document it, then extend.

Weak-backing note: the search dig for the UKI/measured-boot leg of this blocker returned mostly low-weight results (0.13 to 0.28, labeled weak), so the external grounding for this doc rests on the OP-TEE, MSRSec, and u-boot-list sources above, all at weight 0.5 or higher.
