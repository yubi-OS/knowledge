# 08 Launch Discipline

Scope: the cultural layer of the skill: the rationalizations that erode launch discipline, the red flags that mark a launch as unsafe, and the before and after verification checklists.

## The rationalizations

The source doc contains a table of 6 common rationalizations and their reality (source doc, Common Rationalizations). "It works in staging, it'll work in production" is answered by the fact that production has different data, traffic patterns, and edge cases, so monitor after deploy. "We don't need feature flags for this" is answered by: every feature benefits from a kill switch, even simple changes can break things. "Monitoring is overhead" is answered by: without monitoring you discover problems from user complaints instead of dashboards. "We'll add monitoring later" is answered by: add it before launch, you can't debug what you can't see. "Rolling back is admitting failure" is answered by: rolling back is responsible engineering, shipping a broken feature is the failure. "The error rate looks fine, let's keep shipping" is answered by: check the burn rate, not just the current error rate.

The last row is the most technically loaded: it connects the rationalization to a specific mechanism (the burn rate, covered in the error budget doc in this corpus) rather than to a general virtue. Each reality column entry is an operational instruction, not a slogan.

## The red flags

The source doc lists 8 red flags (source doc): deploying without a rollback plan, no monitoring or error reporting in production, big-bang releases with no staging, feature flags with no expiration or owner, no one monitoring the deploy for the first hour, production configuration done by memory instead of code, the Friday-afternoon ship decision, and error budget exhausted while feature work continues unchanged.

The Friday item is the one with external grounding. IanaIO's security blog analyzes Friday deployment security risk and anchors it to a concrete event: on Friday, July 19, 2024, the world witnessed one of the most spectacular IT failures ever seen (https://security.iana.io/blog/fridaydeploymentsecurityrisk, jev 0.58). Weak-backing context: Moravio's piece on why not to deploy on Fridays (https://www.moravio.com/blog/why-you-should-not-deploy-on-friday, jev 0.16, weak backing) and Enov8's deployment nightmares write-up (https://www.enov8.com/blog/deployment-management-nightmares-dont-deploy-friday/, jev 0.17, weak backing) make the same argument with less grounding. The mechanism is staffing, not superstition: a Friday deploy starts a weekend with the fewest responders available, which is why the source doc frames it as a red flag rather than a ban.

## The checklists

The source doc's Verification section splits into a before list and an after list (source doc). Before deploying: the pre-launch checklist is complete with all sections green, a feature flag is configured if applicable, a rollback plan is documented, monitoring dashboards are set up, and the team is notified of the deployment. After deploying: the health check returns 200, error rate is normal, latency is normal, the critical user flow works, logs are flowing, and the rollback is tested or verified ready.

The before list is a compressed restatement of the whole skill: checklist, flags, rollback, monitoring, communication. The after list is the first-hour post-launch verification from the monitoring doc, item for item.

## Postmortem grounding

Google's SRE Workbook documents blameless postmortem culture as the practice of documenting incidents, understanding root causes, and preventing recurrence (https://sre.google/workbook/postmortem-culture/, jev 0.88). This is the learning loop that makes launch discipline durable: the rationalizations table in the source doc reads like the output of postmortems in which each rationalization was said out loud once and cost a team something. Google's original launch coordination checklist (published in the SRE book, circa 2005, slightly abridged) covers architecture, machines and datacenters, volume estimates, capacity and performance, system reliability and failover, and monitoring (https://sre.google/sre-book/launch-checklist/, jev 0.93), and is the oldest widely-cited instance of treating launch readiness as a written, walked document.

## What this doc is for

The discipline layer is what survives when the specific launch changes: the thresholds move per service, the percentages are tunable, but the rationalizations, the red flags, and the 2 checklists are the invariants. A launch that cannot pass the after list is not finished, and a team that finds itself reciting a row from the rationalizations table is not deciding, it is rationalizing.
