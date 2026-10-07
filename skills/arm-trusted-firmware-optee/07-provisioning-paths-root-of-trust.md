# 07 - Two provisioning paths for the root of trust

Scope: the per-board decision between Path A (fuse-enforced verified boot with the ROTPK hash in OTP) and Path B (measured-and-attested boot with a software root), and what each path can and cannot guarantee.

Grounding spine: yubi-OS/yubiOS skills/arm-trusted-firmware-optee/SKILL.md (source doc).

## The decision

The source doc's framing: the five TF-A stages are identical on both paths. What differs is the root, specifically whether you can burn the ROTPK hash into SoC OTP/eFuse. The path is decided per board and documented per board; it is not a global yubiOS setting.

## Path A: fuses burnable, enforcing

Per the source doc, Path A puts the ROTPK hash into OTP and runs full TBB, so BL1 rejects anything that does not chain to it. Bad code never executes. Named targets in the source doc:

- Raspberry Pi 5: OTP key hash plus counter-signed boot. The board-specific detail (OTP layout, EEPROM bootloader chain) lives in the source doc's RPi5 section, which this corpus treats as the authoritative reference.
- Raspberry Pi 4: testable pre-lock.
- Ampere: with documented fuse provisioning.

The external weakly-backed material corroborates the general factory flow this path follows: in provisioning, the device receives the root public-key hash burned into OTP, a unique device ID or key for attestation, and the OTP is locked with a write-protect fuse so it can never be altered again, with debug ports closed in the same step (https://sprchuoi.github.io/securebootloader/09-key-management-provisioning/, weight 0.11, weakly backed). A weakly-backed engineering guide makes the enforcement property explicit: secure boot is an enforcement mechanism that blocks code which does not meet policy (https://sheridantech.io/2026/05/12/secure-boot-2/, weight 0.08, weakly backed). That is the property Path A buys and Path B does not.

## Path B: no fuses, measured plus attested

Per the source doc, Path B is for boards with no fuses, vendor-locked fuses, or fuses not yet burned. There is no hardware rejection: a compromised stage still executes long enough to measure itself. The software root of trust comes from U-Boot FIT verified boot (public key in the U-Boot control DTB) plus measured boot into the fTPM. Trust is decided after boot, by local or remote attestation and by fTPM/YubiKey secret release. The source doc calls this evidence plus sealing, not enforcement, and points out the hard limit: Path B's trust anchor lives in writable firmware, so it is only as strong as the storage holding U-Boot and its key.

The attestation half has a mature production analogue: Microsoft's Azure Host Attestation service uses firmware measured boot plus host attestation to verify host integrity before workloads run, and validates that secure boot enforcement is active as part of that verification (https://learn.microsoft.com/en-us/azure/security/fundamentals/measured-boot-host-attestation, weight 0.20, weakly backed). The pattern maps directly onto Path B: the fTPM's PCRs stand in for the hardware TPM quote, and the attestation decision gates secret release rather than boot.

## Verified boot versus measured boot

The source doc's distinction between the paths is the industry distinction between the two mechanisms, and the weakly-backed material states it cleanly: secure boot blocks code that fails policy, while measured boot answers a different question, and teams that use the terms interchangeably are making a mistake (https://sheridantech.io/2026/05/12/secure-boot-2/, weight 0.08, weakly backed). Concretely for yubiOS:

- Path A uses verified boot (TBB) during boot plus measured boot as evidence afterward.
- Path B uses software verified boot inside U-Boot (FIT signatures) plus measured boot as the primary evidence, with enforcement deferred to the attestation and sealing step.

## Choosing a path

The source doc's operational rules:

1. Decide the path per board and document it.
2. Use Path B for dev boards and early bring-up.
3. Reserve Path A fuse burns for boards whose flow has been rehearsed end to end on sacrificial hardware, because OTP writes are one-way.

The third consideration is reinforced by the general provisioning literature: once the OTP write-protect fuse is blown the root public-key hash cannot be corrected, so a mistake in the burned hash is a bricked board, not a bad config (https://sprchuoi.github.io/securebootloader/09-key-management-provisioning/, weight 0.11, weakly backed).

## How the paths converge

Both paths share the fTPM, the event log, and the StandaloneMM-protected UEFI variables. What changes is who can stop bad code. On Path A the boot ROM and BL1 stop it; on Path B the attestation verifier stops the secrets, not the code. The source doc's broader rationale and diagrams live in yubiOS FUTURE.md, which it cites for this section.
