# 03 - FIDO2 hmac-secret

Scope: the hmac-secret extension, how it derives symmetric secrets, and its three yubiOS consumers: systemd-cryptenroll for LUKS2, systemd-homed, and age-plugin-yubikey.

## What hmac-secret does

The FIDO2 hmac-secret extension is the yubiOS-recommended way to derive a symmetric key from a YubiKey (source doc: `yubi-OS/yubiOS skills/yubikey-operations/SKILL.md`). Mechanically, Yubico's SDK documentation describes the hmac-secret and hmac-secret-mc extensions as enabling the creation of a symmetric secret value tied to a credential, a secret that can be used for encryption and decryption and that supports WebAuthn's Pseudo-Random Function (PRF) on YubiKeys (https://docs.yubico.com/yesdk/users-manual/application-fido2/hmac-secret.html, weight 0.93). The same SDK reference, mirrored in the Yubico.NET.SDK repository documentation, states that support depends on firmware version (https://github.com/Yubico/Yubico.NET.SDK/blob/develop/docs/users-manual/application-fido2/hmac-secret.md/, weight 0.78).

The extension is a CTAP2 extension in the FIDO2 standard family. FIDO2 is the set of open authentication standards for passwordless and multi-factor authentication (https://www.yubico.com/authentication-standards/fido2/, weight 0.86), and the passkey-facing layer is WebAuthn plus CTAP (https://fidoalliance.org/passkeys/, weight 0.80).

## Consumer 1: LUKS2 disk unlock via systemd-cryptenroll

The first consumer is `systemd-cryptenroll --fido2` for LUKS2 unlock (source doc). The timeline is documented in Lennart Poettering's 0pointer writeup: with systemd v248, the systemd-cryptsetup component gained direct support for unlocking encrypted storage with FIDO2 security tokens, at least those implementing the hmac-secret extension (https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html, weight 0.61). The systemd-cryptenroll manual page describes the tool as enrolling hardware security tokens and devices, including PKCS#11, FIDO2, and TPM2 tokens, into a LUKS2 encrypted volume (https://man7.org/linux/man-pages/man1/systemd-cryptenroll.1.html, weight 0.62).

Practical guidance from the ArchWiki page, carried at weight 0.50: any FIDO2 token that supports the hmac-secret extension can be used with systemd-cryptenroll, and the example flow enrolls a FIDO2 token to an encrypted LUKS2 block device requiring only user presence as authentication; after enrolling hardware tokens into the LUKS2 volumes, you must configure your system to use them (https://wiki.archlinux.org/title/Systemd-cryptenroll, weight 0.50). That last step, configuring systemd-cryptsetup to consult the token at boot, is the part most often missed.

An independent project at weak weight 0.21, fido2-luks, shows the same extension being used as a strong single factor for LUKS encryption across FIDO2 tokens including YubiKeys, Google Titan, and Nitrokeys, and cites brute-force protection as a benefit of the hmac-secret design (https://github.com/nyancient/fido2-luks, weight 0.21, weak backing).

## Consumer 2: home-directory unlock via systemd-homed

The second consumer is `systemd-homed` for home-directory unlock (source doc). The hmac-secret is bound to the YubiKey's attestation key plus a per-credential salt stored in the LUKS2 token, homed record, or age identity (source doc). This binding is what makes the key portable across machines while remaining unexportable: the secret never leaves the YubiKey, and what the host stores is only the salt.

## Consumer 3: age encryption via age-plugin-yubikey

The third consumer is `age-plugin-yubikey` for age encryption (source doc). Community discussion of using the FIDO2 hmac-secret extension for age encryption goes back to the FiloSottile/age repository discussions, carried at weak weight 0.13, which note that some FIDO2 keys including YubiKeys support the HMAC Secret Extension per the FIDO Alliance CTAP2 specification (https://github.com/FiloSottile/age/discussions/390, weight 0.13, weak backing).

## Rotation is re-enrollment everywhere

The critical operational property: rotating the YubiKey means re-enrolling every consumer with the new key (source doc). Because each consumer stores a salt paired with the key that generated the secret, a new physical key produces a different secret for the same salt, and the LUKS2 token, homed record, and age identity all need the new enrollment. This is why the backup/restore discipline of doc 07 insists on the dual-enrollment window: the old and new key both enrolled before the old one is decommissioned.

## hmac-secret versus PRF

If the consumer needs cross-device sync, PRF on a YubiKey is better than hmac-secret because it offers more entropy per call, but the consumer must support PRF (source doc). PRF is covered in doc 04. The distinction in practice: hmac-secret derives a secret bound to a single credential on one key, while PRF derives a deterministic 32-byte secret for a given credential_id and salt pair and is what modern consumers should target.

## Takeaway

hmac-secret is the glue between user presence and disk or data encryption on yubiOS. Its properties are deliberate: the secret is unexportable, bound to the device's attestation key, and gated on touch. The cost is coupling: every consumer holds a salt tied to one physical key, so the key rotation story must be planned before the first enrollment, not after.
