# 03. The input object: what the policy sees

Scope: the fields Buildx passes to the policy in the input object, their exact semantics, and one documented upstream field beyond the yubiOS subset.

## The yubiOS subset

The source doc's table is the authoritative list for the yubiOS policy:

| Field | Meaning |
|---|---|
| input.local | true for pure-local context (no remote FROM pull), usually allow |
| input.image.ref | the image reference string, e.g. quay.io/fedora/fedora-bootc:45 |
| input.image.isCanonical | true iff pinned to an immutable @sha256: digest |
| input.image.hasProvenance | true iff the image ships SLSA provenance attestation |

(source doc: yubi-OS/yubiOS skills/docker-build-policy/SKILL.md, for all 4 rows)

## The upstream reference goes further

Docker maintains a dedicated Input reference page documenting the full input object. Beyond the 4 fields above, it documents fields such as input.image.host, the registry hostname, where Docker Hub images use "docker.io" (source: https://docs.docker.com/build/policies/inputs/, weight 0.52). Treat the source doc table as the yubiOS-relevant subset: the policy pattern in doc 04 needs exactly those 4 fields, and adding more fields is a policy change that should go through the review discipline in doc 05 and doc 08.

## input.local is load bearing for every build

The upstream introduction explains why allow if input.local is in nearly every policy: the rule allows local file access, which includes the build context (typically the . directory) and, importantly, the Dockerfile itself. Without this rule, Buildx cannot read the Dockerfile to start the build, even for builds that reference no other files from the build context (source: https://docs.docker.com/build/policies/intro/, weight 0.51). This is why the yubiOS pattern has an unconditional allow if input.local rule even though the gate exists for remote images: removing it breaks every build, not just local ones (source doc rule; upstream explanation from the dig).

## isCanonical: the digest-pinning check

input.image.isCanonical is true if and only if the image reference is pinned to an immutable @sha256: digest (source doc). This single boolean is the mechanical core of the gate: doc 05 and doc 08 cover why mutable tags are the attack surface it closes.

## hasProvenance: the attestation check

input.image.hasProvenance is true if and only if the image ships an SLSA provenance attestation (source doc). Upstream documents SLSA provenance attestations for buildx-built images: they record how the image was built and can be inspected with imagetools inspect (source: https://docs.docker.com/build/metadata/attestations/slsa-provenance/, weight 0.55). The source doc deliberately keeps hasProvenance out of the allow condition today: quay.io/fedora/fedora-bootc did not ship provenance when last checked, so requiring it would deny every build (source doc; see doc 05).

## A documented debugging hazard

A buildx issue reports that policy eval fails with "object required" when the policy checks a field that a given input does not carry (source: https://github.com/docker/buildx/issues/3613, weight 0.41, weak backing). The weak weight reflects that it is a single issue report, not documentation. The practical takeaway, consistent with doc 07: when extending the policy with new input fields, test with synthetic input first and guard lookups for inputs that may lack the field.
