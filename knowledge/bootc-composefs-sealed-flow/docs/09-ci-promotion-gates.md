# 09 - CI verification and promotion gates

Scope: CI verification and promotion gates for a composefs install: offline smoke checks, the two integrity levels the composefs backend exposes, Secure Boot on-target proof, `bootc status --json`, and negative tamper testing.

## The two integrity levels a build can land on

The bootc composefs backend supports two distinct levels of integrity guarantee, controlled by whether fs-verity is strictly enforced on the root filesystem, which is decided by whether the image was built with `--allow-missing-verity` (weight 0.91, [composefs backend](https://bootc.dev/bootc/experimental-composefs.html)). A CI gate's first job is to know which level the artifact under test actually embodies, because a strict-digest boot argument in a mutable BLS entry is still an unsealed boot (weight 0.90, [composefs backend](https://bootc.dev/bootc/experimental-composefs.html)). The honest offline result for a traditional boot entry is `unsealed-bls`, not a sealed-boot claim.

## Offline checks against the installed tree

The composefs fs-verity support in bootc gives CI the exact primitives to mirror: the `composefs::fsverity` module provides userspace digest computation, kernel ioctl interfaces for enabling and measuring verity, and hash value types for SHA-256 and SHA-512 (weight 0.60, [composefs::fsverity](https://jmarrero.github.io/bootc/internals/composefs/fsverity/index.html)). The measurable semantics are explicit in the `measure_verity_opt` function, which returns None when the file has no fs-verity enabled or sits on a filesystem where fs-verity is unsupported (weight 0.90, [measure_verity_opt](https://bootc-dev.github.io/bootc/internals/composefs/fsverity/fn.measure_verity_opt.html)). A smoke harness should therefore assert, without booting:

1. The target filesystem was created with fs-verity support, verifiable from the filesystem feature list the way containerd's documentation prescribes via `dumpe2fs` (weight 0.84, [containerd fsverity docs](https://containerd.io/docs/main/fsverity/)). A target formatted without the feature makes `measure_verity_opt` semantics fail by construction.
2. The composefs repository layout exists as installed: the content-addressed object store, the metadata-image store named by digest, and the state store (weight 0.66, [Filesystem Layout, DeepWiki](https://deepwiki.com/bootc-dev/bootc/2.2-filesystem)).
3. Every metadata image under the image store measures successfully and its digest matches the name it was stored under, mirroring the kernel ioctl measurement path (weight 0.60, [composefs::fsverity](https://jmarrero.github.io/bootc/internals/composefs/fsverity/index.html)).
4. A write attempt against a measured image object fails, because fs-verity marks the file read-only once enabled (weight 0.96, [kernel.org fs-verity](https://www.kernel.org/doc/html/latest/filesystems/fsverity.html)).
5. The boot entry carries exactly one strict `composefs=<digest>` argument with no `?` marker and no `root=` argument, matching the argument-construction contract where `insecure=true` is what prepends `?` (weight 0.65, [make_cmdline_composefs](https://bootc-dev.github.io/bootc/internals/composefs_boot/cmdline/fn.make_cmdline_composefs.html)) and the design where the composefs argument specifies the rootfs (weight 0.92, [composefs/composefs](https://github.com/composefs/composefs)).
6. The initramfs carries the 51bootc dracut module payload, the bootc-root-setup.service unit and its `initramfs-setup` binary, so the boot path can actually assemble the composefs root (weight 0.70, [bootc-root-setup man page mirror](https://github.com/bootc-dev/agentic-workflows-ci-sandbox/blob/main/docs/src/man/bootc-root-setup.service.5.md)).

The bootc project's own test suite is the reference for the status surface: it covers `bootc status` behavior, including on non-bootc systems (weight 0.93, [bootc-dev/bootc](https://github.com/bootc-dev/bootc)).

## What offline inspection cannot prove

Offline inspection of a BLS entry cannot prove sealing, because the digest anchor sits in mutable configuration regardless of how strictly it is written. Promotion to a sealed lane requires evidence that only exists on a booted system:

1. Boot on each target architecture with Secure Boot enabled, so the firmware chain is exercised, not just assumed (weight 0.67, [ukify, freedesktop.org](https://www.freedesktop.org/software/systemd/man/ukify.html), for the signed-artifact contract the firmware verifies).
2. Require `bootc status --json` to report a UKI-based composefs boot with a strict 128-hex verity digest, tying the running system to the exact deployed tree (weight 0.93, [bootc-dev/bootc](https://github.com/bootc-dev/bootc)).
3. Include a negative tamper boot proving that a changed image or object is rejected before userspace. The kernel's fs-verity enforcement is the mechanism: reads are checked against the read-only Merkle tree, so modified content fails on read rather than after login (weight 0.96, [kernel.org fs-verity](https://www.kernel.org/doc/html/latest/filesystems/fsverity.html)).

## Attestation context

The on-target evidence connects to the wider measurement story. Measured boot records hash-chained measurements into TPM platform configuration registers during the bootstrapping sequence, providing tamper-proof auditing of what actually booted (weight 0.83, [Microsoft Learn, measured boot and host attestation](https://learn.microsoft.com/en-us/azure/security/fundamentals/measured-boot-host-attestation)). A promotion gate for a sealed lane should treat the on-target boot proof and any measured-boot attestation as complementary: the first proves the artifact boots and self-reports the right tree, the second proves an external observer could verify what booted.

## The gate sequence in summary

A composefs install's verification ladder, from weakest to strongest claim:

1. Install smoke: repository layout, verity-capable target, measurable metadata images, strict digest argument, 51bootc payload present. Result claim: strict fs-verity composefs install.
2. Boot classification: the entry is BLS or UKI, and the honest label is `unsealed-bls` for anything anchored in mutable configuration (weight 0.90, [composefs backend](https://bootc.dev/bootc/experimental-composefs.html)).
3. Sealed lane: Secure Boot enabled on-target, signed UKI selected, `bootc status --json` reporting the UKI composefs boot with strict digest, negative tamper rejected before userspace.

Each rung is cheap to test and each claim is falsifiable. A pipeline that stops at rung 1 should report rung 1.
