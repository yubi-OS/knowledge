# 05: Task Sizing and Scope Estimation

**Scope:** Size tasks XS through XL by files touched and scope; break down anything L or larger; recognize the signals that a task is still too big.

## The sizing table

The source doc (yubi-OS/yubiOS skills/planning-and-task-breakdown/SKILL.md) defines a five-level scale by files touched:

| Size | Files | Scope | Example |
|------|-------|-------|---------|
| XS | 1 | Single function or config change | Add a validation rule |
| S | 1 to 2 | One component or endpoint | Add a new API endpoint |
| M | 3 to 5 | One feature slice | User registration flow |
| L | 5 to 8 | Multi-component feature | Search with filtering and pagination |
| XL | 8 or more | Too large, break it down further | none |

Two rules attach to the table: if a task is L or larger it should be broken into smaller tasks, and an agent performs best on S and M tasks.

## When to break a task down further

The source doc gives four independent triggers, any one of which is enough:

1. It would take more than one focused session, roughly 2 or more hours of agent work.
2. You cannot describe the acceptance criteria in 3 or fewer bullet points.
3. It touches 2 or more independent subsystems, for example auth and billing.
4. You find yourself writing "and" in the task title, a sign it is two tasks.

The first trigger is the agent-specific one. Sizing by hours rather than story points is honest for agent work because a session boundary is the real unit of reliability: a task that does not fit a session must either be split or carried across a checkpoint.

## Corroboration from estimation practice

The dig backs the small-work principle from several traditions, all weakly backed here. An engineering-capability writeup on working in small batches cites queueing theory and software delivery research: large batches take longer to complete, longer to review, longer to test, and longer to get feedback on (https://www.raganmcgill.co.uk/c4e/capability/working-in-small-batches, weight 0.27, weak backing). A t-shirt sizing guide confirms the XS through XL scale is a recognized agile estimation method using clothing sizes instead of numbers (https://daily.dev/blog/t-shirt-sizing-in-agile-guide-2024/, weight 0.21, weak backing). A project-management breakdown guide frames the process as dividing a project into smaller components until every piece is specific enough to estimate, assign, and track, the formal version being a work breakdown structure (https://ticnote.com/en/blog/task-breakdown-project-management, weight 0.24, weak backing). Another guide with templates walks decomposing large tasks into bite-sized pieces (https://thedigitalprojectmanager.com/productivity/how-to-break-down-tasks/, weight 0.38, weak backing), and a WBS-for-agile piece notes that breaking epics into features makes estimation feel more manageable (https://miro.com/project-management/work-breakdown-structure-agile/, weight 0.23, weak backing).

The dig also shows how noisy unfiltered search is on this topic: several top results for "task sizing" were a television series, which the weighting correctly scored near 0. The lesson for future digs is that the query must carry the engineering context.

## How sizing interacts with the rest of the skill

Sizing is the bridge between vertical slicing (doc 03) and task ordering (doc 06): slices are cut until they fit S or M, and the checkpoint cadence then assumes each task leaves a working system. The verification checklist requires that no task touches more than about 5 files, which is the M boundary made absolute.

**Primary sources for this doc:** the source doc. **Weakly backed claims:** small-batch delivery research (0.27), the t-shirt sizing convention (0.21), and the WBS breakdown guides (0.24, 0.38, 0.23), all under 0.5, weak backing.