# 08 - Standards and ecosystem: referenced specs and related yubiOS skills

## Scope

The standards the SKILL.md's References section names (in-toto, Sigstore Rekor v2, TCG TPM 2.0, HITRUST CSF, CISA ZTMM), what each is, and the 5 related yubiOS skills the skill composes with.

## The named standards

The source doc (yubi-OS/yubiOS skills/audit-evidence-packaging/SKILL.md) references 5 external standards:

- in-toto Statement v1 specification: https://github.com/in-toto/docs/blob/master/in-toto-spec.md
- Sigstore Rekor v2 specification: https://github.com/sigstore/architecture-docs/blob/main/rekor-v2-spec.md
- TPM2 PCR quote specification (TCG TPM 2.0 Library): https://trustedcomputinggroup.org/resource/tpm-library-specification/
- HITRUST CSF v11.7.0 control families: https://hitrustalliance.net/product-tool/hitrust-csf/
- CISA Zero Trust Maturity Model v2.0: https://www.cisa.gov/zero-trust-maturity-model

### Rekor v2

Rekor v2 (also called rekor-tiles, or Rekor on Tiles) is a redesigned and modernized Rekor, Sigstore's signature transparency log, transitioning its backend to a modern tile-backed transparency log implementation (https://github.com/sigstore/rekor-tiles, weight 0.87). Sigstore's own blog describes the transition as making the log cheaper to run and simpler to maintain (https://blog.sigstore.dev/rekor-v2-ga/, weight 0.83), with the alpha announcement carrying the same framing earlier (https://blog.sigstore.dev/rekor-v2-alpha/, weight 0.68). The tile-based design is why the bundle's transparency artifact is a tile entry (attestation/rekor-tile-entry.json in the anatomy), not a v1-style log entry. The yubiOS skill `sigstore-rekor-v2` is the in-repo skill covering this layer in depth (source doc).

### TCG TPM 2.0

The TPM 2.0 specification is a library specification supporting a wide variety of functions and algorithms (https://trustedcomputinggroup.org/resource/tpm-library-specification/, weight 0.88). The architecture part of the library defines PCRs and the attestation operations, with the full Part 1: Architecture document published by TCG (https://trustedcomputinggroup.org/wp-content/uploads/TCG_TPM2_r1p59_Part1_Architecture_pub.pdf, weight 0.86). TCG also publishes a reference implementation of the TPM 2.0 specification as open source (https://github.com/TrustedComputingGroup/TPM, weight 0.72). The bundle's PCR quote (PCRs 0-7 boot, 10 IMA, 11 UKI) and its verification against the platform's TPM2 attestation key both sit inside this specification's scope.

### in-toto

The Statement v1 model (predicateType, subject digests) comes from the in-toto attestation framework; the yubiOS evidence-bundle predicate extends it with a yubiOS-specific predicate type. The skill `slsa-provenance` covers the in-toto envelope format this skill extends (source doc).

### HITRUST and CISA

HITRUST CSF control families and CISA ZTMM v2.0's 5 pillars plus 3 cross-cutting capabilities are the audit-framework consumers named in When to Use; their primary sources are covered in doc 02.

## The 5 related yubiOS skills

The source doc's References section maps the composition:

- **sigstore-rekor-v2**: the transparency log for evidence bundles. The bundle's Rekor v2 tile entry and its inclusion-proof verification are that skill's domain.
- **slsa-provenance**: the in-toto envelope format this skill extends. SLSA L3 provenance uses the same Statement structure; the source doc's changelog notes the gap this skill closed was that slsa-provenance covers SLSA L3 generically but not the evidence-bundle pattern for HITRUST/CISA/Chronicle consumers.
- **ftpm-optee-tpm**: the platform identity for the TPM2 attestation quote. On ARM64 yubiOS targets the quote source is the firmware TPM running as an OP-TEE trusted application, so the quote's trust anchor is that TA's attestation key.
- **yubikey-operations**: the YubiKey identity for the platform-attestation signature. PIV slot 9c key lifecycle, attestation certificates, and signing operations are that skill's domain.
- **chronicle-yara-l-detection**: a downstream consumer of evidence bundles. Detection rules over evidence-bundle inputs are the consumption side of the pipeline.

## How the composition reads

The evidence bundle is the convergence point: the format comes from in-toto (slsa-provenance's domain), the transparency binding from Rekor v2 (sigstore-rekor-v2's domain), the platform quote from the TPM stack (ftpm-optee-tpm's domain), the operator signature from the YubiKey (yubikey-operations's domain), and the consumption from Chronicle detection (chronicle-yara-l-detection's domain). The skill's own changelog records it as created in cycle 5 from a deep-research coverage gap, ranked as the highest-leverage generic skill for the attestation (P1) and audit/evidence (P7) primitives, with the manifest and Merkle root serving the self-describing (P10) primitive (source doc, changelog). Subsequent RSI cycles added declarative-policy (2026-08-06, cycle 5) and least-privilege (cycle 6) keyword coverage and confirmed full movable primitive coverage at cycle 7 (source doc, audit-trail entries).

## Key takeaways

- 5 named standards: in-toto Statement v1, Sigstore Rekor v2 (tile-backed per the rekor-tiles project), TCG TPM 2.0 Library (architecture Part 1 defines PCRs and quoting), HITRUST CSF, CISA ZTMM v2.0.
- Rekor v2's tile-backed redesign is why the bundle's transparency artifact is a tile entry.
- 5 sibling yubiOS skills own the layers this skill composes: transparency (sigstore-rekor-v2), envelope (slsa-provenance), TPM platform identity (ftpm-optee-tpm), YubiKey operator identity (yubikey-operations), and downstream detection (chronicle-yara-l-detection).
- The skill was created in cycle 5 (2026-08-04) as the highest-leverage generic skill for attestation plus audit/evidence coverage, per its own changelog.