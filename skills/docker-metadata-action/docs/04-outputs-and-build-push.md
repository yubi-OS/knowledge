# 04. Outputs and the build-push-action wiring

Scope line: this doc explicates the source doc's "Outputs" table and its "Usage with build-push-action" section: the five outputs, their formats, and how a build step consumes them.

## The five outputs

The source doc's Outputs table:

| Output | Description |
|---|---|
| `tags` | Newline-separated tag list |
| `labels` | Newline-separated OCI label list |
| `version` | Extracted version string |
| `bake-file` | JSON bake file for `docker/bake-action` integration |
| `json` | Full JSON metadata |

The upstream README elaborates on the JSON output: "The json output is a JSON object composed of the generated tags and labels so that you can reuse them further in your workflow using the fromJSON function" (https://github.com/docker/metadata-action, jev 0.92). So `json` is not a log artifact, it is a structured payload a later step can index into with GitHub Actions expressions when the two newline-joined outputs are not enough. The `bake-file` output is covered in full in doc 07; it exists so the same metadata can drive a multi-target bake build instead of a single build-push step.

The `version` output is the semver projection extracted from the triggering Git tag when one applies. It is the value a workflow uses when it needs the version as a plain string, for example for an artifact name, without re-deriving it from the tag ref.

## The canonical wiring

The source doc's usage section is the canonical two-step pattern:

```yaml
- uses: docker/metadata-action@v5
  id: meta
  with:
    images: quay.io/yubi-os/yubios

- uses: docker/build-push-action@v6
  with:
    tags: ${{ steps.meta.outputs.tags }}
    labels: ${{ steps.meta.outputs.labels }}
```

Mechanics to notice (source doc):

- The `id: meta` on the first step is what makes `steps.meta.outputs.*` addressable; the source doc's Notes section lists this as the first requirement.
- The build step passes the newline-separated tag list straight through. GitHub Actions multi-line string inputs are the intended carrier, so no splitting or joining step is needed between the two actions.
- Labels flow the same way. The labels the build gets include the auto-generated OCI labels from doc 05 plus any explicit labels declared on the metadata step.

## Why the docs pair the two actions

The Docker docs' CI page frames the pairing as the standard workflow shape: a dedicated setup step handles "tags and labels based on GitHub Actions events and Git metadata", and the build step then pushes to the registries those tags name (https://docs.docker.com/build/ci/github-actions/manage-tags-labels/, jev 0.88). The action's own README states the pairing intent directly: it is "particularly useful if used with Docker Build Push action to tag and label Docker images" (https://github.com/docker/metadata-action, jev 0.92).

The consequence for yubiOS pipelines is a clean separation of concerns: build-push-action owns the build and push mechanics (context, platforms, provenance attestations), metadata-action owns the naming and annotation of what was built. A workflow review can audit the tag scheme by reading one step and the build config by reading the other.

## Failure modes to avoid

Three wiring mistakes the reference blocks are designed to prevent (source doc, Notes and usage section):

1. Omitting `id: meta`, which makes the outputs unreachable and the build step's `tags` expression resolve empty.
2. Referencing the outputs before or after the metadata step in a way that breaks step ordering: the metadata step must run before build-push-action in the same job.
3. Hardcoding a `tags:` override on the build step, which silently discards the computed tag list and reintroduces the problem doc 01 describes.

## Source quality notes

Backing: the action repository (0.92), the manage-tags-labels Docker docs page (0.88), and the Docker docs domain (0.92). A DeepWiki generated page for build-push-action scored 0.12 and was excluded: aggregator-grade, no claims carry from it. Docker product pages (0.24 to 0.52) and GeeksforGeeks (0.11) were weighted low and carry no claims. Both seed queries returned 43 or more raw results, 6 kept each; no redo.
