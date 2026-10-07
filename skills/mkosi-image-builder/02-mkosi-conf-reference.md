# 02 mkosi.conf Reference for yubiOS

Scope: the section-by-section anatomy of the yubiOS `mkosi.conf` as written in the source doc, mapped against the upstream configuration reference.

## The six sections the source doc uses

The source doc (`yubi-OS/yubiOS skills/mkosi-image-builder/SKILL.md`) presents a canonical yubiOS `mkosi.conf` with six sections. Each is reproduced here with the upstream reference for the options used.

### [Distribution]

```ini
[Distribution]
Distribution=debian
Release=trixie
```

`Distribution=` and `Release=` select the target distro and release the image is composed from. Upstream documents these under the Distribution section of the configuration reference; the ArchWiki example uses the identical shape (`Distribution=debian Release=trixie`) with `RepositoryKeyFetch=true` as an adjacent option (weight 0.59, https://wiki.archlinux.org/title/Mkosi).

### [Output]

```ini
[Output]
Format=oci                    # or disk, uki, directory, tar, cpio, oci
OutputDirectory=mkosi.output
ImageId=yubiOS
ImageVersion=2026.05.10
```

`Format=` controls the artifact type. The source doc lists `disk`, `uki`, `directory`, `tar`, `cpio`, and `oci` as the formats in play. Upstream documentation of container and archive formats covers directory, tar, cpio, oci, and portable outputs as alternatives to disk images (weight 0.14, https://deepwiki.com/systemd/mkosi/6.3-container-and-archive-formats; weak backing, below the 0.5 threshold, used only to confirm the format list's orientation). `ImageId` and `ImageVersion` stamp identity and version into the output; `OutputDirectory=mkosi.output` is where artifacts and sidecar files (for example the dm-verity roothash, doc 04) land.

The man page also documents that config files in `mkosi.uki-profiles/` are picked up automatically and all configured UKI profiles are added to each UKI built (weight 0.91, https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md), which matters when yubiOS builds UKIs alongside the OCI outputs.

### [Build]

```ini
[Build]
CacheDirectory=mkosi.cache
History=yes
```

`CacheDirectory` points mkosi at a persistent package cache, which keeps repeated builds fast. `History=yes` records build history. These are build-hygiene settings; the man page documents cache behavior and related options in the Build section (weight 0.90, https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md).

### [Content]

```ini
[Content]
Packages=
    systemd
    systemd-boot
    systemd-cryptsetup
    pam-u2f
    yubikey-manager
    libfido2-dev
    opensc
    linux-image-amd64
    dracut
```

The package list is where the yubiOS security identity enters the image: `systemd-boot` and `systemd-cryptsetup` for boot and LUKS, `pam-u2f` and `libfido2-dev` for FIDO2 authentication, `yubikey-manager` and `opensc` for YubiKey management and PIV, plus the kernel and `dracut` for initrd generation. The source doc is the authority for this list; the corpus does not add or remove packages.

### [Validation]

```ini
[Validation]
SecureBoot=yes
SecureBootKey=mkosi.secure-boot.key         # or PKCS11 URI
SecureBootCertificate=mkosi.secure-boot.crt
SecureBootAutoEnroll=yes
Verity=yes                    # dm-verity root hash embedded in UKI cmdline
```

This is the security-critical section. `SecureBoot=yes` turns on signing of boot artifacts; `SecureBootKey` accepts either a plain key file path or a PKCS11 URI, and `SecureBootAutoEnroll=yes` enrolls the signing certificate so firmware accepts the chain. `Verity=yes` enables dm-verity. Docs 03 and 04 in this corpus treat the signing and verity halves in depth.

### [Host]

```ini
[Host]
QemuHeadless=yes
```

Host settings configure the machine running mkosi, here headless QEMU for `mkosi boot`.

## Reading the effective configuration

The man page documents `cat-config`: it outputs the names and contents of all loaded configuration files, making it easier to figure out what is configured where (weight 0.90, https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md). Combined with `mkosi summary` (doc 01), this is the way to verify which profile and dropins (doc 05) contributed which settings before committing to a build.

## Practical sequence for a yubiOS build

1. Confirm distro and release in `[Distribution]` match the target (source doc).
2. Set `Format=` for the artifact the pipeline stage needs; the yubiOS pipeline default is `oci` (source doc, see doc 07).
3. Keep the Content package list minimal and explicit; every package here becomes part of the immutable `/usr` that dm-verity will later hash (source doc plus the yubiOS immutability framing in `yubi-OS/yubiOS skills/mkosi-image-builder/SKILL.md`).
4. Validate with `mkosi summary` and `mkosi cat-config` before `mkosi build`.

## Sources

- Source doc: `yubi-OS/yubiOS skills/mkosi-image-builder/SKILL.md` (the canonical mkosi.conf reproduced above)
- https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md (weight 0.90, 0.91)
- https://github.com/systemd/mkosi (weight 0.94)
- https://wiki.archlinux.org/title/Mkosi (weight 0.59)
- https://deepwiki.com/systemd/mkosi/6.3-container-and-archive-formats (weight 0.14, weak backing)
