# Inheriting upstream reproducibility fixes through version floors

Scope: how the upstream fixes ecosystem (mkosi and systemd PRs) distributes reproducibility work, and how a consuming project inherits it without maintaining local patches.

## The fix list from reproducible-mkosi

Edgeless's reproducible-mkosi documents the upstream work their reproducibility effort required: "hours of debugging went into making this fully reproducible, and there are still things left to do, especially regarding the handling of packages pulled in by the package manager of the target distro. In the following, we list some work we did upstream." [1] (weight 0.89) The fix list, as catalogued in the yubiOS refs note (2026-07-30), spans the whole build stack:

- mkosi#1834: SOURCE_DATE_EPOCH propagation into the image build
- mkosi#1837: repart seed handling for deterministic partition UUIDs
- mkosi#1982: PAX headers in archives
- mkosi#2163: cpio ordering for the initrd
- systemd#29000: mcopy honoring SOURCE_DATE_EPOCH for FAT filesystems
- systemd#29606: btrfs hardlink leak
- nixpkgs#252282: dosfstools determinism
- authselect#350

The pattern is instructive: none of these fixes lives in the consuming project's config. They are single-line behavior changes in the tools themselves, merged upstream, and the consuming project's only lever is which tool version it runs.

## Version floors as the inheritance mechanism

The inheritance mechanism is a version floor. mkosi's own documentation instructs users to ensure they run at least a specified minimum version and to install newer from upstream repos if the distro packages lag. [2] (weight 0.91) yubiOS enforces MinimumVersion=26~devel in its mkosi config, which guarantees that every build inherits all the upstream reproducibility fixes merged into mkosi v26 and later, with no local configuration and no local patches. (per the yubiOS refs note) A version floor is cheap to maintain and converts "we patched around bug X" into "we require a mkosi that contains the fix for X".

The floor must be paired with an actual pin to be deterministic (two runners passing the same floor can still run different minor versions, see the toolchain-pinning doc in this corpus), but the floor alone is what turns upstream fixes into a guarantee.

## What upstream fixes look like in practice

Jelly's Arch image investigation is a concrete trace of the loop. Replacing mcopy with a shell script exposed that passed directories (boot/efi) carried recent timestamps instead of SOURCE_DATE_EPOCH=0, and mkosi's maintainer wrote a pull request to keep directory timestamps intact. [3] (weight 0.77) That is the shape of the process: a reproducibility attempt finds a nondeterminism, the fix lands upstream, and every downstream consumer of the next release inherits it. mkosi ships releases continuously from main, with packages built from latest main and published for Debian, Ubuntu, Fedora, and SUSE on OBS. [4] (weight 0.81) [5] (weight 0.89)

This is also why the fix list above spans multiple projects: the reproducibility bugs live where the tools live. A filesystem-image project that wants reproducibility inherits from mkosi (image assembly), systemd (FAT handling, machine-id and boot tooling), the package manager ecosystem, and dosfstools. Pinning one tool and ignoring the others buys little.

## The consolidation path

Upstream is also consolidating the bespoke plumbing. mkosi PR #1115 proposes a --reproduce flag that would fold most of the manual epoch, seed, and cleanup work into the tool itself; per the yubiOS refs note, when it lands it would consolidate most of the bespoke reproducibility plumbing. Until then, the floor-plus-script design is the state of the art.

For the consuming project, the maintenance stance is:

1. Require a version floor high enough to include the fixes the project's outputs need. [2] (weight 0.91)
2. Watch upstream release notes for new reproducibility fixes and bump the floor deliberately rather than silently. [4] (weight 0.81)
3. Keep local workarounds only for bugs with no upstream fix, and file or point to the upstream PR for each one. [3] (weight 0.77)
4. Expect consolidation: a future native reproducibility mode may obsolete the local plumbing, so keep the local scripts thin. (per the yubiOS refs note, PR #1115)

## Sources

1. https://github.com/edgelesssys/reproducible-mkosi (weight 0.89)
2. https://github.com/systemd/mkosi (weight 0.91)
3. https://vdwaa.nl/mkosi-reproducible-arch-images.html (weight 0.77)
4. https://github.com/systemd/mkosi/releases (weight 0.81)
5. https://github.com/systemd/mkosi (weight 0.89)
