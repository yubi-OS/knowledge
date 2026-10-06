# 04 - Filesystem semantics: /usr, /etc, /var, /opt

Scope: where content lives in a bootc system, what survives an upgrade, and how to avoid the drift patterns that break deployments.

## The four-tier split

The source doc (yubi-OS/yubiOS skills/bootc-images/SKILL.md) defines the mapping, and the upstream filesystem documentation confirms it (bootc.dev/bootc/filesystem.html, w=0.85; docs.fedoraproject.org/en-US/bootc/filesystem/, w=0.94):

| Tree | Semantics | Survives upgrade |
|---|---|---|
| /usr | Immutable OS image content | Yes, replaced wholesale |
| /etc | Machine config, 3-way merged | Yes, merged |
| /var | Persistent data, VOLUME semantics | Yes, untouched |
| /run, /tmp | Runtime and temp state | No, ephemeral |

Fedora's filesystem doc adds the /usr/etc concept: "The /usr/etc tree is generated client side and contains the default container image's view of /etc" (bootc.dev/bootc/filesystem.html, w=0.85). Files the image wants in /etc ship in /usr/etc; the boot-time merge composes them with machine-local changes.

## /usr is the image

Everything the OS ships goes in /usr: binaries, libraries, systemd units, sysusers.d, tmpfiles.d. With composefs enabled (doc 03) the booted /usr is read-only by construction, not by convention. The source doc's rule for config: "Prefer /usr over /etc for config that doesn't need to be machine-local." Units belong in /usr/lib/systemd/system, user definitions in /usr/lib/sysusers.d, tmpfiles rules in /usr/lib/tmpfiles.d (source doc).

## /etc and the 3-way merge

On each upgrade, OSTree performs a 3-way merge: the new image's /etc is the base, the running system's local modifications are the diff, and the result is a new /etc with local changes preserved (source doc; the OSTree atomic-upgrade model is described at ostreedev.github.io/ostree/introduction/, w=0.74). The merge keeps machine state alive across upgrades, which is the point, but it also means every local edit is a merge conflict waiting to happen.

The source doc's operational rules:

1. `ostree admin config-diff` shows local modifications; run it before an upgrade to know what will merge.
2. Use drop-in directories instead of editing main config files. A file in /etc/sudoers.d survives every merge cleanly; an edit to /etc/sudoers itself creates a diff that must be re-merged forever (source doc).
3. Enable transient /etc where possible: in /usr/lib/ostree/prepare-root.conf set `[etc] transient = true`. This eliminates drift entirely, because machine-local /etc state does not exist; machine-specific state moves to the kernel commandline or /var (source doc).

Fedora's filesystem documentation corroborates the transient model: the transient-ro option "allows privileged users to create dynamic top-level mountpoints at runtime while keeping the base image content verified" (docs.fedoraproject.org/en-US/bootc/filesystem/, w=0.94).

## /var has Docker VOLUME semantics

The source doc is blunt: /var "behaves like VOLUME /var". Image content under /var is unpacked exactly once, at initial install. Changes to /var content in later image versions are NOT applied by bootc upgrade (source doc). This is the single most common bootc surprise: an image adds a default config to /var/lib/app/ in v2, and existing machines never see it.

Two mechanisms pre-create /var structure without shipping content there (source doc):

1. tmpfiles.d rules, which run at boot to create directories with correct ownership, written to /usr/lib/tmpfiles.d/yubiOS.conf with `d /var/lib/yubiOS 0750 yubiOS yubiOS -` style lines.
2. systemd unit directives, preferred because they are service-scoped: `StateDirectory=yubiOS-agent` under [Service].

Lint (as of bootc 1.1.6) warns when /var directories lack tmpfiles.d entries; see doc 08 (bootc.dev/bootc/filesystem.html, w=0.86).

## /opt and other writable third-party paths

Under composefs, /opt is read-only like the rest of the image. Third-party packages that write logs or state under their /opt subdirectory break. The source doc gives two fixes (source doc):

1. Move the writable path to /var and symlink it at build time, e.g. `mv /opt/examplepkg/logs /var/log/examplepkg` then `ln -sr /var/log/examplepkg /opt/examplepkg/logs`.
2. Per-service bind mounts without touching the tree: `BindPaths=/var/log/exampleapp:/opt/exampleapp/logs` in the unit's [Service] section.

The BindPaths approach is preferred in yubiOS work because it needs no filesystem surgery and is visible in the unit file.

## The cheatsheet

The source doc's state-management table is the one-page summary to keep in hand when triaging "where did my config go" reports. The recurring diagnosis: content placed in /etc expects merge, content in /var expects permanence, content anywhere else is image-owned and replaced on upgrade. Nothing in /run or /tmp is ever image content.
