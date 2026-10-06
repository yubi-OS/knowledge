# 02: Tag taxonomy: release tags versus immutable OCI image tags

Scope: the two-layer tag model where human-facing semver release tags coexist with immutable commit-SHA OCI image tags, and where floating tags fit.

## Two kinds of tags, two jobs

Container registry guidance distinguishes stable tags from unique tags. Microsoft's Azure Container Registry documentation describes stable tags as tags you reuse to point at a current baseline and unique tags as tags generated per push, and recommends unique tags for deployments that must be reproducible [1] (authoritative, weight 0.90). An OS project inherits the same split: the semver release tag is the human-facing stable pointer, while an image reference derived from a commit SHA is the unique, reproducible one.

## Immutability is a registry-enforceable property

Docker Hub documents immutable tags as a mechanism to maintain image version consistency, preventing a tag from being updated after push [2] (authoritative, weight 0.95). GitLab's container registry offers tag immutability rules that prevent tags from being updated or deleted, noting that by default users with Developer, Maintainer, or Owner roles can push and delete image tags in all project container repositories [3] (authoritative, weight 0.87). The lesson for a versioning scheme: a tag is only as immutable as the registry rules that enforce it. A scheme that calls :<full-sha> immutable should pair it with registry-side immutability configuration where available, or the immutability is a convention rather than a control.

## The OCI layer beneath tags

The Open Container Initiative Image Format specification defines the image manifest and descriptor model that registries serve [4] (authoritative, weight 0.83). The OCI annotations spec reserves the org.opencontainers.image namespace of keys for the image specification itself [5] (authoritative, weight 0.79). Tags are registry-level labels over these content-addressed manifests; the digest of a manifest is the truly immutable reference, which is why verification workflows bind to digests rather than tags.

## Why SHA-derived tags exist alongside semver tags

Practitioner guidance is consistent that reliable tagging strategies combine immutable Git SHA tags for traceability with semantic version tags for human readability, and never deploy mutable tags like :latest to production [6] (weak backing, weight 0.16). A companion how-to describes the failure mode that motivates the SHA pairing: container tags like latest or v1.2 are mutable, they can be silently overwritten, causing inconsistent deployments and tag drift [7] (weak backing, weight 0.24). A short defense of the latest tag concedes the core point even while arguing for it: a tag like git-ab34de65c clearly cannot refer to anything other than the commit with that SHA, while v1.2.3 only implies what it points at [8] (weak backing, weight 0.16).

## Where the taxonomy goes wrong

Not every "OCI tag" search hit is about containers: Oracle Cloud Infrastructure tagging (resource metadata tags) is a different concept entirely and pollutes results on this topic [9] (off-topic despite weight 0.25). When auditing a scheme doc or searching for prior art, filter registry-tagging sources from cloud-resource-tagging sources.

## Application to the yubiOS decision

The yubiOS decision (refs/yubios-versioning-scheme-2026-08-04) codifies the two-layer taxonomy: optional human-facing vMAJOR.MINOR.PATCH release tags, and always-present immutable OCI tags in three shapes: :<full-sha> (40 char) as the canonical reference for verification, signed UKI build provenance, and SLSA attestation binding; :<short-sha> (7 char) as a readability convenience that must always be paired with the corresponding full-sha tag; and :<short-sha>-<arch> per-architecture child references. A floating :latest is allowed only in install commands for end users and never in CI inputs. The registry documentation above backs both the immutability rationale and the stable-versus-unique split the decision encodes.

## Sources

1. https://learn.microsoft.com/en-us/azure/container-registry/container-registry-image-tag-version (jev weight 0.90, authoritative)
2. https://docs.docker.com/docker-hub/repos/manage/hub-images/immutable-tags/ (jev weight 0.95, authoritative)
3. https://docs.gitlab.com/user/packages/container_registry/immutable_container_tags/ (jev weight 0.87, authoritative)
4. https://github.com/opencontainers/image-spec (jev weight 0.83, authoritative)
5. https://specs.opencontainers.org/image-spec/annotations/ (jev weight 0.79, authoritative)
6. https://khimananda.com/blog/docker-image-tagging-strategies (jev weight 0.16, weak)
7. https://gist.github.com/artofthepossible/43a3919b13a0e66bc6c7b487de187f65 (jev weight 0.24, weak)
8. https://medium.com/@michael.vittrup.larsen/why-we-should-use-latest-tag-on-container-images-fc0266877ab5 (jev weight 0.16, weak)
9. https://docs.oracle.com/en-us/iaas/Content/Tagging/Concepts/taggingoverview.htm (jev weight 0.25, weak, off-topic)
