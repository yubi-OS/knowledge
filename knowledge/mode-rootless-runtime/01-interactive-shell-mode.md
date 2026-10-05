# 01: Interactive shell mode: rootless builds from a developer login shell

Scope: running rootless builds in a developer login shell, where the user owns the daemon socket under $XDG_RUNTIME_DIR, PATH comes from the login environment, and TTY-driven prompts and progress bars are normal.

## The daemon belongs to the user

In interactive mode the container daemon is not a system service, it is a per-user process. Docker's rootless mode runs the daemon and containers as a non-root user to mitigate daemon and runtime vulnerabilities, and it does not require root privileges even during installation as long as prerequisites are met (w=0.97, https://docs.docker.com/engine/security/rootless/). The flip side of the standard install is what rootless removes: with a root-owned daemon, anyone who can talk to its socket effectively has root on the host (w=0.64, https://cubepath.com/docs/docker-advanced/docker-rootless-mode-configuration).

Podman reaches the same place without a daemon at all: it runs containers entirely within a non-root user's namespace, which is why production guides describe it as eliminating the need for a privileged daemon (w=0.76, https://docs.rockylinux.org/10/guides/containers/rootless_podman_advanced/). Red Hat describes the strongest form of this: podman runs as an unprivileged user and the processes inside the container run as non-root too (w=0.73, https://www.redhat.com/en/blog/rootless-containers-podman).

## The runtime dir is the contract

The interactive shell's defining precondition is a correctly owned runtime directory. The moby setup tool makes this explicit: dockerd-rootless-setuptool.sh aborts and instructs the operator to run loginctl enable-linger for the unprivileged user with root privileges, then export XDG_RUNTIME_DIR to the RuntimePath shown by loginctl show-user (w=0.85, https://github.com/moby/moby/blob/master/contrib/dockerd-rootless-setuptool.sh). Podman enforces the same invariant and fails loudly when it is violated; its error path checks that XDG_RUNTIME_DIR points at a directory owned by the current uid (w=0.86, https://github.com/podman-container-tools/podman/issues/13338).

Lingering matters because a login shell is transient. Without enable-linger the user manager dies at logout, and with it every rootless socket and container the shell started. This is the first structural difference from batch and daemon modes: in a CI job the runner user has no linger and no long-lived user manager, and under systemd the unit manager owns the socket instead.

## Setup failures cluster around identity, not images

When interactive rootless setup fails, the causes are rarely container related. A troubleshooting guide summarizes the pattern: failures trace back to subordinate uid/gid ranges, stale user namespaces, or a broken login environment, not missing images (w=0.26, weak, https://www.golinuxcloud.com/rootless-podman/). The podman rootless tutorial puts the administrator-side prerequisites first: before unprivileged users can run podman, the admin must install it and configure a user-mode networking tool for unprivileged network namespaces (w=0.85, https://github.com/podman-container-tools/podman/blob/main/docs/tutorials/rootless_tutorial.md). The Rocky Linux guide lists the same production friction: user namespace mappings, filesystem compatibility, and networking limitations (w=0.76, https://docs.rockylinux.org/10/guides/containers/rootless_podman_advanced/).

For Docker clients the interactive-specific glue is context selection: the rootless CLI context is a Docker CLI feature stored under ~/.docker, and DOCKER_HOST is the variable every program speaking the Docker API reads (w=0.18, weak, https://www.ssdnodes.com/learn/docker-uis-that-support-rootless).

## What the TTY hides

The interactive shell is the mode that hides privilege problems. The yubiOS convention (source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01) is that this hiding is structural: the developer is already in the right groups, subuid ranges are already mapped, and linger is already on, so a privilege misconfiguration never surfaces at the interactive prompt. The same tooling then fails in batch mode where the runner user's environment is thinner (doc 02) and in daemon mode where no shell environment exists at all (doc 03).

PATH resolution also differs here by construction: an interactive login shell gets PATH from the login environment, profile scripts, and user overrides. The yubiOS convention treats that as acceptable only in this mode; batch jobs append needed directories instead of trusting the login PATH, and systemd units declare ExecSearchPath explicitly (doc 03), because both of those modes run without a login profile.

## Exit codes are for humans

In interactive mode a non-zero exit code is read by a person, so sloppy exit semantics get absorbed. The yubiOS convention (source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01) is that this is exactly why the rc=77 SKIP contract cannot be validated here alone: a human forgives an ambiguous exit, a batch pipeline and a Restart=on-failure unit do not. The interactive mode remains necessary for one class of work, FIDO2 enrolment, which needs root and a physical touch at the same time and therefore never runs in batch or daemon mode (doc 07 topic, dropped at outline validation, recorded as a gap in the README).

## Summary

Interactive mode is the easiest mode to work in and the least representative of production. It runs the daemon as the user (w=0.97, https://docs.docker.com/engine/security/rootless/), it depends on an owned XDG_RUNTIME_DIR and lingering (w=0.85, https://github.com/moby/moby/blob/master/contrib/dockerd-rootless-setuptool.sh), its failures are identity and environment failures (w=0.85, https://github.com/podman-container-tools/podman/blob/main/docs/tutorials/rootless_tutorial.md), and it hides both privilege and exit-code problems that the other two modes expose.
