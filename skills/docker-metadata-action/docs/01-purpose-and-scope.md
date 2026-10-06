# 01. Purpose and scope of docker-metadata-action

Scope line: this doc covers what docker/metadata-action is for, the boundary of its job, and when a GitHub Actions workflow should reach for it, as laid down by the source doc's "When to use" and "Guidelines" sections.

## What the action does

The source doc (yubi-OS/yubiOS skills/docker-metadata-action/SKILL.md, "When to use") defines the job in one sentence: automatically generate image tags and OCI labels from Git ref, SHA, PR number, or semver tags, and use it before docker/build-push-action to avoid hardcoded image tags and get consistent OCI annotations. The action's own README says the same in its one-line summary: "GitHub Action to extract metadata from Git reference and GitHub events", and adds that it is "particularly useful if used with Docker Build Push action to tag and label Docker images" (https://github.com/docker/metadata-action, jev 0.92). The official Docker docs describe the same pattern as a dedicated setup step: "If you want an 'automatic' tag management and OCI Image Format Specification for labels, you can do it in a dedicated setup step", with a workflow that "will use the Docker Metadata Action to handle tags and labels based on GitHub Actions events and Git metadata" (https://docs.docker.com/build/ci/github-actions/manage-tags-labels/, jev 0.88).

Two facts follow from that framing. First, the action does not build or push anything: it computes tags and labels and exposes them as step outputs that a later build-push step consumes. Second, its inputs are the workflow's own Git and GitHub event data, so the tag set changes correctly per event (push to a branch, PR, tag, scheduled run) with zero per-workflow tag logic.

## The hardcoded-tag problem it removes

Hardcoded tags appear when a workflow writes `tags: myimage:v1` or `tags: myimage:latest` inline. That couples the tag to the workflow text instead of the Git state, and it drifts: a branch rename or a new release scheme silently leaves stale tags behind. The metadata-action discipline (source doc) is to declare tag *types* rather than tag *strings*, so the emitted tag list is derived from the event. This is the habit the corpus should internalize: tags are a projection of Git metadata, not hand-written literals.

## Scope boundary

The source doc's Guidelines section is explicit: "Every use stays inside the frontmatter description's scope; anything beyond it is a different skill's job." The frontmatter scope is "Generate OCI-compliant Docker image tags and labels automatically from Git metadata (branch, tag, SHA, PR) in GitHub Actions using docker/metadata-action. Use before docker/build-push-action to avoid hardcoded tags and ensure proper OCI annotations." Concretely: registry authentication belongs to docker/login-action, the build itself to docker/build-push-action, the buildx builder to docker/setup-buildx-action, and multi-target bake files to docker/bake-action. This skill owns only the tags-and-labels projection layer. When a request names a trigger (a push, a tag, a PR) without the artifact it acts on, the source doc's boundary rule says route to the owning surface instead of improvising here.

## Version drift observed at dig time (2026-10-06)

The source doc pins `docker/metadata-action@v5` throughout its YAML examples. The dig found the upstream README's current examples using `docker/metadata-action@v6` and `actions/checkout@v7` (https://github.com/docker/metadata-action, jev 0.94). Dated correction: as of 2026-10-06 the upstream default branch's examples run on v6; the source doc's v5 pinning is its own convention and the tag-type grammar (`type=...` lines) is unchanged between the two for the types this corpus covers. When writing new yubiOS workflows, check the action's current major tag before pinning.

## Related upstream capability: custom context

The upstream README also documents a `context: git:source` input used with `actions/checkout` at `path: source`: "The selected checkout supplies the Git ref, SHA, and commit date. Other repository metadata still comes from the workflow repository" (https://github.com/docker/metadata-action, jev 0.94). This matters for yubiOS workflows that check out a dependency repo (for example a base image repo) and still want tags derived from that checkout rather than the workflow's own repo. It is an input-level escape hatch that keeps the metadata-action job boundary intact.

## Source quality notes

Strong backing in this doc: the action's GitHub repository (0.94 and 0.92 across queries) and the Docker docs manage-tags-labels page (0.88). Docker's marketing homepage scored 0.55 and was used only for the framing sentence that Docker positions the metadata layer as part of a secure supply chain; it is not a technical source. GeeksforGeeks results (0.11 to 0.12) and Docker Desktop product pages (0.26 to 0.27) were weighted low and are not cited for any technical claim.
