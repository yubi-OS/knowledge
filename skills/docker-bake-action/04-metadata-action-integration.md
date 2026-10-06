# metadata-action integration: consuming the bake-file output

Scope: how `docker/metadata-action` composes with `docker/bake-action` by feeding its `bake-file` output into the bake step's `files` input, what that replaces, and where the yubiOS `github-builder` path moves this integration. Grounded in the source doc `yubi-OS/yubiOS skills/docker-bake-action/SKILL.md` plus weighted dig results.

## The source doc wiring

The source doc's integration example is a three-step dance:

```yaml
- uses: docker/metadata-action@v5
  id: meta
  with:
    images: quay.io/yubi-os/yubios

- uses: docker/setup-buildx-action@v3

- uses: docker/bake-action@v5
  with:
    files: |
      ./docker-bake.hcl
      ${{ steps.meta.outputs.bake-file }}
    push: true
```

(source doc, With metadata-action bake file output). The mechanism: `metadata-action` computes tags and labels from Git and event context, serializes them as a Bake file (JSON), and emits that file path as its `bake-file` output. The bake step lists it after the hand-written HCL, and bake merges the two definitions (source doc, Action reference: `files` is a multi-line list including the metadata bake file).

## What this replaces

Without the integration, tag and label spelling for every variant lives in the bake file's `tags` and `labels` fields, and tag logic like `type=ref,event=pr` or semver patterns has to be hand-maintained or handled by a `TAG` variable (source doc, Example bake file). With the integration, the metadata action owns tag derivation (branch name, PR number, semver, sha) while the bake file keeps only structural truth: context, dockerfile, platforms, labels like `containers.bootc` (source doc).

The `metadata-action` repository describes the action as one that extracts metadata from Git reference and GitHub API events to generate tags and labels (https://github.com/docker/metadata-action, jev weight 0.38, weak backing: below the 0.5 line; the claim is uncontroversial and matches the source doc, but cite the source doc as primary here).

## Two merge orders, one rule

The rule the source doc demonstrates implicitly: the metadata file goes second in `files`. Docker's remote-definition documentation describes how bake merges multiple definition files into one effective definition (https://docs.docker.com/build/bake/remote-definition/, jev weight 0.92). For the metadata case the generated file supplies tag and label values for the targets named in the HCL; keeping it second makes the merge order explicit and stable.

## The github-builder path: metadata inputs instead of files

The `docker/github-builder` reusable workflow inverts the integration: instead of passing a bake-file output around, you pass `meta-images` and `meta-tags` inputs to the workflow and it runs the metadata step internally (source doc, github-builder section):

```yaml
with:
  meta-images: quay.io/yubi-os/yubios
  meta-tags: |
    type=ref,event=branch
    type=ref,event=pr
    type=semver,pattern={{version}}
    type=sha,format=long
```

(source doc). Docker's own bake-with-github-builder page documents the same input names (https://docs.docker.com/build/ci/github-actions/github-builder/bake/, jev weight 0.94). So yubiOS has two supported shapes:

1. **Bare bake-action**: hand-wire `metadata-action` + `setup-buildx-action` + `bake-action`, pass `steps.meta.outputs.bake-file` in `files` (source doc).
2. **github-builder**: declare `meta-images` and `meta-tags` and let the reusable workflow own the metadata plumbing (source doc; https://docs.docker.com/build/ci/github-actions/github-builder/bake/, 0.94).

The source doc's own preference statement tips the scale for registry pushes: "Prefer it over bare bake-action when pushing to a registry" (source doc, github-builder section). See doc 06 for the full workflow comparison.

## Failure modes

1. **Missing the setup step.** The metadata step produces a file; the build step still needs buildx configured (`setup-buildx-action@v3` in the source doc example, source doc).
2. **Forgetting the file in `files`.** If the bake-file output is not listed, the build runs with only the HCL's tags, and CI-pushed images lose branch/PR/semver tags silently.
3. **Hardcoding tag strings in both places.** If the HCL `tags` field and the metadata rules both define tags, one of them is wrong on the next release. Decide which surface owns tags per target: metadata for dynamic tags, HCL for fixed variant tags like `-minimal` (source doc's example keeps the variant tag in HCL with a `${TAG}` variable, source doc).

## Recommendation for yubiOS

Inside yubiOS the integration is mostly relevant in the two places the source doc uses it: the action reference shows `files` consuming the bake-file output, and the github-builder section replaces it with `meta-images`/`meta-tags`. New pipelines that push to quay.io should use the github-builder shape (source doc preference); local or non-registry workflows can keep the bare three-step shape (source doc).

Primary sources: source doc (`yubi-OS/yubiOS skills/docker-bake-action/SKILL.md`); https://docs.docker.com/build/ci/github-actions/github-builder/bake/ (0.94); https://docs.docker.com/build/bake/remote-definition/ (0.92). Weak backing (< 0.5): https://github.com/docker/metadata-action (0.38).
