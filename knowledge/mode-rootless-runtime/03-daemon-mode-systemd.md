# 03: Daemon mode: rootless containers as long-lived systemd services

Scope: long-lived rootless daemons under systemd: podman.socket as a user unit, DynamicUser where possible, ExecSearchPath for PATH resolution, NoNewPrivileges=yes, journald instead of a TTY, and Restart=on-failure semantics.

## The unit manager owns the socket

In daemon mode the socket changes hands: it is no longer owned by a login shell or a CI runner, but by a systemd unit. Podman's quadlet integration is designed for exactly this placement, generating user units for rootless containers, including for accounts whose login shell is /sbin/nologin, which is the shape a service account takes (w=0.96, https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html). Socket activation is the mechanism: systemd creates the socket, and only when a client connects does it start the service configured for that socket (w=0.89, https://github.com/podman-container-tools/podman/blob/main/docs/tutorials/socket_activation.md). Red Hat documents the same pattern as the serverless primitive: because podman does not support socket activation natively, systemd-socket-proxyd wraps the socket and spins the container up on demand (w=0.91, https://www.redhat.com/en/blog/painless-services-implementing-serverless-rootless-podman-and-systemd). systemd's own design goals, socket activation and on-demand starting of daemons with cgroup-tracked processes, are what make this column workable at all (w=0.84, https://systemd.io/).

A practical boot-ordering detail from the field: the user podman.socket must be enabled at boot under the user manager, and failures show up as needing a manual systemctl --user restart of podman.socket (w=0.14, weak, https://github.com/podman-desktop/podman-desktop/issues/10677). Tool compatibility is completed by pointing DOCKER_HOST at the user socket so Docker-API clients reach the rootless daemon (w=0.29, weak, https://oneuptime.com/blog/post/2026-03-18-enable-podman-socket-rootless-users/view).

## Why User= in a system unit is the wrong move

Running rootless podman inside a systemd system service via the User= directive is currently not supported by podman (w=0.08, weak, https://unix.stackexchange.com/questions/714167/best-practices-for-running-a-rootless-container-as-a-systemd-service-with-user). The supported path is a user manager: the user's own systemd instance owns the rootless store, the socket, and the XDG_RUNTIME_DIR. The yubiOS convention (source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01) records this as the daemon column's first row: podman.socket as a user unit, with DynamicUser= applied where the workload permits it rather than pinning a named service account.

## Hardening directives and what they forbid

Daemon mode is the only mode where sandboxing directives are declared in a file rather than inherited from a user session. NoNewPrivileges has been available since systemd 187 and prevents service processes from gaining new privileges (w=0.22, weak, https://linux-audit.com/systemd/settings/units/nonewprivileges/). The standard hardening set for a long-running daemon covers ProtectSystem, PrivateTmp, NoNewPrivileges, CapabilityBoundingSet, SystemCallFilter, and DynamicUser, audited with systemd-analyze security scoring (w=0.33, weak, https://mylinux.work/guides/systemd-hardening/). Complementary guides enumerate the same directive family and the audit tooling (w=0.20, weak, https://stackharbor.com/en/knowledge-base/systemd-service-hardening/; w=0.22, weak, https://linuxdork.com/blog/systemd-service-hardening/).

The yubiOS convention (source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01) is that daemon units run rootless tooling with NoNewPrivileges=yes and no privilege escalation at all, in deliberate contrast to batch mode, where a narrowly scoped sudo wrapper around specific tools is the accepted escalation. The reason is lifecycle: a daemon restarts; a batch job exits.

## PATH and exit semantics as unit properties

Daemon mode resolves PATH at the unit level: ExecSearchPath declares where the manager looks for executables, replacing the login-shell PATH resolution of mode 1 and the appended PATH of mode 2 (yubiOS convention, source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01). Exit codes become unit configuration: SuccessExitStatus lists which exit statuses count as success, which is how the rc=77 SKIP contract is honoured in daemon mode (yubiOS convention, source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01; mechanics in doc 04).

Restart=on-failure makes idempotency mandatory rather than optional: the unit assumes the process can be killed and relaunched at any point, so every run of the service body must tolerate a restart (yubiOS convention, source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01). This is the daemon-side twin of the batch-mode requirement that every step be re-runnable after a runner restart (doc 02).

## Output goes to journald, not a TTY

A daemon unit has no TTY, so stdout and stderr are routed to journald, which collects and stores log data as a systemd system service (w=0.64, https://developer.toradex.com/software/linux-resources/linux-features/persistent-journald-logging). Operators then read the stream with journalctl rather than watching a terminal (w=0.09, weak, https://unix.stackexchange.com/questions/20399/view-stdoutstderr-of-systemd-service). The consequence for tooling is that anything requiring an interactive prompt or a live-updating progress display is unusable in daemon mode and must be replaced by flags that emit line-oriented, log-friendly output (doc 05).

## Dry-run as a unit check

Daemon mode's verification surface is systemd-analyze verify, which validates unit files offline before they are loaded (doc 06). The yubiOS convention (source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01) pairs every daemon unit with a verify leg so a broken unit is caught before a daemon-reload changes a running host.

## Summary

Daemon mode moves every interactive assumption into unit configuration: the socket becomes a user unit with socket activation (w=0.89, https://github.com/podman-container-tools/podman/blob/main/docs/tutorials/socket_activation.md), the account becomes a nologin user with quadlet units (w=0.96, https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html), escalation is forbidden outright (w=0.22, weak, https://linux-audit.com/systemd/settings/units/nonewprivileges/), output becomes journald (w=0.64, https://developer.toradex.com/software/linux-resources/linux-features/persistent-journald-logging), and Restart=on-failure turns idempotency from a best practice into a precondition.
