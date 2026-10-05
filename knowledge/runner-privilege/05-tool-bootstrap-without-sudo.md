# Tool bootstrap without sudo on a self-hosted runner

Scope: provisioning build toolchains on a runner host where the CI user has no passwordless sudo, using user-local toolchain installs and unprivileged package systems, and why the constraint is actually a privilege boundary set at provision time.

## Why the constraint exists

A self-hosted runner that executes arbitrary workflow code should not give that code a path to root. If the CI user has passwordless sudo, every job is one package-manager command away from full host control. The counter-pattern is visible in ordinary build documentation: kernel module build guides instruct installing the whole build toolchain with sudo apt-get (https://sysprog21.github.io/lkmpg/, w 0.69). That works on a workstation and is exactly what a runner must not do at job time. The design consequence is that anything the jobs need must already exist, installed without privilege, or installed once by an administrator who does hold sudo.

The boundary is set at provision time, not per job: the set of tools available to a sudo-less runner user is fixed when the host is prepared. Jobs can compose and download, but not install system-wide.

## User-local toolchain installs

Several mainstream toolchains are designed to install entirely under the invoking user's account:

1. rustup. Rust is installed and managed by the rustup tool, which provisions per user and updates in place with rustup update (https://rust-lang.org/tools/install/, w 0.79). The installation book documents channel- and component-level control for reproducible installs (https://rust-lang.github.io/rustup/installation/index.html, w 0.89), and the tool itself is described as an installer that manages multiple Rust toolchains consistently across all platforms Rust supports (https://rustup.rs/, w 0.90). For environments where even the rustup bootstrap script is undesirable, Rust Forge documents alternative installation methods, including downloading standalone archives (https://forge.rust-lang.org/infra/other-installation-methods.html, w 0.61).

2. CMake-driven cross toolchains. CMake consumes a toolchain file that specifies compilers, paths, and install prefix, driving the whole build from user-writable locations (https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html, w 0.89). A cross toolchain can therefore be unpacked under the runner user's home and referenced purely through the toolchain file. The Android NDK historically shipped a make_standalone_toolchain.py script for exactly this pattern: a customized toolchain installation from the command line, no package manager involved (https://android.googlesource.com/platform/ndk/+/refs/heads/ndk-release-r18/docs/user/standalone_toolchain.md, w 0.90).

## Unprivileged package systems

Nix supports a single-user installation in which the store is owned by the invoking user (https://nixos.org/download/, w 0.88). The store can live on any location writable by the user (https://bnikolic.co.uk/blog/nix/2024/01/16/nix-without-root.html, w 0.89), giving a sudo-less runner user a full reproducible package manager without root. Where even the default store path is unavailable, nix-user-chroot runs and installs nix as a user without root permissions, relying on unprivileged user namespaces, available since Linux 3.8 (https://github.com/nix-community/nix-user-chroot, w 0.85). The tradeoff is documented: the standard installer script requires root access on Linux or macOS to create the /nix folder and, in multi-user mode, a daemon (https://zameermanji.com/blog/2023/3/26/using-nix-without-root/, w 0.52). Nix's declarative build and configuration model is what makes per-user reproducible environments practical on shared hosts (https://nixos.org/, w 0.94).

## The container dead end (and why)

A natural suggestion is to run the job in a container with the tools baked in. On GitHub Actions this hits a platform limitation: the Actions platform itself does not support rootless containers for workflow-specified images, a fact documented in the act compatibility tracker (https://github.com/nektos/act/issues/1184, w 0.72). A container job on a self-hosted runner therefore tends to involve root or a rootful daemon, which reintroduces the privilege the sudo-less design removed. Container-based isolation of runner jobs needs infrastructure-level support (rootless podman on the host, VM-per-job) rather than the stock Actions container job.

## Provision-time discipline

The practical pattern for a sudo-less runner host:

1. Install everything the build matrix needs at provision time, either with administrator sudo in a controlled session or with user-local installers such as rustup and single-user nix (w 0.79, w 0.88).
2. Pin toolchain versions declaratively (rustup toolchain files, CMake toolchain files) so jobs cannot drift the environment (w 0.89).
3. Treat a job's request to download a new tool at runtime as a build-input decision, and audit what the job can write: the runner user's home is the whole writable world.

## Summary

Tool bootstrap without sudo is achievable with user-local installers (rustup, w 0.90), prefix-driven builds (CMake toolchain files and standalone toolchain scripts, w 0.89, w 0.90), and unprivileged package systems (single-user nix, nix-user-chroot via user namespaces, w 0.88, w 0.85). The stock container path does not preserve the property because Actions does not support rootless workflow containers (w 0.72). The constraint is deliberate: it fixes the privilege boundary at provision time so no job can widen it.
