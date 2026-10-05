# 04 The systemd unit sandbox: directives as a persistent-mode boundary

Scope: the systemd unit sandbox as a boundary for persistent daemons: what SystemCallFilter, PrivateTmp, RuntimeDirectory, ProtectSystem, NoNewPrivileges, and CapabilityBoundingSet each isolate, and how the mode (persistent service) changes what the boundary must answer.

Weight legend: 0.5 and above means authoritative backing; below 0.5 is labeled weak.

## A boundary that lives inside PID 1

systemd is the system and service manager on Linux, providing service configuration, lifecycle, and supervision [0.83, https://en.wikipedia.org/wiki/Systemd]. That position is what makes the unit sandbox a distinct mode on the isolation axis: the same supervisor that starts and stops the service also builds its boundary. systemd enables users to harden and sandbox system service units directly, with a broad set of per-unit sandboxing directives [0.87, https://wiki.archlinux.org/title/Systemd/Sandboxing].

Because the boundary is managed by the supervisor, its cleanup and exit semantics are part of the unit configuration itself. That is the defining difference from the container and nspawn rows, where cleanup belongs to a runtime command's flags.

## The directive set and what each answers

The core hardening directives recur across every current guide: ProtectSystem, PrivateTmp, NoNewPrivileges, CapabilityBoundingSet, and SystemCallFilter [0.28, weak, https://linuxjunkies.org/guides/lock-down-systemd-services]. Mapping them to threats:

1. ProtectSystem: mounts /usr and (at stricter levels) the whole filesystem hierarchy read-only, answering tampering-with-host-files threats [0.48, weak, https://dev.to/aomiqaza/systemd-service-sandboxing-restricting-process-capability-system-calls-2klk].
2. PrivateTmp: gives the service its own /tmp and /var/tmp, answering symlink attacks and cross-service tmp leakage [0.28, weak, https://stackharbor.com/en/knowledge-base/systemd-service-hardening/].
3. NoNewPrivileges: prevents the service's processes and their children from obtaining new privileges (setuid, file capabilities), closing the privilege-escalation path from inside the service [0.42, weak, https://linux-audit.com/systemd/settings/units/nonewprivileges/].
4. CapabilityBoundingSet: reduces the process capability set to only what the service needs, answering least-privilege violations [0.28, weak, https://linuxjunkies.org/guides/lock-down-systemd-services].
5. SystemCallFilter: applies a seccomp filter to the service's processes, blocking syscall classes the service does not need [0.50, https://linux-audit.com/systemd/settings/units/systemcallfilter/].

The reference guide covering all of these per-directive (NoNewPrivileges, ProtectSystem, PrivateTmp, SystemCallFilter, and related settings) exists in dedicated hardening references [0.35, weak, https://www.bigiron.cc/guides/systemd-service-hardening-directives-a-deep-dive]. An overview of the whole hardening practice, framed as attack-surface minimization through containerization-style sandboxing of services, is documented in Linux Journal [0.64, https://www.linuxjournal.com/content/systemd-service-strengthening].

## SystemCallFilter and the syscall allowlist model

SystemCallFilter is the unit-level equivalent of a container's seccomp profile: it aims to prevent misuse of syscalls that are not needed for the process's normal functioning [0.50, https://linux-audit.com/systemd/settings/units/systemcallfilter/]. systemd ships predefined syscall groups such as @system-service, which collect the syscall set a conventional system service needs; filtering to that group blocks dangerous syscalls like ptrace, reboot, or kexec_load without enumerating them by hand [0.18, weak, https://dev.to/aomiqaza/systemd-service-sandboxing-restricting-process-capability-system-calls-2klk]. Applying seccomp through SystemCallFilter does not require modifying the service binary, because the filter is applied by the supervisor at exec time [0.43, weak, https://www.systemshardening.com/articles/linux/seccomp-bpf-non-container/].

## RuntimeDirectory: the transient state contract

RuntimeDirectory= creates a private runtime directory under /run for the service and removes it when the service stops. That removal is documented behavior, and its mode consequence is sharp: a persistent unit with PrivateTmp= and RuntimeDirectory= keeps nothing across a restart, so anything the service expects to survive a restart was never persisted. The RuntimeDirectory settings are documented as sandboxing-related unit settings in the Linux Audit reference series [0.42, weak, https://linux-audit.com/systemd/settings/units/runtimedirectorymode/].

The boundary between "managed by systemd" and "survives restart" has real failure modes. systemd issue 35427 records a regression in v257 where the runtime directory was removed as soon as the ExecStart= commands finished, even though the unit was still active, contradicting the documented semantics; the issue is a primary source for the contract and its fragility [0.80, https://github.com/systemd/systemd/issues/35427]. Community troubleshooting of runtime directories shows the same contract from the user side: a runtime folder created for a service can be gone by the time the service starts, when the lifecycle timing is wrong [0.53, https://unix.stackexchange.com/questions/354583/how-to-automatically-create-a-runtime-folder-with-a-systemd-service-or-tmpfiles].

## What the persistent mode changes

In the mode table, the unit sandbox row is the persistent row: lifetime is "until stop", cleanup is directive-driven (RuntimeDirectory removed on stop, private tmp discarded), and exit semantics are explicit unit configuration (SuccessExitStatus= and related settings define which exit codes count as success). The threat this mode uniquely answers is long-lived compromise: a daemon that runs for weeks has time to be attacked, so its syscall filter, capability set, and filesystem view must be tightened for a standing process, not a task. The cost, grounded in the RuntimeDirectory semantics above, is that the persistent boundary hides state-loss hazards on restart rather than state-leak hazards.

## Open gaps

The dig did not surface the man page for SuccessExitStatus= specifically; the exit-semantics row of the mode table is grounded in systemd's unit configuration model [0.83, https://en.wikipedia.org/wiki/Systemd] plus the directive references above, and the exact SuccessExitStatus= text should be cited from systemd.directives(5) in a future refresh. All ProtectSystem/PrivateTmp mechanism descriptions currently rest on sources at or below 0.48, which is why they are labeled weak in this doc.
