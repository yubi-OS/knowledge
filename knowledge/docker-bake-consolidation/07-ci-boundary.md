# The bake / GitHub Actions boundary

Scope: what a bake target can and cannot model, the per-workflow mapping of build lanes to bake targets, and the responsibilities that stay in the Actions layer after consolidation.

A bake target is a build invocation. A group invokes multiple build targets. That is the whole model: bake centralizes how Docker images get built, not how CI orchestrates anything around the builds. The yubiOS consolidation statement of scope is blunt about this ([yubiOS source doc, refs/docker-bake-consolidation-2026-07-17.md]): the GitHub workflow layer retains runner selection, Docker/Buildx installation and active-builder selection, source-tree commits, GitHub artifact transfer, multi-runner `imagetools` index assembly, mkosi host plumbing, Podman-backed bcvk transport, and `/dev/kvm` VM execution. None of these are Docker image-build configuration, so none of them belong in the bake file.

## What official material says about bake in Actions

Docker's own CI documentation treats bake as the build step inside a workflow, not as the workflow itself. The GitHub builder docs run `docker buildx bake` inside a job after the runner and builder are set up ([Bake with Docker GitHub Builder, w 0.78](https://docs.docker.com/build/ci/github-actions/github-builder/bake/)). The docker/bake-action repository exists precisely to wrap the invocation in an action step, with inputs for targets, files, push, and builder ([docker/bake-action, w 0.82](https://github.com/docker/bake-action); [Docker Buildx Bake action, w 0.52](https://github.com/marketplace/actions/docker-buildx-bake)). Bake does take on intra-build parallelism (`--jobs fail-fast` execution behavior for targets within a call) ([docker buildx bake, w 0.96](https://docs.docker.com/reference/cli/docker/buildx/bake/)), but cross-job scheduling, matrix runner selection, and artifact passing remain Actions concepts.

## The yubiOS lane-to-target map

The consolidation maps each orchestrated lane to a bake target or group, or explicitly to none ([yubiOS source doc, refs/docker-bake-consolidation-2026-07-17.md]):

| Lane | Bake target/group | What stays in Actions |
|---|---|---|
| fetch-dhi-manifest.yml | none | registry lookup, repo rewrite, commit, push (source mutation, not a build); recursive digest replacement updates the bake file |
| fetch-fedora-bootc-manifest.yml | none | same source-mutation boundary; refreshed pin consumed by Containerfile |
| ci_firmware-rk.yml | firmware | native/cross firmware compilation, QEMU evidence, artifact download, RK3588 TPL gate; pinned DHI container and user-scoped Buildx in every Stage 1 to 4 job |
| yubiOS-ci.yml | yubios-ci, yubios | native amd64/arm64 scheduling and final imagetools index assembly |
| ci_dev_image.yml | yubios-dev-ci, yubios-dev | native runner scheduling and final dev index assembly |
| ci_test-vm.yml | none | bcvk's Podman image store, DirectBoot SSH credential transport, KVM, FUSE, hardware-only exclusions are host evidence |
| ci_mkosi-installer.yml | installer | SoftHSM, /run, user namespaces, mkosi, UKI verification, payload preparation |
| ci_test_pq_tls_verify.yml | pq-tls-verify | GitHub keeps check advisory and callback semantics; bake owns the uncached live verification build |

Two boundary rules emerge from the map. First, source mutation is not a build: manifest-pinning workflows produce no image, so they get no target; instead their outputs (digest pins) feed back into the bake file, which the digests' recursive replacement updates. Second, host-evidence lanes are not builds either: firmware QEMU runs and VM tests produce evidence and artifacts, not images, so they stay in Actions even when a nearby image target exists (the firmware lane builds the pinned-DHI container images through bake while the QEMU execution stays host-side).

The scope note also matters: the consolidation covers the chain `ci.yml` dispatches. The standalone legacy `ci_test-int.yml` workflow is not a state in that chain, so its independent firmware publication path was left unchanged ([yubiOS source doc, refs/docker-bake-consolidation-2026-07-17.md]). Community material on the bake-action's CI/CD workflow patterns supports the same shape of thinking, with weak-ish backing for specifics beyond the official repo ([CI/CD Workflows, w 0.56](https://deepwiki.com/docker/bake-action/5-cicd-workflows)).

The lesson generalizes: a consolidation succeeds when every lane is classified as build (goes to bake), source mutation (feeds the bake file), or host evidence (stays in Actions). Forcing the third class into bake targets is what produces fake targets and hidden assumptions.
