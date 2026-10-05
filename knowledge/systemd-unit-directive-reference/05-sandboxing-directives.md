# Sandboxing Directives: the systemd.exec Security Surface

Scope: the systemd.exec(5) sandboxing directives, grouped by mechanism (filesystem, identity, capabilities, syscalls, network, kernel interfaces, /proc, devices, memory), the audit tooling, and a hardened baseline.

## One page, one enforcement model

All sandboxing directives live in systemd.exec(5), which "lists the configuration options shared by these four unit types" (service, socket, mount, swap) (https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html, weight 0.96; https://www.freedesktop.org/software/systemd/man/systemd.exec.html, weight 0.92; https://man7.org/linux/man-pages/man5/systemd.exec.5.html, weight 0.81). Its section headings structure the surface: Implicit Dependencies, Paths, User/Group Identity, Capabilities, Security, Mandatory Access Control, Process Properties, Scheduling, Sandboxing, System Call Filtering, Environment and Logging (https://man7.org/linux/man-pages/man5/systemd.exec.5.html, weight 0.81). Most filesystem sandboxing is implemented as mount namespaces: the versioned 247 page groups PrivateMounts=, PrivateTmp=, PrivateDevices=, ProtectSystem=, ProtectHome=, ReadOnlyPaths=, InaccessiblePaths= and ReadWritePaths= as settings that "enable file system namespacing in a fashion equivalent to this option" (https://www.freedesktop.org/software/systemd/man/247/systemd.exec.html, weight 0.89).

## Filesystem and identity

ProtectSystem= mounts /usr, /boot and /efi read-only at strict, adding /etc at full. ProtectHome= hides or mounts tmpfs over /home, /root and /run/user. PrivateTmp= gives the service its own tmpfs on /tmp and /var/tmp, with the disconnected mode (v255 and later) removing even the shared-tmp interop. The allowlist counterpart is ReadWritePaths=, used with ProtectSystem=strict to reopen exactly the paths a service must write (directive semantics per systemd.exec(5), https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html, weight 0.96).

For identity, DynamicUser=yes allocates a transient user "the instant the service binary is invoked" and releases it when the service stops, instead of requiring an /etc/passwd entry (https://0pointer.net/blog/dynamic-users-with-systemd.html, weight 0.77). DynamicUser implies the StateDirectory= and RuntimeDirectory= ownership machinery; see the credentials-directories doc in this corpus.

## Privileges and syscalls

NoNewPrivileges=yes applies the no_new_privs bit so the process cannot gain privileges through setuid binaries or file capabilities. CapabilityBoundingSet= masks the capability set, with `~CAP_SYS_ADMIN` removing a capability and a bare list restricting to exactly those capabilities; AmbientCapabilities= grants a capability to the main process, for example CAP_NET_BIND_SERVICE for a non-root listener (semantics per systemd.exec(5), https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html, weight 0.96).

SystemCallFilter= installs a seccomp BPF filter. The `~` prefix blacklists a syscall group, for example `~@clock @reboot @debug`, and a filtered syscall terminates the process, so the filter must be tested against real code paths (semantics per systemd.exec(5), https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html, weight 0.96).

## Kernel interfaces, network, /proc, devices, memory

The kernel-interface family removes write access to host surfaces: ProtectKernelModules=yes denies CAP_SYS_MODULE, ProtectKernelTunables=yes mounts /proc/sys and /sys read-only, ProtectControlGroups=yes makes /sys/fs/cgroup read-only, LockPersonality=yes prevents ABI personality switching, RestrictRealtime=yes denies real-time scheduling, and RestrictNamespaces=yes denies namespace creation or restricts it by type. On the network side, PrivateNetwork=yes puts the service in a private network namespace with loopback only, and RestrictAddressFamilies= allowlists socket families such as AF_UNIX AF_INET AF_INET6. For process visibility, ProtectProc=invisible hides other users' /proc entries and ProcSubset=pid exposes only process-related /proc files. PrivateDevices=yes swaps the full /dev for a minimal one without physical devices; MemoryDenyWriteExecute=yes denies mappings that are writable and executable at once (all semantics per systemd.exec(5), https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html, weight 0.96).

## Scoping limits and audit tooling

Sandboxing is not all-or-nothing: "since hardening/sandboxing effectively restricts an application, it is not possible to use all the sandboxing directives. A web server for example should not use PrivateNetwork=true since it usually needs network access" (https://wiki.archlinux.org/title/Systemd/Sandboxing, weight 0.45, weak backing). There is also a hard boundary: user units (systemd --user) cannot be sandboxed as thoroughly because of privilege escalation constraints, a limitation that does not affect system units with a User= set (https://wiki.archlinux.org/title/Systemd/Sandboxing, weight 0.29, weak backing).

Two tools close the audit loop. systemd-analyze security generates "a score for the unit showing all the unsafe usages" (https://wiki.archlinux.org/title/Systemd/Sandboxing, weight 0.45, weak backing; also https://docs.rockylinux.org/10/guides/security/systemd_hardening/, weight 0.45, weak backing). But presence is not enforcement: the systemd-sandbox-check project notes that "systemd-analyze security checks which hardening directives are present in a unit file" and instead starts a transient unit with the same [Service] properties and runs an enforcement battery (https://github.com/manfred-kaiser/systemd-sandbox-check, weight 0.16, weak backing). For yubiOS evidence chains, that distinction between declared and enforced matters.

## Hardened baseline

The yubiOS baseline combo for long-running services (internal source: yubiOS systemd reference, session/refs-mint/refs_corpus/systemd-unit-directive-reference-2026-07-23.md):

```ini
PrivateTmp=yes
ProtectSystem=strict
ProtectHome=yes
DynamicUser=yes
NoNewPrivileges=yes
SystemCallFilter=~@mount @reboot @debug
CapabilityBoundingSet=
ProtectKernelModules=yes
ProtectKernelTunables=yes
ProtectControlGroups=yes
LockPersonality=yes
RestrictRealtime=yes
MemoryDenyWriteExecute=yes
RestrictAddressFamilies=AF_UNIX AF_NETLINK
```

The order of operations when hardening an existing unit is: score it with systemd-analyze security, apply directives in waves through a drop-in, and read the exact denial out of the journal when the service stops starting, because with SystemCallFilter= the first boot after tightening usually finds the syscall the daemon actually needs (https://stackharbor.com/en/knowledge-base/systemd-service-sandboxing-hardening/, weight 0.12, weak backing; https://www.h2security.io/secure/systemd-service-sandboxing/, weight 0.05, weak backing).
