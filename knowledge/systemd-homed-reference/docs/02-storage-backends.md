# Storage backends and homed.conf

Scope: the five storage backends systemd-homed offers (luks, fscrypt, subvolume, directory, cifs), how each mounts, and the homed.conf defaults that pick between them.

## The backend matrix

homed.conf's DefaultStorage= takes one of luks, fscrypt, directory, or subvolume (cifs is configured per-user) (source: https://manpages.ubuntu.com/manpages/noble/man5/homed.conf.d.5.html, weight 0.95). The homectl storage= option accepts the full set: luks, fscrypt, directory, subvolume, cifs (source: https://wiki.gentoo.org/wiki/Systemd/systemd-homed, weight 0.77).

What each backend mounts differs fundamentally. For the directory-based mechanisms (directory, subvolume, fscrypt) the home is exposed as a bind mount. For cifs it is a CIFS network mount. For the LUKS2 backend it is a regular block device mount of the filesystem contained inside the LUKS2 image (source: https://systemd.io/HOME_DIRECTORY/, weight 0.90).

| Backend | Storage | Encryption | Mount style |
|---|---|---|---|
| luks | loopback image file /home/*.home, or raw block device | LUKS2 | block device mount |
| fscrypt | /home/*.homedir | fscrypt | bind mount |
| subvolume | /home/*.homedir (btrfs subvolume) | none | bind mount |
| directory | /home/*.homedir | none | bind mount |
| cifs | network | SMB transport | CIFS mount |

## The LUKS2 backend

The LUKS2 backend is the strongest option: the whole home lives in an encrypted image decrypted on login (source: https://wiki.archlinux.org/title/Systemd-homed, weight 0.72). It supports the richest authentication surface: FIDO2 tokens, PKCS#11 tokens, and recovery keys enroll against the LUKS2 volume, and per-user disk encryption means the disk encryption key is derived from the user's authentication at PAM time (source: https://www.freedesktop.org/software/systemd/man/257/pam_systemd_home.html, weight 0.89). A LUKS2 home can also live on a raw block device such as USB or NVMe media, which is the basis of portable hardware homes (source: https://systemd.io/HOME_DIRECTORY/, weight 0.90).

## The filesystem choice inside LUKS

When luks is the storage, DefaultFileSystemType= selects the filesystem created inside the user's LUKS volume: btrfs, ext4, or xfs. If not specified it defaults to btrfs, and the setting has no effect when a different storage mechanism is used (source: https://freedesktop.org/software/systemd/man/homed.conf.html, weight 0.80). The filesystem type given on the homectl command line always takes precedence over the homed.conf default (source: https://man.archlinux.org/man/core/systemd/homed.conf.5.en, weight 0.62).

This makes the standard image-level recommendation for an immutable OS image straightforward: DefaultStorage=luks plus DefaultFileSystemType=btrfs, which is also the upstream default pairing and preserves btrfs quota and snapshot capability inside each per-user volume (source: https://freedesktop.org/software/systemd/man/homed.conf.html, weight 0.80; https://wiki.gentoo.org/wiki/Systemd/systemd-homed, weight 0.77).

## The weaker alternatives, and when they fit

fscrypt encrypts an ext4 directory rather than a block device. It is the weaker encryption option of the two encrypted backends, and a notable operational limitation: an fscrypt home's password cannot be changed after creation in the same way a LUKS2 volume's can, because there is no separate volume key to re-encrypt (source: https://wiki.archlinux.org/title/Systemd-homed, weight 0.72).

subvolume and directory provide no encryption at all. subvolume is the choice when per-user btrfs quotas and snapshots are wanted without encryption; directory is the plain fallback for filesystems that support nothing else (source: https://wiki.gentoo.org/wiki/Systemd/systemd-homed, weight 0.77).

cifs mounts the home over the network from an SMB share. It is the only network backend and exists for Windows share environments; authentication is SMB-based rather than LUKS-key-based (source: https://systemd.io/HOME_DIRECTORY/, weight 0.90; https://wiki.gentoo.org/wiki/Systemd/systemd-homed, weight 0.77).

## homed.conf placement and drop-ins

Configuration lives at /etc/systemd/homed.conf, with drop-in directories supported at /etc/systemd/homed.conf.d/ (source: https://manpages.ubuntu.com/manpages/noble/man5/homed.conf.d.5.html, weight 0.95). A minimal baseline for a LUKS-first image:

```ini
[Home]
DefaultStorage=luks
DefaultFileSystemType=btrfs
```

## Selection guidance

For machines with human interactive users and any secrets at rest, luks is the default and the recommendation carried by upstream documentation for new conversions; the converting-users guide points migrators at --storage= and --disk-size= and notes the default luks storage is recommended (source: https://systemd.io/CONVERTING_TO_HOMED/, weight 0.96). A skeptical multi-user-server evaluation of homed in 2026 reaches a more conditional verdict and is worth reading before deploying homed for many concurrent SSH users, though it is a third-party opinion piece rather than primary documentation (source: https://www.bigiron.cc/guides/systemd-homed-for-multi-user-servers-the-2026-verdict, weight 0.14, weak backing, clearly labeled).
