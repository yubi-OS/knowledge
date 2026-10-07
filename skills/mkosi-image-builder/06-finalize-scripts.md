# 06 FinalizeScripts

Scope: mkosi finalize scripts as the pre-seal customization hook, the `BUILDROOT` environment, and the yubiOS FIDO2 LUKS enrollment recipe.

## What finalize scripts are and when they run

The source doc (`yubi-OS/yubiOS skills/mkosi-image-builder/SKILL.md`) places finalize scripts after package installation and before image sealing, and names their yubiOS uses: FIDO2 enrollment, SBOM generation, factory defaults.

The upstream man page confirms the phase in the build sequence: "Run finalize scripts (mkosi.finalize)" (weight 0.91, https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md). A secondary source adds one sequencing detail worth knowing: the `RemoveFiles=` config option removes files and directories from the output just before the mkosi.finalize script is executed (weight 0.13, https://overhead.neocities.org/blog/build-usi-mkosi/; weak backing, below the 0.5 threshold, corroborating only).

An upstream issue (#316) documents the classic finalize-script pitfall: a user reported that `mkosi.finalize` was not running where the docs implied, specifically around `$BUILDROOT` not behaving as expected (weight 0.77, https://github.com/systemd/mkosi/issues/316). The lesson for yubiOS: verify the actual working directory and `$BUILDROOT` semantics against the mkosi version in use before assuming paths inside the finalize hook.

## Registration

```ini
[Content]
FinalizeScripts=mkosi.finalize
```

(source doc). The script may be a single `mkosi.finalize` or numbered scripts under `mkosi/finalize-scripts/` such as `60-enroll-fido2.sh` (source doc).

## The yubiOS FIDO2 enrollment script

```bash
#!/bin/bash
# mkosi.finalize  (or mkosi/finalize-scripts/60-enroll-fido2.sh)
set -euo pipefail

# Only run if FIDO2 enrollment is requested
[[ "${ENROLL_FIDO2:-0}" == "1" ]] || exit 0

# Enroll FIDO2 to LUKS slot
systemd-cryptenroll --fido2-device=auto "$BUILDROOT/dev/sda3"
```

(source doc). Three design decisions are load-bearing:

1. `set -euo pipefail` so a failed enrollment fails the build rather than sealing an image that cannot unlock.
2. The `ENROLL_FIDO2` guard: enrollment is opt-in per build, so CI images and factory images share one script.
3. The enrollment target is a LUKS partition inside `$BUILDROOT`, enrolling at build time so the image ships with the FIDO2 credential already bound.

## systemd-cryptenroll mechanics

The upstream man page describes systemd-cryptenroll as the tool for enrolling hardware security tokens and devices into a LUKS2 encrypted volume, which may then be used to unlock the volume during boot (weight 0.93, https://www.freedesktop.org/software/systemd/man/251/systemd-cryptenroll.html). The man7 page documents the binding options family, including `--tpm2-public-key=`, `--tpm2-public-key-pcrs=`, and `--tpm2-signature=` for TPM2 bindings (weight 0.79, https://man7.org/linux/man-pages/man1/systemd-cryptenroll.1.html).

One upstream constraint matters for build-time enrollment: enrolling a new FIDO2 key historically required an already enrolled regular passphrase, because it was not possible to unlock a device with a FIDO2 key in order to enroll a new FIDO2 key (weight 0.93, https://www.freedesktop.org/software/systemd/man/251/systemd-cryptenroll.html). yubiOS scripts therefore must ensure the LUKS volume has a passphrase slot before the FIDO2 enrollment step runs.

ArchWiki's page describes the same tool from the operator side: systemd-cryptenroll enrolls hardware security tokens into a LUKS2 volume which may then be used to unlock the volume during boot, and stores token metadata in the LUKS2 JSON header area (weight 0.66, https://wiki.archlinux.org/title/Systemd-cryptenroll; the JSON-header detail is corroborated by a weaker secondary source at weight 0.11, https://www.golinuxcloud.com/systemd-cryptenroll-luks2-tpm2-fido2-linux/, labeled weak).

## Composition

- The kernel command line option `rd.luks.options=fido2-device=auto` (doc 05) is what consumes the enrollment at boot; enrollment without the cmdline option leaves an unusable credential.
- The YubiKey presented at first boot is the FIDO2 authenticator; the yubikey-operations skill owns the enrollment and attestation discipline for that device.
- Factory defaults and SBOM generation belong in additional numbered finalize scripts, ordered so enrollment runs after any partitioning or keyslot setup (source doc's numbered-script convention).

## Sources

- Source doc: `yubi-OS/yubiOS skills/mkosi-image-builder/SKILL.md` (script, registration, uses)
- https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md (weight 0.91)
- https://github.com/systemd/mkosi/issues/316 (weight 0.77)
- https://www.freedesktop.org/software/systemd/man/251/systemd-cryptenroll.html (weight 0.93)
- https://man7.org/linux/man-pages/man1/systemd-cryptenroll.1.html (weight 0.79)
- https://wiki.archlinux.org/title/Systemd-cryptenroll (weight 0.66)
- https://overhead.neocities.org/blog/build-usi-mkosi/ (weight 0.13, weak backing)
- https://www.golinuxcloud.com/systemd-cryptenroll-luks2-tpm2-fido2-linux/ (weight 0.11, weak backing)
