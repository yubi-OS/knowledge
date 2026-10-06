# Token identity readable before authentication

Scope: scenario H10, proving that PIV token identity is readable before authentication, so that systemd-homed with `--pkcs11-token-uri=auto` can select the correct username automatically from whichever key is inserted.

## The yubiOS requirement

The yubiOS systemd-homed posture requires that the PIV token's identity (its certificate) is visible to the host before the user authenticates, so that inserting a key resolves the account without the user typing a name. H10 verifies this on real hardware with two keys enrolled to two different accounts: swap keys, and confirm the correct account is selected each time.

## The mechanism

The enrollment side is the same PKCS#11 surface documented for the LUKS2 boundary: `--pkcs11-token-uri=auto` enrolls a security token as an additional way to unlock the volume [1] (weight 0.92). The homectl manual page is the normative reference for the tool's flag surface [2] (weight 0.83).

On the token side, identity lives in the PIV application's certificate slots. Yubico's PIV certificate documentation covers the slot and key management surface, and documents that the PIN, PUK, and management key protect the PIV slot credentials, with the PIN required when performing the protected operations [3] (weight 0.94). Identity reading is the operation that must work without the PIN: the certificate is public data, and the host must be able to enumerate it pre-auth.

Identity semantics in the certificate matter for account resolution: enterprise guidance for custom PIV authentication certificates specifies the expected extended key usages (msSmartcardLogin, clientAuth) and a SAN carrying the user's UPN, which is the field a login stack maps to an account [4] (weight 0.77). Yubico's smart card overview describes the PIV applet's slots, including the slot 9a authentication certificate used for identity [5] (weight 0.76).

## The run

1. Enroll YubiKey A against account A and YubiKey B against account B, using `homectl create --pkcs11-token-uri=auto` per account.
2. Insert key A: confirm the login path auto-resolves account A without a username prompt.
3. Swap to key B: confirm account B is auto-resolved.
4. Capture the session log showing the username resolution per inserted key.

Pass criteria: both swaps resolve correctly, and the resolution happens before any authentication event (no PIN entered, no touch given at the identity-reading stage).

## Failure modes this scenario exposes

Token enumeration is the fragile part of this path. A community report shows `homectl --pkcs11-token-uri=list` reporting "No suitable PKCS#11 tokens found" even though the YubiKey was connected and functional for SSH via PKCS#11, with the hidraw device loaded [6] (weight 0.04, weak backing). The report is a single user's account and not authoritative, but it illustrates the class of failure H10 catches: the identity layer can fail while every other use of the same key works, and only a hardware run shows it.

A second risk is misconfiguration of the identity slot: guidance on configuring PIV certificate slots covers attestation and slot selection choices that determine whether identity is even readable pre-auth [7] (weight 0.23, weak backing).

The two-key design of H10 is deliberate: a single key "works" trivially because there is nothing to disambiguate. With two keys enrolled to different accounts, a system that reads the wrong certificate, caches the wrong identity, or falls back to a default account will show a wrong or ambiguous username, which is unambiguous evidence of a broken identity path.

## Evidence set

- Session log per key insertion showing the resolved username.
- Confirmation that no PIN or touch was required for the identity read itself.
- `homectl inspect` output for both accounts showing their respective token enrollments.
- In the failure direction (optional but valuable): log from a boot or login attempt with no key inserted, showing the system does not guess an account.

## Sources

- [1] https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html (jev weight 0.92)
- [2] https://www.man7.org/linux/man-pages/man1/homectl.1.html (jev weight 0.83)
- [3] https://docs.yubico.com/software/yubikey/tools/authenticator/auth-guide/piv-certificates.html (jev weight 0.94)
- [4] https://access.redhat.com/articles/7127269 (jev weight 0.77)
- [5] https://www.yubico.com/authentication-standards/smart-card/ (jev weight 0.76)
- [6] https://www.reddit.com/r/archlinux/comments/jzds2o/systemdhomed_small_issues/ (jev weight 0.04, weak backing)
- [7] https://securew2.com/blog/yubikey-piv-certificate-slot-configuration (jev weight 0.23, weak backing)
