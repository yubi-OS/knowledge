# Digest pinning fundamentals

Scope: Why FROM lines are pinned by immutable digest instead of mutable tags, and how multi-arch OCI index digests differ from per-arch child digests.

## Digests versus tags

A container image tag is a mutable pointer. A registry can move a tag to an entirely different image at any time, so a tag alone is a label, not an identity. The digest is the real, immutable identity: the same digest always resolves to the same bytes on the same registry. The Containers SME Cookbook states this directly as an insight: tags are mutable pointers, so treat them as convenient labels and treat the digest as the real, immutable identity, pairing semver tags for humans, git SHA tags for traceability, digests for deployment, and registry immutable-tag rules for enforcement [S1].

This distinction is the reason digest pinning exists at all. If a Dockerfile references an external image by a mutable tag, rebuilding the same commit can silently copy different bytes, because the registry may have moved the tag between the two builds. Pinning the external image's digest turns that input into an immutable content reference [S2]. A pin is therefore not a style preference; it is the mechanism that makes a supply-chain-pinned build reproducible at all.

## Why the pressure to pin keeps rising

Docker's CISO describes the current supply chain attack wave as a permanent shift in the threat landscape rather than a single incident to respond to, and publishes recommended best practices for engineering teams to protect themselves [S3]. That framing matters for rotation work: pinning is a standing control, and the pins need a maintained lifecycle, not a one-time hardening pass.

## The OCI manifest and the image index

Modern multi-arch images are not a single manifest. The OCI image manifest specification defines the "fat manifest" concept, in which a higher-level manifest references the platform-specific manifests of an image, codified in OCI as an image index [S4]. The OCI image index specification confirms the relationship: the image index is a higher-level manifest which points to specific image manifests for one or more platforms; use of an image index is OPTIONAL for image providers, while image consumers SHOULD be prepared to process them [S5].

A practical tour of the OCI image format describes the pieces a practitioner has to keep straight: manifest, config, layers, and index, and recommends inspecting images by hand to understand multi-arch indexes and to debug pull or signature failures [S6]. Docker's Hardened Images documentation frames digest-level identity as part of a supply chain security model built on signed metadata, provenance, and a minimal attack surface [S7].

## Pin the index, not a child

The rotation-critical consequence of the index structure is that a multi-arch image has TWO natural digest values: the index digest (the one a tag points at) and the per-architecture child manifest digests beneath it. Pinning a single platform's manifest for a multi-arch image is explicitly called out as an anti-pattern in base image pinning guidance [S8], because it silently drops the other architectures from your pin.

Weak-backing evidence points in the same direction: an issue in the mindersec/minder project reports tooling returning the linux/amd64 manifest digest for a multi-arch image instead of the index digest [S9] (weak backing, weight 0.22). The claim that tooling can grab the wrong layer of the hierarchy is therefore real but should be treated as anecdotal rather than documented behavior.

## What this means for rotation

Three rules follow from the fundamentals:

1. A rotation replaces one immutable identity with another immutable identity. Nothing in between is mutable; the only moving part is the pin.
2. The digest you record must be the multi-arch index digest, not a per-arch child [S8].
3. Because digests are content addresses, a rotated pin is auditable in git: the diff shows exactly one digest pair, old to new.

## Sources

- [S1] https://containers.codeguides.io/registries-supply-chain/tagging-and-immutability/ (weight 0.68, authoritative)
- [S2] https://oneuptime.com/blog/post/2026-08-03-copy-artifacts-external-images-pin-digests/view (weight 0.52, authoritative)
- [S3] https://www.docker.com/blog/defending-your-software-supply-chain-what-every-engineering-team-should-do-now/ (weight 0.59, authoritative)
- [S4] https://specs.opencontainers.org/image-spec/manifest/ (weight 0.93, authoritative)
- [S5] https://specs.opencontainers.org/image-spec/image-index/ (weight 0.96, authoritative)
- [S6] https://stackharbor.com/en/knowledge-base/containers-oci-image-spec-deep-dive/ (weight 0.55, authoritative)
- [S7] https://docs.docker.com/dhi/explore/security-concepts/digests/ (weight 0.97, authoritative)
- [S8] https://containers.codeguides.io/image-policy-vulnerabilities/base-image-pinning-by-digest/ (weight 0.61, authoritative)
- [S9] https://github.com/mindersec/minder/issues/6829 (weight 0.22, WEAK backing)
