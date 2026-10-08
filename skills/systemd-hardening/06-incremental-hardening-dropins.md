# Incremental Hardening and Drop-In Overrides

Scope: the phased application order the yubiOS skill prescribes, and the drop-in override workflow that keeps upstream unit files untouched.

## Source-doc position

The yubiOS skill (source doc: yubi-OS/yubiOS skills/systemd-hardening/SKILL.md) says: apply phases one at a time, reload and test between phases. Three phases:

- Phase 1, filesystem (safe, rarely breaks): `PrivateTmp=yes`, `ProtectSystem=strict`, `ProtectHome=yes`, `ReadWritePaths=<only what service needs>`.
- Phase 2, privileges (usually safe): `NoNewPrivileges=yes`, `CapabilityBoundingSet=`, `DynamicUser=yes`, `RemoveIPC=yes`.
- Phase 3, kernel plus syscalls (test carefully): `ProtectKernelTunables=yes`, `ProtectKernelModules=yes`, `ProtectControlGroups=yes`, `ProtectClock=yes`, `SystemCallFilter=@system-service`, `SystemCallArchitectures=native`, `MemoryDenyWriteExecute=yes`, `RestrictNamespaces=yes`, `LockPersonality=yes`.

After each phase: `systemctl daemon-reload`, restart the unit, exercise it, re-score.

## Drop-in overrides

Never edit upstream unit files; use drop-ins. The source doc's flow:

```bash
systemctl edit sshd.service          # writes /etc/systemd/system/sshd.service.d/override.conf
systemctl daemon-reload
systemctl restart sshd.service
systemd-analyze security sshd.service
```

The Flatcar documentation (high weight 0.89, https://www.flatcar.org/docs/latest/os-config/host-config/drop-in-units/) documents the mechanics from the vendor side: drop-ins land under the unit's `.d` directory, and after editing you run `systemctl daemon-reload`, which scans for new or changed units; `systemd-delta --type=extended` lists drop-in changes so you can see exactly what your overlay changed. The systemd project site (high weight 0.91, https://systemd.io/) anchors the manager behavior. A weak-backed tutorial (0.21, https://www.baeldung.com/linux/systemd-modify-config) confirms the same: the `edit` verb creates the unit's `.d` directory and opens the override for editing, and the status output then shows a `Drop-In:` line proving the change is live.

## Why vendor files stay untouched

The reason is operational: package upgrades replace vendor unit files, and local edits would be lost or would cause merge conflicts. Drop-ins survive upgrades because they live in `/etc/systemd/system/<unit>.d/`. Multiple weak-backed sources converge on this pattern for vendor services (0.17, https://www.devopsness.com/blog/systemd-drop-in-overrides-for-vendor-services-the-supportable-linux-ops-pattern-2026-03-24; 0.21, https://how2.sh/posts/how-to-manage-systemd-services-with-drop-in-overrides/, which also covers rollback steps without editing vendor files).

## The phased loop as a repeatable procedure

Combining the source doc's phases with the drop-in mechanics gives the yubiOS per-service loop:

1. Score the unit (`systemd-analyze security <unit>`); note the top unset directives.
2. Write a drop-in with the Phase 1 block; `daemon-reload`; restart.
3. Exercise the service; check writes succeed (the EROFS failure mode from doc 03).
4. Re-score; expect a visible drop.
5. Add the Phase 2 block; repeat.
6. Add Phase 3 with extra care; exercise every code path the service has; read journalctl for seccomp denials before loosening anything.
7. Final gate: exposure score below 4.0.

A weak-backed hardening how-to (0.35, https://linux-audit.com/systemd/how-to-harden-a-systemd-service-unit/) describes gathering the right information first and then defining sandboxing features, which is the same audit-then-apply shape the source doc mandates. Another weak source (0.17, https://hostperl.com/blog/systemd-service-hardening-checklist-for-vps-2026) frames the checklist value: a repeatable way to tighten risk without rewriting the application.

## Decoding denials between phases

A weak-backed 2026 walkthrough (0.16, https://stackharbor.com/en/knowledge-base/systemd-service-sandboxing-hardening/) recommends hardening in waves through a drop-in and reading the exact sandbox denial out of the journal. That is the practical skill between Phase 2 and Phase 3: when a restart fails, the journal names the syscall or path the new directive blocked, and the fix is to either allow that one thing explicitly or consciously drop the directive. The source doc's "test carefully" warning on Phase 3 exists because seccomp and MemoryDenyWriteExecute failures are the ones that take a working daemon down outright (see doc 05).

## Verification habit

The source doc's Verify Score section closes the loop: after applying hardening, `systemd-analyze security yubiOS-agent.service` with a target below 4.0, and the highest-value directives for score movement are `PrivateTmp`, `ProtectSystem=strict`, `NoNewPrivileges`, `SystemCallFilter`, `ProtectKernelTunables`, and `MemoryDenyWriteExecute`. Note that those six span all three phases, so each phase should move the number.

Sources: source doc plus 10 dig results (2 high weight, 8 weak).
