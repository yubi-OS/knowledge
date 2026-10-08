# 01: The systemd-homed Model and JSON User Records

## Scope

This doc covers the systemd-homed model: portable, self-contained home directories, the embedded JSON user record, NSS user synthesis, and the absence of `/etc/passwd` as the account database.

## The core model

systemd-homed.service manages home directories of regular human users. Each home it manages encapsulates both the data store and the user record of the user, so that the home comprehensively describes the user account and is naturally portable between machines (source: https://systemd.io/HOME_DIRECTORY/, weight 0.93). The account and the home directory are the same object: pick up the home, and you have picked up the user.

Every home carries a JSON user record. systemd optionally processes user records that go beyond the classic UNIX struct passwd from glibc NSS: they are a dictionary of key/value pairs, extensible, and signed (source: https://systemd.io/USER_RECORD/, weight 0.92). The record embeds UID/GID, shell, groups, resource limits, and storage metadata that traditional systems scatter across `/etc/passwd`, `/etc/shadow`, and `/etc/group`.

## No /etc/passwd, NSS synthesis

systemd-homed does not write the classic account files. Instead, the `nss-systemd` module synthesizes classic NSS records from the JSON user records, providing backwards compatibility with classic UNIX APIs for both lookup and enumeration (source: https://systemd.io/USER_RECORD/, weight 0.92). A system running homed therefore has no static entry for the user in `/etc/passwd`; the account exists because the home exists.

The rich user and group records that userdb and systemd-homed support carry fields of relevance to desktop environments and UIs that manage the local user database, and most of the metadata account daemons need is directly available in the record (source: https://systemd.io/USERDB_AND_DESKTOPS/, weight 0.81). This is what makes homed usable as a real account backend, not just a mount helper.

## Portability and signing

User records are cryptographically signed with a public/private key pair, and the signature is part of the JSON record itself (source: https://www.man7.org/linux/man-pages/man8/systemd-homed.8.html, weight 0.92). For a user to be permitted to log in locally, the public key matching the signature of their user record must be installed on the machine. This is the property that migration between machines relies on: carry the home and its signature, and teach the target host to trust the source host key (see doc 06 and doc 10 in this corpus).

Independent documentation describes homed as a systemd service providing portable human-user accounts that are not dependent on current system configuration, achieving portability by moving all user-related information into a storage medium, optionally encrypted (source: https://wiki.archlinux.org/title/Systemd-homed, weight 0.38, weak backing, aggregator-adjacent wiki but consistent with the primary sources above).

## Storage choices

Homes can live as LUKS images, subdirectories, fscrypt directories, or on network mounts. The yubiOS choice is the LUKS2 image, because the yubiOS use case is a LUKS2 home with YubiKey FIDO2 unlock: key material lives on the YubiKey, the host stores only a random salt, and no YubiKey means no login (source doc: yubi-OS/yubiOS skills/systemd-homed/SKILL.md, Overview section).

## What this means for yubiOS

1. The home is the account. Backing up `/home/<user>.home` plus the signing key pair is a complete account backup; there is no second copy of account state in `/etc`.
2. The embedded record is authoritative. Tools that read `/etc/passwd` still work through NSS synthesis, but edits to `/etc/passwd` for homed users are meaningless and will be lost.
3. Identity is bound to hardware. With FIDO2 unlock enrolled, the user record plus the YubiKey are both required to activate the home, which is the property yubiOS builds its per-user encryption story on (source doc: yubi-OS/yubiOS skills/systemd-homed/SKILL.md).

## Sources

- https://systemd.io/HOME_DIRECTORY/ (weight 0.93)
- https://systemd.io/USER_RECORD/ (weight 0.92)
- https://systemd.io/USERDB_AND_DESKTOPS/ (weight 0.81)
- https://www.man7.org/linux/man-pages/man8/systemd-homed.8.html (weight 0.92)
- https://wiki.archlinux.org/title/Systemd-homed (weight 0.38, weak)
- yubi-OS/yubiOS skills/systemd-homed/SKILL.md (source doc)
