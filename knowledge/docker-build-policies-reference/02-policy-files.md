# Policy files and the --policy flag

Scope: how Buildx finds and loads a policy file, the auto-load convention tied to the Dockerfile name, and the full behavior of the `--policy` flag options `filename=`, `reset=`, and `strict=`.

## Auto-load by Dockerfile name

Buildx automatically loads policies that match your Dockerfile name. When you build with `Dockerfile`, Buildx looks for `Dockerfile.rego` in the same directory; no additional configuration is needed for Buildx to find and load the policy (https://docs.docker.com/build/policies/usage, weight 0.97; directory layout also shown at https://docs.docker.com/build/policies.md, weight 0.31, weak backing).

The rule is name-mirroring, not suffix-appending: `app.Dockerfile` looks for `app.Dockerfile.rego`, not `app.rego`. The yubiOS refresh note from 2026-07-23 confirmed this convention against the docs (source doc, session/refs-mint/refs_corpus/docker-build-policies-reference-2026-07-23.md).

Bake inherits the same magic: `docker buildx bake` automatically loads `Dockerfile.rego` alongside each target's Dockerfile when present (https://github.com/docker/buildx/blob/master/docs/bake-reference.md, weight 0.82). Buildx issue 3567 records the additional detail that remote contexts also carry policy files: when building from a remote context, these files are loaded from the remote context just like the Dockerfile itself (https://github.com/docker/buildx/issues/3567, weight 0.30, weak backing).

## The --policy flag

The `--policy` flag takes comma-separated `key=value` pairs. The documented behaviors:

1. `filename=` specifies which policy file to load by providing the base Dockerfile name without the `.rego` extension. This is useful for testing sources against policies associated with different Dockerfiles (https://github.com/docker/docs/blob/main/content/manuals/build/policies/usage.md, weight 0.94). The CLI surface also supports `--policy filename=strict.rego` style naming of a specific file (source doc, session/refs-mint/refs_corpus/docker-build-policies-reference-2026-07-23.md).
2. `reset=true` ignores the auto-loaded policy and uses only the one you named. The canonical form is `docker buildx build --policy reset=true,filename=strict.rego .` (source doc, session/refs-mint/refs_corpus/docker-build-policies-reference-2026-07-23.md).
3. `strict=true` fails the build if policies are not loaded, for example if the BuildKit instance used by the build is too old and does not support them (https://matsuand.github.io/docker.docs-ja/docker.docs-ja/build/policies/usage/, weight 0.11, weak backing; consistent with the source doc's `--policy strict=true` example).

Without `reset=true`, an explicitly named policy is added alongside any auto-loaded one; with `reset=true`, the named policy replaces the auto-loaded set entirely. Without `strict=true`, a missing or unsupported policy silently degrades to no policy enforcement, which is exactly the failure mode you do not want in a supply-chain gate.

## The yubiOS convention and why it opts out of auto-load

yubiOS centralizes on a single `yubiOS.rego` per repository and invokes it explicitly:

```
docker buildx build --policy reset=true,strict=true,filename=$REPO.rego .
```

This is the live pin recorded in the yubiOS PINNED.md as of the 2026-07-23 refresh (source doc, session/refs-mint/refs_corpus/docker-build-policies-reference-2026-07-23.md). The 2026-07-23 note confirms the filename convention from the Docker docs and records the yubiOS judgment that auto-load-by-Dockerfile-name is still the wrong fit for a bake-file-driven multi-target build: a bake file can build many targets across many Dockerfiles, and per-Dockerfile auto-loaded policies would fragment one supply-chain rule into per-target rules (source doc). The deliberate opt-out is `reset=true` (kills auto-load) plus `strict=true` (no silent degrade) plus `filename=` (one canonical policy).

The same keys exist per bake target: each bake entry uses the same keys as the `--policy` flag for `docker buildx build` (`filename`, `reset`, `disabled`, `strict`, `log-level`), so a bake file can carry the policy config in-repo rather than depending on the CI command line (https://github.com/docker/buildx/blob/master/docs/bake-reference.md, weight 0.82).

## Practical rules of thumb

1. If you want convention-over-configuration for a single-Dockerfile repo, rely on auto-load and put the policy next to the Dockerfile (https://docs.docker.com/build/policies/usage, weight 0.97).
2. If you want one policy for the whole repo, or you build through bake files, set `reset=true,strict=true,filename=<policy>.rego` explicitly so the gate cannot silently disappear on a BuildKit upgrade mismatch (source doc).
3. Test policy changes with `docker buildx policy eval` before wiring them into CI, so a policy edit cannot break the build (https://docs.docker.com/build/policies/usage, weight 0.95).
