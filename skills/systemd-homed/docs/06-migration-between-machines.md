# 06: Migrating a Home Between Machines

## Scope

Moving a home between machines: source public key exchange, copying the `.home` file, rescan via SIGUSR1 since v258, activation, and re-signing with the target host key.

## The five-step flow

The source doc gives the migration sequence (source doc: yubi-OS/yubiOS skills/systemd-homed/SKILL.md, Migration Between Machines):

```bash
# 1. authorize the migrated home on the target
scp /var/lib/systemd/home/local.public \
    root@target:/var/lib/systemd/home/source-host.public

# 2. copy the home file
scp /home/jenny.home root@target:/home/jenny.home

# 3. rescan (SIGUSR1 since v258) or restart homed
kill -USR1 $(systemctl show -P MainPID systemd-homed)

# 4. activate
homectl activate jenny

# 5. re-sign on target
homectl inspect jenny -EE | homectl create -i-
```

Each step maps to a documented mechanism:

1. The public key drop is the trust step. User records are cryptographically signed, and for a user to be permitted to log in locally the public key matching the signature of their user record must be installed (source: https://www.man7.org/linux/man-pages/man8/systemd-homed.8.html, weight 0.92). Naming the copied key `source-host.public` in `/var/lib/systemd/home/` makes the target trust homes signed by the source host (source doc).
2. The home file is self-contained: each home encapsulates both the data store and the user record (source: https://systemd.io/HOME_DIRECTORY/, weight 0.93), so the `.home` LUKS image is the whole account.
3. SIGUSR1 makes systemd-homed reestablish its file watches on /home/ and rescan the directory for home directories; this behavior was added in version 258 (source: https://www.man7.org/linux/man-pages/man8/systemd-homed.8.html, weight 0.94; corroborated by https://manpages.debian.org/testing/systemd-homed/systemd-homed.8.en.html, weight 0.92).
4. Activation mounts the LUKS image and starts the session state.
5. Re-signing removes the original signature so the local key takes over; the `homectl inspect -EE | homectl create -i-` idiom reads the full record including the embedded signature block and re-registers it under the target host key (source doc).

## Key-material notes

The private key of the public/private key pair used for local records lives at `/var/lib/systemd/home/local.private` (source: https://manpages.ubuntu.com/manpages/stonking/man8/systemd-homed.service.8.html, weight 0.78). A community report confirms the alternative: copying `local.private` and `local.public` to the new machine makes migrated users behave as if they were created locally with homectl (source: https://github.com/systemd/systemd/issues/25103, weight 0.64). Copying the private key is the stronger, riskier option; the source-doc flow keeps the private key on the source host and only copies the public key, which is the yubiOS default.

A community migration report describes exactly the friction this flow solves: after migrating homed users onto a new machine, the author could not figure out from the man pages how to get the migrated users accepted (source: https://bbs.archlinux.org/viewtopic.php?id=304411, weight 0.07, weak backing, forum). The answer is steps 1 and 5: trust the source signature, then re-sign.

## Relation to conversion

For converting pre-existing traditional users into homed-managed homes, upstream documents the preparations separately: make sure the distribution has systemd-homed enabled and properly set up, including the necessary PAM and NSS configuration updates, and make sure there is enough disk space in /home/ for a temporary second copy of the home directory (source: https://systemd.io/CONVERTING_TO_HOMED/, weight 0.88). Migration between two homed machines (this doc) is simpler than conversion because no re-formatting is needed.

## Security check before accepting a migrated home

The advisory on the local privilege escalation via arbitrary system group addition to homed users (patched in v262 and point releases back to v258) matters here because a migrated home carries its `memberOf` list with it (source: https://github.com/systemd/systemd/security/advisories/GHSA-jm29-p7hh-vjhv, weight 0.78). Inspect the incoming record (`homectl inspect --json=pretty`) for group membership before activation on a patched host.

## Sources

- https://www.man7.org/linux/man-pages/man8/systemd-homed.8.html (weights 0.94 and 0.92)
- https://systemd.io/HOME_DIRECTORY/ (weight 0.93)
- https://manpages.debian.org/testing/systemd-homed/systemd-homed.8.en.html (weight 0.92)
- https://manpages.ubuntu.com/manpages/stonking/man8/systemd-homed.service.8.html (weight 0.78)
- https://github.com/systemd/systemd/security/advisories/GHSA-jm29-p7hh-vjhv (weight 0.78)
- https://github.com/systemd/systemd/issues/25103 (weight 0.64)
- https://systemd.io/CONVERTING_TO_HOMED/ (weight 0.88)
- https://bbs.archlinux.org/viewtopic.php?id=304411 (weight 0.07, weak)
- yubi-OS/yubiOS skills/systemd-homed/SKILL.md (source doc)
