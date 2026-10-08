# Kernel and Syscall Filtering

Scope: the Phase 3 block of the yubiOS template: kernel interface protections, the seccomp SystemCallFilter group model, SystemCallArchitectures, MemoryDenyWriteExecute, and the address-family, namespace, realtime, SUID/SGID, and personality restrictions.

## Source-doc position

The yubiOS skill (source doc: yubi-OS/yubiOS skills/systemd-hardening/SKILL.md) labels this block "test carefully" in Phase 3:

```ini
ProtectKernelTunables=yes
ProtectKernelModules=yes
ProtectControlGroups=yes
ProtectClock=yes
SystemCallFilter=@system-service
SystemCallFilter=~@mount @reboot @swap @clock
SystemCallArchitectures=native
MemoryDenyWriteExecute=yes
RestrictNamespaces=yes
RestrictRealtime=yes
RestrictSUIDSGID=yes
LockPersonality=yes
```

Plus `ProtectHostname=yes` and `ProtectKernelLogs=yes` in the template's kernel protection group, `RestrictAddressFamilies=AF_UNIX AF_INET AF_INET6`, and `IPAddressDeny=any` for network-quiet services.

## Kernel interface protections

The five Protect* kernel directives work by making the relevant interfaces read-only or invisible inside the service's namespace: kernel tunables under /proc/sys and /sys, module load/unload syscalls, control-group hierarchy, clock changes, hostname changes, and kernel log access. The upstream systemd.exec man page (high weight 0.96, https://www.freedesktop.org/software/systemd/man/systemd.exec.html) is the canonical reference for the whole set; the systemd project site (high weight 0.90, https://systemd.io/) anchors the platform context. A weak-backed settings page (0.35, https://linux-audit.com/systemd/settings/units/systemcallfilter/) describes SystemCallFilter's purpose plainly: prevent misuse of syscalls not needed for normal functioning of the process or its children, implemented with seccomp.

## SystemCallFilter groups

systemd ships predefined syscall groups prefixed with `@`. The source doc allows `@system-service` (the reasonable default set for most system services) then denies the dangerous groups with the `~` prefix: `@mount`, `@reboot`, `@swap`, `@clock`. Its group reference table:

| Group | Block with | Blocks |
|---|---|---|
| @mount | mounts | mount operations |
| @clock | clock changes | time adjustment |
| @reboot | reboot or kexec | reboot paths |
| @swap | swap management | swap control |
| @privileged | all privileged calls | the whole privileged set |
| @debug | ptrace, perf | debugging interfaces |

A weak-backed seccomp guide (0.26, https://www.systemshardening.com/articles/linux/seccomp-bpf-non-container/) confirms that the @-groups are maintained and updated by systemd itself, so the deny lines keep covering new syscalls without edits. Another weak source (0.12, https://oneuptime.com/blog/post/2026-03-02-how-to-use-seccomp-to-restrict-system-calls-on-ubuntu/view) lists more shortcuts, including `@basic-io` for basic I/O.

## SystemCallArchitectures

`SystemCallArchitectures=native` blocks syscall attempts from other ABIs (32-bit compat, x32), which shrinks the filter's attack surface and is part of Phase 3 in the source doc.

## MemoryDenyWriteExecute and friends

`MemoryDenyWriteExecute=yes` prevents creating writable-then-executable memory mappings, which blocks JIT-style runtime code generation. The weak-backed Linux Junkies guide (0.16, https://linuxjunkies.org/guides/lock-down-systemd-services) warns the same thing the yubiOS skill implies in Phase 3's "test carefully": this breaks JVM, Node.js, and Python runtimes that JIT, so it belongs only on services that do not self-generate code. `RestrictNamespaces=yes` denies namespace creation (containers, new mounts), `RestrictRealtime=yes` denies realtime scheduling, `RestrictSUIDSGID=yes` denies creating suid/sgid files, and `LockPersonality=yes` locks the process personality against changes. The weak-backed hardening gist (0.15, https://gist.github.com/ageis/f5595e59b1cddb1513d1b425a323db04) groups these directives together as the standard kernel-exposure reduction set, matching the source doc's block.

## Network restrictions

The template's IPC and network block sets `RestrictAddressFamilies=AF_UNIX AF_INET AF_INET6` (allowlist of socket families) and, for services that need no network at all, `IPAddressDeny=any`. The weak-backed guide (0.16, https://linuxjunkies.org/guides/lock-down-systemd-services) echoes the skill's own note: drop `AF_INET6` for IPv4-only services, since an unused family in the allowlist is exposure without benefit.

## Failure behavior

Seccomp violations kill the service or return EPERM depending on `SystemCallErrorNumber=`; the practical yubiOS workflow is to apply Phase 3, exercise the service, and read journalctl for the blocked syscall names before deciding whether a group is too broad. That is exactly why the source doc orders it last and says "test carefully": a too-tight filter is the one sandbox change most likely to break a working daemon outright.

Sources: source doc plus 7 dig results (3 high weight, 4 weak).
