# 08: Non-negotiables and success criteria

Scope: the source doc's Non-Negotiables list and its What Success Looks Like outcomes. Internal-record subtopic: grounded in the source doc; no dig (the content is repo-internal doctrine).

## The six non-negotiables

The source doc (yubi-OS/yubiOS docs/MISSION.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/MISSION.md) states six non-negotiables. Each is quoted or closely paraphrased from the source doc, and each binds to a mechanism documented elsewhere in this corpus:

1. "Owner-held keys come first. A vendor or OEM key must not be the mandatory trust anchor for owner workflows." This is the doc 05 holding rule stated as a hard constraint, and it is the non-negotiable the ARM64 stance (doc 07) exists to make achievable.
2. "Physical presence matters. Disk unlock, login, and administrative identity should require the YubiKey, PIN, touch, or a documented recovery path." This operationalizes the security-default section (doc 04): the key is not an add-on factor, it is the required presence for identity-bound operations.
3. "Immutable means auditable. /usr is verified; mutable state is explicit." This pairs with the dm-verity layer (doc 03): the verified/unverified boundary is drawn at /usr, and anything mutable outside it is called out as mutable rather than smuggled.
4. "Test-only tools must never quietly ship in production artifacts." The word "quietly" is the operative one: test tooling in a production image is acceptable only if it is loud, explicit, and intentional; silent inclusion is a defect.
5. "Every security exception must be narrow, documented, and removable." This is the enforcement backstop for the cut rule in doc 06: a feature that needs a security exception survives only as a narrow, documented, removable exception, never as a standing carve-out.
6. "Historical evidence is not a current pin. PINNED.md is the live source of truth for digests." This closes the one procedural shortcut the digest-pinning layer (doc 02) would otherwise allow: a digest that was verified in the past carries no forward authority.

## The four success outcomes

The source doc's What Success Looks Like section states four testable outcomes (source doc):

- A user can install yubiOS, enroll their YubiKey and recovery material, and update the OS without re-enrolling disk-unlock secrets. This is the owner-experience version of non-negotiables 1 and 2: the security default must survive routine updates without forcing the owner back through enrollment.
- A maintainer can point to the exact base image, tool pins, workflow evidence, and upstream references behind a release. This is the supply-chain layer (doc 02) stated as an evidentiary standard: provenance is not claimed, it is producible.
- ARM64 Path A hardware can prove the owner-controlled secure-world chain on real boards, not just in diagrams. This is the platform stance (doc 07) given a verification condition: the chain must be demonstrable on hardware.
- x86-64 remains useful and supported without pretending it delivers the same owner-owned hardware root. This prevents the second-class platform from being quietly re-marketed as equal; the doc requires honesty about the gap (source doc).

## Why the two lists share a page

Read together, the non-negotiables are constraints on design and the success outcomes are constraints on demonstration. The non-negotiables say what may never be traded; the outcomes say what must be shown to work. Neither list is aspirational in tone: each item is phrased as a condition that either holds or does not (source doc), which is consistent with the doc's structural-not-procedural thesis: a mission that cannot be checked is procedure, not structure.

## Sources note

This is an internal-record subtopic: no dig was run (docs-mint variant speed optimization 4), because the six non-negotiables and four success outcomes are repo-internal doctrine that the source doc itself states in full. Every claim above cites the source doc directly. Cross-references to other corpus docs are internal to this corpus and carry no external source burden.
