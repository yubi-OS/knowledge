# Multi-key enrollment and revocation on real hardware

Scope: scenario H11, proving that a second enrolled YubiKey unlocks the same resource as the first, and that revoking one key's slot leaves the other functional.

## Why multi-key is in the minimum set

A single-key deployment has a hidden single point of failure: losing the key loses the resource unless recovery paths exist (H5 covers the recovery-key side for homed). H11 exercises the intentional redundancy path instead: two physical keys enrolled against one resource, used independently, then one revoked. This is the operational posture a real deployment needs, and it is only provable with two physical keys, since a software emulator cannot lose a slot.

## Enrollment paths per boundary

The LUKS2 side: cryptsetup manages keyslots directly. `cryptsetup luksAddKey` adds a keyslot protected by a new key, requiring an existing passphrase or key to authorize the addition [1] (weight 0.70). `cryptsetup luksKillSlot` wipes a keyslot from the LUKS device, with batch-mode behavior documented in its manual page [2] (weight 0.74; the Arch mirror of the same page agrees [3], weight 0.68). The overall cryptsetup utility surface, including LUKS device management actions, is covered by the main manual page [4] (weight 0.71).

The PAM side: `pamu2fcfg` registers a user by producing the key-mapping entries the pam_u2f module consumes [5] (weight 0.53). Multiple keys are supported by appending additional generated entries to the user's key file [6] (weight 0.27, weak backing; the mechanism is standard pam_u2f usage but this particular source is a blog). Backup-device association steps are described in community walkthroughs: after the first device is registered and confirmed by touch, additional devices are registered the same way [7] (weight 0.25, weak backing).

The yubiOS H11 wording uses `homectl authenticate` run twice, or `pamu2fcfg -n`, per the scenario design. The underlying tool behaviors above back both variants.

## The run

1. Enroll key A against the resource (LUKS2 slot or PAM mapping).
2. Enroll key B against the same resource.
3. Unlock the resource with key A alone; capture the transcript.
4. Unlock with key B alone; capture the transcript.
5. Wipe key A's slot (`cryptsetup luksKillSlot` on the LUKS2 side, or removal of key A's entry on the PAM side).
6. Confirm key B still unlocks. Confirm key A no longer does.

Evidence: `cryptsetup luksDump` slot list before and after the revocation, and unlock logs per key for each leg.

## What the scenario actually proves

The independent-unlock legs (3 and 4) prove enrollment is per-key, not per-resource-shared-secret leaked to both tokens. The post-revocation legs prove revocation is real: after wiping one slot, the physical key that used to map to it is inert for that resource, while the surviving enrollment is untouched. Slot-state before and after is what distinguishes a genuine slot wipe from a cosmetic change.

Slot-reset context for the failure side: guides covering YubiKey LUKS challenge-response setups document the reset-then-re-enroll pattern, wiping a slot and adding a new key with `luksAddKey` [8] (weight 0.47, weak backing). This is the manual drill H11 automates into a single scenario.

## Pass criteria

- Both keys unlock the same resource independently before any revocation.
- After revoking key A's slot, key B still unlocks and key A is rejected.
- Slot list before and after captured, showing exactly one slot removed and the other preserved.

## Sources

- [1] https://www.man7.org/linux/man-pages/man8/cryptsetup-luksAddKey.8.html (jev weight 0.70)
- [2] https://www.man7.org/linux/man-pages/man8/cryptsetup-luksKillSlot.8.html (jev weight 0.74)
- [3] https://man.archlinux.org/man/core/cryptsetup/cryptsetup-luksKillSlot.8.en (jev weight 0.68)
- [4] https://www.man7.org/linux/man-pages/man8/cryptsetup.8.html (jev weight 0.71)
- [5] https://cromwell-intl.com/cybersecurity/yubikey/pam_u2f.html (jev weight 0.53)
- [6] https://oneuptime.com/blog/post/2026-03-02-how-to-configure-pam-for-hardware-token-authentication-on-ubuntu/vi (jev weight 0.27, weak backing)
- [7] https://www.prado.lt/how-to-configure-local-two-factor-authentication-with-u2f-on-ubuntu-19-10 (jev weight 0.25, weak backing)
- [8] https://gist.github.com/cmedianu/cfff046b64be7b7caf4b8da5630856c3 (jev weight 0.47, weak backing)
