# 03 - Provenance Format: in-toto Statement v1, DSSE, and the v1 Predicate

Scope: the wire format of SLSA provenance as yubiOS consumes and produces it, the v1.0 predicate structure (buildDefinition and runDetails), and how it differs from the retired v0.2 shape.

Ground spine: yubi-OS/yubiOS skills/slsa-provenance/SKILL.md (source doc).

## The three-layer model

SLSA provenance is "an attestation that a particular build platform produced a set of software artifacts through execution of the buildDefinition," with each build running as an independent process on a multi-tenant build platform [https://slsa.dev/spec/v1.0/provenance, jev 0.94]. The same definition appears in the spec's source of record on GitHub [https://github.com/slsa-framework/slsa/blob/main/spec/build-provenance.md, jev 0.95].

Structurally, the attestation model has three layers: an envelope that authenticates the message (typically through a digital signature), a statement that binds the attestation to specific artifacts and carries a typed predicate, and the predicate itself holding the actual metadata in a predicate-specific schema [https://deepwiki.com/slsa-framework/slsa/3.1-provenance-format, jev 0.13, weak]. The layering is standard in-toto architecture; treat that summary as corroboration of the primary sources.

## The in-toto Statement and the DSSE envelope

The source doc fixes the concrete types: SLSA provenance is an in-toto v1.0 Statement (`_type: https://in-toto.io/Statement/v1`) inside a DSSE envelope, using the `https://slsa.dev/provenance/v1` predicate, signed by the build service's OIDC identity and logged in Rekor (source doc).

For the envelope layer, the in-toto attestation spec states that the RECOMMENDED format and protocol for envelopes is DSSE v1.0, with requirements including support for multiple signatures in a single envelope, an authenticated payload type, avoidance of canonicalization-dependent security, and a hint indicating which signing key was used [https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md, jev 0.54].

## The v1 predicate: buildDefinition and runDetails

The v1.0 predicate separates what was built from how it was built:

- `buildDefinition`: `buildType`, `externalParameters`, `internalParameters`, `resolvedDependencies` (source doc).
- `runDetails`: `builder.id` plus invocation metadata (source doc).

The source doc states this explicitly replaces the old flat `builder`/`buildType`/`invocation`/`materials` shape from v0.2. A draft-stage spec page carrying the newer structure shows the same buildDefinition-centric prose [https://slsa.dev/spec/draft/build-provenance, jev 0.79].

The source doc's example provenance document shows the full shape in context: `subject` binds `artifact.uki` to its sha256 digest, `predicateType` is `https://slsa.dev/provenance/v1`, `buildType` is the generator's documented type (`https://slsa-framework.github.io/slsa-github-generator/generic@v1`), `externalParameters` carries the workflow ref/repository/path, and `resolvedDependencies` pins the git commit. `runDetails.builder.id` names the exact generator workflow at its tag (`generator_generic_slsa3.yml@refs/tags/v2.1.0`) (source doc).

## buildType must be documented

The SLSA provenance spec requires the `buildType` reference to be documented and published so consumers can parse fields unique to a given builder's provenance statements; GitLab's SLSA L3 documentation spells this consumer obligation out [https://docs.gitlab.com/ci/pipeline_security/slsa/level_3/provenance_v1/, jev 0.62]. For yubiOS this means the generator's `buildType` URI in the source doc example is not decoration: it is the schema key a verifier or auditor uses to interpret `externalParameters`.

## Migration notes from v0.2

Three concrete v0.2 artifacts to stop using, per the source doc's dated correction (2026-07-24):

1. `predicateType: slsa.dev/provenance/v0.2`.
2. The flat `invocation`/`materials` structure.
3. in-toto `Statement/v0.1`.

The source doc verified this against slsa.dev/spec/v1.0/levels and slsa.dev/spec/v1.0/provenance. A third-party overview of the formats confirms SLSA is one predicate type within the in-toto framework used across Sigstore and supply chain tooling [https://safeguard.sh/resources/blog/in-toto-attestation-formats-review, jev 0.18, weak].

## Reading order for auditors

An auditor consuming a yubiOS attestation should check, in order: the DSSE signature against the build service's OIDC identity (docs 05 and 07 for the transparency-log anchor), the statement's `_type` and `predicateType` (v1 only), the subject digests against the artifact actually being verified (doc 04), and the `buildDefinition.resolvedDependencies` against the expected source revision (doc 01's threat of build-from-modified-source is mitigated exactly by this comparison, [https://deepwiki.com/slsa-framework/slsa/2-slsa-specification, jev 0.11, weak]).
