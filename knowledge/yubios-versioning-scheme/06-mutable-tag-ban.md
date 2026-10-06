# 06: Forbidden tag patterns: the mutable-tag ban

Scope: why mutable tags (latest, branch tags, partial versions) are banned from CI inputs and what to use instead.

## Mutable tags are the default failure mode

Registry documentation is blunt about tag mutability. Amazon ECR documents image tag mutability as a repository-level setting, with a Mutable option chosen when you want image tags to be overwritten, and an Immutable option that disables tag updates [1] (authoritative, weight 0.95). Docker's CLI documents that `docker image tag` simply creates a tag pointing at an existing image, nothing pins the target [2] (authoritative, weight 0.90). Overwriting is the default everywhere: pushing an image with an existing tag replaces what that tag points at, and Docker Hub and most registries permit this by default, so latest is the obvious case and version tags are equally mutable [3] (authoritative, weight 0.69).

Docker's hardened-image documentation frames immutability as a supply-chain security posture: mutable systems are harder to secure and audit [4] (authoritative, weight 0.81).

## The concrete risks

Unpinned mutable tags create unpredictable deployments where the actual container image can change over time without explicit updates, and mutable tags can pull different content between two runs of the same workflow [5] (weak backing, weight 0.52). Release-integrity guidance makes the audit point: when teams reuse mutable tags such as latest, prod, or stable, the same label can point to different binaries over time, which makes incident analysis ambiguous [6] (weak backing, weight 0.05). The practitioner fix is consistent: pin manifests to specific digests or unique per-build references, and never deploy mutable tags like :latest to production [7] (weak backing, weight 0.07).

## Why the ban belongs in the versioning scheme, not just ops hygiene

A versioning scheme that permits floating tags in CI reopens the exact ambiguity the immutable SHA tags exist to close. A GitHub community discussion on immutable image tags notes the counterpoint fairly: not all tags are suitable as immutable, and a publisher may release to multiple registries where some lack immutability support [8] (weak backing, weight 0.10). The resolution for an OS project is a scope rule rather than a universal ban: immutable references are required wherever the reference is consumed as evidence (CI inputs, workflow definitions, verification, attestations), while human-facing convenience surfaces can keep a floating pointer.

CI/CD tag-and-digest guidance recommends pinning deployments to immutable image references and understanding the difference between tags and digests [9] (weak backing, weight 0.16). Digest pinning is the strongest form: a manifest digest cannot be overwritten by any push.

## The three forbidden patterns in one place

The yubiOS decision (refs/yubios-versioning-scheme-2026-08-04) bans three families, all for the same mutability-or-validity reason. First, :latest in any CI input or workflow definition (the mutable-tag ban; :latest is permitted only in user-facing install commands). Second, floating branch tags such as :main or :feat-something, which are mutable by construction since the branch head moves. Third, partial version tags like :v0 or :v0.7 without the patch component, which fail SemVer 2.0.0's three-number requirement for a release tag. A fourth, cross-cutting rule: never tag a commit that has not passed the engineering gate floor, applied per tag.

The registry documentation above backs the first two bans directly; the partial-version ban comes from the SemVer grammar itself (see doc 01).

## Sources

1. https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html (jev weight 0.95, authoritative)
2. https://docs.docker.com/reference/cli/docker/image/tag (jev weight 0.90, authoritative)
3. https://safeguard.sh/resources/blog/a-tag-is-not-a-version (jev weight 0.69, authoritative)
4. https://docs.docker.com/dhi/explore/security-concepts/immutability/ (jev weight 0.81, authoritative)
5. https://www.sourcery.ai/vulnerabilities/docker-unpinned-image-tags (jev weight 0.52, authoritative)
6. https://nhimg.org/faq/how-should-security-teams-implement-docker-image-tagging-in-cicd-to-avoid-release-integrity-gaps (jev weight 0.05, weak)
7. https://khimananda.com/blog/docker-image-tagging-strategies (jev weight 0.07, weak)
8. https://github.com/orgs/community/discussions/181783 (jev weight 0.10, weak)
9. https://learn.programmingline.com/learn/cicd/cicd-image-tags-versions (jev weight 0.16, weak)
