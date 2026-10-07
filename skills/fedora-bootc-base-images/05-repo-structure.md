# 05 - Fedora base-images repo structure

Scope: the files that make up the Fedora base-images repository, what each one controls, and how a consumer of the published image should read the repo.

Ground source: `yubi-OS/yubiOS skills/fedora-bootc-base-images/SKILL.md`. This doc explicates the source doc's "Repo structure (Fedora base-images)" section.

## The file map

The source doc gives a file-by-file map of the repo (source doc):

```
Containerfile          <- OCI build (multi-stage: base + rechunk/chunked targets)
Justfile               <- Task runner: `just build`, `FEDORA_VERSION=43 just build`
bootc-base-imagectl    <- Shell script: rechunk, OCI image builds
fedora-{N}.yaml        <- Per-version treefile stubs
standard.yaml          <- Standard tier manifest
minimal.yaml           <- Minimal tier manifest
minimal-plus.yaml      <- minimal-plus tier manifest
iot.yaml               <- IoT variant
.tekton/               <- Konflux CI (official Red Hat builds)
ci/                    <- Shellcheck + whitespace validation
renovate.json          <- Automated dependency bumps
```

Three structural facts follow from that map.

1. The treefiles are the real package manifests. `standard.yaml`, `minimal.yaml`, `minimal-plus.yaml`, and `iot.yaml` are per-tier rpm-ostree treefile manifests, and the `fedora-{N}.yaml` files are per-release stubs layered under them. When the source doc says "changes in `minimal.yaml` / `standard.yaml` can affect yubiOS" (source doc, doc 07), this is the mechanism: the treefiles are where packages are added and removed.
2. The build is multi-stage by design. The Containerfile has base plus rechunk/chunked targets (source doc), which pairs with the rechunk tooling in doc 06: the upstream build itself produces content-chunked layers, not one monolithic layer.
3. CI is split between `.tekton/` (Konflux, the official Red Hat builds, doc 07) and `ci/` (shellcheck plus whitespace validation, source doc). Local `just build` runs neither pipeline; it is a development convenience.

## bootc-base-imagectl in the repo

`bootc-base-imagectl` is a shell script in the repo that handles rechunk and OCI image builds (source doc). Red Hat's documentation describes it as the command that "allows developers to create customized base images from scratch with greater control over the OS content included in the build process" (https://developers.redhat.com/articles/2025/beyond-default-bootc-images-scratch, jev weight 0.66). An independent Rust reimplementation exists and its README summarizes why the script matters: "Building bootc base images today requires either rpm-ostree compose (the Fedora official path) or encoding 80+ lines of filesystem transforms as shell in a Containerfile (the FROM-scratch path)" (https://github.com/andrewdunndev/bootc-base-imagectl, jev weight 0.12, weak backing, cited only as corroboration of the tool's role, not its details).

The Fedora IoT team maintains a variant of the same tooling in their own `iot/base-images` repo, with a `bootc-base-imagectl.md` document of their own (https://forge.fedoraproject.org/iot/base-images/src/branch/main/bootc-base-imagectl.md, jev weight 0.70). That is a sibling deployment of the same idea rather than the exact file the source doc points at.

## renovate.json and automated bumps

`renovate.json` exists in the repo for automated dependency bumps (source doc). In practice this is the mechanism behind the source doc's upstream-tracking advice that "Renovate bumps Fedora version pins automatically; watch Renovate MRs for upstream version movement" (source doc). A consumer watching the repo gets version movement surfaced as merge requests rather than as silent tag changes, which makes Renovate MRs the cheapest signal for the digest-pinning cadence in doc 03.

## Reading the repo as a consumer

yubiOS does not build this repo locally in the normal flow; it consumes the published standard-tier image and pins it. The repo still matters as the source of record for 3 questions: what is in the image (treefiles), what changed upstream (git history and Renovate MRs), and how the official builds are wired (.tekton/). The source doc's "In-repo touchpoints" note lists Source repositories, Image tiers, yubiOS base image, and the standard-tier package set as the sections this skill owns, which matches that consumer reading (source doc).

## Weak-backing caveats

The file map rests on the source doc as the primary source of record. The dig corroborated the bootc-base-imagectl role (0.66, 0.70 weight sources) and the Justfile pattern exists in the bootc project itself (https://github.com/bootc-dev/bootc/blob/main/Justfile, jev weight 0.60), but the dig did not fetch the actual repo tree, so treat individual filenames as the source doc's record and verify against the live repo before scripting against a specific path.
