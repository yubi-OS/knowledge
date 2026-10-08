# 08. Pinned base images by digest

Scope: why every FROM line references a digest rather than a mutable tag, the yubiOS pinning example, and how to retrieve digests after pushing.

## The rule and the risk

The source doc states the rule flatly: always reference by digest, because mutable tags are supply chain risk (source doc, yubi-OS/yubiOS skills/rootless-container-builds/SKILL.md). A tag is a pointer some party can move; a digest is the content hash of the image manifest. Pinning by digest means the bytes a build consumes are the bytes that were vetted, regardless of what happens to the tag in the meantime. This is the input-side complement of Build Policies: the rego policy in doc 05 enforces `input.image.isCanonical`, the canonical digest reference, at build time, so an un-pinned FROM is rejected before any layer executes.

The source doc's example Containerfile pins the base image and adds the yubiOS identity stack on top:

```dockerfile
FROM dhi.io/debian-base@sha256:9415967aa0ed8adea8b5c048994259d1982026dca143d0303c7bbe0e11ed67d3

RUN apt-get install -y pam-u2f yubikey-manager libfido2-dev opensc
```

(source doc). The same digest appears in the GitHub Actions workflow of doc 09 as the container image for the build job, so the CI runner itself runs on the same pinned base.

## Retrieving digests

The source doc gives two commands to capture the digest after a push:

```
podman inspect --format '{{.Digest}}' dhi.io/yubi-OS/yubiOS:latest
skopeo inspect docker://dhi.io/yubi-OS/yubiOS:latest | jq -r .Digest
```

(source doc). The first is the podman-native path used in the build sequence of doc 03; the second works without a local image store.

Skopeo is the right tool when the image is not local. The project repository describes inspect as fetching the repository's manifest and showing a docker-inspect-like JSON output about a whole repository or a tag, in contrast to docker inspect, which helps gather information about a repository or tag before pulling (https://github.com/podman-container-tools/skopeo, jev weight 0.84). Red Hat describes skopeo as a tool for manipulating, inspecting, signing, and transferring container images and repositories (https://www.redhat.com/en/topics/containers/what-is-skopeo, jev weight 0.72), and Oracle's documentation adds the property that matters for build hosts: skopeo does not require a running daemon to function (https://docs.oracle.com/en/operating-systems/oracle-linux/podman/skopeo.html, jev weight 0.76).

## Pinning in two places

The source doc applies the same digest in two distinct positions, and both matter: the Containerfile pins the build-time base image, and the GitHub Actions workflow pins the runner itself with `container: image: docker://dhi.io/debian-base@sha256:9415967aa0ed8adea8b5c048994259d1982026dca143d0303c7bbe0e11ed67d3` plus registry credentials (source doc). Pinning the runner matters as much as pinning the base: a mutable runner image is an execution-context supply chain risk that no Containerfile pin can compensate for, since the runner executes the build steps themselves. The workflow also pins the checkout action by commit SHA (`actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd`) rather than a moving tag (source doc), extending the same immutability discipline to CI tooling.

## What digest pinning does and does not cover

Pinning fixes the identity of a reference at build time. It does not freeze the tag itself: the digest captured today stays valid even when `latest` is later moved, which is exactly the property that makes it the correct anchor for both the rego policy check and the cosign signature of doc 07. The signature is verified against the digest reference; if a rebuilt image is pushed under the same tag, its digest differs, its signature must be renewed, and any consumer still pinning the old digest keeps building with the old vetted bytes.

Weak-backing notes: several search hits on this subtopic scored low under jev weighting, including a codeguides.io base-image-pinning guide at 0.31, a sourcery.ai vulnerability writeup on unpinned tags at 0.12, and a dev.to skopeo mirroring post at 0.14. The rationale for pinning in this doc rests on the source doc and the isCanonical enforcement of the policy layer; the skopeo mechanics rest on the three primary sources cited above.
