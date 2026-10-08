# 03: Enrolling FIDO2 on an Existing Home

## Scope

Enrolling FIDO2 on a home that already exists via `homectl authenticate`, updating or replacing the recovery key on v259 and later, and what stays true about password fallback.

## Enrollment on an existing home

The source doc gives two commands (source doc: yubi-OS/yubiOS skills/systemd-homed/SKILL.md, Enroll FIDO2 on an Existing Home):

```bash
homectl authenticate jenny \
  --fido2-device=auto \
  --fido2-with-client-pin=yes \
  --fido2-with-user-presence=yes

homectl update jenny --recovery-key=
```

The homectl man page documents the equivalent flows for an existing account: `homectl update <user> --fido2-device=auto` sets up authentication with a FIDO2 security token, and adding a recovery key to an existing user account generates and shows the key, which should be printed or otherwise transferred to a secure location (source: https://www.man7.org/linux/man-pages/man1/homectl.1.html, weight 0.93). The `authenticate` verb exercises the full unlock path against the existing home, which makes it the right verification step after any credential change: it should require the YubiKey, ask for the PIN, and wait for touch.

The v259 note in the source doc (`homectl update jenny --recovery-key=` for update or replace) matches the release timeline: systemd v259 was released in December 2025 (source: https://lwn.net/Articles/1051163/, weight 0.41, weak backing, news summary). Community reporting on the merge describes the gap it closes: until then homectl only allowed setting a recovery key when creating a user, with no way to add or replace one afterward (source: https://www.linkedin.com/posts/govindven_featurehomectl-recovery-key-update-by-gvenugo3-activity-7383896776568676352-4ern, weight 0.05, weak backing, social post). Treat the v259 recovery-key update as real but verify on your image's systemd version before scripting it.

## Password fallback reality

Enrolling FIDO2 does not by itself remove the password. A user configured with a password and a FIDO2 token can still log in with the password when the token is absent; when the token is inserted, the login flow prompts for token interaction (source: https://github.com/systemd/systemd/issues/27909, weight 0.75). A separate report on the tty path observed that password-only login from a tty remained possible after FIDO2 enrollment (source: https://unix.stackexchange.com/questions/674453/systemd-homed-with-fido2-login-from-tty-still-possible-with-password-only, weight 0.10, weak backing, Q&A forum, consistent with the GitHub issue above).

For yubiOS the operational conclusion is: FIDO2 enrollment is an additional factor, not a replacement. If the threat model requires hardware possession, remove or rotate the password after the recovery key is safely offline (source doc ordering, see doc 02).

## Practical sequence

1. Verify the current unlock path with `homectl authenticate <user> --fido2-device=auto --fido2-with-client-pin=yes --fido2-with-user-presence=yes`.
2. On v259 or newer, rotate the recovery key with `homectl update <user> --recovery-key=` and store the new key offline immediately (source doc; verify against https://www.man7.org/linux/man-pages/man1/homectl.1.html, weight 0.93).
3. Keep `Systemd_HOME_DRY_RUN=1` in mind for previewing `update` record changes without executing them (source: https://systemd.io/ENVIRONMENT/, weight 0.85).

## Sources

- https://www.man7.org/linux/man-pages/man1/homectl.1.html (weight 0.93)
- https://github.com/systemd/systemd/issues/27909 (weight 0.75)
- https://systemd.io/ENVIRONMENT/ (weight 0.85)
- https://lwn.net/Articles/1051163/ (weight 0.41, weak)
- https://unix.stackexchange.com/questions/674453/systemd-homed-with-fido2-login-from-tty-still-possible-with-password-only (weight 0.10, weak)
- https://www.linkedin.com/posts/govindven_featurehomectl-recovery-key-update-by-gvenugo3-activity-7383896776568676352-4ern (weight 0.05, weak)
- yubi-OS/yubiOS skills/systemd-homed/SKILL.md (source doc)
