# 03 PIV/PKCS11 UKI Signing (yubiOS YubiKey Path)

Scope: signing UKIs and Secure Boot artifacts with keys held in a YubiKey PIV slot through mkosi's PKCS11 path, plus the SoftHSM fallback for CI.

## The mkosi PKCS11 signing path

The source doc (`yubi-OS/yubiOS skills/mkosi-image-builder/SKILL.md`) states that mkosi v26+ supports signing via PKCS11 through systemd-sbsign's engine/provider backends. The yubiOS configuration shape is:

```ini
# mkosi.conf
[Validation]
SecureBoot=yes
SecureBootKey=pkcs11:token=yubiOS-sb;object=sb-key;type=private
SecureBootKeySource=engine:pkcs11
SecureBootCertificate=mkosi.secure-boot.crt
```

`SecureBootKey` takes the PKCS11 URI addressing the private key object; `SecureBootKeySource=engine:pkcs11` tells mkosi which backend to resolve the key through. The generic alternative in the same section is a plain key file path (`SecureBootKey=mkosi.secure-boot.key`, source doc).

An upstream issue documents the exact problem class this configuration solves: a user passing a Secure Boot key contained in a PKCS11 device expected mkosi to use `SecureBootKey` directly as a pkcs11 URL (weight 0.79, https://github.com/systemd/mkosi/issues/3033). The URI plus explicit `SecureBootKeySource` pairing in the source doc is the working pattern.

A secondary survey page describes mkosi's signing tooling as supporting multiple EFI signing tools with automatic selection, preferring systemd-sbsign but falling back to sbsign when needed (weight 0.15, https://deepwiki.com/systemd/mkosi/5.1-bootloader-configuration; weak backing, below the 0.5 threshold, corroborating only).

## Initializing the YubiKey PIV slot 9c

The source doc gives the key ceremony for PIV slot 9c, which is the signing slot:

```bash
# Init key on YubiKey (PIV slot 9c = signing)
yubico-piv-tool -a generate -s 9c -A ECCP256
yubico-piv-tool -a selfsign-certificate -s 9c -S "/CN=yubiOS Secure Boot/"
yubico-piv-tool -a import-certificate -s 9c -i cert.pem
```

The yubico-piv-tool repository documents slot addressing (`-s9a`, `-s9c` style flags), certificate reading, PIN verification, and key import into retired slots with touch policy support on YubiKey 4 and 5 (weight 0.88, https://github.com/Yubico/yubico-piv-tool). The YKCS11 module documentation states it is a PKCS#11 module based on version 2.40 of the PKCS#11 (Cryptoki) specification that lets external applications talk to the PIV application on a YubiKey (weight 0.85, https://docs.yubico.com/software/yubikey/tools/pivtool/piv-tool-ykcs11.html), and that it exposes all 25 keys storable on the YubiKey PIV application, corresponding to the PIV certificate slots, accessible through yubico-piv-tool (weight 0.87, https://developers.yubico.com/yubico-piv-tool/YKCS11/).

Verifying token visibility before wiring mkosi to it:

```bash
pkcs11-tool --module /usr/lib/x86_64-linux-gnu/libykcs11.so \
  --login --pin 123456 --list-objects
```

(source doc). If `--list-objects` does not show the slot 9c key object, mkosi will not be able to resolve the PKCS11 URI either; fix the token layer first.

## SoftHSM fallback for CI

CI runners cannot hold a physical YubiKey, so the source doc specifies a SoftHSM2 token:

```bash
softhsm2-util --init-token --slot 0 --label "yubiOS-ci" --pin 1234 --so-pin 1234
pkcs11-tool --module /usr/lib64/libsofthsm2.so \
  --login --pin 1234 \
  --keypairgen --key-type EC:prime256v1 \
  --label "sb-key" --usage-sign
```

with the matching config line `SecureBootKey=pkcs11:token=yubiOS-ci;object=sb-key;type=private` (source doc). The same `SecureBootKeySource=engine:pkcs11` applies; only the token label, object label, and module path change.

For general Secure Boot key lifecycle context (key creation, management, and enrollment hygiene), Microsoft's hardware guidance is a credible reference even though it is written for Windows platforms (weight 0.91, https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/windows-secure-boot-key-creation-and-management-guidance?view=windows-11).

## Composition with the rest of yubiOS

- The signing key created here is a user-held root of trust; the yubikey-operations skill owns PIV slot conventions and attestation certificate export.
- The signed UKI output feeds the measured boot chain covered by the 0pointer-mastery skill.
- The relationship between this YubiKey-held signing key and the fTPM/TPM platform integrity path is complementary: the YubiKey signs boot artifacts, the TPM measures them (source doc, `yubi-OS/yubiOS skills/mkosi-image-builder/SKILL.md`, References section pointing at https://deepwiki.com/systemd/mkosi/5.5-secure-boot-and-signing, which itself scores 0.16 in the dig, weak backing).

## Sources

- Source doc: `yubi-OS/yubiOS skills/mkosi-image-builder/SKILL.md` (config blocks, key ceremony, SoftHSM recipe)
- https://github.com/systemd/mkosi/issues/3033 (weight 0.79)
- https://github.com/Yubico/yubico-piv-tool (weight 0.88)
- https://developers.yubico.com/yubico-piv-tool/YKCS11/ (weight 0.87)
- https://docs.yubico.com/software/yubikey/tools/pivtool/piv-tool-ykcs11.html (weight 0.85)
- https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/windows-secure-boot-key-creation-and-management-guidance?view=windows-11 (weight 0.91)
- https://deepwiki.com/systemd/mkosi/5.1-bootloader-configuration (weight 0.15, weak backing)
- https://deepwiki.com/systemd/mkosi/5.5-secure-boot-and-signing (weight 0.16, weak backing)
