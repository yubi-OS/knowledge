# 03 - Single source of truth

**Scope.** Where the tools-tree pin lives: exactly one owner for the approved digest, avoiding a second pin location, and how the mkosi configuration relates to the ledger.

## The foundation: an immutable identifier to point at

Before any ledger question, the pin needs something immutable to point at. A Docker image digest is a unique, cryptographic identifier, a SHA-256 hash, representing the content of an image. Unlike tags, which can be reused or changed, a digest is immutable and ensures that the exact same image is pulled every time ([docs.docker.com/dhi/explore/security-concepts/digests/](https://docs.docker.com/dhi/explore/security-concepts/digests/), jev weight 0.79, authoritative). A pin file that stores digests therefore stores commitments, not hints.

## One owner, not two

Package-manager precedent shows the pattern clearly: opam repositories are the source of truth for what opam can and cannot install ([ocaml-explore.netlify.app/pages/opam/repositories-and-pinning/](https://ocaml-explore.netlify.app/pages/opam/repositories-and-pinning/), jev weight 0.66, authoritative). Translate that to image pinning: whatever file decides the approved tools tree is the source of truth, and everything else references it.

The yubiOS plan makes this explicit: PINNED.md remains the single owner of approved digests, and the tools-tree plan does not create a second pin location (yubiOS refs plan doc, source of this corpus). Where the pin lives, PINNED.md or the mkosi config, is a choice to make once, with exactly one source of truth (yubiOS refs plan doc). The practical reading: the mkosi config may be the mechanically binding location, but the ledger is the reviewed, human-auditable location, and one of them must be the owner with the other derived from it or explicitly recorded as the same thing.

## What mkosi itself owns

mkosi's own configuration surface for tools trees is well defined: tools trees, including default tools trees, can be customized via the ToolsTree* variables as well as the mkosi.tools.conf configuration file or directory ([mkosi/resources/man/mkosi.1.md](https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md), jev weight 0.91, authoritative). The Mkosi_Interpreter environment variable can be set when using the bin/mkosi shim to configure the Python interpreter used to execute mkosi ([github.com/marketplace/actions/setup-mkosi](https://github.com/marketplace/actions/setup-mkosi), jev weight 0.74, authoritative). These are mechanism locations. If mkosi.tools.conf carries the tools-tree source, the ledger entry in PINNED.md must agree with it, and the refresh workflow is what keeps them in sync.

## Keeping the ledger honest over time

Pin-update tooling illustrates the discipline the ledger needs. The pindock tool pins latest and untagged images to the version tag pointing at the same digest, preferring the most specific version, and its update mode never moves a version tag past the version that latest points to ([github.com/deadnews/pindock](https://github.com/deadnews/pindock/tree/main), jev weight 0.43, weak source). The rule embedded there, that an update must never overshoot what the maintainer reviewed, is exactly the invariant a single-owner pin ledger protects.

The general pinning literature frames the same point: dependency pinning is a deterministic dependency resolution policy that maps build-time references to immutable versioned artifacts for reproducible deployments ([devsecopsschool.com/blog/dependency-pinning/](https://devsecopsschool.com/blog/dependency-pinning/), jev weight 0.26, weak source).

## Failure modes when the truth is duplicated

The reason the yubiOS plan names the single-owner rule as a precondition is that duplicated pins drift. Two locations that both claim to hold the tools-tree version mean that a refresh can update one and forget the other, and the build then silently uses a different tool environment than the ledger claims. The yubiOS assumption set lists this explicitly: PINNED.md remains the single owner of approved digests, and no other workflow rewrites the tools-tree pin concurrently (yubiOS refs plan doc). Concurrency is part of the truth contract, not an afterthought.

## Bottom line

Pick one owner for the tools-tree digest, reference it from everywhere else, and let the refresh workflow (doc 04) be the only path that moves it.
