# 04 - PRF and Passkeys

Scope: the FIDO2 PRF extension (hmac-secret v2) and the passkey / discoverable-credential posture, with the YubiKey as the primary webauthn credential.

## PRF: deterministic secrets from a YubiKey

The FIDO2 PRF extension, described in the source doc as HMAC Secret extension v2, returns a 32-byte deterministic secret for a given (credential_id, salt) pair (source doc: `yubi-OS/yubiOS skills/yubikey-operations/SKILL.md`). Yubico's documentation of the hmac-secret and hmac-secret-mc extensions confirms the linkage: the extensions create a symmetric secret value tied to a credential, usable for encryption and decryption, and support WebAuthn's Pseudo-Random Function with YubiKeys, subject to firmware version (https://docs.yubico.com/yesdk/users-manual/application-fido2/hmac-secret.html, weight 0.93; the same statement appears in the Yubico.NET.SDK documentation at weight 0.78).

The source doc lists three consumers:

- Bitwarden / 1Password vault encryption
- WireGuard PSK derivation
- Deterministic-key SSH (rare)

The deciding property is determinism plus entropy: for consumers needing cross-device sync, PRF on a YubiKey is better than hmac-secret because it offers more entropy per call, but the consumer must support PRF (source doc). hmac-secret remains the right primitive for consumers that only speak the older extension, such as systemd-cryptenroll flows covered in doc 03.

## Passkeys: discoverability is the definition

yubiOS's design intent is that a passkey on a YubiKey should be the primary webauthn credential, with platform passkeys (iCloud Keychain, Chrome profile passkeys) as fallback only. The YubiKey passkey is portable across devices (source doc).

The dig sharpens what "passkey" means. Yubico's passkey concepts page states that a WebAuthn credential is not considered a passkey unless it is discoverable, and that in the passkey context you focus primarily on discoverable credentials (https://developers.yubico.com/Passkeys/Passkey_concepts/Discoverable_vs_non-discoverable_credentials.html, weight 0.92). Yubico's passkey FAQ adds the storage distinction: a passkey stored on a YubiKey is device-bound to a portable, purpose-built security device, unlike a platform passkey (https://docs.yubico.com/hardware/yubikey-guidance/best-practices/all-faq-passkeys.html, weight 0.88). The FIDO Alliance frames passkeys as the same FIDO2 standards, WebAuthn and CTAP, deployed for sign-in (https://fidoalliance.org/passkeys/, weight 0.80).

## Resident keys and credential management

Discoverable credentials are also called resident keys. Yubico's WebAuthn developer guide describes the Credential Management capability: the WebAuthn client can display the credentials that reside on the YubiKey with firmware 5.2.3 and above so the user can act on them, showing each credential's relying party information and credential descriptor, as well as the number of discoverable credentials on the authenticator (https://developers.yubico.com/WebAuthn/WebAuthn_Developer_Guide/Resident_Keys.html, weight 0.91).

For yubiOS this matters operationally. Credential Management is the inventory mechanism: it is how an audit enumerates what the key holds, and it pairs with the attestation extraction covered in doc 08 to tie each credential to the physical device.

## Where PRF fits the yubiOS primitive model

The source doc maps this skill to P8 cryptographic identity (primary), P2 trust chain, P1 attestation, and P7 audit/evidence. PRF strengthens P8: a 32-byte deterministic secret derived on-device, never exported, means vault keys and WireGuard PSKs inherit the YubiKey's unexportability. The audit side inherits too: the (credential_id, salt) pair that produced a secret is a fact about the device that can be logged, which is the P7 key-use log pattern the source doc names.

## Practical posture

Compose the two layers as the source doc does. Passkeys on the YubiKey carry webauthn identity, portable across devices and primary by policy; platform passkeys exist only as fallback. PRF carries secret derivation for vault and network-layer consumers that support it. hmac-secret carries disk and home unlock where the consumer is systemd. Choosing between them per consumer, rather than forcing one extension everywhere, is the pattern: the consumer's support level decides, not preference.

## Takeaway

PRF and passkeys are the modern FIDO2 surface on a YubiKey: deterministic secrets for programmatic consumers, discoverable credentials for webauthn. Both depend on firmware level (5.2.3 and above for the resident-key and Credential Management features), both keep secrets on-device, and both feed the same audit posture the rest of this corpus documents.
