# 02 - Owner-centric sovereignty: the YubiKey boundary

**Scope:** What the ground doc records about the sovereignty principle, and the external mechanisms behind each control surface it names: Secure Boot signing, disk unlock, SSH resident keys, PAM login, and app 2FA.

**Ground spine:** `yubi-OS/yubiOS docs/SER.md` (https://github.com/yubi-OS/yubiOS/blob/main/docs/SER.md, jev weight 0.61)

## What the source doc records

The sovereignty section maps SER's owner-centric control principle directly onto the yubiOS trust model: the owner controls Secure Boot signing, disk unlock, SSH resident keys, PAM login, and app 2FA through the YubiKey (source doc). It also states the repo treats the YubiKey as the root-of-trust boundary rather than OEM firmware or other external trust anchors (source doc). The SER mapping table row reads: owner-centric control = YubiKey as the authorization boundary for signing, unlock, SSH, PAM, and 2FA (source doc).

## Disk unlock via FIDO2

The mechanism the doc's trust model implies is systemd-cryptenroll: a tool for enrolling hardware security tokens into LUKS2 encrypted volumes, including FIDO2 tokens, with unlock happening at boot from the enrolled keyslot (https://wiki.archlinux.org/title/Systemd-cryptenroll, weight 0.75). A walkthrough records the concrete enrollment command shape, `systemd-cryptenroll <partition> --fido2-device=auto --fido2-with-client-pin=yes` (https://www.guyrutenberg.com/2022/02/17/unlock-luks-volume-with-a-yubikey/, weight 0.41, weak). A third walkthrough describes the switch to a FIDO2-compliant key as adopting phishing-resistant multi-factor authentication right at the boot stage (https://mhdez.com/posts/unlocking-encrypted-linux-with-a-yubikey/, weight 0.28, weak).

## SSH resident keys and PIV

Yubico's own documentation is the authoritative backing for the SSH surfaces. The PIV article covers using the YubiKey PIV application to securely store private keys for SSH authentication, including exporting the public key (https://support.yubico.com/s/article/Using-the-YubiKey-PIV-application-for-SSH-authentication, weight 0.87). The SSH developer portal documents generating a FIDO-backed key with ssh-keygen and using it like any other SSH key as long as the YubiKey is plugged in (https://developers.yubico.com/SSH/, weight 0.86). For resident keys specifically, Yubico documents downloading resident keys with `ssh-keygen -K` and scoping keys per service with `-O application=ssh:<name>` (https://developers.yubico.com/SSH/Securing_SSH_with_FIDO2.html, weight 0.69). Resident-key support is the mechanism behind the source doc's "SSH resident keys" control (source doc).

## PAM login and app 2FA

The PAM surface maps to pam-u2f: the module enables requiring a YubiKey touch for sudo, login, su, and any other PAM-aware service, using the FIDO2/U2F protocol (https://mylinux.work/guides/yubikey-server-authentication/, weight 0.17, weak). The source doc's "app 2FA" phrase covers the same pattern applied at the application layer; the doc itself records only the control, not the module wiring (source doc).

## Root of trust vs OEM firmware

The source doc's root-of-trust claim (YubiKey over OEM firmware) is an owner-model statement: identity, unlock, and authorization all hang off a token the owner holds, not off a vendor pre-provisioned anchor (source doc). The Yubico developer and support pages above (weights 0.86 and 0.87) are the dig-grounded evidence that each named control surface has a real, documented YubiKey mechanism behind it; the mapping between them is the source doc's own record.
