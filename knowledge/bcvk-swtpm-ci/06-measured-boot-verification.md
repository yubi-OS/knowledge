# 06 measured boot verification in VMs

Scope: what measured boot records, how the TPM2 event log reaches the OS, and the tpm2-tools commands a VM test uses to assert PCR state without hardware.

## What measured boot records

Measured boot records what was loaded and executed during boot rather than enforcing verification: "Measured Boot records what was loaded and executed during boot, instead of merely enforcing verification. Every boot component is measured (hashed), and the hash is: Extended into TPM PCR registers, and Logged in" the event log [1] (weight 0.352, weak backing). A managed-OS writeup frames the value the same way: configuring TPM 2.0 measured boot creates "a cryptographic record of the boot process that can detect tampering with boot components" [2] (weight 0.138, weak backing).

## The event log contract

The kernel documents the handoff: "The preboot firmware maintains an event log that gets new entries every time something gets ha"shed and extended, and that log is handed over from the preboot firmware to the operating system [3] (weight 0.955). In a DirectBoot VM the firmware half of this contract is the part that changes shape: what the guest can verify is what landed in the PCRs and the kernel-visible log after the boot path that actually ran (yubiOS ref premise; see doc 05).

The systemd project is the authoritative catalog of what to expect in a modern guest: "Various systemd components issue TPM2 PCR measurements during the boot process, both in UEFI mode and from userspace" [4] (weight 0.908). A swtpm-backed systemd guest should therefore show systemd-attributed measurements in its PCR state, which is the highest-signal assertion available in a hardware-free lane.

## Reading PCRs with tpm2-tools

The tpm2-tools suite is the standard reader. "tpm2_pcrread (1) - Displays PCR values. Without any arguments, tpm2_pcrread (1) outputs all PCRs and their hash banks. One can use specify the hash algorithm or a pcr list as an argument to filter th"e output [5] (weight 0.856; mirrored in the repo's man source at weight 0.722). The suite is "the source repository for the Trusted Platform Module (TPM2.0) tools based on tpm2-software/tpm2-tss" [6] (weight 0.913).

The tool families a test harness composes are grouped upstream as: PCRs via "tpm2_pcrread, tpm2_pcrextend, tpm2_pcrallocate", diagnostics via "tpm2_getcap, tpm2_rc_decode, tpm2_print", and system commands via "tpm2_startup, tpm2_clear, tpm2_dictionarylockout" [7] (weight 0.581). tpm2_startup is the exact primitive for the DirectBoot case from doc 02: when no firmware issued TPM_Startup, the test can drive startup itself before asserting PCR state [7] (weight 0.581).

Event log parsing has tooling too: tpm2-tools handles event logs through an event log parsing library, a callback-driven architecture, YAML formatting, and the tpm2_eventlog command-line tool [8] (weight 0.405, weak backing).

## What a VM test should actually assert

For yubiOS VM tests, the honest assertion set against a swtpm-backed guest is (yubiOS ref premise):

1. Presence: /dev/tpm0 and /dev/tpmrm0 exist (doc 03) [4].
2. PCR state: tpm2_pcrread returns non-zero, expected-shape values for the PCR banks the boot path touches [5] (weight 0.856).
3. Measurement provenance: where systemd is in the boot path, systemd-attributed measurements appear per the systemd PCR catalog [4] (weight 0.908).
4. Startup honesty: tests stay honest about DirectBoot limitations, asserting only what the actually-executed boot path measured (yubiOS ref premise).

What this lane cannot prove is hardware behavior: PCR reset policies, firmware TPM ordering, and physical YubiKey flows stay on the hardware leg (yubiOS ref premise).

## Sources

1. https://raymo200915.github.io/2024/12/10/Measured-Boot-and-TPM-Eventlog.html (weight 0.352, weak)
2. https://oneuptime.com/blog/post/2026-03-04-configure-tpm-2-0-measured-boot-rhel-9/view (weight 0.138, weak)
3. https://docs.kernel.org/security/tpm/tpm_event_log.html (weight 0.955)
4. https://systemd.io/TPM2_PCR_MEASUREMENTS/ (weight 0.908)
5. https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_pcrread.1/ (weight 0.856)
6. https://github.com/tpm2-software/tpm2-tools (weight 0.913)
7. https://deepwiki.com/tpm2-software/tpm2-tools/3-command-line-tools (weight 0.581)
8. https://deepwiki.com/tpm2-software/tpm2-tools/3.4.2-event-log-management (weight 0.405, weak)
