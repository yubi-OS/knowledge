# Build-state nondeterminism in container and image builds

Scope: the mutable residue a build leaves in its output (machine-id, random-seed, ldconfig aux-cache, package manager caches, hash randomization) and the discipline for stripping it.

## The randomness rule

The reproducible-builds.org randomness guide states the general rule: if random-like input is required, use a predetermined value to seed the pseudo-random generator, and that value can come from a file, a changelog, or the version control system. [1] (weight 0.92) The inverse rule matters just as much for OS images: anything that is generated with fresh randomness at build time but does not need to exist until first boot must be removed from the image.

## The canonical offenders

1. /etc/machine-id and /var/lib/systemd/random-seed. yubiOS strips both in its Containerfile, with an inline comment recording the incident that motivated it: run-30197303995, where two fully isolated builds diverged solely because systemctl preset-all inside the container build invokes systemd-machine-id-setup, which writes a random /etc/machine-id and a fresh random /var/lib/systemd/random-seed on every build. bootc regenerates both files on first boot, so stripping them costs nothing at runtime. (per the yubiOS refs note, 2026-07-30)

2. ldconfig aux-cache. /var/cache/ldconfig/aux-cache is a build artifact of ldconfig whose content depends on the build machine's library layout and timing. Gentoo's reproducible-build work documents removing it from stage builds; their notes show the stage tarball and binary packages could not be reproduced until caches like aux-cache were handled. [2] (weight 0.39, weak) [3] (weight 0.24, weak) yubiOS strips it in mkosi.finalize. (per the yubiOS refs note) Jelly's Arch work records the ecosystem fix: mkosi stopped creating a random-seed file and now removes aux-cache from the initrd by default. [4] (weight 0.43, weak)

3. Package manager state. dnf and friends write transaction history and download caches into the root filesystem. yubiOS disables recording with dnf options --setopt=history_record=false and --setopt=install_weak_deps=False during container-layer package installs, avoiding transaction_history.sqlite and weak-dependency drift. (per the yubiOS refs note) General container reproducibility writeups confirm the problem class: timestamps embedded in image layers and nondeterministic package manager behavior are the two dominant sources of layer differences. [5] (weight 0.57, weak) [6] (weight 0.35, weak)

4. Hash randomization. Python's PYTHONHASHSEED unset means dict and set iteration order varies between runs, and any code generation or bytecode compilation that touches iteration order produces different bytes. yubiOS sets PYTHONHASHSEED=0 for pip and compileall steps in the Containerfile. (per the yubiOS refs note)

## The evidence loop: nightly rebuilds

Stripping is necessary but not sufficient; the residue creeps back with every new build step. Practitioners who take this seriously automate detection. Dangerzone's repro-build setup runs a CI job that builds Debian images from snapshot repos nightly and immediately rebuilds them again to confirm reproducibility, reusing shared helper scripts for timestamp rewriting and nondeterminism removal. [7] (weight 0.30, weak) LWN's coverage of reproducible container images makes the same point from the theory side: partial measures still do not yield reproducible builds because container images include the whole installed system, not just compiled artifacts. [8] (weight 0.77)

The yubiOS incident is the concrete case: the build ran preset-all, systemd's postinstall hook machine-id-setup wrote fresh randomness, and only the two-build comparison exposed it. (per the yubiOS refs note) Without a verifier, that divergence ships silently.

## Checklist for an image project

1. Inventory every file the image toolchain writes with build-time randomness: machine-id, random-seed, aux-cache, package transaction DBs, UUID-derived metadata. [1] (weight 0.92)
2. Strip at the earliest layer that can (container build) and again in finalize scripts (image build), since the same file can be written by both stages. (per the yubiOS refs note)
3. Disable package manager state recording at install time rather than deleting afterward, so the state never enters a layer. (per the yubiOS refs note)
4. Pin hash seeds for any interpreter that runs at build time (PYTHONHASHSEED=0). (per the yubiOS refs note)
5. Document each strip with the incident or reasoning that motivated it, so a future refactor does not delete the strip as dead code. (per the yubiOS refs note, run-30197303995)

## Sources

1. https://reproducible-builds.org/docs/randomness/ (weight 0.92)
2. https://wiki.gentoo.org/wiki/User:OstCollector/Reproducible_Build (weight 0.39, weak)
3. https://gist.github.com/OstCollector/6397cb05ad47e3602bf2adacf571c540 (weight 0.24, weak)
4. https://vdwaa.nl/mkosi-reproducible-arch-images.html (weight 0.43, weak)
5. https://www.systemshardening.com/articles/cicd/reproducible-builds/ (weight 0.57, weak)
6. https://www.systemshardening.com/articles/cicd/reproducible-builds/ (weight 0.35, weak)
7. https://dangerzone.rocks/news/2026-03-02-repro-build/ (weight 0.30, weak)
8. http://lwn.net/Articles/755747/ (weight 0.77)
