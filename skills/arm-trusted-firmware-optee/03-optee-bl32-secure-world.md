# 03 - OP-TEE as BL32 (secure world, SPD dispatch, RPMB storage)

Scope: wiring OP-TEE OS into the TF-A boot flow as BL32, the SMC dispatch path from the normal world, and RPMB-backed secure storage for the fTPM's persistent state.

Grounding spine: yubi-OS/yubiOS skills/arm-trusted-firmware-optee/SKILL.md (source doc).

## OP-TEE's role in the chain

The source doc assigns OP-TEE the BL32 slot: it runs at Secure-EL1 as yubiOS's secure-world OS and hosts the fTPM Trusted Application. OP-TEE is an open-source TEE that implements the TEE Internal Core API v1.3.1 exposed to Trusted Applications and the TEE Client API v1.0 used to communicate with a TEE, both defined in the GlobalPlatform API specifications (https://optee.readthedocs.io/en/latest/general/about.html, weight 0.83).

## Building OP-TEE for the BL32 slot

Per the source doc, OP-TEE OS is built for the same `PLATFORM=` as TF-A, and its `tee-*.bin` outputs feed TF-A's BL32 inputs:

```sh
make -C optee_os \
  PLATFORM=<platform> \
  CFG_RPMB_FS=y \
  CFG_EARLY_TA=y \
  EARLY_TA_PATHS="<path>/bc50d971-d4c9-42c4-82cb-343fb7f37896.stripped.elf"
```

The three binaries the source doc passes to TF-A are `tee-header_v2.bin` (BL32), `tee-pager_v2.bin` (BL32_EXTRA1), and `tee-pageable_v2.bin` (BL32_EXTRA2). A weakly backed but concrete external reproduction of this exact wiring, using TF-A with `SPD=opteed` and `BL32_EXTRA1=$optee_bin/tee-pager_v2.bin`, confirms the artifact names match reality on a QEMU aarch64 target (https://github.com/OP-TEE/optee_os/issues/7891, weight 0.32, weakly backed).

## The dispatch path: SMC into BL31, then into Secure-EL1

The source doc is emphatic that the normal world (U-Boot, Linux) reaches OP-TEE via SMC instructions, which trap to EL3 (BL31) and are routed by the OP-TEE dispatcher into Secure-EL1. The `SPD=opteed` build flag is what installs that dispatcher in BL31. The source doc's top gotcha follows directly: without `SPD=opteed`, BL32 is loaded but never dispatched. The boot appears to work, OP-TEE is in memory, and no secure world code ever runs.

The architectural backdrop is documented in the TF-A firmware design: normal world software accesses TF-A runtime services via the Arm SMC instruction, and TF-A implements PSCI as a runtime service (https://github.com/ARM-software/arm-trusted-firmware/blob/master/docs/design/firmware-design.rst, weight 0.83). OP-TEE's own secure boot documentation describes the other half of the handshake: verification of OP-TEE itself is enabled through the authentication framework in TF-A, in an Armv8-A environment (https://optee.readthedocs.io/en/latest/architecture/secure_boot.html, weight 0.85).

## RPMB secure storage

OP-TEE has no storage driver of its own. The source doc routes persistent secure storage through RPMB on eMMC/UFS with `CFG_RPMB_FS=y`, serviced from the normal world by `tee-supplicant` (or, for pre-rootfs writes, an early in-OP-TEE path). RPMB is rollback-protected by an HMAC key plus a write counter. This is where the fTPM's NV state lives, and the source doc hands off the fTPM-specific detail to the sibling skill `ftpm-optee-tpm`.

The official OP-TEE secure storage documentation backs the rollback-protection mechanics: when configured with `CFG_RPMB_FS=y`, protection against rollback is controlled by the TEE and is set to 1000; if `CFG_RPMB_FS=n`, there is no rollback protection and the protection level is 0. By default OP-TEE uses `/data/tee/` as the secure storage space in the Linux file system, with each persistent object assigned an internal identifier (https://optee.readthedocs.io/en/latest/architecture/secure_storage.html, weight 0.82; the same statement appears in the versioned 3.16.0 docs at https://optee.readthedocs.io/en/3.16.0/architecture/secure_storage.html, weight 0.83). Reading these two statements together gives the yubiOS-relevant picture: RPMB is the only storage mode where the TEE itself owns rollback protection, which is why the source doc makes `CFG_RPMB_FS=y` the required configuration for fTPM NV state.

## Early TAs

The source doc's build line sets `CFG_EARLY_TA=y` with `EARLY_TA_PATHS` pointing at a stripped ELF for the fTPM TA (UUID bc50d971-d4c9-42c4-82cb-343fb7f37896). Early TAs are baked into the OP-TEE image itself, which is what makes the pre-rootfs in-OP-TEE write path possible: the fTPM TA exists before Linux brings up a rootfs and before `tee-supplicant` can load dynamic TAs.

## Integration cautions

Two cautions come from the dig results, both weakly backed:

- OP-TEE builds for a board are board-specific in practice; a community thread about building OP-TEE OS for a pine64 board shows the PLATFORM-specific friction teams hit outside the mainlined platforms (https://forum.pine64.org/showthread.php?tid=8558&amp%3Bpid=54770, weight 0.06, weakly backed).
- The source doc notes that on BCM2712 (Raspberry Pi 5) there are no open TrustZone memory partitioning controllers, so OP-TEE runs at high RAM rather than in hardware-isolated secure memory, and teams must assess whether that affects the fTPM threat model for production use (source doc).
