# 05. Build Policies: OPA/Rego for Docker Buildx

Scope: how Docker Build Policies gate every build input with an OPA/Rego policy before any build layer executes, the policy schema buildx consumes, the CLI flags, and how to debug a denied build.

## What policies gate and when

Docker's documentation describes the flow: when you run `docker buildx build`, Buildx resolves all build inputs (images, Git repos, HTTP downloads), looks for a policy file matching your Dockerfile name (for example Dockerfile.rego), evaluates each input against the policy before the build starts, and allows the build to proceed only if all inputs pass (https://docs.docker.com/build/policies/, jev weight 0.81). The gate therefore runs before any build layer executes, exactly as the source doc states: policies gate on attestations, digests, and registry allowlists before layer execution (source doc, yubi-OS/yubiOS skills/rootless-container-builds/SKILL.md).

One subtlety from the upstream docs is load-bearing for correctness: policies validate what Buildx resolves, not what you specify, and this works with Docker's automatic platform selection (https://docs.docker.com/build/policies/validate-images.md, jev weight 0.71). A policy test that only checks the literal string in the Dockerfile can pass while Buildx resolves a different variant; the policy sees the resolved input.

## The yubiOS policy shape

The source doc's Dockerfile.rego uses the `package docker` namespace with a deny-by-default rule and four allow rules:

```rego
package docker

default allow := false

# Allow images from the yubiOS registry only
allow if {
    startswith(input.image.ref, "dhi.io/")
}

# Require canonical digest reference (no mutable tags)
allow if {
    input.image.isCanonical
}

# Require SLSA provenance attestation
allow if {
    input.image.hasProvenance
}

# Allow local builds (no FROM)
allow if {
    input.local
}

decision := {"allow": allow}
```

(source doc). The schema maps directly to the input object the policy sees: `input.image.ref` is the resolved image reference, `input.image.isCanonical` marks a canonical digest reference, `input.image.hasProvenance` marks an SLSA provenance attestation, and `input.local` covers local builds with no FROM. Docker's own first example policy is the same shape in miniature: a policy that only allows the Alpine repository, created as a Dockerfile.rego in package docker (https://docs.docker.com/build/policies/validate-images/, jev weight 0.83).

The combination of rules is the supply-chain contract: an image must come from the approved registry AND be referenced by digest AND carry provenance. Failing any one denies the build, because default allow := false makes the policy closed-world.

## Applying and debugging

The source doc's apply command, from the AGENTS.md pattern:

```
docker buildx build --policy reset=true,strict=true,filename=$REPO.rego .
```

Debugging uses verbosity, not a separate evaluator: `--policy reset=true,log-level=debug,filename=$REPO.rego --progress=plain` to see deny reasons (source doc). The source doc is explicit about two non-existent paths: `docker buildx policy eval` does NOT exist, and `docker buildx bake --print` prints the resolved bake config, which is a different thing from policy evaluation (source doc). Treating bake --print output as a policy verdict is a debugging mistake the source doc pre-empts.

The policy mechanism ships as part of the Docker build tooling maintained under the Docker GitHub organization (https://github.com/docker, jev weight 0.70; https://docs.docker.com/, jev weight 0.87).

Weak-backing note: a community blog post on validating Docker builds with rego scored 0.17 under jev weighting and is not used here; the schema and evaluation flow rest on the official Docker documentation pages cited above plus the source doc.

## Why this belongs in the rootless stack

Rootless execution (docs 01 through 04) contains what a build can do to the host. Build Policies decide what the build is allowed to consume in the first place: no unvetted registries, no mutable tags, no unprovenanced base images. The two layers cover different halves of the same attack surface, and the source doc's hardening checklist requires the rego policy to enforce isCanonical plus hasProvenance as a standing item.
