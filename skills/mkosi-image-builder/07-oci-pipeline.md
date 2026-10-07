# 07 OCI Output Pipeline

Scope: building mkosi outputs in OCI container format and moving them to a registry with skopeo, ending in digest pinning.

## Format=oci in the yubiOS pipeline

The source doc (`yubi-OS/yubiOS skills/mkosi-image-builder/SKILL.md`) sets the yubiOS output format as:

```ini
[Output]
Format=oci
```

and states the pipeline position: mkosi builds OCI images, bootc installs and upgrades them, bcvk tests them. The OCI output is therefore the hand-off point between the image build and everything downstream. The full format list from doc 02 (`disk`, `uki`, `directory`, `tar`, `cpio`, `oci`) stays available; the yubiOS default for pipeline artifacts is `oci`.

The mkosi repository documents mkosi packages for Debian, Ubuntu, Fedora and SUSE built from latest main and published as distribution repositories on OBS (weight 0.94, https://github.com/systemd/mkosi), and the OBS user guide confirms mkosi-format image building driven by a `mkosi.conf` recipe file in INI format (weight 0.70, https://openbuildservice.org/help/manuals/obs-user-guide/cha-obs-package-formats). A secondary survey lists mkosi's container and archive outputs as directory, tar, cpio, oci, and portable (weight 0.15, https://deepwiki.com/systemd/mkosi/6.3-container-and-archive-formats; weak backing, corroborating only).

## Pushing to a registry with skopeo

The source doc's push path:

```bash
# Push to registry
skopeo copy oci:mkosi.output/yubiOS docker://dhi.io/yubi-OS/yubiOS:latest
```

`skopeo copy` transports are addressable as `oci:<dir>` for local OCI layouts and `docker://<registry>/<repo>:<tag>` for registries. skopeo is the tool for working with remote image repositories: it can inspect a repository on a container registry and fetch image layers, and its `inspect` command fetches the repository's manifest and shows docker-inspect-like JSON output (weight 0.75, https://github.com/podman-container-tools/skopeo).

Red Hat's documentation adds the property that makes skopeo the right choice for this pipeline: direct registry-to-registry copy is fast and preserves the unmodified form of the image, including its manifest digest, when the destination registry allows it, and copying images between registries requires no local daemon (weight 0.76, https://www.redhat.com/en/topics/containers/what-is-skopeo). Oracle's documentation confirms what `inspect` yields: information such as when the image was created, its SHA digest, and environment variables set for the image (weight 0.75, https://docs.oracle.com/en/operating-systems/oracle-linux/podman/skopeo.html).

## Digest pinning after push

The source doc's pinning step:

```bash
# Pin to digest after push
DIGEST=$(skopeo inspect --format '{{.Digest}}' docker://dhi.io/yubi-OS/yubiOS:latest)
echo "dhi.io/yubi-OS/yubiOS@$DIGEST"
```

The workflow is: push a mutable tag, immediately read the digest back with `skopeo inspect`, then record the immutable `repo@digest` reference for downstream consumers. A community write-up on safer image promotion describes exactly this trio as the practical pattern: inspect an image before trusting it, pin the exact digest your CI should promote, and copy images into OCI layouts or mirrors for disconnected environments (weight 0.13, https://dev.to/lyraalishaikh/stop-pulling-containers-just-to-mirror-them-practical-skopeo-for-safer-image-promotion-1kf3; weak backing, below the 0.5 threshold, used only as corroboration of the pattern).

## Why digest pinning matters for yubiOS

Downstream stages consume the digest, not the tag:

1. bootc upgrades pull by reference; a digest reference guarantees the exact bytes that were built, signed, and verity-sealed (doc 04) are the bytes installed (source doc pipeline statement plus the pinning recipe).
2. The roothash sidecar (`mkosi.output/<ImageId>.roothash`, doc 04) is only valid for one exact filesystem; tagging drift would silently break the hash-to-image correspondence.
3. SLSA-style provenance and attestation work in the wider yubiOS supply-chain stack expects digest-pinned references as the artifact identity (source doc context, `yubi-OS/yubiOS skills/mkosi-image-builder/SKILL.md`).

## Sources

- Source doc: `yubi-OS/yubiOS skills/mkosi-image-builder/SKILL.md` (Format=oci, skopeo recipes, digest pinning)
- https://github.com/systemd/mkosi (weight 0.94)
- https://openbuildservice.org/help/manuals/obs-user-guide/cha-obs-package-formats (weight 0.70)
- https://github.com/podman-container-tools/skopeo (weight 0.75)
- https://www.redhat.com/en/topics/containers/what-is-skopeo (weight 0.76)
- https://docs.oracle.com/en/operating-systems/oracle-linux/podman/skopeo.html (weight 0.75)
- https://deepwiki.com/systemd/mkosi/6.3-container-and-archive-formats (weight 0.15, weak backing)
- https://dev.to/lyraalishaikh/stop-pulling-containers-just-to-mirror-them-practical-skopeo-for-safer-image-promotion-1kf3 (weight 0.13, weak backing)