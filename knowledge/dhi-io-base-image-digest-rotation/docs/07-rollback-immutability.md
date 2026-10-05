# Rollback and immutability semantics

Scope: Rollback semantics: digests are immutable and rotation is additive, reverting the pin to the old digest, and treating a moved or mutated digest as an incident.

## Immutability is what makes rollback free

A digest is a content hash: once a registry serves bytes under a digest, those bytes never change under that digest. Docker's Hardened Images documentation frames this as a security property, describing how image digests, read-only containers, and signed metadata make images tamper-resistant and immutable [S1]. The supply-chain consequence for rotation is direct: rotating a pin never destroys the old image. Old digests remain valid in the registry, nothing is overwritten, and rollback is simply re-pinning the previous digest.

This is why the rotation checklist treats rollback as a revert, not as a recovery operation. If a rotated pin misbehaves, the fix is a commit that restores the old digest in the pin file; the registry still serves the old image bytes, and the build gate (doc 03) evaluates the reverted input the same way it evaluated the original.

## When the registry itself moves: incident, not rotation

The assumption that a digest never changes is load-bearing, and violations of it are well documented. Red Hat's knowledge base records a production failure mode where pod creation fails due to a digest mismatch on images that were modified after an upgrade [S2], the exact signature of a registry serving different bytes under a previously recorded digest. A separate Red Hat solution documents push failures with digest errors [S3].

Digest mismatches can also arise from tooling rather than tampering. A moby/buildkit issue documents manifest digest mismatches when pushing to a private registry, with the root cause observation that there is no canonical way to marshal a manifest into JSON, which is why client and server digests can differ [S4]. That distinction matters operationally: a tooling-induced mismatch is a bug to work around; a registry serving moved content under an old digest is an incident to investigate. The yubiOS rule encodes the difference: if a registry ever serves a moved digest, treat it as an incident, not a rotation.

## Rollback procedure

A rollback under this model is:

1. Revert the pin file commit (the commit message names both digests, so the revert is self-describing).
2. Land the reverted pin together with the consuming Containerfile change, exactly as a forward rotation would.
3. Re-run the verification gate on the reverted digest if any policy inputs changed in the meantime.

Weak-backing note: a runbook for rolling back a Compose stack to a pinned digest describes the same re-pin-to-previous-digest motion operationally [S5] (weight 0.45, WEAK backing). A stack overflow answer on pulling an image by digest that internally uses a tag [S6] (weight 0.08, WEAK backing) is consistent with the digest-anchoring model but is anecdotal.

## Why rotation is additive

Rotation being additive follows from content addressing: every digest ever pinned continues to resolve forever (or until the registry garbage-collects unreferenced content, which is a registry policy, not a rotation act). Nothing in a rotation rewrites or deletes existing tags. This yields three invariants worth stating explicitly:

1. History is replayable. Any historical commit's pin file still resolves to the exact bytes it named at the time.
2. Rollbacks have no blast radius. The old image was never mutated, only un-pinned.
3. Audit is cryptographic, not procedural. Because digests are content hashes, matching a build's base image to its pin file entry is a hash comparison, not a trust exercise.

The incident rule is the corollary: the day a previously recorded digest no longer matches what the registry returns, the content-addressing contract itself has failed, and no rotation procedure applies.

## Sources

- [S1] https://docs.docker.com/dhi/explore/security-concepts/immutability/ (weight 0.92, authoritative)
- [S2] https://access.redhat.com/solutions/6300121 (weight 0.88, authoritative)
- [S3] https://access.redhat.com/solutions/6568941 (weight 0.89, authoritative)
- [S4] https://github.com/moby/buildkit/issues/2963 (weight 0.73, authoritative)
- [S5] https://runbook.academy/courses/docker/runbooks/docker-runbook-roll-back-compose-stack/ (weight 0.45, WEAK backing)
- [S6] https://stackoverflow.com/questions/55407999/docker-pulling-an-image-by-digest-that-internally-uses-a-tag (weight 0.08, WEAK backing)
