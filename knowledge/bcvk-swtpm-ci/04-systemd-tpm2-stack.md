# 04 the systemd TPM2 stack in guests

Scope: what systemd does with a TPM 2.0 device in the guest, the tpm2-setup services that provision SRK and EK, PCR measurements systemd issues, and where the guest-side swtpm service fits.

## Key provisioning services

Two systemd services provision the TPM's root keys in the guest. "systemd-tpm2-setup.service and systemd-tpm2-setup-early.service are services that generate the Storage Root Key (SRK) and Endorsement Key (EK) if they have not been generated yet, and stores them in the TPM" [1] (weight 0.797). The freedesktop man page for version 258 states the SRK half of the same contract [2] (weight 0.880); the man7 mirror of the same page agrees with the SRK-and-EK formulation [3] (weight 0.386, weak backing).

In a swtpm-backed VM these services are the guest-side complement of host-side swtpm_setup (doc 01): swtpm_setup simulates manufacturing on the host, and systemd-tpm2-setup generates the runtime key hierarchy inside the guest on first boot.

## The original yubiOS idea and why it was set aside

The original yubiOS plan was to enable systemd-tpm2-swtpm.service in the guest so the guest itself would run its software TPM. In practice bcvk's DirectBoot path extracts the kernel and initrd from the UKI and bypasses enough of the normal boot stack that the reliable route is host-side QEMU vTPM attachment instead (yubiOS ref premise; see doc 05). systemd's swtpm service remains relevant in a normal systemd-boot or full-firmware context, it is simply not the current bcvk CI mechanism. This is an internal architecture decision, recorded here so the corpus does not imply the guest-side service is the integration path.

## What systemd measures

The systemd project documents its PCR usage directly: "Various systemd components issue TPM2 PCR measurements during the boot process, both in UEFI mode and from userspace. The following lists all measurements done, and describes (in case done before ExitBootServices()) how they appear in the TPM2 Event" log [4] (weight 0.923). For VM tests this page is the reference for what PCR state a fully-booted systemd guest should present, and it is the basis for asserting measured-boot gates inside the guest without hardware (doc 06).

## Enrolling TPM2-backed disk unlock

The consumer side of the stack is systemd-cryptenroll, "a tool for enrolling hardware security tokens and device[s]" including PKCS#11, FIDO2, and TPM2 tokens into LUKS2 encrypted volumes [5] (weight 0.877). The ArchWiki describes the loop: "systemd-cryptenroll allows enrolling smartcards, FIDO2 tokens and Trusted Platform Module security chips into LUKS devices, as well as regular passphrases. These devices are later unlocked by systemd-cryptsetup@.service, using the enrolled tokens" [6] (weight 0.745).

This matters for yubiOS because the same enrollment flow is what the LUKS2 + FIDO2 end-to-end test exercises against a physical YubiKey; a swtpm-backed VM can exercise the TPM2 half of that matrix (enroll against the emulated TPM, reboot the VM, confirm auto-unlock) without hardware (yubiOS ref premise).

A community answer notes the practical PCR selection guidance: the systemd-cryptenroll man page recommends PCRs 7, 11, and 14 as covering most cases, and warns against adding too many PCRs since that can be counterproductive when the TPM has to be re-sealed [7] (weight 0.062, weak backing).

## Guest-side expectations for CI

A swtpm-backed systemd guest should therefore show, in order: the TPM device nodes (doc 03), successful systemd-tpm2-setup units, and then TPM2-backed features such as cryptenroll available for test flows [1] (weight 0.797) [5] (weight 0.877). VM tests that assert systemd's own TPM2 integration should check unit state rather than poking raw TPM commands, because the units encode the ordering and error handling [2] (weight 0.880).

## Sources

1. https://man.archlinux.org/man/core/systemd/systemd-tpm2-setup.8.en (weight 0.797)
2. https://www.freedesktop.org/software/systemd/man/258/systemd-tpm2-setup.service.html (weight 0.880)
3. https://www.man7.org/linux/man-pages/man8/systemd-tpm2-setup.8.html (weight 0.386, weak)
4. https://systemd.io/TPM2_PCR_MEASUREMENTS/ (weight 0.923)
5. https://www.man7.org/linux/man-pages/man1/systemd-cryptenroll.1.html (weight 0.877)
6. https://wiki.archlinux.org/title/Systemd-cryptenroll (weight 0.745)
7. https://askubuntu.com/questions/1470391/luks-tpm2-auto-unlock-at-boot-systemd-cryptenroll (weight 0.062, weak)
