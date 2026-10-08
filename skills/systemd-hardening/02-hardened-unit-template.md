# Hardened Unit Template

Scope: the full hardened service unit template from the yubiOS skill: service type and watchdog behavior, the dynamic user, the managed directory trio, and the Install wiring.

## Source-doc position

The yubiOS skill (source doc: yubi-OS/yubiOS skills/systemd-hardening/SKILL.md) ships one canonical template at `/etc/systemd/system/yubiOS-agent.service`. Its skeleton: `Type=notify`, `ExecStart` plus `ExecReload=/bin/kill -HUP $MAINPID`, `Restart=on-failure`, `RestartSec=5s`, `WatchdogSec=30s`, `NotifyAccess=main`, `DynamicUser=yes`, the directory trio (`StateDirectory=yubiOS-agent`, `RuntimeDirectory=yubiOS-agent`, `RuntimeDirectoryMode=0700`, `ConfigurationDirectory=yubiOS`), and `WantedBy=multi-user.target` in `[Install]`.

## Type=notify and the notify socket

`Type=notify` means the service announces readiness through the sd_notify socket instead of systemd guessing from process state. The systemd-notify man page (high weight 0.94, https://www.man7.org/linux/man-pages/man1/systemd-notify.1.html) documents the companion tool that services and wrappers use to send those notifications. `NotifyAccess=main` restricts which processes may talk to that socket; the Rust binding docs summarize the upstream semantics (weight 0.68, https://docs.rs/systemd_unit/latest/systemd_unit/service/enum.NotifyAccess.html): access opens only when `Type=notify` or `WatchdogSec=` is in use, and the values range from main process only to all control-group members. The source doc picks `main`, the tightest setting, which fits the sandbox posture: a compromised child should not be able to spoof readiness or watchdog pings.

## Watchdog semantics

`WatchdogSec=30s` tells the manager to expect keep-alive notifications every 30 seconds and to kill and restart the service if they stop (weak source, 0.23, https://hanneseichblatt.de/posts/systemd-watchdog/). Combined with `Restart=on-failure` and `RestartSec=5s`, the template self-heals a hung service within roughly 35 seconds. The source doc pairs all three lines deliberately; dropping the watchdog without removing the notify expectation leaves the unit half-wired.

## DynamicUser

`DynamicUser=yes` allocates an ephemeral UID/GID per start instead of a static system user. Lennart Poettering's dynamic users write (high weight 0.86, https://0pointer.net/blog/dynamic-users-with-systemd.html) explains the design goal: system users allocated on the fly, cheaper and less persistent than provisioned accounts. For a sandboxed service this is the least-privilege floor; see doc 04 for the capability pairing.

## The directory trio

The `*Directory=` directives create per-service directories owned by the runtime user, named after the unit. The upstream systemd.exec man page (high weight 0.96, https://www.freedesktop.org/software/systemd/man/systemd.exec.html) states that units with `RuntimeDirectory=`, `StateDirectory=`, `LogsDirectory=`, `CacheDirectory=`, or `ConfigurationDirectory=` automatically gain `Requires=` and `After=` dependencies on the mount units backing them. Red Hat's guide (high weight 0.79, https://www.redhat.com/en/blog/systemd-secure-services) adds the practical effect: the user owns those directories, and the runtime directory is recreated per start, which is why the template can run with an ephemeral user yet keep state across restarts. `RuntimeDirectoryMode=0700` (weak source, 0.31, https://linux-audit.com/systemd/settings/units/runtimedirectorymode/) locks the runtime directory to the service user, matching the source doc's choice.

`StateDirectory=yubiOS-agent` puts writable state under `/var/lib/yubiOS-agent`; the same path reappears in `ReadWritePaths=` (doc 03), which is the coordination point between directory management and filesystem isolation.

## Install and dependency wiring

`WantedBy=multi-user.target` in `[Install]` wires enablement to the standard multi-user boot point. The template's `[Unit]` section adds `After=network.target` and `Requires=network.target`, following the source doc exactly; note that the automatic dependencies from the directory directives are separate from these explicit ones.

## Adaptation notes

The template is the yubiOS default, not a universal answer:

- Keep `Type=notify` only for services that actually speak sd_notify; otherwise switch type deliberately and drop the watchdog expectation consistently.
- Keep `NotifyAccess=main` unless a helper process must send notifications; widen consciously.
- The directory names derive from the unit name; renaming a unit means renaming its state and runtime paths and migrating data.

Every line above is from the source doc except where a dig source with its weight is named. No contradicting evidence surfaced in the dig.

Sources: source doc plus 7 dig results (6 high weight, 1 weak).
