# 07: Proof-First Sales Motion

Scope: a staged sales motion where each stage's proof is a precondition for the next, and the role of public proof artifacts (open repos, honest blocker lists, public roadmaps) as the first rung of that ladder.

## The staged motion

A proof-first sales motion inverts the usual sequence. Instead of marketing claims followed by evidence on demand, each sales stage produces a proof artifact that becomes the precondition for the next stage: public proof feeds discovery conversations, discovery feeds a scoped paid pilot, the pilot's measured results feed a case study, and the case study feeds expansion. Nothing is claimed ahead of the evidence that supports it.

The general shape is standard in evidence-driven selling: enterprise credibility is built by making claims verifiable rather than persuasive. Guidance for early-stage companies selling into enterprise security emphasizes that buyers run security questionnaires and procurement reviews precisely to convert vendor claims into reviewable evidence, and that startups survive those reviews by having the artifacts ready rather than improvising them per deal (source: https://www.growthguard.com/blog/enterprise-security-review-evidence-checklist, weight 0.19, weak backing).

## Open source as the proof surface

For an open-source security product, the repo itself is the first proof artifact. A field guide to open source cybersecurity companies argues that building a venture-backed open source security company is, in part, a direct answer to the biggest problem impacting adoption in cybersecurity: the lack of trust. Openness of the product is a trust mechanism; a buyer can inspect the source rather than trust the vendor's description of it (source: https://ventureinsecurity.net/p/investing-in-open-source-cybersecurity, weight 0.53, strong).

That argument scales beyond open source: the open-source software security market reached an estimated USD 5.5 billion in 2025 with projected growth to USD 10.23 billion by 2030 at a 13.20% CAGR, indicating that verifiable, source-available security tooling is a growing commercial category rather than a niche (source: https://www.mordorintelligence.com/industry-reports/open-source-software-security-market, weight 0.60, strong).

The public-proof rung also includes honest negative evidence. Publishing an open blocker list, an explicit boundary between what is proven and what is aspirational, and a roadmap that admits gaps, gives the prospect something the usual sales material cannot: reasons to believe the vendor's positive claims because the vendor does not hide the negative ones. Radical-transparency case studies make the same argument in commercial terms: customers who see the numbers, good and bad, extend trust further than customers who only see the good ones (source: https://www.christinealemany.com/blog/the-case-for-radical-transparency, weight 0.40, weak backing; https://www.insperity.com/blog/radical-transparency/, weight 0.39, weak backing).

## Public roadmaps as a controlled trust signal

The public roadmap is the most studied instance of the pattern. Practitioner guidance frames public roadmaps as giving customers continued confidence in the value being delivered and making them more invested in the product's success (source: https://www.launchnotes.com/blog/should-you-share-your-product-roadmap-publicly, weight 0.30, weak backing). Dedicated analysis of the format identifies the failure modes: a roadmap that overcommits produces vapor, one that undercommits produces indifference, and the useful format scopes items to near-term work with explicit confidence levels (source: https://oamari.com/insights/the-public-roadmap-is-a-trust-signal/, weight 0.23, weak backing). Community-led platforms treat open roadmaps and public changelogs as the baseline infrastructure for trust between the builder and its users (source: https://openroadmap.net/, weight 0.36, weak backing).

For a security product the same mechanics apply with higher stakes: a security vendor's public roadmap that quietly drops promised hardening work is worse than no roadmap, because it documents the gap between claim and delivery.

## Stage by stage

Mapping the motion to a readiness-gate ladder:

1. Public proof (earliest gates): the repo, documentation, and the honest blocker list are the proof surface. A prospect verifies by reading, not by trusting a deck (source: https://ventureinsecurity.net/p/investing-in-open-source-cybersecurity, weight 0.53, strong).
2. Discovery conversations: interviews reference a written evidence boundary, so the prospect knows exactly what is proven versus aspirational at the time of the conversation (source: https://www.growthguard.com/blog/enterprise-security-review-evidence-checklist, weight 0.19, weak backing).
3. Scoped pilot proof: the paid pilot itself becomes the next artifact: a specific customer, a specific platform, measured results against the SOW's criteria, not a generic claim. The pilot gate (security review, pricing validation, platform evidence) must clear before the SOW is signed (source: https://commonpaper.com/standards/pilot-agreement/, weight 0.62, strong).
4. Case study proof: a bounded public case study, scoped to what was actually run, feeds the next prospect's discovery conversation and tightens the evidence available for the next pilot (source: https://salesforceinsider.com/building-credibility-in-the-enterprise-as-an-early-stage-sta, weight 0.33, weak backing).
5. Recurring assurance: once general-availability claims are supportable, recurring assurance (periodic security reviews, incident-response track record, service history) replaces one-off pilot proof as the basis for renewal and expansion.

## Why the motion is gate-compatible

A proof-first motion is exactly a readiness-gate ladder viewed from the buyer's side: each commercial activity the vendor allows itself corresponds to an evidence gate it has cleared. Sales strategy analysis of fast-moving technical markets argues that when technology evolves faster than the sales process, the winning motion is the one that re-grounds its claims continuously rather than scaling a static pitch (source: http://tomtunguz.com/fde-cs/, weight 0.39, weak backing). For a security product, where the buyer's downside of a false claim is a breach, the staged motion is not a marketing preference; it is the only motion whose claims stay true at every stage.
