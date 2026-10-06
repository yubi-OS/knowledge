# 06. Recovery Expectations

Scope: the recovery-before-production-ready doctrine the onboarding doc imposes: every feature that can lock an owner out must have a documented recovery path before it counts as production-ready, and the 5 named lockout surfaces (disk unlock, homed, Secure Boot key enrollment, U-Boot console protection, first-boot validation gates).

Grounding spine: yubi-OS/yubiOS docs/ONBOARDING.md (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/ONBOARDING.md), last reviewed 2026-07-11.

## The doctrine

The source doc states the rule in one sentence: "Every feature that can lock an owner out must have a documented recovery path before it is treated as production-ready" (source doc). Two words do the heavy lifting. "Owner" rather than "user" points at the person with legitimate custody of the machine, so the threat model here is accidental lockout, lost keys, and botched enrollment, not attacker resistance. "Before" makes recovery a gate on production-readiness, not a follow-up task: a feature without a recovery path is by definition not production-ready, regardless of how well its primary path works.

## Surface 1: disk unlock

Disk unlock is the first named surface (source doc). The LUKS2 volume and its enrolled FIDO2 credentials (doc 04) are the system's hardest lockout: without a working unlock path the data behind the volume is unreachable. The checklist already supplies the layered credentials (primary key, backup key where supported, printed offline recovery key); the recovery-expectations rule requires the documented procedure that walks an owner from "primary key lost" to "volume unlocked" to exist in writing. General LUKS practice corroborates the layered approach: crypttab-based unlock configuration and recovery-key handling are standard documented mechanisms (https://www.golinuxcloud.com/mount-luks-encrypted-disk-partition-linux/, weight 0.19, weak backing), and a LUKS reference card treats recovery keys as a distinct unlock credential alongside passphrases and tokens (https://mahdi-n0rouzi.github.io/luks-cheatsheet/, weight 0.12, weak backing).

## Surface 2: homed

Homed is the second surface (source doc). A homed user directory is encrypted and bound to its enrolled authentication, so a lost key or a broken PAM state can leave the home inaccessible even when the disk itself unlocks. The recovery expectation here is the same: the documented path from "cannot log in to my home" back to a working home must exist before homed flows are called production-ready.

## Surface 3: Secure Boot key enrollment

Secure Boot key enrollment is the third surface (source doc). Enrolling the wrong keys, or enrolling then losing the signing key custody, can leave a machine that refuses every image it is offered. Because a bad enrollment state can persist across reboots, the recovery path (how to re-enroll or how to return the machine to a bootable state) must be documented ahead of the feature being declared production-ready. The doc's YubiKey checklist already separates PIV slot 9c signing material from everyday SSH keys (source doc), which reduces one class of enrollment accident; the recovery rule covers the rest.

## Surface 4: U-Boot console protection

U-Boot console protection is the fourth surface (source doc). U-Boot hardening guidance describes locking down the bootloader console precisely because an open console lets an attacker bypass verified boot (https://developer.toradex.com/torizon/security/u-boot-hardening-for-secure-boot/, weight 0.53), and the same hardening literature documents the flip side: protection mechanisms such as prompt disabling and console restrictions can lock out legitimate maintenance (https://www.lynx.com/blog/securing-u-boot-a-guide-to-mitigating-common-attack-vectors, weight 0.17, weak backing; https://ejaaskel.dev/protecting-u-boot-command-line/, weight 0.12, weak backing). That is exactly the lockout class the yubiOS rule targets: the protective feature and its documented escape hatch must land together.

## Surface 5: first-boot validation gates

First-boot validation gates are the fifth surface (source doc). A gate that blocks boot until validation passes can, if it fails incorrectly, produce a machine that never completes a boot. The recovery expectation applies at its strictest here, because the recovery path for a first-boot gate failure may itself have to work without a running OS.

## Why this section lives in an onboarding doc

The placement is a message to new contributors: lockout recovery is part of the definition of done, established at onboarding time so that it shapes every feature design rather than being retrofitted. The doc's YubiKey checklist and its recovery rule are two halves of one discipline: the checklist creates the fallback credentials, and the recovery-expectations rule requires the documented procedures that use them.
