# The reference-customer gate

Scope: the reference-customer gate: a continuous production deployment of at least 90 days on real customer hardware, with incident thresholds and a consented reference, used to anchor launch credibility.

## What the gate asserts

A reference-customer gate asserts that a paying customer has run the product in production, on their own hardware, continuously, for at least 90 days. This is the production-proof layer of a launch inventory: it converts engineering gates and a pricing pilot into third-party-verifiable operational evidence. Customer-proof management is itself a recognized discipline: B2B companies use dedicated customer-reference tooling to source, manage, and deploy customer proof across the revenue cycle (w=0.287, weak backing) [https://proofmap.com/insights/reports/customer-reference-software-2026], and vendors maintain customer case-study libraries as standard practice, as AWS and Siemens do (w=0.232, weak backing) [https://aws.amazon.com/solutions/case-studies/] (w=0.457, weak backing) [https://www.siemens.com/en-us/company/software-case-studies/]. A gate formalizes what those libraries assume: the story behind the case study is real, dated, and inspectable.

## The 90-day continuous window

The window length is the gate's core falsifiable number. Enterprise software research supports why a long window matters: a longitudinal case study tracing enterprise software over 5 years, from the initial adoption decision through considerations to retire the system, found that requirements evolve substantially beyond implementation (w=0.870, high backing) [https://link.springer.com/article/10.1057/s41265-016-0001-y] (w=0.841, high backing) [https://journals.sagepub.com/doi/10.1057/s41265-016-0001-y]. A shorter observation window would capture the honeymoon; 90 days of continuous operation captures the post-deployment reality that research shows is where requirements and operational load actually settle (w=0.870, high backing) [https://link.springer.com/article/10.1057/s41265-016-0001-y].

The window is calendar time, not engineering time. That makes it the longest-lead item in any gate inventory: it cannot be compressed by staffing, only by starting earlier. Practice guidance on lead time makes the same point generically: lead time is measured per project and shared openly, and expectations differ per partner (w=0.075, weak backing) [https://community.atlassian.com/forums/App-Central-articles/Customer-Lead-Time/ba-p/2867553].

## Real hardware, not CI

The gate should specify that the deployment runs on the customer's real production hardware, not a CI runner and not a vendor-controlled VM. Enterprise capacity-planning guidance draws the line explicitly: the first deployment journey runs from proof of concept to production, and scaling to production means consolidating and isolating real workloads (w=0.713, high backing) [https://learn.microsoft.com/en-us/fabric/enterprise/capacity-planning-enterprise-managed-self-service-solutions]. A POC or pilot environment proves the software runs; the reference gate is about production operation under the customer's own operational conditions.

Mission-critical continuous operation is the standard the evidence should speak to. A published customer case study on mission-critical client/server implementation frames continuous uptime as the explicit goal for production analytics supporting chemical and pharmaceutical operations (w=0.564, high backing) [https://documents.thermofisher.com/TFS-Assets/CMD/Vector-Information/D19671.pdf]. Uptime practice guidance recommends regular audits of uptime performance to identify vulnerabilities and refine strategies (w=0.215, weak backing) [https://www.deskera.com/blog/uptime/], which is exactly the runlog discipline the gate evidence requires.

## Incident thresholds

The 90-day window carries incident criteria: zero Critical-severity incidents, and a bounded number of High-severity incidents each with a documented remediation that shipped a fix. Severity comes from a defined ladder so the counts are checkable. The runlog evidence pattern is day-by-day: deployment timeline, incident entries with severity and resolution, and remediation links. Defensible evidence-chain documentation requires exactly this: knowing what a defensible record looks like and where trails break (w=0.266, weak backing) [https://www.fieldguide.io/resource-articles/audit-trail-documentation].

## The consented reference

The reference gate differs from the pilot gate in one respect: consent. The customer has agreed to be named in launch collateral and to take reference calls. That consent is a signed artifact with its own evidence trail, covered in the reference-agreement doc. Engagement-lifecycle practice treats this as the normal output of a production engagement: after go-live and handoff, the engagement may have created a stable customer workflow, a reference story, an expansion opportunity, a renewal proof point, or a reusable deployment pattern (w=0.260, weak backing) [https://umbrex.com/resources/the-forward-deployed-engineer-playbook/the-fde-engagement-lifecycle/]. The gate selects the "reference story" output and demands its paperwork.

## Sequencing

The reference-customer gate depends on the pricing-validity gate: the reference relationship starts as the paid pilot and continues. It also depends on the engineering gates being green, since a 90-day window on unstable software produces incident counts, not references. Because the window is calendar-bound, the sequencing rule for launch planners is mechanical: the pilot must start at least 90 days before the reference evidence is needed, and any launch-target slip moves the reference date with it.
