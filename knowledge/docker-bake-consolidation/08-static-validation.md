# Static validation of a consolidated bake file

Scope: proving a consolidated bake file correct before any build runs: `bake --print` resolution, build checks via `--call=check`, tag invariants, and workflow YAML reconciliation.

A single bake file concentrates risk: one syntax error or inheritance mistake now blocks every image variant at once. The mitigation is cheap because bake can render its entire resolved configuration without building anything. The `--print` flag on `docker buildx bake` "prints the options without building" ([docker buildx bake, w 0.96](https://docs.docker.com/reference/cli/docker/buildx/bake/)), emitting the fully resolved JSON for every target: inherited attributes flattened, variables substituted, contexts and outputs resolved. Combined with `--list=targets` and `--list=variables` for inventory ([Bake file reference, w 0.96](https://docs.docker.com/build/bake/reference/)), a CI job can validate the definition in seconds.

Beyond `--print`, the frontend-method flags perform semantic checks: `--call=check` (shorthand `--check`) evaluates build checks for the targets, and `--call=outline` displays build arguments and defaults ([docker buildx bake, w 0.96](https://docs.docker.com/reference/cli/docker/buildx/bake/); [bake-reference.md, w 0.96](https://github.com/docker/buildx/blob/master/docs/bake-reference.md)). The `--list` flag enumerates targets or variables, which turns the file's public surface into a diffable artifact for review ([docker buildx bake, w 0.96](https://docs.docker.com/reference/cli/docker/buildx/bake/)). Docker documents validating build configuration in CI as a first-class pattern ([Validating build configuration with GitHub Actions, w 0.70](https://docs.docker.com/build/ci/github-actions/checks/)).

## The yubiOS static pass

The yubiOS consolidation was validated statically before any runtime CI, and the checks are worth reproducing as a template ([yubiOS source doc, refs/docker-bake-consolidation-2026-07-17.md]):

1. Parsed every target and group with Docker Buildx v0.35.0, catching syntax and resolution errors.
2. Rendered both the local configuration and the `PUSH=true` configuration for amd64 and arm64, confirming the exporter split (Docker output locally, registry output on push).
3. Confirmed tag invariants: production tags remained `<sha>-<arch>` and dev tags remained `dev-<sha>-<arch>` per architecture, matching what the existing manifest-merge jobs expect.
4. Confirmed firmware compatibility tags stayed limited to the QEMU board target, with board-scoped tags distinct.
5. Confirmed the installer retained its `installer` and `installer-<sha>` tags.
6. Confirmed the shared `_image-export` inheritance preserved Docker output for local builds and registry output for explicit publication.
7. Reconciled the original branch through `main` commit `a95f185`, so firmware and installer stages matched the pinned DHI/user-scoped Buildx invocation pattern.
8. Parsed all edited workflow YAML and checked the patch for whitespace errors.

The policy contract was validated the same way: the pinned Buildx v0.35.0 `bake --print` output was checked on all resolved targets for `Reset: true`, `Strict: true`, and `yubiOS.rego` (see the build-policy doc in this corpus) ([yubiOS source doc, refs/docker-bake-consolidation-2026-07-17.md]).

## What static validation does not claim

The source doc is explicit about the epistemic limit: no image was published, and no KVM, QEMU firmware, mkosi, or live registry run is claimed by the static pass ([yubiOS source doc, refs/docker-bake-consolidation-2026-07-17.md]). Static validation proves the definition is coherent; runtime CI and registry publication remain PR validation gates. This is the honest split for any bake consolidation: `--print` catches structural regressions deterministically, while build-level behavior needs an actual run.

For teams adopting the pattern, the invariant checks (3 to 5 above) are the most valuable and the least automated: they encode the contract between the bake file and the downstream consumers (manifest merge jobs, registry tooling). Writing them as a CI step that greps `bake --print` output for expected tag patterns catches the class of drift where a refactor silently renames a tag and breaks the merge job two stages later.
