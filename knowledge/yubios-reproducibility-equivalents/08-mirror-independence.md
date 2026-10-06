# Fetch independence and package mirror state

Scope: how live package mirrors act as a hidden reproducibility input, what vendoring or caching would buy, and the state of the practice for OS image builds.

## The definition forces the question

The reproducible-builds.org project defines its goal as "a set of software development practices that create an independently-verifiable path from source to binary code". [1] (weight 0.91) An independently verifiable path means a second builder, on a different machine, at a different time, can rebuild the artifact and get the same bytes. A stricter phrasing used in practitioner writing: the same byte-for-byte output no matter what computer you run on, what time you run it, and what external services are accessible from the network. [2] (weight 0.48, weak)

The last clause is the one image builds most often fail. An OS image build that installs packages from a live mirror is fetching an input that changes under it: the mirror's current package set, its metadata timestamps, and even a package that has been replaced or removed between build A and build B. Two builds minutes apart can diverge because a mirror pushed an update in between. The academic survey of reproducible builds makes the stakes explicit: trusting code is not the same as trusting its executable counterparts, which are typically built and distributed by third parties. [3] (weight 0.93)

## How image builders interact with mirrors

mkosi is "a fancy wrapper around dnf --installroot, apt, pacman and zypper that generates customized disk images", [4] (weight 0.94) and its man page documents mkosi-install, mkosi-reinstall, mkosi-upgrade and mkosi-remove invoking the corresponding package manager operation used to build the image. [5] (weight 0.91) That means the image inherits the package manager's mirror behavior wholesale: whatever the mirror serves at build time goes into the image.

Caching is built in but is a performance feature, not a reproducibility feature. mkosi stores downloaded package files and temporary build files in the home cache directory or /var/cache/mkosi and /var/tmp. [6] (weight 0.60) A cache makes repeated builds faster and protects against short mirror outages, but it does not pin versions: the first build after a mirror update still fetches the new state.

Jelly's Arch cloud image work shows why full mirror independence is hard even for a well-funded distro: the goal was that anyone could recreate the official Arch cloud image bit by bit, and even with Arch packages already at roughly 90 percent reproducibility, the image build still had to confront the moving package feed. [7] (weight 0.51) [8] (weight 0.43, weak)

## The options, ranked by cost

1. Snapshot pinning: point the package manager at a frozen snapshot of the mirror (a snapshot service, a local mirror frozen at a date, or a repo metadata lock). This is the cheapest strong step and composes with SOURCE_DATE_EPOCH: the epoch date and the snapshot date can be aligned.
2. Vendored cache: vendor the exact package set into the repository or an artifact store (the mkosi.cache pattern), so the build fetches from controlled storage only. This is what reproducible-mkosi-style projects do when the guarantee must be independent of mirror state. yubiOS currently fetches from live Debian mirrors, so vendoring is the open opportunity here if a mirror-independent guarantee is ever needed; it is not a current gap for Debian-only builds. (per the yubiOS refs note, 2026-07-30)
3. Full rebuild from source: pin every package's source and rebuild it deterministically, which is the Nix approach and the strongest guarantee with the highest cost; worth it only if the project must build across multiple host distros reproducibly. (per the yubiOS refs note)

## What the field says about severity

Container-focused practitioners treat mirror nondeterminism as one of the top two sources of layer differences, alongside timestamps. [9] (weight 0.57, weak) Dangerzone's nightly rebuild CI builds Debian images from snapshot repos precisely to keep the mirror input stable while verifying everything else. [10] (weight 0.30, weak) LWN's coverage frames the general problem: container images include the whole installed system, so any instability in how that system was assembled breaks reproducibility. [11] (weight 0.77)

The verdict for an image project: mirror state is a declared input or it is a bug. A project that does not pin it should document that its reproducibility claim is scoped to "same mirror state", and upgrade to snapshot pinning or vendoring when an external-audit-grade guarantee is required.

## Sources

1. https://reproducible-builds.org/ (weight 0.91)
2. https://fossa.com/blog/three-pillars-reproducible-builds.md (weight 0.48, weak)
3. https://arxiv.org/pdf/2104.06020 (weight 0.93)
4. https://mkosi.systemd.io/ (weight 0.94)
5. https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md (weight 0.91)
6. https://wiki.archlinux.org/title/Mkosi (weight 0.60)
7. https://vdwaa.nl/mkosi-reproducible-images.html (weight 0.51)
8. https://vdwaa.nl/mkosi-reproducible-arch-images.html (weight 0.43, weak)
9. https://www.systemshardening.com/articles/cicd/reproducible-builds/ (weight 0.57, weak)
10. https://dangerzone.rocks/news/2026-03-02-repro-build/ (weight 0.30, weak)
11. http://lwn.net/Articles/755747/ (weight 0.77)
