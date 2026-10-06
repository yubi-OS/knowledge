# 05. The OCI annotations specification

**Scope:** The OCI image-spec annotations standard that the `org.opencontainers.*` labels metadata-action generates are drawn from, and the namespace rules that govern them.

## The standard

The five auto-generated labels in doc 04 are all keys in the `org.opencontainers.image` namespace, and that namespace is owned by the OCI Image Specification. The spec text is unambiguous about ownership: "Keys using the org.opencontainers.image namespace are reserved for use in the OCI Image Specification and MUST NOT be used by other specifications and extensions, including other OCI specifications. If there are no annotations then this property MUST either be absent or be an empty map" (https://github.com/opencontainers/image-spec/blob/main/annotations.md, weight 0.92).

The annotations document is a standards-track part of the OCI Image Spec, published under the identifier IMAGE-SPEC-ANNOTATIONS and served from the opencontainers/image-spec repository on GitHub, where contributions and change suggestions are made (https://specs.opencontainers.org/image-spec/annotations/, weight 0.90).

## The repository

The OCI Image Format specification lives at https://github.com/opencontainers/image-spec (weight 0.90). At a high level, the project describes an OCI implementation downloading an OCI image and unpacking it into an OCI Runtime filesystem bundle; the Runtime Specification is the partner project covering how that bundle runs (https://github.com/opencontainers/image-spec, weight 0.90).

## The annotation keys the action generates

The keys metadata-action emits are the spec's well-known image annotations (source doc, yubi-OS/yubiOS skills/docker-metadata-action/SKILL.md):

- `org.opencontainers.image.title`
- `org.opencontainers.image.url`
- `org.opencontainers.image.created`
- `org.opencontainers.image.revision`
- `org.opencontainers.image.version`

The yubiOS pattern adds two more keys in the same reserved namespace, set to literal values rather than derived from repo metadata: `org.opencontainers.image.source` and `org.opencontainers.image.licenses` (source doc). Both are standard spec keys; the action simply does not auto-derive them, so the yubiOS workflow sets them explicitly.

## Spec version drift, v1.1

The spec's annotation model evolved in v1.1. The OpenContainers blog post summarizing the upcoming v1.1 changes shows an OCI image index with `artifactType` alongside per-manifest entries carrying `mediaType`, `size`, `digest`, and annotations (https://opencontainers.org/posts/blog/2023-07-07-summary-of-upcoming-changes-in-oci-image-and-distribution-specs-v-1-1/, weight 0.78). A later post on the v1.2 runtime spec links annotation fields back to the image spec's conversion document at `https://github.com/opencontainers/image-spec/blob/v1.1.0/conversion.md#annotation-fields` (https://opencontainers.org/posts/blog/2024-02-18-oci-runtime-spec-v1-2/, weight 0.69). The practical point for this corpus: the annotation key vocabulary metadata-action writes is stable across these spec revisions, so the generated labels remain spec-conformant.

## Search caution from the dig

The term "OCI" collides with two unrelated domains: the Overseas Citizen of India program (https://www.ociservices.gov.in/onlineOCI/, weight 0.50) and Oracle Cloud Infrastructure (https://www.oracle.com/cloud/, weight 0.50). Both hit this subtopic's dig results with weights at or below the 0.5 authority line. Any future research on Open Container Initiative topics should qualify queries with "opencontainers" or "image-spec" to avoid pulling Indian immigration services and Oracle marketing pages into the evidence base. Neither source supports any claim above.

## Why this matters for yubiOS

The source doc's self-describing coverage section places this skill as one contributor to yubiOS's self-describing primitive: "OCI labels make the image self-identifying" (source doc). Because the labels are spec-reserved keys, any downstream consumer (a registry UI, an audit pipeline, a policy engine reading image metadata) can rely on their meaning being defined by the OCI Image Specification rather than by yubiOS convention. That shared vocabulary is what lets the generated `revision` and `version` labels serve as evidence artifacts without a custom schema.
