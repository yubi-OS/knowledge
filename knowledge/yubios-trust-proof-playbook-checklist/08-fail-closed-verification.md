# Fail-closed verification

## Scope

Verifying fail-closed behavior by breaking one thing at a time: wrong image, missing key, modified UKI, corrupted boot artifact, invalid enrollment state.

## The failure axis

The last verification axis is behavioral: the system must fail closed. The yubiOS playbook's failure-behavior section specifies the test protocol: "Break one thing at a time: wrong image, missing key, modified UKI, corrupted boot artifact, invalid enrollment state", and the expected result for each is "boot refusal, safe degradation, or clear error with no silent trust bypass" (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source). The fail condition is equally explicit: the system continues normally, the failure is hidden, or trust is bypassed automatically.

The printable checklist turns this into 4 checkboxes, one per tamper class, each reading "test failed closed": wrong image, missing key, modified UKI, corrupted boot artifact (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source).

## Why verification-failure behavior is the strongest signal

A Secure Boot chain of trust failure at POST is "the secure boot chain of trust doing exactly what it was designed to do: refusing to execute a bootloader" it cannot verify (source: https://www.kbytechnologies.com/tech-fundamentals/fixing-uefi-secure-boot-chain-of-trust-failures, weight 0.270, weak backing). The refusal is the feature. A checklist that only verifies positive paths (the right image boots, the right key unlocks) has verified half the trust story; the other half is what happens on the wrong input.

Platform guidance makes the same demand of firmware: Secure Boot conditions must be verified before troubleshooting proceeds, and the verification-failure paths are first-class diagnostic objects, not afterthoughts (source: https://support.microsoft.com/en-us/servicing/os/secure-boot/2026/03/secure-boot-troubleshooting-guide, weight 0.830, authoritative backing). End-to-end secure boot guides treat the UKI signature chain and its failure modes as the core content, alongside the key enrollment that makes verification possible (source: https://github.com/iokanto/linux-secureboot-guide, weight 0.653, authoritative backing).

Hardware security practice generalizes the property: fail-closed or restricted safe mode when verification fails, with tamper detection wired so that detected probing latches rather than resets (source: https://icnavigator.com/applications/avionics-mission-systems/crypto-anti-tamper/, weight 0.340, weak backing).

## Test protocol rules

The protocol has 4 rules, each observable in the yubiOS artifact:

1. One break at a time. Each test mutates exactly one trust input so the failure is attributable to that input.
2. Reboot after each change. Boot-time enforcement is only observable across a reboot; a tampered UKI that is "refused" by a running system proves nothing about the boot path.
3. Expected result pre-committed. Each checkbox names the expected outcome (failed closed) before the test runs, so success cannot be redefined mid-test.
4. Disposable hardware. Wrong images, missing keys, and corrupted boot artifacts are destructive tests; the yubiOS plan runs the entire 24-hour cycle on a disposable VM or spare disk (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source).

## The mechanical version

In the falsifiable rule table, the wrong-image test is itself a command: install a deliberately dead digest on disposable hardware, and the pass condition is "boot refused" (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source). That closes the loop between the behavioral axis and the mechanical one: even the most destructive, most physical test reduces to a command with a decidable outcome, which means the fail-closed property can be re-verified by anyone with the worksheet and a spare machine.
