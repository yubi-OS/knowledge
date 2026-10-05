# Man Page Map: Finding the Right systemd Documentation Page

Scope: how the systemd manual set divides unit configuration between systemd.unit(5), systemd.service(5), systemd.exec(5), systemd.resource-control(5), systemd.kill(5) and systemd.directives(7), and how to route a hardening or service-design question to the correct page.

## Start at the index, not the search box

systemd.directives(7) is the canonical index of configuration directives. The man page describes itself as "an overview of all configuration directives supported by systemd and its related tools on Linux systems" (https://www.man7.org/linux/man-pages/man7/systemd.directives.7.html, weight 0.88; https://www.freedesktop.org/software/systemd/man/systemd.directives.html, weight 0.93). It indexes directives alphabetically by exact name, for example `Accept=` and `AcceptFileDescriptors=`, and links each one to the man page that documents it (https://www.freedesktop.org/software/systemd/man/systemd.directives.html, weight 0.93). Because directive names are unique across the whole manual set, the index is a reliable first hop: find the exact directive spelling in the index, follow the link, and you land on the section that governs it.

The index is broader than unit files. The man7 listing shows sections for unit directives, kernel command line options, SMBIOS type 11 variables, environment variables, system credentials, EFI variables, home area and user account directives, udev directives, network directives and journal fields (https://man7.org/linux/man-pages/man7/systemd.directives.7.html, weight 0.68; https://manpages.ubuntu.com/manpages/trusty/man7/systemd.directives.7.html, weight 0.79). So a question about a credential name or a journal field is also answerable through the same index.

## The five pages that split unit configuration

For a service, the manual splits configuration by what the setting governs. systemd.service(5) states this split explicitly: "Additional options are listed in systemd.exec(5), which define the execution environment the commands are executed in, and in systemd.kill(5), which define the way the processes of the service are terminated, and in systemd.resource-control(5), which configure resource limits" (https://www.freedesktop.org/software/systemd/man/251/systemd.service.html, weight 0.97; mirrored at https://manpages.ubuntu.com/manpages/focal/man5/systemd.service.5.html, weight 0.61).

The routing table for a hardening or service-design question is therefore:

| Question about | Man page |
|---|---|
| Common unit options, [Unit] and [Install] sections, dependencies, conditions | systemd.unit(5) |
| [Service] section: Type=, Exec* commands, restart policy | systemd.service(5) |
| Execution environment: user, capabilities, filesystem namespace, sandboxing, directories, credentials | systemd.exec(5) |
| Resource limits: memory, CPU, IO, tasks | systemd.resource-control(5) |
| Kill behavior: KillMode, KillSignal, timeouts | systemd.kill(5) |
| Where does a directive live at all | systemd.directives(7) |

systemd.exec(5) documents "the configuration options shared by these four unit types" (service, socket, mount and swap) (https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html, weight 0.96; https://www.freedesktop.org/software/systemd/man/systemd.exec.html, weight 0.92). This is why sandboxing directives set on a socket unit behave like those on a service unit: they come from one shared page rather than from each unit type page.

## Which copy of a man page to cite

Three mirrors of the same pages circulate, and it matters which one you link in an audit or design doc. freedesktop.org publishes the upstream trees, including a versioned tree such as /man/253/ and /man/247/ that is frozen at a release, and a /man/latest/ tree that tracks the newest release (https://www.freedesktop.org/software/systemd/man/253/systemd.directives.html, weight 0.94; https://www.freedesktop.org/software/systemd/man/247/systemd.exec.html, weight 0.89; https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html, weight 0.96). man7.org publishes per-release HTML of the man pages and is the copy most distro man-page indexes point at (https://www.man7.org/linux/man-pages/man5/systemd.unit.5.html, weight 0.70). Distro mirrors such as manpages.ubuntu.com serve the page version shipped by a specific distro release (https://manpages.ubuntu.com/manpages/trusty/man7/systemd.directives.7.html, weight 0.79), which can be years behind upstream behavior for a fast-moving directive. For hardening work, cite the freedesktop /man/latest/ or man7 copy, and note the systemd version the unit was written against, because sandboxing directives gain new values every release.

## Routing examples

Three concrete routings cover most hardening questions. A question about `ProtectSystem=` or `SystemCallFilter=` routes to systemd.exec(5) under its Security, Sandboxing and System Call Filtering sections (the man7 page lists those section headings directly: https://man7.org/linux/man-pages/man5/systemd.exec.5.html, weight 0.81). A question about why a unit will not reach "active" routes first to systemd.service(5) for Type= and sd_notify interplay, then to the sd_notify(3) page (https://www.freedesktop.org/software/systemd/man/latest/sd_notify.html, weight 0.94). A question about why a unit was OOM killed routes to systemd.resource-control(5) for MemoryMax= semantics and to systemd.kill(5) for what gets killed.

A final caution from the ecosystem: wiki and forum write-ups about sandboxing lag upstream and disagree at the edges. The ArchWiki sandboxing page is a useful survey but is community maintained (https://wiki.archlinux.org/title/Systemd/Sandboxing, weight 0.45, weak backing), so a directive's exact accepted values should always be confirmed against the man page the directives(7) index points to.
