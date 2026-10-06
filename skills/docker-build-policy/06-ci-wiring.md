# 06. Enabling the policy in CI

Scope: wiring the policy onto the yubiOS main build job in yubiOS-ci.yml, the exact build command, and how to read a policy denial from the CI log.

This is an internal-record subtopic, no dig: the CI wiring is yubiOS-internal configuration and the source doc is the only authoritative record for it (source doc: yubi-OS/yubiOS skills/docker-build-policy/SKILL.md).

## The build job and the command

The build job in yubiOS-ci.yml builds the OCI image. Wire the policy onto the buildx build command:

```sh
docker -H unix:///var/run/ducker.sock buildx build -f Containerfile \
  --policy reset=true,strict=true,filename=yubiOS.rego \
  --platform linux/${ARCH} --load -t yubios:ci-${ARCH} .
```

(source doc)

3 properties of this wiring are deliberate:

- The flag triple reset=true,strict=true,filename=yubiOS.rego matches the canonical invocation from doc 02: no inherited policy, no implicit allow, explicit file (source doc).
- The command targets a specific daemon socket, unix:///var/run/ducker.sock, so the policy runs in the same buildx that performs the actual pull and build; there is no separate policy-check step that could drift from the build itself (source doc).
- The policy is evaluated per platform build with --platform linux/${ARCH}, so every architecture yubiOS ships is gated, not just the native one (source doc).

## Expected pass condition

The Containerfile FROM is quay.io/fedora/fedora-bootc@sha256:..., which is an approved registry (quay.io/fedora/ prefix) and a canonical digest, so the policy allows the build (source doc). A green build therefore means every FROM image in the build passed both the registry allowlist and the digest-pinning check.

## Reading a policy denial

If the build denies, read the reason in the build log: it will name the offending ref and whether the problem is registry or pinning (source doc). The 2 deny reasons from the policy pattern (doc 04) are the entire diagnostic surface:

- "Image '<ref>' is not from an approved registry...": the fix is either adding the registry through the doc 05 change process, or the ref is wrong and should be corrected to an approved registry.
- "Image '<ref>' uses a mutable tag. Pin to a digest...": the fix is to pin the FROM to the digest recorded in PINNED.md.

The actionable-reason discipline is a source doc guardrail: deny reasons must name the ref and the fix, so a failing build log tells the next agent exactly what to pin (source doc).

## Version check inside CI

Before the policy can run at all, the CI buildx must support --policy. The source doc prescribes verifying with docker buildx build --help | grep -- --policy against the CI-installed static buildx, currently v0.35.0, and bumping the pinned release (recorded in PINNED.md) if the flag is absent, never silently dropping the flag (source doc). This check belongs in the CI maintenance path, not per build: the flag presence is a property of the installed binary, and doc 02 covers the bump procedure.
