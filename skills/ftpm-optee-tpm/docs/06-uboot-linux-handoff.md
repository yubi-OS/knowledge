# 06 - U-Boot and Linux handoff

Scope: the U-Boot tpm2_ftpm_tee driver, the Linux tpm_ftpm_tee driver, the measured-boot event log handoff through the device tree, and the probe-ordering constraint with IMA.

## U-Boot side

The U-Boot driver is tpm2_ftpm_tee.c (source doc, section "U-Boot side"). The driver source is visible in the U-Boot tree at drivers/tpm/tpm2_ftpm_tee.c (https://elixir.bootlin.com/u-boot/v2022.04/source/drivers/tpm/tpm2_ftpm_tee.c, jev weight 0.66, authoritative backing), and the file header identifies it as a device driver for a firmware TPM as described in Microsoft's fTPM research publication, with the reference implementation link included (https://qemu.googlesource.com/u-boot/+/refs/heads/WIP/2022-02-08-TI-platform-updates/drivers/tpm/tpm2_ftpm_tee.c, jev weight 0.46, weak backing). TI's ti-u-boot tree carries the same 254-line driver (https://github.com/TexasInstruments/ti-u-boot/blob/ti-u-boot-2026.01/drivers/tpm/tpm2_ftpm_tee.c, jev weight 0.54, authoritative backing), which shows the driver is in production vendor trees, not just upstream.

The wiring is Kconfig plus a device tree node, and the source doc routes the detailed Kconfig and DT setup to the sibling skill arm-trusted-firmware-optee (source doc, section "U-Boot side"). The summary it gives: CONFIG_TPM2_FTPM_TEE=y, a DT node with compatible "microsoft,ftpm", then the boot sequence: tpm2 init, tpm2 startup, replay the firmware event log into PCRs, measure the kernel, DTB, and initramfs, then hand the log to Linux (source doc, section "U-Boot side").

## The event log handoff

The handoff mechanism is the device tree: U-Boot writes the event log so Linux can consume it through the linux,sml-base and linux,sml-size properties (source doc, section "U-Boot side"). This is the standard TCG event-log plumbing: the bootloader records each measurement event and the physical location of the log, and the OS driver reads the log back from there.

## Linux side

The kernel configuration the source doc specifies (source doc, section "Linux side"):

```
CONFIG_TEE=y
CONFIG_OPTEE=y
CONFIG_TCG_TPM=y
CONFIG_TCG_FTPM_TEE=m     # drivers/char/tpm/tpm_ftpm_tee.c (Microsoft)
```

The kernel's own documentation describes the driver: it is a shim for firmware implemented in ARM's TrustZone environment, allowing provisioning of a TPM functional space for services without requiring a TPM device chip (https://docs.kernel.org/6.8/security/tpm/tpm_ftpm_tee.html, jev weight 0.72, authoritative backing). The driver source lives in the mainline tree at drivers/char/tpm/tpm_ftpm_tee.c (https://github.com/torvalds/linux/blob/master/drivers/char/tpm/tpm_ftpm_tee.c, jev weight 0.53, authoritative backing).

The tpm_ftpm_tee.ko module reads linux,sml-base and linux,sml-size from the DTB and exposes /dev/tpm0 and /dev/tpmrm0 (source doc, section "Linux side"). Those two device nodes are the TPM character device and the TPM resource manager, the interfaces every Linux TPM consumer (IMA included) goes through.

## Probe ordering with IMA

The source doc's probe-ordering constraint: the fTPM must be registered before IMA runs, and the OP-TEE bus needs RPMB access, so tee-supplicant must be in the initramfs (source doc, section "Linux side"). If IMA runs first you get probe deferral or missing measurements; use early init tables for the probe (source doc, section "Linux side").

The stakes come from what IMA does with the TPM: the Linux Integrity Measurement Architecture maintains a runtime measurement list and, when anchored in a hardware TPM, an aggregate integrity value over that list (https://docs.strongswan.org/docs/latest/tnc/ima.html, jev weight 0.09, weak backing). IMA extends its measurements into a designated PCR (PCR 10 by Linux convention, covered in doc 07). If the TPM device appears after IMA initializes, the earliest file measurements are never extended into the PCR and the attestation chain has a hole from boot.

NVIDIA's Jetson firmware TPM documentation describes the same measured-boot dependency from the vendor side: measured boot uses a TPM to store measurements of firmware components, which can later be verified to ensure the system has not been compromised (https://docs.nvidia.com/jetson/archives/r36.4.3/DeveloperGuide/SD/Security/FirmwareTPM.html, jev weight 0.18, weak backing).

## Debug sequence

1. Verify tpm2 init and tpm2 startup succeed in U-Boot and PCRs extend (this validates the Early TA session path from docs 04 and 05).
2. Verify the event log handoff landed in the DTB (linux,sml-base and linux,sml-size populated).
3. Boot Linux and confirm tpm_ftpm_tee probed and /dev/tpm0 and /dev/tpmrm0 exist before IMA initializes; if not, move the driver probe earlier with early init tables.
4. Confirm IMA's first measurements actually extend into PCR 10 rather than failing with probe deferral.

Every external claim above carries its weight: the U-Boot driver source locations at 0.66 and 0.54, the kernel driver documentation at 0.72, and the mainline driver location at 0.53 are authoritative backing; the TI mirror header (0.46), U-Boot measured-boot docs (0.26), Jetson measured-boot page (0.18), and IMA description (0.09) are weak backing. The wiring specifics (Kconfig, DT properties, config symbols, probe ordering) come from the source doc.
