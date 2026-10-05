# 05: PKCS#11 (PIV) LUKS2 unlock as the rejected alternative

Scope: how the same YubiKey's PIV applet can unlock LUKS2 through PKCS#11, the PIN-at-every-boot and on-device-decrypt costs, and why the split verdict keeps PIV for signing but rejects it for disk unlock.

## The mechanism

PKCS#11 unlock has been native to the systemd LUKS2 flow since systemd 248. Poettering's announcement post covers all three hardware families together: PKCS#11, FIDO2 tokens, and TPM2, describing cryptenroll as the single enrollment tool regardless of which backend unlocks the volume (source: https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html , jev noul 0.89).

On the YubiKey side, the PKCS#11 surface is the YKCS11 module exposing the PIV applet. Yubico's YKCS11 documentation describes the module and the PIN and management key model that guards PIV operations (source: https://developers.yubico.com/yubico-piv-tool/YKCS11/ , jev noul 0.86). Slot allocation matters: Yubico's PIV tool documentation notes that with the default PIV installation, testing EC keys works only on slot 9C, which is why the signing role and the unlock role compete for slots on one token (source: https://docs.yubico.com/software/yubikey/tools/pivtool/piv-tool-ykcs11.html , jev noul 0.71).

Clevis grew a PKCS#11 pin for the same path. Red Hat's developer article on it describes binding a LUKS volume to the pkcs11 pin through a PKCS#11 URI, and calls out the central design question as how Clevis handles the PIN required to access the key on the device (source: https://developers.redhat.com/articles/2025/07/31/how-use-clevis-pkcs-11-pin , jev noul 0.71).

## The cost: a PIN at every boot

The interaction cost is structural, not incidental. The PIN guards every PIV private key operation, so the initrd unlock prompt must collect the PIV PIN before the disk opens. Real boot flows show this directly: a systemd issue report walks through boot-time disk unlock where the user must answer the disk unlock prompt with the PIN of the PIV module for the key (source: https://github.com/systemd/systemd/issues/23479 , jev noul 0.86). The unlock also requires an RSA or EC decrypt performed inside the secure element on each boot, a slower primitive than the FIDO2 hmac-secret derivation.

The source problem family's verdict is a split, not a ban: PIV is rejected for disk unlock but kept for signing. The asymmetry is frequency. Signing with slot 9c happens once per kernel update, where a PIN prompt is acceptable ceremony; disk unlock happens at every boot, where the PIN becomes the exact passphrase the FIDO2 path was adopted to remove. The FIDO2 credential's visible action is a touch with no PIN, and it is what systemd-homed already expects, so the PIV unlock would add a second, different interaction pattern at the same boundary (source: https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html , jev noul 0.89).

## Where the PIV path still earns its place

PIV through PKCS#11 remains the right model where an existing PKCS#11 estate is the constraint. Yubico documents SSH with PIV and PKCS#11 as a supported guide for macOS and Linux, showing the module reuse across applications beyond disk (source: https://developers.yubico.com/PIV/Guides/SSH_with_PIV_and_PKCS11.html , jev noul 0.78). And the LUKS2 keyslot machinery is agnostic: `cryptsetup luksAddKey` adds a keyslot protected by a new key, with the existing passphrase supplied interactively or via key file, so any token-backed unlock slots in alongside the passphrase slot rather than replacing it (source: https://man7.org/linux/man-pages/man8/cryptsetup-luksAddKey.8.html , jev noul 0.53; details of the LUKS2 PBKDF cost limits are documented at source: https://man.archlinux.org/man/cryptsetup-luksAddKey.8.en , jev noul 0.83).

The verdict in one line: PIV is the same key as FIDO2, gated by a PIN and a decrypt, and for the every-boot boundary the gate is the cost, not the feature.
