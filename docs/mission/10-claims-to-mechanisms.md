# 10: The claim-to-mechanism map

Scope: the synthesis doc: how each claim in the source doc lands on a concrete yubiOS mechanism, and the design philosophy the doc records. Internal-record subtopic: the mechanisms are repo-internal files cited by the source doc itself; no dig.

## The map

The source doc (yubi-OS/yubiOS docs/MISSION.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/MISSION.md) makes four verification-layer claims, each with a named mechanism:

| Claim (source doc) | Mechanism | Corpus doc |
| --- | --- | --- |
| Every base image and CI action is digest-pinned; mutable tags rejected by build policy | PINNED.md and yubiOS.rego | 02 |
| Every build passes an OPA/Rego supply-chain gate before a layer executes; ships with SLSA provenance and SBOM | build gate and attestation pipeline | 02 |
| Every byte of /usr validated on read; UKI signed by a key on owner hardware | dm-verity and signed UKI | 03 |
| Every architectural decision recorded with rationale and sources; every attack surface mapped to a control | ADR.md and MITIGATE.md | 06 |

Note: doc 01's validation round dropped the standalone digest-pinning subtopic (t03, score 0.44), so pinning is covered inside doc 02 rather than as its own doc; the mechanism row above is retained here so the map stays complete (outline.json, this corpus).

## How each section of the doc maps to a mechanism

- Mission statement and paradox (doc 01): the mechanism is the four-layer verification block quoted above; the paradox is the premise, the layers are the answer (source doc).
- Security as the default (doc 04): the mechanism is the owner-provisioned YubiKey as root of trust, with the decision rule that rejects scale-, budget-, or enterprise-dependent trust (source doc).
- Concentrated power (doc 05): the mechanisms are the key ceremonies themselves (signing key, ROTPK, RPMB write key) plus the human gate and recovery paths around irreversible operations (source doc).
- Don't be evil (doc 06): the mechanisms are MITIGATE.md's published gap table and the absence of telemetry and unauditable anchors as design constraints (source doc).
- Strategic stance (doc 07): the mechanism is the ARM64 chain itself: board root, TF-A, OP-TEE, fTPM, U-Boot UEFI, systemd-boot, signed UKI, verified /usr (source doc).
- Non-negotiables and success (doc 08): the mechanisms are PINNED.md as live source of truth and the four demonstration conditions (source doc).
- Planning discipline (doc 09): the mechanism is the dated refs/ note, exemplified by refs/planning-cycle-2026-07-11.md and the 2026-09-18 drift check (source doc).

## The design philosophy the doc records

Three principles recur across every section (all from the source doc):

1. Verification over trust. No layer asks for trust in an author; each asks for verification before execution. The doc's definition of AI resilience is operational, not aspirational: a poisoned contribution either fails verification or never had authority (source doc).
2. Owner primacy. Power over the machine belongs to its owner: keys, recovery paths, auditability, and the platform choice all serve that single holding rule (source doc).
3. Honesty as structure. Gaps are published, exceptions must be removable, second-class platforms are labeled second-class, and the doc's own maintenance is dated and additive (source doc).

The philosophy is uniform: every guarantee is phrased so that its failure is observable. A pin can go stale and be caught; an exception can be audited and removed; a success criterion can be tested on real hardware. That is what distinguishes the doc's structural stance from a values statement: each principle terminates in something a maintainer can check (source doc).

## Sources note

This is an internal-record subtopic: no dig was run (docs-mint variant speed optimization 4). Every mechanism named in the map is a repo file or build stage that the source doc itself cites (PINNED.md, yubiOS.rego, dm-verity, the signed UKI, ADR.md, MITIGATE.md, the ARM64 chain, refs/planning-cycle-2026-07-11.md), so the map's authority is the source doc's own references, not external research. Where this corpus adds external corroboration for a mechanism, it happens in the per-mechanism docs (02, 03, 07) with their own weights and labels.
