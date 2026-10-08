# 08: homed.conf and yubiOS Defaults

## Scope

homed.conf and drop-ins: `DefaultStorage=luks` and `DefaultFileSystemType=btrfs` defaults for yubiOS, and where those files live.

## The yubiOS drop-in

The source doc places the yubiOS defaults in a drop-in (source doc: yubi-OS/yubiOS skills/systemd-homed/SKILL.md, homed.conf section):

```ini
# /etc/systemd/homed.conf.d/yubiOS.conf
[Home]
DefaultStorage=luks
DefaultFileSystemType=btrfs
```

## What the settings mean

These configuration files control default parameters for home areas and user accounts created and managed by systemd-homed.service (source: https://www.freedesktop.org/software/systemd/man/homed.conf.html, weight 0.97; same text at https://manpages.debian.org/testing/systemd-homed/homed.conf.5.en.html, weight 0.94).

`DefaultFileSystemType=` selects the default filesystem to use inside the user's LUKS volume when storage is "luks", taking one of btrfs, ext4, or xfs, and defaulting to btrfs if not specified; the setting has no effect if a different storage mechanism is chosen (source: https://www.man7.org/linux/man-pages/man5/homed.conf.5.html, weight 0.94). `DefaultStorage=` selects the default storage mechanism for newly created homes; the yubiOS choice is luks so every new home is a LUKS2 image by default (source doc; directive list cross-referenced at https://man7.org/linux/man-pages/man7/systemd.directives.7.html, weight 0.76).

## Drop-in precedence

The freedesktop man page documents the precedence rule: in addition to the main configuration file, drop-in configuration snippets are read from /usr/lib/systemd/*.conf.d/, /usr/local/lib/systemd/*.conf.d/, and /etc/systemd/*.conf.d/, and those drop-ins have higher precedence and override the main configuration file (source: https://www.freedesktop.org/software/systemd/man/homed.conf.html, weight 0.97; the same precedence text appears in the 255-era page, weight 0.93). This is why the yubiOS default lands in `/etc/systemd/homed.conf.d/yubiOS.conf` rather than editing the shipped `homed.conf`: it survives package updates and clearly carries local policy.

The Arch manual page adds the framing that the default configuration is set during compilation, so configuration is only needed when it is necessary to deviate from those defaults (source: https://man.archlinux.org/man/core/systemd/homed.conf.5.en, weight 0.70). yubiOS deviates deliberately, because the image wants LUKS plus btrfs as the universal posture (source doc).

## Why the defaults matter operationally

1. With `DefaultStorage=luks`, `homectl create <user>` without `--storage=` still produces an encrypted home, removing a class of accidental unencrypted homes (source doc checklist in doc 11).
2. `DefaultFileSystemType=btrfs` is consistent with the homectl `--fs-type=btrfs` flag used in the create pattern (doc 02); the conf default makes the flag redundant but harmless.
3. The generic man.cx index confirms the file pair naming `homed.conf, homed.conf.d` (source: https://man.cx/homed.conf(5), weight 0.30, weak backing, aggregator index).

## Sources

- https://www.freedesktop.org/software/systemd/man/homed.conf.html (weight 0.97)
- https://manpages.debian.org/testing/systemd-homed/homed.conf.5.en.html (weight 0.94)
- https://www.man7.org/linux/man-pages/man5/homed.conf.5.html (weights 0.94 and 0.93)
- https://www.freedesktop.org/software/systemd/man/255/homed.conf.d.html (weight 0.93)
- https://man.archlinux.org/man/core/systemd/homed.conf.5.en (weight 0.70)
- https://man7.org/linux/man-pages/man7/systemd.directives.7.html (weight 0.76)
- https://man.cx/homed.conf(5) (weight 0.30, weak)
- yubi-OS/yubiOS skills/systemd-homed/SKILL.md (source doc)
