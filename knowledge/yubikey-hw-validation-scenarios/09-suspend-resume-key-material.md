# Suspend and resume key handling on real hardware

Scope: scenario H12, proving that a homed session with the `suspend=1` PAM behavior forgets key material on suspend, so resume requires a fresh authentication (a fresh touch), not a cached session.

## The security property

Suspend is a credential-lifetime boundary. If the volume key or session authorization survives suspend in memory, then anyone with brief physical access to a suspended machine inherits an unlocked session. The yubiOS posture requires the opposite: suspend drops the key material, and resume re-establishes trust through the token again.

## The mechanism

The homed PAM module has the knob directly: `pam_systemd_home` documents a `suspend` option, where if true, the user's home directory is suspended automatically during system suspend, and if false it remains active; automatic suspending improves security substantially because secret key material is automatically dropped from memory [1] (weight 0.88). That documentation sentence is the authoritative anchor for the whole scenario: the drop of key material on suspend is a designed, configurable behavior, and H12 exists to verify it is actually configured and actually happens on yubiOS hardware.

The physical-key side of the resume: pam_u2f, Yubico's PAM module for U2F and FIDO2 [2] (weight 0.85), is the module that would gate the re-authentication with a touch. Gentoo's wiki documents the general shape of YubiKey PAM integration across interfaces [3] (weight 0.71).

## The run

1. Configure the homed PAM entry with suspend behavior enabled (`suspend=1`).
2. Open a homed session, confirm it is unlocked and usable.
3. Suspend the machine.
4. Resume.
5. Attempt to use the session immediately.

Pass: the resumed session requires fresh authentication (PIN plus touch on the physical key) before the home is usable again, and the PAM/session log shows the re-authentication event rather than a silent continuation.

Evidence: the session and resume PAM log. The transcript must show the suspension of the home and the re-authentication on resume as separate events.

## What would count as a failure

- Resume returns straight to an unlocked session with no re-auth prompt: the key material survived suspend, which defeats the property in [1].
- The PAM log shows no suspension event: the `suspend=1` behavior is not wired into the yubiOS PAM stack at all.
- Re-auth on resume succeeds without the physical key present: the touch/presence requirement has leaked, which overlaps H6's concern but at the resume boundary.

## Context from upstream behavior

An upstream systemd issue covering FIDO2 with systemd-homed documents the interaction of password fallback and user presence on homed logins: with the token not inserted, unlocking still worked with the password [4] (weight 0.68). That is the static-login analogue of H12's question, and it frames what the resume log must distinguish: a re-auth prompt that falls back to password-only is a different outcome from a re-auth prompt that demands the token, and the evidence capture must tell them apart.

## Why hardware matters for this scenario

Suspend/resume is a firmware-and-kernel event sequence (ACPI sleep states, device power-down and re-enumeration). The USB HID device disappears and reappears across the cycle. A software token never disappears, so it cannot reveal the class of bug where the re-auth prompt races the device re-enumeration, or where the resumed session holds a stale handle to the old token instance. H12 is therefore in the real-hardware minimum set even though its PAM knobs look software-configurable.

## Pass criteria summary

- Suspend drops the home's key material (home suspended event in the log).
- Resume requires fresh authentication with the physical key.
- No unlock without the fresh touch on resume.
- Full PAM/session log captured.

## Sources

- [1] https://www.freedesktop.org/software/systemd/man/255/pam_systemd_home.html (jev weight 0.88)
- [2] https://github.com/Yubico/pam-u2f (jev weight 0.85)
- [3] https://wiki.gentoo.org/wiki/YubiKey/PAM (jev weight 0.71)
- [4] https://github.com/systemd/systemd/issues/27909 (jev weight 0.68)
