# 02: Dependency Graph and Ordering

**Scope:** Map what depends on what, from the database schema up to the UI, and order implementation bottom-up so foundations are built first.

## The dependency graph as a planning artifact

The source doc (yubi-OS/yubiOS skills/planning-and-task-breakdown/SKILL.md) sketches a canonical stack dependency tree: the database schema feeds the API models and types, which feed the API endpoints, which feed the frontend API client, which feeds the UI components; the API models also feed validation logic, and the schema also feeds seed data and migrations. The planning step is to draw this map for the actual feature before any task is written.

The ordering rule follows directly: implementation order follows the dependency graph bottom-up, foundations first. Schema before models, models before endpoints, endpoints before the client that calls them.

## General formulation: the plan as a DAG

Practitioner sources converge on the same formalization. A dependency-aware planning writeup describes a task dependency graph as a directed acyclic graph where each node is a task and each directed edge means "this must complete before that can start"; tasks with no incoming edges are immediately executable (https://notes.muthu.co/2026/03/dependency-aware-task-scheduling-how-agents-execute-plans-as-parallel-dags/, weight 0.29, weak backing). A software-factory blog gives the same shape with the parallelism consequence: a dependency DAG maps task order and parallelism so no task runs before its prerequisites (https://peterscheffer.com/blog/2026/07/what-is-a-dependency-directed-acyclic-graph-in-a-software-factory/, weight 0.27, weak backing). Both are weakly backed but consistent with the source doc's bottom-up rule.

The mechanics of producing a valid order are standard. A Stack Overflow answer on ordering tasks with dependencies walks the classic procedure: compile each task's constraints into single-direction dependencies, build the graph, then perform a topological ordering (https://stackoverflow.com/questions/48489995/algorithm-to-order-tasks-with-dependencies, weight 0.16, weak backing). For parallel-computing contexts, a taskflow paper's keyword set names the same instrument, a task dependency graph, as the basis for scheduling (https://taskflow.github.io/taskflow/icpads20.pdf, weight 0.33, weak backing), and the Berkeley Pattern Language documents a Task Graph structural pattern addressing the overall organization of a program before any specific implementation (https://patterns.eecs.berkeley.edu/?page_id=609, weight 0.41, weak backing).

## Two concrete implementations of the same idea

Two open-source agent skills found in the dig encode the source doc's practice in executable form. One manages a large-scale software engineering project as a versioned, ordered, dependency-aware task plan executed one sprint at a time through a backlog to in-progress to blocked to done state machine (https://github.com/avatsaev/av-swe-skill, weight 0.41, weak backing). Another turns product specs, acceptance criteria, and architecture notes into ordered engineering work in a tasks.md with optional tasks.json (https://github.com/jovd83/implementation-task-planner, weight 0.32, weak backing). They are evidence the dependency-ordered plan is a working pattern in agent workflows, not just a diagram.

## What the source doc adds that the general literature does not

The generic DAG advice says order exists; the source doc says what the nodes of a feature plan usually are and in which direction the arrows point: data layer at the bottom, UI at the top, seed data and migrations as a second child of the schema. It also ties ordering to the checkpoint discipline (every task leaves the system in a working state), so the ordered plan is executable slice by slice rather than only correct on paper.

**Primary sources for this doc:** the source doc. **Weakly backed claims:** the DAG formulations and the topological-ordering procedure from the dig results listed above (weights 0.16 to 0.41, all under 0.5, weak backing).