# Exporters as target properties: registry versus local outputs

Scope: bake `target.output` and exporter types (registry, docker, oci, local, tar), the `--push` and `--load` shorthand flags, and how one target can serve both CI (local Docker output) and publication (registry output).

Exporters are how a build's result leaves the builder. The overview documents the main types: the registry exporter (`type=registry`) pushes an image to a registry, the docker exporter (`type=docker`) loads an image into the Docker Engine image store, the OCI exporter writes an OCI layout tarball, and local and tar exporters write files ([Exporters overview, w 0.59](https://docs.docker.com/build/exporters/)). The image and registry exporter page details `type=registry` behavior and options ([Image and registry exporters, w 0.62](https://docs.docker.com/build/exporters/image-registry/)).

In a bake file, the exporter is a target property: `target.output` takes a list of output configurations equivalent to `--output` flags ([Bake file reference, w 0.96](https://docs.docker.com/build/bake/reference/); [bake-reference.md, w 0.96](https://github.com/docker/buildx/blob/master/docs/bake-reference.md)). The bake CLI adds two conditional shorthands: `--load` is shorthand for `--set=*.output=type=docker` and `--push` is shorthand for `--set=*.output=type=registry` ([docker buildx bake, w 0.96](https://docs.docker.com/reference/cli/docker/buildx/bake/)). Both are marked "Conditional" in the CLI reference, meaning they apply where the target's output is compatible with the override.

## The consolidation payoff

Because output is a per-target property rather than a property of the CI script, the same target definition can serve two purposes with different invocations:

- a CI job runs `docker buildx bake <target>` and gets local Docker output for immediate testing, or passes `--load` explicitly;
- a publication run invokes the same target with `--push`, converting the output to the registry exporter.

The yubiOS consolidation encodes this with a shared `_image-export` inherited target that preserves Docker output for local builds and registry output for explicit publication ([yubiOS source doc, refs/docker-bake-consolidation-2026-07-17.md]). Inheritance plus `--push`/`--load` shorthands means the publish decision lives in the invoking command, not in a forked target per environment. The static validation pass confirmed exactly this split: the resolved local configuration produced Docker outputs, and the `PUSH=true` rendered configuration produced registry outputs, for both amd64 and arm64 ([yubiOS source doc, refs/docker-bake-consolidation-2026-07-17.md]).

## Tags and multi-architecture limits

Exporter choice interacts with tags: `target.tags` names images and tags for the build ([Bake file reference, w 0.96](https://docs.docker.com/build/bake/reference/)), and the yubiOS invariants check that production tags remain `<sha>-<arch>` and dev tags remain `dev-<sha>-<arch>` per architecture, with the final multi-architecture manifest index assembled later by `imagetools` in GitHub Actions rather than in bake ([yubiOS source doc, refs/docker-bake-consolidation-2026-07-17.md]). This is a deliberate boundary: bake builds and exports per-platform images; cross-architecture index assembly stays in the workflow layer (see the ci-boundary doc in this corpus).

## Practical notes

- The docker exporter only works with the `docker` driver context (a Docker Engine store), while registry and OCI exporters work on any builder; the bake-action documentation for GitHub-hosted runners walks through this split ([Bake with Docker GitHub Builder, w 0.78](https://docs.docker.com/build/ci/github-actions/github-builder/bake/)).
- Local outputs can delete stale files when `mode=delete` is set, but that requires granting `--allow=buildx.local.delete` at invocation ([docker buildx bake, w 0.96](https://docs.docker.com/reference/cli/docker/buildx/bake/); [bake-reference.md, w 0.96](https://github.com/docker/buildx/blob/master/docs/bake-reference.md)).
- The `docker buildx bake` reference documents `--metadata-file` for writing build result metadata, which CI jobs commonly use to capture digests after a registry export ([docker buildx bake, w 0.96](https://docs.docker.com/reference/cli/docker/buildx/bake/)).

The general lesson for consolidation: exporter differences between CI environments are an invocation concern, not a definition concern. Once outputs live in the bake file, adding a publish lane is a new invocation of an existing target, not a new build script.

One more composition detail matters for inheritance-based designs. Output is on the documented override list: when multiple bake files merge, `target.output` is one of the attributes overridden by the last occurrence rather than merged ([Bake file reference, w 0.96](https://docs.docker.com/build/bake/reference/)). A single-file design avoids that ambiguity entirely, but it is why an inherited output contract should be defined once and deliberately, not overridden ad hoc in child targets ([yubiOS source doc, refs/docker-bake-consolidation-2026-07-17.md]).
