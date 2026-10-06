# 01 - Four-layer integrity stack

**Scope:** yubiOS composes four filesystem integrity layers (dm-verity, fs-verity, composefs, IMA) plus dm-integrity for write paths, all resting on one load-bearing invariant: /usr is dm-verity-verified at every boot.

**Ground source:** yubi-OS/yubiOS `skills/dm-verity-and-integrity/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/dm-verity-and-integrity/SKILL.md). Claims marked "source doc" come from this file.

## The invariant

The source doc states the skill's load-bearing invariant directly: **/usr is dm-verity-verified at every boot**. This is the immutable root that the entire yubiOS trust chain rests on. Everything else in the skill (fs-verity signing, composefs catalogs, IMA policies) extends or composes with that root, it does not replace it.

## The four layers

### Layer 1: dm-verity, block level

Per the source doc, dm-verity computes a Merkle tree over the blocks of a block device, stores the root hash in a kernel command-line parameter (`roothash=<hash>`) or a verity superblock field, and refuses to mount the device if any block's measurement fails. yubiOS applies dm-verity to /usr exclusively; /etc, /var and /home are mutable and are not protected by dm-verity.

The kernel's own documentation confirms the design (weight 0.96, https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/verity.html): dm-verity invokes forward error correction (FEC) only when a block's hash does not match the wanted hash or the block cannot be read at all, so FEC adds no overhead in the common case where no error occurs. The same page documents that the pkcs7 signature validates the root hash at device-mapper block-device creation, which is the mechanism behind yubiOS's signed-root-hash boot flow (weight 0.96, same URL).

### Layer 2: fs-verity, file level

Per the source doc, fs-verity gives each protected file its own Merkle tree and an independently verifiable digest. yubiOS uses it for `/etc/yubiOS/*.conf` configuration files, `/usr/lib/yubiOS/policy/*.rego` Rego Build Policies, and `/usr/share/doc/yubiOS/*.md` documentation that must be tamper-evident for compliance.

The kernel documentation is explicit about how fs-verity relates to dm-verity (weight 0.95, https://www.kernel.org/doc/html/latest/filesystems/fsverity.html): fs-verity does not replace or obsolete dm-verity, and dm-verity should still be used on read-only filesystems. fs-verity is for files that must live on a read-write filesystem because they are independently updated. This is exactly the yubiOS split: dm-verity for the immutable /usr block device, fs-verity for individual config and policy files that change without an image rebuild.

### Layer 3: composefs, signed overlay composition

Per the source doc, composefs is the yubiOS mechanism for layering multiple immutable /usr variants (base + sysext + confext) without breaking dm-verity, via a signed digest catalog listing the digests of each layer and the composed result. Without a signed catalog the composed /usr cannot be mounted.

The upstream project describes the same mechanics (weight 0.64, https://github.com/composefs/composefs): composefs combines several Linux features to provide read-only mountable filesystem trees stacked on an underlying lower filesystem, using overlayfs as the kernel interface, EROFS for a mountable metadata tree, and optional fs-verity from the lower filesystem. It also supports fs-verity validation of content files, where the digest is stored in the `trusted.overlay.metacopy` extended attributes and overlayfs validates that the content file it uses has a matching enabled fs-verity digest (weight 0.61, same URL).

### Layer 4: IMA, runtime measurement

Per the source doc, IMA (Integrity Measurement Architecture) extends the dm-verity/fs-verity/composefs chain into runtime userspace: the kernel measures every file that is opened or executed, depending on policy, and extends the measurement into a TPM PCR. yubiOS runs appraisal mode (deny on mismatch) on `/usr/bin`, `/usr/sbin`, `/usr/lib` and audit mode (log on mismatch) on `/etc`, `/var`, `/home`. The measurement list is reflected in PCR 10.

openEuler's IMA documentation corroborates the operational model (weight 0.70, https://docs.openeuler.org/en/docs/25.03/server/security/trusted_computing/ima.html): the IMA digest-list mechanism supports entering appraisal mode immediately after installation, and supports package installation and upgrades in appraisal mode without requiring a separate fix mode for file marking. This matters for yubiOS because bootc-style image upgrades must keep the appraisal policy satisfied across the upgrade itself.

## The fifth piece: dm-integrity

The source doc covers dm-integrity (journaled integrity-on-write) for the rare yubiOS paths where write-time integrity matters, and notes it is rare because dm-verity is the default for /usr. The kernel documentation defines the mechanism (weight 0.96, https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/dm-integrity.html): the dm-integrity target emulates a block device with additional per-sector tags used for integrity information, and because writing a sector and its tag must be atomic, it uses a journal, committing sector data and integrity tags together before copying them to their location (weight 0.95, same URL family).

## Composition summary

| Path | Layer | Behavior on mismatch |
| --- | --- | --- |
| /usr (block device) | dm-verity | refuses to mount |
| /etc, selected config files | fs-verity | per-file signed measurement |
| layered /usr variants | composefs signed catalog | composed /usr unmountable without catalog |
| /usr executables at runtime | IMA appraisal | execve returns -EACCES |
| /etc, /var, /home at runtime | IMA audit | logs to audit subsystem |
| rare writable volumes | dm-integrity | journal + tags at write time |

Each mapping is stated in the source doc. The layering direction is strictly outward from the immutable root: dm-verity anchors /usr, composefs composes verified variants of it, IMA carries verification into running processes, and dm-integrity is reserved for the few writable surfaces that genuinely need authenticated writes.
