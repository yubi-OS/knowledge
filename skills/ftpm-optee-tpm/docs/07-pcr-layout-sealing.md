# 07 - PCR layout and sealing policy

Scope: the yubiOS PCR allocation convention, where each PCR index gets its measurements, and what to seal to which PCR set.

## The convention

The source doc fixes a PCR allocation table for yubiOS on ARM64 (source doc, section "PCR layout (convention)"):

| PCR | Content |
|---|---|
| 0, 1 | System firmware (BL31/BL32/BL33) + config |
| 2, 3 | Option ROM / drivers (rarely used on ARM SoC) |
| 7 | Secure Boot policy state |
| 8, 9 | Kernel, DTB, initramfs (measured by U-Boot) |
| 10 | IMA runtime measurement log |

The TCG's own specifications give this allocation its authority frame. The PC Client Platform Firmware Profile defines the requirements for platform firmware to initialize and interact with a TPM 2.0 device (https://trustedcomputinggroup.org/resource/pc-client-specific-platform-firmware-profile-specification/, jev weight 0.49, weak backing), and the PC Client Platform TPM Profile (PTP) defines the platform-specific functionality needed for a TPM to behave in a consistent, interoperable way on a specific platform type (https://trustedcomputinggroup.org/resource/pc-client-platform-tpm-profile-ptp-specification/, jev weight 0.50, authoritative backing). The mapping of BL31/BL32/BL33 into PCRs 0 and 1 is yubiOS's own convention layered on that frame, not a TCG mandate; the firmware boot stages are named per the ARM boot standard referenced by the sibling skill arm-trusted-firmware-optee.

The OS-side allocation follows the Linux registry: the uAPI group's Linux TPM PCR registry documents which component uses which PCR on a Linux platform, and notes that per the TCG PC Client Platform Firmware Profile the OS can make use of PCRs 8 through 15 (https://uapi-group.org/specifications/specs/linux_tpm_pcr_registry/, jev weight 0.30, weak backing). yubiOS's choice of PCRs 8 and 9 for kernel, DTB, and initramfs sits inside that OS-controlled range, measured by U-Boot before handoff (doc 06).

## PCR 10: the IMA runtime log

PCR 10 is the Linux convention for the Integrity Measurement Architecture runtime measurement list. IMA maintains a runtime measurement list and, when anchored in a hardware TPM, an aggregate integrity value over that list (https://docs.strongswan.org/docs/latest/tnc/ima.html, jev weight 0.09, weak backing). Community practice confirms the linkage in operation: recreating TPM PCR 10 from the Linux IMA measurement list is a known technique for independent verification (https://stackoverflow.com/questions/79564638/recreating-tpm-trusted-platform-module-pcr-10-from-linux-ima-integrity-measur, jev weight 0.06, weak backing). Microsoft's confidential-computing guidance also pairs IMA with measured boot for workload attestation (https://learn.microsoft.com/en-us/azure/confidential-computing/how-to-attest-linux-workload, jev weight 0.09, weak backing).

The probe-ordering constraint from doc 06 binds here: IMA's measurements extend into PCR 10, so the fTPM must register before IMA initializes or the earliest measurements never land.

## PCR banks

PCR banks are a TPM 2.0 capability: Microsoft's guidance explains what happens when banks are switched on TPM 2.0 devices, with PCR banks potentially holding different hash algorithms (https://learn.microsoft.com/en-us/windows/security/hardware-security/tpm/switch-pcr-banks-on-tpm-2-0-devices, jev weight 0.28, weak backing). For a self-owned fTPM, bank configuration is part of the yubiOS-owned surface: whatever bank policy yubiOS chooses must be consistent between U-Boot's measurements and Linux's consumers.

## Sealing policy

The source doc's sealing rule: seal to PCR 0/1/7 for "is this the firmware and policy we signed" (source doc, section "PCR layout (convention)"). TPM 2.0 sealing binds a secret to a set of PCR values, and the TPM releases the secret only when the current PCR state matches what was recorded at seal time (https://www.wolfssl.com/tpm-2-0-sealing-policies-with-wolftpm-pcr-policies-policy-authorize-and-nv-storage-for-tpm-2-0-secrets/, jev weight 0.11, weak backing). Microsoft's TPM fundamentals describe the same primitive: with a sealed key, data can be locked until specific hardware or software conditions are met (https://learn.microsoft.com/en-us/windows/security/hardware-security/tpm/tpm-fundamentals, jev weight 0.28, weak backing).

Sealing to PCRs 0, 1, and 7 is the narrow, defensible choice: it asserts the firmware binaries and Secure Boot policy are the ones yubiOS signed, without depending on runtime-volatile PCRs (kernel, DTB, initramfs in PCRs 8 and 9, or IMA's PCR 10) that change on every legitimate image update. A seal that includes PCR 8 or 9 breaks on every kernel update; a seal on 0/1/7 survives updates as long as the firmware and policy stay pinned. This is why the source doc's rule excludes the measured-by-U-Boot PCRs from the sealing set even though they are measured.

## The trust-boundary cross-reference

The fTPM seal is additive, not the disk-unlock gate; the YubiKey holds that role (source doc, section "fTPM vs YubiKey", covered in doc 08). The PCR layout exists to serve attestation first, and sealing second and conditionally.

## Weak-backing note

The TCG PTP at 0.50 is the only primary-standard source at or above 0.5 for this subtopic. The PFP (0.49), Linux PCR registry (0.30), Microsoft PCR-banks and fundamentals pages (0.28), IMA descriptions (0.06 to 0.09), and the wolfTPM sealing walkthrough (0.11) are weak backing and labeled. The PCR allocation table itself, the sealing rule, and the seal-target choice come from the source doc.
