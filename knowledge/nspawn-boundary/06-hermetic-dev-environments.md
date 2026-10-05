# 06. Hermetic dev environments on nspawn

Scope: using systemd-nspawn as a reproducible, isolated development and test environment, what hermeticity requires, and real tooling that builds on nspawn for this purpose.

## What hermeticity requires

The build-systems literature gives the requirement shape. Bazel's documentation defines hermeticity through two aspects: isolation, where hermetic build systems treat tools as source code, and self-containment, where the build depends on specific versions of build tools and dependencies and does not rely on services external to the build environment ([bazel.build: Hermeticity](https://bazel.build/basics/hermeticity), jev 0.71). Mapped onto an OS-level container, hermeticity means the dev environment's /usr comes from a pinned, reproducible artifact rather than from whatever the host happens to have installed.

## nspawn as the environment carrier

systemd-nspawn can be invoked on any directory tree containing an operating system tree ([freedesktop.org systemd-nspawn(1)](https://www.freedesktop.org/software/systemd/man/latest/systemd-nspawn.html), jev 0.96), and, per doc 02, on a full raw disk image produced by mkosi ([0pointer.net: mkosi](https://0pointer.net/blog/mkosi-a-tool-for-generating-os-images.html), jev 0.70). That combination is the mechanism for a hermetic dev environment: the environment is the pinned image, nspawn is the runner, and the host contributes nothing to the container's /usr. The ArchWiki's framing of nspawn as a fully virtualized filesystem, process tree, IPC subsystems, and host/domain identity inside a lightweight namespace container makes the isolation complete for workflow purposes without paying for a second kernel ([ArchWiki: Systemd-nspawn](https://wiki.archlinux.org/title/Systemd-nspawn), jev 0.87).

## Real tooling built on this pattern

The Debian packaging world already uses nspawn exactly this way. Debspawn is a tool to build Debian packages in an isolated environment; unlike similar tools such as sbuild or pbuilder, debspawn uses systemd-nspawn instead of plain chroots to manage the isolated environment, which allows it to isolate builds from the host system much more via containers ([github.com/lkhq/debspawn](https://github.com/lkhq/debspawn), jev 0.68). This is direct evidence that the nspawn-as-build-environment pattern is production-shaped, not experimental.

Community tooling points the same direction. PaperBox is a systemd-nspawn configuration whose goal is a secondary, isolated userspace environment inside a Linux system for development, testing, or installing software without affecting the host, working out of the box on most distributions without Docker or Podman ([github.com/CANVEXTER/PaperBox](https://github.com/CANVEXTER/PaperBox), jev 0.62). Practitioner writeups reach for nspawn for the same reason: isolated development environments where each developer has a separate environment with all necessary dependencies, without affecting the main operating system ([mwalkowski.com: Introduction to systemd-nspawn Containers](https://mwalkowski.com/post/introduction-to-systemd-nspawn-containers-chroot-on-steroids/), jev 0.18, low weight, usage datapoint).

## The credentials and settings layer

A hermetic dev environment still needs controlled inputs. The supported paths are the documented ones: credentials pass from host to container payload via --set-credential= and --load-credential= ([systemd.io: Credentials](https://systemd.io/CREDENTIALS/), jev 0.81), and runtime configuration travels with the image as a sidecar .nspawn settings file that overrides the service defaults ([freedesktop.org systemd-nspawn(1)](https://www.freedesktop.org/software/systemd/man/latest/systemd-nspawn.html), jev 0.94). Both keep the environment's inputs explicit rather than ambient, which is the property hermeticity cares about.

## The yubiOS framing: the environment is the signed image

In yubiOS, the dev-environment boundary is defined as systemd-nspawn for a hermetic dev environment off the signed mkosi image ([yubiOS refs record: adjacent-problems-nspawn-boundary-2026-09-17.md](https://github.com/yubi-OS/yubiOS), jev source-doc). The record's key observation is about testability, not capability: this use is the one of the four isolation mechanisms with no CI leg at all. The image build is exercised by every container build leg, VM-level testing by the bcvk ephemeral-VM leg, and service confinement indirectly by the image build policy, but the dev-environment use, the middle boundary, runs nowhere ([yubiOS refs record: adjacent-problems-nspawn-boundary-2026-09-17.md](https://github.com/yubi-OS/yubiOS), jev source-doc).

The record also names the payoff that would justify the leg: a nspawn dev-environment leg would exercise the same signed image through a different boundary than the two tested legs, which is exactly the substitution relation the family record names between podman and nspawn, and the cost is known: one more VM-boot job on the self-hosted ARM64 KVM runner, gated the same way as the existing sysext legs ([yubiOS refs record: adjacent-problems-nspawn-boundary-2026-09-17.md](https://github.com/yubi-OS/yubiOS), jev source-doc).

## Sub-claims recap

1. Hermeticity means tools and dependencies are pinned and the build does not rely on services external to the environment (weight 0.71).
2. nspawn carries a full OS tree or raw image as the environment root with complete namespace isolation (weights 0.96, 0.70, 0.87).
3. Debian package building already runs on nspawn in production-shaped tooling (debspawn, weight 0.68).
4. Credentials and .nspawn settings are the documented input channels that keep the environment explicit (weights 0.81, 0.94).
5. In yubiOS, this dev-environment use is the named, costed, and unexercised boundary (source-doc record).
