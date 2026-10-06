# LUKS2 unlock failure handling on real hardware

Scope: scenarios H2 and H3, the two adverse cases for the LUKS2 boundary: booting with the key absent, and booting with the key present but the touch never given.

## Why failure handling is its own scenario pair

H1 proves the happy path. H2 and H3 prove the invariant that matters operationally: no unlock without both factors, and clean, retryable failure when either factor is missing. Software emulators cannot reproduce either case faithfully, because a software token is always "inserted" and its presence check is a function call rather than a USB HID event.

## H2: key absent at boot

The expected behavior when the enrolled YubiKey is unplugged is a fall back to the passphrase prompt. The volume must not unlock silently, and the machine must not wedge into an unrecoverable state.

The upstream bug tracker documents how delicate this path is. A systemd issue describes a LUKS unlock failure with a FIDO2 token under `gpt-auto` discovery where the system did not handle the missing-token path cleanly, and the reporter expected automatic fallback to a recovery passphrase unlock [1] (weight 0.83). Filed against systemd, it shows that even the reference implementation has had gaps in exactly this scenario, which is the strongest argument for exercising it on real hardware rather than assuming it works.

A community report of the same boundary shows the failure surface from the user side: on boot, the prompt ordering asked for a recovery key first, then only after deliberately failing that prompt did it reach the FIDO2 presence prompt [2] (weight 0.47, weak backing). The account describes a working but confusing unlock ordering, which is precisely the kind of behavior H2 is designed to detect and document on yubiOS: the fallback must exist, but the evidence should show which prompt is which.

The pass criteria for H2:

- Boot with the device physically unplugged.
- The initrd presents a passphrase prompt (or recovery-key prompt), not an error loop.
- No unlock occurs without either the key or a legitimate fallback credential.
- The initrd prompt log is captured as evidence.

## H3: key present, touch not given

With `--fido2-with-user-presence=yes` set at enrollment, unlocking requires a physical tap of the token. H3 enrolls with presence required, boots with the key plugged in, and deliberately does not touch it within the timeout.

The authoritative contract for this flag: `--fido2-with-user-presence` controls whether to require the user to verify presence, i.e. tap the token (the FIDO2 "up" feature), when unlocking the volume; it was added in systemd 249 [3] (weight 0.87). Since yubiOS sets the flag at enrollment in H1, the boot-time unlock in H3 must honor it: no touch, no volume key.

What H3 must capture:

- The timeout or error text shown at the initrd prompt when the touch never arrives.
- The fact that the system remains retryable: a subsequent attempt with a real touch succeeds without a reboot or rescue disk.

This retry property is the difference between a designed failure and a hang. A real hardware token can be present but unresponsive (wrong port, dead port, firmware wedge); the unlock path must degrade to a retryable prompt, and the only way to prove that is to withhold the touch on physical metal and watch what happens.

## Relationship to the token-absent case

H2 and H3 test different halves of the same two-factor contract. In H2 the "something you have" is missing entirely; in H3 it is present but the human action on it is missing. A system that passes H1 but fails either H2 or H3 has a happy path only, which is unacceptable for a root-volume unlock gate.

A community thread on boot-time FIDO2 unlock shows the diagnostic reality of this class of failure: a user tapping the key at a passphrase prompt that never registered the FIDO2 device, with the unlock sitting there doing nothing [4] (weight 0.04, weak backing). The report is not authoritative on systemd behavior, but it illustrates why the evidence capture in H3 must include the exact prompt text: distinguishing "prompt is passphrase, FIDO2 not wired into initrd" from "prompt is FIDO2, touch not detected" is only possible from the captured log.

## Evidence set

For both scenarios the run must capture:

- Full initrd console log from power-on to prompt.
- The exact prompt or error text shown in each adverse case.
- For H3, the successful retry transcript after the touch is finally given.
- `cryptsetup luksDump` after the runs, confirming the enrollment was unchanged by the failures (failure paths must not mutate keyslots).

## Sources

- [1] https://github.com/systemd/systemd/issues/32586 (jev weight 0.83)
- [2] https://unix.stackexchange.com/questions/717227/systemd-cryptenroll-with-fido2 (jev weight 0.47, weak backing)
- [3] https://www.man7.org/linux/man-pages/man1/systemd-cryptenroll.1.html (jev weight 0.87)
- [4] https://www.reddit.com/r/archlinux/comments/va6344/luks_boot_unlock_fido2_issue/ (jev weight 0.04, weak backing)
