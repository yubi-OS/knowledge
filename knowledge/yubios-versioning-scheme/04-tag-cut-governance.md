# 04: Who may cut a release tag, and the checklists around it

Scope: release authority (who is allowed to cut tags), the pre-tag checklist, and post-tag verification.

## Release authority as a governance control

Release branch governance is defined as the policy and control layer that determines who may modify, approve, merge, tag, or promote code on release branches, and under what conditions [1] (weak backing, weight 0.13). GitHub-side controls back this up: repository permission settings exist specifically to grant or restrict Git operations by security group [2] (authoritative, weight 0.67), and guidance on securing release tags describes defining who can create, move, or delete release tags, then testing CI identities to prevent silent retags, as the mechanism that protects artifact trust [3] (weak backing, weight 0.26). GitHub's own platform has a gap here: workflows have no single specific write permission for creating tags or releases, so the restriction is achieved through protected tags and rulesets rather than one granular grant [4] (weak backing, weight 0.33).

The structural point: an agent, bot, or CI identity should be able to propose a tag cut and prepare everything leading up to it, while the actual cut is a human-held authority. This treats a release tag as a commercial signal to external observers that a specific build is the current production target, which is exactly the framing that makes agent-cut tags undesirable even when technically possible.

## The pre-tag checklist

Release-checklist literature converges on the same gate families: quality and conformance testing, changelog and version verification, dependency and security review, build artifact validation, and rollback preparation [5] (weak backing, weight 0.17), with release gates evaluated per item as required capabilities for a trustworthy pipeline [6] (weak backing, weight 0.16). A published release playbook for a small engineering org lists a pre-release sequence that runs the full test and validation suite before tagging [7] (weak backing, weight 0.22). Broader guides add scope verification, evidence, operational ownership, security review, communication, and rollback before authorizing a release [8] (weak backing, weight 0.17).

The yubiOS decision instantiates this as a 6-item pre-tag checklist owned by the agent before any tag cut is proposed: all engineering gates E-1 through E-11 PASS at the candidate commit, the CHANGELOG is updated with the release body, PINNED.md is in lockstep with the candidate commit with no stale digests, the planning doc's last-reviewed date is within the past 7 days, the dev image has been pulled and smoke-tested, and any release branch is rebased on main with CI green.

## Post-tag verification

After a tag exists, verify that the published state matches the intended one. GitHub documents release verification as an integrity check: validating the authenticity of a release and its assets from the command line [9] (authoritative, weight 0.93; detailed further in doc 07). The yubiOS decision's post-tag steps are the same discipline at the tag level: confirm the release object exists via the releases API, confirm the tag resolves to the expected commit, and confirm the OCI image reference is published and its digest matches the commit's published digest.

## Application to the yubiOS decision

The yubiOS decision assigns tag cutting exclusively to Jenny, per the standing rule that agents never merge to main, never force-push, and never cut release tags. The agent's role is bounded to proposing cuts and preparing the PRs that lead up to them. This is the weakest-dig doc in the corpus: the governance claims above carry mostly weak backing because formal "who may tag" literature is thin, and the decision's specific checklist comes from the project's own gate inventory rather than public sources.

## Sources

1. https://nhimg.org/glossary/release-branch-governance/ (jev weight 0.13, weak)
2. https://learn.microsoft.com/en-us/azure/devops/repos/git/set-git-repository-permissions (jev weight 0.67, authoritative)
3. https://www.ugrabyte.com/post/github-ruleset-release-tags-ci (jev weight 0.26, weak)
4. https://github.com/orgs/community/discussions/68252 (jev weight 0.33, weak)
5. https://blog.arezgit.com/articles/complete-pre-release-checklist (jev weight 0.18, weak)
6. https://rahulkantjha.com/insights/release-gate-checklist/ (jev weight 0.16, weak)
7. https://github.com/okf-memory/okf-agent-memory/blob/main/docs/RELEASE_PLAYBOOK.md (jev weight 0.22, weak)
8. https://kiolo.com/en/blog/software-release-readiness-checklist/ (jev weight 0.17, weak)
9. https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/verify-release-artifact-provenance (jev weight 0.93, authoritative)
