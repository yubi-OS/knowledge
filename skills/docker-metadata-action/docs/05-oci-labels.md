# 05. Auto-generated OCI labels and explicit labels

Scope line: this doc explicates the source doc's "Auto-generated OCI labels" section and the explicit labels in its yubiOS pattern, grounding the label vocabulary in the OCI annotations specification.

## The auto-generated set

The source doc lists five labels generated automatically from GitHub repo metadata:

- `org.opencontainers.image.title`
- `org.opencontainers.image.url`
- `org.opencontainers.image.created`
- `org.opencontainers.image.revision`
- `org.opencontainers.image.version`

No configuration is needed for these: the action derives them from the GitHub repository and the workflow event. That is the labor the action removes; hand-writing these five labels per image is exactly the maintenance burden the skill replaces.

## What the OCI spec says those keys mean

The Open Containers annotations specification defines the vocabulary the action writes into. The spec's annotations document defines `org.opencontainers.image.revision` as the "Source control revision identifier for the packaged software", and defines `org.opencontainers.image.vendor` as the "Name of the distributing entity, organization or individual" and `org.opencontainers.image.licenses` as the "License(s) under which contained software is distributed as an SPDX License Expression" (https://github.com/opencontainers/image-spec/blob/main/annotations.md, jev 0.93; same definitions mirrored at https://specs.opencontainers.org/image-spec/annotations/, jev 0.83).

Two spec facts matter for yubiOS label hygiene. First, the spec explains that the older Label Schema project "defined a number of conventional labels for container images, and these are now superseded by annotations with keys starting org.opencontainers.image", with tools encouraged to use the org.opencontainers.image keys (https://specs.opencontainers.org/image-spec/annotations/, jev 0.83). So the auto-generated set is on the current vocabulary, not the legacy one. Second, licenses are SPDX expressions, which is why the yubiOS pattern writes `org.opencontainers.image.licenses=GPL-2.0` as a bare SPDX identifier (source doc).

The revision label is the bridge between an image in a registry and a commit in Git: it carries the source control revision identifier, which is exactly the property yubiOS digest pinning (doc 06) needs for audit.

## Explicit labels in the yubiOS pattern

The source doc's yubiOS pattern adds four explicit labels on top of the auto-generated set:

```yaml
labels: |
  containers.bootc=1
  org.opencontainers.image.source=https://github.com/yubi-OS/yubiOS
  org.opencontainers.image.description=FIDO2-first immutable OS
  org.opencontainers.image.licenses=GPL-2.0
```

`containers.bootc=1` marks the image as a bootable container image, the bootc convention for images intended to boot a host system (source doc; the bootc delivery model is described in Fedora's bootc documentation: "using standard OCI/Docker containers as a transport and delivery format for base operating system updates", https://docs.fedoraproject.org/en-US/bootc/building-containers/, jev 0.77). `org.opencontainers.image.source` points back at the source repository, which is the spec-defined way for a registry page and any scanner to find the code that produced the image. `description` and `licenses` are human and SPDX-machine-readable respectively.

## Distinguishing auto from explicit

The audit-relevant distinction: the five auto-generated labels are correct by construction from repo metadata, while the explicit labels are policy choices a maintainer must keep true. A stale `description` or a wrong `licenses` value is a content error the action cannot fix. The yubiOS review discipline is therefore: auto labels are trusted, explicit labels are reviewed whenever the image's licensing or positioning changes.

## Source quality notes

Backing: the OCI image-spec annotations.md (0.93), the published spec page (0.83), Docker docs (0.93), and Docker Hub's general image-library page (0.66, cited only for the registry context). Two dig results for this subtopic were noise: the "OCI" acronym collided with India's Overseas Citizen of India portal (0.53 to 0.60) and a visa services page (0.42), all weighted low and carrying no claims. Docker product pages (0.26 to 0.52) and GeeksforGeeks (0.11) were weighted low and carry no claims. Both seed queries returned 44 or more raw results, 6 kept each; no redo.
