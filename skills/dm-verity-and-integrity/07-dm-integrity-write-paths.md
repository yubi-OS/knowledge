# 07 - dm-integrity: journaled integrity-on-write

**Scope:** what dm-integrity is, how its journal guarantees write atomicity, how it differs from dm-verity, and why yubiOS confines it to rare write paths.

**Ground source:** yubi-OS/yubiOS `skills/dm-verity-and-integrity/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/dm-verity-and-integrity/SKILL.md). Claims marked "source doc" come from this file.

## Where dm-integrity fits

Per the source doc, dm-integrity provides journaled integrity-on-write, and yubiOS covers it for the rare paths where write-time integrity matters. The rarity is explicit: dm-verity is the default for /usr, and everything else in the yubiOS integrity stack (fs-verity, IMA audit) protects mutable paths at file granularity. dm-integrity is the block-level answer for a device that must stay writable and still be authenticated.

## The mechanism: tags plus journal

The kernel documentation defines the target (weight 0.96, https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/dm-integrity.html): the dm-integrity target emulates a block device that has additional per-sector tags, which can be used for storing integrity information. The hard problem is stated in the same paragraph: a general problem with storing integrity tags with every sector is that writing the sector and the integrity tag must be atomic, meaning that in case of a crash, either both the sector and its integrity tag are written, or neither is.

The journal is the solution (weight 0.95, https://www.kernel.org/doc/html/v5.5/admin-guide/device-mapper/dm-integrity.html; the same text appears in the plain documentation file at weight 0.91, https://www.kernel.org/doc/Documentation/device-mapper/dm-integrity.txt, and the rendered admin-guide copy at weight 0.76, https://mjmwired.net/kernel/Documentation/admin-guide/device-mapper/dm-integrity.rst): to guarantee write atomicity, the dm-integrity target uses a journal. It writes sector data and integrity tags into a journal, commits the journal, and then copies the data and integrity tags to their respective locations. A crash mid-copy leaves the journal authoritative, so the sector and its tag can never diverge.

The same documentation notes composability with encryption (weight 0.95, https://www.kernel.org/doc/html/v5.5/admin-guide/device-mapper/dm-integrity.html): the dm-integrity target can be used with the dm-crypt target. That combination is the basis of authenticated encryption setups where a LUKS2-style volume also carries integrity tags.

## dm-verity versus dm-integrity

Lennart Poettering's "Authenticated Boot and Disk Encryption on Linux" article draws the canonical division (weight 0.60, http://0pointer.net/blog/authenticated-boot-and-disk-encryption-on-linux.html): dm-verity for immutable volumes, and dm-integrity which can authenticate writable volumes, among other things, alongside UEFI SecureBoot for authenticating boot loaders. yubiOS follows exactly that split, per the source doc: /usr is immutable and dm-verity-verified; the writable surfaces that need authentication use dm-integrity, and everything else relies on fs-verity or IMA audit.

The LWN article documenting the dm-integrity documentation covers the same target from the historical angle (weight 0.38, weak, https://lwn.net/Articles/721738/), and the device-mapper overview page situates dm-integrity among the device-mapper targets (weight 0.35, weak, https://en.wikipedia.org/wiki/Device_mapper). Both are weak backing, cited for orientation.

## Why yubiOS keeps it rare

The source doc's layer-selection guidance routes write-time integrity to a small set of paths. The reasons follow from the mechanisms above:

- dm-verity is a read-time, read-only verification model; it cannot authenticate a device that changes under it (source doc: dm-verity is the default for /usr, mutable paths use other mechanisms).
- dm-integrity pays a real cost at every write: a journal round-trip per sector-plus-tag commit (weight 0.96, kernel docs).
- Most yubiOS mutable paths do not need block-level authentication; IMA audit mode records what changed on /etc, /var, /home, and fs-verity covers the config files whose contents must be provably unchanged (source doc).

So the default posture is: immutable blocks verified by dm-verity, mutable files measured by IMA and selectively pinned by fs-verity, and dm-integrity reserved for the rare writable volume that must be authenticated as a block device.

## Practical notes

- Atomicity is the design center: a sector and its tag are committed together through the journal, so a crash never leaves a data/tag mismatch (weight 0.96, https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/dm-integrity.html).
- If a dm-integrity volume is also encrypted, the two targets stack, with dm-integrity underneath dm-crypt (weight 0.95, https://www.kernel.org/doc/html/v5.5/admin-guide/device-mapper/dm-integrity.html).
- The LUKS2 full-disk-encryption questions themselves are out of this skill's scope; the source doc routes them to the LUKS2 skill (forthcoming `luk2-system-disk`).
