# 06 - Build-Time Enforcement: Docker Buildx Build Policies

Scope: enforcing provenance and digest discipline at build time with Docker Buildx Build Policies (OPA/Rego), as the source doc prescribes for yubiOS.

Ground spine: yubi-OS/yubiOS skills/slsa-provenance/SKILL.md (source doc).

## How Build Policies evaluate

Docker's official documentation states the mechanism: when you run `docker buildx build`, Buildx resolves all build inputs (images, Git repos, HTTP downloads), looks for a policy file matching your Dockerfile name (for example `Dockerfile.rego`), evaluates each input against the policy before the build starts, and allows the build to proceed only if all inputs pass [https://docs.docker.com/build/policies/, jev 0.54]. Policies are written in Rego, Open Policy Agent's policy language [https://docs.docker.com/build/policies/, jev 0.54].

The same docs describe `docker buildx policy eval` for testing whether a policy allows a specific source without running a full build, noting that it tests the source given as the argument and does not parse the Dockerfile to evaluate all inputs, which is what a real build with `--progress=plain` does [https://docs.docker.com/build/policies/usage/, jev 0.48, weak backing]. A debugging page exists for troubleshooting policy decisions [https://docs.docker.com/build/policies/debugging/, jev 0.36, weak backing].

One third-party writeup reports the feature landed in Buildx 0.31.0 [https://xor22h.dev/validating-docker-builds-with-rego-policies-because-it-works-on-my-machine-isnt-a-security-strategy/, jev 0.10, weak, version number not corroborated by an official page in this dig]. The source doc does not pin a Buildx version; treat the version claim as unverified here and rely on the policy behavior descriptions from docs.docker.com.

## The yubiOS policy

The source doc prescribes this Rego policy shape, with a `default allow := false` and two conditions that must each hold for `allow` to be true:

1. `input.image.hasProvenance` requires all FROM images to have SLSA provenance.
2. `input.image.isCanonical` requires canonical digests, no mutable tags.

with `decision := {"allow": allow}` as the output (source doc). The invocation form is:

```bash
docker buildx build --policy reset=true,strict=true,filename=$REPO.rego .
```

(source doc). The `strict=true` plus explicit `reset=true` pattern makes a missing or failed policy a hard denial rather than a silent pass, which is the build-time analogue of the hard-failure gate design in doc 04.

## What this contributes to L3

Build policies sit on the consumption side of provenance: the build refuses base images without provenance, which closes the loop on `resolvedDependencies` auditing (doc 03) and on the digest-pinning checklist item (doc 08). The source doc's checklist names `Dockerfile.rego` enforcing `isCanonical` plus `hasProvenance` on inputs as a required item (source doc).

## Gap note

The dig for this subtopic returned official Docker docs at moderate weight (0.54 primary, 0.48 and 0.36 weak) and only weak third-party corroboration. The official docs support the policy mechanics used here; the two `input` fields `hasProvenance` and `isCanonical` come from the source doc's policy, which also matches the `input.image` field family the official input reference describes at a high level. If the fields are ever rejected by a Buildx version, verify against the official input reference at docs.docker.com/build/policies before changing the policy.
