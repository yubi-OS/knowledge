# 06 - Building the base locally and rechunking

Scope: when and how to build a base image locally with `just`, how rechunking produces content-based layers, and why the local build is never the source of published images.

Ground source: `yubi-OS/yubiOS skills/fedora-bootc-base-images/SKILL.md`. This doc explicates the source doc's "Building the base locally (rarely needed)" section.

## The local build commands

The source doc gives 3 commands and labels the whole activity "rarely needed" (source doc):

```bash
# Standard tier against Fedora 43
FEDORA_VERSION=43 just build

# Specific tier
just build-minimal

# Rechunk (content-based layer splitting)
./bootc-base-imagectl rechunk --chunkah quay.io/local/fedora-bootc:build
```

The `FEDORA_VERSION` variable selects the release treefile (`fedora-{N}.yaml` from doc 05), the bare `just build` target builds the standard tier, and `just build-minimal` selects the minimal tier target. The third command runs rechunk on a locally built image tagged at a local registry reference.

## What rechunk actually does

The source doc names rechunk "content-based layer splitting" (source doc). The most authoritative dig source describes the mechanism precisely: "The bootc-base-imagectl rechunk command fixes all of these issues by taking an input container, operates on its final merged filesystem tree (hence removed/overridden files are handled), and then splits it up (currently based on the RPM database) into separate layers (tarballs)" (https://forge.fedoraproject.org/iot/base-images/src/branch/main/bootc-base-imagectl.md, jev weight 0.70). Red Hat's image mode announcement describes the same tool as "an advanced, post-processing tool that splits up the RPM content in an image into separate layers, which itself is similar to how we build our base image" (https://www.redhat.com/en/blog/image-mode-for-red-hat-enterprise-linux-generally-available, jev weight 0.74).

The point of content-based splitting is layer reuse. The `chunkah` tool from CoreOS explains the design goal: when splitting an image into content-based layers, it does not matter how the final contents were derived; the image is postprocessed so that layers are created in a way that tries to maximize layer reuse, commonly by grouping related packages (https://github.com/coreos/chunkah, jev weight 0.24, weak backing). For a derived OS this matters practically: yubiOS shares most of its content with the base image, so content-based layers let container storage deduplicate the shared packages instead of shipping them twice.

## The --chunkah flag

The source doc's rechunk invocation uses `--chunkah` (source doc). The upstream history of that flag is findable: a commit in the Fedora IoT base-images repo adds "a `--chunkah` flag to bootc-base-imagectl rechunk that uses chunkah instead of rpm-ostree for content-based layer splitting. Also wraps the tricky parts around pruning the OSTree repo and labels" (https://forge.fedoraproject.org/iot/base-images/commit/8362abca256572ee31059fe8bcc5582a7d13b767, jev weight 0.74). So there are 2 splitters available, rpm-ostree and chunkah, and the source doc's example uses the newer chunkah path. The related `hhd-dev/rechunk` project describes its own approach as working on top of OSTree, with OSTree as the single source of truth about which files exist in the image and their size (https://github.com/hhd-dev/rechunk, jev weight 0.12, weak backing). Ecosystem commentary notes that rechunk decides what the blobs are and zstd:chunked makes each blob partially fetchable, and that Fedora's own bootc base images are converging on zstd:chunked (https://margine.dev/handbook/rechunk-and-oci-packaging/, jev weight 0.15, weak backing).

## Local build is never the published source

The source doc is explicit in the Konflux CI section: "Actual image builds happen in Konflux (Red Hat's internal CI). The Tekton pipeline definitions are in `.tekton/`. Local `just build` is for development testing only, not what produces the published images" (source doc). A locally built image can therefore be used to reproduce and debug what a pinned digest contains, but it must never be confused with the official artifact: the digests worth pinning come out of Konflux, not `just build`.

For yubiOS this yields the standing rule: the local build exists for verification and experimentation against the treefiles; every production derivation pins a Konflux-produced digest (doc 03), and any discrepancy between local and official builds is an upstream-tracking signal (doc 07), not a reason to substitute a local artifact.

## Redo note

The first dig for this subtopic returned dictionary-definition noise for the "just build" phrasing (weights 0.07 to 0.56), so it was redone per the redo rule with different queries. The redo surfaced the Forge bootc-base-imagectl documentation (0.70), the --chunkah commit (0.74), and the Red Hat image mode blog (0.74), which is what this doc is built on. Redo count for this doc: 1.
