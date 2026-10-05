# 01 - Build identity from the commit epoch

Scope: how a single commit-derived timestamp becomes the canonical build identity for reproducible OS image builds, how SOURCE_DATE_EPOCH standardizes that control, and why the epoch must be derived and validated once rather than set ad hoc per build step.

## The standardized control

SOURCE_DATE_EPOCH is a standardized environment variable that distributions can set centrally and have build tools consume in order to produce reproducible output. In practice it specifies the last modification time of something, usually the source code, measured in seconds since the Unix epoch (weight 0.87, https://reproducible-builds.org/docs/source-date-epoch/). Tools that support it use its value, a number of seconds since January 1 1970 00:00 UTC, instead of the current date and time whenever they would otherwise stamp the build with wall-clock time (weight 0.97, https://reproducible-builds.org/docs/timestamps/).

The specification defines the exact semantics build tools are expected to implement. One can reasonably assume that all source timestamps are before SOURCE_DATE_EPOCH and all builds take place after it, which means tools can efficiently both preserve source-based timestamps and omit build-specific timestamps, by rewriting timestamps more recent than SOURCE_DATE_EPOCH back to the epoch value itself (weight 0.95, https://reproducible-builds.org/specs/source-date-epoch/). This single clamp rule is what turns a raw timestamp into a deterministic quantity: any clock later than the commit collapses onto the commit time.

## Why the identity matters

The Linux kernel documentation states the goal plainly: it is generally desirable that building the same source code with the same set of tools is reproducible, meaning the output is always exactly the same. This makes it possible to verify that the build infrastructure for a binary distribution or embedded system has not been subverted, and it makes it easier to verify that a source or tool change does not make any unintended difference to the output (weight 0.91, https://docs.kernel.org/kbuild/reproducible-builds.html). The value of the epoch as build identity is exactly this property: if the epoch is derived from the commit, then two builds of the same revision carry the same identity by construction, and a diff between their outputs is evidence about the build, not about the clock.

## Deriving the epoch once

A reproducibility contract that treats the epoch as the build identity should derive it in one place. The pattern the yubiOS refs corpus describes is a build library script that derives and validates the pair of selected commit and committer timestamp once, then exports the same values to local builds and to GitHub Actions, so that a caller cannot silently assign a different SOURCE_DATE_EPOCH to the same revision. This per the yubiOS refs doc on reproducible build contracts, 2026-07-22; the mechanism itself is not independently verified in this dig. The externally verifiable principle behind it is the one the specification encodes: the epoch is a property of the source revision, not of the machine running the build.

## What the epoch fixes

When the epoch is pinned, every consumer in the toolchain can align. BuildKit supports consuming the SOURCE_DATE_EPOCH value as a special build arg in the Dockerfile frontend since BuildKit 0.11, and its reproducibility documentation names SOURCE_DATE_EPOCH as the convention for pinning timestamps to a specific value (weight 0.90, https://github.com/moby/buildkit/blob/master/docs/build-repro.md). Docker documents the observable effect for container images: setting the environment variable for a build makes the timestamps in the image index, the image config, and file metadata reflect the specified Unix time (weight 0.94, https://docs.docker.com/build/ci/github-actions/reproducible-builds/).

## Where the epoch stops working

The control is not universal. The Yocto Project documents that when building packages, various timestamps can be controlled by SOURCE_DATE_EPOCH, but that this does not work for building images; image builds need a separate control, REPRODUCIBLE_TIMESTAMP_ROOTFS, and other knobs such as BUILD_REPRODUCIBLE_BINARIES, under which prelink will not use random addresses for libraries (weight 0.84, https://wiki.yoctoproject.org/wiki/Reproducible_Builds). The lesson for an OS image contract is that the epoch alone does not make an image reproducible. It is the seed every other layer consumes: package-level timestamp clamping, image-level rootfs timestamps, and firmware-level fixed timestamps all need to be wired from the same commit-derived value.

## Design consequences

Three consequences follow. First, derive the epoch from the commit, not from the calendar, so the identity survives machine changes and CI reruns. Second, validate it in one place and export it, so no build step can disagree about what the identity is. Third, treat it as the seed for every downstream determinism mechanism, not as a complete mechanism itself; the remaining docs in this corpus cover what each layer does with that seed.
