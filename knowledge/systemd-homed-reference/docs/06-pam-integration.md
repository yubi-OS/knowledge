# PAM integration: pam_systemd_home

Scope: wiring pam_systemd_home into the PAM stack across auth, account, password, and session, and the suspend=1 key-material behavior.

## What the module does

pam_systemd_home ensures that home directories managed by systemd-homed.service are automatically activated (mounted) on user login and deactivated (unmounted) when the last session of the user ends. For users with per-user disk encryption, the module also provides authentication, since the disk encryption key is derived from the user's authentication (source: https://www.freedesktop.org/software/systemd/man/249/pam_systemd_home.html, weight 0.86; https://www.freedesktop.org/software/systemd/man/257/pam_systemd_home.html, weight 0.89).

Because of that dual role, the module participates in all four PAM management groups: auth (unlocking the home and deriving the LUKS2 key), account (checking the synthesized user record), password (changing the user's password and re-keying the volume), and session (mount/activate plus suspend handling).

## The stack wiring

The upstream man page ships a reference fragment showing the correct structure: a dashed (optional-with-fallback) pam_systemd_home.so line first, followed by pam_unix, with the dashed lines using bracketed action control so that a homed user's success short-circuits the rest of the stack while non-homed users fall through to pam_unix:

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

(source: https://www.man7.org/linux/man-pages/man8/pam_systemd_home.8.html, weight 0.85; the bracketed-control semantics appear in the same fragment at https://www.man7.org/linux/man-pages/man8/pam_systemd_home.8.html, weight 0.62)

File placement varies by distribution: /etc/pam.d/system-auth on Arch-family systems, /etc/pam.d/common-auth (and common-session, common-password) on Debian and Ubuntu (source: https://oneuptime.com/blog/post/2026-03-02-how-to-set-up-systemd-homed-for-modern-user-management-on-ubuntu/view, weight 0.31, weak backing: a vendor blog; the module lines themselves should be checked against the man page above before shipping).

## suspend=1: forget key material on suspend

The suspend=1 session option makes the module forget the LUKS2 key material when the system suspends. The home stays locked, in the sense that its encryption keys are gone from memory, until the user re-authenticates after resume (source: https://wiki.archlinux.org/title/Systemd-homed, weight 0.86). Turning the option on by default is highly recommended for graphical sessions, and the recommendation is tied to having a lock screen that re-authenticates the user through PAM on resume (source: https://man7.org/linux/man-pages/man8/pam_systemd_home.8.html, weight 0.85).

The behavior is also controllable at runtime through the SYSTEMD_HOME_SUSPEND environment variable, which pam_systemd_home reads during initialization and sets for sessions it spawns (source: https://www.freedesktop.org/software/systemd/man/latest/pam_systemd_home.html, weight 0.95).

Two operational caveats follow. First, as of the ArchWiki snapshot no session manager shipped suspend-on-suspend support out of the box, so a graphical environment needs explicit integration to make resume re-authentication happen (source: https://wiki.archlinux.org/title/Systemd-homed, weight 0.86). Second, a TTY (text console) session will appear hung after resume when suspend=1 is active, because its key material is gone and it cannot re-authenticate itself; the user must re-authenticate through another channel, such as the graphical lock screen, for the TTY to continue (source: https://man7.org/linux/man-pages/man8/pam_systemd_home.8.html, weight 0.85).

## SSH sessions

SSH logins of homed users go through the same PAM machinery: the module activates the home at authentication time on the sshd session side. The practical Ubuntu-oriented guidance is that pam_systemd_home belongs in the session stack used by sshd, with the exact file depending on the distro's PAM layout (source: https://oneuptime.com/blog/post/2026-03-02-how-to-set-up-systemd-homed-for-modern-user-management-on-ubuntu/view, weight 0.31, weak backing: vendor blog, labeled as such). A deeper SSH-specific caveat for LUKS2 homes, that public-key SSH authentication can bypass the interactive password ceremony the LUKS2 key derivation expects on shared multi-user servers, is discussed in the storage doc's selection guidance (source: https://www.bigiron.cc/guides/systemd-homed-for-multi-user-servers-the-2026-verdict, weight 0.14, weak backing, clearly labeled).

## Baseline for an image build

For a LUKS2-first image the minimum PAM baseline is: the dashed auth/account/password/session lines wired in the system-auth (or distro equivalent) files, suspend=1 on the graphical session's session line, and a lock screen that re-authenticates via PAM so suspended homes can be re-locked and re-unlocked cleanly (source: https://man7.org/linux/man-pages/man8/pam_systemd_home.8.html, weight 0.85; https://wiki.archlinux.org/title/Systemd-homed, weight 0.86).
