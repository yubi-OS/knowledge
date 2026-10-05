# 02 - Pinning strategies

**Scope.** Pinning the tools-tree image: why digest rather than tag, which distro and registry source to select, and how to resolve the tools tree reproducibly so builds stay comparable.

## Why the digest, not the tag

A Docker image digest is a unique, cryptographic identifier, a SHA-256 hash, representing the content of an image. Unlike tags, which can be reused or changed, a digest is immutable and ensures that the exact same image is pulled every time ([docs.docker.com/dhi/explore/security-concepts/digests/](https://docs.docker.com/dhi/explore/security-concepts/digests/), jev weight 0.79, authoritative).

The weak-source layer says the same thing from the OCI mechanics side: an OCI image is three content-addressed objects, manifest, config, and layers, and the manifest's SHA256 is the only immutable identifier, so deploying by digest rather than tag is the difference between determinism and a ticking bug ([www.kunwar.page/chapter/106-the-oci-image-lifecycle-registries-digest-pinning-the-digest-update-pattern](https://www.kunwar.page/chapter/106-the-oci-image-lifecycle-registries-digest-pinning-the-digest-update-pattern), jev weight 0.26, weak source). And from the operations side: digest pinning is the only mechanism that guarantees exactly what is being built or deployed, eliminating "it worked yesterday, broke today with no code changes" incidents caused by an upstream base image silently changing under an unchanged tag ([interviewstacks.com](https://interviewstacks.com/stacks/docker/image-distribution-and-registries/whats-the-difference-between-using-a-tag-and-using-a-digest-for-pinning), jev weight 0.26, weak source).

For a tools tree this matters doubly: the tools tree is a build input, so an unpinned or tag-pinned tools tree can silently change the compiler, package manager, or signing tooling between builds with no commit at all.

## Which source: distro and version of the tool environment

mkosi exposes the tools-tree source through its configuration. Tools trees can be customized via the ToolsTree* variables ([mkosi/resources/man/mkosi.1.md](https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md), jev weight 0.91, authoritative). A real configuration pins the tool environment to one distro and version while the target image is another: ToolsTreeDistribution=fedora, ToolsTreeRelease=42, ToolsTree=default, building an openSUSE Leap 16.0 image ([github.com/systemd/mkosi/issues/3990](https://github.com/systemd/mkosi/issues/3990), jev weight 0.87, authoritative). The tracker must therefore record, at minimum:

- the tools-tree distribution (here fedora),
- the tools-tree release (here 42),
- the mkosi ToolsTree mode (here default),
- and, when the tools tree is consumed as a prebuilt image rather than built in place, the registry reference and digest.

## The build environment around the pin

Pinning the tools tree does not remove the surrounding build dependencies. mkosi images can be built by an unprivileged, non-root user, and some targets require mkosi's optional dependencies mtools and systemd-ukify ([wiki.archlinux.org/title/Mkosi](https://wiki.archlinux.org/title/Mkosi), jev weight 0.80, authoritative). A tools-tree tracker should record these as environment prerequisites, because a host that lacks them produces a different build path than one that has them.

## Rebuild cadence and pin freshness

A pin is a decision, not an endpoint. Digest-pinning guides call out tag mutability and rebuild cadence as the two implementation questions once you pin ([containers.codeguides.io/image-policy-vulnerabilities/base-image-pinning-by-digest/](https://containers.codeguides.io/image-policy-vulnerabilities/base-image-pinning-by-digest/), jev weight 0.44, weak source), and the digest-update pattern literature treats "when does the digest move" as a first-class lifecycle question ([www.kunwar.page](https://www.kunwar.page/chapter/106-the-oci-image-lifecycle-registries-digest-pinning-the-digest-update-pattern), jev weight 0.26, weak source). The yubiOS plan mirrors this: the tools-tree source is treated like any other pinned OCI input, resolved to a digest, not just a tag, and its transitions are recorded in the refresh workflow (yubiOS refs plan doc, source of this corpus).

## Bottom line

Pin by digest, record the distro and release that the digest came from, and treat the tools-tree pin as one more OCI input in the same ledger as the base images. The remaining docs cover where the pin lives, how it refreshes, and how it feeds provenance.
