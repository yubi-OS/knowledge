# Build policies in bake: one fail-closed contract for every target

Scope: the `target.policy` attribute, the policy flags (`filename`, `reset`, `strict`, `disabled`, `log-level`), automatic `Dockerfile.rego` loading, and how a shared inherited policy target makes every exported build obey one OPA/Rego contract.

Docker's build policy feature validates build inputs with OPA/Rego rules before a build runs. The bake integration is a first-class target attribute: `target.policy` is a list where each entry uses the same keys as the `--policy` flag for `docker buildx build`: `filename`, `reset`, `disabled`, `strict`, and `log-level` ([bake-reference.md, w 0.96](https://github.com/docker/buildx/blob/master/docs/bake-reference.md); [Bake file reference, w 0.96](https://docs.docker.com/build/bake/reference/)).

## Automatic loading and manual overrides

By default, when Buildx builds with a `Dockerfile`, it looks for a `Dockerfile.rego` in the same directory; for `app.Dockerfile` it looks for `app.Dockerfile.rego`. Manual policies compose with the automatic one: `--policy filename=extra-checks.rego` adds a policy that must pass in addition to `Dockerfile.rego`. Passing `reset=true` switches to the specified policies only, dropping the automatic policy, as in `--policy reset=true,filename=strict.rego` ([Using build policies, w 0.72](https://docs.docker.com/build/policies/usage)). The same page's bake section states that `target.policy` entries are added in addition to the automatic `Dockerfile.rego` if it exists, which is exactly the behavior `reset=true` exists to override.

The bake CLI also carries a global `--policy` flag for policy evaluation options in the form `[disabled=true|false][,strict=true|false][,log-level=level]`, so policy evaluation can be tuned for a whole invocation rather than per target ([docker buildx bake, w 0.96](https://docs.docker.com/reference/cli/docker/buildx/bake/); [buildx_bake.md, w 0.94](https://github.com/docker/buildx/blob/master/docs/reference/buildx_bake.md)).

## Why reset and strict matter for consolidation

The yubiOS design pins one policy contract for the entire consolidated file through a shared inherited target ([yubiOS source doc, refs/docker-bake-consolidation-2026-07-17.md]):

```hcl
target "_policy" {
  policy = [{
    filename = "yubiOS.rego"
    reset    = true
    strict   = true
  }]
}
```

`reset=true` prevents accidental automatic-policy composition from changing the contract: without it, any `Dockerfile.rego` that happens to sit next to a target's Dockerfile would silently join the evaluation set ([Using build policies, w 0.72](https://docs.docker.com/build/policies/usage)). `strict=true` makes the build fail if the builder cannot evaluate the selected policy, so a builder that predates or lacks policy support cannot quietly degrade the gate into a no-op ([yubiOS source doc, refs/docker-bake-consolidation-2026-07-17.md]). Together the two flags make the contract fail-closed: an environment that cannot enforce the policy does not build at all.

Because `_policy` is inherited by every exported or verification target, no individual workflow has to remember a separate policy flag, and a reviewer diffing the bake file sees the policy relationship in one place. The yubiOS static validation pass checked the pinned Buildx v0.35.0 `bake --print` output on all resolved targets for `Reset: true`, `Strict: true`, and `yubiOS.rego`, confirming inheritance actually propagated the policy block ([yubiOS source doc, refs/docker-bake-consolidation-2026-07-17.md]).

## Practical caveats

The official policy pages weigh as primary sources in this corpus ([Using build policies, w 0.72](https://docs.docker.com/build/policies/usage)), but the broader policy documentation set scored lower in source quality assessment ([Validating build inputs with policies, w 0.25, weak backing](https://docs.docker.com/build/policies/)), so claims beyond the documented attribute keys and loading behavior above should be verified against `bake --print` output on your pinned Buildx version before relying on them. Third-party walkthroughs of rego-based build validation exist but carry weak backing ([Validating Docker Builds with .rego Policies, w 0.18, weak backing](https://xor22h.dev/validating-docker-builds-with-rego-policies-because-it-works-on-my-machine/)).

For supply-chain context, policies are one layer of a build-input gate; provenance attestations and signed images are separate layers (see SLSA and cosign practice in the yubiOS skill set). What the bake policy attribute adds to consolidation is structural: the gate moves from per-workflow flags (easy to forget, easy to drift) to a single inherited attribute in the file every workflow consumes.
