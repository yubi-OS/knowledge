# 01 - composefs backend layout

Scope: the bootc composefs backend's on-disk repository layout: the three-store model (objects, images, state), the EROFS metadata-only image, and the digest naming rules from composefs-rs.

## The metadata/data split

The composefs library separates filesystem metadata from file data. An EROFS image carries only the metadata: directories, permissions, and xattrs. Data files live in a separate content-addressed backing store, shared across images and kept hot in the Linux page cache. Optional fs-verity provides end-to-end integrity verification of both the metadata and the data (weight 0.93, [composefs-rs](https://github.com/composefs/composefs-rs)).

The Rust crate documentation is more specific about what the EROFS image holds: inodes, directory entries, extended attributes, and chunk index entries that point at the external files. composefs-rs supports multiple EROFS format versions selected by a `FormatVersion` enum (weight 0.70, [composefs::erofs_format](https://docs.rs/composefs/latest/composefs/erofs_format/index.html)). The EROFS image includes `trusted.overlay.redirect` extended attributes that tell the overlayfs mount where the real underlying files live (weight 0.70, [lib.rs/crates/composefs](https://lib.rs/crates/composefs)).

Because the EROFS image is authenticated as a whole, the per-file digests it carries are trusted transitively. The image contains the complete filesystem metadata including a fs-verity digest for every regular file, stored in the `trusted.overlay.metacopy` xattr; authenticating the image therefore authenticates every per-file digest inside it (weight 0.60, [Image sealing with composefs](https://scrivano.org/posts/2026-06-05-sealing-with-composefs/)).

## The three-store repository

bootc's composefs backend organizes the host state as a three-store model: an object store, an image store, and a state store. The object store holds base image file content, the image store holds the EROFS metadata images, and the state store holds per-deployment writable state (weight 0.66, [Filesystem Layout, DeepWiki](https://deepwiki.com/bootc-dev/bootc/2.2-filesystem-layout)).

In the bootc internals documentation the repository is described as a content-addressable store for composefs objects. The repository abstraction stores and retrieves content-addressed objects, splitstreams, and images, with fs-verity verification and garbage collection support (weight 0.62, [composefs::repository](https://bootc-dev.github.io/bootc/internals/composefs/repository/index.html)).

Concretely, the on-disk layout a composefs install produces separates these stores under the sysroot: `/composefs/images/<digest>` points at a metadata-only EROFS image, file content lives under `/composefs/objects`, and per-deployment state lives under `/state/deploy`. The metadata images are named by the fs-verity digest that authenticates them, which is what makes the image store content-addressed (weight 0.60, [Image sealing with composefs](https://scrivano.org/posts/2026-06-05-sealing-with-composefs/)).

## Digest naming and stability status

The composefs-rs repository format documentation describes the current on-disk layout of a composefs repository and states explicitly that the format is not declared stable at this time (weight 0.53, [composefs::repository_format](https://docs.rs/composefs/latest/composefs/repository_format/index.html)). Any yubiOS code that walks `/composefs/images` or `/composefs/objects` by naming convention should therefore expect format churn across bootc releases.

bootc itself versions on semver: since release 1.2.0 version numbers follow semantic versioning standards, which is the contract yubiOS pins against when choosing a base image (weight 0.91, [bootc-dev/bootc](https://github.com/bootc-dev/bootc)).

## What has to land where

There is an open upstream gap here. The bootc issue tracker records that the composefs backend documentation does not explain how to structure an image that is compatible with installing via the composefs backend instead of ostree, including where kernel images need to land so that bootc can install the image and it boots (weight 0.61, [bootc issue 2237](https://github.com/bootc-dev/bootc/issues/2237)). For image authors this means the layout contract for `--composefs` installs is currently inferred from the implementation rather than specified, and a build pipeline should verify the installed tree against the three-store layout rather than trusting documentation.

## Why the split matters for yubiOS

The layout split is the mechanism behind the sealing story. The metadata image is small, self-contained, and named by its own fs-verity digest, so a single authenticated digest covers the entire filesystem tree: file contents are checked against per-file digests recorded inside the authenticated metadata image. This design is what lets a sealed UKI bind an entire root filesystem with one `composefs=<digest>` argument instead of enumerating per-file hashes (weight 0.93, [composefs-rs](https://github.com/composefs/composefs-rs)).

The consequence for yubiOS verification is that three things must be checked separately: the repository layout under `/composefs`, the fs-verity measurement of each EROFS metadata image, and the digest reference carried by the boot path. Each layer can fail independently, and a CI smoke that checks only one of them proves less than it appears to.
