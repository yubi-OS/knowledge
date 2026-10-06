# 03. Outputs and workflow integration

**Scope:** The five outputs metadata-action emits (tags, labels, version, bake-file, json) and how they wire into docker/build-push-action and docker/bake-action.

## The outputs

The source doc (yubi-OS/yubiOS skills/docker-metadata-action/SKILL.md) lists five outputs:

| Output | Description |
|---|---|
| `tags` | Newline-separated tag list |
| `labels` | Newline-separated OCI label list |
| `version` | Extracted version string |
| `bake-file` | JSON bake file for `docker/bake-action` integration |
| `json` | Full JSON metadata |

The `tags` and `labels` outputs are the primary pair: newline-separated, consumed directly by build-push-action. The `version` output exposes the extracted version string for any step that needs the version without re-deriving it. The `json` output is the full metadata payload.

## The required id

The source doc's Notes section is explicit: "`id: meta` is required so subsequent steps can reference `steps.meta.outputs.*`". Every downstream reference takes the form `steps.meta.outputs.tags`, which only resolves because the metadata step carries `id: meta`. A metadata step without an id produces outputs nothing can read.

## Wiring into build-push-action

The canonical integration from the source doc:

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

This is the whole contract: build-push-action receives the newline-separated tag list and label list verbatim. The upstream README shows the same shape with current major versions, `docker/metadata-action@v6` feeding `docker/build-push-action@v7` (https://github.com/docker/metadata-action, weight 0.95; dated 2026-10-06 fetch, see doc 01 for the v5 versus v6 drift note).

## The json output and fromJSON

The upstream README documents the `json` output as "a JSON object composed of the generated tags and labels so that you can reuse them further in your workflow using the fromJSON function" (https://github.com/docker/metadata-action, weight 0.95). Where the newline-separated outputs suit the direct `tags:` / `labels:` passthrough, the `json` output suits steps that need the tag set as a parsed array, such as a subsequent job matrix or a push loop.

## The bake-file output

The `bake-file` output combines tags and labels into the JSON structure bake consumes. The README example shows the content of `${{ steps.meta.outputs.bake-file }}` for a run on `refs/tags/v1.2.3` (https://github.com/docker/metadata-action, weight 0.95):

```json
{
  "target": {
    "docker-metadata-action": {
      "tags": [
        "name/app:1.2.3",
        "name/app:1.2",
        "name/app:sha-90dd603",
        "name/app:latest"
      ],
      "labels": {
        "org.opencontainers.image.title": "Hello-World"
      }
    }
  }
}
```

The target key is `docker-metadata-action`, so a bake invocation that includes this file picks up the generated tags and labels as a named target. A Docker Bake file, per the official reference, "is a file for defining workflows that you run using docker buildx bake", with the configuration file located by a default lookup order or explicitly with the `--file` flag (https://docs.docker.com/build/bake/reference/, weight 0.93). The source doc's Notes section ties it together: "The `bake-file` output integrates with `docker/bake-action` for multi-target builds", and yubiOS's own docker-bake-action skill is the consumer side of that integration.

## yubiOS wiring pattern

The source doc's yubiOS pattern combines the outputs with explicit labels in one metadata step: tags for full-SHA digests, branch builds, and semver releases, plus labels including `containers.bootc=1` and `org.opencontainers.image.source` pointing at the yubi-OS/yubiOS repository. The supply-chain rationale for preferring `type=sha,format=long` over `:latest` is a Notes-level constraint tied to the yubiOS.rego build policy (source doc); doc 04 covers the label layer in full.

## Integration summary

- metadata step with `id: meta`, one or more `images:` entries, and a `tags:` rule block.
- build-push-action consumes `steps.meta.outputs.tags` and `steps.meta.outputs.labels` directly (source doc).
- bake-action consumes `steps.meta.outputs.bake-file` when the build is orchestrated through bake (source doc).
- `version` and `json` outputs are available for downstream steps that need parsed or scalar metadata (source doc; json reuse via fromJSON per https://github.com/docker/metadata-action, weight 0.95).
