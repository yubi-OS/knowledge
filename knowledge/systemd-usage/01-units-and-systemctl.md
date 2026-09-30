# Units and systemctl in Practice

Abstract: A systemd unit is a plain text ini-style file describing one manageable object: a service, socket, mount, timer, target, or one of the other unit types. Most operator confusion comes from mixing up three separate layers: the unit file on disk, the enablement symlinks in the unit configuration directory, and the in-memory runtime state of the manager. This doc covers the unit types, the file lookup order, what each systemctl verb actually writes or removes on disk, how WantedBy wiring works, and which states the manager reports for each layer.

## Unit types

Valid unit names end in one of these suffixes: .service, .socket, .device, .mount, .automount, .swap, .target, .path, .timer, .slice, or .scope. The name (including suffix) must not exceed 255 characters, and the prefix may contain ASCII letters, digits, and the characters ":", "-", "_", "." and "\" [systemd.unit(5), https://www.freedesktop.org/software/systemd/man/latest/systemd.unit.html].

Every unit file has a generic [Unit] section, a type-specific section (for example [Service], [Socket], [Timer]), and an [Install] section that is only consulted by enable/preset style commands [systemd.unit(5)]. The type-specific man pages (systemd.service(5), systemd.socket(5), systemd.timer(5), systemd.mount(5), and so on) define that middle section [systemd.unit(5)].

Two types deserve operator-level notes:

- Target units group other units and act as synchronization points. A target file has no type-specific section at all, and a target unit file must not be empty: an empty file is treated as a masked unit [systemd.target(5), https://www.freedesktop.org/software/systemd/man/latest/systemd.target.html].
- Timer units (systemd.timer(5), https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html) activate a paired service unit when their calendar or monotonic trigger fires. A timer on its own does nothing; the work lives in the matching .service file.

Unit names can be parameterized: a template file foo@.service spawns instances like foo@bar.service, and inside the file the instance string is available as the %i specifier. When systemd looks for foo@bar.service and finds no literal file, it falls back to the template foo@.service and instantiates from it [systemd.unit(5)].

## Where systemd looks: unit file load path

Unit files are loaded from a fixed set of directories, and files in directories listed earlier override same-named files lower down [systemd.unit(5)]. In system mode the order is:

1. /etc/systemd/system.control, /run/systemd/system.control (dbus-created persistent and transient configuration)
2. /run/systemd/transient (transient units created at runtime)
3. /run/systemd/generator.early
4. /etc/systemd/system (units created by the administrator)
5. /run/systemd/system (runtime units)
6. /run/systemd/generator
7. /usr/local/lib/systemd/system (units installed by the administrator)
8. /usr/lib/systemd/system (units installed by the distribution package manager)
9. /run/systemd/generator.late

[systemd.unit(5), Unit File Load Path section]. The $SYSTEMD_UNIT_PATH environment variable can override the whole list [systemd.unit(5)]. The practical takeaway: to override a vendor unit, drop a same-named file in /etc/systemd/system, which beats /usr/lib/systemd/system. User mode has a parallel list starting at ~/.config/systemd/user.control and ~/.config/systemd/user [systemd.unit(5)]. The exact effective list can be printed with systemd-analyze --user unit-paths [systemd.unit(5)].

Distinguish three symlink categories inside these directories [systemd.unit(5)]:

- Alias: a symlink whose target stays inside the unit load path. The unit gains an extra name. Aliases can also be declared via Alias= in [Install].
- Linked unit file: a symlink pointing outside the load path. Use systemctl link for this; the referenced filesystem must be available at boot, so paths under /home/ or /var/ are not allowed unless on the root filesystem.
- Mask: a symlink to /dev/null, which makes the unit unstartable (see below).

## What each systemctl verb changes on disk

This is the core mental model: enable/disable/mask operate on symlinks, not processes. start/stop/restart operate on the running manager. Enabling and starting are explicitly orthogonal: a unit can be enabled but stopped, or started but disabled [systemctl(1), https://www.freedesktop.org/software/systemd/man/latest/systemctl.html].

- systemctl enable foo.service: creates the symlinks encoded in the unit's [Install] section (typically /etc/systemd/system/multi-user.target.wants/foo.service pointing at the unit file). It then reloads manager configuration equivalent to daemon-reload so the change is effective immediately, but it does NOT start the unit. Combine with --now to also start it. For instance enablement (foo@bar.service), the created symlink is named for the instance but points at the single template file. If the unit file lives outside the usual directories, enable adds a link into the unit configuration path [systemctl(1), Unit File Commands].
- systemctl disable foo.service: removes ALL symlinks to that unit file from the unit configuration directory, including manually created ones, not only those enable made. So disable can remove more symlinks than a prior enable created; the two commands are not symmetric. It also reloads the config, and does not stop the running unit unless you pass --now. Disabling additionally processes any Also= entries in [Install] [systemctl(1)]. If triggering units (for example a target that wants it) are still active, disable prints a warning naming them [systemctl(1)].
- systemctl mask foo.service: creates a symlink named foo.service under /etc/systemd/system (or /run/systemd/system with --runtime) pointing to /dev/null, making every activation path fail, including manual start and enable. This is a stronger form of disable. Note the failure mode: mask fails if a file with that name already exists in /etc/systemd/system or /run/systemd/system, so masking works reliably for vendor units in /usr/lib/systemd/system but often fails for locally created units that already live in /etc/systemd/system [systemctl(1), mask]. This matches the load-path rule above: the masked name in /etc shadows the /usr copy.
- systemctl unmask: removes that /dev/null link [systemctl(1)].
- systemctl reenable: disable followed by enable, resetting the symlinks to what [Install] specifies [systemctl(1)].
- systemctl preset / preset-all: applies the enable/disable policy from the preset policy files (/etc/systemd/system-preset/, per systemd.preset(5)), the mechanism distributions use to decide what is on by default. preset-all exists since version 215 [systemctl(1)]. On Arch-like systems you can ship a default-enable policy by creating a symlink under /etc/systemd/system-preset/ [ArchWiki, 0.93, https://wiki.archlinux.org/title/Systemd].
- systemctl daemon-reload: reruns all generators, reloads unit files, and rebuilds the dependency tree. Do this after hand-editing files or hand-placing symlinks; enable/disable do it for you [systemctl(1), Manager State Commands].

None of enable, disable, or mask touches [Install] data at runtime: systemd does not look at the [Install] section during normal operation at all, it only matters when enable-style commands create the symlinks [systemd.unit(5)].

## WantedBy and dependency wiring

WantedBy=multi-user.target in [Install] is the standard hook. During enable, systemd creates /etc/systemd/system/multi-user.target.wants/foo.service, and a .wants/ directory next to a unit implicitly adds Wants= dependencies for everything symlinked into it; .requires/ works the same way with the stronger Requires= dependency type [systemd.unit(5)]. The Red Hat systemd guide describes the same three-directory model (admin, runtime, vendor) and recommends the [Install] plus enable route as the preferred way to create those symlinks [Red Hat RHEL 9 docs, 0.93, https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/using_systemd_unit_files_to_customize_and_optimize_your_system/assembly_working-with-systemd-unit-files_working-with-systemd].

Two distinctions operators keep getting wrong [unix.stackexchange.com, 0.95, https://unix.stackexchange.com/questions/503679/systemd-unit-file-wantedby-and-after]:

- Wants=/Requires= control whether units get pulled in. After=/Before= control ordering only. They are independent and orthogonal: ordering without a dependency does nothing if the unit is not otherwise pulled in, and a dependency without ordering starts units in parallel.
- WantedBy= (in [Install], effective at enable time) is the inverse-direction counterpart of Wants= (in [Unit], effective at runtime). Putting Wants=foo.service in some.target's [Unit] section and enabling foo.service with WantedBy=some.target achieve the same graph, but the enable route is what survives package updates and preset policies [unix.stackexchange.com, 0.91, https://unix.stackexchange.com/questions/506347/why-do-most-systemd-examples-contain-wantedby-multi-user-target].

Target selection matters. multi-user.target is the non-graphical system target pulled in by graphical.target, and units needed on a multi-user system should set WantedBy=multi-user.target [systemd.special(7), https://www.freedesktop.org/software/systemd/man/latest/systemd.special.html]. Do not use WantedBy=default.target: default.target is an alias to multi-user.target or graphical.target, and vendor guidance says to use the regular targets so units also run on special boots like emergency or system-update boots [systemd.special(7)]. default.target is normally aliased to one of those targets, and can be switched with systemctl set-default or systemd.unit= on the kernel command line [systemd.special(7)].

Targets get one automatic ordering behavior worth knowing: unless DefaultDependencies=no, a target automatically complements its Wants=/Requires= dependencies with After=, so a unit enabled into multi-user.target is ordered after it. The reverse does not hold: Wants=that.target inside some.service does not create After=that.target; you must state ordering explicitly in the dependent unit [systemd.target(5)].

## Lifecycle states

systemctl reports three layers at once in list-units output: LOAD (loaded, not-found, bad-setting, error, masked), ACTIVE (the high-level state), and SUB (the type-specific detail state, for example "running" for a started service or "waiting" for an idle timer) [systemctl(1), Unit Commands]. ACTIVE states: active, inactive, failed (inactive but the unit failed: nonzero exit, crash, timeout, or too many restarts), activating, deactivating, plus newer states added over time: maintenance (inactive, maintenance operation in progress) and refreshing (active, new mount being activated in its namespace). The state list is not constant across releases; systemctl --state=help prints the set your manager supports [systemctl(1)] (maintenance and refreshing are recent additions; verify against your release).

A separate vocabulary describes enablement, reported by systemctl is-enabled and list-unit-files: enabled, enabled-runtime, linked, linked-runtime, alias, masked, masked-runtime, static (no [Install] section at all, cannot be enabled), indirect, disabled, generated, transient, bad, not-found [systemctl(1), is-enabled table]. Generated and transient units cannot be enabled directly; they are enabled implicitly by whatever created them [systemctl(1)]. Static units (for example many socket-activated services) are perfectly functional: they get pulled in by their trigger, they just cannot be enabled into a target.

The manager garbage-collects unit state: once a unit is no longer referenced by a dependency, running process, pending job, or failed-state pin, its configuration and state are unloaded and execution results (exit codes, statistics) are lost except for what is in the journal [systemd.unit(5), Unit Garbage Collection].

## Quick operator checklist

- Install a unit under /etc/systemd/system, run systemctl daemon-reload, then systemctl enable --now foo.service.
- Override a vendor unit: create /etc/systemd/system/foo.service (shadows /usr/lib) or better, drop-ins in foo.service.d/*.conf, then daemon-reload.
- Prevent a vendor unit from ever starting, even by dependency: systemctl mask foo.service.
- Diagnose a unit that "will not enable": check is-enabled output (static units have no [Install]), and remember mask beats enable (enabling a masked unit is an error) [systemctl(1)].

## Sources considered

- systemd.unit(5), https://www.freedesktop.org/software/systemd/man/latest/systemd.unit.html (primary, fetched directly with omni-agent/1.0 user agent)
- systemctl(1), https://www.freedesktop.org/software/systemd/man/latest/systemctl.html (primary, fetched directly)
- systemd.target(5), https://www.freedesktop.org/software/systemd/man/latest/systemd.target.html (primary, fetched directly)
- systemd.special(7), https://www.freedesktop.org/software/systemd/man/latest/systemd.special.html (primary, fetched directly)
- systemd.timer(5), https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html (primary, fetched directly)
- Red Hat RHEL 9: Working with systemd unit files, https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/using_systemd_unit_files_to_customize_and_optimize_your_system/assembly_working-with-systemd-unit-files_working-with-systemd (0.93)
- ArchWiki systemd, https://wiki.archlinux.org/title/Systemd (0.93)
- unix.stackexchange.com WantedBy/After question, https://unix.stackexchange.com/questions/503679/systemd-unit-file-wantedby-and-after (0.95)
- unix.stackexchange.com WantedBy=multi-user.target question, https://unix.stackexchange.com/questions/506347/why-do-most-systemd-examples-contain-wantedby-multi-user-target (0.91)
- unix.stackexchange.com Wants vs WantedBy, https://unix.stackexchange.com/questions/579068/best-practice-for-wants-vs-wantedby-in-systemd-unit-files (0.21, rejected: low weight)
- DigitalOcean systemd units tutorial, https://www.digitalocean.com/community/tutorials/understanding-systemd-units-and-unit-files (0.50, rejected: aggregator tutorial)
- linuxblog.io systemd services guide, https://linuxblog.io/systemd-writing-managing-troubleshooting/ (0.94, rejected: blog duplicates man page content, not needed)
- Wikipedia systemd, https://en.wikipedia.org/wiki/Systemd (0.19, rejected: low weight)
