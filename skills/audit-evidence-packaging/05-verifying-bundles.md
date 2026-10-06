# 05 - Verifying a bundle

## Scope

The 7-step verification path an auditor runs with `evidence-bundle verify`, what each step re-establishes, and the trust anchors each step relies on.

## The command

The source doc (yubi-OS/yubiOS skills/audit-evidence-packaging/SKILL.md) gives the auditor entry point:

```bash
evidence-bundle verify evidence-bundle-2026-08-04-yubiOS-prod
```

The verifier script ships inside the bundle (verifier/verify.sh), so the auditor runs the same logic the producer used and does not depend on the producer's infrastructure. The command re-runs the full verification path and ends with a verdict: PASS or FAIL with the specific failure reason.

## The 7 steps

The source doc enumerates the full path:

1. Hash each artifact and recompute the Merkle root
2. Verify the Merkle root matches `merkle-root.txt`
3. Verify the YubiKey signature over the Merkle root (using the public key from the yubiOS build-time signing cert)
4. Verify the Rekor v2 tile entry's inclusion proof (using TUF-discovered endpoint)
5. Verify the TPM2 PCR quote's signature against the platform's TPM2 attestation key
6. Verify the PCR quote's PCR values match the IMA measurement list's claimed PCR 10 value
7. Report a verdict: PASS / FAIL with the specific failure reason

The order is not arbitrary. Steps 1-2 re-establish tamper-evidence locally: if any byte of any artifact changed, the recomputed root will not match, and every later step is moot. Steps 3-4 establish the identity and transparency bindings over that root. Step 5 binds the platform state independently, and step 6 is the cross-artifact consistency check that makes the bundle self-contained evidence.

## What each step needs

### Steps 1-2: local recomputation

Nothing external. The verifier needs only the artifacts and merkle-root.txt. This is why the artifacts list is deliberately small and high-signal: every file in artifacts/ is hashed and replayed on verification, so noise in artifacts/ is a direct verification cost.

### Step 3: the YubiKey signature

The trust anchor is the yubiOS build-time signing cert's public key, not a key fetched from the producer at verify time. This keeps the identity check anchored in the build-time chain of trust rather than in any runtime assertion by the producer.

### Step 4: the Rekor v2 inclusion proof

Rekor is Sigstore's transparency log: a REST API-based server for validation and a transparency log for storage, with a CLI to make and verify entries, query the log for inclusion proofs, and verify log integrity (https://github.com/sigstore/rekor, weight 0.82). Its verify flow lets a client send a public key, signature, and artifact to the log to verify proof of entry (https://docs.sigstore.dev/logging/cli/, weight 0.79). The log itself is described as an immutable, tamper-resistant, transparent ledger of signatures and software metadata (https://www.sigstore.dev/, weight 0.72).

The endpoint is discovered via TUF rather than hardcoded. Sigstore's root-signing project maintains the TUF repository that securely delivers the Sigstore trust root (trusted_root.json) to clients (https://github.com/sigstore/root-signing, weight 0.83), which is the mechanism that lets a verifier resolve the current log endpoints and keys without trusting the bundle producer's configuration.

One operational nuance from the field: Rekor's role in cosign verification distinguishes between online verification and bundle verification behavior during a log outage, since evidence carried in the bundle can be checked against the log later (https://oneuptime.com/blog/post/2026-08-11-rekor-cosign-verification-transparency-log-outage/view, weight 0.51, weak backing: vendor blog). The yubiOS verify path sidesteps most of this ambiguity because the tile entry travels inside the bundle; the inclusion proof still needs the log to check against.

### Steps 5-6: the TPM2 quote and the IMA cross-check

Step 5 checks the quote's signature against the platform's TPM2 attestation key, re-establishing that the quoted PCR values came from the platform's TPM and not from an attacker's forgery. Step 6 is the property that distinguishes an evidence bundle from a pile of logs: the PCR quote and the IMA measurement list are 2 independent artifacts that must agree on PCR 10. An attacker who tampers with the measurement list cannot forge the quote to match, and a valid quote over different PCR values will not match the list.

### Step 7: the verdict

PASS or FAIL with the specific failure reason. The explicit failure-reason requirement matters for audit workflows: an assessor needs to know which binding failed (root mismatch, signature failure, inclusion proof failure, quote mismatch), not just that something is wrong.

## Independence from the producer

The source doc's Overview lists independent verifiability as the 4th property: the auditor re-runs the verification path on their own infrastructure without trusting the bundle producer. Steps 1-2 and 5-6 run entirely on bundle contents. Steps 3-5 need only public trust anchors: the build-time signing cert's public key, the TUF-discovered Sigstore root, and the platform's TPM2 attestation key. Nothing in the path requires contacting the producer, which is what makes the verdict usable as audit evidence.

## Key takeaways

- One command, `evidence-bundle verify <bundle>`, re-runs all 7 steps and emits PASS/FAIL with the failure reason.
- Steps 1-2 are local recomputation; steps 3-5 check 3 signatures against public trust anchors (build cert, TUF-discovered Sigstore root, TPM2 attestation key).
- Step 4 verifies a Rekor v2 inclusion proof with TUF-discovered endpoints via Sigstore's root-signing trust root.
- Step 6 is the cross-artifact check: PCR quote versus IMA measurement list on PCR 10.
- The verifier ships in the bundle, so the verification logic travels with the evidence.