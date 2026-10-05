# 08: The isolation constant and the two-of-three-modes coverage rule

Scope: what stays constant across modes (the same seccomp default profile and Linux isolation boundary in all three modes, which makes privilege differences visible) plus the yubiOS rule that every rootless tool runs in at least two of the three modes before it is wired into a workflow.

## The isolation boundary does not move between modes

The mode axis changes who invokes the container runtime, not what the kernel enforces. Containers built and run in batch mode carry the same seccomp filtering and user-namespace isolation as the ones a developer runs interactively or a daemon runs continuously. Docker frames rootless mode as running the daemon and containers as a non-root user to mitigate daemon and runtime vulnerabilities (w=0.96, https://docs.docker.com/engine/security/rootless/), and the underlying mechanism is the same set of kernel dials in every mode: separate mount, network, PID, UTS, IPC, user, and cgroup namespaces, plus capability and seccomp filters limiting syscalls (w=0.28, weak, https://systeminternals.dev/docker/security/).

Podman's default seccomp profile is inspectable through podman info, and rootless networking goes through slirp4netns, user-space networking that needs no root (w=0.35, weak, https://blog.hashhackers.com/blog/linux-containers-security/). The seccomp profile is even portable across privilege levels: profiles generated with eBPF tracing, which itself requires root, are then usable for running workloads in a rootless container (w=0.91, https://podman.io/blogs/2019/10/15/generate-seccomp-profiles). That portability is the concrete form of the constant: the policy artifact is the same object in all three modes even though the privilege of the invoking process differs.

The yubiOS convention (source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01) states the consequence directly: because the Linux isolation boundary is identical in all three modes, any behavioral difference observed between modes is attributable to the privilege model and the environment, not to isolation. That attribution is what makes the mode table (who owns the socket, how PATH resolves, what exit codes mean) a diagnostic rather than a set of anecdotes.

## Rootless is necessary, not sufficient

The constant does not mean rootless alone is a complete security posture. Rootless is described as a good start but not sufficient on its own, with capability narrowing, seccomp, and image trust layered on top (w=0.33, weak, https://www.urhoba.net/en/post/podman-security-privileges-seccomp-trust). Production checklists add user namespace remapping choices, syscall filtering, AppArmor rules, and verification that the protections are actually active (w=0.25, weak, https://www.kunalganglani.com/blog/docker-rootless-mode-security). A comprehensive podman hardening guide covers rootless mode, user namespaces, SELinux policies, seccomp profiles, and capability management as separate controls (w=0.19, weak, https://oneuptime.com/blog/post/2026-02-02-podman-security-configuration/view). Networking even has mode-adjacent tuning: default rootless networking via slirp4netns adds NAT overhead, and the pasta driver copies host network configuration into the container namespace without NAT for better throughput (w=0.20, weak, https://www.virtua.cloud/learn/en/tutorials/docker-security-hardening-rootless-seccomp).

The yubiOS reading (source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01): these layered controls are the constant part, so they are configured once and inherited by every mode; the mode-specific part is only privilege escalation and environment, which is why those two rows get mode columns and the seccomp row does not.

## The two-of-three-modes rule

The yubiOS rule (source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01) is that every rootless tool must be run in at least two of the three modes before it is wired into a workflow. The rule exists because each mode hides a different class of defect:

- Interactive mode hides privilege problems, because the developer is already in the right groups with mapped subuid ranges and lingering enabled.
- Batch mode hides TTY problems, because nothing prompts; a tool that insists on a prompt hangs the job until the runner timeout kills it (mechanism in doc 05, concrete case w=0.80, https://github.com/openai/codex/issues/1340).
- Daemon mode hides exit-code problems, because systemd restarts the unit and a recurring benign failure becomes a heartbeat rather than a visible failure (mechanism in doc 04).

Two modes is the minimum that exposes one hidden class. A tool tested only interactively and only in batch has still never faced the restart-and-heartbeat dynamics of daemon mode; a tool tested only in batch and daemon has never been operated by the human who owns the enrollment and touch interactions. The rc=77 SKIP contract must additionally be honoured in all three modes, which is why it is stated once in doc 04 and referenced by every mode doc rather than re-derived.

## What the rule catches in practice

The batch column of the mode table shows the rule's payoff. The XDG_RUNTIME_DIR ownership invariant fails only outside an interactive session (w=0.86, https://github.com/podman-container-tools/podman/issues/13338), and nested podman-in-podman breaks it again (w=0.84, https://github.com/podman-container-tools/podman/discussions/21016). The nologin service account shape only appears in daemon mode, where quadlet user units are the supported placement (w=0.96, https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html). None of these surfaces in all modes, so coverage in a subset is the only way to find them before production does.

## The one interactive-only exception

Enrollment work is the deliberate exception to multi-mode coverage: FIDO2 enrolment of a YubiKey needs root and a physical touch at the same time and is therefore interactive by necessity, never run in batch or daemon mode; CI substitutes a software authenticator inside a VM instead (yubiOS convention, source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01). The corresponding corpus doc (07) was dropped at outline validation with a score of 0 and is recorded as a gap in the README.

## Summary

The isolation boundary is the mode-invariant layer: the same namespaces, capabilities, and seccomp filters in every mode (w=0.28, weak, https://systeminternals.dev/docker/security/), with portable seccomp policy artifacts demonstrating the constancy (w=0.91, https://podman.io/blogs/2019/10/15/generate-seccomp-profiles). Everything that varies between modes is privilege and environment. The two-of-three-modes rule is the process that exploits that fact: run the tool in modes that hide different defect classes, and the differences that survive become the mode table.
