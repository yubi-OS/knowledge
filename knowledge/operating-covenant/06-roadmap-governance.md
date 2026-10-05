# 06. Roadmap governance

Scope: public, ADR-driven architecture decisions as the governance mechanism; commercial signal as legitimate input and commercial gating of trust-chain work as the forbidden outcome.

## ADRs as the public decision record

An architecture decision record captures an important architectural decision together with its context and consequences; the accompanying "architecture decision" is the software design choice that addresses a significant requirement [1] (weight 0.70). The ADR practice library frames the value in covenant terms: ADRs provide an open and transparent decision history, and AWS prescriptive guidance recommends them to streamline technical decisions [2] (weight 0.84). Undocumented decisions produce the opposite: "archaeology code" that nobody dares change because the reasoning is lost [3] (weight 0.16, weak backing).

The timing rule matters as much as the artifact. A covenant commits to publishing the ADR when the decision is made, not retroactively, so the community can contest a decision while it is still live. ADRs recorded after the fact are history; ADRs recorded before landing are governance.

## Governance models and vendor capture

Comparative treatments of open-source governance models evaluate projects along decision authority, contributor influence, escalation paths, release control, succession, and sustainability risk [4] (weight 0.17, weak backing). Case studies of the Linux Foundation and PostgreSQL describe governance mechanics designed to prevent vendor control, walking through fork creation and fork viability as the ultimate check on capture [5] (weight 0.11, weak backing). The failure mode is documented in the wild: a report on a NASA open-source project described it being slowed by its commercial vendor, illustrating how commercial control of process can strangle community direction [6] (weight 0.17, weak backing).

## Commercial signal vs commercial gating

Customer demand is real signal and a covenant should not pretend otherwise. The line a covenant draws is specific:

- **Allowed:** commercial input informs scheduling of non-trust-chain work. Paying customers get priority on features that sit around the core.
- **Forbidden:** commercial input buys priority or veto on trust-chain design. The mechanisms that establish and verify trust change only through the public ADR process, at the same speed for everyone.

The open-source program handbook published by the OSPO Alliance bundles licensing, best practices, training, and ecosystem engagement guidance for exactly this reason: program design should anticipate the interaction between community governance and commercial engagement [7] (weight 0.70).

## How to write the rule so it survives

Three properties make a roadmap-governance clause durable:

1. **Venue rule:** trust-chain architecture decisions go through the named public process (ADR index) before landing, never silently in a PR description or private channel.
2. **Speed rule:** the ADR process has no commercial fast lane; a paying customer can fund work, not reorder the trust chain.
3. **Record rule:** decisions are published with rationale and sources at decision time, and the record is append-only.

## Caveats

The ADR literature is strongly backed (upstream repositories and the practice library). The governance-model comparisons, the NASA report, and the vendor-control case studies are weakly backed and labeled as such; they support the pattern, not specific project facts.

## Sources considered

| # | Source | Weight |
|---|---|---|
| 1 | https://github.com/architecture-decision-record/architecture-decision-record | 0.70 |
| 2 | https://adr.github.io/ | 0.84 |
| 3 | https://topictrick.com/blog/architecture-decision-records-adr | 0.16 |
| 4 | https://www.fosshub.com/resources/community/governance/ | 0.17 |
| 5 | https://www.softwareseni.com/open-source-governance-models-how-linux-foundation-and-postgresql-prevent-vendor-control/ | 0.11 |
| 6 | http://www.h-online.com/open/news/item/Report-NASA-open-source-project-slowed-by-commercial-vendor-1777755.html/from/related | 0.17 |
| 7 | https://ospo-alliance.org/docs/ggi_handbook_v1.3.pdf | 0.70 |
| 8 | https://open-awesome.com/projects/architecture-decision-record | 0.08 |
| 9 | https://jonathanj.in/kele.el/references/adrs/ | 0.30 |
| 10 | https://smartkeys.org/open-source-strategy/ | 0.21 |
| 11 | https://en.wikipedia.org/wiki/Architecture | 0.67 |
| 12 | https://en.wikipedia.org/wiki/Supply_chain_management | 0.37 |
