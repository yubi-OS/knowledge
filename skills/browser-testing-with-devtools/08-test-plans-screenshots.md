# 08 - Test Plans and Screenshot-Based Verification

Scope: the skill's structured test plan format for complex UI bugs and the 5-step screenshot verification loop for visual regression.

Grounding spine: source doc yubi-OS/yubiOS skills/browser-testing-with-devtools/SKILL.md (the "Writing Test Plans for Complex UI Bugs" and "Screenshot-Based Verification" sections).

## Why complex bugs need a written plan

The skill's three workflows (docs 05 through 07) cover single-cause bugs. For complex UI issues, the skill prescribes writing a structured test plan the agent can follow in the browser, before touching the page (source doc). The rationale is determinism: an agent executing an improvised browser session cannot be audited, while an agent executing a written plan can be checked step by step against expected results.

## The plan format

The skill's example plan ("Task completion animation bug") has three sections (source doc):

**Setup.** Precondition state, stated as concrete steps: navigate to `http://localhost:3000/tasks`, ensure at least 3 tasks exist.

**Steps.** Each step is a user action followed by three check classes:

1. Click the checkbox on the first task.
   - Expected: strikethrough animation, task moves to the completed section.
   - Check: console should have no errors.
   - Check: network should show `PATCH /api/tasks/:id` with `{ status: "completed" }`.
2. Click undo within 3 seconds.
   - Expected: task returns to the active list with a reverse animation.
   - Check: console clean; network shows `PATCH /api/tasks/:id` with `{ status: "pending" }`.
3. Rapidly toggle the same task 5 times.
   - Expected: no visual glitches, final state consistent.
   - Check: no console errors, no duplicate network requests.
   - Check: DOM shows exactly one instance of the task.

The check classes are the notable design decision: every behavioral step is verified on three channels at once, visual (expected), console (clean), and network (correct request and payload). This mirrors the tool composition in doc 02 and is what lets an agent self-verify each step rather than deferring judgment to a human.

**Verification.** A closing checklist: all steps completed without console errors; network requests correct and not duplicated; visual state matches expected behavior; accessibility: task status changes are announced to screen readers (source doc).

The rapid-toggle step is a stress case that pure unit tests would miss: idempotency under rapid user input, duplicate request suppression, and single-instance DOM invariants are browser-runtime properties. External UI-testing checklists make the same argument at survey level (https://www.browserstack.com/guide/ui-testing-checklist, jev weight 0.16, weak backing).

## Screenshot-based verification

For visual regression, the skill prescribes a minimal loop (source doc):

1. Take a "before" screenshot.
2. Make the code change.
3. Reload the page.
4. Take an "after" screenshot.
5. Compare: does the change look correct?

The skill names the change classes where this is most valuable: CSS changes (layout, spacing, colors), responsive design at different viewport sizes, loading states and transitions, and empty states and error states (source doc). The common factor is that all four are properties the DOM does not encode: computed layout, viewport-dependent rendering, time-dependent states, and data-dependent states. Unit tests cannot see them; screenshots can.

Mainstream visual-regression tooling formalizes the same loop into automated pixel comparison; Vitest's browser-mode visual regression testing is the strongest-weighted example in this run (https://main.vitest.dev/guide/browser/visual-regression-testing, jev weight 0.45, weak backing). The skill's loop is the manual, in-session version of that discipline, suited to a change-by-change workflow rather than a suite.

## How this doc connects to the others

- The plan's per-step network checks are the network workflow's analyze checks (doc 06) applied as acceptance criteria.
- The "console should have no errors" checks instantiate the clean console standard (doc 09).
- The closing accessibility item (screen reader announcements) points at the accessibility verification procedure (doc 09).
- The before/after screenshot loop is the verify step of the UI bug workflow (doc 05), extracted into its own reusable discipline.

## Sources for this doc

- Source doc: yubi-OS/yubiOS skills/browser-testing-with-devtools/SKILL.md (primary source of record).
- https://main.vitest.dev/guide/browser/visual-regression-testing (jev 0.45, weak backing)
- https://www.browserstack.com/guide/ui-testing-checklist (jev 0.16, weak backing)
- https://pxshot.dev/blog/visual-regression-testing-screenshot-comparison/ (jev 0.12, weak backing)
- https://www.screensnap.pro/blog/visual-regression-testing (jev 0.11, weak backing)
- https://www.testrail.com/blog/create-a-test-plan/ (jev 0.10, weak backing)
