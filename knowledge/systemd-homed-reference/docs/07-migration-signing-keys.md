# Home migration and signing keys

Scope: moving homed homes between hosts, the Ed25519 signing key model under /var/lib/systemd/home/, and the rescan and trust steps that make a migrated home activate.

## The trust model

Every host running systemd-homed generates a local key pair used to sign the JSON user records of the homes it manages. The files live under /var/lib/systemd/home/: local.private is the private key for signing local records, local.public is the matching public key, and any additional *.public files are trusted public keys from other hosts, installed to accept homes migrated from those hosts (source: https://www.man7.org/linux/man-pages/man8/systemd-homed.8.html, weight 0.88). All of these files are PEM format, and records are signed with Ed25519 (source: https://wiki.gentoo.org/wiki/Systemd/systemd-homed, weight 0.56, weak backing: a wiki page; the key-file layout itself is corroborated by the primary man page above).

A home is therefore portable exactly as far as the destination host's trusted key set extends: a machine that trusts the signing key accepts the record without further account metadata (source: https://systemd.io/HOME_DIRECTORY/, weight 0.96).

## The standard migration flow

The man page states the minimal rule directly: to migrate a home directory from host foobar to another host quux, it is sufficient to copy /var/lib/systemd/home/local.public from foobar to quux, naming it on the destination /var/lib/systemd/home/foobar.public to reflect the key's origin (source: https://www.man7.org/linux/man-pages/man8/systemd-homed.8.html, weight 0.88).

The full operational sequence:

```bash
# on the source host: publish the signing key
scp /var/lib/systemd/home/local.public root@target:/var/lib/systemd/home/source.public

# copy the home image itself
scp /home/jenny.home root@target:/home/jenny.home

# on the target: rescan /home and activate
kill -USR1 $(systemctl show -P MainPID systemd-homed)
homectl activate jenny
```

The Gentoo wiki's variant copies both local.private and local.public from the old system to the new one alongside the home directory file; that variant transfers signing authority itself and should only be used when the destination is meant to become the home's new authoritative host (source: https://wiki.gentoo.org/wiki/Systemd/systemd-homed, weight 0.56, weak backing, labeled). The man-page flow of copying only the public key is the safer default (source: https://www.man7.org/linux/man-pages/man8/systemd-homed.8.html, weight 0.88).

## Rescan mechanics

The SIGUSR1 rescan makes systemd-homed re-scan /home/ and pick up homes that appeared on disk without a restart; restarting the service has the same effect (source: https://www.man7.org/linux/man-pages/man8/systemd-homed.8.html, weight 0.88). After rescan, `homectl activate jenny` mounts the migrated LUKS2 home and the user is synthesized on the new host from the signed record (source: https://www.freedesktop.org/software/systemd/man/259/systemd-homed.service.html, weight 0.95).

## Export-based migration

Where copying the raw image is inconvenient, homectl's export formats produce the JSON record for piping over SSH. The stripped export (-E) keeps the original signature, so it requires the destination to already trust the source key. The minimal export (-EE) strips signatures so the destination re-signs on arrival; upstream guidance is that moving a user to a target that already has other homed users requires the minimal export path, recreating the user from it (source: https://wiki.gentoo.org/wiki/Systemd/systemd-homed, weight 0.81; command surface at https://www.freedesktop.org/software/systemd/man/homectl.html, weight 0.93):

```bash
homectl inspect jenny -EE | ssh root@target homectl create -i-
```

## homectl signing-key commands

From v258, key management is also exposed as homectl verbs rather than file operations: `homectl list-signing-keys` lists the keys installed in /var/lib/systemd/home/, and `homectl add-signing-key /path/to/foobar.public --key-name=foobar.public` installs another host's public key for accepting migrated homes (source: https://www.freedesktop.org/software/systemd/man/homectl.html, weight 0.93).

## Backup implications

local.public must be backed up for migration support: it is the key every future destination host needs to trust. The private key local.private should never leave the host that signs its own records; losing it means records re-signed on that host need re-trusting everywhere (source: https://www.man7.org/linux/man-pages/man8/systemd-homed.8.html, weight 0.88; https://wiki.gentoo.org/wiki/Systemd/systemd-homed, weight 0.56, weak backing, labeled).

For conversions in the other direction (regular users into homed), the upstream converting-users guide requires a distribution with homed enabled and PAM/NSS configured, spare disk space in /home for a temporary second copy, a backup, and a fully logged-out user before starting (source: https://systemd.io/CONVERTING_TO_HOMED/, weight 0.96).
