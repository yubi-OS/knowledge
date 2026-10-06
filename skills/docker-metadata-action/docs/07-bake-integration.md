# 07. The bake-file output and docker/bake-action integration

Scope line: this doc explicates the bake-file output from the source doc's Outputs table and Notes, and how it hands metadata to docker/bake-action for multi-target builds.

## What bake-file is

The source doc's Outputs table defines `bake-file` as a "JSON bake file for docker/bake-action integration". A bake file is the declarative input format of Docker Buildx Bake: instead of one build-push step per target, a bake file describes a set of build targets, each with its own tags, labels, and build arguments, and bake executes them. The metadata action can therefore emit its computed tags and labels in exactly the format bake consumes, which moves the tags-and-labels projection from a step-outputs handoff into a build definition file.

The upstream README's bake section confirms the shape: it documents a "Bake target name (default docker-metadata-action)" and "Bake file definition path with annotations" (https://github.com/docker/metadata-action, jev 0.91). So the default bake target the metadata lands under is named after the action itself, and the bake file path carries annotations, not just tags and labels. The README also documents the env-var alternative: "each output is also exported as an environment variable when DOCKER_METADATA_SET_OUTPUT_ENV is true" (same source, jev 0.91), which is how a step that cannot consume a file directly still gets the metadata.

## Why multi-target builds want it

The source doc's Notes state the integration purpose directly: "The bake-file output integrates with docker/bake-action for multi-target builds". In the yubiOS build landscape (see the docker-bake-action skill), the bake-action GitHub Action runs `docker buildx bake` against a bake definition, and multi-target builds are the case the source doc calls out: several images or platform variants built in one job. For a multi-target build, the single metadata step's output must be distributed across targets; the bake-file output is the mechanism that carries it, with the bake target namespacing which target receives which metadata.

The practical division of labor in a yubiOS multi-target workflow:

1. docker/setup-buildx-action prepares the builder (outside this corpus; see the docker-setup-buildx-action skill).
2. docker/metadata-action computes tags, labels, and the bake file, with `id: meta` (source doc).
3. docker/bake-action consumes the bake definition and executes the targets (see the docker-bake-action skill).

The metadata step stays the single source of tag truth; bake spreads it.

## When to use bake-file versus direct outputs

The choice between doc 04's direct wiring (`tags: ${{ steps.meta.outputs.tags }}`) and the bake-file output is a build-shape decision, not a metadata decision:

- Single target, one build-push step: direct outputs are simpler and are the canonical pattern in the source doc's usage section.
- Two or more build targets, or a matrix of platforms per target: the bake file keeps the tag scheme in one place rather than duplicating the metadata computation per target.
- Workflows that must hand metadata to a step that reads environment variables: enable `DOCKER_METADATA_SET_OUTPUT_ENV` per the upstream README (jev 0.91).

In all three cases the metadata rules themselves are unchanged; only the carrier changes. That is consistent with the scope boundary in doc 01: this skill computes the projection, it does not decide the build topology.

## Source quality notes

Backing: the action repository README (0.91) and the Docker docs domain (0.93). Docker's product pages (0.26 to 0.51) and GeeksforGeeks (0.11) were weighted low and carry no claims. This subtopic's dig was the thinnest of the seven: 6 results kept per query but only two results above the 0.5 line, and the bake-specific content comes overwhelmingly from the action's README. No redo was triggered because the README result is a primary source and its snippet covered the bake input, output path, and env-var mechanics needed here.
