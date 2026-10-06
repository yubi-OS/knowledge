# 01. When to use docker/metadata-action

**Scope:** When docker/metadata-action is the right tool: the hardcoded-tags problem, its placement before docker/build-push-action, and the trigger surface it covers.

## The problem it solves

Hardcoded image tags are the failure mode this skill exists to remove. The source doc (yubi-OS/yubiOS skills/docker-metadata-action/SKILL.md) states the skill's purpose directly: "Automatically generate image tags and OCI labels from Git ref, SHA, PR number, or semver tags. Use before docker/build-push-action to avoid hardcoded image tags and get consistent OCI annotations." The action itself is described upstream as one that extracts metadata from Git reference and GitHub events, and is "particularly useful if used with Docker Build Push action to tag and label Docker images" (https://github.com/marketplace/actions/docker-metadata-action, weight 0.79).

In practice the skill's answer to "what tag should this build get?" is never a literal string written by a human in the workflow file. It is a rules block: the same workflow produces a branch tag on a branch push, a pr-N tag on a pull request, a semver tag on a version tag push, and a sha tag on every push. That consistency is the value: the CI definition stays identical while the tag set follows the event (source doc).

## Where it sits in a workflow

The action runs as a dedicated step before the build. The source doc's canonical wiring gives the metadata step an id and passes its outputs to build-push-action:

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

The official Docker documentation frames the same pattern: "If you want an 'automatic' tag management and OCI Image Format Specification for labels, you can do it in a dedicated setup step" before the build and push (https://docs.docker.com/build/ci/github-actions/manage-tags-labels/, weight 0.91). Docker's broader introduction to GitHub Actions with Docker covers setting up and using Docker GitHub Actions for building and pushing images, and this metadata step is the tagging layer of that stack (https://docs.docker.com/build/ci/github-actions/, weight 0.89).

## Triggers it covers

The source doc's frontmatter scopes the skill to: "docker tags, OCI labels, metadata-action, image tags, semver tags, tags and labels." Anything beyond generating tags and labels from Git and event metadata is a different skill's job (source doc, Guidelines section). The documented upstream example workflow covers exactly the event surface the tag rules read: a schedule trigger with a cron, push events on all branches, tag pushes matching `v*.*.*`, and pull_request events (https://docs.docker.com/build/ci/github-actions/manage-tags-labels/, weight 0.91).

## Multiple registries in one step

One metadata step can tag for several registries at once. The source doc's action reference lists both `quay.io/yubi-os/yubios` and `ghcr.io/yubi-os/yubios` under `images:`, and its Notes section states: "Multiple `images:` entries generate tags for all registries simultaneously." The upstream documented example does the same with a Docker Hub image and a ghcr.io image side by side (https://docs.docker.com/build/ci/github-actions/manage-tags-labels/, weight 0.91).

Two Notes from the source doc matter for correct use. First, `id: meta` is required so subsequent steps can reference `steps.meta.outputs.*`. Second, the `bake-file` output integrates with `docker/bake-action` for multi-target builds, which is covered in doc 03 of this corpus.

## Version drift, dated correction

The source doc pins `docker/metadata-action@v5`. The upstream README and the official Docker docs pages fetched on 2026-10-06 both show `docker/metadata-action@v6` in their current examples, with `docker/build-push-action@v7` alongside (https://github.com/docker/metadata-action, weight 0.95; https://docs.docker.com/build/ci/github-actions/manage-tags-labels/, weight 0.91). This is a dated correction, not a contradiction: the skill's rule set is version-independent, but a new workflow written today should check the current major version rather than copying the skill's v5 pin blindly.

## What this skill is not

It does not build or push images (that is build-push-action), does not orchestrate multi-target builds itself (that is bake-action), and does not authenticate to a registry (that is login-action). The source doc's Guidelines section is explicit: "Every use stays inside the frontmatter description's scope; anything beyond it is a different skill's job."
