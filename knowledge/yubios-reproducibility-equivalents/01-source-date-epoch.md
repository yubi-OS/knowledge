# SOURCE_DATE_EPOCH for reproducible OS image builds

Scope: what SOURCE_DATE_EPOCH is, how build tools consume it, the choice between a fixed zero epoch and a commit-derived epoch, and how an OS image project can enforce it without drift.

## The standard

SOURCE_DATE_EPOCH is a standardized environment variable that distributions set centrally and build tools consume to produce reproducible output. In practice it specifies the last modification of something, usually the source. [1] (weight 0.93)

The specification defines the contract precisely: one can reasonably assume that all source timestamps are before SOURCE_DATE_EPOCH and all builds take place after it. This lets build tools efficiently preserve source-based timestamps and omit build-specific ones by rewriting any timestamp more recent than the epoch down to it. [2] (weight 0.95)

The kernel's kbuild documentation states the underlying goal: it is generally desirable that building the same source code with the same set of tools is reproducible, so the output is always exactly the same, which makes it possible to verify that the build infrastructure for a binary distribution is trustworthy. [3] (weight 0.92)

## Tool support in image builds

Docker documents SOURCE_DATE_EPOCH as a standardized environment variable for instructing build tools to produce reproducible output: setting it for a build makes the timestamps in the image index, config, and file metadata reflect the specified Unix time. [4] (weight 0.92)

Practitioners report the same effect at image scale: using the epoch is "only part of the solution" because the maintainer must still avoid nondeterministic inputs, but the built image and all content in its layers carry the same "created" timestamp. [5] (weight 0.83) A secondary practitioner writeup, weaker backing, describes SOURCE_DATE_EPOCH as eliminating the biggest source of noise behind image digest nondeterminism. [6] (weight 0.59, weak)

Yocto adds a nuance worth knowing for any image project: SOURCE_DATE_EPOCH controls timestamps when building packages, but does not by itself cover building the final image root filesystem; Yocto exposes a separate REPRODUCIBLE_TIMESTAMP_ROOTFS knob for that stage. [7] (weight 0.81) mkosi has an adjacent idea open in issue 1218: touching /usr/lib/clock-epoch late during image building, since PID1 uses that file's mtime to bump the clock at boot on systems without a working clock. [8] (weight 0.68)

## Choosing the epoch value

Two designs exist in the wild:

1. Fixed epoch, usually 0. Edgeless's reproducible-mkosi sets Environment=SOURCE_DATE_EPOCH=0 in the [Content] section of its root mkosi.conf. [9] (weight 0.83) It is simple, but any tool that clamps timestamps to "no later than the epoch" collapses all file dates to 1970, and the epoch carries no information about which revision was built.

2. Derived epoch, tied to the revision. yubiOS derives SOURCE_DATE_EPOCH from the built commit's committer timestamp (git show -s --format=%ct on the pinned revision) inside scripts/lib/reproducible-build.sh, and refuses any caller-supplied value that does not match the derived one. The value is exported to GITHUB_ENV, propagated to the Containerfile as ARG SOURCE_DATE_EPOCH, surfaced to yubiOS-bake.hcl as an HCL variable, and written to OCI image labels via SOURCE_DATE_ISO8601. (per the yubiOS refs note, 2026-07-30)

The derived design is strictly more informative: every tool in the chain gets a stable reference tied to the revision being built, and the mismatch guard prevents accidental epoch drift in CI where two jobs might pass different epochs. The kernel documentation's framing [3] supports this: verification requires "the same source code with the same set of tools", and a per-revision epoch encodes exactly that coupling.

## Enforcement surface

A common failure mode is an epoch that is set for the mkosi build but not for the container-layer build or the CI step, so different artifacts in the same release carry different timestamps. Docker's guidance is to set the variable for the whole build so index, config, and file metadata agree. [4] (weight 0.92) Iron Bank's guidance similarly requires the image maintainer to hunt the remaining nondeterminism after the epoch is set. [5] (weight 0.83)

yubiOS handles this by making the script the single derivation point and wiring the value through three layers: environment (GITHUB_ENV), container build (Containerfile ARG), and image metadata (OCI labels). A known polish item, not a correctness gap: a plain mkosi build invocation that does not source scripts/lib/reproducible-build.sh would not get the derived epoch; adding Environment=SOURCE_DATE_EPOCH=0 to the root mkosi.conf [Content] section would cover that path as a fallback. (per the yubiOS refs note)

## Verdict for an OS image project

SOURCE_DATE_EPOCH is the anchor every other reproducibility mechanism hangs on. The standard is stable, tool support reaches the image metadata layer in Docker and beyond, and the epoch value should be derived from the revision rather than hardcoded to 0, with an explicit guard against caller-supplied mismatches.

## Sources

1. https://reproducible-builds.org/docs/source-date-epoch/ (weight 0.93)
2. https://reproducible-builds.org/specs/source-date-epoch/ (weight 0.95)
3. https://docs.kernel.org/kbuild/reproducible-builds.html (weight 0.92)
4. https://docs.docker.com/build/ci/github-actions/reproducible-builds/ (weight 0.92)
5. https://docs-ironbank.dso.mil/hardening/reproducible-builds/ (weight 0.83)
6. https://www.mironsoft.de/en/blog/reproducible-docker-builds-with-source-date-epoch (weight 0.59, weak)
7. https://wiki.yoctoproject.org/wiki/Reproducible_Builds (weight 0.81)
8. https://github.com/systemd/mkosi/issues/1218 (weight 0.68)
9. https://github.com/edgelesssys/reproducible-mkosi (weight 0.83)
