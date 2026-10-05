# 04 - The RPMB bootstrap hazard: tee-supplicant timing

Scope: the Phase F0 critical risk that the first persistent NV write to RPMB can happen before `tee-supplicant` is available, why that ordering exists at all, and the initramfs or deferral strategies that keep early NV writes from wedging the TPM.

## Why the hazard exists

RPMB communication in the standard OP-TEE flow runs through user space. The OP-TEE client implements RPMB support in the `tee-supplicant` daemon, which acts as an intermediary between the TEE and the RPMB partition of the eMMC device in the normal world (https://deepwiki.com/OP-TEE/optee_client/2.2.2-rpmb-storage, weight 0.568). Linaro's write-up on the same problem states it plainly: `tee-supplicant`, the user space application in the OP-TEE solution, has been responsible for communication with the RPMB (Replay Protected Memory Block) device, which meant that access to secure storage has not been available until the system is fully up and running (https://www.linaro.org/blog/linaro-enables-op-tee-rpmb-access-directly-from-the-linux-kernel/, weight 0.733).

Against that, the fTPM is an Early TA embedded in the OP-TEE binary precisely so it gets early access on bootup, running only in secure DRAM (https://docs.nvidia.com/networking/display/bluefieldbsp480/ftpm-over-op-tee.pdf, weight 0.911). The collision is structural: the TA exists before user space, but its persistent storage historically did not. Any TPM operation that triggers an NV write, such as counter updates or NV index creation during early boot, can hit a storage path with no backend attached.

## What the failure looks like

A normal-world driver that reaches the fTPM too early fails visibly. One reported flow has the TPM driver in the normal world attempting to establish a session with the fTPM Early TA using `tee_client_open_session` during the boot process, before `tee-supplicant` is loaded, and panicking; the same report notes that Early TAs can be accessed before `tee-supplicant` is running (https://github.com/OP-TEE/optee_os/issues/7339, weight 0.509). In other words, session establishment itself is fine for Early TAs, and the danger is what the session then touches: storage.

Vendor troubleshooting material puts the general shape bluntly: issues in OP-TEE/fTPM typically occur at boot time, a variety of interrelated pieces must be available for OP-TEE and fTPM to function, and because the fTPM is a trusted application requiring the OP-TEE transport, the entities are entirely dependent on one another (https://docs.nvidia.com/networking/display/bfswtroubleshooting/OP-TEE/op-tee-ftpm.pdf, weight 0.776).

## Strategy 1: run tee-supplicant from initramfs

The Phase F0 plan offers two options: run `tee-supplicant` from initramfs, or defer persistent writes until it is available. The initramfs route has direct precedent. A community configuration report describes OP-TEE configured to use RPMB only, with `CFG_REE_FS=n` and `CFG_RPMB_FS=y`, and `tee-supplicant` started by the initramfs, so the fTPM TA can access secure storage before the root filesystem is mounted (https://github.com/OP-TEE/optee_os/issues/5766, weight 0.129, weak backing). The same pattern appears in a distribution patch that moves fTPM and `tee-supplicant` initialization into the local-top section of initramfs, explicitly to ensure the services run before the root filesystem is mounted so that encrypted filesystems are properly initialized (https://groups.google.com/g/isar-users/c/p1gy2z-RV4I, weight 0.575).

## Strategy 2: defer persistent writes

Deferral avoids the initramfs complexity but constrains the verifier. The Phase F0 done condition includes `TPM2_Startup` and a PCR extend, and both are memory-only operations that never touch NV, so a deferral strategy is compatible with the plan's done condition as written. The risk to manage is that an accidental NV-touching operation, such as creating a key hierarchy that persists a seed, silently wedges the TPM in the pre-supplicant window.

## The direction of travel: kernel-level RPMB

The hazard is being engineered away upstream. Linaro's work moves RPMB access directly into the Linux kernel, removing the user-space dependency for secure storage availability (https://www.linaro.org/blog/linaro-enables-op-tee-rpmb-access-directly-from-the-linux-kernel/, weight 0.733). Kernel mailing list traffic on probing the RPMB device from the optee driver is part of the same effort (https://lkml.org/lkml/2024/5/29/418, weight 0.685), and an LWN-reported patch series extends OP-TEE-based RPMB support to UFS devices, extending the kernel-level secure storage capabilities currently available for eMMC (https://lwn.net/Articles/1043529/, weight 0.669). A U-Boot-side patch thread shows the same split on the bootloader side, with a legacy eMMC supplicant preserved alongside a new UFS backend, the two mutually exclusive via Kconfig because the OP-TEE supplicant handles a single RPMB transport (https://www.mail-archive.com/u-boot@lists.u-boot-project.org/msg05222.html, weight 0.750).

For Phase F0 the practical read is: the QEMU environment's RPMB backend still runs through supplicant, so the initramfs or deferral strategy is required today, but the plan should track kernel-level RPMB as the eventual way to delete the hazard rather than work around it.

## Storage selection semantics

OP-TEE's compile-time configuration decides which storage backs `TEE_STORAGE_PRIVATE`: it selects the REE FS when available, otherwise the RPMB FS, in that order (https://optee.readthedocs.io/en/latest/architecture/secure_storage.html, weight 0.832). A Phase F0 build that wants deterministic RPMB behavior should set the storage selection explicitly rather than relying on the fallback order, matching the `CFG_REE_FS=n CFG_RPMB_FS=y` pattern reported in the community configuration above.

## Verification hook

The hazard is testable. A Phase F0 verifier can confirm the ordering by checking that the first guest boot completes with `TPM2_Startup` and a PCR extend while `tee-supplicant` is either running from initramfs or deliberately absent, and that no NV write path was exercised in the latter case. If an NV operation succeeds before supplicant in a configuration where supplicant is required, that is a finding, not a pass.
