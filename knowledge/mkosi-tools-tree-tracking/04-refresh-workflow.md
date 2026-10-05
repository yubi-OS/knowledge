# 04 - Refresh workflow

**Scope.** The refresh workflow for the tools-tree pin: confirm the current pin, resolve the new source, record the digest, rebuild a candidate image, and update the pin in one commit.

## The workflow

The yubiOS refresh checklist has 5 steps (yubiOS refs plan doc, source of this corpus):

1. Confirm the current pin in the source of truth before any change.
2. Resolve the new tools-tree source and record its digest, not just a tag.
3. Rebuild a candidate image with the new tools tree and run the existing image gates, booting the artifact and verifying the UKI signs and boots.
4. Update the pin in one commit; note the old and new digests in the commit message.
5. Roll back by reverting the pin, never by hand-editing a built image.

Step 2 is where the pinning argument from doc 02 lands: the digest is the only immutable identifier of an image ([docs.docker.com/dhi/explore/security-concepts/digests/](https://docs.docker.com/dhi/explore/security-concepts/digests/), jev weight 0.79, authoritative), so a refresh that records only a tag has recorded nothing durable.

## Why a refresh cadence is mandatory once you pin

Pinning creates its own obligation. A pinned digest with no refresh job goes stale: pinning fixes the drift problem and creates a second one, because the base image freezes, including its unpatched packages, until a commit moves the digest. A pin without a schedule is a decision to stop taking upstream updates, and the bump pull request arrives with no checks attached ([www.warpbuild.com/guides/base-image-update-workflow-github-actions](https://www.warpbuild.com/guides/base-image-update-workflow-github-actions), jev weight 0.34, weak source). This is the yubiOS plan's answer to "how often": a refresh workflow analogous to the existing base-manifest refresh workflow, that re-resolves the pin and records the old to new transition (yubiOS refs plan doc).

## Automating the refresh

The tooling for digest-refresh PRs is mature. Renovate opens pull requests to update dependencies and lock files, on a schedule the operator chooses, and finds relevant package files automatically ([docs.renovatebot.com/](https://docs.renovatebot.com/), jev weight 0.95, authoritative). For images specifically, Renovate supports digest pinning and updating, including following the action version tag while pinning the digest ([docs.renovatebot.com/modules/manager/github-actions/](https://docs.renovatebot.com/modules/manager/github-actions/), jev weight 0.95, authoritative), and container and digest pinning and updates are included by default in its container support ([www.innoq.com/en/blog/2024/05/renovate/](https://www.innoq.com/en/blog/2024/05/renovate/), jev weight 0.64, authoritative).

What automation should not do is skip the gates. The bump PR is a candidate, not a decision: the yubiOS plan requires the candidate image to pass the existing image gates before the pin moves (yubiOS refs plan doc).

## What a refresh PR looks like

A real example of the shape: the Forgejo project's PR 10618, titled "Update renovate to v42.66.11 (forgejo)", a single-purpose update PR for one pinned tool version ([codeberg.org/forgejo/forgejo/pulls/10618](https://codeberg.org/forgejo/forgejo/pulls/10618), jev weight 0.63, authoritative). The yubiOS equivalent is a PR that moves one tools-tree pin, with the old and new digests in the commit message (yubiOS refs plan doc).

The digest-update pattern literature frames the same loop as a lifecycle: registries publish, the pin freezes a digest, and a deliberate update step moves the digest forward ([www.kunwar.page/chapter/106-the-oci-image-lifecycle-registries-digest-pinning-the-digest-update-pattern](https://www.kunwar.page/chapter/106-the-oci-image-lifecycle-registries-digest-pinning-the-digest-update-pattern), jev weight 0.26, weak source).

## Rollback belongs to the same workflow

Step 5 is stated in the plan as part of the refresh discipline: roll back by reverting the pin, never by hand-editing a built image (yubiOS refs plan doc). Doc 06 covers why that is the correct rollback axis.

## Bottom line

A refresh is: confirm, resolve to a digest, rebuild and gate, commit the pin change with both digests in the message, and keep the revert path trivial. Automation can generate the candidate; the gates and the one-commit rule are what keep the ledger trustworthy.
