# 09. Lifecycle, examples, and guidelines of the skill itself

Scope line: internal-record subtopic, no dig. This doc records the source doc's changelog, audit trail, Examples and Guidelines sections, and the boundary routing rule, so future sessions can see how the skill evolves and where its edges are. All claims cite the source doc (yubi-OS/yubiOS skills/docker-metadata-action/SKILL.md).

## Changelog and audit trail

The source doc's changelog has exactly one dated entry: "2026-08-06 cycle 5 RSI: closed segmentation primitive gap (corpus-wide count 22 to 23 of 70). See refs/cycle5-results-2026-08-06.md for the corpus-fit delta measurement." Two further audit-trail sections record cycle 6 (full movable coverage post-cycle-5, no closure needed) and cycle 7 (the 5 remaining movable primitives, attestation, trust chain, declarative policy, immutability, least privilege, verified covered, no closure needed). The lifecycle shape is a one-change-then-stabilize arc: a single additive edit in cycle 5, then two verification-only cycles confirming the coverage state held. Nothing in the changelog or audit trail removes or rewrites existing content; the cycle-5 entry states this explicitly ("content-additive edit, no existing content was removed or rewritten").

## Examples section

The source doc's Examples section carries three artifacts:

1. **Worked setup**: "the flow this skill drives, using its own artifacts", referencing the cycle 5 segmentation closure. It points a new reader at the artifact trail first, before the YAML blocks.
2. **In-repo touchpoints**: the sections the skill owns or extends are named explicitly: "When to use, Action reference, Tag types reference, Outputs". These are the four sections docs 01 to 04 of this corpus explicate, which makes the touchpoint list the de facto module boundary of the skill's own content.
3. **Boundary case**: "when the request only names a trigger without the artifact it acts on, route to the owning surface instead of improvising here." This is the routing rule: a request that says "on push to main" with no artifact is incomplete for this skill and belongs to the workflow or the build step that owns the artifact.

## Guidelines

The Guidelines section is one rule: "Every use stays inside the frontmatter description's scope; anything beyond it is a different skill's job." Combined with the boundary-case rule, the skill draws a two-layer edge: content stays within the description's scope (tags and labels from Git metadata in GitHub Actions), and requests stay with the artifact-owning surface. Both rules serve the same purpose in the skill registry: predictable dispatch. A session that follows them routes registry-auth to docker-login-action, builds to docker/build-push-action, bake files to docker-bake-action, and the tags-and-labels projection to this skill.

## Version drift recorded at dig time

The source doc pins `docker/metadata-action@v5`. The dig of the upstream repository found its current examples on `docker/metadata-action@v6` (with `actions/checkout@v7`) (https://github.com/docker/metadata-action, jev 0.94, dig dated 2026-10-06). This is recorded as a dated correction in docs 01 and 02 rather than a contradiction: the source doc is the internal convention of record, and the tag-type grammar it teaches is unchanged. A future refresh of this skill should either re-pin to the major tag the org standardizes on or annotate why v5 stays.

## What a refresh should preserve

Reading the lifecycle sections together, a maintenance pass on this skill should preserve four invariants: the frontmatter description's scope sentence (the Guidelines rule depends on it verbatim), the `id: meta` note (the single most load-bearing mechanical fact in the skill), the tag types table (the projection vocabulary), and the audit-trail sections (they are append-only records that the corpus audit reads; the cycle-5 entry's content-additive guarantee must survive any rewrite). The Examples section's boundary rule should survive too, since it is what keeps the skill from absorbing its neighbors' jobs.
