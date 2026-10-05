# 03 - The build-time policy gate: verifying a digest bump in yubiOS.rego

Scope: how build-time digest verification works through an OPA/Rego build policy inherited from a bake file, and how to confirm a bump's expected pass or fail instead of a silent break.

## Where the gate lives

The yubiOS build policy (`yubiOS.rego`, configured with `target.policy` set to `reset=true, strict=true`) is inherited from `yubiOS-bake.hcl`, so every buildx invocation built through the bake file evaluates the policy against its build inputs before any layer executes (yubiOS refs: digest-bump-checklist-2026-07-25.md). This is Docker's Build Policies mechanism: when you run `docker buildx build`, Buildx resolves all build inputs (images, git repos, HTTP downloads), looks for a policy file matching the build definition, and evaluates each input against it (https://docs.docker.com/build/policies/, jev weight 0.80).

The mechanics are specific: for a Dockerfile build, Buildx looks for `Dockerfile.rego` in the same directory; for `app.Dockerfile` it looks for `app.Dockerfile.rego` (https://docs.docker.com/build/policies/usage, jev weight 0.94). A bake file uses the `target.policy` field to point a target at its policy file, which is the inheritance path yubiOS uses. When multiple policies are attached, all must pass for the build to succeed.

## What the policy evaluates

The policy input object exposes what Buildx resolved for the build: `input.local` covers local file access including the build context and the Dockerfile itself, and it is the rule you will see allowed in nearly every policy because without it the build context itself is unreachable (https://docs.docker.com/build/policies/intro/, jev weight 0.94). Image inputs carry their resolved reference, whether the reference is canonical, and whether the image has provenance, which is exactly the surface a digest-pinning policy needs: reject non-canonical refs, reject mutable tags, and require the pinned digest.

Buildx also ships built-in functions beyond Rego's own, including Docker-specific operations for loading local files, verifying git signatures, and pinning image digests inside policy logic (https://docs.docker.com/build/policies/built-ins/, jev weight 0.77; the same content on GitHub: https://github.com/docker/docs/blob/main/content/manuals/build/policies/built-ins.md, jev weight 0.91).

## Fail-closed is the designed behavior

The yubiOS checklist phrase for this is "a bump that isn't policy-approved will fail closed, which is correct behavior, but confirm it's *expected* pass/fail, not a silent break" (yubiOS refs: digest-bump-checklist-2026-07-25.md). The distinction matters operationally. A fail-closed build is a signal; the reviewer's job is to read it correctly:

- A pass means the new digest is in the approved set and every input resolved cleanly. Expected for a same-registry bump of a tracked base image.
- A fail with a policy reason naming the registry or the digest means the bump is out of policy: either the registry is new (fix: update the approved-registry list in `yubiOS.rego` in the same PR) or the reference is mutable (fix: re-pin to a commit SHA or digest, never a tag).
- A fail with no policy reason points at a different gate, such as a checksum mismatch on a downloaded payload.

The failure mode the checklist guards against is the third kind of outcome: the bump lands, CI stays red for an unrelated-seeming reason, and someone "fixes" it by loosening the policy rather than updating the pin correctly. A community walkthrough of Rego-based build validation makes the same point from the operator's side: a green pipeline is not a security strategy if the policy was edited to make it green (weak backing, practitioner blog: https://xor22h.dev/validating-docker-builds-with-rego-policies-because-it-works-on-my-machine-isnt-a-security-strategy/, jev weight 0.77).

## The conditional step: new registries

Same-registry bumps do not require policy edits. A bump that introduces a registry not in the approved list does, and the yubiOS policy section calls this out explicitly as conditional rather than mandatory (yubiOS refs: digest-bump-checklist-2026-07-25.md). The approved-registry pattern itself is standard: deny by default and allowlist the registries whose images may enter the build, a pattern visible in reference implementations of `approved-registries.rego` policies (weak backing, personal project example: https://github.com/ThaneeshAadithya/eks-security-hardening/blob/main/opa/policies/approved-registries.rego, jev weight 0.47).

## Confirming the outcome, not assuming it

The practical procedure for a bumper:

1. Open the bump PR with the new index digest, consumer reference updates, and any needed policy edit in one change.
2. Let CI build once. Read the policy verdict, not just the exit code.
3. If the verdict is a policy denial, decide which of the three cases above it is and fix the pin, not the policy, unless the registry genuinely needs allowlisting.
4. Record the expected verdict in the PR description so a reviewer can confirm that what CI showed is what the bumper intended.

This turns the policy gate from an obstacle into the verification step it is designed to be: the gate is the mechanism that proves the bumped digest is the one the repo's policy says is allowed to build.
