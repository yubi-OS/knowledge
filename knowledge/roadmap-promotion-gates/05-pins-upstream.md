# Pins and upstream sources: what the claim is anchored to

Scope: Declaring which upstream docs, commits, digests, and action SHAs are part of the claim being promoted, so the claim is checkable against its sources.

## The gate question

The promotion gates document (yubiOS refs, roadmap-promotion-gates, 2026-07-17) requires: "Which upstream docs, commits, digests, or action SHAs are part of the claim?" A promoted claim is a claim about something: a documented behavior, a specific upstream revision, a pinned build input. Naming those anchors at promotion time makes the claim falsifiable later, because a reviewer can check whether the anchor still says what the claim says.

## Immutable references are the mechanism

For build inputs, immutability is the whole game. An analysis of Docker registry mechanics states it as a categorical rule: digest pinning is the only mechanism that guarantees exactly what is being built or deployed, which matters for a security audit confirming precisely what code is running, for compliance requirements on reproducible builds, and for eliminating "it worked yesterday" debugging (https://interviewstacks.com/stacks/docker/image-distribution-and-registries/whats-the-difference-between-using-a-tag-and-using-a-digest-for-pinning, jev weight 0.66, authoritative).

For CI, GitHub itself now enforces the practice: the GitHub Actions policy system supports blocking and SHA pinning actions, where the policy checks for a full commit SHA and any workflow that attempts to use an action that is not pinned fails (https://github.blog/changelog/2025-08-15-github-actions-policy-now-supports-blocking-and-sha-pinning-actions/, jev weight 0.95, authoritative). This turns pinning from advice into a gate of its own, at the organization policy level.

Practitioner guides describe the full workflow: pin GitHub Actions from a mutable tag to a commit SHA and keep it safely updated with Dependabot, following official security hardening guidance (https://tomodahinata.com/en/blog/dependabot-github-actions-sha-pinning-supply-chain-security-guide, jev weight 0.62, authoritative), with a comprehensive guide covering the same best practices (https://www.stepsecurity.io/blog/pinning-github-actions-for-enhanced-security-a-complete-guide, jev weight 0.51, authoritative). A checklist format covers lockfiles, hashes, immutable references, CI enforcement, and exception handling (https://devsecopsatlas.com/guides/dependency-pinning-checklist, jev weight 0.45, weak backing).

## Why the anchor list belongs in the claim, not in a build file

The supply chain framing explains the risk of unpinned claims. A supply chain guide argues the attack surface is every external input to the build: a compromised npm package, a hijacked base image tag, a DNS redirect on a download URL, and it cites the 2020 SolarWinds build system compromise, the 2021 ua-parser-js npm compromise, and the 2024 xz-utils backdoor as exploited trust failures (https://earezki.com/books/ship-it-and-sleep/ch4/, jev weight 0.48, weak backing). A broader guide covers SLSA for build integrity, SBOMs for visibility, Sigstore for artifact signing, and dependency pinning for reproducibility as the four addressing controls (https://www.matterai.so/guides/supply-chain-security-slsa-sboms-sigstore-and-dependency-pinning-in-cicd, jev weight 0.31, weak backing).

The promotion gate asks for the anchor list as part of the claim itself, not buried in a lockfile. The difference is auditability of the argument: when the claim says "we rely on upstream behavior X", the gate requires naming the doc, commit, digest, or action SHA where X is observable. If upstream changes, the anchor changes, and the claim's validity can be re checked mechanically.

## Mapping to the source doc

The gate field appears in a corpus about hardware plus CI work, where the natural anchors are:

- Upstream docs: the specification or README the design follows.
- Commits and digests: the exact upstream revision the implementation was built against.
- Action SHAs: the pinned third party CI actions, which GitHub policy can enforce mechanically (https://github.blog/changelog/2025-08-15-github-actions-policy-now-supports-blocking-and-sha-pinning-actions/, jev weight 0.95, authoritative).

## Authoring guidance

Write the pins field as a list of resolvable references, each with the property the claim depends on: "digest sha256:... for the base image the reproducibility claim assumes", "action pinned at <full SHA> for the provenance claim", "upstream doc section for the compatibility claim". A pin without the property it anchors is decoration; the gate is satisfied only when a reader can trace claim to anchor and back.
