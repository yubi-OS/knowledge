# 03 - TUF SigningConfig: endpoint discovery and key rotation

Scope: how cosign discovers Rekor v2 endpoints at runtime through the TUF SigningConfig, what the config contains, how rotation works, and how yubiOS pipelines avoid rotation failures.

## Endpoints are not hardcoded

Rekor v2 endpoints are not hard-coded in cosign. Instead, cosign fetches a TUF (The Update Framework) SigningConfig at runtime to discover the current Rekor v2 tile server URL, the current witness quorum configuration, the current Fulcio URL, and the TUF targets with their current valid timestamp (source doc, yubi-OS/yubiOS skills/sigstore-rekor-v2/SKILL.md). This matters for yubiOS in two ways: it means an org-internal Rekor v2 deployment can be advertised through its own TUF root, and it means pipelines that cache TUF metadata past its validity window fail after rotation.

The official Sigstore TUF repository (root-signing) is a fully functional TUF repository used to run both generic TUF client tests and Sigstore-specific client tests with cosign and other Sigstore clients (https://github.com/sigstore/root-signing, weight 0.67). Its live CDN instance at https://tuf-repo-cdn.sigstore.dev/ regenerates from root-signing commits by TUF-on-CI, for example generated 2026-10-06T04:56+00:00 from root-signing commit 6313482 by TUF-on-CI v0.20.0 (https://tuf-repo-cdn.sigstore.dev/, weight 0.52). That continuous regeneration from a Git-anchored repository is the mechanism behind key rotation: new keys land as root-signing commits, and the CDN publishes freshly signed metadata.

## What the config distributes

The TUF layer distributes more than URLs. A weak-weight practitioner source describes the full set: TUF is convenient for distributing trusted_root.json, signing_config.json, public keys, certificates, and other configuration files, with Sigstore's public TUF server at tuf-repo-cdn.sigstore.dev (https://kyverno.io/blog/2026/08/12/pr-16591/, weight 0.12, weak backing). The SigningConfig itself is parsed from the signing_config.v0.2.json TUF target and specifies service URLs and API versions for Sigstore signing infrastructure including Fulcio, Rekor, and TSA (https://mitchdenny.github.io/sigstore-dotnet/api/Sigstore.SigningConfig.html, weight 0.07, weak backing; the class reference corroborates the file name and content model even though the project is third-party).

Cosign's own configuration model is documented in the custom components guide: the public keys and root certificates for Sigstore components are distributed through TUF repositories, and by default cosign uses a TUF client that has initial trust in an embedded root and then fetches updated verification material (https://docs.sigstore.dev/cosign/system_config/custom_components/, weight 0.76). This embedded-root bootstrap is what allows the runtime discovery to be secure: the TUF chain itself is rooted in material cosign ships with.

## Rotation cadence and the 7-day trap

Per the source doc, the TUF root key rotates every 6 months. Cosign auto-rotates; pipelines that cache TUF metadata will fail after a rotation if the cache is not refreshed. The sharper constraint is the metadata timestamp: TUF rotates every 6 months, but the metadata timestamp is about 7 days, and caching past the timestamp causes `cosign verify-attestation` to fail (source doc). This makes "caching TUF metadata for more than 7 days" an explicit anti-pattern.

The yubiOS convention (source doc) is to mount the TUF metadata cache as a build-time secret named `cosign-tuf-cache.json` and refresh it on every CI run to avoid rotation-related failures. That combines the freshness guarantee (per-run refresh) with the audit benefit (the cache is pinned per run, not ambient).

## Private deployments: BYO TUF

For an org-internal Rekor v2 deployment, the endpoints and witness quorum configuration must come from somewhere. Sigstore supports Bring-Your-Own (BYO) TUF, where you set up your own root of trust for use in client tools like Cosign (https://blog.sigstore.dev/sigstore-bring-your-own-stuf-with-tuf-40febfd2badd/, weight 0.63). This is the mechanism the source doc's "Designing the TUF SigningConfig for a private Rekor v2 deployment" use case rides on: publish your own signing_config.json through your own TUF root, and cosign's runtime discovery works unchanged against your infrastructure.

Isolated environments follow the same pattern: the Kyverno writeup on Sigstore in an isolated environment covers cosign, RSTUF, and trust configuration distribution without the public CDN (https://kyverno.io/blog/2026/08/12/pr-16591/, weight 0.12, weak backing).

## Anti-patterns specific to TUF

Three rules from the source doc, each of which has broken real pipelines:

1. Do not cache TUF metadata beyond 7 days; the timestamp expiry fails verification even between rotations.
2. Do not hardcode the Rekor v2 endpoint; this bypasses TUF endpoint discovery and defeats the rotation mechanism.
3. Do not rely on auto-rotation alone in CI; refresh the cache every run, which is cheap, instead of debugging a Tuesday-morning verification failure after a rotation.

## Drift note

The source doc describes the TUF key rotation cadence as about 6 months with a 7-day metadata timestamp. The dig corroborates the distribution mechanism and the CDN (weights 0.52 to 0.76) but does not independently confirm the exact cadence numbers; they remain source-doc claims.
