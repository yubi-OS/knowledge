# 02-item-2-walk-leg-sign-study

**Scope.** Item 2: walk-leg sign study: detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-walk-leg-verdict-2026-10-17.md.

> Ground source: yubi-OS/yubiOS refs/arr-premap-walk-leg-verdict-2026-10-17.md. External dig queries: audit trail policy version promotion governance; canonical documentation synchronization KV git mirror.

## The question item 2 asks

The ground source (yubi-OS/yubiOS refs/arr-premap-walk-leg-verdict-2026-10-17.md) frames item 2 as a sign study: does the clean gasket read a higher or lower walk exponent than random arrangements, consistently, under a frozen rule with a control? The integration record had already found the sign opposite to the pre-declared assumption (the clean gasket had the lower d_w at N = 366). Item 2 tests that sign properly, with ten random seeds, a hexagonal control, and pre-registration.

## Line 2: N = 366 and N = 1095

Ten random seeds, pre-registered. The gasket sits below every random seed at both sizes, with a median gap of -0.541 at 366 and -0.146 at 1095. The hexagonal control reads 2.995 at N = 366 and 2.373 at N = 1095, against an expected 2.0 plus or minus 0.15. The saturation check fails. Verdict: UNINTERPRETABLE at both sizes.

The control is what makes the verdict. A hexagonal lattice is a regular 2D graph whose walk dimension should be 2.0; reading 2.995 and 2.373 means the estimator is not saturated at these sizes. A sign reading taken from an unsaturated estimator cannot be interpreted, however clean it looks.

## Line 2b: N = 3282

Ten random seeds, hexagonal control, pre-registered. The gasket reads 2.371, the random median 2.263, and the gasket is above 10 of 10 random seeds (sign readings pass, gap +0.109). The hexagonal control reads 2.143, which passes by 0.007 (2.0 plus 0.15 is 2.15). The saturation check fails: the random median gap is 0.108 against a limit of 0.10, and only 4 of 10 seeds are within the limit. Walk seed 7 fails the control; walk seed 1 passes everything. Verdict under the frozen rule: UNINTERPRETABLE.

Note what happened to the sign across sizes: -0.541 at 366, -0.146 at 1095, +0.109 at 3282. The sign flips between 1095 and 3282. That drift is itself evidence of an unsaturated estimator.

## The measurement mismatch

The router's d_w is the 64-walker walk on the mask grid. Both studies used the 4096-walker walk on the points path. The quantity the router clause reads has never been tested. This is the most important line in item 2: even a clean sign result would not have validated the router clause, because the router reads a different estimator.

## Conclusion and routing change

In the tested range the walk leg cannot carry hierarchy evidence. Routing now reads edge-standard D and the traced droplet count only. The walk d_w is diagnostic. A revisit would need a larger N, a saturation-insensitive estimator or a return-probability dimension, under a new pre-registration. None is scheduled.

## Governance of the decision

The dig for this doc targeted audit trails and policy promotion. Generic guidance exists: a guide to AI agent version promotion controls ties promotion to policy enforcement and audit logging, per [AI Agent Version Promotion Controls: Implementation Guide \| Guide \| T...](https://trussed.ai/resources/ai-agent-version-promotion-controls-implementation-guide) (clef weight: 0.0266) (weak backing, clef weight < 0.5); GitOps governance guides cover policy-as-code, approval gates and audit trails, per [GitOps Governance: Policy, Approvals & Compliance Guide (2026)](https://gitopshq.io/learn/gitops-governance-guide) (clef weight: 0.0536) (weak backing, clef weight < 0.5); an article argues that audit logging and policy versioning should sit in one auditable trail, per [Audit logging and policy versioning reshape authorization compliance](https://nhimg.org/articles/audit-logging-and-policy-versioning-reshape-authorization-compliance/) (clef weight: 0.0733) (weak backing, clef weight < 0.5); and Microsoft Purview documents audit-log search, per [Search the audit log \| Microsoft Learn](https://learn.microsoft.com/en-us/purview/audit-search) (clef weight: 0.1309) (weak backing, clef weight < 0.5). All carry weak backing. The record's practice is concrete where those sources are generic: each line was pre-registered before measurement, the verdict follows the frozen rule even when sign readings pass (line 2b), and the routing change that follows is recorded alongside policy v24's audited promotion.

## Mirrors and canonical copies

The second seed query targeted keeping a canonical copy synchronized with a git mirror, which is the subject of item 3 in the same record. A how-to on creating and syncing git mirror repositories is at [Git Mirror Repository: A Complete How-To Guide](https://serverscheduler.com/blog/git-mirror-repository) (clef weight: 0.0231) (weak backing, clef weight < 0.5), a Stack Overflow thread on syncing a mirror is at [synchronization - How to sync a git repo to a mirrored repo - Stack ...](https://stackoverflow.com/questions/48055089/how-to-sync-a-git-repo-to-a-mirrored-repo) (clef weight: 0.0340) (weak backing, clef weight < 0.5), and GitBook documents Git Sync with the repository as source of truth, per [How to sync your entire docs site with a Git repository](https://gitbook.com/docs/guides/editing-and-publishing-documentation/how-to-sync-your-entire-docs-site-with-a-git-repository) (clef weight: 0.0633) (weak backing, clef weight < 0.5). All weak backing. In the record, the direction is the reverse of GitBook's default: the KV copy is canonical and the git mirror follows it.

## Off-topic results

[Audit Trail Launch: Time, Confirmation, Boundary \| LinkedIn](https://www.linkedin.com/posts/lance-taiwhanga-4979192b6_rule-of-3-audittrail-launch-daily-rhythm-activity-7487981153472212992-Nuxj) (clef weight: 0.0215) (weak backing, clef weight < 0.5) is a social media post, [Configuring GPU Passthrough - Canonical OpenStack documentation](https://canonical.com/openstack/docs/latest/how-to/misc/configuring-gpu-passthrough/) (clef weight: 0.0179) (weak backing, clef weight < 0.5) concerns GPU passthrough, and [Trusted open source for enterprises \| Canonical](https://canonical.com/) (clef weight: 0.0282) (weak backing, clef weight < 0.5) is a vendor home page. None carries a claim.

## Reading item 2 correctly

Item 2 does not claim the gasket has a lower or higher walk exponent than random arrangements. It claims that, at N up to 3282 with the 4096-walker points-path estimator, the question cannot be answered, and that the router's own estimator was never measured. The honest outcome is a demotion: d_w goes from routing evidence to diagnostic.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | AI Agent Version Promotion Controls: Implementation Guide \| Guide \| T... | https://trussed.ai/resources/ai-agent-version-promotion-controls-implementation-guide | 0.0266 | weak (< 0.5) |
| 2 | GitOps Governance: Policy, Approvals & Compliance Guide (2026) | https://gitopshq.io/learn/gitops-governance-guide | 0.0536 | weak (< 0.5) |
| 3 | Audit logging and policy versioning reshape authorization compliance | https://nhimg.org/articles/audit-logging-and-policy-versioning-reshape-authorization-compliance/ | 0.0733 | weak (< 0.5) |
| 4 | Search the audit log \| Microsoft Learn | https://learn.microsoft.com/en-us/purview/audit-search | 0.1309 | weak (< 0.5) |
| 5 | Audit Trail Launch: Time, Confirmation, Boundary \| LinkedIn | https://www.linkedin.com/posts/lance-taiwhanga-4979192b6_rule-of-3-audittrail-launch-daily-rhythm-activity-7487981153472212992-Nuxj | 0.0215 | weak (< 0.5) |
| 6 | Git Mirror Repository: A Complete How-To Guide | https://serverscheduler.com/blog/git-mirror-repository | 0.0231 | weak (< 0.5) |
| 7 | Configuring GPU Passthrough - Canonical OpenStack documentation | https://canonical.com/openstack/docs/latest/how-to/misc/configuring-gpu-passthrough/ | 0.0179 | weak (< 0.5) |
| 8 | synchronization - How to sync a git repo to a mirrored repo - Stack ... | https://stackoverflow.com/questions/48055089/how-to-sync-a-git-repo-to-a-mirrored-repo | 0.0340 | weak (< 0.5) |
| 9 | How to sync your entire docs site with a Git repository | https://gitbook.com/docs/guides/editing-and-publishing-documentation/how-to-sync-your-entire-docs-site-with-a-git-repository | 0.0633 | weak (< 0.5) |
| 10 | Trusted open source for enterprises \| Canonical | https://canonical.com/ | 0.0282 | weak (< 0.5) |
