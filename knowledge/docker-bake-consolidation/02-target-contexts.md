# Named target contexts: builds consuming builds

Scope: `target.contexts` and the `target:<name>` named-context form, which lets one bake target consume another target's image directly, replacing registry-push and local-tag workarounds between an internal image and its consumer.

The `target.contexts` attribute adds additional build contexts to a target, the same as the `--build-context` flag on `docker buildx build`. It takes a map whose keys become named contexts referenceable inside the Dockerfile. Bake infers the context type from the value's shape, and the documented types include a container image (`docker-image://...`), a Git URL, an HTTP URL, a local directory, and a bake target written as `target:base` ([Bake file reference, w 0.96](https://docs.docker.com/build/bake/reference/); [Using Bake with additional contexts, w 0.92](https://docs.docker.com/build/bake/contexts/)).

The `target:<name>` form is the important one for consolidation: a build can depend on another build's result without either a registry round trip or a locally invented tag. The multi-context Dockerfile feature that underpins this shipped as a Docker blog announcement of "multiple build contexts" in Dockerfiles, the mechanism that named contexts ride on ([Dockerfiles now Support Multiple Build Contexts, w 0.82](https://www.docker.com/blog/dockerfiles-now-support-multiple-build-contexts/)).

## Why this removes the workaround layer

Before target contexts, a two-stage pipeline (build a base image, then build a dev image on top of it) had to connect the two stages through the registry (push then pull) or through a locally agreed tag (build, then `docker tag`/`--build-context` pointing at it). Both variants couple CI scripts and create drift between local and CI behavior. With `contexts = { base = "target:base-image" }`, the consumer target references the producer target by name, and Bake orders and wires them. The Docker docs use case is literally titled "Use another target as base" and also note a preference: regular multi-stage builds are preferable when a single Dockerfile can express the relationship; target contexts are for when multiple Dockerfiles cannot be easily merged ([Bake file reference, w 0.96](https://docs.docker.com/build/bake/reference/)).

The same page documents the `docker-image://` scheme for pinning a base image by digest inside `contexts`, which keeps third-party bases pinned without touching the Dockerfile ([Bake file reference, w 0.96](https://docs.docker.com/build/bake/reference/)).

## The yubiOS application

In the yubiOS consolidation, `Containerfile.dev` consumes the internal production image target directly through a `target:` context, removing the old classic-Docker local-tag workaround ([yubiOS source doc, refs/docker-bake-consolidation-2026-07-17.md]). The practical consequences are three:

1. The dev image always builds from the production image the same commit produced, not from whatever a `dev-` local tag happened to hold.
2. One less shell step exists in CI, because no job has to tag or export the intermediate image between targets.
3. The dependency is visible in the Bake file itself, so reviewers see the dev-depends-on-production edge in a diff instead of inferring it from workflow YAML.

## Composition notes

Named contexts compose with the rest of the model. A target can use a `target:` context and still inherit attributes from that same target via `inherits`, which is the distinction between "use your result as an input" (context) and "copy your attributes" (inheritance) ([Bake file reference, w 0.96](https://docs.docker.com/build/bake/reference/); [Inheritance in Bake, w 0.96](https://docs.docker.com/build/bake/inheritance/)). The Compose build specification exposes the equivalent concept for compose-based projects ([Compose Build Specification, w 0.64](https://docs.docker.com/reference/compose-file/build/)), so teams moving from compose-service builds to a single bake file do not lose named-context capability.

One caution from the docs: Bake automatically determines context type from the value pattern, so a bare path string is a local directory while `target:x` is a target reference; getting the form wrong silently changes semantics ([Bake file reference, w 0.96](https://docs.docker.com/build/bake/reference/)). Static validation of a consolidated file should therefore render resolved targets and confirm that each `target:` context resolved to an actual target name, which the yubiOS static pass does via `bake --print` on the resolved definition ([yubiOS source doc, refs/docker-bake-consolidation-2026-07-17.md]).
