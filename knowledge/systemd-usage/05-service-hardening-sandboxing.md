# Service Hardening and Sandboxing in Practice

systemd ships a per-service sandboxing layer in `systemd.exec(5)`: mount namespaces, seccomp filters, capability trimming, and dynamic users, all declared as plain unit directives with no daemons to install. The practical workflow is score first with `systemd-analyze security`, tighten one directive at a time in a drop-in, restart, and verify the service still works before adding the next. This doc covers the eight directives that move the exposure score the most, the iteration loop around `systemd-analyze security`, and the failure tells that tell you exactly which directive broke what. All directive semantics below are verified against the current freedesktop man pages (fetched directly with `omni-agent/1.0` UA, HTTP 200); dig-derived claims are marked with jev weights.

## The directives that matter

| Directive | What it buys | What it breaks |
|---|---|---|
| `ProtectSystem=` | `true` mounts `/usr/`, `/boot`, `/efi` read-only; `full` adds `/etc/`; `strict` makes the entire hierarchy read-only except `/dev/`, `/proc/`, `/sys/`. Man page recommends enabling it for all long-running services ([systemd.exec](https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html)) | Any write outside allow-listed paths fails. Carve writes back with `ReadWritePaths=`; `StateDirectory=`, `LogsDirectory=`, `CacheDirectory=` are automatically excluded from the effect. With `strict` plus `PrivateTmp=`, `/tmp/` and `/var/tmp/` remain writable. Added v214 |
| `ProtectHome=` | `yes` makes `/home/`, `/root`, `/run/user` inaccessible and empty; `read-only` allows reads; `tmpfs` hides homes but lets you re-expose specific dirs via `BindPaths=`. Recommended for all long-running, especially network-facing, services | Services that legitimately read user homes (backup agents, mail) fail with ENOENT/permission errors. No protection at all if homes live outside those 3 paths. Added v214 |
| `PrivateTmp=` | Gives the service private `/tmp/` and `/var/tmp/`, isolated from other processes; temp files are removed when the service stops | Breaks any design that shares temp files through `/tmp` with other units. Share deliberately with `JoinsNamespaceOf=`. Note `PrivateTmp=disconnected` is implied under `DynamicUser=` |
| `NoNewPrivileges=` | Process and children can never gain privileges via `execve()` (setuid/setgid bits, file capabilities). Man page calls it "the simplest and most effective way" to prevent privilege escalation. Added v187 | Breaks setuid-root helpers the service shells out to. Only affects the unit's own processes and forks; `at(1)`, `crontab(1)`, `systemd-run` jobs it requests later are not covered |
| `DynamicUser=` | Allocates a transient UID/GID (range 61184…65519) per run, released at stop; nothing in `/etc/passwd`. Implies (un-disableably) `NoNewPrivileges=`, `RestrictSUIDSGID=`, `RemoveIPC=`, `ProtectSystem=strict`, `ProtectHome=read-only`, and `PrivateTmp=disconnected` | Incompatible with registering D-Bus service names. UID/GIDs are recycled after termination: files left behind by the old run become readable by whatever unit gets the same UID next, so use `StateDirectory=`/`RuntimeDirectory=` which manage ownership and lifecycle for you |
| `CapabilityBoundingSet=` | Trims the kernel capability bounding set (and effective/permitted/inheritable sets). Empty value resets to an empty set, the correct starting point; add back only what the service proves it needs (e.g. `CAP_NET_BIND_SERVICE` to bind low ports) | A needed capability drops silently at `execve()` time: the service starts, then fails on the first privileged operation. `systemd-analyze capability` lists capabilities available on the local system |
| `RestrictAddressFamilies=` | Allow-lists socket address families, e.g. `AF_UNIX AF_INET AF_INET6`; `none` denies all; `~` prefix turns it into a deny list. Cuts access to exotic protocols like `AF_PACKET` | Only restricts `socket(2)`: sockets passed in via socket activation, `socketpair()`, and io_uring are unaffected, so the man page recommends combining it with `SystemCallFilter=@service`. Omit `AF_UNIX` and you break syslog and most local IPC. No effect on 32-bit x86, s390(x), mips, or ppc ABIs (platform-sensitive) |
| `SystemCallFilter=` | seccomp BPF filter. Without `~` it is an allow-list; with `~` a deny-list. Default deny action is termination with `SIGSYS`. Groups start with `@`; `@system-service` is the man page's recommended starting allow-list, excluding `@clock`, `@mount`, `@swap`, `@reboot` | `SIGSYS` kills with no errno trail: set `SystemCallErrorNumber=EPERM` (v209) to get return codes while iterating. Blocking `execve()` makes invocation itself fail; a failing ExecStart error path may need extra syscalls, so debug failures with the filter off. Group contents change between systemd versions; list the real sets with `systemd-analyze syscall-filter`. Pair with `SystemCallArchitectures=native` (v209) so secondary ABIs cannot bypass the filter |

## The systemd-analyze security loop

`systemd-analyze security` without arguments scores all currently loaded long-running services in a terse table ([systemd-analyze(1)](https://www.freedesktop.org/software/systemd/man/latest/systemd-analyze.html)). With a unit name it prints a per-setting breakdown: each checked setting gets a numeric exposure weight, and the overall exposure level spans 0.0 (tight) to 10.0 (fully exposed). The man page's own example shows the anatomy: `PrivateNetwork=` at 0.5, `User=/DynamicUser=` at 0.4, `DeviceAllow=` at 0.2, summing to an overall 4.1 for `systemd-logind.service`. Run it as root or with a user that can query the manager; loaded long-running units only.

The loop:

1. Baseline: `systemd-analyze security myservice.service`. Read the unmet rows (marked with a cross) sorted by exposure weight; those are your next edits, biggest first.
2. One directive per iteration, in a drop-in: `systemctl edit myservice.service` (writes `/etc/systemd/system/myservice.service.d/override.conf`), then `systemctl daemon-reload && systemctl restart myservice.service`.
3. Verify the service still works: hit its actual function, not just `is-active`. A service that starts but fails its first write, bind, or setuid helper at request time is the classic sandboxing failure.
4. Re-score. Repeat until the score is where your policy wants it, then freeze the threshold in CI: `systemd-analyze security --threshold=4 myservice.service` returns a nonzero exit when the unit exceeds the value (added v250). Combine with `--offline=` (v250) to score unit files from `--root=` or `--image=` trees during image builds without a running PID 1, and `--profile=` (v250) to assess against a portable service profile.

Two limits the man page states plainly: the score only covers sandboxing systemd itself implements, not defenses inside the service code; and settings are individually circumventable unless combined, for example a service that retains mount privileges can undo most mount-based options. IPC is outside the model: a service that can ask D-Bus for privileged operations is not sandboxed no matter what the score says.

For the version-sensitive claim: the `security` verb itself is widely documented as arriving in systemd v240 (dig-derived, jev weight 0.18, github.com/Yuvraj1507/Linux-Security-Hardening/systemd.adoc). Treat that version attribution as low-confidence and check `systemd-analyze security` availability on your target release before gating CI on it.

## The hardening recipe

Start permissive and tighten in this order, re-scoring and re-testing at each step:

1. Filesystem first, it rarely breaks anything: `PrivateTmp=yes`, `ProtectHome=yes`, then `ProtectSystem=strict` with `ReadWritePaths=` listing exactly the writable paths the service needs. Prefer `StateDirectory=`, `RuntimeDirectory=`, `CacheDirectory=`, `LogsDirectory=` over raw `ReadWritePaths=` where they fit; they handle ownership and UID-recycling for you.
2. Privileges next: `NoNewPrivileges=yes`, `CapabilityBoundingSet=` (empty), then attempt `DynamicUser=yes` if the service does not need a stable identity or D-Bus names.
3. Kernel surface: `ProtectKernelTunables=`, `ProtectKernelModules=`, `ProtectControlGroups=` and friends cut off `/proc/sys`, module loading, and cgroup control.
4. Syscalls last, it is the most fragile layer: `SystemCallFilter=@system-service` with `SystemCallErrorNumber=EPERM` while iterating, `SystemCallArchitectures=native`, and deny-list leftovers with `SystemCallFilter=~@mount @reboot @swap @clock`.
5. Address families if the service is network-facing but local-only: `RestrictAddressFamilies=AF_UNIX` alone is a large win for pure-IPC daemons.

## Common breakages and their tells

- **Write fails at runtime, service starts fine.** `ProtectSystem=strict` without `ReadWritePaths=`. Tell: EROFS/EPERM in the service log on first write. Fix: add the path, or convert to `StateDirectory=`.
- **Home data vanishes.** `ProtectHome=yes` on a service that reads user homes. Tell: ENOENT on paths that exist on disk. Fix: `ProtectHome=tmpfs` plus `BindPaths=` for the one directory needed, or `read-only`.
- **Two services stop sharing temp files.** `PrivateTmp=yes` split them. Tell: one service cannot see the other's lockfile or socket in `/tmp`. Fix: `JoinsNamespaceOf=` between them (verified in systemd.exec).
- **setuid helper fails with EPERM.** `NoNewPrivileges=yes`. Tell: the helper works when run manually as the same user but not under the unit. Fix: drop the helper or grant a capability directly to the service instead.
- **Process dies with SIGSYS, no error in the app.** `SystemCallFilter=` caught a syscall. Tell: `SIGSYS` in `journalctl` with no application-level traceback. Fix: find the syscall (`SystemCallLog=`, v247, logs matching calls), then allow it or keep `SystemCallErrorNumber=EPERM` during development.
- **Service cannot register its D-Bus name.** `DynamicUser=yes`. Tell: the service runs but clients cannot reach it over D-Bus. Fix: pin a static `User=` instead, per the systemd.exec incompatibility note.
- **Privileged operation fails although the file is writable.** `CapabilityBoundingSet=` emptied a needed capability. Tell: works as root without the bounding set, fails with it. Fix: add the specific capability back, not the full set.

## Sources considered

Used:
- https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html (primary, fetched directly with UA, HTTP 200)
- https://www.freedesktop.org/software/systemd/man/latest/systemd-analyze.html (primary, fetched directly with UA, HTTP 200)
- https://github.com/Yuvraj1507/Linux-Security-Hardening/blob/master/systemd.adoc (dig result, jev 0.18, used only for the v240 security-verb attribution, flagged low-confidence)
- https://linuxjunkies.org/guides/lock-down-systemd-services (dig result, jev 0.61, corroborated ProtectSystem=full adds /etc; not load-bearing, man page carries the claim)
- skills/github-yubios-KS9n5GAT/systemd-hardening/SKILL.md (workspace map for the phase ordering only; not citable)

Rejected:
- https://www.ctrl.blog/entry/systemd-service-hardening/ (stale, 2020)
- https://ejaaskel.dev/sandboxing-systemd-services/ (blog, superseded by man page)
- https://oneuptime.com/blog/post/2026-03-02-how-to-configure-systemd-service-hardening-on-ubuntu/view (aggregator)
- https://oneuptime.com/blog/post/2026-03-02-configure-systemd-service-sandboxing-ubuntu/view (aggregator duplicate)
- https://www.redhat.com/en/blog/mastering-systemd (vendor blog, no man-page authority)
- https://documentation.suse.com/smart/security/html/systemd-securing/index.html (distro doc, redundant with man page)
- https://askubuntu.com/questions/1182494/ (forum answer)
- https://github.com/qualcomm/fastrpc/issues/344 (issue tracker anecdote)
- https://nickb.dev/blog/writing-a-secure-systemd-service-with-sandboxing-and-dynamic-users/ (blog)
- https://www.freedesktop.org/software/systemd/man/systemd-analyze.html (stale URL, superseded by /latest/)

Note: no mirror fallback was needed; freedesktop.org served both man pages directly. The workspace systemd-hardening skill's `RestrictFileSystems=` warning (the fabricated `RestrictFileSystemAccess=` name does not exist) was honored: no such directive appears in this doc.
