# 07 - GitHub Actions SHA pinning: immutable references and the mutable-tag rejection

Scope: bumping pinned action SHAs: what makes a reference immutable, why mutable tags are rejected by policy, and what to check on a bump PR.

## Why actions are pinned at all

A reusable GitHub Action executes in CI with access to repository context and secrets, which makes `uses:` references a supply-chain surface: the code that runs is whatever the reference resolves to at invocation time. Pinning a third-party action to a full-length commit SHA is the standard mitigation because a SHA is immutable: once recorded, it can only refer to the exact commit it addressed at pin time (https://www.stepsecurity.io/blog/pinning-github-actions-for-enhanced-security-a-complete-guide, jev weight 0.42, weak backing). GitHub itself now recommends this explicitly, and tooling such as the `pinsha` project exists to automate the rewrite from tags to SHAs, pairing pinning with automated update tooling so pins do not become stale (https://github.com/zkamvar/pinsha, jev weight 0.76).

## The policy rejection, stated precisely

The yubiOS policy states: "Mutable tags such as `:latest`, `:main`, or branch refs are rejected by `yubiOS.rego` and AGENTS.md policy" (yubiOS refs: digest-bump-checklist-2026-07-25.md). The rejection is fail-closed: a workflow referencing an action by a mutable tag does not run under the yubiOS policy at all. This means the bump check is not primarily about security vigilance; it is about copy discipline. The checklist's own wording is that "the person bumping should confirm they copied a commit SHA, not a tag string," because the failure mode is mundane: a release page offers both a tag button and a copy-SHA affordance, and pasting the wrong one fails the build (yubiOS refs: digest-bump-checklist-2026-07-25.md).

Practitioner incident writeups back the severity behind the rule: a mutable tag or branch reference in a workflow is flagged as a high-severity finding by static analyzers, and the vulnerability class is that whoever controls the tag controls the code that runs in CI (weak backing: https://orbisappsec.com/blog/how-mutable-action-tag-vulnerabilities-happen-in-github-actions, jev weight 0.36).

## Platform policy is converging on the same rule

The yubiOS rule is not idiosyncratic. GitHub's changelog for August 2025 announced that GitHub Actions policy now supports blocking and SHA-pinning actions at the organization level, framing immutable releases as the direction of travel for strengthening supply-chain security (https://github.blog/changelog/2025-08-15-github-actions-policy-now-supports-blocking-and-sha-pinning-actions/, jev weight 0.95). GitHub's own documentation now describes using immutable releases and tags to manage an action's releases, which extends the guarantee from "the SHA is immutable" to "the release artifact behind it is too" (https://docs.github.com/actions/how-tos/create-and-publish-actions/using-immutable-releases-and-tags-to-manage-your-actions-releases, jev weight 0.97). And maintainers of popular actions report that organization-level policies requiring full-length SHA pinning started blocking users who referenced actions by tag, which turned the practice from advice into de facto requirement in some orgs (https://www.romainlespinasse.dev/posts/github-actions-commit-sha-pinning/, jev weight 0.29, weak backing).

## What a bump changes

Bumping an action means replacing the recorded pinned SHA with the SHA of the new release commit, in the GitHub Actions table, in one PR. The checks:

1. The new reference is a full-length commit SHA, not a tag string. Confirm by pasting the SHA into the upstream repo and verifying it resolves to the release commit.
2. The change notes what the new version does. A SHA diff is unreadable to reviewers by itself; the PR should carry the release summary so the review is about the change, not the hash.
3. No other reference to the same action drifted: the same action used in multiple workflows should move to the same SHA in the same PR, or the table and the workflows disagree.

Tools that automate action updates illustrate the intended end state: rewrite mutable tags to immutable commit hashes as part of the update flow rather than as a separate audit (https://github.com/JamesWoolfenden/ghat, jev weight 0.51).

## The residual risk pinning does not remove

SHA pinning freezes the reference, not the trust decision. A compromised repository can still attach malicious content to a new commit, and the bump is the moment the project chooses to trust the new commit. That is why the bump is a reviewed PR with the release notes attached, and why yubiOS pairs the SHA pin with the build-time policy gate: the pin says which commit is allowed to run, the review says why this commit is being trusted now. The checklist item that captures both is the same one: confirm the SHA is a SHA, read what it changes, and land it through a PR so the decision is on the record (yubiOS refs: digest-bump-checklist-2026-07-25.md).

## Checklist summary

- Update the action's pinned SHA in the GitHub Actions table.
- Confirm the new value is an immutable commit reference, never a tag or branch name; expect a fail-closed policy rejection if it is not, and treat that rejection as a copying error to fix, not a policy to loosen.
- Carry the release notes in the PR so the reviewer reviews content, not a hash.
- Update all usages of the same action together to avoid table-versus-workflow drift.
