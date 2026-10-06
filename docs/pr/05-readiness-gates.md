# 05 - Readiness gates 0 through 3

Scope: the 4-gate evidence ladder that controls what the campaign may say, from repository hygiene (Gate 0) through build in public (Gate 1), physical-YubiKey technical preview (Gate 2), and the flagship ARM64 launch (Gate 3).

Grounding spine: yubi-OS/yubiOS docs/PR.md, section "Readiness gates". Where the gate lists name firmware-stage mechanisms, dig corroboration is included with jev weights.

## Gate 0: safe to amplify the repository

Complete before proactive outreach (source doc: yubi-OS/yubiOS docs/PR.md):

- Complete a name and trademark review for "yubiOS," document independence from Yubico, and review logo use. This is a launch-risk check, not a legal conclusion.
- Reconcile the README and repository description with the claim ledger: remove or qualify "No TPM," "sole root," "at every layer," and unqualified "ships" language.
- Put a destructive-install warning, supported-hardware matrix, backup requirement, and recovery link beside every public disk-write command.
- Confirm that public latest, immutable, dev, installer, and firmware tags match the documented classification.
- Publish a current release-evidence page linking the commit, build, tests, artifact digests, provenance, SBOM, and known gaps.

The enforcement rule: if any of the first 5 items are incomplete, the project remains in quiet community-research mode. No proactive outreach at all (source doc).

## Gate 1: build-in-public campaign

Required evidence (source doc):

- A reproducible build from a documented commit.
- A current CI summary that distinguishes green, failed, skipped, and non-blocking jobs.
- Verification that TEST-only authenticator tooling is absent from production tags.
- A public demo or log showing at least one signed-UKI or FIDO2 flow, with its trust level labeled.
- A current blocker list and a fast correction path for public factual errors.

Allowed language: "building," "technical preview," "seeking reviewers," and "here is what is proven today" (source doc).

## Gate 2: physical-YubiKey technical preview

Required evidence (source doc):

- Physical YubiKey enrollment and unlock on named hardware.
- PIV-backed signing and independent signature verification.
- Lost-token and recovery-key rehearsal.
- Repeatable commands, logs, versions, and video from a clean install.
- A second person reproduces the flow without private coaching.

Allowed language: "hardware-backed technical preview on tested configurations" (source doc).

## Gate 3: flagship ARM64 launch

Required evidence (source doc):

- An exact Path A board and owner-provisioning record.
- ROTPK/fuse rehearsal and read-back evidence on sacrificial hardware.
- OP-TEE, RPMB-backed StandaloneMM variables, fTPM NV, U-Boot UEFI Secure Boot, and TCG2 evidence.
- The same signed UKI booted across the documented ARM64 and x86-64 paths.
- Recovery for failed provisioning, lost token, bad update, and failed Secure Boot enrollment.
- An external technical review and closure or explicit acceptance of high-severity findings.

Only after this gate may the campaign use "launch," "release," or production Path A language (source doc).

## Mechanism corroboration from the dig

Gate 3 names 5 firmware-stage mechanisms. The dig confirms each is a documented, externally verifiable mechanism rather than project-internal shorthand:

- U-Boot measured boot is upstream-documented: U-Boot measures the operating system image, the initrd image, and the bootargs environment by default (https://docs.u-boot-project.org/en/latest/usage/measured_boot.html, jev weight 0.86).
- U-Boot's UEFI implementation, the substrate for the gate's "U-Boot UEFI Secure Boot" evidence, is upstream-documented (https://docs.u-boot-project.org/en/latest/develop/uefi/uefi.html, jev weight 0.8).
- OP-TEE's RPMB secure storage, the storage class behind "RPMB-backed StandaloneMM variables," is documented and enabled via the CFG_RPMB configuration (https://optee.readthedocs.io/en/latest/architecture/secure_storage.html, jev weight 0.88).
- The fTPM mechanism, Microsoft's TPM 2.0 reference implementation running as an OP-TEE Trusted Application, is published upstream (https://github.com/OP-TEE/optee_ftpm, jev weight 0.59) with the TA source under microsoft/MSRSec (https://github.com/microsoft/MSRSec/blob/master/TAs/optee_ta/fTPM/README.md, jev weight 0.71).
- Vendor integration of exactly this pairing exists in the wild: a U-Boot mailing-list patch enables fTPM and RPMB on TI K3 boards, providing TPM 2.0 functionality through the fTPM Trusted Application running in the OP-TEE secure world (https://lists.denx.de/pipermail/u-boot/2026-May/618495.html, jev weight 0.61).

Weaker-weighted corroborations, labeled weak: an independent walkthrough of measured boot and the TPM event log across TF-A, OP-TEE, U-Boot, and Linux (https://raymo200915.github.io/2024/12/10/Measured-Boot-and-TPM-Eventlog.html, jev weight 0.15) and a wolfBoot AArch64 UEFI verified-boot writeup that uses the TCG2 event log for attestation (https://www.wolfssl.com/wolfboot-brings-verified-boot-to-aarch64-uefi-booting-linux-on-the-nvidia-jetson-orin-nano/, jev weight 0.35). Both are used only to show the evidence chain the gate asks for is a known pattern, not to add claims.

The gates are the mechanism that keeps the campaign thesis honest: each gate converts a category of language from forbidden to allowed, and the conversion is keyed to reproducible evidence, not time elapsed (source doc).
