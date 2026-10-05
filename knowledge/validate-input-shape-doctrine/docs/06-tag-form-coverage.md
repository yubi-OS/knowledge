# Image Tag Form Coverage: The Registry as a Cross-Workflow Contract

Scope: why the set of tags a build workflow pushes must cover every tag form a dispatcher will request, the tag forms in scope, and how metadata-action tag emission is audited.

## The contract

Build workflows push tags to the registry. Dispatchers reference those tags in later steps (podman pull, docker pull). The contract is therefore cross-workflow: the set of tags pushed must be a superset of the set of tag forms dispatchers will request. If a dispatcher requests a form the build never pushed, the pull fails with `manifest unknown` at runtime, after the build pipeline has already spent its minutes.

Tag management in GitHub Actions workflows is commonly delegated to docker/metadata-action, which extracts metadata (tags, labels) from Git references and GitHub events for use with build-push actions (https://github.com/marketplace/actions/docker-metadata-action, jev weight 0.84, high; https://docs.docker.com/build/ci/github-actions/manage-tags-labels/, jev weight 0.93, high). A dedicated tagging step or metadata-action configuration is exactly where the push set is decided, which is why the validator audits that step's tag emission.

## The failure

The yubiOS incident (source doc Row 5): dispatches of `ci_test-vgpu-vm` at `d2646452` (2026-07-30, three dispatches within 60 seconds producing race duplicates) failed at the podman pull step with `Error: unable to copy from source docker://0mniteck/yubios:dev-d2646452: manifest unknown`. The merge-manifest step in `ci_dev_image.yml` pushed `:dev-<full-sha>` (40 chars) and floating `:dev`, but not `:dev-<short-sha>` (8-char prefix), which is the form dispatchers naturally use. The fix (`95565a0e`, user-supplied reference, not independently re-verified by API call) pushes the short form in addition. The failure description is grounded in RECENT_ACTIVITY line 473 (source doc evidence).

The runtime error is generic registry behavior: requesting a tag whose manifest is absent from the registry yields `manifest unknown` (weak dig backing, jev weight 0.07, https://stackoverflow.com/questions/41810104/docker-manifest-unknown-manifest-unknown). The point of the doctrine is that this failure class should be caught statically, at PR time, by comparing the emitted tag set against the in-scope form set, not at pull time on a burned VM test.

## Tag forms in scope

The in-scope set at spec time (source doc Rule 7):

- `:dev` (floating, latest dev build)
- `:dev-<full-sha>` (40-char full git SHA)
- `:dev-<short-sha>` (8-char prefix, the dispatcher's natural form)
- `:latest` (floating, latest main build)
- `:<commit-sha>` (full SHA, immutable)
- `:firmware` (ARM64 secure-world bundle)
- `:firmware-<sha>` (immutable firmware tag)
- `:installer` (mkosi disk image)

The immutability/floating distinction matters: floating tags (`:dev`, `:latest`) move, SHA tags are immutable anchors. Tagging strategies that mix both forms are the norm for CI-driven registries; a strategy without versioning discipline creates rollback and drift problems (weak backing, jev weight 0.54, https://openllm.wavise.com/blog/docker-image-registry-tagging-workflow; the Docker Docs tagging workflow is the stronger anchor at jev weight 0.93, https://docs.docker.com/build/ci/github-actions/manage-tags-labels/).

## Enforcement and the drift risk

The validator's Rule 7 check (`tag_set_check.py`) finds the tag-emission step in each configured build workflow, extracts the forms it emits, and reports an error for every in-scope form not covered. The check is a superset assertion, so adding a new in-scope form (a future `:release-<version>`, for example) immediately flags workflows that do not emit it.

Two structural risks the doctrine names:

1. **The in-scope list needs a home.** New tag forms enter scope over time; the proposal is a maintainer-edited `tag_scope.yml` in the action directory rather than a hardcoded list (source doc open question 4).
2. **Static extraction can miss dynamic tag logic.** A metadata-action step emits forms declaratively and is easy to parse; a shell script that interpolates tag names is harder. The validator errs toward false positives.

A registry-level reconciliation (querying the actual registry for tag inventory and asserting it matches scope) is the deferred Phase 4: it requires registry API credentials and catches push-workflow bugs at the registry layer, but is out of scope for the static gate.
