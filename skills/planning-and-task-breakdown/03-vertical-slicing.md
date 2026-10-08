# 03: Vertical Slicing

**Scope:** Slice work vertically: one complete feature path (schema plus API plus UI) at a time, instead of building all of one layer then all of the next.

## The source doc's contrast

The source doc (yubi-OS/yubiOS skills/planning-and-task-breakdown/SKILL.md) defines the anti-pattern and the fix with parallel task lists. Bad, horizontal slicing: Task 1 builds the entire database schema, Task 2 all API endpoints, Task 3 all UI components, Task 4 connects everything. Good, vertical slicing: Task 1 is "User can create an account" covering registration schema, API, and UI; Task 2 is "User can log in"; Task 3 is "User can create a task"; Task 4 is "User can view task list". The stated payoff is that each vertical slice delivers working, testable functionality.

Note the axis of decomposition changed: slices are cut by user capability, not by technical layer. The dependency graph from doc 02 still governs ordering inside each slice; slicing decides what a task bundles.

## Outside corroboration

The same contrast exists in the broader software literature, though most of the corroboration found here is weakly backed. The vertical slice architecture article describes a system organized around features instead of technical layers, with all the files for a feature grouped together (https://milanjovanovic.tech/blog/vertical-slice-architecture, weight 0.44, weak backing, the strongest dig result for this subtopic). An Optivem Journal piece frames the same comparison as horizontal concentric architectures versus vertical slice architecture (https://journal.optivem.com/p/horizontal-architecture-vs-vertical-architecture, weight 0.20, weak backing).

The walking-skeleton tradition gives the historical footing. A lean and agile blog credits the term to Alistair Cockburn: create a small implementation of the system that performs a small end-to-end function, and slice user stories vertically (https://luuduong.com/, weight 0.30, weak backing). A Maven course by Matt Wynne and Steve Tooke on slicing user stories for agile teams targets exactly the failure the source doc names, stories too big to move (https://maven.com/levain/slicing-user-stories-for-agile-teams, weight 0.30, weak backing).

## Why the agent context makes slicing matter more

The source doc's sizing guidance says an agent performs best on S and M tasks. Horizontal slicing tends to produce exactly the oversized tasks this warns against: "build all API endpoints" is a bundle of many independent capabilities in one task, with no testable midpoint until the integration task at the end. Vertical slicing converts the same work into tasks where acceptance criteria can be checked by exercising a user flow, which also makes the verification steps of the task template (doc 04) meaningful.

## Practical rules carried forward

1. Name each slice after a user capability, not a layer ("user can log in", not "auth module").
2. Each slice includes its own schema, API, and UI changes, so it is end-to-end.
3. A slice must leave the system in a working state; that is also the checkpoint rule of doc 06.
4. Slices that share an API contract need the contract defined first; that boundary belongs to the parallelization rules of doc 07.

**Primary sources for this doc:** the source doc. **Weakly backed claims:** the vertical slice architecture description (0.44), the walking skeleton attribution (0.30), the story-slicing course (0.30), and the architecture comparison (0.20), all under 0.5, weak backing.