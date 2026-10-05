# 07. Exit semantics and idempotency: same key, same volume key, no partial state

Scope: exit semantics and idempotency: same key to same token slot yields the same volume key, single-method failure is a log line, non-zero exit only when every enrolled method fails.

## The token model makes unlock deterministic

LUKS2 treats an unlock method as a token bound to a keyslot, and the cryptsetup token action manages LUKS2 tokens, including keyring tokens that enable auto-activation of a device (source: https://www.man7.org/linux/man-pages/man8/cryptsetup-token.8.html, jev weight 0.93; mirrored in the Arch manual pages, source: https://man.archlinux.org/man/cryptsetup-token.8.en, jev weight 0.88). The important structural fact for idempotency is what a token unlock does: it unlocks the existing volume key rather than minting a new one. The cryptsetup documentation for key management states the token path is for unlocking the existing volume key, with a separate parameter for creating a new keyslot from a token-derived passphrase (source: https://man.archlinux.org/man/cryptsetup-luksAddKey.8.en, jev weight 0.88).

That is the precise sense in which unlock is idempotent: presenting the same enrolled key to the same token slot resolves the same volume key that is already bound to the keyslot. A failed touch followed by a successful one leaves no partial state, because the exchange either produces the volume key or produces nothing. Opening and closing LUKS2 devices and enrolling tokens work the same way across those operations, with the LUKS2 metadata ensuring the right setup at open and close time (source: https://www.man7.org/linux/man-pages/man8/cryptsetup.8.html, jev weight 0.73).

## What multiple methods mean for control flow

A LUKS2 volume can carry several enrolled credential kinds at once: systemd-cryptenroll supports PKCS#11, FIDO2, TPM2 tokens and devices, plus password and recovery key enrollment (source: https://www.man7.org/linux/man-pages/man1/systemd-cryptenroll.1.html, jev weight 0.87; the manpage text names the tool as enrolling hardware security tokens which may then be used to unlock the volume during boot, source: https://www.freedesktop.org/software/systemd/man/latest/systemd-cryptenroll.html, jev weight 0.89). The unlock layer walks the enrolled methods; the documented behavior for FIDO2 specifically is sequential and device-blind: support for enrolling multiple FIDO2 tokens is documented as not too useful, because while unlocking, systemd-cryptsetup cannot identify which token is currently plugged in and thus does not know which authentication request to send to the device (source: https://manpages.ubuntu.com/manpages/jammy/man1/systemd-cryptenroll.1.html, jev weight 0.93).

That statement is the sharpest available documentation of the exit semantics shape: the unlock layer tries its enrolled methods in order, a method that cannot match the plugged-in device is not silently retried against another token, and the caller's failure is what surfaces when the methods run out. A single method failing is therefore an intermediate event in a sequence, not a terminal exit of the unlock process; the terminal condition is reached when every enrolled method has been tried without success.

## What a non-zero exit means

Given the sequence above, a non-zero exit from the boot unlock means the entire enrolled-method list was exhausted: no token produced the volume key and no passphrase keyslot was satisfied. Any earlier single-method failure is a log line on the way to the next method. This is the property that lets the design put a passphrase keyslot behind the FIDO2 token (doc 01): the passphrase prompt is not an error state, it is the next entry in the method list.

## Idempotency boundary and retries in the CI legs

For the CI legs, idempotency is what makes the tests re-runnable. The software leg (doc 05) answers instantly and deterministically, so a retried test exercises the same enrollment metadata and the same token resolution. The hardware leg (doc 06) shares the property on the successful path: the same key and the same token slot always yield the same volume key. What the hardware leg adds is the possibility of a device-level transient, as reported for specific authenticators where the FIDO2 open failed roughly every other reboot (source: https://github.com/Yubico/libfido2/issues/852, jev weight 0.59). Transient device behavior changes the retry picture, not the idempotency one: a retried successful exchange still resolves the same volume key, and there is still no partial state between attempts.

## Mode summary

1. Idempotency: token unlock resolves the existing volume key; repeated success is stateless (source: https://man.archlinux.org/man/cryptsetup-luksAddKey.8.en, jev weight 0.88).
2. Exit: non-zero only when every enrolled method fails; single-method failure is an intermediate log event.
3. Multiple tokens: multiple FIDO2 tokens enrolled at once are documented as not useful because the unlocker cannot identify which token is plugged in (source: https://manpages.ubuntu.com/manpages/jammy/man1/systemd-cryptenroll.1.html, jev weight 0.93).
4. CI implication: tests are re-runnable on both legs; only the hardware leg can produce device-level transients.
