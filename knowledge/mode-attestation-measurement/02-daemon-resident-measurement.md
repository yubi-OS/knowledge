# Daemon-resident measurement: fTPM event-driven PCR extension

Scope: the fTPM measurement path as the daemon-resident, event-driven mode: an OP-TEE trusted application that extends PCRs and appends to the event log for each boot stage, with no exit code and the event log itself as the output.

## The mode

The fTPM is the Microsoft TPM 2.0 reference implementation running as a Trusted Application inside OP-TEE. The reference implementation defines a platform API that is swapped out depending on where the TPM code runs; for the fTPM that platform API is implemented against the OP-TEE interface (MSRSec fTPM README, weight 0.86: https://github.com/microsoft/MSRSec/blob/master/TAs/optee_ta/fTPM/README.md). The OP-TEE integration packages this as the optee_ftpm TA, whose build embeds the reference implementation and includes measured boot support (OP-TEE/optee_ftpm repository, weight 0.50: https://github.com/OP-TEE/optee_ftpm).

This is a different execution mode from the one-shot checks in doc 01. The TA is resident in the secure world for the whole boot and reacts to events: each boot stage hands it a measurement, it extends the corresponding PCR, and it appends a matching entry to the TCG event log. The Trusted Firmware-A measured boot PoC shows exactly this shape: the fTPM service processes the event log entries "as they are being processed", extending PCRs for each event (Trusted Firmware-A documentation, weight 0.92: https://trustedfirmware-a.readthedocs.io/en/latest/design_documents/measured_boot_poc.html).

## No exit code: the event log is the output

A one-shot check communicates through an exit code or a refusal. A daemon-resident measurer has neither. Its output contract is the event log itself: TCG-compliant logs record every measurement so a verifier can later replay the log, recompute the expected PCR values, and compare them against the PCR contents (Raymond Mao, measured boot across TF-A / OP-TEE / U-Boot / Linux, weight 0.55: https://raymo200915.github.io/2024/12/10/Measured-Boot-and-TPM-Eventlog.html). The TCG EFI Protocol Specification defines the interfaces for exactly this: extend hashes to PCRs and append events to the TCG boot log (TCG EFI Protocol Specification, weight 0.91: https://trustedcomputinggroup.org/resource/tcg-efi-protocol-specification/). TCG's guidance on integrity measurements treats the event log as the attestation-relevant record (TCG Guidance on Integrity Measurements and Event Log Processing, weight 0.96: https://trustedcomputinggroup.org/wp-content/uploads/TCG-Guidance-Integrity-Measurements-Event-Log-Processing_v1_r0p118_24feb2022-1.pdf).

The practical consequence for debugging: you cannot ask the measurer whether it succeeded. You observe it only indirectly, through the event log and the PCR values it produced. A daemon that is alive but failing to record events looks identical to one that is working, until a verifier replays the log.

## Append-only per boot, reset on reboot

PCR extension is cumulative within a boot: each event is mixed into the PCR digest as it occurs, and an auditor validates the log by computing the expected PCR values from the log and comparing them to the TPM (Microsoft Learn, PCR banks on TPM 2.0 devices, weight 0.86: https://learn.microsoft.com/en-us/windows/security/hardware-security/tpm/switch-pcr-banks-on-tpm-2-0-devices). PCRs reset at reboot, so the append-only accumulation is per boot, not per lifetime. systemd documents its own PCR measurement model on the same principle, including NvPCRs backed by TPM2 NV Indexes to work around the small PCR number space (systemd.io, TPM2 PCR Measurements Made by systemd, weight 0.93: https://systemd.io/TPM2_PCR_MEASUREMENTS/).

The event log also has to be handed across boot stages. U-Boot's EFI TCG2 implementation both extends PCRs and appends events to an in-memory log that the kernel can later retrieve (DeepWiki on nxp-imx/uboot-imx TCG2 measurement, weight 0.34, weak backing: https://deepwiki.com/nxp-imx/uboot-imx/5.5-uefi-tcg2-tpm2-measurement). The propagation across the full chain, TF-A to OP-TEE to U-Boot to Linux, is what makes a single replayable log possible (Raymond Mao, weight 0.55: https://raymo200915.github.io/2024/12/10/Measured-Boot-and-TPM-Eventlog.html).

## What the mode proves, and the design caveat

The daemon-resident mode proves the sequence of what was loaded and executed during boot, in order, not merely a final verdict. That is strictly more information than a one-shot signature check, and it is what enables remote attestation later (doc 04). The cost is that the mode has no exit contract at all and is the hardest to exercise in CI, because there is no single command that represents it.

Caveat: in yubiOS this mode is a design statement, with the fTPM TA wired per the TF-A/OP-TEE measured boot integration; only the UKI and CHIPSEC one-shots are exercised in CI today. The event-log handoff details (which stage appends which entries) remain the least-exercised part of the chain (Trusted Firmware-A PoC, weight 0.92: https://trustedfirmware-a.readthedocs.io/en/latest/design_documents/measured_boot_poc.html).
