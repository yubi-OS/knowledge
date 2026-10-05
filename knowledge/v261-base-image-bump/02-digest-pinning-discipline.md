# 02. Digest pinning discipline

Scope: why a multi-arch index digest pinned in a single authoritative file is the source of truth for a bootc base image, and why a Containerfile must never copy a digest from an ADR or an old PR note.

## Tags are mutable, digests are content-addressed

A container image tag is a mutable pointer that can be retargeted at any time, while a digest is a content-addressed SHA 256 hash of the image manifest; pinning by digest is the only way to guarantee that the image you deploy is byte-for-byte the image you evaluated (https://safeguard.sh/resources/blog/container-image-digests-vs-tags-why-pinning-matters, noul 0.57). The same point is made in stronger operational language: a tag is mutable in exactly the way a git tag is mutable, and `python:3.13` today is a different artifact than `python:3.13` next week because the registry advances the tag as new builds ship; for build reproducibility the digest is the only stable reference (https://docs.ozarksecuritylabs.com/supply-chain/tier-2-hardened/container-image-digests/, noul 0.63). This is the mechanical reason the yubiOS rule exists that `PINNED.md` owns the live `quay.io/fedora/fedora-bootc:45` OCI index digest rather than any tag reference standing alone (source ref, no external weight for the internal file layout).

## Pinning is a supply chain control, not a style preference

Digest pinning is classified as a hardened supply chain rule ("Rule 2.3, pin container image digests") in tier 2 hardening guidance (https://docs.ozarksecuritylabs.com/supply-chain/tier-2-hardened/container-image-digests/, noul 0.63). Tooling exists specifically to enforce it: `dockerfile-pin` is a CLI that adds `@sha256:<digest>` suffixes to `FROM` and `COPY --from=` lines in Dockerfiles, image fields in compose files, and image references in GitHub Actions and GitLab CI files, explicitly to prevent supply chain attacks (https://github.com/azu/dockerfile-pin, noul 0.75). Red Hat's container image update guidance treats the registry supply chain as a standard concern for container consumers (https://access.redhat.com/articles/2208321, noul 0.75).

## Why one authoritative file beats scattered copies

The multi-arch index digest is what must be pinned, not a platform-specific child manifest, because the base image is consumed across architectures (source ref, no external weight for the yubiOS-specific requirement). The failure mode the source ref warns about is digest duplication: a digest copied into a Containerfile, an ADR, or an old PR note becomes a stale second source of truth that nobody maintains. General pinning guidance says the same thing from the tooling side: a pin discipline only works when the pin has exactly one update path, which is why tools like Renovate raise PRs that update the single pinned reference rather than sprinkling digests through the tree (https://docs.renovatebot.com/docker/, noul 0.88).

## How bootc consumes a pinned base

A derived bootc image is built from a Containerfile whose `FROM` references the base image (https://docs.fedoraproject.org/en-US/bootc/building-containers/, noul 0.93). The RHEL image mode documentation describes the same build-and-test flow: build and configure bootc-based images from a Containerfile, then test the result (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/building-and-testing-the-rhel-bootable-container-images_using-image-mode-for-rhel-to-build-deploy-and-manage-operating-systems, noul 0.95). When the `FROM` carries a digest, every build of the derived image is anchored to the exact base content the team verified. Bootc-specific tooling reinforces the discipline: a generated-Containerfile tool applies systemd presets and then validates the result with `bootc container lint`, and its `--pin-digests` mode resolves and pins all image references to sha256 digests (https://github.com/marrusl/osfragment-assemble, noul 0.56, weak backing).

## The yubiOS statement of the discipline

Three rules are recorded in the source ref (source ref, no external weight):

1. `PINNED.md` owns the live `quay.io/fedora/fedora-bootc:45` OCI index digest.
2. `fetch-fedora-bootc-manifest.yml` is the workflow used to refresh that digest.
3. The `Containerfile` must use the multi-arch index digest from `PINNED.md`, not a copied value from an ADR or old PR note.

The external evidence above justifies the shape of these rules: tag mutability makes the digest the only reproducible reference (noul 0.57, 0.63), and single-source pin maintenance is the pattern the automation ecosystem is built around (noul 0.88). The refresh workflow itself is covered in doc 03.
