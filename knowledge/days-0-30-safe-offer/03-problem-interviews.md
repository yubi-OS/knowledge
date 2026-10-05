# Problem Interviews with Technical Buyers

Scope: Customer discovery problem interviews with technical buyers (release engineering, security platform, firmware, regulated-lab operators). Capturing objections, buying triggers, and deployment constraints.

## Why problem interviews come before offer work

For a product that is not yet proven, the interview set is the cheapest available evidence source. Guidance on B2B discovery argues that B2B customer research is harder than consumer research because purchase decisions run through buying groups rather than a single user, so interviews must reach multiple roles to reconstruct how a decision actually gets made ([koji.so, weight 0.34, weak backing](https://www.koji.so/blog/b2b-customer-research-guide-2026)). For security infrastructure, the relevant role set is technical and specific: release engineering, security platform, firmware, and regulated-lab operators, each of which experiences the problem differently and each of which can veto or advance a pilot.

## Interviewing across the buying committee

B2B-specific discovery guidance recommends structuring interviews around buying-committee roles: the engineer who feels the pain, the person who controls budget, and the executive who owns the risk, with triangulation across their answers rather than trust in any single account ([lindeninnovation.com, weight 0.41, weak backing](https://lindeninnovation.com/customer-discovery-interviews-b2b/)). Applied to security infrastructure, this means a problem interview with a firmware operator should be paired, when possible, with a question set for whoever would fund a fix, because the firmware operator's pain and the buyer's willingness to pay are separate facts that must each be observed.

## What to ask

Practitioner guides on discovery interviews converge on the Mom Test principles: ask about past behavior and current workflow rather than hypothetical interest in the product, because predictions about future behavior are unreliable evidence ([productmanagementresources.com, weight 0.45, weak backing](https://productmanagementresources.com/customer-discovery-interviews/)). Concretely for technical buyers, this translates into questions about the last time the problem occurred (what happened, what it cost, who was involved), the current workaround and its cost, and what has already been tried and abandoned. Questions about whether the interviewee would use the proposed product are treated as noise, not signal.

## What to capture

The output of each interview should be sorted into three buckets that feed different downstream artifacts:

1. Recurring objections. Statements about why the proposed approach would not work in the interviewee's environment. These feed the risk-framing work on collateral, because every objection that appears in 2 or more interviews should be answered explicitly in the datasheet or pilot statement of work.
2. Buying triggers. Events that make the interviewee's organization act (an audit, an incident, a platform migration). These feed qualification, because a trigger is a better predictor of a near-term pilot than expressed interest.
3. Deployment constraints. The technical and organizational conditions any pilot must fit (hardware classes, compliance regimes, maintenance windows). These feed the pilot statement of work and the support boundaries.

Structured research practice supports running discovery as a small fixed study (for example 8 to 10 interviews with a defined buyer role) rather than an open-ended stream ([koji.so, weight 0.34, weak backing](https://www.koji.so/blog/b2b-customer-research-guide-2026)). A fixed study with a defined stop condition prevents the common failure mode of interviewing indefinitely while avoiding the offer decision.

## Practical notes for hard-to-reach buyers

Technical operators (firmware engineers, release engineers, regulated-lab staff) are harder to schedule than typical SaaS buyers, and sourcing the interview list is usually a named workstream of its own rather than a side effect. Guidance on enterprise research recommends recruiting through the target role's own channels and running shorter, more technical interviews than consumer-style scripts assume ([lindeninnovation.com, weight 0.41, weak backing](https://lindeninnovation.com/customer-discovery-interviews-b2b/)). A realistic days 0 to 30 pattern: shortlist 20 to 30 candidates across the 4 target roles, book 10 to 15 conversations, and treat the first 3 as script calibration rather than evidence.

## Honest limits of the evidence

The backing for the claims in this doc is predominantly practitioner guidance with weak source weights (0.34 to 0.45), not controlled studies. The claims are directionally consistent across independent sources, but the numbers (buying-group sizes, interview counts) should be treated as heuristics, not measured constants.
