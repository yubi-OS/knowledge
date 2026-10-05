# systemd unit hardening: the directive family that bounds runtime privilege

## Scope

The systemd sandboxing directives that implement runtime privilege minimisation, focused on ProtectSystem, NoNewPrivileges, and CapabilityBoundingSet, with the surrounding directive family that a hardened unit ships with.

## How enforcement works

systemd provides extensive sandboxing through its execution-context structure, which encodes security restrictions applied to service processes; these restrictions are configured via unit file directives and enforced during process invocation in the child process before executing the actual service binary (DeepWiki systemd analysis, https://deepwiki.com/systemd/systemd/8.2-process-sandboxing-and-isolation). Enforcement happens before the service code runs, so the boundary is set by the unit, not by the program's own good behaviour.

## The core directive family

A widely circulated hardening pattern composes the directives as a set (ageis gist, https://gist.github.com/ageis/f5595e59b1cddb1513d1b425a323db04):

NoNewPrivileges=yes PrivateTmp=yes PrivateDevices=yes DevicePolicy=closed ProtectSystem=strict ProtectHome=read-only ProtectControlGroups=yes ProtectKernelModules=yes ProtectKernelTunables=yes RestrictAddressFamilies=AF_UNIX AF_INET AF_INET6 AF_NETLINK RestrictNamespaces=yes ...

The 3 directives named in the source decision each play a distinct role:

- ProtectSystem=strict mounts the entire filesystem hierarchy read-only except the API subtrees, closing write access to /usr and system paths.
- NoNewPrivileges=yes blocks the process and its children from gaining privileges through exec of setuid binaries or file capabilities, which fences the 2-helper setuid residue of the rootless model at the unit boundary.
- CapabilityBoundingSet= sets the capability ceiling at spawn; combined with the kernel rule that only init may set capabilities in the bounding set and privileged processes may only clear from it (manpages.ubuntu.com, https://manpages.ubuntu.com/manpages/bionic/man7/capabilities.7.html), the unit's capability floor only narrows over its lifetime.

Guides covering the same family add SystemCallFilter, PrivateTmp, and ProtectHome as standard companions (Linux Junkies, https://linuxjunkies.org/guides/lock-down-systemd-services; mylinux.work, https://mylinux.work/guides/systemd-hardening/). Real-world hardened units show the same vocabulary in production shapes, for example CapabilityBoundingSet=CAP_NET_BIND_SERVICE with NoNewPrivileges=true, RestrictNamespaces=true, RestrictAddressFamilies=~AF_UNIX (artemis.sh, https://artemis.sh/2023/02/22/hosting-your-own-breezewiki-with-caching.html).

## Scope limits

The ArchWiki documents the asymmetry: system service units can be hardened and sandboxed, while user units cannot be hardened or sandboxed properly for technical and security reasons, because doing so would enable privilege escalation issues; this does not affect system units which use the User= directive (ArchWiki systemd/Sandboxing, https://wiki.archlinux.org/title/Systemd/Sandboxing). A privilege-minimisation design therefore concentrates its hardening in system units with an explicit User=, rather than spreading it across user units that cannot hold the same guarantees.

## The isolation boundary

These directives are the privilege half of the picture: they bound what the process can do. Filesystem visibility rules, namespace restrictions, and network family restrictions are the isolation half (what the process can see). Both are needed; hardening only one leaves the other open.
