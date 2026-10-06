# 04 - Generating a bundle

## Scope

The evidence-bundle CLI and its 7-step generation pipeline: hashing, Merkle tree construction, PCR quoting, YubiKey PIV slot 9c signing, and Rekor v2 publication.

## The CLI

The source doc (yubi-OS/yubiOS skills/audit-evidence-packaging/SKILL.md) defines a small CLI tool, `evidence-bundle`, used to generate bundles:

```bash
evidence-bundle create \
    --predicate-type=https://yubiOS/evidence-bundle/v1 \
    --artifacts=boot.log:audit.log:ima-measurement-list:pcr-quote.bin:policy-snapshot.json \
    --attestation-key=yubikey-piv-slot-9c \
    --tlog-upload=rekor-v2 \
    --output=evidence-bundle-2026-08-04-yubiOS-prod
```

The flags expose the 3 decisions that matter: the predicate type (in-toto Statement v1 with the yubiOS evidence-bundle predicate), the artifact set (colon-separated, filtered to high-signal logs per the anatomy), and the attestation key plus transparency-log target.

## The 7-step pipeline

The source doc enumerates what the tool does, in order:

1. Hashes each artifact (SHA-256)
2. Builds a Merkle tree over the hashes
3. Writes `merkle-root.txt`
4. Generates a TPM2 PCR quote over the relevant PCRs (0-7 for boot, 10 for IMA, 11 for UKI)
5. Signs the Merkle root with YubiKey PIV slot 9c
6. Publishes an in-toto Statement v1 envelope to Rekor v2
7. Writes the `verifier/` directory with a re-runnable verification script

Steps 1-3 are the tamper-evidence layer, step 4 is the platform-state capture, steps 5-6 are the 2 bindings over the root, and step 7 is the auditability layer.

## Step 4 in depth: the TPM2 PCR quote

The quote is the mechanism that binds the bundle to measured platform state. PCRs are special TPM registers that store a sequence of measurements of system state; remote attestation works by having the TPM sign the current PCR values (https://google.github.io/tpm-js/, weight 0.7). The `tpm2_quote` command in tpm2-tools is the standard CLI operation: it provides the quote and signature for a given list of PCRs in a given algorithm bank, taking a key context for the quote-signing key (https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_quote.1/, weight 0.84). Open-source reference flows for generating and verifying quotes end to end exist, showing the create-keys-then-quote sequence (https://awesome.ecosyste.ms/projects/github.com/kioubit/tpm2-quote-attest, weight 0.53, weak backing: community library index).

The PCR selection in the source doc follows the TCG convention the rest of the yubiOS stack uses: PCRs 0-7 cover the boot chain (firmware and bootloader measurements), PCR 10 holds IMA measurements, and PCR 11 holds UKI (unified kernel image) measurements. This is why the verify path can cross-check the quote's PCR 10 value against the IMA measurement list included in the same bundle: the two artifacts are independent evidence of the same counter.

## Step 5 in depth: the YubiKey PIV signature

PIV slot 9c is the digital-signature slot on a YubiKey. Yubico's PIV documentation defines slot 9c as holding the certificate and private key used for digital signatures for document signing, or signing files and executables (https://developers.yubico.com/PIV/Introduction/Certificate_slots.html, weight 0.85). The YubiKey computes signatures only in specific slots; slots 80, 81, and 9B do not hold asymmetric keys, and F9 signs an attestation statement rather than performing general signing (https://docs.yubico.com/yesdk/users-manual/application-piv/slots.html, weight 0.73). Signing requires PIN verification, or fingerprint on Bio devices (https://developers.yubico.com/yubico-piv-tool/Actions/signing.html, weight 0.66). Any PIV slot holding a private key other than F9 can create a signature, but the source doc standardizes on 9c because its role is exactly digital signature (https://docs.yubico.com/yesdk/yubikey-api/Yubico.YubiKey.Piv.Commands.AuthenticateSignCommand.html, weight 0.72).

The skill's anti-patterns section is why the key choice matters: the attestation key must be dedicated to evidence bundling, not shared with artifact signing, so that compromising one key does not invalidate both layers.

## Steps 6-7: publication and the shipped verifier

Step 6 publishes the in-toto Statement v1 envelope to Rekor v2, which makes the attestation publicly witnessed (the transparency binding). Step 7 writes the verifier directory into the bundle itself, so the verification path travels with the evidence and the auditor does not depend on the producer's infrastructure to know how to verify.

## Key takeaways

- One CLI entry point, `evidence-bundle create`, with flags for predicate type, artifact set, attestation key, and transparency-log target.
- 7 sequential steps; each maps to one of the bundle's 4 properties.
- PCR selection follows the TCG/yubiOS convention: 0-7 boot, 10 IMA, 11 UKI; the quote's PCR 10 is cross-checked against the IMA measurement list at verify time.
- Slot 9c is the PIV digital-signature slot per Yubico's own slot documentation, which is why the skill standardizes on it; it must be dedicated to evidence bundling.