# Owner and deployment target: the first promotion gate

Scope: Requiring every candidate change to name the exact board, VM, workflow, or deployment class it modifies before it can be promoted out of FUTURE.

## Why this gate exists

The promotion gates document (yubiOS refs, roadmap-promotion-gates, 2026-07-17) lists owner/deployment target as the first required field: "Which board, VM, workflow, or deployment class is being changed?" The gate forces a FUTURE item to stop being an idea and become an addressable change with a named surface area. An item that cannot name its target cannot be estimated, tested, or reverted, because there is nothing concrete to estimate, test, or revert.

## Change management tooling enforces the same requirement

Commercial change management systems encode this gate as required form fields. Atlassian's Jira Service Management documents that change request work items carry a default field set, and that for change management deployment pipelines to work, specific fields such as Summary and Description must be required on the Change work type (https://support.atlassian.com/jira-service-management-cloud/docs/default-form-fields-for-change-requests/, jev weight 0.91, authoritative). The principle transfers directly: a change request that cannot state what it changes does not enter the pipeline.

Microsoft's Dynamics 365 engineering change management provides an end to end walkthrough in which a change moves through setup, proposals, change orders, and release to operations, with each step carried by explicit records rather than informal agreement (https://learn.microsoft.com/en-us/dynamics365/supply-chain/engineering-change-management/engineering-scenarios, jev weight 0.58, authoritative). The walkthrough demonstrates the same shape the yubiOS gate asks for: the change has an owner, a concrete artifact lineage, and a named destination.

## Roadmap practice: owners and targets are assigned before implementation

Planning literature consistently places owner assignment before implementation, though most of the sources found for this subtopic are weaker (jev weight below 0.5, weak backing, labeled as such):

- A SharePoint roadmap walkthrough instructs builders to give each item an owner, outcome, phase, status, and target date before using board and calendar views (https://collab365.com/blog/creating-roadmaps-in-sharepoint, jev weight 0.15, weak backing).
- An implementation roadmap template says to assign clear owners for each milestone and decision point and to define success metrics before implementation begins (https://www.sciencedocs.com/wp-content/uploads/2026/05/ScienceDocs_Implementation_Roadmap_Template.pdf, jev weight 0.15, weak backing).
- A PMI style roadmap template description argues the plan is useful only when it produces decisions, removes blockers, and tracks proof for what changed, which requires named phases, workstreams, owners, and cadence (https://nmsconsulting.com/pmi-roadmap-template-phases-workstreams-owners-cadence, jev weight 0.22, weak backing).
- One practitioner essay on AI adoption lists "assign owners before implementation" among the fixes required before scaling pilots (https://julienflorkin.com/ai-automation/when-your-business-is-not-ready-for-ai-yet-and-what-to-fix-first/, jev weight 0.19, weak backing).

These agree with each other even though no single source is strong: owner and target precede implementation.

## How the gate reads in the yubiOS context

For a hardware plus CI project, "deployment class" is the load-bearing half of the gate. The source doc's applications show why: firmware RK tags were promoted only to CI workflow metadata and publish routing, with real board divergent payloads explicitly remaining hardware lane work (yubiOS refs, roadmap-promotion-gates, 2026-07-17). The promotion named the target (CI workflow metadata) and simultaneously fenced off what it did not name (real payloads on boards). Naming the deployment class is therefore not paperwork; it is the mechanism that scopes what the promotion actually authorizes.

An item naming "the boards" is not promoted. An item naming "the rock1 board's UART console path" or "the CI build workflow's image publish step" is, because the change is now falsifiable: someone can check whether the named thing changed, and the recovery question has a concrete subject.

## Failure mode the gate prevents

Without a named deployment target, two failure modes recur. First, an item silently spans several surfaces (a VM change that also touches CI and an installer), and no single owner can recover all of them. Second, an item stays ambiguous long enough that the implementation drifts to whatever surface was convenient, and the evidence collected never matches the claim. The gate converts both into a promotion block rather than a post hoc discovery.
