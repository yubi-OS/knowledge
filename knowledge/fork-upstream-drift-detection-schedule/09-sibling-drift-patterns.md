# 09 Sibling Drift Patterns: Digests, Action Pins, Lockfiles

Scope: applying the same drift-detection pattern to other pin types: container base image digests, pinned GitHub Action SHAs, and dependency lockfiles.

## GitHub Action SHAs: the closest sibling

GitHub documents Dependabot version updates for keeping actions up to date (docs.github.com keeping your actions up to date with Dependabot, weight 0.96). Dependabot's core generates PR descriptions that include the updated dependency's changelogs, release notes, and commits (github.com/dependabot/dependabot-core, weight 0.83). A long-standing feature request documents the interaction with SHA pins: Dependabot already updates SHA-pinned actions with SHAs, and supports a version comment beside the SHA so the human-readable version rides along (github.com/dependabot-core issue 7913, weight 0.47, weak backing).

The relationship between a daily fork drift cron and Dependabot is complementary, not competing: Dependabot produces update PRs for dependencies it understands, while the cron catches drift on pins no tool covers, such as forks pinned to a custom branch. A pin inventory that supports both gets Dependabot PRs for action pins and cron issues for fork pins, and the same verdict vocabulary (synced, minor-lag, drifted) describes both.

## Container base image digests

The containers guidance is unambiguous: pin base images by digest for reproducible builds, because tags are mutable while digests are content addressed, and plan a rebuild cadence because a digest pin does not update itself (Containers SME cookbook, weight 0.54). This is the identical structure to a fork pin: a content-addressed reference into an upstream's history plus a comparison against the upstream's current head.

The difference is the comparison surface. For forks, HEAD comparison runs through the Git compare and commit-list APIs. For images, the check resolves the tag to its current digest in the registry and compares it to the pinned digest; a published pattern implements exactly this as a scheduled check of base image age (stepcodex, weight 0.09, weak backing). Automated update tooling covers the response side for images too: Dependabot and Renovate update pinned base images (oneuptime, weight 0.27, weak backing; tomodahinata Dependabot guides, weights 0.30 and 0.18, weak backing).

## What transfers unchanged

Every pin type reduces to the same trio:

1. A content-addressed pin (Git SHA or registry digest). The mutability argument is the same in both worlds: a tag or branch name can move, a SHA or digest cannot (romainlespinasse, weight 0.65, from the pin-inventory doc of this corpus).
2. An upstream head to compare against (branch HEAD SHA or tag's current digest).
3. A scheduled comparison with a verdict, an alert, and a record.

The verdict vocabulary, the dedup-before-filing rule, the report formats, and the evidence-linking pattern all transfer unchanged. Only the API call that fetches "upstream latest" differs per pin type.

## What does not transfer

- Diff content. A commit range has readable diffs and CVE-bearing commit messages; a digest change is opaque until you pull and inspect. Digest drift therefore leans harder on upstream release notes for triage.
- Commit-count thresholds. Digests have no count; the natural analogue is a time-based threshold (days since the digest changed) or a severity-based one (only alert when the new digest has a known security fix).
- Merge-versus-rebase. There is no merge for an image pin; the update is a pull and a rebuild, and the rollback story is "re-pin the old digest", which is trivially cheap compared to git rollback.

## The generalization the schedule plans

The source schedule's Phase 3 explicitly plans to reuse the same cron pattern for other drift surfaces: base-image digest staleness (the 3-rotation stale-pin incident in PROJECT_RULES), BLOCKERS.md drift versus planning docs, and Linear state versus release tags (source schedule spec, OMN-160). The pattern-level lesson from the siblings above: generalize the cron, the verdict vocabulary, and the report format once, and implement each pin type as a thin adapter that knows how to fetch "upstream latest" for its own reference kind.
