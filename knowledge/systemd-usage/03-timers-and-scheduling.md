# systemd Timers and Scheduling

Timer units replace cron on systemd systems. A `.timer` unit says when to act; the paired `.service` unit says what to do. Realtime timers (`OnCalendar=`) fire on wall-clock dates, monotonic timers (`OnBootSec=`, `OnUnitActiveSec=` and friends) fire relative to boot or unit state, and `Persistent=` catches up on runs missed while the machine was off. Debugging is `systemctl list-timers` plus `systemd-analyze calendar`, and every firing lands in the journal, which is where cron's opacity ends [0.19].

## How timers and services couple

By default, `foo.timer` activates `foo.service`. You can point the timer at a different unit with `Unit=`, but the man page explicitly recommends keeping the two names identical except for the suffix. The timer gains an automatic `Before=` dependency on the unit it activates, so no ordering work is needed ([systemd.timer](https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html)).

Two consequences trip people up. First, if the target unit is already active when the timer elapses, it is not restarted; it is left running, so there is no second instance. That makes services with `RemainAfterExit=yes` unsuitable for repetitive timers, because they activate once and then stay active forever (systemd.timer). Second, a long-running service plus a short interval causes back-to-back triggers: the timer schedules the next elapse from the previous trigger time, and if that moment passed while the service was running, it fires immediately when the service finishes. Version-sensitive: `DeferReactivation=yes` (added in systemd 257) changes this for `OnCalendar=` timers so the next elapse waits for the next scheduled realtime time instead (systemd.timer).

Minimal pair:

```ini
# /etc/systemd/system/backup.timer
[Unit]
Description=Nightly backup

[Timer]
OnCalendar=*-*-* 03:00:00
Persistent=true
RandomizedDelaySec=30min

[Install]
WantedBy=timers.target
```

```ini
# /etc/systemd/system/backup.service
[Unit]
Description=Backup job

[Service]
Type=oneshot
ExecStart=/usr/local/bin/backup.sh
```

Enable the timer, not the service: `systemctl enable --now backup.timer`. Timer units get default `Requires=`/`After=` dependencies on `sysinit.target` and are ordered `Before=` `timers.target`, so `WantedBy=timers.target` is the standard install target (systemd.timer).

## OnCalendar: realtime scheduling

`OnCalendar=` takes calendar event expressions defined in systemd.time(7). The syntax is positional: day-of-week, then year-month-day, then hh:mm:ss. `*` matches any value, commas list values, `..` gives ranges, and `/` adds repetition relative to a start value ([systemd.time](https://www.freedesktop.org/software/systemd/man/latest/systemd.time.html)).

Normalized examples (all verifiable with `systemd-analyze calendar`, see below):

| Intent | OnCalendar value | Normalized form |
|---|---|---|
| Daily at 02:30 | `*-*-* 02:30:00` | same |
| Every 15 minutes | `*:0/15` | `*-*-* *:00,15,30,45:00` |
| Every Monday at midnight | `Mon *-*-* 00:00:00` | same |
| 1st of month, 00:00 | `*-*-01 00:00:00` | (the `monthly` shorthand) |
| Hourly | `hourly` | `*-*-* *:00:00` |
| Every year Feb 29 | `*-2-29 0:0:0` | `*-02-29 00:00:00` |

Shorthands exist: `minutely`, `hourly`, `daily`, `monthly`, `weekly`, `yearly`, `quarterly`, `semiannually`. Suffixes work too: `*-*-07` matches the 7th, `mon,fri *-1/2-1,3 *:30:45` matches the 1st and 3rd of every odd month at 00:30 and 14:30. The seconds field defaults to `:00` if omitted, and either the time or the date part may be dropped (`Wed, 17:48` normalizes to `Wed *-*-* 17:48:00`) (systemd.time).

The `~` marker means "count from the end of the month": `*-02~03` is the third-to-last day of February, and `Mon *-05~07/1` is the last Monday of May (systemd.time). This replaces cron's awkward `1-7` weekday-based last-Monday idiom; use it instead [0.03].

Calendar timers follow the system timezone, and a timer elapsed more than once while the system was suspended only results in one service activation on resume (systemd.timer). For UTC-fixed schedules, append `UTC` to the expression, which is accepted like a timestamp timezone (systemd.time).

## Monotonic timers: OnBootSec and OnUnitActiveSec

The monotonic family anchors to different events: `OnActiveSec=` (timer unit activated), `OnBootSec=` (machine booted; in containers mapped to `OnStartupSec=`), `OnStartupSec=` (service manager started, mainly useful in the user manager), `OnUnitActiveSec=` (target unit last activated), `OnUnitInactiveSec=` (target unit last deactivated) (systemd.timer).

The idiomatic "run 10 minutes after boot, then every hour" pattern combines two directives:

```ini
[Timer]
OnBootSec=10min
OnUnitActiveSec=1h
```

Monotonic timers ignore wall-clock time and timezones, so they are unaffected by clock corrections, but they pause during suspend; if `WakeSystem=true`, a different clock (`CLOCK_BOOTTIME`) is used that keeps advancing while suspended (systemd.timer).

## Persistent, AccuracySec, RandomizedDelaySec

`Persistent=true` stores the last trigger timestamp on disk and fires the service immediately on timer activation if a run would have been missed while the timer was inactive. It only affects `OnCalendar=` timers, and any `RandomizedDelaySec=` still applies to the catch-up trigger. Use `systemctl clean --what=state` on the timer before uninstalling it to remove the timestamp file (systemd.timer). Cron has no equivalent: a missed cron job is skipped silently, while a persistent timer runs it once at the next boot [0.72].

`AccuracySec=` defaults to 1 minute. The elapse time is placed somewhere in the window between the configured time and configured-time-plus-accuracy, at a host-stable randomized position, so the manager can coalesce wakeups and save power. Setting `AccuracySec=1us` buys precision at the cost of wakeups; the man page advises setting it as high as possible and as low as necessary (systemd.timer). A timer that consistently fires up to a minute late is usually working as designed, not broken [0.13].

`RandomizedDelaySec=` (default 0) adds a fresh random delay in `[0, value]` before each firing, which stretches identical timers across a fleet instead of letting them stampede a shared resource. `FixedRandomDelay=yes` (v247+) pins that draw per timer using the machine ID and unit name, and `RandomizedOffsetSec=` (v258+) applies a stable random offset that preserves the periodicity of `OnCalendar=` events across manager restarts, which matters for fleet-wide weekly schedules (systemd.timer). When both are set, the randomized delay is added first, then coalescing may shift the result further (systemd.timer).

## Debugging a timer that did not fire

1. **Check the schedule exists and compute next elapse:** `systemctl list-timers` lists in-memory timers ordered by next elapse, with `NEXT`, `LEFT`, `LAST`, `PASSED`, `UNIT`, and `ACTIVATES` columns ([systemctl](https://www.freedesktop.org/software/systemd/man/latest/systemctl.html)). Use `--all` to include inactive units. A timer missing from the list was never enabled or failed to load; check `systemctl status foo.timer`.
2. **Validate the calendar expression:** `systemd-analyze calendar '*-2-29 0:0:0'` prints the normalized form and `Next elapse`; add `--iterations=5` to see the next 5 occurrences ([systemd-analyze](https://www.freedesktop.org/software/systemd/man/latest/systemd-analyze.html)). This catches typos before they cost you a missed run.
3. **Read the journal:** every activation and its output is logged, so `journalctl -u backup.service -u backup.timer` shows both scheduling and execution, unlike cron where you chase mail logs [0.19].
4. **Recurring timers:** use `systemctl list-timers --iterations=N` to list several future trigger times and confirm the recurrence shape matches what you intended [0.13] (SUSE documents the `--iterations` switch for this purpose).
5. **Clock problems:** calendar timers fire at unexpected times if the realtime clock is wrong; on machines without a battery-backed RTC, enable `systemd-time-wait-sync.service` so timers are set up only after the clock is adjusted (systemd.timer).

## When cron still makes sense

Cron retains real advantages in specific cases. Its five-field syntax is denser for one-off expressions, `@reboot` maps to what timers express as `OnBootSec`, and per-user crontabs need no root and no unit file authoring [0.18]. Jobs that must run as arbitrary unprivileged users, or environments where per-user schedule self-service matters, fit cron's model better; complex expressions are harder to express in timer syntax alone, per the classic comparison thread [0.19]. If you need cron semantics on a systemd system but want journal integration, the `systemd-cron` package ships a `systemd-crontab-generator` that translates crontabs into transient timer units; note this is a separate project, not part of upstream systemd (its man page is not in the upstream set, which I verified by direct fetch returning 404). For anything requiring missed-run catch-up, dependency ordering, sandboxed services, or journal-based debugging, prefer timers [0.72].

## Sources considered

- https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html (primary, fetched directly, systemd 262)
- https://www.freedesktop.org/software/systemd/man/latest/systemd.time.html (primary, fetched directly)
- https://www.freedesktop.org/software/systemd/man/latest/systemctl.html (primary, list-timers section, fetched directly)
- https://www.freedesktop.org/software/systemd/man/latest/systemd-analyze.html (primary, calendar verb, fetched directly)
- https://www.freedesktop.org/software/systemd/man/latest/systemd-crontab-generator.html (fetched, 404, confirms not upstream)
- https://wiki.archlinux.org/title/Systemd/Timers (w=0.03, low-weight aggregator, not load-bearing)
- https://www.golinuxcloud.com/systemd-timers/ (w=0.18, used for cron vs timer feature contrast only)
- https://documentation.suse.com/smart/systems-management/html/systemd-working-with-timers/index.html (w=0.11, rejected for factual claims, low weight)
- https://blog.techiescamp.com/systemd-timers/ (w=0.89, rejected as redundant, every claim re-verified against man pages)
- https://linuxblog.io/systemd-timers-alternative-cron-linux/ (w=0.13, used for debugging and --iterations claims)
- https://unix.stackexchange.com/questions/278564/cron-vs-systemd-timers (w=0.19, used for journal visibility and complexity comparison)
- https://cronuru.com/guides/systemd-timers/ (w=0.13, rejected, corroborates AccuracySec default only)
- https://benzhub.github.io/en/post/linux/026-systemd-timer-vs-cron/ (w=0.21, rejected, not load-bearing)
