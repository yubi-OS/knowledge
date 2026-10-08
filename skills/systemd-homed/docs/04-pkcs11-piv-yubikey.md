# 04: PKCS#11 / PIV Unlock with YubiKey Slot 9c

## Scope

PKCS#11 / PIV unlocking with YubiKey slot 9c: token enumeration with `--pkcs11-token-uri=list`, auto selection, explicit PKCS#11 URIs, and the PIV advantage of token identity visible before authentication.

## The three homectl entry points

The source doc gives three forms (source doc: yubi-OS/yubiOS skills/systemd-homed/SKILL.md, PKCS#11 / PIV section):

```bash
homectl create jenny --pkcs11-token-uri=list
homectl create jenny --pkcs11-token-uri=auto
homectl create jenny \
  --pkcs11-token-uri="pkcs11:manufacturer=piv_II;id=%9c;type=private"
```

`list` enumerates the available PIV tokens so you can see URIs before enrolling; `auto` selects the single token when exactly one is plugged in; the explicit URI pins enrollment to a specific PIV object. The `%9c` in the URI is the percent-encoded slot id 9c, the YubiKey PIV key-management slot (source doc). The homectl man page documents the `--pkcs11-token-uri=` option family for enrolling PKCS#11 tokens as unlock methods (source: https://www.man7.org/linux/man-pages/man1/homectl.1.html, weight 0.92).

The same `--pkcs11-token-uri=auto` enrollment pattern is documented for LUKS2 volume unlocking generally: `systemd-cryptenroll --pkcs11-token-uri=auto /dev/sda5` enrolls the security token as an additional way to unlock the volume, in the same manner as the FIDO2 case (source: http://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html, weight 0.62).

## Why PIV and not only FIDO2

The source doc states the PIV advantage plainly: token identity is visible before authentication, so the login username can be determined from a plugged-in YubiKey. FIDO2 cannot do this (source doc). Operationally this lets a shared workstation or a recovery workflow enumerate the inserted token and route to the right account before any secret is exercised.

The Yubico YKCS11 module is the PKCS#11 module that lets external applications talk to the PIV application on a YubiKey, based on version 2.40 of the PKCS#11 (Cryptoki) specification (source: https://docs.yubico.com/software/yubikey/tools/pivtool/piv-tool-ykcs11.html, weight 0.39, weak-to-moderate backing). The module provides access to the 25 keys storable on the YubiKey PIV application, corresponding to the PIV certificate slots (source: https://developers.yubico.com/yubico-piv-tool/YKCS11/, weight 0.33, weak backing). Slot 9c is the key-management slot; importing a key and certificate into slot 9c is a standard `yubico-piv-tool` operation (source: https://developers.yubico.com/yubico-piv-tool/, weight 0.21, weak backing).

## Practical notes

1. Enroll with `list` first on a machine with more than one token class present; `auto` errors when the token set is ambiguous (source doc; community reports of `--pkcs11-token-uri=auto` flows requiring a PIN entry step exist in https://discussion.fedoraproject.org/t/problems-with-homectl-and-pkcs-11-yubikey-5/177071/2, weight 0.07, weak backing).
2. The explicit URI form is the reproducible one for image provisioning: it does not depend on enumeration order.
3. PIV enrollment and FIDO2 enrollment are not mutually exclusive; a home can carry both, with the recovery key as the break-glass path (see docs 02 and 03).

## Sources

- https://www.man7.org/linux/man-pages/man1/homectl.1.html (weight 0.92)
- http://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html (weight 0.62)
- https://docs.yubico.com/software/yubikey/tools/pivtool/piv-tool-ykcs11.html (weight 0.39, weak-to-moderate)
- https://developers.yubico.com/yubico-piv-tool/YKCS11/ (weight 0.33, weak)
- https://developers.yubico.com/yubico-piv-tool/ (weight 0.21, weak)
- https://discussion.fedoraproject.org/t/problems-with-homectl-and-pkcs-11-yubikey-5/177071/2 (weight 0.07, weak)
- yubi-OS/yubiOS skills/systemd-homed/SKILL.md (source doc)
