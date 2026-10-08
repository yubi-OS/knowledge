# Privilege and Capability Control

Scope: the privilege strip-down half of the yubiOS template: NoNewPrivileges, empty CapabilityBoundingSet and AmbientCapabilities, DynamicUser, RemoveIPC, PrivateDevices, plus the capability reference table for adding back only what a service needs.

## Source-doc position

The yubiOS skill (source doc: yubi-OS/yubiOS skills/systemd-hardening/SKILL.md) puts these lines in every unit:

```ini
NoNewPrivileges=yes
CapabilityBoundingSet=
AmbientCapabilities=
DynamicUser=yes
RemoveIPC=yes
PrivateDevices=yes
```

Phase 2 of the incremental approach groups NoNewPrivileges, CapabilityBoundingSet, DynamicUser, and RemoveIPC as "usually safe".

## NoNewPrivileges

`NoNewPrivileges=yes` sets the kernel-level nnp flag so the service process and all descendants can never gain privileges through setuid/setgid binaries or file capabilities. It is the single most cross-cutting privilege control in the template: it converts a one-time exploit into a sandbox-contained exploit. The dig found no contradicting source; the directive is uncontroversial across every hardening guide surveyed (weak sources 0.21, https://blog.gntech.me/posts/2026-05-24-systemd-service-hardening-linux/; 0.16, https://linuxjunkies.org/guides/lock-down-systemd-services).

## CapabilityBoundingSet and AmbientCapabilities

An empty `CapabilityBoundingSet=` drops all Linux capabilities from the unit; `AmbientCapabilities=` (also empty) controls which capabilities are passed into the user session. The ArchWiki sandboxing page (high weight 0.62, https://wiki.archlinux.org/title/Systemd/Sandboxing) recommends always setting the two together and notes that `systemd-analyze capability` lists the capabilities systemd knows, which is useful when a service starts failing after the strip-down.

The source doc's rule: start with both empty and add back only what breaks. Its capability reference table maps the common ones:

| Capability | When needed |
|---|---|
| CAP_NET_BIND_SERVICE | Bind ports below 1024 |
| CAP_NET_ADMIN | Network interface configuration |
| CAP_SYS_PTRACE | Debugging other processes |
| CAP_CHOWN | chown files |
| CAP_DAC_OVERRIDE | Bypass file permissions |
| CAP_SETUID, CAP_SETGID | UID/GID changes |

A weak-backed settings page (0.32, https://linux-audit.com/systemd/settings/units/capabilityboundingset/) confirms CapabilityBoundingSet is a standard item in common hardening profiles that need only minimal tuning.

## DynamicUser

`DynamicUser=yes` allocates an ephemeral UID/GID at start and releases it at stop. The design rationale comes from the dynamic users write-up (high weight 0.86, https://0pointer.net/blog/dynamic-users-with-systemd.html): system users allocated on the fly make the classic UNIX security concept cheaper to apply everywhere. A weak-backed comparison thread (0.12, https://unix.stackexchange.com/questions/635027/systemd-dynamicuser-vs-user) contrasts the static `User=` model and notes that with a dynamic user, `RemoveIPC=yes` matters more: all System V and POSIX IPC objects owned by the unit's user are removed when the unit stops.

## RemoveIPC and PrivateDevices

`RemoveIPC=yes` cleans up System V and POSIX IPC objects owned by the service user when the unit stops (weak source, 0.31, https://linux-audit.com/systemd/settings/units/removeipc/, which dates the directive to systemd 232). `PrivateDevices=yes` gives the service a private `/dev` containing only pseudo-devices, cutting physical device and raw device-node access (weak source, 0.32, https://linux-audit.com/systemd/settings/units/privatedevices/). Both are in the source doc's IPC block because they pair naturally: the dynamic user owns transient IPC objects, and the private /dev removes the device attack surface a static root-owned service would keep.

## Add-back discipline

The template's philosophy is deny by default:

1. Ship the empty capability set and see what fails.
2. Read the failure; identify the exact capability.
3. Grant it via `AmbientCapabilities=` (not a suid helper or a broader user).
4. Re-score with `systemd-analyze security` and record why the grant exists.

This mirrors the source doc's "Start with CapabilityBoundingSet= (empty) and add back only what breaks."

## Composition with other yubiOS layers

The source doc's least-privilege section (cycle 5) positions this skill as the systemd-level least-privilege gate: it composes user-namespace isolation from the nspawn-containers skill and rootless container builds from the build skills. Concretely, a yubiOS service stack is: sandbox directives (this doc) at the unit layer, rootless builds for the image layer, and nspawn or portable services for anything needing a fuller environment.

Sources: source doc plus 8 dig results (3 high weight, 5 weak).
