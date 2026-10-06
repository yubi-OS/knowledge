# 06 Assumptions and Exclusions

Scope: what the model assumes sound, what it assumes the owner does, and what is explicitly outside the prevention goals. This is an internal-record subtopic: no searXNG dig was run for it.

Grounding spine: yubi-OS/yubiOS docs/THREAT_MODEL.md (source doc), https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/THREAT_MODEL.md

## Cryptographic and component assumptions

The source doc assumes the following are sound unless yubiOS configures or composes them unsafely (source doc):

- Standard cryptographic primitives.
- YubiKey hardware isolation.
- PIV and FIDO2 implementations.
- LUKS2.
- Secure Boot verification.
- dm-verity.

The phrase "unless yubiOS configures or composes them unsafely" is the load-bearing part of the assumption: the model excludes component-internal flaws but keeps composition flaws fully in scope (source doc). A PAM ordering error, a token enrolled without PIN, or a dm-verity root not bound into the UKI are yubiOS failures, not excluded primitives failures.

## Owner assumptions

The source doc assumes the owner protects PINs and offline recovery material, verifies enrollment prompts, and does not intentionally enroll attacker-controlled keys; coercion and a malicious owner are outside the prevention goals (source doc). The physical-attacker story is consistent with this: a strong physical attacker may steal the YubiKey but may not know its PIN (source doc).

## Platform-status assumptions

The source doc makes two explicitly conditional claims about platform maturity (source doc):

- ARM64 Path A is not production-established until real boards demonstrate safe ROTPK/fuse provisioning, RPMB-backed state, debug lockdown, and the documented chain. QEMU and Path B evidence cannot substitute for that proof.

- x86-64 cannot claim an owner-controlled root below the UKI while OEM UEFI and the OEM TPM remain trusted.

Both are limitations, not controls: they bound what the system may claim, and the severity calibration treats overstating them as its own issue class (source doc).

## Hardware exclusions

A malicious CPU/SoC, immutable closed ROM behavior, and hardware implants below the selected platform boundary are out of scope (source doc). The doc attaches a guard to this exclusion: their presence must not be obscured by higher-layer attestation claims (source doc). In other words, the model will not let a PCR or fTPM assertion imply security below the declared boundary.

## Application and session exclusions

Application-level vulnerabilities are outside the product specification, but an application remains an attacker entry point into the active user session (source doc). OS sandbox escapes, cross-user compromise, and persistence into trusted system state remain in scope (source doc).

The model also excludes retroactive confidentiality after unlock: a powered-on, unlocked system exposes mounted plaintext to sufficiently privileged malware, and the goal after unlock is containment, least privilege, and preventing durable subversion of the trusted boot path, not retroactive confidentiality from root (source doc).

## Test-environment limits

VM, SoftHSM, and software-FIDO2 tests establish functional behavior only (source doc). They do not prove token hardware properties, physical-presence semantics, firmware ownership, RPMB freshness, fuse state, or real-board debug lockdown (source doc). This exclusion pairs with the control-maturity table: controls in the two lowest maturity rows must not reduce severity as if they were proven preventive controls (source doc).
