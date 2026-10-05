# Rekor v2: tiles, witness quorum, and TUF endpoint discovery

Scope: what Rekor v2 changes in Sigstore's transparency log (tile-backed storage, per-tile witness quorum, TUF-based endpoint discovery), how the CLI and cosign interact with it, and the cosign version floor pitfall for Rekor v2 attestation writes.

## What Rekor v2 is

Rekor v2, also called rekor-tiles or Rekor on Tiles, is a redesigned and modernized Rekor, Sigstore's signature transparency log, transitioning its backend to a modern tile-backed transparency log implementation to simplify maintenance and lower operational cost. Source: https://github.com/sigstore/rekor-tiles (weight 0.73, primary).

The original Rekor repository remains the home of the CLI used to make and verify entries, query the transparency log for an inclusion proof, perform integrity verification of the log, and retrieve entries by public key or artifact; Rekor fulfills the signature transparency role of Sigstore's software signing infrastructure. Source: https://github.com/sigstore/rekor (weight 0.81, primary).

The Sigstore logging documentation describes setting up a new repository and using a provided reusable workflow to audit the log, plus monitoring the log for specified identities, though identity monitoring is described as a work in progress supporting a limited set of identities and entry types. Source: https://docs.sigstore.dev/logging/overview/ (weight 0.95, primary).

## The security model change: per-tile witness quorum

The security-model delta between v1 and v2, per a collected practitioner reference: Rekor v1 had a single root key whose compromise would invalidate the entire log; Rekor v2's witness quorum per tile means a witness compromise can only invalidate that tile, not the whole log. Endpoint discovery also moved to TUF: Rekor v2 endpoints are advertised via a TUF (The Update Framework) SigningConfig that cosign fetches at runtime. Source: https://github.com/yubi-OS/yubiOS/blob/main/skills/sigstore-rekor-v2/SKILL.md (weight 0.60).

## TUF is how cosign finds Rekor v2

Cosign's configuration documentation for alternative components states the trust material flow: verifying keyless signatures requires verifying signatures from Rekor, material (SCTs) from the CT log, and certificates chaining to Fulcio; the public keys and root certificates for these components are distributed through TUF repositories, and cosign defaults to the public good instance. The page contains the instructions for configuring cosign to work with alternative Rekor, Fulcio, or CT log components. Source: https://docs.sigstore.dev/cosign/system_config/custom_components/ (weight 0.92, primary).

Operational consequence: a pipeline that caches TUF metadata can fail after a key rotation if it does not refresh; the refresh cost is small relative to the failure mode, so refreshing the TUF cache on every CI run is the low-risk default.

## The cosign version floor pitfall

A collected source states a hard version floor with a specific reason: the signer must be Cosign >= v3.1.0 (pinned in config and passed to the installer in every signing workflow). Only v3.1.0 or later logs a DSSE attestation to Rekor v2 as a hashedrekord entry over the envelope's pre-authentication encoding (PAE); older cosign writes the legacy dsse entry type, which no released sigstore-go can verify. Source: https://docs.nvidia.com/aicr/contributor-guide/rekor-v-2-signing/ (weight 0.62).

This is the sharpest integration pitfall in the Rekor v2 transition: plans that assume an older cosign version handles Rekor v2 transparently should be re-verified against current cosign release notes, because the legacy dsse entry type older versions write is not verifiable by current verification libraries. When a verification step fails on a freshly signed attestation, check the cosign version and the entry type written before debugging anything else.

## Tooling surface

The cosign Go package documents keyless signing with the Sigstore public good Fulcio CA and Rekor transparency log as the default, alongside hardware and KMS signing. Source: https://pkg.go.dev/github.com/sigstore/cosign/v3 (weight 0.70). Sigstore's overall goal is to improve supply chain technology for anyone using software dependencies, made for open source and beyond. Source: https://www.sigstore.dev/ (weight 0.78).

Noise filtering note: the search for this subtopic also surfaced rekor.ai (weight 0.05), an unrelated roadway-intelligence company that shares the name. It is recorded in the archive with its low weight and excluded from all claims here.

## Checklist

1. Treat Rekor v2 and rekor-tiles as the same thing (0.73).
2. Verify inclusion proofs via the CLI's query path (0.81) rather than trusting a signature alone.
3. Let cosign discover endpoints via TUF, and refresh the TUF cache per run (0.92, 0.60).
4. Pin cosign at or above the documented Rekor v2 write floor and confirm the hashedrekord entry type on first use (0.62).
