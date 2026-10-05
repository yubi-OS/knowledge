# 09 - The roll procedure end to end: from policy to PR to review

Scope: the complete digest bump flow: obtain the digest, update the source of truth, update references, land through a pull request, and apply commit-message discipline to bundled workflow-file edits.

## The policy line, expanded

The yubiOS pinned-dependency file states its roll procedure at a high level: "obtain the digest, update this file, update repo references to the old digest, update `yubiOS.rego` if a new registry is introduced, and open a PR" (yubiOS refs: digest-bump-checklist-2026-07-25.md). The checklist exists to expand that one sentence into per-category steps, and this doc expands the sentence's frame: who does what, in what order, and what the review sees.

## Step 1: obtain the digest through a defined path

The digest is never obtained by ad hoc inspection. Each category names its fetch mechanism: a refresh workflow for container images, a release-tag resolver for forks, a release asset download for binaries, the upstream repository for source refs. The named path matters because it makes the provenance of the new value auditable: the PR that changes the pin can reference the workflow run or fetch command that produced it. Industry practice automates exactly this step: a scheduled job resolves the digest a base tag currently points at and opens the update pull request with the existing checks running against it (https://www.warpbuild.com/guides/base-image-update-workflow-github-actions, jev weight 0.52).

## Step 2: update the source of truth and its consumers

The source of truth file is updated with the new value, and every reference to the old value in the repo is updated in the same change. GitHub's guidance on reviewing dependency changes describes what the reviewer needs to evaluate this: a summary of what changed and whether there are known issues in the new dependency, visible at review time rather than after merge (https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-dependency-changes-in-a-pull-request, jev weight 0.95). A digest bump PR should carry the same shape of summary: the old and new values, the fetch evidence, and the per-category checklist items ticked.

The consumer-update step is where bumps drift. Automation that rewrites only the table leaves Containerfiles and workflow `image:` fields pointing at the old digest; the repo then claims one pin and builds another. The checklist's consumer-reference step exists to keep the two in the same commit, so the diff itself proves coherence (yubiOS refs: digest-bump-checklist-2026-07-25.md).

## Step 3: the conditional policy edit

If the bump introduces a registry the build policy has not approved, the policy file is updated in the same PR. This is a conditional step, not a mandatory one, and treating it as mandatory is its own failure mode: adding registries to an approved list is a trust decision that deserves its own review attention, not a rubber stamp riding along with a routine bump (yubiOS refs: digest-bump-checklist-2026-07-25.md).

## Step 4: land as a PR, never direct

The procedure ends with "open a PR," matching the project convention that automated agents commit bump PRs rather than pushing to main (yubiOS refs: digest-bump-checklist-2026-07-25.md). The reason is the audit trail: the PR records who proposed the bump, what evidence backed it, and what review it got. Platform tooling supports the review side: GitHub's dependency-change review view collapses non-dependency files so a reviewer can focus on the pin diff itself (https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-dependency-changes-in-a-pull-request, jev weight 0.95; same content in the repo's docs source: https://github.com/github/docs/blob/main/content/pull-requests/how-tos/review-pull-requests/reviewing-dependency-changes-in-a-pull-request.md, jev weight 0.92).

## The workflow-file exception, and its discipline

One path in the repo bypasses PR review: workflow-file edits committed directly to main through the sole authorized connection. The project rule for that path is a descriptive commit message, precisely because there is no PR review step to capture the rationale (yubiOS refs: digest-bump-checklist-2026-07-25.md). The checklist's cross-cutting rule extends that discipline to bumps: a digest bump PR that also touches a workflow file must carry the same commit-message quality for the workflow portion, even though the PR itself provides the review. The reviewer's check is that the bundled workflow edit is described in the PR body, so the no-review path never becomes the hiding place for an underdocumented change.

## Reviewer checklist for any bump PR

Across all categories, the reviewer verifies:

1. The new value came through the category's named fetch path, with evidence in the PR.
2. The source-of-truth table and every consumer reference moved in the same commit.
3. Any conditional step that fired (new registry, capability re-confirmation, cross-table hash) is visible in the PR description.
4. The superseded value is preserved in the audit block, not deleted.
5. Any bundled workflow-file change carries a descriptive commit message.

## Why the procedure is boring on purpose

Every step above is designed so the common bump is small, reviewable, and reversible: one value, its consumers, its evidence, its audit row. The alternative, batching bumps or landing them directly, trades short-term convenience for exactly the ambiguity the pin system exists to prevent. Wiz's guidance on base-image patching frames the continuous-update posture as the security best practice: frequent small updates beat rare large ones for both risk and review quality (weak backing for the security framing: https://www.wiz.io/academy/container-security/how-to-patch-container-base-images, jev weight 0.64). The procedure's final property is that it fails loudly at every gate: a stale hash, an unapproved registry, a mutable tag, or an unfetched commit all stop the build rather than shipping quietly, which is what makes the occasional loud failure a feature of the system rather than a defect in the checklist.
