# 01 Readiness gates: what must be true before any friend-making starts

Scope: pre-launch readiness assessment and claim hygiene for a proof-first, build-in-public campaign. This doc defines the gates a project should satisfy before contacting any community or press: honest wording, a working security intake, and an evidence page a reviewer can cite.

## Build in public is a visibility practice, and visibility has failure modes

Build in public is commonly defined as making the work of building a product visible to an audience as it happens: shipping commits, sharing decisions, posting milestones, exposing the messy middle (https://www.buildinpublic.so/blog/build-in-public, jev weight 0.2696, weak backing). A community guide describes a phased approach to the same practice: establish a foundation first, then grow an engaged audience, then share progress (https://github.com/buildinginpublic/buildinpublic, jev weight 0.3443, weak backing). Both sources agree on one point that matters for a pre-launch campaign: the sharing comes after the foundation, not instead of it.

A practitioner account of building an open source project in public makes the sharpest observation for gate-setting: discussions, failed attempts, trade-offs, and architectural decisions often remain invisible even though they are technically public (https://luigitesch.io/2026/05/22/build-in-public-in-an-open-source-project/, jev weight 0.6017). Technically public is not the same as findable, citable, or honest. That is the gap a readiness gate closes: a reviewer arriving at the project should find the blockers, the limits, and the evidence without having to dig through scattered chat.

## Claim hygiene is the first gate

Claim hygiene, meaning every public claim carries its sourcing and its limits, is practiced as formal engineering process in some projects. One open source library maintains an architecture decision record titled "claim hygiene and sourcing" that requires sources for claims and warns automatically on missing sourcing directives (https://github.com/arvindiyu/SecureAICodeLibrary/blob/main/docs/adr/0004-claim-hygiene-and-sourcing.md, jev weight 0.3165, weak backing). The specific rules of that project are not general standards, but the existence of the pattern is the point: a project can make honest claims a checkable property rather than a vibe.

For a pre-launch campaign the concrete application is a README sweep. Third-party README advice consistently frames the README as the front door a reviewer reads before anything else (https://gingiris.github.io/growth-tools/blog/2026/04/02/github-readme-template-guide/, jev weight 0.1807, weak backing). The readiness move is to qualify every strong phrase in that front door: anything that reads as "production", "at every layer", or "sole root" should either carry a citation to a reproduced artifact or be reworded to "experimental" and "technical preview" until it does.

## Evidence-backed releases are the pattern to copy

An example of the gate passed: Microsoft introduced the Agent Governance Toolkit as an open source runtime security project released under the MIT license, with the announcement grounded in what the infrastructure does and does not cover rather than ambition (https://opensource.microsoft.com/blog/2026/04/02/introducing-the-agent-governance-toolkit-open-source-runtime-security-for-ai-agents/, jev weight 0.8268). The release is legible because claims and code shipped together.

The trust-building mechanism has independent support from a large established project. OpenSearch describes building community trust partly by holding twice-monthly community meetings where interested people present what they are building and how they use the project (https://opensearch.org/blog/trust-in-open-source-software/, jev weight 0.6408). Regular, structured visibility of real work is the trust engine, not announcements.

## The gate list

Before any outreach touch, the following should hold:

1. Public claims are qualified and sourced, with "groundwork", "experimental", and "technical preview" language until evidence exists (pattern per https://github.com/arvindiyu/SecureAICodeLibrary/blob/main/docs/adr/0004-claim-hygiene-and-sourcing.md, weak backing 0.3165).
2. A security reporting path exists so sensitive reports avoid public issue threads. The README is the surface reviewers hit first, and template guidance treats it as the primary first impression (https://gingiris.github.io/growth-tools/blog/2026/04/02/github-readme-template-guide/, weak backing 0.1807).
3. A single citable evidence page exists, so that trade-offs and limits are findable rather than merely technically public (the invisibility problem is documented in https://luigitesch.io/2026/05/22/build-in-public-in-an-open-source-project/, weight 0.6017).
4. New artifacts ship with their claims, the way an evidence-grounded open source release does (https://opensource.microsoft.com/blog/2026/04/02/introducing-the-agent-governance-toolkit-open-source-runtime-security-for-ai-agents/, weight 0.8268).

The success signal is negative-space: when reviewers arrive after the gates, they spend their attention on the technical assumptions instead of correcting overclaims. Fewer corrections needed is the measurable outcome of passing this gate.
