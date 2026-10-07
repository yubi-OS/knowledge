# 01 - Why a self-owned fTPM on ARM64

Scope: why yubiOS builds its own firmware TPM 2.0 on ARM64 hardware that has no discrete TPM, what measured boot requires, and why vendor fTPM implementations are trust anchors yubiOS does not want to inherit.

## The problem: measured boot needs a TPM-shaped thing

Measured boot is the process of cryptographically measuring the code and critical data used at boot time, for example using a TPM, so that the security state can be attested later (https://github.com/ARM-software/arm-trusted-firmware/blob/master/docs/design_documents/measured_boot_poc.rst, jev weight 0.45, weak backing). U-Boot describes the same mechanism from the bootloader side: it can hash components of the boot process, extend the results into the TPM, and log the measurement in memory for the operating system to consume (https://docs.u-boot-project.org/en/latest/usage/measured_boot.html, jev weight 0.26, weak backing). A Bootlin walkthrough of measured boot with a TPM 2.0 in U-Boot explains the core loop: each stage digests the next one, each digest is sent to the TPM, which merges it with the previous measurements (https://bootlin.com/blog/measured-boot-with-a-tpm-2-0-in-u-boot/, jev weight 0.23, weak backing). MITRE D3FEND catalogs this defense as TPM Boot Integrity, technique D3-TBI: using a TPM to anchor the integrity of the boot chain (https://d3fend.mitre.org/technique/d3f:TPMBootIntegrity/, jev weight 0.30, weak backing).

The source doc states the yubiOS-specific consequence plainly: measured boot needs a TPM-shaped thing to hold PCRs and seal secrets (source doc, yubi-OS/yubiOS skills/ftpm-optee-tpm/SKILL.md, section "When to use"). Without a PCR bank under yubiOS control there is no measured boot, and without measured boot there is no sealed-secret root tied to the boot state.

## The ARM64 gap: no discrete TPM, and the vendor fTPM is not ours

The source doc positions the skill against the post-launch ARM64 project described in FUTURE.md: the goal is a TPM 2.0 that yubiOS owns on ARM64 hardware that has no discrete TPM (source doc, section "When to use"). Microsoft's own TPM guidance shows why this matters structurally: TPM 2.0 can ship as a discrete chip (dTPM) or as firmware running inside another environment (fTPM), and the firmware variant depends entirely on the platform vendor's choices (https://learn.microsoft.com/en-us/windows/security/hardware-security/tpm/tpm-recommendations, jev weight 0.24, weak backing). On ARM64 SoCs, when a firmware TPM exists at all, it is the vendor's, running in a secure world configuration the OS image did not choose.

The source doc calls that vendor fTPM a trust anchor yubiOS did not choose (source doc, section "When to use"). This is the load-bearing judgment of the whole skill: the PCR set and the sealing root define what the platform can prove about itself, so whoever controls the TPM implementation controls the attestation semantics. Running yubiOS's own ms-tpm-20-ref inside yubiOS's own OP-TEE build makes the PCR set and sealing root auditable and reproducible (source doc, section "When to use").

## What changes when the fTPM is ours

Three properties follow from self-hosting the TPM in the secure world, per the source doc:

1. The PCR set is yubiOS's. The PCR allocation table in the source doc (firmware in PCRs 0 and 1, Secure Boot policy state in PCR 7, kernel/DTB/initramfs in PCRs 8 and 9, IMA runtime log in PCR 10) becomes a documented convention yubiOS controls instead of a vendor's opaque layout.
2. The sealing root is reproducible. Because the fTPM TA is built from a pinned ms-tpm-20-ref commit and compiled into a pinned OP-TEE OS build, the attestation root can be rebuilt byte-for-byte.
3. The trust boundary is explicit. The fTPM runs in the secure world (OP-TEE) and stays complementary to the YubiKey, which remains the user-identity and disk-unlock root (source doc, sections "What it is" and "fTPM vs YubiKey").

## Scope boundary: the firmware stack is a sibling skill

The source doc draws a clean line: this skill covers the TPM itself, the OP-TEE Trusted Application; the firmware stack that hosts it (TF-A, OP-TEE OS, U-Boot) is the sibling skill arm-trusted-firmware-optee (source doc, section "When to use"). ARM Trusted Firmware's own documentation confirms the pairing from the firmware side, describing measured boot and its interaction with an fTPM as a proof of concept in the TF-A tree (https://github.com/ARM-software/arm-trusted-firmware/blob/master/docs/design_documents/measured_boot_poc.rst, jev weight 0.45, weak backing).

## Weak-backing note

Every external source backing this doc scored below 0.5 on the noul weighting, so every factual claim above that is not attributed to the source doc carries a weak label. The dig for this subtopic was redone once with different queries (https://learn.microsoft.com/en-us/azure/security/fundamentals/measured-boot-host-attestation, jev weight 0.20; https://d3fend.mitre.org/technique/d3f:TPMBootIntegrity/, jev weight 0.30, both weak backing) and still produced no primary source at 0.5 or above. The structural claims (measured boot requires a TPM, vendor fTPM is a vendor trust anchor) are consistent across all of them, and the yubiOS-specific decisions come from the source doc itself.
