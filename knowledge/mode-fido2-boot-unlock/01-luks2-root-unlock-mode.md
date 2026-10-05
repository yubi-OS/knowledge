# 01. LUKS2 root unlock in the initrd: the interactive touch and its fallback

Scope: systemd-cryptsetup FIDO2 unlock of the LUKS2 root volume in the initrd: interactive touch, token retries, fallback to the passphrase prompt.

## What enrollment puts on disk

systemd-cryptenroll enrolls hardware security tokens and devices into a LUKS2 encrypted volume, and the enrolled token is then used to unlock the volume during boot (source: https://www.freedesktop.org/software/systemd/man/latest/systemd-cryptenroll.html, jev weight 0.89). The man page covers enrolling PKCS#11, FIDO2, and TPM2 token devices to LUKS2 encrypted volumes (source: https://www.man7.org/linux/man-pages/man1/systemd-cryptenroll.1.html, jev weight 0.87). ArchWiki describes the same tool as the path to enroll smartcards, FIDO2 tokens, and TPM security chips (source: https://wiki.archlinux.org/title/Systemd-cryptenroll, jev weight 0.90).

The token metadata lives in the LUKS2 JSON metadata area, and boot unlock is wired through crypttab (source: https://www.golinuxcloud.com/systemd-cryptenroll-luks2-tpm2-fido2-linux/, jev weight 0.70). This is the fact that makes the mode question well formed: at boot time the initrd does not contain any user secret at all. It reads a token descriptor from the LUKS2 header, then performs a live cryptographic exchange with whatever device is plugged in.

## The mode at the root volume

At the root volume the FIDO2 unlock is interactive. The human inserts the key and touches it while systemd-cryptsetup in the initrd requests an assertion. The FIDO2 exchange itself is the hmac-secret extension of CTAP, where the authenticator signs a challenge and releases a secret derived from the request (source: https://kudelskisecurity.com/research/luks-disk-encryption-with-fido2, jev weight 0.87). The initrd code path depends on libfido2 for this: systemd-cryptsetup loads libfido2 to unlock devices using FIDO2 tokens (source: https://www.guyrutenberg.com/2022/02/17/unlock-luks-volume-with-a-yubikey/, jev weight 0.34, weak backing, and the note there is specifically that dracut does not package libfido2 into the initramfs unless configured to, because systemd-cryptsetup loads it dynamically).

A retry loop ends in a passphrase prompt. The mechanism behind that fallback is that a LUKS2 volume can carry more than one enrolled unlock method: systemd-cryptenroll supports recovery keys, defined as randomly generated passphrases, alongside FIDO2 and TPM2 enrollment (source: https://www.golinuxcloud.com/systemd-cryptenroll-luks2-tpm2-fido2-linux/, jev weight 0.70; the recovery key definition is also in the man page examples at https://www.mankier.com/1/systemd-cryptenroll, jev weight 0.23, weak backing). So the fallback mode is not a special case wired into cryptsetup: it is a second keyslot sitting in the same header, and the passphrase prompt is the ordinary unlock of that keyslot.

## What the interactive step costs the boot

The boot stops and waits for the touch. That is inherent to FIDO2 user presence: the authenticator will not release the secret until a human proves presence, and that behavior is what the token is for. The design consequence is covered in the unattended reboot doc (04) and the design rationale doc (08).

## The non-systemd alternative shows the same shape

fido2luks is an initramfs-tools extension that unlocks LUKS volumes at boot time using a FIDO2 token, designed for scenarios where a FIDO2 token has been enrolled with systemd-cryptenroll --fido2-device but systemd itself is not used in the initramfs (source: https://github.com/bertogg/fido2luks, jev weight 0.79). The existence of a parallel implementation for a different initramfs framework confirms the mode boundary: whoever assembles the initrd owns the interactive prompt, and the token exchange itself is unchanged.

## Mode summary

1. Interactive: yes, a physical touch is required at the root volume.
2. Timeout: the exchange waits on the human; there is no automated timeout path in the documented unlock flow.
3. Fallback: an enrolled recovery key or passphrase keyslot is the documented recovery, reached after the FIDO2 method fails.
4. Unattended reboot: the boot cannot complete without the person. See docs 04 and 08.
