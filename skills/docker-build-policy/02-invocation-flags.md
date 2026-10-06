# 02. Invocation: the --policy flag surface

Scope: the docker buildx build --policy syntax, the reset, strict and filename parameters, and the buildx version requirement that gates all of it.

## The invocation

The source doc invocation is:

```sh
docker buildx build --policy reset=true,strict=true,filename=yubiOS.rego .
```

(source doc: yubi-OS/yubiOS skills/docker-build-policy/SKILL.md)

Three parameters make up the yubiOS policy posture:

- reset=true: discard any inherited or default policy; evaluate only this file (source doc). The upstream usage docs show the same pattern for opting out of automatic policy loading: docker buildx build --policy reset=true,filename=strict.rego is documented as "build without automatic policy" (source: https://docs.docker.com/build/policies/usage.md, weight 0.55). This confirms reset=true is the documented mechanism for turning off discovery-based policy loading and evaluating exactly one file.
- strict=true: a missing or non-allow decision is a hard failure. There is no implicit allow: if the policy does not positively allow an input, the build fails (source doc). This is what prevents a partially written policy from becoming a permissive one.
- filename=: path to the .rego file. In the yubiOS repo this is the repo root yubiOS.rego (source doc).

## Version requirement

--policy is a recent buildx and BuildKit feature. Before relying on it, confirm the buildx in the target environment supports it: docker buildx build --help | grep -- --policy (source doc).

The yubiOS CI installs a static buildx, currently v0.35.0 (source doc). The discipline the source doc prescribes: verify the flag is present in that binary; if it is absent, either bump the pinned buildx release and record the new pin in PINNED.md, or run the policy via a buildx version that has the flag. Do NOT silently drop the flag to make a build pass (source doc). Dropping the flag does not fail the build; it removes the gate while the build still succeeds, which is the exact failure mode a supply-chain gate must never have.

The flag surface is still evolving upstream. The buildx repository carries a reference document for the policy subcommands (source: https://github.com/docker/buildx/blob/master/docs/reference/buildx_policy.md, weight 0.43, weak backing), and an open upstream issue tracks additional UX for rego source policies (source: https://github.com/docker/buildx/issues/3567, weight 0.49, weak backing). Both are weakly weighted signals that the flag syntax should be re-verified against the pinned buildx version at each bump, not assumed stable.

## Bake and other entry points

Upstream docs state that bake supports automatic policy loading just like docker buildx build (source: https://docs.docker.com/build/policies/usage/, weight 0.51). The source doc wires the policy only onto the CI build job's buildx command (see doc 06); if a bake target ever builds yubiOS images, the same reset, strict and filename posture should be applied there, because bake shares the same policy mechanism (source doc for the CI wiring; the bake fact from the dig).

## Reading a policy invocation in the wild

A correct yubiOS build invocation has all three properties: reset=true (no inherited policy), strict=true (no implicit allow), filename=yubiOS.rego (explicit file). An invocation missing any of them is either not gate-enforced or not deterministic. The debugging section of the Docker docs covers policy-related failures separately (source: https://docs.docker.com/build/policies/debugging/, weight 0.43, weak backing), and doc 07 covers testing the policy before any build runs.
