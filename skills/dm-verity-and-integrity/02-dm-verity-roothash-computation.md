# 02 - dm-verity mechanics and root-hash computation with mkosi

**Scope:** how dm-verity builds its Merkle tree, where the root hash lives, how mkosi computes it (including `--verity=defer` and offline signing in mkosi-sandbox), and how the kernel validates a signed root hash.

**Ground source:** yubi-OS/yubiOS `skills/dm-verity-and-integrity/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/dm-verity-and-integrity/SKILL.md). Claims marked "source doc" come from this file.

## How dm-verity works

Per the source doc, dm-verity computes a Merkle tree over the blocks of a block device. The tree's root hash is stored either as a kernel command-line parameter (`roothash=<hash>`) or in a verity superblock field. At mount time the kernel reads the tree on demand and refuses to mount the device if any block's measurement does not match. yubiOS uses dm-verity on /usr exclusively.

The kernel documentation confirms the signature-validation stage (weight 0.96, https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/verity.html): a pkcs7 signature is used to validate the root hash during creation of the device-mapper block device, and verification of the root hash depends on the `DM_VERITY_VERIFY_ROOTHASH_SIG` kernel configuration being set. This is the kernel-side half of the yubiOS flow: the root hash the kernel accepts must be one that the build-time signing key signed.

An independent writeup of a full dm-verity root setup lists the moving parts (weight 0.55, weak, https://wiki.archlinux.org/title/Dm-verity): a root filesystem image, the verity hash tree (verity.bin), the root hash file (roothash.txt), `systemd-veritysetup.generator`, `systemd-veritysetup@.service`, verity kernel command-line options, and veritysetup from cryptsetup, optionally wrapped in a unified kernel image containing stub, kernel, initramfs, and command line. Treat the specifics of that page as weak backing; yubiOS's own flow in the source doc and mkosi is the source of record.

## Computing the root hash with mkosi

The source doc gives the mkosi configuration that turns verity on for an image build:

```ini
# mkosi.local.conf
[Output]
Bootable=yes
Verity=yes
VerityKey=keys/yubiOS-signing.crt
VerityCertificate=keys/yubiOS-signing.pem
```

mkosi is the systemd project's image builder, a wrapper around dnf, apt, pacman and zypper that generates customized disk images (weight 0.69, https://github.com/systemd/mkosi; weight 0.46, https://mkosi.systemd.io/). The source doc pins a version floor: mkosi version 26 or newer supports two verity modes that matter for yubiOS CI:

- `--verity=hash`: compute only the hash, no signing.
- `--verity=defer`: defer signing to offline mkosi-sandbox.

For CI signing the source doc prescribes the deferred flow:

```bash
# Build the image, get the hash from the build log
mkosi --verity=defer build
# Offline sign the hash in mkosi-sandbox
mkosi-sandbox sign --input image.raw.verity --key keys/yubiOS-signing.crt
```

The mkosi releases page is the place to verify which version introduced a given verity behavior before pinning a build (weight 0.52, https://github.com/systemd/mkosi/releases).

## Why offline signing is the default

The source doc is direct about the threat model: computing the dm-verity root hash in CI and then trusting the build host is an anti-pattern, because the build host can be compromised. The mitigation is mkosi-sandbox for offline signing, or signing in a hardened CI runner with measured boot. The deferred-signing mode (`--verity=defer`) exists precisely so the hash computation and the key access can be separated: the CI machine computes, the sandbox signs.

This also pairs with the kernel-side signature check above: because the kernel validates a pkcs7 signature over the root hash when `DM_VERITY_VERIFY_ROOTHASH_SIG` is enabled, a root hash produced by a compromised build host and never countersigned by the offline key is rejected at device creation, not merely at some later audit.

## Boundary discipline

The source doc scopes this subtopic to the mkosi-verity integration. Full-disk encryption is LUKS2 territory (the forthcoming `luk2-system-disk` skill), TPM2 PCR sealing and attestation belong to `ftpm-optee-tpm`, and UKI section signing belongs to `mkosi-image-builder`. What stays here is exactly the verity part: Merkle tree over image blocks, root hash, and its signing.

## Practical checklist

1. Set `Verity=yes` plus the key and certificate paths in mkosi's `[Output]` section (source doc).
2. Build with `mkosi --verity=defer build` in CI; read the root hash from the build log (source doc).
3. Sign the verity output with mkosi-sandbox and the yubiOS signing key, offline (source doc).
4. Ship the signed root hash through the image's BLS entry, never the raw kernel command line (source doc, see doc 03).
5. Confirm the target kernel has `DM_VERITY_VERIFY_ROOTHASH_SIG` enabled so the pkcs7 signature is actually checked (weight 0.96, https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/verity.html).

Items 1 through 3 are the source doc's own commands; item 4 and 5 connect them to the boot and kernel layers where the signature is consumed.
