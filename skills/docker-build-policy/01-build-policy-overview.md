# 01. Build policy overview: the pre-build gate

Scope: what a Docker Build Policy is, when BuildKit evaluates it, what an allow or deny means for the build, and why yubiOS uses one as its supply-chain gate.

A Build Policy is an OPA/Rego program that BuildKit evaluates before a build runs. It inspects each build input, most importantly the FROM images a Containerfile references, and returns an allow or deny decision. On deny, nothing is pulled and nothing is built: the build fails immediately with the policy's own reason string (source doc: yubi-OS/yubiOS skills/docker-build-policy/SKILL.md).

The upstream Docker documentation describes the same evaluation model from the outside: when you run docker buildx build, Buildx resolves all build inputs (images, Git repos, HTTP downloads), looks for a policy file, evaluates each input against the policy before the build starts, and allows the build to proceed only if all inputs pass the policy. Policies are written in Rego, the Open Policy Agent policy language (source: https://docs.docker.com/build/policies/, weight 0.73).

## Discovery: explicit file versus automatic discovery

One detail the source doc does not state is how the policy file is found. The Docker docs describe automatic discovery: Buildx looks for a policy file matching the Dockerfile name, for example Dockerfile.rego (source: https://docs.docker.com/build/policies/, weight 0.73). The yubiOS skill instead always passes filename=yubiOS.rego together with reset=true, which makes the evaluated file explicit and deterministic rather than discovery based (source doc). Treat this as a deliberate hardening of the upstream default, not a contradiction of it. The same docs page lists policies as a Buildx feature evaluated before the build starts, which matches the source doc's framing exactly (source: https://docs.docker.com/build/policies/, weight 0.73).

## What deny means

The deny semantics are the point of the gate. Upstream: the build proceeds only if all inputs pass the policy (source: https://docs.docker.com/build/policies/, weight 0.73). Source doc: on deny nothing is pulled or built, and the failure message is the policy's reason, not a generic error. This is what makes the policy a supply-chain gate rather than a linter: an unapproved or unpinned image never reaches the pull step, so a mutable tag can never be resolved and pulled during a yubiOS build (source doc).

## Why the gate exists

The yubiOS invariant the gate enforces: only approved registries, only digest-pinned (canonical) images (source doc). The threat this addresses is tag mutability: a tag like latest or 45 can be repointed to different bytes after publication, and several supply-chain incidents have exploited exactly that. A documented example is the Trivy supply-chain attack, where a mutable tag was the attack surface (source: https://www.vmfarms.com/blog/trivy-supply-chain/, weight 0.15, weak backing). Hardening guides reach the same conclusion, recommending digest pinning for container images (source: https://docs.ozarksecuritylabs.com/supply-chain/tier-2-hardened/container-image-digests/, weight 0.4, weak backing). The weak weights mean these are secondary sources, not primary advisories; the source doc's own rule (isCanonical required) is the authoritative statement for yubiOS.

## Where the policy sits relative to OPA

The policy language is Rego, Open Policy Agent's language. OPA is a general-purpose policy engine with official Docker images for deployment (source: https://www.openpolicyagent.org/docs/deploy/docker, weight 0.77). yubiOS does not run an OPA server for builds: the Rego program is evaluated directly by the buildx policy engine at build time (source doc). The OPA deployment docs matter only when you want a standalone OPA for other enforcement points; for build gating the buildx flag surface in doc 02 is the interface.

## The one rule nearly every policy needs

Upstream documents that allow if input.local appears in nearly every policy: it allows local file access, including the build context and, importantly, the Dockerfile itself. Without this rule Buildx cannot read the Dockerfile to start the build (source: https://docs.docker.com/build/policies/intro/, weight 0.51). The yubiOS policy carries exactly this rule (source doc), which is why pure local builds pass even though the gate exists for remote images. Doc 03 covers the input object in full.

## Pairing

The skill pairs with docker-buildx-rootless and rootless-container-builds, which cover how the build daemon and builder run (source doc). This skill covers what those builds are allowed to pull; the paired skills cover how the build executes.
