# 09 - Digest Pinning and the Supply-Chain Picture

Scope: digest-versus-tag pinning semantics, OCI manifest resolution, the skopeo and quay API inspection tooling the protocol uses, and where package floors sit in the wider supply-chain verification story.

## Tags are pointers, digests are content

An OCI image is a set of content-addressed objects: manifest, config, and layers, with the manifest's SHA256 serving as the only immutable identifier; deploying by digest rather than by tag is the difference between determinism and a moving target (source: https://www.kunwar.page/chapter/106-the-oci-image-lifecycle-registries-digest-pinning-the-digest-update-pattern, weak backing, jev weight 0.51). The same distinction is stated consistently across the ecosystem: tags are mutable pointers and digests are content-addressed and immutable, so pinning by digest keeps a name from repointing to different bytes (source: https://safeguard.sh/resources/blog/container-image-digests-vs-tags-why-pinning-matters, weak backing, jev weight 0.26; https://containers.codeguides.io/registries-supply-chain/tagging-and-immutability/, weak backing, jev weight 0.63). Tag immutability features at registries close the gap from the other side: an immutable tagged artifact cannot be deleted or altered through re-pushing, re-tagging, or replication (source: https://www.h2security.io/secure/registry-tags-never-move/, jev weight 0.54). The yubiOS pattern combines both: pin the digest, and record the digest in PINNED.md with a re-resolution stamp so the pin's provenance is auditable (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 3.4).

The `image@digest` reference syntax is the standard way to reference images immutably across container orchestration systems and Docker itself (source: https://adhdecode.com/articles/docker/docker-image-digest-vs-tag/, weak backing, jev weight 0.24). For the fedora-bootc:45 pin, this is why a rotation is a commit and not a redeploy: the bytes the pin points to cannot change, so any change is a deliberate, reviewable repin.

## Manifest handling and multi-arch

What a digest resolves to is a manifest, and modern base images are manifest lists. Quay supports Docker schema 1 and 2, OCI manifests and indexes, manifest lists, and multi-architecture manifests, with schema conversion logic between types (source: https://deepwiki.com/quay/quay/2.1-manifest-handling, weak backing, jev weight 0.69). A multi-arch base image digest typically points to an index whose children are per-architecture manifests, which matters for the yubiOS incident record: the 2026-09-18 drift check found the stale pin 404ing while the `:45` tag resolved a new index with 4 children (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 9). The arm64 stream truncation of 2026-07-26 (OMN-139) is the same shape of failure one layer down: a registry-side delivery problem on a specific platform's blob.

## Inspection tooling: skopeo and the quay API

The protocol's two inspection routes are the quay REST API and skopeo. The quay API query for the current tag resolution is a one-line curl against `https://quay.io/api/v1/repository/fedora/fedora-bootc/tag/?specificTag=:45` (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 3.1). Skopeo inspects a repository on a container registry and fetches image layers; the inspect command fetches the repository's manifest and produces a docker-inspect-like JSON output about the repository and its images (source: https://github.com/podman-container-tools/skopeo, jev weight 0.96). Skopeo's inspect lets a user examine metadata of container images without fully downloading them, which is what makes it useful for verifying layers before trust (source: https://deepwiki.com/containers/skopeo/3.2-inspect-command, weak backing, jev weight 0.21). The practical workflow the tooling enables: inspect an image before trusting it, pin the exact digest CI should promote, and copy images into a mirroring layout (source: https://dev.to/lyraalishaikh/stop-pulling-containers-just-to-mirror-them-practical-skopeo-for-safer-image-promotion-1kf3, weak backing, jev weight 0.56). IBM's skopeo documentation describes the same utility for interacting with local and remote OCI images and registries (source: https://www.ibm.com/docs/en/zoscp/1.1.0?topic=options-skopeo-commands, jev weight 0.65).

For the version inspection itself, the protocol uses podman: pull the digest and run `rpm -q` inside it (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 3.2; podman command surface: https://docs.podman.io/en/v5.0.2/Commands.html, jev weight 0.93).

## Where floors sit in the supply chain

Digest pinning answers "are these the bytes we chose?" Package floors answer "are these bytes acceptable?" Both are needed, and third-party checklists treat them as one gate: a per-release gate on the artifact itself covering digest pinning, base freshness, triaged scanning, signature verification that is enforced rather than merely produced, an SBOM someone queries, and provenance (source: https://runbook.academy/courses/docker/checklists/docker-checklist-supply-chain-verification/, jev weight 0.66). The yubiOS floor protocol is the compatibility half of that gate applied to an OS base image: freshness without floor verification would happily ship a kernel below 6.6 that cannot mount the composefs catalog in enforced mode.

Registry-side, platforms formalize the same pairing. Docker's Hardened Images documentation ties digests to signed metadata and provenance across the supply chain (source: https://docs.docker.com/dhi/explore/security-concepts/digests/, jev weight 0.96), and Azure's signing and verification overview treats signing and verifying OCI artifacts as the integrity layer over content-addressed references (source: https://learn.microsoft.com/en-us/azure/container-registry/overview-sign-verify-artifacts, jev weight 0.93). Artifact management generalizes the model beyond images: registries store and retrieve OCI and supply-chain artifacts with ORAS-style tooling (source: https://learn.microsoft.com/en-us/azure/container-registry/container-registry-manage-artifact, jev weight 0.94). The floor verification layer composes with these: the pin gives a stable subject to sign and attest, and the floors keep the signed subject within the version envelope the boot chain requires.

## The rotation loop as a pattern

Putting the pieces together, the digest-pinning supply-chain pattern for a digest-pinned OS build is a loop:

1. Observe the tag's current resolution (quay API or skopeo inspect).
2. Pull and inspect the candidate digest's package versions (podman run rpm -q).
3. Verify the candidate against recorded floors (kernel per composefs mode, systemd features, bootc subcommands).
4. Repin deliberately with a stamped commit.
5. Re-verify the built outputs in the post-bump cascade.
6. Re-check pin health on a schedule so a vanished manifest is detected before a build fails.

Each step has an owner in the protocol: steps 1 to 3 are the pre-bump checklist (doc 06), step 4 is the commit pattern (doc 06), step 5 is the CI cascade (doc 07), and step 6 is the scheduled gate (doc 08). The incident history (doc 05) is what happens when step 6 is missing; the floor tables (docs 01 to 04) are what steps 3 and 5 check against.
