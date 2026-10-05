# 03 - Fork and contributor stewardship: licensing, trademarks, CLA vs DCO

Scope: how projects stay fork-friendly while protecting governance: licensing, trademark policy, and the CLA versus DCO choice.

## The fork right is the floor

A covenant about forks starts from the license: the open-source guarantee that anyone may copy and modify is what makes forks possible at all, and stewardship rules exist to govern conduct within that right, not to eliminate it. The practical tension is between keeping the fork right intact and keeping the project's identity, trademark, and contributor base from being captured.

## Trademark: the control point that survives a fork

The strongest-backed source in this doc is GitHub's Open Casebook treatment of trademarks in open source (weight 0.78). Its key doctrinal point: "naked licensing may result in the trademark's ceasing to function as a symbol of quality and a controlled source," which is why a project that licenses code freely still must police how its name and marks are used, including by forks (weight 0.78: https://google.github.io/opencasebook/trademarks/). A practitioner guide to open-source trademarks resolves the common myth directly: forking the code does not confer the right to use the project's name, so a fork must rename, and the covenant should say so explicitly (weight 0.33, weak backing: https://www.termsfeed.com/blog/open-source-trademark/).

For covenant design this yields a precise rule: the code is forkable, the identity is not. Stewardship rules should define what a fork may call itself, what it may claim about compatibility, and when continued use of project marks becomes a governance conflict.

## CLA versus DCO: the contributor-side control

Contribution agreements are the other stewardship lever, because they determine whether the project or a single entity holds relicense power. FINOS's reference article explains the mechanics: a Contributor License Agreement (CLA) transfers or grants broad rights to the project's steward, while a Developer Certificate of Origin (DCO) is a lightweight sign-off that each contributor certifies origin, leaving copyright distributed (weight 0.89: https://osr.finos.org/docs/bok/artifacts/clas-and-dcos). Opensource.com's comparison makes the governance stakes concrete: a CLA concentrates the ability to relicense or dual-license; a DCO keeps the project's code commons-owned and fork-resistant by construction (weight 0.65: https://opensource.com/article/18/3/cla-vs-dco-whats-difference). eBay's contributor documentation shows the same tradeoff from a corporate participant's view: a CLA documents "that you and eBay have the right to submit the work... and that you permit the third-party project to use your work" (weight 0.55: https://opensource.ebay.com/contributing/cla-or-dco/). A 2026 dispatch on the topic recommends projects choose deliberately and document the choice before contributor volume makes it hard to change (weight 0.62: https://tenthirtyam.org/dispatches/2026/04/08/dco-vs-cla-managing-contribution-agreements-in-open-source/).

A community knowledge base frames the debate as "one of the most actively contested governance questions in open source, touching on corporate control, community trust, contributor friction, and the ability to relicense" (weight 0.25, weak backing: https://github.com/davidru/OSS-Legal-Background/blob/master/knowledge-base/04-contributor-agreements/cla-vs-dco.md).

## What a fork-stewardship clause should say

Synthesis for covenant authors: preserve the fork right in the license, keep copyright distribution friendly to forks (DCO or equivalent) unless there is a stated reason otherwise, define trademark boundaries for forks by name, and treat a fork that holds itself out as the original project, or a contributor agreement change that concentrates relicense power, as covenant conflicts with defined resolution paths.
