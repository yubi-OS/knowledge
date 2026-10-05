# 03 guest kernel TPM plumbing

Scope: how the guest kernel surfaces a virtual TPM as /dev/tpm0 and /dev/tpmrm0 through the tpm_tis and tpm_crb drivers, and what that implies for VM test assertions.

## Two interface types, two drivers

The TCG PTP Specification defines two interface types: FIFO and CRB. "The former is based on sequenced read and write operations, and the latter is based on a buffer containing the full command or response" [1] (weight 0.909). In the Linux kernel these map to separate drivers: tpm_tis implements the FIFO interface, and its name comes from the TPM Interface Specification, "the hardware interface specification for TPM 1.x chips", with communication based on a 20 KiB buffer shared by the TPM chip through a hardware bus or memory map [2] (weight 0.537). The CRB interface is the modern TPM 2.0 companion driver. Both drivers live under drivers/char/tpm in the kernel tree [3] (weight 0.943).

For a QEMU guest this means the device model chosen on the QEMU command line (doc 02) and the kernel driver that binds to it must agree: a tpm-tis device is claimed by tpm_tis, a tpm-crb device by tpm_crb.

## Device nodes the guest must expose

The user-visible contract in the guest is the character device pair:

- /dev/tpm0, the raw TPM command device. OpenStack's Nova documentation states that after a successful boot with an emulated TPM "the server should see a TPM device such as /dev/tpm0 which can be used in the same manner as a" hardware TPM [4] (weight 0.932).
- /dev/tpmrm0, the TPM 2.0 command resource-manager device. A real-world report describes the kernel-side device as /dev/tpmrm0 and the failure mode of a boot process stalling on the associated systemd start job when the device misbehaves [5] (weight 0.032, weak backing).

The yubiOS VM test stance asserts exactly this pair: VM tests should observe /dev/tpm0 and /dev/tpmrm0 existing in the guest before any TPM-backed flow runs (yubiOS ref premise; see doc 05).

## What the kernel TPM subsystem documents

The kernel's TPM documentation index covers the subsystem's security posture: TPM security introduction, "Snooping and Alteration Attacks against the bus", "Measurement (PCR) Integrity", "Secrets Guarding", and "Establishing Initial Trust with the TPM" [6] (weight 0.963). It also documents a Virtual TPM Proxy Driver for Linux Containers and a vTPM interface for Xen, confirming that the kernel treats virtual TPMs as first-class plumbing rather than a test-only hack [6] (weight 0.927).

## Kernel config requirements

The driver split has a direct kernel-config consequence for bootc-style images: a guest image that wants to exercise swtpm-backed flows needs CONFIG_TCG_TPM plus the interface driver matching the QEMU device model (TPM interface spec FIFO support for tpm_tis; CRB support for tpm_crb) [1] (weight 0.909) [2] (weight 0.537). A distro kernel such as the one in a fedora-bootc guest carries these modules, so the practical CI assertion is not "is the driver built" but "did the device bind": check that /dev/tpm0 and /dev/tpmrm0 exist and that a tpm device is bound in sysfs [4] (weight 0.932).

## A CI failure mode worth knowing

The weakly-backed Arch forum report is still instructive: a system where "of this job starting, I gave to wait extra minute during boot before it times out" because of a /dev/tpmrm0 start job [5] (weight 0.032, weak backing). The lesson for CI is to gate TPM-dependent checks behind an explicit device-presence wait with a short timeout, so a broken vTPM attachment fails fast instead of burning a minute of guest boot time per VM.

## Sources

1. https://www.kernel.org/doc/html/latest/security/tpm/tpm_tis.html (weight 0.909)
2. https://dri.freedesktop.org/docs/drm/security/tpm/tpm_tis.html (weight 0.537)
3. https://github.com/torvalds/linux/blob/master/drivers/char/tpm/tpm_tis.c (weight 0.943)
4. https://docs.openstack.org/nova/latest/admin/emulated-tpm.html (weight 0.932)
5. https://bbs.archlinux.org/viewtopic.php?id=296699 (weight 0.032, weak)
6. https://www.kernel.org/doc/html/latest/security/tpm/index.html (weights 0.963, 0.927)
