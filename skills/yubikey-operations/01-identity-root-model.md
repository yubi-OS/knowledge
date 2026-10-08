# 01 - Identity Root Model: YubiKey vs fTPM

Scope: the yubiOS identity split, owner-held cryptographic identity versus platform-bound attestation, and what the YubiKey is used for on a yubiOS system.

## The identity root

yubiOS is named after the YubiKey because the YubiKey is the project's identity root: the load-bearing primitive that distinguishes owner-held cryptographic identity from platform-bound identity. Every long-lived key on a yubiOS system that the user holds personally, rather than the system holding it, lives on a YubiKey (source doc: `yubi-OS/yubiOS skills/yubikey-operations/SKILL.md`).

The yubiOS split is two-sided:

- YubiKey = user-held, removable, owner-controlled identity. Used for SSH, Git signing, disk unlock (LUKS2 FIDO2), PAM login (pam-u2f), home unlock (systemd-homed), age and age-plugin-yubikey decryption, TPM2-PKCS#11 attestation key fallback, and OAuth/webauthn (source doc).
- fTPM = platform-bound integrity attestation. Used for PCR measurement, IMA, TPM2 quote emission, LUKS2 TPM2 unlock, and measured boot. It pairs with the YubiKey and never substitutes for it (source doc).

## Why the distinction matters

The two sides answer different questions. A platform TPM anchors trust in the machine; a user-held key anchors trust in the person operating it. Conflating them breaks the threat model, which is the first anti-pattern the source doc names: using a YubiKey as a TPM substitute. The fTPM path is for PCR/IMA measurement and the YubiKey path is for user identity (source doc).

The broader FIDO2 landscape backs this framing. FIDO2 is a set of open authentication standards for secure, passwordless and multi-factor authentication (https://www.yubico.com/authentication-standards/fido2/, weight 0.86). The standards commonly known as FIDO2 are WebAuthn and CTAP, with WebAuthn covering the browser API that manages passkeys (https://fidoalliance.org/passkeys/, weight 0.79). Microsoft's Security 101 explainer, a weaker secondary source, states FIDO2 keeps private authentication keys on the user's device rather than on a server (https://www.microsoft.com/en-us/security/business/security-101/what-is-fido2, weight 0.47, weak backing). The same weakly-weighted source notes users can authenticate with security keys, biometrics, or PINs (weight 0.47, weak backing).

One StackExchange discussion, carried at weak weight 0.12 and used only as context, records that FIDO2 secrets live in the security key itself and not in the platform TPM, which is why Windows Hello pairs FIDO2 with a motherboard TPM (https://security.stackexchange.com/questions/198555/fido2-on-windows-why-do-i-need-a-tpm, weight 0.12, weak backing). That platform-side pairing requirement is exactly the distinction yubiOS separates: the YubiKey holds the user's secrets, and a platform-bound attester holds measurement state.

## Owner-held key properties

What makes a user-held key valuable is that the private key never leaves the token and each use is bound to physical presence. Yubico's developer documentation on Git signing describes hardware-backed verification where each signature requires a physical touch on the YubiKey (https://developers.yubico.com/SSH/Securing_git_with_SSH_and_FIDO2.html, weight 0.85). A third-party writeup at weak weight 0.17 makes the same point in stronger terms: a software signing key is only as trustworthy as the disk it lives on, while a YubiKey moves the private key into a secure element that never exports it and binds each signature to a physical touch (https://www.git-automation.com/commit-signing-supply-chain-security/gpg-vs-ssh-commit-signing/signing-git-commits-with-a-yubikey/, weight 0.17, weak backing).

This property is what lets the YubiKey serve as a root of trust that the user carries rather than one the platform manages. The community YubiKey guide by drduh, at weak weight 0.34, documents the same operational posture for GnuPG and SSH use (https://github.com/drduh/YubiKey-Guide, weight 0.34, weak backing).

## Scope boundary

The source doc sets hard boundaries on where this identity root applies. Do not use this skill for platform-bound identity (TPM, fTPM, TPM2 PCR sealing), for UKI signing with a PIV/PKCS#11 key (that is the mkosi-image-builder skill), for SSH agent forwarding or Kerberos, or for non-YubiKey hardware security modules such as TPM USB discrete devices, Nitrokey, or OnlyKey. Those have similar patterns but different pin sets, and this skill is YubiKey-specific (source doc).

## yubiOS primitives served

The source doc maps this skill onto the yubiOS 10-primitive framework: P8 cryptographic identity (primary), P2 trust chain (root of trust), P1 attestation (FIDO2 attestation certificate), and P7 audit/evidence (key-use log). The skill anchors the user-held key component of the trust chain; FIDO2 and PIV enrollment, ssh-key provisioning, and attestation certificate extraction all flow into the trust chain through this skill (source doc). The yubiOS identity model pairs this skill's user-held keys with the fTPM per ftpm-optee-tpm for platform-bound attestation, and this skill contributes one side of that pair (source doc).

## Where the world has moved

The FIDO2 and passkey ecosystems have continued to formalize passkey semantics since the source doc was written. A Yubico developer guide page states that a WebAuthn credential is not considered a passkey unless it is discoverable (https://developers.yubico.com/Passkeys/Passkey_concepts/Discoverable_vs_non-discoverable_credentials.html, weight 0.92). That is a refinement, not a contradiction: yubiOS treats the YubiKey passkey as the primary webauthn credential with platform passkeys as fallback only (source doc), and the discoverability criterion defines what counts as a passkey inside that posture.

## Takeaway

The identity root model is a partition, not a hierarchy. Owner-held keys on a YubiKey carry identity that survives machine replacement; platform-bound attestation carries machine integrity that survives owner change. yubiOS keeps both, and this skill owns the owner-held side.
