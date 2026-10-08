# 02: Creating a LUKS2 Home with FIDO2

## Scope

Creating a LUKS2-encrypted home with FIDO2 unlock: the homectl create flag set yubiOS uses, btrfs inside the LUKS volume, recovery key ordering, and the FIDO2 client PIN plus user-presence requirements.

## The yubiOS create pattern

The source doc gives the full yubiOS pattern (source doc: yubi-OS/yubiOS skills/systemd-homed/SKILL.md, Create a LUKS2 Home with FIDO2):

```bash
homectl create jenny \
  --storage=luks \
  --fs-type=btrfs \
  --disk-size=20G \
  --member-of=wheel \
  --recovery-key \
  --fido2-device=auto \
  --fido2-with-client-pin=yes \
  --fido2-with-user-presence=yes
```

Two properties are mandatory in this pattern: FIDO2 requires both the client PIN and user presence (touch), and the recovery key is generated first and stored offline before the passphrase is removed. The recovery key is the break-glass credential if the YubiKey is lost; the homectl man page documents adding a recovery key to an existing user account and notes the key is generated, shown on screen, and should be printed or otherwise transferred to a secure location, and that a recovery key may be entered instead of a regular password to unlock the account (source: https://www.man7.org/linux/man-pages/man1/homectl.1.html, weight 0.92).

## What the flags do

The homectl man page documents the FIDO2 option family: `--fido2-device=auto` allows a FIDO2 security token to unlock the account, and the `--fido2-with-client-pin` and `--fido2-with-user-presence` switches control whether the token enforces PIN entry and touch at unlock time (source: https://www.man7.org/linux/man-pages/man1/homectl.1.html, weight 0.92). `--storage=luks` selects the LUKS image storage mechanism, and the LUKS image path defaults to `/home/<user>.home` (source: https://wiki.archlinux.org/title/Systemd-homed, weight 0.38, weak backing, but matches the homectl man page).

The `--fs-type=btrfs` choice is a yubiOS convention: btrfs gives checksummed, compressed storage inside the encrypted volume, which aligns with the yubiOS image model that prefers btrfs for verifiable filesystem content (source doc).

## FIDO2 behavior at login

Desktop integration matters for this pattern. When the account has both a password and a FIDO2 credential, behavior differs depending on whether the token is inserted: with the token present the login flow prompts for token interaction, with the token absent unlocking falls back to password (source: https://github.com/systemd/systemd/issues/27909, weight 0.75). This is the reason yubiOS pairs FIDO2 with a recovery key and, in hardened configurations, removes or de-emphasizes the password: a password-only fallback path can weaken the hardware-bound model.

There are known sharp edges. One reported issue is that cryptenroll/homed flows never prompt for the FIDO2 client PIN in some versions, which changes the effective security of the credential (source: https://github.com/systemd/systemd/issues/28675, weight 0.60). The yubiOS checklist therefore treats the PIN and presence flags as deployment gates, not defaults: verify on the actual image that PIN and touch are enforced (see doc 11).

A practical dry-run aid exists: setting the environment variable `Systemd_HOME_DRY_RUN=1` makes homectl create and homectl update assemble and display the new user record in JSON format without passing it to systemd-homed for execution (source: https://systemd.io/ENVIRONMENT/, weight 0.85). Use it to validate the record before the first real create.

## Ordering discipline

1. Generate and store the recovery key offline. The homectl man page stresses printing or transferring the generated key to a secure location (source: https://www.man7.org/linux/man-pages/man1/homectl.1.html, weight 0.92).
2. Then enroll FIDO2 with PIN and presence required.
3. Only then consider removing or weakening the passphrase, so the YubiKey is not the single unlock factor.

Community guidance agrees on the ordering: setting up a recovery key is recommended in case the device is lost or broken (source: https://wiki.archlinux.org/title/Systemd-homed, weight 0.38, weak backing).

## Sources

- https://www.man7.org/linux/man-pages/man1/homectl.1.html (weight 0.92)
- https://github.com/systemd/systemd/issues/27909 (weight 0.75)
- https://github.com/systemd/systemd/issues/28675 (weight 0.60)
- https://systemd.io/ENVIRONMENT/ (weight 0.85)
- https://wiki.archlinux.org/title/Systemd-homed (weight 0.38, weak)
- yubi-OS/yubiOS skills/systemd-homed/SKILL.md (source doc)
