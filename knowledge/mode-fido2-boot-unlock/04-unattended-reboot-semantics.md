# 04. Unattended reboot semantics: what a FIDO2-only boot does with no human

Scope: unattended reboot semantics when only FIDO2 unlock exists: machine waits at the prompt, no network or TPM path, policy versus integration test.

## The core fact: FIDO2 unlock requires presence

An unattended unlock of a LUKS2 root volume requires an unlock mechanism that does not need a human. The comparison surveys that classify the options all put FIDO2 on the human side of that line: a decision-tree guide for encrypted root on a headless server walks through TPM2 sealing via systemd-cryptenroll, the Clevis plus Tang LAN keyserver pattern, the plain passphrase baseline, and the FIDO2 YubiKey option, treating them as distinct unattended-unlock strategies (source: https://www.bigiron.cc/guides/encrypted-root-with-tpm-clevis-tang-or-just-passphrase, jev weight 0.66). The reason FIDO2 sits apart is physical: the authenticator will not release its hmac-secret until a user presence signal occurs, and there is no one present during an unattended reboot.

## The network paths a FIDO2-only boot deliberately does not take

The established alternatives for headless machines are all network-mediated. One is an SSH daemon in the initramfs: guides document unlocking LUKS using Dropbear SSH keys remotely when there is no KVM console access (source: https://www.cyberciti.biz/security/how-to-unlock-luks-using-dropbear-ssh-keys-remotely-in-linux/, jev weight 0.61), and the pattern of LUKS on a headless server with dropbear in the initramfs so one can SSH in to unlock after a reboot is a long-standing writeup (source: https://vo.rs/story/luks-on-a-headless-server-with-remote-unlock/, jev weight 0.54). A community production guide covers the same SSH-in-initramfs approach for headless, colocated, and high-availability machines (source: https://github.com/Juka-Bala/remote-luks-unlock-guide, jev weight 0.24, weak backing). These are exactly the remote-unlock paths a FIDO2-only boot does not implement, which is what makes the unattended behavior a policy rather than an accident: the network unlock surface is absent because it was never added.

## So the machine waits

With FIDO2 as the only enrolled root-unlock method, an unattended reboot stops at the unlock prompt and waits. The boot makes no progress until the key is inserted and touched. This is the behavior the design accepts: a machine that cannot be unlocked remotely cannot be unlocked by an attacker remotely either. The alternative designs that would remove the wait, TPM2 sealing and network key servers, each reopen a remote surface, which is why the comparison guides treat them as separate rows of the decision tree rather than defaults (source: https://www.bigiron.cc/guides/encrypted-root-with-tpm-clevis-tang-or-just-passphrase, jev weight 0.66).

## Reliability wrinkle: the touch can fail at boot

The waiting behavior assumes the interactive unlock works when a human does show up. One reported failure mode is worth carrying into operational planning: a user of an OnlyKey FIDO2 device reported that opening a LUKS2 device with a FIDO2 token failed roughly every other reboot, working right away about half the time after a reboot while cryptsetup open and close cycles kept working (source: https://github.com/Yubico/libfido2/issues/852, jev weight 0.59). Whatever the device-specific cause, the report establishes that the boot-time FIDO2 exchange is not 100 percent reliable across reboots for all authenticators, and a design that waits forever at the prompt needs the passphrase keyslot (doc 01) as its recovery.

## Policy versus integration test

The unattended-reboot answer, no unlock and the machine waits, is a stated policy. As of the source analysis it is not yet backed by an integration test that reboots an unlocked-capable machine unattended and asserts the wait. The honest status is therefore: the mechanism premise is documented (FIDO2 requires presence, TPM2 and network paths are the alternatives), and the behavioral assertion awaits a test. Treat the wait as design intent, not as a verified property.

## Mode summary

1. Interactive: the boot waits for a person, indefinitely, when only FIDO2 is enrolled.
2. Timeout: none; waiting is unbounded by design.
3. Alternatives not taken: TPM2 sealing, Clevis plus Tang, SSH in the initramfs (sources above).
4. Recovery: the passphrase keyslot remains the unattended-rescue path when a human is physically present.
