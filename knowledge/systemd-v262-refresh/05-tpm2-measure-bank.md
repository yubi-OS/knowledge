# 05 The tpm2-measure-bank= crypttab option and PCR bank configuration

Scope: the removal of the `tpm2-measure-bank=` crypttab option in the v262 cycle, the state of TPM2 PCR bank measurement configuration in systemd, and why yubiOS is unaffected.

## What the source doc recorded

The source doc recorded that the `tpm2-measure-bank=` crypttab option is removed in the v262 cycle, and that yubiOS does not use TPM2 measure banks because there is no TPM in its trust model; the FIDO2/PIV enrollment path is unaffected.

Precision on sourcing: this mint's dig did not surface a primary source carrying the removal text for this specific option. The removal claim stands as asserted by the source doc (which read the v262-rc2 release notes). Everything below documents the surrounding primary landscape the dig did confirm.

## The option's history and bug surface

The option existed and was bug-prone in the stable line: a systemd issue reports that setting `tpm2-measure-bank=sha256` in crypttab caused boot to fail with the volume failing to mount, seen on x86_64 with the systemd-cryptsetup component, and that removing the option restored boot (source: https://github.com/systemd/systemd/issues/38576, jev weight 0.60). This is consistent with an option whose removal would not be mourned, but it is not itself evidence of the removal.

## The crypttab TPM2 mechanism the option sat inside

The current crypttab documentation describes the TPM2 enrollment mechanism: when enrolling a TPM2 device via systemd-cryptenroll on a LUKS2 volume, a randomized key unlocking the volume is generated on the host and loaded into the TPM2 chip, where it is encrypted with an asymmetric "primary" key pair derived from the TPM2's internal "seed" key (source: https://www.freedesktop.org/software/systemd/man/latest/crypttab.html, jev weight 0.95; same text on the man7 mirror at https://www.man7.org/linux/man-pages/man5/crypttab.5.html, jev weight 0.74). The removal of a per-volume measurement-bank selector does not change this enrollment mechanism; it changes which PCR banks are measured during boot into.

## The measurement landscape around it

The systemd TPM2 PCR measurements document describes where measured-boot events land, including NvPCR initialization: after completion of systemd-tpm2-setup-early.service (which initializes all NvPCRs and measures their initial state) at early boot, the systemd-pcrnvdone.service service measures a separator event into PCR 9, isolating the early-boot NvPCR state (source: https://systemd.io/TPM2_PCR_MEASUREMENTS/, jev weight 0.95). This is the active, maintained measurement surface that PCR-bank configuration feeds.

The systemd-measure tool documentation describes the consumer side: systemd-measure pre-calculates and signs the expected TPM2 PCR 11 values that should be seen when a Linux UAPI.5 Unified Kernel Image based on systemd-stub is booted (source: https://www.freedesktop.org/software/systemd/man/latest/systemd-measure.html, jev weight 0.92). Its output is a JSON object containing signatures for all specified PCR banks (via the `--bank=` option), which may be used to unlock encrypted credentials (systemd-creds) or LUKS volumes (systemd-cryptsetup@.service) (same source, jev weight 0.94). The Debian manual page adds the signing pattern: pre-calculate the expected PCR 11 value after boot of a UKI, then cryptographically sign the resulting values with an RSA private/public key pair configured via `--private-key=` and `--public-key=` (source: https://manpages.debian.org/bookworm/systemd/systemd-measure.1.en.html, jev weight 0.88).

For general PCR bank background, Microsoft's TPM 2.0 documentation covers PCR bank switching and identifying which PCR bank is in use, noting that bank switching steps go through the OEM or UEFI vendor when BitLocker is already active (source: https://learn.microsoft.com/en-us/windows/security/hardware-security/tpm/switch-pcr-banks-on-tpm-2-0-devices, jev weight 0.72).

Weakly backed context (not authoritative): a DeepWiki page summarizes systemd's TPM2 integration across measured boot, attestation, and Secure Boot signing (source: https://deepwiki.com/systemd/systemd/8.1-tpm2-and-measured-boot, jev weights 0.48 and 0.13 across two dig passes, weak backing). Forum threads about TPM2 boot failures after updates (https://bbs.archlinux.org/viewtopic.php?id=314939, jev weight 0.12; https://bbs.archlinux.org/viewtopic.php?id=311123, jev weight 0.08) are recorded only as evidence that PCR bank and TPM2 setup churn causes real breakage in the field.

## Standing verdict for yubiOS

yubiOS has no TPM in its trust model and does not use TPM2 measure banks; its disk-unlock and identity path runs through FIDO2/PIV enrollment. The removal therefore lands as a documentation-level fact rather than a migration item. The check that stays in the audit checklist: any yubiOS-generated crypttab must not carry `tpm2-measure-bank=`, and if PCR-bank selection is ever needed (for example if the fTPM path on ARM64 is revived), the surviving surface is the `--bank=` option of systemd-measure plus the NvPCR setup services, not a crypttab option.
