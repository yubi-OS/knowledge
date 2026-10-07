# 04 - U-Boot as BL33: measured boot into the fTPM

Scope: configuring U-Boot as the BL33 non-secure bootloader, its driver stack for the fTPM Trusted Application, and how it measures kernel, DTB, and initramfs into the fTPM before handing the event log to Linux.

Grounding spine: yubi-OS/yubiOS skills/arm-trusted-firmware-optee/SKILL.md (source doc).

## The Kconfig block

The source doc gives the exact U-Boot Kconfig set for the yubiOS BL33 role:

```
CONFIG_TEE=y
CONFIG_OPTEE=y
CONFIG_TPM=y
CONFIG_TPM_V2=y
CONFIG_TPM2_FTPM_TEE=y           # driver tpm2_ftpm_tee.c (talks to fTPM TA)
CONFIG_MEASURED_BOOT=y
CONFIG_TPM2_EVENT_LOG_SIZE=0x10000
```

Two of these are structural: `CONFIG_TEE=y` plus `CONFIG_OPTEE=y` give U-Boot its client for the secure world, and `CONFIG_TPM2_FTPM_TEE=y` selects the `tpm2_ftpm_tee.c` driver that talks to the fTPM TA over that channel instead of over a physical TPM bus.

An in-flight U-Boot documentation patch for TI K3 boards shows this exact stack being socialized upstream, and its review thread spells out the option set needed to enable fTPM in U-Boot: `CONFIG_TPM_V2`, `CONFIG_TEE`, `CONFIG_OPTEE`, and `CONFIG_TPM2_FTPM_TEE`, alongside OP-TEE side configuration (https://lists.denx.de/pipermail/u-boot/2026-April/616505.html, weight 0.21, weakly backed). The review's own observation is a useful porting lesson: a doc that lists only the OP-TEE build steps and omits the U-Boot Kconfig leaves the reader with a half-wired board, which is precisely the failure mode the source doc's full block exists to prevent.

## The fTPM TA behind the driver

The `tpm2_ftpm_tee.c` driver talks to the fTPM Trusted Application running inside OP-TEE. The upstream OP-TEE integration repository describes that TA as a secure firmware implementation of a TPM using the Microsoft reference implementation, a fork of the MS sample ARM32-FirmwareTPM maintained to work with OP-TEE, with platform-specific integration code kept in the repository (https://github.com/OP-TEE/optee_ftpm, weight 0.33, weakly backed). The full build and integration story for the TA lives in the sibling skill `ftpm-optee-tpm`, per the source doc.

## What U-Boot measures, and where it writes

U-Boot's own documentation defines the process the source doc relies on: U-Boot can perform a measured boot, hashing various components of the boot process, extending the results in the TPM, and logging each component's measurement in memory for the operating system to consume (https://docs.u-boot-project.org/en/stable/usage/measured_boot.html, weight 0.28, weakly backed).

Per the source doc, the U-Boot sequence in the yubiOS flow is:

1. Bring up the TPM with the `tpm2` command suite (`tpm2 init`, `tpm2 startup`).
2. Replay the firmware event log into the PCRs via `TPM2_PCR_Extend`.
3. Measure the kernel, DTB, and initramfs.
4. Hand the event log to Linux by writing `linux,sml-base` and `linux,sml-size` into the kernel `/chosen` DTB node.

The `linux,sml-base` and `linux,sml-size` properties are confirmed in U-Boot's measured boot documentation as the device-tree way to point the OS at the event log memory region: the TPM device node must either contain a phandle to a reserved memory region or `linux,sml-base` and `linux,sml-size` indicating the address and size of that region (https://docs.u-boot-project.org/en/latest/usage/measured_boot.html, weight 0.29, weakly backed).

## The device tree node

The source doc requires the fTPM device tree node in U-Boot's control DTB:

```dts
tpm {
    compatible = "microsoft,ftpm";
};
```

This is the node the `tpm2_ftpm_tee` driver binds against; without it the driver has no secure-world TPM to enumerate and the measured boot steps silently skip.

## Why BL33 measurement matters to yubiOS

On the enforcement path (Path A in the source doc), BL2 has already verified U-Boot before it ever runs. The BL33 measurements into the fTPM add the OS-side half of the evidence: PCRs 0 and 1 carry firmware-stage values, and PCRs 8 and 9 carry the OS-stage values for kernel, DTB, and initramfs (source doc measurement table). On the measured-only path (Path B), these PCRs are the entire basis of the later attestation decision, because no fuse-enforced rejection happens during boot.

The source doc also warns about a specific silent failure here: event log size mismatches between TF-A's `EVENT_LOG_LEVEL` and U-Boot's `CONFIG_TPM2_EVENT_LOG_SIZE` truncate measurements without any error. The `0x10000` value in the Kconfig block is sized to hold the full firmware plus OS event log, and a port that changes one side without the other will lose events in ways that only show up later as missing PCRs.
