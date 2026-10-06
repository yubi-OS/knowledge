# Scope and normative framing

**Scope line:** what yubiOS SPEC.md commits to regulating: the in-scope surfaces, the out-of-scope boundaries, the RFC 2119 keyword contract the document binds itself to, and the versioning conventions that make it the single source of normative truth for the project.

This document explicates `yubi-OS/yubiOS docs/SPEC.md`, which is the primary source of record for every claim attributed to the "source doc" below. External mechanisms cited by the source doc were researched separately and carry their own URL and jev weight.

## The document's job

The source doc defines itself as the normative surface for yubiOS (source doc). Rationale, decisions, and threat coverage are deliberately split out to companion documents: architecture rationale lives in ARCHITECTURE.md, accepted decisions in ADR.md, threat coverage in MITIGATE.md, and pinned inputs in PINNED.md (source doc). The spec therefore reads as a contract layer: it states what MUST hold, and delegates the why to the ADR set and the threat analysis to MITIGATE.md. It also cross-references ONBOARDING.md for the first-boot flow and MISSION.md for the feature-cutting rule.

## Version and status conventions

The fetched document carries two version markers. The file header reads "Version 0.4 - 2026-07-16 - Status: pre-launch, tracks `main`", while a later heading declares "yubiOS Specification (version 0.5, supersedes the 2026-07-16 version 0.4 text)" (source doc). A dated drift-check section at the end of the file, "2026-09-18 drift check (wayfinder round 11, cycle 17)", records that the spec resolved to the newer canonical version, is now single-version, the frozen check passes, and "the older v0.4 text is gone" (source doc). For readers this means the 0.5 heading is the live normative text; the 0.4 header is a vestige the drift check itself flags. The "tracks main" status line also tells you the spec is not a point-in-time release artifact but follows the moving main branch.

## In-scope surfaces

The spec puts 5 surfaces in scope (source doc):

1. The OS image.
2. Its build pipeline.
3. Its trust chain.
4. Its update mechanism.
5. Its enrollment flows.

Platform scoping is explicit: arm64 is the primary target platform, backed by ADR-023 and the owned secure-world stack decisions ADR-018, ADR-019, ADR-020, and ADR-021; x86-64 is secondary and fully supported under ADR-017 (source doc). The primary/secondary split is a trust-ownership split, not a maturity split: as later sections state, x86-64 depends on platform firmware trust anchors yubiOS does not own end to end (source doc).

## Out-of-scope boundaries

The spec names 3 exclusions (source doc):

1. Application-level security.
2. Hardware below the UEFI firmware boundary, which is deferred to the "What yubiOS Cannot Fully Prevent" section of MITIGATE.md.
3. Non-YubiKey FIDO2 tokens, which are untested, though the design is stated to contain nothing Yubico-specific beyond firmware version floors.

The third exclusion is qualified rather than absolute: the spec is careful to say the absence of support is a testing claim, not an architectural dependency, so another FIDO2 token could work in practice but carries no conformance guarantee.

## The keyword contract

The spec opens by binding its requirement language to RFC 2119: "The key words MUST, MUST NOT, SHOULD, and MAY are to be interpreted as described in RFC 2119" (source doc). RFC 2119 defines these terms: MUST means an absolute requirement, SHOULD means a genuine recommendation that may be waived with reasons, and MAY means truly optional (https://www.rfc-editor.org/info/rfc2119/, jev weight 0.65; https://rfcinfo.com/rfc-2119/, jev weight 0.69). A later clarification, RFC 8174, restricts the special meanings to UPPERCASE usage only (https://www.rfc-editor.org/info/rfc8174/, jev weight 0.48, weak). The source doc uses the uppercase forms consistently, which keeps it on the safe side of that clarification, though it cites only RFC 2119 itself (weak-backed observation).

In the source doc, MUST appears as an enforcement verb for the core trust properties: no silent decryption, no modification of /usr, updates that never invalidate enrollments, digest-pinned build inputs. This is what makes the conformance checklist in section 7 testable: each checklist point restates a MUST from the body.

## Downstream observability

The file closes with a "Continuous / adaptive coverage" section stating that the document supports the yubiOS continuous-monitoring layer (runtime detection via falco, tracee, tetragon, kubeArmor, adaptive policy, real-time monitoring) and that it "is observable from the runtime-detect surface" with alerts and metrics feeding the audit-evidence rollup (source doc). In normative terms this makes the spec itself part of the monitored evidence chain, not just a description of it.

## Why the framing matters

The scope section is load-bearing for conformance claims: a build "claiming to be yubiOS" (section 7) is bounded by exactly the surfaces named here. Anything outside the 5 in-scope surfaces, below the UEFI boundary, or in application space is outside the spec's normative reach, and the reader is pointed to MITIGATE.md for what that residual risk means.
