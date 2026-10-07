# 04 dm-verity in mkosi Outputs

Scope: the mkosi `Verity=` validation setting, its v26+ mode values, how the root hash reaches the kernel, and the on-disk artifacts produced.

## The Verity setting

The source doc (`yubi-OS/yubiOS skills/mkosi-image-builder/SKILL.md`) sets the yubiOS baseline as:

```ini
[Validation]
Verity=yes
```

and notes the v26+ mode ladder: `Verity=signed` (requires a signing key), `Verity=hash` (hash only), and `Verity=defer` (defer hashing to a later stage).

The upstream man page documents the full value set: `Verity=` (or `--verity=`) takes `signed`, `hash`, `defer`, `auto`, or a boolean value, and when set to `hash`, mkosi configures systemd-repart to create a verity hash partition (weight 0.92, https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md). That confirms the source doc's three named modes are all real settings and places them inside the broader five-value ladder that includes `auto` and booleans.

## How the root hash reaches the kernel

mkosi embeds `roothash=<hash>` in the UKI kernel cmdline automatically when verity is enabled, and writes the roothash file to `mkosi.output/<ImageId>.roothash` (source doc). The Arch man page confirms the mechanism independently: when verity partitions are configured using systemd-repart's `Verity=` setting, mkosi automatically parses the verity hash partition's roothash from systemd-repart's JSON output and includes it in the kernel command line (weight 0.70, https://man.archlinux.org/man/mkosi.1).

So the data flow is: systemd-repart builds the hash tree and reports the roothash in JSON, mkosi parses it, then either bakes it into a UKI's kernel cmdline or emits it as a sidecar file. A secondary source describes the same flow from the boot side: the root hash is calculated by systemd-repart and passed to the kernel at boot, either embedded in a UKI or via the kernel command line, allowing the kernel to verify the integrity of every block (weight 0.15, https://deepwiki.com/systemd/mkosi/8.5-dm-verity-and-integrity-protection; weak backing, corroborating only).

## What dm-verity protects, mechanically

dm-verity is the kernel device-mapper target that verifies block reads against a tree of cryptographic checksums rooted in a single roothash. The kernel documentation describes the `USER_KEY` mechanism: the kernel looks up the pkcs7 signature of the roothash, which is used to validate the root hash during creation of the device mapper block device (weight 0.93, https://www.kernel.org/doc/html/v5.8/admin-guide/device-mapper/verity.html). The corresponding kernel config knob is `CONFIG_DM_VERITY_VERIFY_ROOTHASH_SIG`, which adds the ability to validate a pre-generated checksum tree when a pkcs7 signature file can validate its roothash (weight 0.11, https://cateee.net/lkddb/web-lkddb/DM_VERITY_VERIFY_ROOTHASH_SIG.html; weak backing, corroborating the kernel option's existence).

A complete root setup consists of the root filesystem image or partition, the verity hash tree (`verity.bin`), the root hash file (`roothash.txt`), and the systemd-veritysetup generator and service pair that assemble the mapped device at boot (weight 0.52, https://wiki.archlinux.org/title/Dm-verity; just above the threshold, treat as supporting detail).

## Where this sits in the yubiOS integrity stack

Within yubiOS, mkosi's `Verity=yes` is the build-time home of the "/usr is immutable at every boot" invariant: the roothash seals the exact /usr filesystem that the OCI output carries, and the UKI's embedded cmdline pins the hash the kernel will enforce (source doc, `yubi-OS/yubiOS skills/mkosi-image-builder/SKILL.md`, which also names composefs, sysext, and IMA appraisal as the sibling mechanisms covered by the dm-verity-and-integrity, composefs-kernel-floors, and 0pointer-mastery skills).

Practical implications for anyone editing the skill's configs:

1. Changing the Content package list (doc 02) changes the filesystem, which changes the roothash on every build; downstream systems that pin a roothash must be re-pointed.
2. If artifacts must be re-signed or hashed outside the build host, prefer `Verity=defer` over `Verity=signed`; `signed` requires the signing key at build time (source doc plus weight 0.92 man page).
3. Always consume the roothash from `mkosi.output/<ImageId>.roothash` rather than parsing build logs (source doc).

## Sources

- Source doc: `yubi-OS/yubiOS skills/mkosi-image-builder/SKILL.md` (Verity modes, roothash embedding, output path)
- https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md (weight 0.92)
- https://man.archlinux.org/man/mkosi.1 (weight 0.70)
- https://www.kernel.org/doc/html/v5.8/admin-guide/device-mapper/verity.html (weight 0.93)
- https://wiki.archlinux.org/title/Dm-verity (weight 0.52)
- https://deepwiki.com/systemd/mkosi/8.5-dm-verity-and-integrity-protection (weight 0.15, weak backing)
- https://cateee.net/lkddb/web-lkddb/DM_VERITY_VERIFY_ROOTHASH_SIG.html (weight 0.11, weak backing)
