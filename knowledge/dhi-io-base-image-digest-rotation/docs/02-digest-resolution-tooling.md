# Digest resolution tooling

Scope: Resolving the new digest with registry tooling (crane, skopeo, docker buildx imagetools inspect) and recording the multi-arch index digest rather than a child.

## The tooling surface

Three families of tools resolve image digests from a registry reference: docker buildx imagetools, skopeo, and crane-style clients. The one with the strongest primary documentation is buildx imagetools, whose subcommands exist specifically for "working with manifest lists in container registries", useful for "inspecting manifests to check multi-platform configuration and attestations" [S1].

`docker buildx imagetools inspect` is the command a rotation uses to see the full hierarchy of a candidate image. The official reference shows the output shape for a multi-arch image: a Name, a MediaType of manifest list, a top-level Digest, and a Manifests section listing each platform child [S2]. The reference documents the `--format` flag, which accepts a Go template with fields `.Name` (the reference of the image), `.Manifest` (the manifest or manifest list), and `.Image` (the image config), defaulting to `.Manifest` [S3]. The `--raw` variant shows the original JSON manifest [S4].

An example from the official docs makes the hierarchy concrete: inspecting `alpine` returns a MediaType of `application/vnd.docker.distribution.manifest.list.v2+json` with a top-level Digest and a Manifests list beneath it [S5]. That top-level Digest is the value a rotation should record; the entries under Manifests are the per-platform children.

## Skopeo for the same job

Skopeo reaches the same information. The Hummingbird project's container documentation shows the idiom for getting per-architecture digests from an image index:

```
skopeo inspect --raw "docker://${Image}:${TAG}" | jq '.manifests[] | {digest, platform}'
```

The same snippet shows the registry, tag, and architecture being assembled as variables before the call [S6]. This is the mirror image of the buildx flow: `--raw` hands you the index JSON and you read the child manifests yourself, which is exactly what you want when the rotation record must distinguish index digest from children.

## Crane and regctl

Crane and regctl are part of the same tooling family. Secondary comparisons of skopeo, crane, and regctl exist [S7] [S8], but the ones surfaced in this dig are personal blogs and community notes with weak backing (weights 0.14 to 0.37), so this doc records them as pointers, not as authoritative claims. The buildx imagetools and skopeo paths above are sufficient for a rotation and are the ones with primary documentation.

## The rotation procedure with real tooling

Pulling the pieces together, a digest resolution for rotation looks like this:

1. Resolve the candidate tag with an index-aware inspect: `docker buildx imagetools inspect <repo>:<tag>` [S2] or `skopeo inspect --raw` [S6].
2. Confirm the MediaType is a manifest list / index (or an OCI image index media type). If it is, the top-level Digest is the multi-arch index digest [S2] [S5].
3. Record the index digest, and separately note the platform children if you need them for verification. Never promote a child digest to the pin [S7 of doc 01: https://containers.codeguides.io/image-policy-vulnerabilities/base-image-pinning-by-digest/ (weight 0.61)].
4. Keep the resolution output with the rotation record. The buildx `--format` template [S3] and `--raw` output [S4] give you a stable, greppable artifact of what the registry served at rotation time.

## Environment prerequisite

Digest resolution requires registry network access. In a CI setting, the runner must have the same registry reachability as the operator performing the rotation, otherwise the resolution step cannot be automated safely. This is stated as an environment dependency in the yubiOS rotation checklist (see the corpus README context); the tooling facts above are the externally verifiable half.

## Sources

- [S1] https://docs.docker.com/reference/cli/docker/buildx/imagetools/ (weight 0.79, authoritative)
- [S2] https://docs.docker.com/reference/cli/docker/buildx/imagetools/inspect/ (weight 0.82, authoritative)
- [S3] https://github.com/docker/buildx/blob/master/docs/reference/buildx_imagetools_inspect.md (weight 0.82, authoritative)
- [S4] https://docs.docker.com/reference/cli/docker/buildx/imagetools/inspect (weight 0.90, authoritative; covers --raw output)
- [S5] https://docs.docker.com/reference/cli/docker/buildx/imagetools/inspect (weight 0.90, authoritative; alpine manifest list example)
- [S6] https://hummingbird-project.io/docs/background/containers/security-labels-and-metadata/ (weight 0.63, authoritative)
- [S7] https://alexandre-vazquez.com/skopeo-crane-regctl-container-image-tools/ (weight 0.18, WEAK backing)
- [S8] https://eng.d2iq.com/blog/a-tale-of-two-container-image-tools-skopeo-and-crane/ (weight 0.27, WEAK backing)
