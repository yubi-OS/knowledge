# 08 - Operational Readiness for a Paying Pilot

Scope: the operational muscle a paying pilot expects, vulnerability triage intake and severity rubric with a response SLA, release severity gates, escalation paging, backup and restore cadence, and incident communications.

## Five artifacts that do not exist yet

The source plan (yubiOS refs, `days-31-60-narrow-product-2026-07-25.md`) lists five procedures to draft, and states plainly that "none of these five exist yet in the repo as of this draft; treat as new artifacts to create, not existing docs to link": vulnerability triage (intake path, severity rubric, response time SLA per severity), release severity (what blocks a release), escalation (who gets paged for a pilot affecting incident, in what window), backup (what pilot partner state needs backing up, restore test cadence), and incident communications (notification template and channel, plus an internal post incident review step). This doc grounds each in sourced practice.

## Vulnerability triage: intake, rubric, SLA

The strongest sourced anchor is a coordinated vulnerability disclosure program guide: the first step is to create and publish a clear vulnerability disclosure policy, and the VDP should define processes to triage reports, remediate vulnerabilities, assign CVE identifiers, and publish (weight 0.713, https://media.defense.gov/2026/Jul/14/2003961238/-1/-1/0/260714-D-AB123-1001.PDF). That gives the intake path design directly: a published policy, a defined triage process, and a publication step, not an ad hoc inbox.

The severity rubric has standard scaffolding: vulnerability risk triage works in conjunction with scoring methods such as CVSS combined with the organization's own security policies and vulnerability management procedures (weight 0.680, https://sec.cloudapps.cisco.com/security/center/resources/vulnerability_risk_triage.html). CVSS provides the base score; the rubric maps score bands plus exploitability context to internal severity.

The response SLA is measurable and auditable: remediation SLAs are tracked by severity with time to remediate buckets from under 7 days to over 90 days (weight 0.703, https://docs.tenable.com/cyber-exposure-studies/cyber-exposure-insurance/Content/SLARemediation.htm). A worked SOP example structures the same thing as SLA tiers, a RACI, and a worked triage example at CVSS 10.0 (weight 0.196, weak, https://github.com/hamzatazeez-netizen/Vulnerability-management-SOP-with-severity-based-SLA-tiers-RACI-and-a-worked-CVSS-10.0-triage).

## Release severity: what blocks a release

The source plan's rule is mechanical: any BLOCKERS.md row still active for the pilot platform blocks release, and a reclassified out of scope row does not. This is a quality gate in the release management sense: predefined criteria evaluated at a decision point. Release gate practice converges on defining clear release criteria, automating checks, and standardizing approvals to reduce deployment risk (weight 0.160, weak, https://beefed.ai/en/go-no-go-decision-framework-checklist; weight 0.125, weak, https://developers-heaven.net/blog/quality-gates-and-go-no-go-decisions-in-software-releases/). The BLOCKERS.md driven rule is notable for being automatable in principle: a release check script can query the blocker table for open rows scoped to the pilot platform.

## Escalation and paging

For the escalation artifact, incident management practice provides the shape: severity levels, escalation policies, and on call structure are core components of incident management for small teams (weight 0.526, https://incident.io/blog/incident-management-best-practices-2026). A startup oriented incident response template covers runbooks, escalation paths, and on call guidance sized for 10 to 100 engineer teams (weight 0.412, weak, https://theartofcto.com/guides/incident-response-plan-template-runbooks-escalation-oncall). For a team smaller than that, the plan's version is right sized: name the one or two people paged for a pilot affecting incident and the time window, in writing, before the first partner goes live.

## Backup and restore cadence

The plan asks two questions: what pilot partner data or state needs backing up, and what is the restore test cadence. Practice treats these as linked: strong incident response and disaster recovery plans leverage reliable backups and restore testing to recover quickly and minimize downtime (weight 0.282, weak, https://trustnetinc.com/resources/how-to-strengthen-your-incident-response-recovery-plan-a-step-by-step-approach/), and incident response and backup testing are treated together as the resilience pair that reduces downtime (weight 0.240, weak, https://www.sentinelblue.com/incident-response-and-backup-testing/). A backup that has never been restored is an untested claim, so the cadence in the draft artifact should name the restore test itself, not just the backup job.

## Incident communications and the review step

The plan requires a notification template and channel for telling a design partner about an incident, plus an internal post incident review step. The postmortem half has a standard: blameless postmortems are part of mainstream incident management practice (weight 0.526, https://incident.io/blog/incident-management-best-practices-2026). The communications half is exercised, not just written: tabletop exercises exist to find gaps, test communications, and cut downtime (weight 0.163, weak, https://fixmypcstore.com/blog/incident-response-tabletop-exercise-how-smbs-run-it-right). Drafting the template and then never using it until a real incident is the predictable failure; the plan's operational readiness section is the natural place to schedule a first tabletop or simulated partner notification during the pilot window.

## Rules for drafting the five artifacts

1. Publish the intake path as a policy with a defined triage process, severity rubric anchored to CVSS plus org context, and SLA targets per severity that are tracked.
2. Make the release gate mechanical: open blocker rows scoped to the pilot platform block, reclassified rows do not.
3. Name escalation owners and windows in writing before the first partner goes live.
4. Define backup scope for pilot state and a restore test cadence; an unrestored backup is not a backup.
5. Draft the partner notification template and exercise it once (tabletop or simulated notification) inside the window, with a blameless post incident review step behind it.
