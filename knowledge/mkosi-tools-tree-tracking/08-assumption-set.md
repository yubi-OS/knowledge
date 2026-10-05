# 08 - Assumption set

**Scope.** Caller obligations and environment dependencies the tools-tree pin silently relies on: build-host parity, every image-producing job consuming the same pin, registry availability and offline mirrors, and concurrency over the pin.

## The plan's own assumption list

The yubiOS plan names its caller obligations explicitly (yubiOS refs plan doc, source of this corpus):

- **Build-host environment:** mkosi must be runnable on the build host or in CI with privileges consistent with the rootless-container-builds convention; if the host mkosi changes underneath a pinned tools tree, builds can silently diverge.
- **Toolchain prerequisites:** the tools-tree pin is only meaningful if every image-producing job, local dev, CI, release, consumes the same pin; a job that ignores it produces images that are not comparable.
- **Registry availability:** resolving the tools-tree source requires network access to its registry at build time; offline builds need a cached or local mirror, and that mirror becomes part of the assumption set.
- **Preconditions:** PINNED.md remains the single owner of approved digests; the plan does not create a second pin location.
- **Concurrency:** no other workflow rewrites the tools-tree pin concurrently; refreshes go through the same review path as base-image bumps.

## Why host isolation matters: the hermeticity argument

The strongest source in this dig states the principle the tools tree implements. When given the same input source code and product configuration, a hermetic build system always returns the same output by isolating the build from changes to the host system. Hermetic builds are insensitive to libraries and other software installed on the local or remote host machine; they depend on specific versions of build tools, such as compilers ([bazel.build/basics/hermeticity](https://bazel.build/basics/hermeticity), jev weight 0.94, authoritative). The tools tree is mkosi's version of that isolation: the tool environment comes from a built, pinnable image, not from the host (doc 01). But isolation is only as good as its boundary: the host-side mkosi itself, and the privileges it runs with, sit outside the tools tree, which is why the plan calls host parity a caller obligation.

## The toolchain must be complete and available

The reproducible-builds.org guidance on building toolchains from source describes the shape the tools tree plays: an SDK that can be downloaded alongside the system images which contains everything that is needed to build, or rebuild, extra packages ([reproducible-builds.org/docs/build-toolchain-from-source/](https://reproducible-builds.org/docs/build-toolchain-from-source/), jev weight 0.85, authoritative). The "everything needed" is the operative phrase: a tools tree missing an optional build dependency falls back to host tooling, which is the divergence the pin exists to prevent (compare doc 02 on required host dependencies such as mtools and systemd-ukify).

Practitioner weak-source guidance converges on the same set: hermetic builds use sandboxing, pinned toolchains, and dependency pinning ([beefed.ai/en/hermetic-build-playbook](https://beefed.ai/en/hermetic-build-playbook), jev weight 0.22, weak source).

## Registry availability and offline mirrors

For air-gapped deployments, offline or disconnected environments must keep all features supported ([coder.com/docs/install/airgap](https://coder.com/docs/install/airgap), jev weight 0.76, authoritative). The container-specific weak-source evidence is blunt: air-gapped pulls fail without a local registry mirror, and mirroring plus signing the images is part of the setup ([www.netray.co/troubleshoot/air-gapped-container-registry-setup](https://www.netray.co/troubleshoot/air-gapped-container-registry-setup), jev weight 0.28, weak source), and mirror practices cover registry setup and image synchronization for offline clusters ([oneuptime.com/blog/post/2026-01-19-kubernetes-mirror-images-offline/view](https://oneuptime.com/blog/post/2026-01-19-kubernetes-mirror-images-offline/view), jev weight 0.19, weak source). The yubiOS conclusion follows: the local mirror of the tools-tree source becomes part of the assumption set, meaning it too should be recorded and refreshed like a pin.

## Concurrency over the pin

The plan's concurrency assumption, that no other workflow rewrites the tools-tree pin and refreshes go through the same review path as base-image bumps (yubiOS refs plan doc), is what keeps the single source of truth from doc 03 true over time. A refresh that bypasses review creates exactly the two-truths state the single-owner rule forbids.

## Bottom line

The pin is necessary but not sufficient. Host parity, universal pin consumption across all image-producing jobs, registry or mirror availability, and single-writer discipline over the pin are the 4 environmental obligations the tools-tree tracking plan silently relies on, and each one deserves to be checked when the pin is refreshed.
