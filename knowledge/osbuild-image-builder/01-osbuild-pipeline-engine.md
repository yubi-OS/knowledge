# 01 - osbuild pipeline engine

Scope: how the osbuild engine executes an image build: stages, sources, manifests, runners, and the pipeline execution model underneath every frontend.

## The manifest-driven pipeline model

osbuild is, at its core, a pipeline processor. It reads instructions from a JSON file (the manifest) and executes them in order, transforming a filesystem tree at each step (https://osbuild.org/docs/developer-guide/projects/osbuild/manifest/, noul 0.92). The manifest is not written by hand in the normal flow: frontends produce it, and the osbuild binary is what actually performs the build (https://github.com/osbuild/image-builder, noul 0.94). This separation matters for reproducible image builders: the frontend owns intent (blueprint, distro, image type), the engine owns execution, and the manifest is the serialized contract between them.

The manifest format has sections that describe the steps of the pipeline to execute plus the external resources that must be made available to the pipeline execution (https://www.mankier.com/5/osbuild-manifest, weak backing, noul 0.36, a man-page mirror rather than the project's own docs).

## Stages

Stages are the unit of work inside a pipeline. The developer guide maintains a module catalogue of stages under the osbuild project (https://osbuild.org/docs/developer-guide/projects/osbuild/modules/stages/, noul 0.65). Each stage transforms the filesystem tree handed to it, and a manifest chains multiple stages into the build sequence implied by the manifest model above (https://osbuild.org/docs/developer-guide/projects/osbuild/manifest/, noul 0.92).

## Sources and caching

Every osbuild run uses a cache for downloaded files (sources) and, optionally, checkpoints of artifacts built by stages and pipelines. By default this cache is kept in `.osbuild` inside the working directory (https://github.com/osbuild/osbuild, noul 0.96; the same statement appears in the project's own developer guide at https://osbuild.org/docs/developer-guide/projects/osbuild/, noul 0.90). Checkpoints are the engine's incremental-build mechanism: a stage's output can be retained and reused across runs, which matters for CI loops that rebuild images repeatedly with small blueprint changes.

## Component layout and runners

The developer guide describes how the separate components of the osbuild organization communicate with each other (https://osbuild.org/docs/developer-guide/index/, noul 0.80). Runner modules reside in the runners/ directory of the codebase, and each runner is an executable script named after its target distribution, adapting stage execution to the distribution environment it runs in (https://deepwiki.com/osbuild/osbuild/4.6-runners, weak backing, noul 0.12, a third-party generated wiki rather than project documentation).

## Engine properties relevant to reproducible builds

Three engine properties matter when comparing osbuild as prior art for a reproducible image builder:

1. The manifest is a declarative, serializable artifact: the same manifest fed to the same osbuild version describes one build plan, which is the hook point for provenance and attestation of image builds (https://osbuild.org/docs/developer-guide/projects/osbuild/manifest/, noul 0.92).
2. Stage boundaries with checkpoints give deterministic cut points, so a partially cached build can be resumed without re-executing unchanged stages (https://github.com/osbuild/osbuild, noul 0.96).
3. The engine is deliberately frontend-agnostic: image-builder, osbuild-composer, and other frontends all lower their inputs into osbuild manifests and call the same binary (https://github.com/osbuild/image-builder, noul 0.94).

## yubiOS framing

For yubiOS, the engine layer is the part worth treating as reusable prior art: yubiOS's own build tooling would sit at the frontend layer, emitting manifests the engine executes, rather than reimplementing package installation, filesystem assembly, and disk image serialization per stage. The frontend-to-manifest-to-engine contract is also the natural place to anchor build provenance, because the manifest is the complete description of what the build will do.
