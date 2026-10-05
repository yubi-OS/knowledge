# 02. systemd-homed home unlock: a second interactive boundary at login

Scope: systemd-homed FIDO2 unlock of the home directory at login: prompt loop, passphrase fallback when enrolled, home stays locked on no touch.

## The boundary is different from the root volume

The LUKS2 root unlock happens once per boot in the initrd (doc 01). The homed boundary happens at every login, because systemd-homed provides portable human user accounts whose storage can be encrypted per user, with the user's information in an identity record on the storage medium (source: https://wiki.archlinux.org/title/Systemd-homed, jev weight 0.44, weak backing). That difference changes the mode: the root unlock is a boot-time event, the home unlock is a per-session event, and the two can fail independently.

## What the FIDO2 mode looks like in practice

A homed user configured with a password and FIDO2 with user presence shows a mode split that matters operationally: when the token is not inserted, the display manager prints the relevant message and unlocking works with the password as expected; when the token is inserted, the login was seen to reject the password twice before proceeding in one reported case (source: https://github.com/systemd/systemd/issues/27909, jev weight 0.83). That report is the honest picture of the mode: the presence of the token changes the prompt sequence, and the interaction between token presence and password fallback was, at least at that report's date, rough around the edges.

Another reported failure mode is worse: a homed user with a LUKS volume and a YubiKey 5 saw systemd-homed abort on login (source: https://github.com/systemd/systemd/issues/24036, jev weight 0.78). These reports date from systemd 251-era releases (source: https://github.com/systemd/systemd/issues/24036, jev weight 0.78).

## The fallback loop and its known gaps

The upstream issue tracker carries the mode question directly. In a report titled "FIDO2 fallback to password", two situations are described: if the FIDO2 token is not present, systemd waits forever; if the token is present but libfido2 itself fails, the system switches to emergency mode; the report asks whether a timeout before systemd stops waiting for a passphrase or an alternative method could be introduced (source: https://github.com/systemd/systemd/issues/19872, jev weight 0.73).

That is the sharpest documented statement of the home-unlock mode gap: the waiting behavior when the token is absent is indefinite, and the failure behavior when the token is present but broken is emergency mode, not a quiet passphrase prompt. For an operator the takeaway is that the homed fallback is weaker than the root-volume fallback: at the root volume a second enrolled keyslot is reached through the ordinary unlock path, while the homed report describes waits and emergency shells.

## Why the home boundary tolerates interactivity

Unlike the boot chain, login is already a human moment. The user is present by definition, so an interactive touch at the home boundary costs nothing extra, and if the user is not present the home directory simply stays locked. The rest of the system keeps running either way: a locked home is a per-user condition, not a machine condition. This is the structural reason the source architecture treats homed as a lower-stakes interactive boundary than the initrd root unlock: the failure of a home unlock costs one user's session, the failure of a root unlock costs the boot.

## Mode summary

1. Interactive: yes, at every login when the token is present.
2. Timeout: not documented as bounded; the upstream report describes indefinite waiting when the token is absent (source: https://github.com/systemd/systemd/issues/19872, jev weight 0.73).
3. Fallback: password when enrolled and the token is absent; emergency mode was the observed outcome when the token is present but libfido2 fails (source: https://github.com/systemd/systemd/issues/19872, jev weight 0.73).
4. Unattended: home stays locked, services unaffected; the failure is scoped to the user session.
