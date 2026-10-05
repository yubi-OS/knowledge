# 04 - Build context and state hygiene

Scope: keeping the build context and the build environment free of non-deterministic state, from .dockerignore context minimization to removing generated caches that differ between runs.

## The build context is an input

A container build sends the local filesystem context to the builder; Docker documents the build context and its variants, including building with files on the local filesystem while reading the Dockerfile from stdin (weight 0.79, https://docs.docker.com/build/concepts/context/). Everything in that context is an input to the build, and input variety is input nondeterminism. The yubiOS contract narrows this surface to a deliberate minimum: the .dockerignore admits only the production and dev Dockerfiles and their required tracked inputs, so that runner downloads and workspace debris cannot enter the image context (per the yubiOS refs doc on reproducible build contracts, 2026-07-22; not independently verified in this dig). The externally grounded version of the same rule: treat the context as part of the build environment and minimize it, because anything that enters the context can vary between two builds of the same commit.

The general build documentation reinforces that the context is a first-class concept with its own semantics and costs, distinct from the builder itself (weight 0.95, https://docs.docker.com/build/concepts/overview).

## Generated caches: the classic breaker

The best documented case is the ldconfig auxiliary cache. In the CIP isar-cip-core project, a reproducibility issue reported that the file /var/cache/ldconfig/aux-cache is not reproducible, with diffoscope used to check reproducibility of the built image (weight 0.70, https://gitlab.com/cip-project/cip-core/isar-cip-core/-/issues/35). The Arch Linux mkinitcpio tracker records the mechanism: if the /var/cache directory exists in the ramdisk, the aux-cache is triggered by the mkinitcpio ldconfig call, and removing that cache file restores reproducibility, because the file only speeds up rerunning ldconfig calls (weight 0.57, https://bugs.archlinux.org/task/73817.html).

Two lessons follow. First, any generated cache inside an image or initramfs is a nondeterminism source unless it is removed at finalize time. Second, the cache is functionally useless for the built artifact: it accelerates a build step that has already run, so deleting it costs nothing at runtime. The yubiOS installer contract applies exactly this at finalize time, removing the ldconfig auxiliary cache as a regenerable artifact before the root filesystem manifest is computed (per the yubiOS refs doc, 2026-07-22).

The problem is general across image ecosystems: the docker-library official-images project carries a reproducible builds issue discussing the class of problems (weight 0.48, https://github.com/docker-library/official-images/issues/16044). That weight is below 0.5, so treat it as weak backing for the claim that this is a recognized, ongoing ecosystem-level concern.

## Package manager state

Package managers generate state as they install: DNF cache, history, logs, and repository-counting state are named by the yubiOS contract as artifacts removed before the two-build proof runs (per the yubiOS refs doc, 2026-07-22). The reasoning is the same as for ldconfig: this state depends on the order and timing of operations during the build, varies between runs, and contributes nothing to the image's function. A verification gate that compares bytes will fail on such state unless the build explicitly removes it before producing the equality subject.

## Deterministic compilation flags

Compilation state also leaks into output. The yubiOS contract specifies Python bytecode compiled with single-worker checked-hash compilation and Rust debug paths remapped, so that pyc files and debug info do not embed build-machine specifics (per the yubiOS refs doc, 2026-07-22; not independently verified in this dig). The general principle, documented by the Reproducible Builds project's deterministic build systems guidance, is that a build cannot be reproducible if its inputs or intermediate state vary depending on factors that are hard or impossible to control (weight 0.95, https://reproducible-builds.org/docs/deterministic-build-systems/).

## The gate's role

Hygiene is only provable under a comparison. The yubiOS two-build proof runs its hygiene steps (context narrowing, cache removal, deterministic compilation flags) inside the same pinned engine and bake graph as CI, and the byte comparison then proves they were sufficient (per the yubiOS refs doc, 2026-07-22). For any new image subject, the practical sequence is: run the two-build gate, let the diff name the leaking state, remove or neutralize that state at finalize time, and repeat until the comparison is quiet. Each fix is cheap because the leaked artifact is, like aux-cache, usually something the artifact never needed.
