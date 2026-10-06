# 03 - Anatomy of an evidence bundle

## Scope

The on-disk layout of an evidence bundle: manifest.json, merkle-root.txt, artifacts/, attestation/, verifier/, README.md, and the role each file plays in the four bindings (tamper-evidence, platform identity, transparency, auditability).

## The layout

The source doc (yubi-OS/yubiOS skills/audit-evidence-packaging/SKILL.md) gives this canonical layout, using a production bundle from 2026-08-04 as the example:

```
evidence-bundle-2026-08-04-yubiOS-prod/
├── manifest.json                    # in-toto Statement v1 with yubiOS/evidence-bundle/v1 predicate
├── merkle-root.txt                  # SHA-256 of the Merkle tree root over all artifacts
├── artifacts/
│   ├── boot.log                     # dm-verity-verified /usr boot log
│   ├── audit.log                    # Linux audit subsystem log
│   ├── ima-measurement-list         # IMA runtime measurements
│   ├── pcr-quote.bin                # TPM2 PCR quote over PCRs 0,1,2,3,4,5,10,11
│   └── policy-snapshot.json         # IMA policy + dm-verity root hash + composefs catalog
├── attestation/
│   ├── pcr-quote-signature.pem      # YubiKey PIV slot 9c signature over the Merkle root
│   └── rekor-tile-entry.json        # Rekor v2 tile entry for the bundle
├── verifier/
│   ├── verify.sh                    # Re-runs the full verification path
│   └── README.md                    # How to verify
└── README.md                        # What this bundle is, who produced it, when
```

The source doc summarizes the roles in one line each: the manifest is the in-toto envelope; merkle-root.txt is the binding; attestation/pcr-quote-signature.pem is the platform-identity binding; attestation/rekor-tile-entry.json is the transparency binding; verifier/verify.sh is the auditor's path.

## What each file binds

- **manifest.json**: the in-toto Statement v1. In the in-toto attestation framework, a Statement carries a predicateType URI that names what the claim is, and a subject array of name and digest pairs identifying the artifacts (https://runbook.academy/courses/git-cicd-gitops/lessons/git-cicd-gitops-lxx-03-in-toto-attestations/, weight 0.51, weak backing: course material). The yubiOS predicateType is https://yubiOS/evidence-bundle/v1 (source doc). Third-party coverage of the attestation framework confirms Statement, Envelope, and predicate types are the standard shape shared across SLSA, Sigstore, and supply-chain tooling (https://safeguard.sh/resources/blog/in-toto-attestation-formats-review, weight 0.52, weak backing: vendor blog).
- **artifacts/**: the evidence itself. The 5 example artifacts are deliberately high-signal: a dm-verity-verified boot log, the Linux audit log, the IMA measurement list, a TPM2 PCR quote over PCRs 0,1,2,3,4,5,10,11, and a policy snapshot (IMA policy, dm-verity root hash, composefs catalog). The source doc's anti-patterns section explains the filtering principle: /var/log is noisy and low-signal, so bundles pull specific logs, not everything.
- **merkle-root.txt**: a single SHA-256 digest committing to all artifact hashes. This is what gets signed and quoted.
- **attestation/**: 2 bindings over the same root. The YubiKey PIV slot 9c signature binds the root to the operator's hardware key; the Rekor v2 tile entry binds the attestation into a public transparency log.
- **verifier/**: a re-runnable script plus instructions, so the auditor does not need to reconstruct the verification logic from the producer's docs.

## Why a Merkle tree and not a flat hash list

The source doc's anti-patterns section is explicit: bundling without a Merkle tree fails because a signed list of files can be modified individually and the bundle signature does not catch per-file changes. A Merkle tree makes every artifact hash feed the root, so any single-file change changes the root.

Security research on tamper-evident log verification reaches the same structural conclusion. A 2026 study on lightweight tamper-evident log integrity verification for IoT edge systems treats Merkle trees as the standard integrity-verification mechanism for log streams (https://arxiv.org/html/2605.00065v1, weight 0.81). Comparative write-ups put the cost difference precisely: a hash chain forces the verifier to replay O(n) entries between a record and the commitment, while a Merkle tree verification costs O(log n) proofs, with Crosby and Wallach's historical measurement cited at 800 MB replayed versus 3 KB of proof (https://thehopiumlab.com/whiteboard/hash-chain-vs-merkle-tree, weight 0.53, weak backing: independent explainer). A practitioner comparison of hash chains, Merkle trees with signed checkpoints, and external anchors frames the choice as what each structure proves (https://zatona.dev/blog/tamper-evident-audit-logs, weight 0.51, weak backing: practitioner blog). For a bundle whose verifier must recompute a root over a handful of artifact hashes, the tree form also keeps the manifest small: the tree is over artifact hashes, not log bytes.

## The two binding layers over one root

The anatomy makes a separation the skill repeats: the Merkle root is committed once, then bound twice. The YubiKey PIV signature is the identity binding (who produced and attested this state), and the Rekor v2 tile entry is the transparency binding (that this attestation exists publicly at a point in time). Both bind to the same root, so the auditor verifies one digest and then checks 2 signatures over it, each against a different trust anchor. That is the structure that lets the bundle be simultaneously operator-attested and publicly witnessed.

## Key takeaways

- 6 top-level entries: manifest.json, merkle-root.txt, artifacts/ (5 high-signal artifacts in the example), attestation/ (PIV signature plus Rekor v2 tile entry), verifier/, README.md.
- The manifest is an in-toto Statement v1 with predicateType https://yubiOS/evidence-bundle/v1.
- Merkle tree over artifact hashes is the tamper-evidence layer; O(log n) proofs versus O(n) chain replay is the structural reason.
- The root is bound twice: YubiKey PIV 9c signature (identity) and Rekor v2 tile entry (transparency).