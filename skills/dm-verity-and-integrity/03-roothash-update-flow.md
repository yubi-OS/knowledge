# 03 - Root-hash update flow across kernel updates

**Scope:** what happens to the dm-verity root hash when the kernel changes, and the five-step yubiOS update flow that carries a new signed root hash through bootc, BLS entries, and systemd-boot.

**Ground source:** yubi-OS/yubiOS `skills/dm-verity-and-integrity/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/dm-verity-and-integrity/SKILL.md). Claims marked "source doc" come from this file.

## Why a kernel update changes the root hash

Per the source doc, when the kernel updates, the Merkle tree changes, so the root hash changes. The image layout, not just the kernel binary, is affected: the verity tree is computed over the image blocks, and a new kernel means a new image means a new tree. Any update flow that does not re-sign and re-deliver the root hash will brick the next boot with a verity mismatch.

## The five-step yubiOS flow

The source doc prescribes the update flow as five steps:

1. `bootc upgrade` pulls the new image.
2. The new image has a new roothash embedded in its BLS entry.
3. `systemd-boot` is updated to chain to the new BLS entry.
4. On next boot, the new roothash is verified against the BLS entry's signed payload.
5. If the BLS entry is signed by the yubiOS signing key (per ADR-007), the boot proceeds.

Two properties make this safe. First, the root hash travels inside a BLS (BootLoader Specification) entry rather than the raw kernel command line; the source doc's anti-pattern list explicitly forbids hard-coding a root hash in the kernel command line, because kernel command lines are mutable while BLS entries are signed. Second, the trust anchor is the yubiOS build-time signing key, so only an image built by the controlled pipeline produces a BLS entry the boot verifies.

## What the bootc and systemd ecosystems say

bootc's experimental composefs documentation describes how a composefs-rooted boot interacts with bootloader entries (weight 0.60, https://bootc.dev/bootc/experimental-composefs.html): an unsealed composefs most commonly boots via a traditional `vmlinuz`/`initramfs.img` and a BLS boot entry, and a UKI built with `--allow-missing-verity` is also unsealed in this sense, meaning packaging as a UKI is a boot convenience and not by itself a security boundary. Read against the source doc: the BLS entry is where verity state travels for bootc-managed boots, which matches step 2 of the flow.

The ArchWiki dm-verity page lists the components of a verity boot setup, including the verity hash tree, the root hash file, `systemd-veritysetup.generator`, `systemd-veritysetup@.service`, verity kernel command-line options, and veritysetup from cryptsetup (weight 0.55, weak, https://wiki.archlinux.org/title/Dm-verity). The generator-and-service pattern is the systemd-side machinery that turns verity options into an actual device-mapper setup at boot; the specifics of that page are weak backing relative to the source doc.

On the bootloader side, systemd is the suite providing the system and service manager, and systemd-boot is one of its components (weight 0.81, https://github.com/systemd/systemd; weight 0.44, https://systemd.io/). The kernel-side counterpart that makes step 4 meaningful is the root-hash signature check: the kernel validates a pkcs7 signature over the root hash at device-mapper device creation when `DM_VERITY_VERIFY_ROOTHASH_SIG` is configured (weight 0.96, https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/verity.html). A BLS entry's payload is therefore verified twice along the path: by systemd-boot against its signature, and by the kernel against its own pkcs7 check.

## Failure mode: mismatch after update

The source doc names debugging a "dm-verity: failure on node X" boot failure as a trigger for this skill. In the update flow, the canonical mismatch cause is a root hash that no longer matches the image blocks: either the image was rebuilt without recomputing the tree, or the BLS entry still carries the old root hash for a new image, or the BLS entry was not re-signed. The source doc's rule is that the new roothash is verified against the BLS entry's signed payload, so any of those three breaks the chain and the boot stops at mount time rather than running modified code.

## Operational notes

- Never hand-edit a root hash into a kernel command line; the source doc classifies that as an anti-pattern because command lines are mutable.
- The signature on the BLS entry is the yubiOS signing key per ADR-007 (source doc); keep that key offline, per the signing discipline in doc 02.
- After every kernel update, expect a new Merkle tree and a new root hash; treat the root hash as derived data, never as a constant (source doc).
