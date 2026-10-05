# 08 - Package input pinning and repository snapshots

Scope: the gap between a passing two-build gate and true long-term rebuildability, which comes from package inputs resolved from live repositories, and the snapshot and rebuild-infrastructure practices that close it.

## Why package inputs decide the claim

A build cannot be reproducible if the source varies depending on factors that are hard or impossible to control, such as the ordering of files on a filesystem or the current time; what counts as a controllable input is defined by what is declared part of the build environment (weight 0.95, https://reproducible-builds.org/docs/deterministic-build-systems/). Packages pulled at build time are inputs. If they resolve from a live repository, their identity changes whenever the repository changes, and the build's output follows.

The yubiOS refs doc states this as an explicit boundary: Fedora and Debian packages are still resolved from live repositories, so the two-build gate proves equality against the package state observed during that run, not rebuildability months later; immutable repository snapshots and an exact package/toolchain closure remain required (per the yubiOS refs doc on reproducible build contracts, 2026-07-22; not independently verified in this dig).

## The snapshot infrastructure that exists

Debian maintains snapshot.debian.org, the snapshot archive, a wayback machine that allows access to old packages based on dates and version numbers. It consists of all past and current packages the Debian archive provides, and being able to install packages from any given date is valuable for tracking down regressions (weight 0.91, https://snapshot.debian.org/). A build that pins its repository access to a snapshot timestamp makes its package inputs immutable after the fact.

## The rebuild infrastructure that proves it

reproduce.debian.net attempts to bit-for-bit identically rebuild each Debian binary package found in the distribution archive, using the .buildinfo file produced when the buildd originally built the package. For each distributed package, rebuilderd calls debrebuild, which calls debootsnap, mmdebstrap, and finally sbuild to build that package within a user namespace (weight 0.77, https://reproduce.debian.net/). The Reproducible Builds project reported in January 2025 that reproduce.debian.net is an instance of rebuilderd operated by the project, powering a server designed to monitor the official package repositories of Linux distributions and attempt to reproduce the observed results (weight 0.95, https://reproducible-builds.org/reports/2025-01/). The chain matters for OS image builders: it demonstrates that with a recorded buildinfo, a snapshot, and a containerized rebuild, package-level bit equality is verifiable in practice.

## RPM: deterministic clocks and tooling

Fedora's reproducible builds effort states the goal directly: reproducible builds for rpms in Fedora and later the rest of the ecosystem, so users can independently verify that rpms have not been tampered with, either maliciously or by unreliable hardware, by doing an independent rebuild and confirming identical binaries when building with the same versions of the tools (weight 0.95, https://docs.fedoraproject.org/en-US/reproducible-builds/). The change that shipped the tooling is documented on the Fedora wiki as Changes/ReproduciblePackageBuilds, which references the add-determinism tool and macros.build-reproducibility, with the release note that Fedora package builds are now more deterministic, bringing the distribution closer to fully reproducible builds for all of its packages (weight 0.74, https://fedoraproject.org/wiki/Changes/ReproduciblePackageBuilds).

The rpm project itself remains active on this front; its home page tracks current releases and the project's direction (weight 0.83, https://rpm.org/). The yubiOS source doc cites RPM 4.18 deterministic transaction-clock support as a primary source; that specific capability is not independently confirmed in this dig, so treat it as unverified here.

## Timestamp discipline at the package boundary

The timestamp tooling layer underpins package-level determinism: tools that support SOURCE_DATE_EPOCH use its value instead of the current date and time (weight 0.97, https://reproducible-builds.org/docs/timestamps/), and the broader documentation set treats volatile inputs, stable input ordering, and stable output ordering as separate determinism problems to be solved (weight 0.90, https://rb.mapreri.org/site/docs/). For an OS image build consuming packages, the practical sequence is: pin the snapshot, feed the epoch from the commit, and then the package-level tools can make the installed tree's timestamps deterministic.

## What closing the gap buys

With immutable snapshots and an exact package and toolchain closure recorded, a two-build gate stops proving only that one run was internally consistent and starts proving that the build is rebuildable against a fixed input state. That is the difference the yubiOS boundary names, and it is the same difference the Debian and Fedora infrastructure is built to demonstrate: independent rebuild, identical result, on inputs that did not move.
