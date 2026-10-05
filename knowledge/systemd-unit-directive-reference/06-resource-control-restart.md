# Resource Control and Restart Policy

Scope: systemd.resource-control(5) cgroups v2 limits (MemoryMax, MemoryHigh, CPUQuota, CPUWeight, IOWeight, TasksMax) and the restart and watchdog policy directives (Restart=, RestartSec=, RestartSteps=, RestartMaxDelaySec=, WatchdogSec=).

## Where resource control lives

Resource-control options are shared across unit types: "unit configuration files for services, slices, scopes, sockets, mount points, and swap devices share a subset of configuration options for resource control of spawned processes", implemented on the Linux control groups (cgroups) kernel API (https://www.freedesktop.org/software/systemd/man/systemd.resource-control.html, weight 0.98). On cgroups v2, a single unified hierarchy handles CPU, memory and IO consistently, replacing the fragmented v1 hierarchy (https://fdcservers.net/blog/cgroups-v2-resource-limits-with-systemd, weight 0.12, weak backing). That shared design is why a limit set on a slice unit can bound a whole group of services.

## The core limits

| Directive | Mechanism |
|---|---|
| MemoryMax= | Hard memory limit; exceeding it OOM kills processes in the cgroup |
| MemoryHigh= | Soft limit; throttles and triggers reclaim before the hard limit |
| CPUQuota= | Percentage of CPU time, for example 50% |
| CPUWeight= | Relative CPU weight between contending units, default 100 |
| IOWeight= | Relative IO weight |
| TasksMax= | Maximum number of tasks (pids) in the cgroup |

Semantics follow systemd.resource-control(5) (https://www.freedesktop.org/software/systemd/man/systemd.resource-control.html, weight 0.98) with the directive list recorded in the yubiOS systemd reference (session/refs-mint/refs_corpus/systemd-unit-directive-reference-2026-07-23.md). The two memory directives form a pair worth designing deliberately: MemoryHigh= is the production-safe throttle line, MemoryMax= is the kill line. The three-layer view (ulimit per session via PAM, unit files per service, cgroups v2 under systemd) is a useful mental model for where a limit actually binds (https://www.fosslinux.com/158629/linux-resource-limits-ulimit-systemd-cgroups.htm, weight 0.16, weak backing).

A worked Ubuntu walkthrough configures exactly this trio of memory, CPU and IO limits with MemoryMax=, CPUQuota= and cgroup-based controls per service (https://oneuptime.com/blog/post/2026-03-02-setup-systemd-resource-control-memorymax-ubuntu/view, weight 0.15, weak backing).

## Restart policy

Restart= selects which exit outcomes trigger a restart: no, on-success, on-failure, on-abnormal, on-watchdog, on-abort, always. RestartSec= sets the delay before the restart, with a default of 100ms (semantics recorded in the yubiOS systemd reference, session/refs-mint/refs_corpus/systemd-unit-directive-reference-2026-07-23.md, consistent with systemd.service(5) and systemd.resource-control(5), https://www.freedesktop.org/software/systemd/man/systemd.resource-control.html, weight 0.98).

The backoff problem is that a fixed RestartSec= hammers a broken dependency at full rate. Since v255, RestartSteps= and RestartMaxDelaySec= give exponential backoff: the restart delay grows in steps up to the configured cap (yubiOS systemd reference, session/refs-mint/refs_corpus/systemd-unit-directive-reference-2026-07-23.md; version placement confirmed against upstream release notes, https://github.com/systemd/systemd/blob/main/NEWS, weight 0.94). Operational guides fold this into failure recovery: "configuring systemd restart policies with backoff, adding watchdog health checks that detect hung processes, and wiring failure notifications" (https://how2.sh/posts/how-to-automate-service-failure-recovery-steps-for-linux-servers/, weight 0.02, weak backing).

## Watchdog

WatchdogSec= adds a liveness contract on top of the exit-code policy: the service must call sd_notify("WATCHDOG=1") periodically, and systemd kills and restarts it if the heartbeat stops. This catches the failure class that exit codes never see: a process that is alive as a PID but stuck internally (https://oneuptime.com/blog/post/2026-03-02-configure-systemd-restartsec-watchdogsec-ubuntu/markdown, weight 0.04, weak backing). The watchdog pair usually runs with Restart=on-watchdog so that a missed heartbeat is the trigger.

A production-scale consumer demonstrates the pattern: Kubernetes integrates kubelet with systemd on Linux nodes "to allow the operating system supervisor to recover a failed kubelet", documented as beta since v1.32 and enabled by default (https://kubernetes.io/docs/reference/node/systemd-watchdog/, weight 0.84). That page also records the practical coupling: the watchdog feature works with the service supervisor regardless of type, but waiting for READY=1 before considering the service started requires Type=notify.

## What watchdog does not cover

A restart policy is reactive: it sees crashes, non-zero exits and missed heartbeats. It does not see a service that is wedged but still heartbeating correctly, a restart loop that never converges, or a unit that never started after a reboot; those need external monitors on top of the unit configuration (https://www.monsys.ai/en/guides/monitoring/systemd-service-monitoring-auto-restart, weight 0.03, weak backing). For pressure-based signals inside systemd itself, the v261 PSI directives (CPUPressureWatch= and friends) extend this toolkit; see the v261-directives doc in this corpus.
