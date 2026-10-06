# PIV signing for Secure Boot and UKIs on real hardware

Scope: scenarios H8 and H9, the PIV boundary: a UKI signed by the YubiKey's PIV slot 9c private key boots on hardware with Secure Boot enforcing, and a mis-signed or unsigned UKI is rejected by the same hardware.

## Why the PIV boundary is a hardware scenario

The Secure Boot signing boundary is where the YubiKey replaces an OEM or software key as the root of trust for the boot chain. The private key lives on the token and never leaves it, so the signature operation, the PKCS#11 session, and the firmware's acceptance of the resulting UKI are all only fully observable on real hardware. H8 proves the positive path; H9 proves the negative path on the same machine.

## The signing toolchain

The Yubico PIV tool documentation covers the PIV application's tooling and usage end to end [1] (weight 0.97). The bridge that makes signing possible is YKCS11: a PKCS#11 module that allows external applications to communicate with the PIV application running on a YubiKey, based on version 2.40 of the PKCS#11 specification [2] (weight 0.96). The same module is what OpenSSH uses for PIV-based public key authentication, documented step by step by Yubico [3] (weight 0.95).

The yubiOS corpus itself already documents the target architecture: yubiOS boots a Unified Kernel Image signed by a YubiKey over PIV/PKCS#11, with the UKI's command line binding the digest that authenticates the immutable root [4] (weight 0.88). H8 is the hardware proof of that architecture's first link.

Tooling precedent for slot 9c signing exists outside yubiOS too: sbctl, the Secure Boot key manager, creates an RSA4096 key in the YubiKey's PIV signature slot and then uses that key for signing UKIs [5] (weight 0.76). This confirms both that slot 9c is the canonical signature slot for this pattern and that the sbsign-over-PKCS#11 path is a worked configuration, not an exotic one.

The signing step in H8: sign a test UKI with the real YubiKey's slot 9c private key via `sbsign` pointed at the `libykcs11` PKCS#11 module. Guides covering UKI building with systemd-ukify and signing with sbsign describe the practical pipeline [6] (weight 0.38, weak backing; the guide is a general UKI reference, the yubiOS-specific binding comes from [4]).

## H8: the positive path

1. Sign the test UKI on the real key (slot 9c, via libykcs11).
2. Boot the machine with Secure Boot enforcing and the signed UKI.
3. Capture `sbverify` output and the firmware log showing the signature chain validated.

Pass: the system boots, and the evidence shows the chain anchored at the yubiOS Secure Boot key, which is backed by the YubiKey's slot 9c key, verifying the UKI.

## H9: the negative path

On the same hardware with Secure Boot still enforcing:

1. Attempt boot with a UKI signed by a different, untrusted key.
2. Attempt boot with an unsigned UKI.

Pass: the firmware rejects both, with the Secure Boot violation visible in the firmware log, and the system refuses to boot the untrusted images.

H9 is what makes H8 meaningful. A firmware that boots any image regardless of signature turns the whole PIV boundary into theater; proving rejection on the identical configuration that accepted the good UKI is the only way to show the enforcement is real. Because H8 and H9 share nothing with the CTAP2 stack, they can run independently of the B-VM-CTAP2 fix; their only dependency is a real YubiKey and the `sbsign`/`libykcs11` path.

## Evidence set

- `sbverify` output for the signed UKI.
- Firmware log for the H8 boot showing the validated signature chain.
- Firmware Secure Boot violation log for both H9 attempts.
- Confirmation that no fallback boot occurred after the H9 rejections (the machine must not silently pick another boot entry).

## Sources

- [1] https://docs.yubico.com/software/yubikey/tools/pivtool/index.html (jev weight 0.97)
- [2] https://docs.yubico.com/software/yubikey/tools/pivtool/piv-tool-ykcs11.html (jev weight 0.96)
- [3] https://developers.yubico.com/PIV/Guides/SSH_with_PIV_and_PKCS11.html (jev weight 0.95)
- [4] https://github.com/yubi-OS/knowledge/blob/main/knowledge/yubios/03-boot-chain-and-ukis.md (jev weight 0.88)
- [5] https://github.com/Foxboron/sbctl (jev weight 0.76)
- [6] https://mylinux.work/guides/secure-boot-uki/ (jev weight 0.38, weak backing)
