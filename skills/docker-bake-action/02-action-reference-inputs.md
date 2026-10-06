# bake-action action reference: inputs and defaults

Scope: the `docker/bake-action@v5` step surface as the source doc pins it: the canonical YAML shape, the key inputs (`files`, `targets`, `push`, `load`, `set`, `provenance`, `sbom`, `source`), and the default-target behavior. Grounded in the source doc `yubi-OS/yubiOS skills/docker-bake-action/SKILL.md` plus weighted dig results.

## The canonical step

The source doc's action reference is the shape yubiOS workflows should copy:

```yaml
- uses: docker/bake-action@v5
  with:
    files: |
      ./docker-bake.hcl
      ${{ steps.meta.outputs.bake-file }}    # metadata-action integration
    targets: build                            # target in bake file; default: 'default' group
    push: ${{ github.event_name != 'pull_request' }}
    set: |
      *.cache-from=type=gha
      *.cache-to=type=gha,mode=max
```

Three details in that snippet carry the reference's real content (source doc):

1. `files` is a multi-line list, so a bake definition can be split across a repo-owned HCL file and a generated metadata file (the metadata-action bake-file output; see doc 04).
2. `targets` is optional and defaults to the `default` group in the bake file (source doc, Notes and Key inputs table).
3. `push` is conventionally wired to `github.event_name != 'pull_request'` so pull requests build without registry writes (source doc).

The upstream repository for the action is `docker/bake-action`, "GitHub Action to use Docker Buildx Bake as a CI step" (https://github.com/docker/bake-action, jev weight 0.96). That repo is the authoritative surface for the full input list; the source doc's table is the curated subset yubiOS actually uses.

## Key inputs (source doc table, annotated)

| Input | Source doc notes | Practical reading |
|---|---|---|
| `files` | Bake definition files (HCL, JSON, Compose YAML) | Multiple files merge into one bake definition; later files override earlier ones |
| `targets` | Space-separated target names; defaults to `default` group | Omit to build the group; name one target for a focused build |
| `push` | Push after build | Gate on event name to keep PR builds push-free |
| `load` | Load into local Docker | For workflows that test the image after building |
| `set` | Override any property: `target.key=value`; `*` = all targets | The escape hatch for cache, provenance, and arg injection (see doc 05) |
| `provenance` | SLSA provenance for all targets | Attestation input; pairs with `sbom` (see doc 08) |
| `sbom` | SBOM attestation for all targets | Generates the SBOM attestation alongside the build |
| `source` | Remote bake file URL | Point the action at a bake file hosted elsewhere (source doc Notes: a raw GitHub URL works) |

The `targets` default deserves emphasis because it is easy to misread: with `targets` unset, bake builds the `default` group, not "everything in the file" and not nothing. The source doc's example bake file makes `default` the group holding both `yubios` and `yubios-minimal` (source doc), so the two conventions reinforce each other: name the default group deliberately.

## What the action does not own

The source doc Notes carry two boundary statements:

- bake requires `docker/setup-buildx-action`, exactly like `build-push-action` (source doc). A bake step without a buildx builder configured fails; the setup step is a peer dependency of the workflow, not an input of the action.
- The bake file itself can be remote: the source doc gives `https://raw.githubusercontent.com/org/repo/main/docker-bake.hcl` as the `source`-style remote form (source doc). Docker's remote-definition documentation covers the same mechanism (https://docs.docker.com/build/bake/remote-definition/, jev weight 0.92), which means a shared org-level bake definition is a supported pattern, not a workaround.

## Version pinning

The source doc pins `docker/bake-action@v5` in both the action reference and the metadata-action integration example (source doc). Pin the major version tag the same way in yubiOS workflows; floating `@main` would let upstream input renames break the build silently.

## Reading order for a new contributor

1. Start with this reference for the step surface (source doc).
2. Follow doc 03 for authoring the `docker-bake.hcl` the step consumes.
3. Follow doc 04 when tags and labels should come from `metadata-action`.
4. Follow doc 05 for `set` overrides and cache, and doc 08 for provenance and SBOM inputs.

Primary sources: source doc (`yubi-OS/yubiOS skills/docker-bake-action/SKILL.md`); https://github.com/docker/bake-action (0.96); https://docs.docker.com/ (0.88); https://docs.docker.com/build/bake/remote-definition/ (0.92, remote `source` context).
