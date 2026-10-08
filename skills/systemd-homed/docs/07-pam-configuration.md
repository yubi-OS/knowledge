# 07: PAM Configuration for Homed Users

## Scope

PAM wiring for homed users: `pam_systemd_home.so` across the auth, account, password, and session stacks, control-flag semantics, and `suspend=1` key erasure on suspend.

## The module's job

pam_systemd_home ensures that home directories managed by systemd-homed.service are automatically activated (mounted) on user login and deactivated (unmounted) when the last session of the user ends; for such users it also provides authentication services (source: https://www.freedesktop.org/software/systemd/man/257/pam_systemd_home.html, weight 0.97; same description in the 249-era page, weight 0.96). In other words, the module is both the unlock trigger and the account check for homed users: without it, login for a homed user cannot work even when the home file is present.

## The yubiOS wiring

The source doc wires the module into all four PAM stacks in `/etc/pam.d/system-auth` (source doc: yubi-OS/yubiOS skills/systemd-homed/SKILL.md, PAM Configuration):

```
-auth [success=done authtok_err=bad perm_denied=bad maxtries=bad default=ignore] pam_systemd_home.so
auth      sufficient  pam_unix.so

-account [success=done authtok_expired=bad new_authtok_reqd=bad maxtries=bad acct_expired=bad default=ignore] pam_systemd_home.so
account   required    pam_unix.so

-password sufficient  pam_systemd_home.so
password  sufficient  pam_unix.so sha512 shadow try_first_pass

-session  optional    pam_systemd_home.so suspend=1
-session  optional    pam_systemd.so
session   required    pam_unix.so
```

The `-` prefixed lines are the PAM "sufficient-with-jump" idiom: when the module succeeds and the control value is `success=done`, PAM skips the remaining auth steps for that stack, and any of the listed failure codes map to the given action while everything else defaults to ignore. PAM configuration files live per service in `/etc/pam.d/`, and the four groups (account, authentication, password, session management) with their control values are the standard PAM model (source: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/7/html/system-level_authentication_guide/pam_configuration_files, weight 0.46, weak-to-moderate backing; see also https://wiki.archlinux.org/title/PAM, weight 0.36, weak backing).

Keeping `pam_unix.so` after `pam_systemd_home.so` in each stack preserves the fallback for non-homed accounts (root, service accounts), which is why the yubiOS pattern uses `sufficient` rather than `required` for the unix lines.

## suspend=1: key erasure on suspend

On the session stack the module is configured with `suspend=1`. The man page documents the semantics: if true, the home directory of the user will be suspended automatically during system suspend; if false it will remain active. Automatic suspending of the home directory improves security substantially as secret key material is automatically removed from memory before the system is put to sleep, and must be re-acquired through user re-authentication when coming back from suspend (source: https://www.freedesktop.org/software/systemd/man/latest/pam_systemd_home.html, weight 0.97; same wording at https://www.man7.org/linux/man-pages/man8/pam_systemd_home.8.html, weight 0.93).

The source doc adds the operational caveats (source doc): the home stays locked until re-auth on resume, the display manager and lock screen must re-auth via PAM for this to be usable, and TTY sessions will hang on resume until another session re-auths. Community discussion of the feature confirms the intent, forgetting the LUKS key on suspend so data stays protected (source: https://discuss.kde.org/t/plasma-session-forget-key-on-suspend/12282, weight 0.05, weak backing, forum), and notes that the module also handles features like XDG areas alongside the suspend behavior (source: https://github.com/Vladimir-csp/uwsm/issues/176, weight 0.14, weak backing).

## Placement notes

1. `pam_systemd.so` (weight 0.85, https://man7.org/linux/man-pages/man8/pam_systemd.8.html) stays on the session stack after the homed module; it registers sessions with systemd-logind and is not homed-specific.
2. ArchWiki documents a "forget key on suspend" setup section built from exactly this PAM line (source: https://wiki.archlinux.org/title/Systemd-homed, weight 0.34, weak backing).
3. The yubiOS checklist requires the module in all four stacks and `suspend=1` on the graphical session entry specifically (see doc 11), because key erasure is only meaningful for interactive sessions that suspend.

## Sources

- https://www.freedesktop.org/software/systemd/man/257/pam_systemd_home.html (weight 0.97)
- https://www.freedesktop.org/software/systemd/man/latest/pam_systemd_home.html (weight 0.97)
- https://www.freedesktop.org/software/systemd/man/249/pam_systemd_home.html (weight 0.96)
- https://www.man7.org/linux/man-pages/man8/pam_systemd_home.8.html (weight 0.93)
- https://man.archlinux.org/man/pam_systemd_home.8 (weight 0.80)
- https://man7.org/linux/man-pages/man8/pam_systemd.8.html (weight 0.85)
- https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/7/html/system-level_authentication_guide/pam_configuration_files (weight 0.46, weak-to-moderate)
- https://wiki.archlinux.org/title/PAM (weight 0.36, weak)
- https://wiki.archlinux.org/title/Systemd-homed (weight 0.34, weak)
- https://github.com/Vladimir-csp/uwsm/issues/176 (weight 0.14, weak)
- https://discuss.kde.org/t/plasma-session-forget-key-on-suspend/12282 (weight 0.05, weak)
- yubi-OS/yubiOS skills/systemd-homed/SKILL.md (source doc)
