# homectl operations

Scope: the homectl command surface for creating, updating, resizing, inspecting, and lifecycle-managing homed homes, including the export formats used for migration.

## What homectl is

homectl is the client utility for systemd-homed.service: it creates, removes, changes, or inspects a user's home directory, and is the primary interface to the service that manages homes which are self-contained and thus include the user's full metadata record in the home's data storage (source: https://www.freedesktop.org/software/systemd/man/homectl.html, weight 0.93; https://www.man7.org/linux/man-pages/man1/homectl.1.html, weight 0.78).

The simplest usage is `homectl create username`, which creates a user with a free UID in the 6000 range and a home under /home (source: https://wiki.archlinux.org/title/Systemd-homed, weight 0.86).

## Create

Creation takes the storage and filesystem knobs plus authentication enrollment in a single command. Canonical LUKS2 creation:

```bash
homectl create jenny --storage=luks --fs-type=btrfs --disk-size=20G --member-of=wheel
```

The --storage= and --disk-size= options are the ones the converting-users guide calls out as the settings to review, with the default luks storage recommended (source: https://systemd.io/CONVERTING_TO_HOMED/, weight 0.96). FIDO2, PKCS#11, and recovery-key enrollment at create time use the flags documented in the authentication docs of this corpus; enrolling FIDO2 after creation goes through `homectl authenticate jenny --fido2-device=auto` rather than re-creating the user (source: https://www.freedesktop.org/software/systemd/man/homectl.html, weight 0.93).

## Update, resize, passwd

`homectl update` modifies the user record (group membership via --member-of=, default area, shell and prompt-related settings). `homectl passwd jenny` changes the user's password, and `homectl resize jenny 30G` grows the LUKS volume in place (source: https://www.freedesktop.org/software/systemd/man/homectl.html, weight 0.93). Recovery keys can be updated on an existing home with `homectl update jenny --recovery-key=` (v259 and later; see the version-evolution doc) (source: https://www.man7.org/linux/man-pages/man1/homectl.1.html, weight 0.86).

## Inspect and export

`homectl inspect jenny` prints a human-readable summary; `homectl inspect jenny --json=pretty` dumps the full JSON user record; `homectl list` enumerates all managed users (source: https://www.freedesktop.org/software/systemd/man/homectl.html, weight 0.93). The low-level view of synthesized users comes from userdbctl (source: https://www.freedesktop.org/software/systemd/man/247/userdbctl.html, weight 0.80).

Two export formats matter for moving homes between hosts. The stripped export (`-E`) copies the JSON record while keeping its original signature, so the destination host must already trust the source's signing key. The minimal export (`-EE`) strips the cryptographic signatures entirely and re-signs on the target; upstream's guidance is that when moving a user to a target system that already has other systemd-homed users you need the minimal export (--export-format=minimal) and recreate the user from it on the target (source: https://wiki.gentoo.org/wiki/Systemd/systemd-homed, weight 0.81; https://www.freedesktop.org/software/systemd/man/homectl.html, weight 0.93). Pipe either form straight into a remote create:

```bash
homectl inspect jenny -EE | ssh root@target homectl create -i-
```

## Lifecycle: activate, deactivate, lock, unlock

The four lifecycle verbs map directly onto the key material: activate mounts the home, deactivate unmounts it (only possible when no sessions hold it open), lock discards the in-memory key material while leaving the home mounted, and unlock re-authenticates and reinstates the keys. deactivation happens automatically when the last session of the user ends, per the PAM module's contract (source: https://www.freedesktop.org/software/systemd/man/homectl.html, weight 0.93; https://www.freedesktop.org/software/systemd/man/249/pam_systemd_home.html, weight 0.86).

## Other commands and gotchas

homectl also supports a firstboot command path, and when invoked that way it participates in the service-credentials logic implemented by ImportCredential=/LoadCredential=/SetCredential= (source: https://www.mankier.com/1/homectl, weight 0.48, weak backing: ManKier is a rendered mirror; verify against the man7.org homectl page with weight 0.78 when it matters).

One upstream interaction worth knowing when scripting enrollment: during FIDO2 setup of a new user, homectl asks for a password to finish setup after the FIDO2 PIN and user-presence confirmation, and a bug report documents this stage being time-sensitive in some flow states (source: https://github.com/systemd/systemd/issues/24281, weight 0.87). A separate 2026 issue documents FIDO2 client-PIN requirements masking EAGAIN during multi-token LUKS2 unlock attempts (source: https://github.com/systemd/systemd/issues/43342, weight 0.82).
