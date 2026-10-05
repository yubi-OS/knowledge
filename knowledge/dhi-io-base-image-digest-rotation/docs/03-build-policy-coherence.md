# Build policy coherence

Scope: Keeping an OPA/Rego Docker Build Policy coherent across a rotation: approved registries, canonical digest-pinned FROM, provenance requirements, and what denies the new pin.

## How the gate evaluates a rotation

Docker Build Policies are Rego files evaluated by Buildx before a build runs. The documented flow: when you run `docker buildx build`, Buildx resolves all build inputs (images, Git repos, HTTP downloads), looks for a policy file matching your Dockerfile name (for example Dockerfile.rego), evaluates each input against the policy before the build starts, and allows the build to proceed only if all inputs pass the policy [S1]. A rotation is therefore not gated by a post-hoc scan; the new digest is evaluated as an image input at build time, every time.

The evaluation is per-input, which is what makes rotation safe or fatal at the same gate. A policy written as a registry allowlist accepts the new pin automatically as long as the registry is unchanged; a policy that also checks canonical reference form or provenance evaluates the new digest on its own merits.

## The inputs a rotation touches

The policy's `input` object carries the fields a rotation must satisfy. The documented `input.local` rule appears in nearly every policy and allows local file access, which includes the build context and, importantly, the Dockerfile itself; without it Buildx cannot read the Dockerfile to start the build [S2]. Image inputs carry their own fields (registry, repository, reference form, provenance), which the policy template examples demonstrate [S3].

## What denies a rotated pin

A rotation fails the gate in three documented ways:

1. Registry not approved. The new digest resolves in a registry the policy does not allow. Community guidance on Rego build policies frames the ladder from "a simple registry allowlist" up to "full paranoid mode with pinned digests and signed tags", and notes these policies are declarative, testable, and integrate into existing build workflows [S4].
2. Reference form mismatch. If the policy requires digest-pinned canonical references, a pin written as a tag (or as a per-arch child where the policy expects the index) fails evaluation.
3. Provenance requirement unmet. If the policy checks provenance on image inputs, the new digest must carry the attestations the policy demands.

A policy-denied build fails loudly and must never be bypassed to complete a rotation; the correct move is to fix the input or amend the policy in a separate reviewed change. The yubiOS convention (per its own checklist) is that adding a registry to the approved list is itself a separate reviewed change, not a side effect of a rotation.

## Testing a policy change before it lands a pin

The usage documentation gives the exact test loop. `docker buildx policy eval` tests whether your policy allows a specific source without running a full build; the caveat is that `policy eval` tests the source specified as the argument and does not parse your Dockerfile to evaluate all inputs, so for whole-file evaluation you build with `--progress=plain` and watch the policy decisions [S5]. For rotation work this is the difference between "the digest passes" and "the build passes".

The examples documentation prescribes the working method for policy edits: copy the policy code into a Dockerfile.rego file next to your Dockerfile, customize any todo comments with your specific values, and test by running the build [S3].

## Coherence rules for the rotation itself

1. Rotate the pin and the policy understanding together: read the policy before resolving the digest, so the resolution targets the exact reference form the policy requires.
2. Prove the new digest passes with `policy eval` before the commit lands [S5].
3. Land the PINNED.md update and the consuming Containerfile change in the same change set so the two cannot drift.
4. If a policy amendment is needed (a new registry, a new provenance field), do it as its own reviewed change; never widen the policy silently inside a rotation commit.

## Sources

- [S1] https://docs.docker.com/build/policies/ (weight 0.96, authoritative)
- [S2] https://docs.docker.com/build/policies/intro/ (weight 0.86, authoritative)
- [S3] https://docs.docker.com/build/policies/examples/ (weight 0.92, authoritative)
- [S4] https://xor22h.dev/validating-docker-builds-with-rego-policies-because-it-works-on-my-machine-isnt-a-security-strategy/ (weight 0.69, authoritative)
- [S5] https://docs.docker.com/build/policies/usage/ (weight 0.87, authoritative)
