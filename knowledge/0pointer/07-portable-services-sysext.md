# Portable Services, Sysext, and nspawn: Extending an Immutable /usr

Poettering's modularity essays form a ladder rather than a menu. Portable services (systemd v239, June 2018) run third-party services off their own image tree with operator-chosen sandboxing ([walkthrough-for-portable-services.html](https://0pointer.net/blog/walkthrough-for-portable-services.html)). System extension images (sysext/confext) merge new files into /usr and /etc at runtime through read-only overlayfs, so an immutable base can gain tools, drivers, or configuration without ever being modified ([testing-my-system-code-in-usr-without-modifying-usr.html](https://0pointer.net/blog/testing-my-system-code-in-usr-without-modifying-usr.html); [systemd-sysext man page](https://www.freedesktop.org/software/systemd/man/latest/systemd-sysext.html)). systemd-nspawn running off the host's own /usr gives a zero-setup, fully volatile dev container on any /usr-merged distro ([running-an-container-off-the-host-usr.html](https://0pointer.net/blog/running-an-container-off-the-host-usr.html)). The three compose because they share one artifact: a directory tree or a GPT disk image following the Discoverable Partitions Specification, with the same formats accepted by sysext, nspawn, and RootDirectory=/RootImage= ([systemd-sysext man page](https://www.freedesktop.org/software/systemd/man/latest/systemd-sysext.html)).

## Portable services: native units, foreign root

Poettering frames the problem as a choice between resource bundling (the chroot() property) and isolation/sandboxing (the container property). systemd already had both primitives: RootDirectory= and RootImage= for bundling, and its sandboxing settings for isolation. Portable services add no new mechanism; they integrate the two into a deployment workflow ([walkthrough-for-portable-services.html](https://0pointer.net/blog/walkthrough-for-portable-services.html)).

A portable service image is a directory tree or a raw disk image containing service executables, their dependencies, unit files, and /usr/lib/os-release (or /etc/os-release). A multi-filesystem raw image must follow the Discoverable Partitions Specification inside a GPT partition table. Any OS-tree-building tool qualifies: dnf --installroot=, debootstrap, mkosi ([walkthrough-for-portable-services.html](https://0pointer.net/blog/walkthrough-for-portable-services.html)).

`portablectl attach` dissects the image, copies the relevant unit files into /etc/systemd/system/, and augments each with two drop-ins: 20-portable.conf, which adds RootDirectory= or RootImage= so binaries still come from the image, and 10-profile.conf, a symlink to the selected security profile. `portablectl detach` reverses exactly this. While attached, the units are ordinary systemd services: they show up in systemctl list-unit-files, can be enabled, edited with systemctl edit, resource-managed, and logged like anything else ([walkthrough-for-portable-services.html](https://0pointer.net/blog/walkthrough-for-portable-services.html)). portablectl is just one client of systemd-portabled.service, which exposes the operations over D-Bus ([walkthrough-for-portable-services.html](https://0pointer.net/blog/walkthrough-for-portable-services.html)).

The design deliberately introduces zero new metadata: unit files, os-release, and GPT partition tables all predate the feature, so existing image-building tools keep working ([walkthrough-for-portable-services.html](https://0pointer.net/blog/walkthrough-for-portable-services.html)). Which units are "relevant" is derived from the image name: an image foobar_4711.raw contributes units matching foobar*.service, foobar*.socket, foobar*.target, foobar*.path, foobar*.timer. Images dropped in /var/lib/portables/ are auto-listed; how images reach machines is deliberately unspecified: scp, wget, even RPM packaging ([walkthrough-for-portable-services.html](https://0pointer.net/blog/walkthrough-for-portable-services.html)).

Version-sensitive: in the v239 era portablectl lived in /usr/lib/systemd/ and was not on $PATH; Poettering expected it to move to /usr/bin/ "very soon" ([walkthrough-for-portable-services.html](https://0pointer.net/blog/walkthrough-for-portable-services.html)).

## Profiles: isolation chosen at attach time

Profiles are pre-defined unit drop-ins carrying sandboxing settings, selected by the administrator at attach, not by the image vendor, and applying to every unit in the image. systemd shipped four: default (medium security: capability drops, system call filters, restricted kernel interfaces, read-only mounts), strict (most restrictive, networking off, AF_NETLINK prohibited), trusted (almost no restrictions), and nonetwork (default plus no network). Custom profiles are trivial to add ([walkthrough-for-portable-services.html](https://0pointer.net/blog/walkthrough-for-portable-services.html)).

The use case is what the container world called "super-privileged containers": low-level system software that extends the host OS, defaults to isolation, and can be granted exactly as much host access as it needs. Target environments: servers, appliances, IoT, embedded ([walkthrough-for-portable-services.html](https://0pointer.net/blog/walkthrough-for-portable-services.html)).

## One image, three consumption modes

Because a portable service image is just a regular OS image, one artifact can serve three roles: attached to a host via portablectl; booted as an OS container under systemd-nspawn; or booted as the host system on bare metal or in a VM. The latter two require more: an init system (for nspawn) and a boot loader (for bare metal/VM), such as systemd-boot ([walkthrough-for-portable-services.html](https://0pointer.net/blog/walkthrough-for-portable-services.html)). Version-sensitive: the v261-era Mastodon story series on the blog index includes "Unprivileged Portable Services", i.e. attaching without root, plus "Unprivileged DDI Mounts + Unprivileged systemd-nspawn" ([blog index](https://0pointer.net/blog/)).

## Sysext and confext: merge, don't modify

systemd-sysext solves the opposite problem from portable services: not "isolate this service" but "extend this OS". On immutable systems with a read-only /usr, adding debugging tools or drivers at runtime is painful. sysext merges extension images onto /usr (and /opt) via read-only overlayfs, making their files appear atomically "as if they always had been there" ([testing-my-system-code-in-usr-without-modifying-usr.html](https://0pointer.net/blog/testing-my-system-code-in-usr-without-modifying-usr.html)). Images can be plain directory trees or disk images with filesystem, dm-verity, and signatures; the tool supports automatically discovered signed dm-verity images, "a fully authenticated, measured, safe way" to extend ([testing-my-system-code-in-usr-without-modifying-usr.html](https://0pointer.net/blog/testing-my-system-code-in-usr-without-modifying-usr.html)).

The compatibility gate is /usr/lib/extension-release.d/extension-release.<name>, checked against the host's os-release; --force skips the check when you know the image matches, as when you just built it on that host ([testing-my-system-code-in-usr-without-modifying-usr.html](https://0pointer.net/blog/testing-my-system-code-in-usr-without-modifying-usr.html); [systemd-sysext man page](https://www.freedesktop.org/software/systemd/man/latest/systemd-sysext.html)).

Poettering's own workflow: install a fresh systemd build into /run/extensions/systemd-test/ with `meson install --quiet --no-rebuild`, then `systemd-sysext refresh --force`, which unmerges old images and merges the new set; `systemd-sysext unmerge` restores the original tree; a reboot undoes everything because /run is tmpfs and the overlay is pure runtime state ([testing-my-system-code-in-usr-without-modifying-usr.html](https://0pointer.net/blog/testing-my-system-code-in-usr-without-modifying-usr.html)). Two constraints from the same post: on traditional mutable distros /usr becomes read-only while extensions are merged, and the whole mechanism presupposes the /usr merge, since overlaying a non-hermetic /usr is pointless.

Version-sensitive notes from the current man page (systemd 262 docs): images are strictly read-only by default and a Mutable= option / --mutable= now exists ([systemd-sysext man page](https://www.freedesktop.org/software/systemd/man/latest/systemd-sysext.html)); accepted formats are plain directories or btrfs subvolumes, GPT images following DPS, and partition-table-less images with erofs, squashfs, or ext4; extensions should be purely additive; /etc and /var inside a sysext are ignored; boot-time activation runs via systemd-sysext.service and systemd-confext.service, with initrd counterparts (systemd-sysext-initrd.service, systemd-sysext-sysroot.service) for earliest boot; kernel command line options systemd.sysext= and systemd.confext= exist ([systemd-sysext man page](https://www.freedesktop.org/software/systemd/man/latest/systemd-sysext.html)). systemd-confext follows the same principle but extends only /etc, searched in /run/confexts/, /var/lib/confexts/, /usr/lib/confexts/, and /usr/local/lib/confexts/ ([systemd-sysext man page](https://www.freedesktop.org/software/systemd/man/latest/systemd-sysext.html)). Applying confext and sysext from the initrd is an explicit v261 story topic on the blog index ([blog index](https://0pointer.net/blog/)).

The man page draws the boundary sharply: sysext files appear as if shipped in the base OS and imply no security isolation; binaries in a sysext link against host libraries only when the extension-release binding pins them to the host OS version, otherwise they must link statically. Portable services ship their own library dependencies and are sandboxed at the service level ([systemd-sysext man page](https://www.freedesktop.org/software/systemd/man/latest/systemd-sysext.html)).

## nspawn off the host /usr: the zero-setup dev container

The third rung is not about artifacts at all. Because of the /usr merge, all vendor resources live in one directory, so sharing that single directory with a container yields a second instance of the host OS with no preparation: `systemd-nspawn --directory=/ --volatile=yes -U --set-credential=passwd.hashed-password.root:$(mkpasswd mysecret) --set-credential=firstboot.locale:C.UTF-8 --bind-user=lennart -b`. In volatile mode nspawn mounts a tmpfs as the container root and mounts only the host's /usr into it read-only; /etc and /var start empty and get populated by systemd-tmpfiles and systemd-sysusers ([running-an-container-off-the-host-usr.html](https://0pointer.net/blog/running-an-container-off-the-host-usr.html)). -U enables user namespacing with dynamically allocated UID ranges and UID-mapped mounts, so host file ownership appears intact but isolated. --bind-user= mounts the host user's home directory into the container and injects a minimal user record that nss-systemd picks up. Credentials carry the root password hash and locale into the empty /etc ([running-an-container-off-the-host-usr.html](https://0pointer.net/blog/running-an-container-off-the-host-usr.html)).

Version-sensitive: this requires kernel 5.15 or newer (UID-mapped mounts), systemd 249 or newer on host and container (--bind-user=), and a distro with the /usr merge plus pervasive tmpfiles/sysusers adoption; Fedora 35 suffices ([running-an-container-off-the-host-usr.html](https://0pointer.net/blog/running-an-container-off-the-host-usr.html)). Known limits: hardware-management services cannot work in containers and should carry ConditionVirtualization=!container or ConditionPathIsReadWrite=/sys ([running-an-container-off-the-host-usr.html](https://0pointer.net/blog/running-an-container-off-the-host-usr.html)). In the April 2022 post, a --system-extension= switch for nspawn (merge extensions into the container tree) was an explicit TODO, not a shipped feature ([testing-my-system-code-in-usr-without-modifying-usr.html](https://0pointer.net/blog/testing-my-system-code-in-usr-without-modifying-usr.html)).

## How the ladder composes

The blog's mkosi article lists "Sysext, confext and portable images" among mkosi output formats, so one build system produces every rung of the ladder ([blog index](https://0pointer.net/blog/)). The layering rule falls out of the artifact design: the base OS stays immutable and verifiable; sysext adds files into the merged /usr view without a writable byte hitting it; portable services take a whole image tree and sandbox its services with profiles; nspawn boots any of these trees as a full container. Which rung to pick is a question of isolation versus integration: sysext for zero isolation and maximum integration, portable services for tunable sandboxing around host-integrated services, nspawn for full OS-level testing with no persistence.

## Sources considered

Used:

- https://0pointer.net/blog/walkthrough-for-portable-services.html (primary, fetched)
- https://0pointer.net/blog/testing-my-system-code-in-usr-without-modifying-usr.html (primary, fetched)
- https://0pointer.net/blog/running-an-container-off-the-host-usr.html (primary, fetched)
- https://0pointer.net/blog/ (primary index, fetched)
- https://www.freedesktop.org/software/systemd/man/latest/systemd-sysext.html (primary, fetched, systemd 262 docs)
- dig brief searXNG results (discovery and jev weights only)

Rejected:

- https://systemd.io/PORTABLE_SERVICES/ (unfetched)
- https://rukulkarni.com/blog/systemd-portable-services/ (secondary)
- https://www.freedesktop.org/software/systemd/man/portablectl.html (unfetched)
- https://deepwiki.com/systemd/systemd/5.4-portable-services (secondary)
- https://www.phoronix.com/news/Systemd-Portable-Services (secondary)
- https://man.archlinux.org/man/systemd-sysext.8.en (outdated)
- https://www.freedesktop.org/software/systemd/man/systemd-sysext.html (superseded)
- https://kairos.io/docs/advanced/sys-extensions/ (vendor)
- https://deepwiki.com/systemd/mkosi/6.2-system-extensions-(sysextconfext) (secondary)
- https://mylinux.work/guides/systemd-sysext/ (tertiary)
- skills/github-yubios-KS9n5GAT/0pointer-mastery/SKILL.md (map only)
