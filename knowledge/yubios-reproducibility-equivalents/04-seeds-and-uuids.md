# Deterministic seeds and UUIDs in image builds

Scope: mkosi's Seed= mechanism, why partition UUIDs are the classic reproducibility break in disk images, and how to derive seeds per identity instead of hardcoding them.

## The mechanism

mkosi's Seed= setting "overrides the seed that systemd-repart uses when building a disk image. This is useful to achieve reproducible builds, where deterministic UUIDs and other partition metadata should be derived on each build." [1] (weight 0.87) Without a seed, repart generates fresh random UUIDs on every run, so two builds of the same source produce disk images with different partition identities: structurally identical, byte-wise different.

Independent work reached the same conclusion. Jelly's investigation into reproducing Arch images with mkosi documents the Seed setting as the override that lets systemd-repart produce reproducible UUIDs. [2] (weight 0.51) The follow-up post records the ecosystem maturing around this: mkosi no longer creates the unreproducible random-seed file, and the ldconfig aux-cache is now removed from the initrd by default. [3] (weight 0.43, weak)

The broader principle comes from the reproducible-builds.org deterministic build systems document: software cannot be built reproducibly if the source varies depending on factors that are hard or impossible to control, like file ordering on a filesystem or the current time. Random UUID generation is exactly such an uncontrolled input unless it is pinned to a seed. [4] (weight 0.90)

## Two seed designs

1. Hardcoded seed. Edgeless's reproducible-mkosi sets a fixed UUID (Seed=0e9a6fe0-...) in its system image config. It works: every build derives the same UUIDs. Its weakness is scoping: the same seed is valid for exactly one output. If the value is ever reused for a different image profile or architecture, two distinct outputs could derive colliding identity metadata from the same seed. (Edgeless config as documented in the yubiOS refs note, 2026-07-30; the repository itself at [5], weight 0.78)

2. Derived seed. yubiOS computes YUBIOS_MKOSI_SEED as a UUID-v5-style hash: printf 'yubiOS\0%s\0%s\0minimal\0' with the git SHA and the target architecture, hashed with sha256sum, truncated to 32 hex characters. The seed is therefore distinct per (commit, architecture, profile) triple and can never collide across different outputs. (per the yubiOS refs note)

The derivation pattern generalizes. The genimage project discusses deriving partition identifiers from content: name = partition start address plus sha256 of the partition's image, chosen so that two differing configs are guaranteed collision free and two identical configs are guaranteed reproducible. [6] (weight 0.26, weak) The same identity-derivation logic applies at the seed level: hash the identity of the thing being built, not a constant.

## Why this matters for boot

Partition UUIDs are not cosmetic. The bootloader and initrd locate the root filesystem by UUID, and signed UKI or measured-boot chains reference the disk layout. Two builds of the same commit that produce different partition UUIDs are not deployable interchangeably, and any reproducibility verification that compares filesystem content but ignores partition metadata will report a false pass. mkosi's own man page framing covers this: deterministic UUIDs "and other partition metadata" derived on each build. [1] (weight 0.87)

The reproducible-builds.org system-images documentation lists exactly this class of problem among the general problems of reproducible system images: the artifacts a build emits beyond the filesystem tree. [7] (weight 0.94)

## Practical rules

1. Always set Seed= for mkosi disk image builds; an unset seed makes every build's UUIDs random. [1] (weight 0.87)
2. Derive the seed from build identity (source revision, architecture, profile) rather than hardcoding one shared constant, so distinct outputs cannot collide. [5] (weight 0.78) [6] (weight 0.26, weak)
3. Treat seed derivation as part of the reproducible build library (a sourced script), not scattered config, so every profile inherits it consistently. (per the yubiOS refs note)
4. Verify the seed survived into the output: compare repart-derived UUIDs across the two verification builds, not just file content. (per the yubiOS refs note)

## Sources

1. https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md (weight 0.87)
2. https://vdwaa.nl/mkosi-reproducible-images.html (weight 0.51)
3. https://vdwaa.nl/mkosi-reproducible-arch-images.html (weight 0.43, weak)
4. https://reproducible-builds.org/docs/deterministic-build-systems/ (weight 0.90)
5. https://github.com/edgelesssys/reproducible-mkosi (weight 0.78)
6. https://github.com/pengutronix/genimage/issues/311 (weight 0.26, weak)
7. https://reproducible-builds.org/docs/system-images/ (weight 0.94)
