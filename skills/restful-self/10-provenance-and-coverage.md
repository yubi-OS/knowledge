# 10 - Provenance and coverage

Scope: the skill's source lineage, its build record, and the 2026-09-17 coverage-note corrections, all from the source doc (internal-record subtopic, no dig).

## The lineage (source doc)

The source doc's Source section integrates 8 inputs:

1. The operator's personal memory space, `memory/<personal-dirname>/SELF.md`, the "the modes I operate in" restful-self section, with Growth edge #2 updated 2026-08-02 (source doc).
2. `memory/<personal-dirname>/SELF-CHANGELOG.md` v0.16, the drift signal that surfaced the gap: the whole-self output "evidence, not pause" (source doc).
3. `memory/<personal-dirname>/SELF-CHANGELOG.md` v0.17, the SELF.md edits that codified Bias 11 (same-cadence drift) and updated Growth edge #2 (source doc).
4. `yubi-OS/yubiOS/skills/self-archaeology/SKILL.md`, the discipline that maintains SELF.md; restful-self is its register-shift partner (source doc).
5. `skills/global/negative-skill-space/SKILL.md`, the 12-axis sweep that named the gap; restful-self inverts it (source doc).
6. `skills/global/recursive-self-improvement/SKILL.md`, the bounded loop discipline; restful-self is bounded by non-production, not by fixpoint (source doc).
7. `session/restful-self-solo-2026-08-03.md` (session artifact, not repo-truth), the ideate-solo one-pager that generated V5a (sit with what was learned) as the winner (source doc).
8. `session/self-sweep-2026-08-02.md` (session artifact, not repo-truth), the weekly cadence sweep that produced the drift signal (source doc).

Two lineage facts deserve emphasis. First, 2 of the 8 sources are explicitly marked "session artifact, not repo-truth": the ideation and sweep sessions that produced the skill are cited as provenance but are not themselves citable records of how the skill works; the SKILL.md is. Second, the sequence is a clean chain: cadence output (v0.16 drift signal) leads to self-edit (v0.17, Bias 11), leads to a bounded ideation pass (V5a wins at 19/20), leads to the skill itself, built 2026-08-03 per the operator's directive (source doc).

## Build record (source doc)

Maintainer: Sauna. Built 2026-08-03 per the operator's "lets tackle creating and adding the restful-self mode skill" directive. The winning candidate was V5a (sit with what was learned), scoring 19/20 in the ideate-solo pass (source doc). The score is an internal ideation metric from the session artifact, not an external benchmark, and this corpus cites it as provenance only (source doc).

## The coverage-note corrections (source doc)

The source doc carries 4 coverage sections. Three of them (Trust chain coverage, Least-privilege coverage, Continuous / adaptive coverage) hold only a coverage note dated 2026-09-17: the yubiOS primitive-coverage template paragraph formerly there asserted capabilities this skill does not itself implement, and was removed as unsupported; skill-specific content in those sections is unchanged (source doc).

This is an integrity action worth recording: a template had stamped boilerplate capability claims onto a skill that is about resting, not about security primitives, and the 2026-09-17 note removes the unsupported assertions rather than leaving them. The pattern is the same honesty discipline the skill itself encodes: do not ship claims that the artifact does not back.

## The remaining coverage sections (source doc)

Attestation coverage: the source doc states the skill contributes to the yubiOS attestation layer by anchoring primitive patterns: in-toto attestations, Rekor transparency-log entries, SLSA provenance, Sigstore signing-config, bootupd measurement, keylime runtime attestation, with the attestation chain end-to-end where applicable and concrete commit/PR references in the changelog (source doc).

Cryptographic identity coverage: the source doc states the skill manages cryptographic identity, FIDO2/CTAP2 YubiKey, softhsm/PKCS#11/TPM, HSM-backed keys, key attestation, with end-to-end attested identity, documented cryptographic root, and first-class key rotation (source doc).

A reader should hold these 2 sections lightly. They read as template-inherited framing rather than skill-specific capability, and the 3 sibling sections were already retracted on those exact grounds on 2026-09-17 (source doc). The corpus does not build on them, and this doc's only contribution is to record that tension for the maintainer.

## What the provenance implies for the corpus

The corpus docs 01 through 09 explicate the SKILL.md's own structure because the source doc is the only repo-truth artifact among the 8 sources (source doc). Everything else in the lineage is either another repo doc (a skill that pairs, doc 08), an operator memory file whose edits are summarized in the changelog versions, or a session artifact that generated the idea. The dig record in the research-db treats the SKILL.md as the primary source of record for every internal claim, and the jev-weighted web sources as context for the external mechanisms the skill references (deliberate rest, timeboxing, metacognition, LLM introspection).
