# 07 - PCR conventions for the F0 measured boot plan

Scope: the TCG specifications that define platform firmware PCR usage, what the industry conventions say about PCRs 0 through 7, 10, and 16, and how the Phase F0 PCR table maps onto those conventions.

## The authoritative source for PCR allocation

The TCG PC Client Platform Firmware Profile Specification describes the behaviors and requirements of a PC Client system with a TPM 2.0 compliant with the TPM Library Specification Family 2.0 and the PC Client Platform TPM Profile 1.05 or later (https://trustedcomputinggroup.org/wp-content/uploads/TCG-PC-Client-Platform-Firmware-Profile-Version-1.06-Revision-52_pub-1.pdf, weight 0.928). A second published revision specifies requirements for the TPM as implemented on the platform, including TPM, platform and firmware provisioning, usage of TPM to record measurements of platform code, and PCR mapping (https://trustedcomputinggroup.org/wp-content/uploads/TCG_PCClient_PFP_r1p05_v23_pub.pdf, weight 0.935). The companion resource page notes the specification should be used in conjunction with the TCG UEFI Protocol Specification Family 2.0, the TCG Physical Presence Interface Specification, and the TCG ACPI Specification (https://trustedcomputinggroup.org/resource/pc-client-specific-platform-firmware-profile-specification/, weight 0.839).

One behavioral rule from the earlier platform profile revision is directly relevant to any emulated chain: integrity measurements by platform firmware that are extended into PCR[0-7] MUST be done only while the host platform is in the Pre-OS environment after starting from an Off state (https://trustedcomputinggroup.org/wp-content/uploads/PC-ClientSpecific_Platform_Profile_for_TPM_2p0_Systems_v21.pdf, weight 0.905). In a QEMU chain there is no literal Off state, so a Phase F0 implementation that extends PCR 0 through 7 must define an equivalent boundary, which is exactly what the plan does by assigning PCRs 0 and 1 to system firmware and bootloader stages.

## PCR 0 through 7: the firmware range

The plan assigns PCR 0 and 1 to system firmware, BL31/BL32/BL33, and config. The TCG PFP defines PCR 0 through 7 as the platform firmware range; a third-party table summarizing PCR index security implications across TCG specifications, coreboot, and GRUB2 treats PCRs 0 to 7 as defined by the TCG PC Client Platform Firmware Profile (https://help.zededa.com/hc/en-us/articles/43295940828827-TPM-PCR-Index-Security-Implications, weight 0.240, weak backing). The plan's choice to put the TF-A, OP-TEE, and U-Boot measurements in PCRs 0 and 1 stays inside that convention.

## PCR 7: secure boot policy state

PCR 7 is the conventional home for secure boot policy state, and the plan adopts it for exactly that. The ZEDEDA summary table, though weakly weighted, agrees that PCR 7 sits in the PFP firmware range (https://help.zededa.com/hc/en-us/articles/43295940828827-TPM-PCR-Index-Security-Implications, weight 0.240, weak backing), and the systemd measurements page describes PCR usage conventions in the userspace ecosystem (https://systemd.io/TPM2_PCR_MEASUREMENTS/, weight 0.945), where the small PCR number space has led to additional PCRs implemented via TPM2 NV Indexes using the `TPM2_NT_Extend` type. That ecosystem pressure is a reason to keep the plan's PCR 7 usage conservative: downstream tools expect PCR 7 to mean what they expect.

## PCR 8 and 9: kernel, DTB, initramfs

The plan assigns PCRs 8 and 9 to the kernel, DTB, and initramfs as measured by U-Boot. U-Boot's measured boot performs hashing of boot components, extends the results in the TPM, and logs the measurement in memory for the OS to consume (https://docs.u-boot-project.org/en/latest/usage/measured_boot.html, weight 0.905), and by default measures the OS image, the initrd image, and the `bootargs` environment variable (https://docs.u-boot-project.org/en/latest/usage/measured_boot.html, weight 0.553). The DTB is not part of that default set, so the plan's convention requires an explicit U-Boot measurement of the DTB into the 8 or 9 range, which is a configuration deliverable, not an automatic behavior.

## PCR 10: the IMA runtime log

The plan assigns PCR 10 to the IMA runtime log, matching the Linux default. The IMA project wiki records that the default `CONFIG_IMA_MEASURE_PCR_IDX` is 10 and that the first element in the runtime measurement list is the boot aggregate, a SHA1 hash over TPM registers 0 through 7, or zeroes if no TPM chip exists (https://sourceforge.net/p/linux-ima/wiki/Home/, weight 0.648). The IMA concepts documentation states that IMA typically uses PCR 10, that a TPM attestation quote is a signature over the PCR indirectly providing integrity over the measurement event log, and that the first measurement is the boot aggregate, which is a hash of TPM PCR 0 through 9 (https://ima-doc.readthedocs.io/en/latest/ima-concepts.html, weight 0.721). Note the discrepancy between sources on the boot aggregate span (0 to 7 versus 0 to 9); a Phase F0 implementation should pick one and document it, because the verifier recomputes the aggregate.

The Keylime ecosystem treats the final aggregate hash in PCR 10 as the record of the state of measured files and directories at time of boot, which can then be made public as an event log and attested using the public key of the TPM (https://keylime.dev/blog/2019/04/02/running-IMA-on-keylime.html, weight 0.787). IMA may also extend to more than one PCR using a policy condition, with the payload still added to the same IMA event log (https://ima-doc.readthedocs.io/en/latest/event-log-format.html, weight 0.909), and the measurements documentation describes re-calculating the boot aggregate from the binary bios measurement list (https://linux-ima.sourceforge.net/linux-ima-measurements.html, weight 0.538).

## PCR 16: the resettable verifier PCR

The plan reserves PCR 16 as a debug and resettable PCR used by the F0 verifier. This is a deliberate deviation from the firmware policy range: PCR 16 is outside the PFP-assigned 0 through 7 range, and it is a standard debug PCR in TCG conventions. Using it keeps the verifier's extends from polluting the measured-boot evidence in PCRs 0 to 9, and its resettable property lets the verifier repeat extends across runs without a reboot.

## What the conventions buy the plan

The plan's PCR table is compatible with the TCG PFP firmware range, matches the Linux IMA default for PCR 10, and quarantines test extends in PCR 16. The two open items the conventions surface are the boot-aggregate span choice (https://sourceforge.net/p/linux-ima/wiki/Home/, weight 0.648 versus https://ima-doc.readthedocs.io/en/latest/ima-concepts.html, weight 0.721) and the explicit DTB measurement requirement in U-Boot's default set (https://docs.u-boot-project.org/en/latest/usage/measured_boot.html, weight 0.553). Both belong in the F0 verifier's checklist so the PCR conventions are proven, not just configured.
