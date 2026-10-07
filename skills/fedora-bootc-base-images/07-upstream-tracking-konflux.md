# 07 - Upstream tracking and Konflux CI

Scope: what to watch in the Fedora base-images repo for changes that affect yubiOS, the clevis case study, Renovate-driven version movement, and why Konflux is the real build pipeline.

Ground source: `yubi-OS/yubiOS skills/fedora-bootc-base-images/SKILL.md`. This doc explicates the source doc's "Upstream tracking (what to watch)" and "Konflux CI (official builds)" sections.

## What to watch

The source doc narrows upstream tracking to changes in `minimal.yaml` and `standard.yaml` that can affect yubiOS, in 3 categories (source doc):

1. New packages added, for example security tools and network managers.
2. Packages removed from standard.
3. Bootloader and dracut changes.

The mechanism is the treefile layout from doc 05: the tier manifests are where package membership is decided, so a diff against those 2 files is a complete watch surface. Anything outside the treefiles that still matters shows up as build or bootloader plumbing, which is why category 3 is called out separately.

## The clevis case study

The source doc records a concrete recent change: 2 days before 2026-05-11, `clevis-dracut` and `clevis-pin-tpm2` were added to minimal and standard. Clevis handles LUKS auto-unlock. The doc states that yubiOS replaces this with YubiKey FIDO2 unlock and that the derived image should verify no conflict with clevis hooks in the boot chain (source doc).

The dig grounds what the added packages do. Clevis is an "Automated Encryption Framework" whose tooling includes `clevis-encrypt-tpm2` with options for "binding to a particular PCR registry states and/or values" (https://github.com/latchset/clevis, jev weight 0.75). The unlock flow it enables is documented end to end: to use it, a key is added to the LUKS header sealed against the TPM so dracut can auto-unlock the drive (https://ubuntu.com/server/docs/how-to/security/tpm-backed-luks-decryption-with-clevis/, jev weight 0.70). Fedora Magazine walks the same path on Fedora: install the clevis dependencies, regenerate the initramfs with dracut, then bind the LUKS partition to the TPM2 chip with the chosen PCRs (https://fedoramagazine.org/automatically-decrypt-your-disk-using-tpm2/, jev weight 0.39, weak backing).

The yubiOS conflict question is now precise: clevis installs dracut modules that attempt TPM-based auto-unlock during early boot, and yubiOS's own unlock path is YubiKey FIDO2 (pam-u2f plus the tooling from doc 04). Both mechanisms live in the initramfs boot chain, so the derived image must confirm the clevis hooks do not race or shadow the YubiKey flow. That verification is a per-rebase task, re-run whenever a pinned digest moves.

## Renovate as the version-movement signal

The source doc states that "Renovate bumps Fedora version pins automatically; watch Renovate MRs for upstream version movement" (source doc). The repo carries a `renovate.json` for exactly this (source doc, doc 05). For a digest-pinned consumer, a Renovate MR is the cheapest actionable signal: it announces that upstream moved a version pin, which means the pinned digest for the old version will age out and a re-pin decision (doc 03) becomes due.

## Konflux CI: the real build pipeline

The source doc separates the two build paths (source doc): "Actual image builds happen in Konflux (Red Hat's internal CI). The Tekton pipeline definitions are in `.tekton/`. Local `just build` is for development testing only, not what produces the published images."

Konflux is a build platform that connects a git repository, selects a build pipeline, and then handles "building, scanning, generating SBOMs, and signing provenance for every artifact" (https://konflux-ci.dev/, jev weight 0.33, weak backing for the description, cited as corroboration only). The Fedora-side wiring is visible in the base-images repo itself: a planning work item describes Pungi starting and monitoring a Konflux pipeline from a build that is effectively `podman build` of this repo, with the resulting container pushed to `quay.io/fedoraci/fedora-bootc:$branch-$timestamp` (https://gitlab.com/fedora/bootc/base-images/-/work_items/51, jev weight 0.72). The Fedora wiki's Atomic Unified Pipeline change records that fedora-bootc is "the base image that all fedora-derived variants build FROM" and that Sigstore/cosign signing for Konflux-produced artifacts was a current open blocker at the time of writing (https://fedoraproject.org/wiki/Changes/AtomicUnifiedPipeline, jev weight 0.76).

Two implications follow for yubiOS:

1. Digest provenance flows from Konflux builds, which produce SBOMs and (eventually) signed provenance. A pinned digest therefore has an audit trail upstream, and the yubiOS audit/evidence layer can consume it rather than regenerate it.
2. Because the official artifact comes from Konflux, discrepancies between local `just build` output and the published image are diagnostic signals about upstream changes, never a reason to substitute a local artifact (doc 06).

## Weak-backing caveats

The clevis event date, package names, and watch categories rest on the source doc. The clevis mechanics carry 0.75 and 0.70 weight corroboration; the Konflux description carries weak (0.33) backing, while the Fedora-side pipeline wiring carries 0.72 and 0.76. The cosign signing blocker is dated wiki content and should be re-checked before asserting signing status today.
