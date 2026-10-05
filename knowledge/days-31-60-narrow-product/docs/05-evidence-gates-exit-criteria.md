# 05 - Evidence Gates and Exit Criteria for an MVP

Scope: evidence gates for a minimum viable product, converting phase claims into checkable exit criteria, and the go/no-go decision structure between lifecycle phases.

## What an MVP is for, precisely

The definitional anchor comes from Eric Ries via the primary-adjacent Lean Startup resource: "the minimum viable product is that version of a new product which allows a team to collect the maximum amount of validated learning about customers with the least effort" (weight 0.610, https://leanstartup.co/resources/articles/what-is-an-mvp/). Wikipedia quotes the same definition and adds that its use of maximum and minimum means it is not formulaic and requires judgment (weight 0.583, https://en.wikipedia.org/wiki/Minimum_viable_product). Agile Alliance frames the benefit in time and cost terms: the sooner you learn whether the product appeals to customers, the less effort and expense is spent on a product that will not work (weight 0.572, https://www.agilealliance.org/glossary/mvp/). A product management glossary carries the same Ries definition (weight 0.293, weak, https://www.productboard.com/glossary/minimum-viable-product-mvp/).

The days 31 to 60 source plan (yubiOS refs, `days-31-60-narrow-product-2026-07-25.md`) applies this logic structurally: its exit criteria are not aspirations but checkable statements, each tied to evidence. "B-VM-CTAP2 closed with logged evidence", "physical YubiKey demonstration run and documented (or explicitly still pending, with owner named)", "2 design partners recruited", "priced pilot SOW exists". Each is a gate that either has its evidence or does not.

## The MVP definition forces the gate design

Because the MVP exists to produce validated learning, a phase exit gate should ask: what did this phase learn, and what did the evidence cost? The Ries definition's "maximum learning, least effort" gives two failure modes to gate against: a phase that ships much and learns little (effort without learning), and a phase that produces opinions instead of evidence (learning without validation). The source plan's demonstration section is built against the second mode: it insists the demo be "falsifiable, not a claim", with exact evidence captured per run and limits stated explicitly.

## Go/no-go gates as a mechanism

Go/no-go decision practice provides the mechanism for phase transitions. A go/no-go guide describes criteria, analysis, a decision matrix, and a meeting process as the standard components (weight 0.200, weak, https://incertive.com/blog/complete-guide-go-no-go-decisions). A release focused framework describes a practical go/no-go framework and checklist to standardize release approvals, reduce deployment risk, and accelerate decision making (weight 0.160, weak, https://beefed.ai/en/go-no-go-decision-framework-checklist). A release readiness review guide covers assessing production readiness and evaluating go/no-go criteria in agile environments (weight 0.455, weak, https://www.moubray.com/agile-playbook/release-readiness-review). Software release quality gate practice similarly emphasizes defining clear release criteria and automating checks (weight 0.125, weak, https://developers-heaven.net/blog/quality-gates-and-go-no-go-decisions-in-software-releases/).

All of these are weakly backed per the weighting, but they converge on the same structure, which is itself the finding: a gate is a predefined checklist of criteria evaluated at a fixed decision point, not a judgment call made ad hoc at phase end.

## Kill criteria: the gate's other half

One MVP framework makes the pairing explicit: each phase has a primary deliverable, a go/no-go gate, and kill criteria (weight 0.154, weak, https://jumpgrowth.com/blog/startup-mvp-development-8-week-framework/). A gate without kill criteria is not a gate; it is a milestone celebration. The source plan implicitly carries this: if the exit criteria are not met, days 31 to 60 did not complete, and the days 61 to 90 doc (willingness to pay) inherits an unproven narrow product, which changes what its own gates must test.

## Metrics worth tracking at the gate

MVP metrics guides converge on a small set of evidence types: usage and engagement behavior of early users, retention, and conversion signals that indicate whether the value hypothesis holds. Representative weakly backed sources: top MVP success metrics every founder must track for growth, validation, and decisions (weight 0.153, weak, https://www.creolestudios.com/mvp-success-metrics/); product metrics pre and post MVP with North Star metric selection (weight 0.123, weak, https://evnedev.com/blog/development/product-metrics-premvp-postmvp/); how to plan, measure, and analyze MVP success (weight 0.106, weak, https://www.upsilonit.com/blog/how-to-plan-measure-and-analyze-mvp-success); a beginner's guide to MVP metrics (weight 0.102, weak, https://startup-house.com/blog/mvp-metrics-guide); and an MVP development guide framing 2026 practice as validating ideas quickly with data driven decisions (weight 0.275, weak, https://ripenapps.com/blog/mvp-development-guide/).

For a pilot phase in an infrastructure product, the equivalent metrics are not consumer dashboards but the source plan's checklist: blockers closed with logged evidence, a documented hardware demonstration, partners recruited, and collateral priced. The metric generalization: define the gate as a list of named, verifiable artifacts, because artifact existence is checkable while sentiment is not.

## Rules for phase gates

1. Write exit criteria as checkable statements with named evidence artifacts, in the style of the source plan's exit checklist.
2. Pair every gate with kill criteria; decide in advance what failure means.
3. Keep the MVP definition's trade visible: the phase should buy validated learning at minimum effort, so gate against both effort without learning and opinion without evidence.
4. Evaluate the gate at a fixed decision point using predefined criteria, and record the decision.
