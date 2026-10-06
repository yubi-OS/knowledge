# 08 - Measured boot event log and the Firmware Handoff Transfer List

Scope: who measures what at each stage, how the TCG2 event log flows from BL1 through U-Boot into Linux, and why modern TF-A, OP-TEE, and U-Boot pass the log via the Firmware Handoff Transfer List instead of ad-hoc memory regions.

Grounding spine: yubi-OS/yubiOS skills/arm-trusted-firmware-optee/SKILL.md (source doc).

## The measurement table

The source doc gives the division of measurement labor across the chain:

| Stage | Measures | Into |
|---|---|---|
| BL1 (ROM) | BL2 | event log (memory) |
| BL2 | BL31, BL32 (OP-TEE), BL33 (U-Boot) | event log |
| U-Boot | replays log into PCRs; then kernel/DTB/initramfs | fTPM PCRs (0/1 firmware, 8/9 OS) |
| Linux | consumes log via DTB; IMA measures userspace | fTPM via `tpm_ftpm_tee` |

The result is a single continuous evidence chain: firmware-stage measurements land in PCRs 0 and 1 territory, OS-stage measurements in PCRs 8 and 9, and userspace measurements continue into the same fTPM once Linux is up.

## The handoff problem

Early in the chain the event log lives in plain memory. BL1 writes it, BL2 appends, and every downstream consumer needs to find it, at the right address, in the right format, without a shared build-time contract. The source doc's statement: modern TF-A (2.10+), OP-TEE 4.x, and U-Boot pass the log via the Firmware Handoff spec using Transfer Lists (`BLOBLISTT_TPM_EVLOG`) instead of ad-hoc memory regions, and new ports should prefer this.

The Firmware Handoff specification documents the entry types that make this work, including the TPM event log table entry layout (XFERLIST_EVLOG), the TPM CRB base address table entry layout (XFERLIST_TPM_CRB_BASE), and the DT overlay entry layout, alongside entries related to Trusted Firmware and the register usage contract at the handoff boundary (https://firmwarehandoff.github.io/firmware_handoff/main/index.html, weight 0.21, weakly backed).

The U-Boot side of the migration is visible in its patch history: a patch series moving U-Boot's TPM event log source to the bloblist (the U-Boot name for transfer lists) replaced `TPM2_EVENT_LOG_SIZE` with `CONFIG_TPM2_EVENT_LOG_SIZE` and kept the buffer pointed to by `sml` as the fallback, because that is the right place for Linux to discover the event log (https://lists.denx.de/pipermail/u-boot/2025-January/578760.html, weight 0.19, weakly backed). That patch is the concrete mechanism behind the source doc's `linux,sml-base` handoff in document 04: the bloblist carries the log, and the DTB properties tell the kernel where the buffer lives.

## TCG2 log format

The log itself follows the TCG specifications. The TCG EFI Protocol Specification defines the structures and APIs for the OS to interact with UEFI firmware for exactly this data: whether a TPM is present, which PCR banks are active, changing active PCR banks, obtaining the TCG boot log, extending hashes to PCRs, and appending events to the TCG boot log (https://trustedcomputinggroup.org/resource/tcg-efi-protocol-specification/, weight 0.28, weakly backed). The PC Client Platform Firmware Profile layers the platform rules on top, including which measurements platform firmware must log and the requirement not to log measurements for a hidden TPM while capping PCR[0-7] (https://trustedcomputinggroup.org/wp-content/uploads/TCG_PCClient_PFP_r1p05_v23_pub.pdf, weight 0.22, weakly backed).

In the U-Boot UEFI stage, the measured boot documentation states that the EFI subsystem implements the EFI TCG protocol and the TCG PC Client Platform Firmware Profile, which define the binaries to be measured and the PCRs to use (https://docs.u-boot-project.org/en/latest/usage/measured_boot.html, weight 0.29, weakly backed).

## Sizing and the silent truncation gotcha

The source doc's gotcha: event log size mismatches between TF-A (`EVENT_LOG_LEVEL`) and U-Boot (`CONFIG_TPM2_EVENT_LOG_SIZE`) truncate measurements silently. The yubiOS value is `CONFIG_TPM2_EVENT_LOG_SIZE=0x10000`. The failure mode is nasty because nothing errors: the log is simply cut, later measurements vanish, and the PCRs attest a shorter boot than actually happened. Any port change that adds measured images (a new BL33 payload, extra early TAs) should recheck the log budget on both sides.

## Where the chain ends up

Linux consumes the log via the DTB and measures userspace through IMA into the fTPM via the `tpm_ftpm_tee` driver (source doc). At that point the fTPM holds the full boot evidence chain in its PCRs, and the sealing and attestation decisions described in document 07 can be made against it. The source doc notes the sibling skill `ftpm-optee-tpm` owns the fTPM TA side of this and references the U-Boot SPL measured boot worked example by Raymond Mao, "TPM 2.0 Event Log for U-Boot SPL on an ARMv8 Measured Boot Chain", as the worked reference for the SPL portion of the chain.
