# Measured boot in the VM: swtpm and the PCR assertion set

Scope: TPM2 in VMs via swtpm socket passthrough, the sha256 PCR banks used at boot, what systemd-stub measures into each PCR, and the golden-value assertions the sealed lane makes with tpm2_pcrread.

## swtpm as the VM's TPM

The QEMU TPM device documentation states the contract: the swtpm program behaves like a hardware TPM and therefore needs to be initialized by the firmware running inside the QEMU virtual machine. One necessary step for initializing the device is to send the TPM_Startup command to it (weight 0.893, https://www.qemu.org/docs/master/specs/tpm.html). QEMU wires a swtpm through a socket character device; the sealed lane passes `-tpmdev passthrough,id=tpm0,chardev=chrtpm` with a chardev pointed at the swtpm socket path (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md).

Community guides confirm the wiring is a known, reproducible pattern. A step-by-step guide to setting up TPM emulation in QEMU with OVMF documents reading TPM measurements in the Linux guest OS via securityfs when booted with UEFI (weight 0.665, https://github.com/tompreston/qemu-ovmf-swtpm). A companion documentation repo, qemu-tpm-measurement, describes measured boot under QEMU with OVMF and swtpm as a mechanism that leverages the TPM to detect unwanted modification of the platform configuration (weight 0.596, https://github.com/anpep/qemu-tpm-measurement).

## What systemd-stub measures

systemd-stub performs TPM PCR measurements of all embedded components of the UKI: kernel, initrd, command line, and signatures (weight 0.122, weak backing, https://deepwiki.com/systemd/systemd/4.1-early-boot-uefi-and-measured-boot). The primary man page states the PCR 4 story precisely: when a unified kernel using systemd-stub is invoked, the firmware measures it as a whole into TPM PCR 4, covering all embedded resources, such as the stub code itself, the core kernel, the embedded initrd and kernel command line, including all UKI profiles (weight 0.875, https://man.archlinux.org/man/systemd-stub.7).

Lennart Poettering's trusted boot writeup corroborates the event-log picture: shim/grub/kernel is measured into TPM PCR 4, among other things, and the EFI TPM event log reports measured data into TPM PCRs and can be used to reconstruct and validate the state of TPM PCRs from the used resources (weight 0.802, https://0pointer.net/blog/brave-new-trusted-boot-world.html).

PCR 11 is the kernel-boot PCR with the strongest policy coupling in the systemd documentation: the TPM2 PCR measurements page describes a branch of an access policy that can only be satisfied from the initrd, using the kernel boot PCR (11), bound to a signed PCR policy (weight 0.952, https://systemd.io/TPM2_PCR_MEASUREMENTS/). Complementing runtime measurement, systemd-measure is a tool that may be used to pre-calculate and sign the expected TPM2 PCR 11 values that should be seen when a Linux UKI based on systemd-stub is booted up (weight 0.949, https://www.freedesktop.org/software/systemd/man/latest/systemd-measure.html). That pre-calculation is exactly what makes golden-value assertions possible in CI.

## The lane's assertion

The sealed lane boots with measured boot enabled and asserts `tpm2_pcrread sha256:0,1,2,3,4,7,11` against golden values, mapping PCR0 to initial firmware, PCR4 to UKI cmdline plus initrd, PCR7 to Secure Boot policy, and PCR11 to initrd measurements (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md). For AMD64 CI the backing TPM is swtpm-emulated fTPM; for ARM64 the lane defers to the ftpm-optee-tpm stack (source doc: same).

The mapping is consistent with the primary sources above where they overlap: PCR4 covers the whole UKI including cmdline and initrd (weight 0.875), and PCR11 is the kernel boot PCR carrying initrd-era measurements bound to signed policies (weight 0.952). The PCR7 Secure Boot policy assignment is asserted in the source doc and is the standard UEFI Secure Boot measurement location; the dig did not surface an independent primary-source PCR7 statement, so treat the PCR7 and PCR0 roles as source-doc claims pending confirmation against the TCG PC Client spec during implementation.

## Policy context for PCR values

TPM2 allows binding secrets, like the LUKS root decryption key, to a signed policy rather than raw PCR values. These policies add flexibility by allowing PCR values to vary, provided there is a valid PCR signature for those values matching the public key enrolled with the secret (weight 0.616, https://wiki.archlinux.org/title/Trusted_Platform_Module). This matters for the lane because the LUKS2 sealing stage (its own doc) and the PCR assertions must agree on which PCRs carry which evidence; if the policy uses signed PCR states, golden-value pinning of raw PCR values is an assertion convention, not a security requirement.

## Gaps

The dig did not surface an authoritative table of which PCR index carries the Secure Boot policy on x86 OVMF or how swtpm reports the event log, and one low-weight forum result describes PCR values differing between initial boot and reboot under swtpm with u-boot (weight 0.038, https://security.stackexchange.com/questions/277782/tpm-pcr-values-change-after-the-first-reboot). Because golden-value assertions compare exact digests, the lane must define whether the VM is measured cold or after warm reboots; the source doc does not state this and the forum result suggests it matters.
