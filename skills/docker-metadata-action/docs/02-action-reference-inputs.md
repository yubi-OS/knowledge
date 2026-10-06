# 02. The action reference: images, tags, and the id: meta requirement

Scope line: this doc explicates the source doc's "Action reference" block, the shape of the `images` and `tags` inputs, and the mechanical requirements (the step `id`) that make the outputs reachable.

## The reference block

The source doc's action reference is:

```yaml
- uses: docker/metadata-action@v5
  id: meta
  with:
    images: |
      quay.io/yubi-os/yubios
      ghcr.io/yubi-os/yubios
    tags: |
      type=schedule
      type=ref,event=branch
      type=ref,event=pr
      type=semver,pattern={{version}}
      type=semver,pattern={{major}}.{{minor}}
      type=sha
```

Four structural facts live in those lines (source doc, "Action reference" and "Notes"):

1. The action is invoked as `docker/metadata-action@v5` (upstream examples now show v6, see doc 01 for the dated 2026-10-06 correction, https://github.com/docker/metadata-action, jev 0.94).
2. The step carries `id: meta`. The source doc's Notes section states the reason plainly: "id: meta is required so subsequent steps can reference steps.meta.outputs.*". Without the id there is no stable handle to the outputs, and the whole tags-and-labels projection is unreachable from the build step.
3. `images:` takes a multi-line block. The source doc's Notes say "Multiple images: entries generate tags for all registries simultaneously": one metadata step produces the full tag list for every listed registry, so a workflow pushing to quay.io and ghcr.io in one build does not need two metadata steps or divergent tag schemes. The yubiOS reference uses `quay.io/yubi-os/yubios` and `ghcr.io/yubi-os/yubios` together in exactly this way (source doc).
4. `tags:` is also a multi-line block of `type=...` rules, one per line. Each rule is a tag generator with optional comma-separated parameters, for example `type=semver,pattern={{version}}`. The tag types are covered in doc 03.

## What the inputs are fed by

The action's README positioning confirms the input model: it extracts metadata "from Git reference and GitHub events", and is designed to pair with the build-push action (https://github.com/docker/metadata-action, jev 0.92). The workflow run itself supplies the event context, so the same `tags:` block yields different tag sets on a branch push, a PR, a semver tag push, and a cron run. That event-driven behavior is the entire point of the discipline in doc 01.

For yubiOS workflows that check out additional repositories, the upstream README documents a `context: git:source` option paired with `actions/checkout` at `path: source`, where "the selected checkout supplies the Git ref, SHA, and commit date" while other repository metadata still comes from the workflow repository (https://github.com/docker/metadata-action, jev 0.94). This is the input-level control for whose Git state the tags are derived from.

## The minimal single-registry form

The source doc's "Usage with build-push-action" section shows the minimal form: a single `images: quay.io/yubi-os/yubios` line, one step id, and no explicit tags block in that particular example (tags then come from the default tag rules). The full yubiOS pattern in doc 06 instead pins an explicit tags block (sha long, branch ref, semver) because supply chain compliance, not brevity, is the goal there.

## Mechanical rules to keep straight

From the source doc and the reference block, the checklist a yubiOS workflow must satisfy:

- The step has `id: meta` (source doc, Notes).
- Every registry the build will push to appears under `images:`; the action generates tags for all of them at once (source doc, Notes).
- The `tags:` rules are a declarative list, not free-form strings (source doc, Action reference and doc 03).
- Downstream steps read `${{ steps.meta.outputs.tags }}` and `${{ steps.meta.outputs.labels }}` (source doc, doc 04).

A missing `id` is the most common integration failure and produces a workflow that runs cleanly but whose build step cannot resolve its outputs; the source doc calls the id out first among its notes for that reason.

## Source quality notes

Backing here: the action's repository README (0.92 and 0.94 across the two queries for this subtopic) and the Docker documentation domain (0.94). Docker's marketing pages (0.27 to 0.54) and GeeksforGeeks tutorials (0.09) were weighted low and carry no claims in this doc. No redo was needed: both seed queries returned 45 or more raw results each.
