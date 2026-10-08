# 10: Signing Keys and Record Trust

## Scope

Home record signing keys: `local.private` and `local.public` under `/var/lib/systemd/home`, trusted remote public keys, and the v258 and later D-Bus signing-key management verbs.

## The three files

The source doc tabulates the key files (source doc: yubi-OS/yubiOS skills/systemd-homed/SKILL.md, Signing Keys):

| File | Purpose |
|---|---|
| `/var/lib/systemd/home/local.private` | Signs local user records (back this up) |
| `/var/lib/systemd/home/local.public` | Matching public key |
| `/var/lib/systemd/home/*.public` | Trusted keys from other hosts |

The man page confirms the private half: `/var/lib/systemd/home/local.private` is the private key of the public/private key pair used for local records (source: https://manpages.ubuntu.com/manpages/stonking/man8/systemd-homed.service.8.html, weight 0.78). The same man page documents the migration idiom for this pair: to move records signed by host "foobar" so they verify on host "quux", the `local.private` and `local.public` files need to be copied from "foobar" to "quux" under the identical paths, since currently only a single private key is supported (source: https://www.man7.org/linux/man-pages/man8/systemd-homed.8.html, weight 0.83). An upstream issue discussing multiple signing keys records the same practical recipe: copy `local.private` and `local.public` to the new machine, and everything just works as if the migrated users had been created locally (source: https://github.com/systemd/systemd/issues/25103, weight 0.64).

Why signatures matter: user records are cryptographically signed and the signature is part of the JSON record itself; for a user to be permitted to log in locally, the public key matching the signature of their user record must be installed (source: https://www.man7.org/linux/man-pages/man8/systemd-homed.8.html, weight 0.92). This is what makes the migration flow in doc 06 possible and what makes `local.private` the single most valuable file to protect.

## v258+ key management verbs

The source doc lists the D-Bus-era verbs (source doc):

```bash
homectl list-signing-keys
homectl add-signing-key /path/to/remote.public --key-name=remote.public
```

The homectl man page documents `add-signing-key`: add public key(s) from the specified PEM key file(s) to the list of keys that home areas have to be signed by to be permitted for local login; a path of `-` or no file reads the key from standard input (source: https://www.man7.org/linux/man-pages/man1/homectl.1.html, weight 0.93). The release-notes coverage of v258 lists the full verb family: `homectl list-signing-keys`, `get-signing-key`, `add-signing-key`, `remove-signing-key` (source: http://0pointer.net/blog/category/projects.html, weight 0.45, weak-to-moderate backing, blog index). A Mastodon post by the systemd maintainer shows the pipe idiom these verbs enable: `homectl get-signing-key local.public | ssh targetsystem homectl add-signing-key --key-name=foobar.public`, getting the public half of the local key pair and installing it on a remote system with a rename on the fly (source: https://mastodon.social/@pid_eins/115025566613475212, weight 0.12, weak backing, social post, but from the maintainer).

## Operational discipline

1. `local.private` is the signing root for all locally created homes. Back it up offline; lose it and you cannot re-sign or mint new homes on that host (source doc: "back this up").
2. Never copy `local.private` to a machine you do not fully control; the public-key-exchange migration flow (doc 06) exists precisely to avoid that (source doc).
3. Keep the `*.public` trust list minimal and named by origin host (`source-host.public`), so trust is auditable per machine (source doc).
4. Recovery keys are a separate credential class from signing keys: a recovery key is generated, shown on screen, and should be printed or otherwise transferred to a secure location, and may be entered instead of a regular password to unlock the account (source: https://www.freedesktop.org/software/systemd/man/250/homectl.html, weight 0.97).

## Sources

- https://www.man7.org/linux/man-pages/man1/homectl.1.html (weight 0.93)
- https://www.man7.org/linux/man-pages/man8/systemd-homed.8.html (weights 0.92 and 0.83)
- https://www.freedesktop.org/software/systemd/man/250/homectl.html (weight 0.97)
- https://manpages.ubuntu.com/manpages/stonking/man8/systemd-homed.service.8.html (weight 0.78)
- https://github.com/systemd/systemd/issues/25103 (weight 0.64)
- http://0pointer.net/blog/category/projects.html (weight 0.45, weak-to-moderate)
- https://mastodon.social/@pid_eins/115025566613475212 (weight 0.12, weak)
- yubi-OS/yubiOS skills/systemd-homed/SKILL.md (source doc)
