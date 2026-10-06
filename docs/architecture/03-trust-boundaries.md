# 03. Trust boundaries: where the YubiKey touches the system

Scope: the six boundaries the source doc defines, the owner-controlled material at each, and the external mechanisms behind them.

Grounding spine: source doc `yubi-OS/yubiOS docs/ARCHITECTURE.md`.

## The boundary table

The source doc defines six trust boundaries, each pairing a mechanism with owner-controlled material (source doc):

| Boundary | Mechanism | Owner-controlled material |
|---|---|---|
| Secure Boot and UKI signing | systemd-sbsign via YubiKey PIV slot 9c | PIV private key and enrolled certificate |
| Disk unlock | LUKS2 plus systemd-cryptenroll --fido2-device=auto --fido2-with-client-pin=yes | FIDO2 hmac-secret credential plus recovery key |
| User homes | systemd-homed LUKS2 plus FIDO2 | Per-user FIDO2 credential |
| SSH | OpenSSH ed25519-sk resident keys | FIDO2 resident key |
| Login and sudo | pam-u2f 1.3.1 or later | FIDO2 or U2F credential |
| Platform measurement | TPM or fTPM PCRs and ConditionSecurity=measured-os | ARM64 fTPM owned by yubiOS on Path A |

Two design rules cut across all six. First, no TPM slot is enrolled as the sole unlock gate for disk unlock (source doc). Second, measurement is complementary to YubiKey possession, not a replacement (source doc).

## Signing: PIV slot 9c over CCID

UKI signing runs through systemd-sbsign with the key living in PIV slot 9c, which requires CCID and pcscd because it is a smartcard operation, not a FIDO2 or hidraw operation (source doc). This is the one YubiKey interface that is not touch-gated in the same way as FIDO2; the key material never leaves the PIV applet, and signing is mediated by the YubiKey firmware.

## Disk unlock: FIDO2 hmac-secret with mandatory PIN

LUKS2 volumes enroll a FIDO2 credential through systemd-cryptenroll, with client PIN verification forced on (source doc). The underlying design is documented in the systemd announcement of LUKS2 unlocking with TPM2, FIDO2, and PKCS#11 hardware starting with systemd 248: the FIDO2 hmac-secret extension lets a token release a secret during boot after user verification, and a recovery key is enrolled as the fallback factor (https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html, jev weight 0.51). The systemd-cryptenroll manual defines the tool as enrolling hardware security tokens and devices into a LUKS2 encrypted volume which may then be used to unlock the volume during boot (https://www.freedesktop.org/software/systemd/man/251/systemd-cryptenroll.html, jev weight 0.33, weak backing; the same text appears in the man7.org page at https://man7.org/linux/man-pages/man1/systemd-cryptenroll.1.html, jev weight 0.27, weak backing).

## User homes: per-user LUKS2 through homed

systemd-homed gives each user a LUKS2-encrypted home volume enrolled to that user's FIDO2 credential, enabling per-user cryptographic lock and portable homes (source doc). Because the credential is per user, removing a user's key access does not disturb other users' volumes.

## SSH and PAM: resident keys and mandatory touch

SSH uses OpenSSH ed25519-sk resident keys, with PIN verification expected for administrative use (source doc). Login and sudo run through pam-u2f version 1.3.1 or later, configured as required rather than sufficient so that touch remains mandatory (source doc).

The version floor is not arbitrary. Yubico security advisory YSA-2025-01, published 2025-01-14, documents CVE-2025-23013: a partial authentication bypass in pam-u2f before 1.3.1, rated CVSS 7.3 (https://www.yubico.com/support/security-advisories/ysa-2025-01/, jev weight 0.47, weak backing). NVD describes the same flaw as local privilege escalation that can sometimes occur in Yubico pam-u2f before 1.3.1 (https://nvd.nist.gov/vuln/detail/cve-2025-23013, jev weight 0.36, weak backing). The source doc's 1.3.1 floor therefore closes that bypass class (source doc).

## Platform measurement: PCR state and ConditionSecurity

The sixth boundary measures the boot chain into TPM or fTPM PCRs and gates on ConditionSecurity=measured-os; on the ARM64 Path A platform the fTPM is owned by yubiOS (source doc). Measurement records what booted; the YubiKey decides who is allowed to consume secrets conditioned on that record. The two boundaries meet at secret release: a sealed-boot design releases disk secrets only when both the measured boot state is acceptable and the human holds the key.

## Reading the table operationally

Each boundary answers a different attacker: the PIV boundary defends the boot chain, the LUKS2 boundary defends data at rest against physical theft, homed defends users from each other and from a stolen laptop, ed25519-sk defends remote access, pam-u2f defends interactive privilege, and the measurement boundary defends against persistent firmware compromise. A review or CI change that touches any of these rows should state which owner-controlled material it affects and whether the mandatory-touch or mandatory-PIN property is preserved.
