# Filesystem Isolation

Scope: the filesystem sandbox directives in the yubiOS template: PrivateTmp, ProtectSystem, ProtectHome, ReadOnlyPaths, and the ReadWritePaths allowlist that makes strict mode survivable.

## Source-doc position

The yubiOS skill (source doc: yubi-OS/yubiOS skills/systemd-hardening/SKILL.md) sets this block on every service:

```ini
PrivateTmp=yes
ProtectSystem=strict
ProtectHome=yes
ReadOnlyPaths=/
ReadWritePaths=/var/lib/yubiOS-agent /run/yubiOS-agent
```

Phase 1 of the incremental approach (doc 06) applies exactly these four protective directives first because they are safe and rarely break services.

## ProtectSystem=strict

`ProtectSystem=strict` mounts the whole file system hierarchy read-only for the service, except the API file system subtrees `/dev`, `/proc`, and `/sys`. The upstream systemd.exec man page (high weight 0.96, https://www.freedesktop.org/software/systemd/man/systemd.exec.html) states that strict mode thus prohibits the service from writing to arbitrary file system locations, and that write access has to be granted explicitly through `ReadWritePaths=`. The man7 copy of the same page (high weight 0.94, https://man7.org/linux/man-pages/man5/systemd.exec.5.html) is the authoritative offline rendering.

## PrivateTmp and ProtectHome

`PrivateTmp=yes` gives the service its own `/tmp` and `/var/tmp` namespaces, cutting off shared-tmp attacks and accidental cross-service visibility. `ProtectHome=yes` makes `/home`, `/root`, and `/run/user` inaccessible. Two weak-backed setting pages (0.26, https://linux-audit.com/systemd/settings/units/protectsystem/; 0.32, https://linux-audit.com/systemd/settings/units/protecthome/) describe the same semantics at the unit level: ProtectSystem marks paths read-only, ProtectHome restricts units from home directory data.

## The ReadOnlyPaths/ReadWritePaths interplay

The source doc lists both `ReadOnlyPaths=/` and `ProtectSystem=strict` plus a two-path `ReadWritePaths=` allowlist. The allowlist is what makes strict mode workable: the freedesktop man page (0.96) says directories that should remain writable must be listed in `ReadWritePaths=` when `ProtectSystem=strict` is set. A weak-backed community answer (0.14, https://unix.stackexchange.com/questions/305586/how-to-whitelist-directories-for-units-in-systemd) makes the same point: `ReadWritePaths` is really useful alongside options that block access elsewhere, not as a standalone grant.

The weak-backed systemshardening.com article (0.23, https://www.systemshardening.com/articles/linux/systemd-unit-hardening/) documents the classic failure mode: with `ProtectSystem=strict`, all writes outside `ReadWritePaths` fail with EROFS, so a service that cannot write its logs, PID files, or data was missing required paths. Its mitigation advice: audit write paths with `strace -e write` before hardening, then add exactly those paths to `ReadWritePaths=`. That matches the source doc's Phase 1 instruction to list "only what service needs" in `ReadWritePaths=`.

The yubiOS template grants exactly two paths: `/var/lib/yubiOS-agent` (the `StateDirectory` from doc 02) and `/run/yubiOS-agent` (the `RuntimeDirectory`). The directory trio and the allowlist describe the same two writable locations; keeping them in sync is the maintenance rule.

## Naming a real hazard

A weak-backed Arch forum thread (0.08, https://bbs.archlinux.org/viewtopic.php?id=271956) shows the edge case where a service must write into a directory owned by another user: namespace read-only remounts do not change file ownership or permissions, so `ReadWritePaths=` alone does not grant access that the DAC layer denies. If ownership is wrong, fix ownership or run under a different user model, not by loosening the sandbox.

## Ordering and interactions

`ReadOnlyPaths=` sets up a new file system namespace for the executed processes and may be combined with `InaccessiblePaths=` to hide subtrees entirely (weak source, 0.15, https://gist.github.com/ageis/f5595e59b1cddb1513d1b425a323db04). Read-only applies on top of mounts; a read-only file system superblock stays protected even if a path is re-listed writable (0.94, https://man7.org/linux/man-pages/man5/systemd.exec.5.html). Practically: keep the allowlist minimal, prefer the automatic directories from doc 02 over ad hoc paths, and re-run `systemd-analyze security` after each change.

## yubiOS guidance

- Default block: `PrivateTmp=yes`, `ProtectSystem=strict`, `ProtectHome=yes`, explicit `ReadWritePaths=`.
- `ReadOnlyPaths=/` is belt-and-suspenders over `ProtectSystem=strict`; keep both as the source doc does.
- Writable surface equals `StateDirectory` plus `RuntimeDirectory` by default. Anything else is an exception that needs a written reason.
- Test writes with the service actually running; EROFS at runtime is the signature of a missing allowlist entry (0.23 weak).

Sources: source doc plus 10 dig results (2 high weight, 8 weak).
