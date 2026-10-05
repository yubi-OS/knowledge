# SLSA Provenance Continuity Under Refederation

Scope: SLSA provenance requirements that break under refederation: invocation configSource.uri consistency, the build identity claim, and what a verifier must accept to treat a refederated builder as a continuation of the same build lineage.

## What provenance asserts

SLSA provenance is "an attestation that some entity (builder) produced one or more software artifacts (the subject of an in-toto attestation Statement) by executing some invocation, using some other artifacts as input (materials)" [1]. The v1.0 provenance spec adds that the invocation identifier field "identifies this particular build invocation, which can be useful for finding associated logs or other ad-hoc analysis", that "the exact meaning and format is defined by builder.id", and that by default it is "treated as opaque and case-sensitive" with the value SHOULD being "globally unique" [2]. Earlier spec generations describe the same structure with configSource: the v0.2 provenance model carries an `invocation.configSource` block and describes `invocation.parameters` as the "collection of all external inputs that influenced the build on top of invocation.configSource", with the entry point captured in "invocation.configSource.entryPoint" [3].

Newer SLSA documentation states the point of the whole artifact: build provenance describes "where, when, and how something was produced" [4], and provenance documents the builder identity, source repository, commit hash, build parameters, and output artifact digest [5] (weak backing, 0.10).

## The builder identity claim

The build identity is load-bearing for verification. SLSA's build-provenance spec makes `builder` REQUIRED (for SLSA Build L1 the RunDetails builder field is required) [4], and the framework "is organized into a series of levels that describe increasing security guarantees", with recommended attestation formats including provenance defined in the v1.2 specification [6]. The detailed technical requirements for producing artifacts at each level are aimed at "platform implementers and security engineers" [7], and the Build track splits requirements between "the Producer (organization that owns and releases the software) and the Build platform (infrastructure used to transform software from source to package)" [8] (weak backing, 0.19).

## What breaks under refederation

Refederation changes the identity chain that the provenance attests with. Three specific break points:

1. **builder.id semantics.** Because the invocation identifier's "exact meaning and format is defined by builder.id" [2], a change of the builder's identity anchor changes what the invocation identifier means. A verifier that pinned the old builder.id interpretation can no longer parse or trust the new provenance's identifiers without an explicit mapping.

2. **configSource and invocation consistency.** The v0.2 model's `invocation.configSource.uri` and `entryPoint` fields [3] describe where the build definition came from. A refederated builder typically also moves or re-anchors its build definition surface, so the configSource URI and the workload identity claim change together. Verification continuity requires the verifier to recognize both changes as one migration, not two unrelated mutations.

3. **Trust-root linkage.** Provenance is a signed attestation; its signature chain runs through the builder's signing identity. When that identity refederates (a new OIDC issuer for the CI), the attestation chain's trust anchor changes even though the logical builder is the same.

## What a verifier must accept for continuity

To treat a refederated builder as a continuation, the verifier's policy has to bind the new trust anchor to the same logical lineage: accept the new builder.id spelling or issuer, check that the configSource URI moved in the expected way, and rely on an out-of-band attestation about the migration itself, because provenance proves what built an artifact, not that two identity chains name the same actor. Completeness expectations vary by level (at SLSA Build L3, "completeness is considered best effort" [4]), so the verifier must be explicit about which identity fields are load-bearing for continuity at the level it enforces.

## Sources

All weights from the jev noul weighting of this corpus's dig.

1. SLSA Provenance v0.2, https://slsa.dev/spec/v0.2/provenance (0.63)
2. SLSA Provenance v1.0, https://slsa.dev/spec/v1.0/provenance (0.96)
3. SLSA Provenance v0.2 (devmoran mirror), https://devmoran.github.io/slsa/provenance/v0.2 (0.73)
4. SLSA Build: Provenance, https://slsa.dev/spec/v1.2/build-provenance (0.78)
5. SLSA Framework guide, decryptiondigest.com, https://www.decryptiondigest.com/blog/slsa-software-supply-chain-framework-guide (0.10, weak)
6. SLSA specification v1.2, https://slsa.dev/spec/v1.2/ (0.91)
7. SLSA Build: Requirements for producing artifacts, https://slsa.dev/spec/v1.2/build-requirements (0.80)
8. Build Requirements and Verification, deepwiki (slsa-framework/slsa), https://deepwiki.com/slsa-framework/slsa/4.2-build-requirements-and-verification (0.19, weak)
