# systemd-sbsign: the engine:pkcs11 signing backend

Scope: systemd-sbsign as the Secure Boot signing tool with the engine:pkcs11 private key backend, its contrast with legacy sbsigntools and sbverify, and signing against a SoftHSM-emulated PIV slot 9c in CI.

## What systemd-sbsign does

systemd-sbsign can be used to sign PE binaries for EFI Secure Boot. Its `sign` command signs the given PE binary; if the PE binary already has a certificate table, the new signature is added to it, otherwise a new certificate table is created (weight 0.879, https://man.archlinux.org/man/systemd-sbsign.1.en; corroborated at weight 0.837 by the same manual page mirror and at weight 0.514 by https://www.man7.org/linux/man-pages/man1/systemd-sbsign.1.html). The freedesktop man page carries the canonical description (weight 0.931, https://www.freedesktop.org/software/systemd/man/latest/systemd-sbsign.html).

The option that matters for the sealed UKI VM lane is `--private-key=`. It takes a path or a URI that will be passed to the OpenSSL engine or provider, as specified by `--private-key-source=` as a `type:name` tuple, such as `engine:pkcs11`. The specified OpenSSL signing engine or provider is then used to sign the PE binary. This pair of options was added in systemd version 257 (weight 0.931, https://www.freedesktop.org/software/systemd/man/latest/systemd-sbsign.html; corroborated at weight 0.898 by https://manpages.debian.org/trixie/systemd-repart/systemd-sbsign.1.en.html and weight 0.879 by https://man.archlinux.org/man/systemd-sbsign.1.en).

This is exactly the mechanism the yubiOS lane uses: `systemd-sbsign sign --private-key-source=engine:pkcs11 --certificate=mkosi.secure-boot.crt mkosi.output/yubiOS.efi` signs the freshly built UKI with the key that lives in the SoftHSM token rather than on disk (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md).

## engine:pkcs11 versus a key file

The lane deliberately signs through a PKCS#11 URI instead of a key file. In CI the token is SoftHSM emulating the PIV slot 9c that a real YubiKey would provide (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md). Because systemd-sbsign hands the URI to OpenSSL's engine layer, the same command shape works unchanged against real hardware later, which is the property the lane wants to prove as a primitive: the signing path is token-backed, not file-backed.

For context on the mkosi side, mkosi's Secure Boot support covers signing workflows from local development key pairs up to hardware security modules and remote signing services (weight 0.455, weak backing, https://deepwiki.com/systemd/mkosi/5.5-secure-boot-and-signing).

## Verification tooling: sbverify

sbverify is the UEFI secure boot verification tool from the sbsigntools package. It verifies an EFI secure boot image, takes `--cert <certfile>` for the x509 certificate to check against, supports `--list` to list all signatures without verifying, and `--detached <file>` to read a signature from a separate file instead of an embedded one (weight 0.818, https://manpages.opensuse.org/Tumbleweed/sbsigntools/sbverify.1.en.html; corroborated at weight 0.673 by https://man.archlinux.org/man/extra/sbsigntools/sbverify.1.en).

The yubiOS lane uses sbverify only for the positive build assertion: `sbverify --cert mkosi.secure-boot.crt mkosi.output/yubiOS.efi` confirms the signature validates against the signing certificate before the UKI is ever booted (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md). The negative path, tamper rejection, is asserted in the QEMU Secure Boot VM rather than by signature tooling, because the property under test is firmware enforcement, not signature validity.

For broader distro context, the ArchWiki Secure Boot page documents the surrounding ecosystem of signing helpers and their integration quirks with systemd-boot updates (weight 0.768, https://wiki.archlinux.org/title/Unified_Extensible_Firmware_Interface/Secure_Boot).

## ADR-008: why systemd-sbsign and not sbsigntools

yubiOS ADR-008 selects systemd-sbsign over the legacy sbsigntools path for signing (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md). The mechanistic reason visible in the primary documentation is the `--private-key-source=engine:pkcs11` tuple: sbsigntools' verifier-centric tooling in the dig results shows no engine/provider signing interface, while systemd-sbsign routes the private key operation through OpenSSL engines and providers natively (weight 0.931, https://www.freedesktop.org/software/systemd/man/latest/systemd-sbsign.html). That is the difference the SoftHSM CI primitive depends on. Note this rationale statement is scoped to what the cited man pages show; the ADR itself is the governing decision record.

## What the lane asserts

The signed-build stage of the lane asserts 3 properties on the artifact before boot: sbverify accepts the certificate, `systemd-ukify verify` accepts the image, and the extracted `.cmdline` contains the dm-verity `roothash=` value (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md). These are build-time checks; the runtime enforcement checks live in the OVMF Secure Boot doc and the tamper-test doc.

## Gaps

The dig returned mostly man page mirrors with overlapping text and no changelog entry describing why version 257 introduced the engine/provider interface; the version claim above rests on the freedesktop man page text alone. The lane implementer should confirm the systemd version packaged in the CI container supports `--private-key-source=engine:pkcs11` before relying on it.
