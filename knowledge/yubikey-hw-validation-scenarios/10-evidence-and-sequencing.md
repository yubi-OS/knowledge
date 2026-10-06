# Evidence capture and sequencing for the real-hardware run

Scope: what artifacts the H1 to H12 run must capture per scenario, and the ordering discipline: software/VM coverage (B-VM-CTAP2) first, then the real-hardware run (B-REAL-FIDO2) as the production-confidence gate, with H8/H9 independent.

## The sequencing contract

Per the yubiOS blocker chain, software and VM coverage of the same trust boundaries comes first: B-VM-CTAP2 delivers deterministic, repeatable software coverage, and only then does the real-hardware run serve as the production-confidence gate [1] (source-doc sequencing decision; the underlying tool landscape below). The real-hardware run is not a replacement for the software coverage, it is the final gate on top of it.

The tool that defines the software side is libfido2: a library providing functionality and command-line tools to communicate with a FIDO device over USB or NFC, and to verify attestation and assertion signatures, supporting FIDO U2F (CTAP 1) and FIDO2 (CTAP 2) [2] (weight 0.88). The same library is developed openly [3] (weight 0.87). Software emulation of an authenticator exists and speaks CTAPHID, CTAP 2.1, and U2F while keeping credential private keys in a local state file [4] (weight 0.63). Note the limitation that motivates the sequencing: such an emulator does not create a HID device, so even the emulation path has gaps that only physical keys close.

## What each scenario must capture

The evidence model is per-scenario transcripts, not aggregate pass/fail:

- H1: boot log showing the FIDO2 slot used, plus `cryptsetup luksDump` slot list.
- H2: initrd prompt log proving the passphrase fallback with the key absent.
- H3: the timeout error text and the successful retry transcript on touch.
- H4: `homectl inspect` output showing FIDO2 enrollment, plus the login session log.
- H5: recovery-key generation transcript (before enrollment) and the unlock transcript with the key absent.
- H6: pam log lines for the present-but-untouched and touched outcomes, per PAM path.
- H7: successful SSH session log and the rejected-connection log with the key removed.
- H8: `sbverify` output and the firmware log showing the validated signature chain.
- H9: firmware Secure Boot violation log for the mis-signed and unsigned UKI attempts.
- H10: session log showing the username auto-resolved per inserted key.
- H11: `cryptsetup luksDump` slot list before and after revocation, plus unlock logs per key.
- H12: the PAM/session log showing the suspend event and the fresh re-auth on resume.

Two capture principles apply across all twelve. First, transcripts must be captured from the logs, not reconstructed from memory; the value of the run is the reproducible record. Second, negative paths are as important as positive ones: the failure transcripts (H2, H3, H9, and the reject legs of H7 and H11) are what distinguish enforced boundaries from happy paths.

## Measured-boot and evidence discipline

The boot-side scenarios touch the measured-boot evidence space. Academic work on validating measured boot systems describes the need for independent evidence of the measurements recorded during system boot, captured without interfering with the boot process itself [5] (weight 0.25, weak backing). Vendor tooling exists for validating boot-log evidence and the signatures over it [6] (weight 0.32, weak backing). Neither is a yubiOS dependency, but both frame the standard the evidence capture should approach: boot logs are evidence only if they are captured as-is and anchored to the run.

FIDO2's architectural property underwrites the whole scenario set: authentication keys stay on the user's device [7] (weight 0.84). That is the property the physical key contributes and the transcripts must demonstrate, per boundary.

## Sequencing summary

1. Close B-VM-CTAP2 (deterministic software coverage of the same boundaries).
2. Run H8 and H9 any time after the `sbsign`/`libykcs11` path lands; they do not depend on the CTAP2 work.
3. Run H1 through H7 and H10 through H12 on real hardware as the production-confidence gate.
4. File the captured transcripts per scenario as the evidence record; a scenario without its transcript is not run.

## Sources

- [2] https://developers.yubico.com/libfido2/index.html (jev weight 0.88)
- [3] https://github.com/Yubico/libfido2 (jev weight 0.87)
- [4] https://github.com/19h/fidolizer (jev weight 0.63)
- [5] https://arxiv.org/pdf/2609.05011 (jev weight 0.25, weak backing)
- [6] https://developers.hp.com/hp-client-management/doc/Invoke-HPEpscBootlogEvidenceValidation (jev weight 0.32, weak backing)
- [7] https://www.microsoft.com/en-us/security/business/security-101/what-is-fido2 (jev weight 0.84)
