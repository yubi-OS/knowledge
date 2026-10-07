# 08 Verification and Rationalizations

**Scope line:** how the skill closes the loop: the post-build verification checklist, the red-flags list that catches drift, and the rationalizations table that answers the excuses before they are made.

**Grounding spine:** `yubi-OS/yubiOS skills/frontend-ui-engineering/SKILL.md` (source doc). Dig backing: axe-core and Deque tools (weights 0.65 to 0.89), React code-review checklists (weights 0.17 to 0.19, weak).

## The verification checklist

After building UI, the skill requires 7 checks (source doc):

1. Component renders without console errors.
2. All interactive elements are keyboard accessible (Tab through the page).
3. The screen reader can convey the page's content and structure.
4. Responsive: works at 320px, 768px, 1024px, 1440px.
5. Loading, error, and empty states all handled.
6. Follows the project's design system (spacing, colors, typography).
7. No accessibility warnings in dev tools or axe-core.

(source doc). The checklist is not aspirational; it is the closure of the skill's own rules. Items 2 and 3 close doc 05 (keyboard and screen reader), item 4 closes doc 06 (the 4 test widths verbatim), item 5 closes docs 02 and 07 (the state machine and loading), and item 6 closes doc 04 (design system adherence). A UI that skips the checklist has not run the skill; it has only written code in its vocabulary.

## axe-core: the named automated check

Item 7 names axe-core explicitly. axe-core is an accessibility testing engine for websites and other HTML-based UIs, described by its maintainers as fast, secure, lightweight, and built to integrate with any existing test environment so accessibility checks can be automated (https://github.com/dequelabs/axe-core, weight 0.89). Deque's commercial tooling, Axe DevTools, is powered by that same axe-core engine and extends it with guided testing (https://www.deque.com/axe/devtools/web-accessibility/, weight 0.75; https://www.deque.com/axe/devtools/, weight 0.65).

The checklist's phrasing, "no accessibility warnings in dev tools or axe-core," covers both integration paths: browser devtools integrations and test-suite integration (source doc). Practitioner writeups of axe-core in React testing workflows describe the same integration shape: run the engine in Jest component tests or in CI (https://oneuptime.com/blog/post/2026-01-15-test-react-accessibility-axe-core/view, weight 0.17, weak backing).

Automated checks have a boundary the skill respects by pairing them with manual ones: axe-core catches rule violations it has rules for, but "the screen reader can convey the page's content and structure" (item 3) and "Tab through the page" (item 2) are human checks (source doc). A passing axe run does not substitute for tabbing.

## Red flags

The skill's red-flags list is the drift detector for everything the checklist cannot see (source doc):

- Components with more than 200 lines (split them).
- Inline styles or arbitrary pixel values.
- Missing error states, loading states, or empty states.
- No keyboard navigation testing.
- Color as the sole indicator of state (red/green without text or icons).
- The generic "AI look" (purple gradients, oversized cards, stock layouts).

(source doc). Each flag maps to a doc in this corpus: the 200-line limit and the state-machine flags to doc 02, the inline-style and color flags to doc 04, the keyboard flag to doc 05, and the AI look to doc 04. The list is written as observations about code, which makes it usable in code review without interpretation: a reviewer can grep for inline styles, count component lines, and check for the 3 states.

Third-party React code-review checklists cover overlapping ground (hooks rules, state handling, accessibility in review), which corroborates that these are reviewable code properties rather than taste (https://kodus.io/en/react-code-review-checklist/, weight 0.17, weak backing; https://devcom.com/tech-blog/react-code-review/, weight 0.19, weak backing). Weak weights recorded honestly: the corpus's red-flags list is the source doc's own.

## Common rationalizations

The skill ends with a table that answers the 5 excuses that predictably appear (source doc):

| Rationalization | Reality |
|---|---|
| "Accessibility is a nice-to-have" | It's a legal requirement in many jurisdictions and an engineering quality standard. |
| "We'll make it responsive later" | Retrofitting responsive design is 3x harder than building it from the start. |
| "The design isn't final, so I'll skip styling" | Use the design system defaults. Unstyled UI creates a broken first impression for reviewers. |
| "This is just a prototype" | Prototypes become production code. Build the foundation right. |
| "The AI aesthetic is fine for now" | It signals low quality. Use the project's actual design system from the start. |

(source doc). The table's structure is the skill's argument strategy: it does not argue taste, it argues cost and consequence. The accessibility line grounds the standard externally (legal requirement), the responsive line prices the deferral (3x), and the prototype line names the lifecycle fact that prototypes ship. The "3x" figure is the source doc's own claim, not a measured industry benchmark; the corpus records it as stated doctrine.

## How to use this doc

- Before marking UI work done: run the 7-item checklist in order (source doc).
- During review: scan the 6 red flags; each is mechanically checkable (source doc).
- When an excuse appears in conversation: answer it with the table row instead of re-arguing (source doc).

## Sources

- yubi-OS/yubiOS skills/frontend-ui-engineering/SKILL.md (source doc, primary source of record)
- https://github.com/dequelabs/axe-core (weight 0.89)
- https://www.deque.com/axe/devtools/web-accessibility/ (weight 0.75)
- https://www.deque.com/axe/devtools/ (weight 0.65)
- https://devcom.com/tech-blog/react-code-review/ (weight 0.19, weak)
- https://kodus.io/en/react-code-review-checklist/ (weight 0.17, weak)
- https://oneuptime.com/blog/post/2026-01-15-test-react-accessibility-axe-core/view (weight 0.17, weak)
