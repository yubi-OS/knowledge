# 05: Inspecting and Managing Homes

## Scope

Everyday home management: `homectl inspect` and `homectl list`, full JSON record inspection, `passwd` re-keying, `resize`, and auxiliary group membership updates.

## The management verbs

The source doc lists the daily verbs (source doc: yubi-OS/yubiOS skills/systemd-homed/SKILL.md, Inspect and Manage):

```bash
homectl inspect jenny              # human summary
homectl inspect jenny --json=pretty  # full JSON record
homectl list                       # all homed users
homectl passwd jenny               # change password, re-keys LUKS
homectl resize jenny 30G           # resize the LUKS volume
homectl update jenny --member-of=wheel,docker
```

homectl may be used to create, remove, change or inspect a user's home directory, and is primarily a command interfacing with systemd-homed.service, which manages home directories of users (source: https://www.mankier.com/1/homectl, weight 0.45, weak-to-moderate backing; matches the man7 homectl page at weight 0.92 cited in docs 02 to 04). The man page family also documents lock and unlock verbs and password changes via `homectl passwd` (source: https://community.webminal.org/t/create-remove-change-or-inspect-home-directories-homectl/7466, weight 0.07, weak backing, aggregator).

The authoritative homectl man page carries all of these verbs with their options (source: https://www.man7.org/linux/man-pages/man1/homectl.1.html, weight 0.92). Community cheat sheets agree on the verb set: create, remove, change, or inspect home directories using the systemd-homed service (source: https://www.commands.sh/homectl, weight 0.10, weak backing).

## Resize semantics

`homectl resize` grows or shrinks the LUKS image. A real-world incident report shows the failure mode to know about: after a logout the LUKS image was automatically resized to fill the entire /home partition, taking 600 GiB while the encrypted partition inside the LUKS image was less than 30 GiB, and shrinking it back hit "LUKS image too large; partition inside too small" (source: https://github.com/systemd/systemd/issues/26796, weight 0.67). Another report describes a resize that could not complete in place because the local machine lacked free space, requiring a transfer to another machine (source: https://eldon.me/systemd-homed-resize-out-of-space/, weight 0.11, weak backing).

Operational rule for yubiOS: resize with headroom on the host, verify with `homectl inspect` afterwards, and remember the LUKS image on disk and the filesystem inside it are two different things that resize in coordinated steps, not atomically.

## Group membership

`homectl update jenny --member-of=wheel,docker` replaces the auxiliary group list in the user record (source doc). Because homed synthesizes the account from the record (doc 01), group membership changes through the record, not through `/etc/group` edits.

One security note directly relevant to `--member-of`: a 2026 advisory describes a systemd-homed local privilege escalation via arbitrary system group addition to a local, logged-in, homed-managed user, patched in v262 and backports to v261.2, v260.4, v259.8, and v258 point releases (source: https://github.com/systemd/systemd/security/advisories/GHSA-jm29-p7hh-vjhv, weight 0.78). Run a patched systemd-homed before granting powerful groups through homed records.

## Sources

- https://www.man7.org/linux/man-pages/man1/homectl.1.html (weight 0.92)
- https://github.com/systemd/systemd/issues/26796 (weight 0.67)
- https://github.com/systemd/systemd/security/advisories/GHSA-jm29-p7hh-vjhv (weight 0.78)
- https://www.mankier.com/1/homectl (weight 0.45, weak-to-moderate)
- https://www.commands.sh/homectl (weight 0.10, weak)
- https://community.webminal.org/t/create-remove-change-or-inspect-home-directories-homectl/7466 (weight 0.07, weak)
- https://eldon.me/systemd-homed-resize-out-of-space/ (weight 0.11, weak)
- yubi-OS/yubiOS skills/systemd-homed/SKILL.md (source doc)
