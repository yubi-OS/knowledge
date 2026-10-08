# 01 - Skill Discovery Decision Tree

Scope: how an incoming task is routed to the right skill by development phase and trigger question, per the discovery tree in the source doc.

## Grounding spine

Source doc: `yubi-OS/yubiOS skills/using-agent-skills/SKILL.md`, sections "Overview" and "Skill Discovery".

## The routing idea

The source doc states that Agent Skills is "a collection of engineering workflow skills organized by development phase", and that each skill "encodes a specific process that senior engineers follow" (source doc, Overview). The discovery tree is the routing mechanism: when a task arrives, the agent identifies the development phase the task belongs to and applies the corresponding skill.

This matches the external pattern the dig surfaced. Agent Skills in the broader ecosystem are described as "modular capabilities that extend Claude's functionality", where "each Skill packages instructions, metadata, and optional resources (scripts, templates) that Claude uses automatically when relevant" (https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview, jev weight 0.94). In the Agent SDK, skills are "packaged as SKILL.md files containing instructions, descriptions, and optional supporting resources", and sessions can "dispatch commands by name" and discover authored skills (https://code.claude.com/docs/en/agent-sdk/skills, jev weight 0.90). The yubiOS discovery tree is the phase-organized, hand-authored variant of that mechanism: instead of waiting for keyword overlap, the meta-skill asks a fixed sequence of trigger questions.

## The 12 top-level branches

The tree in the source doc routes on the state of the work, not on the wording of the request. Its top-level branches, quoted from the source doc (Skill Discovery):

1. "Don't know what you want yet?" routes to `interview-me`.
2. "Have a rough concept, need variants?" routes to `idea-refine`.
3. "New project/feature/change?" routes to `spec-driven-development`.
4. "No quality bar written down?" routes to `constraint-driven-development`.
5. "Have a spec, need tasks?" routes to `planning-and-task-breakdown`.
6. "Implementing code?" routes to `incremental-implementation`.
7. "Writing/running tests?" routes to `test-driven-development`.
8. "Something broke?" routes to `debugging-and-error-recovery`.
9. "Reviewing code?" routes to `code-review-and-quality`.
10. "Committing/branching?" routes to `git-workflow-and-versioning`.
11. "CI/CD pipeline work?" routes to `ci-cd-and-automation`.
12. "Deprecating/migrating?" routes to `deprecation-and-migration`.
13. "Writing docs/ADRs?" routes to `documentation-and-adrs`.
14. "Adding logs/metrics/alerts?" routes to `observability-and-instrumentation`.
15. "Deploying/launching?" routes to `shipping-and-launch`.

That is 15 top-level branches. Reading them as a group, they fall into 3 questions the agent answers about the task: what state is the work in (concept, spec, tasks, implementation, tests), what kind of event happened (something broke, something needs review), and what lifecycle activity is next (commit, CI, deprecation, docs, observability, deploy). The branch order is deliberately front-loaded: ambiguity (branch 1) is resolved before anything else, and shipping (branch 15) comes last.

## Sub-branches under implementation

The implementation branch fans out into 5 nested routes (source doc, Skill Discovery):

1. UI work routes to `frontend-ui-engineering`.
2. API work routes to `api-and-interface-design`.
3. "Need better context?" routes to `context-engineering`.
4. "Need doc-verified code?" routes to `source-driven-development`.
5. "Stakes high / unfamiliar code?" routes to `doubt-driven-development`.

The test branch fans out 1 level: "Browser-based?" routes to `browser-testing-with-devtools`. The review branch fans out 3 levels: "Too complex?" routes to `code-simplification`, "Security concerns?" routes to `security-and-hardening`, "Performance concerns?" routes to `performance-optimization`.

The nesting encodes a priority rule: the parent skill is the default for that phase, and the child skill is applied when the task carries an additional property (surface type, context need, stake level, complexity, concern axis). The agent should read the tree top-down and stop at the first branch that matches, then check the children of that branch for a more specific fit.

## Why routing is phase-first

Two of the dig sources describe the same organization from the outside. The addyosmani skills collection, which the yubiOS corpus derives from, says its skills "give agents structured workflows that enforce the same discipline senior engineers bring to production code" and that "each skill encodes hard-won engineering judgment: when to write a spec, what to test, how to review, and when to ship" (https://github.com/addyosmani/agent-skills, jev weight 0.70). That sentence lists exactly the phases the tree covers: spec, test, review, ship. The MIT Sloan framing of agentic AI as "systems that are semi- or fully autonomous and can act on their own" (https://mitsloan.mit.edu/ideas-made-to-matter/agentic-ai-explained, jev weight 0.51, weak backing) explains why the routing must be mechanical: a semi-autonomous agent cannot be relied on to remember which process applies, so the tree makes the choice a lookup rather than a judgment call.

## Practical reading of the tree

Three readings the source doc supports (source doc, Skill Discovery and Skill Rules):

1. The tree is a decision aid, not a gate. Skill rule 1 says "check for an applicable skill before starting work"; the tree is how that check is done.
2. A task can match several branches; rule 3 acknowledges that "multiple skills can apply" and sequences them (doc 05 covers the sequence).
3. The trigger questions are written as states of knowledge ("don't know what you want yet?", "no quality bar written down?"), not as task types. The agent routes on what it knows, not on what the task is called.

## What the tree does not decide

The tree does not order the chosen skills, does not decide between overlapping branches, and does not cover cross-cutting behavior. Ordering is the lifecycle sequence (doc 05), conflicts resolve by phase order, and the always-on behaviors are the core operating behaviors (doc 03). When the request names a trigger without the artifact it acts on, the source doc's boundary rule applies: "route to the owning surface instead of improvising here" (source doc, Examples, boundary case).
