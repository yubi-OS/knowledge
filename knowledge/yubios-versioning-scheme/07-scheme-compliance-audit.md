# 07: Auditing a release history against the codified scheme

Scope: how to verify a live release history actually follows the versioning scheme: tag-to-commit checks, artifact verification, and compliance drift.

## The core audit primitive: tag resolves to the right commit

The smallest unit of scheme compliance is one release: does the tag point at the commit it claims, and do the published artifacts match? GitHub's supply-chain documentation treats release verification as a first-class procedure: validating the authenticity of a release and its assets from the command line, including verifying immutable releases and local artifacts [1] (authoritative, weight 0.93). GitHub's immutable releases concept goes further and generates a release attestation automatically: a cryptographically verifiable record containing the release tag, the commit SHA, and the release assets [2] (authoritative, weight 0.85). That attestation is exactly the shape a scheme audit wants: tag, commit, and artifacts bound together.

Open-source release tooling implements the same check explicitly. One project's publishing pipeline resolves the agent tag to the commit it actually names and refuses to publish if it is not the same commit the application was verified at [3] (authoritative, weight 0.63). A release-tooling how-to verifies downloaded assets against SHA256SUMS and GitHub artifact attestations [4] (authoritative, weight 0.70).

## Extending the audit to the whole history

Per-release checks generalize to a history audit: does every release in the log follow the scheme? A dedicated compliance checker audits each package's release history to find whether it keeps the promise its version numbers make [5] (weak backing, weight 0.26). The semver spec itself is versioned and released the same way it prescribes, with a visible releases page listing tagged releases and changelog links [6] (authoritative, weight 0.72), a small but real example of a project whose release history is itself the compliance record. Automated versioning (semantic-release style) is positioned as a technical control providing an immutable, cryptographically verifiable link between source and deployed artifact [7] (weak backing, weight 0.19).

## What a re-verification round looks like

A scheme compliance audit has three steps: enumerate the live releases from the releases API, check each one's shape against the scheme (format, suffix rules, tag-artifact correspondence), and check the governance invariant (no tag cut by an unauthorized account). The yubiOS decision's own re-verification (2026-09-18, round 8) is a worked example: it read the live releases API, confirmed every release was a SemVer 2.0.0 vMAJOR.MINOR.PATCH tag with the immutable :<sha> OCI pairing intact, confirmed 0.7.x to 0.8.x transitions were MINOR bumps with no breaking change claimed, and confirmed no release tag was cut by any agent account, matching the Jenny-cuts-tags rule.

The same round surfaced what a genuine gap looks like: a visibility gap on one release tag that was confirmed only via compare links, recorded as a tagging-flow gap to look at next release, not a scheme violation. An audit that reports only violations misses this class of finding: the scheme held, but the tagging flow has an observability gap worth fixing.

## Audit cadence

Compliance checking is a recurring activity, not a one-time gate. Release checklist guidance places post-release validation alongside pre-release checks [8] (weak backing, weight 0.39), and audit frameworks treat release management as a process that encompasses planning, scheduling, and implementation controls to be reviewed over time [9] (weak backing, weight 0.29). For a scheme that governs automated agents, a periodic re-verification round after every few releases is the minimum that catches drift before it compounds.

## Application to the yubiOS decision

The yubiOS decision specifies its own post-tag verification as the per-release audit primitive (release object exists, tag resolves to commit, OCI image published, digest matches), and the live re-verification rounds extend it to the full history. The GitHub attestation model above is the direction of travel: tag, commit, and artifacts in one verifiable record, which is where signed UKI provenance and SLSA attestation binding are already heading in the project's pipeline.

## Sources

1. https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/verify-release-artifact-provenance (jev weight 0.93, authoritative)
2. https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases (jev weight 0.85, authoritative)
3. https://github.com/cytechlabs/praxis/blob/main/docs/verify-release-artifacts.md (jev weight 0.63, authoritative)
4. https://jezdez.github.io/conda-ship/how-to/verify-release-artifacts/ (jev weight 0.70, authoritative)
5. https://package-maven.com/semver-compliance (jev weight 0.26, weak)
6. https://github.com/semver/semver/releases (jev weight 0.72, authoritative)
7. https://khimananda.com/blog/semantic-release-automated-versioning (jev weight 0.19, weak)
8. https://testsigma.com/blog/software-release-checklist/ (jev weight 0.39, weak)
9. https://www.theaudit.org/release-management-comprehensive-audit-framework/ (jev weight 0.29, weak)
