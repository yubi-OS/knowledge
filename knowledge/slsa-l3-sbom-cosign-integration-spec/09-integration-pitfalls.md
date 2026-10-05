# Integration pitfalls: wiring provenance, SBOMs, and signing into CI

Scope: the failure modes hit when wiring SLSA provenance, SPDX SBOMs, cosign signing, and Rekor logging into GitHub Actions workflows, with the collected evidence for each.

## Permissions: the default token is not enough, and not everything should get the token

GitHub changed the default GITHUB_TOKEN permissions to read-only because the previous read/write default was too permissive. Source: https://github.blog/changelog/2023-02-02-github-actions-updating-the-default-github_token-permissions-to-read-only/ (weight 0.95, primary announcement). Consequence for attestation workflows: the permissions block must be explicit.

The id-token permission is used in combination with OpenID Connect; setting it to write is required in order to request an OpenID Connect JWT. Source: https://stackoverflow.com/questions/72183048/what-is-the-permission-scope-of-id-token-in-github-actions (weight 0.06, weak backing, Q&A). Missing id-token: write is the classic first-run failure for keyless cosign.

Placement matters: a top-level id-token: write makes the token available to more jobs than necessary, including jobs that parse or execute untrusted content; treat the token as a signing capability and set permissions at the job level. Source: https://github.com/oneuptime/blog/tree/master/posts/2026-08-11-secure-keyless-cosign-github-actions-pull-requests (weight 0.05, weak backing). The pull-request exposure risk: if untrusted PR code reaches a signing job, an attacker may obtain a valid certificate for the workflow identity and sign an artifact the organization never intended to release. Source: https://oneuptime.com/blog/post/2026-08-11-secure-keyless-cosign-github-actions-pull-requests/view (weight 0.09, weak backing).

## Identity pinning is mandatory at verify time

A valid keyless signature is not automatically an authorized signature: Fulcio can issue certificates to many identities from several identity providers, and cosign's --certificate-identity and --certificate-oidc-issuer options are what turn cryptographic verification into an authorization decision. Source: https://oneuptime.com/blog/post/2026-08-11-choose-cosign-certificate-identity-oidc-issuer/view (weight 0.33, weak backing). A verifier gate that pins only the issuer but not the identity accepts signatures from any workflow in the org.

## Version lockstep between generator and verifier

The slsa-github-generator publishes migration guides covering breaking changes, deprecated features, and configuration updates required when moving between versions. Source: https://deepwiki.com/slsa-framework/slsa-github-generator/13-migration-guides (weight 0.13, weak backing). The lockstep rule: the builder identity embedded in provenance is a function of the generator version, so moving the generator pin requires updating the verifier's expected builder id in the same change. Verify both sides in one PR.

## The cosign version floor for Rekor v2 writes

A collected source states the floor explicitly: the signer must be Cosign >= v3.1.0; only v3.1.0 or later logs a DSSE attestation to Rekor v2 as a hashedrekord entry over the envelope's pre-authentication encoding (PAE), and older cosign writes the legacy dsse entry type, which no released sigstore-go can verify. Source: https://docs.nvidia.com/aicr/contributor-guide/rekor-v-2-signing/ (weight 0.62). Integration plans written against older cosign version assumptions should be re-verified; verification failures on freshly signed attestations are often this floor, not a misconfiguration.

## Public disclosure through the transparency log

Keyless signing publishes the signer's username, organization name, repository name, and workflow name to the Rekor public transparency log. Source: https://dev.to/n3wt0n/sign-your-container-images-with-cosign-github-actions-and-github-container-registry-3mni (weight 0.11, weak backing). Decide whether that disclosure is acceptable before enabling keyless on private repositories.

## Troubleshooting taxonomy

The generator's troubleshooting documentation groups the common issues into workflow failures, permission errors, artifact handling problems, and integration issues with external services. Source: https://deepwiki.com/slsa-framework/slsa-github-generator/12-troubleshooting (weight 0.30, weak backing). Start diagnosis from those four buckets before reading workflow YAML line by line.

## Spec version hygiene

The released versions of the SLSA spec live on corresponding release branches (releases/v1.0, releases/v1.2, and so on) in the spec repository. Source: https://github.com/slsa-framework/slsa (weight 0.96, primary). Cite the release branch URL, not a moving main-branch path, so evidence artifacts stay stable.

## Stale vocabulary in the wild

Secondary sources still circulate v0.2-era language, for example articles covering "SLSA levels 1-4". Source: https://www.systemshardening.com/articles/cicd/slsa-build-provenance/ (weight 0.22, weak backing). When reviewing a plan or doc that says Build L4, check it against the primary levels page before approving (see the corpus doc on build levels).
