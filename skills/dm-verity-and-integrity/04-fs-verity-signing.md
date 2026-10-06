# 04 - fs-verity per-file signed measurements

**Scope:** what fs-verity protects at file level, how files are enabled and signed with the fsverity tool, how the kernel's built-in and userspace signature paths differ, and which yubiOS file sets carry fs-verity.

**Ground source:** yubi-OS/yubiOS `skills/dm-verity-and-integrity/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/dm-verity-and-integrity/SKILL.md). Claims marked "source doc" come from this file.

## What fs-verity is

Per the source doc, fs-verity is per-file: each protected file has its own Merkle tree, and the file's digest can be verified independently. The upstream fsverity-utils project describes the same feature from the userspace side (weight 0.81, https://android.googlesource.com/platform/external/fsverity-utils/): fs-verity is a Linux kernel feature that does transparent, on-demand integrity and authenticity verification of the contents of read-only files, using a hidden Merkle tree.

The kernel documentation draws the boundary against dm-verity sharply (weight 0.95, https://www.kernel.org/doc/html/latest/filesystems/fsverity.html): fs-verity does not replace or obsolete dm-verity, and dm-verity should still be used on read-only filesystems. fs-verity is for files that must live on a read-write filesystem because they are independently updated. That is the yubiOS split in one sentence: the immutable /usr image is dm-verity's job; the config files that change between image releases are fs-verity's job.

## The yubiOS protected file set

The source doc names three file sets that carry fs-verity in yubiOS:

- `/etc/yubiOS/*.conf`, configuration files that must be tamper-evident.
- `/usr/lib/yubiOS/policy/*.rego`, the Rego Build Policies that gate the supply chain.
- `/usr/share/doc/yubiOS/*.md`, documentation files that must be tamper-evident for compliance.

Note the composition: the `.rego` policy files sit under /usr (inside the dm-verity-protected image) but are also individually fs-verity protected, because the IMA policy chain in doc 06 is only as strong as its weakest signed link, and a policy file is exactly the kind of link an attacker would target.

## Enabling and signing

The source doc's command sequence:

```bash
# Enable fs-verity on a file
fsverity enable /etc/yubiOS/yubiOS.conf
# Sign the digest
fsverity sign /etc/yubiOS/yubiOS.conf --key=keys/yubiOS-signing.pem
# Verify
fsverity enable --verify /etc/yubiOS/yubiOS.conf
```

The fsverity tool comes from fsverity-utils, the userspace utilities for fs-verity maintained under the Android platform external tree (weight 0.81, https://android.googlesource.com/platform/external/fsverity-utils/).

## The kernel interface underneath

The kernel documentation documents the ioctl layer that the fsverity tool drives (weight 0.95, https://www.kernel.org/doc/html/latest/filesystems/fsverity.html): `FS_IOC_ENABLE_VERITY` enables fs-verity on a file. Its error surface is worth knowing when debugging: `ENOKEY` means the ".fs-verity" keyring does not contain the certificate needed to verify the builtin signature, and `ENOPKG` means fs-verity recognizes the hash algorithm but it is not available in the kernel as currently configured.

On signatures, the same documentation distinguishes two enforcement models (weight 0.94, same URL): with built-in signatures, the kernel checks the signature against its own keyring; alternatively, trusted userspace code can authenticate a file's contents by retrieving its fs-verity digest using `FS_IOC_MEASURE_VERITY` and then verifying a signature of it using any userspace cryptographic library that supports digital signatures. The source doc's flow (`fsverity sign` with the yubiOS signing key, then `fsverity enable --verify`) is the tool-level expression of the signed-measurement model: the digest is signed at build time and re-checked at enable time.

## How it composes with the stack

fs-verity sits between dm-verity and IMA in the yubiOS chain. It is the tamper-evidence layer for mutable-path files that dm-verity cannot cover (they are not part of the /usr block device) and that IMA audit mode alone cannot authenticate (audit logs rather than denies). Where composefs is in play, the fs-verity digests also become part of the catalog: the upstream composefs project documents fs-verity validation of content files via the `trusted.overlay.metacopy` extended attribute, which tells overlayfs to validate that the content file it uses has a matching enabled fs-verity digest (weight 0.61, https://github.com/composefs/composefs). A file's fs-verity digest is therefore not only a per-file guarantee, it can also be an input to the signed overlay composition.

## Practical limits

- fs-verity is for read-only-in-practice files: once enabled, the file contents cannot change (weight 0.81, fsverity-utils description).
- Do not apply fs-verity to genuinely mutable data; the source doc routes mutable /home to IMA audit mode instead.
- The builtin-signature path requires the right certificate in the `.fs-verity` keyring; a missing certificate surfaces as `ENOKEY` at enable time (weight 0.95, kernel docs).
