# Docker Build Policies: what they are and when they gate

Scope: what a Docker Build Policy is (an OPA Rego program evaluated by Buildx before any layer executes), how the evaluation loop works, and the version requirements you must meet to use the feature.

## The enforcement model

Docker Build Policies gate build inputs with OPA Rego. A policy inspects every input your build resolves, and on violation the build fails before any instruction runs. The docker/docs intro source states it directly: "Before running the build, Buildx evaluates your policies against these inputs. If any input violates a policy, the build fails before any instructions execute." (https://github.com/docker/docs/blob/main/content/manuals/build/policies/intro.md, weight 0.43, weak backing but consistent with the official docs mirror at https://docs.docker.com/build/policies/intro/, weight 0.97.)

This is a pre-build gate, not a runtime control. Nothing is pulled, cached, or executed until the policy passes. The yubiOS skill note phrases the same contract from the deny side: on deny, nothing is pulled or built (https://github.com/yubi-OS/yubiOS/blob/main/skills/docker-build-policy/SKILL.md, weight 0.40, weak backing).

## What Buildx actually does on each build

The official overview describes the loop: when you run `docker buildx build`, Buildx 1) resolves all build inputs (images, Git repos, HTTP downloads), 2) looks for a policy file matching your Dockerfile name (for example Dockerfile.rego), and 3) evaluates each input against the policy (https://docs.docker.com/build/policies/, weight 0.96).

Two properties of that loop matter for policy authors:

1. Policies see resolved inputs, not Dockerfile text. The input object mirrors what the Dockerfile references, so a policy is a function of the resolved image, Git repo, or HTTP source (https://docs.docker.com/build/policies/inputs/, weight 0.93).
2. Local contexts are inputs too. Nearly every policy starts with `allow if input.local`, which allows the build context (typically the current directory) and the Dockerfile itself; without that rule your own source would be denied (https://docs.docker.com/build/policies/intro/, weight 0.97).

## The language and the engine

Policies are written in Rego, Open Policy Agent's declarative language. OPA is purpose built for policy evaluation and uses Rego to reason about structured data such as API requests, infrastructure-as-code files, and configuration data (https://www.openpolicyagent.org/docs/policy-language, weight 0.92). In the buildx case the "structured data" is the build input object and the enforcement point is Buildx itself, which calls the policy before pulling or building.

## Version requirements

The official usage page states the prerequisites as Buildx 0.31.0 or later (check with `docker buildx version`) and BuildKit 0.26.0 or later (verify with `docker buildx inspect --bootstrap`), and notes that Docker Desktop users need a version that includes these updates (https://docs.docker.com/build/policies/usage/, weight 0.95). The yubiOS refresh note from 2026-07-23 confirms Buildx 0.31.0+ and also flags a doc inconsistency inside Docker's own pages: the policies overview says BuildKit 0.27.0+ while the usage page says 0.26.0+ (source doc, session/refs-mint/refs_corpus/docker-build-policies-reference-2026-07-23.md). Either floor is safely under the yubiOS pinned toolchain, so the mismatch does not block anything, but verify against the page you are reading before writing a minimum-version requirement.

Buildx's own repository documents the same pairing and warns that using an incompatible version of Docker may cause unexpected behavior, especially with builders running more recent BuildKit versions (https://github.com/docker/buildx, weight 0.88).

## Built-in source policy

Separate from user-authored Rego policies, Buildx ships a built-in source policy enabled with `Set Buildx_Default_Policy=1`. It verifies signed tags for images managed by Docker, including BuildKit builder images and Dockerfile frontends (https://docs.docker.com/reference/cli/docker/buildx, weight 0.81). This is a different mechanism from the `--policy` flag discussed in the rest of this corpus: it protects Docker-managed images out of the box, while a Rego policy covers every input in your own build.

## Experimental status

As of the 2026-07-23 refresh, Docker Build Policies are still documented as an experimental feature (source doc, session/refs-mint/refs_corpus/docker-build-policies-reference-2026-07-23.md). Treat the CLI surface as subject to change and pin your Buildx version in CI.

## Why this ordering matters

Because the gate runs before any layer executes, a policy violation fails fast and produces no partial cache state from the violating input. That is the property that makes build policies a supply-chain control rather than a post-hoc audit: a FROM image that fails the registry, digest, or provenance rules never enters the build, so no artifact with a non-compliant base image can be produced. The complement, checking images after they are built, is covered by Docker Scout and is described in the ecosystem doc of this corpus.
