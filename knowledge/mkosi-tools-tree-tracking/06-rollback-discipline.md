# 06 - Rollback discipline

**Scope.** Rolling back a tools-tree change by reverting the pin: never hand-editing a built image, atomic revert semantics, and treating a mkosi upgrade like a base-image bump.

## The rule

The yubiOS plan states the rule plainly: roll back by reverting the pin, never by hand-editing a built image, and treat a mkosi upgrade like a base-image bump: gated, pinned, and rolled back atomically (yubiOS refs plan doc, source of this corpus).

## Why the rollback axis is the pin, not the artifact

The strongest source in this dig makes the distinction explicit for container systems: container structure, Dockerfiles and tool inventory, rolls back through source, meaning revert and re-release. Tool versions float at build time within pin constraints, so a bad leading-edge release is not fixed by a source rebuild, which would merely re-float the same broken version; the correct recovery is at the artifact-reference level, repointing to the last good artifact ([vergil-project.github.io/vergil-containers/dev/operations/rollback/](https://vergil-project.github.io/vergil-containers/dev/operations/rollback/), jev weight 0.62, authoritative). Applied to the tools tree: the tools-tree version is a build-time floating quantity within the pin's constraint, so recovering from a bad tools tree means moving the reference back, not patching a built image by hand.

## Why hand-editing fails

Reproducible builds are a set of software development practices that create an independently-verifiable path from source to binary code ([reproducible-builds.org/](https://reproducible-builds.org/), jev weight 0.71, authoritative). A hand-edited image breaks that path: there is no source state that produces the edited artifact. The weak-source literature catalogs why builds diverge in the first place, timestamps embedded in image layers, non-deterministic package manager ordering, floating base image tags, and build-tool metadata, all contributing to different image digests from identical inputs ([www.systemshardening.com/articles/cicd/reproducible-builds/](https://www.systemshardening.com/articles/cicd/reproducible-builds/), jev weight 0.43, weak source), and states the goal as eliminating external, non-deterministic factors so that the same source into the same build toolchain yields the same output, byte for byte ([adhdecode.com/devops/artifact-management/reproducible-builds/](https://adhdecode.com/devops/artifact-management/reproducible-builds/), jev weight 0.24, weak source). Hand-editing reintroduces exactly the class of untracked state that pinning exists to remove.

## Atomic revert semantics

Git revert has a specific meaning: create a commit with the reverse patch to cancel a change out, without rewriting any history ([stackoverflow.com/questions/4114095/how-do-i-revert-a-git-repository-to-a-previous-commit](https://stackoverflow.com/questions/4114095/how-do-i-revert-a-git-repository-to-a-previous-commit), jev weight 0.36, weak source). That is the right mechanism for step 5 of the yubiOS refresh checklist: because the refresh moves the pin in one commit (yubiOS refs plan doc), the rollback is one revert commit restoring both the ledger entry and the old and new digests recorded in the message (yubiOS refs plan doc). Atomicity comes from the one-commit rule: there is never a state where the ledger says one digest and the build config says another.

## The parallel with base images

The plan's analogy is deliberate: treat a mkosi upgrade like a base-image bump (yubiOS refs plan doc). Base images are pinned, refreshed through the standard workflow, and rolled back by re-pointing the reference; doc 04 gives the refresh side and this doc the revert side. The tools tree, as a second base image inside the build pipeline, inherits both.

## Bottom line

The pin is the control point. A bad tools-tree refresh is undone by reverting one commit, which restores a state that the reproducible-builds path can still verify. Any edit applied directly to a built image is unverifiable by construction and is forbidden by the plan.
