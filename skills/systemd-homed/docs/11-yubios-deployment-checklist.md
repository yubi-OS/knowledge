# 11: The yubiOS Deployment Checklist

## Scope

The yubiOS deployment checklist for systemd-homed: service enablement, homed.conf defaults, four-stack PAM wiring, suspend=1 on graphical sessions, FIDO2 flags, and key backup discipline. Each item here is a gate, not a suggestion.

## The checklist

The source doc gives 7 gate items (source doc: yubi-OS/yubiOS skills/systemd-homed/SKILL.md, yubiOS Checklist):

1. `systemd-homed.service` enabled in image.
2. `homed.conf`: `DefaultStorage=luks`, `DefaultFileSystemType=btrfs`.
3. PAM wired with `pam_systemd_home.so` in all four stacks (auth, account, password, session).
4. `suspend=1` on the graphical session PAM entry.
5. Recovery key generated offline before enrolling FIDO2.
6. FIDO2: `--fido2-with-client-pin=yes --fido2-with-user-presence=yes`.
7. `local.public` backed up; `local.private` stored securely.

## Why each gate exists

1. The service is the whole feature. systemd-homed is a system service used to create, remove, change or inspect home areas, and most of its functionality is accessible through homectl (source: https://www.freedesktop.org/software/systemd/man/257/systemd-homed.html, weight 0.97; man page twin at weight 0.93). If the unit is not enabled in the image, homectl commands fail at the service boundary, not at the command.

2. The conf defaults are the image posture. homed.conf controls default parameters for homes created and managed by systemd-homed (source: https://www.freedesktop.org/software/systemd/man/homed.conf.html, weight 0.97), and `DefaultFileSystemType=` selects btrfs, ext4, or xfs inside the LUKS volume (source: https://www.man7.org/linux/man-pages/man5/homed.conf.5.html, weight 0.94). Details in doc 08.

3. All four stacks, not just auth. pam_systemd_home activates homes on login and deactivates them when the last session ends, and provides authentication for homed users (source: https://www.freedesktop.org/software/systemd/man/257/pam_systemd_home.html, weight 0.97). Missing it from account, password, or session stacks breaks password changes, session teardown, and unlock propagation. Details in doc 07.

4. suspend=1 erases key material from memory on suspend and requires re-authentication on resume (source: https://www.man7.org/linux/man-pages/man8/pam_systemd_home.8.html, weight 0.93). This is the yubiOS answer to a sleeping machine holding a decrypted LUKS key in RAM.

5. Recovery key ordering is a data-loss gate. The recovery key may be entered instead of a regular password to unlock the account, and the generated key should be printed or otherwise transferred to a secure location (source: https://www.freedesktop.org/software/systemd/man/250/homectl.html, weight 0.97). Generating it after FIDO2 enrollment means a lost YubiKey with no offline key equals a lost home.

6. The FIDO2 flags are the hardware enforcement. The flags are documented homectl options (source: https://www.man7.org/linux/man-pages/man1/homectl.1.html, weight 0.92), and the checklist treats them as mandatory because a FIDO2 credential without enforced PIN and presence degrades to a soft factor (source doc; known version-dependent PIN behavior in https://github.com/systemd/systemd/issues/28675, weight 0.60).

7. Key backup closes the trust loop. User records are cryptographically signed and the public key matching the signature must be installed for local login (source: https://www.man7.org/linux/man-pages/man8/systemd-homed.8.html, weight 0.92). Backing up `local.public` preserves the ability to verify records after reinstall; `local.private` must be stored securely because it signs every local record (source doc; details in doc 10).

## Verification pass

After deploying, verify each gate: `systemctl status systemd-homed` for item 1, read the drop-in for item 2, `grep pam_systemd_home /etc/pam.d/*` for item 3, confirm the session line carries `suspend=1` for item 4, run `homectl authenticate <user> --fido2-device=auto` and require PIN and touch for item 6, and list keys with `homectl list-signing-keys` (v258 and later, source doc) for item 7.

## Sources

- https://www.freedesktop.org/software/systemd/man/257/systemd-homed.html (weight 0.97)
- https://www.freedesktop.org/software/systemd/man/homed.conf.html (weight 0.97)
- https://www.freedesktop.org/software/systemd/man/250/homectl.html (weight 0.97)
- https://www.freedesktop.org/software/systemd/man/257/pam_systemd_home.html (weight 0.97)
- https://www.man7.org/linux/man-pages/man8/systemd-homed.8.html (weight 0.92)
- https://www.man7.org/linux/man-pages/man5/homed.conf.5.html (weight 0.94)
- https://www.man7.org/linux/man-pages/man1/homectl.1.html (weight 0.92)
- https://www.man7.org/linux/man-pages/man8/pam_systemd_home.8.html (weight 0.93)
- https://github.com/systemd/systemd/issues/28675 (weight 0.60)
- yubi-OS/yubiOS skills/systemd-homed/SKILL.md (source doc)
