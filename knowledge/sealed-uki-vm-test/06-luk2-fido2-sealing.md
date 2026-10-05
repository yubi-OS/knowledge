# Sealing LUKS2 with FIDO2 at install time

Scope: systemd-cryptenroll with FIDO2 (hmac-secret, user verification uv=on) against a LUKS2 slot at install time, the complementary TPM2 PCR-bound unlock, and asserting the sealed slot with systemd-cryptsetup status.

## systemd-cryptenroll

systemd-cryptenroll is a tool for enrolling hardware security tokens and devices into a LUKS2 encrypted volume, which may then be used to unlock the volume during boot. It supports tokens and credentials of several kinds: PKCS#11 tokens and smartcards, FIDO2 security tokens, and TPM2 security chips, as well as regular passphrases (weight 0.968, https://www.freedesktop.org/software/systemd/man/251/systemd-cryptenroll.html; corroborated at weight 0.944 by https://www.freedesktop.org/software/systemd/man/systemd-cryptenroll.html and weight 0.898 by https://www.man7.org/linux/man-pages/man1/systemd-cryptenroll.1.html). The ArchWiki page summarizes the same contract and notes the enrolled devices are later unlocked during boot (weight 0.892, https://wiki.archlinux.org/title/Systemd-cryptenroll).

The operational detail that matters for automation: enrolling a key adds it as an additional way to unlock the volume and embeds all necessary information for it in the LUKS2 volume header. Before the volume can be unlocked with that key at boot, FIDO2 unlocking must be allowed via /etc/crypttab (weight 0.924, https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html). Token metadata is stored in the LUKS2 JSON token area, and boot unlock is wired through crypttab (weight 0.557, https://www.golinuxcloud.com/systemd-cryptenroll-luks2-tpm2-fido2-linux/).

One boundary worth recording for CI: the lockout mechanism is a global property of the TPM, and systemd-cryptenroll does not control or configure it. The tpm2-tss tools inspect or configure the dictionary attack lockout, with tpm2_getcap and tpm2_dictionarylockout respectively (weight 0.944, https://www.freedesktop.org/software/systemd/man/systemd-cryptenroll.html).

## The lane's enrollment step

The sealed lane runs `systemd-cryptenroll --fido2-device=auto --unlock-key-type=fido2 --fido2-credential-params=uv=on` against the LUKS slot at install time. The workflow runs `mkosi ... install` and then enrolls against the loopback target, and asserts afterwards that `systemd-cryptsetup status` shows the FIDO2-bound slot (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md). The `--fido2-credential-params=uv=on` flag requests user verification on the credential, which is the FIDO2 property that distinguishes an attested, presence-checked credential from a bare hmac-secret slot; the exact semantics of the flag rest on the source doc and the systemd-cryptenroll man page family rather than on a dig result.

This stage corresponds to yubiOS ADR-003, which selects LUKS2 with FIDO2 via systemd-cryptenroll as the disk-sealing design (source doc: same). Note the CI environment runs this against a virtual FIDO2 device, since a real YubiKey is out of scope for the lane; the FIDO2 unlock on real hardware is listed among the lane's 6 positive assertions as the hardware follow-up (source doc: same).

## PCR-bound TPM2 unlock as the complementary primitive

The same enrollment tool supports TPM2-based sealing, which binds the disk unlock to measured boot state rather than to a hardware token. The ArchWiki TPM page describes the mechanism: with TPM2 it is possible to bind secrets, like the LUKS root decryption key, to a signed policy rather than raw PCR values, adding flexibility by allowing PCR values to vary provided there is a valid PCR signature for those values matching the public key enrolled with the secret (weight 0.616, https://wiki.archlinux.org/title/Trusted_Platform_Module). For the sealed lane this matters as the design contrast: the PCR measurements documented in the measured-boot doc are the substrate a TPM2-bound LUKS2 slot would use, while the lane itself enrolls the FIDO2 path as the primary seal.

A community gist covers a combined LUKS2, TPM2, FIDO2, and Btrfs setup, but at weight 0.105 it is weak backing and is recorded here only as evidence the combined pattern is exercised in the wild (https://gist.github.com/Syderitic/23b9c22cb772e1b0e674ed4bb5a3abef).

## What the lane asserts

Positive: the LUKS2 slot exists and is FIDO2-bound, verifiable via systemd-cryptsetup status after the install-time enrollment (source doc). The lane's evidence plan treats this as one of the 6 positive assertions required before the parent issue moves to Done. The unlock itself on a real FIDO2 token is the hardware follow-up listed in the same evidence plan.

## Gaps

The dig returned man page mirrors with near-identical text and one Ask Ubuntu thread using clevis instead of systemd-cryptenroll (weight 0.032, skipped as low value). No dig result covers the `--unlock-key-type=fido2` or `--fido2-credential-params=uv=on` options specifically, so the lane implementer must confirm those flags against the installed systemd-cryptenroll version before the enrollment step is written.
