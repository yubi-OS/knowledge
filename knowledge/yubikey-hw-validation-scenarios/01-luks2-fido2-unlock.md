# LUKS2 FIDO2 disk unlock on real hardware

Scope: scenario H1, the happy-path proof that a fresh `bootc install to-disk` with `systemd-cryptenroll --fido2-device=auto` boots and unlocks with the enrolled physical YubiKey present.

## What this scenario proves

Software emulators and CI stand-ins (swu2f, SoftHSM) can exercise the unlock code paths, but they cannot prove that a physical token enrolls cleanly onto a real LUKS2 volume, that the initrd actually reaches the token over USB HID, and that a human touch at the initrd prompt releases the volume key. H1 is the production-confidence baseline for the LUKS2 boundary: if the happy path does not work on metal, none of the failure scenarios (H2, H3) are meaningful.

## How enrollment works

systemd-cryptenroll is the tool for enrolling hardware security tokens and devices into a LUKS2 encrypted volume, which may then be used to unlock the volume during boot. It supports FIDO2 tokens among other credential types [1] (weight 0.97). Systemd 248 introduced this class of unlocking; the enrollment call registers the token as an additional way to unlock the volume, alongside any passphrases already enrolled [2] (weight 0.92). Token metadata is stored in the LUKS2 JSON header area, and boot unlock is wired through crypttab [3] (weight 0.67).

The yubiOS enrollment line for H1 is:

```
systemd-cryptenroll --fido2-device=auto --fido2-with-client-pin=yes --fido2-with-user-presence=yes <partition>
```

`--fido2-device=auto` selects the first available FIDO2 HID device, so the enrollment run itself is a check that the raw device is enumerable from the installer environment, not just from a running desktop session. Requiring both client PIN and user presence at enrollment matches the yubiOS posture that the key must prove presence at every trust-boundary crossing.

Practical guides for the same flow consistently warn about initrd tooling: the unlock logic has to live inside the initramfs, and distros differ in whether the FIDO2 modules are included by default [4] (weight 0.88, ArchWiki). On a bootc image this is a build-time property of the image, which is exactly why the real-hardware run must follow a fresh install rather than an in-place retrofit.

## What the run must capture

The scenario derives from the single unlock check in `tests/vm/test-luks-fido2.sh` (bcvk `native-to-disk` plus a real device), extended to a full reboot cycle on hardware [5] (source-doc scenario design, no external citation needed for the design itself):

1. Enroll with the flags above against the partition produced by `bootc install to-disk`.
2. Reboot.
3. At the initrd password/FIDO2 prompt, present the key and touch it.
4. Capture the boot log and the LUKS2 slot state.

Two pieces of evidence distinguish a genuine FIDO2 unlock from a silent passphrase fallback:

- The boot log must show the FIDO2 slot being used, with the touch event visible, not a passphrase path.
- `cryptsetup luksDump` must list the enrolled FIDO2 token in the JSON metadata area with its assigned keyslot.

The slot dump matters because LUKS2 volumes can carry up to 32 keyslots [6] (weight 0.38, weak backing; the 8/32 slot figure for LUKS1/LUKS2 comes from a community gist, not a primary source). The authoritative statement is narrower: systemd-cryptenroll enrolls tokens into the volume and records them for boot-time use [1].

## Why the physical key is not optional here

The initrd unlock path is the one place where the key is consumed before any userland service exists. Touch/presence semantics at that stage are handled by the firmware and the kernel HID stack, neither of which a software authenticator exercises identically. An enrollment that succeeds under emulation says nothing about USB enumeration order in the initrd, HID timeouts, or whether the touch prompt is actually surfaced to a user standing at the console. H1 exists to close that gap once, with a captured boot log, so every later LUKS2 scenario has a known-good baseline to diff against.

## Pass criteria

- Enrollment completes against the real volume with presence and PIN flags set.
- After reboot, the volume unlocks at the initrd prompt with the physical key, with the touch visible in the log.
- `cryptsetup luksDump` shows the FIDO2 token entry and its keyslot.
- No passphrase entry is needed for the H1 path.

Failure of any of these is a blocker for H2 and H3, which probe the same enrollment under adverse conditions.

## Sources

- [1] https://www.freedesktop.org/software/systemd/man/latest/systemd-cryptenroll.html (jev weight 0.97)
- [2] https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html (jev weight 0.92)
- [3] https://www.golinuxcloud.com/systemd-cryptenroll-luks2-tpm2-fido2-linux/ (jev weight 0.67)
- [4] https://wiki.archlinux.org/title/Systemd-cryptenroll (jev weight 0.88)
- [6] https://gist.github.com/Syderitic/23b9c22cb772e1b0e674ed4bb5a3abef (jev weight 0.38, weak backing)
