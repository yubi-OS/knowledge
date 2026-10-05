# 03 - hmac-secret versus U2F: why the extension matters for disk unlock

Scope: the CTAP protocol layers, the hmac-secret extension that makes FIDO2 disk unlock possible, and the difference between the pam-u2f login path and the systemd disk-unlock path.

## CTAP layers

FIDO2 introduces a standardized communication protocol known as the Client-to-Authenticator Protocol (CTAP), which defines the exchange of information between security keys, also called authenticators, and the operating system (Kudelski Security Research, https://kudelskisecurity.com/research/luks-disk-encryption-with-fido2, weight 0.841). The protocol has versioned generations: CTAP1, retroactively identified with U2F, and CTAP2 and later, which carry the richer FIDO2 operations (Kudelski Security Research, https://kudelskisecurity.com/research/luks-disk-encryption-with-fido2, weight 0.841). FIDO2 as a whole is a phishing-resistant cryptographic authentication standard (Microsoft Security, https://www.microsoft.com/en-us/security/business/security-101/what-is-fido2, weight 0.830).

## The hmac-secret extension

The property that makes disk unlock possible is not web authentication but the CTAP2 hmac-secret extension. The CTAP2.1 specification defines it precisely: the HMAC Secret extension can be used by a client to retrieve a symmetric secret from the authenticator when it needs to encrypt or decrypt data, and the secret is scoped to the generated credential and derived from a combination of a key on the authenticator and client-supplied entropy (Yubico CTAP2.1 spec, https://developers.yubico.com/CTAP/CTAP2.1.html, weight 0.860). When systemd enrolls a FIDO2 token into a LUKS volume, it uses this extension, with a relying party ID of io.systemd.cryptsetup, so the enrolled secret is credential-scoped and reproducible at every boot (GitHub fido2luks, https://github.com/bertogg/fido2luks, weight 0.926).

The hmac-secret approach predates the systemd integration in the community tooling: fido2-luks lets a FIDO2 token with the hmac-secret extension act as a strong single factor for LUKS full disk encryption, and lists the token families that support it, including all FIDO2 models of YubiKey, the Google Titan key, the Nitrokey FIDO2, and any SoloKey (GitHub fido2-luks, https://github.com/nyancient/fido2-luks, weight 0.797). A test design can rely on that compatibility set as the minimum hardware baseline for hardware legs.

## Why U2F alone cannot unlock a volume

CTAP1/U2F produces signatures over challenge data for web authentication; it does not expose a symmetric secret derivation primitive. That is why the unlock paths split: anything that must reconstruct a volume key on every boot needs hmac-secret, while anything that only needs a presence assertion can run over U2F (Kudelski Security Research, https://kudelskisecurity.com/research/luks-disk-encryption-with-fido2, weight 0.841; Yubico CTAP2.1 spec, https://developers.yubico.com/CTAP/CTAP2.1.html, weight 0.860). A test suite that only exercises the U2F leg therefore proves nothing about the disk-unlock leg, and the two must be tested as separate capabilities.

## pam-u2f: the login-side sibling

pam-u2f implements PAM over U2F and FIDO2, providing an easy way to integrate the YubiKey, or other U2F/FIDO2 compliant authenticators, into existing infrastructure (Yubico, https://developers.yubico.com/pam-u2f/, weight 0.883; GitHub Yubico/pam-u2f, https://github.com/Yubico/pam-u2f, weight 0.851). It covers login, sudo, and similar interactive authentication, which is a different trust surface from early-userspace disk unlock: it runs after the root filesystem is readable and depends on the user session stack rather than the initramfs (GitHub Yubico/pam-u2f, https://github.com/Yubico/pam-u2f, weight 0.851).

The architectural intent behind splitting these surfaces is articulated in the systemd authenticated-boot writeup: user data should be locked to a security concept belonging to the user, not the system, whether that is a TPM2 or a FIDO2 or PKCS#11 token (0pointer.net, http://0pointer.net/blog/authenticated-boot-and-disk-encryption-on-linux.html, weight 0.872).

## Test implications

A complete test matrix separates three legs: U2F assertion coverage for the login path via pam-u2f, CTAP2 hmac-secret coverage for the disk path via systemd-cryptenroll and systemd-cryptsetup, and a negative control that proves a U2F-only token cannot satisfy the disk path (Yubico, https://developers.yubico.com/pam-u2f/, weight 0.883; GitHub fido2luks, https://github.com/bertogg/fido2luks, weight 0.926). One documented gap illustrates why the negative control matters: an issue on systemd-homed notes that using the FIDO2 credential for its hmac-secret is not the same as checking the signature it generates with a stored public key, and that duplicating pam-u2f behavior into homed would mean doing both (GitHub issue via archive, https://ghostarchive.org/archive/AxynM, weight 0.408, weak backing). Assertion-based verification and secret-derivation verification are different tests, and a corpus on unlock testing should keep them distinct.
