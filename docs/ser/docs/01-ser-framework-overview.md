# 01 - The SER framework and yubiOS positioning

**Scope:** What the SER framework is as the yubiOS ground doc invokes it, what the doc records about the alignment, and how the project positions itself as a full-stack SER-style implementation.

**Ground spine:** `yubi-OS/yubiOS docs/SER.md` (https://github.com/yubi-OS/yubiOS/blob/main/docs/SER.md, jev weight 0.61)

## The alignment record

The ground doc is an alignment record, not a spec: it states that yubiOS follows the SER framework by making ownership explicit, keeping operational artifacts time-bounded, and preserving enough immutable evidence to reproduce and audit outcomes later (source doc). It names the framework reference explicitly: "SER Framework by Shant Tchatalbachian (0mniteck)" at https://omniteck.com/?p=1104 (source doc). The doc is short (about 4800 bytes), and its own sections dictate this corpus outline: three principle sections, a mapping table, a conclusion, four coverage sections, and two drift-check notes.

The framework page itself surfaced in the dig at weight 0.15 (weak backing). Its snippet confirms the principle definitions: sovereignty means giving data owners full control over access, usage, and lifecycle, and ephemerality means data and computation artifacts are automatically managed on a time bound (https://omniteck.com/?p=1104, weight 0.15, weak). A mirror of the same page exists at https://շանթ.com/?p=1104 with weight 0.12 (weak). Because the primary framework page scored below 0.5, every framework-level claim in this doc that comes from it is labeled weak and rests on the source doc's own restatement for authority.

## What yubiOS claims to be

Per the source doc, the project's core design is a FIDO2-first immutable OS where the owner's YubiKey is the user-facing identity, unlock, and authorization boundary, and where the build and install flow is centered on pinned images, signed artifacts, and reproducible CI evidence (source doc, https://github.com/yubi-OS/yubiOS/blob/main/docs/SER.md). The doc's conclusion states that yubiOS implements SER "not as an abstract policy layer, but as a full-stack operating system design" (source doc). That framing matters for reading the rest of the doc: the four coverage sections (attestation, trust chain, least privilege, continuous monitoring) are presented as anchors the doc provides for the wider yubiOS attestation and telemetry layer, not as detailed designs.

## The mapping table

The source doc records 5 principle-to-implementation mappings (source doc):

| SER principle | yubiOS implementation |
|---|---|
| Owner-centric control | YubiKey as the authorization boundary for signing, unlock, SSH, PAM, and 2FA |
| Time-bounded retention | Experimental artifacts, disposable validation flows, dated refs, and clear separation of current vs historical notes |
| Immutable provenance | Pinned digests, CI evidence, ADRs, and research notes tied to concrete build/install outcomes |
| Deterministic execution | Bootc-based delivery, pinned build inputs, reproducibility checks, and controlled install paths |
| Auditable revocation | Recovery paths, blocker tracking, and documented enrollment/re-enrollment flows |

## The open-framework claim

A brief section titled "for ALL" states the framework is intended as an open framework / open service model (source doc). Two dig results contextualize that pattern. The DoD Modular Open Systems Approach page describes an ecosystem that depends on active involvement by multiple stakeholders (https://www.cto.mil/sea/mosa/, weight 0.80), and the Model Openness Framework paper introduces a 3-tiered ranked classification for how openly a system's components are released (https://arxiv.org/abs/2403.13784, weight 0.54). Reproducibility as a norm has independent scientific grounding: a Science paper on estimating the reproducibility of psychological science is one of the most-cited statements of that norm (https://www.science.org/doi/10.1126/science.aac4716, weight 0.81).

## Ecosystem cross-link

The framework author's firmware work cross-references the framework: the omniteck U-Boot RockChip page lists build variants tagged for Secure Boot and vTPM alongside a "SER FRAMEWORK" link (https://u-boot.omniteck.com/, weight 0.26, weak). This is weakly backed and is recorded here only as evidence that the framework and its author's OS-level engineering appear together in public artifacts.

## Internal-record sections, no dig

Two sections of the source doc are internal records and were not dug: the "2026-09-18 drift check (wayfinder round 10, cycle 18)" entry records that SER.md was mojibake-repaired in round-10 cycle-4 and re-verified PASS by the frozen check, and the round-11 cycle-26 entry records the file as unchanged since, for inventory completeness (source doc, internal-record subtopic, no dig).
