# 03. pam-u2f login gate: touch, cue, and denial as PAM control flow

Scope: pam-u2f login gate mode: interactive touch, module timeout and cue, second enrolled key, then denial.

## Where pam-u2f sits in the stack

pam-u2f is Yubico's PAM module for U2F and FIDO2 authentication. Yubico's own guidance is to configure it as a required module after the primary authentication module or modules when it is used as a second factor, and to make sure the primary authentication method is not sufficient or does not use control values that may preempt execution of pam-u2f (source: https://developers.yubico.com/pam-u2f/, jev weight 0.77; same statement in the repository README, source: https://github.com/Yubico/pam-u2f, jev weight 0.86). That placement is the mode contract: pam-u2f runs only if the earlier module did not short-circuit, and its own return value gates the session.

## The interactive mode and the cue

The module is interactive: it waits for the tactile authentication on the key. The cue option prints a prompt, and the manual page describes why the cue interacts with detection: pam_u2f can avoid emitting the cue prompt, which would otherwise cause confusing UI issues if the cue is emitted and the underlying library immediately fails the tactile authentication (source: https://man.archlinux.org/man/pam_u2f.8.en, jev weight 0.76). So the user-visible sequence is cue, then touch, then success or failure, and a misconfigured module can print the cue at a moment when the touch cannot possibly succeed.

## nodetect and what it leaks

The nodetect option changes the mode in a security-relevant way. With nodetect, pam_u2f skips checking that a key configured for the user is inserted before proceeding; the manual page says this option should be used with caution (source: https://www.mankier.com/8/pam_u2f, jev weight 0.58). The Yubico manual page gives the reason in terms an operator can act on: if pam_u2f is configured to cue and nodetect, an attacker can determine that pam_u2f is part of the authentication stack by inserting any random U2F token and observing the cue (source: https://developers.yubico.com/pam-u2f/Manuals/pam_u2f.8.html, jev weight 0.65). The same page notes the detection path also avoids an unintended 1-second delay prior to the tactile authentication caused by versions of libu2f-host up to and including 1.1.5 (source: https://developers.yubico.com/pam-u2f/Manuals/pam_u2f.8.html, jev weight 0.65).

## Multiple keys, one touch each

The fallback mode for a lost or broken key is enrollment of several keys. The documented behavior is blunt: multiple U2F key entries in an authfile require a touch for each key, as reported against the module (source: https://github.com/Yubico/pam-u2f/issues/247, jev weight 0.61). In other words the module walks the enrolled keys sequentially and each attempt is itself interactive. There is no silent parallel probe of all enrolled keys. For a user with 3 enrolled keys, the worst case is 3 touches before denial.

## Denial semantics

When the touch fails or the key is absent, the module returns a PAM failure, and because it is configured as required rather than sufficient, the login is denied. The module does not fall back to anything by itself: the fallback structure comes from the PAM stack configuration, which is why Yubico's setup guidance stresses the control values of the surrounding modules (source: https://developers.yubico.com/pam-u2f/, jev weight 0.77).

## How this boundary differs from the boot boundaries

Compared with the initrd root unlock (doc 01) and the homed home unlock (doc 02), the pam-u2f gate is the cheapest interactive step: it protects a login session, not a volume. It is also the most configurable, because its mode knobs (cue, nodetect, authfile paths, multiple keys) are all module arguments rather than disk state. The unattended-reboot question does not arise here at all: a login gate is only exercised when a login is attempted.

## Mode summary

1. Interactive: yes, one touch per enrolled key attempt.
2. Timeout: bounded by the underlying library's authenticator timeout; the module itself documents no timeout argument.
3. Fallback: sequential attempts over enrolled keys, one touch each; no internal fallback to password.
4. Denial: a required-module failure denies the login; control values of neighboring modules govern whether the failure propagates.
