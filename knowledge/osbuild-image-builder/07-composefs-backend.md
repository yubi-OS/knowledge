# 07 - composefs backend status

Scope: the experimental composefs-native backend in bootc and the blocker chain for composefs-native image builds in the osbuild toolchain.

## What the composefs backend is and its status

bootc documents a composefs backend as an experimental alternative backend, with the explicit caveat that experimental features are subject to change or removal (https://bootc.dev/bootc/experimental-composefs.html, noul 0.75). Experimental status means the backend is compiled in and available but not production-ready, and projects depending on it cannot treat its behavior as a stability contract.

The builder-side documentation carries the same flag: the bootc-image-builder repository README notes there is experimental support in the disk-image build path (https://github.com/osbuild/bootc-image-builder, noul 0.93). The osbuild migration page for bootc users sets prerequisites for the disk-image build environment, including the osbuild-selinux package or an equivalent osbuild SELinux policy on systems where SELinux is enforced (https://osbuild.org/docs/bootc/, noul 0.86).

## Where the build runs bootc

The mechanics run through osbuild stages. A maintainer tracker describes the linkage: osbuild's org.osbuild.bootc.install-to-filesystem stage runs bootc install inside the image, so the image build inherits whatever bootc install does, including the composefs-backend selection follow-up to bootc's composefs-backend install key (https://github.com/cgwalters-forge/tracker/issues/29, weak backing, noul 0.42, a maintainer issue tracker rather than released documentation). This matters because it pins the composefs behavior to the bootc version inside the build environment, not just to the builder version.

The osbuild/image-builder repository states the relationship plainly: the osbuild binary is used to actually build the images (https://github.com/osbuild/image-builder, noul 0.94), so any composefs-native flow ultimately resolves to osbuild stage behavior at build time.

## The blocker chain

The yubiOS refs source research tracks the integration work in osbuild/image-builder issue 2427 (opened 2026-04-29), which lays out the blocker chain: osbuild changes, then images changes, then an image-builder release, then a bootc release, then bootloader and config plumbing (https://github.com/osbuild/image-builder/issues, noul 0.89, the issue tracker index; the issue-level detail comes from the yubiOS refs research dated 2026-07-23). No new evidence on the composefs backend or on issue 2427 was found in the 2026-09-29 refresh of the source research, so the blocker chain stands unresolved as of that date.

## Debugging visibility

When an osbuild-composer build fails or hangs, Red Hat's support solution covers tracing the service to get enough logs to determine the cause (https://access.redhat.com/solutions/6573781, noul 0.89), and the image-builder developer guide documents the local development environment for hacking on the images code, including the package dependencies needed to build and test (https://osbuild.org/docs/developer-guide/projects/image-builder/docs/developer/, noul 0.88). These are the diagnostic surfaces available while the composefs chain is still moving.

## yubiOS framing

This subtopic is the direct upstream mirror of yubiOS BLOCKERS.md entry B-BOOTC-SEAL, which records the need to pin a base with v1.16.4-equivalent split and ukify capabilities: the upstream gap yubiOS waits on is the same one tracked in the composefs blocker chain, not yet resolved as of the 2026-09-29 refresh. Two practical lessons for yubiOS: first, an experimental backend feature that crosses five repos (osbuild, images, image-builder, bootc, bootloader plumbing) has a long lead time, so planning should assume the blocker chain, not wish it away. Second, because the stage runs bootc install inside the image, yubiOS image builds that want composefs-native output must control the bootc version inside the build container, which is another argument for digest-pinned build inputs.
