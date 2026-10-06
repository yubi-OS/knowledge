# 08 Tradeoffs and the hardware-lane boundary

Scope: what the software lane can and cannot prove, and the 12 scenarios behind B-REAL-FIDO2 that have no test today.

Grounding spine: source doc yubi-OS/yubiOS `playbooks/fido2-vm-e2e-recipe.md` (2026-08-01), Tradeoffs section.

## What the software lane buys

The source doc's tradeoff statement is two-sided. The upside: the software lane is deterministic and cheap, and proves interface behavior only (source doc). Deterministic means the run does not depend on a human, a specific physical key, or USB timing; cheap means it runs in CI on every relevant change rather than as a scheduled manual ceremony. That combination is what makes the recipe a regression guard rather than a one-off verification: the chain of doc 03 can be re-proven automatically after any change to `passless`, `swu2f`, `pam-u2f`, `homectl`, ssh sk keys, or the PAM and enrollment units (source doc).

The price is stated in the same sentence: it proves interface behavior only. A green run certifies that the code path is intact, nothing more.

## What the software lane cannot prove

The source doc lists what the lane cannot prove (source doc):

- physical presence
- PIN retry and lockout behavior
- multi-key `hidraw` races
- recovery-token use
- revocation
- the PIV 9c signing ceremony's display and confirmation steps

These are the 12 scenarios behind `B-REAL-FIDO2` (tracked as OMN-42 and OMN-63), and the source doc states that none of them has a test today (source doc). The boundary is categorical: a software authenticator has no human to tap, no PIN retry counter to exhaust, no second key to race with on the HID bus, and no PIV application to run a signing ceremony against.

## Why the boundary is real, not hypothetical

The distinction maps onto the FIDO2 protocol itself. The CTAP specification separates user presence from user verification: user presence instructs the authenticator to require user consent to complete the operation, and if the user declines or takes too long, the procedure terminates with CTAP2_ERR_OPERATION_DENIED (strong backing, 0.72: https://fidoalliance.org/specs/fido-v2.0-rd-20170927/fido-client-to-authenticator-protocol-v2.0-rd-20170927.html). User verification, the PIN or biometric step, happens on the authenticator in CTAP2 flows (strong backing, 0.51: https://www.yubico.com/authentication-standards/fido2/). FIDO2 itself is the pairing of the WebAuthn browser API with the CTAP authenticator protocol (strong backing, 0.53: https://fidoalliance.org/passkeys/). A software authenticator can implement the protocol messages, which is what the VM lane exercises, but the touch, the PIN counter, and the physical race conditions live in hardware the VM does not have.

PIN behavior is a concrete example of what is at stake. Yubico's documentation on FIDO2 PINs covers reset procedures that effectively unregister the key from every account it was registered with using FIDO2 (strong backing, 0.61: https://support.yubico.com/s/article/Understanding-YubiKey-PINs). Semantics like that (what a locked-out PIN means for a disk-encrypted machine) are exactly the class of behavior the software lane cannot exercise.

## The reporting rule

Because the boundary is categorical, the playbook attaches a rule to it: never describe a green run of this lane as production confidence (source doc). In practice this means:

- Green software-lane runs are cited as regression evidence for the code path (doc 07).
- Claims about physical-presence, PIN, multi-key, recovery, revocation, or PIV ceremony behavior must trace to `B-REAL-FIDO2` work, not to this lane.
- Any test added for one of the 12 scenarios belongs to the hardware-in-the-loop script (`tests/vm/test-luks-fido2.sh`) and the `B-REAL-FIDO2` tracker items, not to the CI software lane.

This keeps the two lanes honest in both directions: the software lane stays fast and deterministic because it never waits for a human, and the hardware claims stay unproven until hardware evidence exists.
