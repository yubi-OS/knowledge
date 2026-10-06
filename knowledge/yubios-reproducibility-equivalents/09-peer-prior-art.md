# Peer projects and prior art for reproducible mkosi image builds

Scope: the landscape of projects building reproducible OS images with mkosi, what each contributes, and what an image project should watch upstream.

## The closest peers

1. Edgeless reproducible-mkosi. The reference implementation of the Nix-pinned approach: the repository "shows how to use Nix to pin mkosi and required tools and build bit-by-bit reproducible OS images". [1] (weight 0.85) Its README is explicit that the work was hard: hours of debugging went into full reproducibility, with package-manager-fed packages remaining the unfinished frontier, and upstream fixes spun out of that effort. [2] (weight 0.89) For an image project, this repo is best used as a reference catalogue of techniques (epoch handling, seeds, removal lists, upstream PR pointers) rather than code to copy.

2. Flashbots images. Flashbots provides "a toolkit for building minimal, hardened Linux images designed for confidential computing environments and MEV (Maximum Extractable Value) applications. Built on mkosi and Nix, it provides reproducible, security-focused Linux distributions". [3] (weight 0.93) [4] (weight 0.86) Their earlier mkosi-poc built reproducible Debian-based images for Intel TDX (Trust Domain Extensions) environments; the successor flashbots-images generalizes the toolkit. [5] (weight 0.15, weak) Flashbots' own engineering forum records the migration decision: for TDX images they had used Yocto, which delivered small images with strong bit-for-bit reproducibility guarantees, and mkosi was explored as the successor. [6] (weight 0.42, weak) That writeup is valuable evidence that mkosi can carry a confidential-computing-grade reproducibility bar.

3. Jelly's Arch research. The vdwaa.nl series documents an independent, single-maintainer path to bit-by-bit reproducible Arch images with mkosi: first post establishes the seed and epoch basics, second post reaches a fully bit-by-bit reproducible filesystem image after upstream fixes landed. [7] (weight 0.51) [8] (weight 0.43, weak) Its value is the traced loop from discovered nondeterminism to merged upstream fix, which is how the whole ecosystem actually improves.

## The upstream to watch

- mkosi itself: the tool is under active development with packages built from latest main published for Debian, Ubuntu, Fedora, and SUSE on OBS. [9] (weight 0.88) Watching releases is the primary channel for inheriting reproducibility fixes. [10] (weight 0.81)
- mkosi PR #1115 proposes a --reproduce flag that would consolidate most of the bespoke epoch, seed, and cleanup plumbing into the tool; until it lands, projects carry their own scripts. (per the yubiOS refs note, 2026-07-30)
- reproducible-builds.org: the distro-neutral foundation documenting SOURCE_DATE_EPOCH, system-image pitfalls, and tooling. [11] (weight 0.91) [12] (weight 0.81)

## What the distros' status pages add

Arch Wiki's reproducible-builds page points contributors at the continuous reproducing environment (Reproducible status page) and classifies outstanding issues, including failures to build from source that need local reproduction. [13] (weight 0.77) For an image project the lesson is organizational: reproducibility is verified continuously or it decays silently. A two-build verifier in CI is the project-local version of a status page.

## Positioning for an image project

Given this landscape, an image project's design choices reduce to three axes:

1. Toolchain definition: Nix flake (Edgeless, Flashbots) versus fork plus SHA pin with a version floor. Both are proven; Nix costs a second package ecosystem, the fork pin costs fork maintenance. (per the yubiOS refs note)
2. Verification surface: single image diff (minimum), multi-artifact verification covering image, installer, and firmware (stronger), plus a signed-envelope exclusion boundary. (per the yubiOS refs note)
3. Upstream posture: consume fixes via version floors, file upstream issues for local workarounds, and track consolidation efforts like PR #1115. [2] (weight 0.89)

None of the peers publishes an attestation-plus-reproducibility pipeline yet (see the attestation doc in this corpus), which leaves that as open differentiation space.

## Sources

1. https://github.com/edgelesssys/reproducible-mkosi (weight 0.85)
2. https://github.com/edgelesssys/reproducible-mkosi (weight 0.89)
3. https://github.com/flashbots/flashbots-images/tree/main (weight 0.93)
4. https://github.com/flashbots/flashbots-images (weight 0.86)
5. https://deepwiki.com/flashbots/mkosi-poc (weight 0.15, weak)
6. https://collective.flashbots.net/t/beyond-yocto-exploring-mkosi-for-tdx-images/4739 (weight 0.42, weak)
7. https://vdwaa.nl/mkosi-reproducible-images.html (weight 0.51)
8. https://vdwaa.nl/mkosi-reproducible-arch-images.html (weight 0.43, weak)
9. https://github.com/systemd/mkosi (weight 0.88)
10. https://github.com/systemd/mkosi/releases (weight 0.81)
11. https://reproducible-builds.org/ (weight 0.91)
12. https://reproducible-builds.org/docs/system-images/ (weight 0.81)
13. https://wiki.archlinux.org/title/Reproducible_Builds (weight 0.77)
