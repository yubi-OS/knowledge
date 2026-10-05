# 03: sysext overlay application on /usr

Scope: systemd-sysext merging extension images onto /usr via overlayfs: refresh, list, merge and unmerge lifecycles, and image placement conventions.

## What sysext is

`systemd-sysext` activates and deactivates system extension images. System extension images may dynamically, at runtime, extend the /usr/ and /opt/ directory hierarchies with additional files. This is particularly useful on immutable system images where a /usr/ and/or /opt/ hierarchy residing on a read only file system shall be extended at runtime without modifying it [1]. The mechanism merges the extension's hierarchy with the host's via overlayfs and overmounts the host hierarchy, a process called merging: when one or more system extension images are activated, their /usr/ and /opt/ hierarchies are combined via overlayfs with the same hierarchies of the host OS, and the host /usr/ and /opt/ are overmounted with the result [2].

A secondary writeup describes the practical effect: binaries and libraries are dynamically merged into /usr at runtime, without touching the underlying read only image and without a reboot [3] (weak backing, w=0.44).

## Image format and placement

The UAPI Group's Extension Images specification defines the format: extensions are DDIs (Discoverable Disk Images), and the specification does not redefine the file format. There are two types of extension images, sysext (System Extension) and confext (Configuration Extension), differentiated by the directory hierarchies they contain [4].

A sysext image can take several shapes per the Arch manual page rendering of systemd-sysext(8), including disk images lacking a partition table with a naked Linux file system, for example erofs, squashfs or ext4 [5]. During boot, system and configuration extension images are activated automatically if the `systemd-sysext.service` and `systemd-confext.service` services are enabled [5] [6] (weak backing, w=0.07, notes the service runs only after the underlying file systems where extensions are searched are mounted).

Extensions are stored under /var/lib/extensions/ or /run/extensions/ [7] (weak backing, w=0.18, man page mirror). A test that stages an extension at /var/lib/extensions/ and calls `systemd-sysext refresh` exercises the documented search location [7] (weak) plus the refresh verb [1].

## Lifecycle verbs a test should exercise

The freedesktop man page frames the tool as activating and deactivating extension images [1]. The concrete test cycle against that surface is:

1. Place the extension image in the search path (/var/lib/extensions/).
2. `systemd-sysext refresh`: rescan and apply.
3. `systemd-sysext list`: enumerate what is merged.
4. `systemd-sysext unmerge` (or remove the image and refresh again): deactivate, which un-overmounts the hierarchy and makes the added files disappear from /usr.

The refresh, list, merge and unmerge verbs come straight from the tool's activation and deactivation contract [1]; the observable assertion is that a file that exists only inside the extension image appears in /usr after merge and disappears after unmerge [2] [3].

## Compatibility checking

The overlay merge is guarded by compatibility metadata rather than a blind merge: sysext adds compatibility checking, systemd integration, and a standardized format on top of the plain overlayfs mechanism [3] (weak backing, w=0.44). For a signed extension the merge path also engages signature verification, which is the negative test surface covered in doc 08.

## Test design implications

1. Positive: assert a marker binary (something shipped only in the extension) is reachable in /usr after `systemd-sysext refresh`, and that `systemd-sysext list` shows the extension merged [1] [2].
2. Cycle: after `unmerge`, the same probe must fail again, proving the overlay is cleanly removable at runtime without a reboot [1] [3].
3. Placement: stage the image at /var/lib/extensions/ so the boot-time service would also pick it up [5] [7].

## Sources

1. https://www.freedesktop.org/software/systemd/man/systemd-sysext.html (w=0.80)
2. https://www.freedesktop.org/software/systemd/man/251/systemd-sysext.html (w=0.95)
3. https://itsfoss.com/systemd-sysext/ (w=0.44, weak)
4. https://uapi-group.org/specifications/specs/extension_image/ (w=0.69)
5. https://man.archlinux.org/man/systemd-sysext.8.en (w=0.71)
6. https://www.systutorials.com/docs/linux/man/docs/linux/man/8-systemd-sysext.service/ (w=0.07, weak)
7. https://linuxcommandlibrary.com/man/systemd-sysext (w=0.18, weak)
