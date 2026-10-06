# PAM touch enforcement on real hardware

Scope: scenario H6, proving that PAM-gated paths (systemd-homed login and the non-homed sudo/sshd path via pam_u2f) require a physical touch, not just token enumeration.

## The distinction H6 draws

"Key detected" and "key authorized" are different events. A plugged-in token enumerates instantly over USB; the authorization event is the human touch. H6 fails if any PAM path in yubiOS treats enumeration as sufficient. The scenario splits into the homed path (`pam_systemd_home.so`) and the non-homed path (`pam_u2f.so` for sudo and sshd), and runs each with the key present-but-untouched versus touched.

## The non-homed path: pam_u2f

pam-u2f is Yubico's module implementing PAM over U2F and FIDO2, providing a way to integrate a YubiKey or other compliant authenticator into existing infrastructure [1] (weight 0.92). It is the standard building block for the sudo/sshd side of H6.

Setup shape, for context: user registration is done with the `pamu2fcfg` command, which produces the mapping entries consumed by the module [2] (weight 0.53). Production-style setups for exactly the sudo path exist as maintained scripts [3] (weight 0.50, weak-ish backing; treat as a worked example, not a normative source).

The upstream issue tracker shows the enforcement question is real rather than hypothetical: a request to allow pam_systemd_home to be forced to ask for a FIDO2 PIN exists because the default behavior did not require user verification on the FIDO2 credential [4] (weight 0.82). That is, absence of enforcement was the default posture being complained about, which is exactly the regression H6 is designed to catch if a yubiOS build quietly ships it.

A community report captures the failure mode H6 hunts: with a YubiKey enrolled as a FIDO2 device on systemd-homed, `homectl authenticate` correctly activated the key and asked for the PIN, yet login from the tty was still possible with the password alone [5] (weight 0.39, weak backing). The report is a single user's account, not a normative source, but it shows the shape of the bug: one PAM path enforced the token while another silently accepted the weaker factor.

## The homed path: pam_systemd_home

For homed users, authentication flows through pam_systemd_home, which consults the user's enrolled credentials. The module's own flag surface is documented in its manual page, including suspend-time behavior covered in the H12 scenario [6] (weight 0.88). For H6, the question is narrower: does the homed login path require the FIDO2 touch every time, or does it accept password-only after the credential is enrolled?

## The run

For each path (sudo via pam_u2f, login via pam_systemd_home, and sshd if wired):

1. Key plugged in, no touch: the attempt must fail or block until touch.
2. Key plugged in, touched: the attempt must succeed.
3. Capture the pam log lines for both outcomes.

The evidence is the pair of log lines per path. A path that succeeds in state 1 fails H6 regardless of state 2, because it has proven presence is not actually required.

## Why swu2f cannot substitute

A software U2F/FIDO2 token approves assertions in process, with no human in the loop. Its "touch" is a function return value. Any PAM configuration bug that skips the presence requirement would pass identically against swu2f, because the emulator grants presence unconditionally. Only a physical key, left untouched on the desk, distinguishes "module asked and user did not confirm" from "module never asked". That is the whole point of H6, and why it is in the real-hardware minimum set rather than the VM/software coverage tracked under B-VM-CTAP2.

## Pass criteria

- sudo/login/sshd with untouched key: fail or block, with the pam log showing the pending touch or denial.
- Same paths with touch: success, log shows the assertion accepted.
- No path proceeds on enumeration alone.

## Sources

- [1] https://developers.yubico.com/pam-u2f/ (jev weight 0.92)
- [2] https://cromwell-intl.com/cybersecurity/yubikey/pam_u2f.html (jev weight 0.53)
- [3] https://github.com/jcoffi/yubikey-sudo-setup (jev weight 0.50)
- [4] https://github.com/systemd/systemd/issues/17176 (jev weight 0.82)
- [5] https://unix.stackexchange.com/questions/674453/systemd-homed-with-fido2-login-from-tty-still-possible-with-pa (jev weight 0.39, weak backing)
- [6] https://www.freedesktop.org/software/systemd/man/255/pam_systemd_home.html (jev weight 0.88)
