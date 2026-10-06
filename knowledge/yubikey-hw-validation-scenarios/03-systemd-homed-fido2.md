# systemd-homed with FIDO2 on real hardware

Scope: scenarios H4 and H5, the homed boundary: `homectl create` with LUKS storage and FIDO2 enrollment on real hardware, login gated on key presence, and the recovery-key unlock path when the key is gone.

## Why homed needs its own hardware run

systemd-homed gives each user a LUKS-encrypted home volume, stored as a loopback image, managed end to end by the homed service [1] (weight 0.88). That makes the home directory itself a trust boundary: the YubiKey is not just gating a login prompt, it is one of the credentials that can open the user's storage. A software stand-in can pretend to be a FIDO2 token, but it cannot prove that the homed daemon, the PAM stack, and the physical key agree on presence, PIN, and timing in the login path.

## H4: create and unlock

The tooling is `homectl`, the utility for creating, updating, and inspecting homed users and their home directories and `~/.identity` records [2] (weight 0.82). The homectl manual page shows the storage field being set to `luks` as a first-class configuration [3] (weight 0.83).

The H4 run:

1. `homectl create <user> --storage=luks --fido2-device=auto` on the real machine.
2. Log out, then log back in with the key present and touched.
3. Capture `homectl inspect <user>` and the login session log.

The inspect output is the enrollment evidence: it must show the FIDO2 device bound to the home. The login log is the unlock evidence. Community guides for the same flow confirm the shape of the operation: FIDO2 can also be enrolled onto an existing homed user with `homectl update <user> --fido2-device=auto`, with the user's password remaining as fallback [4] (weight 0.11, weak backing). The weak rating is honest here: the exact flag behavior should be re-verified against the homectl manual page during the run [3].

An upstream issue illustrates what the login gate must and must not do: a systemd-homed user configured with a password and FIDO2 user presence found that when the token was not inserted, unlocking still worked with the password [5] (weight 0.68). That is expected behavior (the password remains a valid factor), but it defines the boundary H4 documents on yubiOS: key presence gates the FIDO2 factor specifically, not the account entirely, unless yubiOS policy says otherwise.

## H5: recovery key with the key destroyed

H5 is the recovery-path proof. Before FIDO2 enrollment, generate a recovery key offline. Then simulate loss or destruction of the YubiKey and unlock the home with the recovery key alone.

The mechanism is the same enrollment surface as the LUKS2 boundary: systemd-cryptenroll supports enrolling recovery keys alongside FIDO2 tokens and other credential types into the LUKS2 volume [6] (weight 0.97). Because homed with `--storage=luks` sits on a LUKS2 volume, the recovery key is a LUKS2 passphrase slot, not a homed-only concept, so the unlock path survives even if the homed daemon is unhealthy.

What H5 must capture:

- The recovery-key generation transcript, taken before enrollment.
- The unlock transcript with the key physically absent, proving the recovery path is functional and not just documented.
- `homectl inspect` or LUKS2 slot state after recovery unlock, showing the FIDO2 slot untouched by the recovery path.

The ordering matters: the recovery key must be generated and recorded before the FIDO2 enrollment, because the scenario's point is that the recovery path was never dependent on the key.

## Pass criteria

- H4: home created with luks storage and FIDO2 device; login requires the key interaction and succeeds with it; inspect output shows the enrollment.
- H5: unlock succeeds with the recovery key while the YubiKey is absent; the FIDO2 enrollment remains intact afterward.
- Both runs capture their transcripts as the real-hardware evidence record.

## Sources

- [1] http://0pointer.net/blog/authenticated-boot-and-disk-encryption-on-linux.html (jev weight 0.88)
- [2] https://wiki.archlinux.org/title/Systemd-homed (jev weight 0.82)
- [3] https://www.man7.org/linux/man-pages/man1/homectl.1.html (jev weight 0.83)
- [4] https://oneuptime.com/blog/post/2026-03-02-how-to-set-up-systemd-homed-for-modern-user-management-on-ubuntu/vi (jev weight 0.11, weak backing)
- [5] https://github.com/systemd/systemd/issues/27909 (jev weight 0.68)
- [6] https://www.freedesktop.org/software/systemd/man/latest/systemd-cryptenroll.html (jev weight 0.97)
