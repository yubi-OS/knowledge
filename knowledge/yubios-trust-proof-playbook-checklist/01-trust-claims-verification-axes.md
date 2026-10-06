# Trust claims decomposed into verification axes

## Scope

Decomposing a product's trust claims into numbered, checkable verification axes: provenance, pinning, boot integrity, storage integrity, key ownership, enrollment audit, recovery, rollback safety, platform clarity, and failure behavior.

## The axis pattern

A trust claim is a promise a product makes about its own security: "the image you boot is the image we built", "the keys are yours", "a tampered artifact will not load". A checklist earns its name only when each claim becomes a discrete axis with its own one-line check. The yubiOS trust-proof artifact uses this shape: 10 numbered axes, each with a one-line check an operator can perform against the running system, not against documentation (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source, conversation transcript).

The 10 axes partition the trust surface without overlap:

1. Build provenance: image digest, source ref, SLSA attestation, and SBOM exist and match the intended release.
2. Artifact pinning: the running image's digest matches the pinned digest exactly.
3. Boot integrity: Secure Boot verifies a signed UKI; modified boot artifacts refuse to boot.
4. Storage integrity: the root filesystem is immutable or measured, and state matches the expected booted image.
5. Key ownership: enrolled keys are physically held on the user's YubiKey, not vendor-held.
6. Enrollment audit: the first-boot enrollment log names every enrolled function.
7. Recovery path: lost-key recovery is documented, tested, and works without vendor intervention.
8. Rollback safety: upgrades and rollbacks preserve or explicitly update trust state.
9. Platform clarity: architecture-specific trust differences are documented per platform.
10. Failure behavior: wrong image, missing key, modified UKI, corrupted boot artifact, and invalid enrollment each fail closed with a clear error.

## Why axes, not paragraphs

SLSA frames supply-chain security as "a checklist of standards and controls to prevent tampering, improve integrity, and secure packages and infrastructure" (source: https://slsa.dev/, weight 0.893, authoritative backing). The framing matters: a checklist is a list of independently checkable controls, not an essay. Each axis answers exactly one question about one subsystem, so a failing axis localizes the failure instead of muddying the whole verdict.

The yubiOS artifact's minimum pass condition follows the same logic and is stated as a conjunction: the operator can independently verify the image source, the signed boot chain, the enrolled secrets, and the recovery path on disposable hardware, without any vendor handoff (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source). If any one leg fails, the whole trust decision fails. Vendor trust-center pages that omit SBOMs, build provenance, and artifact signing status "are only answering half the question" for supply-chain security products (source: https://safeguard.sh/resources/blog/anatomy-of-a-trust-center-what-enterprise-buyers-should-look-for-in-a-vendor, weight 0.495, weak backing).

## Axis design rules

Three rules fall out of the pattern:

- One claim per axis. Axis 2 (pinning) is separate from axis 1 (provenance) even though both concern digests, because a correct digest from the wrong source and a pinned digest that fails to boot are different failures.
- Checkable against the running system. Axis 3 is not "Secure Boot is configured in the build" but "Secure Boot verifies a signed UKI and a modified artifact fails to boot", which only a live test answers.
- Binary pass conditions. Each axis carries a corresponding pass/fail rule, so the worksheet produces a decision rather than an impression.

## Structural weakness to avoid

The yubiOS note records its own 9-D coverage as 6 of 9 primitives covered, with the correction and test primitives carrying the weight (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source). An axis list without falsifiable pass rules per axis is the most common failure: it degrades into marketing copy. The fix is covered in the falsifiable-mechanical-rules doc: every box gets a command whose exit state decides the box.
