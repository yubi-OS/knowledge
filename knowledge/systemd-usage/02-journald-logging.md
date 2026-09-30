# journald in Practice: Filtering, Storage, and Forwarding

journald is a binary, structured event store that collects kernel messages, syslog calls, native sd_journal records, service stdout/stderr, and audit records, and stamps every entry with metadata the daemon collects itself so it cannot be spoofed by the logging process. This doc covers the operator surface: enabling persistent storage, filtering with journalctl, tuning journald.conf for disk and rate limits, structured fields and boot/invocation IDs, and forwarding to syslog or a remote collector. All directive behavior is verified against the systemd 262 man pages unless marked version-sensitive.

## Where the journal lives: volatile vs persistent

journald writes to `/run/log/journal/<machine-id>/*.journal` when volatile, and `/var/log/journal/<machine-id>/*.journal` when persistent. `/run` is tmpfs, so volatile logs vanish at reboot. If a journal file is found corrupted or the daemon stops uncleanly, it is renamed with a `.journal~` suffix and a fresh file is started (systemd-journald.service(8)).

`Storage=` in `journald.conf` takes `volatile`, `persistent`, `auto`, or `none`. `auto` behaves like `persistent` if `/var/log/journal` exists and `volatile` otherwise; the directory's existence controls the mode. Distributions that ship `auto` and do not create `/var/log/journal` therefore boot with a volatile journal until you enable persistence (ArchWiki, jev 0.86). Per-user journal files (`journalctl --user`) only work with persistent storage (journald.conf(5)).

journald always starts a boot writing to `/run`, then `systemd-journal-flush.service` moves data to `/var` when it becomes writable. Manually: `journalctl --flush` (or SIGUSR1 to the daemon). Flushing is idempotent per runtime. Note that switching `Storage=volatile` does not delete existing persistent data (journald.conf(5)).

Enable persistence:

```sh
sudo mkdir -p /var/log/journal
sudo systemd-tmpfiles --create --prefix /var/log/journal
sudo journalctl --flush
journalctl --disk-usage   # confirm
```

Access control: journal files are owned by the `systemd-journal` group; membership in `systemd-journal`, `adm`, or `wheel` grants read access to all files. Grant others with ACLs: `setfacl -Rnm g:wheel:rx,d:g:wheel:rx,g:adm:rx,d:g:adm:rx /var/log/journal/` (systemd-journald.service(8)).

## Filtering with journalctl

Matches are `FIELD=VALUE` arguments. Multiple matches on different fields are ANDed; multiple matches on the same field are ORed; a bare `+` word splits the command line into alternatives (logical OR of everything before and after) (journalctl(1)).

The everyday filters:

```sh
journalctl -u nginx.service                 # unit; repeatable; accepts globs
journalctl -u nginx.service -u varnish.service
journalctl -t kernel -t sshd                # SYSLOG_IDENTIFIER; repeatable
journalctl -b -1                            # previous boot; -b empty = current
journalctl --list-boots                     # boot indices, IDs, time ranges
journalctl -p err..alert                    # priority range; single level includes more-severe
journalctl -S "2026-09-29 18:00" -U "now"   # since/until; yesterday, today, -1h all valid
journalctl -u myapp -g "timeout|refused"    # PCRE grep over MESSAGE=
journalctl -k                               # kernel only (_TRANSPORT=kernel)
journalctl --facility=daemon,auth
```

Priority takes syslog levels 0 (emerg) through 7 (debug); a single level shows that level and everything more important (journalctl(1)). `--since`/`--until` accept systemd.time(7) syntax; `-o short-full` prints timestamps in exactly that format.

Raw field matching is the power tool: `journalctl _PID=1234 _UID=1000`, `_SYSTEMD_UNIT=foo.service`, `_EXE=/usr/sbin/sshd`. Passing an executable path as a positional argument adds an `_EXE=` or `_COMM=` match automatically. Discover what values exist with `journalctl -F _SYSTEMD_UNIT` (all values of a field) and `journalctl -N` (all field names).

Version-sensitive: `-I/--invocation=` and `--list-invocations` were added in systemd 257. An invocation ID identifies one run of a unit; `journalctl -u app.service --list-invocations` shows each start, and `-I 0` or `-I <32-char-ID>` shows that run's logs. `--cursor-file=FILE` (added 242) stores a read cursor so sequential invocations resume where the last one left off.

## Structured fields, machine ID, invocation IDs

Every entry carries trusted metadata fields (underscore-prefixed, set by the daemon: `_PID`, `_UID`, `_EXE`, `_COMM`, `_SYSTEMD_UNIT`, `_TRANSPORT`) plus trusted time fields (`__REALTIME_TIMESTAMP`, `__MONOTONIC_TIMESTAMP`) and correlation IDs: `_BOOT_ID` (32-character boot identifier) and `_SYSTEMD_INVOCATION_ID` (per-unit-start identifier). Apps can add their own fields, including `MESSAGE_ID` (a fixed 128-bit ID worth logging for events you want to grep across services) and arbitrary `FIELD=value` pairs up to 2^64-1 bytes (systemd-journald.service(8), journalctl(1)).

Inspect structure, not text:

```sh
journalctl -u myapp -o json-pretty           # full entry as JSON
journalctl -u myapp -o json-pretty --output-fields=MESSAGE,_PID,INVOCATION_ID
journalctl -o verbose                        # all fields, human layout
journalctl -o export > journal.export        # binary-safe stream for backup/transfer
```

JSON output encodes duplicate fields as arrays, non-UTF8 bytes as number arrays, and nulls fields over 4096 bytes unless `--all` is passed (journalctl(1)). Journal files are stored per machine ID (that `<machine-id>` path segment) and, with `SplitMode=uid` (the default), per regular user within persistent storage, which is how unprivileged users read only their own logs.

## Storage tuning in journald.conf

All options live in the `[Journal]` section; prefer drop-ins in `/etc/systemd/journald.conf.d/*.conf` over editing the main file. Defaults (journald.conf(5), systemd 262):

- `SystemMaxUse=` / `SystemKeepFree=`: cap journal disk use and reserve space for other uses; journald uses the smaller of the two. Defaults 10% and 15% of the filesystem, each capped at 4G. `RuntimeMaxUse=` / `RuntimeKeepFree=` are the equivalents for the volatile `/run` journal, which apply during early boot.
- `SystemMaxFileSize=`: per-file cap, default one eighth of `SystemMaxUse` capped at 128M, so about 7 rotated files form the visible history. `SystemMaxFiles=` defaults to 100.
- `MaxFileSec=1month`: time-based rotation (safety net against losing too much at once). `MaxRetentionSec=0`: time-based deletion, off by default; set it only for hard retention policies.
- `SyncIntervalSec=5min` for ERR-and-below; CRIT/ALERT/EMERG sync immediately.
- `Compress=yes` (default) compresses objects over 512 bytes. `Seal=yes` enables Forward Secure Sealing when keys exist (`journalctl --setup-keys`), making silent tampering detectable.

On-disk trimming works on archived files only, so `--vacuum-size` results are indirect relative to `--disk-usage`, which counts active files too:

```sh
journalctl --vacuum-size=500M
journalctl --vacuum-time=2weeks --vacuum-files=10
journalctl --rotate --vacuum-size=500M      # rotate first so active files are trimmed
```

## Rate limiting

`RateLimitIntervalSec=` and `RateLimitBurst=` default to 10000 messages in 30 seconds, applied per service, so one chatty unit does not exhaust another's budget. When a service exceeds the burst, further messages in the interval are dropped and one summary message records the count; either value set to 0 disables limiting. The effective burst is multiplied by a factor derived from free journal disk space (base 2 logarithm of available space: 1x at or under 1 MB free up to 6x at or under 1 TB), so a nearly full disk tightens limiting automatically (journald.conf(5)).

Per-unit overrides beat the global settings: `LogRateLimitIntervalSec=` and `LogRateLimitBurst=` in the unit file. For a noisy but trusted service, `systemctl edit myapp.service` then `[Service] LogRateLimitIntervalSec=0` disables the per-unit limiter without touching global policy (OneUptime, jev 0.75).

## Forwarding to syslog and beyond

Two paths exist (journald.conf(5)):

1. Socket forwarding: `ForwardToSyslog=yes` sends records to `/run/systemd/journal/syslog` in real time. If nothing reads that socket, forwarding silently does nothing. Modern rsyslog/syslog-ng instead run as journal clients reading the files directly, so for them `Storage=` matters and `ForwardToSyslog=` is irrelevant.
2. Remote collection: `ForwardToSocket=` takes an AF_INET, AF_INET6, AF_UNIX, or AF_VSOCK address (for example `192.168.0.11:4444` or `vsock:2:1234`), sends the Journal Export Format including `__REALTIME_TIMESTAMP`, and pairs with `systemd-journal-remote` on the receiving end (journal-remote.conf(5) configures the receiver). Also settable via the `journal.forward_to_socket` credential (added 256, version-sensitive).

Default is only `ForwardToWall=yes`; kernel-command-line overrides exist for each switch (`systemd.journald.forward_to_syslog=`, and `max_level_*` for the per-target level caps). Forwarding runs synchronously inside journald: a hung console (common for slow virtual serial ports in clouds) blocks journald and therefore every service logging to it. Prefer a `journalctl -f` service over `ForwardToConsole=yes` in production. Forwarding to kmsg needs a large kernel buffer (`log_buf_len=8M`); journald sets `printk.devkmsg=on` automatically for that target (journald.conf(5)).

## Gotchas

- Reboot wipes `/run`: verify persistence with `journalctl --list-boots` showing more than one boot.
- Vacuum only touches archived files; a huge active file needs `--rotate` first.
- `Storage=none` drops all data but still forwards; a syslog daemon reading the journal directly then has nothing to read.
- `MaxLevelStore` defaults to `debug`: everything is stored; cap noise with per-unit rate limits or `MaxLevelStore=info` rather than assuming debug is dropped.

## Sources considered

Used:

- https://www.freedesktop.org/software/systemd/man/latest/journalctl.html (primary, man page, fetched directly)
- https://www.freedesktop.org/software/systemd/man/latest/journald.conf.html (primary, man page, fetched directly)
- https://www.freedesktop.org/software/systemd/man/latest/systemd-journald.service.html (primary, man page, fetched directly)
- https://www.freedesktop.org/software/systemd/man/latest/journal-remote.conf.html (primary, man page, fetched directly)
- https://wiki.archlinux.org/title/Systemd/Journal (jev 0.86, distro-default volatile-journal claim)
- https://oneuptime.com/blog/post/2026-01-15-manage-systemd-journal-size-ubuntu/view (jev 0.75, per-service rate-limit override pattern)

Rejected: computingforgeeks.com (aggregator), digitalocean.com (tutorial duplicating man content, jev 0.18), gist.github.com JPvRiel (unofficial snippet, jev 0.33), oneuptime Ubuntu persistent-logging post (aggregator-grade, jev 0.17), cubepath.com (marketing docs, jev 0.16), medium.com linuxgd (aggregator, jev 0.14), elastic.co (off-topic tooling, jev 0.14), massivegrid.com (aggregator, jev 0.21), rootusers.com (stale, 2016, jev 0.18), access.redhat.com (paywalled partial, jev 0.18).
