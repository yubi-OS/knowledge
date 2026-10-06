# 01 - Trust anchor and identity stack (ADR-001, ADR-004, ADR-005)

Scope: the YubiKey 5 series as the sole trust anchor, ed25519-sk resident keys for SSH, and the pam-u2f 1.3.1 floor for sudo and login, including the recovery and single-point-of-failure trade-offs the ADR set accepts.

## Why the YubiKey replaces the TPM (ADR-001)

The source doc (yubi-OS/yubiOS docs/ADR.md, ADR-001, status Accepted) records the founding decision: most secure boot and disk encryption stacks assume a TPM 2.0 chip, but TPMs are OEM controlled, soldered to specific motherboards, and can be provisioned with vendor keys the user never sees. yubiOS instead uses the YubiKey 5 series as the sole trust anchor. The recorded rationale has 4 parts: hardware bound key material that travels with the user rather than the board, an open specification surface (FIDO2/CTAP2, PIV/PKCS#11, OATH), touch requirement by default so decryption can never happen silently, and user generated keys with no OEM or manufacturer trust chain. (source doc)

The dig corroborates the protocol breadth claimed by ADR-001: Yubico's own technical manual documents the FIDO2, FIDO U2F, and PIV applications on the key family (https://docs.yubico.com/hardware/yubikey/yk-tech-manual/, weight 0.69, authoritative). Yubico's FIDO2 standards page, a marketing-adjacent page, backs the general FIDO2/WebAuthn positioning at weak weight 0.47 (https://www.yubico.com/authentication-standards/fido2/, weak). Third party comparison posts about FIDO2 hardware keys scored 0.09 and were not used (weak, aggregator).

## SSH: ed25519-sk with resident credentials (ADR-004)

ADR-004 (source doc, status Accepted) decides that SSH uses ed25519-sk with `-O resident` discoverable credentials. The rationale: the private key never leaves the YubiKey, only a credential ID plus public key stub lives on disk; `-O resident` stores the credential in the YubiKey internal FIDO2 storage with its limited slots; `ssh-keygen -K` can regenerate the stub on a new machine from the YubiKey alone; and `-O verify-required` forces the FIDO2 PIN on every SSH use, which is stronger than touch only. The recorded version floor: OpenSSH 8.2 or later (the release that introduced FIDO2 support), libfido2 1.10 or later, and YubiKey firmware 5.2.3 or later for ed25519-sk. (source doc; OpenSSH 8.2 release notes cited at https://www.openssh.com/txt/release-8.2)

## Login and sudo: pam-u2f with a hard version floor (ADR-005)

ADR-005 (source doc, status Accepted) sets pam-u2f as the PAM module for sudo and login with minimum version 1.3.1. The reason is concrete: CVE-2025-23013, a partial authentication bypass in pam-u2f versions below 1.3.1, published by Yubico as advisory YSA-2025-01 (https://www.yubico.com/support/security-advisories/ysa-2025-01/, weight 0.74, authoritative). The NVD entry corroborates the mechanism: in Yubico pam-u2f before 1.3.1, local privilege escalation can sometimes occur (https://nvd.nist.gov/vuln/detail/cve-2025-23013, weight 0.67, authoritative). Secondary vulnerability databases repeat the same CVSS 7.x severity story at weak weights 0.08 to 0.10 (for example https://www.sentinelone.com/vulnerability-database/cve-2025-23013/, weak) and are recorded here only as corroboration.

Two configuration choices in ADR-005 (source doc) shape the enforcement posture: the module is stacked as `auth required pam_u2f.so` rather than `sufficient`, so YubiKey touch is always needed even if another factor succeeds, and `authfile=/etc/yubico/u2f_keys` centralizes enrolled keys so the set of authorized keys is auditable from one file.

## Recovery and accepted trade-offs

ADR-001 records the honest costs (source doc): a lost YubiKey means lockout without a recovery key, so recovery is documented in ONBOARDING.md; a single key is a single point of failure, so enrolling a backup YubiKey is recommended; and FIDO2 credentials are device bound and cannot be backed up cryptographically. ADR-005 adds its own recovery path (source doc): if the YubiKey is lost, boot to an emergency shell via the `rd.break` kernel argument, mount the root filesystem, and comment out the pam_u2f line in /etc/pam.d/sudo. The interplay matters for the corpus: ADR-003's mandatory recovery key enrollment covers the disk, ADR-004's `-O resident` stub regeneration covers SSH, and ADR-005's emergency shell path covers sudo. Each identity surface has a separate escape hatch, and none of them depends on a TPM.

## How this composes into the trust architecture

The ADR set puts the YubiKey at 3 layers: the disk unlock secret derivation (ADR-003), the SSH credential (ADR-004), and the login and sudo factor (ADR-005). ADR-002 extends it into Secure Boot signing through PIV slot 9c, and ADR-009 into per-user home volumes through systemd-homed. The design invariant is that the trust anchor is a removable, user owned device with an open protocol stack, not a soldered chip; every later ADR treats "lost YubiKey" as the failure mode to design against rather than "stolen motherboard".

## Sources considered

| Source | Weight | Role |
|---|---|---|
| https://www.yubico.com/support/security-advisories/ysa-2025-01/ | 0.74 | CVE-2025-23013 primary advisory |
| https://docs.yubico.com/hardware/yubikey/yk-tech-manual/ | 0.69 | YubiKey protocol applications |
| https://nvd.nist.gov/vuln/detail/cve-2025-23013 | 0.67 | CVE mechanism corroboration |
| https://www.yubico.com/authentication-standards/fido2/ | 0.47 (weak) | FIDO2 positioning |
| https://www.yubico.com/support/download/ | 0.47 (weak) | tooling surface |
| https://www.yubico.com/ | 0.41 (weak) | vendor page |
| https://www.yubico.com/products/ | 0.26 (weak) | product page |
| https://www.sentinelone.com/vulnerability-database/cve-2025-23013/ | 0.10 (weak) | aggregator corroboration |
| yubi-OS/yubiOS docs/ADR.md (source doc) | n/a | ADR-001, ADR-004, ADR-005 text |
