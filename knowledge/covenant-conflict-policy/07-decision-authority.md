# 07 - Who decides: authority models and escalation when commitments collide

Scope: maintainer authority models (BDFL, foundation, vendor-led, community-led), escalation paths, and honest single-maintainer reality.

## The mainstream authority models

The strongest-backed overview is Red Hat's explainer of open-source governance models: projects operate by "rules, customs, and processes that determine which contributors have the authority to perform certain tasks," and knowing those rules determines whether contributions succeed (weight 0.61: https://www.redhat.com/en/blog/understanding-open-source-governance-models). GitHub's official open-source guides cover the same ground from the practitioner side: formal roles, when to grant commit access, and the common governance structures, with the explicit point that governance docs are needed when a project launches, not after conflict (weight 0.60: https://opensource.guide/leadership-and-governance/).

The four-way taxonomy recurs across sources: BDFL (a single decisive maintainer), foundation-governed (authority vested in a neutral legal entity), vendor-led (a company controls direction), and community-led (meritocratic councils). A 2026 survey maps all four and how each affects maintainer handoff (weight 0.24, weak backing: https://breakpoint.network/blog/open-source-governance-models). A plain-language guide adds the important nuance that most real projects layer several models at once, applying the right one per decision class (weight 0.29, weak backing: https://allthingsopen.org/articles/open-source-governance-models-plain-language-guide).

## Foundation governance in practice

The Eclipse Foundation handbook shows the most formalized end: projects transition through a sponsored process with defined development-continuation and community-growth obligations, meaning authority is bounded by published rules rather than personal discretion (weight 0.85: https://www.eclipse.org/projects/handbook/). GraphQL's governance page shows the migration path: a project open-sourced by a single company in 2015 became neutrally governed under the Linux Foundation in 2019 (weight 0.84: https://graphql.org/community/contribute/governance/). Both are precedents a single-maintainer project can cite when authority must eventually scale beyond one person.

## Escalation when commitments collide

Escalation design follows from the model chosen. Where authority is personal (BDFL), escalation terminates with the maintainer; the governance literature treats this as legitimate but fragile, since the single point of decision is also a single point of failure. A 2026 interview with MariaDB's cofounders makes the constructive version of the point: "a healthy open source project should make it possible for a capable contributor to understand what responsibilities exist, what standards are expected, how decisions are made, and what it takes to progress" (weight 0.42, weak backing: https://www.odbms.org/blog/2026/10/influence-is-not-ownership-anna-widenius-and-kaj-arno-on-governance-open-source-and-the-future-of-mariadb/). A governance-models guide aimed at scaling projects frames escalation paths as a first-class artifact, not an afterthought (weight 0.15, weak backing: https://opensources.live/governance-models-for-open-source-projects-choosing-what-sca).

## The honest single-maintainer state

For a project whose public org chart lists a single founder-lead, the honest policy is to record exactly that: trust-chain and security conflicts resolve against the mission document and covenant directly, commercial conflicts against the covenant's commercial clauses, and a flagged conflict blocks merge until the role-holder resolves it. The policy should state that this describes the current state and is revisited when the org grows, rather than inventing a governance board that does not exist.
