# Common policy rules: registries, digests, provenance

Scope: the concrete rule shapes a build policy uses in practice: approved-registry allowlists, digest pinning via `isCanonical`, provenance and signature gating, and metadata-based constraints.

## Approved-registry allowlist

The simplest and most common gate restricts image pulls to approved registries. The rule shape is a prefix test on the resolved reference:

```rego
allow if {
    startswith(input.image.ref, "dhi.io/")
}
```

(source doc, session/refs-mint/refs_corpus/docker-build-policies-reference-2026-07-23.md; the allowlist pattern is also the documented starting point at https://docs.docker.com/build/policies/validate-images/, weight 0.92.)

Docker's own policy templates ship a stronger version of the same idea: a standard policy that allows local and Git contexts, images from Docker Hub, GitHub Container Registry, and Docker Hardened Images, and ADD downloads over HTTPS, while blocking HTTP downloads and non-standard registries (https://docs.docker.com/build/policies/examples, weight 0.94; https://docs.docker.com/build/policies/examples/, weight 0.95). The same template includes a DHI-specific note: if you have a DHI Enterprise subscription and have mirrored Docker Hardened Images to Docker Hub, add a rule for the mirrored path (https://matsuand.github.io/docker.docs-ja/build/policies/examples/, weight 0.14, weak backing).

A multi-registry pattern applies different validation rules for internal and external registries, starting from the same deny-by-default skeleton with a placeholder for your internal registry hostname (https://docs.docker.com/build/policies/examples.md, weight 0.16, weak backing).

## Digest pinning via isCanonical

Requiring images to be referenced by digest, not a mutable tag, is the immutability gate:

```rego
allow if {
    input.image.isCanonical
}
```

(source doc). The official validate-images doc documents the same requirement as "Require digest references": your policy can inspect image metadata, verify attestations, and enforce constraints before the build proceeds (https://docs.docker.com/build/policies/validate-images/, weight 0.92). `isCanonical` is true exactly when the Dockerfile named a digest, and the digest itself is then available in `input.image.checksum` (https://docs.docker.com/build/policies/inputs/, weight 0.93).

yubiOS uses this field as its digest-pinning rule: every FROM image must be canonical, which is what keeps builds reproducible against the exact bytes of a published image (source doc).

## Provenance gating

The provenance gate requires that the base image carries provenance attestations, optionally scoped to a trusted builder:

```rego
# Require provenance from GitHub Actions
allow if {
    input.image.hasProvenance
    input.image.provenance.builder.id == "https://github.com/actions/runner"
}
```

(source doc). `hasProvenance` is a documented `input.image` field (https://docs.docker.com/build/policies/inputs/, weight 0.93), and the validate-images doc treats attestation verification as a first-class policy capability (https://docs.docker.com/build/policies/validate-images/, weight 0.92).

For the supply-chain framing behind this rule, provenance attestations follow the SLSA provenance schema, version 0.2 by default with optional SLSA Provenance v1 (https://docs.docker.com/build/metadata/attestations/slsa-provenance/, weight 0.96). A build can only pass a provenance-requiring policy if the base image was produced by a builder that emitted attestations in the first place, which is why the rule and the builder configuration have to be designed together.

## Metadata-based constraints

Beyond registry and attestation checks, the input object exposes image metadata that supports version-constraint rules. The yubiOS note carries an example constraining the Go version of a base image:

```rego
allow if {
    semver.compare(input.image.metadata.go_version, "1.21.0") >= 0
}
```

(source doc). Treat this example with care: it came from the earlier research generation and the `metadata.go_version` path is not part of the documented field list on the input reference page (https://docs.docker.com/build/policies/inputs/, weight 0.93), which lists `labels`, `env`, and `signatures` among metadata surfaces but not a Go-version shortcut. Verify the exact metadata path with `docker buildx policy eval --print` before relying on it.

## Composing the rules

The yubiOS target policy composes the three gates above: the image must come from the `dhi.io/` registry, must be referenced by digest (`isCanonical`), and must carry provenance (source doc). Because allow rules are OR-ed in Rego, compose constraints inside a single `{ ... }` block so all three must hold, rather than as three separate allow rules where any one would suffice. The deny-by-default skeleton from the rego-semantics doc plus this composed block is the whole policy.

## What the allowlist does not cover

Registry prefix tests do not protect against a compromised image at an approved registry, which is why the digest and provenance gates exist alongside them; and none of these rules inspect the contents of the image for vulnerabilities, which is the post-build job of Docker Scout (https://docs.docker.com/scout/policy/, weight 0.80, see the ecosystem doc of this corpus).
