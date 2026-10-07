# ARM Trusted Firmware + OP-TEE knowledge corpus

Corpus explicating the yubiOS skill `skills/arm-trusted-firmware-optee/SKILL.md` (source of record: yubi-OS/yubiOS skills/arm-trusted-firmware-optee/SKILL.md): the ARM64 secure boot firmware stack for yubiOS, TF-A staging (BL1/BL2/BL31/BL32/BL33), Trusted Board Boot with FIP and the ROTPK chain of trust, OP-TEE as the BL32 secure-world OS, U-Boot as the BL33 non-secure bootloader, and the firmware-stage measured boot event log.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-boot-chain-staging.md](01-boot-chain-staging.md) | The five TF-A boot stages, exception levels, and the ROTPK anchor. |
| 02 | [02-trusted-board-boot-fip.md](02-trusted-board-boot-fip.md) | Trusted Board Boot, FIP packaging with fiptool, the cert chain walk, and the build flags that enable TBB. |
| 03 | [03-optee-bl32-secure-world.md](03-optee-bl32-secure-world.md) | OP-TEE as BL32: SPD=opteed dispatch, SMC routing, tee artifacts, RPMB secure storage, early TAs. |
| 04 | [04-uboot-bl33-measured-boot.md](04-uboot-bl33-measured-boot.md) | U-Boot as BL33: Kconfig block, fTPM driver, tpm2 flow, event log handoff to Linux. |
| 05 | [05-uboot-uefi-firmware.md](05-uboot-uefi-firmware.md) | U-Boot as UEFI firmware: EFI_LOADER, PK/KEK/db/dbx secure boot, TCG2 protocol, capsule updates. |
| 06 | [06-protected-uefi-variables-stmm.md](06-protected-uefi-variables-stmm.md) | EDK2 StandaloneMM as an OP-TEE module with RPMB backing for protected UEFI variables. |
| 07 | [07-provisioning-paths-root-of-trust.md](07-provisioning-paths-root-of-trust.md) | Path A (fuse-enforced) vs Path B (measured plus attested) provisioning of the root of trust. |
| 08 | [08-measured-boot-event-log-handoff.md](08-measured-boot-event-log-handoff.md) | Who measures what, the TCG2 event log, and Firmware Handoff Transfer List handoff. |

## Research summary

- Results collected: 96 kept across 16 queries (2 per subtopic), deduplicated to 70 unique URLs, all weighted.
- Weight split: 12 high (weight >= 0.5) / 58 low (weight < 0.5). Claims backed only by low-weight sources are labeled weakly backed in the docs.
- Primary spine: TF-A firmware-design.rst (0.83), TF-A trusted-board-boot.rst and tf-a.docs TBB (0.87), TF-A build options (0.81), OP-TEE secure boot (0.85), OP-TEE about and secure storage (0.82 to 0.83), OP-TEE StandAloneMM (0.74 to 0.75).
- Jev requests: 7 (1 outline score validation, 6 noul weighting batches via DefAPI direct), usage 9431 input / 1508 output tokens.
- Redos: 0 (no dig was thin enough to require a redo; no decide request failed).
- Skipped docs and why: 09 rpi5-otp-secure-boot and 10 yubios-integration-gotchas scored as padding-priority by the jev outline validation (0.46 and 0.34 with dominant drop probability). The source doc's RPi5 OTP section and its gotchas remain authoritative in the source doc itself; they are referenced from docs 02, 04, and 07 where relevant.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide (clef via DefAPI direct, typesafe/jev-1.13) 200.
