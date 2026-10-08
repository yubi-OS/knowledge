# 07: Parallelization Strategy

**Scope:** Decide what is safe to parallelize, what must be sequential, and what needs coordination, before multiple agents or sessions work the same repo.

## The three-way classification

The source doc (yubi-OS/yubiOS skills/planning-and-task-breakdown/SKILL.md) gives 3 categories for parallel work:

- **Safe to parallelize:** independent feature slices, tests for already-implemented features, documentation.
- **Must be sequential:** database migrations, shared state changes, dependency chains.
- **Needs coordination:** features that share an API contract; define the contract first, then parallelize.

The third category is the load-bearing one. The dependency graph of doc 02 determines which category each task falls into: tasks with no path between them in the graph are safe to run concurrently; tasks on a dependency chain are sequential by definition; tasks sharing an interface are independent only after the interface is frozen.

## Corroboration from agent-orchestration practice

The dig shows the same taxonomy in current agent tooling, mostly with weak backing. Microsoft's Agent Framework documentation describes concurrent orchestration, where multiple agents work in parallel, each processing input independently with results collected and aggregated (https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/concurrent, weight 0.46, weak backing, the strongest dig result here). A practitioner guide on parallel coding agents covers why a single agent session stops being enough and how to run many agents on one repository (https://superset.sh/parallel-coding-agents, weight 0.21, weak backing). An engineering-team blog argues that before running 5 agents at once, a team needs a strategy for the coordination problems (https://blog.codacy.com/does-your-engineering-team-have-a-parallelization-strategy-for-ai-coding-agents-2026, weight 0.22, weak backing).

The failure mode behind the third category is documented in the same weak sources. A note on parallel agents argues that starting implementation before the interface is settled produces parallel work that must all be redone when the decision changes, and that parallelizing should apply to independent slices, not copies of the same work (https://dev.to/qnbs/parallel-agents-need-a-work-topology-not-just-more-copies-27o6, weight 0.18, weak backing). A LinkedIn essay states the rule in compressed form: sequence when you can, parallelize when you must, because if agent B depends on agent A's output, running them in parallel means B guesses and guesses wrong (https://www.linkedin.com/pulse/your-new-agentic-team-experimental-feature-from-alex-ischenko-dhpff, weight 0.13, weak backing). A first-person account claims roughly 40 percent time savings from running multiple agents in parallel on a SaaS build (https://dredyson.com/how-parallel-ai-agents-cut-my-saas-development-time-by-40/, weight 0.25, weak backing); treat the number as anecdote, not measurement.

## How the plan enables safe parallelism

Because the source doc's tasks carry explicit dependency lists (doc 04), parallelism is computable from the plan itself: collect the tasks whose Dependencies field is None or whose dependencies are already complete. This is the same condition the DAG formulation names as "no incoming edges". The vertical slices of doc 03 are also the natural parallel unit, since each slice touches its own schema, API, and UI subset.

What must stay sequential is equally explicit: migrations are ordered against the schema, and shared state changes are excluded from concurrent execution. The plan document is where the parallelization decision gets recorded, per the task list target rules of doc 06.

**Primary sources for this doc:** the source doc. **Weakly backed claims:** concurrent orchestration (0.46), parallel-agent guides (0.21, 0.22), interface-first warnings (0.18, 0.13), and the 40 percent anecdote (0.25), all under 0.5, weak backing.