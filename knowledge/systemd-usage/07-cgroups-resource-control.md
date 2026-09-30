# cgroups resource control in practice

systemd turns the kernel cgroup hierarchy into a small set of operator-facing primitives: slice units group related units in a named tree, service and scope units hold the processes, and per-unit directives such as CPUQuota, MemoryHigh, MemoryMax, MemorySwapMax, IOWeight, and TasksMax bound CPU, memory, swap, I/O, and task counts. systemd-run creates transient service or scope units with these properties applied on the spot, systemd-cgtop and systemd-cgls observe the results, and Delegate= hands a subtree to container runtimes or the user systemd instance. All of this assumes cgroup v2, the unified hierarchy: several directives silently degrade or do not exist on the legacy v1 mounts, and systemd removed support for the legacy and hybrid hierarchies in v258 after deprecating them in v256 (https://github.com/systemd/systemd/blob/main/docs/CGROUP_DELEGATION.md, weight 0.94).

## The slice / scope / service hierarchy

Slice names encode position in the tree: dashes are path separators, and `foo-bar.slice` lives inside `foo.slice`, which lives inside the root slice `-.slice` (https://www.freedesktop.org/software/systemd/man/latest/systemd.slice.html). By default, service and scope units land in `system.slice`, machines registered with systemd-machined go to `machine.slice`, and logind user sessions go to `user.slice` (same source). Scope units are never configured by unit files, only created programmatically or via `systemd-run --scope`; they wrap externally started processes and have no main process, so their lifecycle ends when their last process exits, not when one PID exits (https://www.freedesktop.org/software/systemd/man/latest/systemd.scope.html).

Resource-control directives are valid in the `[Slice]`, `[Scope]`, `[Service]`, `[Socket]`, `[Mount]`, and `[Swap]` sections depending on unit type (https://www.freedesktop.org/software/systemd/man/latest/systemd.resource-control.html). A limit on a slice applies to every unit beneath it, so a `[Slice]` section with `CPUQuota=100%` and `MemoryMax=4G` caps an entire batch-processing group at once, a pattern the dig surfaced as a common idiom (https://devops.aibit.im/en/article/systemd-cgroups-resource-limiting-isolation-guide, weight 0.95, corroborated by the man page semantics above).

Controllers are enabled implicitly: setting `CPUWeight=` enables the `cpu` controller, `TasksMax=` enables `pids`, and enabling a controller on a unit also enables it for all parents and siblings from that point down, which means units without any configuration can still be subject to control. `DisableControllers=` blocks this from a unit's children downward (https://www.freedesktop.org/software/systemd/man/latest/systemd.resource-control.html).

## The directives, and what they bound

| Directive | What it bounds | Units and key details |
| --- | --- | --- |
| `CPUWeight=` (v232+) | Relative CPU share within a slice | 1 to 10000, kernel default 100. cgroup v2 only: on v1 it degrades to the minimum weight. Special value `idle` gives CPU only when siblings are idle (https://www.freedesktop.org/software/systemd/man/latest/systemd.resource-control.html). |
| `CPUQuota=` | Hard CPU time ceiling | Percentage of one CPU; values over 100% grant multiple cores. Maps to `cpu.max` on v2, `cpu.cfs_quota_us` on v1. `CPUQuota=20%` means never more than 20% of one CPU (same source). |
| `CPUQuotaPeriodSec=` (v242+) | Period over which the quota is measured | Default 100ms, clamped by the kernel to 1ms through 1000ms (same source). |
| `MemoryHigh=` (v231+) | Throttling limit | The main memory control mechanism: usage may exceed it but is heavily slowed. Sizes accept K/M/G/T suffixes (base 1024) or a percentage of installed physical RAM (same source). |
| `MemoryMax=` (v231+) | Absolute memory limit | Last line of defense: when usage cannot be contained, the OOM killer is invoked inside the unit. Accepts the same size and percentage forms (same source). |
| `MemorySwapMax=` (v232+) | Swap usage ceiling | Absolute limit, or percentage of configured swap. v2 only, controls `memory.swap.max` (same source). |
| `TasksMax=` (v227+) | Maximum tasks (processes and threads) | Absolute number or percentage of the system-wide maximum; `infinity` unsets. Controls `pids.max` (same source). |
| `IOWeight=` (v230+) | Relative block I/O share within a slice | 1 to 10000, default 100. cgroup v2 unified hierarchy only (same source). |
| `IOReadBandwidthMax=` / `IOWriteBandwidthMax=` | Per-device bandwidth cap | Takes `device bytes` pairs such as `IOReadBandwidthMax=/dev/sda 200M`. Not work-conserving: the unit gets no more even when the device is idle (same source). |

Operational guidance from the man page itself: prefer `MemoryHigh=` as the working control and treat `MemoryMax=` as the last line of defense, because hitting `MemoryMax=` kills something. Weight-style directives (`CPUWeight=`, `IOWeight=`) split contended resources proportionally between siblings and are work-conserving, while quota-style directives (`CPUQuota=`, bandwidth caps) are ceilings that waste idle capacity. A common slice layout puts interactive work in `session.slice` and batch work in a dedicated slice, then divides contention with weights instead of hard quotas.

## Transient units with systemd-run

`systemd-run` starts a command as a transient service (default) or scope unit, with properties applied at creation (https://www.freedesktop.org/software/systemd/man/latest/systemd-run.html). Practical forms:

```console
# transient service: 2 CPU cores, 1 GiB throttle, 1.5 GiB hard cap, no swap
$ sudo systemd-run --unit=report-job --slice=report \
    -p CPUQuota=200% -p MemoryHigh=1G -p MemoryMax=1500M -p MemorySwapMax=0 \
    /usr/bin/make-report --full

# transient scope for an already-planned workload, weight instead of quota
$ systemd-run --scope --slice=background -p IOWeight=50 rsync -a /data /backup

# named slice tree, e.g. workloads.slice nested under root
$ sudo systemctl set-property report.slice CPUQuota=100% TasksMax=512
```

Key options: `--scope` (added in v206) creates a `.scope` instead of a `.service`; `-p`/`--property=` (v211) takes assignments in the same format as `systemctl set-property`; `--slice=` places the unit outside the default `system.slice`; `--slice-inherit` (v246) nests the new unit under the slice `systemd-run` itself runs in, so invoking from `foo.slice` with `--slice=bar` yields `foo-bar.slice` (same source). `systemctl set-property` applies the same properties to existing or future units persistently; `--runtime` limits it to the current boot (property assignments in the same format, per `systemd-run(1)` and `systemctl(1)` cross-reference). Note that `--scope` runs the command under the caller: the unit groups and limits the processes, but `systemd-run` itself executes and supervises them, which is why scopes suit interactive or long-running jobs you still see in your shell.

## Observation: systemd-cgtop and systemd-cgls

`systemd-cgtop` is top for the cgroup tree: it lists units ordered by CPU, memory, disk I/O, or task count, refreshed continuously (https://www.freedesktop.org/software/systemd/man/latest/systemd-cgtop.html). Two things bite operators:

1. Memory and I/O columns are only meaningful where `MemoryAccounting=` and `IOAccounting=` are enabled; the man page recommends turning them on for units you want to monitor. Enabling accounting on one unit implicitly enables it for siblings and parents in the same slice (https://www.freedesktop.org/software/systemd/man/latest/systemd.resource-control.html).
2. CPU load is shown as a percentage of one CPU by default, so 800% on an 8-core box is full load; `--cpu=time` or pressing `%` toggles to absolute CPU time (https://www.freedesktop.org/software/systemd/man/latest/systemd-cgtop.html).

Useful invocations: `systemd-cgtop -1` (single iteration, scriptable), `-m` to order by memory, `--depth=` to control how deep the tree is shown, and `--recursive=no` to aggregate per top-level unit instead of splitting subgroups.

`systemd-cgls` prints the cgroup contents as a tree once, not continuously: `systemd-cgls` shows the whole hierarchy, `systemd-cgls -u nginx.service` shows one unit's subtree, `--user-unit` targets user units, and `-k` includes kernel threads (https://www.freedesktop.org/software/systemd/man/latest/systemd-cgls.html). For a quick mapping of PID to unit, `systemd-cgls --unit` plus the unit name is faster than walking `/sys/fs/cgroup` by hand.

## Delegation for containers and user managers

`Delegate=` on a service or scope unit (added in v218) hands the unit's cgroup subtree to the unit's own processes: systemd stops creating, removing, or reconfiguring cgroups below the unit's cgroup and stops migrating processes across that boundary (https://www.freedesktop.org/software/systemd/man/latest/systemd.resource-control.html; https://github.com/systemd/systemd/blob/main/docs/CGROUP_DELEGATION.md, weight 0.94). It takes a boolean (delegate all supported controllers) or an explicit controller list such as `Delegate=cpu memory pids`. With `User=`, the subtree is chowned so the unprivileged user can create child cgroups (delegation doc).

Rules that make delegation work, from the delegation document (weight 0.94): delegation is available on service and scope units only, never on slice units, because slice units are the inner nodes systemd itself manages and two writers would violate the cgroup v2 single-writer rule. The no-processes-in-inner-nodes rule means a delegated unit's cgroup cannot directly hold processes once it has child cgroups, which is why services with `ExecStartPost=` or `ExecReload=` get those processes placed in a `.control` sub-cgroup, and why `DelegateSubgroup=` (v254) exists to put the main process into a named subgroup automatically. Secure delegation of controller files to less privileged code is only safe on the unified hierarchy: unprivileged services on the v1 legacy hierarchy are never granted controller access, even when requested (https://www.freedesktop.org/software/systemd/man/latest/systemd.resource-control.html).

Container runtimes are the canonical consumer: a runtime that registers with machined or starts under a delegated scope can then build its own nested cgroups per container, and the administrator can still use the normal systemd resource and reporting commands on the container's scope from the outside (https://systemd.io/CGROUP_DELEGATION/, weight 0.94). The same mechanism powers `user@.service`: each user manager runs delegated and applies its own resource-control settings to user units (resource-control man page example).

## Quick operator workflow

1. Place the workload: `systemd-run --slice=... ` for a one-off, a `.slice` plus `Slice=` for a durable group (https://www.freedesktop.org/software/systemd/man/latest/systemd.slice.html).
2. Bound it: weights (`CPUWeight=`, `IOWeight=`) for fair sharing, quotas (`CPUQuota=`, `MemoryMax=`) for hard ceilings, `MemoryHigh=` as the working throttle, `TasksMax=` against fork bombs (https://www.freedesktop.org/software/systemd/man/latest/systemd.resource-control.html).
3. Observe: `systemd-cgtop -m --depth=2` to find the heavy unit, `systemd-cgls -u <unit>` to see its processes (https://www.freedesktop.org/software/systemd/man/latest/systemd-cgtop.html).
4. Persist: `systemctl set-property` for settings that must survive reboots (https://www.freedesktop.org/software/systemd/man/latest/systemd-run.html, property format).

## Sources considered

- https://www.freedesktop.org/software/systemd/man/latest/systemd.resource-control.html (primary, fetched directly with UA omni-agent/1.0)
- https://www.freedesktop.org/software/systemd/man/latest/systemd.slice.html (primary)
- https://www.freedesktop.org/software/systemd/man/latest/systemd.scope.html (primary)
- https://www.freedesktop.org/software/systemd/man/latest/systemd-run.html (primary)
- https://www.freedesktop.org/software/systemd/man/latest/systemd-cgtop.html (primary)
- https://www.freedesktop.org/software/systemd/man/latest/systemd-cgls.html (primary)
- https://github.com/systemd/systemd/blob/main/docs/CGROUP_DELEGATION.md (primary, fetched via raw.githubusercontent.com, weight 0.94)
- https://systemd.io/CGROUP_DELEGATION/ (same document served by systemd.io, weight 0.94)
- https://devops.aibit.im/en/article/systemd-cgroups-resource-limiting-isolation-guide (dig, weight 0.95, used for the slice-level quota idiom)
- https://unix.stackexchange.com/questions/804670/systemd-delegation-and-a-manually-controlled-cgroup-subhierarchy (dig, weight 0.94, corroborates the inner-node pitfall; primary doc cited instead)
- https://man7.org/linux/man-pages/man5/systemd.resource-control.5.html (mirror, unused, freedesktop fetch succeeded)
- https://kernel-internals.org/cgroups/systemd-cgroups/ (low, rejected, weight 0.12)
- https://wiki.archlinux.org/title/Cgroups (low, rejected, weight 0.14)
- https://en.wikipedia.org/wiki/Systemd (low, rejected, weight 0.41)
- https://oneuptime.com/blog/post/2026-03-02-setup-systemd-resource-control-memorymax-ubuntu/view (low, rejected, weight 0.13, blog duplicate of man content)
- https://fdcservers.net/blog/cgroups-v2-resource-limits-with-systemd (low, rejected, weight 0.19, blog duplicate)
- https://serverfault.com/questions/874274/systemd-per-user-cpu-and-or-memory-limits (low, rejected, weight 0.94 but Q-and-A thread, superseded by man page)
