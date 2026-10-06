# 03: Runtime integrity: dm-verity and the signed UKI

Scope: the source doc's third verification layer: read-time validation of every byte of /usr by dm-verity, and UKIs signed by a key on hardware the owner physically holds.

## What the source doc claims

The source doc (yubi-OS/yubiOS docs/MISSION.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/MISSION.md) states: "Every byte of /usr is validated on read by dm-verity; every UKI is signed by a key on hardware the owner physically holds" (source doc). This is the layer that makes the structural-trust promise hold after boot, not just at build time: the earlier layers (pins, gate, attestations) verify what was built; dm-verity verifies what actually runs (source doc).

## dm-verity: how read-time validation works

Kernel documentation describes the mechanism the source doc invokes. The official kernel admin guide states that when a dm-verity device is configured, the caller is expected to have been authenticated in some way (cryptographic signatures, and so on), and the device validates data on read (https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/verity.html, weight 0.27, weak). An internals explainer describes dm-verity as transparent integrity checking of a block device using a Merkle (hash) tree, where every read is verified against pre-computed hashes (https://kernel-internals.org/block/dm-verity/, weight 0.15, weak).

Supporting results cover the deployment pattern and its edge:

- A design-patterns writeup describes dm-verity closing the gap between security and immutability for embedded devices with immutable system partitions (https://proteanos.com/doc/rootfs-integrity-dm-verity-immutable-images/, weight 0.12, weak).
- A production-Linux comparison contrasts the read-write root filesystem, where binaries can be replaced at runtime with no cryptographic measurement of the running system, against dm-verity's tamper-evident block-level root (https://www.systemshardening.com/articles/linux/dm-verity/, weight 0.17, weak).
- A Yocto hardening guide argues that preventing modification at the boot-loader level requires actual integrity checking in the system (https://ejaaskel.dev/yocto-hardening-dm-verity/, weight 0.12, weak), and ArchWiki notes a dm-verity read-only root should not be updated the traditional way (https://wiki.archlinux.org/title/Dm-verity, weight 0.14, weak). That update constraint is the operational cost the source doc accepts to gain read-time validation.
- An academic survey of Android file-integrity history records that dm-verity is used as part of Verified Boot to verify the system partition (https://www.mayrhofer.eu.org/courses/android-security/selected-paper/2020/Android_Security_File_System_Integrity.pdf, weight 0.20, weak), the largest-scale precedent for the pattern the source doc applies to /usr.

## The signed UKI: the signature lives on owner hardware

The source doc's second half of the claim is about where the signing key lives: "a key on hardware the owner physically holds" (source doc). The dig set for unified kernel images did not return results that explicate UKI signing directly, so the corpus grounds only the mechanism name here and defers the trust-chain detail to doc 07 (the ARM64 stance names the chain from board root to signed UKI, per the source doc). This is a recorded gap: the UKI-specific claim is carried by the source doc alone in this corpus.

## Why read-time matters for the mission

The source doc's definition of AI resilience is that a poisoned contribution "either fails verification or never had the authority to matter" (source doc). dm-verity is the layer that makes the first clause true at runtime: even if a poisoned byte reached the disk image, it fails verification on read, with the root hash binding the image to what was built and attested in layer 2 (doc 02). Combined with the non-negotiable "Immutable means auditable. /usr is verified; mutable state is explicit" (source doc), the design keeps the verified/unverified boundary sharp instead of blurring it with writable system paths.

## Sources note

Results kept for this subtopic: 8, of 8 weighted. Primary-backing count (weight >= 0.5): 0; the strongest result is the kernel.org dm-verity admin-guide page at weight 0.27, followed by the Android file-integrity survey at weight 0.20. The kernel documentation result is the closest thing to a primary source in this dig set and it covers the mechanism (Merkle-tree read verification, authenticated configuration) rather than the yubiOS deployment of it; the deployment claim stays with the source doc. The UKI-signing half of the section is explicitly a source-doc-only claim in this corpus, recorded as a gap in the README rather than padded with off-topic results.
