# 02. Rootless podman setup

Scope: the three-step machine setup for rootless podman: subuid/subgid allocation, fuse-overlayfs storage driver configuration, and rootless verification.

## Step 1: enable user namespaces

The source doc's first command allocates subordinate UID and GID ranges to the user:

```
sudo usermod --add-subuids 100000-165535 --add-subgids 100000-165535 $USER
```

Verification is `grep $USER /etc/subuid /etc/subgid` (source doc, yubi-OS/yubiOS skills/rootless-container-builds/SKILL.md). These two files are the kernel-side contract for the user-namespace mapping described in doc 01.

The upstream podman rootless tutorial matches this division of labor: the majority of the work necessary to run podman in a rootless environment is on the shoulders of the machine's administrator; once the administrator has completed the machine setup and the user configurations in /etc/subuid and /etc/subgid, the user can start using any podman command (https://github.com/podman-container-tools/podman/blob/main/docs/tutorials/rootless_tutorial.md, jev weight 0.89). In other words, subuid allocation is a one-time administrative step, and after it every podman command is usable unprivileged.

Podman itself is the POD MANager, a tool for managing containers, images, volumes, and pods, running containers on Linux with Mac and Windows support through a managed virtual machine (https://github.com/podman-container-tools/podman, jev weight 0.76; https://podman.io/docs/installation, jev weight 0.92). On the yubiOS build hosts the Linux path is the one that matters.

## Step 2: configure fuse-overlayfs storage

Rootless podman cannot use the kernel overlayfs mount path the way a root daemon can, so the storage driver needs an explicit mount program. The source doc writes `~/.config/containers/storage.conf` with:

```
[storage]
driver = "overlay"

[storage.options.overlay]
mount_program = "/usr/bin/fuse-overlayfs"
```

(source doc). The per-user location is not incidental: the Eclipse Che documentation confirms that the storage driver for Podman and Buildah is defined in the user's `~/.config/containers/storage.conf` file (https://www.eclipse.org/che/docs/stable/end-user-guide/enabling-overlay-with-a-configmap/, jev weight 0.74). A root-owned /etc/containers/storage.conf would configure the wrong scope for a rootless build host.

Weak-backing note: several search hits on this step scored below 0.5 under jev weighting, including golinuxcloud.com's rootless podman guide at 0.22 and two oneuptime.com posts on fuse-overlayfs at 0.11 and 0.09. This doc does not carry claims from them; the storage.conf mechanism is grounded in the source doc and the Eclipse Che reference.

## Step 3: verify

The source doc's test sequence is two commands:

```
podman run --rm alpine echo "rootless works"
podman info | grep rootless
```

(source doc). The first proves the runtime can pull and execute a container end to end without privilege; the second proves the runtime itself classifies the session as rootless. Both must pass before the host is used as a build machine, because doc 03's hardened build flags assume the user-namespace mapping is already active.

## Failure modes when a step is skipped

Each skipped step fails differently, and knowing the failure shape is part of the setup. If step 1 is missing, podman cannot create a user namespace at all and every command fails before touching container storage; the fix is the usermod command, not a podman flag. If step 1 is present but the range is too small for parallel builds, image layers can collide on the same mapped UIDs across concurrent builds. If step 2 is missing, podman may fall back to a storage driver configuration that fails under an unprivileged UID or silently degrades build performance, which is why the source doc makes the explicit mount_program line part of setup rather than an optional tune. If only step 3 is skipped, the host can appear working in manual use and then fail in CI where the failure is harder to attribute (source doc, yubi-OS/yubiOS skills/rootless-container-builds/SKILL.md).

## Ordering matters

The three steps are a chain, not a menu. Without step 1, podman cannot create the user namespace and every command fails; without step 2, builds fall back to a storage driver that may fail or silently degrade under an unprivileged UID; without step 3, a half-configured host can pass casual use and then fail in CI. The podman installation documentation is the reference for getting the binaries themselves in place across platforms (https://podman.io/docs/installation, jev weight 0.92).

## Position relative to the yubiOS primary path

ADR-014 makes Docker Buildx the canonical yubiOS build tool, and Build Policies are Buildx-only (source doc). Rootless podman is the alternate build path this setup enables: it is what the GitHub Actions workflow in doc 09 actually uses for the build-and-sign job, so this setup is not optional for the CI path even though Buildx is the primary local tool.
