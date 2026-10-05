# 03. Open-source governance models and the single-founder gap

Scope: open-source project governance models (BDFL, foundation, vendor-led, community-led, steering committees), what a solo-founder project needs to document before general availability, and how governance transitions away from a single decision authority.

## The recognized model taxonomy

Open-source governance is usually described in terms of a small set of models. A practitioner taxonomy names 4 governance models: BDFL, foundation, vendor-led, and community-led, and connects each to how maintainer handoff works (https://breakpoint.network/blog/open-source-governance-models, jev weight 0.27, weak backing). Red Hat's overview describes the committee-based pattern: project members appoint leadership groups such as a steering committee, committer council, technical operating committee, or architecture council to govern various aspects of a project (https://www.redhat.com/en/blog/understanding-open-source-governance-models, jev weight 0.79).

The BDFL (benevolent dictator for life) model provides decisive leadership but introduces a significant risk as a single point of failure: project progress depends heavily on one individual's availability and wellbeing (https://grokipedia.com/page/Benevolent_dictator_for_life, jev weight 0.08, weak backing). This is exactly the structural risk a single-founder project carries by definition, and the low weight on this source reflects that it is an aggregator page; the underlying risk framing is corroborated by the maturity pattern noted next.

## Governance matures away from one person

Governance in mature projects is rarely concentrated in one person: the original author may still set the tone, but maintainers handle day-to-day direction and owners manage administrative authority (https://nhimg.org/faq/who-is-responsible-for-maintaining-direction-and-governance-in-an-open-source-pr, jev weight 0.21, weak backing). The official open-source guidance makes the documentation point directly: governance is best shaped by the community, and early documentation inevitably contributes to a project's governance, so start writing down what you can (https://opensource.guide/leadership-and-governance, jev weight 0.82).

For a solo project specifically, the guidance is that the answer to "who decides" is you, and writing it down still helps; projects that last are the ones that answered who-decides before the conflict, even if the answer starts as one paragraph (https://openresource.dev/guide/maintaining/governance, jev weight 0.57).

A recent organizational experiment points one direction solo maintainers have taken: maintainers forming co-ops to share funding, burnout, and governance (https://techmeetups.io/news/open-source-maintainer-co-ops-reshaping-sustainability, jev weight 0.09, weak backing). This is weakly backed but shows the transition problem is being addressed structurally, not just informally.

## What this frames for a pre-GA project

For a project that currently has a single founder holding all decision authority, the dig supports naming the gap and documenting around it, not pretending a structure exists:

1. The single-founder authority is the BDFL risk pattern: a single point of failure for both progress and trust-chain decisions (https://grokipedia.com/page/Benevolent_dictator_for_life, jev weight 0.08, weak backing).
2. The committee-based vocabulary (steering committee, committer council, technical operating committee) from Red Hat's overview is the standard menu to grow into (https://www.redhat.com/en/blog/understanding-open-source-governance-models, jev weight 0.79).
3. The immediate, low-cost action is documentation: write down who decides, even before any committee exists (https://openresource.dev/guide/maintaining/governance/, jev weight 0.70; https://opensource.guide/leadership-and-governance/, jev weight 0.90).

Security-specific governance, including the disclosure point of contact and trusted external review for security-critical changes, is covered in doc 04.
