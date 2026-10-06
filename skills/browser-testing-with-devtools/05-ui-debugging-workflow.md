# 05 - The DevTools Debugging Workflow for UI Bugs

Scope: the skill's 5-step method for UI bugs (reproduce, inspect, diagnose, fix, verify) and the tool calls inside each step.

Grounding spine: source doc yubi-OS/yubiOS skills/browser-testing-with-devtools/SKILL.md (the "For UI Bugs" workflow).

## The 5 steps

The skill encodes UI bug debugging as a fixed sequence. Each step has defined actions and defined tools (source doc):

1. **REPRODUCE.** Navigate to the page, trigger the bug, and take a screenshot to confirm the visual state. Reproduction ends with evidence, not with a feeling: the screenshot is the record that the bug exists and what it looked like before any fix attempt.
2. **INSPECT.** Four parallel reads: check the console for errors or warnings, inspect the DOM element in question, read computed styles, and check the accessibility tree. This is a pure-observation step; no tool in it can change the page.
3. **DIAGNOSE.** Compare actual against expected: actual DOM vs expected structure, actual styles vs expected styles, whether the right data is reaching the component. The step ends by naming the layer that owns the bug: HTML, CSS, JavaScript, or data.
4. **FIX.** Implement the fix in source code. Notably, the fix step happens outside the browser: DevTools diagnosed, the editor repairs.
5. **VERIFY.** Reload the page, take a screenshot and compare with the Step 1 screenshot, confirm the console is clean, and run automated tests. Verification re-uses the same instruments that captured the bug, which is what makes before/after comparison meaningful.

The order is load-bearing. Diagnosing before reproducing risks fixing a bug that does not occur; fixing before diagnosing is the "changed something and it got better" anti-pattern; verifying with the console un-checked misses regressions that only surface as warnings.

## Why the diagnose step names a layer

The skill forces the diagnosis to terminate in one of four layers (HTML, CSS, JS, data) because each layer has a different repair surface. A missing element is a rendering or data problem; a present-but-invisible element is usually CSS; an element with wrong content at the wrong time is usually JavaScript or the data pipeline feeding it. The comparison pairs in step 3 map directly onto that decision: DOM-vs-expected resolves structure questions, styles-vs-expected resolves presentation questions, and the data check resolves pipeline questions (source doc).

External debugging guides describe the same shape, reproduce then isolate then confirm, though with less structure (https://crosscheck.cloud/blogs/how-to-debug-web-application-step-by-step/, jev weight 0.12, weak backing; https://www.w3docs.com/learn-javascript/dom-debugging-and-tools, jev weight 0.12, weak backing). Root-cause-analysis writeups emphasize the same terminate-in-a-named-cause discipline (https://bugpilot.io/2026/06/06/deep-dive-root-cause-analysis-complex-bug-investigation-guide/, jev weight 0.10, weak backing). These are weak backing only; the workflow's authority in this corpus is the source doc.

## The provenance note

An interesting dig result: the upstream mirror of this exact skill file exists in the public addyosmani/agent-skills repository (https://github.com/addyosmani/agent-skills/blob/main/skills/browser-testing-with-devtools/SKILL.md, jev weight 0.24, weak backing). The yubiOS copy under yubi-OS/yubiOS is the source of record for this corpus, but the workflow itself is shared practice across agent-skill collections, which is consistent with the skill's positioning as a general browser-testing discipline rather than a yubiOS-specific one (the source doc's own environment note says yubiOS itself has no browser UI in scope).

## Verification closes the loop on itself

The step 5 checklist re-uses step 1's screenshot as its baseline. That reuse is the skill's answer to a specific failure mode listed in doc 10: shipping UI changes without viewing them in a browser (source doc). A change that passes unit tests can still fail step 5, because unit tests do not exercise layout, styling, or real browser rendering. The skill's rationalizations table makes this exact claim: "The DOM must be correct if the tests pass" is rejected with the reality that unit tests do not test CSS, layout, or real browser rendering; DevTools does (source doc).

## Relationship to the other workflows

The UI bug workflow is one of three workflows in the skill, alongside network debugging (doc 06) and performance profiling (doc 07). They share a skeleton: capture state, analyze with the appropriate observer, fix in source, re-capture and compare. The difference is the instrument and the comparison target: screenshots for visual bugs, network captures for API bugs, performance traces for timing bugs (source doc).

## Sources for this doc

- Source doc: yubi-OS/yubiOS skills/browser-testing-with-devtools/SKILL.md (primary source of record).
- https://github.com/addyosmani/agent-skills/blob/main/skills/browser-testing-with-devtools/SKILL.md (jev 0.24, weak backing)
- https://crosscheck.cloud/blogs/how-to-debug-web-application-step-by-step/ (jev 0.12, weak backing)
- https://www.w3docs.com/learn-javascript/dom-debugging-and-tools (jev 0.12, weak backing)
- https://www.w3reference.com/blog/best-practices-for-debugging-javascript-code-in-the-browser/ (jev 0.12, weak backing)
- https://bugpilot.io/2026/06/06/deep-dive-root-cause-analysis-complex-bug-investigation-guide/ (jev 0.10, weak backing)
