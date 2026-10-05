# 02 - Deterministic OCI container image builds

Scope: the BuildKit and Buildx controls that make OCI image output deterministic, from SOURCE_DATE_EPOCH pass-through to timestamp clamping and fixed OCI metadata, and what a verification script must check to prove them.

## The engine-level control

BuildKit supports consuming the SOURCE_DATE_EPOCH value as a special build arg in the Dockerfile frontend since BuildKit 0.11. Its reproducibility documentation treats SOURCE_DATE_EPOCH as the convention for pinning timestamps to a specific value, and notes that any source type is supported, though how to pin a source depends on the type (weight 0.90, https://github.com/moby/buildkit/blob/master/docs/build-repro.md). For a build pipeline this is the entry point: the commit-derived epoch from the build identity layer flows into the builder as one argument, and everything downstream derives its determinism from it.

## What the epoch reaches in an image

Docker documents the reach of the variable for container builds: setting the environment variable for a build makes the timestamps in the image index, the image config, and file metadata reflect the specified Unix time (weight 0.94, https://docs.docker.com/build/ci/github-actions/reproducible-builds/). That is three separate surfaces: the multi-platform index manifest, the per-image config JSON, and the file metadata inside layers. A reproducibility contract has to care about all three, because an equality check that ignores any one of them will pass a build whose other surfaces drift.

## Timestamps inside layers

The specification's clamp rule applies to layer contents: tools rewrite timestamps more recent than SOURCE_DATE_EPOCH back to the epoch value, preserving source-based timestamps while omitting build-specific ones (weight 0.95, https://reproducible-builds.org/specs/source-date-epoch/). In image terms this means every file in every tar layer carries an mtime no newer than the commit time. The FOSDEM 2023 work on bit-for-bit reproducible Dockerfile builds identifies exactly the two timestamp surfaces that must be made deterministic: the timestamps of the files in tar layers, and the timestamps in the OCI Image Spec JSONs, including the org.opencontainers.image.created annotation (weight 0.88, https://archive.fosdem.org/2023/schedule/event/container_reproducible_dockerfile/attachments/slides/5574/export/events/attachments/container_reproducible_dockerfile/slides/5574/FOSDEM2023_Bit_for_bit_reproducible_builds_with_Dockerfile.pdf). Fixing the created annotation to the commit time is the OCI metadata half of the clamp.

## Supporting BuildKit features

Container-focused writeups confirm the mechanism in practice: Docker BuildKit supports the SOURCE_DATE_EPOCH environment variable, which overrides timestamps in the build process (weight 0.51, https://www.systemshardening.com/articles/cicd/reproducible-builds/). The strength of this claim is at the 0.5 boundary, so treat it as corroborating rather than load-bearing; the primary evidence is the BuildKit documentation above.

## Engine pinning as part of the contract

A build graph is only as deterministic as the engine that executes it. The yubiOS refs doc on reproducible build contracts describes pinning the Buildx client and the BuildKit daemon independently, with every docker-container builder naming its daemon image from a pinned digests document, verified by static workflow inspection plus buildx inspect --bootstrap during builds (per the yubiOS refs doc, 2026-07-22; not independently verified in this dig). The generalizable rule is that the builder image itself is an input, so it belongs in the same pinning regime as package sources.

## What the verification script checks

A script that proves this layer should verify, on the final build config and index, that the created annotation and timestamp fields equal the commit time, and that inherited history is only admitted when it is no newer than that epoch (per the yubiOS refs doc, 2026-07-22). The externally grounded version of the same idea: compare the produced index and config against the epoch rather than trusting the build log, because the timestamp surfaces are precisely where drift hides (weight 0.94, https://docs.docker.com/build/ci/github-actions/reproducible-builds/). The FOSDEM work adds the reason to automate this: both tar layer timestamps and OCI JSON timestamps must be controlled, and a single missed surface silently breaks bit-for-bit equality while everything else looks correct (weight 0.88, source above).

## Layer ordering and metadata

Layer ordering and fixed exporter settings matter as much as timestamps. The clamp rule keeps mtimes within the epoch, but deterministic output also requires stable file ordering, stable compression settings, and stable exporter options. The yubiOS contract fixes compression and exporter compatibility settings in the bake graph for this reason (per the yubiOS refs doc, 2026-07-22). Combined with the pinned engine and the epoch-driven timestamp surfaces, this is the complete control set a container image reproducibility gate needs before a byte comparison can be meaningful at all.
