# The SLSA v1.0 provenance predicate: in-toto Statement v1 and DSSE

Scope: the layered shape of a SLSA v1.0 provenance attestation (envelope, statement, predicate), what the provenance model claims, the v0.2 versus v1.0 predicate difference, and what must be published for consumers.

## The attestation model has three layers

The in-toto attestation model consists of three main layers: the Envelope, which authenticates the message typically through a digital signature; the Statement, which binds the attestation to specific artifacts and contains a typed predicate; and the Predicate, which contains the actual metadata in a predicate-specific schema. SLSA Provenance is one specific predicate type within this model, identified by a predicate type identifier under the slsa.dev namespace. Source: https://deepwiki.com/slsa-framework/slsa/3.1-provenance-format (weight 0.26, weak backing, third-party explainer). The layering is corroborated by the envelope spec itself: https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md (weight 0.96, primary).

The in-toto Attestation Framework is versioned independently of the core in-toto specification; its stable version is v1.0. Source: https://in-toto.io/docs/specs/ (weight 0.92, primary). The Statement v1 spec is published at https://in-toto.io/Statement/v1 (weight 0.92, primary; the page itself is the spec surface).

## DSSE is the recommended envelope

The recommended format and protocol for envelopes is DSSE v1.0. Producers may use other signature methods meeting the ITE-5 specification, but DSSE-conformant envelopes: MUST support the inclusion of multiple signatures in a single envelope, SHOULD include an authenticated payload type, SHOULD avoid depending on canonicalization for security, and SHOULD support a hint indicating what signing key was used. Source: https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md (weight 0.96, primary).

Practical implementations follow this: Cimon emits an in-toto Statement v1 wrapping a SLSA Provenance v1 predicate, serialized inside a DSSE envelope, and describes the format as open and verifiable by any standards-compliant tool. Source: https://docs.cimon.build/provenance/attestation-content (weight 0.27, weak backing, vendor doc).

## What the provenance predicate claims

The SLSA v1.0 provenance predicate is the recommended way to satisfy the SLSA v1.0 provenance requirements. The model: provenance is an attestation that a particular build platform produced a set of software artifacts through execution of the buildDefinition. Each build runs as an independent process on a multi-tenant build platform. Source: https://slsa.dev/spec/v1.0/provenance (weight 0.88, primary).

The predicate splits into two halves: the build definition (the inputs) and the run details (who built it, when, and what came out). One third-party library models exactly those two halves as typed value objects plugged into an in-toto Statement, ready to sign with DSSE. Source: https://github.com/k2gl/slsa-provenance (weight 0.24, weak backing, library README).

## buildType must be documented and published

The SLSA provenance specification requires the buildType reference to be documented and published. GitLab's published SLSA L3 provenance v1 reference exists to assist consumers of GitLab SLSA attestations with parsing the fields unique to GitLab provenance statements. Source: https://docs.gitlab.com/ci/pipeline_security/slsa/level_3/provenance_v1/ (weight 0.86, primary vendor doc). The pitfall for integrators: a custom buildType that is not documented anywhere leaves downstream verifiers unable to parse builder-specific fields.

## v0.2 versus v1.0 formats

The slsa-github-generator documentation explicitly covers variations between SLSA v0.2 and v1.0 provenance formats, including how provenance data is populated from GitHub Actions context and the common fields shared across all builders and generators. Source: https://deepwiki.com/slsa-framework/slsa-github-generator/10-slsa-provenance-format (weight 0.68). Two shapes are in the wild, so a verifier or evidence pipeline must check which predicate version an attestation uses instead of assuming one.

## Consumer checklist

1. Unwrap the DSSE envelope and verify the signature before reading the payload (envelope authenticates the message, 0.96).
2. Check the Statement's predicate type identifier and predicate version; expect SLSA provenance v1 for new builds and v0.2 only from legacy pipelines (0.68).
3. Resolve the buildType reference to published documentation before interpreting builder-specific fields (0.86).
4. Bind the statement's subject digests to the artifact digest you actually pulled; the statement is what ties metadata to artifacts (0.26 weak, corroborated by 0.96 envelope spec layering).
