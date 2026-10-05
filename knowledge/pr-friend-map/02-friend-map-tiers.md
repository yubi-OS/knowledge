# 02 Friend map tiers: organizing communities before outreach

Scope: how to identify and organize friendly communities into priority tiers, where each tier entry carries a first useful contribution, a first narrow ask, and a gate that must pass before the ask is made.

## Stakeholder mapping is the underlying discipline

The friend map is a stakeholder map applied to a pre-launch software campaign. Stakeholder mapping is defined as the process of understanding the key stakeholders relating to a project: the individuals who have an interest in the project outcome (https://communities.sunlightfoundation.com/assets/pdf/stakeholder-mapping.pdf, jev weight 0.5584). Project-management practice extends this into four directional types: upward stakeholders such as sponsors and governance bodies, downward stakeholders such as the project team, outward stakeholders such as clients, regulators, suppliers, and communities, and sideward stakeholders (https://instituteprojectmanagement.com/blog/stakeholder-mapping-the-complete-pm-guide-and-free-template/, jev weight 0.4534, weak backing). The same practice argues that major initiatives, including product launches, require deliberate stakeholder engagement to prevent roadblocks and gain support (https://www.atlassian.com/work-management/project-collaboration/stakeholder-mapping, jev weight 0.3817, weak backing).

For an open source campaign the relevant slice is almost entirely outward stakeholders: the upstream projects, practitioner communities, adjacent operating-system projects, and eventual press. None of them is a sponsor. All of them can redirect, correct, or ignore.

## What developer relations research says about which communities matter

The developer relations field distinguishes its pillars and notes that open source projects specifically prioritize community and advocacy to build a sustainable ecosystem, while early-stage companies lean on enablement and marketing for adoption (https://developerrelations.com/guides/the-four-pillars-of-developer-relations/, jev weight 0.6348). That is a direct argument for the friend-map shape: for a pre-launch open source project, the community pillar comes before the marketing pillar. A second practitioner source reaches the same conclusion, framing developer relations as the function that drives project visibility, contributions, and long-term user retention through community engagement and collaboration (https://dasroot.net/posts/2026/02/developer-relations-building-community/, jev weight 0.6509).

Two weaker sources add texture and should be treated as unverified guidance. A venture field guide describes the founder as community builder wearing four hats early on: evangelist, support lead answering every issue personally, teacher, and writer of documentation as the project's front door (https://www.unusual.vc/field-guide/starting-an-open-source-company-from-project-to-platform-2/, jev weight 0.2800, weak backing). GitHub's own community guide frames developer participation as a journey rather than a destination, requiring continuous engagement (https://github.com/readme/guides/community-engagement, jev weight 0.3552, weak backing).

## The tier structure

The map itself should be a table with one row per community and five columns:

1. Priority tier. Tier 1 communities are the ones whose work the project depends on directly, where a wrong assumption in the project is a bug report for them. Tier 2 communities are adjacent operators who share a threat model or user base. Tier 3 is amplification, meaning press and media, which only becomes relevant after a proof exists.
2. Why they matter. Stated as the technical overlap, not the audience size. A community matters because it can catch a specific class of mistake, not because it is large.
3. First useful contribution. Something the project gives before it asks: testing notes, a reproduction, a docs fix, a board checklist. This is the anti-promotional move; the community-guide principle of continuous engagement argues for contribution-first sequencing (https://github.com/readme/guides/community-engagement, weak backing 0.3552).
4. First ask. One narrow question, phrased so a specific answer is possible. Stakeholder-mapping practice supports planning the engagement per stakeholder rather than blasting a single message (https://www.atlassian.com/work-management/project-collaboration/stakeholder-mapping, weak backing 0.3817).
5. Gate before outreach. The readiness condition that must be true before this row activates: claim hygiene merged, security intake live, evidence page published, or a rehearsal plan for destructive hardware steps.

## Why tiers and gates, not a mailing list

The tier structure exists to prevent two failure modes documented across the sources above. The first is treating every community as an audience, which converts a technical project into promotion; the DevRel pillar analysis puts community ahead of marketing for exactly this reason (https://developerrelations.com/guides/the-four-pillars-of-developer-relations/, weight 0.6348). The second is engaging everywhere at once, which the stakeholder-mapping discipline rejects in favor of mapping who matters and what they need first (https://communities.sunlightfoundation.com/assets/pdf/stakeholder-mapping.pdf, weight 0.5584).

The success signal for the map is conversion quality: reviewers becoming issue authors, testers, or contributors, which developer-relations writing treats as the durable outcome of community work (https://dasroot.net/posts/2026/02/developer-relations-building-community/, weight 0.6509).
