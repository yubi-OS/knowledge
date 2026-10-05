# 05 Mode semantics: lifetime, cleanup contracts, and exit propagation

Scope: the execution modes of the isolation axis (one-shot, ephemeral, persistent, boot-in-container) and what each implies for lifetime, cleanup ownership, and exit-code propagation.

Weight legend: 0.5 and above means authoritative backing; below 0.5 is labeled weak.

## Why mode is an isolation property

The same boundary technology (namespaces, cgroups, seccomp) behaves differently depending on the mode it runs in, because the mode determines who owns cleanup and what an exit means. The four modes on the axis:

1. One-shot: a container run with --rm, or a single nspawn command run. Lifetime is one task.
2. Ephemeral: an nspawn or VM session whose writable state is discarded at exit. Lifetime is one session.
3. Persistent: a systemd unit sandbox. Lifetime is until stop.
4. Destructive one-shot: an install that writes a disk. Lifetime is one run, but the target disk is the output.

## One-shot containers: --rm and rc propagation

Docker's run reference documents the automatic cleanup contract directly: the --rm flag causes the container to be automatically cleaned up and its filesystem removed when it exits [0.92, https://docs.docker.com/reference/cli/docker/container/run]. The flag's behavior is well known enough that the community treats it as the standard way to run a task container and have it deleted afterward, saving disk space [0.51, https://stackoverflow.com/questions/49726272/what-is-the-rm-flag-doing].

Exit semantics in one-shot mode are the container's PID 1 return code. Docker's exit-code documentation is community-maintained rather than authoritative, and the dig surfaced only weak sources for a full exit-code taxonomy [0.15, weak, https://oneuptime.com/blog/post/2026-02-08-how-to-interpret-all-docker-container-exit-codes/view] and [0.08, weak, https://stackoverflow.com/questions/31297616/what-is-the-authoritative-list-of-docker-run-exit-codes]. The design consequence for a build pipeline is stable regardless: the build tool's return code is the contract, and the orchestration layer should propagate it rather than remap it.

The image/container split is what makes one-shot cleanup safe: image layers persist, the container does not. A repeated build never inherits state from the previous build's container filesystem.

## Ephemeral sessions: discard as the cleanup contract

nspawn's --ephemeral mode creates a temporary snapshot of the OS tree, boots it, and discards it when the container exits; where supported the snapshot is a btrfs snapshot, otherwise a plain copy [0.50, https://sumguy.com/systemd-nspawn-the-forgotten-container/]. The nspawn file format supports overlay mount points over the image (Overlay=, OverlayReadOnly=), which is the configuration-level expression of the same idea [0.87, https://www.man7.org/linux/man-pages/man5/systemd.nspawn.5.html]. ArchWiki describes nspawn as a lightweight namespace container runner, usable for a command or a full boot [0.58, https://wiki.archlinux.org/title/Systemd-nspawn].

The cleanup contract of the ephemeral mode is therefore "nothing to clean up, by construction": the writable layer never outlives the session. The mode's exit semantics are the container's PID 1 return code, same as one-shot, but the state contract is stricter: anything that must survive must be exported before exit.

The ephemeral-overlay pattern is strong enough to be used as an architecture: immutable bastion hosts built on systemd-nspawn with OverlayFS mounts so persistent changes are wiped on every boot [0.19, weak, https://devops-geek.net/devops-lab/building-immutable-bastion-hosts-with-systemd-nspawn-and-ephemeral-overlayfs-mounts/].

## Persistent units: the supervisor owns everything

In persistent mode the cleanup contract moves into unit configuration. RuntimeDirectory= creates a runtime directory under /run and removes it when the service stops [0.42, weak, https://linux-audit.com/systemd/settings/units/runtimedirectorymode/]. PrivateTmp= gives the service a private /tmp that does not survive the service [0.28, weak, https://stackharbor.com/en/knowledge-base/systemd-service-hardening/]. Exit semantics are explicit configuration: systemd's unit model defines which exit codes count as success, so the unit can declare, for example, that specific nonzero exits are expected [0.83, https://en.wikipedia.org/wiki/Systemd].

A primary-source example of the contract's fragility: systemd issue 35427 records that a v257 regression removed the runtime directory while the unit was still active, as soon as ExecStart= finished, contradicting the documented behavior [0.80, https://github.com/systemd/systemd/issues/35427]. The mode lesson is that persistent cleanup is enforced by the supervisor's lifecycle logic, and lifecycle regressions surface as cleanup bugs, not as isolation bugs.

## Destructive one-shot: no cleanup to own

The fourth mode inverts the contract. An install that writes a bootable disk has no cleanup step because the target disk is the output. Its protection is a confirmation gate on the write path, which doc 06 grounds in the bootc install documentation [0.83, https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-install-to-disk.8.md]. For the mode table, this row's "cleanup contract" entry is "none: the target disk IS the output", and its exit semantics are "non-zero aborts before the write".

## The table, restated with sources

| Mode | Lifetime | Cleanup owner | Exit semantics |
|---|---|---|---|
| One-shot container (--rm) | one task | runtime flag | PID 1 rc propagates [0.92, https://docs.docker.com/reference/cli/docker/container/run] |
| Ephemeral (nspawn) | one session | discard-at-exit | PID 1 rc propagates [0.50, https://sumguy.com/systemd-nspawn-the-forgotten-container/] |
| Persistent unit | until stop | supervisor directives | configured success codes [0.83, https://en.wikipedia.org/wiki/Systemd] |
| Destructive one-shot | one run | none, target is output | non-zero aborts pre-write [0.83, https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-install-to-disk.8.md] |

## Open gaps

The dig produced no primary source for bootc-style ephemeral VM test runs (the podman-bootc tool appears in Fedora docs but was weighted into doc 06) and none for the rc=77 SKIP convention used by the yubiOS bcvk test row; those specifics are recorded as gaps rather than asserted. The exit-code taxonomy row rests on weak sources only, which is called out above.
