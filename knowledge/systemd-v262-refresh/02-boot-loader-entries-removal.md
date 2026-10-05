# 02 The /run/boot-loader-entries removal and the BLS overlay path

Scope: the planned removal of runtime-defined boot loader entries in /run/boot-loader-entries from systemd, what the Boot Loader Specification provides as the supported replacement surface, and why the UKI addon path is where entry overlays now live.

## The removal, as upstream states it

The source doc recorded that the v262-rc2 incompatible-changes section repeats the planned removal of runtime-defined boot loader entries, and that a 2026-07-14 audit (`refs/systemd-v262-audit-2026-07-14.md`) found no yubiOS repo dependency on `/run/boot-loader-entries/`.

The dig surfaced direct primary text for this removal. The systemd NEWS file on GitHub carries, under "Announcements of Future Feature Removals and Incompatible Changes", an entry stating that systemd-logind's integration with the UAPI.1 Boot Loader Specification (which allows the `systemctl reboot --boot-loader-entry=` switch to work) has so far supported a special directory `/run/boot-loader-entries/` which allowed defining boot loader entries (source: https://github.com/systemd/systemd/blob/main/NEWS, jev weight 0.92). This confirms the mechanism being removed exists to feed `systemctl reboot --boot-loader-entry=` and similar logind-side boot loader integration, not the on-disk ESP entries themselves.

Community-side evidence of the mechanism's awkwardness predates the removal: a GitHub issue describes how around systemd 247 it was possible to generate boot loader entries into /boot and have tools like bootctl and `systemctl exec` use them as expected, documenting friction with runtime-defined entries (source: https://github.com/systemd/systemd/issues/35729, jev weight 0.51).

## What the Boot Loader Specification defines

The UAPI.1 Boot Loader Specification defines file formats and naming conventions that allow boot loader menu entries to be shared between multiple operating systems and boot loaders installed on one device (source: https://uapi-group.org/specifications/specs/boot_loader_specification/, jev weight 0.82). Type #1 entries are the plain config-file form; Type #2 entries are unified kernel images.

systemd-boot reads simple and entirely generic boot loader configuration files, one file per boot loader entry, and all files need to reside on the ESP (source: https://systemd.io/BOOT/, jev weight 0.92). The Boot Loader Interface documentation specifies that when boot loader entries are defined through Boot Loader Specification files, the entry identifier is derived directly from the file name with the `.conf` suffix (Type #1 snippets) or `.efi` suffix (Type #2 images) removed (source: https://systemd.io/BOOT_LOADER_INTERFACE/, jev weight 0.95).

## Why the UKI addon path is the supported overlay

For an image-based OS, the important replacement surface is documented in the root file system discovery doc: the systemd-boot boot loader may be configured via UAPI.1 Boot Loader Specification Type #1 entries to acquire UKIs or similar from other locations, and the initrd part of the UKI understands the `root=` (and `mount.usr=`) kernel command line switches to find the root filesystem (source: https://systemd.io/ROOTFS_DISCOVERY/, jev weight 0.93). In other words, per-boot customization moves into UKI add-ons rather than runtime-generated entry directories.

The `bootctl` manual confirms the operations layer: its entry-selection commands (`set-default`, `set-oneshot`, and related) are available for all boot loaders that implement the UAPI.1 Boot Loader Specification and the Boot Loader Interface, such as systemd-boot (source: https://www.man7.org/linux/man-pages/man1/bootctl.1.html, jev weight 0.72).

## Standing verdict for yubiOS

The 2026-07-14 audit found no yubiOS dependency on `/run/boot-loader-entries/`, and the source doc records that status as still clear at the 2026-09-13 refresh. The supported path for entry overlays remains the BLS Type #1 "extra" stanza and UKI addon handling. A consumer that never generates runtime boot loader entries into /run is unaffected; a consumer that scripts `systemctl reboot --boot-loader-entry=` against runtime-defined entries would need to migrate to ESP-resident BLS entries or UKI add-ons.
