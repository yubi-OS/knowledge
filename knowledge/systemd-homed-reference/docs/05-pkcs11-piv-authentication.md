# PKCS#11 / PIV authentication

Scope: authenticating homed homes with PKCS#11 tokens and YubiKey PIV, token URI selection, and the pre-authentication identity advantage over FIDO2.

## The PKCS#11 path

systemd-homed can bind a LUKS2 home to a PKCS#11 token: the home's LUKS2 volume is unlocked using a key object held by the token, with the token's private key material never leaving the device. The upstream machinery for security-token LUKS2 unlocking (TPM2, FIDO2, PKCS#11) landed in systemd 248, and the same --pkcs11-token-uri=auto enrollment pattern is used by homectl and systemd-cryptenroll alike (source: http://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html, weight 0.91).

Token discovery and enrollment:

```bash
# list available tokens
homectl create jenny --pkcs11-token-uri=list

# auto-select the single plugged-in token
homectl create jenny --pkcs11-token-uri=auto

# bind to an explicit PIV slot (slot 9c in this example)
homectl create jenny \
  --pkcs11-token-uri="pkcs11:manufacturer=piv_II;id=%9c;type=private"
```

(source: https://www.freedesktop.org/software/systemd/man/homectl.html, weight 0.93)

Enrollment can also happen after creation via `homectl authenticate jenny --pkcs11-token-uri=auto`, the same post-creation path FIDO2 uses (source: https://www.freedesktop.org/software/systemd/man/homectl.html, weight 0.93).

## Why YubiKey PIV fits

The YubiKey's PIV application is driven through Yubico's YKCS11 PKCS#11 module, which implements PKCS#11 (Cryptoki) specification version 2.40 and lets external applications communicate with the PIV application on the key (source: https://docs.yubico.com/software/yubikey/tools/pivtool/piv-tool-ykcs11.html, weight 0.80). Two properties of that module matter for homed use. First, the YubiKey only supports the functions that require an asymmetric private key: operations that do not need the private key, such as signature verification, hashing, and random number generation, are performed by the host-side OpenSSL instead (source: https://docs.yubico.com/software/yubikey/tools/pivtool/piv-tool-ykcs11.html, weight 0.80). Second, the PIV-compatible smart card mode is the Yubico-sanctioned path for public-key authentication through PKCS#11 on Linux, the same surface OpenSSH PKCS#11 support uses (source: https://www.yubico.com/authentication-standards/smart-card/, weight 0.61).

## The pre-authentication identity advantage

The decisive architectural difference from FIDO2: with PKCS#11/PIV, the token's identity is visible before authentication happens. The system can read the token's certificate, derive the username from it, and use that to determine which home to activate, without the user typing anything first. FIDO2 does not allow this, because the credential identity is scoped to a relying party established during the ceremony rather than readable up front (source: https://www.freedesktop.org/software/systemd/man/homectl.html, weight 0.93). For an image-based OS this means a single login flow can serve any homed user whose PIV token is plugged in, with no username prompt.

## Slot selection discipline

PIV exposes several slots (9a for authentication, 9c for signing, and the retired key management slots 82 through 95). Homed enrollment takes whichever key object the token URI names, so pinning the URI to an explicit slot id (%9c with type=private) is the reproducible choice for scripted image builds; --pkcs11-token-uri=auto is only deterministic when exactly one suitable token with one usable key is plugged in (source: https://www.freedesktop.org/software/systemd/man/homectl.html, weight 0.93).

## Known failure modes

Real-world breakage exists in this path and is worth pre-reading before committing to PKCS#11 as the primary yubiOS flow. A December 2025 Fedora discussion reports a YubiKey 5 user getting through token login ("Successfully logged into security token") and then hitting a user record validation failure ("Object field 'perMachine' has wrong type null, expected array") when creating a homed user with --pkcs11-token-uri=auto (source: https://discussion.fedoraproject.org/t/problems-with-homectl-and-pkcs-11-yubikey-5/177071, weight 0.04, weak backing: a user forum thread, cited as a documented failure report, not as a factual authority). An older ArchLinux report documents --pkcs11-token-uri=list returning "No suitable PKCS#11 tokens found" despite a connected, SSH-usable YubiKey, pointing at hidraw and module-path configuration gaps between the PKCS#11 and FIDO2 code paths (source: https://www.reddit.com/r/archlinux/comments/jzds2o/systemdhomed_small_issues/, weight 0.04, weak backing: a forum thread, same caveat).

The operational takeaway: PKCS#11 homed enrollment depends on a correctly discoverable PKCS#11 module on the host; FIDO2 enrollment depends only on hidraw. When in doubt, FIDO2 is the lower-dependency path, and PKCS#11 is the path to choose when pre-auth username derivation is required.
