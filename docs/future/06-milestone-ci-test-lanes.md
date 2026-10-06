# 06. Milestone CI: Keep The Test Lanes Honest

Scope: the ledger's standing rules for its own test infrastructure: which CI evidence must stay visible, which workarounds stay pinned, which checks prevent silent capability loss, and how x86-64 issues are classified relative to the ARM64 thesis.

This is an internal-record subtopic, no dig: the section is made of CI process rules and run-specific evidence references, not external mechanisms, so it is grounded in the source doc alone.

## The six standing rules

The section states six rules (source doc, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md):

1. Keep native ARM64 KVM evidence visible for the dev/swu2f VM leg.
2. Require CTAP2 enumeration and token-dependent guest operations. The doc records the motivating failure: run 29872832727 reached the guest but skipped those operations because no token appeared (source doc).
3. Keep the zstd EFI zboot workaround pinned until the runner QEMU version has the upstream fix (source doc).
4. Keep PQ TLS verification in CI so future base-image bumps cannot silently lose ML-KEM hybrid defaults (source doc).
5. Keep production, dev, and installer publication natively multi-architecture. The 2026-07-21 installer refresh closes the amd64-only gap seen in run 29876111887 (source doc).
6. Treat x86-64 VM issues as supported-platform compatibility work, not blockers for the ARM64 ownership thesis, unless they affect shared artifacts (source doc).

## What each rule is protecting

The rules fall into three groups by what they defend against.

Evidence visibility. Rule 1 keeps the native ARM64 KVM leg in view so the ARM64 ownership work (doc 02) is always tested on the architecture it targets, not only emulated. Rule 6 is the classification rule that pairs with it: a failure on x86-64 is compatibility work by default, and it only escalates to a blocker when it touches shared artifacts, which keeps the ARM64 thesis from being hostage to a secondary platform.

Silent capability loss. Rule 4 is the guard against drift by omission: post-quantum TLS (ML-KEM hybrid defaults) survives in the artifact set only if CI keeps verifying it, because a base-image bump can drop a feature without any single diff looking wrong. Rule 3 is the same discipline in reverse for a known-broken area: the zstd EFI zboot workaround stays pinned until the upstream fix lands in the runner QEMU version, so the lane fails loudly instead of passing while broken.

Test honesty. Rule 2 is the most concrete: a CI run that reaches the guest but silently skips the security-relevant operations (CTAP2 enumeration, token-dependent guest operations) is not evidence, and run 29872832727 is recorded as the example. Rule 5 extends the same honesty to the publication surface: run 29876111887 exposed an amd64-only gap in installer publication, and the 2026-07-21 refresh closed it, with the rule now requiring native multi-architecture publication for production, dev, and installer artifacts.

## How this section relates to the rest of the ledger

Milestone CI is the meta-milestone: it does not add a feature, it keeps the evidence factory honest for every other milestone. Its connections are direct. The ARM64 KVM leg serves Milestone F (doc 02). The multi-architecture publication rule serves the post-launch hardware work table (doc 09), which depends on ARM64 images actually being publishable. The PQ TLS rule protects the artifact set that every milestone ships through. And the x86-64 classification rule defines the escalation path: only shared artifacts turn a compatibility issue into a blocker for the ownership thesis.

## Reading the rule list as ledger hygiene

Like the Near-Term Planning Cycle (doc 01), this section is about process rather than features, and both are written as standing constraints rather than one-time tasks. The distinction is scope: the planning-cycle section governs documents and evidence artifacts, while Milestone CI governs the automated test lanes that generate that evidence. Together they mean the ledger's evidence chain, from CI run to refs note to promotion decision, is itself subject to the same honesty requirements the project applies to boot-time trust.

## Sources for this doc

All claims come from the ground source: yubi-OS/yubiOS `docs/FUTURE.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md), fetched 2026-10-06. Internal-record subtopic, no dig.
