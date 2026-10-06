# 07 - Anti-patterns

## Scope

The 6 anti-patterns the skill names, why each fails, and the external evidence that supports each rule.

## The 6 anti-patterns

The source doc (yubi-OS/yubiOS skills/audit-evidence-packaging/SKILL.md) names 6, each with its failure mechanism stated inline:

1. **Bundling without a Merkle tree**: a signed list of files can be modified individually; the bundle's signature does not catch per-file changes. The Merkle tree is the tamper-evidence.
2. **Attesting the Merkle root with a key that's also used to sign the artifacts**: the same key compromise invalidates both the artifact signatures and the bundle signature. The bundle's attestation key should be dedicated to evidence bundling.
3. **Skipping the Rekor v2 publication**: the transparency log is what makes the bundle's attestation publicly verifiable. Without it, an attacker can publish a counter-bundle with a different Merkle root.
4. **Re-using a TPM2 PCR quote across bundles**: PCR values change as the system runs; each bundle needs a fresh quote for its current state.
5. **Bundling /var/log/* without filtering**: /var/log is full of noisy, low-signal entries; bundling it all inflates the bundle and obscures the high-signal artifacts. Filter to the relevant logs (audit, IMA, boot, systemd journal).
6. **Storing the bundle alongside the system that produced it**: the bundle's value is its independence from the producer. Store on a separate system (separate trust domain) and replicate to cold storage.

## Key separation (anti-pattern 2)

The dedicated-key rule is standard key-management doctrine. Google's Android key attestation documentation exists precisely so relying parties can verify that keys are hardware-backed and not exported (https://source.android.com/docs/security/features/keystore/attestation, weight 0.78). The pwnedkeys draft on key-compromise attestation treats compromise of a signing key as a first-class failure mode that verifiers must be able to detect and respond to (https://github.com/pwnedkeys/key-compromise-attestation-rfc/blob/main/draft-mpalmer-key-compromise-attestation.md, weight 0.68). Security handbooks treat key provisioning and storage as the discipline covering creating, protecting, using, rotating, revoking, and evidencing the keys a product depends on (https://www.securebydesignhandbook.com/docs/implementation/build-phase/key-provisioning, weight 0.55, weak backing: independent handbook). Guidance on attestation systems frames the single-key dependency as the central risk: if the attestation signing key is compromised, the whole verification story collapses (https://chainscorelabs.com/guides/trust-and-verification-systems/proof-of-reserves-verification/how-to-manage-key-management-for-proof-of-reserves-signing-ceremonies, weight 0.52, weak backing: vendor guide). The yubiOS rule is the same blast-radius argument applied to the bundle: artifact signing and bundle attestation are 2 different roles with 2 different keys.

## Transparency and equivocation (anti-pattern 3)

The counter-bundle scenario is the equivocation (split-view) attack on transparency systems: a malicious log server presents different versions of the log to different clients (https://technology.a-sit.at/wp-content/plugins/download-attachments/includes/download.php?id=5159, weight 0.83). Publishing to a single public log is what collapses the attack space: an attacker cannot maintain 2 inconsistent claims if both must appear in the same log. Background treatments of transparency logs describe them as authenticated, append-only data structures that record events with cryptographic proofs to ensure integrity and global consistency (https://www.emergentmind.com/topics/transparency-logs, weight 0.51, weak backing: explainer). Industry has converged on this pattern at scale: Microsoft's Signing Transparency Ledger is built specifically to enhance supply-chain security through transparent, auditable signing (https://learn.microsoft.com/en-us/azure/confidential-ledger/about-microsoft-signing-transparency-ledger, weight 0.82), announced as addressing threats traditional code signing alone cannot fully prevent (https://azure.microsoft.com/en-us/blog/enhancing-software-supply-chain-security-with-microsofts-signing-transparency/, weight 0.71).

## Fresh quotes and the rest

Anti-pattern 4 (re-using a PCR quote) follows from how PCR extension works: PCRs accumulate measurements as the system runs, so a quote captures one moment's state; quoting it again later would describe a state the bundle's logs do not correspond to. Anti-pattern 1 and 5 are covered in the anatomy doc (Merkle tree necessity, artifact filtering). Anti-pattern 6 is the trust-domain rule: co-locating the bundle with the producer gives an attacker who compromises the producer access to the evidence too, which destroys the independence the bundle exists to provide. The source doc prescribes a separate system and cold-storage replication.

## The pattern across all 6

Each anti-pattern is a shortcut that removes exactly one of the bundle's 4 properties: skipping the Merkle tree removes tamper-evidence; sharing the attestation key removes the independence of the identity binding; skipping Rekor publication removes transparency; re-using quotes and unfiltered bundles corrupt the attestability and verifiability layers; co-located storage removes independence from the producer. The skill's rule is therefore mechanical: if you find yourself cutting one of these corners, the bundle still exists but the property it was supposed to prove is gone.

## Key takeaways

- 6 named anti-patterns, each mapped to a property it silently deletes.
- Key separation and transparency publication are backed by mainstream practice: hardware-backed key attestation, key-compromise handling, and production transparency ledgers (Microsoft Signing Transparency).
- Equivocation is the named attack the Rekor v2 publication defends against; research literature measures it as the split-view problem.
- The failure mode is quiet: the bundle still exists and looks valid after any of these shortcuts, which is why they are listed as anti-patterns rather than errors.