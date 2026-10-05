# 01 - systemd-cryptenroll FIDO2 enrollment

Scope: the systemd-cryptenroll enrollment flow for FIDO2 credentials into a LUKS2 volume header, the token JSON metadata, and what an enrollment test has to verify.

## What enrollment is

systemd-cryptenroll is a tool for enrolling hardware security tokens and devices into a LUKS2 encrypted volume, which may then be used to unlock the volume during boot (freedesktop.org man page, https://www.freedesktop.org/software/systemd/man/latest/systemd-cryptenroll.html, weight 0.945). It supports several token kinds, including PKCS#11 tokens, FIDO2 tokens, and TPM2 devices, alongside regular passphrases and recovery keys (freedesktop.org man page, https://www.freedesktop.org/software/systemd/man/latest/systemd-cryptenroll.html, weight 0.945). Enrollment is additive: enrolling a security token adds it as an additional way to unlock the volume while existing passphrases keep working (0pointer.net, https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html, weight 0.912).

## The FIDO2 enrollment command surface

The FIDO2 path uses the --fido2-device=auto selection: to enroll, the operator specifies the FIDO2 device, and the matching unlock side is wired by adding fido2-device= to the /etc/crypttab line for the volume (man7.org man page mirror, https://man7.org/linux/man-pages/man1/systemd-cryptenroll.1.html, weight 0.536). The crypttab man page documents --fido2-device=list, which lists all suitable FIDO2 security tokens currently plugged in along with their device nodes (freedesktop.org crypttab, https://www.freedesktop.org/software/systemd/man/latest/crypttab.html, weight 0.781). The Ubuntu manpage confirms the same pairing of the enroll command with the fido2-device= crypttab option (Ubuntu manpages, https://manpages.ubuntu.com/manpages/jammy/man1/systemd-cryptenroll.1.html, weight 0.918).

For a test harness, this yields two checkable assertions: enumeration, where --fido2-device=list must return the token under test with a device node, and enrollment idempotence, where a repeated enroll adds or replaces the FIDO2 keyslot without breaking the existing passphrase fallback (0pointer.net, https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html, weight 0.912).

## Where the metadata lives

Unlock metadata for the enrolled token lives in the LUKS2 JSON token area of the volume header (DEV Community tutorial, https://dev.to/lyraalishaikh/stop-typing-luks-passphrases-at-every-boot-practical-systemd-cryptenroll-on-linux-49nm, weight 0.142, weak backing). The same header-resident metadata claim is made by an independent tutorial covering all four token kinds: TPM2, FIDO2, PKCS#11, and recovery keys are stored as token metadata in the header JSON area (GoLinuxCloud, https://www.golinuxcloud.com/systemd-cryptenroll-luks2-tpm2-fido2-linux/, weight 0.223, weak backing). Both of these are secondary tutorial sources, so a corpus reader should treat the header-residency claim as directionally reliable but verify against cryptsetup token tooling when writing assertions that parse the JSON token area.

A robust test design therefore verifies enrollment at two depths: the shallow check is that cryptenroll exits zero and the crypttab line carries the fido2-device option; the deeper check is that the LUKS2 header now contains a token entry of the FIDO2 type with a credential ID that the token under test can actually produce an hmac-secret response for (man7.org, https://man7.org/linux/man-pages/man1/systemd-cryptenroll.1.html, weight 0.536).

## What enrollment alone does not prove

Enrollment only wires the header side of the unlock. The boot side depends on the initramfs carrying the FIDO2 stack and the crypttab configuration being copied into the early userspace environment; an enrollment test that does not follow through to a boot attempt can be green while the volume is unopenable at boot (Arch Linux forums thread on the systemd 248 initramfs setup, https://bbs.archlinux.org/viewtopic.php?id=265134, weight 0.034, weak backing). This is the core reason the end-to-end test family separates enrollment legs from boot-unlock legs: the enrollment leg is cheap and parallelizable, the boot leg is the one that catches real integration failures (freedesktop.org crypttab, https://www.freedesktop.org/software/systemd/man/latest/crypttab.html, weight 0.781).

## Summary for test design

An enrollment test matrix should cover: auto-selection against zero tokens (expect a clear failure), auto-selection against one token (expect success), list-mode enumeration output, additive behavior next to an existing passphrase slot, and the presence of well-formed token JSON in the header. The strongest available sources for this subtopic are the upstream man pages and the systemd 248 announcement post, all above 0.78; header-internals details are only weakly backed by secondary tutorials.
