# Stateless Systems and Factory Reset

**Abstract:** In 2014, Lennart Poettering proposed that the /usr merge, once complete, enables three new OS designs built into systemd: factory reset (flush /etc and /var, keep vendor /usr), stateless systems (never persist /etc or /var at all, so every boot is a factory reset), and reproducible systems (share one immutable /usr across many instances). The mechanics ship as plain systemd primitives: tmpfiles.d to rebuild directory skeletons, systemd-sysusers to recreate system users from declarative files, ConditionNeedsUpdate plus systemd-update-done to reconcile /etc and /var after an offline /usr update, and unit presets to re-enable vendor services on an empty /etc. Today those primitives pair with a concrete reset path: systemd-repart erases partitions marked FactoryReset= from the initrd, driven by an EFI variable or a kernel command line option. The reason stateless beats mutable state for image-mode OSes is that the vendor image in /usr becomes the single source of truth: erase everything else and reboot, and the system rebuilds itself exactly as on first boot.

## The /usr merge is the precondition

The essay's opening move is architectural: with the /usr merge completed, "most static vendor-supplied OS data is found exclusively in /usr", and only a few bits in /var and /etc are needed to make a system boot (0.89). Everything else in the design depends on that split. Vendor data lives in /usr and can be made strictly read-only and "fully cryptographically verified as one unit"; local state lives in /etc and /var and can be discarded or rebuilt without touching the OS (0.89).

The same reasoning appears later in "Fitting Everything Together": monopolizing vendor OS resources in an immutable /usr opens the door to dm-verity over the whole tree, atomic A/B updates of /usr, and factory reset that is simply "erase the root file system and reboot", because "the hermetic OS in /usr/ has all the information it needs to set up the root file system afresh, exactly like in a new installation" (0.89).

## Four system classes, one vocabulary

The essay defines three boot modes and one operation on top of them (0.89):

- **Stateful**: the traditional system, with machine-specific /etc, /usr, and /var all populated.
- **Volatile**: boots with an empty /var but a configured /etc.
- **Stateless**: boots with neither /etc nor /var, taking all configuration from vendor packages, DHCP, or hardware discovery.
- **Factory reset** is "just a special case" of the latter two modes: the system boots without /var and /etc, and the next boot is a normal stateful one.

One deliberate omission: a mode that flushes /etc but keeps /var is explicitly not covered, because the user ID question becomes much harder and the essay saw no use case worth the trouble (0.89).

## Booting without /var and /etc: the systemd 214/215 toolkit

Version-sensitive: the following reflects systemd 214 (for tmpfiles-based /var population) and 215 (then unreleased, as written in June 2014) (0.89).

Booting with an empty /var is the easy half. A few lines of tmpfiles configuration populate /var's basic structure; the essay is candid that this is only a small part of the solution, since much software does not recreate its own state directories and needs extra tmpfiles.d lines shipped by packagers (0.89).

Booting with an empty /etc is harder, because /etc holds data the system cannot operate without, most importantly /etc/passwd and /etc/group. The systemd 215-era toolkit:

- **systemd-sysusers** reads declarative system user and group definitions from /usr/lib/sysusers.d/ and creates missing entries in /etc/passwd and /etc/group via the glibc APIs. This replaces imperative useradd -r / groupadd -r calls in RPM and DEB scriptlets, making user registration declarative, so it can be replicated on next boot across many instances. It also supports reading UIDs/GIDs off existing files in /usr so vendors can keep setuid/setgid binaries working. The essay notes the system UID/GID range is very small, only 998 users and groups on most systems, so allocation has to be dynamic; a fully static user list in /usr works for specific systems but not the general case (0.89).
- **ConditionNeedsUpdate=** conditionalizes services on whether /usr is newer than /etc or /var, implemented via the mtime of /usr: the packaging software should touch /usr after an update, signaling that /etc and /var may need reconciliation. Services ship for rebuilding the udev hardware database, the journal catalog, and /etc/ld.so.cache (0.89).
- **Unit presets on empty /etc**: if systemd detects an empty /etc at early boot, it enables all services the vendor or packager declared via preset policy (0.89).
- **tmpfiles tree copying**: tmpfiles gained the ability to copy entire directory trees into place if missing, with /etc/pam.d and /etc/dbus-1 named as the prominent candidates, so the system can boot with vendor defaults (0.89).
- **systemd-nspawn --tmpfs=**: for testing, `--tmpfs=/var --tmpfs=/etc` over a read-only container tree emulates a stateless boot (0.89).

The essay also floats a future /usr/share/etc directory holding pristine vendor configuration, both as a copy source for empty /etc boots and as a diff target for administrators, and explicitly marks the name as not settled (0.89).

## ConditionNeedsUpdate today

Version-sensitive: current systemd documentation refines the 2014 sketch. The stamp files are now named explicitly: ConditionNeedsUpdate= tests whether /usr's mtime is newer than the `.updated` stamp file in /etc or /var, and units using it must order themselves before systemd-update-done.service, which resets the stamp to /usr's mtime on the first boot after an offline /usr update (0.89). Two additions matter for image-mode systems: the kernel command line option systemd.condition_needs_update= overrides the mtime check entirely, and the packaging tool should touch /usr itself only when it does not run its own post-update steps, since the kernel only updates a directory's mtime when immediate children change (0.89).

## Factory reset mechanics today

Version-sensitive: the current factory reset machinery is much newer than the 2014 essay; the following follows systemd's Factory Reset documentation as published on systemd.io (retrieved 2026-09) (0.89).

- **factory-reset.target** requests a reset and reboots to execute it. It runs three services by default: systemd-factory-reset-request.service, systemd-tpm2-clear.service, and systemd-factory-reset-reboot.service (0.89).
- **FactoryResetRequest** is the EFI variable used as stateful memory to carry the request across the reboot; it contains information about the requesting OS so multi-boot scenarios are covered (0.91).
- **factory-reset-now.target** is started at boot whenever a reset is requested, either via the systemd.factory_reset=1 kernel command line option or the FactoryResetRequest variable. The systemd-factory-reset-generator checks both and adds the target to the boot transaction already in the initrd. A companion systemd-factory-reset-complete.service marks the operation complete so boot can continue (0.89).
- **systemd-repart** performs the actual erasure: partitions marked with FactoryReset= in its definition files are securely erased and then reformatted during the reset boot (0.89).
- **systemd-tpm2-clear.service** asks the firmware to reset the TPM, invalidating keys and generating a new seed key. The documentation also notes logind can bind reset to a long keypress, a Varlink service at /run/systemd/io.systemd.FactoryReset exposes the reset state to UIs, boot menu entries can request a reset with or without the TPM clear, and non-EFI systems should devise their own request mechanism and feed it back via the kernel command line (0.89).

In the "Fitting Everything Together" partition design this composes concretely: on factory reset the runtime, home, and LUKS partitions are deleted so systemd-repart recreates them, using a new set of cryptographic keys, while the ESP and the verity-protected /usr partitions survive untouched (0.89).

## Why stateless beats mutable state for image-mode OSes

The essay's conclusion lists the payoffs, and they all reduce to one property: the vendor /usr image is the system (0.89).

- On end-user machines, factory reset is the generic escape hatch when the system is broken, when selling it, or when the user wants private data gone, saving support costs (0.89).
- On embedded devices, every single boot can be identical to a factory reset (0.89).
- New OS installers reduce to: deserialize a /usr snapshot onto a file system, install a boot loader, reboot, and leave first-time configuration to the next boot (0.89).
- New updaters manage several verified /usr snapshots and update /etc and /var simply by rebooting into a newer version (0.89).
- Containers and thin clients share one golden-master /usr across thousands of instances or an NFS boot share, with each instance keeping only private /etc and /var (0.89).

Mutable state is the failure surface here: anything that lives in /etc or /var can drift, break, or carry an exploit across reboots. Stateless boot bounds that surface to one boot's worth, and factory reset restores it deterministically because the recovery procedure is the same code path as first boot. The essay is explicit that this was not new as a concept, what was new was building it into a general purpose OS core rather than special purpose systems like OSTree, CoreOS, Android, or ChromeOS, and equally explicit that most packages of 2014 were incompatible with empty /etc and /var and would need upstream work (0.89).

## Sources considered

Used:
- https://0pointer.net/blog/projects/stateless.html (primary; fetched 2026-09-29)
- https://0pointer.net/blog/fitting-everything-together.html (primary; fetched 2026-09-29)
- https://systemd.io/FACTORY_RESET/ (current factory reset documentation)
- https://www.freedesktop.org/software/systemd/man/latest/systemd.unit.html (ConditionNeedsUpdate=)
- https://www.freedesktop.org/software/systemd/man/latest/systemd-update-done.service.html (stamp file mechanics)

Rejected:
- https://man7.org/linux/man-pages/man8/systemd-factory-reset.8.html (superseded by freedesktop latest man pages and systemd.io)
- https://distributions.freedesktop.org/software/systemd/man/systemd-factory-reset@.service.html (superseded by latest man pages)
- https://man.archlinux.org/man/systemd-update-done.8.en (superseded by freedesktop latest)
- https://bbs.archlinux.org/viewtopic.php?id=222673 (forum thread, not a source)
- https://systemd.io/ (generic index, no doc content)
