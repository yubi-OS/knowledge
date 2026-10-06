# 01 - Evidence bundle overview

## Scope

What an evidence bundle is: a cryptographically-signed collection of logs, metrics, events, and configuration snapshots with four required properties, and how the yubiOS format derives from the in-toto attestation model.

## The four properties

The source doc (yubi-OS/yubiOS skills/audit-evidence-packaging/SKILL.md) defines an evidence bundle as the load-bearing artifact for any external audit (HITRUST, CISA, FedRAMP, internal SOC2). The bundle must satisfy 4 properties, each backed by a specific mechanism:

1. **Tamper-evident**: any modification to any artifact in the bundle invalidates the bundle's Merkle root signature. The Merkle tree over per-artifact SHA-256 hashes is the tamper-evidence layer (source doc).
2. **Attestable**: a TPM2 or YubiKey attestation quote signs the bundle's Merkle root, binding it to the platform's identity (source doc).
3. **Transparent**: the bundle's attestation is published to a transparency log (Rekor v2), making the attestation publicly verifiable (source doc).
4. **Independently verifiable**: an auditor can re-run the verification path on their own infrastructure without trusting the bundle producer (source doc).

Each property exists because a weaker substitute fails a real attack. A plain signed list of files can be modified individually without invalidating the outer signature; the Merkle tree closes that hole because every artifact hash feeds the root (source doc, anti-patterns section). Cryptographic tamper evidence as a formal notion (signing a digest that commits to a data set, then detecting any change) has been studied since at least 2003 (http://eprint.iacr.org/2003/031, weight 0.7), which frames the same idea: the signature covers a commitment, not the bytes, so verification recomputes the commitment.

## Derivation from in-toto

The yubiOS evidence-bundle format is derived from the in-toto attestation model. The manifest uses `_type: https://in-toto.io/Statement/v1` with `predicateType: https://yubiOS/evidence-bundle/v1`, and the bundle uses Rekor v2 as its transparency log (source doc).

The in-toto attestation framework defines a Statement as a claim about a set of subjects, identified by name and digest pairs, carrying a predicate that describes what is true about them (https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md, weight 0.82). The subject/digest binding is exactly what an evidence bundle needs: each artifact (boot.log, audit.log, ima-measurement-list) becomes a subject whose digest is committed in the statement. The in-toto project maintains the v1 attestation specification as its current reviewed standard alongside the older layout-based in-toto v1.0 specification (https://in-toto.io/docs/specs/, weight 0.68).

Rekor v2 is the transparency-log component of Sigstore, an immutable, tamper-resistant, transparent ledger of signatures and software metadata (https://www.sigstore.dev/, weight 0.72). Publishing the bundle's attestation there is what makes property 3 work: an attacker cannot quietly present a counter-attestation with a different Merkle root, because both entries would be publicly visible in the log (source doc, anti-patterns section).

## Why a bundle is more than a signed archive

A bundle is designed to be verified by a party with zero trust in the producer. That is why the format ships its own verifier (`verifier/verify.sh`) inside the bundle and why every binding is re-checkable from public material: artifact hashes, the Merkle root, a public signing certificate, and a transparency-log inclusion proof (source doc). This is the framing the skill teaches: the bundle is the evidence container for audits where the auditor is an external party (HITRUST assessor, CISA reviewer, SOC2 auditor), not an internal convenience wrapper around a log directory.

## Key takeaways

- 4 properties: tamper-evident, attestable, transparent, independently verifiable; each maps to one mechanism: Merkle tree, TPM2/YubiKey quote, Rekor v2 publication, shipped verifier.
- The manifest is an in-toto Statement v1 with a yubiOS-specific predicateType.
- Rekor v2 is the transparency log of record for the bundle's attestation.
- The verifier path is designed to run without trusting the producer; that is the property external audit frameworks are buying.