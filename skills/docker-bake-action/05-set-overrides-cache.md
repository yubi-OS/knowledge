# set overrides and cache: wildcard, per-target, and the gha backend

Scope: the `set` input as the override mechanism for bake targets: the `*` wildcard that applies to every target, per-target overrides, and the canonical cache configuration (`cache-from=type=gha`, `cache-to=type=gha,mode=max`) from the source doc, backed by Docker's override and cache documentation. Grounded in the source doc `yubi-OS/yubiOS skills/docker-bake-action/SKILL.md` plus weighted dig results.

## The source doc's canonical cache override

The source doc gives one snippet for applying cache configuration to all targets at once:

```yaml
set: |
  *.cache-from=type=gha
  *.cache-to=type=gha,mode=max
  *.provenance=mode=max
```

(source doc, Cache override). Three properties ride the `*` wildcard: cache import, cache export, and provenance mode. In a multi-target bake file this is the difference between writing 6 lines (2 per target) and 3 lines that survive the next variant being added.

## What `set` is

The source doc's Key inputs table defines `set` as "Override any property: `target.key=value`; `*` = all targets" (source doc). Docker's overriding-configurations documentation describes the same mechanism at the CLI level: `--set target.key=value` pairs that override bake target properties without editing the definition file (https://docs.docker.com/build/bake/overrides/, jev weight 0.94). The action's `set` input forwards exactly that syntax, one pair per line (source doc, Action reference).

Two scoping forms matter:

1. `*.key=value` applies to every target in the definition. The source doc uses this for cache and provenance because those should be uniform (source doc).
2. `target.key=value` applies to one named target. The source doc's Notes call out `yubios.platforms=linux/amd64` as the per-target override example (source doc). Use this when one variant needs a different platform list or a different build argument.

## The gha cache backend

The `type=gha` values in the source doc snippet select the GitHub Actions cache backend: build results are cached in the Actions cache service, keyed per workflow (https://docs.docker.com/build/cache/backends/gha/, jev weight 0.89). The `mode=max` on `cache-to` exports intermediate layers, not just the final image, which matters in multi-target builds because variants share layers and mode=max is what lets a later target hit the cache the earlier one warmed.

Practical consequences for yubiOS pipelines:

1. `*.cache-from=type=gha` should always pair with `*.cache-to=type=gha,mode=max`; importing without exporting means every PR starts cold (source doc pairing).
2. Provenance rides the same wildcard in the source doc snippet (`*.provenance=mode=max`), keeping attestation configuration consistent across variants rather than per-target drift (source doc; see doc 08).
3. The buildx bake CLI reference documents the full set of overridable properties at the command level (https://docs.docker.com/reference/cli/docker/buildx/bake.md, jev weight 0.89); when a property the source doc does not mention needs overriding, check that reference for the key name before guessing.

## Where set belongs in the workflow

The source doc positions `set` in the action reference itself as a top-level input on the bake step (source doc). That placement has a design consequence: overrides are a CI-workflow decision, not bake-file content. Structural truth (contexts, dockerfiles, labels) lives in `docker-bake.hcl`; environment-shaped values (cache backend, provenance mode, CI-specific args) live in the workflow's `set`. This split mirrors the declarative-policy framing the skill carries in yubiOS: the bake file is the build matrix as data, and `set` is the policy knob the pipeline turns per run (source doc, declarative policy coverage section).

## Anti-patterns

1. **Editing the bake file from CI** to inject cache config instead of using `set`. The override mechanism exists so the file stays stable (source doc, https://docs.docker.com/build/bake/overrides/, 0.94).
2. **Per-target cache config with copy-paste.** If you find yourself writing `yubios.cache-from`, `yubios-minimal.cache-from`, and so on, switch to `*` unless one target genuinely needs different cache behavior (source doc wildcard form).
3. **`mode=min` on `cache-to` in a multi-target build.** The source doc pins `mode=max` (source doc); min-mode caching undercuts the layer-sharing that makes bake multi-target builds cheap on the gha backend (https://docs.docker.com/build/cache/backends/gha/, 0.89).
4. **Assuming `set` validates keys.** A misspelled property key in `set` is silently ignored; verify overrides by reading the bake plan output in the build logs rather than trusting the YAML alone (derived from the `set` syntax definition in the source doc Key inputs table).

## Summary

`set` is the per-run override surface: `*` for uniform properties, target-name for exceptions, `type=gha` + `mode=max` as the canonical cache pair. The source doc's three-line cache snippet plus Docker's override and gha-cache pages cover the whole mechanism (source doc; https://docs.docker.com/build/bake/overrides/, 0.94; https://docs.docker.com/build/cache/backends/gha/, 0.89).

Primary sources: source doc (`yubi-OS/yubiOS skills/docker-bake-action/SKILL.md`); https://docs.docker.com/build/bake/overrides/ (0.94); https://docs.docker.com/build/cache/backends/gha/ (0.89); https://docs.docker.com/reference/cli/docker/buildx/bake.md (0.89).
