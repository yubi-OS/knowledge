# 07 - Key-bound and non-deterministic boundaries

Scope: which bytes are recorded but excluded from byte-equality claims because they are bound to freshly generated keys or freshly minted random values, how the recording keeps them auditable, and where the filesystem level shows the same problem.

## The verification framework distinguishes comparison from signing

The Reproducible Builds documentation's verification material covers cryptographic checksums and embedded signatures as separate topics (weight 0.97, https://reproducible-builds.org/docs/). The distinction matters for gates: an artifact can be perfectly reproducible as unsigned bytes and still carry signature bytes that can never match, because a signature is bound to a key that each build freshly generates.

## A production example of the pattern

Adoptium's Temurin reproducible verification builds document exactly this exclusion in production. Due to the signing signatures of the Windows .exe and .dll files, processing is necessary to remove the unique digital signatures using the Windows signtool tool before the comparison (weight 0.86, https://adoptium.net/docs/reproducible-verification-builds/reproduce-windows-x64/). The published verification flow therefore compares the unsigned content and treats signature bytes as out of scope. This is the same shape the yubiOS contract applies to firmware and installer artifacts: equality on unsigned subjects, recording on signature envelopes.

## The yubiOS installer boundary

The installer creates a fresh non-production SoftHSM RSA key and certificate in each build. The certificate, root-resident signed systemd-boot binary, signed UKI, ESP, and complete disk wrapper are recorded in both builds but excluded from equality. The systemd-boot path, mode, ownership, mtime, size, and xattrs remain equality subjects; only its key-bound content differs (per the yubiOS refs doc on reproducible build contracts, 2026-07-22; not independently verified in this dig).

Note the precision in that split: the equality subject is not the binary as a blob but the binary's non-key-bound attributes. Path, permissions, timestamps, size, and extended attributes are all deterministic and stay in the claim; the content hash of the key-bound file is retained with the other signature envelopes rather than compared.

## The yubiOS firmware boundary

QEMU TF-A uses CREATE_KEYS=1, so certificate serials, validity periods, RSA-PSS signatures, and key-bound TF-A envelope bytes vary between builds. The gate compares StandaloneMM, OP-TEE/fTPM, and U-Boot subjects exactly while recording both TF-A envelopes and their digests. A public fixed test fixture or a split unsigned TF-A subject is still required before the complete QEMU FIP or flash bytes can enter the equality claim (per the yubiOS refs doc, 2026-07-22).

## Randomness at the filesystem level: btrfs

Freshly generated random values appear below the file layer too. mkfs.btrfs creates a btrfs filesystem on a single or multiple devices, and multiple devices are grouped by UUID of the filesystem (weight 0.86, https://man.archlinux.org/man/mkfs.btrfs.8.en; corroborated by the man7 page at weight 0.82, https://man7.org/linux/man-pages/man8/mkfs.btrfs.8.html). Those UUIDs are freshly generated per mkfs invocation.

The yubiOS contract records the consequence for Btrfs 7.0 specifically: separate device, chunk-tree, and root UUIDs are generated, and the root item is stamped at mkfs time, so the raw partition serialization is recorded rather than used as an equality oracle. The canonical file bytes and intended POSIX/xattr metadata remain blocking equality subjects, so the filesystem's file-level content is still verified; only the block-level metadata that carries fresh randomness is excluded (per the yubiOS refs doc, 2026-07-22).

## The general rule

Every exclusion in this doc follows one rule: bytes whose value is bound to something the build deliberately regenerates (keys, certificates, signatures, filesystem UUIDs) are recorded with their digests and excluded from equality, while every deterministic attribute around them stays in the claim. The recording half is not optional bookkeeping. It is what keeps the excluded surface auditable: a future run can verify that the excluded bytes are the only difference, which is what distinguishes a bounded, documented boundary from an unexamined nondeterminism.

The remaining work, as the source corpus states it, is to remove the boundary where possible: a fixed test fixture for TF-A keys would bring the FIP bytes into the claim, and an approved immutable digest for the RK3588 DDR/TPL blob would bring the final bootable image in. Until then the honest claim is exactly what the gates encode: equality on the unsigned, deterministic subjects; digests on the rest.
