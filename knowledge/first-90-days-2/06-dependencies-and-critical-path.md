# Dependency mapping and critical path for a 90-day plan

Scope: identifying the highest-leverage blocker, sequencing dependencies, and handling slips.

## Critical path method, briefly

The critical path method (CPM) "calculates the sequence of essential tasks needed to keep your project on track" (weight 0.55, thedigitalprojectmanager.com/project-management/critical-path-method/). Project management tooling guides define it as identifying "the longest sequence of dependent tasks required to complete a project" (weight 0.41, weak backing, projectmanager.com/blog/critical-path-analysis-example-template), and the standard workflow is to "map task dependencies, find the longest path, calculate float, and compress schedules to hit project deadlines" (weight 0.27, weak backing, asana.com/resources/critical-path-method). Float is the key derived quantity: tasks on the critical path have zero float, so any slip on them moves the end date.

For a 90-day venture plan the application is direct: identify the dependency chain whose slip moves the day-90 decision, and treat every item on that chain differently from off-path work. A schedule-quality guide puts the underlying point sharply: "Your project timeline is only as reliable as the logic underneath it" (weight 0.42, weak backing, projectmanagementformula.com/critical-path-schedule/).

## Finding the highest-leverage blocker

Dependency mapping is the discovery pass that feeds CPM. A dependency-mapping guide frames it as "identify risks, visualise task relationships, and optimise workflows" (weight 0.29, weak backing, www.thepmrepo.com/frameworks/dependency-mapping), and a Substack guide emphasizes catching dependencies "Before They Turn Into Blockers" (weight 0.15, weak backing, projectmanagementcompass.substack.com/p/dependency-mapping-guide-identify). A planning-guide variant tells teams to "spot blockers, set the right order, and turn complex work into steady progress" (weight 0.19, weak backing, smarter.day/en/blog/guide-to-task-dependency-mapping).

The highest-leverage blocker is the single dependency that appears on the critical path of the most downstream items. In venture plans this often looks like one technical or legal blocker gating an entire phase: a plan whose paid pilot cannot start until a specific hardware validation closes has exactly this shape. The operational response is to name that blocker explicitly and monitor it at the cadence of the decision it gates, not the cadence of the tasks it blocks.

## Monitoring dependencies in execution

Once mapped, dependencies need standing review rather than one-time analysis. An agile-team guide notes that "daily stand-ups are a great time to monitor blockers and external dependencies" (weight 0.21, weak backing, iamagile.io/blog/dependency-mapping-guide-agile-teams). For a 90-day plan with 30-day decision points, the equivalent is: review the critical-path chain at every decision point, and re-run the mapping whenever a top-priority item changes state.

## Slip handling

Two practices fall out of the CPM material:

1. Re-plan the path, not the whole plan. When a critical-path item slips, float on off-path tasks is unchanged, so the correct response is to reschedule path items and compress where possible (weight 0.27, weak backing, asana.com/resources/critical-path-method), rather than re-baselining the entire plan. Full re-baselining is the heavier intervention covered in doc 08.
2. Keep the dependency logic visible. Because the timeline's reliability derives from the dependency logic (weight 0.42, weak backing, projectmanagementformula.com), the dependency map itself should be a maintained artifact, updated when states change, so downstream decision points read current logic rather than the opening plan.

## Practical takeaways

- Compute the critical path explicitly: the longest dependent chain determines the earliest day-90 decision, and everything else has float (weight 0.55, thedigitalprojectmanager.com; weight 0.41, weak backing, projectmanager.com).
- Name the single highest-leverage blocker explicitly and monitor it at the cadence of the decision it gates (weight 0.29, weak backing, thepmrepo.com).
- Review blockers and external dependencies on a fixed recurring beat (weight 0.21, weak backing, iamagile.io).
- On a slip, reschedule and compress the path first; reserve full re-baselining for assumptions that broke, not single-task delay (weight 0.27, weak backing, asana.com).
