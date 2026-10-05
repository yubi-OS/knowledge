# 03 - Physical YubiKey production-confidence testing

## Scope

Physical-YubiKey production-confidence runs: why software-only FIDO2 CI proves function but not physical presence, firmware ownership, or RPMB freshness.

## What software CI proves and what it cannot

FIDO2 is a challenge-response protocol between a relying party and an authenticator; YubiKey 5 series keys implement FIDO2/WebAuthn, FIDO U2F, PIV smart card, and other protocols in one hardware token (source: https://www.yubico.com/authentication-standards/fido2/, jev weight 0.83). The protocol layer can be exercised entirely in software: emulated authenticators, virtual FIDO devices, and browser-based test harnesses all speak the same CTAP2 wire protocol. A CI pipeline that validates LUKS2 unlock, pam-u2f, and ssh keys against an emulated authenticator proves the stack is wired correctly end to end (yubiOS demonstrated exactly this: the full LUKS2 / systemd-homed / pam-u2f / ed25519-sk chain went green with no skips in run 30139433902, yubiOS source: refs/testing-production-gaps-2026-08-01).

What the emulator cannot assert:

1. Physical presence. A hardware key requires a capacitive touch to complete a user-presence check; an emulator has no touch. Any enrollment or authentication policy that depends on a human gesture is untested.
2. Firmware ownership. A physical key's attestation certificate chain ties the device to the vendor's secure element manufacturing. A key whose firmware has been tampered with behaves like the real thing over the wire; only the attestation and physical inspection catch it.
3. Cross-device state. Resident keys, PIN retry counters, and lockout behavior live in hardware state machines with quirks that emulators reproduce imperfectly.

The architecture point is general: hardware security keys get their trust from a secure element and physical separation, and the defense depends on properties of the physical device, not the protocol conversation (source: https://andrew-blog.dev/demystifying-hardware-level-security-the-architecture-of-custom-fido2-keys/, jev weight 0.69). Microsoft's security guidance frames FIDO2 as phishing-resistant precisely because the credential is bound to hardware and to a user-presence gesture (source: https://www.microsoft.com/en-us/security/business/security-101/what-is-fido2, jev weight 0.87, URL trimmed in citation).

## Why the production claim needs a physical run

yubiOS holds the blocker B-REAL-FIDO2 on exactly this distinction: software proves function, not physical presence, firmware ownership, or RPMB freshness (yubiOS source: refs/testing-production-gaps-2026-08-01). The fix is a scripted physical run: execute a fixed set of 12 scenarios (the yubikey-hw-validation-scenarios doc) against a production image tag, with a human operating the key, and retain a signed record in the refs archive (yubiOS source: refs/testing-production-gaps-2026-08-01). The scenarios cover the surfaces that matter for an immutable OS:

- Enrollment of a FIDO2 credential for LUKS2 unlock with hmac-secret, including PIN handling.
- Re-enrollment and revocation: proving a removed credential stops unlocking.
- SSH resident key generation and use (the resident-key workflow with required authentication factors is documented for YubiKey in public guides: source https://gist.github.com/Kranzes/be4fffba5da3799ee93134dc68a4c67b, jev weight 0.51).
- PIV slot operations for image signing.
- Multi-key scenarios and hidraw contention when two keys are inserted.
- Wrong-key and wrong-PIN negative paths, confirming fail-closed behavior.

## Test harness design for hardware-in-the-loop

A hardware key cannot run inside a QEMU guest without passthrough, and USB passthrough of a FIDO2 device into a VM is fragile across host platforms. The practical harness keeps the CI VM as the relying party and the physical key attached to a dedicated test machine, driven by a scripted CLI step (libfido2 tools, systemd-cryptenroll, ssh-keygen). The result artifact per scenario should record: the scenario id, the image digest, the key model and firmware version, the command output, and a human sign-off. Interactive browser-based verification exists for manual checks (Yubico's demo site exercises WebAuthn registration and authentication with a real key: source https://demo.yubico.com/, jev weight 0.43, weak backing) but is not a CI substitute; third-party testing writeups agree that hardware key testing needs both protocol-level and application-level strategies (source: https://helpmetest.com/blog/fido2-authenticator-testing/, jev weight 0.23, weak backing).

The unlock-of-encrypted-volumes surface has canonical grounding: systemd supports unlocking LUKS2 volumes with FIDO2 tokens since systemd 248, which is the integration yubiOS's chain tests exercise (source: http://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html, jev weight 0.79).

## Cost, ordering, and what closes the blocker

The yubiOS audit prices the physical run at 1 to 2 weeks plus the human for the 12 scenarios, sequenced after the VM-level chain is green so the physical run tests only hardware-specific behavior (yubiOS source: refs/testing-production-gaps-2026-08-01). The failure mode to avoid is running the physical scenarios against a moving dev image: pin the image digest first, then execute, so the record says exactly which bytes were proven.

## Sources

- https://www.microsoft.com/en-us/security/business/security-101/what-is-fido2 (weight 0.87)
- https://www.yubico.com/authentication-standards/fido2/ (weight 0.83)
- http://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html (weight 0.79)
- https://andrew-blog.dev/demystifying-hardware-level-security-the-architecture-of-custom-fido2-keys/ (weight 0.69)
- https://gist.github.com/Kranzes/be4fffba5da3799ee93134dc68a4c67b (weight 0.51)
- https://demo.yubico.com/ (weight 0.43, weak backing)
- https://github.com/MFA-Phishing-MQP-WPI/Hardware-FIDO2-Implementation-Demo (weight 0.43, weak backing)
- https://helpmetest.com/blog/fido2-authenticator-testing/ (weight 0.23, weak backing)
- yubiOS refs/testing-production-gaps-2026-08-01 (internal source doc for all repo-internal claims)
