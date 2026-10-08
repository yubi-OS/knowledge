# 04: Task Structure and Acceptance Criteria

**Scope:** Every task carries a standard structure: description, testable acceptance criteria, verification commands, dependencies, files likely touched, and an estimated scope.

## The template

The source doc (yubi-OS/yubiOS skills/planning-and-task-breakdown/SKILL.md) fixes one task template, used whether the task lands in the markdown task list or in an external tracker:

1. **Description:** one paragraph on what the task accomplishes.
2. **Acceptance criteria:** specific, testable conditions as checkboxes.
3. **Verification:** tests pass (the repository's focused-test command), build succeeds (the repository's build command), and a manual check with a description of what to verify.
4. **Dependencies:** the task numbers this depends on, or None.
5. **Files likely touched:** concrete paths.
6. **Estimated scope:** Small (1 to 2 files), Medium (3 to 5 files), or Large (5 or more files).

The template's purpose is verifiability: a task with acceptance criteria can be checked by someone other than its author, and a task without them is one of the red flags the source doc lists ("tasks that say implement the feature without acceptance criteria").

## The wider discipline the template belongs to

The dig corroborates the criteria-first practice, with weakly backed sources. A piece on the INVEST checklist and acceptance criteria argues that well-defined acceptance criteria turn vague feature requests into clear, actionable tasks (https://bvop.org/managers/investacceptance.html, weight 0.29, weak backing). A scrum reference describes INVEST's Small and Testable properties: a story small enough to complete in about 3 to 4 days, and testable rather than vague (https://www.visual-paradigm.com/scrum/write-user-story-smart-goals/, weight 0.21, weak backing). A practical guide on user stories and acceptance criteria covers Given-When-Then templates and review checklists (https://bareadylab.com/blog/user-stories-and-acceptance-criteria-examples, weight 0.22, weak backing).

The verification block also has a sibling concept. A Scrum reference separates Definition of Done, a list of requirements every story must adhere to before the team calls it complete, from acceptance criteria, which are per-story conditions (https://www.visual-paradigm.com/scrum/definition-of-done-vs-acceptance-criteria/, weight 0.20, weak backing). The source doc's See Also section makes the same distinction: acceptance criteria are per-task and answer "did we build the right thing?", while the Definition of Done is the standing project-wide bar (tests pass, no regressions, behavior verified at runtime, docs updated).

## Why commands go in the task, not in memory

The template asks for the repository's actual focused-test and build commands inside each task. Written into the task list, these commands survive session boundaries; the source doc's rationalizations table warns that context windows are finite and written plans survive compaction. A verification step that says "run the tests" without naming the command defers the lookup to a later, weaker moment.

## Checklist when writing a task

1. Can each acceptance criterion be observed as pass or fail?
2. Does verification name the real test and build commands?
3. Are dependencies expressed as task numbers so ordering is checkable?
4. Do the files-likely-touched paths make the scope estimate falsifiable?
5. Is the scope Small or Medium? Large or XL goes back to doc 05 for further breakdown.

**Primary sources for this doc:** the source doc. **Weakly backed claims:** INVEST and acceptance-criteria guidance (weights 0.29, 0.21, 0.25, 0.22) and the DoD versus acceptance criteria distinction (0.20), all under 0.5, weak backing.