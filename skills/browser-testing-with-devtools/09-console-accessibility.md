# 09 - Console Analysis and Accessibility Verification

Scope: reading the console by level with the clean-console standard, and the 5-check accessibility verification procedure.

Grounding spine: source doc yubi-OS/yubiOS skills/browser-testing-with-devtools/SKILL.md (the "Console Analysis Patterns" and "Accessibility Verification with DevTools" sections).

## Reading the console by level

The skill structures console output as three levels, each with its own diagnostic map (source doc):

**ERROR level** has four cause classes:

- Uncaught exceptions: a bug in code.
- Failed network requests: an API or CORS issue.
- React/Vue warnings: component issues.
- Security warnings: CSP violations, mixed content.

**WARN level** has three:

- Deprecation warnings: future compatibility issues.
- Performance warnings: potential bottlenecks.
- Accessibility warnings: a11y issues.

**LOG level** is one class: debug output, used to verify application state and flow.

The mapping matters because it turns console reading from triage into diagnosis: an error already carries a hypothesis about which layer owns it. The console is the first read in the inspect step of the UI workflow (doc 05) precisely because it is the cheapest instrument that yields a cause class rather than a raw symptom.

## The clean console standard

The skill sets an absolute bar: a production-quality page should have zero console errors and warnings, and if the console is not clean, fix the warnings before shipping (source doc). The rationalizations table backs this with "Console warnings are fine" answered by "Warnings become errors. Clean consoles catch bugs early." (source doc). The red flags list includes "Console errors ignored as 'known issues'" (source doc).

Chrome's own Lighthouse best-practices audit makes the same demand mechanically: "Browser errors were logged to the console" is a failed audit condition, and the audit exists because console errors indicate broken or unreliable behavior users may experience (https://developer.chrome.com/docs/lighthouse/best-practices/errors-in-console/, jev weight 0.86). Microsoft's Edge console documentation covers the fix-JavaScript-errors workflow the standard implies (https://learn.microsoft.com/en-us/microsoft-edge/devtools/console/console-debug-javascript, jev weight 0.42, weak backing).

## The accessibility procedure

The skill's accessibility verification is 5 ordered checks (source doc):

1. **Read the accessibility tree.** Confirm all interactive elements have accessible names. The accessibility tree is what assistive technology consumes; it is the browser's answer to "what does this page say to a screen reader", and it can diverge from the DOM in both directions.
2. **Check heading hierarchy.** h1 through h2 through h3, no skipped levels. Skipped heading levels are the canonical structural a11y defect. The W3C WAI headings tutorial defines the expected hierarchy semantics (https://www.w3.org/WAI/tutorials/page-structure/headings/, jev weight 0.33, weak backing).
3. **Check focus order.** Tab through the page and verify the sequence is logical. The WCAG success criterion behind this is 2.4.3 Focus Order, whose W3C understanding document defines the requirement that focus order preserve meaning and operability (https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html, jev weight 0.78).
4. **Check color contrast.** Verify text meets a 4.5:1 minimum ratio (source doc). The 4.5:1 figure is the WCAG 2.x AA threshold for normal-size text.
5. **Check dynamic content.** Verify ARIA live regions announce changes. Static pages can pass every other check while dynamically inserted content stays invisible to screen readers without a live region.

The contrast check is the one item the DevTools tool table (doc 02) cannot observe directly through the accessibility tree; it is verified by inspecting computed styles (color, background) and computing the ratio, which is why the skill pairs the two capabilities.

The accessibility tool row in doc 02 gives this procedure its instrument: the accessibility tree read is check 1, and the remaining four checks are performed against the tree and the DOM the tree was derived from. The test-plan format in doc 08 shows where the results land in practice: its verification checklist ends with "Accessibility: task status changes are announced to screen readers" (source doc), which is check 5 applied to a concrete feature.

## Why a11y is in the default verification set

The skill's post-change verification checklist (doc 10) includes "Accessibility tree shows correct structure and labels" as a standard gate for any browser-facing change, not as an opt-in deep audit (source doc). The red flags list reinforces this with "Accessibility tree never inspected" as a listed failure state. The design position is that a11y verification is cheap when the tool is already in the agent's hand: the same snapshot that verifies DOM structure also answers the accessible-name question.

## Sources for this doc

- Source doc: yubi-OS/yubiOS skills/browser-testing-with-devtools/SKILL.md (primary source of record).
- https://developer.chrome.com/docs/lighthouse/best-practices/errors-in-console/ (jev 0.86)
- https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html (jev 0.78)
- https://learn.microsoft.com/en-us/microsoft-edge/devtools/console/console-debug-javascript (jev 0.42, weak backing)
- https://www.w3.org/WAI/tutorials/page-structure/headings/ (jev 0.33, weak backing)
- https://shotmark.dev/blog/error-monitoring/browser-console-errors-explained-with-fixes (jev 0.13, weak backing)
