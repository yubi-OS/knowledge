# 06. The yubiOS pattern: sha pinning and the bootc label

Scope line: this doc explicates the source doc's "yubiOS pattern" section and its supply-chain note: why `type=sha,format=long` is preferred over `:latest`, and why the `containers.bootc=1` label travels with the image.

## The pattern

The source doc's yubiOS pattern block:

```yaml
- uses: docker/metadata-action@v5
  id: meta
  with:
    images: |
      quay.io/yubi-os/yubios
    tags: |
      type=sha,format=long          # full SHA for digest pinning
      type=ref,event=branch         # branch builds
      type=semver,pattern={{version}}  # release tags
    labels: |
      containers.bootc=1
      org.opencontainers.image.source=https://github.com/yubi-OS/yubiOS
      org.opencontainers.image.description=FIDO2-first immutable OS
      org.opencontainers.image.licenses=GPL-2.0
```

Three tag rules and four labels. Each part earns its place for a compliance reason, not a convenience reason.

## Why sha,format=long over latest

The source doc's Notes section states the rule: "type=sha,format=long preferred over :latest for supply chain compliance (yubiOS.rego)". The context is the yubiOS Build Policy regime: the org's docker buildx `--policy` gate vets build inputs against `yubiOS.rego`, which enforces digest-pinned approved registries (the docker-build-policy discipline; see the yubiOS Build Policy skill and its Rego schema). An image reference that a consumer can pin has to resolve to an immutable digest, and a `latest` tag is mutable by definition: it moves with every push, so anything that trusted it can silently receive different bytes.

A full-SHA tag `sha-<40 hex>` is a stable, human-readable alias of a build. Combined with the auto-generated `org.opencontainers.image.revision` label (doc 05, "source control revision identifier for the packaged software", OCI image-spec annotations.md, https://github.com/opencontainers/image-spec/blob/main/annotations.md, jev 0.93), the image carries both an external pin (the tag) and an internal provenance pointer (the label) to the exact commit that built it.

The digest-pinning framing matches Docker's own supply-chain guidance: digest-based references underpin trust in what is running, and Docker's hardened-image documentation ties digests to "signed metadata, provenance, and minimal attack surface" (https://docs.docker.com/dhi/explore/security-concepts/digests/, jev 0.58, moderate weight, labeled: it is Docker's product-side page, used here only for the general digest-trust framing). A DockerCon talk on secure supply chain metadata makes the same linkage from the tooling side: signed SBOMs and provenance attestations built with BuildKit and GitHub Actions (https://www.docker.com/resources/demystify-secure-supply-chain-metadata-dockercon-2023/, jev 0.70).

## Why the branch and semver rules stay

`type=ref,event=branch` keeps every branch build addressable under its own name (source doc tag types, doc 03), so a `main` build is distinguishable from a feature build without a registry search. `type=semver,pattern={{version}}` is the release tag consumers pin in manifests. The pattern deliberately drops `type=raw,value=latest`: a supply-chain-gated image has no moving tag, and the use-sparingly caveat on raw/latest (source doc, tag types reference) is here honored by omission.

## Why containers.bootc=1 travels with the image

yubiOS is a bootc image: an OCI container used as the transport and delivery format for a bootable host system, per Fedora's bootc documentation ("This project aims to apply the same technique for bootable host systems, using standard OCI/Docker containers as a transport and delivery format for base operating system updates", https://docs.fedoraproject.org/en-US/bootc/building-containers/, jev 0.77). The `containers.bootc=1` label (source doc) is the declaration that tells bootc-aware tooling this image is a bootable OS image rather than an application image. Fedora's own worked example builds and boots a bootc image via Quay.io and pushes updates to a booted system through that registry flow (https://docs.fedoraproject.org/en-US/iot/fedora-iot-bootc-quay-example/, jev 0.74), which is the same registry (quay.io) the yubiOS pattern names under `images:`.

The remaining three labels are the explicit annotation set from doc 05: source repo pointer, human description ("FIDO2-first immutable OS"), and SPDX license identifier (GPL-2.0).

## Pull request builds and the pattern

The yubiOS pattern omits `type=ref,event=pr`. PR builds that need a tag add the pr rule in a workflow variant; the sha long tag still applies to every push, including PR events, which is what keeps a PR build pinnable. The PR head SHA boolean documented upstream (doc 03, https://github.com/docker/metadata-action, jev 0.91) governs which SHA a PR build's sha tag names.

## Source quality notes

Backing: the action repository (0.92), Fedora bootc docs (0.77 and 0.74), the DockerCon supply-chain metadata talk (0.70), and the Docker digests page (0.58). Off-topic noise in this subtopic's second query (commercial shipping-container vendors at 0.02 to 0.04, a retail listing at 0.02) was weighted low and carries no claims; a community best-practices repo scored 0.21 and was excluded. Both seed queries returned 45 or more raw results, 6 kept each; no redo.
