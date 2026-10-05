# 05 - U-Boot as BL33: measured boot over the fTPM

Scope: U-Boot in UEFI mode as the non-secure BL33 stage with `CONFIG_TPM2_FTPM_TEE`, `CONFIG_MEASURED_BOOT`, and `CONFIG_EFI_LOADER`, and how its measurement machinery extends PCRs through the fTPM TA before Linux runs.

## U-Boot's measured boot capability

U-Boot can perform a measured boot: the process of hashing various components of the boot process, extending the results in the TPM, and logging the component's measurement in memory for the operating system to consume (https://docs.u-boot-project.org/en/latest/usage/measured_boot.html, weight 0.905, mirrored at https://docs.u-boot.org/en/latest/usage/measured_boot.html, weight 0.892). This is the mechanism the Phase F0 plan relies on for PCRs 8 and 9, which it assigns to the kernel, DTB, and initramfs as measured by U-Boot.

The measured boot path is wired to the standard boot commands: the `booti`, `bootm`, and `bootz` commands can be used for measured boot using the legacy entry point of the Linux kernel, and by default U-Boot measures the operating system image, the initrd image, and the `bootargs` environment variable (https://docs.u-boot-project.org/en/latest/usage/measured_boot.html, weight 0.553). For the plan, the default set maps cleanly: kernel image and initrd to the kernel/initramfs PCRs, with the DTB needing explicit handling because it is not in the default measurement list.

## Talking to the fTPM from U-Boot

The `tpm2_ftpm_tee` driver is the U-Boot side of the fTPM transport. A driver source file at `drivers/tpm/tpm2_ftpm_tee.c` exists in current U-Boot trees at 254 lines (https://github.com/frank-w/u-boot/blob/2026-07-bpi/drivers/tpm/tpm2_ftpm_tee.c, weight 0.874). The plan's `CONFIG_TPM2_FTPM_TEE=y` selects exactly this driver, which opens a TEE session to the fTPM TA by its UUID.

Upstream U-Boot adoption of the same stack is visible in patch traffic: a Kconfig patch enabling fTPM and RPMB support describes TPM 2.0 functionality provided through Microsoft's fTPM Trusted Application running in OP-TEE secure world, using eMMC RPMB as persistent storage, and states that fTPM support in U-Boot provides the foundation for measured boot and disk encryption use cases (https://lists.denx.de/pipermail/u-boot/2026-May/618310.html, weight 0.870). That is the same architecture Phase F0 specifies, on real hardware rather than QEMU, which supports the plan's choice of U-Boot as the measuring stage.

## Why measure at all

Measured boot is a way to inform the last software stage if someone tampered with the platform; it is impossible to know exactly what has been corrupted, but knowing that someone has is already enough to not reveal secrets, and TPMs offer a small secure locker where users can store keys, passwords, and authentication tokens (https://bootlin.com/blog/measured-boot-with-a-tpm-2-0-in-u-boot/, weight 0.901). In the desktop-world analogue, the shim is measured by the firmware into the TPM (http://0pointer.net/blog/authenticated-boot-and-disk-encryption-on-linux.html, weight 0.831); Phase F0 replaces the firmware and shim with TF-A and U-Boot measuring over the fTPM.

## PCR budget and the EFI loader

The plan enables `CONFIG_EFI_LOADER=y` alongside measured boot. The UEFI loader path matters because the PCR space is small and contested downstream: systemd documents that since the PCR number space is very small, systemd userspace supports additional PCRs implemented via TPM2 NV Indexes, using the `TPM2_NT_Extend` type (https://systemd.io/TPM2_PCR_MEASUREMENTS/, weight 0.945). A chain that spends PCRs carelessly at the bootloader stage makes the userspace side harder, so the plan's assignment of distinct PCR ranges to firmware, policy, kernel, and IMA stages is a constraint U-Boot's configuration must respect rather than override.

## The BL33 position in the chain

In the generic Arm boot chain, BL33 is the non-secure world bootloader that eventually loads Linux (https://jovin555.github.io/firmware-daily-log/trustzone/day-11, weight 0.114, weak backing). On QEMU with TF-A, the suggested BL33 is QEMU_EFI.fd, and hands-on accounts show U-Boot substituted there when the EFI blob path was hard to debug (https://lnxblog.github.io/2020/08/20/qemu-arm-tf.html, weight 0.159, weak backing). Phase F0's U-Boot-in-UEFI-mode choice sits between those two: it is a U-Boot binary acting as the non-secure bootloader, exposing UEFI interfaces to the kernel.

## Verification implications for BL33

The plan's done condition exercises U-Boot indirectly: for a PCR extend performed in the guest to be meaningful as a measured-boot proof, the measurement must have flowed through the fTPM TA opened by the U-Boot driver at BL33, not only through later kernel-side extends. A rigorous verifier distinguishes the two by reading the TCG event log the OS consumes, since U-Boot's measured boot logs component measurements in memory for the operating system to consume (https://docs.u-boot-project.org/en/latest/usage/measured_boot.html, weight 0.905). A pass that shows only post-boot extends is a pass of the driver stack, not of the measured boot chain.

## What to pin

Three U-Boot-side artifacts determine reproducibility: the U-Boot revision itself, the config fragment fixing `CONFIG_TPM2_FTPM_TEE=y`, `CONFIG_MEASURED_BOOT=y`, and `CONFIG_EFI_LOADER=y`, and the DTB passed to the guest. The K3 patch shows fTPM enablement being added at the Kconfig layer (https://lists.denx.de/pipermail/u-boot/2026-May/618310.html, weight 0.870), so a Phase F0 build script should carry its own defconfig fragment rather than depending on a platform default that may or may not include it.
